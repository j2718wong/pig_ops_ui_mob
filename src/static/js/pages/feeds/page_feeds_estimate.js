// page_feeds_estimate.js

// June 15, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}         from '../common/page_view_basic.js';
import {calculateNumDaysSinceInsem}  from '../common/page_view_basic.js';


import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE,
        PIG_PROD_TYPE,
        PROD_STATUS,
        DATA_VER_NUM_PIG_FARM}        from '../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}         from '../../utils.js';

import {ComponentNavLeftRight}  from '../common/ui/comp_nav_left_right.js';


const FEED_BALANCE_CONSUMED     = 'superpig_feed_balance_consumed';
const FEED_BUY_CONSUMED         = 'superpig_feed_buy_consumed';



const DEFAULT_FEED_UNIT_WEIGHT = {
    GESTATING:  50,
    LACTATING:  50,
    BOOSTER:    1,
    PRESTARTER: 25,
    STARTER:    50,
    GROWER:     50,
    FINISHER:   50
};


const MAX_NUM_MONTHS_FEED_PROJECTION = 4;

const MAX_DAYS_OFFSET_BUY_LACTA_THIS_MONTH = 3;


// This is the default feed budget for lactating sow and piglets
let DEFAULT_KG_FEED_LACTATING   = 150;
let DEFAULT_KG_FEED_BOOSTER     = 20;
let DEFAULT_KG_FEED_PRESTARTER  = 100;

let DEFAULT_KG_PER_PIG_STARTER  = 50;
let DEFAULT_KG_PER_PIG_GROWER   = 100;
let DEFAULT_KG_PER_PIG_FINISHER = 50;


// These are the average number of days before changing feed using the
// default kg per feed type above.
let AVE_NUMDAYS_SINCE_BIRTH_BOOSTER    = 5
let AVE_NUMDAYS_SINCE_BIRTH_PRESTARTER = 30
let AVE_NUMDAYS_SINCE_BIRTH_STARTER    = 50
let AVE_NUMDAYS_SINCE_BIRTH_GROWER     = 90
let AVE_NUMDAYS_SINCE_BIRTH_FINISHER   = 130




function PigProduction(data_pig_prod){
    const thisObj               = this;
    
    let dataPigProd             = data_pig_prod;
    
    
    /**
     * This should return the computed production feeds consumption
     * starting from lactating to finisher feed types until target harvest date.
     * 
     * 1.) If the production entry is still in gestating stage, there is no 
     *      computation from booster to finisher as the number of piglets
     *      is not known. Only the lactating feeds will be computed; the 
     *      gestating feeds maybe computed at farm level until date of birth.
     * 
     * 2.) The result are in kg (units other than kg will be addressed later on)
     * 
     * 3.) The lactating to prestarter feeds are assumed budgeted fixed; 
     *  the actual  additional feeds are added on demand.
     * 
     *  LACTATING   = 150 kg per Sow until wean
     *  BOOSTER     = 20 kg per lactating batch
     *  PRESTARTER  = 100 kg per lactating batch 
     *   
     * 
     * 4.) Each farm will have different feeding programs for their pigs. 
     *      To simplify feed projections, the feed consumption per piglet is
     *  
     *  STARTER     = 50 kg
     *  GROWER      = 100 kg
     *  FINISHER    = 50 kg 
     *  
     * 
     * */
    this.getComputedFeedConsumptionUntilHarvest = function(){
        const result = {
            gestating:              null,
            lactating:              null,
            booster:                null,
            prestarter:             null,
            starter:                null,
            grower:                 null,
            finisher:               null
        } 
        
        const prod_status_id = dataPigProd.pig_production.prod_status_id;
        
        switch(prod_status_id){
            case PROD_STATUS.GESTATING:{
                
            }
            
            case PROD_STATUS.LACTATING:
            
            case PROD_STATUS.WEANING:
            case PROD_STATUS.GROWING:
        }
        
        
        return result;
    }
    
    
    /**
     * Will return an array of Date strings every 1st of the month in the future.
     * Example:
     * 
     * num_months = 2
     * 
     * today = '2026-06-15'
     * returns = ['2026-07-01', '2026-08-01'] 
     * 
     * 
     * num_months = 2
     * 
     * today = '2026-06-01'
     * returns = ['2026-07-01', '2026-08-01'] 
     * 
     * */
    this.getEveryFirstDayOfMonth = function(num_months){
        const result = [];
        const today = new Date();
        
        // Start from next month's first day
        let current = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        
        for (let i = 0; i < num_months; i++) {
            const year = current.getFullYear();
            const month = String(current.getMonth() + 1).padStart(2, '0');
            const day = String(current.getDate()).padStart(2, '0');
            result.push(`${year}-${month}-${day}`);
            current.setMonth(current.getMonth() + 1);
        }
        
        return result;
    }
    
    
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
                feeds:{
                    booster:    20,
                    prestarter: 100,
                    starter:    null,
                    grower:     null,
                    finisher:   null,
                }
            },
             
            {
                date_to_buy:    '2026-08-01',
                feeds:{
                    booster:    null,
                    prestarter: null,
                    starter:    350,
                    grower:     null,
                    finisher:   null,
                }
            }
       ] 
    */
    this._computeFeedNeeds = function(){
          
        // Average daily consumption per pig (kg per day)
        const DAILY_CONSUMPTION = {
            booster: 0.8,        // Piglet booster (20kg over ~25 days)
            prestarter: 1.0,     // Piglet prestarter (100kg over ~100 days)
            starter: 1.2,        // 50kg over ~42 days
            grower: 1.8,         // 100kg over ~56 days
            finisher: 2.2        // 50kg over ~23 days
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
        
        // Get list of months to project
        const list_first_day_of_month = this.getEveryFirstDayOfMonth(MAX_NUM_MONTHS_FEED_PROJECTION);
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
                feeds: {}
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
        
        // Starter, Grower, Finisher (per pig)
        const pigFeedStages = ['starter', 'grower', 'finisher'];
        for (const stage of pigFeedStages) {
            const totalNeeded = num_current_pigs * FEED_TOTAL_PER_PIG[stage];
            let boughtAmount = 0;
            if (bought_kg[stage]) {
                boughtAmount = bought_kg[stage];
            } else if (bought[stage]) {
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
            const cur_date = list_first_day_of_month[i];
            const currentDate = new Date(cur_date);
            currentDate.setHours(0, 0, 0, 0);
            
            // Calculate days since birth at start of this month
            const daysAtMonthStart = Math.floor((currentDate - birthDate) / (1000 * 60 * 60 * 24));
            
            // Calculate days in this month
            const nextMonth = new Date(currentDate);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            const daysInMonth = Math.floor((nextMonth - currentDate) / (1000 * 60 * 60 * 24));
            
            const curResult = {
                date_to_buy: cur_date,
                feeds: {}
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
                        curResult.feeds[stage] = Math.round(finalAmount);
                        remainingBalance[stage] = remaining - finalAmount;
                    }
                } else {
                    // Stage already active, full month consumption
                    const amountThisMonth = daysInMonth * dailyRate * num_current_pigs;
                    const finalAmount = Math.min(amountThisMonth, remaining);
                    if (finalAmount > 0) {
                        curResult.feeds[stage] = Math.round(finalAmount);
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
                result[lastIndex].feeds[stage] = (result[lastIndex].feeds[stage] || 0) + Math.round(remaining);
            }
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


export function PageFeedsEstimate(input_settings){
    PageViewPigFarmPage.call(this);
    
    const TAG                   = 'PageFeedsEstimate';
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    this.setNavigation(navigation);
    
    
    /*
    Typical input_settings
    {
        navigation:             this,
        uniqueKey:              'feeds-consumed' 
        pageTitle:              'Farrowing Schedule'
    }   
    */  
    let settings                = input_settings;
    
    
    
    
    // This is needed as this will be first element to be rendered
    let elemDivContainer        = document.getElementById(settings.elemIdDivContainer);
    
    let componentNavLeftRight   = null;
    
    let elemIdPageInfo          = null;
    let elemIdLabelToday        = null;
    let elemIdDateToday         = null;
    
    let elemIdShowSample        = null;        
    
    let elemIdDebug             = null; 
        
    
    let elemPageInfo            = null;
    let elemLabelToday          = null;
    let elemDateToday           = null;
    
    let elemShowSample          = null;
    
    let elemDebug               = null;
    
    let dtCurrentDate           = null;
    
    
    let latestFeedPricePUWT     = {
        gestating:              null,
        lactating:              null,
        booster:                null,
        prestarter:             null,
        starter:                null,
        grower:                 null,
        finisher:               null
    }

    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this._writeInlineStyle = function(){
        const html = `
        <style>
           
        </style>
        `;
        return html;
    }
    
    
    this.render = function(){
        let label_page_title    = 'Feeds Estimate';
        let label_today         = 'Today';
        
        let label_see_sample    = 'See Sample Feeds Consumed data';
        
        
        let page_info   = `
            This will estimate feed requirements and cost for next two months.
        `;
        
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_page_title    = helper.getSimpleTranslation('navigation.nav_links.Financials3') || label_page_title;
        label_today         = helper.getSimpleTranslation('common_app.labels.today') || label_today;
        
        label_see_sample    = helper.getSimpleTranslation('page_farrowing_schedule.labels.see_sample') || label_see_sample;
        
        //page_info           = helper.getSimpleTranslation('page_info.farrowing_sched') || page_info;
        
        
        componentNavLeftRight   = new ComponentNavLeftRight({
           uniqueKey:           settings.uniqueKey,
           elemDivContainer:    elemDivContainer,
           pageTitle:           label_page_title
        });
        
        
        elemIdPageInfo          = `${settings.uniqueKey}-page-info`;
        
        elemIdLabelToday        = `${settings.uniqueKey}-label-today`;
        elemIdDateToday         = `${settings.uniqueKey}-date-today`;

        elemIdShowSample        = `${settings.uniqueKey}-show-sample`;
        
        
        elemIdDebug             = `${settings.uniqueKey}-debug`;
        
        const html_style        = thisObj._writeInlineStyle();
        
        const html_nav          = componentNavLeftRight.getHtml();   
 
        
 
           
        const html = `

${html_style}

<div class="mobile-container">
    ${html_nav}
    
    <!--
    <div class="mobile-info-box" id="${elemIdPageInfo}">
        ${page_info}
    </div>
    -->
    
    <div style="text-align: center;">
        <span id="${elemIdLabelToday}">${label_today}</span>
        <span id="${elemIdDateToday}" style="color:blue; font-weight:600;"></span>
    </div>
    
    <div style="margin: 8px 0;" id="${elemIdShowSample}" style="display:none;">
        <a href="javascript:void(0)" class="text-link" >
            ${label_see_sample}
        </a>
    </div>
    
    <div id=""></div>   
    
    <div id="${elemIdDebug}"></div>

</div>
        `;
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        componentNavLeftRight.afterHtmlRender();
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemPageInfo            = elemDivContainer.querySelector('#'+elemIdPageInfo);
     
        elemLabelToday          = elemDivContainer.querySelector('#'+elemIdLabelToday);
        elemDateToday           = elemDivContainer.querySelector('#'+elemIdDateToday);
     
        elemShowSample          = elemDivContainer.querySelector('#'+elemIdShowSample);
        
        elemDebug               = elemDivContainer.querySelector('#'+elemIdDebug);
    }
    
    
    this._processAfterHtmlRender = function(){
        
        componentNavLeftRight.callbackNavLeft = function(){
            navigation.managerNavLinks.onClickNavFarrowingChecklist();
        };
        
          
        componentNavLeftRight.callbackNavRight = function(){
            navigation.managerNavLinks.onClickNavFeedBalance();
        };
        
        
        componentNavLeftRight.bindEventListeners();
        

    }
    
    
    this._bindEventListeners = function(){

        elemShowSample.addEventListener('click', function() {
            /*
            thisObj.onClickShowSample({
                title:      'Sample Feeds Consumed Data',
                img_src:    '/static_m/images/mar/mar_feeds_consumed.png',
                img_alt:    'Sample Feeds Consumed Data'
            });
            */ 
        });
    }
    
    
    this.renderPage = function(page_data){
        thisObj.show();
    }
    
    
    
    this.show = function(){
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        const s_dt_current = formatDate(dtCurrentDate, FORMAT_COMPACT);
        
        elemDateToday.textContent = s_dt_current;
        
        this.populateAccFeedPricePUWT();
        
        this.processPigProdFeedProjection();
    }
    
    
    // Will set feed price per unit weight; 
    this._setLatestFeedPricePUWT = function(account_price, country_ave_price){
        // country_ave_price  =[30.22, 32.84, 75.8, 54.4, 37.5, 33.6 ,32.7]
        
        const feed_types = ['gestating', 'lactating', 'booster', 'prestarter', 
            'starter', 'grower', 'finisher'];

        feed_types.forEach((type, index) => {
            if (account_price && account_price[index]) {
                latestFeedPricePUWT[type] = account_price[index];
            } else {
                latestFeedPricePUWT[type] = country_ave_price[index];
            }
        });  
    }
    
    
    this.populateAccFeedPricePUWT = function(){
        console.log('navigation.userControl.dataUserAccount');
        console.log(navigation.userControl.dataUserAccount);
        
        const account = navigation.userControl.dataUserAccount.account;

        const country_hid = account.account.country.hid; 
        
        const callback_success = function(data){
            thisObj._setLatestFeedPricePUWT(account.last_feed_price_puwt, data);
            console.log(`latestFeedPricePUWT`);
            console.log(latestFeedPricePUWT);
        };
        
        const callback_failure = function(){
            
        };
        
        navigation.managerAddress.requestDataAveFeedsPricePUWT(country_hid,
            callback_success, callback_failure);
    
    }
    
    
    this.processPigProdFeedProjection = function(){
        const list_lactating = navigation.pigFarm.managerPigProd.dataLactatingList;
        const list_fattening = navigation.pigFarm.managerPigProd.dataFatteningList;   
        
        // Map to store combined feed needs by month
        const monthlyFeedMap = {};
        
        // Process lactating entries
        for (const cur_entry of list_lactating){
            const cur_pig_prod = new PigProduction(cur_entry);
            const cur_feed_needs = cur_pig_prod._computeFeedNeeds();
            
            if (!cur_feed_needs || cur_feed_needs.length === 0) continue;
            
            // Add to monthly map
            for (const monthEntry of cur_feed_needs) {
                const monthKey = monthEntry.date_to_buy;
                if (!monthlyFeedMap[monthKey]) {
                    monthlyFeedMap[monthKey] = {
                        date_to_buy: monthKey,
                        feeds: {}
                    };
                }
                
                // Add lactating feeds to this month
                for (const [feedType, amount] of Object.entries(monthEntry.feeds)) {
                    if (amount && amount > 0) {
                        monthlyFeedMap[monthKey].feeds[feedType] = 
                            (monthlyFeedMap[monthKey].feeds[feedType] || 0) + amount;
                    }
                }
            }
        }
        
        // Process fattening entries
        for (const cur_entry of list_fattening){
            const cur_pig_prod = new PigProduction(cur_entry);
            const cur_feed_needs = cur_pig_prod._computeFeedNeeds();
            
            if (!cur_feed_needs || cur_feed_needs.length === 0) continue;
            
            // Add to monthly map
            for (const monthEntry of cur_feed_needs) {
                const monthKey = monthEntry.date_to_buy;
                if (!monthlyFeedMap[monthKey]) {
                    monthlyFeedMap[monthKey] = {
                        date_to_buy: monthKey,
                        feeds: {}
                    };
                }
                
                // Add fattening feeds to this month
                for (const [feedType, amount] of Object.entries(monthEntry.feeds)) {
                    if (amount && amount > 0) {
                        monthlyFeedMap[monthKey].feeds[feedType] = 
                            (monthlyFeedMap[monthKey].feeds[feedType] || 0) + amount;
                    }
                }
            }
        }
        
        // Convert map to sorted array
        const result = Object.values(monthlyFeedMap);
        result.sort((a, b) => a.date_to_buy.localeCompare(b.date_to_buy));

        console.log('feeds_projection');
        console.log(result);
        
        return result;
    }
    
    
    // Add monthly feed projection in sacks;
    // And add approximate cost of the number of sacks to be bought
    // Use ceiling to round to nearest sack;
    this.postProcessFeedProjection = function(feed_projection){
        /* This is declared at the top
        const DEFAULT_FEED_UNIT_WEIGHT = {
            GESTATING:  50,
            LACTATING:  50,
            BOOSTER:    1,
            PRESTARTER: 25,
            STARTER:    50,
            GROWER:     50,
            FINISHER:   50
        };
        */

        // This is the moving average price per kg of feed_type
        // This is saved in latestFeedPricePUWT
        /*
        {
          "gestating": 31.5,
          "lactating": 32.84,
          "booster": 75.8,
          "prestarter": 55.2,
          "starter": 37.5,
          "grower": 33.6,
          "finisher": 33.5
        }*/
        
        if (!feed_projection || feed_projection.length === 0) {
            return [];
        }
        
        const result = [];
        
        for (const monthEntry of feed_projection) {
            const processedMonth = {
                date_to_buy: monthEntry.date_to_buy,
                feeds: {},
                sacks: {},
                cost: {}
            };
            
            // Process each feed type in this month
            for (const [feedType, kgAmount] of Object.entries(monthEntry.feeds)) {
                if (!kgAmount || kgAmount <= 0) continue;
                
                // Get unit weight per sack for this feed type
                const feedTypeUpper = feedType.toUpperCase();
                const unitWeight = DEFAULT_FEED_UNIT_WEIGHT[feedTypeUpper] || 50;
                
                // Calculate number of sacks (ceiling to round up)
                const sacks = Math.ceil(kgAmount / unitWeight);
                processedMonth.sacks[feedType] = sacks;
                
                // Calculate cost
                const pricePerKg = latestFeedPricePUWT[feedType] || 30; // Fallback to ₱30/kg
                const totalCost = Math.round(kgAmount * pricePerKg);
                processedMonth.cost[feedType] = totalCost;
                
                // Keep the kg amount
                processedMonth.feeds[feedType] = Math.round(kgAmount);
            }
            
            // Add total sacks and total cost for the month
            let totalSacks = 0;
            let totalCost = 0;
            
            for (const [feedType, sacks] of Object.entries(processedMonth.sacks)) {
                totalSacks += sacks;
                totalCost += processedMonth.cost[feedType] || 0;
            }
            
            processedMonth.total_sacks = totalSacks;
            processedMonth.total_cost = totalCost;
            
            result.push(processedMonth);
        }
        
        return result;
    }
    
    
    
    
    
     
}
