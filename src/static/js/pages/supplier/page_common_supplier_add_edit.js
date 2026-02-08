// December 23, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../common/page_view_basic.js';

import {PAGE_ID,
        SOW_STATUS,
        PIG_PROD_TYPE,
        PIG_OPERATION_TYPE,
        SUPPLIER_TYPE}          from '../../constants.js';

import {CommonSelectOptions}    from '../common/common_select_options.js';


import {addValidationClassToElem} from '../common/ui/ui_utils.js';

import {ComponentAddressLevels} from '../common/ui/comp_address_levels.js'

import {ComponentCommonSupplier}  from './comp_common_supplier.js';


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
    
    
    this.beforeShow = function(options){
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
        
        console.log(' supplier_add_edit onChangeAddressLevel3');
        
        
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
        
        
        // Set suppliers to address Level2
        managerAddress.requestDataSupplier(curAddressLevel2, callback_success);
        
        
    }
    
    
    this.getAddressHids = function(){
        return compAddressLevels.getAddressHids();
    }
    
        
    this.onClickSaveButton = function(){
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
        
        
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            url: `${base_url}/account/selection/add`,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    thisObj.onSuccessAddAEntryccountSelection(input_supplier_hid);
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
    
    
    this.onSuccessAddAEntryccountSelection = function(supplier_hid){
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
