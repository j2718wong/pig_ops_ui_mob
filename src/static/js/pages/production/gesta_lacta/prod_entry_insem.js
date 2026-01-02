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
    
    
    var elemIdSow               = null;
    var elemIdInsemType         = null;
    var elemIdDateMating        = null;
    
    var elemIdBoarShow          = null;
    var elemIdBoar              = null;
    
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
    
    var elemIdBtnSave           = null;
    
    
    var elemBtnClose            = null;
    
    var elemSow                 = null;
    var elemSowStatusShow       = null;
    var elemSowLastInsem        = null;
    var elemSowLastPid          = null;
    var elemInsemType           = null;
    var elemDateMating          = null;
    
    var elemBoarShow            = null;
    var elemBoar                = null;
    
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
        
        elemIdSow               = `pig-prod-insem-select-sow`;
        elemIdInsemType         = `pig-prod-insem-insem-type`;
        elemIdDateMating        = `pig-prod-insem-date-mating`;
        
        elemIdBoarShow          = `pig-prod-insem-select-boar-show`;
        elemIdBoar              = `pig-prod-insem-select-boar`;
        
        
        elemIdAiShow            = `pig-prod-insem-select-ai-show`;
        elemIdSemenSupplier     = `pig-prod-insem-select-semen-supplier`;
        elemIdSemenType         = `pig-prod-insem-select-semen-type`;
        elemIdSemenCostCurSymbol= `pig-prod-insem-semen-cost-cur-symbol`;
        elemIdSemenCost         = `pig-prod-insem-semen-cost`;
        
        
        elemIdOtherCurSymbol    = `pig-prod-insem-other-cost-cur-symbol`;
        elemIdOtherCost         = `pig-prod-insem-other-cost`;
        
        elemIdNotes             = `pig-prod-insem-notes`;
        elemIdNotesCharCounter  = `pig-prod-insem-notes-char-counter`;
        
        elemIdStaff             = `pig-prod-insem-staff`;
        
        elemIdBtnSave           = `pig-prod-insem-save`;
        
        
        
        
        const html = `
<div>
    <h2 style="margin-bottom: 20px; color: var(--corporate-blue);">
        Insemination Information
    </h2>
    
    <div class="form-group-text">
        <label class="form-label">Sow Name</label>
        <span class="" id="${elemIdSow}"></span>
    </div>
    
    <div class="form-group-date">
        <label class="form-label">Date Mating</label>
        <input type="text" class="form-control" id="${elemIdDateMating}">
    
        <div class="warning-box" id="mating-warning" style="display: none;">
            Changing the Date Mating will affect gestation period calculations.
        </div>
    </div>
    
    <div class="form-group-select">
        <label class="form-label">Insemination Type</label>
        <select class="form-select" id="${elemIdInsemType}">
            <option value="boar-mating">Boar Mating</option>
            <option value="ai-external">Artificial Insemination</option>
        </select>
    </div>
    
    <!-- Boar Mating Section (shown by default) -->
    <div class="form-group-select" id="${elemIdBoarShow}">
        <label for="${elemIdBoar}" class="form-label">Select Boar</label>
        <select class="form-select" id="${elemIdBoar}">
            <option value="" selected disabled>Select...</option>
        </select>
    </div>
    
    <!-- Artificial Insemination Section (hidden by default) -->
    <div id="${elemIdAiShow}" class="ai-section" style="display: none;">
        <div class="form-group-select">
            <label for="${elemIdSemenSupplier}" class="form-label">Semen Supplier</label>
            <select class="form-select" id="${elemIdSemenSupplier}">
                <option value="" selected disabled>Select supplier...</option>
            </select>
        </div>
        
        <div class="form-group-select">
            <label for="${elemIdSemenType}" class="form-label">Semen Type</label>
            <select class="form-select" id="${elemIdSemenType}">
            </select>
        </div>
        
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
    
    <div class="form-group-number">
        <label for="${elemIdOtherCost}" class="form-label">
            Other Cost
        </label>
            
        <div class="currency-input-group">
            <span class="input-group-text" id="${elemIdOtherCurSymbol}">$</span>
            <input type="number" class="form-control" id="${elemIdOtherCost}" placeholder="0.00" step="0.1" min="0">
        </div>
    </div>
        
    
    <div class="form-group-text-area">
        <label for="${elemIdNotes}" class="form-label">
            Notes
            <span id="${elemIdNotesCharCounter}" class="char-counter">0/160</span>
        </label>
        
        <textarea class="form-control" id="${elemIdNotes}" rows="2" maxlength="160"></textarea>
    </div>
    
    <div class="form-group-select">
        <label for="${elemIdStaff}" class="form-label">
            Staff Member
        </label>
            
        <select class="form-select" id="${elemIdStaff}">
        </select>
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
        
        elemSow                 = document.getElementById(elemIdSow);
        elemInsemType           = document.getElementById(elemIdInsemType);
        elemDateMating          = document.getElementById(elemIdDateMating);
        
        elemBoarShow            = document.getElementById(elemIdBoarShow);
        elemBoar                = document.getElementById(elemIdBoar);
        
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
        elemInsemType.addEventListener('change', function() {
            const selected_value = elemInsemType.value;
            
            switch (selected_value) {
                case 'boar-mating': {
                    elemBoarShow.style.display = 'block';
                    elemAiShow.style.display = 'none';
                    break;
                }
                
                case 'ai-external': {
                    elemBoarShow.style.display = 'none';
                    elemAiShow.style.display = 'block';
                    break;
                }
                
                case 'ai-internal': {
                    break;
                }
            }
        });
    }
    
    
    this.setDataSowList = function(data){
        sowList = data;
        insemDataSelect.setDataSowList(sowList, elemSow);
    }
    
    
    this.setDataBoarList = function(data){
        boarList = data;
        insemDataSelect.setDataBoarList(boarList, elemBoar);
    }
    
    
    this.setDataSemenSupplierList = function(data){
        semenSupplierList = data;
        insemDataSelect.setDataSemenSupplierList(semenSupplierList, elemSemenSupplier);
    }
    
    
    this.setDataStaffList = function(data){
        staffList = data;
        insemDataSelect.setDataStaffList(staffList, elemStaff);
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
        $('#'+elemIdDateMating).datepicker('setDate', dt_insem);
        
    }
    
    

}