// January 2, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../../common/page_view_basic.js';

import {SOW_STATUS,
        PIG_OPERATION_TYPE}     from '../../../constants.js';

import {InsemDataSelect}        from './insem_data_select.js';




ProdEntryInsem.prototype = new PageViewBasic();
export function ProdEntryInsem(input_settings){
    PageViewBasic.call(this);
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    
    /*
    Typical settings = {
        parentObj:              this,
    };
    */
    const settings              = input_settings;

    const MAXCHAR_INSEM_NOTES   = 160;
    
    
    var elemIdContentContainer  = null;
        
    var elemIdCannotUpdate      = null;
    
    var elemIdSow               = null;
    var elemIdDateMatingWarning = null;
    var elemIdDateMating        = null;
    var elemIdInsemType         = null;
    
    var elemIdBoarShow          = null;
    var elemIdBoar              = null;
    var elemIdBoarCount         = null;
    
    var elemIdAiShow            = null;
    var elemIdSemenSupplier     = null;
    var elemIdSemenSupplierCount= null;
    var elemIdSemenType         = null;
    var elemIdSemenTypeCount    = null;
    var elemIdSemenCost         = null;
  
    var elemIdBoarInternalShow  = null;
    var elemIdBoarInternal      = null;
    var elemIdBoarInternalCount = null;
    
    
    var elemIdOtherCost         = null;
    
    var elemIdNotes             = null;
    var elemIdNotesCharCounter  = null;
    
    var elemIdStaff             = null;
    var elemIdStaffCount        = null;
    
    var elemIdBtnSave           = null;
    
    
    var elemContentContainer    = null;
    
    var elemCannotUpdate        = null;
    
    var elemSow                 = null;
    var elemDateMatingWarning   = null;
    var elemDateMating          = null;
    var elemInsemType           = null;
    
    var elemBoarShow            = null;
    var elemBoar                = null;
    var elemBoarCount           = null;
    
    var elemAiShow              = null;
    var elemSemenSupplier       = null;
    var elemSemenSupplierCount  = null;
    var elemSemenType           = null;
    var elemSemenTypeCount      = null;
    var elemSemenCost           = null;
    
    var elemBoarInternalShow    = null;
    var elemBoarInternal        = null;
    var elemBoarInternalCount   = null;
    
    
    var elemOtherCost           = null;
    
    var elemNotes               = null;
    var elemNotesCharCounter    = null;
    
    var elemStaff               = null;
    var elemStaffCount          = null;
    
    var elemBtnSave             = null;
    
    
    var sowList                 = null;
    var boarList                = null;
    var semenSupplierList       = null;
    var staffList               = null; 
    
    const insemDataSelect       = new InsemDataSelect();
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.getHtml = function(){
        
        elemContentContainer    = `pig-prod-insem-content`;
        
        elemIdCannotUpdate      = `pig-prod-insem-cannot-update`;
        
        elemIdSow               = `pig-prod-insem-sow`;
        elemIdDateMatingWarning = `pig-prod-insem-date-mating-warning`;
        elemIdDateMating        = `pig-prod-insem-date-mating`;
        elemIdInsemType         = `pig-prod-insem-insem-type`;
        
        elemIdBoarShow          = `pig-prod-insem-select-boar-show`;
        elemIdBoar              = `pig-prod-insem-select-boar`;
        elemIdBoarCount         = `pig-prod-insem-select-boar-count`;
        
        
        elemIdAiShow            = `pig-prod-insem-select-ai-show`;
        elemIdSemenSupplier     = `pig-prod-insem-select-semen-supplier`;
        elemIdSemenSupplierCount= `pig-prod-insem-select-semen-supplier-count`;
        elemIdSemenType         = `pig-prod-insem-select-semen-type`;
        elemIdSemenTypeCount    = `pig-prod-insem-select-semen-type-count`;
        elemIdSemenCost         = `pig-prod-insem-semen-cost`;
        
        elemIdBoarInternalShow  = `pig-prod-insem-boar-internal-show`;
        elemIdBoarInternal      = `pig-prod-insem-boar-internal`;
        elemIdBoarInternalCount = `pig-prod-insem-boar-internal-count`;
        
        elemIdOtherCost         = `pig-prod-insem-other-cost`;
        
        elemIdNotes             = `pig-prod-insem-notes`;
        elemIdNotesCharCounter  = `pig-prod-insem-notes-char-counter`;
        
        elemIdStaff             = `pig-prod-insem-staff`;
        elemIdStaffCount        = `pig-prod-insem-staff-count`;
        
        elemIdBtnSave           = `pig-prod-insem-save`;
        
        
        
        
        const html = `
<div class="modal-body" id="${elemContentContainer}">
    <h2 class="tab-title">
        Insemination Information
    </h2>
    
    <div class="warning-box" id="${elemIdCannotUpdate}" style="margin-bottom:8px;">
        Gestating info of a production entry that is already in 
        <b>Lactating Stage</b> cannot be updated.
    </div>
    
    <!-- 1. Sow Field cannot be edited. -->
    <div class="form-group-text">
        <label class="form-label">Sow Name</label>
        <span class="" id="${elemIdSow}"></span>
    </div>
    
    <!-- 2. Date Mating -->
    <div class="form-group-date">
        <div class="warning-box" id="${elemIdDateMatingWarning}" style="display: none;">
            Changing the Date Mating will recalculate <b>Gestating Operations</b>
            scheduled for this entry.
        </div>
        <label for="${elemIdDateMating}" class="form-label">Date Mating</label>
        <input type="text" class="form-control" id="${elemIdDateMating}">
        <div class="invalid-feedback">
            Please enter a valid date.
        </div>
        
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
    
    <!-- Boar Mating Section -->
    <div class="form-group-select" id="${elemIdBoarShow}">
        <label for="${elemIdBoar}" class="form-label">
            Select Boar <span class="entries-count" id=${elemIdBoarCount}></span>
        </label>
        <select class="form-select" id="${elemIdBoar}">
            <option value="" selected disabled>Select...</option>
        </select>
    </div>
    
    <div id="${elemIdAiShow}" class="ai-section" style="display: none;">
        <!-- 1. Semen Supplier -->
        <div class="form-group-select">
            <label for="${elemIdSemenSupplier}" class="form-label">
                Semen Supplier <span class="entries-count" id=${elemIdSemenSupplierCount}></span>
            </label>
            
            <select class="form-select" id="${elemIdSemenSupplier}">
                <option value="-1" selected disabled>No Entries</option>
            </select>
            
        </div>
        
        <!-- 2. Semen Type -->
        <div class="form-group-select">
            <label for="${elemIdSemenType}" class="form-label">
                Semen Type <span class="entries-count" id=${elemIdSemenTypeCount}></span>
            </label>
        
            <select class="form-select" id="${elemIdSemenType}">
                <option value="-1" selected disabled>No Entries</option>
            </select>
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
            Boar where Semen extracted <span class="entries-count" id=${elemIdBoarInternalCount}></span>
        </label>
        
        <select class="form-select" id="${elemIdBoarInternal}">
            <option value="-1" selected disabled>No Entries</option>
        </select>
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
            <span id="${elemIdNotesCharCounter}" class="char-counter">0/${MAXCHAR_INSEM_NOTES}</span>
        </label>
        
        <textarea class="form-control" id="${elemIdNotes}" rows="2" maxlength="${MAXCHAR_INSEM_NOTES}"></textarea>
    </div>
    
    <div class="form-group-select">
        <label for="${elemIdStaff}" class="form-label">
            Staff Member <span class="entries-count" id=${elemIdStaffCount}></span>
        </label>
            
        <select class="form-select" id="${elemIdStaff}">
            <option value="-1" selected disabled>No Entries</option>
        </select>
        
        <div class="form-text">Who did the operation.</div>
        
    </div>
    
    <button class="btn btn-primary" id="${elemIdBtnSave}">Save Changes</button>

</div>
        `;
        
        return html
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        
        elemContentContainer    = document.getElementById(elemIdContentContainer);
        
        elemCannotUpdate        = document.getElementById(elemIdCannotUpdate);
        
        elemSow                 = document.getElementById(elemIdSow);
        elemDateMatingWarning   = document.getElementById(elemIdDateMatingWarning);
        elemDateMating          = document.getElementById(elemIdDateMating);
        elemInsemType           = document.getElementById(elemIdInsemType);
        
        elemBoarShow            = document.getElementById(elemIdBoarShow);
        elemBoar                = document.getElementById(elemIdBoar);
        elemBoarCount           = document.getElementById(elemIdBoarCount);
        
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
    }
    
    
    this._bindEventListeners = function(){
        elemInsemType.addEventListener('change', thisObj.onChangeInsemType);
        
        
        elemOtherCost.addEventListener('blur', function() {
            thisObj._validateAfterChangeInput(this, 'other_cost');
        });
        
        
        
        elemNotes.addEventListener('input', function(){
            thisObj.updateCharCounter(elemNotes, elemNotesCharCounter, 
                MAXCHAR_INSEM_NOTES);
            
            elemNotes.classList.remove('is-invalid');
        });
        
        
        elemBtnSave.addEventListener('click', function() {
            navigation._onClickNavProdGestaLacta(null, PIG_OPERATION_TYPE.GESTATING);
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
        
        elemBoarCount.textContent   = ` (${boarList.length} entries)`;
        elemBoarInternalCount.textContent= ` (${boarList.length} entries)`;
    }
    
    
    this.setDataSemenSupplierList = function(data){
        semenSupplierList = data;
        insemDataSelect.setDataSemenSupplierList(semenSupplierList, elemSemenSupplier);
    
        elemSemenSupplierCount.textContent   = ` (${semenSupplierList.length} entries)`;
    }
    
    
    this.setDataStaffList = function(data){
        staffList = data;
        insemDataSelect.setDataStaffList(staffList, elemStaff);
    
        elemStaffCount.textContent      = ` (${staffList.length} entries)`;
    }
    
    
    this.show = function(data_pig_prod, options){
        const data_sow = data_pig_prod.sow;
        var sow_reference = '';
        
        if ((data_sow.name != null) && (data_sow.name.length >0)){
            sow_reference = data_sow.name;
            
            if (data_sow.number != null) {
                sow_reference += ` (${data_sow.number})`;
            }
            
        }
        else{
            sow_reference = data_sow.number;
        }
        
        
        elemSow.textContent = sow_reference;
        
        
        
        const insemination  = data_pig_prod.insemination;
        
        const dt_insem      = new Date(insemination.insem_date);
        const $elemDateMating = $(elemDateMating);
        $elemDateMating.datepicker('setDate', dt_insem);
        
        
        
        
        // Set insemination type
        switch (insemination.insem_type){
            case 'B':{
                elemInsemType.value = 'boar-mating';
                thisObj.onChangeInsemType();
                
                elemBoar.value = insemination.boar.hid;
                
                break;
            }
            
            case 'AI_X':{
                elemInsemType.value = 'ai-external';
                thisObj.onChangeInsemType();
                
                break;
            }
            
            case 'AI_N':{
                elemInsemType.value = 'ai-internal';
                thisObj.onChangeInsemType();
                
                break;
            }
        }
        
        
        // Set Insemination Cost
        if (insemination.insem_cost != null){
            elemOtherCost.textContent = thisOj.moneyFormatter(insemination.insem_cost); 
        }
        
        
        // Set Insemination Notes
        if (insemination.insem_notes != null){
            elemNotes.textContent = insemination.insem_notes;
            
            // Update char counter
            // Initialize char counters
            thisObj.updateCharCounter(elemNotes, elemNotesCharCounter, 
                MAXCHAR_INSEM_NOTES);
        }
        
        
        // Set Staff
        const $elemStaff        = $(elemStaff);
        $elemStaff.val(insemination.insem_staff_hid).change();
        
        
        if (options.is_read_only){
            elemCannotUpdate.style.display = 'block';
            
            elemDateMatingWarning.style.display = 'none'; 
            elemDateMating.disabled = true;
            elemInsemType.disabled = true;
            
            elemBoar.disabled = true;
            
            elemSemenSupplier.disabled = true;
            elemSemenType.disabled = true;
            elemSemenCost.disabled = true;
            
            elemBoarInternal.disabled = true;
            
            elemOtherCost.disabled = true;
            
            elemNotes.disabled = true;
            
            elemStaff.disabled = true;
             
            elemBtnSave.style.display = 'none';
            
        }
        
        else{
            elemCannotUpdate.style.display = 'none';
            
            elemDateMatingWarning.style.display = 'block'; 
            elemDateMating.disabled = false;
            elemInsemType.disabled = false;
            
            elemBoar.disabled = false;
            
            elemSemenSupplier.disabled = false;
            elemSemenType.disabled = false;
            elemSemenCost.disabled = false;
            
            elemBoarInternal.disabled = false;
            
            elemOtherCost.disabled = false;
            
            elemNotes.disabled = false;
            
            elemStaff.disabled = false;
             
            elemBtnSave.style.display = 'block';
        }
        
    }
    
    
    this.onChangeInsemType = function(){
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
    }
    

}