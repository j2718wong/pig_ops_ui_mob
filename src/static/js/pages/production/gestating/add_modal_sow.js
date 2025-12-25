// December 23, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {ModelSowBoar}           from '../../../models/model_sow_boar.js';


export function AddModalSowBoar(input_settings){
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    
    
    /*
    Typical settings = {
        parentObj:          this,
        isAddSow:           true,
        elemIdDivModal:     
        selectElemShowList: null
    };
    */
    const settings              = input_settings;
    
    // This needs to be set before render as this is targeted by Bootstrap modal.
    var elemIdDivModal          = settings.elemIdDivModal;
    
    var elemIdNumber            = null;
    var elemIdNumberInv         = null;
    
    var elemIdName              = null;
    var elemIdNameInv           = null;
    
    var elemIdIsExternalShow    = null;
    var elemIdIsExternal        = null;
    
    var elemIdDateOfBirthShow   = null;
    var elemIdDateOfBirth       = null;
    
    var elemIdBtnSave           = null;
    var elemIdBtnCancel			= null;
	
    
    var elemDivModal            = null;
    var elemNumber              = null;
    var elemNumberInv           = null;
    
    var elemName                = null;
    var elemNameInv             = null;
    
    var elemIsExternalShow      = null;
    var elemIsExternal          = null;
    
    var elemDateOfBirthShow     = null;
    var elemDateOfBirth         = null;
    
    var elemBtnSave             = null;
    var elemBtnCancel			= null;
	
    
    var sowBoarList             = null;
    
    const newEntry              = new ModelSowBoar();
    
    
    this.getHtml = function(){
        
        // It is possible for both add sow and add boar will be on the same page.
        // So there must be distinction of the element IDs.
        
        const sow_or_boar       = settings.isAddSow ? 'sow' : 'boar';
        const title_text        = settings.isAddSow ? 'Sow' : 'Boar';
        
        
        elemIdNumber            = `txt-add-entry-${sow_or_boar}-number`;
        elemIdNumberInv         = `div-add-entry-${sow_or_boar}-number-inv`;
        
        elemIdName              = `txt-add-entry-${sow_or_boar}-name`;
        elemIdNameInv           = `div-add-entry-${sow_or_boar}-name-inv`;
        
        elemIdIsExternalShow    = `div-add-entry-${sow_or_boar}-external-show`;
        elemIdIsExternal        = `chk-add-entry-${sow_or_boar}-external`;
        
        elemIdDateOfBirthShow   = `div-add-entry-${sow_or_boar}-date-birth-show`;
        elemIdDateOfBirth       = `txt-add-entry-${sow_or_boar}-date-birth`;
        
        elemIdBtnSave           = `btn-add-entry-${sow_or_boar}-save`;
        elemIdBtnCancel         = `btn-add-entry-${sow_or_boar}-cancel`;
        

        const html = `
<div class="modal fade" id="${elemIdDivModal}" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><i class="bi bi-plus"></i> Add New ${title_text}</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            
            <div class="modal-body">
                <div class="mb-2">
                    <label class="form-label">${title_text} ID</label> <span>This can be an eartag</span>
                    <input type="text" class="form-control" id="${elemIdNumber}" placeholder="SOW-005">
                    <div id="${elemIdNumberInv}" class="invalid-feedback">
                        Please enter a valid number.
                    </div>
                </div>
                
                <div class="mb-2">
                    <label class="form-label">${title_text} Name</label>
                    <input type="text" class="form-control" id="${elemIdName}" placeholder="Bella">
                    <div id="${elemIdNameInv}" class="invalid-feedback">
                        Please enter a valid name.
                    </div>
                </div>
                
                <div class="mb-2" id="${elemIdIsExternalShow}">
                    <label class="form-label">Is external? </label>
                    
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="${elemIdIsExternal}" >
                        <label class="form-check-label" for="${elemIdIsExternal}">
                            External Boar
                        </label>
                    </div>
                </div>
                
                <div class="mb-2">
                    <label class="form-label">Date of Birth</label>
                    <input type="date" class="form-control" id="${elemIdDateOfBirth}">
                    <div class="invalid-feedback">
                        Please enter a valid date.
                    </div>
                </div>
                
                <!--
                <div class="mb-3">
                    <label class="form-label">Breed</label>
                    <select class="form-select" id="sowBreed">
                        <option value="">Select breed...</option>
                        <option value="yorkshire">Yorkshire</option>
                        <option value="landrace">Landrace</option>
                        <option value="duroc">Duroc</option>
                    </select>
                </div>-->
            </div>
            
            <div class="modal-footer" style="padding: 12px;">
                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary btn-sm" id="${elemIdBtnSave}">Add</button>
            </div>
        </div>
    </div>
</div>


        `;
        return html;
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        
        elemDivModal            = document.getElementById(elemIdDivModal);
        elemNumber              = document.getElementById(elemIdNumber);
        elemNumberInv           = document.getElementById(elemIdNumberInv);
        
        elemName                = document.getElementById(elemIdName);
        elemNameInv             = document.getElementById(elemIdNameInv);
        
        elemIsExternalShow      = document.getElementById(elemIdIsExternalShow);
        elemIsExternal          = document.getElementById(elemIdIsExternal);
        
        elemDateOfBirthShow     = document.getElementById(elemIdDateOfBirthShow);
        elemDateOfBirth         = document.getElementById(elemIdDateOfBirth);
        
        elemBtnSave             = document.getElementById(elemIdBtnSave);
		elemBtnCancel           = document.getElementById(elemIdBtnCancel);
	}
    
    
    this._processAfterHtmlRender = function(){
        if (settings.isAddSow == true){
            elemIsExternalShow.style.display = 'none';
        }
        else {
            elemIsExternalShow.style.display = 'block';
        }
    }
    
    
    this._bindEventListeners = function(){
        elemNumber.addEventListener('blur', function(event) {
            thisObj._validateAfterChangeInput(event, 'number');
        });
        
        
        elemName.addEventListener('blur', function(event) {
            thisObj._validateAfterChangeInput(event, 'name');
        });
        
        
        elemBtnSave.addEventListener('click', function() {
            thisObj._onClickSaveButton();
        });
    }
    
    
    this.setSowBoarList   = function(sow_boar_list){
        sowBoarList = sow_boar_list;
    }
    
    
    this._getSowBoar = function(name, number){
        // Note: SowBoar name or number can be null; but not both
        // SowBoar number can also contain non numeric characters
        var upper_name  = null;
        var upper_number = null;
        
        if (name != null){upper_name = name.toUpperCase();}
        if (number != null){upper_number = number.toUpperCase();}
        
        
        var cur_entry;
        var index;
        for (index = 0; index < sowBoarList.length; index++){
            cur_entry = sowBoarList[index];
            
            // Will check both name and number for duplicate 
            
            if (upper_name != null) {
                if (cur_entry.name != null){
                    if (cur_entry.name.toUpperCase() == upper_name){
                        return cur_entry;
                    }
                }
                
                if (cur_entry.number != null) {
                    if (cur_entry.number.toUpperCase() == upper_name){
                        return cur_entry;
                    }
                }
            }
            
            if (upper_number != null) {
                if (cur_entry.name != null){
                    if (cur_entry.name.toUpperCase() == upper_number){
                        return cur_entry;
                    }
                }
                
                if (cur_entry.number != null) {
                    if (cur_entry.number.toUpperCase() == upper_number){
                        return cur_entry;
                    }
                }
            }
            
        }
        
        return null;
    }
    
    
    this._validateAfterChangeInput = function(ev, input_field){
        /* Use this to validate new entry form input.*/
        
        var input_elem      = null;
        var input_val       = null;
        var cur_field       = null;
        var validation      = -1;
     
        var is_duplicate    = 0;
        
        if (ev.checkValidity()) {
            switch(input_field){
            
                case 'name': {
                    input_elem  = elemName;
                    input_val   = input_elem.val().trim();
                    cur_field   = newEntry.fieldSowBoarName;
                    
                    
                    cur_field.newValue = input_val;
                    validation = cur_field.validateChange();
                    
                    is_duplicate = 0;
                    if (validation == FIELD_VALIDATION_OK) {
                        // Additional validation to prevent duplicate
                        
                        if (sowBoarList != null && input_val.length > 0){
                            const cur_sow_boar = thisObj._getSowBoar(input_val, null);
                
                            if (cur_sow_boar != null){
                                is_duplicate = 1;
                                validation = -1;
                            }
                        }
                    }

                    if (validation == FIELD_VALIDATION_OK) {
                        ev.classList.remove('is-invalid');
                        ev.classList.add('is-valid');
                    } else{
                        if (is_duplicate > 0){
                            elemNameInv.html('Duplicate entry.');
                        }
                        else{
                            elemNameInv.html('Please enter a valid name.');
                        }
                        
                        ev.classList.remove('is-valid');
                        ev.classList.add('is-invalid');
                    }
                    
                    break;
                }
                
                
                case 'number': {
                    input_elem  = elemNumber;
                    input_val   = input_elem.val().trim();
                    cur_field   = newEntry.fieldSowBoarNumber;
                    
                    
                    cur_field.newValue = input_val;
                    validation = cur_field.validateChange();
                    
                    is_duplicate = 0;
                    if (validation == FIELD_VALIDATION_OK) {
                        // Additional validation to prevent duplicate
                        
                        if (sowBoarList != null && input_val.length > 0){
                            const cur_sow_boar = thisObj._getSowBoar(null, input_val);
                
                            if (cur_sow_boar != null){
                                is_duplicate = 1;
                                validation = -1;
                            }
                        }
                    }
                    
                    if (validation == FIELD_VALIDATION_OK) {
                        ev.classList.remove('is-invalid');
                        ev.classList.add('is-valid');
                    } else{
                        if (is_duplicate > 0){
                            elemNumberInv.html('Duplicate entry.');
                        }
                        else{
                            elemNumberInv.html('Please enter a valid number.');
                        }
                        
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