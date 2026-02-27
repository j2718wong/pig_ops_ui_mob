// February 26, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}        from '../common/page_view_basic.js';

import {APPLICATION,
        SOW_STATUS,
        PIG_OPERATION_TYPE,
        PROD_STATUS,
        PIG_PROD_TYPE}              from '../../constants.js';


import {ComponentPlusMinusInput}    from '../common/ui/comp_plus_minus_input.js';

import {addValidationClassToElem}   from '../common/ui/ui_utils.js';






export function PageAccOpsSettingsEdit(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    
    /*
    Typical settings = {
        navigation:             navigation,
        uniqueKey:              'pig-prod-gesta-birth',
        elemIdDivContainer:     elemTabGestaBirth
    };
    */
    const settings              = input_settings;
    
    
    const INVALID_MSG_NUM_INPUT     = 'Please enter a valid number.';
    
    
    
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
    
    let elemIdNavPrevEntry      = null;
    let elemIdNavNextEntry      = null;
    
    let elemIdServerErrorMsg    = null;
    let elemIdBtnSave           = null;
    
    let componentNumDaysWean    = null;
    let componentNumDaysHarvest = null;
    let componentNumDaysHarvest2= null;
    
    let elemIdWeightUnit        = null;
    
    let elemNavPrevEntry        = null;
    let elemNavNextEntry        = null;
    
    
    let elemDateMatingDay0      = null;
    let elemDateMatingDay1      = null;
    
    let elemDateBirthDay0       = null;
    let elemDateBirthDay1       = null;
    
    let elemWeightUnit          = null;
    
    
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
        elemIdNavPrevEntry      = `${settings.uniqueKey}-page-title-prev`;
        elemIdNavNextEntry      = `${settings.uniqueKey}-page-title-next`;
        
        
        componentNumDaysWean    = new ComponentPlusMinusInput({
            uniqueKey:          `${settings.uniqueKey}-numdays-wean`,
            
            className:          'form-group-number',
            textLabel:          'NumDays wean since birth.',
            minValue:           24,
            step:               1,
            isRequired:         true,
            invalidFeedBack:    null,
            helpText:           'Use to set target date wean.'
        });
        
        
        componentNumDaysHarvest  = new ComponentPlusMinusInput({
            uniqueKey:          `${settings.uniqueKey}-numdays-harvest`,
            
            className:          'form-group-number',
            textLabel:          'NumDays harvest since birth.',
            minValue:           24,
            step:               1,
            isRequired:         true,
            invalidFeedBack:    null,
            helpText:           'Use to set target date Fattening harvest.'
        });
        
        
        componentNumDaysHarvest2  = new ComponentPlusMinusInput({
            uniqueKey:          `${settings.uniqueKey}-numdays-harvest2`,
            
            className:          'form-group-number',
            textLabel:          'NumDays harvest since wean.',
            minValue:           24,
            step:               1,
            isRequired:         true,
            invalidFeedBack:    null,
            helpText:           'Use to set target date Fattening harvest.'
        });
        
        
        
        
        elemIdWeightUnit        = `${settings.uniqueKey}-weight-unit`;
        
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        
        
        const html_days_wean    = componentNumDaysWean.getHtml();
        const html_harvest      = componentNumDaysHarvest.getHtml();
        const html_harvest_2    = componentNumDaysHarvest2.getHtml();
        
        
        
        const html = `
        
    <div class="mobile-container">
        
        <div class="nav-left-right">
            <button class="nav-button blue" id="${elemIdNavPrevEntry}"><i class="fa-solid fa-arrow-left"></i></button>
                    
            <span>
                <span class="nav-title blue"></span>
                <span class="nav-title blue">Pig Ops Settings</span>
            </span>
            
            <button class="nav-button blue" id="${elemIdNavNextEntry}"><i class="fa-solid fa-arrow-right"></i></button>
                
        </div>
        
        
        
        <div class="modal-body">
    
            <div class="form-group-select">
                <label class="form-label">Date of Mating</label>
                
                <div class="form-check mb-2">
                    <input class="form-check-input" type="radio" name="dateMating" id="DateMatingDay0" value="Day0" required>
                    <label class="form-check-label" for="DateMatingDay0">
                        Date of Mating is Day 0
                    </label>
                </div>
                
                <div class="form-check mb-2">
                    <input class="form-check-input" type="radio" name="dateMating" id="DateMatingDay1" value="Day1">
                    <label class="form-check-label" for="DateMatingDay1">
                        Date of Mating is Day 1
                    </label>
                </div>
                                    
            </div>
            
            
            <div class="form-group-select">
                <label class="form-label">Date of Birth</label>
                
                <div class="form-check mb-2">
                    <input class="form-check-input" type="radio" name="dateBirth" id="DateBirthDay0" value="Day0" required>
                    <label class="form-check-label" for="DateBirthDay0">
                        Date of Birth is Day 0
                    </label>
                </div>
                
                <div class="form-check mb-2">
                    <input class="form-check-input" type="radio" name="dateBirth" id="DateBirthDay1" value="Day1">
                    <label class="form-check-label" for="DateBirthDay1">
                        Date of Birth is Day 1
                    </label>
                </div>
                                    
            </div>
            
            
            ${html_days_wean}
            
            ${html_harvest}
            
            ${html_harvest_2}
            
            <div class="form-group-select">
                <label for="${elemIdWeightUnit}" class="form-label">
                    Weight Unit
                </label>
                            
                <select class="form-select" id="${elemIdWeightUnit}" required>
                    <option value="kg">kg</option>
                    <option value="lb">lb</option>
                </select>
            </div>
        
            
            
            <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
            
            <!-- Footer Buttons -->
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="${elemIdBtnSave}">
                    <i class="fas fa-save me-2"></i>Save Changes
                </button>
            </div>
        </div>

        
    </div>


        `;
        
        return html
    }
    
    
    this.afterHtmlRender = function(){
        componentNumDaysWean.afterHtmlRender();
        componentNumDaysHarvest.afterHtmlRender();
        componentNumDaysHarvest2.afterHtmlRender();
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemNavPrevEntry        = elemDivContainer.querySelector('#'+elemIdNavPrevEntry);
        elemNavNextEntry        = elemDivContainer.querySelector('#'+elemIdNavNextEntry);
        
        
        elemDateMatingDay0      = elemDivContainer.querySelector('#DateMatingDay0');
        elemDateMatingDay1      = elemDivContainer.querySelector('#DateMatingDay1');
        
        elemDateBirthDay0       = elemDivContainer.querySelector('#DateBirthDay0');
        elemDateBirthDay1       = elemDivContainer.querySelector('#DateBirthDay1');
        
        elemWeightUnit          = elemDivContainer.querySelector('#'+elemIdWeightUnit);
        
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
        
        componentNumDaysWean.reset();
        componentNumDaysHarvest.reset();
        componentNumDaysHarvest2.reset();
        
        
        elemServerErrorMsg.style.display = 'none';
    }
    
    
    this.beforeShow = function(options){
        thisObj._resetForm();
        
        thisObj.populateForm();
        
        // Set up listeners for navigation arrows
        elemNavPrevEntry.onclick = function(){
            navigation._onClickNavAccPigOps(null, PIG_OPERATION_TYPE.GILT);
        }

        elemNavNextEntry.onclick = function(){
            navigation._onClickNavAccPigOps(null, PIG_OPERATION_TYPE.GESTATING);
        }
        
        
    }
    
    
    this.populateForm = function(){
        const acc_settings_ops  = navigation.pigFarm.getSettingsOperations();
        
        console.log(acc_settings_ops)
        
        if (acc_settings_ops.day_1_on_date_of_insem == 0){
            elemDateMatingDay0.checked = true;
        }
        else{
            elemDateMatingDay1.checked = true;
        }
        
        
        if (acc_settings_ops.day_1_on_date_of_birth == 0){
            elemDateBirthDay0.checked = true;
        }
        else{
            elemDateBirthDay1.checked = true;
        }
        
        componentNumDaysWean.setValue(acc_settings_ops.num_days_wean);
        
        componentNumDaysHarvest.setValue(acc_settings_ops.num_days_harvest_from_birth);
        
        componentNumDaysHarvest2.setValue(acc_settings_ops.num_days_harvest_from_wean);
        
        elemWeightUnit.value = acc_settings_ops.weight_unit;
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
        
        
        let input_num_days_wean     = componentNumDaysWean.getValue();
        let input_num_days_harvest  = componentNumDaysHarvest.getValue();
        let input_num_days_harvest_2= componentNumDaysHarvest2.getValue();
        
        let input_weight_unit       
        
       
        const checkedRadioMating = elemDivContainer.querySelector('input[name="dateMating"]:checked');
        let value = checkedRadioMating.value;
        
        let day_1_on_date_of_insem = 0;
        
        
        switch(value){
            case 'Day0':{
                day_1_on_date_of_insem = 0;
                break;
            }
            
            case 'Day1':{
                day_1_on_date_of_insem = 1;
                break;
            }
        }
        
        
        const checkedRadioBirth = elemDivContainer.querySelector('input[name="dateBirth"]:checked');
        value = checkedRadioMating.value;
        
        let day_1_on_date_of_birth = 0;
        
        
        switch(value){
            case 'Day0':{
                day_1_on_date_of_birth = 0;
                break;
            }
            
            case 'Day1':{
                day_1_on_date_of_birth = 1;
                break;
            }
        }
        
        
        let num_days_wean = 0;
        let num_days_harvest = 0;
        let num_days_harvest_2 = 0;
        
        input_elem          = componentNumDaysWean.getElemText();
        
        try{
            num_days_wean = parseInt(input_num_days_wean)
        }catch (error){
            componentNumDaysWean.setTextInvalid(INVALID_MSG_NUM_INPUT);
            validation = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        
        input_elem          = componentNumDaysHarvest.getElemText();
        
        try{
            num_days_harvest = parseInt(input_num_days_harvest)
        }catch (error){
            componentNumDaysHarvest.setTextInvalid(INVALID_MSG_NUM_INPUT);
            validation = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        
        input_elem          = componentNumDaysHarvest2.getElemText();
        
        try{
            num_days_harvest_2 = parseInt(input_num_days_harvest_2)
        }catch (error){
            componentNumDaysHarvest.setTextInvalid(INVALID_MSG_NUM_INPUT);
            validation = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        
        
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
            return;
        }
        
        
        const user_hid      = navigation.userControl.getUserHid();
        const base_url      = window.location.origin;
        
        let url = `${base_url}/account/update_settings`;
        
        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            
            'day_1_on_date_insem':      day_1_on_date_of_insem,
            'day_1_on_date_of_birth':   day_1_on_date_of_birth,
            
            'days_wean':                num_days_wean,
            'days_harvest_from_birth':  num_days_harvest,
            'days_harvest_from_wean':   num_days_harvest_2,
            
            'weight_unit':              elemWeightUnit.value
        };
        
        
        
        // TODO: check if there is a change in the data
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
                elemServerErrorMsg.style.display = 'none';
            },
  
            success: function(response){
                if (response.result.num == 0){
                    
                    // Updating acc_ops_settings has a series of updates
                    // 1.) Request the account_settings and replace the existing
                    // navigation.pigFarm.getSettingsOperations()
                    
                    // 2.) If either day_1_on_date_insem, day_1_on_date_of_birth
                    //  is changed, will request all pig_prod_list,
                    //  both gestating and lacatating; This is because 
                    //  the scheduled pig operations have also changed.
                    
                    // 3.) No additional requests needed if the change 
                    //      from the remaining settings.
                    
                    
                    // 
                    const acc_settings_ops  = navigation.pigFarm.getSettingsOperations();
        

                    // Check if either of these has changed
                    const cur_day_1_on_date_of_insem = acc_settings_ops.day_1_on_date_of_insem;
                    const cur_day_1_on_date_of_birth = acc_settings_ops.day_1_on_date_of_birth;
        
        
                    let has_changed = 0;
                    if (cur_day_1_on_date_of_insem != day_1_on_date_of_insem) {
                        has_changed = 1;
                    }
                    
                    if (cur_day_1_on_date_of_birth != day_1_on_date_of_birth) {
                        has_changed = 1;
                    }

                    
                    const callback_success = function(){ 
                        
                    };
                    
                    
                    // Request Account settings
                    
                    
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
  
    
    this.onSuccessUpdateAccSettings = function(){
    }
}
