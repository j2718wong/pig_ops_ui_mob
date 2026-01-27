// December 31, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}        from '../../common/page_view_basic.js';

import {PIG_OPERATION_TYPE}         from '../../../constants.js';
        
import {formatDate,
        FORMAT_LONG_MONTH}          from '../../../utils.js';


import {UiInputDatePicker}          from '../../common/ui/input_datepicker.js';
import {UiInputTextWithCounter}     from '../../common/ui/input_text_with_counter.js';
import {ComponentStaffFormGroup}    from '../../common/ui/comp_staff_form_group.js';

import {ComponentMedVacBrand}       from '../../sow_boar/components/comp_medvac_brand.js'
import {ComponentMedVacType}        from '../../sow_boar/components/comp_medvac_type.js'
import {ComponentAccMedVac}         from '../../sow_boar/components/comp_acc_medvac.js'

        
import {ModelAccountPigOps}         from '../../../models/model_acc_pig_ops.js'

import {FIELD_VALIDATION_OK,
        Field, ModelBasic}          from '../../../models/model_basic.js'



export function PageProdPigOpsEdit(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    
    /*
    Typical input_settings
    {
        navigation:             this,
        uniqueKey:              'sow-boar-health',
    }   
    */  
    let settings                = input_settings;
        
    // This is needed as ths will be first element to be rendered
    let elemDivContainer        = document.getElementById(settings.elemIdDivContainer);
        
    let elemIdBtnClose          = null;
        
    let elemIdHeaderTitle       = null;
    let elemIdHeaderSubTitle    = null;
    
    
    let elemUiDateActual        = null;
    
    let elemIdMedVacInputs      = null;
    let componentMedVacBrand    = null;
    let componentMedVacType     = null;
    let componentAccMedVac      = null;
    
    let elemUiNotes             = null;
    let componentStaff          = null;
    
    let elemIdServerErrorMsg    = null;
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemBtnClose            = null;
    
    let elemHeaderTitle         = null;
    let elemHeaderSubTitle      = null;
    
    let elemMedVacInputs        = null;
    
    
    let elemServerErrorMsg      = null;
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
        
        
    let operationType           = null;
    
    let showOptions             = null;
    
    
    // Use these fields for validation
    let fieldDateActual         = new Field();
    let fieldNotes              = new Field();
    let fieldStaffHid           = new Field();
    
    fieldNotes.maxStrLen  = 160;
    fieldDateActual.setValidation({cannotBeEmptyStr: true, isDateStr:true});
    
    // This is used in validation
    let dataModel               = new ModelBasic();
    
    // Attach these fields to data model
    dataModel['fieldDateActual']    = fieldDateActual;
    dataModel['fieldNotes']         = fieldNotes;
    dataModel['fieldStaffHid']      = fieldStaffHid;
    
    dataModel.editableFields.push(fieldDateActual);
    dataModel.editableFields.push(fieldNotes);
    dataModel.editableFields.push(fieldStaffHid);
    
    
    let pigProdPid      = null;
    let curDataProdPigOps  = null;
    
    
    this.cbMobileOnSuccessEdit  = null;

    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
        
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        elemIdHeaderSubTitle    = `${settings.uniqueKey}-subtitle`;
        
        elemUiDateActual         = new UiInputDatePicker({
            uniqueKey:          `${settings.uniqueKey}-date-actual`,
        
            textLabel:          `Completion Date`,
            isRequired:         true,
            invalidFeedBack:    `Please enter a date.`,
            helpText:           null
        });
        
        
        elemIdMedVacInputs      = `${settings.uniqueKey}-medvac-inputs`;
        
        
        componentMedVacBrand    = new ComponentMedVacBrand({
            navigation:         navigation,
            uniqueKey:          `${settings.uniqueKey}-medvac-brand-name`,

            titleExpandSection: 'Add New MedVac Brand',
            htmlExpandSection:  null,
            labelBtnExpandSave: 'Save MedVac Brand',
            
            labelSelect:        'Select MedVac Brand',
            helpText:           'MedVac brand name or manufacturer'
        });
        
        
        componentMedVacType     = new ComponentMedVacType({
            navigation:         navigation,
            uniqueKey:          `${settings.uniqueKey}-medvac-type`,

            titleExpandSection: 'Add New MedVac Type',
            htmlExpandSection:  null,
            labelBtnExpandSave: 'Save MedVac Type',
        
            labelSelect:        'Select MedVac Type',
            helpText:           'MedVac generic description or what it is for'
        });
        
        
        componentAccMedVac      = new ComponentAccMedVac({
            navigation:         navigation,
            parentObj:          thisObj,
            uniqueKey:          `${settings.uniqueKey}-medvac-name`,

            titleExpandSection: 'Add New MedVac Name',
            htmlExpandSection:  null,
            labelBtnExpandSave: 'Save MedVac Name',
        
            labelSelect:        'Select MedVac Name',
            helpText:           'MedVac product name'
        });
        
        
        
        elemUiNotes             = new UiInputTextWithCounter({
            uniqueKey:          `${settings.uniqueKey}-notes`,
            
            isTextArea:         true,
            isRequired:         false,
            className:          'form-group-text-area',
            textLabel:          'Notes',
            textMaxChars:       160,
            rows:               3,
            helpText:           null  
        });
        
        
        componentStaff          = new ComponentStaffFormGroup({
            navigation:         navigation,
            uniqueKey:          `${settings.uniqueKey}-staff`,
            
            includeAddNew:      true,
            includeDoneByMe:    true,
            
            titleExpandSection: 'Add New Staff',
            htmlExpandSection:  null,
            labelBtnExpandSave: 'Save New Staff',
            
            labelSelect:        'Staff Member',
            helpText:           'Who did the operation'
        });
        
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        elemIdBtnCancel         = `${settings.uniqueKey}-cancel`;
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        
        
        const html_date_actual  = elemUiDateActual.getHtml();
        const html_medvac_brand = componentMedVacBrand.getHtml();
        const html_medvac_type  = componentMedVacType.getHtml();
        const html_acc_medvac   = componentAccMedVac.getHtml();
        const html_notes        = elemUiNotes.getHtml();
        const html_staff        = componentStaff.getHtml();
        
        
        const html = `
<div class="form-container">

    <div class="modal-header">
        <h5 class="modal-title" id="edit-entry-prod-pig-ops-modal-label">
            <span id="${elemIdHeaderTitle}">Mark PigOps as Done</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    <div class="modal-body">
        <div class="form-section-title" style="margin-top:0;">
            <i class="fas fa-tag"></i>
            <span id="${elemIdHeaderSubTitle}">PID: 00000 - Operation Name</span>
        </div>
        
        ${html_date_actual}
        
        <div id="${elemIdMedVacInputs}">
            <!-- 2. MedVac Brand -->
            ${html_medvac_brand}
            
            <!-- 3. MedVac Type -->
            ${html_medvac_type}
            
            <!-- 4. Name -->
            ${html_acc_medvac}
        </div>
       
        ${html_notes}
        
        ${html_staff}
    
    
        <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
    
    </div>
        
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
        
        elemDivContainer.innerHTML = html;
        
    }
    
    
    this.afterHtmlRender = function(){
        
        elemUiDateActual.afterHtmlRender();
        
        componentMedVacBrand.afterHtmlRender();
        componentMedVacType.afterHtmlRender();
        componentAccMedVac.afterHtmlRender();
        
        elemUiNotes.afterHtmlRender();
        componentStaff.afterHtmlRender();
        
        
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemBtnClose            = elemDivContainer.querySelector('#'+elemIdBtnClose);
        
        elemHeaderTitle         = elemDivContainer.querySelector('#'+elemIdHeaderTitle);
        elemHeaderSubTitle      = elemDivContainer.querySelector('#'+elemIdHeaderSubTitle);
        
        elemMedVacInputs        = elemDivContainer.querySelector('#'+elemIdMedVacInputs);
        
        elemServerErrorMsg      = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);
        elemBtnCancel           = elemDivContainer.querySelector('#'+elemIdBtnCancel);
        elemBtnSave             = elemDivContainer.querySelector('#'+elemIdBtnSave);
        
    }
    
    
    this._processAfterHtmlRender = function(){
      

    }

    
    this._bindEventListeners = function(){
        
        elemBtnSave.addEventListener('click', function() {
            thisObj.onClickSaveButton();
        });
        
        
    }
    
      
    
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        
        elemUiNotes.reset();
        
        componentMedVacBrand.reset();
        componentMedVacType.reset();
        componentAccMedVac.reset()
        
        elemUiNotes.reset();
        componentStaff.reset();
    }
    

    this.beforeShow = function(data_operation, options){
        curDataProdPigOps   = data_operation;
        showOptions         = options;
        
        /*
        Typical options
        options = {
            pid:            pid,
            sow:            sow_reference,
            is_gesta:       is_gesta,
            is_mark_done:   true
        }
        
        */
        
        thisObj._resetForm();
        
        
        componentMedVacBrand.beforeShow();
        componentMedVacType.beforeShow();
        componentAccMedVac.beforeShow();
        
        componentStaff.beforeShow();

        
        
        // Set Page Title
        let is_mark_done = false;
        
        if ('is_mark_done' in showOptions){
            if (showOptions.is_mark_done){
                is_mark_done = true;
            }
        }
        
        if (is_mark_done == true){
            elemHeaderTitle.textContent = 'Mark PigOps as Done';
        }
        else{
            elemHeaderTitle.textContent = 'Edit PigOps';
        }
        
        const pid           = showOptions.pid;
        const sow           = showOptions.sow;
        const is_gesta      = showOptions.is_gesta;
        
        pigProdPid          = pid;
        
        
        
        let html;
        
        html = `PID: ${pid}(${sow}) - ${data_operation.account_pig_ops.name}`;
        elemHeaderSubTitle.innerHTML = html;
        
        
        const modal_header = elemDivContainer.querySelector('.modal-header');
        
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
        
        
        // Set this if is edit
        if (is_mark_done == false){
            this.populateForm(data_operation)
        }
        
        
        // Check if operation is MedVac
        if (curDataProdPigOps.account_pig_ops.is_medvac > 0){
            elemMedVacInputs.style.display = 'block';
        }
        else{
            elemMedVacInputs.style.display = 'none';
        }
        

        // Update Close and cancel button on click
        
        elemBtnClose.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
        
        elemBtnCancel.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
    }
    
    
    this.populateForm = function(data){
        const dt_actual = new Date(data_operation.pig_prod_pig_ops.date_actual);
        elemDateActual.value = formatDate(dt_actual, FORMAT_LONG_MONTH);
    
        
        const staff_hid = data_operation.staff.hid;
        
        if (staff_hid != null){
            const $elemStaff = $(elemStaff);
            $elemStaff.val(data_operation.staff.hid).change();
        }
        else{
            console.log('No staff hid');
        }
        elemNotes.value = data_operation.notes.notes;
    }
    
    
    this._validateAfterChangeInput = function(ev, input_field){
        /* Use this to validate new entry form input.*/
    
        let input_elem  = null;
        let input_val   = null;
        let cur_field   = null;
        let validation  = null;
     
        
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
    
    
    this.onClickSaveButton = function(){
        let input_elem      = null;
        let cur_field       = null;
        let validation      = -1;
        let proceed_to_save = 1;
        

        let input_date_actual   = elemDateActual.value;
        let input_notes         = elemNotes.value.trim();
        let input_staff_hid     = elemStaff.value;
        
        
        input_elem          = elemDateActual;
        cur_field           = fieldDateActual;
        
        // Convert date to YYYY-MM-DD format
        const dt_actual     = new Date(input_date_actual);
        const dt_actual_s   = dt_actual.toLocaleDateString('en-CA');
        
        cur_field.newValue  = dt_actual_s;
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
        let done_by_user = 0
        
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
        

        
        const user_hid      = navigation.userControl.getUserHid();
        const base_url      = window.location.origin;
        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'pig_prod_pig_ops_hid': dataModel.hid,
            'staff_hid':        input_staff_hid,
            'done_by_user':     done_by_user,
            'date':             dt_actual_s,
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
                    curDataProdPigOps.pig_prod_pig_ops.date_actual = input_date_actual;
                    curDataProdPigOps.staff.hid    = input_staff_hid;
                    curDataProdPigOps.notes.notes  = input_notes;
                    
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
        if (navigation.curScreenIsMobile > 0){
            
            if (thisObj.cbMobileOnSuccessEdit){
                thisObj.cbMobileOnSuccessEdit(pigProdPid);
            }
        }
        
        
        // TODO for desktop
       
    }

  
}
