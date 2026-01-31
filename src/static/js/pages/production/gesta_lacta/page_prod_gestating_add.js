// December 23, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../../common/page_view_basic.js';

import {PAGE_ID,
        SOW_STATUS,
        PIG_PROD_TYPE,
        PIG_OPERATION_TYPE,
        PROD_STATUS,
        SUPPLIER_TYPE}          from '../../../constants.js';


import {SelectSowGesta}         from './components/select_sow_gesta.js';
import {SelectBoarGesta}        from './components/select_boar_gesta.js';
import {ComponentSemenSupplier} from './components/comp_semen_supplier.js';
import {ComponentSemenType}     from './components/comp_semen_type.js';


import {UiInputDatePicker}      from '../../common/ui/input_datepicker.js';
import {UiInputTextWithCounter} from '../../common/ui/input_text_with_counter.js';
import {ComponentStaffFormGroup} from '../../common/ui/comp_staff_form_group.js';

import {CommonSelectOptions}    from '../../common/common_select_options.js';


import {addValidationClassToElem} from '../../common/ui/ui_utils.js';

import {ModelPigProduction}     from '../../../models/model_pig_production.js'

import {FIELD_VALIDATION_OK}    from '../../../models/model_basic.js'



export function PageProdGestatingAdd(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
      
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContProdGestaAdd,
        uniqueKey:              'prod-add-gesta'
    };
    */
    const settings              = input_settings;

    
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
        
        
    let elemIdBtnClose          = null;
    
    let componentSelectSow      = null;
    let elemUiDateMating        = null;
    
    let elemIdInsemType         = null;
    
    
    
    let elemIdAiShow            = null;
    
    let componentSemenSupplier  = null;
    let componentSemenType      = null;
    let componentSelectBoarInt  = null;
   

    let elemIdSemenCost         = null;
  
    
    let elemIdOtherCost         = null;
    
    let elemUiNotes             = null;
    let componentStaff          = null;
    
    let elemIdServerErrorMsg    = null;
    
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemBtnClose            = null;
    
    let elemDateMating          = null;
    let elemInsemType           = null;
    
    let componentSelectBoar     = null;
    
    
    let elemAiShow              = null;
    
    let elemSemenCost           = null;
    
   
    
    let elemOtherCost           = null;
    
  
    let elemServerErrorMsg      = null;
    
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
    
    let newEntry                = new ModelPigProduction();
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdBtnClose          = `${settings.uniqueKey}-select-close`;
        
        componentSelectSow      = new SelectSowGesta({
            navigation:         navigation,
            uniqueKey:          `${settings.uniqueKey}-select-sow`,
            
            pageDivContainer:   elemDivContainer,
            
            labelSelect:        'Select Sow',
            helpText:           null
        });
        
        
        elemUiDateMating        = new UiInputDatePicker({
            uniqueKey:          `${settings.uniqueKey}-date-mating`,
        
            textLabel:          'Date Mating or Insemination',
            isRequired:         true,
            invalidFeedBack:    'Please input date.',
            helpText:           null
        });
        
        
        elemIdInsemType         = `${settings.uniqueKey}-insem-type`;
       
       
        componentSelectBoar     = new SelectBoarGesta({
            navigation:         navigation,
            uniqueKey:          `${settings.uniqueKey}-select-boar`,
            
            pageDivContainer:   elemDivContainer,
            
            labelSelect:        'Select Boar',
            helpText:           null
        });
        
        
        
        elemIdAiShow            = `${settings.uniqueKey}-select-ai-show`;
        
        
        componentSemenSupplier  = new ComponentSemenSupplier({
            navigation:         navigation,
            parentObj:          thisObj,
            uniqueKey:          `${settings.uniqueKey}-semen-supplier`,
            
            pageDivContainer:   elemDivContainer,
            
            labelSelect:        'Semen Supplier',
            helpText:           null
        });
        
        
        componentSemenType      = new ComponentSemenType({
            navigation:         navigation,
            parentObj:          thisObj,
            uniqueKey:          `${settings.uniqueKey}-semen-type`,

            titleExpandSection: 'Add New Semen Type',
            htmlExpandSection:  null,
            labelBtnExpandSave: 'Save Semen Type',
            
            labelSelect:        'Select Semen Type',
            helpText:           'Supplier Semen Type'
        });
        
        
        elemIdSemenCost         = `${settings.uniqueKey}-semen-cost`;
        
        
        componentSelectBoarInt  = new SelectBoarGesta({
            navigation:         navigation,
            uniqueKey:          `${settings.uniqueKey}-select-boar-int`,
            
            pageDivContainer:   elemDivContainer,
            
            labelSelect:        'Boar where Semen extracted',
            helpText:           null
        });
        
        
        
        elemIdOtherCost         = `${settings.uniqueKey}-other-cost`;
        
        
        elemUiNotes             = new UiInputTextWithCounter({
            uniqueKey:          `${settings.uniqueKey}-notes`,
            
            isTextArea:         true,
            className:          'form-group-text-area',
            textLabel:          'Notes',
            isRequired:         false,
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
        
        
        const html_select_sow   = componentSelectSow.getHtml();
        const html_date_mating  = elemUiDateMating.getHtml();
        const html_select_boar  = componentSelectBoar.getHtml();
        
        const html_semen_supplier   = componentSemenSupplier.getHtml();
        const html_semen_type       = componentSemenType.getHtml();
        const html_select_boar_int  = componentSelectBoarInt.getHtml();
        
        const html_notes        = elemUiNotes.getHtml();
        const html_staff        = componentStaff.getHtml();
        
        const html =`

        
<div class="form-container">

    <div class="modal-header gestating">
        <h5 class="modal-title" id="add-entry-acc-pig-ops-modal-label">
            <i class="fas fa-plus me-2"></i><span>Add Prod Gestating</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    
    <div class="modal-body">
        
        <!-- 1. Sow Field with Combined Warning -->
        ${html_select_sow}    
        
        <!-- 2. Date Mating -->
        ${html_date_mating}
        
        
        <!-- 3. Insemination Type -->
        <div class="form-group-select">
            <label for="${elemIdInsemType}" class="form-label">
                Insemination Type
            </label>
                        
            <select class="form-select" id="${elemIdInsemType}" required>
                <option value="boar-mating" selected>Boar Mating</option>
                <option value="ai-external">Artificial Insem External</option>
                <option value="ai-internal">Artificial Insem Internal</option>
            </select>
        </div>
        
        <!-- 4. Boar Field -->
        ${html_select_boar}
        
        <div id="${elemIdAiShow}" class="ai-section" style="display: none;">
            <!-- 1. Semen Supplier -->
            ${html_semen_supplier}
            
            <!-- 2. Semen Type -->
            ${html_semen_type}
            
            <!-- 3. Semen Cost -->
            <div class="form-group-number">
                <label for="${elemIdSemenCost}" class="form-label">
                    Semen Cost
                </label>
                
                <input type="number" class="form-control" id="${elemIdSemenCost}" placeholder="0.00" step="0.1" min="0" value="0.00">
                <div class="invalid-feedback">
                    Please enter numeric value.
                </div>
            </div>
        </div>
        
        
        ${html_select_boar_int}
        
        
        <!-- 5. Other Cost -->
        <div class="form-group-number">
            <label for="${elemIdOtherCost}" class="form-label">
                Other Cost
            </label>
                
            <input type="number" class="form-control" id="${elemIdOtherCost}" placeholder="0.00" step="0.1" min="0">
            <div class="invalid-feedback">
                Please enter numeric value.
            </div>
        </div>
        
        
        <!-- 6. Notes -->
        ${html_notes}
        
        <!-- 7. Staff -->
        ${html_staff}
        
        <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
        
        <!-- Footer Buttons -->
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="${elemIdBtnCancel}" data-bs-dismiss="modal" style="margin-right:10px;">
                <i class="fas fa-times me-2"></i>Cancel
            </button>
            <button type="button" class="btn btn-primary" id="${elemIdBtnSave}">
                <i class="fas fa-save me-2"></i>Save
            </button>
        </div>
    </div>
</div>


        `;
        
        
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        componentSelectSow.afterHtmlRender();
        elemUiDateMating.afterHtmlRender();
        componentSelectBoar.afterHtmlRender();
        
        componentSemenSupplier.afterHtmlRender();
        componentSemenType.afterHtmlRender();
        componentSelectBoarInt.afterHtmlRender();
        
        elemUiNotes.afterHtmlRender();
        componentStaff.afterHtmlRender();
        
        
        componentSemenSupplier.setComponentSemenType(componentSemenType);
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemBtnClose            = elemDivContainer.querySelector('#'+elemIdBtnClose);
        
        elemInsemType           = elemDivContainer.querySelector('#'+elemIdInsemType);
        
        elemAiShow              = elemDivContainer.querySelector('#'+elemIdAiShow);
        
        elemSemenCost           = elemDivContainer.querySelector('#'+elemIdSemenCost);
        
        elemOtherCost           = elemDivContainer.querySelector('#'+elemIdOtherCost);
        
        
        elemServerErrorMsg      = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);
            
        elemBtnCancel           = elemDivContainer.querySelector('#'+elemIdBtnCancel);
        elemBtnSave             = elemDivContainer.querySelector('#'+elemIdBtnSave);
    }
    
    
    this._processAfterHtmlRender = function(){
        
    }
    
    
    this._bindEventListeners = function(){
        
       
        elemInsemType.addEventListener('change', function() {
            const selected_value = elemInsemType.value;

            switch (selected_value) {
                case 'boar-mating': {
                    componentSelectBoar.show();
                    elemAiShow.style.display = 'none';
                    componentSelectBoarInt.hide();
                    break;
                }
                
                case 'ai-external': {
                    componentSelectBoar.hide();
                    elemAiShow.style.display = 'block';
                    componentSelectBoarInt.hide();
                    break;
                }
                
                case 'ai-internal': {
                    componentSelectBoar.hide();
                    elemAiShow.style.display = 'none';
                    componentSelectBoarInt.show();
                    break;
                }
            }
        });
        
        
        elemOtherCost.addEventListener('blur', function() {
            thisObj._validateAfterChangeInput(this, 'other_cost');
        });
         
        
              
        elemBtnClose.addEventListener('click', function() {
            navigation._onClickNavProdGestaLacta(null, PIG_OPERATION_TYPE.GESTATING);
        });
        
        
        elemBtnCancel.addEventListener('click', function() {
            navigation._onClickNavProdGestaLacta(null, PIG_OPERATION_TYPE.GESTATING);
        });
        
        
        elemBtnSave.addEventListener('click', function() {
            thisObj.onClickSaveButton();
        });
        
        
    }
    
    
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        
      
        componentSelectSow.reset();
        
        elemUiDateMating.reset();
        
        
        // This is needed as there is a switch in inputs
        elemInsemType.selectedIndex = 0;
        const event = new Event('change');
        elemInsemType.dispatchEvent(event); 
        componentSelectBoar.show();
        
        componentSelectBoar.reset();
        componentSelectBoarInt.reset();
        componentSelectBoarInt.hide();
        
        componentSemenSupplier.reset();
        componentSemenType.reset();
        
        
        elemSemenCost.value = '';
        elemSemenCost.classList.remove('is-valid', 'is-invalid');
        
        
        elemOtherCost.value = '';
        elemOtherCost.classList.remove('is-valid', 'is-invalid');
        
        
        
        elemUiNotes.reset();
        componentStaff.reset();
        
    }
    
    
    this.show = function(){
        thisObj._resetForm();
        
        componentSelectSow.beforeShow();
        
        componentSelectBoar.beforeShow();
        componentSelectBoarInt.beforeShow();
        
        componentSemenSupplier.beforeShow();
        componentStaff.beforeShow();
    }
    
        
    this._validateAfterChangeInput = function(ev, input_field){
        /* Use this to validate new entry form input.*/
    
        let input_elem  = null;
        let input_val   = null;
        let cur_field   = null;
        let validation  = null;
        
        
        if (ev.checkValidity()) {
            switch(input_field){
            
                
                
                case 'other_cost': {
                    input_elem  = elemOtherCost;
                    input_val   = input_elem.value;
                    cur_field   = newEntry.fieldInsemCost;
                    
                    
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
        let input_elem      = null;
        let validation      = 0;
        

        let input_sow_hid           = componentSelectSow.getValue();
        let input_insem_type        = elemInsemType.value;
        let input_boar_hid          = componentSelectBoar.getValue();
        let input_boar_int_hid      = componentSelectBoarInt.getValue();
        let input_date_mating       = elemUiDateMating.getValue();
        let input_semen_supplier_hid = componentSemenSupplier.getValue();
        let input_semen_type_hid    = componentSemenType.getValue();
        let input_semen_cost        = elemSemenCost.value;
        let input_other_cost        = elemOtherCost.value;
        let input_insem_notes       = elemUiNotes.getValue();
        let input_staff_hid         = componentStaff.getValue();
        
        
        input_elem          = componentSelectSow.getElemSelect();
        

        if (input_sow_hid == '0'  || input_sow_hid == '-1'){
            validation = -1;
        }
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        switch (input_insem_type){
            case 'boar-mating': {
                input_elem          = componentSelectBoar.getElemSelect();
                if (input_boar_hid == '0'  || input_boar_hid == '-1'){
                    validation = -1;
                }
                addValidationClassToElem(input_elem, validation);
                if (validation != 0) {return;}
            
                break;
            }
            
            case 'ai-external': {
                input_elem          = componentSemenSupplier.getElemSelect();
                if (input_semen_supplier_hid == '0'  || input_semen_supplier_hid == '-1'){
                    validation = -1;
                }
                addValidationClassToElem(input_elem, validation);
                if (validation != 0) {return;}
                
                
                input_elem          = componentSemenType.getElemSelect();
                if (input_semen_type_hid == '0'  || input_semen_type_hid == '-1'){
                    validation = -1;
                }
                addValidationClassToElem(input_elem, validation);
                if (validation != 0) {return;}
                
                break;
            }
        
            case 'ai-internal':{
                input_elem          = componentSelectBoarInt.getElemSelect();
                if (input_boar_int_hid == '0'  || input_boar_int_hid == '-1'){
                    validation = -1;
                }
                addValidationClassToElem(input_elem, validation);
                if (validation != 0) {return;}
            
                break;
            }
        
        }
        
        input_elem          = elemUiDateMating.getElemText();
        
        // Convert date to YYYY-MM-DD format
        const dt_mating     = new Date(input_date_mating);
        if (isNaN(dt_mating.getTime())){
            validation      = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        const dt_mating_s   = dt_mating.toLocaleDateString('en-CA');
        validation          = 0
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        // The staff can be from the drop down
        // Or Done by User (Done by Me checkbox)
        let done_by_user = 0
        
        input_elem = componentStaff.getElemCheckBox();
        if (input_elem.checked){
            done_by_user = 1;
        }
        
        if (done_by_user == 0){
            input_elem = componentStaff.getElemSelect();
            if (input_staff_hid == '0'  || input_staff_hid == '-1'){
                validation = -1;
            }
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
            return;
        }
        
        
        const user_hid      = navigation.userControl.getUserHid();
        const base_url      = window.location.origin;

        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'sow_hid':          input_sow_hid,
            'boar_hid':         input_boar_hid,
            'semen_supplier_hid':   input_semen_supplier_hid,
            'semen_sup_semen_hid':  input_semen_type_hid,
            'semen_ai_boar_hid':    input_boar_int_hid,
            
            'insem_staff_hid':  input_staff_hid,
            'done_by_user':     done_by_user,

            'insem_notes':      input_insem_notes,
            
            'insem_date':       dt_mating_s
        };
        
        if (done_by_user > 0){
            delete post_data.insem_staff_hid;
        }
        
        if (input_semen_cost != null && input_semen_cost > 0){
            post_data.semen_cost = parseFloat(input_semen_cost);
        }
        
        if (input_other_cost != null && input_other_cost > 0) {
            post_data.insem_cost = parseFloat(input_other_cost);
        }
        
        
        if (input_insem_type == 'boar-mating'){
            delete post_data.semen_supplier_hid;
            delete post_data.semen_sup_semen_hid;
        }
        else{
            delete post_data.boar_hid;
        }
        
        
        switch (input_insem_type){
            case 'boar-mating': {
                delete post_data.semen_supplier_hid;
                delete post_data.semen_sup_semen_hid;
                delete post_data.semen_ai_boar_hid;
            
                break;
            }
            
            case 'ai-external': {
                delete post_data.boar_hid;
                delete post_data.semen_ai_boar_hid;
                break;
            }
        
            case 'ai-internal':{
                delete post_data.boar_hid;
                delete post_data.semen_supplier_hid;
                delete post_data.semen_sup_semen_hid;
            
                break;
            }
        }
        
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            url: `${base_url}/pig_prod/add`,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
                elemServerErrorMsg.style.display = 'none';
            },
  
            success: function(response){
                if (response.result.num == 0){
                    thisObj.onSuccessAddGestatingEntry();
                }
                else{
                    navigation.serverError.receivedErrorMessage(
                        response, elemServerErrorMsg);
                }
            },
  
            complete: function(){
                // TODO unsay buhaton
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
    }
    
    
    this.onSuccessAddGestatingEntry = function(){
        const pig_prod_type = PIG_PROD_TYPE.GESTATING;
        
        const callback_success = function(data){
            navigation.pigFarm.managerPigProd.setDataPigProdList(data);
            
            thisObj.show(); 
            
            navigation._onClickNavProdGestaLacta(null, PIG_OPERATION_TYPE.GESTATING);
        };
        
        navigation.pigFarm.managerPigProd.requestPigProdList(pig_prod_type, callback_success);
        
    }
    
    
    
}   