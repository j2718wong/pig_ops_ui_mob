// December 31, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageProdEntryComponent}     from '../page_prod_entry_component.js';

import {PIG_OPERATION_TYPE}         from '../../../constants.js';
        
import {formatDate,
        FORMAT_LONG_MONTH}          from '../../../utils.js';


import {UiInputDatePicker}          from '../../common/ui/input_datepicker.js';
import {UiInputTextWithCounter}     from '../../common/ui/input_text_with_counter.js';
import {ComponentStaffFormGroup}    from '../../common/ui/comp_staff_form_group.js';

import {ComponentMedVacBrand}       from '../../sow_boar/components/comp_medvac_brand.js'
import {ComponentMedVacType}        from '../../sow_boar/components/comp_medvac_type.js'
import {ComponentAccMedVac}         from '../../sow_boar/components/comp_acc_medvac.js'


import {addValidationClassToElem}   from '../../common/ui/ui_utils.js';


export function PageProdPigOpsEdit(input_settings){
    
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
    
    
        
    
    let showOptions             = null;
    
    
   
    
    
    // The ProdPigOpsEdit can either be called from
    // - PigProdEntry (either Gesta or Lacta Entry) 
    // - SowBoarEntry (for Gilt only)
    
    // This is the DataPigProd 
    this.curDataPigProd         = null;
    
    // This is the DataSowBoar
    this.curDataSowBoar         = null;
    
    
    // This is the PigProdPigOps data
    let curDataProdPigOps       = null;
    
    
    this.callbackOnSuccessEdit  = null;

    
    
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
        
        elemUiDateActual.reset();
        
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
        
        
        // Update elemUiNotes help text
        if (curDataProdPigOps.account_pig_ops.is_medvac > 0){
            // TODO temporary hardcode
            elemUiNotes.setTextHelp('Describe the dosage given to pig. Sample: 2mL injection.');
        }
        
        else{
            elemUiNotes.setTextHelp('');
        }
        
        
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
    
    
    this.populateForm = function(data_operation){
        elemUiDateActual.setDate(data_operation.pig_prod_pig_ops.date_actual);
        componentStaff.setValue(data_operation.staff.hid);
        elemUiNotes.setValue(data_operation.notes.notes);
        
        console.log('data_operation');
        console.log(data_operation);
        
        // populate MedVac related data if ther are any
        if (data_operation.account_pig_ops.is_medvac > 0){
            if ('pig_medvac' in data_operation){
                const pig_medvac = data_operation.pig_medvac;
                
                // Necessary to display fully first the container
                setTimeout(function(){
                    componentMedVacBrand.setValue(pig_medvac.brand.hid);
                    componentMedVacType.setValue(pig_medvac.type.hid);
                    componentAccMedVac.setValue(pig_medvac.acc_medvac.hid);
                }, 100);
                
            }
            
        }
    }
    
    
	this.getMedVacBrandAndTypeHid = function(){
        return {
            brand_hid:  componentMedVacBrand.getValue(),
            type_hid:   componentMedVacType.getValue()
        }
    }
	
	
    this._validateAfterChangeInput = function(ev, input_field){
       
    }
    
    
    this.onClickSaveButton = function(){
        let input_elem      = null;
        let validation      = 0;
        

        let input_date_actual   = elemUiDateActual.getValue().trim();
        
        let input_medvac_brand  = componentMedVacBrand.getValue();
        let input_medvac_type   = componentMedVacType.getValue();
        let input_medvac_name   = componentAccMedVac.getValue();
        let input_notes         = elemUiNotes.getValue().trim();
        let input_staff         = componentStaff.getValue();
        
        
        input_elem          = elemUiDateActual.getElemText();
        if (input_date_actual.length == 0){
            validation = -1;
            addValidationClassToElem(input_elem, validation);
            return;
        }
        
        
        // Convert date to YYYY-MM-DD format
        const dt_actual     = new Date(input_date_actual);
        if (isNaN(dt_actual.getTime())){
            validation      = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        
        const dt_actual_s   = dt_actual.toLocaleDateString('en-CA');
        validation          = 0
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        if (curDataProdPigOps.account_pig_ops.is_medvac > 0){
            input_elem = componentMedVacBrand.getElemSelect();
            if (input_medvac_brand == '0'  || input_medvac_brand == '-1'){
                validation = -1;
            }
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
            
            
            input_elem = componentMedVacType.getElemSelect();
            if (input_medvac_type == '0'  || input_medvac_type == '-1'){
                validation = -1;
            }
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
            
            
            input_elem = componentAccMedVac.getElemSelect();
            if (input_medvac_name == '0'  || input_medvac_name == '-1'){
                validation = -1;
            }
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        
        
            // The notes is optional if operation is not Medvac.
            // But required if operation is MedVac.
            input_elem = elemUiNotes.getElemText();
            if (input_notes.length == 0){
                validation = -1;
            }
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        
        let done_by_user = 0;
        
        input_elem = componentStaff.getElemCheckBox();
        if (input_elem.checked){
            done_by_user = 1;
        }
        
        if (done_by_user == 0){
            input_elem = componentStaff.getElemSelect();
            if (input_staff == '0'  || input_staff == '-1'){
                validation = -1;
            }
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        
        // Check if user_account_hid is same with farm_account_hid;
        const user_account_hid = navigation.userControl.getUserAccountHid();
        const farm_account_hid = navigation.pigFarm.getPigFarmAccountHid();
        
        if (user_account_hid != farm_account_hid){
            console.log('User account_hid not equal to farm_account_hid');
            return;
        } 
        
        
        
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
            return;
        }
        
        
        
        const user_hid      = navigation.userControl.getUserHid();
        const base_url      = window.location.origin;
        
        let url = `${base_url}/pig_prod_pig_ops/update`;
        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'pig_prod_pig_ops_hid': curDataProdPigOps.pig_prod_pig_ops.hid,
            'staff_hid':        input_staff,
            'done_by_user':     done_by_user,
            'date':             dt_actual_s,
            'notes':            input_notes
        };
        
        if (curDataProdPigOps.account_pig_ops.is_medvac > 0){
            post_data.medvac_brand_hid  = input_medvac_brand;
            post_data.medvac_type_hid = input_medvac_type;
            post_data.acc_medvac_hid = input_medvac_name;
            
            url = `${base_url}/pig_prod_pig_ops/update_medvac`;
        }
        
        
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            url: url,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    thisObj._onSuccessEditPigOps(response.data);
                }
                else{
                    navigation.serverError.receivedErrorMessage(
                        response, elemServerErrorMsg);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
            }
        });
       
    }
    
    
    this._onSuccessEditPigOps = function(data){
        // Note:
        // The data_pig_prod.lactating_piglets_ops and 
        //     data_pig_prod.lactating_sow_ops
        // can be combined to 
        //      data_pig_prod.lactating_ops
        
        let data_pig_prod;
        
        // Replace the pig_ops  coming from the database
        let operation_type = curDataProdPigOps.pig_prod_pig_ops.operation_type
        switch (operation_type){
            case PIG_OPERATION_TYPE.GESTATING:{
                
                // Replace only curDataProdPigOps from the database.
                data_pig_prod = thisObj.curDataPigProd;
                
                const pig_prod_pig_ops_hid = curDataProdPigOps.pig_prod_pig_ops.hid;
                const callback_success = thisObj.callbackOnSuccessEdit;
                const elem_show_error = elemServerErrorMsg;
                
                let prod_pig_ops_list = data_pig_prod.gestating_ops;
                
                navigation.pigFarm.requestDataPigProdPigOpsEntry(data_pig_prod, 
                    prod_pig_ops_list, pig_prod_pig_ops_hid, callback_success, 
                    elem_show_error);
                        
                
                if (curDataProdPigOps.account_pig_ops.is_medvac > 0){
                    // Need to update the pig_medvac table as well
                    // TODO: only update if tehre is change; as of this writing
                    // just update it.
                    
                    const sow_hid = data_pig_prod.sow.hid;
                    
                    
                    // Get the data_sow_boar from navigation.pigFarm
                    const data_sow_boar = navigation.pigFarm.getDataSowBoar('F', sow_hid);
                    
                    
                    // Update sow_boar pig_medvac list if already requested;
                    if ('data_details' in data_sow_boar) {
                        navigation.pigFarm.requestDataPigMedVacList(data_sow_boar, null, elem_show_error);
                    }
                }
                
                navigation.showThisPage(showOptions.go_back_page);
                
                break;
            }
            
            case PIG_OPERATION_TYPE.LACTATING_PIGLETS:{
                
                // Replace only curDataProdPigOps from the database.
                data_pig_prod = thisObj.curDataPigProd;
                
                const pig_prod_pig_ops_hid = curDataProdPigOps.pig_prod_pig_ops.hid;
                const callback_success = thisObj.callbackOnSuccessEdit;
                const elem_show_error = elemServerErrorMsg;
                
                let prod_pig_ops_list = null;
                
                if ('lactating_piglets_ops' in data_pig_prod){
                    prod_pig_ops_list = data_pig_prod.lactating_piglets_ops;
                }
                else{
                    prod_pig_ops_list = data_pig_prod.lactating_ops;
                }
                
                navigation.pigFarm.requestDataPigProdPigOpsEntry(data_pig_prod, 
                    prod_pig_ops_list, pig_prod_pig_ops_hid, callback_success, 
                    elem_show_error);
                
                break;
            }
            
            case PIG_OPERATION_TYPE.LACTATING_SOW:{
                
                // Replace only curDataProdPigOps from the database.
                data_pig_prod = thisObj.curDataPigProd;
                
                const pig_prod_pig_ops_hid = curDataProdPigOps.pig_prod_pig_ops.hid;
                const callback_success = thisObj.callbackOnSuccessEdit;
                const elem_show_error = elemServerErrorMsg;
                
                let prod_pig_ops_list = null;
                
                if ('lactating_sow_ops' in data_pig_prod){
                    prod_pig_ops_list = data_pig_prod.lactating_sow_ops;
                }
                else{
                    prod_pig_ops_list = data_pig_prod.lactating_ops;
                }
                
                navigation.pigFarm.requestDataPigProdPigOpsEntry(data_pig_prod, 
                    prod_pig_ops_list, pig_prod_pig_ops_hid, callback_success, 
                    elem_show_error);
                
                
                break;
            }
            
            case PIG_OPERATION_TYPE.GILT:{
                // TODO for gilt
            }
            
        }
                    
                    
                    
                    
                    
       
    }

  
}
