// sow_boar_gilt_feeds.js

// June 19, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {calculateNumDaysSinceInsem,
        calculateDateExpectedWean}  from '../../common/page_view_basic.js';
        

import {PROD_STATUS,
        DEFAULT_FEED_UNIT_WEIGHT}       from '../../../constants.js';

import {
    MAX_NUM_MONTHS_FEED_PROJECTION,
    getEveryFirstDayOfMonth}            from './feed_estimate_basic.js' 



let DEFAULT_KG_PER_PIG_GESTATING        = 50;
let DEFAULT_KG_PER_PIG_LACTATING        = 50;
let DEFAULT_KG_PER_PIG_FINISHER         = 50;


const MAX_DAYS_OFFSET_BUY_LACTA_THIS_MONTH = 3;


// This is the default feed budget for lactating sow and piglets
let DEFAULT_KG_FEED_LACTATING   = 150;


// Average daily consumption per pig (kg per day)
const DAILY_CONSUMPTION = {
    gestating: 2.0       // this maybe refined later on
};




export function SowFeeds(data_sow){
    const thisObj               = this;
    
    let dataSow             = data_sow;
    

    /**
     * Check if expected date of birth requires lactating feed computation
     * for the given month.
     * 
     * Logic:
     * - If expected birth is in the current month (cur_date's month) → TRUE
     * - If expected birth is in the next month but within first 3 days → TRUE (preparation)
     * - If expected birth is already past → FALSE
     * - If expected birth is beyond next month's cutoff → FALSE
     * 
     * Example 1:
     * today            = '2026-06-15'
     * cur_date         = '2026-07-01'
     * date_expected   = '2026-06-20' 
     * is_to_compute    = false (already past)
     * 
     * Example 2:
     * today            = '2026-06-19'
     * cur_date         = '2026-07-01'
     * date_expected   = '2026-07-01' to '2026-07-03' 
     * is_to_compute    = false (birth is within first 3 days of July, 
     *                    but this should have been budgeted in June)
     * 
     * Example 3:
     * today            = '2026-06-15'
     * cur_date         = '2026-07-01'
     * date_expected   = '2026-07-04' to '2026-07-31'
     * is_to_compute    = true (birth in current month, beyond preparation window)
     * 
     * Example 4:
     * today            = '2026-06-15'
     * cur_date         = '2026-07-01'
     * date_expected   = '2026-08-01' to '2026-08-03'
     * is_to_compute    = true (birth in next month, within preparation window)
     * 
     * Example 5:
     * today            = '2026-06-15'
     * cur_date         = '2026-07-01'
     * date_expected   = '2026-08-04' or later
     * is_to_compute    = false (beyond next month's cutoff)
     * 
     * @param {string} cur_date - Date string in 'YYYY-MM-DD' format
     * @param {string} date_expected - Date string in 'YYYY-MM-DD' format
     * @returns {boolean} - True if lactating feed should be computed for this month
     */
    this._isToComputeLactaFeeds = function(cur_date, date_expected){
        
        // Parse dates
        const curDateObj = new Date(cur_date);
        const expectedBirthObj = new Date(date_expected);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Get the month and year of cur_date
        const curMonth = curDateObj.getMonth();
        const curYear = curDateObj.getFullYear();
        
        // Get the month and year of date_expected
        const birthMonth = expectedBirthObj.getMonth();
        const birthYear = expectedBirthObj.getFullYear();
        
        // Case 1: Expected birth is before cur_date (already past)
        if (expectedBirthObj < curDateObj) {
            return false;
        }
        
        // Case 2: Expected birth is within cur_date's month
        if (birthYear === curYear && birthMonth === curMonth) {
            // Check if birth is within the first MAX_DAYS_OFFSET days of the month
            // If so, it should have been budgeted in the previous month
            const dayOfMonth = expectedBirthObj.getDate();
            if (dayOfMonth <= MAX_DAYS_OFFSET_BUY_LACTA_THIS_MONTH) {
                return false; // Already budgeted in previous month
            }
            return true;
        }
        
        // Case 3: Expected birth is in the next month
        if (birthYear === curYear && birthMonth === curMonth + 1) {
            // Check if birth is within the first MAX_DAYS_OFFSET days of next month
            const dayOfMonth = expectedBirthObj.getDate();
            if (dayOfMonth <= MAX_DAYS_OFFSET_BUY_LACTA_THIS_MONTH) {
                return true; // Need to prepare this month
            }
            return false;
        }
        
        // Case 4: Expected birth is beyond next month
        return false;
    }
    
    
    // Will return production entry for a given farm_sow_id
    // if is_gesta_or_lacta == true, will search in gestating, else in lactating
    this._getDataProductionEntry = function(farm_sow_id, is_gesta_or_lacta){
        let data_list = null;
        
        if (is_gesta_or_lacta == true){
            data_list = navigation.pigFarm.managerPigProd.dataGestatingList;
        }
        else{
            data_list = navigation.pigFarm.managerPigProd.dataLactatingList;
        }
    
        if (!data_list || data_list.length == 0){return null;}
        
        for (const cur_entry of data_list){
            if (cur_entry.pig_production.sow){
                if (cur_entry.pig_production.sow.farm_sow_id == farm_sow_id){
                    return cur_entry;
                }
            } 
        } 
        
        return null;
    }
    
    
    // Will return weaning date of a lactating entry;
    // This is a computed number.
    // This will return a date object;
    this._getWeaningDate = function(data_entry_lacta){
        const date_birth        = data_entry_lacta.birth.date_actual;
        const acc_settings_ops  = navigation.pigFarm.getSettingsOperations();
        
        if (!date_birth){return null;}
        
        return calculateDateExpectedWean(date_birth, acc_settings_ops);
        
    }
    
    
    
    /**
     * Will get feed estimate needs for the next MAX_NUM_MONTHS_FEED_PROJECTION
     * months. The estimate is computed as number of kilogram of feed type
     * to buy at the beginning of the month.
     * 
     * This is used for sow/boar/gilt feed estimation.
     * 
     * This should return a list like this; the feeds unit are all in kg;
     * No conversion to sacks yet or cost computation.
     * 
     * [  
            {
                date_to_buy:    '2026-07-01',
                feeds:{
                    gestating:  60,     // this is in kg
                    lactating:  150,    // this is in kg (full batch purchased in advance)
                }
            },
             
            {
                date_to_buy:    '2026-08-01',
                feeds:{
                    gestating:  62,     // this is in kg (after weaning, back to gestating)
                } 
            }
       ] 
    */
    this.computeFeedNeeds = function(){
        const result = [];
        
        // Get list of months to project
        const list_first_day_of_month = getEveryFirstDayOfMonth(MAX_NUM_MONTHS_FEED_PROJECTION);
        if (!list_first_day_of_month || list_first_day_of_month.length === 0) {
            return result;
        }
        
        const farm_sow_id = dataSow.sow_boar.farm_sow_id;
        if (!farm_sow_id) {
            return result;
        }
        
        // Check sow if currently gestating or lactating
        const data_entry_gesta = thisObj._getDataProductionEntry(farm_sow_id, true);
        const data_entry_lacta = thisObj._getDataProductionEntry(farm_sow_id, false);
        
        // Determine sow's current state
        const isGestating = data_entry_gesta !== null;
        const isLactating = data_entry_lacta !== null;
        const isWeaningOrGilt = !isGestating && !isLactating;
        
        // Constants
        const DAILY_GESTA = DAILY_CONSUMPTION.gestating || 2.0;
        
        // Get weaning date if lactating
        let weaningDateObj = null;
        let weaningMonth = -1;
        let weaningYear = -1;
        
        if (isLactating) {
            const weaningDate = thisObj._getWeaningDate(data_entry_lacta);
            if (weaningDate) {
                weaningDateObj = new Date(weaningDate);
                weaningDateObj.setHours(0, 0, 0, 0);
                weaningMonth = weaningDateObj.getMonth();
                weaningYear = weaningDateObj.getFullYear();
            }
        }
        
        // Track if we've already added lactating preparation
        let lactaPrepared = false;
        
        for (let i = 0; i < list_first_day_of_month.length; i++) {
            const cur_date = list_first_day_of_month[i];
            const currentDate = new Date(cur_date);
            currentDate.setHours(0, 0, 0, 0);
            
            // Calculate days in this month
            const nextMonth = new Date(currentDate);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            const daysInMonth = Math.floor((nextMonth - currentDate) / (1000 * 60 * 60 * 24));
            
            const curResult = {
                date_to_buy: cur_date,
                feeds: {}
            };
            
            // ============================================
            // CASE 1: Sow is GESTATING
            // ============================================
            if (isGestating) {
                const date_expected = data_entry_gesta.birth.date_expected;
                
                if (date_expected) {
                    const expectedBirthObj = new Date(date_expected);
                    expectedBirthObj.setHours(0, 0, 0, 0);
                    
                    // Check if expected birth falls within this month
                    const isBirthThisMonth = (expectedBirthObj.getFullYear() === currentDate.getFullYear() &&
                                              expectedBirthObj.getMonth() === currentDate.getMonth());
                    
                    let daysToFeedGesta = 0;
                    
                    if (isBirthThisMonth) {
                        // Feed from first day of month until expected birth date
                        const birthDay = expectedBirthObj.getDate();
                        daysToFeedGesta = birthDay - 1; // Days from 1st to day before birth
                    } else {
                        // Feed the whole month
                        daysToFeedGesta = daysInMonth;
                    }
                    
                    // Calculate gestating consumption in kg
                    const estGestaConsumption = Math.round(daysToFeedGesta * DAILY_GESTA);
                    
                    if (estGestaConsumption > 0) {
                        curResult.feeds.gestating = estGestaConsumption;
                    }
                    
                    // ============================================
                    // Lactating feed preparation (full batch in advance)
                    // ============================================
                    const isToComputeLacta = thisObj._isToComputeLactaFeeds(cur_date, date_expected);
                    
                    if (isToComputeLacta && !lactaPrepared) {
                        // Add full lactating feed budget (150kg = 3 sacks) purchased in advance
                        curResult.feeds.lactating = DEFAULT_KG_FEED_LACTATING;
                        lactaPrepared = true;
                    }
                }
            }
            
            // ============================================
            // CASE 2: Sow is LACTATING
            // ============================================
            if (isLactating && weaningDateObj) {
                // Check if weaning is in this month
                const isWeaningThisMonth = (weaningDateObj.getFullYear() === currentDate.getFullYear() &&
                                            weaningDateObj.getMonth() === currentDate.getMonth());
                
                let daysToFeedGesta = 0;
                
                if (isWeaningThisMonth) {
                    // Weaning happens this month
                    const weaningDay = weaningDateObj.getDate();
                    // After weaning day, sow reverts to gestating feed for the rest of the month
                    daysToFeedGesta = daysInMonth - weaningDay + 1;
                    
                } else if (weaningDateObj < currentDate) {
                    // Weaning already passed in previous month
                    // Sow is now on gestating feed for the whole month
                    daysToFeedGesta = daysInMonth;
                }
                
                // Add gestating consumption (after weaning, sow reverts to gestating feed)
                if (daysToFeedGesta > 0) {
                    const estGestaConsumption = Math.round(daysToFeedGesta * DAILY_GESTA);
                    if (estGestaConsumption > 0) {
                        curResult.feeds.gestating = (curResult.feeds.gestating || 0) + estGestaConsumption;
                    }
                }
                
                // Note: Lactating feed is not added here because it was already
                // purchased in advance during the gestating period
            }
            
            // ============================================
            // CASE 3: Sow is WEANING or GILT(not gestating or lactating)
            // ============================================
            if (isWeaningOrGilt) {
                // Sow is in weaning period or idle
                // Still needs maintenance feed (gestating rate)
                const estGestaConsumption = Math.round(daysInMonth * DAILY_GESTA);
                if (estGestaConsumption > 0) {
                    curResult.feeds.gestating = estGestaConsumption;
                }
            }
            
            result.push(curResult);
        }
        
        return result;
    }

}



/**
 * Will combine feed estimates for sow/boar/gilt and compute sack estimates and 
 * estimated cost.
 * 
 * Example: 
 *  
 sow_1_estimate = [  
        {
            date_to_buy:    '2026-07-01',
            feeds:{
                gestating:  60,     // this is in kg
                lactating:  150,    // this is in kg (full batch purchased in advance)
            }
        },
         
        {
            date_to_buy:    '2026-08-01',
            feeds:{
                gestating:  62,     // this is in kg (after weaning, back to gestating)
            } 
        }
   ]
    
sow_2_estimate = [  
        {
            date_to_buy:    '2026-07-01',
            feeds:{
                gestating:  60,     // this is in kg
                lactating:  150,    // this is in kg (full batch purchased in advance)
            }
        },
         
        {
            date_to_buy:    '2026-08-01',
            feeds:{
                gestating:  62,     // this is in kg (after weaning, back to gestating)
            } 
        }
   ]
   

feed_estimates = [sow_1_estimate, sow_2_estimate]


Expected result:

total_estimate = [  
        {
            date_to_buy:    '2026-07-01',
            estimated_cost: 8940,
            feeds:{
                gestating:  120,    // this is in kg
                lactating:  150,    // this is in kg (full batch purchased in advance)
            },
            
            feeds_sacks:{
                gestating:  3,      // this is in sacks; use ceiling; 
                lactating:  3       // this is in sacks;
            }
        },
         
        {
            date_to_buy:    '2026-08-01',
            estimated_cost: 1860,
            feeds:{
                gestating:  124,    // this is in kg (after weaning, back to gestating)
            },
            
            feeds_sacks:{
                gestating:  3,      // use ceiling; 
                lactating:  null
            }
 
        }
   ]

*/
export function combineFeedEstimatesSowBoarGilt(feed_estimates){
    
    // Unit weights for sack conversion
    const FEED_UNIT_WEIGHT = {
        gestating:  DEFAULT_FEED_UNIT_WEIGHT?.GESTATING || 50,
        lactating:  DEFAULT_FEED_UNIT_WEIGHT?.LACTATING || 50,
        booster:    DEFAULT_FEED_UNIT_WEIGHT?.BOOSTER || 1,
        prestarter: DEFAULT_FEED_UNIT_WEIGHT?.PRESTARTER || 25,
        starter:    DEFAULT_FEED_UNIT_WEIGHT?.STARTER || 50,
        grower:     DEFAULT_FEED_UNIT_WEIGHT?.GROWER || 50,
        finisher:   DEFAULT_FEED_UNIT_WEIGHT?.FINISHER || 50
    };
    
    // This is the account latest feed price per unit weight
    const latestFeedPricePUWT = navigation.pigFarm.managerFeeds.latestFeedPricePUWT;
    
    // Helper function to format money: round to nearest 100 and add commas
    const formatMoney = function(amount) {
        if (!amount) return '';
        const rounded = Math.round(amount / 100) * 100;
        return rounded.toLocaleString('en-US');
    };
    
    // If no estimates, return empty array
    if (!feed_estimates || feed_estimates.length === 0) {
        return [];
    }
    
    // Map to store combined feed needs by month
    const monthlyMap = {};
    
    // Process each sow/boar/gilt estimate
    for (const estimate of feed_estimates) {
        if (!estimate || estimate.length === 0) continue;
        
        for (const monthEntry of estimate) {
            const monthKey = monthEntry.date_to_buy;
            if (!monthKey) continue;
            
            // Initialize month entry if not exists
            if (!monthlyMap[monthKey]) {
                monthlyMap[monthKey] = {
                    date_to_buy: monthKey,
                    feeds: {},
                    feeds_sacks: {},
                    estimated_cost: 0
                };
            }
            
            // Add feed amounts (kg) to this month
            if (monthEntry.feeds) {
                for (const [feedType, amount] of Object.entries(monthEntry.feeds)) {
                    if (amount && amount > 0) {
                        monthlyMap[monthKey].feeds[feedType] = 
                            (monthlyMap[monthKey].feeds[feedType] || 0) + amount;
                    }
                }
            }
        }
    }
    
    // Convert map to sorted array
    const result = Object.values(monthlyMap);
    result.sort((a, b) => a.date_to_buy.localeCompare(b.date_to_buy));
    
    // Calculate sacks and estimated cost for each month
    for (const monthEntry of result) {
        let totalCost = 0;
        
        for (const [feedType, kgAmount] of Object.entries(monthEntry.feeds)) {
            if (!kgAmount || kgAmount <= 0) continue;
            
            // Get unit weight per sack for this feed type
            const unitWeight = FEED_UNIT_WEIGHT[feedType] || 50;
            
            // Calculate number of sacks (ceiling to round up)
            const sacks = Math.ceil(kgAmount / unitWeight);
            monthEntry.feeds_sacks[feedType] = sacks;
            
            // Calculate cost
            const pricePerKg = latestFeedPricePUWT?.[feedType] || 30; // Fallback to ₱30/kg
            const cost = kgAmount * pricePerKg;
            totalCost += cost;
        }
        
        // Add estimated cost for this month (rounded to nearest peso)
        monthEntry.estimated_cost = Math.round(totalCost);
    }
    
    return result;
}

