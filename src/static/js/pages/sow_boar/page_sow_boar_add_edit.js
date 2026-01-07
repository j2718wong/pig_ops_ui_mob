// January 2, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../common/page_view_basic.js';

import {SOW_STATUS}             from '../../constants.js';



import {FIELD_VALIDATION_OK}    from '../../models/model_basic.js'

import {ModelSowBoar}           from '../../models/model_sow_boar.js'



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
    let elemIdNameInv           = null;
    let elemIdNumber            = null;
    let elemIdNumberCharCounter = null;
    let elemIdNumberInv         = null;
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
    
    let elemIdServerErrorMsg    = null;
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemBtnClose            = null;
    
    let elemHeaderTitle         = null;
            
    let elemInfoShow            = null;
    let elemInfo                = null;
        
    let elemName                = null;
    let elemNameCharCounter     = null;
    let elemNameInv             = null;
    let elemNumber              = null;
    let elemNumberCharCounter   = null;
    let elemNumberInv           = null;
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
    
    let elemServerErrorMsg      = null;
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
    let sowList                 = null;
    let boarList                = null;

    let showOptions             = null;
    
    
    let sowBoarEntry            = new ModelSowBoar();
    
    
    this.callbackOnSuccessAdd   = null;
    
    
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
        elemIdNameInv           = `sow-boar-add-edit-name-inv`;
        elemIdNumber            = `sow-boar-add-edit-number`;
        elemIdNumberCharCounter = `sow-boar-add-edit-number-counter`;
        elemIdNumberInv         = `sow-boar-add-edit-number-inv`;
        
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
        
        elemIdServerErrorMsg    = `sow-boar-add-edit-server-error-msg`;
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
            <input  type="text" class="form-control" id="${elemIdName}" maxlength="${max_len_name}">
            <div class="invalid-feedback" id="${elemIdNameInv}">Please enter a valid name. </div>
            <div class="form-text">Pig name to easily remember.</div>
        </div>
        
        <!-- 2. Number -->
        <div class="form-group-text">
            <label for="${elemIdNumber}" class="form-label">Number
                <span id="${elemIdNumberCharCounter}" class="char-counter">0/${max_len_number}</span>
            </label>
            <input  type="text" class="form-control" id="${elemIdNumber}" maxlength="${max_len_number}">
            <div class="invalid-feedback" id="${elemIdNumberInv}">Please enter a pig number. </div>
            <div class="form-text">This can be an eartag number of your pig.</div>
        </div>
        
        <!-- 3. Date of Birth -->
        <div class="form-group-date">
            <label for="${elemIdDateOfBirth}" class="form-label">
                Date of Birth
            </label>
            <input type="text" class="form-control" id="${elemIdDateOfBirth}">
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
            <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
                                           
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
        elemNameInv             = document.getElementById(elemIdNameInv);
        elemNumber              = document.getElementById(elemIdNumber);
        elemNumberCharCounter   = document.getElementById(elemIdNumberCharCounter);
        elemNumberInv           = document.getElementById(elemIdNumberInv);
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
       
        elemServerErrorMsg      = document.getElementById(elemIdServerErrorMsg);
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
        
        
        elemBtnSave.addEventListener('click', function() {
            thisObj._onClickSaveButton();
        });
       
    }
    
    
    this.setDataSowList = function(data){
        sowList = data;
    }
    
    
    this.setDataBoarList = function(data){
        boarList = data;
    }
    
    
    this._getSowBoar = function(name, number, exclude_hid){
        // Note: SowBoar name or number can be null; but not both
        // SowBoar number can also contain non numeric characters
        let upper_name  = null;
        let upper_number = null;
        
        if (name != null){upper_name = name.toUpperCase();}
        if (number != null){upper_number = number.toUpperCase();}
        
        
        let cur_entry;
        let index;
        
        let sow_boar_list= null;
        if (showOptions.is_sow){
            sow_boar_list = sowList;
        }
        else{
            sow_boar_list = boarList;
        }
        
        for (index = 0; index < sow_boar_list.length; index++){
            cur_entry = sow_boar_list[index];
            
            // Will check both name and number for duplicate 
            
            if (upper_name != null) {
                if (cur_entry.name != null){
                    if (cur_entry.name.toUpperCase() == upper_name){
                        if (exclude_hid){
                            if (cur_entry.hid != exclude_hid){
                                return cur_entry;
                            }
                        }
                        
                        else{
                            return cur_entry;
                        }
                    }
                }
                
                if (cur_entry.number != null) {
                    if (cur_entry.number.toUpperCase() == upper_name){
                        if (exclude_hid){
                            if (cur_entry.hid != exclude_hid){
                                return cur_entry;
                            }
                        }
                        
                        else{
                            return cur_entry;
                        }
                    }
                }
            }
            
            if (upper_number != null) {
                if (cur_entry.name != null){
                    if (cur_entry.name.toUpperCase() == upper_number){
                        if (exclude_hid){
                            if (cur_entry.hid != exclude_hid){
                                return cur_entry;
                            }
                        }
                        
                        else{
                            return cur_entry;
                        }
                    }
                }
                
                if (cur_entry.number != null) {
                    if (cur_entry.number.toUpperCase() == upper_number){
                        if (exclude_hid){
                            if (cur_entry.hid != exclude_hid){
                                return cur_entry;
                            }
                        }
                        
                        else{
                            return cur_entry;
                        }
                    }
                }
            }
            
        }
        
        return null;
    }
    
    
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        
        elemNameInv.style.display = 'none';
        elemNumberInv.style.display = 'none';
      
        
        
        // Remove validation classes
        let cur_elem = null;
        
        cur_elem = elemName;
        cur_elem.value = ''; 
        cur_elem.classList.remove('is-valid', 'is-invalid'); 
        
        cur_elem = elemNumber;
        cur_elem.value = ''; 
        cur_elem.classList.remove('is-valid', 'is-invalid'); 
        
        cur_elem = elemDateOfBirth;
        cur_elem.value = ''; 
        cur_elem.classList.remove('is-valid', 'is-invalid'); 
        
        cur_elem = elemNotes;
        cur_elem.value = ''; 
        cur_elem.classList.remove('is-valid', 'is-invalid'); 
        
        
        
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
        thisObj._resetForm();
        
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
            elemNumNipplesShow.style.display = 'block';
        }
        else{
            elemIsExternalShow.style.display = 'block';
            elemNumNipplesShow.style.display = 'none';
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
        
        let is_duplicate = 0;
        
        
        if (ev.checkValidity()) {
            switch(input_field){
            
                case 'name': {
                    input_elem      = elemName;
                    input_val       = input_elem.value.trim();
                    cur_field       = sowBoarEntry.fieldSowBoarName;
                    
                    
                    cur_field.newValue = input_val; 
                    validation = cur_field.validateChange();
                    
                    // Additional validation to prevent duplicate 
                    if (validation == FIELD_VALIDATION_OK){
                        if (input_val.length > 0){
                            if (showOptions.is_add){ 
                                const cur_sow_boar = thisObj._getSowBoar(input_val, null);
                    
                                if (cur_sow_boar != null){
                                    is_duplicate = 1;
                                    validation = -1;
                                }
                            
                            } else{
                                // edit
                                
                            }
                        }
                    }
                    
                    if (validation == FIELD_VALIDATION_OK) {
                        ev.classList.remove('is-invalid');
                        ev.classList.add('is-valid');
                    } else{
                        if (is_duplicate > 0){
                            elemNameInv.textContent = 'Duplicate entry.';
                        }
                        else{
                            elemNameInv.textContent = 'Please enter a valid name.';
                        }
                        
                        ev.classList.remove('is-valid');
                        ev.classList.add('is-invalid');
                    }
                    
                    break;
                }
                
                case 'number': {
                    input_elem  = elemNumber;
                    input_val   = input_elem.value;
                    cur_field   = sowBoarEntry.fieldSowBoarNumber;
                    
                    
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
                
                               
            }
            
            
        } else {
            ev.classList.remove('is-valid');
            ev.classList.add('is-invalid');
        }

    }
    
    
    this._onClickSaveButton = function(){

        let input_elem      = null;
        let input_val       = null;
        let cur_field       = null;
        let validation      = -1;
        let proceed_to_save = 1;
        
        let is_duplicate    = 0;
        
       
        
        let input_name      = elemName.value.trim();
        let input_number    = elemNumber.value.trim();
        let input_date_birth= elemDateOfBirth.value.trim();
        
        is_duplicate        = 0;
        
        input_elem          = elemName;
        cur_field           = sowBoarEntry.fieldSowBoarName;
        cur_field.newValue  = input_name;
        validation          = cur_field.validateChange();
        
        
        // Additional validation to prevent duplicate 
        if (validation == FIELD_VALIDATION_OK){
            if (input_name.length > 0){
                if (showOptions.is_add){ 
                    const cur_sow_boar = thisObj._getSowBoar(input_name, null);
        
                    if (cur_sow_boar != null){
                        is_duplicate = 1;
                        validation = -1;
                    }
                
                } else{
                    // edit
                    
                }
            }
            
        }
        
        if (validation != FIELD_VALIDATION_OK){
            if (is_duplicate > 0){
                elemNameInv.html('Duplicate entry.');
            }
            else{
                elemNameInv.html('Please enter a valid name.');
            }
            
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
        
        
        is_duplicate        = 0;
        
        input_elem          = elemNumber;
        cur_field           = sowBoarEntry.fieldSowBoarNumber;
        cur_field.newValue  = input_number;
        validation          = cur_field.validateChange();
        
        
        // Additional validation to prevent duplicate 
        if (validation == FIELD_VALIDATION_OK){
            if (input_number.length > 0){
                const cur_sow_boar = thisObj._getSowBoar(null, input_number);
    
                if (cur_sow_boar != null){
                    is_duplicate = 1;
                    validation = -1;
                }
            }
        }
        
        if (validation != FIELD_VALIDATION_OK){
            if (is_duplicate > 0){
                elemNumberInv.textContent = 'Duplicate entry.';
            }
            else{
                elemNumberInv.textContent = 'Please enter a valid number.';
            }
            
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
        
        
        // check if both name and number are blank
        if (input_name.length == 0 && input_number.length == 0){
            elemNameInv.textContent = 'Cannot be both blank.';
            elemNumberInv.textContent = 'Cannot be both blank.';
            
            input_elem          = elemName;
            if (input_elem.classList.contains('is-invalid') == false){
                input_elem.classList.add('is-invalid');
            }
            
            input_elem          = elemNumber;
            if (input_elem.classList.contains('is-invalid') == false){
                input_elem.classList.add('is-invalid');
            }
            
            proceed_to_save = 0;
        }
        
        if (proceed_to_save == 0) {return;}
        
        if (input_date_birth.length == 0){
            input_date_birth = null;
        } else{
            input_elem          = elemDateOfBirth;
            cur_field           = sowBoarEntry.fieldBirthDate;
            
            
            // Convert date to YYYY-MM-DD format
            const dt_dob        = new Date(input_date_birth);
            const dt_dob_s      = dt_dob.toLocaleDateString('en-CA');
            
            cur_field.newValue  = dt_dob_s;
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
        }
        
        if (proceed_to_save == 0) {return;}
        
                
        
        
        const is_external   = elemIsExternal.checked;
        const is_prod_ready = elemIsProdReady.checked;
        
        const sex           = showOptions.is_sow ? 'F':'M';
        
        
        const user_hid      = navigation.userControl.getUserHid();
        const pig_farm_hid  = navigation.userControl.getCurrentFarmHid();
        const base_url      = window.location.origin;
        
        
        // send post request
        let post_data = {
            'uhid':             user_hid,
            'pfhid':            pig_farm_hid,
            
            'number':           sowBoarEntry.fieldSowBoarNumber.newValue,
            'name':             sowBoarEntry.fieldSowBoarName.newValue,
            'date_of_birth':    sowBoarEntry.fieldBirthDate.newValue,
            'sex':              sex,
            'is_production_ready': is_prod_ready? 1 : 0,
        };
        
        if (showOptions.is_add == false){
            // edit entry
            delete post_data.pfhid;
            
            post_data['sow_boar_hid'] = sowBoarEntry.hid;
        }
        
        if (post_data.date_of_birth == null){
            delete post_data.date_of_birth;
        }
        
        // Only add Boars will have is_external flag;
        if (is_external == true && showOptions.is_sow == false){
            post_data.is_external = 1;
        }
        
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            url: `${base_url}/sow_boar/add`,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
                elemServerErrorMsg.style.display = 'none';
            },
  
            success: function(response){
                if (response.result.num == 0){
                    
                    const callback_error = function(error_code, error_desc){
                        let html;
                        if ((error_desc != null) && (error_desc.length > 0)){
                            html = `<span>${error_desc}</span>`;
                        }
                        else{
                            html = `<span>${error_code}</span>`;
                        }
                        
                        elemServerErrorMsg.innerHTML = html;
                        elemServerErrorMsg.style.display = 'block'
                    };
                    
                    if (thisObj.callbackOnSuccessAdd == null){
                        console.log('No callback; nothing to do after save;')
                        
                        navigation.pigFarm.requestSowBoar(showOptions.is_sow, 
                            null, callback_error);
                            
                        navigation.showThisPage(showOptions.go_back_page);
                        return;
                    }
                    
                    
                    const new_sow_boar_hid = response.sow_boar.hid;
                    const callback_success = function(){
                        thisObj.callbackOnSuccessAdd(new_sow_boar_hid);
                        navigation.showThisPage(showOptions.go_back_page);
                    };
                    
                    navigation.pigFarm.requestSowBoar(showOptions.is_sow, 
                        callback_success, callback_error);
                    
                }
                else{
                    let error_desc = response.result.desc;
                    let error_code = response.result.code;
                    
                    let html;
                    if ((error_desc != null) && (error_desc.length > 0)){
                        html = `<span>${error_desc}</span>`;
                    }
                    else{
                        html = `<span>${error_code}</span>`;
                    }
                    console.log('to display error');
                    elemServerErrorMsg.innerHTML = html;
                    elemServerErrorMsg.style.display = 'block'
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                gfRequestError(jqXHR, textStatus, errorThrown, gController.getAppName());
            }
        });
    }
    
    

}   