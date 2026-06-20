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
function isToComputeLactaFeeds(cur_date, date_expected){
        
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






export function SowFeeds(data_sow){
    const thisObj               = this;
    
    let dataSow             = data_sow;
    

    
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
            if (cur_entry.sow){
                if (cur_entry.sow.farm_sow_id == farm_sow_id){
                    return cur_entry;
                }
            } 
        } 
        
        return null;
    }
    
    
    // Will return weaning date of a lactating entry;
    // This is a computed number.
    this._getWeaningDate = function(data_entry_lacta){
        // Get birth date from the lactating entry
        const date_birth = data_entry_lacta.birth.date_actual;
        if (!date_birth) {
            return null;
        }
        
        // Get account settings for weaning days
        const acc_settings_ops = navigation.pigFarm.getSettingsOperations();
        
        // This will return a date object
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
     
     Example 1: sow has not yet given birth
     Today = '2026-06-20'
     
     result = [  
            {
                date_to_buy:            '2026-07-01',
                sow_name:               'Rosita',
                date_birth:             '2026-07-26', // This is expected birth; not yet happened
                date_wean:              '2026-08-26', // This is expected wean; not yet happened  
                feeds:{
                    gestating:  52,     // July 1-26 = 26 days × 2kg
                    lactating:  150,    // Full batch purchased 
                }
            },
             
            {
                date_to_buy:            '2026-08-01',
                sow_name:               'Rosita',
                date_expected_birth:    '2026-07-26',
                date_expected_wean:     '2026-08-26',   
                feeds:{
                    gestating:  12      // Aug 26-31 = 6 days × 2kg
                } 
            },
            
            {
                date_to_buy:            '2026-09-01',
                sow_name:               'Rosita',
                date_expected_birth:    '2026-07-26',
                date_expected_wean:     '2026-08-26',   
                feeds:{
                    gestating:  60      // Sep 1-30 = 30 days × 2kg
                } 
            }
       ] 
       
       
       Example 2: Currently Lactating
       Today = '2026-06-20'
       
       result = [  
            {
                date_to_buy:            '2026-07-01',
                sow_name:               'Lala',
                date_birth:             '2026-06-07',   // This is actual birth; already happened
                date_wean:              '2026-07-08',   // This is expected wean; not yet happened
                feeds:{
                    gestating:  48      // July 8-31 = 24 days × 2kg
                     
                }
            },
             
            {
                date_to_buy:            '2026-08-01',
                sow_name:               'Lala',
                date_expected_birth:    '2026-06-07',
                date_expected_wean:     '2026-07-08',  
                feeds:{
                    gestating:  62      // Aug 1-31 = 31 days × 2kg
                } 
            },
            
            {
                date_to_buy:            '2026-09-01',
                sow_name:               'Lala',
                date_expected_birth:    '2026-06-07',
                date_expected_wean:     '2026-07-08',    
                feeds:{
                    gestating:  60      // Sep 1-30 = 30 days × 2kg
                } 
            }
       ] 
       
       
       Example 3: sow has not yet given birth but expected date of birth within 
        MAX_DAYS_OFFSET_BUY_LACTA_THIS_MONTH (3 days)
       Today = '2026-06-20'
     
       result = [  
            {
                date_to_buy:            '2026-07-01',
                sow_name:               'Mylene',
                date_birth:             '2026-08-03', // This is expected birth; not yet happened
                date_wean:              '2026-09-03', // This is expected wean; not yet happened  
                feeds:{
                    gestating:  62,     // July 1-31 = 31 days × 2kg
                    lactating:  150,    // Full batch purchased; this si needed for lacta preparation 
                }
            },
             
            {
                date_to_buy:            '2026-08-01',
                sow_name:               'Mylene',
                date_birth:             '2026-08-03', // This is expected birth; not yet happened
                date_wean:              '2026-09-03', // This is expected wean; not yet happened,   
                feeds:{
                    gestating:  6      // Aug 1-3 = 3 days × 2kg
                } 
            },
            
            {
                date_to_buy:            '2026-09-01',
                sow_name:               'Mylene',
                date_birth:             '2026-08-03', // This is expected birth; not yet happened
                date_wean:              '2026-09-03', // This is expected wean; not yet happened,     
                feeds:{
                    gestating:  56      // Sep 3-30 = 28 days × 2kg
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
        
        // Constants
        const DAILY_GESTA = DAILY_CONSUMPTION.gestating || 2.0;
        const acc_settings_ops = navigation.pigFarm.getSettingsOperations();
        
        // Determine sow's base state
        const isCurrentlyLactating = data_entry_lacta !== null;
        const isCurrentlyGestating = data_entry_gesta !== null;
        const isWeaningOrGilt = !isCurrentlyLactating && !isCurrentlyGestating;
        
        // Get birth and weaning dates
        let birthDate       = null;
        let birthDateObj    = null;
        let weaningDate     = null;
        let weaningDateObj  = null;
        
        // For gestating sows: set birthDate to expected birth date
        if (isCurrentlyGestating && data_entry_gesta) {
            birthDate       = data_entry_gesta.birth.date_expected;
            if (birthDate) {
                birthDateObj = new Date(birthDate);
                birthDateObj.setHours(0, 0, 0, 0);
            }
            
            // Compute weaning date
            weaningDateObj  = calculateDateExpectedWean(birthDate, acc_settings_ops); 
            weaningDate     = weaningDateObj.toISOString().split('T')[0];   
        }
        
        // For lactating sows: set birthDate to actual birth date
        if (isCurrentlyLactating && data_entry_lacta) {
            birthDate = data_entry_lacta.birth.date_actual;
            if (birthDate) {
                const birthDateObj = new Date(birthDate);
                birthDateObj.setHours(0, 0, 0, 0);
            }
            
            // Compute weaning date
            weaningDateObj = calculateDateExpectedWean(birthDate, acc_settings_ops);
            weaningDate     = weaningDateObj.toISOString().split('T')[0];
        }
        
        
        
        // Track if lactating feed has been prepared
        let lactaPrepared = false;
        
        for (let i = 0; i < list_first_day_of_month.length; i++) {
            const cur_date      = list_first_day_of_month[i];
            const currentDate   = new Date(cur_date);
            currentDate.setHours(0, 0, 0, 0);
            
            // Calculate days in this month
            const nextMonth     = new Date(currentDate);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            const daysInMonth   = Math.floor((nextMonth - currentDate) / (1000 * 60 * 60 * 24));
            
            const curResult = {
                sow_name:       dataSow.sow_boar.name,
                date_to_buy:    cur_date,
                date_birth:     birthDate,
                date_wean:      weaningDate,
                feeds: {}
            };
            
            
            // ============================================
            // DETERMINE SOW STATE FOR THIS MONTH
            // ============================================
            let isGestatingThisMonth        = false;
            let isLactatingThisMonth        = false;
            let isWeaningOrGiltThisMonth    = false;
            let daysToFeedGesta             = 0;
            let hasBirthThisMonth           = false;
            let birthDayInMonth             = 0;
            let weanDayInMonth              = 0;
            
            
            // --- CASE A: Sow is currently LACTATING ---
            if (isCurrentlyLactating && weaningDateObj) {
                const isWeaningThisMonth = (weaningDateObj.getFullYear() === currentDate.getFullYear() &&
                                            weaningDateObj.getMonth() === currentDate.getMonth());
                const isWeaningFuture   = weaningDateObj > currentDate;
                const isWeaningPast     = weaningDateObj < currentDate;
                
                if (isWeaningThisMonth) {
                    // Weaning happens this month
                    const weaningDay = weaningDateObj.getDate();
                    // After weaning, sow reverts to gestating feed
                    daysToFeedGesta = daysInMonth - weaningDay + 1;
                    isGestatingThisMonth = true;
                } else if (isWeaningPast) {
                    // Weaning already passed - full month gestating
                    daysToFeedGesta = daysInMonth;
                    isGestatingThisMonth = true;
                } else {
                    // Weaning is in the future - sow is still lactating
                    isLactatingThisMonth = true;
                }
                
            }
            
            
            // --- CASE B: Sow is currently GESTATING ---
            if (isCurrentlyGestating && birthDateObj) {
                const isBirthThisMonth  = (birthDateObj.getFullYear() === currentDate.getFullYear() &&
                                          birthDateObj.getMonth() === currentDate.getMonth());
                 
                const isWeanThisMonth   = (weaningDateObj.getFullYear() === currentDate.getFullYear() &&
                                          weaningDateObj.getMonth() === currentDate.getMonth());
                
                
                // Compute daysToFeedGesta
                if (isBirthThisMonth) {
                    hasBirthThisMonth = true;
                    birthDayInMonth = birthDateObj.getDate();
                    
                    // Gestating until birth day
                    daysToFeedGesta = birthDayInMonth;

                } else if (isWeanThisMonth) {
                    const weaningDay = weaningDateObj.getDate();
                    daysToFeedGesta = daysInMonth - weaningDay + 1;
                    
                } else {
                    // Birth already passed - full month gestating
                    daysToFeedGesta = daysInMonth;
                }

                
                // Check if lactating feed should be prepared
                const is_to_compute_lacta = isToComputeLactaFeeds(cur_date, birthDate);
                if (is_to_compute_lacta && !lactaPrepared) {
                    curResult.feeds.lactating = DEFAULT_KG_FEED_LACTATING;
                }
                
            }
            
            
            // --- CASE C: Sow is WEANING or GILT ---
            if (isWeaningOrGilt) {
                // Full month gestating (maintenance)
                daysToFeedGesta = daysInMonth;
            }
            
            // ============================================
            // ADD GESTATING FEED
            // ============================================
            if (daysToFeedGesta > 0) {
                const estGestaConsumption = Math.round(daysToFeedGesta * DAILY_GESTA);
                if (estGestaConsumption > 0) {
                    curResult.feeds.gestating = estGestaConsumption;
                }
            }
            
            // ============================================
            // ADD LACTATING FEED (if birth this month)
            // ============================================
            // Note: Lactating feed is already added in the birth month case above
            
            result.push(curResult);
        }

        
        // Do not delete this in case for debugging
        //console.log('\n\nsow_name = ' + dataSow.sow_boar.name);
        //console.log(JSON.stringify(result, null, 2));
        
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
        booster:    DEFAULT_FEED_UNIT_WEIGHT?.BOOSTER   || 1,
        prestarter: DEFAULT_FEED_UNIT_WEIGHT?.PRESTARTER || 25,
        starter:    DEFAULT_FEED_UNIT_WEIGHT?.STARTER   || 50,
        grower:     DEFAULT_FEED_UNIT_WEIGHT?.GROWER    || 50,
        finisher:   DEFAULT_FEED_UNIT_WEIGHT?.FINISHER  || 50
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

