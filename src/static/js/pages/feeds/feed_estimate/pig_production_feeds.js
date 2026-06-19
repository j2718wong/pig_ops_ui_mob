// pig_production_feeds.js

// June 15, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {PROD_STATUS,
        DEFAULT_FEED_UNIT_WEIGHT}       from '../../../constants.js';

import {
    MAX_NUM_MONTHS_FEED_PROJECTION,
    getEveryFirstDayOfMonth}            from './feed_estimate_basic.js' 



// This is the default feed budget for lactating sow and piglets
let DEFAULT_KG_FEED_BOOSTER             = 20;
let DEFAULT_KG_FEED_PRESTARTER          = 50;

let DEFAULT_KG_PER_PIG_STARTER          = 50;
let DEFAULT_KG_PER_PIG_GROWER           = 100;
let DEFAULT_KG_PER_PIG_FINISHER         = 50;


// These are the average number of days before changing feed using the
// default kg per feed type above.
let AVE_NUMDAYS_SINCE_BIRTH_BOOSTER     = 5;
let AVE_NUMDAYS_SINCE_BIRTH_PRESTARTER  = 30;
let AVE_NUMDAYS_SINCE_BIRTH_STARTER     = 50;
let AVE_NUMDAYS_SINCE_BIRTH_GROWER      = 90;
let AVE_NUMDAYS_SINCE_BIRTH_FINISHER    = 130;


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




export function PigProductionFeeds(data_pig_prod){
    const thisObj               = this;
    
    let dataPigProd             = data_pig_prod;
    
    
    /**
     * Will get feed estimate needs for the next MAX_NUM_MONTHS_FEED_PROJECTION
     * months. The estimate is computed as number of kilogram of feed type
     * to buy at the beginning of the month.
     * 
     * This is used when a production entry already has already given birth or 
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
        
        // This is the account latest feed price per unit weight
        const latestFeedPricePUWT = navigation.pigFarm.managerFeeds.latestFeedPricePUWT;
        
        // Get list of months to project
        const list_first_day_of_month = getEveryFirstDayOfMonth(MAX_NUM_MONTHS_FEED_PROJECTION);
        if (!list_first_day_of_month || list_first_day_of_month.length === 0) {
            return [];
        }
        
        const num_current_pigs = dataPigProd.pig_production.cur_pig_count;
        if (!num_current_pigs || num_current_pigs == 0) {
            return [];
        }
        
        // Get production data
        const prod_feeds    = dataPigProd.feeds || {};
        const bought_kg     = prod_feeds.bought_kg || {};
        const bought        = prod_feeds.bought || {};
        
        // Get birth date
        const date_birth = dataPigProd.birth.date_actual;
        
        if (!date_birth) {
            return list_first_day_of_month.map(date => ({
                date_to_buy: date,
                feeds: {},
                feeds_sacks: {},
                estimated_cost: 0
            }));
        }
        
        const birthDate = new Date(date_birth);
        birthDate.setHours(0, 0, 0, 0);
        
        // Step 1: Calculate remaining feed needs per stage (excluding lactating)
        const remainingFeeds = {};
        
        // Booster
        let boosterBought = 0;
        if (bought_kg.booster) {
            boosterBought = bought_kg.booster;
        } else if (bought.booster) {
            const unitWeight = DEFAULT_FEED_UNIT_WEIGHT?.BOOSTER || 1;
            boosterBought = bought.booster * unitWeight;
        }
        if (boosterBought < DEFAULT_KG_FEED_BOOSTER) {
            remainingFeeds.booster = DEFAULT_KG_FEED_BOOSTER - boosterBought;
        }
        
        // Prestarter
        let prestarterBought = 0;
        if (bought_kg.prestarter) {
            prestarterBought = bought_kg.prestarter;
        } else if (bought.prestarter) {
            const unitWeight = DEFAULT_FEED_UNIT_WEIGHT?.PRESTARTER || 25;
            prestarterBought = bought.prestarter * unitWeight;
        }
        if (prestarterBought < DEFAULT_KG_FEED_PRESTARTER) {
            remainingFeeds.prestarter = DEFAULT_KG_FEED_PRESTARTER - prestarterBought;
        }
        
        
        // TODO
        /*
        2026-06-17 Notes:
        // These are the average number of days before changing feed using the
        // default kg per feed type above.
        let AVE_NUMDAYS_SINCE_BIRTH_BOOSTER    = 5
        let AVE_NUMDAYS_SINCE_BIRTH_PRESTARTER = 30
        let AVE_NUMDAYS_SINCE_BIRTH_STARTER    = 50
        let AVE_NUMDAYS_SINCE_BIRTH_GROWER     = 90
        let AVE_NUMDAYS_SINCE_BIRTH_FINISHER   = 130
        
         
        Users may not record the bought or allocated feeds per production batch.
        In this case, it is assumed that the feed requirement of the 
        production batch up until to this current date now, was already bought.
        This needs to be taken into account;
        
        1.) It maybe possible that a production  entry has no birthdate;
        This is when the piglets are bougth from outside.
        
        2.) If pig_age >= 45 AND pig_age < AVE_NUMDAYS_SINCE_BIRTH_GROWER,
                if no recorded bought feeds 
                    - no more BOOSTER, PRESTARTER calculation
                    - the assumed bought and consumed STARTER feeds should be computed
                     
        3.) If pig_age >= AVE_NUMDAYS_SINCE_BIRTH_GROWER AND pig_age < AVE_NUMDAYS_SINCE_BIRTH_FINISHER,
                if no recorded bought feeds 
                    - no more BOOSTER, PRESTARTER, STARTER calculation
                    - the assumed bought and consumed GROWER feeds should be computed
                    
        4.) If pig_age >= AVE_NUMDAYS_SINCE_BIRTH_FINISHER
                if no recorded bought feeds 
                    - no more BOOSTER, PRESTARTER, STARTER, GROWER calculation
                    - the assumed bought and consumed FINISHER feeds should be computed
                
         
        */
        
        
        // Starter, Grower, Finisher (per pig)
        const pigFeedStages = ['starter', 'grower', 'finisher'];
        for (const stage of pigFeedStages) {
            const totalNeeded = num_current_pigs * FEED_TOTAL_PER_PIG[stage];
            let boughtAmount = 0;
            if (bought_kg[stage]) {
                boughtAmount = bought_kg[stage];
            } else if (bought[stage]) {
                // Number of sacks bought converted to kg
                const unitWeight = DEFAULT_FEED_UNIT_WEIGHT?.[stage.toUpperCase()] || 50;
                boughtAmount = bought[stage] * unitWeight;
            }
            if (boughtAmount < totalNeeded) {
                remainingFeeds[stage] = totalNeeded - boughtAmount;
            }
        }
        
        // Step 2: Distribute remaining feeds across months
        const result = [];
        let remainingBalance = { ...remainingFeeds };
        
        for (let i = 0; i < list_first_day_of_month.length; i++) {
            const currentDate = new Date(list_first_day_of_month[i]);
            currentDate.setHours(0, 0, 0, 0);
            
            // Calculate days since birth at start of this month
            const daysAtMonthStart = Math.floor((currentDate - birthDate) / (1000 * 60 * 60 * 24));
            
            // Calculate days in this month
            const nextMonth = new Date(currentDate);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            const daysInMonth = Math.floor((nextMonth - currentDate) / (1000 * 60 * 60 * 24));
            
            const curResult = {
                date_to_buy: cur_date,
                feeds: {},
                feeds_sacks: {},
                estimated_cost: 0
            };
            
            // For each feed stage, calculate how much is needed this month
            for (const [stage, remaining] of Object.entries(remainingBalance)) {
                if (remaining <= 0) continue;
                
                const startDay = FEED_STAGE_START_DAY[stage] || 0;
                const dailyRate = DAILY_CONSUMPTION[stage] || 0;
                
                // Skip if stage hasn't started yet
                if (daysAtMonthStart < startDay) {
                    // Check if stage will start within this month
                    const daysUntilStart = startDay - daysAtMonthStart;
                    if (daysUntilStart >= daysInMonth) {
                        // Won't start this month, skip
                        continue;
                    }
                    // Starts mid-month, calculate partial
                    const daysInMonthActive = daysInMonth - daysUntilStart;
                    const amountThisMonth = daysInMonthActive * dailyRate * num_current_pigs;
                    const finalAmount = Math.min(amountThisMonth, remaining);
                    if (finalAmount > 0) {
                        const roundedAmount = Math.round(finalAmount);
                        curResult.feeds[stage] = roundedAmount;
                        remainingBalance[stage] = remaining - finalAmount;
                    }
                } else {
                    // Stage already active, full month consumption
                    const amountThisMonth = daysInMonth * dailyRate * num_current_pigs;
                    const finalAmount = Math.min(amountThisMonth, remaining);
                    if (finalAmount > 0) {
                        const roundedAmount = Math.round(finalAmount);
                        curResult.feeds[stage] = roundedAmount;
                        remainingBalance[stage] = remaining - finalAmount;
                    }
                }
            }
            
            result.push(curResult);
            
            // If all feeds are assigned, break early
            const allAssigned = Object.values(remainingBalance).every(v => v <= 0);
            if (allAssigned) break;
        }
        
        // Step 3: If any remaining feeds, add to last month
        const lastIndex = result.length - 1;
        for (const [stage, remaining] of Object.entries(remainingBalance)) {
            if (remaining > 0 && lastIndex >= 0) {
                const roundedAmount = Math.round(remaining);
                result[lastIndex].feeds[stage] = (result[lastIndex].feeds[stage] || 0) + roundedAmount;
            }
        }
        
        // Step 4: Calculate sacks correctly
        // First, collect total kg per feed type across all months
        const totalKgPerFeed = {};
        for (const monthResult of result) {
            for (const [feedType, kg] of Object.entries(monthResult.feeds)) {
                if (kg && kg > 0) {
                    totalKgPerFeed[feedType] = (totalKgPerFeed[feedType] || 0) + kg;
                }
            }
        }
        
        // Calculate total sacks needed per feed type based on actual pig count
        const totalSacksPerFeed = {};
        for (const [feedType, totalKg] of Object.entries(totalKgPerFeed)) {
            const unitWeight = DEFAULT_FEED_UNIT_WEIGHT?.[feedType.toUpperCase()] || 50;
            
            // For starter, grower, finisher - use pig count based calculation
            // This ensures exact sack counts (1 starter, 2 grower, 1 finisher per pig)
            if (feedType === 'starter') {
                totalSacksPerFeed[feedType] = num_current_pigs * 1; // 1 sack per pig
            } else if (feedType === 'grower') {
                totalSacksPerFeed[feedType] = num_current_pigs * 2; // 2 sacks per pig
            } else if (feedType === 'finisher') {
                totalSacksPerFeed[feedType] = num_current_pigs * 1; // 1 sack per pig
            } else {
                // For booster and prestarter, use kg-based calculation with ceil
                totalSacksPerFeed[feedType] = Math.ceil(totalKg / unitWeight);
            }
        }
        
        // Calculate sacks per month for booster and prestarter (kg-based)
        for (const monthResult of result) {
            for (const [feedType, kg] of Object.entries(monthResult.feeds)) {
                if (kg && kg > 0) {
                    const unitWeight = DEFAULT_FEED_UNIT_WEIGHT?.[feedType.toUpperCase()] || 50;
                    
                    // For booster and prestarter, use kg-based calculation
                    if (feedType === 'booster' || feedType === 'prestarter') {
                        let sacks = kg / unitWeight;
                        let roundedSacks = Math.round(sacks);
                        if (roundedSacks === 0 && kg > 0) {
                            roundedSacks = 1;
                        }
                        monthResult.feeds_sacks[feedType] = roundedSacks;
                    }
                    // For starter, grower, finisher - don't set yet, we'll distribute total sacks
                }
            }
        }
        
        // Distribute total sacks for starter, grower, finisher across months
        const feedTypesWithFixedSacks = ['starter', 'grower', 'finisher'];
        for (const feedType of feedTypesWithFixedSacks) {
            const totalSacks = totalSacksPerFeed[feedType] || 0;
            if (totalSacks === 0) continue;
            
            // Get all months that have this feed type
            const monthsWithFeed = [];
            for (let i = 0; i < result.length; i++) {
                if (result[i].feeds[feedType] && result[i].feeds[feedType] > 0) {
                    monthsWithFeed.push(i);
                }
            }
            
            if (monthsWithFeed.length === 0) continue;
            
            // Calculate total kg for this feed type
            let totalKg = 0;
            for (const monthIndex of monthsWithFeed) {
                totalKg += result[monthIndex].feeds[feedType];
            }
            
            // Distribute sacks proportionally based on kg per month
            let allocatedSacks = 0;
            for (let i = 0; i < monthsWithFeed.length - 1; i++) {
                const monthIndex = monthsWithFeed[i];
                const kg = result[monthIndex].feeds[feedType];
                // Calculate proportion of total kg for this month
                const proportion = kg / totalKg;
                let sacks = Math.round(proportion * totalSacks);
                // Ensure at least 1 sack if kg > 0
                if (sacks === 0 && kg > 0) {
                    sacks = 1;
                }
                result[monthIndex].feeds_sacks[feedType] = sacks;
                allocatedSacks += sacks;
            }
            
            // Last month gets the remaining sacks
            const lastMonthIndex = monthsWithFeed[monthsWithFeed.length - 1];
            result[lastMonthIndex].feeds_sacks[feedType] = totalSacks - allocatedSacks;
            // Ensure we don't go negative
            if (result[lastMonthIndex].feeds_sacks[feedType] < 0) {
                result[lastMonthIndex].feeds_sacks[feedType] = 0;
            }
        }
        
        // Step 5: Calculate estimated cost per month
        for (const monthResult of result) {
            let totalCost = 0;
            
            for (const [feedType, kg] of Object.entries(monthResult.feeds)) {
                if (!kg || kg <= 0) continue;
                
                // Get price per kg for this feed type
                const pricePerKg = latestFeedPricePUWT?.[feedType] || 30; // Fallback to ₱30/kg
                
                // Calculate cost: use kg amount
                const cost = kg * pricePerKg;
                totalCost += cost;
            }
            
            // Round to nearest peso
            monthResult.estimated_cost = Math.round(totalCost);
        }
        
        return result;
    }
    
    
    /**
     * Should return a list of dates of the production entry
     * 
     * */
    this.getImportantDateMarks = function(){
        
        // Get birth date
        const date_birth = dataPigProd.birth.date_actual;
        
        if (!date_birth) {
            return {
                date_birth: null,
                day_5_booster: null,
                day_30_prestarter: null,
                day_32_weaning: null,
                day_50_starter: null,
                day_90_grower: null,
                day_130_finisher: null
            };
        }
        
        const birthDate = new Date(date_birth);
        birthDate.setHours(0, 0, 0, 0);
        
        // Helper function to add days to a date
        function addDays(date, days) {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        }
        
        // Helper function to format date as YYYY-MM-DD
        function formatDateISO(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
        
        const day_005_booster    = formatDateISO(addDays(birthDate, 5));
        const day_030_prestarter = formatDateISO(addDays(birthDate, 30));
        const day_032_weaning    = formatDateISO(addDays(birthDate, 32));
        const day_050_starter    = formatDateISO(addDays(birthDate, 50));
        const day_090_grower     = formatDateISO(addDays(birthDate, 90));
        const day_130_finisher   = formatDateISO(addDays(birthDate, 130));
        
        return {
            date_birth: date_birth,
            day_005_booster:     day_005_booster,
            day_030_prestarter:  day_030_prestarter,
            day_032_weaning:     day_032_weaning,
            day_050_starter:     day_050_starter,
            day_090_grower:      day_090_grower,
            day_130_finisher:    day_130_finisher
        };
    }

}

