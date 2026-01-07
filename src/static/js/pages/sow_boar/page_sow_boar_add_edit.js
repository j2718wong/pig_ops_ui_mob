// January 2, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../common/page_view_basic.js';

import {SOW_STATUS}             from '../../constants.js';



import {FIELD_VALIDATION_OK}    from '../../models/model_basic.js'



PageSowBoarAddEdit.prototype = new PageViewBasic();
export function PageSowBoarAddEdit(input_settings){
    PageViewBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    
    /*
    Typical settings = {
        navigation:             this
    };
    */
    const settings              = input_settings;

    
    const elemDivContainer      = document.getElementById('container-sow-boar-add-edit');
        
        
    let elemIdBtnClose          = null;
    
    let elemIdHeaderTitle       = null;
        
    let elemIdInfoShow          = null;
    let elemIdInfo              = null;
    
    let elemIdName              = null;
    let elemIdNameCharCounter   = null;
    let elemIdNumber            = null;
    let elemIdNumberCharCounter = null;
    let elemIdDateOfBirth       = null;
    let elemIdBirthProdIdShow   = null;
    let elemIdBirthProdId       = null;
    let elemIdNumNipplesShow    = null;
    let elemIdNumNipples        = null;
    let elemIdIsExternalShow    = null;
    let elemIdIsExternal        = null;
    let elemIdIsProdReadyShow   = null;
    let elemIdIsProdReady       = null;
    let elemIdNotes             = null;
    let elemIdNotesCharCounter  = null;
    
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemBtnClose            = null;
    
    let elemHeaderTitle         = null;
            
    let elemInfoShow            = null;
    let elemInfo                = null;
        
    let elemName                = null;
    let elemNameCharCounter     = null;
    let elemNumber              = null;
    let elemNumberCharCounter   = null;
    let elemDateOfBirth         = null;
    let elemBirthProdIdShow     = null;
    let elemBirthProdId         = null;
    let elemNumNipplesShow      = null;
    let elemNumNipples          = null;
    let elemIsExternalShow      = null;
    let elemIsExternal          = null;
    let elemIsProdReadyShow     = null;
    let elemIsProdReady         = null;
    let elemNotes               = null;
    let elemNotesCharCounter    = null;
    
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
    let sowList                 = null;
    let boarList                = null;

    let showOptions             = null;
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdBtnClose          = `sow-boar-add-edit-close`;
        
        elemIdHeaderTitle       = `sow-boar-add-edit-title`;
            
        elemIdInfoShow          = `sow-boar-add-edit-info-show`;
        elemIdInfo              = `sow-boar-add-edit-info`;
        
        elemIdName              = `sow-boar-add-edit-name`;
        elemIdNameCharCounter   = `sow-boar-add-edit-name-counter`;
        elemIdNumber            = `sow-boar-add-edit-number`;
        elemIdNumberCharCounter = `sow-boar-add-edit-number-counter`;
        elemIdDateOfBirth       = `sow-boar-add-edit-date-of-birth`;
        elemIdBirthProdIdShow   = `sow-boar-add-edit-birth-prod-id-show`;
        elemIdBirthProdId       = `sow-boar-add-edit-birth-prod-id`;
        
        elemIdNumNipplesShow    = `sow-boar-add-edit-num-nipples-show`;
        elemIdNumNipples        = `sow-boar-add-edit-num-nipples`;
        elemIdIsExternalShow    = `sow-boar-add-edit-is-external-show`;
        elemIdIsExternal        = `sow-boar-add-edit-is-external`;
        elemIdIsProdReadyShow   = `sow-boar-add-edit-is-prod-ready-show`;
        elemIdIsProdReady       = `sow-boar-add-edit-is-prod-ready`;
        elemIdNotes             = `sow-boar-add-edit-notes`;
        elemIdNotesCharCounter  = `sow-boar-add-edit-notes-counter`;
        
        elemIdBtnCancel         = `sow-boar-add-edit-cancel`;
        elemIdBtnSave           = `sow-boar-add-edit-save`;
        
        
        const max_len_name = 50;
        const max_len_number = 20;
        
        
        
        
        const html =`

        
<div class="form-container">

    <div class="modal-header">
        <h5 class="modal-title">
            <span id="${elemIdHeaderTitle}"><i class="fas fa-plus me-2"></i>Add Sow</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    
    <div class="modal-body">
        
        <!-- 1. Name -->
        <div class="form-group-text">
            <label for="${elemIdName}" class="form-label">Name
                <span id="${elemIdNameCharCounter}" class="char-counter">0/${max_len_name}</span>
            </label>
            <input  type="text" class="form-control" id="${elemIdName}" maxlength="${max_len_name}" required>
            <div class="invalid-feedback">Please enter a valid name. </div>
            <div class="form-text">Pig name to easily remember.</div>
        </div>
        
        <!-- 2. Number -->
        <div class="form-group-text">
            <label for="${elemIdNumber}" class="form-label">Number
                <span id="${elemIdNumberCharCounter}" class="char-counter">0/${max_len_number}</span>
            </label>
            <input  type="text" class="form-control" id="${elemIdNumber}" maxlength="${max_len_number}" required>
            <div class="invalid-feedback">Please enter a pig number. </div>
            <div class="form-text">This can be an eartag number of your pig.</div>
        </div>
        
        <!-- 3. Date of Birth -->
        <div class="form-group-date">
            <label for="${elemIdDateOfBirth}" class="form-label">
                Date of Birth
            </label>
            <input type="text" class="form-control" id="${elemIdDateOfBirth}" required>
            <div class="form-text">This is use to calculate pig's age.</div>
        </div>
        
        <div class="form-group-text" id="${elemIdBirthProdIdShow}">
            <label class="form-label">Birth Prod ID</label>
            <span class="" id="${elemIdBirthProdId}"></span>
        </div>
        
        <!-- Number of Sow nipples -->
        <div class="form-group" id="${elemIdNumNipplesShow}">
            <label for="${elemIdNumNipples}" class="form-label">
                Number of Nipples
            </label>
            <div class="number-input-group">
                <button class="number-btn minus" data-target="${elemIdNumNipples}">-</button>
                <input type="number" class="form-control number-input" id="${elemIdNumNipples}" value="12" min="12">
                <button class="number-btn plus" data-target="${elemIdNumNipples}">+</button>
            </div>
            <div class="form-text">Yes. We record this. You better count.</div>
        
        </div>
        
        
        <!-- 4. Is External -->
        <div class="form-group-select" id="${elemIdIsExternalShow}">
            <label for="${elemIdIsExternal}" class="form-label">
                Is External?
            </label>
            <input type="checkbox" id="${elemIdIsExternal}">
            <label for="${elemIdIsExternal}" class="checkbox-label">
                External
            </label>
            <div class="form-text">Check this if you borrowed your neighbor's boar.</div>
        </div>
        
        <!-- 5. Is Production Ready -->
        <div class="form-group-select">
            <label for="${elemIdIsProdReady}" class="form-label">
                Is Ready for Mating?
            </label>
            <input type="checkbox" id="${elemIdIsProdReady}">
            <label for="${elemIdIsProdReady}" class="checkbox-label">
                Production Ready
            </label>
            <div class="form-text">Need to specify if ready to mate.</div>
        </div>
        
        
        <!-- 6. Notes -->
        <div class="form-group-text-area">
            <label for="${elemIdNotes}" class="form-label">
                Notes
                <span id="${elemIdNotesCharCounter}" class="char-counter">0/160</span>
            </label>
            
            <textarea class="form-control" id="${elemIdNotes}" rows="2" maxlength="160"></textarea>
        </div>
        
        
        <!-- Footer Buttons -->
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="${elemIdBtnCancel}" style="margin-right:10px;">
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
        elemHeaderTitle         = document.getElementById(elemIdHeaderTitle);
        elemBtnClose            = document.getElementById(elemIdBtnClose);
        
        elemName                = document.getElementById(elemIdName);
        elemNameCharCounter     = document.getElementById(elemIdNameCharCounter);
        elemNumber              = document.getElementById(elemIdNumber);
        elemNumberCharCounter   = document.getElementById(elemIdNumberCharCounter);
        elemDateOfBirth         = document.getElementById(elemIdDateOfBirth);
        elemBirthProdIdShow     = document.getElementById(elemIdBirthProdIdShow);
        elemBirthProdId         = document.getElementById(elemIdBirthProdId);
        elemNumNipplesShow      = document.getElementById(elemIdNumNipplesShow);
        elemNumNipples          = document.getElementById(elemIdNumNipples);
        elemIsExternalShow      = document.getElementById(elemIdIsExternalShow);
        elemIsExternal          = document.getElementById(elemIdIsExternal);
        elemIsProdReadyShow     = document.getElementById(elemIdIsProdReadyShow);
        elemIsProdReady         = document.getElementById(elemIdIsProdReady);
        elemNotes               = document.getElementById(elemIdNotes);
        elemNotesCharCounter    = document.getElementById(elemIdNotesCharCounter);
       
        elemBtnCancel           = document.getElementById(elemIdBtnCancel);
        elemBtnSave             = document.getElementById(elemIdBtnSave);
    }
    
    
    this._processAfterHtmlRender = function(){
        $('#'+elemIdDateOfBirth).datepicker({
            format: 'MM d, yyyy',  // This gives "January 31, 2026"
            autoclose: true,
			orientation: 'bottom',
            endDate: new Date() // Max date is today
        }).on('show', function(e) {
            $('.datepicker').addClass('datepicker-material');
        });
    }
    
    
    this._bindEventListeners = function(){
        
        elemName.addEventListener('input', function(){
            thisObj.updateCharCounter(elemName, elemNameCharCounter, 
                50);
            
            elemName.classList.remove('is-invalid');
        });
        
        
        elemNumber.addEventListener('input', function(){
            thisObj.updateCharCounter(elemNumber, elemNumberCharCounter, 
                20);
            
            elemNumber.classList.remove('is-invalid');
        });
        
        
        elemNotes.addEventListener('input', function(){
            thisObj.updateCharCounter(elemNotes, elemNotesCharCounter, 
                160);
            
            elemNotes.classList.remove('is-invalid');
        });
        
        
		elemName.addEventListener('blur', function() {
            thisObj._validateAfterChangeInput(this, 'name');
        });
        
		elemNumber.addEventListener('blur', function() {
            thisObj._validateAfterChangeInput(this, 'number');
        });
		
        
       
    }
    
    
    this.setDataSowList = function(data){
        sowList = data;
    }
    
    
    this.setDataBoarList = function(data){
        boarList = data;
    }
    
    
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        
      
        
        
        
        
        
        elemStaff.selectedIndex = 0;
        elemStaff.classList.remove('is-valid', 'is-invalid');
        
        elemChkDoneByMe.checked = false;
        
        
        elemNotes.value = '';
        elemStaff.classList.remove('is-valid', 'is-invalid');
        
        thisObj.updateCharCounter(elemNotes, elemNotesCharCounter, 160);
        
    }
    
    
    this.beforeShow = function(options){
        /*
        Typical options
        options_sow_boar ={
            is_add:         true,   // false is edit
            is_sow:         true,   // false is boar
            go_back_page:   elemDivContainer   // Go back to this page
            from_prod_pid:  null    // can be null or undefined
        }
        */
        
        showOptions = options;
        
        let html;
        
        
        // Change Header title
        if (options.is_sow){
            
            if (options.is_add){
                html = `<i class="fas fa-plus me-2"></i>Add Sow`;
            }
            else{
                html = `<i class="fas fa-edit me-2"></i>Edit Sow`;
            }
        }
        else{
            if (options.is_add){
                html = `<i class="fas fa-plus me-2"></i>Add Boar`;
            }
            else{
                html = `<i class="fas fa-edit me-2"></i>Edit Boar`;
            }
        }
        
        elemHeaderTitle.innerHTML = html;
        
        // Hide Boar Only info
        if (options.is_sow){
            // Boars can be external to the farm
            elemIsExternalShow.style.display = 'none';
        }
        
        
        // Hide elemBirthProdIdShow
        // BirthProdId will only show up if a production piglet is eartag or
        //  a pig is taken from exisiting production entry  
        if ('from_prod_pid' in options){
            elemBirthProdIdShow.style.display = 'block';
        }
        else{
            elemBirthProdIdShow.style.display = 'none';
        }
        
        
        // Update Close and cancel button on click
        
        elemBtnClose.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
        
        elemBtnCancel.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };

    }
    
    
    
    
    this.show = function(){
        thisObj._resetForm();
        
        console.log('PageAddGestating show');
    }
    
      
    this._validateAfterChangeInput = function(ev, input_field){
        /* Use this to validate new entry form input.*/
    
        let input_elem  = null;
        let input_val   = null;
        let cur_field   = null;
        let validation  = null;
        
        
        if (ev.checkValidity()) {
            switch(input_field){
            
                case 'name': {
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
                
                case 'number': {
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