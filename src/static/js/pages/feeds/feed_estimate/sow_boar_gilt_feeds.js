// sow_boar_gilt_feeds.js

// June 19, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {PROD_STATUS,
        DEFAULT_FEED_UNIT_WEIGHT}       from '../../../constants.js';

import {
    MAX_NUM_MONTHS_FEED_PROJECTION,
    getEveryFirstDayOfMonth}            from './feed_estimate_basic.js' 


const MAX_DAYS_OFFSET_BUY_LACTA_THIS_MONTH = 3;


// This is the default feed budget for lactating sow and piglets
let DEFAULT_KG_FEED_LACTATING   = 150;



export function SowFeeds(data_sow){
    const thisObj               = this;
    
    let dataSow             = data_sow;
    

    /**
     * Check if expected date of birth is within this month of cur_date
     * or within MAX_DAYS_OFFSET_BUY_LACTA_THIS_MONTH next month;
     * 
     * Example 1:
     * today            = '2026-06-15'
     * cur_date         = '2026-07-01'
     * expected_birth   = '2026-06-20'
     * is_to_compute    = false
     * 
     * Example 2:
     * today            = '2026-06-15'
     * cur_date         = '2026-07-01'
     * expected_birth   = '2026-07-01'
     * is_to_compute    = true
     * 
     * Example 3:
     * today            = '2026-06-15'
     * cur_date         = '2026-07-01'
     * expected_birth   = '2026-08-01' to '2026-08-03' 
     * is_to_compute    = true  // this is because the lactating feeds
     *                          // needs to be allocated at least 3 days
     *                          // before expected birth
     * 
     * Example 4:
     * today            = '2026-06-15'
     * cur_date         = '2026-07-01'
     * expected_birth   = '2026-08-04' or later
     * is_to_compute    = false
     * 
     * 
     * cur_date - date string; example: '2026-07-01'
     * expected_birth - date string; example: '2026-07-01'
     * 
     * */
    this._isToComputeLactaFeeds = function(cur_date, expected_birth){
        
        // Parse dates
        const curDateObj = new Date(cur_date);
        const expectedBirthObj = new Date(expected_birth);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Get the month of cur_date
        const curMonth = curDateObj.getMonth();
        const curYear = curDateObj.getFullYear();
        
        // Get the month of expected_birth
        const birthMonth = expectedBirthObj.getMonth();
        const birthYear = expectedBirthObj.getFullYear();
        
        // Calculate the last day of cur_date's month
        const lastDayOfCurMonth = new Date(curYear, curMonth + 1, 0);
        
        // Calculate the cutoff date for next month (cur_date's month + MAX_DAYS_OFFSET)
        const cutoffDate = new Date(curYear, curMonth + 1, MAX_DAYS_OFFSET_BUY_LACTA_THIS_MONTH);
        
        // Case 1: Expected birth is before cur_date (already past)
        if (expectedBirthObj < curDateObj) {
            return false;
        }
        
        // Case 2: Expected birth is within cur_date's month
        if (birthYear === curYear && birthMonth === curMonth) {
            return true;
        }
        
        // Case 3: Expected birth is within next month's first MAX_DAYS_OFFSET days
        if (birthYear === curYear && birthMonth === curMonth + 1) {
            if (expectedBirthObj <= cutoffDate) {
                return true;
            }
        }
        
        // Case 4: Expected birth is beyond next month's cutoff
        return false;
    }
    
    
    /**
     * This should return a list like this; the feeds unit are all in kg;
     * Conversion to sacks are done last.
     * 
     * [  
            {
                date_to_buy:    '2026-07-01',
                feeds:{
                    prestarter: null,
                    starter:    null,
                    grower:     null,
                    finisher:   null,
                }
            },
             
            {
                date_to_buy:    '2026-08-01',
                feeds:{
                    prestarter: null,
                    starter:    null,
                    grower:     null,
                    finisher:   null,
                }
            }
       ] 
    */
    this._computeLactatingFeedNeeds = function(){
        
        // Date expected birth
        const date_expected = dataPigProd.birth.date_expected;
        
        // This will return a list of date strings
        const list_first_day_of_month =  this.getEveryFirstDayOfMonth(
                MAX_NUM_MONTHS_FEED_PROJECTION);
        
        
        const result = []; 
        
        
        for (const cur_date of list_first_day_of_month){
  
            const cur_result = {
                date_to_buy:        cur_date,
                feeds:              {} 
            };
            result.push(cur_result);
            
            
            let is_to_compute = thisObj._isToComputeLactaFeeds(cur_date, date_expected);
            
            if (is_to_compute == false){continue;}
            
            
            
            const prod_feeds        = dataPigProd.feeds;
            
            let   bought_kg_lacta   = null;
            
            
            
            // Get the bought feeds by kg if there is any
            if (prod_feeds.bought_kg && prod_feeds.bought_kg.lactating){
                // This is computed at backend, everytime a feed is allocated
                // to a production entry, it will automatically computes
                // the bought (allocated) feed to a production entry;
                // But the old data does not return this bought_kg;
                bought_kg_lacta = prod_feeds.bought_kg.lactating
            }
            else{
                // The old data always return feeds by sacks
                const bought_sacks_lacta = prod_feeds.bought.lactating;
                
                // convert the sacks to kg; this is assumed to be in PH
                // standard sacking
                
                if (bought_sacks_lacta){
                    bought_kg_lacta = bought_sacks_lacta * DEFAULT_FEED_UNIT_WEIGHT.LACTATING;
                } 
            }
            
            
            let to_buy_kg_lacta = null;
            
            // Check if there is already allocated lacta feeds
            if (bought_kg_lacta){
                if (bought_kg_lacta >= DEFAULT_KG_FEED_LACTATING){
                    break;
                }
                else{
                    // At this point, there was a partial lacta feed allocation
                    // to this production entry;
                    
                    // If there was a partial lacta feed buy, this means 
                    // - sow is about to give birth; some lacta feeds were bought
                    // this month, the remaining next month 
                    
                    to_buy_kg_lacta =  DEFAULT_KG_FEED_LACTATING - bought_kg_lacta;
                    cur_result.feeds.lactating = to_buy_kg_lacta;
                    break;
                }
            }
            
            else{
                to_buy_kg_lacta =  DEFAULT_KG_FEED_LACTATING;
                cur_result.feeds.lactating = to_buy_kg_lacta;
                break;
            }
        } 
        
        return result;
    }
    
    
    /**
     * Will get feed estimate needs for the next MAX_NUM_MONTHS_FEED_PROJECTION
     * months. The estimate is computed as number of kilogram of feed type
     * to buy at the beginning of the month.
     * 
     * This is used when production entry already has given birth or 
     * in fattening stage.
     * 
     * This should return a list like this; the feeds unit are all in kg;
     * Conversion to sacks are done last.
     * 
     * [  
            {
                date_to_buy:    '2026-07-01',
                estimated_cost: null,
                feeds:{
                    booster:    20,
                    prestarter: 50,
                    starter:    null,
                    grower:     null,
                    finisher:   null,
                },
                
                feeds_sacks:{
                    booster:    20,    // 1kg packs, so 20 sacks/packs
                    prestarter: 2,     // 50kg / 25kg per sack = 2 sacks
                    starter:    null,
                    grower:     null,
                    finisher:   null,
                }
            },
             
            {
                date_to_buy:    '2026-08-01',
                estimated_cost: null,
                feeds:{
                    booster:    null,
                    prestarter: null,
                    starter:    350,
                    grower:     null,
                    finisher:   null,
                },
                
                feeds_sacks:{
                    booster:    null,
                    prestarter: null,
                    starter:    7,     // 350kg / 50kg per sack = 7 sacks
                    grower:     null,
                    finisher:   null
                } 
            }
       ] 
    */
    this.computeFeedNeeds = function(){
          
        // Average daily consumption per pig (kg per day)
        const DAILY_CONSUMPTION = {
            booster: 0.8,        // Piglet booster (20kg over ~25 days) for whole lactating batch
            prestarter: 2.5,     // Piglet prestarter (50kg over ~20 days) for whole lactating batch
            starter: 1.25,       // 50kg over ~40 days per pig
            grower: 2.5,         // 100kg over ~40 days per pig
            finisher: 2.5        // 50kg over ~20 days per pig
        };
        
        // Days since birth when each feed stage starts
        const FEED_STAGE_START_DAY = {
            booster: 5,          // Starts at day 5
            prestarter: 30,      // Starts at day 30
            starter: 50,         // Starts at day 50 (after weaning)
            grower: 90,          // Starts at day 90
            finisher: 130        // Starts at day 130 (harvest ~145-150)
        };
        
        // Total feed per piglet from each stage
        const FEED_TOTAL_PER_PIG = {
            starter:    DEFAULT_KG_PER_PIG_STARTER,
            grower:     DEFAULT_KG_PER_PIG_GROWER,
            finisher:   DEFAULT_KG_PER_PIG_FINISHER
        };
        
        // This is the account latest feed price per unit weight
        const latestFeedPricePUWT = navigation.pigFarm.managerFeeds.latestFeedPricePUWT;
        
        // Get list of months to project
        const list_first_day_of_month = this.getEveryFirstDayOfMonth(MAX_NUM_MONTHS_FEED_PROJECTION);
        if (!list_first_day_of_month || list_first_day_of_month.length === 0) {
            return [];
        }
        
        const num_current_pigs = dataPigProd.pig_production.cur_pig_count;
        if (!num_current_pigs || num_current_pigs == 0) {
            return [];
        }
        
        
        return result;
    }
    

}

