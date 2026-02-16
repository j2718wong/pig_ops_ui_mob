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


import {APPLICATION,
        PAGE_ID,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        MULTIKEY_OBJ_TYPE}          from '../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        FORMAT_COMPACT_NO_SPACE} from '../../utils.js';


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
    
    let elemIdHeaderSubTitle    = null;
    let elemIdHeaderSubTitle2   = null;
    
    let elemIdInfoShow          = null;
    let elemIdInfo              = null;
    
    
    let componentFeedType       = null;
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

    let elemHeaderSubTitle      = null;
    let elemHeaderSubTitle2     = null;
    

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
        
        elemIdHeaderSubTitle    = `${settings.uniqueKey}-subtitle`;
        elemIdHeaderSubTitle2   = `${settings.uniqueKey}-subtitle2`;
            
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
    
        <div class="form-section-title" style="margin-top:0;">
            <span id="${elemIdHeaderSubTitle}">Feed Buy on 02 Feb 2026</span>
            <div id="${elemIdHeaderSubTitle2}">Supplier:</div>
        </div>
    
    
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
                
            <input type="text" class="form-control" id="${elemIdUnitCost}" placeholder="0.0" step="0.1" min="0">
            <div class="invalid-feedback">
                Please enter numeric value.
            </div>
        </div>
        
        <div class="form-group-number">
            <label for="${elemIdFeedCost}" class="form-label" style="margin-bottom:0;">
                Feed Cost
            </label>
                
            <span class="read-only-field" id="${elemIdFeedCost}">0.0</span>
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
        
        elemHeaderSubTitle      = elemDivContainer.querySelector('#'+elemIdHeaderSubTitle);
        elemHeaderSubTitle2     = elemDivContainer.querySelector('#'+elemIdHeaderSubTitle2);
                                                          
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
     
        componentFeedType.reset();
        componentFeedBrand.reset();
        componentQuantity.reset();
        
        elemWeightPerUnit.value = '';
        elemWeightPerUnit.classList.remove('is-valid', 'is-invalid');
        
        elemUnitCost.value = '0.0';
        elemUnitCost.classList.remove('is-valid', 'is-invalid');
        
        elemFeedCost.textContent = '0.0';
        
        
        elemServerErrorMsg.style.display = 'none';
    }
    
    
    this.beforeShow = function(data_entry, options){
        /*
        Typical options
        options ={
            is_add:                 true,   // false is edit
            callback_after_add:     thisObj.onSuccessAddEntry
            pig_farm_feed_buy:      null,   
            go_back_page:           go_back_page  
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
                
        
        // Set Subtitle
        const date_buy  = showOptions.pig_farm_feed_buy.pf_feed_buy.date_buy;
        const dt_buy    = new Date(date_buy);
        const s_date_buy= formatDate(dt_buy, FORMAT_COMPACT);
        const s_title_1 = `Feed Buy on ${s_date_buy}`;
        
        const feed_supplier= showOptions.pig_farm_feed_buy.feed_supplier.name;
        const s_title_2 = `Supplier: ${feed_supplier}`;
        
        elemHeaderSubTitle.textContent  = s_title_1; 
        elemHeaderSubTitle2.innerHTML   = s_title_2;
        
        
        
        if (showOptions.is_add){}
        else{
            thisObj.populateForm();
        }
        
        
        // Update Close and cancel button on click
        
        elemBtnClose.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
        
        elemBtnCancel.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
        
      
    }
    
    
    
   
    
    
    this.show = function(){
        if (showOptions.is_add == false){
           
        }
    }
    
    
    this.populateForm = function(){
        const s_unit_cost = thisObj.moneyFormatter.format(curDataEntry.feed_item.unit_cost);
        const s_total_cost = thisObj.moneyFormatter.format(curDataEntry.feed_item.total_cost);
        
        // Necessary to display fully first the container
        setTimeout(function(){
            componentFeedType.setValue(curDataEntry.feed_type.hid);
            componentFeedBrand.setValue(curDataEntry.feed_brand.hid);
        }, 100);

        
        componentQuantity.setValue(curDataEntry.feed_item.quantity);
        
        elemWeightPerUnit.value = curDataEntry.feed_item.kg_per_unit;
        elemUnitCost.value = s_unit_cost;     
        elemFeedCost.textContent = s_total_cost;     
       
    }
    
    
    this.disableAllInputs = function(){
       
    }
    
    
    this.enableAllInputs = function(){
    }
    

    this.calculateFeedCost = function(){
        const input_quantity  = componentQuantity.getValue();
        const input_unit_cost = elemUnitCost.value.replace(',', '');
        
        let quantity    = 0;
        let unit_cost   = 0;
        
        try{
            quantity = parseInt(input_quantity);
        } catch(error) {}
        
         try{
            unit_cost = parseFloat(input_unit_cost);
        } catch(error) {}
        
        
        let feed_cost = quantity * unit_cost;
        
        
        const s_feed_cost = thisObj.moneyFormatter.format(feed_cost);
        elemFeedCost.textContent = s_feed_cost;
    }

    
    this.onClickSaveButton = function(){
        let input_elem      = null;
        let validation      = 0;
        
        
        
        let input_feed_type     = componentFeedType.getValue().trim();
        let input_feed_brand    = componentFeedBrand.getValue();
        
        let input_quantity      = componentQuantity.getValue();
        let input_unit_weight   = elemWeightPerUnit.value;
        let input_unit_cost     = elemUnitCost.value.replace(',', '');
        
        
        input_elem              = componentFeedType.getElemSelect();
        if (input_feed_type == '0'  || input_feed_type == '-1'){
            validation = -1;
        }
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        input_elem              = componentFeedBrand.getElemSelect();
        if (input_feed_brand == '0'  || input_feed_brand == '-1'){
            validation = -1;
        }
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        let quantity    = null;
        let unit_cost   = null;
        let unit_weight = null;
        
        
        try{
            quantity = parseInt(input_quantity);
        } catch(error) {}
        
        
        try{
            unit_cost = parseFloat(input_unit_cost);
        } catch(error) {}
        
        try{
            unit_weight = parseFloat(input_unit_weight);
        } catch(error) {}
        
        
        
        input_elem              = componentQuantity.getElemText();
        if ((quantity == null) || (quantity < 1)){
            validation = -1;
        
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        
        input_elem              = elemUnitCost;
        if ((unit_cost == null) || (unit_cost < 1)){
            validation = -1;
        
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        
        const total_cost = quantity * unit_cost;
        
        
        input_elem              = elemWeightPerUnit;
        if ((unit_weight == null) || (unit_weight < 1)){
            validation = -1;
        
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
            
            'feed_type_hid':    input_feed_type,
            'feed_brand_hid':   input_feed_brand,
            'quantity':         quantity,
            'unit_weight':      unit_weight,
            'unit_cost':        unit_cost,
            'total_cost':       total_cost
            
        };
        
        if (showOptions.is_add == true){
            
            const feed_buy_hid = showOptions.pig_farm_feed_buy.pf_feed_buy.hid;
            post_data.pig_farm_feed_buy_hid = feed_buy_hid;
        }
        
        else {
            post_data.pf_feed_buy_item_hid = curDataEntry.feed_item.hid;
        }
        
        
        
        let url;
        
        if (showOptions.is_add == true){
            url = `${base_url}/pf_feed_buy_item/add`;
        }
        else{
            url = `${base_url}/pf_feed_buy_item/update`;
        }
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            timeout: APPLICATION.REQUEST_TIMEOUT,
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
