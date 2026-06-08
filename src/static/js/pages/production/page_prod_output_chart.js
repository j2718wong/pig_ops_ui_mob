// page_feeds_consumed_chart.js

// June 9, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}         from '../common/page_view_basic.js';


import {APPLICATION,
        PAGE_ID,
        DATA_VER_NUM_PIG_FARM}        from '../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}         from '../../utils.js';

import {ComponentNavLeftRight}  from '../common/ui/comp_nav_left_right.js';


const ANNUAL_PRODUCTION_OUTPUT     = 'superpig_prod_output';


export function PageProdOutputChart(input_settings){
    PageViewPigFarmPage.call(this);
    
    const TAG                   = 'PageProdOutputChart';
    
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
    
    let elemIdProdOutput        = null;
    let elemIdDebug             = null;
 
    
    let elemPageInfo            = null;
    let elemLabelToday          = null;
    let elemDateToday           = null;
    
    let elemShowSample          = null;
    
    let elemProdOutput          = null;
    let elemDebug               = null;
    
    
    let dtCurrentDate           = null;
    
    let latestFarmVerNum        = null;

    let dataProdOutputList  = null;
    let dataProdOutputVerNum= 0;

    
    
    
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
            
            
        </style>
        `;
        return html;
    }
    
    
    this.render = function(){
        let label_page_title    = 'Production Output';
        let label_today         = 'Today';
        
        let label_see_sample    = 'See Sample Production Output data';
        
        
        let page_info   = `
            This will chart annual production output.
        `;
        
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_page_title    = helper.getSimpleTranslation('navigation.nav_links.Production5') || label_page_title;
        label_today         = helper.getSimpleTranslation('common_app.labels.today') || label_today;
        
        //label_see_sample    = helper.getSimpleTranslation('page_farrowing_schedule.labels.see_sample') || label_see_sample;
        
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
        
        elemIdProdOutput        = `${settings.uniqueKey}-consumed-chart`;
        
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
    
    <div id="${elemIdProdOutput}"></div>
    
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
        
        elemProdOutput          = elemDivContainer.querySelector('#'+elemIdProdOutput);
        
        elemDebug               = elemDivContainer.querySelector('#'+elemIdDebug);
    }
    
    
    this._processAfterHtmlRender = function(){
        
        componentNavLeftRight.callbackNavLeft = function(){
            navigation.managerNavLinks.onClickNavProdHistory();
        };
        
          
        componentNavLeftRight.callbackNavRight = function(){
            navigation.managerNavLinks.onClickNavProdNotPregnant();
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
        
        if (dataProdOutputList == null){
            // Note at this point, the 
            //  - navigation.pigFarm.dataVerNum.prod_output
            //
            // may not be loaded yet in pigFarm; 
     
            
            const callback_success = function(data){
                latestFarmVerNum = data;
                
                // This will load cached prod_output and plot prod_output graph.
                thisObj.loadCachedDataProdOutput();
            
            };
            
            const callback_offline = function(){
                // This will cached feed_balance, cached feed_buy and plot consumption graph.
                thisObj.loadCachedDataProdOutput();
            };
            
            
            navigation.pigFarm.requestPigFarmDataVerNum(null, callback_success,
                callback_offline);
            
            
        }
        else{
            thisObj.plotProductionOutput();
        }
    }
    
    
    this.loadCachedDataProdOutput = function(){
        
        const key = ANNUAL_PRODUCTION_OUTPUT;
        const cached = localStorage.getItem(key);
        if (!cached) {
            // This will request production_output and plot graph.
            this.requestServerData();
            return;
        }
        
        
        const pig_farm_hid  = navigation.pigFarm.getPigFarmHid();
        
        const data = JSON.parse(cached);
        
        // Check if pig_farm_hid matched
        const cached_pig_farm_hid = data.pig_farm_hid;
        if (cached_pig_farm_hid != pig_farm_hid){
            // This will request production_output and plot graph.
            this.requestServerData();
            return;
        }
        
        
        // Optionally expire cache after 7 days
        if (data.cached_at && (Date.now() - data.cached_at) > APPLICATION.NUM_MSECS_CACHE_DATA) {
            // Cache too old, fetch fresh
            // This will request production_output and plot graph.
            this.requestServerData();
            return;
        }
        
        
        // Update data source
        dataProdOutputList      = data.data;
        dataProdOutputVerNum    = data.ver_num;
        
            
        // Check if dataProdOutputVerNum is same with server_ver_num
        let server_ver_num;
        
        if (latestFarmVerNum){
            server_ver_num = latestFarmVerNum[DATA_VER_NUM_PIG_FARM.PIG_PROD];
        }
        else{
            server_ver_num = navigation.pigFarm.dataVerNum.pig_prod;
        }
        
        
        if (Number.isInteger(dataProdOutputVerNum) == false){
            // There was some messed up at initial saving
            dataProdOutputVerNum = 0;
        }
        
        if (server_ver_num > dataProdOutputVerNum){
            this.requestServerData();
            return;
        }

        thisObj.plotProductionOutput();
    }
    

    /** This will request prod output data and plots graph.*/
    this.requestServerData = function(){

        
        const callback_success = function(data){
            dataProdOutputList      = data.data;
            dataProdOutputVerNum    = data.ver_num;
            
            // Save this to cache; 

            
            // Update local storage
            const key = ANNUAL_PRODUCTION_OUTPUT;
            const local_data = {
                pig_farm_hid:   navigation.pigFarm.getPigFarmHid(),
                ver_num:        dataProdOutputVerNum,
                data:           dataProdOutputList,
                cached_at:      Date.now()
            };
            localStorage.setItem(key, JSON.stringify(local_data)); 
            
            thisObj.plotProductionOutput();
        };
        
        
        navigation.pigFarm.requestDataPigFarmProdOutput( 
            callback_success, null, null);
    }
    
    
   
    
    this.plotProductionOutput = function() {
        
        // If no Prod Output data, show empty state
        if (!dataProdOutputList || dataProdOutputList.length === 0) {
            elemShowSample.style.display = 'block';
            
            elemProdOutput.innerHTML = `
                <div style="text-align: center; padding: 60px;">
                    <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
                    <div style="font-size: 1.1rem;">No Production data available.</div>
                    <div style="font-size: 1.1rem; margin-top: 8px;">Add weaned or lactating pigs to see production output chart.</div>
                </div>
            `;
            return;
        }
        
        elemShowSample.style.display = 'none';
        
        // Sort years ascending (oldest to newest)
        const sortedYears = [...dataProdOutputList].sort((a, b) => a.year - b.year);
        
        // Get last 4 years (or all if less than 4)
        const displayYears = sortedYears.slice(-4);
        const yearLabels = displayYears.map(y => y.year.toString());
        
        // Extract data for stacked bars
        const weanedData = displayYears.map(y => y.total_weaned || 0);
        const lactatingData = displayYears.map(y => y.total_lactating || 0);
        const totalData = displayYears.map(y => y.total_pigs_output || 0);
        
        // Calculate max value for y-axis
        const maxValue = Math.max(...totalData, 1);
        const chartHeight = 300;
        
        // Create selector and chart container (no feed type selector needed, just show production output)
        const chartHtml = `
            <div style="padding: 20px; background: #f9f9f9; border-radius: 12px; margin-top: 20px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #1e3a8a;">Annual Production Output</h3>
                    <div style="display: flex; justify-content: center; gap: 20px; margin-top: 10px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 20px; height: 20px; background: #e67e22; border-radius: 4px;"></div>
                            <span style="font-size: 0.8rem;">Lactating</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 20px; height: 20px; background: #2e7d64; border-radius: 4px;"></div>
                            <span style="font-size: 0.8rem;">Weaned</span>
                        </div>
                    </div>
                </div>
                <div style="display: flex; justify-content: center; align-items: flex-end; min-height: ${chartHeight + 80}px; overflow-x: auto; padding: 10px 0;">
                    <div style="display: flex; align-items: flex-end;">
        `;
        
        let barsHtml = '';
        for (let i = 0; i < displayYears.length; i++) {
            const year = displayYears[i].year;
            const weaned = weanedData[i];
            const lactating = lactatingData[i];
            const total = totalData[i];
            
            // Calculate heights as percentages of max
            const weanedHeight = (weaned / maxValue) * chartHeight;
            const lactatingHeight = (lactating / maxValue) * chartHeight;
            
            barsHtml += `
                <div class="bar-container" style="display: flex; flex-direction: column; align-items: center; min-width: 80px; margin: 0 12px;">
                    <div class="bar-value" style="font-size: 1.2rem; font-weight: bold; margin-bottom: 6px;">${total}</div>
                    <div style="width: 60px; display: flex; flex-direction: column; justify-content: flex-end; height: ${chartHeight}px;">
                        <div style="height: ${lactatingHeight}px; background: #e67e22; border-radius: 6px 6px 0 0; width: 100%; transition: height 0.3s;"></div>
                        <div style="height: ${weanedHeight}px; background: #2e7d64; border-radius: 0 0 6px 6px; width: 100%; transition: height 0.3s;"></div>
                    </div>
                    <div class="bar-label" style="font-size: 1.1rem; margin-top: 8px; font-weight: 500;">${year}</div>
                </div>
            `;
        }
        
        const footerHtml = `
                    </div>
                </div>
                <div style="text-align: center; margin-top: 16px; font-size: 0.8rem; color: #666;">
                    <span>📊 Weaned pigs + Currently lactating pigs = Total annual output</span>
                </div>
            </div>
        `;
        
        elemProdOutput.innerHTML = chartHtml + barsHtml + footerHtml;
    }
        
    
}
