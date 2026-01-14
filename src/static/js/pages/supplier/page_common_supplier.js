// December 23, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../../common/page_view_basic.js';

import {PAGE_ID,
        SOW_STATUS,
        PIG_PROD_TYPE,
        PIG_OPERATION_TYPE,
        SUPPLIER_TYPE}          from '../../../constants.js';

import {CommonSelectOptions}    from '../../common/common_select_options.js';

import {ComponentAddressLevels} from '../../common/ui/comp_address_levels.js'

import {FIELD_VALIDATION_OK}    from '../../../models/model_basic.js'



export function PageCommonSupplier(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    
    /*
    Typical settings = {
        navigation:             this,
		headerTitle:			'Add Semen Supplier',
		supplierType:			SUPPLIER_TYPE.SEMEN,
    };
    */
    const settings              = input_settings;

    
    const elemDivContainer      = document.getElementById('container-supplier-add-edit');
        
	// These can be controlled; normally this is for development
	// purpose any analytics purpose only;
	let SHOW_SUPPLIER_COUNT_ADDRESS_LEVEL_1 = true;
	let SHOW_SUPPLIER_COUNT_ADDRESS_LEVEL_2 = true;
	let SHOW_SUPPLIER_COUNT_ADDRESS_LEVEL_3 = true;
        
		
    let elemIdBtnClose          = null;
    
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
    
    
    const settingsAddressLevels = {
        uniqueKey:      'supplier-address'
        navigation:		navigation
    }
    const compAddressLevels 	= new ComponentAddressLevels(settingsAddressLevels);
    
	
    const settingsNewSupplier = {
        uniqueKey:              'supplier-add'
        
        titleExpandSection:     'Add New Supplier',
        htmlExpandSection:      null,
        labelBtnExpandSave:    	'Save New Supplier',
        
        labelSelect:            'Select Supplier'
        helpText:               ''
        
    }
    const elemUiSupplierList 	= new UiSelectWithAddExpandable(settingsNewSupplier);
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdBtnClose          = `supplier-close`;
        
        elemIdBtnCancel         = `supplier-cancel`;
        elemIdBtnSave           = `supplier-save`;
        
        
		const html_address_levels 	= compAddressLevels.getHtml();
		const html_supplier_list 	= elemUiSupplierList.getHtml();
        
		
        const html =`

        
<div class="form-container">

    <div class="modal-header gestating">
        <h5 class="modal-title" id="add-entry-acc-pig-ops-modal-label">
            <i class="fas fa-plus me-2"></i><span>${settingsheaderTitle}</span>
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
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemBtnClose            = document.getElementById(elemIdBtnClose);
            
        elemBtnCancel           = document.getElementById(elemIdBtnCancel);
        elemBtnSave             = document.getElementById(elemIdBtnSave);
    }
    
    
    this._processAfterHtmlRender = function(){
        
        
    }
    
    
    this._bindEventListeners = function(){
        
        
        elemBtnClose.addEventListener('click', function() {
            navigation._onClickNavProdGestaLacta(null, PIG_OPERATION_TYPE.GESTATING);
        });
        
        elemBtnCancel.addEventListener('click', function() {
        //    navigation._onClickNavProdGestaLacta(null, PIG_OPERATION_TYPE.GESTATING);
        });
        
        
        elemBtnSave.addEventListener('click', function() {
         //   thisObj.onClickSaveButton();
        });
        
        
    }
    
    
    
    
   
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        compAddressLevels.reset();

        
    }
    
    
    this.beforeShow = function(){
        thisObj._resetForm();
    }
    
	
	this.getSupplierCountPerAddressLevel1 =  function(){
		if (SHOW_SUPPLIER_COUNT_ADDRESS_LEVEL_1 == false){return;}
		
		
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