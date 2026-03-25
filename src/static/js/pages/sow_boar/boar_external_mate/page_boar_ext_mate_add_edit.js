// December 23, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../../common/page_view_basic.js';

import {APPLICATION,
        PAGE_ID,
        SOW_STATUS,
        PIG_PROD_TYPE,
        PIG_OPERATION_TYPE,
        PROD_STATUS,
        SUPPLIER_TYPE}          from '../../../constants.js';


import {SelectBoarGesta}        from '../../production/gesta_lacta/components/select_boar_gesta.js';

import {UiInputDatePicker}      from '../../common/ui/input_datepicker.js';
import {UiInputTextWithCounter} from '../../common/ui/input_text_with_counter.js';

import {ComponentAccPigBuyer}   from '../../production/harvest/comp_acc_pig_buyer.js';   


import {addValidationClassToElem} from '../../common/ui/ui_utils.js';



export function PageBoarExtMateAddEdit(input_settings){
    PageViewPigFarmPage.call(this);
    
    const TAG                   = 'PageBoarExtMateAddEdit';
    
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
    
    let componentSelectBoar     = null;
    let elemUiDateMating        = null;
    let componentBoarCustomer   = null;
    let elemUiNotes             = null;
    
    let elemIdServerErrorMsg    = null;
    
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemBtnClose            = null;
    
    let elemServerErrorMsg      = null;
    
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdBtnClose          = `${settings.uniqueKey}-select-close`;
        
        
        componentSelectBoar     = new SelectBoarGesta({
            navigation:         navigation,
            uniqueKey:          `${settings.uniqueKey}-select-boar`,
            
            pageDivContainer:   elemDivContainer,
            
            labelSelect:        'Select Boar',
            helpText:           null
        });
        
        
        elemUiDateMating        = new UiInputDatePicker({
            uniqueKey:          `${settings.uniqueKey}-date-mating`,
        
            textLabel:          'Date Mating',
            isRequired:         true,
            invalidFeedBack:    'Please input date.',
            helpText:           null
        });
        
        
        componentBoarCustomer   = new ComponentAccPigBuyer({
            navigation:         navigation,
            parentObj:          thisObj,
            uniqueKey:          `${settings.uniqueKey}-boar-customer`,

            titleExpandSection: 'Add Boar Customer',
            htmlExpandSection:  null,
            labelBtnExpandSave: 'Save Boar Customer',
            
            labelSelect:        'Select Boar Customer',
            helpText:           null
        });
       
       
    
        
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
        

        
        
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        elemIdBtnCancel         = `${settings.uniqueKey}-cancel`;
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        
        
        const html_select_boar  = componentSelectBoar.getHtml();
        const html_date_mating  = elemUiDateMating.getHtml();
        
        
        const html_notes        = elemUiNotes.getHtml();
        
        const html =`

        
<div class="form-container">

    <div class="modal-header gestating">
        <h5 class="modal-title" id="add-entry-acc-pig-ops-modal-label">
            <i class="fas fa-plus me-2"></i><span>Add Boar External Mate</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    
    <div class="modal-body">
        
        <!--  Boar Field -->
        ${html_select_boar}

        
        <!-- Date Mating -->
        ${html_date_mating}
        
            
       
                
        
        <!-- Notes -->
        ${html_notes}
        
        
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
        componentSelectBoar.afterHtmlRender();
        elemUiDateMating.afterHtmlRender();
        //componentBoarCustomer.afterHtmlRender();
        elemUiNotes.afterHtmlRender();
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemBtnClose            = elemDivContainer.querySelector('#'+elemIdBtnClose);
        
        
        
        elemServerErrorMsg      = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);
            
        elemBtnCancel           = elemDivContainer.querySelector('#'+elemIdBtnCancel);
        elemBtnSave             = elemDivContainer.querySelector('#'+elemIdBtnSave);
    }
    
    
    this._processAfterHtmlRender = function(){
        
    }
    
    
    this._bindEventListeners = function(){
        
       
        
              
        elemBtnClose.addEventListener('click', function() {
            navigation.managerNavLinks.onClickNavProdGestaLacta(null, PIG_OPERATION_TYPE.GESTATING);
        });
        
        
        elemBtnCancel.addEventListener('click', function() {
            navigation.managerNavLinks.onClickNavProdGestaLacta(null, PIG_OPERATION_TYPE.GESTATING);
        });
        
        
        elemBtnSave.addEventListener('click', function() {
            thisObj.onClickSaveButton();
        });
        
        
    }
    
    
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        
      
        
        elemUiDateMating.reset();
        
        
        
        componentSelectBoar.reset();
        
        elemUiNotes.reset();
        
    }
    
    
    this.show = function(){
        thisObj._resetForm();
        
    }
    
        
    this._validateAfterChangeInput = function(ev, input_field){
        /* Use this to validate new entry form input.*/
    
        let input_elem  = null;
        let input_val   = null;
        let cur_field   = null;
        let validation  = null;
        


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
        
        
        const bearer_token = localStorage.getItem('access_token');
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
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
            //thisObj.show(); 
            
            navigation.managerNavLinks.onClickNavProdGestaLacta(null, 
                PIG_OPERATION_TYPE.GESTATING);
        };
        
        
        // Sow Entry in SowList needs to be updated
        // This will request the whole sow_list
        navigation.pigFarm.managerSowBoar.requestSowBoarList(true, null,
            elemServerErrorMsg);
        
        
        // If selected sow status is currently gestating,
        // Need to update Not PregnantList.
        if (componentSelectSow.isSelectedSowGestating){
            navigation.pigFarm.managerPigProd.requestPigProdNotPregnantList(
                null, elemServerErrorMsg);
        }
        
        
        // Request PigProdList
        navigation.pigFarm.managerPigProd.requestPigProdList(
            pig_prod_type, callback_success, elemServerErrorMsg);
        
    }
    
    
    
}   
