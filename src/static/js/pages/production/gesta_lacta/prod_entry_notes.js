// January 3, 2026
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





ProdEntryNotes.prototype = new PageViewBasic();
export function ProdEntryNotes(input_settings){
    PageViewBasic.call(this);
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    
    const MAXCHAR_NOTES         = 160;

    
    var elemIdContentContainer  = null;
    
    var elemIdExpandNotes       = null;
    var elemIdNotesForm         = null;
    var elemIdDateNotes         = null;
    var elemIdNotes             = null;
    var elemIdNotesCharCounter  = null;
    var elemIdBtnSave           = null;
    
    
    var elemIdPigOpsTableBody   = null;
    
    
    var elemContentContainer    = null;
    var elemExpandNotes         = null;
    var elemExpandIcon          = null;
    var elemNotesForm           = null;
    var elemDateNotes           = null;
    var elemNotes               = null;
    var elemNotesCharCounter    = null;
    var elemBtnSave             = null;
    
    var elemPigOpsTableBody     = null;
    
    
   
    var isNotesFormExpanded     = false;
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this._writeInlineStyle = function(){
        const html = `
    <style>
    
        .btn-full-width {
            display: block;
            width: 100%;
            padding: 14px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            text-align: center;
        }
        
        .btn-expand {
            background-color: var(--corporate-blue-light);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 15px;
            padding: 12px;
        }

        .btn-expand:active {
            background-color: #2563eb;
            transform: translateY(1px);
        }

        .btn-load-more {
            background-color: white;
            color: var(--corporate-blue);
            border: 1px solid var(--corporate-border);
            margin-top: 15px;
            padding: 12px;
            font-weight: 500;
        }

        .btn-load-more:active {
            background-color: #f8fafc;
            transform: translateY(1px);
        }

        .expand-icon {
            transition: transform 0.3s ease;
        }

        .expand-icon.expanded {
            transform: rotate(180deg);
        }

        /* Add Notes Section */
        .add-notes-section {
            background-color: white;
            border-radius: 8px;
            padding: 0;
            margin-bottom: 25px;
            border: 1px solid var(--corporate-border);
            overflow: hidden;
            max-height: 0;
            transition: max-height 0.3s ease, padding 0.3s ease;
        }

        .add-notes-section.expanded {
            max-height: 500px;
            padding: 20px;
        }

        /* Table */
        .notes-table {
            width: 100%;
            margin-top: 25px;
            border-collapse: collapse;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
            background-color: white;
        }

        .notes-table th {
            background-color: var(--corporate-blue);
            color: white;
            text-align: left;
            padding: 12px 15px;
            font-weight: 600;
            font-size: 14px;
        }

        .notes-table td {
            padding: 12px 15px;
            border-bottom: 1px solid var(--corporate-border);
            font-size: 14px;
        }

        /* Odd-even row background colors */
        .notes-table tbody tr:nth-child(odd) {
            background-color: var(--row-odd);
        }

        .notes-table tbody tr:nth-child(even) {
            background-color: var(--row-even);
        }

        .notes-table tbody tr:hover {
            background-color: #f0f5ff;
        }

        .notes-table tr:last-child td {
            border-bottom: none;
        }
    </style>
    `;
        return html;
    }
    
    
    this.getHtml = function(){
        
        elemIdContentContainer  = `pig-prod-notes-content`;
        
        elemIdExpandNotes       = `pig-prod-notes-expand-add-form`;
        elemIdNotesForm         = `pig-prod-notes-notes-form`;
        elemIdDateNotes         = `pig-prod-notes-date-notes`;
        elemIdNotes             = `pig-prod-notes-notes`;
        elemIdNotesCharCounter  = `pig-prod-notes-notes-char-counter`;
        elemIdBtnSave           = `pig-prod-notes-btn-save`;
        
        elemIdPigOpsTableBody   = `pig-prod-notes-table`;
        
        const html_style        = thisObj._writeInlineStyle();
        
        const html = `

${html_style}

        
<div class="modal-body" id="${elemIdContentContainer}" >
    <div style= "display:flex; justify-content: center;">
        <h2 class="tab-title" >
            Notes
        </h2>
    </div>
    
    <!-- Expandable Add Notes Section -->
    <button class="btn-full-width btn-expand" id="${elemIdExpandNotes}">
        <span>Add New Note</span>
        <span class="expand-icon">▼</span>
    </button>
    
    <div class="add-notes-section" id="${elemIdNotesForm}">
        <!-- 1. Date Notes -->
        <div class="form-group-date">
            <label for="${elemIdDateNotes}" class="form-label">Date Notes</label>
            <input type="text" class="form-control" id="${elemIdDateNotes}">
        </div>
        
        <!-- 2. Notes -->
        <div class="form-group-text-area">
            <label for="${elemIdNotes}" class="form-label">Notes
                <span id="${elemIdNotesCharCounter}" class="char-counter">0/${MAXCHAR_NOTES}</span>
            </label>
            <textarea class="form-control" rows="3" id="${elemIdNotes}" placeholder="Enter your notes here..."></textarea>
        </div>
        
        <button class="btn-full-width btn-success" id="${elemIdBtnSave}">Save Note</button>
    </div>
    
    <h3 style="margin-top: 25px; margin-bottom: 15px; color: var(--corporate-blue);">Previous Notes</h3>
            

    <!-- Operations Table -->
    <table class="notes-table">
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
        
        elemExpandIcon          = elemContentContainer.querySelector('.expand-icon');
        
        elemExpandNotes         = document.getElementById(elemIdExpandNotes);
        elemNotesForm           = document.getElementById(elemIdNotesForm);
        elemDateNotes           = document.getElementById(elemIdDateNotes);
        elemNotes               = document.getElementById(elemIdNotes);
        elemNotesCharCounter    = document.getElementById(elemIdNotesCharCounter);
        elemBtnSave             = document.getElementById(elemIdBtnSave);
        
    }
    
    
    this._processAfterHtmlRender = function(){
        $('#'+elemIdDateNotes).datepicker({
            format: 'MM d, yyyy',  // This gives "January 31, 2026"
            autoclose: true,
            endDate: new Date() // Max date is today
        }).on('show', function(e) {
            $('.datepicker').addClass('datepicker-material');
        });
    }
    
    
    this._bindEventListeners = function(){
        
        
        function toggleAddNotesForm() {
            isNotesFormExpanded = !isNotesFormExpanded;
            
            if (isNotesFormExpanded) {
                elemNotesForm.classList.add('expanded');
                elemExpandIcon.classList.add('expanded');
                elemExpandNotes.innerHTML = '<span>Hide Add Note</span><span class="expand-icon expanded">▼</span>';
            } else {
                elemNotesForm.classList.remove('expanded');
                elemExpandIcon.classList.remove('expanded');
                elemExpandNotes.innerHTML = '<span>Add New Note</span><span class="expand-icon">▼</span>';
            }
        }
        
        elemExpandNotes.addEventListener('click', toggleAddNotesForm);
        
        
        elemNotes.addEventListener('input', function(){
            thisObj.updateCharCounter(elemNotes, elemNotesCharCounter, 
                MAXCHAR_NOTES);
            
            elemNotes.classList.remove('is-invalid');
        });
        
    }
    
    
  
    
    this.show = function(data_pig_prod, options){
       
    }
    
    
    this.collapseAddNotesForm = function() {
        isNotesFormExpanded = false;
        elemNotesForm.classList.remove('expanded');
        elemExpandIcon.classList.remove('expanded');
        elemExpandNotes.innerHTML = '<span>Add New Note</span><span class="expand-icon">▼</span>';
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