// February 1, 2026
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

import {addValidationClassToElem}   from '../../common/ui/ui_utils.js';

import {UiInputDatePickerGesta}     from './components/input_datepicker_gesta.js';

import {ComponentStaffFormGroup}    from '../../common/ui/comp_staff_form_group.js';
import {ComponentPlusMinusInput}    from '../../common/ui/comp_plus_minus_input.js';
import {ComponentWeightPerPig}      from '../harvest/comp_weight_per_pig.js';

import {CommonSelectOptions}        from '../../common/common_select_options.js';




export function ProdEntryWean(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    
    const INVALID_MSG_NUM_INPUT     = 'Please enter a valid number.';
    const INVALID_MSG_ZERO_INPUT    = 'At least one of these numbers cannot not be zero';
    
    
    const COUNT_PIGLETS_COMBINED    = 'combined';
    const COUNT_PIGLETS_SEPARATE    = 'separate';
    
    
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
    
    let elemIdWarningBox        = null;
    let elemIdSow               = null;
    let elemIdDaysSinceBirth    = null;
    let elemIdDobIsDay1         = null;
    
    let elemUiDateWean          = null;
    
    let componentNumTotal       = null;
    
    let componentNumFemale      = null;
    let componentNumMale        = null;

    let elemIdRdoCombinedCount  = null;
    let elemIdRdoSeparateCount  = null;
    let elemIdSeparateCountShow = null;
    
    let elemIdTotalWeight       = null;
    let elemIdAverageWeight     = null;
    
    
    let componentLWPerPig        = null;

    
    let elemIdServerErrorMsg    = null;
    let elemIdBtnSave           = null;
    
    
    
    let elemContentContainer    = null;
    
    let elemWarningBox          = null;
    let elemSow                 = null;
    let elemDaysSinceBirth      = null;
    let elemDobIsDay1           = null;

    let elemRdoCombinedCount    = null;
    let elemRdoSeparateCount    = null;
    let elemSeparateCountShow   = null;
    
    
    let elemTotalWeight         = null;
    let elemAverageWeight       = null;
    
    
    let elemServerErrorMsg      = null;
    let elemBtnSave             = null;
    

    let curDataPigProd          = null;
    
    let dtCurrentDate           = null;
    
    let curCountPiglets         = null;
    
    let totalWeanWeight         = null;
    
    
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
                
        elemIdWarningBox        = `${settings.uniqueKey}-cannot-update`;
        
        elemIdSow               = `${settings.uniqueKey}-sow`;
        elemIdDaysSinceBirth    = `${settings.uniqueKey}-num-days`;
        elemIdDobIsDay1         = `${settings.uniqueKey}-day1`;
        
        
        
        elemUiDateWean          = new UiInputDatePickerGesta({
            uniqueKey:          `${settings.uniqueKey}-date-wean`,
        
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
        
        
        elemIdRdoCombinedCount  = `${settings.uniqueKey}-combined-count`;
        elemIdRdoSeparateCount  = `${settings.uniqueKey}-separate-count`;
        
        elemIdSeparateCountShow = `${settings.uniqueKey}-separate-count-show`;
        
        elemIdTotalWeight       = `${settings.uniqueKey}-total-weight`;
        elemIdAverageWeight     = `${settings.uniqueKey}-average-weight`;
        
        
        componentLWPerPig        = new ComponentWeightPerPig({
            navigation:         navigation,
            uniqueKey:          `${settings.uniqueKey}-lw-per-pig`,
            elemDivContainer:   elemDivContainer,
        
            
            labelText:          'Weight Per Pig (Optional)',
            helpText:           ''
        });
        
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        
        
        const html_date_wean    = elemUiDateWean.getHtml();
        
        const html_num_female   = componentNumFemale.getHtml();
        const html_num_male     = componentNumMale.getHtml();
        const html_num_total    = componentNumTotal.getHtml();
        const html_weights_pp   = componentLWPerPig.getHtml();


        
        const html = `
<div class="modal-body" id="${elemIdContentContainer}">
    <h2 class="tab-title">
        Weaning Information
    </h2>
    
    <div class="warning-box" id="${elemIdWarningBox}">
        Setting the <b>Date Wean</b> will update this production entry from 
        Lactating Status to Fattening Status and will be removed from Production 
        Lactating List. Will be put in Production Fattening List. 
        <b>This cannot be undone.</b>
    </div>
    
    <!-- 1. Sow Field cannot be edited. -->
    <div class="form-group-text">
        <label class="form-label" style="margin-bottom:0;">Sow Name</label>
        <span class="" id="${elemIdSow}"></span>
    </div>
    
    
    <div class="form-group-text">
        <label for="${elemIdDaysSinceBirth}" class="form-label" style="margin-bottom:0;">Days since Birth</label>
        <div style="display:flex; justify-content:space-between; align-items:flex-end;">
            <span class="read-only-field" id="${elemIdDaysSinceBirth}"></span>
            <span class="" id="${elemIdDobIsDay1}" style="color:var(--dark-gray)">Day of Birth is Day 1</span>
        </div>
    </div>
    
    ${html_date_wean}
    
    <!-- Radio buttons -->
    <div class="mb-3" style="padding-left:5px;">
        <label class="form-label d-block">Weaned Piglets Count</label>
        
        <div class="form-check mb-2">
            <input class="form-check-input" type="radio" 
                name="${settings.uniqueKey}-countWean" 
                id="${elemIdRdoCombinedCount}" 
                value="${COUNT_PIGLETS_COMBINED}">
            
            <label class="form-check-label" for="${elemIdRdoCombinedCount}">
                Combined Count
            </label>
        </div>
        
        <div class="form-check mb-2">
            <input class="form-check-input" type="radio" 
                name="${settings.uniqueKey}-countWean" 
                id="${elemIdRdoSeparateCount}" 
                value="${COUNT_PIGLETS_SEPARATE}">
            
            <label class="form-check-label" for="${elemIdRdoSeparateCount}">
                Separate Male and Female count
            </label>
        </div>
        
    </div>
    
    
    <!-- Number of Total Piglets with plus/minus buttons -->
    ${html_num_total}
    
    <div id="${elemIdSeparateCountShow}">
        <!-- Number of Female Piglets with plus/minus buttons -->
        ${html_num_female}
        
        <!-- Number of Male Piglets with plus/minus buttons -->
        ${html_num_male}
    </div>
    
    <div class="form-group-number">
        <label class="form-label">
            Wean Weight
        </label>
        
    
        <div style="display:flex; justify-content:space-between; align-items:flex-end;">
            <span>
                Total:  
                <span class="read-only-field" id="${elemIdTotalWeight}">----</span>
            </span>
            
            <span>
                Average:
                <span class="read-only-field" id="${elemIdAverageWeight}">----</span>
            </span>
        </div>
        
    </div>
    
    ${html_weights_pp}
    
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
        
        componentLWPerPig.afterHtmlRender();
        
       
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemContentContainer    = elemDivContainer.querySelector('#'+elemIdContentContainer);
        
        elemWarningBox          = elemDivContainer.querySelector('#'+elemIdWarningBox);
        elemSow                 = elemDivContainer.querySelector('#'+elemIdSow);
        elemDaysSinceBirth      = elemDivContainer.querySelector('#'+elemIdDaysSinceBirth);
        elemDobIsDay1           = elemDivContainer.querySelector('#'+elemIdDobIsDay1);
        
        
        elemRdoCombinedCount    = elemDivContainer.querySelector('#'+elemIdRdoCombinedCount);
        elemRdoSeparateCount    = elemDivContainer.querySelector('#'+elemIdRdoSeparateCount);
        elemSeparateCountShow   = elemDivContainer.querySelector('#'+elemIdSeparateCountShow);
        
        elemTotalWeight         = elemDivContainer.querySelector('#'+elemIdTotalWeight);
        elemAverageWeight       = elemDivContainer.querySelector('#'+elemIdAverageWeight);
        
        elemServerErrorMsg      = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);
        elemBtnSave             = elemDivContainer.querySelector('#'+elemIdBtnSave);
    
    }
    
    
    this._processAfterHtmlRender = function(){
        componentLWPerPig.callbackOnChangeInputs = thisObj.onChangeLWPerPigInput;
    }
    
    
    this._bindEventListeners = function(){
        const radios_name = `${settings.uniqueKey}-countWean`; 
        const radios = elemDivContainer.querySelectorAll(`input[name="${radios_name}"]`);
        
        radios.forEach(radio => {
            radio.addEventListener('change', function(event){
                curCountPiglets = this.value;

                if (curCountPiglets == 'separate'){
                    componentNumTotal.hide();
                    elemSeparateCountShow.style.display = 'block';
                }
                else{
                    componentNumTotal.show();
                    elemSeparateCountShow.style.display = 'none';
                }
            });
        });
        
        elemBtnSave.addEventListener('click', function() {
            thisObj.onClickSaveButton();
        });
        
        
    }
    
    
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        
          
        elemUiDateWean.reset();
        
        componentNumTotal.reset();
        componentNumFemale.reset();
        componentNumMale.reset();
        
        elemTotalWeight.textContent = '----';
        elemAverageWeight.textContent = '----';
        
        componentLWPerPig.reset();

        
        curCountPiglets = COUNT_PIGLETS_COMBINED;
        if (curCountPiglets == COUNT_PIGLETS_SEPARATE){
            elemRdoSeparateCount.dispatchEvent(new Event('change', {bubbles:true}));
        }
        else{
            elemRdoCombinedCount.dispatchEvent(new Event('change', {bubbles:true}));
        }
        
        elemServerErrorMsg.style.display = 'none';
    }
    
    
    this.beforeShow = function(data_pig_prod, options){
        thisObj._resetForm();
        
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
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
        
        
        
        // Set Number of days since birth
        const acc_settings_ops  = navigation.pigFarm.getSettingsOperations();
        const pig_prod_birth    = curDataPigProd.birth;
        
        const diff_days = thisObj.calculateNumDaysSinceBirth(
            pig_prod_birth.date_actual, dtCurrentDate, acc_settings_ops);
        
        elemDaysSinceBirth.textContent = `Day ${diff_days}`;
        
        
        // Set Date of birth is Day 1 or Day 0 
        let s_day_1 = ''
        if (acc_settings_ops.day_1_on_date_of_birth == 1){
            s_day_1 = 'Date of Birth is Day 1';
        }
        else{
            s_day_1 = 'Date of Birth is Day 0';
        }
        elemDobIsDay1.textContent = s_day_1;
        
        
        // Populate rest of data if available
        if (curDataPigProd.weaning && curDataPigProd.weaning.date_weaning) {
            thisObj.populateForm();
        }
    }
    
    
    this.populateForm = function(){
        
        
        console.log('wqean populateForm');
        console.log(curDataPigProd);
        
        // Set Date Wean
        const weaning       = curDataPigProd.weaning;
        const date_weaning  = weaning.date_weaning;
       
        elemUiDateWean.setDate(date_weaning );
        
        
        // Set Number Weaned pigs
        if (weaning.num_pigs) {
            componentNumTotal.setValue(weaning.num_pigs);
            curCountPiglets = COUNT_PIGLETS_COMBINED;
        }
        else{
            if (weaning.num_pigs_f){
               componentNumFemale.setValue(weaning.num_pigs_f)
            }
            
            if (weaning.num_pigs_m){
               componentNumMale.setValue(weaning.num_pigs_m)
            }
            
            curCountPiglets = COUNT_PIGLETS_SEPARATE;
        }
       

        if (curCountPiglets == COUNT_PIGLETS_SEPARATE){
            elemRdoSeparateCount.dispatchEvent(new Event('change', {bubbles:true}));
        }
        else{
            elemRdoCombinedCount.dispatchEvent(new Event('change', {bubbles:true}));
        }
        
        
        
        // Set weight per pig if there is any
        if (weaning.weight_pp){
            componentLWPerPig.setPigWeights(weaning.weight_pp);
        }
    }
    
    
    this.onChangeLWPerPigInput = function(){
        const acc_settings_ops  = navigation.pigFarm.getSettingsOperations();
        const weight_unit       = acc_settings_ops.weight_unit;
        
        
        const pig_weights = componentLWPerPig.getPigWeights();
        
        if (pig_weights.length > 0){
            let total_weight = 0;
            for (const cur_entry of pig_weights){
                total_weight += parseFloat(cur_entry);
            }
            
            // Fix for crazy decimals
            total_weight = Math.round(total_weight * 10) / 10;
            
            totalWeanWeight = total_weight;
            
            
            const average   = total_weight / pig_weights.length;
            
            const s_average = Math.round(average * 10) / 10;
            elemAverageWeight.textContent   = `  ${s_average} ${weight_unit}`;
            elemTotalWeight.textContent     = `  ${total_weight} ${weight_unit}`;

        }
        else{
            totalWeanWeight = null;
            
            elemAverageWeight.textContent = '----';
            elemTotalWeight.textContent = '----';
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
        
       
        let input_date_wean     = elemUiDateWean.getValue();
        let input_num_total     = componentNumTotal.getValue();
        let input_num_male      = componentNumMale.getValue();
        let input_num_female    = componentNumFemale.getValue();
        
        
        
        input_elem          = elemUiDateWean.getElemText();
        
        // Convert date to YYYY-MM-DD format
        const dt_wean      = new Date(input_date_wean);
        if (isNaN(dt_wean.getTime())){
            validation      = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        const dt_wean_s   = dt_wean.toLocaleDateString('en-CA');
        validation          = 0
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        
        // Validate number counts
        let number_male     = 0;
        let number_female   = 0;
        let number_total    = 0;
        
        
        if (curCountPiglets == COUNT_PIGLETS_SEPARATE) {
        
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
        }
        else{
            input_elem          = componentNumTotal.getElemText();
        
            try{
                number_total = parseInt(input_num_total)
            }catch (error){
                componentNumTotal.setTextInvalid(INVALID_MSG_NUM_INPUT);
                validation = -1;
                addValidationClassToElem(input_elem, validation);
                if (validation != 0) {return;}
            }
        }
        
        
        
        if (number_total == 0 && number_male == 0 && number_female == 0){
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
        
        
        let weight_pp = null;
        const pig_weights = componentLWPerPig.getPigWeights();
        if (pig_weights && pig_weights.length > 0){
            weight_pp = pig_weights.join(',');
        }
        
       
        
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
            return;
        }
        
        
        const user_hid      = navigation.userControl.getUserHid();
        const base_url      = window.location.origin;
        
        let url = `${base_url}/pig_prod/update_weaning`;
        
        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'pig_prod_hid':     curDataPigProd.pig_production.hid,
            
            'date_weaning':     dt_wean_s,
            'num_pigs_male':    number_male,
            'num_pigs_female':  number_female,
            
            'num_pigs':         number_total
        };
        
        
        if (curCountPiglets == COUNT_PIGLETS_SEPARATE){
            delete post_data.num_pigs;
        }
        else{
            delete post_data.num_pigs_male;
            delete post_data.num_pigs_female;
        }
        
        if (totalWeanWeight &&  totalWeanWeight > 0){
            post_data.total_weight = totalWeanWeight;
        }
        
        
        if (weight_pp){
            post_data.weight_pp = weight_pp;
        }
        
        
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
                    thisObj.onSuccessUpdateWean();
                    
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
  
    
    this.onSuccessUpdateWean = function(){
        // There are two cases that are covered for this:
        //
        // 1.) Case 1: curDataPigProd has no date_weaning (PROD_STATUS.LACTATING)
        // and date_weaning is updated; The sequence of steps that should happen is
        //  - remove curDataPigProd from lactating List
        //  - request Fattening List
        //  - open to Fattening List Page; not to Fattening Entry page; 
        //      this is to show that a new Fattening entry has been added.
        //
        // 2.) Case 2: curDataPigProd has date_weaning (PROD_STATUS.WEANING)
        // The sequence of steps that should happen is
        
        
        const cur_prod_status = curDataPigProd.pig_production.prod_status_id;
        
        if (cur_prod_status == PROD_STATUS.LACTATING){
            // Remove from curDataPigProd from lactating List
            const pig_prod_hid = curDataPigProd.pig_production.hid;
            const prod_list = navigation.pigFarm.managerPigProd.dataLactatingList;
            
            navigation.pigFarm.managerPigProd.removeFromProdList(
                    pig_prod_hid, prod_list);
        
            // Need to  resetLactaTable before viewing again Lacta Table page
            navigation.pageMobLactatingList.resetLactaTable();
                
        
        
            const callback_success = function(data){
                // Open to Fattening List
                navigation._onClickNavProdFattening();
            };
            
            // Request Fattening List
            navigation.pigFarm.managerPigProd.requestPigProdList(
                PIG_PROD_TYPE.FATTENING, callback_success, elemServerErrorMsg);
        
        
            
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
