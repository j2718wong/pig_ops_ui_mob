// December 31, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../../common/page_view_basic.js';

import {PIG_OPERATION_TYPE}     from '../../../constants.js';
        
import {ModelAccountPigOps}     from '../../../models/model_acc_pig_ops.js'

import {FIELD_VALIDATION_OK}    from '../../../models/model_basic.js'


EditModalProdPigOps.prototype = new PageViewBasic();
export function EditModalProdPigOps(input_settings){
    PageViewBasic.call(this);
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    
    
    /*
    Typical input_settings
    {
        parentObj:              this
    }   
    */  
    var settings                = input_settings;
        
    // This is needed as ths will be first element to be rendered
    var elemDivContainer        = document.getElementById('container-edit-modal-prod-pig-ops');
        
    var elemIdModal             = null;
    var elemIdModalTitle        = null;
    var elemIdProdPigOpsTitle   = null;
    var elemIdCompletionDate    = null;
    var elemIdStaff             = null;
    var elemIdChkDoneByMe       = null;
    var elemIdNotes             = null;
    var elemIdBtnSave           = null;
    var elemIdBtnDelete         = null;
    
    var elemIdNotesCounter      = null;
    
    
    var elemModal               = null;
    var elemModalTitle          = null;
    var elemProdPigOpsTitle     = null;
    var elemCompletionDate      = null;
    var elemStaff               = null;
    var elemChkDoneByMe         = null;
    var elemNotes               = null;
    var elemBtnSave             = null;
    var elemBtnDelete           = null;
    
    
    var elemNotesCounter        = null;
    
    var editModal               = null;

        
        
    var operationType           = null;
    
    var dataStaffList           = null;
    
    this.callbackOnSuccessEdit  = null;

    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdModal             = 'prod-pig-ops-edit-modal';
        elemIdModalTitle        = 'prod-pig-ops-edit-modal-title';
        elemIdProdPigOpsTitle   = 'prod-pig-ops-edit-modal-subtitle';
        elemIdCompletionDate    = 'prod-pig-ops-edit-name';
        elemIdStaff             = 'prod-pig-ops-edit-short-name';
        elemIdChkDoneByMe       = 'prod-pig-ops-edit-done-by-me';
        elemIdNotes             = 'prod-pig-ops-edit-description';
        
        elemIdBtnSave           = 'prod-pig-ops-edit-save';
        elemIdBtnDelete         = 'prod-pig-ops-edit-delete';
        
        elemIdNotesCounter      = 'prod-pig-ops-edit-description-counter';
        

        const html =`
    <div class="modal fade" id="${elemIdModal}" tabindex="-1" aria-labelledby="edit-entry-prod-pig-ops-modal-label" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="edit-entry-prod-pig-ops-modal-label">
                        <span id="${elemIdModalTitle}">Mark PigOps as Done</span>
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="">
                        <div class="form-section-title" style="margin-top:0;">
                            <i class="fas fa-tag"></i>
                            <span id="${elemIdProdPigOpsTitle}">PID: 00000 - Operation Name</span>
                        </div>
                        
                        <div class="form-group-date">
                            <label for="${elemIdCompletionDate}" class="form-label">
                                Completion Date
                            </label>
                            <input  type="date" 
                                    class="form-control" 
                                    id="${elemIdCompletionDate}" 
                                    required>
                            <div class="form-text">Enter a date.</div>
                        </div>
                        
                        <div class="form-group-select">
                            <label for="${elemIdStaff}" class="form-label">
                                Staff Member
                            </label>
                            
                            <select id="${elemIdStaff}" class="form-control">
                                <option value="0" selected disabled>Please Select</option>
                            </select>
                            
                            <!-- Done by Me Checkbox -->
                            <div id="doneByMeContainer" class="checkbox-group">
                                <input type="checkbox" id="${elemIdChkDoneByMe}">
                                <label for="${elemIdChkDoneByMe}" class="checkbox-label">
                                    <i class="fas fa-user-check checkbox-icon"></i>
                                    Done by Me
                                </label>
                            </div>
                            
                            <div class="form-text">Who did the operation.</div>
                        
                        </div>
                        
                        <div class="form-group-text-area">
                            <label for="${elemIdNotes}" class="form-label">
                                Notes
                                <span id="${elemIdNotesCounter}" class="char-counter">0/160</span>
                            </label>
                            <textarea class="form-control" 
                                    id="${elemIdNotes}" 
                                    maxlength="160" 
                                    rows="3"></textarea>
                            <div class="form-text">Notes about this operation.</div>
                        </div>
                        
                    </form>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-times me-2"></i>Cancel
                    </button>
                    <button type="button" class="btn btn-primary" id="${elemIdBtnSave}">
                        <i class="fas fa-save me-2"></i>Save
                    </button>
                </div>
            </div>
        </div>
    
    </div>

        `;
        
        elemDivContainer.innerHTML = html;
        
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        
        elemModal               = document.getElementById(elemIdModal);
        elemModalTitle          = document.getElementById(elemIdModalTitle);
        elemProdPigOpsTitle     = document.getElementById(elemIdProdPigOpsTitle);
        elemCompletionDate      = document.getElementById(elemIdCompletionDate);
        elemStaff               = document.getElementById(elemIdStaff);
        elemChkDoneByMe         = document.getElementById(elemIdChkDoneByMe);
        elemNotes               = document.getElementById(elemIdNotes);

        elemBtnSave             = document.getElementById(elemIdBtnSave);
        elemBtnDelete           = document.getElementById(elemIdBtnDelete);
    
    
        elemNotesCounter        = document.getElementById(elemIdNotesCounter);
    
    }
    
    
    this._processAfterHtmlRender = function(){
        // Does not work
        //editModal               = new bootstrap.Modal(elemModal);
        
        
        editModal   = bootstrap.Modal.getOrCreateInstance(elemModal);

    }

    
    this._bindEventListeners = function(){
        
        elemNotes.addEventListener('input', function(){
            thisObj.updateCharCounter(elemNotes, elemNotesCounter, 
                160);
            
            elemNotes.classList.remove('is-invalid');
        });
      
      
        elemChkDoneByMe.addEventListener('change', function(event) {
            if (event.currentTarget.checked) {
                elemStaff.style.display = 'none';
            } else {
                elemStaff.style.display = 'block';
            }
        });
        
        
        elemCompletionDate.addEventListener('blur', function() {
            thisObj._validateAfterChangeInput(this, 'name');
        });
        
        elemStaff.addEventListener('blur', function() {
            thisObj._validateAfterChangeInput(this, 'short_name');
        });
        
        elemNotes.addEventListener('blur', function() {
            thisObj._validateAfterChangeInput(this, 'description');
        });
        
        
        elemBtnSave.addEventListener('click', function() {
            thisObj._onClickSaveButton();
        });
        
        
    }
    
    
    this.setDataStaffList = function(data){
        dataStaffList = data;
        
        var select_data = [];
        
        if (dataStaffList.length == 0){
            select_data.push({value:"-1", text:"No Entries"});
            
            thisObj.replaceSelectOptions(elemStaff, select_data)
            return;
        }
        
        
        select_data.push({value:"0", text:"Please Select"});
        
        for (const cur_entry of dataStaffList){
            select_data.push({value: cur_entry.hid, text: cur_entry.name});
        }
        
        thisObj.replaceSelectOptions(elemStaff, select_data);
    }


    this.show = function(operation, options){
        const pid           = options.pid;
        const is_gesta      = options.is_gesta;
        
        var html;
        
        html = `PID: ${pid} - ${operation.account_pig_ops.name}`;
        elemProdPigOpsTitle.innerHTML = html;
        
        
        const modal_header = elemModal.querySelector('.modal-header');
        
        if (is_gesta){
            if (modal_header.classList.contains('gestating') == false){
                modal_header.classList.remove('lactating-piglets');
                modal_header.classList.add('gestating');
            }
        }
        else{
            if (modal_header.classList.contains('lactating-piglets') == false){
                modal_header.classList.remove('gestating');
                modal_header.classList.add('lactating-piglets');
            }
        }
        
        
        // Initialize char counters
        thisObj.updateCharCounter(elemNotes, elemNotesCounter, 
                160);
        
        
        editModal.show();
        
        return;
        
        
        
        // Set ModelAccountPigOps
        newEntry.fieldName.setValue(operation.acc_pig_ops.name);
        newEntry.fieldShortName.setValue(operation.acc_pig_ops.short_name);
        newEntry.fieldNotes.setValue(operation.acc_pig_ops.desc);
        newEntry.fieldNumDaysSince.setValue(operation.acc_pig_ops.num_days_since);
        
        
        // Remove elements validation classes
        elemCompletionDate.classList.remove('is-invalid', 'is-valid');
        elemStaff.classList.remove('is-invalid', 'is-valid');
        elemNotes.classList.remove('is-invalid', 'is-valid');
        elemDayNumber.classList.remove('is-invalid', 'is-valid');
        
        
    }
    
    
    this._validateAfterChangeInput = function(ev, input_field){
        /* Use this to validate new entry form input.*/
    
        var input_elem  = null;
        var input_val   = null;
        var cur_field   = null;
        var validation  = null;
     
        
        if (ev.checkValidity()) {
            switch(input_field){
            
                case 'day_num': {
                    input_elem  = elemDayNumber;
                    input_val   = input_elem.value;
                    cur_field   = newEntry.fieldNumDaysSince;
                    
                    
                    cur_field.newValue = input_val; 
                    validation = cur_field.validateChange();
                    
                    if (validation == FIELD_VALIDATION_OK) {
                        ev.classList.remove('is-invalid');
                        ev.classList.add('is-valid');
                    } else{
                        ev.classList.remove('is-valid');
                        ev.classList.add('is-invalid');
                    }
                    
                    break;
                }
                
                case 'name': {
                    input_elem  = elemCompletionDate;
                    input_val   = input_elem.value || null;
                    cur_field   = newEntry.fieldName;
                    
                    
                    cur_field.newValue = input_val;
                    validation = cur_field.validateChange();
                    
                    if (validation == FIELD_VALIDATION_OK) {
                        ev.classList.remove('is-invalid');
                        ev.classList.add('is-valid');
                    } else{
                        ev.classList.remove('is-valid');
                        ev.classList.add('is-invalid');
                    }
                    
                    break;
                }
                
                case 'short_name': {
                    input_elem  = elemStaff;
                    input_val   = input_elem.value || null;
                    cur_field   = newEntry.fieldShortName;
                    
                    
                    cur_field.newValue = input_val;
                    validation = cur_field.validateChange();
                    
                    if (validation == FIELD_VALIDATION_OK) {
                        ev.classList.remove('is-invalid');
                        ev.classList.add('is-valid');
                    } else{
                        ev.classList.remove('is-valid');
                        ev.classList.add('is-invalid');
                    }
                    
                    break;
                }
                
                case 'description': {
                    input_elem  = elemNotes;
                    input_val   = input_elem.value || null;
                    cur_field   = newEntry.fieldNotes;
                    
                    
                    cur_field.newValue = input_val;
                    validation = cur_field.validateChange();
                    
                    if (validation == FIELD_VALIDATION_OK) {
                        ev.classList.remove('is-invalid');
                        ev.classList.add('is-valid');
                    } else{
                        ev.classList.remove('is-valid');
                        ev.classList.add('is-invalid');
                    }
                    
                    break;
                }
            }
            
            
        } else {
            ev.classList.remove('is-valid');
            ev.classList.add('is-invalid');
        }

    }
    
    
    
    this._onClickSaveButton = function(){
        
    }
    
    
  
}
