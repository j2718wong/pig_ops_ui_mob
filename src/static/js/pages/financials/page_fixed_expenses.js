// page_fixed_expenses.js

// June 21, 2026 - Updated June 27, 2026
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
    
    // Map of expense keys to element references
    const expenseElements = {};
    const expenseKeys = ['staff', 'electric', 'water', 'internet', 'fuel', 'supplies', 'other'];
    
    // Store original values for cancel
    let originalValues = {};
    let activeInput = null;
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this._writeInlineStyle = function(){
        const html = `
        <style>
            .editable-cell {
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                transition: background-color 0.2s;
                min-height: 32px;
            }
            .editable-cell:hover {
                background-color: #f0f4ff;
            }
            .editable-cell.editing {
                padding: 0;
                background-color: #fff;
            }
            .editable-cell .edit-input {
                width: 100%;
                padding: 4px 8px;
                border: 2px solid var(--corporate-blue);
                border-radius: 4px;
                font-size: 1rem;
                font-family: inherit;
                outline: none;
                background: white;
                min-width: 60px;
                box-sizing: border-box;
            }
            .editable-cell .edit-input:focus {
                border-color: var(--corporate-blue-dark);
                box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
            }
        </style>
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
        Monthly Expenses (Click to edit)
    </h2>
    
    <table class="data-table">
        <colgroup>
            <col style="width: 60%;">
            <col style="width: 40%;">
        </colgroup>
        
        <tbody>
            <tr>
                <td>Staff</td>
                <td id="${elemIdTdStaff}" class="editable-cell" data-expense="staff">0.0</td>
            </tr>
            
            <tr>
                <td>Electric</td>
                <td id="${elemIdTdElectric}" class="editable-cell" data-expense="electric">0.0</td>
            </tr>
            
            <tr>
                <td>Water</td>
                <td id="${elemIdTdWater}" class="editable-cell" data-expense="water">0.0</td>
            </tr>
            
            <tr>
                <td>Internet</td>
                <td id="${elemIdTdInternet}" class="editable-cell" data-expense="internet">0.0</td>
            </tr>
            
            <tr>
                <td>Fuel</td>
                <td id="${elemIdTdFuel}" class="editable-cell" data-expense="fuel">0.0</td>
            </tr>
            
            <tr>
                <td>Supplies</td>
                <td id="${elemIdTdSupplies}" class="editable-cell" data-expense="supplies">0.0</td>
            </tr>
            
            <tr>
                <td>Other</td>
                <td id="${elemIdTdOther}" class="editable-cell" data-expense="other">0.0</td>
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
        
        // Store expense elements in map
        expenseElements.staff = elemTdStaff;
        expenseElements.electric = elemTdElectric;
        expenseElements.water = elemTdWater;
        expenseElements.internet = elemTdInternet;
        expenseElements.fuel = elemTdFuel;
        expenseElements.supplies = elemTdSupplies;
        expenseElements.other = elemTdOther;
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
        // Add click listeners to all editable cells
        for (const expenseKey of expenseKeys) {
            const elem = expenseElements[expenseKey];
            if (elem) {
                elem.addEventListener('click', function(event) {
                    // Only trigger if not already editing
                    if (!this.classList.contains('editing')) {
                        thisObj.startEditing(expenseKey);
                    }
                });
            }
        }
        
        // Global click handler to save on outside click
        document.addEventListener('click', function(event) {
            if (activeInput) {
                const expenseKey = activeInput.getAttribute('data-expense');
                // Check if click is outside the editing cell
                const cell = expenseElements[expenseKey];
                if (cell && !cell.contains(event.target)) {
                    thisObj.saveEditing(expenseKey);
                }
            }
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
        
        const callback_success = function(){
            thisObj.populateFixedExpenses();
        };
        
        navigation.pigFarm.requestDataPigFarmFixedExpenses(callback_success);
    }
    
    
    this.populateFixedExpenses = function(){
        // Get PigFarm latest pig farm Fixed monthly expenses
        const fixedExpenses = navigation.pigFarm.dataFixedExpenses;
        
        console.log(`fixedExpenses`);
        console.log(fixedExpenses);
        
        
        // Format number with commas and 1 decimal place (e.g., 1,000.0)
        const formatMoney = (value) => {
            const num = Number(value) || 0;
            return num.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        };
        
        // Populate the table cells with formatted values
        // Data structure: { fixed_expenses: { staff: 8000.0, electric: 0.0, ... } }
        if (fixedExpenses && fixedExpenses.fixed_expenses) {
            const fe = fixedExpenses.fixed_expenses;
            elemTdStaff.textContent     = formatMoney(fe.staff);
            elemTdElectric.textContent  = formatMoney(fe.electric);
            elemTdWater.textContent     = formatMoney(fe.water);
            elemTdInternet.textContent  = formatMoney(fe.internet);
            elemTdFuel.textContent      = formatMoney(fe.fuel);
            elemTdSupplies.textContent  = formatMoney(fe.supplies);
            elemTdOther.textContent     = formatMoney(fe.other);
        }
    }
    
    
    /**
     * Start inline editing for a specific expense cell
     * @param {string} expenseKey - The expense key (staff, electric, etc.)
     */
    this.startEditing = function(expenseKey) {
        const elem = expenseElements[expenseKey];
        if (!elem) return;
        
        // If already editing, save first
        if (elem.classList.contains('editing')) {
            this.saveEditing(expenseKey);
            return;
        }
        
        // If another cell is editing, save it first
        if (activeInput) {
            const activeKey = activeInput.getAttribute('data-expense');
            if (activeKey && activeKey !== expenseKey) {
                this.saveEditing(activeKey);
            }
        }
        
        // Get current value (remove commas)
        const currentText = elem.textContent.trim().replace(/,/g, '');
        const currentValue = parseFloat(currentText) || 0;
        
        // Store original value for cancel
        originalValues[expenseKey] = currentValue;
        
        // Mark as editing
        elem.classList.add('editing');
        
        // Create input element
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'edit-input';
        input.step = '0.1';
        input.value = currentValue;
        input.setAttribute('data-expense', expenseKey);
        
        // Clear cell and add input
        elem.innerHTML = '';
        elem.appendChild(input);
        
        // Store reference to active input
        activeInput = input;
        
        // Focus the input
        input.focus();
        input.select();
        
        // Event handlers
        const keydownHandler = function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                thisObj.saveEditing(expenseKey);
            } else if (event.key === 'Escape') {
                event.preventDefault();
                thisObj.cancelEditing(expenseKey);
            }
        };
        
        // Attach event listeners
        input.addEventListener('keydown', keydownHandler);
        
        // Store handler for cleanup
        elem._keydownHandler = keydownHandler;
    }
    
    
    /**
     * Save the edited value and send to server
     * @param {string} expenseKey - The expense key (staff, electric, etc.)
     */
    this.saveEditing = function(expenseKey) {
        const elem = expenseElements[expenseKey];
        if (!elem) return;
        
        if (!elem.classList.contains('editing')) return;
        
        // Get input value
        const input = elem.querySelector('.edit-input');
        if (!input) return;
        
        const newValue = parseFloat(input.value) || 0;
        
        // Remove editing state
        elem.classList.remove('editing');
        activeInput = null;
        
        // Format and display the value
        const formatMoney = (value) => {
            const num = Number(value) || 0;
            return num.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        };
        
        // Check if value changed
        const originalValue = originalValues[expenseKey] || 0;
        if (Math.abs(newValue - originalValue) > 0.01) {
            // Value changed - update
            elem.textContent = formatMoney(newValue);
            
            // Update local data
            const updatedExpenses = {};
            updatedExpenses[expenseKey] = newValue;
            
            // Send update to server
            this.updateServerFixedExpenses(updatedExpenses);
        } else {
            // No change - just revert to original display
            elem.textContent = formatMoney(originalValue);
        }
        
        // Clean up
        delete originalValues[expenseKey];
    }
    
    
    /**
     * Cancel editing and revert to original value
     * @param {string} expenseKey - The expense key (staff, electric, etc.)
     */
    this.cancelEditing = function(expenseKey) {
        const elem = expenseElements[expenseKey];
        if (!elem) return;
        
        if (!elem.classList.contains('editing')) return;
        
        // Remove editing state
        elem.classList.remove('editing');
        activeInput = null;
        
        // Revert to original value
        const originalValue = originalValues[expenseKey] || 0;
        const formatMoney = (value) => {
            const num = Number(value) || 0;
            return num.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        };
        
        elem.textContent = formatMoney(originalValue);
        
        // Clean up
        delete originalValues[expenseKey];
    }
    
    
    /**
     * Update fixed expenses on the server
     * @param {Object} updatedExpenses - Object with expense key-value pairs to update
     */
    this.updateServerFixedExpenses = function(updatedExpenses) {
        const user_hid = navigation.userControl.getUserHid();
        const pig_farm_hid = navigation.pigFarm.getPigFarmHid();
        
        const base_url = window.location.origin;
        
        // Include ALL existing expense values so the backend doesn't
        // interpret missing fields as null/zero. The single updated
        // field overrides its corresponding value.
        const allExpenses = {};

        for (const key of expenseKeys) {
            // Use updated value if provided, otherwise use the current
            // in-memory value (which reflects the last server state).
            if (updatedExpenses[key] !== undefined && updatedExpenses[key] !== null) {
                allExpenses[key] = updatedExpenses[key];
            } else {
                const fe = navigation.pigFarm.dataFixedExpenses;
                allExpenses[key] = (fe && fe.fixed_expenses) ? (fe.fixed_expenses[key] || 0) : 0;
            }
        }
        
        
        // Send post request
        const post_data = {
            'uhid':         user_hid,
            'pig_farm_hid': pig_farm_hid,
            ...allExpenses
        };
        
        
        
        let url = `${base_url}/pig_farm/fixed_expenses/update`;
        
        const bearer_token = localStorage.getItem('access_token');
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
                // Could add a small saving indicator
                const elem = expenseElements[Object.keys(updatedExpenses)[0]];
                if (elem) {
                    elem.style.opacity = '0.6';
                }
            },
  
            success: function(response){
                if (response.result.num === 0) {
                    console.log('Fixed expenses updated successfully');
                    
                    // Update local data
                    // Data structure: { fixed_expenses: { staff: 8000.0, electric: 0.0, ... } }
                    const fixedExpenses = navigation.pigFarm.dataFixedExpenses;
                    if (fixedExpenses && fixedExpenses.fixed_expenses) {
                        for (const [key, value] of Object.entries(updatedExpenses)) {
                            fixedExpenses.fixed_expenses[key] = value;
                        }
                    }
                    
                    // Notify feeds estimate page that fixed expenses changed
                    if (navigation.pageFeedsEstimate && 
                        typeof navigation.pageFeedsEstimate.onFixedExpensesUpdated === 'function') {
                        navigation.pageFeedsEstimate.onFixedExpensesUpdated();
                    }
                    
                    // Restore opacity
                    const elem = expenseElements[Object.keys(updatedExpenses)[0]];
                    if (elem) {
                        elem.style.opacity = '1';
                    }
                } else {
                    console.error('Failed to update fixed expenses:', response);
                    thisObj.showError('Failed to update expenses. Please try again.');
                    // Revert on error
                    for (const [key] of Object.entries(updatedExpenses)) {
                        thisObj.cancelEditing(key);
                    }
                }
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                console.error('Error updating fixed expenses:', textStatus, errorThrown);
                // Revert on error
                for (const [key] of Object.entries(updatedExpenses)) {
                    thisObj.cancelEditing(key);
                }
                thisObj.showError('Network error. Please try again.');
            },
  
            complete: function(){
                // Restore opacity
                const elem = expenseElements[Object.keys(updatedExpenses)[0]];
                if (elem) {
                    elem.style.opacity = '1';
                }
            }
        });
    }
    
    
    /**
     * Show error message to user
     * @param {string} message - Error message to display
     */
    this.showError = function(message) {
        console.error(message);
        // Use the navigation's error handler if available
        if (navigation && navigation.serverError) {
            // Maybe show a toast message
        } else {
            alert(message);
        }
    }

}
