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

import {UiSelectWithEntryCount} from '../common/ui/select_with_entry_count.js';



export function PageParentTrace(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    
    /*
    Typical settings = {
        navigation:             this,
    };
    */
    const settings              = input_settings;

    
    const elemDivContainer      = document.getElementById('container-prod-gesta-add');
        
        
    let elemIdBtnClose          = null;
    
    let elemIdSow               = null;
    let elemIdSowCount          = null;
    let elemIdSowAdd            = null;
    let elemIdSowStatusShow     = null;
    let elemIdSowLastInsem      = null;
    let elemIdSowLastPid        = null;
    let elemIdDateMating        = null;
    let elemIdInsemType         = null;
    
    let elemIdBoarShow          = null;
    let elemIdBoar              = null;
    let elemIdBoarCount         = null;
    let elemIdBoarAdd           = null;
    
    let elemIdAiShow            = null;
    let elemIdSemenSupplier     = null;
    let elemIdSemenSupplierCount= null;
    let elemIdSemenSupplierInfo = null;
    let elemIdSemenType         = null;
    let elemIdSemenTypeCount    = null;
    let elemIdSemenCost         = null;
  
    let elemIdBoarInternalShow  = null;
    let elemIdBoarInternal      = null;
    let elemIdBoarInternalCount = null;
    
    
    let elemIdOtherCost         = null;
    
    let elemIdNotes             = null;
    let elemIdNotesCharCounter  = null;
    
    let elemIdStaff             = null;
    let elemIdStaffCount        = null;
    let elemIdStaffAdd          = null;
    let elemIdChkDoneByMe       = null;
    
    
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemBtnClose            = null;
    
    let elemSow                 = null;
    let elemSowCount            = null;
    let elemSowAdd              = null;
    let elemSowStatusShow       = null;
    let elemSowLastInsem        = null;
    let elemSowLastPid          = null;
    let elemDateMating          = null;
    let elemInsemType           = null;
    
    let elemBoarShow            = null;
    let elemBoar                = null;
    let elemBoarCount           = null;
    let elemBoarAdd             = null;
    
    
    let elemAiShow              = null;
    let elemSemenSupplier       = null;
    let elemSemenSupplierCount  = null;
    let elemSemenSupplierInfo   = null;
    let elemSemenType           = null;
    let elemSemenTypeCount      = null;
    let elemSemenCost           = null;
    
    let elemBoarInternalShow    = null;
    let elemBoarInternal        = null;
    let elemBoarInternalCount   = null;
    
    
    let elemOtherCost           = null;
    
    let elemNotes               = null;
    let elemNotesCharCounter    = null;
    
    let elemStaff               = null;
    let elemStaffCount          = null;
    let elemStaffAdd            = null;
    let elemChkDoneByMe         = null;
    
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
    let sowList                 = null;
    let boarList                = null;
    let semenSupplierList       = null;
    
    
    
    let newEntry                = new ModelPigProduction();
    
    
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        
        elemUiSow         		= new UiSelectWithEntryCount({
            uniqueKey:           'parent-trace-sow',
        
            labelSelect:         'Select Sow or Gilt'
        });
        
        elemUiBoar        		= new UiSelectWithEntryCount({
            uniqueKey:           'parent-trace-boar',
        
            labelSelect:         'Select Boar'
        });
        
		
		const html_ui_number    = elemUiNumber.getHtml();
        
        const html_ui_sow    	= elemUiSow.getHtml();
        const html_ui_boar   	= elemUiBoar.getHtml();
        
		
		
        elemIdBtnCancel         = `pig-prod-add-cancel`;
        elemIdBtnSave           = `pig-prod-add-save`;
        
        
        
        
        const html =`

        
<div class="form-container">

    <div class="modal-header gestating">
        <h5 class="modal-title" id="add-entry-acc-pig-ops-modal-label">
            <i class="fas fa-plus me-2"></i><span>Parent Trace</span>
        </h5>
    </div>
    
    
    <div class="modal-body">
        
        <!-- 1. Sow Field -->
        ${html_ui_sow}
            
        
        <!-- 2. Boar Field -->
        ${html_ui_sow}
        
		<button type="button" class="btn btn-primary" id="${elemIdBtnSave}">
			<i class="fas fa-save me-2"></i>Save
		</button>
		
        
        
        
        
        
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
        
        elemSow                 = document.getElementById(elemIdSow);
        elemSowCount            = document.getElementById(elemIdSowCount);
        elemSowAdd              = document.getElementById(elemIdSowAdd);
        elemSowStatusShow       = document.getElementById(elemIdSowStatusShow);
        elemSowLastInsem        = document.getElementById(elemIdSowLastInsem);
        elemSowLastPid          = document.getElementById(elemIdSowLastPid);
        elemDateMating          = document.getElementById(elemIdDateMating);
        elemInsemType           = document.getElementById(elemIdInsemType);
        
        elemBoarShow            = document.getElementById(elemIdBoarShow);
        elemBoar                = document.getElementById(elemIdBoar);
        elemBoarCount           = document.getElementById(elemIdBoarCount);
        elemBoarAdd             = document.getElementById(elemIdBoarAdd);
        
        elemAiShow              = document.getElementById(elemIdAiShow);
        elemSemenSupplier       = document.getElementById(elemIdSemenSupplier);
        elemSemenSupplierCount  = document.getElementById(elemIdSemenSupplierCount);
        elemSemenType           = document.getElementById(elemIdSemenType);
        elemSemenTypeCount      = document.getElementById(elemIdSemenTypeCount);
        elemSemenCost           = document.getElementById(elemIdSemenCost);
        
        elemBoarInternalShow    = document.getElementById(elemIdBoarInternalShow);
        elemBoarInternal        = document.getElementById(elemIdBoarInternal);
        elemBoarInternalCount   = document.getElementById(elemIdBoarInternalCount);
        
        
        elemOtherCost           = document.getElementById(elemIdOtherCost);
        
        elemNotes               = document.getElementById(elemIdNotes);
        elemNotesCharCounter    = document.getElementById(elemIdNotesCharCounter);
        
        elemStaff               = document.getElementById(elemIdStaff);
        elemStaffCount          = document.getElementById(elemIdStaffCount);
        elemStaffAdd            = document.getElementById(elemIdStaffAdd);
        elemChkDoneByMe         = document.getElementById(elemIdChkDoneByMe);
            
        elemBtnCancel           = document.getElementById(elemIdBtnCancel);
        elemBtnSave             = document.getElementById(elemIdBtnSave);
    }
    
    
    this._processAfterHtmlRender = function(){
        
    }
    
    
    this._bindEventListeners = function(){

        
        
    }
    
    
    this.setDataSowList = function(data){
        sowList = data;
        
        // Exclude not production ready
        let filtered = [];
        for (const cur_entry of data){
            if (cur_entry.is_production_ready > 0){
                filtered.push(cur_entry);
            }
        }
        

        thisObj.commonSelectOptions.setDataSowList(filtered, elemSow);
        
        elemSowCount.textContent = ` (${filtered.length} Entries)`;
    }
    
    
    this.setDataBoarList = function(data){
        boarList = data;
        
        // Exclude not production ready
        const filtered = []
        for (const cur_entry of data){
            if (cur_entry.is_production_ready > 0){
                filtered.push(cur_entry);
            }
        }
        
        thisObj.commonSelectOptions.setDataBoarList(filtered, elemBoar);
        thisObj.commonSelectOptions.setDataBoarList(filtered, elemBoarInternal);
        
        elemBoarCount.textContent   = ` (${filtered.length} Entries)`;
        elemBoarInternalCount.textContent= ` (${filtered.length} Entries)`;
    }
    
    
    this.getDataSow = function(sow_hid){
        for (const cur_entry of sowList){
            if (cur_entry.hid == sow_hid){return cur_entry;}
        } 
        
        return null;
    }
    
    
    this.getDataBoar = function(boar_hid){
        for (const cur_entry of boarList){
            if (cur_entry.hid == boar_hid){return cur_entry;}
        } 
        
        return null;
    }
    
    
    
    this.setDataSemenSupplierList = function(data){
        semenSupplierList = data;
        
        
        thisObj.commonSelectOptions.setDataSemenSupplierList(semenSupplierList, elemSemenSupplier);
        
        elemSemenSupplierCount.textContent   = ` (${semenSupplierList.length} Entries)`;
    }
    
    
   
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        
      
        elemSow.selectedIndex = 0; 
        elemSow.classList.remove('is-valid', 'is-invalid');
        
        elemSowStatusShow.style.display = 'none';
        
        elemDateMating.value = '';
        elemDateMating.classList.remove('is-valid', 'is-invalid');
        
        
        // This is needed as there is a switch in inputs
        elemInsemType.selectedIndex = 0;
        const event = new Event('change');
        elemInsemType.dispatchEvent(event); 
        
        
        elemBoar.selectedIndex = 0;
        elemBoar.classList.remove('is-valid', 'is-invalid');
        
        
        elemSemenSupplier.selectedIndex = 0;
        elemSemenSupplier.classList.remove('is-valid', 'is-invalid');
        
        
        elemSemenType.selectedIndex = 0;
        elemSemenType.classList.remove('is-valid', 'is-invalid');
        
        
        elemSemenCost.value = '';
        elemSemenCost.classList.remove('is-valid', 'is-invalid');
        
        
        elemOtherCost.value = '';
        elemOtherCost.classList.remove('is-valid', 'is-invalid');
        
        
        elemStaff.selectedIndex = 0;
        elemStaff.classList.remove('is-valid', 'is-invalid');
        
        elemChkDoneByMe.checked = false;
        
        
        elemNotes.value = '';
        elemStaff.classList.remove('is-valid', 'is-invalid');
        
        thisObj.updateCharCounter(elemNotes, elemNotesCharCounter, 160);
        
    }
    
    
    this.show = function(){
        thisObj._resetForm();
        
        const account_semen_suppliers = navigation.pigFarm.accountLists.getListSemenSupplier();
        
        // Request semen_supplier if not yet requested
        if (account_semen_suppliers == null){
            navigation.pigFarm.accountLists.requestSupplier(SUPPLIER_TYPE.SEMEN,
                    thisObj.setDataSemenSupplierList);
        }
        else{
            thisObj.setDataSemenSupplierList(account_semen_suppliers);
        }
    }
    
    
    this._onChangeSow = function(){
        let sow_hid       = elemSow.value;
        
        let index;
        let cur_entry;
        
        let gestating_sow = null;
        
        elemSowStatusShow.style.display = 'none';
        
        for(index = 0; index < sowList.length; index++){
            cur_entry = sowList[index];
            if ('sow_boar' in cur_entry){
                cur_entry = cur_entry.sow_boar;
            }
            
            if (cur_entry.hid == sow_hid){
                if (cur_entry.status_id == SOW_STATUS.GESTATING){
                    if (cur_entry.last_farm_prod_id != null){
                        elemSowLastInsem.innerHTML  = cur_entry.date_insemination;
                        elemSowLastPid.innerHTML    = cur_entry.last_farm_prod_id;  
                        
                        
                        elemSowStatusShow.style.display = 'block';
                    }
                }
                break;
            }
        }
    }
    
    
    this._onChangeSemenSupplier = function(semen_hid){
        elemSemen       .removeClass('is-invalid');
        elemSemen       .removeClass('is-valid');
        
        const supplier_hid = elemSemenSupplier.value
        
        
        // Need to request semen_supplier_semen
        const base_url = window.location.origin;
        const url = `${base_url}/semen_sup_semen/list?semen_supplier_hid={supplier_hid}`;
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            async: true,
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    
                    
                    let semen_supplier = thisObj.getSemenSupplier(supplier_hid);
                  
                  
                    
                    
                    let new_options = [];
                    if (response.data.length == 0){
                        new_options.push({value:"-1", text:"No Entries"});
                        thisObj._replaceSelectOptions(
                            elemSemen, new_options);
                        elemSemenShow.show();
                        return;
                    }
                    
                    
                    new_options.push({value:"0", text:"Please Select"});
                    
                    $(response.data).each(function(){
                        new_options.push({value:this.hid, text:this.name});
                    });
                    
                    thisObj._replaceSelectOptions(elemSemen, new_options);
                    elemSemenShow.show();
                    
                    if (semen_hid){
                        elemSemen.val(semen_hid).change();
                    }
                    
                }
                else {
                    // TODO
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
    }
    
    
    this._validateAfterChangeInput = function(ev, input_field){
        /* Use this to validate new entry form input.*/
    
        let input_elem  = null;
        let input_val   = null;
        let cur_field   = null;
        let validation  = null;
        
        console.log('TEs1 ');
        
        if (ev.checkValidity()) {
            switch(input_field){
            
                case 'date_mating': {
                    input_elem      = elemDateMating;
                    input_val       = input_elem.value;
                    cur_field       = newEntry.fieldInsemDate;
                    
                    console.log('date_mating = ' + input_val);
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
                
                case 'staff':{
                    ev.classList.remove('is-invalid');
                    break;
                }
                
                case 'notes': {
                    input_elem  = elemNotes;
                    input_val   = input_elem.value;
                    cur_field   = fieldNotes;
                    
                    
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
                
                case 'staff':{
                    input_elem  = elemStaff;
                    input_val   = input_elem.val();
                    
                    
                    if (input_val != '0'){
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