// page_common_supplier_add_edit.js

// December 23, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../common/page_view_basic.js';

import {APPLICATION,
        PAGE_ID,
        FLAG_BITS,
        SOW_STATUS,
        PIG_PROD_TYPE,
        PIG_OPERATION_TYPE,
        SUPPLIER_TYPE}          from '../../constants.js';

import {CommonSelectOptions}        from '../common/common_select_options.js';


import {addValidationClassToElem}   from '../common/ui/ui_utils.js';

import {ComponentAddressLevels}     from '../common/ui/comp_address_levels.js'

import {ComponentCommonSupplier}    from './comp_common_supplier.js';
import {UiInputTextWithCounter}     from '../common/ui/input_text_with_counter.js';


export function PageCommonSupplierAddEdit(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const managerAddress        = navigation.managerAddress;
    
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContSupplierAddEdit,
        uniqueKey:              'supplier-add-edit'
    };
    */
    const settings              = input_settings;

    
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
        
    // These can be controlled; normally this is for development
    // purpose any analytics purpose only;
    let SHOW_SUPPLIER_COUNT_ADDRESS_LEVEL_1 = true;
    let SHOW_SUPPLIER_COUNT_ADDRESS_LEVEL_2 = true;
    let SHOW_SUPPLIER_COUNT_ADDRESS_LEVEL_3 = true;
        
    
    let elemIdHeaderTitle       = null;
    let elemIdBtnClose          = null;
    
    let elemIdServerErrorMsg    = null;
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemHeaderTitle         = null;
    let elemBtnClose            = null;
    
    let elemServerErrorMsg      = null;
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
    let showOptions             = null;
    
    
    let curAddressLevel1        = null;
    let curAddressLevel2        = null;
    
    let hasAddressLevels        = 0;
    
    
    const compAddressLevels     = new ComponentAddressLevels({
        navigation:             navigation,
        parentObj:              this,
        uniqueKey:              `${settings.uniqueKey}-address`,
        elemDivContainer:       elemDivContainer,
        
        level1Label:            'Select Province or Region',
        level2Label:            'Select City or Municipality',
        level3Label:            'Select Baranggay'
    });
    
    
    const compCommonSupplier    = new ComponentCommonSupplier({
        navigation:             navigation,
        parentObj:              this,
        uniqueKey:              `${settings.uniqueKey}-add`,
        elemDivContainer:       elemDivContainer,
        
        titleExpandSection:     'Add New Supplier',
        htmlExpandSection:      null,
        labelBtnExpandSave:     'Save New Supplier',
        
        labelSelect:            'Select Supplier',
        helpText:               null
        
    });
    
    
    const elemUiName            = new UiInputTextWithCounter({
        uniqueKey:              `${settings.uniqueKey}-supplier-name-2`,
        
        className:              'form-group-text',
        textLabel:              'Name',
        isRequired:             true,
        textMaxChars:           50,
        invalidFeedBack:        'Please enter a valid name.',
        helpText:               null
    });
    
    
    this.callbackOnSuccessAdd   = null;
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        elemIdBtnCancel         = `${settings.uniqueKey}-cancel`;
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        
        
        const html_address_levels   = compAddressLevels.getHtml();
        const html_supplier_list    = compCommonSupplier.getHtml();
        const html_supplier_name    = elemUiName.getHtml();
        
        const html =`

        
<div class="form-container">

    <div class="modal-header">
        <h5 class="modal-title">
            <i class="fas fa-plus me-2"></i><span id="${elemIdHeaderTitle}">Add Semen Supplier</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    
    <div class="modal-body">
        
        ${html_address_levels}
        
        ${html_supplier_list}
        
        ${html_supplier_name}
        
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
        compAddressLevels.afterHtmlRender();
        compCommonSupplier.afterHtmlRender();
        elemUiName.afterHtmlRender();
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemHeaderTitle         = elemDivContainer.querySelector('#'+elemIdHeaderTitle);
        elemBtnClose            = elemDivContainer.querySelector('#'+elemIdBtnClose);
            
        elemServerErrorMsg      = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);
        elemBtnCancel           = elemDivContainer.querySelector('#'+elemIdBtnCancel);
        elemBtnSave             = elemDivContainer.querySelector('#'+elemIdBtnSave);
    }
    
    
    this._processAfterHtmlRender = function(){
        compAddressLevels.callbackOnChangeLevel1 = this.onChangeAddressLevel1;
        compAddressLevels.callbackOnChangeLevel2 = this.onChangeAddressLevel2;
        compAddressLevels.callbackOnChangeLevel3 = this.onChangeAddressLevel3;
    }
    
    
    this._bindEventListeners = function(){
        

        elemBtnSave.addEventListener('click', function() {
            thisObj.onClickSaveButton();
        });
    }
    
    
    
    
   
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        compAddressLevels.reset();
    }
    
    
    this.show = function(options){
        /*
        
        Typical options 
        {
            is_add:         true,
            supplier_type:  SUPPLIER_TYPE.SEMEN,
            go_back_page:   settings.pageDivContainer   // Go back to this page
            callback_on_success_add : function
        }
        
        */
        
        
        thisObj._resetForm();
        
        
        showOptions = options;
        
        
        // Set title
        let title = '';
        
        switch(showOptions.supplier_type){
            case SUPPLIER_TYPE.FEED: {
                title = 'Add Feed Supplier';
                break;
            }
            
            case SUPPLIER_TYPE.SEMEN: {
                title = 'Add Semen Supplier';
                break;
            }
            
            case SUPPLIER_TYPE.GILT: {
                title = 'Add Gilt Supplier';
                break;
            }
        }
        
        elemHeaderTitle.textContent  = title;
        

        compCommonSupplier.setSupplierType(showOptions.supplier_type);

        
        // Get pig_farm country
        const pig_farm      = navigation.pigFarm.dataPigFarm;
        const loc_country   = pig_farm.location.country;
        const country_flag  = loc_country.flag;
        
        
        // 2026-05-18 notes:
        // 1.) The original address design has address levels business objects:
        //      - country_id
        //      - address_level_1_id
        //      - address_level_2_id
        //      - address_level_3_id
        //
        // where address_level_1 is the highest geographic division. This
        // was intended for nearby suppliers filtering of the pig farm.
        // 
        // 2.) The address_levels by default are optional, and of this writing
        // only the country Philippines has address levels saved static data in 
        // different database.
        //
        // 3.) Setting up an address level of a country is a major effort, 
        // therefore this must be optional.
        //
        // 
        
        
        hasAddressLevels = 0;
        
        if ((country_flag & FLAG_BITS.APP_COUNTRY.HAS_ADDRESS_LEVELS) > 0){
            hasAddressLevels = 1;
        }
        
        if (hasAddressLevels == 0){
            compAddressLevels.hide();
        }
        
        
        // Hide Supplier List
        compCommonSupplier.hide();
        
        
        // Update Close and cancel button on click
        
        elemBtnClose.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
        
        elemBtnCancel.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
    }
    
    
    this.getSupplierCountPerAddressLevel1 =  function(){
        if (SHOW_SUPPLIER_COUNT_ADDRESS_LEVEL_1 == false){return;}
    }
    
    
    this.filterBySupplierType = function(supplier_list){
        const filtered = [];
        
        for (const cur_entry of  supplier_list){
            
            switch(showOptions.supplier_type){
                case SUPPLIER_TYPE.FEED: {
                    if (cur_entry.supplier.is_fs > 0){
                        filtered.push(cur_entry);
                    }
                    break;
                }
                
                case SUPPLIER_TYPE.SEMEN: {
                    if (cur_entry.supplier.is_ss > 0){
                        filtered.push(cur_entry);
                    }
                    break;
                }
                
                case SUPPLIER_TYPE.GILT: {
                    if (cur_entry.supplier.is_gs > 0){
                        filtered.push(cur_entry);
                    }
                    break;
                }
            }
        }
        
        return filtered;
    }
    
    
    this.onChangeAddressLevel1 = function(level_1_hid){
        // Hide Supplier List
        compCommonSupplier.hide();
    }
    
    
    this.onChangeAddressLevel2 = function(level_2_hid){
        // Get suppliers at addressLevel
        curAddressLevel2 = compAddressLevels.curAddressLevel2;
        
        compCommonSupplier.show();
        
        
        if ('list_supplier' in curAddressLevel2){
            // set all suppliers in addressLevel2
            compCommonSupplier.setDataSupplierListLevel2(curAddressLevel2.list_supplier);
            
                
            // Set compCommonSupplier dropdown.
            const filtered = thisObj.filterBySupplierType(
                    curAddressLevel2.list_supplier); 
            
            compCommonSupplier.setDataSupplier(filtered);
                    
        }
        else{
            const callback_success = function(data){
                // set all suppliers in addressLevel2
                compCommonSupplier.setDataSupplierListLevel2(data);
            
                    
                // Set compCommonSupplier dropdown.
                const filtered = thisObj.filterBySupplierType(
                        curAddressLevel2.list_supplier); 
                compCommonSupplier.setDataSupplier(filtered);
                
            };
            
            managerAddress.requestDataSupplier(curAddressLevel2, callback_success);
        }
        
        
    }
    
    
    this.onChangeAddressLevel3 = function(level_3_hid){
        // Get suppliers at addressLevel3


        // Filter which of the suppliers in curAddressLevel2 are in level_3_hid
        const filtered_level_2 = [];
        const list_supplier = curAddressLevel2.list_supplier;
        
        for (const cur_entry of  list_supplier){
            if (cur_entry.location.address.level_3 == level_3_hid){
                filtered_level_2.push(cur_entry);
            }
        }
        
        
        const filtered  = thisObj.filterBySupplierType(filtered_level_2); 
        
        
        // The filtered supplier_by type should be shown in the 
        // compCommonSupplier dropdown.
        compCommonSupplier.setDataSupplier(filtered);
        
    }
    
    
    this.onSuccessAddSupplier = function(supplier_hid){
        const callback_success = function(data){
            // set all suppliers in addressLevel2
            compCommonSupplier.setDataSupplierListLevel2(data);
        
            
            // Set compCommonSupplier dropdown.
            const filtered = thisObj.filterBySupplierType(
                    curAddressLevel2.list_supplier); 
            compCommonSupplier.setDataSupplier(filtered, supplier_hid);
            
        };
        
        
        // Request suppliers for address Level2
        managerAddress.requestDataSupplier(curAddressLevel2, callback_success);
    }
    
    
    this.getAddressHids = function(){
        return compAddressLevels.getAddressHids();
    }
    
        
    this.onClickSaveButton = function(){
        if (hasAddressLevels > 0){
            this._saveSupplierAsSharedSupplier();
        }
        else{
            this._saveSupplierToAccountOnly();
        }
    }
        
    
    this._saveSupplierToAccountOnly = function(){
        let input_elem      = null;
        let validation      = 0;
        
       
        let input_name      = elemUiName.getValue();
        
       
        input_elem          = elemUiName.getElemText();
        if (input_name.length == 0){
            validation = -1;
        }
        addValidationClassToElem(input_elem, validation);
        
        
        if (validation != 0) {return;}
        
        
        // Get pig_farm country
        const pig_farm          = navigation.pigFarm.dataPigFarm;
        const loc_country       = pig_farm.location.country;
        const loc_country_hid   = loc_country.hid;
        
        
        const user_hid      = navigation.userControl.getUserHid();
        
        const base_url      = window.location.origin;


        const url = `${base_url}/supplier/add`;
    
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'country_hid':      loc_country_hid,
           
            'name':             input_name
        };
        
      
        
        switch(showOptions.supplier_type){
            case SUPPLIER_TYPE.FEED: {
                post_data.is_feed_supplier = 1;
                break;
            }
            
            case SUPPLIER_TYPE.SEMEN: {
                post_data.is_semen_supplier = 1;
                break;
            }
            
            case SUPPLIER_TYPE.GILT: {
                post_data.is_gilt_supplier = 1;
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
            url: url,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
                elemServerErrorMsg.innerHTML = '';
            },
  
            success: function(response){
                if (response.result.num == 0){
                   
                    
                    const supplier_hid = response.supplier.hid;
                    
                    
                    thisObj.onSuccessAddEntryAccountSelection(supplier_hid);
                    
                }
                else{
                    navigation.serverError.receivedErrorMessage(response,
                        elemServerErrorMsg);
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
    
    
        
    this._saveSupplierAsSharedSupplier = function(){
        let input_elem;
        let validation      = 0;
        

        let input_supplier_hid      = compCommonSupplier.getValue();
        
        
        input_elem          = compCommonSupplier.getElemSelect();
        
        if (input_supplier_hid == '0' || input_supplier_hid == '-1'){
            validation = -1;
        }
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
            return;
        }
        
        
        const user_hid      = navigation.userControl.getUserHid();
        const base_url      = window.location.origin;

        
        // send post request
        const post_data = {
            'uhid':             user_hid
        };
        
        switch(showOptions.supplier_type){
            case SUPPLIER_TYPE.FEED: {
                post_data.feed_supplier_hid = input_supplier_hid;
                break;
            }
            
            case SUPPLIER_TYPE.SEMEN: {
                post_data.semen_supplier_hid = input_supplier_hid;
                break;
            }
            
            case SUPPLIER_TYPE.GILT: {
                
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
            url: `${base_url}/account/selection/add`,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    thisObj.onSuccessAddEntryAccountSelection(input_supplier_hid);
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
    
    
    this.onSuccessAddEntryAccountSelection = function(supplier_hid){
        const callback_success = function(){
            if (thisObj.callbackOnSuccessAdd){
                navigation.showThisPage(showOptions.go_back_page);
                thisObj.callbackOnSuccessAdd(supplier_hid);
            }
        };
        
        // Update account supplier list
        navigation.pigFarm.accountLists.requestDataSupplier(showOptions.supplier_type, 
            callback_success, elemServerErrorMsg)
    }
    
    
}   
