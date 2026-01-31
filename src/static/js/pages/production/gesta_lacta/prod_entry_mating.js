// January 2, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../../common/page_view_basic.js';

import {SOW_STATUS,
        PIG_OPERATION_TYPE}     from '../../../constants.js';

import {UiInputTextWithCounter} from '../../common/ui/input_text_with_counter.js';
import {ComponentStaffFormGroup} from '../../common/ui/comp_staff_form_group.js';

import {SelectBoarGesta}        from '../../production/gesta_lacta/components/select_boar_gesta.js';
import {ComponentSemenSupplier} from '../../production/gesta_lacta/components/comp_semen_supplier.js';
import {ComponentSemenType}     from '../../production/gesta_lacta/components/comp_semen_type.js';

import {CommonSelectOptions}    from '../../common/common_select_options.js';


import {addValidationClassToElem} from '../../common/ui/ui_utils.js';

import {getSowBoarReference}    from '../../common/common_app.js';



export function ProdEntryMating(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    /*
    Typical settings = {
        navigation:             navigation,
        parentObj:              this,
        uniqueKey:              'pig-prod-gesta-insem',
        elemDivContainer:       elemTabGestaInsem
        
    };
    */
    const settings              = input_settings;


    const elemDivContainer      = settings.elemDivContainer;

    const MAXCHAR_INSEM_NOTES   = 160;
    
    
    let elemIdContentContainer  = null;
        
    let elemIdCannotUpdate      = null;
    
    let elemIdSow               = null;
    let elemIdDateMatingWarning = null;
    let elemIdDateMating        = null;
    let elemIdInsemType         = null;
    
    let componentSelectBoar     = null;
    
    let elemIdAiShow            = null;
   
    let componentSemenSupplier  = null;
    let componentSemenType      = null;
    
    let elemIdSemenCost         = null;
  
    let componentSelectBoarInt = null;
    
    
    let elemIdOtherCost         = null;
    
    let elemUiNotes             = null;
    let componentStaff          = null;
    
    let elemIdServerErrorMsg    = null;
    let elemIdBtnSave           = null;
    
    
    let elemContentContainer    = null;
    
    let elemCannotUpdate        = null;
    
    let elemSow                 = null;
    let elemDateMatingWarning   = null;
    let elemDateMating          = null;
    let elemInsemType           = null;
    
    
    let elemAiShow              = null;


    let elemSemenCost           = null;
    

    
    
    let elemOtherCost           = null;
    
    let elemServerErrorMsg      = null;
        
    let elemBtnSave             = null;
    
    let curDataPigProd          = null;
    
    let insemType               = null;
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        const html = this.getHtml();
        elemDivContainer.innerHTML = html;
    }
    
    
    this.getHtml = function(){
        
        elemContentContainer    = `${settings.uniqueKey}-content`;
        
        elemIdCannotUpdate      = `${settings.uniqueKey}-cannot-update`;
        
        elemIdSow               = `${settings.uniqueKey}-sow`;
        elemIdDateMatingWarning = `${settings.uniqueKey}-date-mating-warning`;
        elemIdDateMating        = `${settings.uniqueKey}-date-mating`;
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
            
            labelSelect:        'Semen Type',
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
            textMaxChars:       MAXCHAR_INSEM_NOTES,
            rows:               3,
            helpText:           null  
        });
        
        
        componentStaff          = new ComponentStaffFormGroup({
            navigation:         navigation,
            uniqueKey:          `${settings.uniqueKey}-staff`,
            
            includeAddNew:      true,
            includeDoneByMe:    false,
            
            titleExpandSection: 'Add New Staff',
            htmlExpandSection:  null,
            labelBtnExpandSave: 'Save New Staff',
            
            labelSelect:        'Staff Member',
            helpText:           'Who did the operation'
        });
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        
        
        const html_select_boar      = componentSelectBoar.getHtml();
        
        const html_semen_supplier   = componentSemenSupplier.getHtml();
        const html_semen_type       = componentSemenType.getHtml();
        const html_select_boar_int  = componentSelectBoarInt.getHtml();
        
        const html_notes        = elemUiNotes.getHtml();
        const html_staff        = componentStaff.getHtml();
        
        
        const html = `
<div class="modal-body" id="${elemIdContentContainer}">
    <h2 class="tab-title">
        Mating Information
    </h2>
    
    <div class="warning-box" id="${elemIdCannotUpdate}" style="margin-bottom:8px;">
        Gestating info of a production entry that is already in 
        <b>Lactating Stage</b> cannot be updated.
    </div>
    
    <!-- 1. Sow Field cannot be edited. -->
    <div class="form-group-text">
        <label class="form-label">Sow Name</label>
        <span class="" id="${elemIdSow}"></span>
    </div>
    
    <!-- 2. Date Mating -->
    <div class="form-group-date">
        <div class="warning-box" id="${elemIdDateMatingWarning}" style="display: none;">
            Changing the Date Mating will recalculate <b>Gestating Operations</b>
            scheduled for this entry.
        </div>
        <label for="${elemIdDateMating}" class="form-label">Date Mating</label>
        <input type="text" class="form-control" id="${elemIdDateMating}">
        <div class="invalid-feedback">
            Please enter a valid date.
        </div>
        
    </div>
    
    <!-- 3. Insemination Type cannot be edited. -->
    <div class="form-group-select">
        <label for="${elemIdInsemType}" class="form-label">
            Insemination Type
        </label>
        
        <span class="" id="${elemIdInsemType}"></span>
    </div>
    
    
    <!-- Boar Mating Section -->
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
            
            <input type="text" class="form-control" id="${elemIdSemenCost}" placeholder="0.00" step="0.1" min="0">
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
            
        <input type="text" class="form-control" id="${elemIdOtherCost}" placeholder="0.00" step="0.1" min="0">
        <div class="invalid-feedback">
            Please enter numeric value.
        </div>
    </div>
        
    
    <!-- 6. Notes -->
    ${html_notes}
    
    ${html_staff}
    
    <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
    
    <!-- Footer Buttons -->
    <div class="modal-footer">
        <button class="btn btn-primary" id="${elemIdBtnSave}">Save Changes</button>
    </div>
</div>
        `;
        
        return html
    }
    
    
    this.afterHtmlRender = function(){
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
        
        elemContentContainer    = elemDivContainer.querySelector('#'+elemIdContentContainer);
        
        elemCannotUpdate        = elemDivContainer.querySelector('#'+elemIdCannotUpdate);
        
        elemSow                 = elemDivContainer.querySelector('#'+elemIdSow);
        elemDateMatingWarning   = elemDivContainer.querySelector('#'+elemIdDateMatingWarning);
        elemDateMating          = elemDivContainer.querySelector('#'+elemIdDateMating);
        elemInsemType           = elemDivContainer.querySelector('#'+elemIdInsemType);
        
        
        elemAiShow              = elemDivContainer.querySelector('#'+elemIdAiShow);
        
            
        elemSemenCost           = elemDivContainer.querySelector('#'+elemIdSemenCost);
        
        

        elemOtherCost           = elemDivContainer.querySelector('#'+elemIdOtherCost);
        
        elemServerErrorMsg      = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);
                
        elemBtnSave             = elemDivContainer.querySelector('#'+elemIdBtnSave);
    
    }
    
    
    this._processAfterHtmlRender = function(){
        $('#'+elemIdDateMating).datepicker({
            format: 'MM d, yyyy',  // This gives "January 31, 2026"
            autoclose: true,
            endDate: new Date() // Max date is today
        }).on('show', function(e) {
            $('.datepicker').addClass('datepicker-material');
        });
        

    }
    
    
    this._bindEventListeners = function(){
        
        
        elemOtherCost.addEventListener('blur', function() {
            //thisObj._validateAfterChangeInput(this, 'other_cost');
        });
        
        
          
        
        elemBtnSave.addEventListener('click', function() {
            thisObj.onClickSaveButton();
        });
        
    }
    
    
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        
        elemDateMating.classList.remove('is-valid', 'is-invalid');
        
        componentSelectBoar.reset();
        componentSelectBoarInt.reset();
        
        componentSemenSupplier.reset();
        componentSemenType.reset();
        
        elemSemenCost.value = '0.00';
        elemSemenCost.classList.remove('is-valid', 'is-invalid');
        
        elemOtherCost.value = '0.00';
        elemSemenCost.classList.remove('is-valid', 'is-invalid');
        
        elemUiNotes.reset();
        componentStaff.reset();
        
        
    }
    
    
    this.show = function(data_pig_prod, options){
        thisObj._resetForm();
        
        curDataPigProd = data_pig_prod;
        
        const data_sow = curDataPigProd.sow;

        
        // Set sow_name and create a link to open SowBoarPage
        const sow_boar_name = getSowBoarReference(data_sow, true);
        
        const html_sow = `
        <a href="javascript:void(0)" class="breadcrumb-link">${sow_boar_name}</a>
        `;
        elemSow.innerHTML = html_sow;
        
        elemSow.onclick = function(){
            const sow_boar_list = navigation.pigFarm.managerSowBoar.dataSowList;
            navigation.pageSowBoarList.gotoSowBoarEntryPage(sow_boar_list, data_sow.hid);
        };
        
        
        // Set Select Boar data
        componentSelectBoar.beforeShow();
        componentSelectBoarInt.beforeShow();
        
        
        
        // Set Insemination date
        const insemination  = curDataPigProd.insemination;
        
        const dt_insem      = new Date(insemination.insem_date);
        const $elemDateMating = $(elemDateMating);
        $elemDateMating.datepicker('setDate', dt_insem);
        
        
        // Set insemination type
        switch (insemination.insem_type){
            case 'B':{
                insemType  = 'boar-mating';
                thisObj.onChangeInsemType(insemType);
                elemInsemType.textContent = 'Boar Mating';
                
                // Necessary to display fully first the container
                setTimeout(function(){
                    componentSelectBoar.setValue(insemination.boar.hid);
                }, 200);
                break;
            }
            
            case 'AI_X':{
                insemType  = 'ai-external';
                thisObj.onChangeInsemType(insemType);
                elemInsemType.textContent = 'Artificial Insemination External';
                
                
                componentSemenSupplier.beforeShow();
                
                const semen_supplier_hid = insemination.ai.semen_supplier.hid;
                const semen_type_hid = insemination.ai.semen_supplier.semen.hid;
                

                // Necessary to display fully first the container
                setTimeout(function(){
                    componentSemenSupplier.setValue(semen_supplier_hid, 
                            semen_type_hid);
                }, 200);
                
                
                
                const semen_cost = thisObj.moneyFormatter.format(insemination.ai.semen_cost);
                elemSemenCost.value = semen_cost;
                
                break;
            }
            
            case 'AI_N':{
                insemType  = 'ai-internal';
                thisObj.onChangeInsemType(insemType);
                elemInsemType.textContent = 'Artificial Insemination Internal';
                
                // Necessary to display fully first the container
                setTimeout(function(){
                    componentSelectBoarInt.setValue(insemination.ai.internal_boar.hid);
                }, 200);
                break;
            }
        }
        
        
        // Set Insemination Cost
        if (insemination.insem_cost != null){
            elemOtherCost.value = thisObj.moneyFormatter.format(insemination.insem_cost); 
        }
        
        
        // Set Insemination Notes
        if (insemination.insem_notes){
            elemUiNotes.setValue(insemination.insem_notes);
        }
        else{
            elemUiNotes.setValue('');
        }
        
        
        // Set Staff
        componentStaff.beforeShow();
        componentStaff.setValue(insemination.insem_staff_hid);
        
        
        if (options.is_read_only){
            elemCannotUpdate.style.display = 'block';
            
            elemDateMatingWarning.style.display = 'none'; 
            elemDateMating.disabled = true;
            elemInsemType.disabled = true;
            
            componentSelectBoar.disabled();
            
            componentSemenSupplier.disabled();
            componentSemenType.disabled();
            elemSemenCost.disabled = true;
            
            componentSelectBoarInt.disabled();
            
            elemOtherCost.disabled = true;
            
            elemUiNotes.getElemText().disabled = true;
            
            componentStaff.getElemSelect().disabled = true;
             
            elemBtnSave.style.display = 'none';
            
        }
        
        else{
            elemCannotUpdate.style.display = 'none';
            
            elemDateMatingWarning.style.display = 'block'; 
            elemDateMating.disabled = false;
            elemInsemType.disabled = false;
            
            componentSelectBoar.enabled();
            
            componentSemenSupplier.enabled();
            componentSemenType.enabled();
            elemSemenCost.disabled = false;
            
            componentSelectBoarInt.enabled();
            
            elemOtherCost.disabled = false;
            
            elemUiNotes.getElemText().disabled = false;
            
            componentStaff.getElemSelect().disabled = false;
             
            elemBtnSave.style.display = 'block';
        }
        
    }
    
    
    this.onChangeInsemType = function(selected_value){
        
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
    }
    
    
    this.onClickSaveButton = function(){
        let input_elem      = null;
        let validation      = 0;
        

        let input_insem_type        = insemType;
        let input_boar_hid          = componentSelectBoar.getValue();
        let input_boar_int_hid      = componentSelectBoarInt.getValue();
        let input_date_mating       = elemDateMating.value;
        let input_semen_supplier_hid = componentSemenSupplier.getValue();
        let input_semen_type_hid    = componentSemenType.getValue();
        let input_semen_cost        = elemSemenCost.value;
        let input_other_cost        = elemOtherCost.value;
        let input_insem_notes       = elemUiNotes.getValue();
        let input_staff_hid         = componentStaff.getValue();
        
        
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
        
        input_elem          = elemDateMating;
        
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
        
        /*
        input_elem = componentStaff.getElemCheckBox();
        if (input_elem.checked){
            done_by_user = 1;
        }*/
        
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
            'boar_hid':         input_boar_hid,
            'semen_supplier_hid':   input_semen_supplier_hid,
            'semen_sup_semen_hid':  input_semen_type_hid,
            'semen_ai_boar_hid':    input_boar_int_hid,
            
            'insem_staff_hid':  input_staff_hid,
            
            'insem_notes':      input_insem_notes,
            
            'insem_date':       dt_mating_s
        };
        
        
        post_data.pig_prod_hid = curDataPigProd.pig_production.hid;
        
        if (input_semen_cost != null && input_semen_cost > 0){
            post_data.semen_cost = parseFloat(input_semen_cost);
        }
        
        if (input_other_cost != null && input_other_cost > 0) {
            post_data.insem_cost = parseFloat(input_other_cost);
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
        
        
        // TODO: check if there is a change in the data
        
        
        
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            url: `${base_url}/pig_prod/update_insem`,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
                elemServerErrorMsg.style.display = 'none';
            },
  
            success: function(response){
                if (response.result.num == 0){
                    thisObj.onSuccessEditGestatingEntry();
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
                navigation.serverError.serverErrorThrown(jqXHR, 
                textStatus, errorThrown);
            }
        });
    }
    
    
    
    this.onSuccessEditGestatingEntry = function(){
        
        const callback_success = function(data){
            // This is same thing as success edit as prod_entry data 
            // is requested from the server.
            navigation.pigFarm.managerPigProd.onSuccessEditGestatingEntry(data);
            
            
            // Need to get this data from the list if really inserted
            const pig_prod_pid = data.pig_production.farm_prod_id;
            
            // Need to refresh ProdGestatingEntry.
            navigation.onClickProdGestatingEntry(pig_prod_pid);
            parentObj.switchTab(parentObj.TAB_GESTA_PIGOPS);
        }
        
        const pig_prod_hid = curDataPigProd.pig_production.hid;
        navigation.pigFarm.managerPigProd.requestPigProdEntry(pig_prod_hid, 
            callback_success, elemServerErrorMsg);
    }
    
}