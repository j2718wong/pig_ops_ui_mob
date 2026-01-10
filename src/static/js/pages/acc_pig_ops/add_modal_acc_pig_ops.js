// December 28, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../common/page_view_basic.js';

import {PIG_OPERATION_TYPE}     from '../../constants.js';
        
import {ModelAccountPigOps}     from '../../models/model_acc_pig_ops.js'

import {FIELD_VALIDATION_OK}    from '../../models/model_basic.js'



AddModalAccPigOps.prototype = new PageViewBasic();
export function AddModalAccPigOps(input_settings){
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
        
    var elemIdModalTitle        = null;
    var elemIdName              = null;
    var elemIdShortName         = null;
    var elemIdDescription       = null;
    var elemIdDayNumber         = null;
    var elemIdDayNumberDesc     = null;
    var elemIdBtnSave           = null;
    
    var elemIdNameCounter       = null;
    var elemIdShortNameCounter  = null;
    var elemIdDescriptionCounter= null;
    
    
    var elemModalTitle          = null;
    var elemName                = null;
    var elemShortName           = null;
    var elemDescription         = null;
    var elemDayNumber           = null;
    var elemDayNumberDesc       = null;
    var elemBtnSave             = null;
    
    var elemNameCounter         = null;
    var elemShortNameCounter    = null;
    var elemDescriptionCounter  = null;
    
    
    var newEntry                = new ModelAccountPigOps();
        
        
    var operationType           = null;
    
    
    this.init = function(){}
    
    
    this.getHtml = function(){
        
        elemIdModalTitle        = 'acc-pig-ops-add-modal-title';
        elemIdName              = 'acc-pig-ops-add-name';
        elemIdShortName         = 'acc-pig-ops-add-short-name';
        elemIdDescription       = 'acc-pig-ops-add-description';
        elemIdDayNumber         = 'acc-pig-ops-add-day-number';
        elemIdDayNumberDesc     = 'acc-pig-ops-add-day-number-desc';
        elemIdBtnSave           = 'acc-pig-ops-add-save';
        
        elemIdNameCounter       = 'acc-pig-ops-add-name-counter';
        elemIdShortNameCounter  = 'acc-pig-ops-add-short-name-counter';
        elemIdDescriptionCounter= 'acc-pig-ops-add-description-counter';
        
        
        const max_len_name          = newEntry.fieldName.maxStrLen;
        const max_len_short_name    = newEntry.fieldShortName.maxStrLen;
        const max_len_description   = newEntry.fieldDescription.maxStrLen;
        
        
        
        const html =`
    <div class="modal fade" id="add-entry-acc-pig-ops-modal" tabindex="-1" aria-labelledby="add-entry-acc-pig-ops-modal-label" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="add-entry-acc-pig-ops-modal-label">
                        <i class="fas fa-plus me-2"></i><span id="${elemIdModalTitle}">Add New Pig Operation</span>
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                
                <div class="modal-body">
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
                                <div class="invalid-feedback">Please enter a valid number. </div>
                                <div class="form-text" id="${elemIdDayNumberDesc}">Days since operation started</div>
                            </div>
                        </div>
                    </div>
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
        
        return html;
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
        
        console.log('add_modal_acc members');
        console.log(this);
    }
    
    
    this._findElements = function(){
        
        elemModalTitle          = document.getElementById(elemIdModalTitle);
        elemName                = document.getElementById(elemIdName);
        elemShortName           = document.getElementById(elemIdShortName);
        elemDescription         = document.getElementById(elemIdDescription);
        elemDayNumber           = document.getElementById(elemIdDayNumber);
        elemDayNumberDesc       = document.getElementById(elemIdDayNumberDesc);
        elemBtnSave             = document.getElementById(elemIdBtnSave);
    
        elemNameCounter         = document.getElementById(elemIdNameCounter);
        elemShortNameCounter    = document.getElementById(elemIdShortNameCounter);
        elemDescriptionCounter  = document.getElementById(elemIdDescriptionCounter);
    
    }
    
    
    this._processAfterHtmlRender = function(){
        
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
                
            elemDescription.classList.remove('is-invalid');
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
            thisObj.onClickSaveButton();
        });

    }
    
    
    // Reset add form
    this.beforeShow = function(operation_type){
        var header_title;
        var min_days;
        var max_days;
        var num_days_title;
        
        operationType = operation_type;
        
        switch (operation_type) {
            case PIG_OPERATION_TYPE.GESTATING:{
                header_title    = 'New <b>Gestating</b> Operation';
                min_days        = 0;
                max_days        = 114;
                num_days_title  = "Number of days since boar mating or insemination";
                break;
            }
            
            case PIG_OPERATION_TYPE.LACTATING_PIGLETS: {
                header_title    = 'New <b>Lactating Piglets</b> Operation';
                min_days        = 1;
                max_days        = 45;
                num_days_title  = "Number of days since piglets birth.";
                break;
            }
            
            case PIG_OPERATION_TYPE.LACTATING_SOW:{
                header_title    = 'New <b>Lactating Sow</b> Operation';
                min_days        = 1;
                max_days        = 45;
                num_days_title  = "Number of days since piglets birth.";
                break;
            }
            
            case PIG_OPERATION_TYPE.GILT:{
                header_title    = 'New <b>Gilt</b> Operation';
                min_days        = 1;
                max_days        = 300;
                num_days_title  = "Number of days since gilt birth.";
                break;
            }
        }
        
        elemDayNumber.setAttribute("min", min_days); // Set a data attribute
        elemDayNumber.setAttribute("max", max_days); // Set a data attribute
        
        elemDayNumberDesc.innerHTML = num_days_title + ' Max ' + max_days;
        
        
        // Clear inputs; 
        // Need to remove bootstrap validation classes since 
        // it is not cleared when viewing another entry;
        newEntry            = new ModelAccountPigOps();
        
        var cur_elem;
        
        cur_elem = elemDayNumber;
        cur_elem.value = ''; 
        cur_elem.classList.remove('is-valid', 'is-invalid');
        
        cur_elem = elemName;
        cur_elem.value = ''; 
        cur_elem.classList.remove('is-valid', 'is-invalid'); 
        
        cur_elem = elemShortName;
        cur_elem.value = ''; 
        cur_elem.classList.remove('is-valid', 'is-invalid'); 
        
        cur_elem = elemDescription;
        cur_elem.value = ''; 
        cur_elem.classList.remove('is-valid', 'is-invalid'); 
        
        
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
    
    
    
    this.onClickSaveButton = function(){
        var input_elem      = null;
        var cur_field       = null;
        var validation      = -1;
        var proceed_to_save = 1;
        
		
        var input_name      = elemName.value.trim();
        var input_short_name= elemShortName.value.trim();
        var input_description= elemDescription.value.trim();
        var input_num_days  = elemDayNumber.value;
        

        input_elem          = elemName;
        cur_field           = newEntry.fieldName;
        if (input_name.length == 0){input_name = null;}
        cur_field.newValue  = input_name;
        validation          = cur_field.validateChange();

        if (validation != FIELD_VALIDATION_OK){
            if (input_elem.classList.contains('is-invalid') == false){
                input_elem.classList.add('is-invalid');
            }
            proceed_to_save = 0;
        }
        else{
            if (input_elem.classList.contains('is-valid') == false){
                input_elem.classList.add('is-valid');
            }
        }
        
        if (proceed_to_save == 0) {return;}
        
        
        input_elem          = elemShortName;
        cur_field           = newEntry.fieldShortName;
        cur_field.newValue  = input_short_name;
        validation          = cur_field.validateChange();

        if (validation != FIELD_VALIDATION_OK){
            if (input_elem.classList.contains('is-invalid') == false){
                input_elem.classList.add('is-invalid');
            }
            proceed_to_save = 0;
        }
        else{
            if (input_elem.classList.contains('is-valid') == false){
                input_elem.classList.add('is-valid');
            }
        }
        
        if (proceed_to_save == 0) {return;}
        
        
        input_elem          = elemDescription;
        cur_field           = newEntry.fieldDescription;
        cur_field.newValue  = input_description;
        validation          = cur_field.validateChange();

        if (validation != FIELD_VALIDATION_OK){
            if (input_elem.classList.contains('is-invalid') == false){
                input_elem.classList.add('is-invalid');
            }
            proceed_to_save = 0;
        }
        else{
            if (input_elem.classList.contains('is-valid') == false){
                input_elem.classList.add('is-valid');
            }
        }
        
        if (proceed_to_save == 0) {return;}
        
		
		var input_num_days  = elemDayNumber.value;
        var input_name      = elemName.value.trim();
        var input_short_name= elemShortName.value.trim();
        var input_description= elemDescription.value.trim();
        
        
        input_elem          = elemDayNumber;
        cur_field           = newEntry.fieldNumDaysSince;
        cur_field.newValue  = input_num_days;
        validation          = cur_field.validateChange();
        
        if (validation != FIELD_VALIDATION_OK){
            if (input_elem.classList.contains('is-invalid') == false){
                input_elem.classList.add('is-invalid');
            }
            proceed_to_save = 0;
        }
        else{
            if (input_elem.classList.contains('is-valid') == false){
                input_elem.classList.add('is-valid');
            }
        }
        
        if (proceed_to_save == 0) {return;}
        
        
        var user_hid        = gController.getUserUhid();
        
        // send post request
        var post_data = {
            'uhid':             user_hid,
            'operation_type':   operationType,
            'num_days_since':   parseInt(newEntry.fieldNumDaysSince.newValue),
            'name':             newEntry.fieldName.newValue,
            'short_name':       newEntry.fieldShortName.newValue,
            'description':      newEntry.fieldDescription.newValue
        };
        

        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            url: gController.getBaseUrl() + '/account_pig_ops/add',
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    thisObj._onSuccessAddEntry(response.data);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                gfRequestError(jqXHR, textStatus, errorThrown, gController.getAppName());
            }
        });
    }
}