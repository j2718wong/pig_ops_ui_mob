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
            
            
            .feed-type-selector {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: #f8f9fa;
                padding: 10px 20px;
                border-radius: 40px;
                margin: 15px 20px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            
            .feed-type-arrow {
                background: #1e3a8a;
                color: white;
                border: none;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 1.2rem;
                transition: all 0.2s;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            
            .feed-type-arrow:hover {
                background: #2e4a9a;
                transform: scale(1.05);
            }
            
            .feed-type-arrow:active {
                transform: scale(0.95);
            }
            
            .feed-type-arrow.disabled,
            .feed-type-arrow:disabled {
                background: #ccc;
                cursor: not-allowed;
                transform: none;
            }
            
            .feed-type-label {
                font-size: 1.3rem;
                font-weight: 600;
                color: #1e3a8a;
                min-width: 120px;
                text-align: center;
                padding: 8px 16px;
                background: white;
                border-radius: 30px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }
            
            @media (max-width: 768px) {
                .feed-type-label {
                    font-size: 1rem;
                    min-width: 100px;
                    padding: 6px 12px;
                }
                
                .feed-type-arrow {
                    width: 32px;
                    height: 32px;
                    font-size: 1rem;
                }
                
                .feed-type-selector {
                    padding: 8px 16px;
                    margin: 10px;
                }
            }
            
        </style>
        `;
        return html;
    }
    
    
    this.render = function(){
        let label_page_title    = 'Feeds Consumed';
        let label_today         = 'Today';
        
        let label_see_sample    = 'See Sample Schedule';
        
        
        let page_info   = `
            This will chart your feed consumption.
        `;
        
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_page_title    = helper.getSimpleTranslation('navigation.nav_links.Operations6') || label_page_title;
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
    
    <div style="text-align: center;">
        <span id="${elemIdLabelToday}">${label_today}</span>
        <span id="${elemIdDateToday}" style="color:blue; font-weight:600;"></span>
    </div>
    
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
     
        elemLabelToday          = elemDivContainer.querySelector('#'+elemIdLabelToday);
        elemDateToday           = elemDivContainer.querySelector('#'+elemIdDateToday);
     
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
        
        const s_dt_current = formatDate(dtCurrentDate, FORMAT_COMPACT);
        
        elemDateToday.textContent = s_dt_current;
        
        
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
        
        // Then subtract 4 months
        refDate.setMonth(refDate.getMonth() - 4);
        
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
            { key: 'num_prestarter', label: 'Prestarter' },
            { key: 'num_starter',   label: 'Starter' },
            { key: 'num_grower',    label: 'Grower' },
            { key: 'num_finisher',  label: 'Finisher' },
            { key: 'gesta_lacta',   label: 'Gesta+Lacta', isCombined: true }
        ];
        
        // Group entries by month
        const monthlyData = {};
        const monthsList = [];
        
        allEntries.forEach(entry => {
            const date = new Date(entry.date_balance);
            const year = date.getFullYear();
            const month = date.getMonth();
            const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
            const monthLabel = date.toLocaleString('default', { month: 'short' });
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = {
                    key: monthKey,
                    label: monthLabel,
                    year: year,
                    month: month,
                    feedBalanceEnd: {},
                    feedBuyTotal: {}
                };
                monthsList.push(monthKey);
            }
            
            // Aggregate feed buy totals (for transformed entries)
            if (entry.is_feed_buy === 1 && entry.feed_balance) {
                entry.feed_balance.forEach(fb => {
                    feedTypes.forEach(type => {
                        if (!type.isCombined) {
                            const value = fb[type.key];
                            if (value && value > 0) {
                                monthlyData[monthKey].feedBuyTotal[type.key] = 
                                    (monthlyData[monthKey].feedBuyTotal[type.key] || 0) + value;
                            }
                        }
                    });
                });
            }
            
            // Track feed balance end (last entry of the month)
            if (entry.feed_balance && !entry.is_feed_buy) {
                entry.feed_balance.forEach(fb => {
                    feedTypes.forEach(type => {
                        if (!type.isCombined) {
                            const value = fb[type.key];
                            if (value !== undefined && value !== null) {
                                monthlyData[monthKey].feedBalanceEnd[type.key] = value;
                            }
                        }
                    });
                });
            }
        });
        
        // Sort months chronologically
        monthsList.sort();
        
        // Create display months (exclude the first month)
        const displayMonths = monthsList.slice(1);
        const displayMonthLabels = displayMonths.map(m => monthlyData[m].label);
        
        // Calculate consumption per month for a single feed type
        function calculateConsumptionData(feedTypeKey) {
            const consumptionData = [];
            let previousBalance = 0;
            
            for (let i = 0; i < monthsList.length; i++) {
                const monthKey = monthsList[i];
                const feedBuyTotal = monthlyData[monthKey].feedBuyTotal[feedTypeKey] || 0;
                
                let feedBalanceEnd;
                if (monthlyData[monthKey].feedBalanceEnd.hasOwnProperty(feedTypeKey)) {
                    feedBalanceEnd = monthlyData[monthKey].feedBalanceEnd[feedTypeKey];
                } else {
                    feedBalanceEnd = previousBalance;
                }
                
                const totalAvailable = feedBuyTotal + previousBalance;
                let consumed = totalAvailable - feedBalanceEnd;
                consumed = Math.max(0, consumed);
                
                consumptionData.push(consumed);
                previousBalance = feedBalanceEnd;
            }
            
            return consumptionData;
        }
        
        // Create selector and chart container
        const selectorHtml = `
            <div class="feed-type-selector">
                <button class="feed-type-arrow" id="feedTypePrev"><i class="fas fa-chevron-left"></i></button>
                <span class="feed-type-label" id="feedTypeLabel">${feedTypes[0].label}</span>
                <button class="feed-type-arrow" id="feedTypeNext"><i class="fas fa-chevron-right"></i></button>
            </div>
        `;
        
        elemConsumedChart.innerHTML = selectorHtml + '<div id="chartContainer" style="width: 100%; min-height: 400px;"></div>';
        
        let currentFeedTypeIndex = 0;
        let currentFeedType = feedTypes[currentFeedTypeIndex].key;
        let currentFeedTypeLabel = feedTypes[currentFeedTypeIndex].label;
        let isCombinedMode = feedTypes[currentFeedTypeIndex].isCombined || false;
        
        function updateFeedTypeLabel() {
            const labelElem = document.getElementById('feedTypeLabel');
            if (labelElem) {
                labelElem.textContent = feedTypes[currentFeedTypeIndex].label;
            }
        }
        
        function changeFeedType(delta) {
            const newIndex = currentFeedTypeIndex + delta;
            if (newIndex >= 0 && newIndex < feedTypes.length) {
                currentFeedTypeIndex = newIndex;
                currentFeedType = feedTypes[currentFeedTypeIndex].key;
                currentFeedTypeLabel = feedTypes[currentFeedTypeIndex].label;
                isCombinedMode = feedTypes[currentFeedTypeIndex].isCombined || false;
                updateFeedTypeLabel();
                renderChart();
            }
        }
        
        // Bind arrow buttons
        const prevBtn = document.getElementById('feedTypePrev');
        const nextBtn = document.getElementById('feedTypeNext');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => changeFeedType(-1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => changeFeedType(1));
        }
        
        function renderChart() {
            let chartHtml = '';
            
            // Special handling for Gesta+Lacta combined chart - STACKED VERSION
            if (isCombinedMode) {
                const gestaConsumption = calculateConsumptionData('num_gestating');
                const lactaConsumption = calculateConsumptionData('num_lactating');
                
                // Get data for display months only
                const gestaDisplay = [];
                const lactaDisplay = [];
                for (let i = 0; i < displayMonths.length; i++) {
                    const originalIndex = monthsList.indexOf(displayMonths[i]);
                    gestaDisplay.push(gestaConsumption[originalIndex]);
                    lactaDisplay.push(lactaConsumption[originalIndex]);
                }
                
                const hasData = gestaDisplay.some(v => v > 0) || lactaDisplay.some(v => v > 0);
                
                if (!hasData || displayMonths.length === 0) {
                    const chartContainer = document.getElementById('chartContainer');
                    if (chartContainer) {
                        chartContainer.innerHTML = `
                            <div style="text-align: center; padding: 60px; color: #999;">
                                <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
                                <div>No feed consumption data available for the selected period.</div>
                            </div>
                        `;
                    }
                    return;
                }
                
                // Calculate max value for y-axis (sum of both for each month)
                const maxValue = Math.max(...gestaDisplay.map((g, i) => g + lactaDisplay[i]), 1);
                const chartHeight = 300;
                
                let barsHtml = '';
                for (let i = 0; i < displayMonths.length; i++) {
                    const gestaValue = gestaDisplay[i];
                    const lactaValue = lactaDisplay[i];
                    const totalValue = gestaValue + lactaValue;
                    
                    // Calculate heights as percentages of max (stacked)
                    const gestaHeight = (gestaValue / maxValue) * chartHeight;
                    const lactaHeight = (lactaValue / maxValue) * chartHeight;
                    
                    barsHtml += `
                        <div class="bar-container" style="display: flex; flex-direction: column; align-items: center; min-width: 60px; margin: 0 8px;">
                            <div class="bar-value" style="font-size: 1.2rem; font-weight: bold; margin-bottom: 6px;">${totalValue.toFixed(1)}</div>
                            <div style="width: 50px; display: flex; flex-direction: column; justify-content: flex-end; height: ${chartHeight}px;">
                                <div style="height: ${lactaHeight}px; background: #e67e22; border-radius: 6px 6px 0 0; width: 100%; transition: height 0.3s;"></div>
                                <div style="height: ${gestaHeight}px; background: #2e7d64; border-radius: 0 0 6px 6px; width: 100%; transition: height 0.3s;"></div>
                            </div>
                            <div class="bar-label" style="font-size: 1.1rem; margin-top: 8px;">${displayMonthLabels[i]}</div>
                        </div>
                    `;
                }
                
                chartHtml = `
                    <div style="padding: 20px; background: #f9f9f9; border-radius: 12px;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h3 style="margin: 0; color: #1e3a8a;">Gesta + Lacta Consumed (sacks)</h3>
                            <div style="display: flex; justify-content: center; gap: 20px; margin-top: 10px;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="width: 20px; height: 20px; background: #e67e22; border-radius: 4px;"></div>
                                    <span style="font-size: 0.8rem;">Lacta</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="width: 20px; height: 20px; background: #2e7d64; border-radius: 4px;"></div>
                                    <span style="font-size: 0.8rem;">Gesta</span>
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: center; align-items: flex-end; min-height: ${chartHeight + 80}px; overflow-x: auto; padding: 10px 0;">
                            <div style="display: flex; align-items: flex-end;">
                                ${barsHtml}
                            </div>
                        </div>
                    </div>
                `;
            } else {
                // Regular single feed type chart
                const fullConsumptionData = calculateConsumptionData(currentFeedType);
                const feedTypeLabel = feedTypes.find(t => t.key === currentFeedType)?.label || currentFeedType;
                
                // Get consumption data for display months only
                const consumptionData = [];
                for (let i = 0; i < displayMonths.length; i++) {
                    const originalIndex = monthsList.indexOf(displayMonths[i]);
                    consumptionData.push(fullConsumptionData[originalIndex]);
                }
                
                const hasData = consumptionData.some(v => v > 0) || displayMonths.length > 0;
                
                if (!hasData || displayMonths.length === 0) {
                    const chartContainer = document.getElementById('chartContainer');
                    if (chartContainer) {
                        chartContainer.innerHTML = `
                            <div style="text-align: center; padding: 60px; color: #999;">
                                <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
                                <div>No feed consumption data available for the selected period.</div>
                            </div>
                        `;
                    }
                    return;
                }
                
                const maxValue = Math.max(...consumptionData, 1);
                const chartHeight = 300;
                
                let barsHtml = '';
                for (let i = 0; i < displayMonths.length; i++) {
                    const value = consumptionData[i];
                    const barHeight = (value / maxValue) * chartHeight;
                    const barColor = value > 0 ? '#2e7d64' : '#ddd';
                    
                    barsHtml += `
                        <div class="bar-container" style="display: flex; flex-direction: column; align-items: center; min-width: 60px; margin: 0 8px;">
                            <div class="bar-value" style="font-size: 1.2rem; font-weight: bold; margin-bottom: 6px;">${value.toFixed(1)}</div>
                            <div class="bar" style="width: 50px; height: ${barHeight}px; background: ${barColor}; border-radius: 6px 6px 0 0;"></div>
                            <div class="bar-label" style="font-size: 1.1rem; margin-top: 8px;">${displayMonthLabels[i]}</div>
                        </div>
                    `;
                }
                
                chartHtml = `
                    <div style="padding: 20px; background: #f9f9f9; border-radius: 12px;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h3 style="margin: 0; color: #1e3a8a;">${feedTypeLabel} Consumed (sacks)</h3>
                        </div>
                        <div style="display: flex; justify-content: center; align-items: flex-end; min-height: ${chartHeight + 80}px; overflow-x: auto; padding: 10px 0;">
                            <div style="display: flex; align-items: flex-end;">
                                ${barsHtml}
                            </div>
                        </div>
                    </div>
                `;
            }
            
            const chartContainer = document.getElementById('chartContainer');
            if (chartContainer) {
                chartContainer.innerHTML = chartHtml;
            }
        }
        
        if (displayMonths.length === 0) {
            elemConsumedChart.innerHTML = `
                <div style="text-align: center; padding: 60px; color: #999;">
                    <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
                    <div>No feed consumption data available for the selected period.</div>
                </div>
            `;
            return;
        }
        
        // Initial render
        updateFeedTypeLabel();
        renderChart();
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
