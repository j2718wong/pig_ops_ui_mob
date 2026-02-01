// February 1, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}        from '../../common/page_view_basic.js';

import {SOW_STATUS,
        PIG_OPERATION_TYPE,
        PROD_STATUS,
        PIG_PROD_TYPE}              from '../../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}             from '../../../utils.js';

import {getSowBoarReference}        from '../../common/common_app.js';

import {addValidationClassToElem}   from '../../common/ui/ui_utils.js';

import {UiInputDatePickerGesta}     from './components/input_datepicker_gesta.js';

import {ComponentStaffFormGroup}    from '../../common/ui/comp_staff_form_group.js';
import {ComponentPlusMinusInput}    from '../../common/ui/comp_plus_minus_input.js';


import {CommonSelectOptions}        from '../../common/common_select_options.js';




export function ProdEntryWean(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    
    const INVALID_MSG_NUM_INPUT     = 'Please enter a valid number.';
    const INVALID_MSG_ZERO_INPUT    = 'At least one of these numbers cannot not be zero';
    
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
    let elemIdDaysSinceBirth      = null;
    
    let elemUiDateWean          = null;
    
    let componentNumTotal       = null;
    
    let componentNumFemale      = null;
    let componentNumMale        = null;
    
    let elemIdWeanWeight        = null;
    
    let elemIdServerErrorMsg    = null;
    let elemIdBtnSave           = null;
    
    
    
    let elemContentContainer    = null;
    
    let elemCannotUpdate        = null;
    let elemSow                 = null;
    let elemDaysSinceBirth        = null;
    
    let elemWeanWeight          = null;
    
    
    let elemServerErrorMsg      = null;
    let elemBtnSave             = null;
    
    
    let curDataPigProd          = null;
    

    
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
        elemIdDaysSinceBirth      = `${settings.uniqueKey}-date-expected`;
        
        elemUiDateWean         = new UiInputDatePickerGesta({
            uniqueKey:          `${settings.uniqueKey}-date-birth`,
        
            className:          'form-group-date',
            textLabel:          'Date Wean',
            isRequired:         true,
            invalidFeedBack:    'Please enter a valid date.',
            helpText:           null
        });
        
        
        componentNumFemale      = new ComponentPlusMinusInput({
            uniqueKey:          `${settings.uniqueKey}-num-female`,
            
            className:          'form-group-number',
            iconLabel:          '<i class="fas fa-venus" style="color: var(--icon-pink);"></i>',
            textLabel:          'Number of Weaned Female Piglets',
            minValue:           0,
            step:               1,
            isRequired:         true,
            invalidFeedBack:    null,
            helpText:           null
        });
        
        
        componentNumMale        = new ComponentPlusMinusInput({
            uniqueKey:          `${settings.uniqueKey}-num-male`,
            
            className:          'form-group-number',
            iconLabel:          '<i class="fas fa-mars" style="color: var(--icon-blue);"></i>',
            textLabel:          'Number of Weaned Male Piglets',
            minValue:           0,
            step:               1,
            isRequired:         true,
            invalidFeedBack:    null,
            helpText:           null
        });
        
        
        componentNumTotal       = new ComponentPlusMinusInput({
            uniqueKey:          `${settings.uniqueKey}-num-total`,
            
            className:          'form-group-number',
            textLabel:          'Number of Weaned Piglets',
            minValue:           0,
            step:               1,
            isRequired:         false,
            invalidFeedBack:    null,
            helpText:           null
        });
        
        
        elemIdWeanWeight        = `${settings.uniqueKey}-total-weight`;
        
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        
        
        const html_date_birth   = elemUiDateWean.getHtml();
        
        const html_num_female   = componentNumFemale.getHtml();
        const html_num_male     = componentNumMale.getHtml();
        const html_num_total     = componentNumTotal.getHtml();


        
        const html = `
<div class="modal-body" id="${elemIdContentContainer}">
    <h2 class="tab-title">
        Weaning Information
    </h2>
    
    <div class="warning-box" id="${elemIdCannotUpdate}">
        Setting the Date Weaning will update this production entry from 
        Lactating Status to Fattening Status and will be removed from Production 
        Lactating List. Will be put in Production Fattening List. 
        <b>This cannot be undone.</b>
    </div>
    
    <!-- 1. Sow Field cannot be edited. -->
    <div class="form-group-text">
        <label class="form-label">Sow Name</label>
        <span class="" id="${elemIdSow}"></span>
    </div>
    
    
    <div class="form-group-text">
        <label for="${elemIdDaysSinceBirth}" class="form-label">Days since Birth</label>
        <span class="" id="${elemIdDaysSinceBirth}"></span>
		<span class="" id="">Day of Birth is Day 1</span>
    </div>
    
    ${html_date_birth}
    
    <-- option to swith to total count or per sex count-->
    
    <!-- Number of Total Piglets with plus/minus buttons -->
    ${html_num_total}
    
    <!-- Number of Female Piglets with plus/minus buttons -->
    ${html_num_female}
    
    <!-- Number of Male Piglets with plus/minus buttons -->
    ${html_num_male}
            
    
    <div class="form-group-number">
        <label for="${elemIdWeanWeight}" class="form-label">
            Total Wean Weight (Optional)
        </label>
        
        <input type="number" class="form-control" id="${elemIdWeanWeight}" step="0.1" min="0" >
        <div class="invalid-feedback">
            Please enter numeric value.
        </div>
    </div>
    

    <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
    
    <!-- Footer Buttons -->
    <div class="modal-footer">
        <button type="button" class="btn btn-primary" id="${elemIdBtnSave}">
            <i class="fas fa-save me-2"></i>Save Changes
        </button>
    </div>
</div>
        `;
        
        return html
    }
    
    
    this.afterHtmlRender = function(){
        elemUiDateWean.afterHtmlRender();
        
        componentNumFemale.afterHtmlRender();
        componentNumMale.afterHtmlRender();
        componentNumTotal.afterHtmlRender();
        
       
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemContentContainer    = elemDivContainer.querySelector('#'+elemIdContentContainer);
        
        elemCannotUpdate        = elemDivContainer.querySelector('#'+elemIdCannotUpdate);
        elemSow                 = elemDivContainer.querySelector('#'+elemIdSow);
        elemDaysSinceBirth        = elemDivContainer.querySelector('#'+elemIdDaysSinceBirth);
        
        elemWeanWeight          = elemDivContainer.querySelector('#'+elemIdWeanWeight);
        
        elemServerErrorMsg      = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);
        elemBtnSave             = elemDivContainer.querySelector('#'+elemIdBtnSave);
    
    }
    
    
    this._processAfterHtmlRender = function(){
        
    }
    
    
    this._bindEventListeners = function(){
         elemBtnSave.addEventListener('click', function() {
            thisObj.onClickSaveButton();
        });
        
        
    }
    
    
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        
          
        elemUiDateWean.reset();
        
        componentNumTotal.reset()
        componentNumFemale.reset()
        componentNumMale.reset()
        
        

        
        elemServerErrorMsg.style.display = 'none';
    }
    
    
    this.show = function(data_pig_prod, options){
        thisObj._resetForm();
        
        curDataPigProd = data_pig_prod;
        
        const data_sow = curDataPigProd.sow;
        
        
        // Set sow_name and create a link to open SowBoarPage
        const sow_boar_name = getSowBoarReference(data_sow, true);
        
        const html_sow = `
        <a href="javascript:void(0)" class="breadcrumb-link">${sow_boar_name}</a>
        `;
        elemSow.innerHTML = html_sow;
        
        elemSow.onclick = function(){
            const sow_boar_list = navigation.pigFarm.managerSowBoar.dataSowList;
            navigation.pageSowBoarList.gotoSowBoarEntryPage(sow_boar_list, data_sow.hid);
        };
        
        
        
        
        const pig_prod_birth  = curDataPigProd.birth;
        
        const dt_actual       = new Date(pig_prod_birth.date_actual);
		
		
        elemDaysSinceBirth.textContent = 23;
        
    }
    
    
    this._validateAfterChangeInput = function(ev, input_field){
        /* Use this to validate new entry form input.*/
    
        var input_elem  = null;
        var input_val   = null;
        var cur_field   = null;
        var validation  = null;
     
        
        if (ev.checkValidity()) {
            switch(input_field){
            

             
            }
            
            
        } else {
            ev.classList.remove('is-valid');
            ev.classList.add('is-invalid');
        }

    }
    
    
    this.onClickSaveButton = function(){
        let input_elem      = null;
        let validation      = 0;
        
       
        let input_date_birth= elemUiDateWean.getValue();
        let input_num_dead  = componentNumTotal.getValue();
        let input_num_male  = componentNumMale.getValue();
        let input_num_female= componentNumFemale.getValue();
        let input_staff     = componentStaff.getValue();
        
        
        input_elem          = elemUiDateWean.getElemText();
        
        // Convert date to YYYY-MM-DD format
        const dt_birth      = new Date(input_date_birth);
        if (isNaN(dt_birth.getTime())){
            validation      = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        const dt_birth_s   = dt_birth.toLocaleDateString('en-CA');
        validation          = 0
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        
        // Validate number counts
        let number_dead = 0;
        let number_male = 0;
        let number_female = 0;
        
        input_elem          = componentNumTotal.getElemText();
        
        try{
            number_dead = parseInt(input_num_dead)
        }catch (error){
            componentNumTotal.setTextInvalid(INVALID_MSG_NUM_INPUT);
            validation = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        
        input_elem          = componentNumFemale.getElemText();
        
        try{
            number_female = parseInt(input_num_female)
        }catch (error){
            componentNumFemale.setTextInvalid(INVALID_MSG_NUM_INPUT);
            validation = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        
        input_elem          = componentNumMale.getElemText();
        
        try{
            number_male = parseInt(input_num_male)
        }catch (error){
            componentNumMale.setTextInvalid(INVALID_MSG_NUM_INPUT);
            validation = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        
        if (number_dead == 0 && number_male == 0 && number_female == 0){
            componentNumTotal.setTextInvalid(INVALID_MSG_ZERO_INPUT);
            componentNumFemale.setTextInvalid(INVALID_MSG_ZERO_INPUT);
            componentNumMale.setTextInvalid(INVALID_MSG_ZERO_INPUT);
            
            validation = -1;
            
            input_elem = componentNumTotal.getElemText();
            addValidationClassToElem(input_elem, validation);
            
            input_elem = componentNumFemale.getElemText();
            addValidationClassToElem(input_elem, validation);
            
            input_elem = componentNumMale.getElemText();
            addValidationClassToElem(input_elem, validation);
            
            if (validation != 0) {return;}
        }
        
        
        // The staff can be from the drop down
        // Or Done by User (Done by Me checkbox)
        let done_by_user = 0
        
        
        input_elem = componentStaff.getElemCheckBox();
        if (input_elem.checked){
            done_by_user = 1;
        }
        
        if (done_by_user == 0){
            input_elem = componentStaff.getElemSelect();
            if (input_staff == '0'  || input_staff == '-1'){
                validation = -1;
            }
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        
        
        
        
        
        // TODO need to check if data has changed or not;
        // because changing date of birth is an expensive operation in back end
        
        
        
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
            return;
        }
        
        
        const user_hid      = navigation.userControl.getUserHid();
        const base_url      = window.location.origin;
        
        let url = `${base_url}/pig_prod/update_birth`;
        
        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'pig_prod_hid':     curDataPigProd.pig_production.hid,
            'birth_staff_hid':  input_staff,
            
            'date_actual_birth': dt_birth_s,
            'num_pigs_dead':    number_dead,
            'num_pigs_male':    number_male,
            'num_pigs_female':  number_female
        };
        
        if (done_by_user > 0){
            post_data.done_by_user = 1;
            delete post_data.birth_staff_hid;
        }
        
        // TODO: check if there is a change in the data
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            url: url,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
                elemServerErrorMsg.style.display = 'none';
            },
  
            success: function(response){
                if (response.result.num == 0){
                    thisObj.onSuccessUpdateBirth();
                    
                    if (thisObj.callBackOnSuccessUpdate){
                        thisObj.callBackOnSuccessUpdate();
                    }
                } 
                else{
                    navigation.serverError.receivedErrorMessage(
                        response, elemServerErrorMsg);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
        
    }
  
    
    this.onSuccessUpdateBirth = function(){
        // There are two cases that are covered for this:
        //
        // 1.) Case 1: curDataPigProd has no date_actual_birth (PROD_STATUS.GESTATING)
        // and date_actual_birth is updated; The sequence of steps that should happen is
        //  - remove curDataPigProd from gestating List
        //  - request Lactating List
        //  - open to Lactating List Page; not to Lactating Entry page; 
        //      this is to show that a new lactating entry has been added.
        //
        // 2.) Case 2: curDataPigProd has date_actual_birth (PROD_STATUS.LACTATING)
        // The sequence of steps that should happen is
        //  - request updated prod_entry data and replace curDataPigProd;
        //  - should go back to Lactating Page showing PigOps List; this is 
        //      important because any change in actual date_of_birth will 
        //      recalculate lactating pigops schedule.
        
        
        const cur_prod_status = curDataPigProd.pig_production.prod_status_id;
        
        if (cur_prod_status == PROD_STATUS.GESTATING){
            // Remove from curDataPigProd from gestating List
            const pig_prod_hid = curDataPigProd.pig_production.hid;
            const prod_list = navigation.pigFarm.managerPigProd.dataGestatingList;
            
            navigation.pigFarm.managerPigProd.removeFromProdList(
                    pig_prod_hid, prod_list);
        
            const callback_success = function(data){
                navigation.pigFarm.managerPigProd.dataLactatingList = data;
                
                // Open to Lactating List
                const operation_type = PIG_OPERATION_TYPE.LACTATING_PIGLETS;
                navigation._onClickNavProdGestaLacta(null, operation_type);
            };
            
            
            // request Lactating List
            navigation.pigFarm.managerPigProd.requestPigProdList(
                PIG_PROD_TYPE.LACTATING, callback_success, elemServerErrorMsg);
        
        
            
        }
        else{
            const pig_prod_hid = curDataPigProd.pig_production.hid;
            const prod_list = navigation.pigFarm.managerPigProd.dataGestatingList;
            
            const callback_success = function(data){
                navigation.pigFarm.managerPigProd.replaceInProdList(
                        pig_prod_hid, prod_list, data);
            };
            
            //request updated prod_entry data and replace curDataPigProd;
            navigation.pigFarm.managerPigProd.requestPigProdEntry(pig_prod_hid, 
                callback_success, elemServerErrorMsg);
                
            //go back to Lactating Page showing PigOps List;
            
        }
        
    }

}