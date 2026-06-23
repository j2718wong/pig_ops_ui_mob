// page_fixed_expenses.js

// June 21, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../common/page_view_basic.js';

import {APPLICATION,
        PAGE_ID}                from '../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}         from '../../utils.js';

import {ComponentNavLeftRight}  from '../common/ui/comp_nav_left_right.js';



export function PageFixedExpenses(input_settings){
    PageViewPigFarmPage.call(this);
    
    const TAG                   = 'PageFixedExpenses';
    
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
    
    let elemIdTdStaff           = null;
    let elemIdTdElectric        = null;
    let elemIdTdWater           = null;
    let elemIdTdInternet        = null;
    let elemIdTdFuel            = null;
    let elemIdTdSupplies        = null;
    let elemIdTdOther           = null;
    
    
    
    let elemIdDebug             = null; 
        
    
    let elemPageInfo            = null;
    let elemLabelToday          = null;
    let elemDateToday           = null;
    
    let elemShowSample          = null;
    
    let elemTdStaff             = null;
    let elemTdElectric          = null;
    let elemTdWater             = null;
    let elemTdInternet          = null;
    let elemTdFuel              = null;
    let elemTdSupplies          = null;
    let elemTdOther             = null;
    
    
    let elemDebug               = null;
    
    let dtCurrentDate           = null;
    
    // Current filter state
    let currentFilter           = 'all'; // 'all', 'sow_boar', 'fattening'
    
    // Cached data
    let estimateProd      = null;
    let estimateBreeding  = null;
    let estimateCombined  = null;
    
    
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
        let label_page_title    = 'Fixed Expenses';
        let label_today         = 'Today';
        
        let label_see_sample    = 'See Sample Estimate data';

        
        
        let page_info   = `
            Record your average fixed monthly expenses to estimate total costs.
            This helps you estimate the profitability of your fatteners.
        `;
        
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_page_title    = helper.getSimpleTranslation('navigation.nav_links.Financials3') || label_page_title;
        label_today         = helper.getSimpleTranslation('common_app.labels.today') || label_today;
        label_see_sample    = helper.getSimpleTranslation('page_farrowing_schedule.labels.see_sample') || label_see_sample;
        
        
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
        
        elemIdTdStaff           = `${settings.uniqueKey}-staff`;
        elemIdTdElectric        = `${settings.uniqueKey}-electric`;
        elemIdTdWater           = `${settings.uniqueKey}-water`;
        elemIdTdInternet        = `${settings.uniqueKey}-internet`;
        elemIdTdFuel            = `${settings.uniqueKey}-fuel`;
        elemIdTdSupplies        = `${settings.uniqueKey}-supplies`;
        elemIdTdOther           = `${settings.uniqueKey}-other`;
        
        elemIdDebug             = `${settings.uniqueKey}-debug`;
        
        const html_style        = thisObj._writeInlineStyle();
        
        const html_nav          = componentNavLeftRight.getHtml();   
 
       
           
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
    
    <br>
    <h2 class="tab-title">
        Monthly Expenses
    </h2>
    
    <table class="data-table">
        <colgroup>
            <col style="width: 60%;">
            <col style="width: 40%;">
        </colgroup>
        
        <tbody>
            <tr>
                <td>Staff</td>
                <td id="${elemIdTdStaff}">0.0</td>
            </tr>
            
            <tr>
                <td>Electric</td>
                <td id="${elemIdTdElectric}">--</td>
            </tr>
            
            <tr>
                <td>Water</td>
                <td id="${elemIdTdWater}">--</td>
            </tr>
            
            <tr>
                <td>Internet</td>
                <td id="${elemIdTdInternet}">--</td>
            </tr>
            
            <tr>
                <td>Fuel</td>
                <td id="${elemIdTdFuel}">--</td>
            </tr>
            
            <tr>
                <td>Supplies</td>
                <td id="${elemIdTdSupplies}">--</td>
            </tr>
            
            <tr>
                <td>Supplies</td>
                <td id="${elemIdTdOther}">--</td>
            </tr>
            
        </tbody>
    </table>

    
    
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
        
        elemTdStaff             = elemDivContainer.querySelector('#'+elemIdTdStaff);
        elemTdElectric          = elemDivContainer.querySelector('#'+elemIdTdElectric);
        elemTdWater             = elemDivContainer.querySelector('#'+elemIdTdWater);
        elemTdInternet          = elemDivContainer.querySelector('#'+elemIdTdInternet);
        elemTdFuel              = elemDivContainer.querySelector('#'+elemIdTdFuel);
        elemTdSupplies          = elemDivContainer.querySelector('#'+elemIdTdSupplies);
        elemTdOther             = elemDivContainer.querySelector('#'+elemIdTdOther);
        
        
        elemDebug               = elemDivContainer.querySelector('#'+elemIdDebug);
    }
    
    
    this._processAfterHtmlRender = function(){
        
        componentNavLeftRight.callbackNavLeft = function(){
            
            //navigation.managerNavLinks.onClickNavFeedsExpenses(null, true);
        };
        
          
        componentNavLeftRight.callbackNavRight = function(){
            
            //navigation.managerNavLinks.onClickNavSummaryReports();
        };
        
        
        componentNavLeftRight.bindEventListeners();
        

    }
    
    
    this._bindEventListeners = function(){
        
       
    }
    
    
    this.renderPage = function(page_data){
        thisObj.show();
    }
    
    
    
    this.show = function(){
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        const s_dt_current = formatDate(dtCurrentDate, FORMAT_COMPACT);
        
        elemDateToday.textContent = s_dt_current;
        
        
    }
    

}
