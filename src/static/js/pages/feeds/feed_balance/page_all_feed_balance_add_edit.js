// February 22, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {PageViewPigFarmPage}    from '../../common/page_view_basic.js';


import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        SOW_STATUS_NAME,
        HARVEST_TYPE}               from '../../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}             from '../../../utils.js';


import {addValidationClassToElem}   from '../../common/ui/ui_utils.js';

import {ComponentBreadCrumbs}       from '../../common/ui/comp_breadcrumb.js';

import {UiInputDatePicker}          from '../../common/ui/input_datepicker.js';

import {getSowBoarReference}        from '../../common/common_app.js';




export function PageAllFeedBalanceAddEdit(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    const navigation            = input_settings.navigation;
    
    /*
    Typical input_settings
    {
        navigation:             this,
        elemDivContainer:       null,
        uniqueKey:              'sow-boar'
    }   
    */  
    const settings              = input_settings;
    
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
    
    const settingsBreadcrumb = {
        uniqueKey:              `${settings.uniqueKey}-breadcrumbs`,
        navigation:             navigation,
        
        items:[
            {
                'label':        'Feed Balance List',
                'gotoPageId':   PAGE_ID.ALL_FEED_BAL_LIST
            }
        ]
        
    };
    
    
    let elemIdHeaderTitle       = null;
    let elemIdBtnClose          = null;
    
    let componentBreadcrumb     = null;
    
    let elemUiDateBalance       = null;  
    
    let elemIdChkShowBoarName   = null; 
        
    let elemIdTableBodyOne      = null;
    let elemIdTableBodyTwo      = null;
    
    let elemIdTableBodyCombined = null;
    
    let elemIdChkIncGestaShow   = null;
    let elemIdChkIncGestating   = null;
    
    let elemIdServerErrorMsg    = null;
    
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemHeaderTitle         = null;
    let elemBtnClose            = null;
    
    let elemChkShowBoarName     = null; 
    
    
    let elemTableBodyOne        = null;
    let elemTableBodyTwo        = null;
    
    let elemTableBodyCombined   = null;
    
    let elemChkIncGestaShow     = null;
    let elemChkIncGestating     = null;
    
    let elemServerErrorMsg      = null;
    
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
    let dataFeedBalance         = null;
    
    
    this.farmPage               = new PageViewPigFarmPage();
    
    
    let showOptions             = null;
    
    let curDataFeedBalance      = null;
    
    
    let secondVisible           = false;
    let hideBoarName            = true;
    
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        const html = this.getHtml();
        elemDivContainer.innerHTML = html;
    }
    
    
    this.getHtml = function(){
        componentBreadcrumb     = new ComponentBreadCrumbs(settingsBreadcrumb);
        
        
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
        
        elemUiDateBalance        = new UiInputDatePicker({
            uniqueKey:          `${settings.uniqueKey}-date-balance`,
        
            textLabel:          'Date Balance',
            isRequired:         true,
            invalidFeedBack:    'Please input date.',
            helpText:           null
        });
        
        
        elemIdTableBodyOne      = `${settings.uniqueKey}-tbody1`;
        elemIdTableBodyTwo      = `${settings.uniqueKey}-tbody2`;
        
        elemIdTableBodyCombined = `${elemIdTableBodyOne}-combined`;
                
        
        elemIdChkShowBoarName   = `${settings.uniqueKey}-show-boar-name`;
        
        elemIdChkIncGestaShow   = `${settings.uniqueKey}-inc-gesta-show`;
        elemIdChkIncGestating   = `${settings.uniqueKey}-inc-gestating`;
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        elemIdBtnCancel         = `${settings.uniqueKey}-cancel`;
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        
        
        const html_breadcrumb   = componentBreadcrumb.getHtml();
        
        const html_date_balance   = elemUiDateBalance.getHtml();
        
        // Add responsive styles with spreadsheet-like appearance
        // Add responsive styles with spreadsheet-like appearance
        const responsiveStyles = `
        <style>
            /* Base styles - mobile first */
            .feed-input-container {
                width: 100%;
                margin: 15px 0;
            }
            
            /* Spreadsheet-like table for larger screens */
            .spreadsheet-table {
                display: none;
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 15px;
                border: 1px solid #ccc;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                font-size: 13px;
                table-layout: fixed;
            }
            
            .spreadsheet-table colgroup col.pid-col {
                width: 18%;
            }
            
            .spreadsheet-table colgroup col.feed-col {
                width: 11.7%; /* 7 columns * 11.7% ≈ 82% remaining */
            }
            
            .spreadsheet-table th {
                background-color: #f0f0f0;
                font-weight: 600;
                padding: 8px 4px;
                text-align: center;
                border: 1px solid #ccc;
                position: sticky;
                top: 0;
                z-index: 10;
                font-size: 12px;
                white-space: nowrap;
            }
            
            .spreadsheet-table td {
                border: 1px solid #ccc;
                padding: 0;
                margin: 0;
                height: 32px;
            }
            
            /* Excel-like input - no borders, fills entire cell */
            .spreadsheet-table input {
                width: 100%;
                height: 100%;
                border: none;
                padding: 0 6px;
                margin: 0;
                box-sizing: border-box;
                font-family: inherit;
                font-size: 13px;
                background-color: transparent;
                outline: none;
                border-radius: 0;
            }
            
            .spreadsheet-table input:focus {
                background-color: #e8f0fe;
                box-shadow: inset 0 0 0 1px #1a73e8;
            }
            
            .spreadsheet-table input:hover {
                background-color: #f5f5f5;
            }
            
            .spreadsheet-table .farm-row {
                background-color: #fff3cd;
            }
            
            .spreadsheet-table .farm-row input {
                background-color: transparent;
            }
            
            .spreadsheet-table .total-row {
                background-color: #d4edda;
                font-weight: bold;
            }
            
            .spreadsheet-table .total-row td {
                border-top: 2px solid #28a745;
                padding: 8px 4px;
                text-align: right;
            }
            
            .spreadsheet-table .total-row td:first-child {
                text-align: left;
            }
            
            /* Mobile tables - ONLY for these specific tables, not affecting site-wide */
            .feed-input-mobile-card .data-table,
            .feed-input-mobile-card .data-table th,
            .feed-input-mobile-card .data-table td {
                border: 1px solid #dee2e6 !important;
                border-collapse: collapse;
            }
            
            .feed-input-mobile-card .data-table {
                width: 100%;
                margin-bottom: 0;
                font-size: 13px;
            }
            
            .feed-input-mobile-card .data-table th {
                background-color: var(--corporate-blue-company);
                color:white;
                font-weight: 600;
                padding: 8px 4px;
                text-align: center;
                font-size: 12px;
                white-space: nowrap;
            }
            
            .feed-input-mobile-card .data-table td {
                padding: 0;
                height: 36px;
            }
            
            .feed-input-mobile-card .data-table input {
                width: 100%;
                height: 100%;
                padding: 4px 8px;
                font-size: 13px;
                border: none;
                background-color: transparent;
                box-sizing: border-box;
            }
            
            .feed-input-mobile-card .data-table input:focus {
                outline: 2px solid #80bdff;
                outline-offset: -2px;
                background-color: #f0f7ff;
            }
            
            .feed-input-mobile-card .data-table .farm-row {
                background-color: #fff3cd;
            }
            
            .feed-input-mobile-card .data-table .total-row {
                background-color: #d4edda;
                font-weight: bold;
            }
            
            .feed-input-mobile-card .data-table .total-row td {
                border-top: 2px solid #28a745;
                padding: 8px 4px;
                text-align: right;
            }
            
            .feed-input-mobile-card .data-table .total-row td:first-child {
                text-align: left;
            }
            
            /* Toggle button styling */
            .toggle-area {
                text-align: center;
                margin-bottom: 10px;
            }
            
            .toggle-btn {
                background-color: #007bff;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }
            
            .toggle-btn:hover {
                background-color: #0056b3;
            }
            
            .slider-frame {
                overflow: hidden;
                width: 100%;
                border: 1px solid #dee2e6;
                border-radius: 4px;
                background-color: #fff;
            }
            
            .slider-wrapper {
                display: flex;
                transition: transform 0.3s ease;
                width: 200%;
            }
            
            .slide-panel {
                flex: 0 0 50%;
                padding: 10px;
                box-sizing: border-box;
            }
            
            /* Media query for larger screens */
            @media (min-width: 1200px) {
                .spreadsheet-table {
                    display: table;
                }
                
                .feed-input-mobile-card {
                    display: none;
                }
            }
        </style>
        `;

        
        // Spreadsheet table HTML with Excel-like appearance
        const spreadsheetTableHtml = `
        <table class="spreadsheet-table" id="spreadsheetTable">
            <colgroup>
                <col class="pid-col" style="width:18%">
                <col class="feed-col" style="width:11.7%">
                <col class="feed-col" style="width:11.7%">
                <col class="feed-col" style="width:11.7%">
                <col class="feed-col" style="width:11.7%">
                <col class="feed-col" style="width:11.7%">
                <col class="feed-col" style="width:11.7%">
                <col class="feed-col" style="width:11.8%">
            </colgroup>
            <thead>
                <tr>
                    <th>PID</th>
                    <th>Gesta</th>
                    <th>Lacta</th>
                    <th>Boost</th>
                    <th>Pre</th>
                    <th>Starter</th>
                    <th>Grower</th>
                    <th>Finisher</th>
                </tr>
            </thead>
            <tbody id="${elemIdTableBodyOne}-combined">
                <!-- Combined rows will be populated here -->
            </tbody>
        </table>
        `;
        
        const html = `
        <div class="form-container">
            ${responsiveStyles}
            
            
            ${html_breadcrumb}
            
            <div class="modal-header">
                <h5 class="modal-title">
                    <span id="${elemIdHeaderTitle}"><i class="fas fa-plus me-2"></i>Add Feed Balance</span>
                </h5>
                <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
            </div>
            
            <div class="modal-body">
                
                ${html_date_balance}
                
                <div class="feed-input-container">
                    <div class="checkbox-group" style="margin-bottom:8px;">
                        <input type="checkbox" id="${elemIdChkShowBoarName}">
                        <label for="${elemIdChkShowBoarName}" class="checkbox-label">
                            Show Boar Name
                        </label>
                    </div>
    
                
                    <!-- Spreadsheet table for larger screens -->
                    ${spreadsheetTableHtml}
                    
                    <!-- Mobile slide tables -->
                    <div class="feed-input-mobile-card">
                        <div class="toggle-area">
                            <button class="toggle-btn" id="toggleBtn">SLIDE TABLES</button>
                        </div>
                    
                    
                        <div class="slider-frame">
                            <div class="slider-wrapper" id="sliderWrapper">
                                <!-- FIRST DIV (5 columns) : PID Gesta Lacta Booster Prestart -->
                                <div class="slide-panel">
                                    <table class="data-table" id="tableOne" style="border-collapse: separate; border-spacing: 0;">
                                        <colgroup>
                                            <col style="width:36%">
                                            <col style="width:16%">
                                            <col style="width:16%">
                                            <col style="width:16%">
                                            <col style="width:16%">
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>PID</th>
                                                <th style="padding-left:0; text-align:center;">Gesta</th>
                                                <th style="padding-left:0; text-align:center;">Lacta</th>
                                                <th style="padding-left:0; text-align:center;">Boost</th>
                                                <th style="padding-left:0; text-align:center;">Pre</th>
                                            </tr>
                                        </thead>
                                        <tbody id="${elemIdTableBodyOne}"></tbody>
                                    </table>
                                </div>
                                
                                <!-- SECOND DIV (4 columns) : PID Starter Grower Finisher -->
                                <div class="slide-panel">
                                    <table class="data-table" id="tableTwo">
                                        <colgroup>
                                            <col style="width:36%">
                                            <col style="width:21%">
                                            <col style="width:21%">
                                            <col style="width:22%">
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>PID</th>
                                                <th style="padding-left:0; text-align:center;">Starter</th>
                                                <th style="padding-left:0; text-align:center;">Grower</th>
                                                <th style="padding-left:0; text-align:center;">Finisher</th>
                                            </tr>
                                        </thead>
                                        <tbody id="${elemIdTableBodyTwo}"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                
                <div id="${elemIdChkIncGestaShow}" class="checkbox-group" style="margin-bottom:8px;">
                    <input type="checkbox" id="${elemIdChkIncGestating}">
                    <label for="${elemIdChkIncGestating}" class="checkbox-label">
                        Include Gestating Sows
                    </label>
                </div>
    
                
            </div>
            
            
            <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
            
            <!-- Footer Buttons -->
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="${elemIdBtnCancel}" style="margin-right:10px;">
                    <i class="fas fa-times me-2"></i>Cancel
                </button>
                
                <button type="button" class="btn btn-primary" id="${elemIdBtnSave}">
                    <i class="fas fa-save me-2"></i>Save
                </button>
            </div>
        </div>
        `;
        
        return html
    }

    
    this.afterHtmlRender = function(){
        componentBreadcrumb.afterHtmlRender();
        elemUiDateBalance.afterHtmlRender();
        
      
        
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemHeaderTitle         = elemDivContainer.querySelector('#'+elemIdHeaderTitle);
        elemBtnClose            = elemDivContainer.querySelector('#'+elemIdBtnClose);
        
        elemChkShowBoarName     = elemDivContainer.querySelector('#'+elemIdChkShowBoarName);

        elemTableBodyOne        = elemDivContainer.querySelector('#'+elemIdTableBodyOne);
        elemTableBodyTwo        = elemDivContainer.querySelector('#'+elemIdTableBodyTwo);
        
        elemTableBodyCombined   = elemDivContainer.querySelector('#'+elemIdTableBodyCombined);
        
        elemChkIncGestaShow     = elemDivContainer.querySelector('#'+elemIdChkIncGestaShow);
        elemChkIncGestating     = elemDivContainer.querySelector('#'+elemIdChkIncGestating);
        
        elemServerErrorMsg      = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);
        
        elemBtnCancel           = elemDivContainer.querySelector('#'+elemIdBtnCancel);
        elemBtnSave             = elemDivContainer.querySelector('#'+elemIdBtnSave);
    
    }
    
    
    this._processAfterHtmlRender = function(){
        
    }
    
    
    this._bindEventListeners = function(){
        // ---------- slide toggle ----------
        const wrapper   = elemDivContainer.querySelector('#sliderWrapper');
        const toggleBtn = elemDivContainer.querySelector('#toggleBtn');
        
        
        toggleBtn.addEventListener('click', function() {
            secondVisible = !secondVisible;
            wrapper.style.transform = secondVisible ? 'translateX(-50%)' : 'translateX(0%)';
        });
        wrapper.style.transform = 'translateX(0%)';

        
        
        elemBtnSave.addEventListener('click', function() {
            thisObj.onClickSaveButton();
        });
        
        
        elemChkShowBoarName.addEventListener('change', function(event) {
            // Capture current values before regenerating
            const currentValues = thisObj.captureCurrentValues();
            
            if (event.currentTarget.checked){
                hideBoarName = false;
            }
            else{
                hideBoarName = true;
            }
        
            // Regenerate tables with preserved values
            const incGestating = elemChkIncGestating.checked;
            thisObj.regenerateTablesWithValues(incGestating, currentValues);
            
        });
        
        
        elemChkIncGestating.addEventListener('change', function(event) {
            // Capture current values before regenerating
            const currentValues = thisObj.captureCurrentValues();
            
            const incGestating = event.currentTarget.checked;
            
            // Regenerate tables with preserved values
            thisObj.regenerateTablesWithValues(incGestating, currentValues);
        });
        
    }
    
    
    
    this._resetForm = function(){
        elemUiDateBalance.reset();
    }
    
    
    this.show = function(options, data_feed_balance){
        thisObj._resetForm();
        
        showOptions = options;
        
        elemTableBodyOne.innerHTML = '';
        elemTableBodyTwo.innerHTML = '';
        
        if (elemTableBodyCombined) elemTableBodyCombined.innerHTML = '';
        
        
        let html;
        if (showOptions.is_add){
            curDataFeedBalance = null;
            
            html    = `<i class="fas fa-plus me-2"></i>Add Feed Balance`;
        }
        else {
            curDataFeedBalance = data_feed_balance;
            
            html    = `<i class="fas fa-edit me-2"></i>Edit Feed Balance`;
        }
        elemHeaderTitle.innerHTML = html;



        if (showOptions.is_add){
            this.populateFeedInputTablesNew();
        }
        else{
            this.populateForm();
        }
        
       
        // Update Close and cancel button on click
        
        elemBtnClose.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
        
        elemBtnCancel.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
    }
    
    
    
    this.populateForm = function(){
        
        elemUiDateBalance.setDate(curDataFeedBalance.date_balance);
        
        thisObj.populateFeedInputTables();
    }
    

    // From DeepSeek
    function createDataRow(pid, inputCount, initialValues = [], rowClass = '', hid = null) {
        const tr = document.createElement('tr');
        if (rowClass) tr.classList.add(rowClass);
        
        // Store the hid as a data attribute
        if (hid) {
            tr.dataset.hid = hid;
        }

        const tdPid = document.createElement('td');
        tdPid.innerHTML = pid;
        tr.appendChild(tdPid);

        for (let i = 0; i < inputCount; i++) {
            const td = document.createElement('td');
            td.style.padding = '0';
            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.value = (initialValues[i] !== undefined) ? initialValues[i] : '';
            td.appendChild(input);
            tr.appendChild(td);
        }
        return tr;
    }


    // Function for creating spreadsheet-style rows (8 columns: PID + 7 feed types)
    function createSpreadsheetRow(pid, initialValues = [], rowClass = '', hid = null) {
        const tr = document.createElement('tr');
        if (rowClass) tr.classList.add(rowClass);
        
        // Store the hid as a data attribute
        if (hid) {
            tr.dataset.hid = hid;
        }

        const tdPid = document.createElement('td');
        tdPid.innerHTML = pid;
        tdPid.style.padding = '0 6px';
        tdPid.style.verticalAlign = 'middle';
        tr.appendChild(tdPid);

        // Create 7 input cells for all feed types - no padding, input fills cell
        for (let i = 0; i < 7; i++) {
            const td = document.createElement('td');
            td.style.padding = '0';
            td.style.margin = '0';
            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.value = (initialValues[i] !== undefined) ? initialValues[i] : '';
            input.style.width = '100%';
            input.style.height = '100%';
            input.style.border = 'none';
            input.style.padding = '0 6px';
            input.style.margin = '0';
            input.style.boxSizing = 'border-box';
            input.style.borderRadius = '0';
            td.appendChild(input);
            tr.appendChild(td);
        }
        return tr;
    }


    // From DeepSeek
    function attachTotalUpdater(tbody, totalRowIndex, columnCount) {
        function updateTotal() {
            const rows = Array.from(tbody.children);
            const totalRow = rows[totalRowIndex];
            if (!totalRow) return;

            for (let col = 1; col <= columnCount; col++) {
                let sum = 0;
                rows.forEach((row, idx) => {
                    if (idx === totalRowIndex) return;
                    const cell = row.children[col];
                    if (cell) {
                        const input = cell.querySelector('input');
                        if (input) {
                            const val = parseFloat(input.value) || 0;
                            sum += val;
                        }
                    }
                });
                const totalCell = totalRow.children[col];
                if (totalCell) {
                    totalCell.textContent = sum.toFixed(2);
                }
            }
        }

        updateTotal();

        const rows = Array.from(tbody.children);
        rows.forEach((row, idx) => {
            if (idx === totalRowIndex) return;
            Array.from(row.querySelectorAll('input')).forEach(input => {
                input.addEventListener('input', updateTotal);
                input.addEventListener('change', updateTotal);
            });
        });
    }
    
    
    this.populateFeedInputTables = function(){

        const feed_balance = curDataFeedBalance.feed_balance;
        let farm_balance = null;
        let rowCount = 0;  // ← Track actual rows added

        // Clear spreadsheet table if it exists
        if (elemTableBodyCombined) {
            elemTableBodyCombined.innerHTML = '';
        }
        
        for (const cur_entry of feed_balance){
            
            if (cur_entry.pig_prod && cur_entry.pig_prod.pig_production){
                const pid = thisObj.getHtmlPidSowLoveBoar(cur_entry.pig_prod, hideBoarName);
                const pig_prod_hid = cur_entry.pig_prod.pig_production.hid;
                
                const num_gesta     = cur_entry.num_gestating || '';
                const num_lacta     = cur_entry.num_lactating || '';
                const num_booster   = cur_entry.num_booster || '';
                const num_prestarter= cur_entry.num_prestarter || '';
                const num_starter   = cur_entry.num_starter || '';
                const num_grower    = cur_entry.num_grower || '';
                const num_finisher  = cur_entry.num_finisher || '';
                
                const feed_types_1 = [num_gesta, num_lacta, num_booster, num_prestarter];
                const feed_types_2 = [num_starter, num_grower, num_finisher];
                
                // Mobile tables (working)
                const elem_tr_1 = createDataRow(pid, 4, feed_types_1, '', pig_prod_hid);
                elemTableBodyOne.appendChild(elem_tr_1);
                
                const elem_tr_2 = createDataRow(pid, 3, feed_types_2, '', pig_prod_hid);
                elemTableBodyTwo.appendChild(elem_tr_2);
                
                // Desktop spreadsheet table
                if (elemTableBodyCombined) {
                    const allFeedTypes = [num_gesta, num_lacta, num_booster, num_prestarter, num_starter, num_grower, num_finisher];
                    const spreadsheetRow = createSpreadsheetRow(pid, allFeedTypes, '', pig_prod_hid);
                    elemTableBodyCombined.appendChild(spreadsheetRow);
                }
                
                rowCount++;  // ← Count this row
            }
            else{
                farm_balance = cur_entry;
            }
        }  
        
        if (farm_balance){
            const num_gesta     = farm_balance.num_gestating || '';
            const num_lacta     = farm_balance.num_lactating || '';
            const num_booster   = farm_balance.num_booster || '';
            const num_prestarter= farm_balance.num_prestarter || '';
            const num_starter   = farm_balance.num_starter || '';
            const num_grower    = farm_balance.num_grower || '';
            const num_finisher  = farm_balance.num_finisher || '';
            
            const pid = 'Farm';
            const pig_farm_hid = navigation.pigFarm.getPigFarmHid();
            
            const feed_types_1 = [num_gesta, num_lacta, num_booster, num_prestarter];
            const feed_types_2 = [num_starter, num_grower, num_finisher];
            
            // Mobile tables
            const elem_tr_1 = createDataRow(pid, 4, feed_types_1, 'farm-row', pig_farm_hid);
            elemTableBodyOne.appendChild(elem_tr_1);
            
            const elem_tr_2 = createDataRow(pid, 3, feed_types_2, 'farm-row', pig_farm_hid);
            elemTableBodyTwo.appendChild(elem_tr_2);
            
            // Desktop spreadsheet table
            if (elemTableBodyCombined) {
                const allFeedTypes = [num_gesta, num_lacta, num_booster, num_prestarter, num_starter, num_grower, num_finisher];
                const spreadsheetRow = createSpreadsheetRow(pid, allFeedTypes, 'farm-row', pig_farm_hid);
                elemTableBodyCombined.appendChild(spreadsheetRow);
            }
            
            rowCount++;  // ← Count this row
        }
        
        // Use rowCount instead of feed_balance.length
        const totalRowIndex = rowCount;  // Total row will be at the end
        
        // For mobile tables
        const totalRowOne = document.createElement('tr');
        totalRowOne.classList.add('total-row');
        const tdPidTotalOne = document.createElement('td');
        tdPidTotalOne.textContent = '📊 TOTAL';
        totalRowOne.appendChild(tdPidTotalOne);
        for (let i = 0; i < 4; i++) {
            const td = document.createElement('td');
            td.textContent = '0';
            totalRowOne.appendChild(td);
        }
        elemTableBodyOne.appendChild(totalRowOne);
        attachTotalUpdater(elemTableBodyOne, totalRowIndex, 4);
        
        const totalRowTwo = document.createElement('tr');
        totalRowTwo.classList.add('total-row');
        const tdPidTotalTwo = document.createElement('td');
        tdPidTotalTwo.textContent = '📊 TOTAL';
        totalRowTwo.appendChild(tdPidTotalTwo);
        for (let i = 0; i < 3; i++) {
            const td = document.createElement('td');
            td.textContent = '0';
            totalRowTwo.appendChild(td);
        }
        elemTableBodyTwo.appendChild(totalRowTwo);
        attachTotalUpdater(elemTableBodyTwo, totalRowIndex, 3);
        
        // Desktop spreadsheet total row
        if (elemTableBodyCombined) {
            addSpreadsheetTotalRow(elemTableBodyCombined, totalRowIndex);
        }
    }


    this.populateFeedInputTablesNew = function(){
        // Get checkbox state inside the function
        const inc_gestating = elemChkIncGestating ? elemChkIncGestating.checked : false;
        
        // Clear tables
        elemTableBodyOne.innerHTML = '';
        elemTableBodyTwo.innerHTML = '';
        

        if (elemTableBodyCombined) elemTableBodyCombined.innerHTML = '';
        
        
        // Helper function to add production entry
        const addProductionEntry = (cur_entry) => {
            const pid = thisObj.getHtmlPidSowLoveBoar(cur_entry, hideBoarName);
            const pig_prod_hid = cur_entry.pig_production.hid;
            
            // Mobile tables
            elemTableBodyOne.appendChild(createDataRow(pid, 4, ['', '', '', ''], '', pig_prod_hid));
            elemTableBodyTwo.appendChild(createDataRow(pid, 3, ['', '', ''], '', pig_prod_hid));
            
            // Spreadsheet table
            if (elemTableBodyCombined) {
                elemTableBodyCombined.appendChild(createSpreadsheetRow(pid, 
                    ['', '', '', '', '', '', ''], '', pig_prod_hid));
            }
        };
        
        // Add Fattening Entries
        navigation.pigFarm.managerPigProd.dataFatteningList.forEach(addProductionEntry);
        
        // Add Lactating Entries
        navigation.pigFarm.managerPigProd.dataLactatingList.forEach(addProductionEntry);
        
        // Add Gestating Entries if checked
        if (inc_gestating) {
            navigation.pigFarm.managerPigProd.dataGestatingList.forEach(addProductionEntry);
        }
        
        // Add Farm Feed Balance    
        const pid = 'Farm';
        const pig_farm_hid = navigation.pigFarm.getPigFarmHid();
        
        // Mobile tables
        elemTableBodyOne.appendChild(createDataRow(pid, 4, ['', '', '', ''], 'farm-row', pig_farm_hid));
        elemTableBodyTwo.appendChild(createDataRow(pid, 3, ['', '', ''], 'farm-row', pig_farm_hid));
        
        // Spreadsheet table
        if (elemTableBodyCombined) {
            elemTableBodyCombined.appendChild(createSpreadsheetRow(pid, 
                ['', '', '', '', '', '', ''], 'farm-row', pig_farm_hid));
        }
        
        let row_count = navigation.pigFarm.managerPigProd.dataFatteningList.length;
        row_count += navigation.pigFarm.managerPigProd.dataLactatingList.length;
        
        if (inc_gestating) {
            row_count += navigation.pigFarm.managerPigProd.dataGestatingList.length;
        }
        
        row_count += 1; // For farm row
        
        // Total rows for mobile tables
        addTotalRows(row_count);
        
        // Total row for spreadsheet table
        if (elemTableBodyCombined) {
            addSpreadsheetTotalRow(elemTableBodyCombined, row_count);
        }
    }
    
    // Helper function to add total rows to mobile tables
    function addTotalRows(row_count) {
        // Table One total
        const totalRowOne = document.createElement('tr');
        totalRowOne.classList.add('total-row');
        const tdPidTotalOne = document.createElement('td');
        tdPidTotalOne.textContent = '📊 TOTAL';
        totalRowOne.appendChild(tdPidTotalOne);
        for (let i = 0; i < 4; i++) {
            const td = document.createElement('td');
            td.textContent = '0.00';
            totalRowOne.appendChild(td);
        }
        elemTableBodyOne.appendChild(totalRowOne);
        attachTotalUpdater(elemTableBodyOne, row_count, 4);
        
        // Table Two total
        const totalRowTwo = document.createElement('tr');
        totalRowTwo.classList.add('total-row');
        const tdPidTotalTwo = document.createElement('td');
        tdPidTotalTwo.textContent = '📊 TOTAL';
        totalRowTwo.appendChild(tdPidTotalTwo);
        for (let i = 0; i < 3; i++) {
            const td = document.createElement('td');
            td.textContent = '0.00';
            totalRowTwo.appendChild(td);
        }
        elemTableBodyTwo.appendChild(totalRowTwo);
        attachTotalUpdater(elemTableBodyTwo, row_count, 3);
    }
    
    // Helper function to add total row to spreadsheet table
    function addSpreadsheetTotalRow(tbody, row_count) {
        const totalRow = document.createElement('tr');
        totalRow.classList.add('total-row');
        const tdPidTotal = document.createElement('td');
        tdPidTotal.textContent = '📊 TOTAL';
        tdPidTotal.style.padding = '8px 6px';
        totalRow.appendChild(tdPidTotal);
        for (let i = 0; i < 7; i++) {
            const td = document.createElement('td');
            td.textContent = '0.00';
            td.style.padding = '8px 6px';
            td.style.textAlign = 'right';
            totalRow.appendChild(td);
        }
        tbody.appendChild(totalRow);
        attachTotalUpdater(tbody, row_count, 7);
    }
    
    
    this.getInputMatrix = function(){
    /**
     * Will return an array of feed balance of all fattening, lactating and farm feed balance.
     * The feed_balance array should correspond to
     * [gesta, lacta, booster, prestarter, starter, grower, finisher];
     * 
     * [
     *      {   'pig_prod_hid': '0GL8JLMY',
     *          'feed_balance':[null, 0.5, 0, 1, null, null, null]  // This is always 7 entries
     *      },
     *      ....
     * 
     *      {   'pig_farm_hid': '3QLG0EDV',
     *          'feed_balance':[null, 0.5, 0, 1, null, null, null]  // This is always 7 entries
     *      }
     * ]
     * */
    
        const result = [];
        
        // Try to get data from spreadsheet table first (if visible)
        let rows;
        
        if (elemTableBodyCombined && elemTableBodyCombined.children.length > 0 && window.innerWidth >= 1200) {
            // Use spreadsheet table rows (excluding total row)
            rows = Array.from(elemTableBodyCombined.children).filter(row => !row.classList.contains('total-row'));
            
            rows.forEach(row => {
                const hid = row.dataset.hid;
                if (!hid) return;
                
                const cells = row.children;
                if (cells.length < 8) return; // PID + 7 input columns
                
                const feedBalance = [];
                // Start from index 1 (skip PID column) to index 7 (all 7 feed types)
                for (let i = 1; i <= 7; i++) {
                    const input = cells[i]?.querySelector('input');
                    const value = input?.value;
                    feedBalance.push(value ? parseFloat(value) : null);
                }
                
                const isFarm = row.classList.contains('farm-row');
                if (isFarm) {
                    result.push({
                        'pig_farm_hid': hid,
                        'feed_balance': feedBalance
                    });
                } else {
                    result.push({
                        'pig_prod_hid': hid,
                        'feed_balance': feedBalance
                    });
                }
            });
        } else {
            // Fall back to mobile tables
            const rowsOne = Array.from(elemTableBodyOne.children).filter(row => !row.classList.contains('total-row'));
            const rowsTwo = Array.from(elemTableBodyTwo.children).filter(row => !row.classList.contains('total-row'));
            
            // Create a map to combine data from both tables using the HID as key
            const dataMap = new Map();
            
            // Process first table rows (Gesta, Lacta, Booster, Prestarter)
            rowsOne.forEach(row => {
                const hid = row.dataset.hid;
                if (!hid) return;
                
                const cells = row.children;
                if (cells.length < 5) return;
                
                // Get input values
                const gesta = cells[1].querySelector('input')?.value;
                const lacta = cells[2].querySelector('input')?.value;
                const booster = cells[3].querySelector('input')?.value;
                const prestarter = cells[4].querySelector('input')?.value;
                
                // Create or update entry in map
                if (!dataMap.has(hid)) {
                    dataMap.set(hid, {
                        hid: hid,
                        isFarm: row.classList.contains('farm-row'),
                        feedBalance: [
                            gesta ? parseFloat(gesta) : null,      // Index 0: Gesta
                            lacta ? parseFloat(lacta) : null,      // Index 1: Lacta
                            booster ? parseFloat(booster) : null,  // Index 2: Booster
                            prestarter ? parseFloat(prestarter) : null, // Index 3: Prestarter
                            null,                                   // Index 4: Starter
                            null,                                   // Index 5: Grower
                            null                                    // Index 6: Finisher
                        ]
                    });
                } else {
                    const existing = dataMap.get(hid);
                    existing.feedBalance[0] = gesta ? parseFloat(gesta) : null;
                    existing.feedBalance[1] = lacta ? parseFloat(lacta) : null;
                    existing.feedBalance[2] = booster ? parseFloat(booster) : null;
                    existing.feedBalance[3] = prestarter ? parseFloat(prestarter) : null;
                }
            });
            
            // Process second table rows (Starter, Grower, Finisher)
            rowsTwo.forEach(row => {
                const hid = row.dataset.hid;
                if (!hid) return;
                
                const cells = row.children;
                if (cells.length < 4) return;
                
                // Get input values
                const starter = cells[1].querySelector('input')?.value;
                const grower = cells[2].querySelector('input')?.value;
                const finisher = cells[3].querySelector('input')?.value;
                
                // Create or update entry in map
                if (!dataMap.has(hid)) {
                    dataMap.set(hid, {
                        hid: hid,
                        isFarm: row.classList.contains('farm-row'),
                        feedBalance: [
                            null,                                   // Index 0: Gesta
                            null,                                   // Index 1: Lacta
                            null,                                   // Index 2: Booster
                            null,                                   // Index 3: Prestarter
                            starter ? parseFloat(starter) : null,  // Index 4: Starter
                            grower ? parseFloat(grower) : null,    // Index 5: Grower
                            finisher ? parseFloat(finisher) : null // Index 6: Finisher
                        ]
                    });
                } else {
                    const existing = dataMap.get(hid);
                    existing.feedBalance[4] = starter ? parseFloat(starter) : null;
                    existing.feedBalance[5] = grower ? parseFloat(grower) : null;
                    existing.feedBalance[6] = finisher ? parseFloat(finisher) : null;
                }
            });
            
            // Convert map to result array with proper object structure
            for (const [hid, data] of dataMap) {
                if (data.isFarm) {
                    result.push({
                        'pig_farm_hid': hid,
                        'feed_balance': data.feedBalance
                    });
                } else {
                    result.push({
                        'pig_prod_hid': hid,
                        'feed_balance': data.feedBalance
                    });
                }
            }
        }
        
        return result;
    }
        

    // Helper function to get feed type name from index
    function getFeedTypeName(index) {
        const feedTypes = [
            'Gesta',
            'Lacta',
            'Booster',
            'Prestarter',
            'Starter',
            'Grower',
            'Finisher'
        ];
        return feedTypes[index] || `Unknown (index ${index})`;
    }

        
    this.validateFeedInputs = function(data) {
    /**
     * Validates feed balance data
     * Returns true if:
     *   - At least one feed balance input is not null
     *   - AND all inputs are non-negative (>= 0)
     * Returns false if:
     *   - All inputs are null OR all inputs are zero
     *   - OR any input is negative
     * 
     * @param {Array} data - Array of feed balance entries
     * @returns {Object} - { isValid: boolean, message: string }
     */
    
        // Check if data exists and is an array
        if (!data || !Array.isArray(data)) {
            return {
                isValid: false,
                message: "Invalid data format"
            };
        }
        
        if (data.length === 0) {
            return {
                isValid: false,
                message: "No feed balance entries found"
            };
        }
        
        // Track validation
        let hasValidInput = false;
        let hasNegativeInput = false;
        let totalEntries = 0;
        let entriesWithData = 0;
        let negativeEntries = [];
        
        // Iterate through each entry
        for (const entry of data) {
            const feedBalance = entry.feed_balance;
            const entryType = entry.pig_prod_hid ? 'Production' : 'Farm';
            const entryId = entry.pig_prod_hid || entry.pig_farm_hid;
            
            // Skip if feed_balance is not an array
            if (!Array.isArray(feedBalance)) {
                continue;
            }
            
            totalEntries++;
            
            // Check each value in the feed_balance array
            let hasEntryData = false;
            for (let i = 0; i < feedBalance.length; i++) {
                const value = feedBalance[i];
                
                // Skip null values
                if (value === null) {
                    continue;
                }
                
                // If value is a number
                if (typeof value === 'number') {
                    // Check for negative numbers
                    if (value < 0) {
                        hasNegativeInput = true;
                        const feedType = getFeedTypeName(i);
                        negativeEntries.push(`${entryId} (${feedType}: ${value})`);
                    }
                    
                    // Check if it's not zero (allow small floating point errors)
                    if (Math.abs(value) > 0.000001) {
                        hasValidInput = true;
                        hasEntryData = true;
                    }
                }
            }
            
            if (hasEntryData) {
                entriesWithData++;
            }
        }
        
        // Check for negative inputs first (this is a critical error)
        if (hasNegativeInput) {
            return {
                isValid: false,
                message: `Negative feed quantities are not allowed: ${negativeEntries.join(', ')}`
            };
        }
        
        // Check if there's at least one valid input
        if (!hasValidInput) {
            return {
                isValid: false,
                message: "At least one feed balance input must be greater than zero"
            };
        }
        
        return {
            isValid: true,
            message: `Valid feed balance data with ${entriesWithData} out of ${totalEntries} entries having values`
        };
    }

    
    this.captureCurrentValues = function() {
        const valuesMap = new Map();
        
        // Try to capture from spreadsheet table first (if visible)
        if (elemTableBodyCombined && elemTableBodyCombined.children.length > 0 && window.innerWidth >= 1200) {
            const rows = Array.from(elemTableBodyCombined.children).filter(row => !row.classList.contains('total-row'));
            rows.forEach(row => {
                const hid = row.dataset.hid;
                if (!hid) return;
                
                const cells = row.children;
                if (cells.length < 8) return;
                
                const values = [];
                for (let i = 1; i <= 7; i++) { // Skip PID column (index 0)
                    values.push(cells[i].querySelector('input')?.value || '');
                }
                
                valuesMap.set(hid, {
                    isFarm: row.classList.contains('farm-row'),
                    values: values
                });
            });
        } else {
            // Fall back to mobile tables
            // Capture from table one
            const rowsOne = Array.from(elemTableBodyOne.children).filter(row => !row.classList.contains('total-row'));
            rowsOne.forEach(row => {
                const hid = row.dataset.hid;
                if (!hid) return;
                
                const cells = row.children;
                if (cells.length < 5) return;
                
                if (!valuesMap.has(hid)) {
                    valuesMap.set(hid, {
                        isFarm: row.classList.contains('farm-row'),
                        values: [null, null, null, null, null, null, null]
                    });
                }
                
                const entry = valuesMap.get(hid);
                entry.values[0] = cells[1].querySelector('input')?.value || '';
                entry.values[1] = cells[2].querySelector('input')?.value || '';
                entry.values[2] = cells[3].querySelector('input')?.value || '';
                entry.values[3] = cells[4].querySelector('input')?.value || '';
            });
            
            // Capture from table two
            const rowsTwo = Array.from(elemTableBodyTwo.children).filter(row => !row.classList.contains('total-row'));
            rowsTwo.forEach(row => {
                const hid = row.dataset.hid;
                if (!hid) return;
                
                const cells = row.children;
                if (cells.length < 4) return;
                
                if (!valuesMap.has(hid)) {
                    valuesMap.set(hid, {
                        isFarm: row.classList.contains('farm-row'),
                        values: [null, null, null, null, null, null, null]
                    });
                }
                
                const entry = valuesMap.get(hid);
                entry.values[4] = cells[1].querySelector('input')?.value || '';
                entry.values[5] = cells[2].querySelector('input')?.value || '';
                entry.values[6] = cells[3].querySelector('input')?.value || '';
            });
        }
        
        return valuesMap;
    }
    

    this.regenerateTablesWithValues = function(incGestating, preservedValues) {
        // Clear tables
        elemTableBodyOne.innerHTML = '';
        elemTableBodyTwo.innerHTML = '';
        
        if (elemTableBodyCombined) elemTableBodyCombined.innerHTML = '';
        
        // Helper function to add a production entry to all tables
        const addProductionEntry = (cur_entry) => {
            const pid = thisObj.getHtmlPidSowLoveBoar(cur_entry, hideBoarName);
            const pig_prod_hid = cur_entry.pig_production.hid;
            
            // Get preserved values for this HID or empty array
            const values = preservedValues.get(pig_prod_hid)?.values || ['', '', '', '', '', '', ''];
            
            // Mobile tables
            elemTableBodyOne.appendChild(createDataRow(pid, 4, 
                [values[0], values[1], values[2], values[3]], '', pig_prod_hid));
            elemTableBodyTwo.appendChild(createDataRow(pid, 3, 
                [values[4], values[5], values[6]], '', pig_prod_hid));
            
            // Spreadsheet table
            if (elemTableBodyCombined) {
                elemTableBodyCombined.appendChild(createSpreadsheetRow(pid, 
                    [values[0], values[1], values[2], values[3], values[4], values[5], values[6]], 
                    '', pig_prod_hid));
            }
        };
        
        // Add Fattening Entries
        navigation.pigFarm.managerPigProd.dataFatteningList.forEach(addProductionEntry);
        
        // Add Lactating Entries
        navigation.pigFarm.managerPigProd.dataLactatingList.forEach(addProductionEntry);
        
        // Add Gestating Entries if checked
        if (incGestating) {
            navigation.pigFarm.managerPigProd.dataGestatingList.forEach(addProductionEntry);
        }
        
        // Add Farm Feed Balance    
        const pid = 'Farm';
        const pig_farm_hid = navigation.pigFarm.getPigFarmHid();
        
        // Get preserved values for farm or empty array
        const farmValues = preservedValues.get(pig_farm_hid)?.values || ['', '', '', '', '', '', ''];
        
        // Mobile tables
        elemTableBodyOne.appendChild(createDataRow(pid, 4, 
            [farmValues[0], farmValues[1], farmValues[2], farmValues[3]], 'farm-row', pig_farm_hid));
        elemTableBodyTwo.appendChild(createDataRow(pid, 3, 
            [farmValues[4], farmValues[5], farmValues[6]], 'farm-row', pig_farm_hid));
        
        // Spreadsheet table
        if (elemTableBodyCombined) {
            elemTableBodyCombined.appendChild(createSpreadsheetRow(pid, 
                [farmValues[0], farmValues[1], farmValues[2], farmValues[3], farmValues[4], farmValues[5], farmValues[6]], 
                'farm-row', pig_farm_hid));
        }
        
        let row_count = navigation.pigFarm.managerPigProd.dataFatteningList.length;
        row_count += navigation.pigFarm.managerPigProd.dataLactatingList.length;
        
        if (incGestating) {
            row_count += navigation.pigFarm.managerPigProd.dataGestatingList.length;
        }
        
        row_count += 1; // For farm row
        
        // Total rows for mobile tables
        addTotalRows(row_count);
        
        // Total row for spreadsheet table
        if (elemTableBodyCombined) {
            addSpreadsheetTotalRow(elemTableBodyCombined, row_count);
        }
    }


    this.onClickSaveButton = function(){
        let input_elem      = null;
        let validation      = 0;
        
        
        
        let input_date_balance  = elemUiDateBalance.getValue().trim();
        
        
        
        
        input_elem          = elemUiDateBalance.getElemText();
        if (input_date_balance.length == 0){
            validation = -1;
            addValidationClassToElem(input_elem, validation);
            return;
        } 
        
        

        // Convert date to YYYY-MM-DD format
        const dt_balance     = new Date(input_date_balance);
        if (isNaN(dt_balance.getTime())){
            validation      = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
            
        
        const dt_balance_s   = dt_balance.toLocaleDateString('en-CA');
        validation          = 0
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        const data_feed_balance = thisObj.getInputMatrix();
        const res_validate = thisObj.validateFeedInputs(data_feed_balance);
        
        if (res_validate.isValid == false){
            elemServerErrorMsg.textContent = res_validate.message;
            elemServerErrorMsg.style.display = 'block';
            return;
        }
        

        
        const post_data = {
            'date_balance':     dt_balance_s,   
            'entries':          data_feed_balance
        };
        
        const base_url      = window.location.origin;
        let url = `${base_url}/feed_balance_all/add`;
        
        
        
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
            },
  
            success: function(response){
                if (response.result.num == 0){
                    navigation.managerNavHistory.removeFromNavHistoryHead(
                        showOptions.go_back_page);
                    
                    navigation.showThisPage(showOptions.go_back_page);
                    navigation.pageAllFeedBalanceList.show();
                
                }   
                else{
                    navigation.serverError.receivedErrorMessage(
                        response, elemServerErrorMsg);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
        
        
        
    }
}
