// January 2, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}              from '../common/page_view_basic.js';

import {CommonSelectOptions}        from '../common/common_select_options.js';

import {addValidationClassToElem}   from '../common/ui/ui_utils.js';


import {ComponentBreadCrumbs}       from '../common/ui/comp_breadcrumb.js';

import {ComponentFeedType}          from './components/comp_feed_type.js';
import {ComponentFeedBrand}         from './components/comp_feed_brand.js';
import {ComponentPlusMinusInput}    from '../common/ui/comp_plus_minus_input.js';


import {PAGE_ID,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        MULTIKEY_OBJ_TYPE}            from '../../constants.js';



export function PagePfBuyItemAddEdit(input_settings){
    PageViewBasic.call(this);
    
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    

    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContMedVacAddEdit,
        uniqueKey:              'medvac-add-edit'
    };
    */
    const settings              = input_settings;

    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
    

    const settingsBreadcrumb = {
        uniqueKey:              `${settings.uniqueKey}-breadcrumbs`,
        navigation:             navigation,
        
        items:[
            {
                'label':        'Feed Buy List',
                'gotoPageId':   PAGE_ID.FARM_FEED_BUY_LIST
            },
            
            {
                'label':        'Entry',
                'gotoPageId':   PAGE_ID.FARM_FEED_BUY_ADD_EDIT
            }
        ]
        
    };
    let componentBreadcrumb     = new ComponentBreadCrumbs(settingsBreadcrumb);


    let elemIdHeaderTitle       = null;
    let elemIdBtnClose          = null;
        
    let elemIdInfoShow          = null;
    let elemIdInfo              = null;
    
    
    let componentFeedType          = null;
    let componentFeedBrand      = null;
    let componentQuantity       = null;
    
    let elemIdWeightPerUnit     = null;
    let elemIdUnitCost          = null;
    let elemIdFeedCost          = null;
    
    let elemIdServerErrorMsg    = null;
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    
    let elemHeaderTitle         = null;
    let elemBtnClose            = null;
        
    let elemInfoShow            = null;
    let elemInfo                = null;

    let elemWeightPerUnit       = null;
    let elemUnitCost            = null;
    let elemFeedCost            = null;
    
    
    
    let elemServerErrorMsg      = null;
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    

    let curDataEntry            = null;
    let showOptions             = null;
    

    
    this.callbackOnSuccessAdd   = null;
    
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
            
        elemIdInfoShow          = `${settings.uniqueKey}-info-show`;
        elemIdInfo              = `${settings.uniqueKey}-info`;
        
        
        componentFeedType       = new ComponentFeedType({
            navigation:         navigation,
            uniqueKey:          `${settings.uniqueKey}-type`,

            labelSelect:        'Select Feed Type',
            helpText:           null
        });
        
        
        componentFeedBrand    = new ComponentFeedBrand({
            navigation:         navigation,
            uniqueKey:          `${settings.uniqueKey}-brand-name`,

            titleExpandSection: 'Add New Feed Brand',
            htmlExpandSection:  null,
            labelBtnExpandSave: 'Save Feed Brand',
            
            labelSelect:        'Select Feed Brand',
            helpText:           null
        });
        
        
        componentQuantity       = new ComponentPlusMinusInput({
            uniqueKey:          `${settings.uniqueKey}-quantity`,
            
            className:          'form-group-number',
            textLabel:          'Quantity',
            minValue:           1,
            step:               1,
            isRequired:         true,
            invalidFeedBack:    null,
            helpText:           null
        });
        

        elemIdWeightPerUnit     = `${settings.uniqueKey}-weight-per-unit`;
        elemIdUnitCost          = `${settings.uniqueKey}-unit-cost`;
        elemIdFeedCost          = `${settings.uniqueKey}-feed-cost`;
        
       

        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        elemIdBtnCancel         = `${settings.uniqueKey}-cancel`;
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        
           
        const html_breadcrumb   = componentBreadcrumb.getHtml();
        
        const html_feed_type    = componentFeedType.getHtml();
        const html_feed_brand   = componentFeedBrand.getHtml();
        const html_quantity     = componentQuantity.getHtml();

        
        const html =`

        
<div class="form-container">
    ${html_breadcrumb}
    
    <div class="modal-header" style="padding-right:8px;">
        <h5 class="modal-title">
            <span id="${elemIdHeaderTitle}"><i class="fas fa-plus me-2"></i>Add Feed Item</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    
    <div class="modal-body">
        <!-- Mobile Info Box -->
        <div class="warning-box" id="${elemIdInfoShow}" style="display:none;"></div>
        
        
        <!-- Feed Type -->
        ${html_feed_type}

        
        <!-- Feed Brand -->
        ${html_feed_brand}
        
        
        <!-- Quantity -->
        ${html_quantity}
        
        <div class="form-group-number">
            <label for="${elemIdWeightPerUnit}" class="form-label">Weight per Unit</label>
            <input  type="number" 
                    class="form-control" 
                    id="${elemIdWeightPerUnit}" 
                    min="1"
                    max="1000" 
                    required>
            <div class="invalid-feedback">Please enter a valid number. </div>
            <div class="form-text">kilogram per sack</div>
        </div>
        
        
        <!-- Unit Cost -->
        <div class="form-group-number">
            <label for="${elemIdUnitCost}" class="form-label">
                Unit Cost
            </label>
                
            <input type="number" class="form-control" id="${elemIdUnitCost}" placeholder="0.00" step="0.1" min="0">
            <div class="invalid-feedback">
                Please enter numeric value.
            </div>
        </div>
        
        <div class="form-group-number">
            <label for="${elemIdFeedCost}" class="form-label" style="margin-bottom:0;">
                Feed Cost
            </label>
                
            <span class="read-only-field" id="${elemIdFeedCost}">0.00</span>
        </div>
        
        
        
        <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
        
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
</div>


        `;
        
        
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        // Do the afterHtmlRender to UI elements first;
        
        componentBreadcrumb.afterHtmlRender();

        componentFeedType.afterHtmlRender();
        componentFeedBrand.afterHtmlRender();
        componentQuantity .afterHtmlRender();
        
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
        
        // A change in FeedType should automatically update elemWeightPerUnit.
        componentFeedType.setElemWeightPerUnit(elemWeightPerUnit);
    }
    
    
    this._findElements = function(){
        elemHeaderTitle         = elemDivContainer.querySelector('#'+elemIdHeaderTitle);
        elemBtnClose            = elemDivContainer.querySelector('#'+elemIdBtnClose);
                                                          
        elemInfoShow            = elemDivContainer.querySelector('#'+elemIdInfoShow);
        elemInfo                = elemDivContainer.querySelector('#'+elemIdInfo);
                                                          
        
        elemWeightPerUnit       = elemDivContainer.querySelector('#'+elemIdWeightPerUnit);
        elemUnitCost            = elemDivContainer.querySelector('#'+elemIdUnitCost);
        elemFeedCost            = elemDivContainer.querySelector('#'+elemIdFeedCost);
            
        elemServerErrorMsg      = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);
        elemBtnCancel           = elemDivContainer.querySelector('#'+elemIdBtnCancel);
        elemBtnSave             = elemDivContainer.querySelector('#'+elemIdBtnSave);
    }
    
    
    this._processAfterHtmlRender = function(){
        componentQuantity.callbackOnChangeInput = this.calculateFeedCost;
    }
    
    
    this._bindEventListeners = function(){
        
        elemUnitCost.addEventListener('input', function(event){
            thisObj.calculateFeedCost();
        });
        
        elemBtnSave.addEventListener('click', function() {
            thisObj.onClickSaveButton();
        });
        
        
        
    }
    

    
    this._resetForm = function(){
        // Clear previous Form values and validation classes
     
        
        componentFeedBrand.reset();
        elemWeightPerUnit.value = '';
        
        elemUnitCost.value = '0.00';
        elemFeedCost.value = '0.00';
        
        
        elemServerErrorMsg.style.display = 'none';
    }
    
    
    this.beforeShow = function(data_entry, options){
        /*
        Typical options
        options ={
            is_add:                 true,   // false is edit
            callback_after_add:     thisObj.onSuccessAddEntry
            go_back_page:           go_back_page   // Go back to this page; this is Div element
        }
        */
        
        curDataEntry    = data_entry;
        showOptions     = options;
        
        
        // Update BreadCrumbs
       
        
        
        thisObj._resetForm();
        
        componentFeedType.beforeShow();
        componentFeedBrand.beforeShow();
       
        
        
        
        // Set Page Title
        let html;
        if (showOptions.is_add){
            html = `<i class="fas fa-plus me-2"></i>Add Feed Item</span>`;
        }
        else{
            html = `<i class="fas fa-edit me-2"></i>Edit Feed Item</span>`;
        }
        elemHeaderTitle.innerHTML = html;
                
        
      
       
        
        
        
        // Update Close and cancel button on click
        
        elemBtnClose.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
        
        elemBtnCancel.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
        
      
    }
    
    
    this.requestDataFeedType = function(){
        const data_feed_type_list = navigation.managerPublicData.dataFeedTypeList;
        
        if (data_feed_type_list == null){
            const callback_success = function(data){
                
            }
            
            
            navigation.managerPublicData.requestDataFeedType(callback_success, 
                elemServerErrorMsg);
        }
    }
    
    
    this.show = function(){
        if (showOptions.is_add == false){
           
        }
    }
    
    
    this.populateForm = function(data_entry, medvac_hid){
      
        
        
        // Set MedVac brand
        componentFeedBrand.setValue(cur_medvac.medvac.brand.hid);
        
       
    }
    
    
    this.disableAllInputs = function(){
       
    }
    
    
    this.enableAllInputs = function(){
    }
    

    this.calculateFeedCost = function(){
        const input_quantity  = componentQuantity.getValue();
        const input_unit_cost = elemUnitCost.value;
        
        let quantity    = null;
        let unit_cost   = null;
        
        try{
            quantity = parseInt(input_quantity);
        } catch(error) {}
        
         try{
            unit_cost = parseFloat(input_unit_cost);
        } catch(error) {}
        
        
        let feed_cost = 0.0;
        if (quantity && unit_cost){
            feed_cost = quantity * unit_cost;
        }

        
        const s_feed_cost = thisObj.moneyFormatter.format(feed_cost);
        elemFeedCost.textContent = s_feed_cost;
    }

    
    this._validateAfterChangeInput = function(ev, input_field){
        /* Use this to validate new entry form input.*/
    
        let input_elem  = null;
        let input_val   = null;
        let cur_field   = null;
        let validation  = null;
        
        let is_duplicate = 0;
        
        
        if (ev.checkValidity()) {
            switch(input_field){
                
                case 'date_medvac': {
             
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
        
        
        
        let input_date_medvac   = elemUiDateMedVac.getValue().trim();
        
        let input_medvac_brand  = componentFeedBrand.getValue();
        let input_medvac_type   = componentMedVacType.getValue();
        let input_medvac_name   = componentAccMedVac.getValue();
        let input_notes         = elemUiNotes.getValue().trim();
        let input_staff         = componentStaff.getValue();
        

        
        input_elem          = elemUiDateMedVac.getElemText();
        if (input_date_medvac.length == 0){
            validation = -1;
            addValidationClassToElem(input_elem, validation);
            return;
        } 
        
        
        
        // Convert date to YYYY-MM-DD format
        const dt_medvac     = new Date(input_date_medvac);
        if (isNaN(dt_medvac.getTime())){
            validation      = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
            
        
        const dt_medvac_s   = dt_medvac.toLocaleDateString('en-CA');
        validation          = 0
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        input_elem = componentFeedBrand.getElemSelect();
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
        
        
        // Notes is required for Medvac
        input_elem = elemUiNotes.getElemText();
        if (input_notes.length == 0){
            validation = -1;
        }
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
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
        
        
        
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
            return;
        } 
        
        
        
        const user_hid      = navigation.userControl.getUserHid();
        const pig_farm_hid  = navigation.userControl.getCurrentFarmHid();
        const base_url      = window.location.origin;
        
        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            
            'date_medvac':      dt_medvac_s,
            'medvac_brand_hid': input_medvac_brand,
            'medvac_type_hid':  input_medvac_type,
            'acc_medvac_hid':   input_medvac_name,
            'notes':            input_notes,
            'staff_hid':        input_staff
            
        };
        
        if (showOptions.is_add == true){
            // Add Key
            switch (showOptions.medvac_type){ 
                case MULTIKEY_OBJ_TYPE.SOW_BOAR:{
                    post_data.sow_boar_hid = curDataEntry.sow_boar.hid;
                    break;
                }
                
                case MULTIKEY_OBJ_TYPE.PIG_PROD:{
                    post_data.pig_prod_hid = curDataEntry.pig_production.hid;
                    break;
                }
            }
            
            if (done_by_user > 0){
                post_data.done_by_user = 1;
                delete post_data.staff_hid;
            }
            
            if ('health_issue_entry' in showOptions){
                const health_issue_hid = showOptions.health_issue_entry.prod_notes.hid;
                post_data.health_issue_hid = health_issue_hid;
                
            }
        }
        
        else {
            post_data.pig_medvac_hid = showOptions.medvac_hid;
        }
        
        
        
        let url;
        
        if (showOptions.is_add == true){
            url = `${base_url}/pig_medvac/add`;
        }
        else{
            url = `${base_url}/pig_medvac/update`;
        }
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            url: url,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
                elemServerErrorMsg.style.display = 'none';
            },
  
            success: function(response){
                if (response.result.num == 0){
                    if (showOptions.is_add == true){
                        if (showOptions.callback_after_add){
                            showOptions.callback_after_add();
                        }
                        navigation.showThisPage(showOptions.go_back_page);
                    }
                    
                    else{
                        if (showOptions.callback_after_edit){
                            showOptions.callback_after_edit();
                        }
                        navigation.showThisPage(showOptions.go_back_page);
                    }
                }
                else{
                    navigation.serverError.receivedErrorMessage(
                        response, elemServerErrorMsg);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
    }
    
    
}   
