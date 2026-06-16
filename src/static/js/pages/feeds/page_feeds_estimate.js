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




let DEFAULT_KG_FEED_LACTATING   = 150;
let DEFAULT_KG_FEED_BOOSTER     = 20;
let DEFAULT_KG_FEED_PRESTARTER  = 100;

let DEFAULT_KG_PER_PIG_STARTER  = 50;
let DEFAULT_KG_PER_PIG_GROWER   = 100;
let DEFAULT_KG_PER_PIG_FINISHER = 50;

const MAX_NUM_MONTHS_FEED_PROJECTION = 2;

const MAX_DAYS_OFFSET_BUY_LACTA_THIS_MONTH = 3;


// These are the average number of days before changing feed using the
// default kg per feed type above.
let AVE_NUMDAYS_SINCE_BIRTH_BOOSTER    = 7
let AVE_NUMDAYS_SINCE_BIRTH_PRESTARTER = 30
let AVE_NUMDAYS_SINCE_BIRTH_STARTER    = 50
let AVE_NUMDAYS_SINCE_BIRTH_GROWER     = 90
let AVE_NUMDAYS_SINCE_BIRTH_FINISHER   = 120




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
     * Will return an array of Date objects every 1st of the month in the future.
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
                    lactating:  null
                }
            },
             
            {
                date_to_buy:    '2026-08-01',
                feeds:{
                    lactating:  DEFAULT_KG_FEED_LACTATING
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
                    lactating:  null,
                    booster:    20,
                    prestarter: 100
                }
            },
             
            {
                date_to_buy:    '2026-08-01',
                feeds:{
                    lactating:  null,
                    booster:    null,
                    prestarter: null,
                    starter:    700
                }
            }
       ] 
    */
    this._computeFeedNeeds = function(){
        // 
        // This will return a list of date strings
        const list_first_day_of_month =  this.getEveryFirstDayOfMonth(
                MAX_NUM_MONTHS_FEED_PROJECTION);
        
        const result = []; 
        
        const num_current_pigs = dataPigProd.pig_production.cur_pig_count;
        
        if (!num_current_pigs || num_current_pigs == 0){return null;} 
        
        
        // Step 1: Compute first the projected feed needs after piglets are born
        //  until harvest
        const all_projected_feeds = {
            booster:    DEFAULT_KG_FEED_BOOSTER,    // this can be adjusted instead of fixed
            prestarter: DEFAULT_KG_FEED_PRESTARTER, // this can be adjusted instead of fixed
            starter:    num_current_pigs * DEFAULT_KG_PER_PIG_STARTER,
            grower:     num_current_pigs * DEFAULT_KG_PER_PIG_GROWER,
            finisher:   num_current_pigs * DEFAULT_KG_PER_PIG_FINISHER
        }; 
        
        
        
        // Step 2: Remove feeds that are not needed anymore; 
        // For example if prestarter is already bought, then booster is remove
        // Or if prestarter is already bought, then booster and prestarter is remove
        
        const prod_feeds        = dataPigProd.feeds;
        
        if (prod_feeds.bought_kg && prod_feeds.bought_kg.prestarter){
            delete all_projected_feeds.booster;
        }
        else{
            if (prod_feeds.bought.prestarter){
                delete all_projected_feeds.booster;
            }
        }
        
        
        if (prod_feeds.bought_kg && prod_feeds.bought_kg.starter){
            delete all_projected_feeds.prestarter;
        }
        else{
            if (prod_feeds.bought.starter){
                delete all_projected_feeds.prestarter;
            }
        }
        
        if (prod_feeds.bought_kg && prod_feeds.bought_kg.grower){
            delete all_projected_feeds.starter;
        }
        else{
            if (prod_feeds.bought.grower){
                delete all_projected_feeds.starter;
            }
        }
        
        if (prod_feeds.bought_kg && prod_feeds.bought_kg.finisher){
            delete all_projected_feeds.grower;
        }
        else{
            if (prod_feeds.bought.finisher){
                delete all_projected_feeds.grower;
            }
        }
        
        
        
        
        
        
        
        for (const cur_date of list_first_day_of_month){
  
            const cur_result = {
                date_to_buy:        cur_date,
                feeds:              {} 
            };
            result.push(cur_result);
        
            
        
        }
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
        
        this.processPigProduction();
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
    
    
    this.processPigProduction = function(){
        const list_gestating = navigation.pigFarm.managerPigProd.dataGestatingList;
        
        

        for (const cur_entry of list_gestating){
            const cur_pig_prod = new PigProduction(cur_entry);
            
            console.log('cur entry pig production');
            console.log(cur_entry);
            
        }
        
    }
    
    
    
    
    
     
}
