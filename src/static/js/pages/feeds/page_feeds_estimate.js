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
        DEFAULT_FEED_UNIT_WEIGHT,
        DATA_VER_NUM_PIG_FARM}        from '../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}         from '../../utils.js';

import {ComponentNavLeftRight}  from '../common/ui/comp_nav_left_right.js';

import {PigProductionFeeds}     from './pig_production_feeds.js';


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
        
        
        this.processPigProdFeedProjection();
    }
    
    
       
    
    this.processPigProdFeedProjection = function(){
        const list_lactating = navigation.pigFarm.managerPigProd.dataLactatingList;
        const list_fattening = navigation.pigFarm.managerPigProd.dataFatteningList;   
        
        // Map to store combined feed needs by month
        const monthlyFeedMap = {};
        
        // Process lactating entries
        for (const cur_entry of list_lactating){
            const cur_pig_prod = new PigProductionFeeds(cur_entry);
            const cur_feed_needs = cur_pig_prod.computeFeedNeeds();
            
            if (!cur_feed_needs || cur_feed_needs.length === 0) continue;
            
            console.log(cur_feed_needs);
            
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
            const cur_pig_prod = new PigProductionFeeds(cur_entry);
            const cur_feed_needs = cur_pig_prod.computeFeedNeeds();
            
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
        
        
        const result_money = this.postProcessFeedProjection(result);
        
        console.log('result_money');
        console.log(result_money);
        
        
        return result_money;
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
                const latestFeedPricePUWT = navigation.pigFarm.managerFeeds.latestFeedPricePUWT;
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
