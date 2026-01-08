// January 2, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../../common/page_view_basic.js';

import {SOW_STATUS,
        PIG_OPERATION_TYPE}     from '../../../constants.js';

import {getSowBoarReference}    from '../../common/common_app.js';

import {InsemDataSelect}        from './insem_data_select.js';




ProdEntryBirth.prototype = new PageViewBasic();
export function ProdEntryBirth(input_settings){
    PageViewBasic.call(this);
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    
    let elemIdContentContainer  = null;
    
    let elemIdCannotUpdate      = null;
    
    let elemIdDateExpected      = null;
    let elemIdDateBirth         = null;
    let elemIdGestationDays     = null;
    
    let elemIdNumFemale         = null;
    let elemIdNumMale           = null;
    let elemIdNumDead           = null;
    
    let elemIdStaff             = null;
    let elemIdStaffCount        = null;
    let elemIdStaffAdd          = null;
    let elemIdChkDoneByMe       = null;
    
    let elemIdBtnSave           = null;
    
    
    
    let elemContentContainer    = null;
    
    let elemCannotUpdate        = null;
    
    let elemDateExpected        = null;
    let elemDateBirth           = null;
    let elemGestationDays       = null;
    
    let elemNumFemale           = null;
    let elemNumMale             = null;
    let elemNumDead             = null;
    
    let elemStaff               = null;
    let elemStaffCount          = null;
    let elemStaffAdd            = null;
    let elemChkDoneByMe         = null;
    
    let elemBtnSave             = null;
    
    
   
    let staffList               = null; 
    
    let pigProdData         = null;
    
    
    const insemDataSelect       = new InsemDataSelect();
    

    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.getHtml = function(){
        
        elemIdContentContainer  = `pig-prod-birth-content`;
                
        elemIdCannotUpdate      = `pig-prod-birth-cannot-update`;
        
        elemIdDateExpected      = `pig-prod-birth-date-expected`;
        elemIdDateBirth         = `pig-prod-birth-date-birth`;
        elemIdGestationDays     = `pig-prod-birth-gestation-days`;
        
        elemIdNumFemale         = `pig-prod-birth-num-female`;
        elemIdNumMale           = `pig-prod-birth-num-male`;
        elemIdNumDead           = `pig-prod-birth-select-ai-show`;
        
        elemIdStaff             = `pig-prod-birth-staff`;
        elemIdStaffCount        = `pig-prod-birth-staff-count`;
        elemIdStaffAdd          = `pig-prod-birth-staff-count`;
        elemIdChkDoneByMe       = `pig-prod-birth-done-by-me`;
        
        
        elemIdBtnSave           = `pig-prod-birth-save`;
        
        
        
        
        const html = `
<div class="modal-body" id="${elemIdContentContainer}">
    <h2 class="tab-title">
        Birth Information
    </h2>
    
    <div class="warning-box" id="${elemIdCannotUpdate}">
        Setting the Date Actual Birth will update this production entry from 
        Gestating Status to Lactating Status and will be removed from Production 
        Gestating List. Will be put in Production Lactating List. 
        <b>This cannot be undone.</b>
    </div>
    
    <div class="form-group-text">
        <label for="${elemIdDateExpected}" class="form-label">Date Expected</label>
        <span class="" id="${elemIdDateExpected}"></span>
    </div>
    
    <div class="form-group-date">
        <label for="${elemIdDateBirth}" class="form-label">Date Actual Birth</label>
        <input type="text" class="form-control" id="${elemIdDateBirth}">
        <div class="invalid-feedback">
            Please a valid date.
        </div>
        <div id="${elemIdGestationDays}" style="font-size: 14px; color: var(--text-light); margin-top: 5px;" >Gestation period: -- days</div>
    </div>
    
    <!-- Number of Female Piglets with plus/minus buttons -->
    <div class="form-group">
        <label class="form-label">
            <i class="fas fa-venus" style="color: var(--icon-pink);"></i>
            Number of Live Female Piglets
        </label>
        <div class="number-input-group">
            <button class="number-btn minus" data-target="${elemIdNumFemale}">-</button>
            <input type="number" class="form-control number-input" id="${elemIdNumFemale}" value="0" min="0">
            <button class="number-btn plus" data-target="${elemIdNumFemale}">+</button>
        </div>
    </div>
    
    <!-- Number of Male Piglets with plus/minus buttons -->
    <div class="form-group">
        <label class="form-label">
            <i class="fas fa-mars" style="color: var(--icon-blue);"></i>
            Number of Live Male Piglets
        </label>
        <div class="number-input-group">
            <button class="number-btn minus" data-target="${elemIdNumMale}">-</button>
            <input type="number" class="form-control number-input" id="${elemIdNumMale}" value="0" min="0">
            <button class="number-btn plus" data-target="${elemIdNumMale}">+</button>
        </div>
    </div>
    
    <!-- Number of Stillbirth Piglets with plus/minus buttons -->
    <div class="form-group">
        <label class="form-label">Number of Stillbirth Piglets</label>
        <div class="number-input-group">
            <button class="number-btn minus" data-target="${elemIdNumDead}">-</button>
            <input type="number" class="form-control number-input" id="${elemIdNumDead}" value="0" min="0">
            <button class="number-btn plus" data-target="${elemIdNumDead}">+</button>
        </div>
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
        
        elemDateExpected        = document.getElementById(elemIdDateExpected);
        elemDateBirth           = document.getElementById(elemIdDateBirth);
        elemGestationDays       = document.getElementById(elemIdGestationDays);
        
        elemNumFemale           = document.getElementById(elemIdNumFemale);
        elemNumMale             = document.getElementById(elemIdNumMale);
        elemNumDead             = document.getElementById(elemIdNumDead);
        
        elemStaff               = document.getElementById(elemIdStaff);
        elemStaffCount          = document.getElementById(elemIdStaffCount);
        elemStaffAdd            = document.getElementById(elemIdStaffAdd);
        elemChkDoneByMe         = document.getElementById(elemIdChkDoneByMe);


        elemBtnSave             = document.getElementById(elemIdBtnSave);
    
    }
    
    
    this._processAfterHtmlRender = function(){
        $('#'+elemIdDateBirth).datepicker({
            format: 'MM d, yyyy',  // This gives "January 31, 2026"
            autoclose: true,
            endDate: new Date() // Max date is today
        }).on('show', function(e) {
            $('.datepicker').classList.add('datepicker-material');
        });
    }
    
    
    this._bindEventListeners = function(){
        // Plus/Minus buttons for piglet counts
        const plusButtons   = elemContentContainer.querySelectorAll('.number-btn.plus');
        const minusButtons  = elemContentContainer.querySelectorAll('.number-btn.minus');
        
        plusButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                const input = document.getElementById(target);
                let value = parseInt(input.value) || 0;
                input.value = value + 1;
                input.dispatchEvent(new Event('change'));
            });
        });
        
        minusButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                const input = document.getElementById(target);
                let value = parseInt(input.value) || 0;
                if (value > 0) {
                    input.value = value - 1;
                    input.dispatchEvent(new Event('change'));
                }
            });
        });
        
        
        elemChkDoneByMe.addEventListener('change', function(event) {
            if (event.currentTarget.checked) {
                elemStaff.style.display = 'none';
            } else {
                elemStaff.style.display = 'block';
            }
        });
        
        
        elemDateBirth.addEventListener('change', function() {
            thisObj._validateAfterChangeInput(this, 'date_birth');
        });
    }
    
    
    
    this.setDataStaffList = function(data){
        staffList = data;
        insemDataSelect.setDataStaffList(staffList, elemStaff);
    }
    
    
    this.show = function(data_pig_prod, options){
        pigProdData = data_pig_prod;
        
        const data_sow = data_pig_prod.sow;
        let sow_reference =  getSowBoarReference(data_sow, true);
        
        elemSow.textContent = sow_reference;
        
        
        const insemination  = data_pig_prod.insemination;
        
        const dt_insem      = new Date(insemination.insem_date);
        $('#'+elemIdDateMating).datepicker('setDate', dt_insem);
        
    }
    
    
    this._validateAfterChangeInput = function(ev, input_field){
        /* Use this to validate new entry form input.*/
    
        var input_elem  = null;
        var input_val   = null;
        var cur_field   = null;
        var validation  = null;
     
        
        if (ev.checkValidity()) {
            switch(input_field){
            
                
                case 'date_birth': {
                    input_elem  = elemIdDateBirth;
                    input_val   = input_elem.value || null;
                    cur_field   = newEntry.fieldShortName;
                    
                    
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
                
                case 'description': {
                    input_elem  = elemDescription;
                    input_val   = input_elem.value || null;
                    cur_field   = newEntry.fieldDescription;
                    
                    
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
        let cur_field       = null;
        let validation      = -1;
        let proceed_to_save = 1;
        
       
        let input_date_birth= elemDateBirth.value;
        let input_num_dead  = parseInt(elemNumDead.value);
        let input_num_male  = parseInt(elemNumMale.value);
        let input_num_female= parseInt(elemNumFemale.value);
        let input_staff_hid = elemStaff.val();
        
        
        input_elem          = elemDateBirth;
        cur_field           = selectedEntry.fieldBirthDate;
        cur_field.newValue  = input_date_birth;
        validation          = cur_field.validateChange();

        if (validation != FIELD_VALIDATION_OK){
            if (el_date_birth.classList.contains('is-invalid') == false){
                el_date_birth.classList.add('is-invalid');
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
                fieldStaffHid.newValue = input_staff_hid;
            }
        }
        if (proceed_to_save == 0) {return;}
        
        
        
        if (selectedEntry.hasChanged() == false){
            console.log('No change');
            
            
            return;
        }
        
        
        let user_hid        = gController.getUserUhid();
        
        // send post request
        let post_data = {
            'uhid':             user_hid,
            'pig_prod_hid':     selectedEntry.hid,
            'birth_staff_hid':  input_staff_hid,
            
            'date_actual_birth': input_date_birth,
            'num_pigs_dead':    input_num_dead,
            'num_pigs_male':    input_num_male,
            'num_pigs_female':  input_num_female
        };
        
               
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            url: gController.getBaseUrl() + '/pig_prod/update_birth',
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    if (thisObj.callBackOnSuccessUpdate != null){
                        thisObj.callBackOnSuccessUpdate();
                    }
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                gfRequestError(jqXHR, textStatus, errorThrown, gController.getAppName());
            }
        });
        
    }

    
    
    this._onSuccessUpdatePigOps = function(){
        if (thisObj.navigation.curScreenIsMobile > 0){
            
            if (thisObj.cbMobileOnSuccessEdit){
                thisObj.cbMobileOnSuccessEdit(pigProdPid);
            }
        }
        
        
        // TODO for desktop
       
    }
    
    

}