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
        PROD_STATUS,
        DATA_VER_NUM_PIG_FARM}        from '../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}         from '../../utils.js';

import {ComponentNavLeftRight}  from '../common/ui/comp_nav_left_right.js';


const FEED_BALANCE_CONSUMED     = 'superpig_feed_balance_consumed';
const FEED_BUY_CONSUMED         = 'superpig_feed_buy_consumed';


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
    
    let latestFarmVerNum        = null;

    let dataFarmFeedBuyList     = null;
    let dataFeedBalanceList     = null;
    
    
    let dataFarmFeedBuyVerNum   = 0;
    let dataFeedBalanceVerNum   = 0;
    
    
    
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
        
        let label_see_sample    = 'See Sample Feeds Consumed data';
        
        
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
    
    <div style="margin: 8px 0;" id="${elemIdShowSample}" style="display:none;">
        <a href="javascript:void(0)" class="text-link" >
            ${label_see_sample}
        </a>
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

        elemShowSample.addEventListener('click', function() {
            thisObj.onClickShowSample({
                title:      'Sample Feeds Consumed Data',
                img_src:    '/static_m/images/mar/mar_feeds_consumed.png',
                img_alt:    'Sample Feeds Consumed Data'
            });
        });
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
        
        if (dataFeedBalanceList == null){
            // Note at this point, the 
            //  - navigation.pigFarm.dataVerNum.feed_balance
            //  - navigation.pigFarm.dataVerNum.feed_buy 
            //
            // may not be loaded yet in pigFarm; because these info are loaded
            // from cache to app, if user navigates to feed_balance and feed_buy 
            // list pages;
     
            
            const callback_success = function(data){
                latestFarmVerNum = data;
                
                // This will cached feed_balance, cached feed_buy and plot consumption graph.
                thisObj.loadCachedDataFeedBalance();
            
            };
            
            const callback_offline = function(){
                // This will cached feed_balance, cached feed_buy and plot consumption graph.
                thisObj.loadCachedDataFeedBalance();
            };
            
            
            navigation.pigFarm.requestPigFarmDataVerNum(null, callback_success,
                callback_offline);
            
            
        }
        else{
            thisObj.plotFeedConsumption();
        }
    }
    
    
    this.loadCachedDataFeedBalance = function(){
        
        const key = FEED_BALANCE_CONSUMED;
        const cached = localStorage.getItem(key);
        if (!cached) {
            // This will request feed_balance, request  feed_buy and plot consumption graph.
            this.requestServerData();
            return;
        }
        
        
        const pig_farm_hid  = navigation.pigFarm.getPigFarmHid();
        
        const data = JSON.parse(cached);
        
        // Check if pig_farm_hid matched
        const cached_pig_farm_hid = data.pig_farm_hid;
        if (cached_pig_farm_hid != pig_farm_hid){
            // This will request feed_balance, request  feed_buy and plot consumption graph.
            this.requestServerData();
            return;
        }
        
        
        // Optionally expire cache after 7 days
        if (data.cached_at && (Date.now() - data.cached_at) > APPLICATION.NUM_MSECS_CACHE_DATA) {
            // Cache too old, fetch fresh
            // This will request feed_balance, request  feed_buy and plot consumption graph.
            this.requestServerData();
            return;
        }
        
        
        // Update data source
        dataFeedBalanceList     = data.data;
        dataFeedBalanceVerNum   = data.ver_num;
            
            
        // Check if dataFeedBalanceVerNum is same with server_ver_num
        let server_ver_num;
        
        if (latestFarmVerNum){
            server_ver_num = latestFarmVerNum[DATA_VER_NUM_PIG_FARM.FEED_BALANCE];
        }
        else{
            server_ver_num = navigation.pigFarm.dataVerNum.feed_balance;
        }
        
        if (server_ver_num > dataFeedBalanceVerNum){
            this.requestServerData();
            return;
        }
        
        
        // Load cached Feed Buy
        this.loadCachedDataFeedBuy(); 
    }
    
    
    this.loadCachedDataFeedBuy = function(){
        
        const key = FEED_BUY_CONSUMED;
        const cached = localStorage.getItem(key);
        if (!cached) {
            // This will  request  feed_buy and plot consumption graph.
            this.requestServerDataFeedBuyOnly();
            return;
        }
        
        
        const pig_farm_hid  = navigation.pigFarm.getPigFarmHid();
        
        const data = JSON.parse(cached);
        
        // Check if pig_farm_hid matched
        const cached_pig_farm_hid = data.pig_farm_hid;
        if (cached_pig_farm_hid != pig_farm_hid){
            // This will request  feed_buy and plot consumption graph.
            this.requestServerDataFeedBuyOnly();
            return;
        }
        
        
        // Optionally expire cache after 7 days
        if (data.cached_at && (Date.now() - data.cached_at) > APPLICATION.NUM_MSECS_CACHE_DATA) {
            // Cache too old, fetch fresh
            // This will request feed_balance, request  feed_buy and plot consumption graph.
            this.requestServerDataFeedBuyOnly();
            return;
        }
        
        
        // Update data source
        dataFarmFeedBuyList     = data.data;
        dataFarmFeedBuyVerNum   = data.ver_num;
            
            
        // Check if dataFarmFeedBuyVerNum is same with server_ver_num
        let server_ver_num;
        
        if (latestFarmVerNum){
            server_ver_num = latestFarmVerNum[DATA_VER_NUM_PIG_FARM.FEED_BUY];
        }
        else{
            server_ver_num = navigation.pigFarm.dataVerNum.feed_buy;
        }
        
        if (server_ver_num > dataFarmFeedBuyVerNum){
            this.requestServerDataFeedBuyOnly();
            return;
        }
        
        
        thisObj.plotFeedConsumption();
    }
    
    
    
    /** This will request feed_balance, request  feed_buy and plot consumption graph.*/
    this.requestServerData = function(){
        const reference_date        = this.calculateRefMonthStart();
        const dont_save_to_cache    = true; // instruction to not save cache at pigFarm
        
        
        const callback_success_feed_buy = function(data){
            dataFarmFeedBuyList     = data.data;
            dataFarmFeedBuyVerNum       = data.ver_num;
            
            // Save this to cache; this is saved separately from
            // navigation.pigFarm.dataFarmFeedBuyList
            
            // Update local storage
            const key = FEED_BUY_CONSUMED;
            const local_data = {
                pig_farm_hid:   navigation.pigFarm.getPigFarmHid(),
                ver_num:        dataFarmFeedBuyVerNum,
                data:           dataFarmFeedBuyList,
                cached_at:      Date.now()
            };
            localStorage.setItem(key, JSON.stringify(local_data)); 
            
            thisObj.plotFeedConsumption();
        };
        
        
        const callback_success_feed_balance = function(data){
            dataFeedBalanceList     = data.data;
            dataFeedBalanceVerNum   = data.ver_num;
            
            // Save this to cache; this is saved separately from
            // navigation.pigFarm.dataFeedBalanceList
            
            // Update local storage
            const key = FEED_BALANCE_CONSUMED;
            const local_data = {
                pig_farm_hid:   navigation.pigFarm.getPigFarmHid(),
                ver_num:        dataFeedBalanceVerNum,
                data:           dataFeedBalanceList,
                cached_at:      Date.now()
            };
            localStorage.setItem(key, JSON.stringify(local_data)); 
            
            navigation.pigFarm.requestDataPigFarmFeedBuyList(reference_date, 
                callback_success_feed_buy, null, null, dont_save_to_cache);
        };
        
        
        navigation.pigFarm.requestDataPigFarmFeedBalance(reference_date, 
            callback_success_feed_balance, null, null, dont_save_to_cache);
    }
    
    
    this.requestServerDataFeedBuyOnly = function(){
        const reference_date        = this.calculateRefMonthStart();
        const dont_save_to_cache    = true; // instruction to not save cache at pigFarm
        
        const callback_success_feed_buy = function(data){
            dataFarmFeedBuyList     = data.data;
            dataFarmFeedBuyVerNum       = data.ver_num;
            
            // Save this to cache; this is saved separately from
            // navigation.pigFarm.dataFarmFeedBuyList
            
            // Update local storage
            const key = FEED_BUY_CONSUMED;
            const local_data = {
                pig_farm_hid:   navigation.pigFarm.getPigFarmHid(),
                ver_num:        dataFarmFeedBuyVerNum,
                data:           dataFarmFeedBuyList,
                cached_at:      Date.now()
            };
            localStorage.setItem(key, JSON.stringify(local_data)); 
            
            thisObj.plotFeedConsumption();
        };
        
        
        navigation.pigFarm.requestDataPigFarmFeedBuyList(reference_date, 
                callback_success_feed_buy, null, null, dont_save_to_cache);
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
        
        // Merge both lists
        const allEntries = [...dataFeedBalanceList, ...transformed_feed_buy];
        
        // Sort by date_balance descending (newest first for processing)
        const descendingEntries = [...allEntries];
        descendingEntries.sort((a, b) => new Date(b.date_balance) - new Date(a.date_balance));
        
        // Sum feeds in each entry (combine multiple feed_balance objects within same date)
        const descEntriesAdded = this.sumFeedsInEveryEntry(descendingEntries);
        
        console.log(`descEntriesAdded`);
        console.log(descEntriesAdded);
        
        // Get consumption per month using the new method
        const monthlyConsumption = this.getFeedConsumedPerMonth(descEntriesAdded);
        
        console.log(`monthlyConsumption result:`, monthlyConsumption);
        
        // If no consumption data, show empty state
        if (!monthlyConsumption || monthlyConsumption.length === 0) {
            elemShowSample.style.display = 'block';
            
            elemConsumedChart.innerHTML = `
                <div style="text-align: center; padding: 60px;>
                    <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
                    <div style="font-size: 1.1rem;">No feed consumption data available for the selected period.</div>
                    <div style="font-size: 1.1rem; margin-top: 8px;">Please add feed balances or feed purchases to see chart.</div>
                </div>
            `;
            return;
        }
        
        elemShowSample.style.display = 'none';
        
        // Extract month labels and sort by date (oldest to newest for display)
        const sortedMonths = [...monthlyConsumption].sort((a, b) => {
            if (a.key < b.key) return -1;
            if (a.key > b.key) return 1;
            return 0;
        });
        
        // Get last 4 months (or all if less than 4)
        const displayMonths = sortedMonths.slice(-4);
        const monthLabels = displayMonths.map(m => {
            const date = new Date(m.key + '-01');
            return date.toLocaleString('default', { month: 'short' });
        });
        
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
        
        function getConsumptionDataForFeedType(feedTypeKey) {
            // Get consumption values for each display month
            return displayMonths.map(month => {
                return month.consumed[feedTypeKey] || 0;
            });
        }
        
        function getCombinedGestaLactaData() {
            const gestaData = displayMonths.map(month => month.consumed.num_gestating || 0);
            const lactaData = displayMonths.map(month => month.consumed.num_lactating || 0);
            return { gestaData, lactaData };
        }
        
        function renderChart() {
            let chartHtml = '';
            
            // Special handling for Gesta+Lacta combined chart
            if (isCombinedMode) {
                const { gestaData, lactaData } = getCombinedGestaLactaData();
                
                const hasData = gestaData.some(v => v > 0) || lactaData.some(v => v > 0);
                
                if (!hasData) {
                    const chartContainer = document.getElementById('chartContainer');
                    if (chartContainer) {
                        chartContainer.innerHTML = `
                            <div style="text-align: center; padding: 60px; color: #999;">
                                <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
                                <div>No Gesta/Lacta consumption data available.</div>
                            </div>
                        `;
                    }
                    return;
                }
                
                // Calculate max value for y-axis (sum of both for each month)
                const maxValue = Math.max(...gestaData.map((g, i) => g + lactaData[i]), 1);
                const chartHeight = 300;
                
                let barsHtml = '';
                for (let i = 0; i < displayMonths.length; i++) {
                    const gestaValue = gestaData[i];
                    const lactaValue = lactaData[i];
                    const totalValue = gestaValue + lactaValue;
                    
                    const gestaHeight = (gestaValue / maxValue) * chartHeight;
                    const lactaHeight = (lactaValue / maxValue) * chartHeight;
                    
                    barsHtml += `
                        <div class="bar-container" style="display: flex; flex-direction: column; align-items: center; min-width: 60px; margin: 0 8px;">
                            <div class="bar-value" style="font-size: 1.2rem; font-weight: bold; margin-bottom: 6px;">${totalValue.toFixed(1)}</div>
                            <div style="width: 50px; display: flex; flex-direction: column; justify-content: flex-end; height: ${chartHeight}px;">
                                <div style="height: ${lactaHeight}px; background: #e67e22; border-radius: 6px 6px 0 0; width: 100%; transition: height 0.3s;"></div>
                                <div style="height: ${gestaHeight}px; background: #2e7d64; border-radius: 0 0 6px 6px; width: 100%; transition: height 0.3s;"></div>
                            </div>
                            <div class="bar-label" style="font-size: 1.1rem; margin-top: 8px;">${monthLabels[i]}</div>
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
                const consumptionData = getConsumptionDataForFeedType(currentFeedType);
                const feedTypeLabel = feedTypes.find(t => t.key === currentFeedType)?.label || currentFeedType;
                
                const hasData = consumptionData.some(v => v > 0);
                
                if (!hasData) {
                    const chartContainer = document.getElementById('chartContainer');
                    if (chartContainer) {
                        chartContainer.innerHTML = `
                            <div style="text-align: center; padding: 60px; color: #999;">
                                <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
                                <div>No ${feedTypeLabel} consumption data available.</div>
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
                            <div class="bar-label" style="font-size: 1.1rem; margin-top: 8px;">${monthLabels[i]}</div>
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
        
        // Initial render
        updateFeedTypeLabel();
        renderChart();
    }
    
    
    /* This is a sample data and expected feed consumption calculation;
    sample_data = [
      {
        "date_balance": "2026-05-30",
        "num_feeds": {
          "num_gestating": 0.5,
          "num_finisher": 1.5
        }
      },
      {
        "date_balance": "2026-05-23",
        "num_feeds": {
          "num_gestating": 2.5,                     delta_gesta = 2.5-.5 = 2
          "num_finisher": 2                         delta_finish = 2 - 1.5 = 0.5
        }
      },
      {
        "date_balance": "2026-05-19",
        "is_feed_buy": 1,
        "num_feeds": {
          "num_gestating": 3,
          "num_finisher": 2
        }
      },
      {
        "date_balance": "2026-05-16",
        "num_feeds": {
          "num_gestating": 1.5,                     delta_gesta = 3+1.5 -2.5 = 2
          "num_finisher": 1.5                       delta_finish = 2+1.5-2 = 1.5
        }
      },
      {
        "date_balance": "2026-05-09",
        "num_feeds": {
          "num_gestating": 3,                       delta_gesta = 3 - 1.5 = 1.5
          "num_finisher": 2                         delta_finish = 2-1.5 = .5
        }
      },
      {
        "date_balance": "2026-05-04",
        "is_feed_buy": 1,
        "num_feeds": {
          "num_gestating": 5,
          "num_finisher": 2
        }
      },
      {
        "date_balance": "2026-05-02",
        "num_feeds": {
          "num_gestating": 0.5,                     delta_gesta = 5+0.5-3 = 2.5
          "num_finisher": 1.5                       delta_finish =2+1.5-2=1.5
        }
      },
      {
        "date_balance": "2026-04-30",
        "num_feeds": {
          "num_gestating": 1,                       delta_gesta = 1-0.5 = 0.5           Total  gestating consumed  for May = 8.5
          "num_finisher": 2                         delta_finish = 2-1.5 = 0.5          Total  finisher consumed  for May = 4.5
        }
      },
      {
        "date_balance": "2026-04-24",
        "is_feed_buy": 1,
        "num_feeds": {
          "num_gestating": 2,
          "num_finisher": 2
        }

    ]
    */
    this.getFeedConsumedPerMonth = function(list_descending_input){
        if (!list_descending_input || list_descending_input.length == 0) {
            return [];
        }
        
        // No delta feed consumed if it is just 1 entry
        if (list_descending_input.length == 1){
            return [];
        }
        
        const result = [];
        let i = 0;
        let new_entry;
        let old_entry;
        let has_found_first_feed_balance = 0;
        
        // Skip initial feed buys at the beginning
        while (i < list_descending_input.length && list_descending_input[i].is_feed_buy) {
            i++;
        }
        
        if (i >= list_descending_input.length) {
            return []; // No feed balance entries found
        }
        
        let cur_month = null;
        let cur_key = null;
        
        while (i < list_descending_input.length - 1) {
            new_entry = list_descending_input[i];
            old_entry = list_descending_input[i + 1];
            
            // Get month key from current entry
            cur_key = new_entry.date_balance.substring(0, 7);
            
            // Create new month entry if key changes
            if (cur_month === null || cur_month.key !== cur_key) {
                cur_month = {
                    key: cur_key,
                    consumed: {},
                    delta_consumed: []
                };
                result.push(cur_month);
            }
            
            // Case 1: old_entry is a feed balance (no is_feed_buy flag)
            if (!old_entry.is_feed_buy) {
                // Direct feed balance to feed balance comparison
                const cur_delta = this.getFeedDifference(old_entry, new_entry);
                if (cur_delta && cur_delta.feeds_consumed) {
                    cur_month.delta_consumed.push(cur_delta);
                    
                    // Aggregate into consumed totals
                    for (const [feedType, amount] of Object.entries(cur_delta.feeds_consumed)) {
                        if (!cur_month.consumed[feedType]) {
                            cur_month.consumed[feedType] = 0;
                        }
                        cur_month.consumed[feedType] += amount;
                    }
                }
                i++;
                continue;
            }
            
            // Case 2: old_entry is a feed buy (or multiple consecutive feed buys)
            // Collect all consecutive feed buys and the next feed balance
            const entries_to_combine = [];
            let j = i + 1; // Start from the feed buy
            
            while (j < list_descending_input.length) {
                const cur_entry = list_descending_input[j];
                entries_to_combine.push(cur_entry);
                
                if (!cur_entry.is_feed_buy) {
                    // Found the feed balance entry, stop here
                    break;
                }
                j++;
            }
            
            // Combine all entries (feed buys + the final feed balance)
            const combined_feeds = this.combineConsecutiveEntries(entries_to_combine);
            
            // Get the feed difference between combined feeds and new_entry
            const cur_delta = this.getFeedDifference(combined_feeds, new_entry);
            if (cur_delta && cur_delta.feeds_consumed) {
                cur_month.delta_consumed.push(cur_delta);
                
                // Aggregate into consumed totals
                for (const [feedType, amount] of Object.entries(cur_delta.feeds_consumed)) {
                    if (!cur_month.consumed[feedType]) {
                        cur_month.consumed[feedType] = 0;
                    }
                    cur_month.consumed[feedType] += amount;
                }
            }
            
            // Move i to the index of the feed balance we just processed
            // The feed balance is at the end of entries_to_combine
            i = i + entries_to_combine.length;
        }
        
        return result;
    }

    
    /**
     * Combines consecutive entries (feed balance and/or feed buys) by summing their num_feeds.
     * This is useful for merging a feed buy with the next feed balance entry.
     * 
     * @param {Array} list_feed_entries - Array of feed entries (balance or buy) to combine
     * @returns {Object} - Combined object with summed num_feeds
     * 
     * ============================================================================
     * EXAMPLE 1: Combine feed buy + feed balance
     * ============================================================================
     * 
     * const list_feed_entries = [
     *     {
     *         "date_balance": "2026-05-19",
     *         "is_feed_buy": 1,
     *         "num_feeds": {
     *             "num_gestating": 3,
     *             "num_finisher": 2
     *         }
     *     },
     *     {
     *         "date_balance": "2026-05-16",
     *         "num_feeds": {
     *             "num_gestating": 1.5,
     *             "num_finisher": 1.5
     *         }
     *     }
     * ];
     * 
     * const result = combineConsecutiveEntries(list_feed_entries);
     * 
     * // OUTPUT:
     * // {
     * //     "num_feeds": {
     * //         "num_gestating": 4.5,   // 3 + 1.5 = 4.5
     * //         "num_finisher": 3.5     // 2 + 1.5 = 3.5
     * //     }
     * // }
     * 
     * ============================================================================
     * EXAMPLE 2: Combine multiple feed buys + feed balance
     * ============================================================================
     * 
     * const list_feed_entries = [
     *     {
     *         "date_balance": "2026-05-04",
     *         "is_feed_buy": 1,
     *         "num_feeds": {
     *             "num_gestating": 5,
     *             "num_finisher": 2
     *         }
     *     },
     *     {
     *         "date_balance": "2026-05-02",
     *         "num_feeds": {
     *             "num_gestating": 0.5,
     *             "num_finisher": 1.5
     *         }
     *     }
     * ];
     * 
     * const result = combineConsecutiveEntries(list_feed_entries);
     * 
     * // OUTPUT:
     * // {
     * //     "num_feeds": {
     * //         "num_gestating": 5.5,   // 5 + 0.5 = 5.5
     * //         "num_finisher": 3.5     // 2 + 1.5 = 3.5
     * //     }
     * // }
     * 
     * ============================================================================
     * EXAMPLE 3: Combine two feed balance entries (no feed buys)
     * ============================================================================
     * 
     * const list_feed_entries = [
     *     {
     *         "date_balance": "2026-05-09",
     *         "num_feeds": {
     *             "num_gestating": 3,
     *             "num_finisher": 2
     *         }
     *     },
     *     {
     *         "date_balance": "2026-05-02",
     *         "num_feeds": {
     *             "num_gestating": 0.5,
     *             "num_finisher": 1.5
     *         }
     *     }
     * ];
     * 
     * const result = combineConsecutiveEntries(list_feed_entries);
     * 
     * // OUTPUT:
     * // {
     * //     "num_feeds": {
     * //         "num_gestating": 3.5,   // 3 + 0.5 = 3.5
     * //         "num_finisher": 3.5     // 2 + 1.5 = 3.5
     * //     }
     * // }
     * 
     * ============================================================================
     * EXAMPLE 4: Handle missing num_feeds or empty objects
     * ============================================================================
     * 
     * const list_feed_entries = [
     *     {
     *         "date_balance": "2026-05-19",
     *         "is_feed_buy": 1,
     *         "num_feeds": {
     *             "num_gestating": 3,
     *             "num_finisher": 2
     *         }
     *     },
     *     {
     *         "date_balance": "2026-05-16",
     *         "num_feeds": {}  // Empty object
     *     }
     * ];
     * 
     * const result = combineConsecutiveEntries(list_feed_entries);
     * 
     * // OUTPUT:
     * // {
     * //     "num_feeds": {
     * //         "num_gestating": 3,   // Only from first entry
     * //         "num_finisher": 2
     * //     }
     * // }
     * 
     * ============================================================================
     * EXAMPLE 5: With additional feed types (lactating, booster, etc.)
     * ============================================================================
     * 
     * const list_feed_entries = [
     *     {
     *         "date_balance": "2026-04-11",
     *         "is_feed_buy": 1,
     *         "num_feeds": {
     *             "num_prestarter": 1,
     *             "num_starter": 1
     *         }
     *     },
     *     {
     *         "date_balance": "2026-04-11",
     *         "num_feeds": {
     *             "num_gestating": 2,
     *             "num_lactating": 1,
     *             "num_starter": 0.5,
     *             "num_finisher": 2
     *         }
     *     }
     * ];
     * 
     * const result = combineConsecutiveEntries(list_feed_entries);
     * 
     * // OUTPUT:
     * // {
     * //     "num_feeds": {
     * //         "num_prestarter": 1,
     * //         "num_starter": 1.5,    // 1 + 0.5 = 1.5
     * //         "num_gestating": 2,
     * //         "num_lactating": 1,
     * //         "num_finisher": 2
     * //     }
     * // }
     * 
     * ============================================================================
     * NOTES:
     * - The function preserves is_feed_buy flag only if ALL entries have it
     * - The date_balance from the first entry is preserved
     * - Missing or undefined num_feeds are treated as empty objects
     * - Zero values are not included in the result
     * 
     * ============================================================================
     */
    this.combineConsecutiveEntries = function(list_feed_entries) {
        if (!list_feed_entries || list_feed_entries.length === 0) {
            return null;
        }
        
        // If only one entry, return it as-is (but ensure num_feeds exists)
        if (list_feed_entries.length === 1) {
            const singleEntry = list_feed_entries[0];
            return {
                date_balance: singleEntry.date_balance,
                is_feed_buy: singleEntry.is_feed_buy === 1 ? 1 : undefined,
                num_feeds: singleEntry.num_feeds ? { ...singleEntry.num_feeds } : {}
            };
        }
        
        // Initialize result with first entry's properties
        const result = {
            date_balance: list_feed_entries[0].date_balance,
            num_feeds: {}
        };
        
        // Check if ALL entries have is_feed_buy flag
        const allAreFeedBuys = list_feed_entries.every(entry => entry.is_feed_buy === 1);
        if (allAreFeedBuys) {
            result.is_feed_buy = 1;
        }
        
        // Sum up all num_feeds from all entries
        for (const entry of list_feed_entries) {
            const feeds = entry.num_feeds || {};
            
            for (const [feedType, quantity] of Object.entries(feeds)) {
                if (quantity !== undefined && quantity !== null && quantity !== 0) {
                    if (!result.num_feeds[feedType]) {
                        result.num_feeds[feedType] = 0;
                    }
                    result.num_feeds[feedType] += quantity;
                }
            }
        }
        
        // Remove any zero values (clean up)
        for (const [feedType, quantity] of Object.entries(result.num_feeds)) {
            if (quantity === 0) {
                delete result.num_feeds[feedType];
            }
        }
        
        // If no feeds, return just the combined result with empty num_feeds
        if (Object.keys(result.num_feeds).length === 0) {
            result.num_feeds = {};
        }
        
        return result;
    }


    /**
     * Calculates the difference in feed quantities between two feed entries.
     * Determines how much of each feed type was consumed between the old and new entry.
     * 
     * @param {Object} old_entry - The earlier feed entry (previous state)
     * @param {Object} new_entry - The later feed entry (current state)
     * @returns {Object|null} - Object containing feeds_consumed, or null if no consumption
     * 
     * ============================================================================
     * EXAMPLE 1: Both entries have the same feed types (partial consumption)
     * ============================================================================
     * 
     * const old_entry = {
     *     date_balance: "2026-05-23",
     *     num_feeds: {
     *         num_gestating: 2.5,
     *         num_finisher: 2
     *     }
     * };
     * 
     * const new_entry = {
     *     date_balance: "2026-05-30",
     *     num_feeds: {
     *         num_gestating: 0.5,
     *         num_finisher: 1.5
     *     }
     * };
     * 
     * const result = getFeedDifference(old_entry, new_entry);
     * 
     * // OUTPUT:
     * // {
     * //     feeds_consumed: {
     * //         num_gestating: 2.0,    // 2.5 - 0.5 = 2.0 sacks consumed
     * //         num_finisher: 0.5      // 2.0 - 1.5 = 0.5 sacks consumed
     * //     }
     * // }
     * 
     * ============================================================================
     * EXAMPLE 2: Feed type missing in new entry (fully consumed)
     * ============================================================================
     * 
     * const old_entry = {
     *     num_feeds: {
     *         num_gestating: 3,
     *         num_lactating: 2,      // This feed type will be fully consumed
     *         num_finisher: 1
     *     }
     * };
     * 
     * const new_entry = {
     *     num_feeds: {
     *         num_gestating: 1,
     *         num_finisher: 1
     *         // num_lactating is missing - means it was completely used up
     *     }
     * };
     * 
     * // OUTPUT:
     * // {
     * //     feeds_consumed: {
     * //         num_gestating: 2,    // 3 - 1 = 2 sacks consumed
     * //         num_lactating: 2,    // 2 - 0 = 2 sacks (fully consumed, not recorded in new)
     * //         num_finisher: 0      // 1 - 1 = 0, not included because no consumption
     * //     }
     * // }
     * 
     * ============================================================================
     * EXAMPLE 3: New feed type appears (purchase, not consumption)
     * ============================================================================
     * 
     * const old_entry = {
     *     num_feeds: {
     *         num_gestating: 2
     *     }
     * };
     * 
     * const new_entry = {
     *     num_feeds: {
     *         num_gestating: 3,
     *         num_prestarter: 2      // New purchase - not recorded as consumption
     *     }
     * };
     * 
     * // OUTPUT:
     * // {
     * //     feeds_consumed: {
     * //         num_gestating: 0      // Not included because value increased (purchase)
     * //     }
     * // }
     * // Note: num_prestarter is new purchase, so no consumption recorded
     * 
     * ============================================================================
     * EXAMPLE 4: With feed buy (using combineTwoEntries first)
     * ============================================================================
     * 
     * // First combine feed buy with the balance entry using combineTwoEntries
     * const balanceEntry = { num_feeds: { num_gestating: 1.5 } };
     * const buyEntry = { is_feed_buy: 1, num_feeds: { num_gestating: 3 } };
     * const combined = combineTwoEntries(balanceEntry, buyEntry);
     * // combined = { num_feeds: { num_gestating: 4.5 } }
     * 
     * const newBalance = { num_feeds: { num_gestating: 2.5 } };
     * const consumption = getFeedDifference(combined, newBalance);
     * 
     * // OUTPUT:
     * // {
     * //     feeds_consumed: {
     * //         num_gestating: 2.0    // 4.5 - 2.5 = 2.0 sacks consumed
     * //     }
     * // }
     * 
     * ============================================================================
     * EXAMPLE 5: No consumption (values unchanged)
     * ============================================================================
     * 
     * const old_entry = {
     *     num_feeds: {
     *         num_gestating: 2.5
     *     }
     * };
     * 
     * const new_entry = {
     *     num_feeds: {
     *         num_gestating: 2.5
     *     }
     * };
     * 
     * const result = getFeedDifference(old_entry, new_entry);
     * 
     * // OUTPUT: null (no consumption occurred)
     * 
     * ============================================================================
     * EXAMPLE 6: Increase in quantity (purchase, no consumption)
     * ============================================================================
     * 
     * const old_entry = {
     *     num_feeds: {
     *         num_gestating: 1.5
     *     }
     * };
     * 
     * const new_entry = {
     *     num_feeds: {
     *         num_gestating: 2.5      // Increased - means purchase, not consumption
     *     }
     * };
     * 
     * const result = getFeedDifference(old_entry, new_entry);
     * 
     * // OUTPUT: null (consumption would be negative, so ignored)
     * 
     * ============================================================================
     * 
     * RULES SUMMARY:
     * 1. consumption = old_value - new_value (when both exist)
     * 2. If feed type in old but missing in new → fully consumed (consumption = old_value)
     * 3. If consumption is positive → included in result
     * 4. If consumption is zero or negative → not included (null for empty result)
     * 5. New feed types appearing only in new_entry → purchases, not consumption
     * 6. Values are rounded to 1 decimal place to handle floating point precision
     * 
     * ============================================================================
     */
    this.getFeedDifference = function(old_entry, new_entry){
        // Initialize result
        const result = {
            feeds_consumed: {}
        };
        
        // Get num_feeds from both entries (handle cases where num_feeds might be missing)
        const oldFeeds = old_entry.num_feeds || {};
        const newFeeds = new_entry.num_feeds || {};
        
        // Get all feed types from old entry (since consumption is based on what was there before)
        // Also include feed types that might appear in new entry but not old (these are new purchases, not consumption)
        const allFeedTypes = new Set([
            ...Object.keys(oldFeeds),
            ...Object.keys(newFeeds)
        ]);
        
        for (const feedType of allFeedTypes) {
            const oldValue = oldFeeds[feedType] || 0;
            const newValue = newFeeds[feedType] || 0;
            
            // If feed type exists in old entry, calculate consumption
            if (oldValue > 0) {
                let consumed = oldValue - newValue;
                
                // If feed type not found in new entry, it is fully consumed
                if (newFeeds[feedType] === undefined) {
                    consumed = oldValue;
                }
                
                // Only add if consumption is positive (greater than 0)
                if (consumed > 0) {
                    result.feeds_consumed[feedType] = Math.round(consumed * 10) / 10; // Round to 1 decimal
                }
            }
            // If feed type only in new entry (not in old), it's new purchase - no consumption recorded
        }
        
        // If no feeds consumed, return null
        if (Object.keys(result.feeds_consumed).length === 0) {
            return null;
        }
        
        return result;
    }
    
        
    this.sumFeedsInEveryEntry = function(list_combined_descending){
        if (!list_combined_descending || list_combined_descending.length === 0) {
            return [];
        }
        
        const result = [];
        
        for (const entry of list_combined_descending) {
            // Create base entry
            const newEntry = {
                date_balance: entry.date_balance
            };
            
            // Copy over is_feed_buy flag if it exists
            if (entry.is_feed_buy === 1) {
                newEntry.is_feed_buy = 1;
            }
            
            // Initialize aggregated feeds object
            const aggregatedFeeds = {};
            
            // Check if feed_balance exists and is an array
            if (entry.feed_balance && Array.isArray(entry.feed_balance)) {
                // Iterate through each feed_balance object
                for (const feedItem of entry.feed_balance) {
                    // Define all possible feed type keys to check
                    const feedTypeKeys = [
                        'num_gestating',
                        'num_lactating',
                        'num_booster',
                        'num_prestarter',
                        'num_starter',
                        'num_grower',
                        'num_finisher'
                    ];
                    
                    // Sum up each feed type
                    for (const key of feedTypeKeys) {
                        if (feedItem[key] !== undefined && feedItem[key] !== null && feedItem[key] !== 0) {
                            if (!aggregatedFeeds[key]) {
                                aggregatedFeeds[key] = 0;
                            }
                            aggregatedFeeds[key] += feedItem[key];
                        }
                    }
                }
            }
            
            // Only add num_feeds if there are any feeds
            if (Object.keys(aggregatedFeeds).length > 0) {
                newEntry.num_feeds = aggregatedFeeds;
            }
            
            result.push(newEntry);
        }
        
        return result;
    }

    
    this.transformFeedBuyToFeedBalanceEntry = function(){
        // Transform feed_buy entries to feed_balance format
        const transformedBuys = dataFarmFeedBuyList.map(buy => {
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
