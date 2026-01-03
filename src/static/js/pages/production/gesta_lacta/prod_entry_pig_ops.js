// January 2, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../../common/page_view_basic.js';

import {SOW_STATUS,
        PROD_STATUS,
        PIG_OPERATION_TYPE}     from '../../../constants.js';

import {FORMAT_MONTH_DATE_ONLY,
        FORMAT_COMPACT,
        formatDate,
        sortList}               from '../../../utils.js';

import {InsemDataSelect}        from './insem_data_select.js';




ProdEntryPigOps.prototype = new PageViewBasic();
export function ProdEntryPigOps(input_settings){
    PageViewBasic.call(this);
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    
    const NUM_MSECS_1DAY        = 1000 * 60 * 60 * 24;
    
    var elemIdContentContainer  = null;
    var elemIdFilterControls    = null;
    
    var elemIdPigOpsTableBody   = null;
    
    
    var elemContentContainer    = null;
    var elemFilterControls      = null;
    
    var elemPigOpsTableBody     = null;
    
    
   

    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this._writeInlineStyle = function(){
        const html = `
    <style>
    /* Filter Controls - Centered */
        .filter-controls {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            margin-bottom: 12px;
            background-color: #f1f5f9;
            border-radius: 8px;
        }
        
        /* Animal Filter Buttons - Centered with no gaps */
        .animal-filter {
            display: flex;
            justify-content: center;
            width: 100%;
        }
        
        .filter-buttons {
            display: flex;
            background-color: white;
            border-radius: 6px;
            overflow: hidden;
            border: 1px solid var(--medium-gray);
        }
        
        .filter-button {
            padding: 8px 16px;
            background-color: white;
            border: none;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
            color: var(--dark-gray);
        }
        
        .filter-button:not(:last-child) {
            border-right: 1px solid var(--medium-gray);
        }
        
        .filter-button.active {
            background-color: var(--corporate-blue);
            color: white;
        }
        
        /* Hide Completed Toggle - Centered */
        .hide-completed-control {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            gap: 8px;
        }
        
        .toggle-control {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            cursor: pointer;
            width: 100%;
        }
        
        .toggle-switch {
            width: 40px;
            height: 22px;
            background-color: var(--medium-gray);
            border-radius: 11px;
            position: relative;
            transition: background-color 0.3s ease;
        }
        
        .toggle-switch.active {
            background-color: var(--corporate-blue);
        }
        
        .toggle-knob {
            position: absolute;
            top: 3px;
            left: 3px;
            width: 16px;
            height: 16px;
            background-color: white;
            border-radius: 50%;
            transition: transform 0.3s ease;
        }
        
        .toggle-switch.active .toggle-knob {
            transform: translateX(18px);
        }
        
        .toggle-label {
            font-size: 13px;
            font-weight: 600;
            color: var(--corporate-dark-blue);
        }
        
        /* Updated Table Styles */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
            table-layout: fixed;
        }
        
        .data-table th {
            background-color: var(--corporate-blue);
            color: white;
            padding: 8px 6px;
            text-align: left;
            font-weight: 600;
            font-size: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .data-table th:nth-child(1) { width: 22%; }
        .data-table th:nth-child(2) { width: 38%; }
        .data-table th:nth-child(3) { width: 40%; }
        
        .data-table td {
            padding: 8px 6px;
            border-bottom: 1px solid var(--medium-gray);
            font-size: 12px;
            vertical-align: top;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .data-table tr:nth-child(even) {
            background-color: var(--light-gray);
        }
        
        .data-table tr.completed {
            opacity: 0.8;
        }
        
        .data-table tr.hidden {
            display: none;
        }
        
        .data-table tr:hover {
            background-color: #e0f2fe;
        }
        
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
            margin-left: 10px;
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
            top: 50%;
            transform: translateY(-50%);
            width: 8px;
            height: 8px;
            background-color: var(--corporate-dark-blue);
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
            color: var(--corporate-dark-blue);
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
        
        elemIdContentContainer  = `pig-prod-pig-ops-content`;
                
        elemIdFilterControls    = `pig-prod-pig-ops-filter-controls`;
        
       
        
        elemIdPigOpsTableBody   = `pig-prod-pig-ops-operations-table`;
        
        
        const html_style        = thisObj._writeInlineStyle();
        
        const html = `

${html_style}
        
<div class="modal-body" id="${elemIdContentContainer}" >
    <div style= "display:flex; justify-content: center;">
        <h2 class="tab-title" >
            Scheduled Pig Operations
        </h2>
    </div>
    
    <!-- Centered Filter Controls -->
    <div class="filter-controls" id="${elemIdFilterControls}">
        <!-- Animal Filter Buttons - Centered, no gaps -->
        <div class="animal-filter">
            <div class="filter-buttons">
                <button class="filter-button active" data-filter="all">All</button>
                <button class="filter-button" data-filter="sow">Sow</button>
                <button class="filter-button" data-filter="piglets">Piglets</button>
            </div>
        </div>
        
        <!-- Hide Completed Toggle - Centered -->
        <div class="hide-completed-control">
            <div class="toggle-control" id="hide-completed-toggle">
                <div class="toggle-switch">
                    <div class="toggle-knob"></div>
                </div>
                <div class="toggle-label">Hide Completed</div>
            </div>
        </div>
    </div>

    <!-- Operations Table -->
    <table class="data-table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Operation</th>
                <th>Done By</th>
            </tr>
        </thead>
        <tbody id="${elemIdPigOpsTableBody}">
            <!-- Operations populated by JavaScript -->
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
        elemContentContainer    = document.getElementById(elemIdContentContainer);
        
        elemFilterControls      = document.getElementById(elemIdFilterControls);
        elemPigOpsTableBody     = document.getElementById(elemIdPigOpsTableBody);
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
    
    
    
    this.setDataStaffList = function(data){
        staffList = data;
        insemDataSelect.setDataStaffList(staffList, elemStaff);
    }
    
    
    this.show = function(data_pig_prod, options){
        // Transform pig_ops to this format
        //{ id: 1, date: "Oct 15", isDue: true, operationName: "Vaccination - Sow", isForSow: true, 
        //  doneBy: "J. Smith", dateActual: "Oct 14", isCompleted: true },
                    

        
        // 
        // if options.show_gesta is specified,
        //      if options.show_gesta is true, show Gestating Operations
        //      if options.show_gesta is false, show Lactating Operations (combined, sow and piglets)
        //
        // if no options.show_gesta not defined, will read data_pig_prod.pig_production.prod_status_id
        // This is the current status of the pig_production.
        // 
        
        var operations = null; 
        var is_gesta_operations = false;
        
        if ('show_gesta' in options){
            if (options.show_gesta == true){
                operations = data_pig_prod.gestating_ops;
                is_gesta_operations = true;
            }
            else{
                operations = data_pig_prod.lactating_piglets_ops;
                if ('lactating_sow_ops' in data_pig_prod){
                    operations = operations.concat(data_pig_prod.lactating_sow_ops);
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
        const sorted_operations = sortList(operations, 'pig_prod_pig_ops.date_target', 'desc');
    
        console.log('sorted_operations');
        console.log(sorted_operations);
    
        var diff_msecs;
        var diff_days;
        
        var dt_current = new Date();
        dt_current.setHours(0, 0, 0, 0);
    
    
        const to_display_ops = [];
        
        
        // Note null data blocks maybe removed in the backend to minimize
        // bytes to send.
        
        for (const cur_entry of sorted_operations){
            let pig_prod_pig_ops = cur_entry.pig_prod_pig_ops;
            
            
            let dt_target           = new Date(pig_prod_pig_ops.date_target);
            
            let diff_msecs          = dt_target - dt_current;
            let diff_days           = Math.round(diff_msecs / NUM_MSECS_1DAY);

            
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
                'isCompleted': is_completed
            });
        }
        
        let hide_filter_control = false;
        if (is_gesta_operations){hide_filter_control = true;}
        
        
        thisObj.initializeFilters(to_display_ops, hide_filter_control);
        
    }
    
    
    // Function to initialize filter controls
    this.initializeFilters = function(operations, hide_filter_control) {
        const filterButtons = document.querySelectorAll('.filter-button');
        const hideCompletedToggle = document.getElementById('hide-completed-toggle');
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
            dateContent.style.paddingLeft = '10px';
            
            if (op.isDue && !op.isCompleted) {
                const dueIndicator = document.createElement('div');
                dueIndicator.className = 'due-indicator';
                dateContent.appendChild(dueIndicator);
            }
            
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
                checkmark.className = 'checkmark';
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

    

}