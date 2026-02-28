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
        FORMAT_COMPACT,
        createPaginationManager}    from '../../../utils.js';


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
        
    let elemIdTableBodyOne      = null;
    let elemIdTableBodyTwo      = null;
    
    let elemIdChkIncGestaShow   = null;
    let elemIdChkIncGestating   = null;
    
    let elemIdServerErrorMsg    = null;
    
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemHeaderTitle         = null;
    let elemBtnClose            = null;
    
    
    let elemTableBodyOne        = null;
    let elemTableBodyTwo        = null;
    
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
        
        elemIdChkIncGestaShow   = `${settings.uniqueKey}-inc-gesta-show`;
        elemIdChkIncGestating   = `${settings.uniqueKey}-inc-gestating`;
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        elemIdBtnCancel         = `${settings.uniqueKey}-cancel`;
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        
        
        const html_breadcrumb   = componentBreadcrumb.getHtml();
        
        const html_date_balance   = elemUiDateBalance.getHtml();
        
        
        const html = `
    <div class="form-container">
        ${html_breadcrumb}
        
        <div class="modal-header">
            <h5 class="modal-title">
                <span id="${elemIdHeaderTitle}"><i class="fas fa-plus me-2"></i>Add Feed Balance</span>
            </h5>
            <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
        </div>
        
        <div class="modal-body">
            
            ${html_date_balance}
            
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

        elemTableBodyOne        = elemDivContainer.querySelector('#'+elemIdTableBodyOne);
        elemTableBodyTwo        = elemDivContainer.querySelector('#'+elemIdTableBodyTwo);
        
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
        
        
        elemChkIncGestating.addEventListener('change', function(event) {
            elemTableBodyOne.innerHTML = '';
            elemTableBodyTwo.innerHTML = '';
                
            if (event.currentTarget.checked) {
                thisObj.populateFeedInputTablesNew(true);
            } else {
                thisObj.populateFeedInputTablesNew(false);
            }
        });
        
    }
    
    
    
    this._resetForm = function(){
        elemUiDateBalance.reset();
    }
    
    
    this.beforeShow = function(options, data_feed_balance){
        thisObj._resetForm();
        
        showOptions = options;
        
        elemTableBodyOne.innerHTML = '';
        elemTableBodyTwo.innerHTML = '';
        
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
        
        console.log(`data_feed_balance`);
        console.log(curDataFeedBalance);
        
        
        elemUiDateBalance.setDate(curDataFeedBalance.date_balance);
        
        thisObj.populateFeedInputTables();
    }
    

    // From DeepSeek
    function createDataRow(pid, inputCount, initialValues = [], rowClass = '') {
        const tr = document.createElement('tr');
        if (rowClass) tr.classList.add(rowClass);

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
                    totalCell.textContent = sum;
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

        
        for (const cur_entry of feed_balance){
            if (cur_entry.pig_prod){
                console.log(cur_entry);
                
                const pid = thisObj.getHtmlPidSowLoveBoar(cur_entry.pig_prod);
                
                const num_gesta     = (cur_entry.num_gestating)? cur_entry.num_gestating: '';
                const num_lacta     = (cur_entry.num_lactating)? cur_entry.num_lactating: '';
                const num_booster   = (cur_entry.num_booster)? cur_entry.num_booster: '';
                const num_prestarter= (cur_entry.num_prestarter)? cur_entry.num_prestarter: '';
                
                const num_starter   = (cur_entry.num_starter)? cur_entry.num_starter: '';
                const num_grower    = (cur_entry.num_grower)? cur_entry.num_grower: '';
                const num_finisher  = (cur_entry.num_finisher)? cur_entry.num_finisher: '';
                
                
                elemTableBodyOne.appendChild(createDataRow(pid, 4, [num_gesta, num_lacta, num_booster, num_prestarter]));
                elemTableBodyTwo.appendChild(createDataRow(pid, 3, [num_starter, num_grower, num_finisher]));
                
            }
            else{
                // Process Last
                farm_balance = cur_entry;
            }
        }  
        
        
        if (farm_balance){
            const num_gesta     = (farm_balance.num_gestating)? farm_balance.num_gestating: '';
            const num_lacta     = (farm_balance.num_lactating)? farm_balance.num_lactating: '';
            const num_booster   = (farm_balance.num_booster)? farm_balance.num_booster: '';
            const num_prestarter= (farm_balance.num_prestarter)? farm_balance.num_prestarter: '';
            
            const num_starter   = (farm_balance.num_starter)? farm_balance.num_starter: '';
            const num_grower    = (farm_balance.num_grower)? farm_balance.num_grower: '';
            const num_finisher  = (farm_balance.num_finisher)? farm_balance.num_finisher: '';
            
            const pid = 'Farm';
            
            elemTableBodyOne.appendChild(createDataRow(pid, 4, [num_gesta, num_lacta, num_booster, num_prestarter], 'farm-row'));
            elemTableBodyTwo.appendChild(createDataRow(pid, 3, [num_starter, num_grower, num_finisher], 'farm-row'));
        }
        
        
        
        
        // Total row 
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


        // Attach updater (total row index = 4, 4 input columns)
        attachTotalUpdater(elemTableBodyOne, feed_balance.length, 4);
        
        
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

        // Attach updater (total row index = 4, 4 input columns)
        attachTotalUpdater(elemTableBodyTwo, feed_balance.length, 3);

    } 


    this.populateFeedInputTablesNew = function(inc_gestating){
        
        
        let pig_prod_list = navigation.pigFarm.managerPigProd.dataFatteningList;
        for (const cur_entry of pig_prod_list){
            const pid = thisObj.getHtmlPidSowLoveBoar(cur_entry);

            elemTableBodyOne.appendChild(createDataRow(pid, 4, ['', '', '', '']));
            elemTableBodyTwo.appendChild(createDataRow(pid, 3, ['', '', '']));
        }  
        
        
        pig_prod_list = navigation.pigFarm.managerPigProd.dataLactatingList;
        for (const cur_entry of pig_prod_list){
            const pid = thisObj.getHtmlPidSowLoveBoar(cur_entry);

            elemTableBodyOne.appendChild(createDataRow(pid, 4, ['', '', '', '']));
            elemTableBodyTwo.appendChild(createDataRow(pid, 3, ['', '', '']));
        }
        
        
        if (inc_gestating){
            pig_prod_list = navigation.pigFarm.managerPigProd.dataGestatingList;
            for (const cur_entry of pig_prod_list){
                const pid = thisObj.getHtmlPidSowLoveBoar(cur_entry);

                elemTableBodyOne.appendChild(createDataRow(pid, 4, ['', '', '', '']));
                elemTableBodyTwo.appendChild(createDataRow(pid, 3, ['', '', '']));
            }
        } 
               
        
        let row_count = navigation.pigFarm.managerPigProd.dataFatteningList.length;
        row_count += navigation.pigFarm.managerPigProd.dataLactatingList.length;
        
        if (inc_gestating){
            row_count += navigation.pigFarm.managerPigProd.dataGestatingList.length;
        }
        
            
        const pid = 'Farm';
        
        elemTableBodyOne.appendChild(createDataRow(pid, 4, ['', '','', ''], 'farm-row'));
        elemTableBodyTwo.appendChild(createDataRow(pid, 3, ['', '', ''], 'farm-row'));
        
        row_count += 1;
        
        
        // Total row 
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


        // Attach updater (total row index = 4, 4 input columns)
        attachTotalUpdater(elemTableBodyOne, row_count, 4);
        
        
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

        // Attach updater (total row index = 4, 4 input columns)
        attachTotalUpdater(elemTableBodyTwo, row_count, 3);

    } 


} 
