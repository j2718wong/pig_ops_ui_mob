// page_feeds_estimate.js

// June 15, 2026 - Updated June 20, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}        from '../../common/page_view_basic.js';
import {calculateNumDaysSinceInsem,
        calculateDateExpectedWean}  from '../../common/page_view_basic.js';


import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE,
        PIG_PROD_TYPE,
        PROD_STATUS,
        DEFAULT_FEED_UNIT_WEIGHT,
        DATA_VER_NUM_PIG_FARM}      from '../../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}         from '../../../utils.js';

import {ComponentNavLeftRight}  from '../../common/ui/comp_nav_left_right.js';

import {PigProductionFeeds}     from './pig_production_feeds.js';

import {SowFeeds,
        combineFeedEstimatesSowBoarGilt} from './sow_boar_gilt_feeds.js';


const ESTIMATE_FEEDS_ALL_PIGS       = 0;

// Estimate feeds for lactating and fattening production entries only
const ESTIMATE_FEEDS_PROD_ONLY      = 1;

// Estimate feeds for sow/boar/gilt  including lacta preparation sows about to give birth only
const ESTIMATE_FEEDS_BREEDING_ONLY  = 2;


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
    
    let elemIdThMonth1          = null;
    let elemIdThMonth2          = null;
    let elemIdThMonth3          = null;
    let elemIdThMonth4          = null;
                                
    let elemIdTableEstimateBody = null;
    let elemIdEstFeedCost       = null;      
    
    let elemIdDebug             = null; 
        
    
    let elemPageInfo            = null;
    let elemLabelToday          = null;
    let elemDateToday           = null;
    
    let elemShowSample          = null;
    
    let elemThMonth1            = null;
    let elemThMonth2            = null;
    let elemThMonth3            = null;
    let elemThMonth4            = null;
                              
    let elemTableEstimateBody   = null;
    let elemEstFeedCost         = null; 
    
    let elemDebug               = null;
    
    let dtCurrentDate           = null;
    
    // Current filter state
    let currentFilter           = 'all'; // 'all', 'sow_boar', 'fattening'
    
    // Cached data
    let cachedProdEstimate      = null;
    let cachedBreedingEstimate  = null;
    let cachedCombinedEstimate  = null;
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this._writeInlineStyle = function(){
        const html = `
        `;
        return html;
    }
    
    
    this.render = function(){
        let label_page_title    = 'Feeds Estimate';
        let label_today         = 'Today';
        
        let label_see_sample    = 'See Sample Feeds Consumed data';
        let label_filter        = 'View:';
        let label_all           = 'All';
        let label_sow_boar      = 'Sow/Boar';
        let label_production    = 'Production';
        
        
        let page_info   = `
            This will estimate feed requirements and cost for next two months.
        `;
        
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_page_title    = helper.getSimpleTranslation('navigation.nav_links.Financials3') || label_page_title;
        label_today         = helper.getSimpleTranslation('common_app.labels.today') || label_today;
        label_see_sample    = helper.getSimpleTranslation('page_farrowing_schedule.labels.see_sample') || label_see_sample;
        label_filter        = helper.getSimpleTranslation('page_feeds_estimate.labels.filter') || label_filter;
        label_all           = helper.getSimpleTranslation('page_feeds_estimate.labels.all') || label_all;
        label_sow_boar      = helper.getSimpleTranslation('page_feeds_estimate.labels.sow_boar') || label_sow_boar;
        label_production    = helper.getSimpleTranslation('page_feeds_estimate.labels.production') || label_production;
        
        
        componentNavLeftRight   = new ComponentNavLeftRight({
           uniqueKey:           settings.uniqueKey,
           elemDivContainer:    elemDivContainer,
           pageTitle:           label_page_title
        });
        
        
        elemIdPageInfo          = `${settings.uniqueKey}-page-info`;
        
        elemIdLabelToday        = `${settings.uniqueKey}-label-today`;
        elemIdDateToday         = `${settings.uniqueKey}-date-today`;

        elemIdShowSample        = `${settings.uniqueKey}-show-sample`;
        
        elemIdThMonth1          = `${settings.uniqueKey}-estimate-month-1`;
        elemIdThMonth2          = `${settings.uniqueKey}-estimate-month-2`;
        elemIdThMonth3          = `${settings.uniqueKey}-estimate-month-3`;
        elemIdThMonth4          = `${settings.uniqueKey}-estimate-month-4`;
        
        elemIdTableEstimateBody = `${settings.uniqueKey}-estimate-body`;
        elemIdEstFeedCost       = `${settings.uniqueKey}-estimate-cost`;
        
        elemIdDebug             = `${settings.uniqueKey}-debug`;
        
        const html_style        = thisObj._writeInlineStyle();
        
        const html_nav          = componentNavLeftRight.getHtml();   
 
        const html_filter = `
            <!-- Centered Filter Controls -->
            <div>
                <div class="filter-controls">
                    <div class="animal-filter">
                        <div class="filter-buttons sow">
                            <button class="filter-button active" data-filter="all">All</button>
                            <button class="filter-button" data-filter="sow_boar">Sow/Boar</button>
                            <button class="filter-button" data-filter="fattening">Production</button>
                        </div>
                    </div>
                </div>
            </div>
            
        `;
           
        const html = `

${html_style}

<div class="mobile-container">
    ${html_nav}
    
    <div style="text-align: center;">
        <span id="${elemIdLabelToday}">${label_today}</span>
        <span id="${elemIdDateToday}" style="color:blue; font-weight:600;"></span>
    </div>
    
    ${html_filter}
    
    <div style="margin: 8px 0;" id="${elemIdShowSample}" style="display:none;">
        <a href="javascript:void(0)" class="text-link" >
            ${label_see_sample}
        </a>
    </div>
    
    <table class="data-table table-feed-summary" id="">
        <colgroup>
            <col style="width: 20%;">
            <col style="width: 20%;">
            <col style="width: 20%;">
            <col style="width: 20%;">
            <col style="width: 20%;">
        </colgroup>
        
        <thead>
            <tr>
                <th>Feed Type</th>
                <th id="${elemIdThMonth1}">Jul 1</th>
                <th id="${elemIdThMonth2}">Aug 1</th>
                <th id="${elemIdThMonth3}">Sep 1</th>
                <th id="${elemIdThMonth4}">Oct 1</th>
            </tr>
        </thead>
        
        <tbody id="${elemIdTableEstimateBody}">
            <tr>
                <td>Gesta</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Lacta</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>PreStart</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Starter</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Grower</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Finisher</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Est. Cost</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    </table>
    
    <div>
        <span id="">Estimated Feed Cost: </span>
        <span id="${elemIdEstFeedCost}" style="color:blue; font-weight:600;"></span>
    </div>
          
    
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
        
        elemThMonth1            = elemDivContainer.querySelector('#'+elemIdThMonth1);
        elemThMonth2            = elemDivContainer.querySelector('#'+elemIdThMonth2);
        elemThMonth3            = elemDivContainer.querySelector('#'+elemIdThMonth3);
        elemThMonth4            = elemDivContainer.querySelector('#'+elemIdThMonth4);
        
        elemTableEstimateBody   = elemDivContainer.querySelector('#'+elemIdTableEstimateBody);
        elemEstFeedCost         = elemDivContainer.querySelector('#'+elemIdEstFeedCost);
        
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
        // Filter button click handlers
        const filterBtns = elemDivContainer.querySelectorAll('.filter-button');
        for (const btn of filterBtns) {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                for (const b of filterBtns) {
                    b.classList.remove('active');
                }
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value
                const filter = this.dataset.filter;
                currentFilter = filter;
                
                // Update the table based on filter
                thisObj.updateTableByFilter(filter);
            });
        }

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
        
        // Get production feed estimates
        cachedProdEstimate = this.estimateFeedsProduction();
        
        // Get breeding feed estimates (sows + gilts + boars)
        cachedBreedingEstimate = this.estimateFeedsSows();
        
        // Combine both for "All" view
        cachedCombinedEstimate = this.combineEstimates(cachedProdEstimate, cachedBreedingEstimate);
        
        // Default to "All" view
        currentFilter = 'all';
        this.updateTableByFilter('all');
    }
    
    
    /**
     * Combine production and breeding estimates into one
     */
    this.combineEstimates = function(prodEstimate, breedingEstimate) {
        const monthlyMap = {};
        
        // Add production estimates
        for (const monthEntry of prodEstimate) {
            const monthKey = monthEntry.date_to_buy;
            if (!monthlyMap[monthKey]) {
                monthlyMap[monthKey] = {
                    date_to_buy: monthKey,
                    feeds: {},
                    feeds_sacks: {},
                    estimated_cost: 0
                };
            }
            // Add feeds
            for (const [feedType, amount] of Object.entries(monthEntry.feeds || {})) {
                if (amount && amount > 0) {
                    monthlyMap[monthKey].feeds[feedType] = 
                        (monthlyMap[monthKey].feeds[feedType] || 0) + amount;
                }
            }
            // Add sacks
            for (const [feedType, sacks] of Object.entries(monthEntry.feeds_sacks || {})) {
                if (sacks && sacks > 0) {
                    monthlyMap[monthKey].feeds_sacks[feedType] = 
                        (monthlyMap[monthKey].feeds_sacks[feedType] || 0) + sacks;
                }
            }
            // Add cost
            if (monthEntry.estimated_cost) {
                monthlyMap[monthKey].estimated_cost += monthEntry.estimated_cost;
            }
        }
        
        // Add breeding estimates
        for (const monthEntry of breedingEstimate) {
            const monthKey = monthEntry.date_to_buy;
            if (!monthlyMap[monthKey]) {
                monthlyMap[monthKey] = {
                    date_to_buy: monthKey,
                    feeds: {},
                    feeds_sacks: {},
                    estimated_cost: 0
                };
            }
            // Add feeds
            for (const [feedType, amount] of Object.entries(monthEntry.feeds || {})) {
                if (amount && amount > 0) {
                    monthlyMap[monthKey].feeds[feedType] = 
                        (monthlyMap[monthKey].feeds[feedType] || 0) + amount;
                }
            }
            // Add sacks
            for (const [feedType, sacks] of Object.entries(monthEntry.feeds_sacks || {})) {
                if (sacks && sacks > 0) {
                    monthlyMap[monthKey].feeds_sacks[feedType] = 
                        (monthlyMap[monthKey].feeds_sacks[feedType] || 0) + sacks;
                }
            }
            // Add cost
            if (monthEntry.estimated_cost) {
                monthlyMap[monthKey].estimated_cost += monthEntry.estimated_cost;
            }
        }
        
        // Convert map to sorted array
        const result = Object.values(monthlyMap);
        result.sort((a, b) => a.date_to_buy.localeCompare(b.date_to_buy));
        return result;
    }
    
    
    /**
     * Update the table based on the selected filter
     */
    this.updateTableByFilter = function(filter) {
        let dataToShow = [];
        
        switch(filter) {
            case 'all':
                dataToShow = cachedCombinedEstimate || [];
                break;
            case 'sow_boar':
                dataToShow = cachedBreedingEstimate || [];
                break;
            case 'fattening':
                dataToShow = cachedProdEstimate || [];
                break;
            default:
                dataToShow = cachedCombinedEstimate || [];
        }
        
        this.populateFeedEstimate(dataToShow);
    }
    
    
       
    // Will only estimate Lactating and fattening production entries
    this.estimateFeedsProduction = function(){
        const list_lactating = navigation.pigFarm.managerPigProd.dataLactatingList;
        const list_fattening = navigation.pigFarm.managerPigProd.dataFatteningList;   
        
        // Map to store combined feed needs by month
        const monthlyFeedMap = {};
        
        // Process lactating entries
        for (const cur_entry of list_lactating){
            const cur_pig_prod = new PigProductionFeeds(cur_entry);
            const cur_feed_needs = cur_pig_prod.computeFeedNeeds();
            
            if (!cur_feed_needs || cur_feed_needs.length === 0) continue;
            
            // Add to monthly map
            for (const monthEntry of cur_feed_needs) {
                const monthKey = monthEntry.date_to_buy;
                if (!monthlyFeedMap[monthKey]) {
                    monthlyFeedMap[monthKey] = {
                        date_to_buy: monthKey,
                        feeds: {},
                        feeds_sacks: {},
                        estimated_cost: 0
                    };
                }
                
                // Add feeds to this month
                for (const [feedType, amount] of Object.entries(monthEntry.feeds)) {
                    if (amount && amount > 0) {
                        monthlyFeedMap[monthKey].feeds[feedType] = 
                            (monthlyFeedMap[monthKey].feeds[feedType] || 0) + amount;
                    }
                }
                
                // Add sacks to this month
                for (const [feedType, sacks] of Object.entries(monthEntry.feeds_sacks || {})) {
                    if (sacks && sacks > 0) {
                        monthlyFeedMap[monthKey].feeds_sacks[feedType] = 
                            (monthlyFeedMap[monthKey].feeds_sacks[feedType] || 0) + sacks;
                    }
                }
                
                // Add cost to this month
                if (monthEntry.estimated_cost) {
                    monthlyFeedMap[monthKey].estimated_cost += monthEntry.estimated_cost;
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
                        feeds: {},
                        feeds_sacks: {},
                        estimated_cost: 0
                    };
                }
                
                // Add feeds to this month
                for (const [feedType, amount] of Object.entries(monthEntry.feeds)) {
                    if (amount && amount > 0) {
                        monthlyFeedMap[monthKey].feeds[feedType] = 
                            (monthlyFeedMap[monthKey].feeds[feedType] || 0) + amount;
                    }
                }
                
                // Add sacks to this month
                for (const [feedType, sacks] of Object.entries(monthEntry.feeds_sacks || {})) {
                    if (sacks && sacks > 0) {
                        monthlyFeedMap[monthKey].feeds_sacks[feedType] = 
                            (monthlyFeedMap[monthKey].feeds_sacks[feedType] || 0) + sacks;
                    }
                }
                
                // Add cost to this month
                if (monthEntry.estimated_cost) {
                    monthlyFeedMap[monthKey].estimated_cost += monthEntry.estimated_cost;
                }
            }
        }
        
        // Convert map to sorted array
        const result = Object.values(monthlyFeedMap);
        result.sort((a, b) => a.date_to_buy.localeCompare(b.date_to_buy));

        console.log('Production feeds_projection');
        console.log(result);
        
        return result;
    }
    
    
    this.estimateFeedsSows = function(){

        const list_sows      = navigation.pigFarm.managerSowBoar.dataSowList;
        
        const list_feed_estimate = [];
        
        // Compute feed needs for each sow in the next 
        // MAX_NUM_MONTHS_FEED_PROJECTION months
        if (list_sows){ 
            for (const cur_entry of list_sows){
                const cur_sow_feed = new SowFeeds(cur_entry);
                const cur_feed_estimate = cur_sow_feed.computeFeedNeeds();
                list_feed_estimate.push(cur_feed_estimate );
            } 
        }
        
        
        // Compute feed needs for each gilt in the next 
        // MAX_NUM_MONTHS_FEED_PROJECTION months
        const list_gilts    = navigation.pigFarm.managerSowBoar.dataGiltList;
        
        if (list_gilts){
            for (const cur_entry of list_gilts){
                const cur_sow_feed = new SowFeeds(cur_entry);
                const cur_feed_estimate = cur_sow_feed.computeFeedNeeds();
                list_feed_estimate.push(cur_feed_estimate );
            }
        }
        
        
        // Compute feed needs for each boar in the next 
        // MAX_NUM_MONTHS_FEED_PROJECTION months
        const list_boars    = navigation.pigFarm.managerSowBoar.dataBoarList;
        // TODO: Add boar feed estimation
        
        const result = combineFeedEstimatesSowBoarGilt(list_feed_estimate);
        
        console.log('Feed estimate SowBoar gilt');
        console.log(result)
        return result;
        
    }
    
    
    
    
    
    
    /**
     * Populate the feed estimate table with combined data
     * @param {Array} feed_estimate - Array of monthly feed estimates
     */
    this.populateFeedEstimate = function(feed_estimate){
        if (!feed_estimate || feed_estimate.length === 0) {
            elemTableEstimateBody.innerHTML = `
                <tr><td colspan="5" style="text-align:center; padding:20px; color:#888;">
                    No entries found for feed estimation
                </td></tr>
            `;
            elemEstFeedCost.textContent = '';
            return;
        }
        
        // Helper function to format money: round to nearest 100 and add commas
        const formatMoney = function(amount) {
            if (!amount) return '';
            const rounded = Math.round(amount / 100) * 100;
            return rounded.toLocaleString('en-US');
        };
        
        // Update month headers
        const monthHeaders = [elemThMonth1, elemThMonth2, elemThMonth3, elemThMonth4];
        for (let i = 0; i < monthHeaders.length && i < feed_estimate.length; i++) {
            const dateStr = feed_estimate[i].date_to_buy;
            if (dateStr) {
                const dateObj = new Date(dateStr);
                const month = dateObj.toLocaleString('en-US', { month: 'short' });
                const day = dateObj.getDate();
                monthHeaders[i].textContent = `${month} ${day} (sacks)`;
            }
        }
        
        // Clear remaining headers
        for (let i = feed_estimate.length; i < monthHeaders.length; i++) {
            monthHeaders[i].textContent = '';
        }
        
        // Define feed types to display (in order)
        const feedTypes = ['gestating', 'lactating', 'prestarter', 'starter', 'grower', 'finisher'];
        const feedLabels = {
            'gestating': 'Gesta',
            'lactating': 'Lacta',
            'prestarter': 'PreStart',
            'starter': 'Starter',
            'grower': 'Grower',
            'finisher': 'Finisher'
        };
        
        // Build table rows
        let html = '';
        let totalCost = 0;
        
        // Feed type rows (using sacks)
        for (const feedType of feedTypes) {
            let rowHtml = `<tr><td>${feedLabels[feedType]}</td>`;
            let hasData = false;
            
            for (let i = 0; i < feed_estimate.length; i++) {
                const monthData = feed_estimate[i];
                const sacks = monthData.feeds_sacks && monthData.feeds_sacks[feedType] 
                    ? monthData.feeds_sacks[feedType] 
                    : '';
                if (sacks) hasData = true;
                rowHtml += `<td style="text-align:center">${sacks}</td>`;
            }
            
            // Fill remaining columns if less than 4 months
            for (let i = feed_estimate.length; i < 4; i++) {
                rowHtml += `<td></td>`;
            }
            
            rowHtml += `</tr>`;
            if (hasData) {
                html += rowHtml;
            }
        }
        
        // Estimated cost row
        let costRowHtml = `<tr><td><strong>Est. Cost</strong></td>`;
        
        for (let i = 0; i < feed_estimate.length; i++) {
            const monthData = feed_estimate[i];
            const cost = monthData.estimated_cost || 0;
            totalCost += cost;
            costRowHtml += `<td>${formatMoney(cost)}</td>`;
        }
        
        // Fill remaining columns if less than 4 months
        for (let i = feed_estimate.length; i < 4; i++) {
            costRowHtml += `<td></td>`;
        }
        
        costRowHtml += `</tr>`;
        html += costRowHtml;
        
        elemTableEstimateBody.innerHTML = html;
        
        // Display total estimated feed cost
        elemEstFeedCost.textContent = formatMoney(totalCost);
    }
}
