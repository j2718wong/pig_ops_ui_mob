// page_feeds_consumed_chart.js

// May 31, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}         from '../common/page_view_basic.js';
import {calculateNumDaysSinceInsem}  from '../common/page_view_basic.js';


import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE,
        PIG_PROD_TYPE,
        PROD_STATUS}            from '../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}         from '../../utils.js';

import {ComponentNavLeftRight}  from '../common/ui/comp_nav_left_right.js';



export function PageFeedsConsumedChart(input_settings){
    PageViewPigFarmPage.call(this);
    
    const TAG                   = 'PageFeedsConsumedChart';
    
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
    
    let elemIdUpdateNumCrates   = null;
    let elemIdShowSample        = null;
    
    let elemIdConsumedChart     = null;
 
    
    let elemPageInfo            = null;
    let elemLabelToday          = null;
    let elemDateToday           = null;
    
    let elemUpdateNumCrates     = null;
    let elemShowSample          = null;
    
    let elemConsumedChart       = null;

    
    let dtCurrentDate           = null;

    let data4MFarmFeedBuyList   = null;
    let data4MFeedBalanceList   = null;
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this._writeInlineStyle = function(){
        const html = `
        <style>
            .feed-type-selector select {
                cursor: pointer;
            }
            .feed-type-selector select:hover {
                border-color: #1e3a8a;
            }
            .bar-container {
                min-width: 40px;
            }
            .bar {
                transition: height 0.3s ease;
                cursor: pointer;
            }
            .bar:hover {
                opacity: 0.8;
            }
            .bar-value {
                font-weight: 600;
                color: #333;
            }
            @media (max-width: 768px) {
                .bar-label {
                    font-size: 1.1rem !important;
                }
                .bar-value {
                    font-size: 1.2rem !important;
                }
                .bar-container {
                    min-width: 30px;
                }
            }
        </style>
        `;
        return html;
    }
    
    
    this.render = function(){
        let label_page_title    = 'Feeds Consumed';
        
        let label_see_sample    = 'See Sample Schedule';
        
        
        let page_info   = `
            This will chart your feed consumption.
        `;
        
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_page_title    = helper.getSimpleTranslation('navigation.nav_links.Financials3') || label_page_title;
   
        
        label_see_sample    = helper.getSimpleTranslation('page_farrowing_schedule.labels.see_sample') || label_see_sample;
        
        //page_info           = helper.getSimpleTranslation('page_info.farrowing_sched') || page_info;
        
        
        componentNavLeftRight   = new ComponentNavLeftRight({
           uniqueKey:           settings.uniqueKey,
           elemDivContainer:    elemDivContainer,
           pageTitle:           label_page_title
        });
        
        
        elemIdPageInfo          = `${settings.uniqueKey}-page-info`;
        

        elemIdShowSample        = `${settings.uniqueKey}-show-sample`;
        
        elemIdConsumedChart     = `${settings.uniqueKey}-consumed-chart`;
        
        
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
    
    <div id="${elemIdConsumedChart}"></div>

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
     
        elemShowSample          = elemDivContainer.querySelector('#'+elemIdShowSample);
        
        elemConsumedChart       = elemDivContainer.querySelector('#'+elemIdConsumedChart);
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

        
    }
    
    
    this.renderPage = function(page_data){
        thisObj.show();
    }
    
    
    
    this.show = function(){
        thisObj.debugNavHistory(TAG);
        
        navigation.curPageNavigated.pageData = null;
        navigation.curPageNavigated.renderPageFunc = thisObj.renderPage;
        
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        
        const reference_date = this.calculateRefMonthStart();
        const dont_save_to_cache = true;
        
        if (data4MFeedBalanceList == null){
            const callback_success_feed_buy = function(data){
                data4MFarmFeedBuyList = data;
                thisObj.plotFeedConsumption();
            };
            
            
            const callback_success_feed_balance = function(data){
                data4MFeedBalanceList = data;
                
                navigation.pigFarm.requestDataPigFarmFeedBuyList(reference_date, 
                    callback_success_feed_buy, null, null, dont_save_to_cache);
            };
            
            navigation.pigFarm.requestDataPigFarmFeedBalance(reference_date, 
                callback_success_feed_balance, null, null, dont_save_to_cache);
        }
    }
    
    
    this.calculateRefMonthStart = function(today) {
        // If no date provided, use today's date
        const currentDate = today ? new Date(today) : new Date();
        
        // Create a copy and set to first day of current month FIRST
        const refDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        
        // Then subtract 3 months
        refDate.setMonth(refDate.getMonth() - 3);
        
        // Format as YYYY-MM-DD
        const year = refDate.getFullYear();
        const month = String(refDate.getMonth() + 1).padStart(2, '0');
        
        return `${year}-${month}-01`;
    }
    
    
    this.plotFeedConsumption = function() {
        const transformed_feed_buy = this.transformFeedBuyToFeedBalanceEntry();
        
        console.log(`data4MFeedBalanceList`);
        console.log(data4MFeedBalanceList);
        
        // Merge both lists
        const allEntries = [...data4MFeedBalanceList, ...transformed_feed_buy];
        
        // Sort by date_balance ascending (oldest first for calculation)
        allEntries.sort((a, b) => new Date(a.date_balance) - new Date(b.date_balance));
        
        // Define feed types in display order
        const feedTypes = [
            { key: 'num_gestating', label: 'Gesta' },
            { key: 'num_lactating', label: 'Lacta' },
            { key: 'num_starter',   label: 'Starter' },
            { key: 'num_grower',    label: 'Grower' },
            { key: 'num_finisher',  label: 'Finisher' }
        ];
        
        // Group entries by month
        const monthlyData = {};
        const monthsList = [];
        
        allEntries.forEach(entry => {
            const date = new Date(entry.date_balance);
            const year = date.getFullYear();
            const month = date.getMonth();
            const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
            const monthLabel = date.toLocaleString('default', { month: 'short' }); // Jan, Feb, Mar
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = {
                    key: monthKey,
                    label: monthLabel,
                    year: year,
                    month: month,
                    feedBalanceEnd: {},  // Last feed balance of the month per feed type
                    feedBuyTotal: {}     // Total feed buy of the month per feed type
                };
                monthsList.push(monthKey);
            }
            
            // Aggregate feed buy totals (for transformed entries)
            if (entry.is_feed_buy === 1 && entry.feed_balance) {
                entry.feed_balance.forEach(fb => {
                    feedTypes.forEach(type => {
                        const value = fb[type.key];
                        if (value && value > 0) {
                            monthlyData[monthKey].feedBuyTotal[type.key] = 
                                (monthlyData[monthKey].feedBuyTotal[type.key] || 0) + value;
                        }
                    });
                });
            }
            
            // Track feed balance end (last entry of the month - overwrite since sorted ascending)
            if (entry.feed_balance && !entry.is_feed_buy) {
                entry.feed_balance.forEach(fb => {
                    feedTypes.forEach(type => {
                        const value = fb[type.key];
                        if (value !== undefined && value !== null) {
                            monthlyData[monthKey].feedBalanceEnd[type.key] = value;
                        }
                    });
                });
            }
        });
        
        // Sort months chronologically (oldest first)
        monthsList.sort();
        
        // Get month labels (e.g., "Feb", "Mar", "Apr", "May")
        const monthLabels = monthsList.map(m => monthlyData[m].label);
        
        // Function to get the last available feed balance before a given month
        function getLastFeedBalance(monthIndex, feedTypeKey) {
            // Start from previous month and go backwards
            for (let i = monthIndex - 1; i >= 0; i--) {
                const prevMonth = monthsList[i];
                const balance = monthlyData[prevMonth].feedBalanceEnd[feedTypeKey];
                if (balance !== undefined && balance !== null && balance !== 0) {
                    return balance;
                }
            }
            // If no previous balance found, return 0
            return 0;
        }
        
        // Function to get the first feed balance in current month (if no ending balance)
        function getFirstFeedBalance(monthKey, feedTypeKey) {
            // Find the first feed_balance entry in this month
            const monthEntries = allEntries.filter(e => {
                const date = new Date(e.date_balance);
                const entryMonthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                return entryMonthKey === monthKey && !e.is_feed_buy && e.feed_balance;
            });
            
            if (monthEntries.length > 0) {
                // Get the first entry (earliest date in month)
                for (const entry of monthEntries) {
                    for (const fb of entry.feed_balance) {
                        const value = fb[feedTypeKey];
                        if (value !== undefined && value !== null && value !== 0) {
                            return value;
                        }
                    }
                }
            }
            return null;
        }
        
        // Calculate consumption per month
        function calculateConsumptionData(feedTypeKey) {
            const consumptionData = [];
            let previousBalance = 0;
            
            for (let i = 0; i < monthsList.length; i++) {
                const monthKey = monthsList[i];
                const feedBuyTotal = monthlyData[monthKey].feedBuyTotal[feedTypeKey] || 0;
                let feedBalanceEnd = monthlyData[monthKey].feedBalanceEnd[feedTypeKey];
                
                // If no feed balance at end of month, try to get first balance of the month
                if (feedBalanceEnd === undefined || feedBalanceEnd === null) {
                    const firstBalance = getFirstFeedBalance(monthKey, feedTypeKey);
                    if (firstBalance !== null) {
                        feedBalanceEnd = firstBalance;
                    } else {
                        feedBalanceEnd = 0;
                    }
                }
                
                // Get previous month's balance (look back for last non-zero balance)
                let previousMonthBalance = previousBalance;
                if (previousBalance === 0 && i > 0) {
                    previousMonthBalance = getLastFeedBalance(i, feedTypeKey);
                }
                
                // Total available = feed bought this month + previous month's balance
                const totalAvailable = feedBuyTotal + previousMonthBalance;
                
                // Consumed = total available - remaining balance
                let consumed = totalAvailable - feedBalanceEnd;
                
                // Ensure consumed is not negative (due to data inconsistencies)
                consumed = Math.max(0, consumed);
                
                consumptionData.push(consumed);
                
                // Update previous balance for next month
                previousBalance = feedBalanceEnd;
            }
            
            return consumptionData;
        }
        
        // Create selector and chart container
        const selectorHtml = `
            <div class="feed-type-selector" style="margin: 20px 0; text-align: center;">
                <label for="feedTypeSelect" style="font-weight: 600; margin-right: 10px;">Feed Type:</label>
                <select id="feedTypeSelect" style="padding: 8px 16px; border-radius: 6px; border: 1px solid #ddd; font-size: 1rem;">
                    ${feedTypes.map(type => `<option value="${type.key}">${type.label}</option>`).join('')}
                </select>
            </div>
        `;
        
        elemConsumedChart.innerHTML = selectorHtml + '<div id="chartContainer" style="width: 100%; min-height: 400px;"></div>';
        
        let currentFeedType = 'num_gestating';
        
        function renderChart(feedTypeKey) {
            const consumptionData = calculateConsumptionData(feedTypeKey);
            const feedTypeLabel = feedTypes.find(t => t.key === feedTypeKey)?.label || feedTypeKey;
            
            // Check if there's any data to display
            const hasData = consumptionData.some(v => v > 0) || monthsList.length > 0;
            
            if (!hasData || monthsList.length === 0) {
                const chartContainer = document.getElementById('chartContainer');
                if (chartContainer) {
                    chartContainer.innerHTML = `
                        <div style="text-align: center; padding: 60px; color: #999;">
                            <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
                            <div>No feed consumption data available for the selected period.</div>
                            <div style="font-size: 12px; margin-top: 8px;">Please add feed balances or feed purchases to see chart.</div>
                        </div>
                    `;
                }
                return;
            }
            
            // Calculate max value for y-axis
            const maxValue = Math.max(...consumptionData, 1);
            const chartHeight = 300;
            
            // Build bar chart HTML
            let barsHtml = '';
            for (let i = 0; i < monthsList.length; i++) {
                const value = consumptionData[i];
                const barHeight = (value / maxValue) * chartHeight;
                const barColor = value > 0 ? '#2e7d64' : '#ddd';
                
                barsHtml += `
                    <div class="bar-container" style="display: flex; flex-direction: column; align-items: center; min-width: 60px; margin: 0 8px;">
                        <div class="bar-value" style="font-size: 1.2rem; font-weight: bold; margin-bottom: 6px;">${value.toFixed(1)}</div>
                        <div class="bar" style="width: 50px; height: ${barHeight}px; background: ${barColor}; border-radius: 6px 6px 0 0; transition: height 0.3s; cursor: pointer;"></div>
                        <div class="bar-label" style="font-size: 1.1rem; margin-top: 8px; font-weight: 500;">${monthLabels[i]}</div>
                    </div>
                `;
            }
            
            // Add tooltip to show formula breakdown
            const chartHtml = `
                <div style="padding: 20px; background: #f9f9f9; border-radius: 12px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h3 style="margin: 0; color: #1e3a8a;">${feedTypeLabel} Consumed(sacks)</h3>
                    </div>
                    <div style="display: flex; justify-content: center; align-items: flex-end; min-height: ${chartHeight + 80}px; overflow-x: auto; padding: 10px 0;">
                        <div style="display: flex; align-items: flex-end;">
                            ${barsHtml}
                        </div>
                    </div>
                    
                </div>
            `;
            
            const chartContainer = document.getElementById('chartContainer');
            if (chartContainer) {
                chartContainer.innerHTML = chartHtml;
            }
        }
        
        // Add event listener to selector
        const feedTypeSelect = document.getElementById('feedTypeSelect');
        if (feedTypeSelect) {
            feedTypeSelect.addEventListener('change', (e) => {
                currentFeedType = e.target.value;
                renderChart(currentFeedType);
            });
        }
        
        // Handle empty data
        if (monthsList.length === 0) {
            elemConsumedChart.innerHTML = `
                <div style="text-align: center; padding: 60px; color: #999;">
                    <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
                    <div>No feed consumption data available for the selected period.</div>
                    <div style="font-size: 12px; margin-top: 8px;">Please add feed balances or feed purchases to see chart.</div>
                </div>
            `;
            return;
        }
        
        // Initial render
        renderChart(currentFeedType);
    }
    
    
    this.transformFeedBuyToFeedBalanceEntry = function(){
        // Transform feed_buy entries to feed_balance format
        const transformedBuys = data4MFarmFeedBuyList.map(buy => {
            // Initialize all feed type quantities to 0 (in sacks)
            const feedQuantities = {
                num_gestating: 0,
                num_lactating: 0,
                num_booster: 0,
                num_prestarter: 0,
                num_starter: 0,
                num_grower: 0,
                num_finisher: 0
            };
            
            // Aggregate quantities from feed_items (in sacks)
            if (buy.feed_items && buy.feed_items.length > 0) {
                for (const item of buy.feed_items) {
                    const feedTypeName = item.feed_type.name;
                    const quantity = item.feed_item.quantity;  // Number of sacks
                    
                    // Map feed_type.name to feed_balance field
                    switch (feedTypeName) {
                        case 'GESTA':
                            feedQuantities.num_gestating += quantity;
                            break;
                        case 'LACTA':
                            feedQuantities.num_lactating += quantity;
                            break;
                        case 'BOST':
                            feedQuantities.num_booster += quantity;
                            break;
                        case 'PRES':
                            feedQuantities.num_prestarter += quantity;
                            break;
                        case 'START':
                            feedQuantities.num_starter += quantity;
                            break;
                        case 'GROW':
                            feedQuantities.num_grower += quantity;
                            break;
                        case 'FINISH':
                            feedQuantities.num_finisher += quantity;
                            break;
                        default:
                            console.warn('Unknown feed type:', feedTypeName);
                    }
                }
            }
            
            // Create feed_balance object and filter out null/0 values
            const feedBalance = {
                hid: null
            };
            
            if (feedQuantities.num_gestating > 0){
                feedBalance.num_gestating = feedQuantities.num_gestating;
            }
            
            if (feedQuantities.num_lactating > 0){
                feedBalance.num_lactating = feedQuantities.num_lactating;
            }
            
            if (feedQuantities.num_booster > 0){
                feedBalance.num_booster = feedQuantities.num_booster;
            }
            
            if (feedQuantities.num_prestarter > 0){
                feedBalance.num_prestarter = feedQuantities.num_prestarter;
            }
            
            if (feedQuantities.num_starter > 0){
                feedBalance.num_starter = feedQuantities.num_starter;
            }
            
            if (feedQuantities.num_grower > 0){
                feedBalance.num_grower = feedQuantities.num_grower;
            }
            
            if (feedQuantities.num_finisher > 0){
                feedBalance.num_finisher = feedQuantities.num_finisher
            }
            
            
            return {
                date_balance: buy.pf_feed_buy.date_buy,
                is_feed_buy: 1,
                feed_balance: [feedBalance]
            };
        });
        
        return transformedBuys;
    }
    
    
}
