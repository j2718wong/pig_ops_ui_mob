// page_date_calculator.js

// June 17, 2026
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

import {UiInputDatePicker}      from '../common/ui/input_datepicker.js';

import {ComponentNavLeftRight}  from '../common/ui/comp_nav_left_right.js';




export function PageDateCalculator(input_settings){
    PageViewPigFarmPage.call(this);
    
    const TAG                   = 'PageDateCalculator';
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    this.setNavigation(navigation);
    
    
    /*
    Typical input_settings
    {
        navigation:             this,
        uniqueKey:              'date-calculator' 
        pageTitle:              'Date Calculator'
    }   
    */  
    let settings                = input_settings;
    
    
    
    
    // This is needed as this will be first element to be rendered
    let elemDivContainer        = document.getElementById(settings.elemIdDivContainer);
    
    let componentNavLeftRight   = null;
    
    let elemIdPageInfo          = null;
    let elemIdLabelToday        = null;
    let elemIdDateToday         = null;
    
    let elemIdTdDateFarrow      = null;
    let elemIdTdExpectedBirth   = null;
    let elemIdTdBirthPlus45Days = null;
    let elemIdTdBirthPlus150Days= null;
    
    
    let elemPageInfo            = null;
    let elemLabelToday          = null;
    let elemDateToday           = null;
    
    let elemUiDateMating        = null;
    
    let elemTdDateFarrow        = null;
    let elemTdExpectedBirth     = null;
    let elemTdBirthPlus45Days   = null;
    let elemTdBirthPlus150Days  = null;
    
    
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
        let label_page_title    = 'Date Calculator';
        let label_today         = 'Today';
        
        let label_date_mating   = 'Date Mating or Insemination'; 
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_page_title    = helper.getSimpleTranslation('navigation.nav_links.Operations2_1') || label_page_title;
        label_today         = helper.getSimpleTranslation('common_app.labels.today') || label_today;
        label_date_mating   = helper.getSimpleTranslation('page_gestating_add.labels.date_mating') || label_date_mating;
        
        
        componentNavLeftRight   = new ComponentNavLeftRight({
           uniqueKey:           settings.uniqueKey,
           elemDivContainer:    elemDivContainer,
           pageTitle:           label_page_title
        });
        
        
        elemIdPageInfo          = `${settings.uniqueKey}-page-info`;
        
        elemIdLabelToday        = `${settings.uniqueKey}-label-today`;
        elemIdDateToday         = `${settings.uniqueKey}-date-today`;
        
        elemIdTdDateFarrow      = `${settings.uniqueKey}-date-farrow`;
        elemIdTdExpectedBirth   = `${settings.uniqueKey}-date-expected`;
        elemIdTdBirthPlus45Days = `${settings.uniqueKey}-birth-45-days`;
        elemIdTdBirthPlus150Days= `${settings.uniqueKey}-birth-150-days`;
        
        elemUiDateMating        = new UiInputDatePicker({
            uniqueKey:          `${settings.uniqueKey}-date-mating`,
        
            textLabel:          label_date_mating,
            isRequired:         false,
            maxDate:            40,
            invalidFeedBack:    null,
            helpText:           null
        });
        
        
        const html_style        = thisObj._writeInlineStyle();
        
        const html_nav          = componentNavLeftRight.getHtml();   
        
        
        const html_date_mating  = elemUiDateMating.getHtml();
 
           
        const html = `

${html_style}

<div class="mobile-container">
    ${html_nav}
    
    <div style="text-align: center;">
        <span id="${elemIdLabelToday}">${label_today}</span>
        <span id="${elemIdDateToday}" style="color:blue; font-weight:600;" ></span>
    </div>

    ${html_date_mating}
    
    <br>
    <h2 class="tab-title">
        Computed Dates
    </h2>
        
    <table class="data-table">
        <colgroup>
            <col style="width: 60%;">
            <col style="width: 40%;">
        </colgroup>
        
        <tbody>
            <tr>
                <td>Date Farrow (Day 104)</td>
                <td id="${elemIdTdDateFarrow}">--</td>
            </tr>
            
            <tr>
                <td>Expected Birth (Day 114)</td>
                <td id="${elemIdTdExpectedBirth}">--</td>
            </tr>
            
            <tr>
                <td>Birth + 45 days</td>
                <td id="${elemIdTdBirthPlus45Days}">--</td>
            </tr>
            
            <tr>
                <td>Birth + 150 days (Harvest)</td>
                <td id="${elemIdTdBirthPlus150Days}">--</td>
            </tr>
            
        </tbody>
    </table>


</div>
        `;
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        componentNavLeftRight.afterHtmlRender();
        elemUiDateMating.afterHtmlRender();

        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemPageInfo            = elemDivContainer.querySelector('#'+elemIdPageInfo);
        
        elemLabelToday          = elemDivContainer.querySelector('#'+elemIdLabelToday);
        elemDateToday           = elemDivContainer.querySelector('#'+elemIdDateToday);
        
        elemTdDateFarrow        = elemDivContainer.querySelector('#'+elemIdTdDateFarrow);
        elemTdExpectedBirth     = elemDivContainer.querySelector('#'+elemIdTdExpectedBirth);
        elemTdBirthPlus45Days   = elemDivContainer.querySelector('#'+elemIdTdBirthPlus45Days);
        elemTdBirthPlus150Days  = elemDivContainer.querySelector('#'+elemIdTdBirthPlus150Days);
        
    }
    
    
    this._processAfterHtmlRender = function(){
        
        componentNavLeftRight.callbackNavLeft = function(){
            navigation.managerNavLinks.onClickNavFarrowingSchedule(null, true);
        };
        
          
        componentNavLeftRight.callbackNavRight = function(){
            navigation.managerNavLinks.onClickNavBoarExternalMate(null, true);
        };
        
        
        componentNavLeftRight.bindEventListeners();
        

    }
    
    
    this._bindEventListeners = function(){
        // Listen for date changes on the mating date input
        const elemDateInput = elemUiDateMating.getElemText();
        
        if (elemDateInput) {
            // jQuery datepicker change event
            $(elemDateInput).on('change', function() {
                thisObj._onDateMatingChange();
            });
            
            // Also listen for manual input changes
            elemDateInput.addEventListener('input', function() {
                thisObj._onDateMatingChange();
            });
            
            // Listen for blur to catch any final changes
            elemDateInput.addEventListener('blur', function() {
                thisObj._onDateMatingChange();
            });
        }
    }
    
    
    this._onDateMatingChange = function() {
        const dateMatingValue = elemUiDateMating.getValue();
        
        if (!dateMatingValue) {
            // Clear all calculated dates
            elemTdDateFarrow.textContent = '--';
            elemTdExpectedBirth.textContent = '--';
            elemTdBirthPlus45Days.textContent = '--';
            elemTdBirthPlus150Days.textContent = '--';
            return;
        }
        
        // Parse the date from the input (format: "MMM DD, YYYY" e.g., "Jun 17, 2026")
        const dateMating = thisObj._parseDateFromDisplay(dateMatingValue);
        
        if (!dateMating || isNaN(dateMating.getTime())) {
            return;
        }
        
        // Calculate dates
        // Farrow: Day 113 from mating (gestation period)
        const dateFarrow = new Date(dateMating);
        dateFarrow.setDate(dateFarrow.getDate() + 104);
        
        // Expected Birth: Day 114 from mating
        const dateExpectedBirth = new Date(dateMating);
        dateExpectedBirth.setDate(dateExpectedBirth.getDate() + 114);
        
        // Birth + 45 days
        const dateBirthPlus45 = new Date(dateExpectedBirth);
        dateBirthPlus45.setDate(dateBirthPlus45.getDate() + 45);
        
        // Birth + 150 days (harvest)
        const dateBirthPlus150 = new Date(dateExpectedBirth);
        dateBirthPlus150.setDate(dateBirthPlus150.getDate() + 150);
        
        // Display the dates
        elemTdDateFarrow.textContent        = formatDate(dateFarrow, FORMAT_COMPACT);
        elemTdExpectedBirth.textContent     = formatDate(dateExpectedBirth, FORMAT_COMPACT);
        elemTdBirthPlus45Days.textContent   = formatDate(dateBirthPlus45, FORMAT_COMPACT);
        elemTdBirthPlus150Days.textContent  = formatDate(dateBirthPlus150, FORMAT_COMPACT);
    }
    
    
    this._parseDateFromDisplay = function(dateStr) {
        // Parse date in format "MMM DD, YYYY" e.g., "Jun 17, 2026"
        // or "Month DD, YYYY" e.g., "June 17, 2026"
        
        // Remove any extra spaces
        dateStr = dateStr.trim();
        
        // Try to parse using Date constructor
        const dateObj = new Date(dateStr);
        if (!isNaN(dateObj.getTime())) {
            return dateObj;
        }
        
        // Fallback: Try to parse manually
        const parts = dateStr.match(/(\w+)\s+(\d+),\s+(\d+)/);
        if (parts) {
            const month = parts[1];
            const day = parseInt(parts[2]);
            const year = parseInt(parts[3]);
            const monthMap = {
                'Jan': 0, 'January': 0,
                'Feb': 1, 'February': 1,
                'Mar': 2, 'March': 2,
                'Apr': 3, 'April': 3,
                'May': 4,
                'Jun': 5, 'June': 5,
                'Jul': 6, 'July': 6,
                'Aug': 7, 'August': 7,
                'Sep': 8, 'September': 8,
                'Oct': 9, 'October': 9,
                'Nov': 10, 'November': 10,
                'Dec': 11, 'December': 11
            };
            const monthIndex = monthMap[month];
            if (monthIndex !== undefined && !isNaN(day) && !isNaN(year)) {
                return new Date(year, monthIndex, day);
            }
        }
        
        return null;
    }
    
    
    this.renderPage = function(page_data){
        thisObj.show();
    }
    
    
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        
        elemUiDateMating.reset();
        
        // Clear calculated dates
        elemTdDateFarrow.textContent = '--';
        elemTdExpectedBirth.textContent = '--';
        elemTdBirthPlus45Days.textContent = '--';
        elemTdBirthPlus150Days.textContent = '--';
    }
    
    
    
    this.show = function(){
        thisObj._resetForm();
        
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        const s_dt_current = formatDate(dtCurrentDate, FORMAT_COMPACT);
        
        elemDateToday.textContent = s_dt_current;
        
        // Set today as default date
        const todayStr = formatDate(dtCurrentDate, FORMAT_LONG_MONTH);
        elemUiDateMating.setDate(formatDate(dtCurrentDate, FORMAT_COMPACT));
        
        // Trigger calculation with today's date
        setTimeout(function() {
            thisObj._onDateMatingChange();
        }, 100);
    }
}
