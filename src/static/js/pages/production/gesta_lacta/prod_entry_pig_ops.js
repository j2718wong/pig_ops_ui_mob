// prod_entry_pig_ops.js

// January 2, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}          from '../../common/page_view_basic.js';

import {APPLICATION,
        PAGE_ID,
        SOW_STATUS,
        PROD_STATUS,
        PIG_OPERATION_TYPE}     from '../../../constants.js';

import {FORMAT_MONTH_DATE_ONLY,
        FORMAT_COMPACT,
        formatDate,
        sortList}               from '../../../utils.js';

import {CommonSelectOptions}    from '../../common/common_select_options.js';





export function ProdEntryPigOps(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    /*
    Typical settings = {
        navigation:             navigation,
        parentObj:              this,
        uniqueKey:              'pig-prod-gesta-pigops',
        elemDivContainer:       elemTabGestaPigOps
    };
    */
    const settings              = input_settings;
    
    const elemDivContainer      = settings.elemDivContainer;
    
    
    let elemIdContentContainer  = null;
    let elemIdFilterControls    = null;
    let elemIdHideCompleted     = null;
    
    let elemIdPigOpsTableBody   = null;
    
    
    let elemContentContainer    = null;
    let elemFilterControls      = null;
    let elemHideCompleted       = null;
    
    let elemPigOpsTableBody     = null;
    
    
    let curDataPigProd          = null;

    let showOptions             = null;
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
     this.render = function(){
        const html = this.getHtml();
        elemDivContainer.innerHTML = html;
    }
    
    
    this._writeInlineStyle = function(){
        const html = `
    <style>
        
        /* Updated Table Styles */
        
        
        
        
        /* Date column styling - with year wrapping */
        .date-cell {
            position: relative;
            min-width: 0;
        }
        
        .due-indicator {
            position: absolute;
            top: 6px;
            left: 0;
            width: 10px;
            height: 10px;
            background-color: var(--alert-red);
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 var(--alert-glow); }
            70% { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        
        .date-content {
            font-size: 14px;
            line-height: 1.3;
        }
        
        .date-with-year {
            display: flex;
            flex-direction: column;
        }
        
        .date-month-day {
            white-space: nowrap;
            font-weight: 500;
        }
        
        .date-year {
            color: var(--dark-gray);
            font-size: 14px;
            margin-top: 1px;
            line-height: 1.2;
        }
        
        /* Operation name column */
        .operation-cell {
            position: relative;
            padding-left: 14px !important;
            min-width: 0;
        }
        
        .sow-indicator {
            position: absolute;
            left: 0;
            top: 11px;
            transform: translateY(-50%);
            width: 10px;
            height: 10px;
            background-color: var(--lactating-sow-color);
            border-radius: 50%;
        }
        
        .operation-name {
            font-weight: 500;
            font-size: 14px;
            line-height: 1.3;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        /* Done By column - NEW STYLE */
        .done-by-cell {
            min-width: 0;
        }
        
        /* Completed operations - two divs side by side */
        .completed-info {
            display: flex;
            align-items: flex-start;
            gap: 6px;
        }
        
        .checkmark-container {
            flex-shrink: 0;
            margin-top: 1px;
        }
        
        .checkmark {
            width: 16px;
            height: 16px;
            background-color: var(--green-complete);
            border-radius: 50%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .checkmark::after {
            content: '✓';
            color: white;
            font-size: 10px;
            font-weight: bold;
        }
        
        .staff-date-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-width: 0;
        }
        
        .staff-name-completed {
            font-weight: 500;
            color: var(--corporate-blue);
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .completion-full-date {
            font-size: 14px;
            color: var(--dark-gray);
            margin-top: 2px;
            line-height: 1.2;
        }
        
        /* Empty cell for not done operations */
        .empty-cell {
            height: 32px;
            /* Empty cell - no content */
        }
    </style>
    `;
        return html;
    }
    
    
    this.getHtml = function(){
        
        elemIdContentContainer  = `${settings.uniqueKey}-content`;
                
        elemIdFilterControls    = `${settings.uniqueKey}-filter-controls`;
        elemIdHideCompleted     = `${settings.uniqueKey}-hide-completed`;
       
        
        elemIdPigOpsTableBody   = `${settings.uniqueKey}-tbody`;
        
        
        const html_style        = thisObj._writeInlineStyle();
        
        
        let label_tab_title     = 'Scheduled Pig Operations';
        
        let label_date          = 'Date';
        let label_operation     = 'Pig Operation';
        let label_done_by       = 'Done By';
        
        
        let label_all          = 'All';
        let label_sow          = 'Sow';
        let label_piglets      = 'Piglets';
        let label_hide_completed = 'Hide Completed';
        
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_tab_title     = helper.getSimpleTranslation('prod_entry_pig_ops.labels.scheduled_pig_ops') || label_tab_title;
        
        label_date          = helper.getSimpleTranslation('common_app.labels.date') || label_date;
        label_operation     = helper.getSimpleTranslation('prod_entry_pig_ops.labels.operation') || label_operation;
        label_done_by       = helper.getSimpleTranslation('prod_entry_pig_ops.labels.done_by') || label_done_by;
        
        
        label_all           = helper.getSimpleTranslation('prod_entry_pig_ops.labels.all') || label_all;
        label_sow           = helper.getSimpleTranslation('common_app.labels.sow') || label_sow;
        label_piglets       = helper.getSimpleTranslation('common_app.labels.piglets') || label_piglets;
        
        label_hide_completed= helper.getSimpleTranslation('prod_entry_pig_ops.labels.hide_completed') || label_hide_completed;
        
        
        const html = `

${html_style}
        
<div class="modal-body" id="${elemIdContentContainer}" >
    <div style= "display:flex; justify-content: center;">
        <h2 class="tab-title" >
            ${label_tab_title}
        </h2>
    </div>
    
    <!-- Centered Filter Controls -->
    <div class="filter-controls" id="${elemIdFilterControls}">
        
        <div class="animal-filter">
            <div class="filter-buttons">
                <button class="filter-button active" data-filter="all">${label_all}</button>
                <button class="filter-button" data-filter="sow">${label_sow}</button>
                <button class="filter-button" data-filter="piglets">${label_piglets}</button>
            </div>
        </div>
        
        <div class="hide-completed-control" style="margin-top:4px;">
            <div class="toggle-control" id="${elemIdHideCompleted}">
                <div class="toggle-switch">
                    <div class="toggle-knob"></div>
                </div>
                <div class="toggle-label">${label_hide_completed}</div>
            </div>
        </div>
    </div>

    <!-- Operations Table -->
    <table class="data-table table-pigops">
        <colgroup>
            <col style="width: 18%;">
            <col style="width: 41%;">
            <col style="width: 41%;">
        </colgroup>
    
        <thead>
            <tr>
                <th>${label_date}</th>
                <th>${label_operation}</th>
                <th>${label_done_by}</th>
            </tr>
        </thead>
        
        <tbody id="${elemIdPigOpsTableBody}">
        </tbody>
    </table>
</div>
        `;
        
        return html
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemContentContainer    = elemDivContainer.querySelector('#'+elemIdContentContainer);
        
        elemFilterControls      = elemDivContainer.querySelector('#'+elemIdFilterControls);
        
        elemHideCompleted       = elemDivContainer.querySelector('#'+elemIdHideCompleted);
        
        elemPigOpsTableBody     = elemDivContainer.querySelector('#'+elemIdPigOpsTableBody);
    }
    
    
    this._processAfterHtmlRender = function(){
        
    }
    
    
    this._bindEventListeners = function(){
        // Plus/Minus buttons for piglet counts
        const plusButtons   = elemContentContainer.querySelectorAll('.number-btn.plus');
        const minusButtons  = elemContentContainer.querySelectorAll('.number-btn.minus');
        
        plusButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                const input = document.getElementById(target);
                let value = parseInt(input.value) || 0;
                input.value = value + 1;
                input.dispatchEvent(new Event('change'));
            });
        });
        
        minusButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                const input = document.getElementById(target);
                let value = parseInt(input.value) || 0;
                if (value > 0) {
                    input.value = value - 1;
                    input.dispatchEvent(new Event('change'));
                }
            });
        });
        
    }
    
    
    this.show = function(data_pig_prod, options){
        curDataPigProd = data_pig_prod;
        
        
        // Change options only if there is a given option
        if (options){
            showOptions = options;
        }
        
        // Transform pig_ops to this format
        //{ id: 1, date: "Oct 15", isDue: true, operationName: "Vaccination - Sow", isForSow: true, 
        //  doneBy: "J. Smith", dateActual: "Oct 14", isCompleted: true },
                    

        
        // 
        // if showOptions.show_gesta is specified,
        //      if showOptions.show_gesta is true, show Gestating Operations
        //      if showOptions.show_gesta is false, show Lactating Operations (combined, sow and piglets)
        //
        // if no showOptions.show_gesta not defined, will read data_pig_prod.pig_production.prod_status_id
        // This is the current status of the pig_production.
        // 
        
        let operations = null; 
        let is_gesta_operations = false;
        
        if ('show_gesta' in showOptions){
            if (showOptions.show_gesta == true){
                operations = data_pig_prod.gestating_ops;
                is_gesta_operations = true;
            }
            else{
                if ('lactating_ops' in data_pig_prod){
                    operations = data_pig_prod.lactating_ops;
                }
                else{
                    operations = data_pig_prod.lactating_piglets_ops;
                    if ('lactating_sow_ops' in data_pig_prod){
                        operations = operations.concat(data_pig_prod.lactating_sow_ops);
                    }
                } 
            }
        }
        else{
            if (data_pig_prod.pig_production.prod_status_id = PROD_STATUS.GESTATING){
                operations = data_pig_prod.gestating_ops;
                is_gesta_operations = true;
            }
            else{
                if ('lactating_ops' in data_pig_prod){
                    operations = data_pig_prod.lactating_ops;
                }
                else{
                    operations = data_pig_prod.lactating_piglets_ops;
                    if ('lactating_sow_ops' in data_pig_prod){
                        operations = operations.concat(data_pig_prod.lactating_sow_ops);
                    }
                }
            }
        }
        
        
        // Sort in decreasing date; laready done in backend; but not yet in sample data
        //const sorted_operations = sortList(operations, 'pig_prod_pig_ops.date_target', 'desc');
    
    
        let diff_msecs;
        let diff_days;
        
        let dt_current = new Date();
        dt_current.setHours(0, 0, 0, 0);
    
    
        const to_display_ops = [];
        
        
        // Note null data blocks maybe removed in the backend to minimize
        // bytes to send.
        
        for (const cur_entry of operations){
            let pig_prod_pig_ops = cur_entry.pig_prod_pig_ops;
            
            
            let dt_target           = new Date(pig_prod_pig_ops.date_target);
            
            let diff_msecs          = dt_target - dt_current;
            let diff_days           = Math.round(diff_msecs / APPLICATION.NUM_MSECS_1DAY);

            
            // compute is_due
            let is_due = false;
            if (pig_prod_pig_ops.date_actual == null){
                if (diff_days <= 0){is_due = true;}
            }
            
            let date_target_short = formatDate(dt_target, FORMAT_MONTH_DATE_ONLY);
            
            let is_for_sow = false;
            if (pig_prod_pig_ops.operation_type == PIG_OPERATION_TYPE.LACTATING_SOW){
                is_for_sow = true;
            }
            
            let done_by = '';
            let date_actual = null;
            if ('staff' in cur_entry){
                if (cur_entry.staff.hid != null){
                    done_by = cur_entry.staff.name;
                }
            }
            
            if (pig_prod_pig_ops.date_actual != null){
                date_actual = pig_prod_pig_ops.date_actual;
            }
            
            let is_completed = false;
            let date_actual_short = null;
            let year_actual = null;
            if (date_actual != null){
                date_actual_short = formatDate(new Date(date_actual), 
                    FORMAT_COMPACT);
                year_actual = pig_prod_pig_ops.date_actual.substring(0,4);
            
                is_completed = true;
            }
            
            
            
            to_display_ops.push({
                'hid':      pig_prod_pig_ops.hid,
                'date':     date_target_short,
                'year':     pig_prod_pig_ops.date_target.substring(0,4),
                'isDue':    is_due,
                
                'operationName': cur_entry.account_pig_ops.name,
                'isForSow': is_for_sow,
                'doneBy':   done_by,
                'dateActual': date_actual_short,
                'isCompleted': is_completed,
                
                'operation':    cur_entry
            });
        }
        
        
        
        let hide_filter_control = false;
        if (is_gesta_operations){hide_filter_control = true;}
        
        
        thisObj.initializeFilters(to_display_ops, hide_filter_control);
        
    }
    
    
    // Function to initialize filter controls
    this.initializeFilters = function(operations, hide_filter_control) {
        const filterButtons = document.querySelectorAll('.filter-button');
        const hideCompletedToggle = elemHideCompleted;
        const toggleSwitch = hideCompletedToggle.querySelector('.toggle-switch');
        let currentFilter = 'all';
        let hideCompleted = false;
        
        if (hide_filter_control){
            elemFilterControls.style.display = 'none';
        }
        else{
            elemFilterControls.style.display = 'block';
        }
        
        // Render table with initial data
        thisObj.renderTable(operations, currentFilter, hideCompleted);
        
        // Filter button click handlers
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update current filter
                currentFilter = this.getAttribute('data-filter');
                
                // Re-render table
                thisObj.renderTable(operations, currentFilter, hideCompleted);
            });
        });
        
        // Hide completed toggle handler
        hideCompletedToggle.addEventListener('click', function() {
            hideCompleted = !hideCompleted;
            toggleSwitch.classList.toggle('active', hideCompleted);
            
            // Re-render table
            thisObj.renderTable(operations, currentFilter, hideCompleted);
        });
    }

    
    this.renderTable = function(operations, filter, hideCompleted) {
        const tableBody = elemPigOpsTableBody;
        
        // Clear table
        tableBody.innerHTML = '';
        
        // Filter and sort operations
        const filteredOperations = operations
            .filter(op => {
                // Apply animal type filter
                if (filter === 'sow' && !op.isForSow) return false;
                if (filter === 'piglets' && op.isForSow) return false;
                
                // Apply completed filter
                if (hideCompleted && op.isCompleted) return false;
                
                return true;
            })
            .sort((a, b) => {
                // Sort by completion status (not completed first), then by date
                if (a.isCompleted !== b.isCompleted) {
                    return a.isCompleted ? 1 : -1;
                }
                
                // Convert dates to comparable format
                const dateA = new Date(a.date + " " + a.year);
                const dateB = new Date(b.date + " " + b.year);
                return dateA - dateB;
            });
        
        // Render operations
        filteredOperations.forEach(op => {
            const row = document.createElement('tr');
            row.className = op.isCompleted ? 'completed' : '';
            
            // Date column with year
            const dateCell = document.createElement('td');
            dateCell.className = 'date-cell';
            const dateContent = document.createElement('div');
            dateContent.style.position = 'relative';
            
            
            const dateWithYear = document.createElement('div');
            dateWithYear.className = 'date-with-year';
            
            const dateMonthDay = document.createElement('div');
            dateMonthDay.className = 'date-month-day';
            dateMonthDay.textContent = op.date;
            
            const dateYear = document.createElement('div');
            dateYear.className = 'date-year';
            dateYear.textContent = op.year;
            
            dateWithYear.appendChild(dateMonthDay);
            dateWithYear.appendChild(dateYear);
            
            const dateText = document.createElement('div');
            dateText.className = 'date-content';
            dateText.appendChild(dateWithYear);
            
            dateContent.appendChild(dateText);
            dateCell.appendChild(dateContent);
            row.appendChild(dateCell);
            
            let onclickFunc = function(){
                
                const pid = curDataPigProd.pig_production.farm_prod_id;
                
                const data_sow = curDataPigProd.sow;
                let sow_reference = '';
                
                if ((data_sow.name != null) && (data_sow.name.length >0)){
                    sow_reference = data_sow.name;
                }
                else{
                    sow_reference = data_sow.number;
                }
                
                let is_gesta    = false;
                let page_id     = PAGE_ID.PROD_LACTA_ENTRY;
                if (curDataPigProd.pig_production.prod_status_id == PROD_STATUS.GESTATING){
                    is_gesta    = true;
                    page_id     = PAGE_ID.PROD_GESTA_ENTRY;
                }
                
                const go_back_page = navigation.getPageContainer(page_id);
                
                const options = {
                    pid:            pid,
                    sow:            sow_reference,
                    is_gesta:       is_gesta,
                    is_mark_done:   true,
                    go_back_page:   go_back_page
                };
                if (op.isCompleted){
                    options.is_mark_done = false;
                }
                
                navigation.pageProdPigOpsEdit.callbackOnSuccessEdit = thisObj.onSuccessEditPigOps;
                
                navigation.pageProdPigOpsEdit.curDataPigProd = curDataPigProd;
                navigation.pageProdPigOpsEdit.beforeShow(op.operation, options);
                
                const next_page = navigation.getPageContainer(PAGE_ID.PROD_PIG_OPS_EDIT);
                navigation.showThisPage(next_page)
                
                
            }; 
            
            dateText.onclick = onclickFunc;
            
            
            // Operation column
            const operationCell = document.createElement('td');
            operationCell.className = 'operation-cell';
            const operationContent = document.createElement('div');
            operationContent.style.position = 'relative';
            operationContent.style.paddingLeft = op.isForSow ? '12px' : '0';
            
            if (op.isForSow) {
                const sowIndicator = document.createElement('div');
                sowIndicator.className = 'sow-indicator';
                operationContent.appendChild(sowIndicator);
            }
            
            const operationName = document.createElement('div');
            operationName.className = 'operation-name';
            operationName.textContent = op.operationName;
            operationContent.appendChild(operationName);
            operationCell.appendChild(operationContent);
            row.appendChild(operationCell);
            
            operationName.onclick = onclickFunc;
            
            
            // Done By column - NEW IMPLEMENTATION
            const doneByCell = document.createElement('td');
            doneByCell.className = 'done-by-cell';
            
            if (op.isCompleted) {
                // Completed operation - two divs side by side
                const completedInfo = document.createElement('div');
                completedInfo.className = 'completed-info';
                
                // Left div - check mark
                const checkmarkContainer = document.createElement('div');
                checkmarkContainer.className = 'checkmark-container';
                
                const checkmark = document.createElement('div');
                
                const html_check_mark = `
                <img src="static_m/images/box_check.png" 
                    alt="Checkmark" 
                    data-bs-toggle="tooltip" 
                    data-bs-placement="top" 
                    title ="Already Done" 
                    width="25" height="25">`;
                checkmark.innerHTML = html_check_mark
                
                //checkmark.className = 'checkmark';
                checkmarkContainer.appendChild(checkmark);
                
                // Right div - staff name and full date
                const staffDateInfo = document.createElement('div');
                staffDateInfo.className = 'staff-date-info';
                
                const staffNameCompleted = document.createElement('div');
                staffNameCompleted.className = 'staff-name-completed';
                staffNameCompleted.textContent = op.doneBy;
                
                const completionFullDate = document.createElement('div');
                completionFullDate.className = 'completion-full-date';
                completionFullDate.textContent = op.dateActual;
                
                staffDateInfo.appendChild(staffNameCompleted);
                staffDateInfo.appendChild(completionFullDate);
                
                completedInfo.appendChild(checkmarkContainer);
                completedInfo.appendChild(staffDateInfo);
                doneByCell.appendChild(completedInfo);
            } else {
                // Not done - empty cell
                const emptyCell = document.createElement('div');
                emptyCell.className = 'empty-cell';
                doneByCell.appendChild(emptyCell);
            }
            row.appendChild(doneByCell);
            
            tableBody.appendChild(row);
        });
        
        // Show message if no operations match filters
        if (filteredOperations.length === 0) {
            const messageRow = document.createElement('tr');
            const messageCell = document.createElement('td');
            messageCell.colSpan = 3;
            messageCell.style.textAlign = 'center';
            messageCell.style.padding = '20px';
            messageCell.style.color = 'var(--dark-gray)';
            messageCell.textContent = 'No operations match the current filters';
            messageRow.appendChild(messageCell);
            tableBody.appendChild(messageRow);
        }
    }

    
    this.onSuccessEditPigOps = function(){
        // redraw table
        // Go back to 
        // page_prod_gestating_entry if gestating
        // page_prod_lactating_entry if lactating
        
        thisObj.show(curDataPigProd);
        
    }

}
