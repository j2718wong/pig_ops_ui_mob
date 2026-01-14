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

import {ModelPigProduction}     from '../../../models/model_pig_production.js'

import {FIELD_VALIDATION_OK}    from '../../../models/model_basic.js'



export function PageCommonSupplier(input_settings){
    PageCommonSupplier.call(this);
    
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
        
        elemIdBtnClose          = `pig-prod-add-select-close`;
        
        elemIdSow               = `pig-prod-add-select-sow`;
        elemIdSowCount          = `pig-prod-add-select-sow-count`;
        elemIdSowAdd            = `pig-prod-add-sow-add`;
        elemIdSowStatusShow     = `pig-prod-add-sow-status-show`;
        elemIdSowLastInsem      = `pig-prod-add-sow-last-insem`;
        elemIdSowLastPid        = `pig-prod-add-sow-last-pid`;
        elemIdDateMating        = `pig-prod-add-date-mating`;
        elemIdInsemType         = `pig-prod-add-insem-type`;
        
        elemIdBoarShow          = `pig-prod-add-select-boar-show`;
        elemIdBoar              = `pig-prod-add-select-boar`;
        elemIdBoarCount         = `pig-prod-add-select-boar-count`;
        elemIdBoarAdd           = `pig-prod-add-boar-add`;
        
        
        elemIdAiShow            = `pig-prod-add-select-ai-show`;
        elemIdSemenSupplier     = `pig-prod-add-select-semen-supplier`;
        elemIdSemenSupplierCount= `pig-prod-add-select-semen-supplier-count`;
        elemIdSemenSupplierInfo = `pig-prod-add-select-semen-supplier-info`;
        elemIdSemenType         = `pig-prod-add-select-semen-type`;
        elemIdSemenTypeCount    = `pig-prod-add-select-semen-type-count`;
        elemIdSemenCost         = `pig-prod-add-semen-cost`;
        
        elemIdBoarInternalShow  = `pig-prod-add-boar-internal-show`;
        elemIdBoarInternal      = `pig-prod-add-boar-internal`;
        elemIdBoarInternalCount = `pig-prod-add-boar-internal-count`;
        
        elemIdOtherCost         = `pig-prod-add-other-cost`;
        
        elemIdNotes             = `pig-prod-add-notes`;
        elemIdNotesCharCounter  = `pig-prod-add-notes-char-counter`;
        
        elemIdStaff             = `pig-prod-add-staff`;
        elemIdStaffCount        = `pig-prod-add-staff-count`;
        elemIdStaffAdd          = `pig-prod-add-staff-add`;
        elemIdChkDoneByMe       = `pig-prod-add-done-by-me'`;
        
        elemIdBtnCancel         = `pig-prod-add-cancel`;
        elemIdBtnSave           = `pig-prod-add-save`;
        
        
        
        
        const html =`

        
<div class="form-container">

    <div class="modal-header gestating">
        <h5 class="modal-title" id="add-entry-acc-pig-ops-modal-label">
            <i class="fas fa-plus me-2"></i><span>${settingsheaderTitle}</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    
    <div class="modal-body">
        
        <!-- 1. Address Level 1 -->
        <div class="form-group-select">
            <label for="${elemIdAdrsLevel1}" class="form-label">
                ${elemIdLabelAdrsLevel1} <span class="entries-count" id=${elemIdAdrsLevel1Count}></span>
            </label>
                        
            <div class="input-group">
                <select class="form-select" id="${elemIdAdrsLevel1}">
                    <option value="-1" selected disabled>No Entries</option>
                </select>
            </div>
        </div>
            
        <!-- 2. Address Level 2 -->
        <div class="form-group-select">
            <label for="${elemIdAdrsLevel2}" class="form-label">
                ${elemIdLabelAdrsLevel2} <span class="entries-count" id=${elemIdAdrsLevel2Count}></span>
            </label>
                        
            <div class="input-group">
                <select class="form-select" id="${elemIdAdrsLevel2}">
                    <option value="-1" selected disabled>No Entries</option>
                </select>
            </div>
        </div>
        
		
		<!-- 3. Address Level 3 -->
        <div class="form-group-select">
            <label for="${elemIdAdrsLevel3}" class="form-label">
                ${elemIdLabelAdrsLevel3} <span class="entries-count" id=${elemIdAdrsLevel3Count}></span>
            </label>
                        
            <div class="input-group">
                <select class="form-select" id="${elemIdAdrsLevel3}">
                    <option value="-1" selected disabled>No Entries</option>
                </select>
            </div>
        </div>
        
		
        
        
        <!-- 5. Other Cost -->
        <div class="form-group-number">
            <label for="${elemIdOtherCost}" class="form-label">
                Other Cost
            </label>
                
            <input type="number" class="form-control" id="${elemIdOtherCost}" placeholder="0.00" step="0.1" min="0">
            <div class="invalid-feedback">
                Please enter numeric value.
            </div>
        </div>
        
        
        <!-- 6. Notes -->
        <div class="form-group-text-area">
            <label for="${elemIdNotes}" class="form-label">
                Notes
                <span id="${elemIdNotesCharCounter}" class="char-counter">0/160</span>
            </label>
            
            <textarea class="form-control" id="${elemIdNotes}" rows="2" maxlength="160"></textarea>
        </div>
        
        <!-- 7. Staff -->
        <div class="form-group-select">
            <label for="${elemIdStaff}" class="form-label">
                Staff Member <span class="entries-count" id=${elemIdStaffCount}></span>
            </label>
            
            <div class="input-group" >
                <select class="form-select" id="${elemIdStaff}">
                    <option value="-1" selected disabled>No Entries</option>
                </select>
                <button class="btn" type="button" id="${elemIdStaffAdd}">
                    <i class="bi bi-plus"></i> New
                </button>
            </div>
            
            <div class="invalid-feedback">
                Need to select if not done by you.
            </div>
            
            <!-- Done by Me Checkbox -->
            <div id="doneByMeContainer" class="checkbox-group">
                <input type="checkbox" id="${elemIdChkDoneByMe}">
                <label for="${elemIdChkDoneByMe}" class="checkbox-label">
                    <i class="fas fa-user-check checkbox-icon"></i>
                    Done by Me
                </label>
            </div>
            
            <div class="form-text">Who did the operation.</div>
        
        </div>
        
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
        $('#'+elemIdDateMating).datepicker({
            format: 'MM d, yyyy',  // This gives "January 31, 2026"
            autoclose: true,
            orientation: 'bottom',
            endDate: new Date() // Max date is today
        }).on('show', function(e) {
            $('.datepicker').addClass('datepicker-material');
        });
        
        
        this.setElemStaff(elemStaff, elemStaffCount);
        
        
        this.setDataSowList([]);
        this.setDataBoarList([]);
        this.setDataSemenSupplierList([]);
        this.setDataStaffList([]);
        
    }
    
    
    this._bindEventListeners = function(){
        
        elemSow.addEventListener('change', function(){
            thisObj._onChangeSow();
        });
        
        
        elemSowAdd.addEventListener('click', function() {
            // Should open SowBoarAddEdit page.
            // after success add or cancel/close should go back to this page
            
            const options_sow_boar ={
                is_add:         true,
                is_sow:         true,
                go_back_page:   elemDivContainer   // Go back to this page
            }
            
            
            const callback = function(new_sow_boar_hid){
                const cur_sow = thisObj.getDataSow(new_sow_boar_hid);
                
                if (cur_sow == null){return;}
                if (cur_sow.is_production_ready == 0){return;}
                
                elemSow.value = new_sow_boar_hid;
            };
            
            navigation.pageSowBoarAddEdit.beforeShow(options_sow_boar);
            navigation.pageSowBoarAddEdit.callbackOnSuccessAdd = callback;
            
            const next_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_ADD_EDIT);
            navigation.showThisPage(next_page)
        });
        
        
        elemBoarAdd.addEventListener('click', function() {
            // Should open SowBoarAddEdit page.
            // after success add or cancel/close should go back to this page
            
            const options_sow_boar ={
                is_add:         true,
                is_sow:         false,
                go_back_page:   elemDivContainer   // Go back to this page
            }
            
                
            const callback = function(new_sow_boar_hid){
                const cur_boar = thisObj.getDataBoar(new_sow_boar_hid);
                
                if (cur_boar == null){return;}
                if (cur_boar.is_production_ready == 0){return;}
                
                elemBoar.value = new_sow_boar_hid;
            };
            
            navigation.pageSowBoarAddEdit.beforeShow(options_sow_boar);
            navigation.pageSowBoarAddEdit.callbackOnSuccessAdd = callback;
            
            const next_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_ADD_EDIT);
            navigation.showThisPage(next_page)
        });
        
        
        elemInsemType.addEventListener('change', function() {
            const selected_value = elemInsemType.value;
            
            switch (selected_value) {
                case 'boar-mating': {
                    elemBoarShow.style.display = 'block';
                    elemAiShow.style.display = 'none';
                    elemBoarInternalShow.style.display = 'none';
                    break;
                }
                
                case 'ai-external': {
                    elemBoarShow.style.display = 'none';
                    elemAiShow.style.display = 'block';
                    elemBoarInternalShow.style.display = 'none';
                    break;
                }
                
                case 'ai-internal': {
                    elemBoarShow.style.display = 'none';
                    elemAiShow.style.display = 'none';
                    elemBoarInternalShow.style.display = 'block';
                    break;
                }
            }
        });
        
        
        elemOtherCost.addEventListener('blur', function() {
            thisObj._validateAfterChangeInput(this, 'other_cost');
        });
         
        
        elemNotes.addEventListener('input', function(){
            thisObj.updateCharCounter(elemNotes, elemNotesCharCounter, 
                160);
            
            elemNotes.classList.remove('is-invalid');
        });
        
        
        elemChkDoneByMe.addEventListener('change', function(event) {
            if (event.currentTarget.checked) {
                elemStaff.style.display = 'none';
            } else {
                elemStaff.style.display = 'block';
            }
        });
        
        
        elemBtnClose.addEventListener('click', function() {
            navigation._onClickNavProdGestaLacta(null, PIG_OPERATION_TYPE.GESTATING);
        });
        
        elemBtnCancel.addEventListener('click', function() {
            navigation._onClickNavProdGestaLacta(null, PIG_OPERATION_TYPE.GESTATING);
        });
        
        
        elemBtnSave.addEventListener('click', function() {
            thisObj.onClickSaveButton();
        });
        
        
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
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown)
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
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown)
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