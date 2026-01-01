// December 23, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../../common/page_view_basic.js';

import {SOW_STATUS,
        PIG_OPERATION_TYPE}     from '../../../constants.js';

//import {AddModalSowBoar}        from './add_modal_sow.js';



pageProdGestatingAdd.prototype = new PageViewBasic();
export function pageProdGestatingAdd(input_settings){
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
        
        
    var elemIdBtnClose         	= null;
    
    var elemIdSelectSow         = null;
    var elemIdSowStatusShow     = null;
    var elemIdSowLastInsem      = null;
    var elemIdSowLastPid        = null;
    var elemIdInsemType         = null;
    var elemIdDateMating        = null;
    
    var elemIdSelectBoarShow    = null;
    var elemIdSelectBoar        = null;
    
    var elemIdAiShow            = null;
    var elemIdSemenSupplier     = null;
    var elemIdSemenType         = null;
    var elemIdSemenCostCurSymbol= null;
    var elemIdSemenCost         = null;
  
    
    var elemIdOtherCurSymbol    = null;
    var elemIdOtherCost         = null;
    
    var elemIdNotes             = null;
    var elemIdNotesCharCounter  = null;
    
    var elemIdStaff             = null;
    var elemIdChkDoneByMe       = null;
    
    
    var elemIdBtnCancel         = null;
    var elemIdBtnSave           = null;
    
    
    var elemBtnClose            = null;
    
    var elemSelectSow           = null;
    var elemSowStatusShow       = null;
    var elemSowLastInsem        = null;
    var elemSowLastPid          = null;
    var elemInsemType           = null;
    var elemDateMating          = null;
    
    var elemSelectBoarShow      = null;
    var elemSelectBoar          = null;
    
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
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdBtnClose             = `pig-prod-add-select-close`;
        
        elemIdSelectSow         = `pig-prod-add-select-sow`;
        elemIdSowStatusShow     = `pig-prod-add-sow-status-show`;
        elemIdSowLastInsem      = `pig-prod-add-sow-last-insem`;
        elemIdSowLastPid        = `pig-prod-add-sow-last-pid`;
        elemIdInsemType         = `pig-prod-add-insem-type`;
        elemIdDateMating        = `pig-prod-add-date-mating`;
        
        elemIdSelectBoarShow    = `pig-prod-add-select-boar-show`;
        elemIdSelectBoar        = `pig-prod-add-select-boar`;
        
        
        elemIdAiShow            = `pig-prod-add-select-ai-show`;
        elemIdSemenSupplier     = `pig-prod-add-select-semen-supplier`;
        elemIdSemenType         = `pig-prod-add-select-semen-type`;
        elemIdSemenCostCurSymbol= `pig-prod-add-semen-cost-cur-symbol`;
        elemIdSemenCost         = `pig-prod-add-semen-cost`;
        
        
        elemIdOtherCurSymbol    = `pig-prod-add-other-cost-cur-symbol`;
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
            <label for="${elemIdSelectSow}" class="form-label">
                Select Sow
            </label>
                        
            <div class="input-group" id="sowSelectGroup">
                <select class="form-select" id="${elemIdSelectSow}">
                    <option value="" selected disabled>Select Sow...</option>
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
            
        
        <!-- 2. Insemination Type -->
        <div class="form-group-select">
            <label for="${elemIdInsemType}" class="form-label">
                Insemination Type
            </label>
                        
            <select class="form-select" id="${elemIdInsemType}" required>
                <option value="boar-mating" selected>Boar Mating</option>
                <option value="ai-external">Artificial Insemination</option>
            </select>
        </div>
        
        <!-- 3. Date Mating -->
        <div class="form-group-date">
            <label for="${elemIdDateMating}" class="form-label">
                Date Mating or Insemination
            </label>
            <input type="date" class="form-control" id="${elemIdDateMating}" required>
        </div>
        
        <!-- 4. Boar Field -->
        <div class="form-group-select" id="${elemIdSelectBoarShow}">
            <label for="${elemIdSelectSow}" class="form-label">
                Select Boar
            </label>
            
            <div class="input-group" id="boarSelectGroup">
                <select class="form-select" id="${elemIdSelectBoar}">
                    <option value="" selected disabled>Select...</option>
                </select>
                <button class="btn" type="button" data-bs-toggle="modal" data-bs-target="#${settingsAddBoar.elemIdDivModal}">
                    <i class="bi bi-plus"></i> New
                </button>
            </div>
        </div>
        
        <div id="${elemIdAiShow}" class="ai-section" style="display: none;">
            <h5><i class="bi bi-droplet"></i> Artificial Insemination Details</h5>
            
            <!-- 1. Semen Supplier -->
            <div class="form-group-select">
                <label for="${elemIdSemenSupplier}" class="form-label">
                    Semen Supplier
                </label>
                
                <div class="input-group" id="supplierSelectGroup">
                    <select class="form-select" id="${elemIdSemenSupplier}">
                        <option value="" selected disabled>Select supplier...</option>
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
                        <option value="" selected disabled>Select type...</option>
                    </select>
                    <button class="btn" type="button" data-bs-toggle="modal" data-bs-target="#newSemenTypeModal">
                        <i class="bi bi-plus"></i> New
                    </button>
                </div>
            </div>
            
            <!-- 3. Semen Cost -->
            <div class="form-group-number">
                <label for="${elemIdSemenCost}" class="form-label">
                    Semen Type
                </label>
                
                <div class="currency-input-group">
                    <span class="input-group-text" id="${elemIdSemenCostCurSymbol}">$</span>
                    <input type="number" class="form-control" id="${elemIdSemenCost}" placeholder="0.00" step="0.1" min="0" value="0.00">
                </div>
            </div>
        </div>
                
        
        <!-- 5. Other Cost -->
        <div class="form-group-number">
            <label for="${elemIdOtherCost}" class="form-label">
                Other Cost
            </label>
                
            <div class="currency-input-group">
                <span class="input-group-text" id="${elemIdOtherCurSymbol}">$</span>
                <input type="number" class="form-control" id="${elemIdOtherCost}" placeholder="0.00" step="0.1" min="0">
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
                <option value="0" selected disabled>Please Select</option>
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
            <button type="button" class="btn btn-secondary" id="${elemIdBtnCancel}" data-bs-dismiss="modal">
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
        elemBtnClose               = document.getElementById(elemIdBtnClose);
        
        elemSelectSow           = document.getElementById(elemIdSelectSow);
        elemSowStatusShow       = document.getElementById(elemIdSowStatusShow);
        elemSowLastInsem        = document.getElementById(elemIdSowLastInsem);
        elemSowLastPid          = document.getElementById(elemIdSowLastPid);
        elemInsemType           = document.getElementById(elemIdInsemType);
        elemDateMating          = document.getElementById(elemIdDateMating);
        
        elemSelectBoarShow      = document.getElementById(elemIdSelectBoarShow);
        elemSelectBoar          = document.getElementById(elemIdSelectBoar);
        
        elemAiShow              = document.getElementById(elemIdAiShow);
        elemSemenSupplier       = document.getElementById(elemIdSemenSupplier);
        elemSemenType           = document.getElementById(elemIdSemenType);
        elemSemenCostCurSymbol  = document.getElementById(elemIdSemenCostCurSymbol);
        elemSemenCost           = document.getElementById(elemIdSemenCost);
        

        
        elemOtherCurSymbol      = document.getElementById(elemIdOtherCurSymbol);
        elemOtherCost           = document.getElementById(elemIdOtherCost);
        
        elemNotes               = document.getElementById(elemIdNotes);
        elemNotesCharCounter    = document.getElementById(elemIdNotesCharCounter);
        
        elemStaff               = document.getElementById(elemIdStaff);
        elemChkDoneByMe         = document.getElementById(elemIdChkDoneByMe);
            
        elemBtnCancel           = document.getElementById(elemIdBtnCancel);
        elemBtnSave             = document.getElementById(elemIdBtnSave);
    }
    
    
    this._processAfterHtmlRender = function(){
        // Temporary Philippine Peso symbol for currency1
        elemSemenCostCurSymbol.innerHTML    = 'P';
        elemOtherCurSymbol.innerHTML        = 'P';
        
        //addModalSow.afterHtmlRender();
        //addModalBoar.afterHtmlRender();
    }
    
    
    this._bindEventListeners = function(){
        
        elemSelectSow.addEventListener('change', function(){
            thisObj._onChangeSow();
        });
        
        
        elemInsemType.addEventListener('change', function() {
            const selected_value = elemInsemType.value;
            
            switch (selected_value) {
                case 'boar-mating': {
                    elemSelectBoarShow.style.display = 'block';
                    elemAiShow.style.display = 'none';
                    break;
                }
                
                case 'ai-external': {
                    elemSelectBoarShow.style.display = 'none';
                    elemAiShow.style.display = 'block';
                    break;
                }
                
                case 'ai-internal': {
                    break;
                }
            }
        });
        
        
        elemNotes.addEventListener('input', function() {
            const length = this.value.length;
            elemNotesCharCounter.textContent = `${length}/160`;
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
        
        var select_data = [];
        if (sowList.length == 0){
            select_data.push({value:"-1", text:"No Entries"});
            thisObj.replaceSelectOptions(elemSelectSow, select_data);
            return;
        }
        
        
        select_data.push({value:"0", text:"Please Select"});
        
        for (const cur_sow_boar of data){
            var reference;
            
            // This is because there is this data can come into
            // minimum and not minimum info.
            const cur_entry = ('sow_boar' in cur_sow_boar)? cur_sow_boar.sow_boar: cur_sow_boar;
            
            if (cur_entry.status_id == SOW_STATUS.GROWING ||
                cur_entry.status_id == SOW_STATUS.GESTATING ||
                cur_entry.status_id == SOW_STATUS.WEANING) {
            
                if (cur_entry.name != null && cur_entry.name.length > 0){
                    reference = cur_entry.name;
                    
                    if (cur_entry.number != null &&  cur_entry.number.length > 0) {
                        reference +=  ' (' + cur_entry.number + ')';
                    }
                }
                else{
                    reference = cur_entry.number;
                }
                
                select_data.push({value: cur_entry.hid, text: reference});
            }
        }
        
        thisObj.replaceSelectOptions(elemSelectSow, select_data);
    }
    
    
    this.setDataBoarList = function(data){
        boarList = data;
        
        var select_data = [];
        if (boarList.length == 0){
            select_data.push({value:"-1", text:"No Entries"});
            thisObj.replaceSelectOptions(elemSelectBoar, select_data);
            return;
        }
        
        
        select_data.push({value:"0", text:"Please Select"});
        
        for (const cur_sow_boar of data){
            var reference;
            
            // This is because there is this data can come into
            // minimum and not minimum info.
            const cur_entry = ('sow_boar' in cur_sow_boar)? cur_sow_boar.sow_boar: cur_sow_boar;
            
            
            if (cur_entry.name != null && cur_entry.name.length > 0){
                reference = cur_entry.name;
                
                if (cur_entry.number != null &&  cur_entry.number.length > 0) {
                    reference +=  ' (' + cur_entry.number + ')';
                }
            }
            else{
                reference = cur_entry.number;
            }
            
            select_data.push({value: cur_entry.hid, text: reference});
        }
        
        thisObj.replaceSelectOptions(elemSelectBoar, select_data);
        
    }
    
    
    this.setDataSemenSupplierList = function(data){
        semenSupplierList = data;
    }
    
    
    this.setDataStaffList = function(data){
        staffList = data;
        
        var select_data = [];
        if (staffList.length == 0){
            select_data.push({value:"-1", text:"No Entries"});
            thisObj.replaceSelectOptions(elemStaff, select_data);
            return;
        }
        
        
        var select_data = [];
        select_data.push({value:"0", text:"Please Select"});
        
        for (const cur_entry of data){
            select_data.push({value: cur_entry.hid, text: cur_entry.name});
        }
        
        thisObj.replaceSelectOptions(elemStaff, select_data);
    }
    
    
    this.show = function(){
        console.log('PageAddGestating show');
    }
    
    this._onChangeSow = function(){
        var sow_hid       = elemSelectSow.value;
        
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
    
}   