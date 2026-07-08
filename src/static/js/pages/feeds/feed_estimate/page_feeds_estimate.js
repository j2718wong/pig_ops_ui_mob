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

import {UiInputCheckBox}        from '../../common/ui/input_checkbox.js';

import {PigProductionFeeds}     from './pig_production_feeds.js';

import {SowFeeds, BoarFeeds,
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
    
    let elemUiIncFixedExpenses  = null;
    
    let dtCurrentDate           = null;
    
    // Current filter state
    let currentFilter           = 'all'; // 'all', 'sow_boar', 'fattening'
    
    // Estimated data expenses
    let estimateProd      = null;
    let estimateBreeding  = null;
    let estimateCombined  = null;
    
    // Categorized fixed expenses per month
    const catFixedExpenses = {
        staff:      0,
        utilities:  0,
        others:     0
    };
        
    
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
        
        let label_see_sample    = 'See Sample Estimate data';

        let label_all           = 'All';
        let label_sow_boar      = 'Sow/Boar';
        let label_fattening     = 'Fattening';
        
        
        let page_info   = `
            This will help you estimate your feed needs and cost for the next 4 months.
            The estimate includes your breeding pigs and fatteners until harvest.
        `;
        
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_page_title    = helper.getSimpleTranslation('navigation.nav_links.Financials3') || label_page_title;
        label_today         = helper.getSimpleTranslation('common_app.labels.today') || label_today;
        label_see_sample    = helper.getSimpleTranslation('page_farrowing_schedule.labels.see_sample') || label_see_sample;
        
        label_all           = helper.getSimpleTranslation('page_feeds_estimate.labels.all') || label_all;
        label_sow_boar      = helper.getSimpleTranslation('page_feeds_estimate.labels.sow_boar') || label_sow_boar;
        label_fattening     = helper.getSimpleTranslation('page_feeds_estimate.labels.fattening') || label_fattening;
        
        page_info           = helper.getSimpleTranslation('page_info.feeds_estimate') || page_info;
        
        
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
        
        
        elemUiIncFixedExpenses  = new UiInputCheckBox({
            uniqueKey:          `${settings.uniqueKey}-inc-fixed-expenses`,
        
            textLabel:          '',
            checkBoxLabel:      'Include Fixed Expenses',
            helpText:           null,  
            
            onChangeFunc:       thisObj.onChangeIncludeFixedExpenses
        });
    
        
        
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
                            <button class="filter-button" data-filter="fattening">Fattening</button>
                        </div>
                    </div>
                </div>
            </div>
            
        `;
        
        
        const html_inc_fixed_expenses    = elemUiIncFixedExpenses.getHtml();
           
        const html = `

${html_style}

<div class="mobile-container">
    ${html_nav}
    
    <div class="mobile-info-box" id="${elemIdPageInfo}">
        ${page_info}
    </div>
    
    
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
                <td>Est. Feed Cost</td>
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
          
    ${html_inc_fixed_expenses}
    
    <div id="${elemIdDebug}"></div>

</div>
        `;
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        componentNavLeftRight.afterHtmlRender();
        elemUiIncFixedExpenses.afterHtmlRender();
        
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
            navigation.managerNavLinks.onClickNavFeedsExpenses(null, true);
        };
        
          
        componentNavLeftRight.callbackNavRight = function(){
            // TODO - to fixed
            navigation.managerNavLinks.onClickNavSummaryReports();
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
            thisObj.onClickShowSample({
                title:      'Sample Feeds Estimate Data',
                img_src:    '/static_m/images/mar/mar_feeds_estimate.png',
                img_alt:    'Sample Feeds Estimate Data'
            });
        });
    }
    
    
    this.renderPage = function(page_data){
        thisObj.show();
    }
    
    
    this._loadFixedExpenses = function(){
        // Get PigFarm latest pig farm Fixed monthly expenses
        const fixedExpenses = navigation.pigFarm.dataFixedExpenses;
        
        if (fixedExpenses == null){
            
        }
        else{
            // Classify fixed expenses into just 3 categories
            if (fixedExpenses){
                catFixedExpenses.staff = fixedExpenses.fixed_expenses.staff || 0;
                
                let utilities = 0;
                let others = 0;
                utilities   += fixedExpenses.fixed_expenses.electric || 0;
                utilities   += fixedExpenses.fixed_expenses.water || 0;
                utilities   += fixedExpenses.fixed_expenses.internet || 0;
                
                others      += fixedExpenses.fixed_expenses.fuel || 0;
                others      += fixedExpenses.fixed_expenses.supplies || 0;
                others      += fixedExpenses.fixed_expenses.other || 0;
                
                catFixedExpenses.utilities  = utilities;
                catFixedExpenses.others     = others; 
            } 
        }        
    }
    
    
    /**
     * Called by page_fixed_expenses.js after a successful save,
     * so the feeds estimate page can refresh the displayed fixed expenses
     * without requiring a full page reload.
     */
    this.onFixedExpensesUpdated = function() {
        // Reload fixed expenses from the shared data (catFixedExpenses)
        thisObj._loadFixedExpenses();
        
        // If the "Include Fixed Expenses" checkbox is currently checked,
        // re-render the fixed expense rows with the updated values.
        if (elemUiIncFixedExpenses && elemUiIncFixedExpenses.isChecked()) {
            thisObj.onChangeIncludeFixedExpenses(null, true);
        }
    };
    
    
    this.show = function(){
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        const s_dt_current = formatDate(dtCurrentDate, FORMAT_COMPACT);
        
        elemDateToday.textContent = s_dt_current;
        
        
        // Check if there is an update of navigation.pigFarm.dataFixedExpenses data
        const ver_num_fixed_expenses = navigation.pigFarm.dataVerNum.fixed_expenses;
        
        const last_server_ver_num = navigation.pigFarm.lastDataVerNumReq.dataVerNum;
        
        if (last_server_ver_num){
            const server_ver_num = last_server_ver_num[DATA_VER_NUM_PIG_FARM.FIXED_EXPENSES];
            if (server_ver_num > ver_num_fixed_expenses){
                const callback_success = function(){
                    thisObj._loadFixedExpenses();
                };
                
                navigation.pigFarm.requestDataPigFarmFixedExpenses();
            }
            else{
                thisObj._loadFixedExpenses();
            }
        }
        else{
            thisObj._loadFixedExpenses();
        }
        
                
        
        
        // Get production feed estimates
        estimateProd = this.estimateFeedsProduction();
        
        // Get breeding feed estimates (sows + gilts + boars)
        estimateBreeding = this.estimateFeedsSows();
        
        // Combine both for "All" view
        estimateCombined = this.combineEstimates(estimateProd, estimateBreeding);
        
        if (estimateCombined && estimateCombined.length > 0){
            elemShowSample.style.display =  'none';
        }
        else{
            elemShowSample.style.display =  'block';
        }
        
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
                dataToShow = estimateCombined || [];
                break;
            case 'sow_boar':
                dataToShow = estimateBreeding || [];
                break;
            case 'fattening':
                dataToShow = estimateProd || [];
                break;
            default:
                dataToShow = estimateCombined || [];
        }
        
        this.populateFeedEstimate(dataToShow);
        
        // If the "Include Fixed Expenses" checkbox is checked, re-apply
        // the fixed expense rows (populateFeedEstimate rebuilds the entire
        // tbody, which wipes them out).
        if (elemUiIncFixedExpenses && elemUiIncFixedExpenses.isChecked()) {
            thisObj.onChangeIncludeFixedExpenses(null, true);
        }
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

        //console.log('Production feeds_projection');
        //console.log(result);
        
        return result;
    }
    
    
    this.estimateFeedsSows = function(){
        const list_feed_estimate = [];
        
        const list_sows      = navigation.pigFarm.managerSowBoar.dataSowList;
        
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
        
        if (list_boars){
            for (const cur_entry of list_boars){
                const cur_boar_feed = new BoarFeeds(cur_entry);
                const cur_feed_estimate = cur_boar_feed.computeFeedNeeds();
                list_feed_estimate.push(cur_feed_estimate );
            }
        }
        
        
        const result = combineFeedEstimatesSowBoarGilt(list_feed_estimate);
        
        //console.log('Feed estimate SowBoar gilt');
        //console.log(result)
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
        const feedTypes = ['gestating', 'lactating', 'booster', 'prestarter', 
                            'starter', 'grower', 'finisher'];
        const feedLabels = {
            'gestating':    'Gesta',
            'lactating':    'Lacta',
            'booster':      'Booster',  // TODO double check
            'prestarter':   'PreStart',
            'starter':      'Starter',
            'grower':       'Grower',
            'finisher':     'Finisher'
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
            costRowHtml += `<td style="text-align:center;">${formatMoney(cost)}</td>`;
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
    
    
    this.onChangeIncludeFixedExpenses = function(event, isChecked){
        // Get the current feed estimate data
        let dataToShow = [];
        
        switch(currentFilter) {
            case 'all':
                dataToShow = estimateCombined || [];
                break;
            case 'sow_boar':
                dataToShow = estimateBreeding || [];
                break;
            case 'fattening':
                dataToShow = estimateProd || [];
                break;
            default:
                dataToShow = estimateCombined || [];
        }
        
        if (!dataToShow || dataToShow.length === 0) {
            return;
        }
        
        // Helper function to format money
        const formatMoney = function(amount) {
            if (!amount || isNaN(amount)) return '0';
            const rounded = Math.round(amount / 100) * 100;
            return rounded.toLocaleString('en-US');
        };
        
        // Get fixed expense values
        const staffCost = catFixedExpenses.staff || 0;
        const utilitiesCost = catFixedExpenses.utilities || 0;
        const othersCost = catFixedExpenses.others || 0;
        const totalFixedCost = staffCost + utilitiesCost + othersCost;
        
        console.log('Fixed expenses:', { staffCost, utilitiesCost, othersCost, totalFixedCost });
        
        // Check if fixed expense rows already exist
        const existingRows = elemTableEstimateBody.querySelectorAll('.fixed-expense-row');
        const existingTotalRow = elemTableEstimateBody.querySelector('.total-cost-row');
        
        if (isChecked) {
            // Remove existing rows first if any
            for (const row of existingRows) {
                row.remove();
            }
            if (existingTotalRow) {
                existingTotalRow.remove();
            }
            
            // Add fixed expense rows
            let fixedExpensesHtml = '';
            
            // Staff row
            let staffHtml = `<tr class="fixed-expense-row"><td>Staff</td>`;
            for (let i = 0; i < dataToShow.length; i++) {
                staffHtml += `<td style="text-align:center">${formatMoney(staffCost)}</td>`;
            }
            for (let i = dataToShow.length; i < 4; i++) {
                staffHtml += `<td></td>`;
            }
            staffHtml += `</tr>`;
            fixedExpensesHtml += staffHtml;
            
            // Utilities row
            let utilitiesHtml = `<tr class="fixed-expense-row"><td>Utilities</td>`;
            for (let i = 0; i < dataToShow.length; i++) {
                utilitiesHtml += `<td style="text-align:center">${formatMoney(utilitiesCost)}</td>`;
            }
            for (let i = dataToShow.length; i < 4; i++) {
                utilitiesHtml += `<td></td>`;
            }
            utilitiesHtml += `</tr>`;
            fixedExpensesHtml += utilitiesHtml;
            
            // Others row
            let othersHtml = `<tr class="fixed-expense-row"><td>Others</td>`;
            for (let i = 0; i < dataToShow.length; i++) {
                othersHtml += `<td style="text-align:center">${formatMoney(othersCost)}</td>`;
            }
            for (let i = dataToShow.length; i < 4; i++) {
                othersHtml += `<td></td>`;
            }
            othersHtml += `</tr>`;
            fixedExpensesHtml += othersHtml;
            
            // Calculate and add Est. Total Cost row
            let totalCostHtml = `<tr class="total-cost-row"><td><strong>Est. Total Cost</strong></td>`;
            
            for (let i = 0; i < dataToShow.length; i++) {
                const feedCost = dataToShow[i].estimated_cost || 0;
                const totalCost = feedCost + totalFixedCost;
                totalCostHtml += `<td style="text-align:center; font-weight:600; color:var(--corporate-blue);">${formatMoney(totalCost)}</td>`;
            }
            for (let i = dataToShow.length; i < 4; i++) {
                totalCostHtml += `<td></td>`;
            }
            totalCostHtml += `</tr>`;
            
            // Add the fixed expense rows
            elemTableEstimateBody.insertAdjacentHTML('beforeend', fixedExpensesHtml);
            elemTableEstimateBody.insertAdjacentHTML('beforeend', totalCostHtml);
            
        } else {
            // Remove fixed expense rows
            for (const row of existingRows) {
                row.remove();
            }
            if (existingTotalRow) {
                existingTotalRow.remove();
            }
            
            // Update total cost to show only feed cost
            let totalFeedCost = 0;
            for (const monthData of dataToShow) {
                totalFeedCost += monthData.estimated_cost || 0;
            }
            elemEstFeedCost.textContent = formatMoney(totalFeedCost);
        }
    }
}
