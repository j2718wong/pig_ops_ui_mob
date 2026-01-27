// December 31, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}       	from '../../common/page_view_basic.js';

import {PIG_OPERATION_TYPE}     	from '../../../constants.js';
        
import {formatDate,
        FORMAT_LONG_MONTH}      	from '../../../utils.js';


import {UiInputDatePicker}      	from '../../common/ui/input_datepicker.js';
import {UiInputTextWithCounter}     from '../../common/ui/input_text_with_counter.js';
import {ComponentStaffFormGroup} 	from '../../common/ui/comp_staff_form_group.js';

import {ComponentMedVacBrand}  		from '../../sow_boar/components/comp_medvac_brand.js'
import {ComponentMedVacType}   		from '../../sow_boar/components/comp_medvac_type.js'
import {ComponentAccMedVac}    		from '../../sow_boar/components/comp_acc_medvac.js'

        
import {ModelAccountPigOps}     	from '../../../models/model_acc_pig_ops.js'

import {FIELD_VALIDATION_OK,
        Field, ModelBasic}      	from '../../../models/model_basic.js'



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
    let elemDivContainer        = document.getElementById('container-edit-modal-prod-pig-ops');
        
    let elemIdModal             = null;
    let elemIdModalTitle        = null;
    let elemIdProdPigOpsTitle   = null;
    
	
	let elemUiDateActual		= null;
	
	let elemIdMedVacInputs		= null;
	let componentMedVacBrand	= null;
	let componentMedVacType		= null;
	let componentAccMedVac		= null;
	
	let elemUiNotes        		= null;
	let componentStaff			= null;
    
	let elemIdBtnSave           = null;
    let elemIdBtnDelete         = null;
    
    
    
    let elemModal               = null;
    let elemModalTitle          = null;
    let elemProdPigOpsTitle     = null;
    
	let elemBtnSave             = null;
    let elemBtnDelete           = null;
    
        
        
    let operationType           = null;
    
    let dataStaffList           = null;
    
    
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
    let prodPigOpsData  = null;
    
    
    this.cbMobileOnSuccessEdit  = null;

    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdModal             = `${settings.uniqueKey}-modal`;
        elemIdModalTitle        = `${settings.uniqueKey}-modal-title`;
        elemIdProdPigOpsTitle   = `${settings.uniqueKey}-modal-subtitle`;
        
		elemUiDateActual         = new UiInputDatePicker({
            uniqueKey:          `${settings.uniqueKey}-date-actual`,
        
            textLabel:          `Completion Date`,
            isRequired:         true,
            invalidFeedBack:    `Please enter a date.`,
            helpText:           null
        });
        
		
		elemIdMedVacInputs		= `${settings.uniqueKey}-medvac-inputs`;
		
		
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
		
		
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        elemIdBtnDelete         = `${settings.uniqueKey}-delete`;
        
        
		const html_date_actual	= elemUiDateActual.getHtml();
		const html_notes		= elemUiNotes.getHtml();
		const html_staff		= componentStaff.getHtml();
		
		
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
                    
                    ${html_date_actual}
					
					<div id="${elemIdMedVacInputs}">
						<!-- 2. MedVac Brand -->
						${html_medvac_brand}
						
						<!-- 3. MedVac Type -->
						${html_medvac_type}
						
						<!-- 4. Name -->
						${html_acc_medvac}
					</div>
\					
					${html_notes}
                    
                    ${html_staff}
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
        
        elemModal               = document.getElementById(elemIdModal);
        elemModalTitle          = document.getElementById(elemIdModalTitle);
        elemProdPigOpsTitle     = document.getElementById(elemIdProdPigOpsTitle);
        
		elemMedVacInputs		= document.getElementById(elemIdMedVacInputs);
		
        elemBtnSave             = document.getElementById(elemIdBtnSave);
        elemBtnDelete           = document.getElementById(elemIdBtnDelete);
    
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
    

    this.show = function(operation, options){
        let is_mark_done = false;
        
        if ('is_mark_done' in options){
            if (options.is_mark_done){
                is_mark_done = true;
            }
        }
        thisObj._resetForm();
        
        
        if (is_mark_done == true){
            elemModalTitle.textContent = 'Mark PigOps as Done';
        }
        else{
            elemModalTitle.textContent = 'Edit PigOps';
        }
        
        const pid           = options.pid;
        const sow           = options.sow;
        const is_gesta      = options.is_gesta;
        
        pigProdPid          = pid;
        prodPigOpsData      = operation;
        
        
        let html;
        
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
        
        
        // Set this if is edit
        if (is_mark_done == false){
            const dt_actual = new Date(operation.pig_prod_pig_ops.date_actual);
            elemDateActual.value = formatDate(dt_actual, FORMAT_LONG_MONTH);
        
            
            const staff_hid = operation.staff.hid;
            
            if (staff_hid != null){
                const $elemStaff = $(elemStaff);
                $elemStaff.val(operation.staff.hid).change();
            }
            else{
                console.log('No staff hid');
            }
            elemNotes.value = operation.notes.notes;
        }
        
 
        
        dataModel.hid = operation.pig_prod_pig_ops.hid;
        
        
        editModal.show();
        
        return;
        
    }
    
    
    this.hide = function(){
        editModal.hide();
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
        

        
        const user_hid      = thisObj.navigation.userControl.getUserHid();
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
