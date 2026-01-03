// December 31, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../../common/page_view_basic.js';

import {PIG_OPERATION_TYPE}     from '../../../constants.js';
        
import {ModelAccountPigOps}     from '../../../models/model_acc_pig_ops.js'

import {FIELD_VALIDATION_OK,
        Field, ModelBasic}      from '../../../models/model_basic.js'


EditModalProdPigOps.prototype = new PageViewBasic();
export function EditModalProdPigOps(input_settings){
    PageViewBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    
    /*
    Typical input_settings
    {
        navigation:             this
    }   
    */  
    var settings                = input_settings;
        
    // This is needed as ths will be first element to be rendered
    var elemDivContainer        = document.getElementById('container-edit-modal-prod-pig-ops');
        
    var elemIdModal             = null;
    var elemIdModalTitle        = null;
    var elemIdProdPigOpsTitle   = null;
    var elemIdDateActual        = null;
    var elemIdStaff             = null;
    var elemIdChkDoneByMe       = null;
    var elemIdNotes             = null;
    var elemIdBtnSave           = null;
    var elemIdBtnDelete         = null;
    
    var elemIdNotesCharCounter  = null;
    
    
    var elemModal               = null;
    var elemModalTitle          = null;
    var elemProdPigOpsTitle     = null;
    var elemDateActual          = null;
    var elemStaff               = null;
    var elemChkDoneByMe         = null;
    var elemNotes               = null;
    var elemBtnSave             = null;
    var elemBtnDelete           = null;
    
    
    var elemNotesCharCounter    = null;
    
    var editModal               = null;

        
        
    var operationType           = null;
    
    var dataStaffList           = null;
    
    
    // Use these fields for validation
    var fieldDateActual         = new Field();
    var fieldNotes              = new Field();
    var fieldStaffHid           = new Field();
    
    fieldNotes.maxStrLen  = 160;
    fieldDateActual.setValidation({cannotBeEmptyStr: true, isDateStr:true});
    
    // This is used in validation
    var dataModel               = new ModelBasic();
    
    // Attach these fields to data model
    dataModel['fieldDateActual']    = fieldDateActual;
    dataModel['fieldNotes']         = fieldNotes;
    dataModel['fieldStaffHid']      = fieldStaffHid;
    
    dataModel.editableFields.push(fieldDateActual);
    dataModel.editableFields.push(fieldNotes);
    dataModel.editableFields.push(fieldStaffHid);
    
    
    var pigProdPid      = null;
    var prodPigOpsData  = null;
    
    
    this.cbMobileOnSuccessEdit  = null;

    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdModal             = 'prod-pig-ops-edit-modal';
        elemIdModalTitle        = 'prod-pig-ops-edit-modal-title';
        elemIdProdPigOpsTitle   = 'prod-pig-ops-edit-modal-subtitle';
        elemIdDateActual        = 'prod-pig-ops-edit-date-actual';
        elemIdStaff             = 'prod-pig-ops-edit-staff';
        elemIdChkDoneByMe       = 'prod-pig-ops-edit-done-by-me';
        elemIdNotes             = 'prod-pig-ops-edit-notes';
        
        elemIdBtnSave           = 'prod-pig-ops-edit-save';
        elemIdBtnDelete         = 'prod-pig-ops-edit-delete';
        
        elemIdNotesCharCounter  = 'prod-pig-ops-edit-notes-counter';
        

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
                    <div class="form-section-title" style="margin-top:0;">
                        <i class="fas fa-tag"></i>
                        <span id="${elemIdProdPigOpsTitle}">PID: 00000 - Operation Name</span>
                    </div>
                    
                    <div class="form-group-date">
                        <label for="${elemIdDateActual}" class="form-label">
                            Completion Date
                        </label>
                        <input  type="text" 
                                class="form-control" 
                                id="${elemIdDateActual}" 
                                required>
                        <div class="form-text">Enter a date.</div>
                    </div>
                    
                    <div class="form-group-select">
                        <label for="${elemIdStaff}" class="form-label">
                            Staff Member
                        </label>
                        
                        <select id="${elemIdStaff}" class="form-select">
                            <option value="0" selected disabled>Please Select</option>
                        </select>
                        <div class="invalid-feedback">
                            Need to select if not done by you.
                        </div>
                        
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
                            <span id="${elemIdNotesCharCounter}" class="char-counter">0/160</span>
                        </label>
                        <textarea class="form-control" 
                                id="${elemIdNotes}" 
                                maxlength="160" 
                                rows="3"></textarea>
                        <div class="form-text">Notes about this operation.</div>
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
        elemDateActual          = document.getElementById(elemIdDateActual);
        elemStaff               = document.getElementById(elemIdStaff);
        elemChkDoneByMe         = document.getElementById(elemIdChkDoneByMe);
        elemNotes               = document.getElementById(elemIdNotes);

        elemBtnSave             = document.getElementById(elemIdBtnSave);
        elemBtnDelete           = document.getElementById(elemIdBtnDelete);
    
    
        elemNotesCharCounter    = document.getElementById(elemIdNotesCharCounter);
    
    }
    
    
    this._processAfterHtmlRender = function(){
        $('#'+elemIdDateActual).datepicker({
            format: 'MM d, yyyy',  // This gives "January 31, 2026"
            autoclose: true,
            endDate: new Date() // Max date is today
        }).on('show', function(e) {
            $('.datepicker').addClass('datepicker-material');
        });
        
        
        // Does not work
        //editModal               = new bootstrap.Modal(elemModal);
        
        
        editModal   = bootstrap.Modal.getOrCreateInstance(elemModal);

    }

    
    this._bindEventListeners = function(){
        
        elemNotes.addEventListener('input', function(){
            thisObj.updateCharCounter(elemNotes, elemNotesCharCounter, 
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
        
        
        elemDateActual.addEventListener('change', function() {
            thisObj._validateAfterChangeInput(this, 'date_actual');
        });
        
        elemStaff.addEventListener('change', function() {
            thisObj._validateAfterChangeInput(this, 'staff');
        });
        
        elemNotes.addEventListener('blur', function() {
            thisObj._validateAfterChangeInput(this, 'notes');
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
    
    
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        
        elemDateActual.value = '';
        elemDateActual.classList.remove('is-valid', 'is-invalid');
        
        elemStaff.selectedIndex = 0; 
        elemNotes.classList.remove('is-valid', 'is-invalid');
        
        elemChkDoneByMe.checked = false;
        
        elemNotes.value = '';
        elemNotes.classList.remove('is-valid', 'is-invalid');
    }
    

    this.show = function(operation, options){
        thisObj._resetForm();
        
        const pid           = options.pid;
        const sow           = options.sow;
        const is_gesta      = options.is_gesta;
        
        pigProdPid          = pid;
        prodPigOpsData      = operation;
        
        
        var html;
        
        html = `PID: ${pid}(${sow}) - ${operation.account_pig_ops.name}`;
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
        thisObj.updateCharCounter(elemNotes, elemNotesCharCounter, 
                160);
        
        
        dataModel.hid = operation.pig_prod_pig_ops.hid;
        
        
        editModal.show();
        
        return;
        
    }
    
    
    this._validateAfterChangeInput = function(ev, input_field){
        /* Use this to validate new entry form input.*/
    
        var input_elem  = null;
        var input_val   = null;
        var cur_field   = null;
        var validation  = null;
     
        
        if (ev.checkValidity()) {
            switch(input_field){
            
                case 'date_actual': {
                    input_elem  = elemDateActual;
                    input_val   = input_elem.value;
                    cur_field   = fieldDateActual;
                    
                    console.log('date_actual = ' + input_val);
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
                
                case 'staff':{
                    ev.classList.remove('is-invalid');
                    break;
                }
                
                case 'notes': {
                    input_elem  = elemNotes;
                    input_val   = input_elem.value;
                    cur_field   = fieldNotes;
                    
                    
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
                
                case 'staff':{
                    input_elem  = elemStaff;
                    input_val   = input_elem.val();
                    
                    
                    if (input_val != '0'){
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
        var input_elem      = null;
        var cur_field       = null;
        var validation      = -1;
        var proceed_to_save = 1;
        

        var input_date_actual   = elemDateActual.value;
        var input_notes         = elemNotes.value.trim();
        var input_staff_hid     = elemStaff.value;
        
        
        input_elem          = elemDateActual;
        cur_field           = fieldDateActual;
        cur_field.newValue  = input_date_actual;
        validation          = cur_field.validateChange();

        if (validation != FIELD_VALIDATION_OK){
            if (input_elem.classList.contains('is-invalid') == false){
                input_elem.classList.add('is-invalid');
            }
            proceed_to_save = 0;
        } else{
             if (input_elem.classList.contains('is-valid') == false){
                input_elem.classList.add('is-valid');
            }
        }
        if (proceed_to_save == 0) {return;}
        
        
        // The staff can be from the drop down
        // Or Done by User (Done by Me checkbox)
        var done_by_user = 0
        
        if (elemChkDoneByMe.checked){done_by_user = 1;}
        
        if (done_by_user == 0){
            input_elem          = elemStaff;
            if (input_staff_hid == '0'){
                if (input_elem.classList.contains('is-invalid') == false){
                    input_elem.classList.add('is-invalid');
                }
                proceed_to_save = 0;
            }
            else{
                if (input_elem.classList.contains('is-valid') == false){
                    input_elem.classList.add('is-valid');
                }
                fieldStaffHid.newValue = input_staff_hid;
            }
        }
        if (proceed_to_save == 0) {return;}
        
        
        input_elem          = elemNotes;
        cur_field           = fieldNotes;
        cur_field.newValue  = input_notes;
        validation          = cur_field.validateChange();

        if (validation != FIELD_VALIDATION_OK){
            if (input_elem.classList.contains('is-invalid') == false){
                input_elem.classList.add('is-invalid');
            }
            proceed_to_save = 0;
        } else{
             if (input_elem.classList.contains('is-valid') == false){
                input_elem.classList.add('is-valid');
            }
        }
        if (proceed_to_save == 0) {return;}
        
        
        if (dataModel.hasChanged() == false){
            console.log('No data Change');
            return;
        }
        
        console.log('thisObj');
        console.log(thisObj);
        
        const user_hid      = thisObj.navigation.userControl.getUserHid();
        const base_url      = thisObj.navigation.userControl.getBaseUrl();
        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'pig_prod_pig_ops_hid': dataModel.hid,
            'staff_hid':        input_staff_hid,
            'done_by_user':     done_by_user,
            'date':             input_date_actual,
            'notes':            input_notes
        };
        
        console.log(post_data);
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            url: `${base_url}/pig_prod_pig_ops/update`,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    
                    // Replace these data
                    prodPigOpsData.pig_prod_pig_ops.date_actual = input_date_actual;
                    prodPigOpsData.staff.hid    = input_staff_hid;
                    prodPigOpsData.notes.notes  = input_notes;
                    
                    // callback to refresh the table
                    thisObj._onSuccessUpdatePigOps();
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
            }
        });
       
    }
    
    
    this._onSuccessUpdatePigOps = function(){
        if (thisObj.navigation.curScreenIsMobile > 0){
            
            if (thisObj.cbMobileOnSuccessEdit){
                thisObj.cbMobileOnSuccessEdit(pigProdPid);
            }
        }
        
        
        // TODO for desktop
       
    }

  
}
