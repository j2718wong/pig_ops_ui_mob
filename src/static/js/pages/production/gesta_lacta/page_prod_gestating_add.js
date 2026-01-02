// December 23, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../../common/page_view_basic.js';

import {SOW_STATUS,
        PIG_OPERATION_TYPE}     from '../../../constants.js';

import {InsemDataSelect}        from './insem_data_select.js';
//import {AddModalSowBoar}        from './add_modal_sow.js';


import {ModelPigProduction}     from '../../../models/model_pig_production.js'

import {FIELD_VALIDATION_OK}    from '../../../models/model_basic.js'



PageProdGestatingAdd.prototype = new PageViewBasic();
export function PageProdGestatingAdd(input_settings){
    PageViewBasic.call(this);
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    
    
    /*
    Typical settings = {
        parentObj:              this
    };
    */
    const settings              = input_settings;

    
    const settingsAddSow        = {
        parentObj:              this,
        isAddSow:               true,
        elemIdDivModal:         `div-add-entry-sow-modal`
    };
    //const addModalSow           = new AddModalSowBoar(settingsAddSow);
    
    
    const settingsAddBoar       = {
        parentObj:              this,
        isAddSow:               false,
        elemIdDivModal:         `div-add-entry-boar-modal`
    };
    //const addModalBoar          = new AddModalSowBoar(settingsAddBoar);
    
    const elemDivContainer      = document.getElementById('container-prod-gesta-add');
        
        
    var elemIdBtnClose          = null;
    
    var elemIdSow               = null;
    var elemIdSowStatusShow     = null;
    var elemIdSowLastInsem      = null;
    var elemIdSowLastPid        = null;
    var elemIdDateMating        = null;
    var elemIdInsemType         = null;
    
    var elemIdBoarShow          = null;
    var elemIdBoar              = null;
    
    var elemIdAiShow            = null;
    var elemIdSemenSupplier     = null;
    var elemIdSemenType         = null;
    var elemIdSemenCost         = null;
  
    var elemIdBoarInternalShow  = null;
    var elemIdBoarInternal      = null;
    
    
    var elemIdOtherCost         = null;
    
    var elemIdNotes             = null;
    var elemIdNotesCharCounter  = null;
    
    var elemIdStaff             = null;
    var elemIdChkDoneByMe       = null;
    
    
    var elemIdBtnCancel         = null;
    var elemIdBtnSave           = null;
    
    
    var elemBtnClose            = null;
    
    var elemSow                 = null;
    var elemSowStatusShow       = null;
    var elemSowLastInsem        = null;
    var elemSowLastPid          = null;
    var elemDateMating          = null;
    var elemInsemType           = null;
    
    var elemBoarShow            = null;
    var elemBoar                = null;
    
    var elemBoarInternalShow    = null;
    var elemBoarInternal        = null;
    
    var elemAiShow              = null;
    var elemSemenSupplier       = null;
    var elemNoSemenType         = null;
    var elemSemenType           = null;
    var elemSemenCostCurSymbol  = null;
    var elemSemenCost           = null;
    
    var elemOtherCurSymbol      = null;
    var elemOtherCost           = null;
    
    var elemNotes               = null;
    var elemNotesCharCounter    = null;
    
    var elemStaff               = null;
    var elemChkDoneByMe         = null;
    
    var elemBtnCancel           = null;
    var elemBtnSave             = null;
    
    
    var sowList                 = null;
    var boarList                = null;
    var semenSupplierList       = null;
    var staffList               = null; 
    
    
    var newEntry                = new ModelPigProduction();
    
    const insemDataSelect       = new InsemDataSelect();
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdBtnClose          = `pig-prod-add-select-close`;
        
        elemIdSow               = `pig-prod-add-select-sow`;
        elemIdSowStatusShow     = `pig-prod-add-sow-status-show`;
        elemIdSowLastInsem      = `pig-prod-add-sow-last-insem`;
        elemIdSowLastPid        = `pig-prod-add-sow-last-pid`;
        elemIdDateMating        = `pig-prod-add-date-mating`;
        elemIdInsemType         = `pig-prod-add-insem-type`;
        
        elemIdBoarShow          = `pig-prod-add-select-boar-show`;
        elemIdBoar              = `pig-prod-add-select-boar`;
        
        
        elemIdAiShow            = `pig-prod-add-select-ai-show`;
        elemIdSemenSupplier     = `pig-prod-add-select-semen-supplier`;
        elemIdSemenType         = `pig-prod-add-select-semen-type`;
        elemIdSemenCost         = `pig-prod-add-semen-cost`;
        
        elemIdBoarInternalShow  = `pig-prod-add-boar-internal-show`;
        elemIdBoarInternal      = `pig-prod-add-boar-internal`;
        
        elemIdOtherCost         = `pig-prod-add-other-cost`;
        
        elemIdNotes             = `pig-prod-add-notes`;
        elemIdNotesCharCounter  = `pig-prod-add-notes-char-counter`;
        
        elemIdStaff             = `pig-prod-add-staff`;
        elemIdChkDoneByMe       = `pig-prod-add-done-by-me'`;
        
        elemIdBtnCancel         = `pig-prod-add-cancel`;
        elemIdBtnSave           = `pig-prod-add-save`;
        
        
        //const html_add_modal_sow    = addModalSow.getHtml();
        //const html_add_modal_boar   = addModalBoar.getHtml();
        
        
        
        const html =`

        
<div class="form-container">

    <div class="modal-header gestating">
        <h5 class="modal-title" id="add-entry-acc-pig-ops-modal-label">
            <i class="fas fa-plus me-2"></i><span>Add Prod Gestating</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    
    <div class="modal-body">
        
        <!-- 1. Sow Field with Combined Warning -->
        <div class="form-group-select">
            <label for="${elemIdSow}" class="form-label">
                Select Sow
            </label>
                        
            <div class="input-group" id="sowSelectGroup">
                <select class="form-select" id="${elemIdSow}">
                    <option value="-1" selected disabled>No Entries</option>
                </select>
                <button class="btn" type="button" data-bs-toggle="modal" data-bs-target="#${settingsAddSow.elemIdDivModal}">
                    <i class="bi bi-plus"></i> New
                </button>
            </div>
            
            <!-- Combined Breeding Status Warning -->
            <div id="${elemIdSowStatusShow}" class="breeding-status-warning" style="display: none;">
                <div class="warning-header">
                    <i class="bi bi-exclamation-triangle"></i>
                    <span>Sow Already Bred</span>
                </div>
                <div class="warning-details">
                    <span>
                        This sow was last bred on <span id="${elemIdSowLastInsem}">Jan 15, 2024</span>
                        with production <b>PID: <span id="${elemIdSowLastPid}">20</span></b>. 
                        If this new entry will be saved, the previous gestating production  
                        entry will be marked as <b>Not Pregnant</b> and will
                        be removed from the Gestating Production List.
                        
                        Please ensure this is an intentional breeding due to sow reheat.
                    </span>
                </div>
            </div>
        </div>
            
        
        <!-- 2. Date Mating -->
        <div class="form-group-date">
            <label for="${elemIdDateMating}" class="form-label">
                Date Mating or Insemination
            </label>
            <input type="text" class="form-control" id="${elemIdDateMating}" required>
        </div>
        
        
        <!-- 3. Insemination Type -->
        <div class="form-group-select">
            <label for="${elemIdInsemType}" class="form-label">
                Insemination Type
            </label>
                        
            <select class="form-select" id="${elemIdInsemType}" required>
                <option value="boar-mating" selected>Boar Mating</option>
                <option value="ai-external">Artificial Insem External</option>
                <option value="ai-internal">Artificial Insem Internal</option>
            </select>
        </div>
        
        <!-- 4. Boar Field -->
        <div class="form-group-select" id="${elemIdBoarShow}">
            <label for="${elemIdBoar}" class="form-label">
                Select Boar
            </label>
            
            <div class="input-group" id="boarSelectGroup">
                <select class="form-select" id="${elemIdBoar}">
                    <option value="-1" selected disabled>No Entries</option>
                </select>
                <button class="btn" type="button" data-bs-toggle="modal" data-bs-target="#${settingsAddBoar.elemIdDivModal}">
                    <i class="bi bi-plus"></i> New
                </button>
            </div>
        </div>
        
        <div id="${elemIdAiShow}" class="ai-section" style="display: none;">
            <!-- 1. Semen Supplier -->
            <div class="form-group-select">
                <label for="${elemIdSemenSupplier}" class="form-label">
                    Semen Supplier
                </label>
                
                <div class="input-group" id="supplierSelectGroup">
                    <select class="form-select" id="${elemIdSemenSupplier}">
                        <option value="-1" selected disabled>No Entries</option>
                    </select>
                    <button class="btn" type="button" data-bs-toggle="modal" data-bs-target="#newSupplierModal">
                        <i class="bi bi-plus"></i> New
                    </button>
                </div>
            </div>
            
            <!-- 2. Semen Type -->
            <div class="form-group-select">
                <label for="${elemIdSemenType}" class="form-label">
                    Semen Type
                </label>
            
                <div class="input-group" id="semenTypeSelectGroup">
                    <select class="form-select" id="${elemIdSemenType}">
                        <option value="-1" selected disabled>No Entries</option>
                    </select>
                    <button class="btn" type="button" data-bs-toggle="modal" data-bs-target="#newSemenTypeModal">
                        <i class="bi bi-plus"></i> New
                    </button>
                </div>
            </div>
            
            <!-- 3. Semen Cost -->
            <div class="form-group-number">
                <label for="${elemIdSemenCost}" class="form-label">
                    Semen Cost
                </label>
                
                <input type="number" class="form-control" id="${elemIdSemenCost}" placeholder="0.00" step="0.1" min="0" value="0.00">
                <div class="invalid-feedback">
					Please enter numeric value.
				</div>
            </div>
        </div>
        
        
        <div class="form-group-select" id="${elemIdBoarInternalShow}" style="display: none;">
            <label for="${elemIdBoarInternal}" class="form-label">
                Boar where Semen extracted 
            </label>
            
            <div class="input-group" id="boarSelectGroup">
                <select class="form-select" id="${elemIdBoarInternal}">
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
                Staff Member
            </label>
            
            <select id="${elemIdStaff}" class="form-select">
                <option value="-1" selected disabled>No Entries</option>
            </select>
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
        elemSowStatusShow       = document.getElementById(elemIdSowStatusShow);
        elemSowLastInsem        = document.getElementById(elemIdSowLastInsem);
        elemSowLastPid          = document.getElementById(elemIdSowLastPid);
        elemDateMating          = document.getElementById(elemIdDateMating);
        elemInsemType           = document.getElementById(elemIdInsemType);
        
        elemBoarShow            = document.getElementById(elemIdBoarShow);
        elemBoar                = document.getElementById(elemIdBoar);
        
        elemAiShow              = document.getElementById(elemIdAiShow);
        elemSemenSupplier       = document.getElementById(elemIdSemenSupplier);
        elemSemenType           = document.getElementById(elemIdSemenType);
        elemSemenCost           = document.getElementById(elemIdSemenCost);
        
        elemBoarInternalShow    = document.getElementById(elemIdBoarInternalShow);
        elemBoarInternal        = document.getElementById(elemIdBoarInternal);
        
        
        elemOtherCost           = document.getElementById(elemIdOtherCost);
        
        elemNotes               = document.getElementById(elemIdNotes);
        elemNotesCharCounter    = document.getElementById(elemIdNotesCharCounter);
        
        elemStaff               = document.getElementById(elemIdStaff);
        elemChkDoneByMe         = document.getElementById(elemIdChkDoneByMe);
            
        elemBtnCancel           = document.getElementById(elemIdBtnCancel);
        elemBtnSave             = document.getElementById(elemIdBtnSave);
    }
    
    
    this._processAfterHtmlRender = function(){
        $('#'+elemIdDateMating).datepicker({
            format: 'MM d, yyyy',  // This gives "January 31, 2026"
            autoclose: true,
            endDate: new Date() // Max date is today
        }).on('show', function(e) {
            $('.datepicker').addClass('datepicker-material');
        });
        
        
        this.setDataSowList([]);
        this.setDataBoarList([]);
        this.setDataSemenSupplierList([]);
        this.setDataStaffList([]);
        
        //addModalSow.afterHtmlRender();
        //addModalBoar.afterHtmlRender();
    }
    
    
    this._bindEventListeners = function(){
        
        elemSow.addEventListener('change', function(){
            thisObj._onChangeSow();
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
        
        
        elemBtnClose.addEventListener('click', function() {
            parentObj._onClickNavProdGestaLacta(null, PIG_OPERATION_TYPE.GESTATING);
        });
        
        elemBtnCancel.addEventListener('click', function() {
            parentObj._onClickNavProdGestaLacta(null, PIG_OPERATION_TYPE.GESTATING);
        });
    }
    
    
    this.setDataSowList = function(data){
        sowList = data;
        insemDataSelect.setDataSowList(sowList, elemSow);
    }
    
    
    this.setDataBoarList = function(data){
        boarList = data;
        insemDataSelect.setDataBoarList(boarList, elemBoar);
        insemDataSelect.setDataBoarList(boarList, elemBoarInternal);
    }
    
    
    this.setDataSemenSupplierList = function(data){
        semenSupplierList = data;
        insemDataSelect.setDataSemenSupplierList(semenSupplierList, elemSemenSupplier);
    }
    
    
    this.setDataStaffList = function(data){
        staffList = data;
        insemDataSelect.setDataStaffList(staffList, elemStaff);
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
        
        console.log('PageAddGestating show');
    }
    
    
    this._onChangeSow = function(){
        var sow_hid       = elemSow.value;
        
        var index;
        var cur_entry;
        
        var gestating_sow = null;
        
        elemSowStatusShow.style.display = 'none';
        
        for(index = 0; index < sowList.length; index++){
            cur_entry = sowList[index];
            if ('sow_boar' in cur_entry){
                cur_entry = cur_entry.sow_boar;
            }
            
            if (cur_entry.hid == sow_hid){
                if (cur_entry.status_id == SOW_STATUS.GESTATING){
                    elemSowLastInsem.innerHTML  = cur_entry.date_insemination;
                    elemSowLastPid.innerHTML    = cur_entry.last_prod_id;  
                    
                    
                    elemSowStatusShow.style.display = 'block';
                }
                break;
            }
        }
    }
    
    
    this._validateAfterChangeInput = function(ev, input_field){
        /* Use this to validate new entry form input.*/
    
        var input_elem  = null;
        var input_val   = null;
        var cur_field   = null;
        var validation  = null;
		
		console.log('TEs1 ');
        
        if (ev.checkValidity()) {
            switch(input_field){
            
                case 'date_mating': {
                    input_elem  	= elemDateMating;
                    input_val   	= input_elem.value;
                    cur_field   	= newEntry.fieldInsemDate;
                    
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
                    input_val   = input_elem.val() || null;
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
}   