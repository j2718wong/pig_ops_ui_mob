// January 2, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}        from '../../common/page_view_basic.js';

import {APPLICATION,
        SOW_STATUS,
        PIG_OPERATION_TYPE,
        PROD_STATUS,
        PIG_PROD_TYPE}              from '../../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}             from '../../../utils.js';

import {getSowBoarReference}        from '../../common/common_app.js';

import {ProdEntryBirthHistory}      from './prod_entry_birth_history.js';

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
    
    
    const INVALID_MSG_NUM_INPUT     = 'Please enter a valid number.';
    const INVALID_MSG_ZERO_INPUT    = 'At least one of these numbers cannot not be zero';
    
    
    const WARNING_1 = `
        Setting the Date Actual Birth will update this production entry from 
        Gestating Status to Lactating Status and will be removed from Production 
        Gestating List. Will be put in Production Lactating List. 
        <b>This cannot be undone.</b>
    `;
    
    const WARNING_2 = `
        Changing the Date Actual Birth of this lactating entry will recalculate
        all scheduled operations for lactating piglets and sow.
    `;
    
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
    
    
    let elemIdBirthActive       = null;
    let elemIdBirthHistory      = null;
    
    let elemIdWithOutBirthInfo  = null;
    let elemIdWithBirthInfo     = null;
    
    let elemIdWarningBox        = null;
    let elemIdCannotUpdate      = null;
    
    let elemIdSow               = null;
    let elemIdDateExpected      = null;
    
    let elemUiDateBirth         = null;
    
    
    let componentNumFemale      = null;
    let componentNumMale        = null;
    let componentNumDead        = null;
    
    let componentStaff          = null;
    
    let elemIdServerErrorMsg    = null;
    let elemIdBtnSave           = null;
    
    
    let elemBirthActive         = null;
    let elemBirthHistory        = null;
    
    
    let elemWithOutBirthInfo    = null;
    let elemWithBirthInfo       = null;
    
    let elemWarningBox          = null;
    let elemCannotUpdate        = null;
    
    let elemSow                 = null;
    let elemDateExpected        = null;
    
    
    let elemServerErrorMsg      = null;
    let elemBtnSave             = null;
    
    
    let curDataPigProd          = null;
    
    let dtCurrentDate           = null;
    
    let birthHistory            = new ProdEntryBirthHistory({
        navigation:             navigation,
        elemDivContainer:       elemDivContainer,
        uniqueKey:              `${settings.uniqueKey}-birth`
    });
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        const html = this.getHtml();
        elemDivContainer.innerHTML = html;
    }
    
    
    this.getHtml = function(){
        elemIdBirthActive       = `${settings.uniqueKey}-birth-active`;
        elemIdBirthHistory      = `${settings.uniqueKey}-birth-history`;
        
        const html_active       = thisObj.getHtmlActive();
        const html_history      = birthHistory.getHtml();
        
        const html = `
        <div class="modal-body">
            <div id="${elemIdBirthActive}">
                ${html_active}
            </div>
            
            <div id="${elemIdBirthHistory}">
                ${html_history}
            </div>
        </div>
        `;
        
        return html;        
    }
    
    
    this.getHtmlActive = function(){
        
        let label_save_changes      = 'Save Changes';
            
        let label_birth_info        = 'Birth Information';
        let label_date_expected     = 'Date Expected Birth';
        let label_date_birth        = 'Date Actual Birth';
        let label_valid_date        = 'Please enter a valid date';
            
        let label_sow               = 'Sow';
        
        let label_num_live_female   = 'Number of Live Female Piglets';
        let label_num_live_male     = 'Number of Live Male Piglets';
        let label_num_still_birth   = 'Number of Stillbirth Piglets';
        
        let label_add_new_staff     = 'Add New Staff';   
        let label_save_new_staff    = 'Save New Staff';  
        let label_select_staff      = 'Select Staff';
        let label_select_staff_help = 'Who did the operation';
        
        
        let label_warning_1 = WARNING_1;
        
        let label_warning_3 = 'Birth Information cannot be changed after wean';
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        // Common labels
        label_save_changes      = helper.getSimpleTranslation('common.labels.save_changes') || label_save_changes;
        label_valid_date        = helper.getSimpleTranslation('common.labels.valid_date') || label_valid_date;
        
        
        // Common app labels
        label_sow               = helper.getSimpleTranslation('common_app.labels.sow') || label_sow;
        
        
        // Page: prod_entry_birth
        label_birth_info        = helper.getSimpleTranslation('prod_entry_birth.labels.birth_info') || label_birth_info;
        
        label_date_expected     = helper.getSimpleTranslation('prod_entry_birth.labels.date_expected') || label_date_expected;
        label_date_birth        = helper.getSimpleTranslation('prod_entry_birth.labels.date_birth') || label_date_birth;
        
        label_num_live_female   = helper.getSimpleTranslation('prod_entry_birth.labels.num_live_female') || label_num_live_female;
        label_num_live_male     = helper.getSimpleTranslation('prod_entry_birth.labels.num_live_male') || label_num_live_male;
        label_num_still_birth   = helper.getSimpleTranslation('prod_entry_birth.labels.num_still_birth') || label_num_still_birth;
        
        label_add_new_staff     = helper.getSimpleTranslation('prod_entry_birth.labels.add_new_staff') || label_add_new_staff;
        label_save_new_staff    = helper.getSimpleTranslation('prod_entry_birth.labels.save_new_staff') || label_save_new_staff;
        label_select_staff      = helper.getSimpleTranslation('prod_entry_birth.labels.select_staff') || label_select_staff;
        label_select_staff_help = helper.getSimpleTranslation('prod_entry_birth.labels.select_staff_help') || label_select_staff_help;
        
        label_warning_1         = helper.getSimpleTranslation('prod_entry_birth.warning_1') || label_warning_1;
        
        
        elemIdWithOutBirthInfo  = `${settings.uniqueKey}-without-birth`;
        elemIdWithBirthInfo     = `${settings.uniqueKey}-with-birth`;
        
                        
        elemIdWarningBox        = `${settings.uniqueKey}-warning-box`;
        elemIdCannotUpdate      = `${settings.uniqueKey}-cannot-update`;
        
        elemIdSow               = `${settings.uniqueKey}-sow`;
        elemIdDateExpected      = `${settings.uniqueKey}-date-expected`;
        
        elemUiDateBirth         = new UiInputDatePickerGesta({
            uniqueKey:          `${settings.uniqueKey}-date-birth`,
        
            className:          'form-group-date',
            textLabel:          label_date_birth,
            isRequired:         true,
            invalidFeedBack:    label_valid_date,
            helpText:           null
        });
        
        
        componentNumFemale      = new ComponentPlusMinusInput({
            uniqueKey:          `${settings.uniqueKey}-num-female`,
            
            className:          'form-group-number',
            iconLabel:          '<i class="fas fa-venus" style="color: var(--icon-pink);"></i>',
            textLabel:          label_num_live_female,
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
            textLabel:          label_num_live_male,
            minValue:           0,
            step:               1,
            isRequired:         true,
            invalidFeedBack:    null,
            helpText:           null
        });
        
        
        componentNumDead        = new ComponentPlusMinusInput({
            uniqueKey:          `${settings.uniqueKey}-num-dead`,
            
            className:          'form-group-number',
            textLabel:          label_num_still_birth,
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
            
            titleExpandSection: label_add_new_staff,
            htmlExpandSection:  null,
            labelBtnExpandSave: label_save_new_staff,
            
            labelSelect:        label_select_staff,
            helpText:           label_select_staff_help
        });
    
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        
        
        const html_date_birth   = elemUiDateBirth.getHtml();
        
        const html_num_female   = componentNumFemale.getHtml();
        const html_num_male     = componentNumMale.getHtml();
        const html_num_dead     = componentNumDead.getHtml();


        const html_staff        = componentStaff.getHtml();
        
        const html = `
<div>
    <div id="${elemIdWithOutBirthInfo}">
        No Birth info Available
    </div>
    
    <div id="${elemIdWithBirthInfo}">

        <h2 class="tab-title">
            ${label_birth_info}
        </h2>
        
        <div class="warning-box" id="${elemIdWarningBox}">
            ${label_warning_1}
        </div>
        
        <div class="warning-box" id="${elemIdCannotUpdate}" style="margin-bottom:8px;">
            ${label_warning_3}
        </div>
        
        
        <div class="form-group-text">
            <label class="form-label">${label_sow}</label>
            <span class="" id="${elemIdSow}"></span>
        </div>
        
        
        <div class="form-group-text">
            <label for="${elemIdDateExpected}" class="form-label">${label_date_expected}</label>
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

        <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
        
        <!-- Footer Buttons -->
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="${elemIdBtnSave}">
                <i class="fas fa-save me-2"></i>${label_save_changes}
            </button>
        </div>
    </div>
</div>
        `;
        
        return html
    }
    
    
    this.afterHtmlRender = function(){
        birthHistory.afterHtmlRender();
        
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
        elemBirthActive         = elemDivContainer.querySelector('#'+elemIdBirthActive);
        elemBirthHistory        = elemDivContainer.querySelector('#'+elemIdBirthHistory);
        
        elemWithOutBirthInfo    = elemDivContainer.querySelector('#'+elemIdWithOutBirthInfo);
        elemWithBirthInfo       = elemDivContainer.querySelector('#'+elemIdWithBirthInfo);   
        
        elemWarningBox          = elemDivContainer.querySelector('#'+elemIdWarningBox);
        elemCannotUpdate        = elemDivContainer.querySelector('#'+elemIdCannotUpdate);
        
        elemSow                 = elemDivContainer.querySelector('#'+elemIdSow);
        elemDateExpected        = elemDivContainer.querySelector('#'+elemIdDateExpected);
        
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
        
          
        elemUiDateBirth.reset();
        
        
        componentNumFemale.reset()
        componentNumMale.reset()
        componentNumDead.reset()
        
        
        componentStaff.reset();
        
        elemServerErrorMsg.style.display = 'none';
    }
    
    
    this.beforeShow = function(data_pig_prod, options){
        thisObj._resetForm();
        
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        curDataPigProd = data_pig_prod;
        
        
        // Check if if there is a sow info
        
        const data_sow = curDataPigProd.sow;
        
        // Assume that elemBirthActive is active 
        elemBirthActive.style.display = 'block';
        elemBirthHistory.style.display = 'none';
        
        if (!data_sow){
            elemWithOutBirthInfo.style.display = 'block';
            elemWithBirthInfo.style.display = 'none';
            return;
        }
        
        
        elemWithOutBirthInfo.style.display = 'none';
        elemWithBirthInfo.style.display = 'block';   
        
        
        const pig_prod_birth = curDataPigProd.birth;
        
        
        let is_historical   = 0;
        
        // Check if there is already an date actual birth
        if (pig_prod_birth.date_actual){
            const dt_birth = new Date(pig_prod_birth.date_actual);
            
            // Calculate days since weaning
            const diff_days = Math.ceil((dtCurrentDate - dt_birth) / (1000 * 60 * 60 * 24));
            
            // If days since weaning exceeds the threshold, mark as historical
            if (diff_days > APPLICATION.MIN_DAYS_BIRTH_BECOME_HISTORY) {
                is_historical = 1;
            }
        }
        
        
        if (is_historical) {
            // Birth is historical - read only
            elemBirthActive.style.display    = 'none';
            elemBirthHistory.style.display   = 'block';
            
            birthHistory.show(data_pig_prod);
            return;
        }    
        
        
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
        
        
        
        
        const dt_expected      = new Date(pig_prod_birth.date_expected);
        elemDateExpected.textContent = formatDate(dt_expected);
        

        componentStaff.beforeShow();

        
        let label_warning_1 = WARNING_1;
        let label_warning_2 = WARNING_2;
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_warning_1         = helper.getSimpleTranslation('prod_entry_birth.warning_1') || label_warning_1;
        label_warning_2         = helper.getSimpleTranslation('prod_entry_birth.warning_2') || label_warning_2;
        
        
        // Populate birth details if already given birth
        if (pig_prod_birth.date_actual) {
            elemWarningBox.innerHTML = label_warning_2;
            
            // Set date of actual birth
            elemUiDateBirth.setDate(pig_prod_birth.date_actual);
            
            // Set Gestation days
            elemUiDateBirth.setGestationDays(pig_prod_birth.num_days_actual);
            
            // Set number of piglets
            componentNumFemale.setValue(pig_prod_birth.pigs_live_f);
            componentNumMale.setValue(pig_prod_birth.pigs_live_m);
            componentNumDead.setValue(pig_prod_birth.num_dead_at_birth);
            
            // Set Staff
            componentStaff.setValue(pig_prod_birth.birth_staff_hid);
        }
        else{
            elemWarningBox.innerHTML = label_warning_1;
        }
        
        
        if (options.is_read_only){
            elemCannotUpdate.style.display = 'block';
            
            elemWarningBox.style.display = 'none'; 
            
            
            elemUiDateBirth.disabled();
            
            componentNumFemale.disabled();
            componentNumMale.disabled();
            componentNumDead.disabled();
            
            componentStaff.disabled();
            
            elemBtnSave.style.display = 'none';
            
        }
        
        else{
            elemCannotUpdate.style.display = 'none';
            
            elemWarningBox.style.display = 'block'; 
            
            
            elemUiDateBirth.enabled();
            
            componentNumFemale.enabled();
            componentNumMale.enabled();
            componentNumDead.enabled();
            
            componentStaff.enabled();
             
            elemBtnSave.style.display = 'block';
        }
        
        
        
        
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
        
       
        let input_date_birth= elemUiDateBirth.getValue();
        let input_num_dead  = componentNumDead.getValue();
        let input_num_male  = componentNumMale.getValue();
        let input_num_female= componentNumFemale.getValue();
        let input_staff     = componentStaff.getValue();
        
        
        input_elem          = elemUiDateBirth.getElemText();
        
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
        
        input_elem          = componentNumDead.getElemText();
        
        try{
            number_dead = parseInt(input_num_dead)
        }catch (error){
            componentNumDead.setTextInvalid(INVALID_MSG_NUM_INPUT);
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
            componentNumDead.setTextInvalid(INVALID_MSG_ZERO_INPUT);
            componentNumFemale.setTextInvalid(INVALID_MSG_ZERO_INPUT);
            componentNumMale.setTextInvalid(INVALID_MSG_ZERO_INPUT);
            
            validation = -1;
            
            input_elem = componentNumDead.getElemText();
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
        
        const bearer_token = localStorage.getItem('access_token');
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
                elemServerErrorMsg.style.display = 'none';
            },
  
            success: function(response){
                if (response.result.num == 0){
                    // If user is added as staff, pigFarm stafflist should be
                    // updated; otherwise it will not show up in staff  dropdown.
                    // Request pigFarm stafflist first
                    
                    const callback_success = function(){ 
                        thisObj.onSuccessUpdateBirth();
                        
                    };
                    
                    navigation.pigFarm.requestDataPigFarmStaffList(
                        callback_success, elemServerErrorMsg);
                    
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
        //  - should go back to Lactating Entry Page showing PigOps List; this  
        //      is important because any change in actual date_of_birth will 
        //      recalculate lactating pigops schedule.
        
        
        const cur_prod_status = curDataPigProd.pig_production.prod_status_id;
        
        if (cur_prod_status == PROD_STATUS.GESTATING){
            // Remove from curDataPigProd from gestating List
            const pig_prod_hid = curDataPigProd.pig_production.hid;
            const prod_list = navigation.pigFarm.managerPigProd.dataGestatingList;
            
            navigation.pigFarm.managerPigProd.removeFromProdList(
                    pig_prod_hid, prod_list);
        
            
            
            // Request sow update as the number of birth and output piglets has changed.
            const sow_hid   = curDataPigProd.sow.hid;
            const sow_boar_list = navigation.pigFarm.managerSowBoar.dataSowList;
            
            const callback_success_sow_update = function(data){
                navigation.pigFarm.managerSowBoar.replaceInSowBoarList(sow_hid, 
                    sow_boar_list, data); 
            };
            
            navigation.pigFarm.managerSowBoar.requestSowBoarEntry(sow_hid, 
                callback_success_sow_update, elemServerErrorMsg);
            
            
            
            // Update Lactating list
            const callback_success = function(data){
                // Go Back to Lactating List Page
                const operation_type = PIG_OPERATION_TYPE.LACTATING_PIGLETS;
                navigation.managerNavLinks.onClickNavProdGestaLacta(null, operation_type);
            };
            
            // Request Lactating List
            navigation.pigFarm.managerPigProd.requestPigProdList(
                PIG_PROD_TYPE.LACTATING, callback_success, elemServerErrorMsg);
        }
        
        
        if (cur_prod_status == PROD_STATUS.LACTATING){
            const pig_prod_hid = curDataPigProd.pig_production.hid;
            const pig_prod_pid = curDataPigProd.pig_production.farm_prod_id;
            const prod_list = navigation.pigFarm.managerPigProd.dataLactatingList;
            
            const callback_success = function(data){
                navigation.pigFarm.managerPigProd.replaceInProdList(
                        pig_prod_hid, prod_list, data);
                
                const show_options = {
                    tab_lacta: parentObj.TAB_LACTA_PIGOPS
                };
                navigation.onClickProdLactatingEntry(pig_prod_pid, show_options);
            };
            
            //request updated prod_entry data and replace curDataPigProd;
            navigation.pigFarm.managerPigProd.requestPigProdEntry(pig_prod_hid, 
                callback_success, elemServerErrorMsg);
                
        }
        
    }

}
