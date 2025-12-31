// December 28, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../common/page_view_basic.js';

import {PIG_OPERATION_TYPE}     from '../../constants.js';
        
import {ModelAccountPigOps}     from '../../models/model_acc_pig_ops.js'

import {FIELD_VALIDATION_OK}    from '../../models/model_basic.js'


EditModalAccPigOps.prototype = new PageViewBasic();
export function EditModalAccPigOps(input_settings){
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
        
    var elemIdModal             = null;
    var elemIdModalTitle        = null;
    var elemIdName              = null;
    var elemIdShortName         = null;
    var elemIdDescription       = null;
    var elemIdDayNumber         = null;
    var elemIdDayNumberDesc     = null;
    var elemIdBtnSave           = null;
    var elemIdBtnDelete         = null;
    
    var elemIdNameCounter       = null;
    var elemIdShortNameCounter  = null;
    var elemIdDescriptionCounter= null;
    
    
    var elemModal               = null;
    var elemModalTitle          = null;
    var elemName                = null;
    var elemShortName           = null;
    var elemDescription         = null;
    var elemDayNumber           = null;
    var elemDayNumberDesc       = null;
    var elemBtnSave             = null;
    var elemBtnDelete           = null;
    
    
    var elemNameCounter         = null;
    var elemShortNameCounter    = null;
    var elemDescriptionCounter  = null;
    
    
    var editModal               = null;
    
    
    var newEntry                = new ModelAccountPigOps();
        
        
    var operationType           = null;
    
    
    this.callbackOnSuccessEdit  = null;
    this.callbackOnSuccessDelete= null;
    
    
    this.init = function(){}
    
    
    this.getHtml = function(){
        
        elemIdModal             = 'acc-pig-ops-edit-modal';
        elemIdModalTitle        = 'acc-pig-ops-edit-modal-title';
        elemIdName              = 'acc-pig-ops-edit-name';
        elemIdShortName         = 'acc-pig-ops-edit-short-name';
        elemIdDescription       = 'acc-pig-ops-edit-description';
        elemIdDayNumber         = 'acc-pig-ops-edit-day-number';
        elemIdDayNumberDesc     = 'acc-pig-ops-edit-day-number-desc';
        elemIdBtnSave           = 'acc-pig-ops-edit-save';
        elemIdBtnDelete         = 'acc-pig-ops-edit-delete';
        
        elemIdNameCounter       = 'acc-pig-ops-edit-name-counter';
        elemIdShortNameCounter  = 'acc-pig-ops-edit-short-name-counter';
        elemIdDescriptionCounter= 'acc-pig-ops-edit-description-counter';
        
        
        const max_len_name          = newEntry.fieldName.maxStrLen;
        const max_len_short_name    = newEntry.fieldShortName.maxStrLen;
        const max_len_description   = newEntry.fieldDescription.maxStrLen;
        
        
        
        const html =`
    <div class="modal fade" id="${elemIdModal}" tabindex="-1" aria-labelledby="edit-entry-acc-pig-ops-modal-label" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="edit-entry-acc-pig-ops-modal-label">
                        <span id="${elemIdModalTitle}">Add New Pig Operation</span>
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="addCardForm">
                        <div class="form-section-title" style="margin-top:0;">
                            <i class="fas fa-tag"></i>
                            Operation Information
                        </div>
                        
                        <div class="form-group-text">
                            <label for="${elemIdName}" class="form-label">
                                Operation Name
                                <span id="${elemIdNameCounter}" class="char-counter">0/${max_len_name}</span>
                            </label>
                            <input  type="text" 
                                    class="form-control" 
                                    id="${elemIdName}" 
                                    maxlength="${max_len_name}" required>
                            <div class="invalid-feedback">Please enter a valid name. </div>
                            <div class="form-text">Enter a descriptive name for the operation</div>
                        </div>
                        
                        <div class="form-group-text">
                            <label for="${elemIdShortName}" class="form-label">
                                Short Name
                                <span id="${elemIdShortNameCounter}" class="char-counter">0/${max_len_short_name}</span>
                            </label>
                            <input  type="text" 
                                    class="form-control" 
                                    id="${elemIdShortName}" 
                                    maxlength="${max_len_short_name}" required>
                            <div class="invalid-feedback">Please enter a valid short name. </div>
                            <div class="form-text">Short name for plain text report.</div>
                        </div>
                        
                        <div class="form-section-title">
                            <i class="fas fa-align-left"></i>
                            Description
                        </div>
                        
                        <div class="form-group-text-area">
                            <label for="${elemIdDescription}" class="form-label">
                                Description
                                <span id="${elemIdDescriptionCounter}" class="char-counter">0/${max_len_description}</span>
                            </label>
                            <textarea class="form-control" 
                                    id="${elemIdDescription}" 
                                    maxlength="${max_len_description}" 
                                    rows="3" required></textarea>
                            <div class="invalid-feedback">Please enter a description. </div>
                            <div class="form-text">Provide details about this operation</div>
                        </div>
                        
                        <div class="form-section-title">
                            <i class="fas fa-calendar-alt"></i>
                            Operation Details
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group-number">
                                    <label for="${elemIdDayNumber}" class="form-label">Day Number</label>
                                    <input  type="number" 
                                            class="form-control" 
                                            id="${elemIdDayNumber}" 
                                            min="0" 
                                            max="365" required>
                                    <div class="form-text" id=${elemIdDayNumberDesc}>Days since operation started</div>
                                </div>
                            </div>
                        </div>
                        
                    </form>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-delete" id="${elemIdBtnDelete}">
                        <i class="fas fa-trash-alt me-2"></i>Delete
                    </button>
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
        
        return html;
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        
        elemModal               = document.getElementById(elemIdModal);
        elemModalTitle          = document.getElementById(elemIdModalTitle);
        elemName                = document.getElementById(elemIdName);
        elemShortName           = document.getElementById(elemIdShortName);
        elemDescription         = document.getElementById(elemIdDescription);
        elemDayNumber           = document.getElementById(elemIdDayNumber);
        elemDayNumberDesc       = document.getElementById(elemIdDayNumberDesc);
        elemBtnSave             = document.getElementById(elemIdBtnSave);
        elemBtnDelete           = document.getElementById(elemIdBtnDelete);
    
    
        elemNameCounter         = document.getElementById(elemIdNameCounter);
        elemShortNameCounter    = document.getElementById(elemIdShortNameCounter);
        elemDescriptionCounter  = document.getElementById(elemIdDescriptionCounter);
    
    }
    
    
    this._processAfterHtmlRender = function(){
        // Does not work
        //editModal               = new bootstrap.Modal(elemModal);
        
        
        editModal   = bootstrap.Modal.getOrCreateInstance(elemModal);

    }

    
    this._bindEventListeners = function(){
        elemName.addEventListener('input', function(){
            thisObj.updateCharCounter(elemName, elemNameCounter, 
                newEntry.fieldName.maxStrLen);
            
            elemName.classList.remove('is-invalid');
        });
        
        elemShortName.addEventListener('input', function(){
            thisObj.updateCharCounter(elemShortName, elemShortNameCounter, 
                newEntry.fieldShortName.maxStrLen);
            
            elemShortName.classList.remove('is-invalid');
        });
        
        elemDescription.addEventListener('input', function(){
            thisObj.updateCharCounter(elemDescription, elemDescriptionCounter, 
                newEntry.fieldDescription.maxStrLen);
            
            elemShortName.classList.remove('is-invalid');
        });
      
        
        
        
        elemDayNumber.addEventListener('blur', function() {
            thisObj._validateAfterChangeInput(this, 'day_num');
        });
        
        elemName.addEventListener('blur', function() {
            thisObj._validateAfterChangeInput(this, 'name');
        });
        
        elemShortName.addEventListener('blur', function() {
            thisObj._validateAfterChangeInput(this, 'short_name');
        });
        
        elemDescription.addEventListener('blur', function() {
            thisObj._validateAfterChangeInput(this, 'description');
        });
        
        


        elemBtnSave.addEventListener('click', function() {
            thisObj._onClickSaveButton();
        });
        
        
        elemBtnDelete.addEventListener('click', function() {
            thisObj._onClickDeleteButton();
        });

    }
    
    
    this.beforeShow = function(operation){
        var header_title;
        var min_days;
        var max_days;
        var num_days_title;
        
        const operation_type = operation.acc_pig_ops.operation_type;
        
        switch (operation_type) {
            case PIG_OPERATION_TYPE.GESTATING:{
                header_title    = 'New <b>Gestating</b> Operation';
                min_days        = 0;
                max_days        = 114;
                num_days_title  = "Number of days since boar mating or insemination";
                num_days_title  += ' Max ' + max_days + '.';
                break;
            }
            
            case PIG_OPERATION_TYPE.LACTATING_PIGLETS: {
                header_title    = 'New <b>Lactating Piglets</b> Operation';
                min_days        = 1;
                max_days        = 45;
                num_days_title  = "Number of days since piglets birth.";
                num_days_title  += ' Max ' + max_days + '.';
                break;
            }
            
            case PIG_OPERATION_TYPE.LACTATING_SOW:{
                header_title    = 'New <b>Lactating Sow</b> Operation';
                min_days        = 1;
                max_days        = 45;
                num_days_title  = "Number of days since piglets birth.";
                num_days_title  += ' Max ' + max_days + '.';
                break;
            }
            
            case PIG_OPERATION_TYPE.GILT:{
                header_title    = 'New <b>Gilt</b> Operation';
                min_days        = 1;
                max_days        = 300;
                num_days_title  = "Number of days since gilt birth.";
                num_days_title  += ' Max ' + max_days + '.';
                break;
            }
        }
        
        elemDayNumber.setAttribute("min", min_days); // Set a data attribute
        elemDayNumber.setAttribute("max", max_days); // Set a data attribute
        
        
        elemDayNumberDesc.innerHTML = num_days_title;
        
        
        
        
        // Set ModelAccountPigOps
        newEntry.fieldName.setValue(operation.acc_pig_ops.name);
        newEntry.fieldShortName.setValue(operation.acc_pig_ops.short_name);
        newEntry.fieldDescription.setValue(operation.acc_pig_ops.desc);
        newEntry.fieldNumDaysSince.setValue(operation.acc_pig_ops.num_days_since);
        
        
        // Remove elements validation classes
        elemName.classList.remove('is-invalid', 'is-valid');
        elemShortName.classList.remove('is-invalid', 'is-valid');
        elemDescription.classList.remove('is-invalid', 'is-valid');
        elemDayNumber.classList.remove('is-invalid', 'is-valid');
        
        
        // Populate form with operation data
        elemName.value          = operation.acc_pig_ops.name;
        elemShortName.value     = operation.acc_pig_ops.short_name;
        elemDescription.value   = operation.acc_pig_ops.desc;
        elemDayNumber.value     = operation.acc_pig_ops.num_days_since;
        
        
        // Update modal title
        elemModalTitle.innerHTML = 
            `<i class="fas fa-edit me-2"></i>Edit: ${operation.acc_pig_ops.name}`;
        
        
        // Initialize char counters
        thisObj.updateCharCounter(elemName, elemNameCounter, 
                newEntry.fieldName.maxStrLen);
        
        thisObj.updateCharCounter(elemShortName, elemShortNameCounter, 
                newEntry.fieldShortName.maxStrLen);
        
        thisObj.updateCharCounter(elemDescription, elemDescriptionCounter, 
                newEntry.fieldDescription.maxStrLen);
        
        
        // Show modal
        editModal.show();
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
                    input_elem  = elemName;
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
                    input_elem  = elemShortName;
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
                    input_elem  = elemDescription;
                    input_val   = input_elem.value || null;
                    cur_field   = newEntry.fieldDescription;
                    
                    
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
    
    
    this._onClickDeleteButton = function(){
        
    }
    
}
