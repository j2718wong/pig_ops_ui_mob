// December 23, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {SOW_STATUS}				from '../../../constants.js';

import {AddModalSowBoar}        from './add_modal_sow.js';




export function AddEntryProdGestating(input_settings){
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    
    
    /*
    Typical settings = {
        parentObj:              this,
        elemUniqueKey:          'gestating'
        elemIdDivContainer:     'div-container-update-entry-gestating-ops'
    };
    */
    const settings              = input_settings;

    
    const settingsAddSow        = {
        parentObj:              this,
        isAddSow:               true,
        elemIdDivModal:         `div-add-entry-${settings.elemUniqueKey}-sow-modal`
    };
    const addModalSow           = new AddModalSowBoar(settingsAddSow);
    
    
    const settingsAddBoar       = {
        parentObj:              this,
        isAddSow:               false,
        elemIdDivModal:         `div-add-entry-${settings.elemUniqueKey}-boar-modal`
    };
    const addModalBoar          = new AddModalSowBoar(settingsAddBoar);
    
    
    var elemIdSelectSow         = null;
    var elemIdSowStatusShow     = null;
    var elemIdSowLastInsem      = null;
	var elemIdSowLastPid  		= null;
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
    
    var elemIdSelectStaff       = null;
    
    var elemIdBtnCancel         = null;
    var elemIdBtnSave           = null;
    
    
    var elemSelectSow           = null;
    var elemSowStatusShow       = null;
    var elemSowLastInsem      	= null;
	var elemSowLastPid  		= null;
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
    
    var elemSelectStaff         = null;
    
    var elemBtnCancel           = null;
    var elemBtnSave             = null;
    
    
    var sowList                 = null;
    var boarList                = null;
    var semenSupplierList       = null;
    
    var staffList               = null; 
    
    
    this._writeInlineStyle = function(){
        return `
    <style>
        :root {
            --primary-color: #4a6fa5;
            --accent-color: #ff9a76;
            --warning-color: #ff9800;
            --danger-color: #dc3545;
        }
        
        body {
            background: #f5f7fa;
            font-family: 'Segoe UI', system-ui, sans-serif;
            padding: 8px;
        }
        
        .form-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .form-header {
            background: linear-gradient(135deg, var(--primary-color), #6b8cbc);
            color: white;
            padding: 16px;
            text-align: center;
        }
        
        .form-header h1 {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 0;
        }
        
        .form-header .subtitle {
            font-size: 0.85rem;
            opacity: 0.9;
            margin-top: 4px;
        }
        
        .form-body {
            padding: 16px;
        }
        
        .form-section {
            margin-bottom: 20px;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 3px solid var(--primary-color);
        }
        
        .section-title {
            color: var(--primary-color);
            font-weight: 600;
            margin-bottom: 12px;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .form-label {
            font-weight: 600;
            color: #495057;
            margin-bottom: 6px;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        /* Highlight already bred sows in select */
        .already-bred {
            background-color: #fff8e1 !important;
            color: #856404 !important;
            font-weight: 500;
            position: relative;
        }
        
        .already-bred::after {
            content: "⚠️";
            position: absolute;
            right: 10px;
            font-size: 0.9rem;
        }
        
        .form-control, .form-select {
            border: 1px solid #ddd;
            border-radius: 6px;
            padding: 10px;
            font-size: 0.95rem;
            margin-bottom: 8px;
        }
        
        .form-control:focus, .form-select:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 2px rgba(74, 111, 165, 0.2);
        }
        
        /* Input group fixes */
        .input-group {
            border-radius: 6px;
            overflow: hidden;
        }
        
        .input-group > .form-select {
            flex: 1;
            border-radius: 6px 0 0 6px;
            margin: 0;
            border-right: 0;
        }
        
        .input-group > .form-control {
            border-radius: 6px 0 0 6px;
            margin: 0;
        }
        
        .input-group > .btn {
            border-radius: 0 6px 6px 0;
            background: var(--primary-color);
            border-color: var(--primary-color);
            color: white;
            font-size: 0.9rem;
            padding: 10px 12px;
            white-space: nowrap;
            min-width: 60px;
        }
        
        /* Currency input group */
        .currency-input-group {
            display: flex;
            align-items: stretch;
            border-radius: 6px;
            overflow: hidden;
        }
        
        .currency-input-group .input-group-text {
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            border-right: none;
            padding: 10px 12px;
            font-weight: 500;
            color: #495057;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 40px;
        }
        
        .currency-input-group .form-control {
            flex: 1;
            border-radius: 0 6px 6px 0;
            margin: 0;
            border-left: 0;
        }
        
        .char-counter {
            font-size: 0.8rem;
            color: #6c757d;
            text-align: right;
            margin-top: 3px;
        }
        
        .empty-state {
            text-align: center;
            padding: 20px 12px;
            background: white;
            border: 1px dashed #dee2e6;
            border-radius: 6px;
            margin-bottom: 12px;
        }
        
        .empty-state i {
            font-size: 2rem;
            color: #adb5bd;
            margin-bottom: 8px;
        }
        
        .empty-state p {
            color: #6c757d;
            margin-bottom: 12px;
            font-size: 0.9rem;
        }
        
        .btn-add-new {
            background: var(--accent-color);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 8px 16px;
            font-weight: 500;
            font-size: 0.9rem;
        }
        
        .form-footer {
            background: white;
            padding: 12px;
            border-top: 1px solid #eee;
            display: flex;
            gap: 8px;
        }
        
        .btn-action {
            flex: 1;
            padding: 10px;
            border-radius: 8px;
            font-weight: 600;
            border: none;
            font-size: 1rem;
        }
        
        .btn-save {
            background: var(--primary-color);
            color: white;
        }
        
        .btn-cancel {
            background: #f8f9fa;
            color: #6c757d;
            border: 1px solid #dee2e6;
        }
        
        /* Combined breeding status warning */
        .breeding-status-warning {
            margin-top: 10px;
            padding: 10px;
            border-radius: 6px;
            background: linear-gradient(135deg, #fff3cd, #ffeaa7);
            border: 1px solid #ffc107;
            animation: fadeIn 0.5s ease-out;
        }
        
        .breeding-status-warning .warning-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 5px;
            color: #856404;
            font-weight: 600;
            font-size: 0.95rem;
        }
        
        .breeding-status-warning .warning-details {
            color: #856404;
            font-size: 0.85rem;
            line-height: 1.4;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        
        /* Artificial Insemination Section */
        .ai-section {
            margin-top: 15px;
            margin-bottom: 10px;
            padding: 15px;
            background: #e8f4fd;
            border-radius: 8px;
            border: 1px solid #c5e1f9;
            transition: all 0.3s ease;
        }
        
        .ai-section h5 {
            color: var(--primary-color);
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .ai-section .form-label {
            color: #2c5282;
        }
        
        
        
        .breeding-info {
            position: relative;
            cursor: help;
        }
        
        .breeding-info .info-tooltip {
            display: none;
            position: absolute;
            background: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 0.8rem;
            width: 200px;
            z-index: 1000;
            top: 100%;
            left: 0;
            margin-top: 5px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        
        .breeding-info:hover .info-tooltip {
            display: block;
        }
        
        .breeding-info .info-tooltip::before {
            content: '';
            position: absolute;
            top: -5px;
            left: 10px;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 5px solid #333;
        }
        
        .modal-content {
            border-radius: 10px;
            border: none;
        }
        
        .modal-header {
            background: var(--primary-color);
            color: white;
            padding: 12px 16px;
            border-radius: 10px 10px 0 0;
        }
        
        .modal-body {
            padding: 16px;
        }
        
        @media (max-width: 576px) {
            body {
                padding: 4px;
            }
            
            .form-header {
                padding: 12px;
            }
            
            .form-body {
                padding: 12px;
            }
            
            .form-section {
                padding: 10px;
                margin-bottom: 16px;
            }
            
            .section-title {
                font-size: 1rem;
            }
            
            .input-group > .btn {
                min-width: 50px;
                padding: 10px 8px;
            }
            
            .form-footer {
                padding: 10px;
            }
            
            .btn-action {
                padding: 8px;
                font-size: 0.95rem;
            }
            
            .currency-input-group .input-group-text {
                padding: 10px 8px;
                min-width: 35px;
            }
            
            .breeding-status-warning {
                padding: 8px;
            }
            
            .breeding-info .info-tooltip {
                width: 180px;
                font-size: 0.75rem;
            }
        }
    </style>
`;
        
    }
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdSelectSow         = `sel-add-entry-${settings.elemUniqueKey}-select-sow`;
        elemIdSowStatusShow     = `div-add-entry-${settings.elemUniqueKey}-sow-status-show`;
        elemIdSowLastInsem     	= `span-add-entry-${settings.elemUniqueKey}-sow-last-insem`;
		elemIdSowLastPid     	= `span-add-entry-${settings.elemUniqueKey}-sow-last-pid`;
		elemIdInsemType         = `sel-add-entry-${settings.elemUniqueKey}-insem-type`;
        elemIdDateMating        = `txt-add-entry-${settings.elemUniqueKey}-date-mating`;
        
        elemIdSelectBoarShow    = `div-add-entry-${settings.elemUniqueKey}-select-boar-show`;
        elemIdSelectBoar        = `sel-add-entry-${settings.elemUniqueKey}-select-boar`;
        
        
        elemIdAiShow            = `div-add-entry-${settings.elemUniqueKey}-select-ai-show`;
        elemIdSemenSupplier     = `sel-add-entry-${settings.elemUniqueKey}-select-semen-supplier`;
        elemIdSemenType         = `sel-add-entry-${settings.elemUniqueKey}-select-semen-type`;
        elemIdSemenCostCurSymbol= `span-add-entry-${settings.elemUniqueKey}-semen-cost-cur-symbol`;
        elemIdSemenCost         = `txt-add-entry-${settings.elemUniqueKey}-semen-cost`;
        
        
        elemIdOtherCurSymbol    = `span-add-entry-${settings.elemUniqueKey}-other-cost-cur-symbol`;
        elemIdOtherCost         = `txt-add-entry-${settings.elemUniqueKey}-other-cost`;
        
        elemIdNotes             = `txt-add-entry-${settings.elemUniqueKey}-notes`;
        elemIdNotesCharCounter  = `span-add-entry-${settings.elemUniqueKey}-notes-char-counter`;
        
        elemIdSelectStaff       = `sel-add-entry-${settings.elemUniqueKey}-select-staff`;
        
        elemIdBtnCancel         = `div-add-entry-${settings.elemUniqueKey}-cancel`;
        elemIdBtnSave           = `div-add-entry-${settings.elemUniqueKey}-save`;
        
        
        const html_css_inline   	= this._writeInlineStyle();
        const html_add_modal_sow 	= addModalSow.getHtml();
		const html_add_modal_boar 	= addModalBoar.getHtml();
		
		
		
        const html =`

${html_css_inline}

        
<div class="form-container">
    <div class="form-header">
        <h1><i class="bi bi-clipboard-heart"></i> Breeding Record</h1>
    </div>
    
    <div class="form-body">
        
        <!-- 1. Sow Field with Combined Warning -->
        <div class="form-section">
            <h3 class="section-title"><i class="bi bi-piggy-bank"></i> Sow</h3>
            
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
						with production <b>P_ID: <span id="${elemIdSowLastPid}">20</span></b>. 
						If this new entry will be saved, the previous gestating production  
						entry will be marked as <b>Not Pregnant</b> and will
						be removed from the Gestating Production List.
						
						Please ensure this is an intentional breeding due to sow reheat.
					</span>
                </div>
            </div>
        </div>
            
        
        <!-- 2. Insemination Type -->
        <div class="form-section">
            <h3 class="section-title"><i class="bi bi-gender-ambiguous"></i> Insemination Type</h3>
            <select class="form-select" id="${elemIdInsemType}" required>
                <option value="boar-mating" selected>Boar Mating</option>
                <option value="ai-external">Artificial Insemination</option>
            </select>
        </div>
        
        <!-- 3. Date Mating -->
        <div class="form-section">
            <h3 class="section-title"><i class="bi bi-calendar-event"></i> Date Mating or Insemination</h3>
            <input type="date" class="form-control" id="${elemIdDateMating}" required>
        </div>
        
        <!-- 4. Boar Field -->
        <div class="form-section" id="${elemIdSelectBoarShow}">
            <h3 class="section-title"><i class="bi bi-gender-male"></i> Boar</h3>
            
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
            <div class="mb-3">
                <label class="form-label"><i class="bi bi-truck"></i> Semen Supplier</label>
            
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
            <div class="mb-3">
                <label class="form-label"><i class="bi bi-vial"></i> Semen Type</label>
            
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
            <div class="mb-3">
                <label class="form-label"><i class="bi bi-cash-stack"></i> Semen Cost</label>
                <div class="currency-input-group">
                    <span class="input-group-text" id="${elemIdSemenCostCurSymbol}">$</span>
                    <input type="number" class="form-control" id="${elemIdSemenCost}" placeholder="0.00" step="0.1" min="0" value="0.00">
                </div>
            </div>
        </div>
                
        
        <!-- 5. Other Cost -->
        <div class="form-section">
            <h3 class="section-title"><i class="bi bi-cash-coin"></i> Other Cost</h3>
            <div class="currency-input-group">
                <span class="input-group-text" id="${elemIdOtherCurSymbol}">$</span>
                <input type="number" class="form-control" id="${elemIdOtherCost}" placeholder="0.00" step="0.1" min="0">
            </div>
        </div>
        
        <!-- 6. Notes -->
        <div class="form-section">
            <h3 class="section-title"><i class="bi bi-journal-text"></i> Notes</h3>
            <textarea class="form-control" id="${elemIdNotes}" rows="2" maxlength="160" placeholder="Enter notes..."></textarea>
            <div class="char-counter" id="${elemIdNotesCharCounter}">0/160</div>
        </div>
        
        <!-- 7. Staff -->
        <div class="form-section">
            <h3 class="section-title"><i class="bi bi-people"></i> Responsible Staff</h3>
            
            <div class="input-group" id="staffSelectGroup">
                <select class="form-select" id="${elemIdSelectStaff}" required>
                    <option value="" selected disabled>Select...</option>
                </select>
                <button class="btn" type="button" data-bs-toggle="modal" data-bs-target="#newStaffModal">
                    <i class="bi bi-plus"></i> New
                </button>
            </div>
        </div>
        
        <!-- Footer Buttons -->
        <div class="form-footer">
            <button type="button" class="btn-action btn-cancel" id="${elemIdBtnCancel}">
                <i class="bi bi-x"></i> Cancel
            </button>
            <button type="button" class="btn-action btn-save" id="${elemIdBtnSave}">
                <i class="bi bi-check"></i> Save
            </button>
        </div>
    </div>
</div>




<!--Modals -->
${html_add_modal_sow}

${html_add_modal_boar}

        `;
        
        
        const elemDivContainer = document.getElementById(settings.elemIdDivContainer);
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        
        elemSelectSow           = document.getElementById(elemIdSelectSow);
        elemSowStatusShow       = document.getElementById(elemIdSowStatusShow);
        elemSowLastInsem        = document.getElementById(elemIdSowLastInsem);
        elemSowLastPid  		= document.getElementById(elemIdSowLastPid);
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
        
        elemSelectStaff         = document.getElementById(elemIdSelectStaff);
            
        elemBtnCancel           = document.getElementById(elemIdBtnCancel);
        elemBtnSave             = document.getElementById(elemIdBtnSave);
    }
    
    
    this._processAfterHtmlRender = function(){
        // Temporary Philippine Peso symbol for currency1
        elemSemenCostCurSymbol.innerHTML    = 'P';
        elemOtherCurSymbol.innerHTML        = 'P';
		
		addModalSow.afterHtmlRender();
		addModalBoar.afterHtmlRender();
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
    }
    
    
    this._replaceSelectOptions = function(select_elem, new_options){
        select_elem.innerHTML = '';
        
        for (const cur_entry of new_options){
            const cur_value = cur_entry.value;
            const cur_text  = cur_entry.text;
            
            const new_option        = document.createElement('option');
            new_option.value        = cur_value;
            new_option.textContent  = cur_text;
                
                
            if ((cur_value == '0') || (cur_value == '-1')){
                new_option.disabled     = true;
            }
            select_elem.appendChild(new_option);
        }
        
        select_elem.selectedIndex = 0;
        
    }

    
    this.setSowList = function(data){
        sowList = data;
        
        var select_data = [];
        if (sowList.length == 0){
            select_data.push({value:"-1", text:"No Entries"});
            thisObj._replaceSelectOptions(elemSelectSow, select_data);
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
        
        thisObj._replaceSelectOptions(elemSelectSow, select_data);
    }
    
    
    this.setBoarList = function(data){
        boarList = data;
        
        var select_data = [];
        if (boarList.length == 0){
            select_data.push({value:"-1", text:"No Entries"});
            thisObj._replaceSelectOptions(elemSelectBoar, select_data);
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
        
        thisObj._replaceSelectOptions(elemSelectBoar, select_data);
        
    }
    
    
    this.setSemenSupplierList = function(data){
        semenSupplierList = data;
    }
    
    
    this.setStaffList = function(data){
        staffList = data;
        
        var select_data = [];
        if (staffList.length == 0){
            select_data.push({value:"-1", text:"No Entries"});
            thisObj._replaceSelectOptions(elemSelectStaff, select_data);
            return;
        }
        
        
        var select_data = [];
        select_data.push({value:"0", text:"Please Select"});
        
        for (const cur_entry of data){
            select_data.push({value: cur_entry.hid, text: cur_entry.name});
        }
        
        thisObj._replaceSelectOptions(elemSelectStaff, select_data);
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
					elemSowLastInsem.innerHTML 	= cur_entry.date_insemination;
					elemSowLastPid.innerHTML 	= cur_entry.last_prod_id;  
					
					
					elemSowStatusShow.style.display = 'block';
				}
				break;
            }
        }
    }
    
}   