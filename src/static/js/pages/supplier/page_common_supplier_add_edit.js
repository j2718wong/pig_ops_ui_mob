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
    
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemHeaderTitle         = null;
    let elemBtnClose            = null;
    
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
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
        
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
        compAddressLevels.afterHtmlRender();
        compCommonSupplier.afterHtmlRender();
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemHeaderTitle         = elemDivContainer.querySelector('#'+elemIdHeaderTitle);
        elemBtnClose            = elemDivContainer.querySelector('#'+elemIdBtnClose);
            
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
         //   thisObj.onClickSaveButton();
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
        }
        
        */
        
        
        thisObj._resetForm();
        
        
        showOptions = options;
        
        
        // Set title
        let title = '';
        
        switch(showOptions.supplier_type){
            case SUPPLIER_TYPE.FEED: {
                title = 'Add New Feed Supplier';
                break;
            }
            
            case SUPPLIER_TYPE.SEMEN: {
                title = 'Add New Semen Supplier';
                break;
            }
            
            case SUPPLIER_TYPE.GILT: {
                title = 'Add New Gilt Supplier';
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
        
        /*
        if showOptions.supplier_type  == SUPPLIER_TYPE.SEMEN or SUPPLIER_TYPE.GILT
            show compCommonSupplier;
            This is because there are few semen suppliers and gilt suppliers
            
            
        if showOptions.supplier_type  == SUPPLIER_TYPE.FEED
            hide compCommonSupplier; // should be shown only at level 3
        */
        
        if ('list_supplier' in curAddressLevel2){
            // set all suppliers in addressLevel2
            compCommonSupplier.setDataSupplierListLevel2(curAddressLevel2.list_supplier);
            
            // todo How to update curAddressLevel2.list_supplier
            if (showOptions.supplier_type == SUPPLIER_TYPE.SEMEN || 
                showOptions.supplier_type == SUPPLIER_TYPE.GILT){
                
                compCommonSupplier.show();
                
                // Set compCommonSupplier dropdown.
                const filtered = thisObj.filterBySupplierType(
                        curAddressLevel2.list_supplier); 
                compCommonSupplier.setDataSupplier(filtered);
            }
            else{
                compCommonSupplier.hide();
            }
        }
        else{
            const callback_success = function(data){
                // set all suppliers in addressLevel2
                compCommonSupplier.setDataSupplierListLevel2(data);
            
                
                if (showOptions.supplier_type == SUPPLIER_TYPE.SEMEN || 
                    showOptions.supplier_type == SUPPLIER_TYPE.GILT){
                    
                    compCommonSupplier.show();
                    
                    // Set compCommonSupplier dropdown.
                    const filtered = thisObj.filterBySupplierType(
                            curAddressLevel2.list_supplier); 
                    compCommonSupplier.setDataSupplier(filtered);
                }
                else{
                    compCommonSupplier.hide();
                }
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
        
        managerAddress.requestDataSupplier(curAddressLevel2, callback_success);
        
    }
    
	
    this.getAddressHids = function(){
        return compAddressLevels.getAddressHids();
    }
    
        
    this.onClickSaveButton = function(){
        let input_elem;
        let cur_field;
        let validation;
        let proceed_to_save = 1;
        

        let input_sow_hid           = elemSow.value;
        let input_insem_type        = elemInsemType.value;
        let input_boar_hid          = elemBoar.value;
        let input_date_mating       = elemDateMating.value;
        let input_semen_supplier_hid = elemSemenSupplier.value;
        let input_semen_type_hid    = elemSemenType.value;
        let input_semen_cost        = elemSemenCost.value;
        let input_other_cost        = elemOtherCost.value;
        let input_insem_notes       = elemNotes.value;
        let input_staff_hid         = elemStaff.value;
        
        
        input_elem          = elemSow;
        
        if (input_sow_hid == '0'){
            if (input_elem.classList.contains('is-invalid') == false){
                input_elem.classList.add('is-invalid');
            }
            proceed_to_save = 0;
        }
        else{
            if (input_elem.classList.contains('is-valid') == false){
                input_elem.classList.add('is-valid');
            }
        }
        
        if (proceed_to_save == 0) {return;}
        
        
        if (input_insem_type == 'boar-mating'){
            input_elem          = elemBoar;
            
            if (input_boar_hid == '0'){
                if (input_elem.classList.contains('is-invalid') == false){
                    input_elem.classList.add('is-invalid');
                }
                proceed_to_save = 0;
            }
            else{
                if (input_elem.classList.contains('is-valid') == false){
                    input_elem.classList.add('is-valid');
                }
            }
            
        } else{
            input_elem          = elemSemenSupplier;
            
            if (input_semen_supplier_hid  == '0'){
                if (input_elem.classList.contains('is-invalid') == false){
                    input_elem.classList.add('is-invalid');
                }
                proceed_to_save = 0;
            }
            else{
                if (input_elem.classList.contains('is-valid') == false){
                    input_elem.classList.add('is-valid');
                }
            }
            
            
            input_elem          = elemSemenType;
            
            if (input_semen_type_hid  == '0'){
                if (input_elem.classList.contains('is-invalid') == false){
                    input_elem.classList.add('is-invalid');
                }
                proceed_to_save = 0;
            }
            else{
                if (input_elem.classList.contains('is-valid') == false){
                    input_elem.classList.add('is-valid');
                }
            }
        }
        
        if (proceed_to_save == 0) {return;}
        
        
        input_elem          = elemDateMating;
        cur_field           = newEntry.fieldInsemDate;
        
        // Convert date to YYYY-MM-DD format
        const dt_mating     = new Date(input_date_mating);
        const dt_mating_s   = dt_mating.toLocaleDateString('en-CA');
        
        
        cur_field.newValue  = dt_mating_s;
        validation          = cur_field.validateChange();
        
        if (validation != FIELD_VALIDATION_OK){
            if (input_elem.classList.contains('is-invalid') == false){
                input_elem.classList.add('is-invalid');
            }
            proceed_to_save = 0;
        }
        else{
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
            }
        }
        if (proceed_to_save == 0) {return;}
        
        
        const user_hid      = navigation.userControl.getUserHid();
        const base_url      = window.location.origin;

        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'sow_hid':          input_sow_hid,
            'boar_hid':         input_boar_hid,
            'semen_supplier_hid':   input_semen_supplier_hid,
            'semen_sup_semen_hid':  input_semen_type_hid,
            
            'insem_staff_hid':  input_staff_hid,
            'done_by_user':     done_by_user,

            'insem_notes':      input_insem_notes,
            
            'insem_date':       dt_mating_s
        };
        
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
        
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            url: `${base_url}/pig_prod/add`,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    thisObj.onSuccessAddGestatingEntry();
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
    
    
    
}   