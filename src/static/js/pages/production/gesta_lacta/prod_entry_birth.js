// January 2, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}        from '../../common/page_view_basic.js';

import {SOW_STATUS,
        PIG_OPERATION_TYPE}         from '../../../constants.js';

import {getSowBoarReference}        from '../../common/common_app.js';

import {addValidationClassToElem}   from '../../common/ui/ui_utils.js';

import {UiInputDatePickerGesta}     from './components/input_datepicker_gesta.js';

import {ComponentStaffFormGroup}    from '../../common/ui/comp_staff_form_group.js';
import {ComponentPlusMinusInput}    from '../../common/ui/comp_plus_minus_input.js';


import {CommonSelectOptions}        from '../../common/common_select_options.js';




export function ProdEntryBirth(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    
    /*
    Typical settings = {
        navigation:             navigation,
        parentObj:              this,
        uniqueKey:              'pig-prod-gesta-birth',
        elemIdDivContainer:     elemTabGestaBirth
    };
    */
    const settings              = input_settings;
    
    const elemDivContainer      = settings.elemDivContainer;
    
    let elemIdContentContainer  = null;
    
    let elemIdCannotUpdate      = null;
    let elemIdSow               = null;
    let elemIdDateExpected      = null;
    
    let elemUiDateBirth         = null;
    
    
    let componentNumFemale      = null;
    let componentNumMale        = null;
    let componentNumDead        = null;
    
    let componentStaff          = null;
    
    let elemIdBtnSave           = null;
    
    
    
    let elemContentContainer    = null;
    
    let elemCannotUpdate        = null;
    let elemSow                 = null;
    let elemDateExpected        = null;
    
    
    let elemBtnSave             = null;
    
    
    let curDataPigProd             = null;
    

    

    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        const html = this.getHtml();
        elemDivContainer.innerHTML = html;
    }
    
    
    this.getHtml = function(){
        
        elemIdContentContainer  = `${settings.uniqueKey}-content`;
                
        elemIdCannotUpdate      = `${settings.uniqueKey}-cannot-update`;
        
        elemIdSow               = `${settings.uniqueKey}-sow`;
        elemIdDateExpected      = `${settings.uniqueKey}-date-expected`;
        
        elemUiDateBirth         = new UiInputDatePickerGesta({
            uniqueKey:          `${settings.uniqueKey}-date-birth`,
        
            className:          'form-group-date',
            textLabel:          'Date Actual Birth',
            isRequired:         true,
            invalidFeedBack:    'Please enter a valid date.',
            helpText:           null
        });
        
        
        componentNumFemale      = new ComponentPlusMinusInput({
            uniqueKey:          `${settings.uniqueKey}-num-female`,
            
            className:          'form-group',
            iconLabel:          '<i class="fas fa-venus" style="color: var(--icon-pink);"></i>',
            textLabel:          'Number of Live Female Piglets',
            minValue:           0,
            step:               1,
            isRequired:         true,
            invalidFeedBack:    null,
            helpText:           null
        });
        
        
        componentNumMale        = new ComponentPlusMinusInput({
            uniqueKey:          `${settings.uniqueKey}-num-male`,
            
            className:          'form-group',
            iconLabel:          '<i class="fas fa-mars" style="color: var(--icon-blue);"></i>',
            textLabel:          'Number of Live Male Piglets',
            minValue:           0,
            step:               1,
            isRequired:         true,
            invalidFeedBack:    null,
            helpText:           null
        });
        
        
        componentNumDead        = new ComponentPlusMinusInput({
            uniqueKey:          `${settings.uniqueKey}-num-dead`,
            
            className:          'form-group',
            textLabel:          'Number of Stillbirth Piglets',
            minValue:           0,
            step:               1,
            isRequired:         false,
            invalidFeedBack:    null,
            helpText:           null
        });
        
        
        
        componentStaff          = new ComponentStaffFormGroup({
            navigation:         navigation,
            uniqueKey:          `${settings.uniqueKey}-staff`,
            
            includeAddNew:      true,
            includeDoneByMe:    true,
            
            titleExpandSection: 'Add New Staff',
            htmlExpandSection:  null,
            labelBtnExpandSave: 'Save New Staff',
            
            labelSelect:        'Staff Member',
            helpText:           'Who did the operation'
        });
    
        
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        
        
        const html_date_birth   = elemUiDateBirth.getHtml();
        
        const html_num_female   = componentNumFemale.getHtml();
        const html_num_male     = componentNumMale.getHtml();
        const html_num_dead     = componentNumDead.getHtml();


        const html_staff        = componentStaff.getHtml();
        
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
    
    <!-- 1. Sow Field cannot be edited. -->
    <div class="form-group-text">
        <label class="form-label">Sow Name</label>
        <span class="" id="${elemIdSow}"></span>
    </div>
    
    
    <div class="form-group-text">
        <label for="${elemIdDateExpected}" class="form-label">Date Expected</label>
        <span class="" id="${elemIdDateExpected}"></span>
    </div>
    
    ${html_date_birth}
    
    <!-- Number of Female Piglets with plus/minus buttons -->
    ${html_num_female}
    
    <!-- Number of Male Piglets with plus/minus buttons -->
    ${html_num_male}
            
    <!-- Number of Stillbirth Piglets with plus/minus buttons -->
    ${html_num_dead}
            
    <!-- 7. Staff -->
    ${html_staff}

    <button class="btn btn-primary" id="${elemIdBtnSave}">Save Changes</button>

</div>
        `;
        
        return html
    }
    
    
    this.afterHtmlRender = function(){
        elemUiDateBirth.afterHtmlRender();
        
        componentNumFemale.afterHtmlRender();
        componentNumMale.afterHtmlRender();
        componentNumDead.afterHtmlRender();
        
        componentStaff.afterHtmlRender();
        
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemContentContainer    = elemDivContainer.querySelector('#'+elemIdContentContainer);
        
        elemCannotUpdate        = elemDivContainer.querySelector('#'+elemIdCannotUpdate);
        elemSow                 = elemDivContainer.querySelector('#'+elemIdSow);
        elemDateExpected        = elemDivContainer.querySelector('#'+elemIdDateExpected);
        
        elemBtnSave             = elemDivContainer.querySelector('#'+elemIdBtnSave);
    
    }
    
    
    this._processAfterHtmlRender = function(){
        
    }
    
    
    this._bindEventListeners = function(){
    
    }
    
    
    this.show = function(data_pig_prod, options){
        curDataPigProd = data_pig_prod;
        console.log(`curDataPigProd`);
        console.log(curDataPigProd);
        
        const data_sow = curDataPigProd.sow;
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
    
    
    this.onClickSaveButton = function(){

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
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
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