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
    
    
    const compAddressLevels     = new ComponentAddressLevels({
        navigation:             navigation,
        uniqueKey:              `${settings.uniqueKey}-address`,
        elemDivContainer:       elemDivContainer,
        
        level1Label:            'Select Province or Region',
        level2Label:            'Select City or Municipality',
        level3Label:            'Select Baranggay'
    });
    
    
    const compCommonSupplier    = new ComponentCommonSupplier({
        navigation:             navigation,
        uniqueKey:              `${settings.uniqueKey}-add`,
      
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
    
    
    this.onChangeAddressLevel1 = function(level_1_hid){
        // Get suppliers at addressLevel
        
        // Hide Supplier List
        compCommonSupplier.hide();
        
        
        const address_level_1 = managerAddress.getAddressLevel1(level_1_hid);
        
        if ('list_supplier' in address_level_1){
            
        }
        else{
            managerAddress.requestDataSupplier(address_level_1);
        }
    }
    
    this.onChangeAddressLevel2 = function(level_2_hid){
        // Get suppliers at addressLevel2
        
        
        // Hide Supplier List
        compCommonSupplier.show();
        
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
    
    
    this.onSuccessAddGestatingEntry = function(){
        const pig_prod_type = PIG_PROD_TYPE.GESTATING;
        
        const callback = function(data){
            navigation.setDataPigProdList(data);
            
            thisObj.show(); 
            
            navigation._onClickNavProdGestaLacta(null, PIG_OPERATION_TYPE.GESTATING);
        };
        
        navigation.managerRequest.requestDataPigProd(pig_prod_type, callback);
        
    }
    
    
}   