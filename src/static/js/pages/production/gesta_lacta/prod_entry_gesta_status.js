// prod_entry_gesta_status.js

// March 9, 2026
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

import {UiInputDatePicker}          from '../../common/ui/input_datepicker.js';
import {UiInputTextWithCounter}     from '../../common/ui/input_text_with_counter.js';



import {CommonSelectOptions}        from '../../common/common_select_options.js';




export function ProdEntryUpdateGestaStatus(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    
    
    /*
    Typical settings = {
        navigation:             navigation,
        parentObj:              this,
        uniqueKey:              'pig-prod-gesta-status',
        elemIdDivContainer:     elemTabGestaBirth
    };
    */
    const settings              = input_settings;
    
    const elemDivContainer      = settings.elemDivContainer;
    

    let elemUiDateStatus        = null;
    
    
    let elemIdStatusInv         = null;
    
    let elemUiNotes             = null;
    
    let elemIdServerErrorMsg    = null;
    let elemIdBtnSave           = null;
    
    
    let elemStatusInv           = null;

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
        
        elemUiDateStatus         = new UiInputDatePicker({
            uniqueKey:          `${settings.uniqueKey}-date-status`,
        
            className:          'form-group-date',
            textLabel:          'Date Status',
            isRequired:         true,
            invalidFeedBack:    'Please enter a valid date.',
            helpText:           null
        });
        
        
        elemUiNotes             = new UiInputTextWithCounter({
            uniqueKey:          `${settings.uniqueKey}-notes`,
            
            isTextArea:         true,
            className:          'form-group-text-area',
            textLabel:          'Notes',
            isRequired:         true,
            textMaxChars:       160,
            rows:               3,
            helpText:           null  
        });
        
        elemIdStatusInv         = `${settings.uniqueKey}-status-inv`;
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        
        const html_date_status  = elemUiDateStatus.getHtml();
        const html_notes        = elemUiNotes.getHtml(); 
        
        
        const html = `
<div class="modal-body">
    <h2 class="tab-title">
        Update Gestating Status
    </h2>
    
    <!-- Warning box -->
    <div class="warning-box">
        <div class="warning-header">
            <i class="bi bi-exclamation-triangle-fill warning-icon"></i>
            <span>Update Gestating Status</span>
        </div>
        <div>
            Updating Gestating status to any of the options below will remove 
            the entry from  Prod Gestating List. These are the unusual cases 
            of pig gestation. <b>This cannot be undone.</b>
        </div>
    </div>
    
    
    
    <!-- Date Status input -->
    ${html_date_status}
    
    <!-- Radio buttons -->
    <div class="mb-3">
        <label class="form-label d-block">Status Options <span class="text-danger">*</span></label>
        
        <div class="form-check mb-2">
            <input class="form-check-input" type="radio" name="statusOption" id="deleteOption" value="Delete" required>
            <label class="form-check-label" for="deleteOption">
                Delete. Invalid Entry
            </label>
        </div>
        
        <div class="form-check mb-2">
            <input class="form-check-input" type="radio" name="statusOption" id="notPregnantOption" value="NotPregnant">
            <label class="form-check-label" for="notPregnantOption">
                Not Pregnant. Sow Reheat
            </label>
        </div>
        
        <div class="form-check mb-2">
            <input class="form-check-input" type="radio" name="statusOption" id="noLiveOption" value="NoLive">
            <label class="form-check-label" for="noLiveOption">
                Pig has given status but no live piglets.
            </label>
        </div>
        
        
        <div class="invalid-feedback" id="${elemIdStatusInv}">Please select option. </div>

    </div>
    
    <!-- Notes input -->
    ${html_notes}
                

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
        elemUiDateStatus.afterHtmlRender();
        elemUiNotes.afterHtmlRender();
        
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        
        elemStatusInv           = elemDivContainer.querySelector('#'+elemIdStatusInv);
        
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
        
          
        elemUiDateStatus.reset();
        
        elemUiNotes.reset();
        
        elemServerErrorMsg.style.display = 'none';
    }
    
    
    this.beforeShow = function(data_pig_prod, options){
        thisObj._resetForm();
        
        
        curDataPigProd = data_pig_prod;
        
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
        
       
        let input_date_status= elemUiDateStatus.getValue();
        let input_notes     = elemUiNotes.getValue().trim();
        
        
        
        input_elem          = elemUiDateStatus.getElemText();
        
        // Convert date to YYYY-MM-DD format
        const dt_status      = new Date(input_date_status);
        if (isNaN(dt_status.getTime())){
            validation      = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        const dt_status_s   = dt_status.toLocaleDateString('en-CA');
        validation          = 0
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        
        const checkedRadio = elemDivContainer.querySelector('input[name="statusOption"]:checked');
        
        if (checkedRadio == null){
            elemStatusInv.style.display ='block';
            return;
        } 
        else{
            elemStatusInv.style.display ='none';
        }
        
        const value = checkedRadio.value;
        
        let prod_status_id = 0;
        
        
        // Delete has no mapped prod_status_id in the backend.
        // The prod_status_id is for operations only. The delete action is
        // interpreted as user entry error.
        // The Delete status will be mapped to a special number
        // SOW_STATUS.DELETE. But this will not be marked as
        // sow_boar.is_disposed but will be marked as
        // sow_boar.flag.is_deleted = 1;
        //
        // When disposed pigs are queried in the front end,
        // both the disposed pigs and deleted pigs will be returned.
        
        switch(value){
            case 'Delete':{
                prod_status_id = PROD_STATUS.DELETE;
                break;
            }
            
            case 'NotPregnant':{
                prod_status_id = PROD_STATUS.NOT_PREGNANT;
                break;
            }
            
            case 'NoLive':{
                prod_status_id = PROD_STATUS.NO_LIVE_PIGLETS;
                break;
            }
            
        }

        
        
        
        
        // TODO need to check if data has changed or not;
        // because changing date of status is an expensive operation in back end
        
        
        
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
            return;
        }
        
        
        const user_hid      = navigation.userControl.getUserHid();
        const base_url      = window.location.origin;
        
        let url = `${base_url}/pig_prod/update_status`;
        
        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'pig_prod_hid':     curDataPigProd.pig_production.hid,
            'date_status':      dt_status_s,
            'prod_status_id':   prod_status_id,
            'notes':            input_notes
        };
        
        
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
                    
                    // Update Gestating list
                    const callback_success = function(data){
                        // Go Back to Gestating List Page
                        const operation_type = PIG_OPERATION_TYPE.GESTATING;
                        navigation.managerNavLinks.onClickNavProdGestaLacta(null, operation_type);
                    };
                    
                    const callback_offline = function(){
                        // TODO: what to do
                    };

                    
                    // Request Gestating List
                    navigation.pigFarm.managerPigProd.requestPigProdList(
                        PIG_PROD_TYPE.GESTATING, callback_success, 
                        callback_offline, elemServerErrorMsg);

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
  
    
    
}
