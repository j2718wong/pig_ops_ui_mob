// January 2, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {UiInputDatePicker}      from '../common/ui/input_datepicker.js';
import {UiInputTextWithCounter} from '../common/ui/input_text_with_counter.js';
import {UiInputCheckBox}        from '../common/ui/input_checkbox.js';

import {getSowBoarReference}    from '../common/common_app.js';

import {addValidationClassToElem} from '../common/ui/ui_utils.js';


import {APPLICATION,
        PAGE_ID,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        REQUEST_ERROR_NUM}      from '../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}         from '../../utils.js';



export function PageSowBoarUpdateStatus(input_settings){
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    const MAXCHAR_NOTES         = 160;
    
    /*
    Typical settings = {
        navigation:             this,
        uniqueKey:              'sow-boar-update-status'
    };
    */
    const settings              = input_settings;
    
    const elemDivContainer      = settings.elemDivContainer;

    
    // Collapsible  panel elements
    let elemIdUpdateStatusShow  = null;
    
    let elemIdPanelHeader       = null;
    let elemIdPanelTitle        = null;
    let elemIdPanelArrowIcon    = null;
    let elemIdPanelBody         = null;
    
    
    let elemUiDateStatus        = null;
    let elemUiNotes             = null;
    
    //let elemIdDateStatus        = null;
    let elemIdStatusInv         = null;
    
    let elemIdServerErrorMsg    = null;
    let elemIdBtnUpdateStatus   = null;
    
    let elemUpdateStatusShow    = null;
    
    let elemPanelHeader         = null;
    let elemPanelTitle          = null;
    let elemPanelArrowIcon      = null;
    let elemPanelBody           = null;
    let elemDateStatus          = null;
    
    let elemStatusInv           = null;
    let elemServerErrorMsg      = null;
    let elemBtnUpdateStatus     = null;

    let showOptions             = null;
    
    
    let curDataSowBoar          = null;
    
    this.callbackOnSuccessUpdate = null;
    
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.getHtml = function(){
        elemIdUpdateStatusShow  = `${settings.uniqueKey}-show`;
        
        elemIdPanelHeader       = `${settings.uniqueKey}-panel-header`;
        elemIdPanelTitle        = `${settings.uniqueKey}-panel-title`;
        elemIdPanelArrowIcon    = `${settings.uniqueKey}-panel-arrow`;
        elemIdPanelBody         = `${settings.uniqueKey}-panel-body`;
        
        elemIdStatusInv         = `${settings.uniqueKey}-status-inv`;
        
        elemUiDateStatus        = new UiInputDatePicker({
            uniqueKey:          `${settings.uniqueKey}-date`,
        
            className:          'mb-3',
            textLabel:          'Date Status',
            isRequired:         true,
            invalidFeedBack:    'Please enter a date.',
            helpText:           null
        });
        
        
        elemUiNotes             = new UiInputTextWithCounter({
            uniqueKey:          `${settings.uniqueKey}-notes`,
            
            isTextArea:         true,
            className:          'mb-4',
            textLabel:          'Notes',
            isRequired:         true,
            textMaxChars:       MAXCHAR_NOTES,
            rows:               3,
            helpText:           'Please add some notes.'  
        });
        
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-error-msg`;
        elemIdBtnUpdateStatus   = `${settings.uniqueKey}-btn`;
        
        
        const html_date_status   = elemUiDateStatus.getHtml();
        const html_notes         = elemUiNotes.getHtml();
        
        
        const html = `
        <!-- Collapsible Panel -->
        <div class="collapsible-panel mb-4" id="${elemIdUpdateStatusShow}" style="margin-top:10px; padding-top:10px; border-top: 2px solid var(--corporate-blue);">
            <!-- Header with arrow icon -->
            <div class="collapsible-header" id="${elemIdPanelHeader}">
                <span id="${elemIdPanelTitle}">Update Pig Status</span>
                <i class="bi bi-chevron-down arrow-icon" id="${elemIdPanelArrowIcon}"></i>
            </div>
            
            <!-- Body content -->
            <div class="collapsible-body" id="${elemIdPanelBody}">
                <!-- Warning box -->
                <div class="warning-box">
                    <div class="warning-header">
                        <i class="bi bi-exclamation-triangle-fill warning-icon"></i>
                        <span>Update Pig Status</span>
                    </div>
                    <div>
                        Updating pig status to any of the options below will remove it from the active list.
                        <b>This cannot be undone.</b>
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
                        <input class="form-check-input" type="radio" name="statusOption" id="soldOption" value="Sold">
                        <label class="form-check-label" for="soldOption">
                            Pig is Sold
                        </label>
                    </div>
                    
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="radio" name="statusOption" id="culledOption" value="Culled">
                        <label class="form-check-label" for="culledOption">
                            Pig is Culled
                        </label>
                    </div>
                    
                    <div class="form-check mb-3">
                        <input class="form-check-input" type="radio" name="statusOption" id="deadOption" value="Dead">
                        <label class="form-check-label" for="deadOption">
                            Pig is Dead
                        </label>
                    </div>
                    
                    <div class="invalid-feedback" id="${elemIdStatusInv}">Please select option. </div>
        
                </div>
                
                <!-- Notes input -->
                ${html_notes}
                
                <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
                
                <!-- Buttons -->
                <div class="d-flex justify-content-between">
                    <button class="btn btn-primary" id="${elemIdBtnUpdateStatus}">Update Status</button>
                </div>
                
            </div>
        </div>
        
        `;
        
        return html;
        
    }
    
    
    this.afterHtmlRender = function(){
        
        elemUiDateStatus.afterHtmlRender();
        elemUiNotes.afterHtmlRender();
        
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        
        elemUpdateStatusShow    = document.getElementById(elemIdUpdateStatusShow);
        
        elemPanelHeader         = document.getElementById(elemIdPanelHeader);
        elemPanelTitle          = document.getElementById(elemIdPanelTitle);
        elemPanelArrowIcon      = document.getElementById(elemIdPanelArrowIcon);
        elemPanelBody           = document.getElementById(elemIdPanelBody);
        
        elemStatusInv           = document.getElementById(elemIdStatusInv);
        elemServerErrorMsg      = document.getElementById(elemIdServerErrorMsg);
        elemBtnUpdateStatus     = document.getElementById(elemIdBtnUpdateStatus);
    }
    
    
    this._processAfterHtmlRender = function(){
    }
    
    
    this._bindEventListeners = function(){
        
        elemPanelHeader.addEventListener('click', function() {
            thisObj.togglePanel();
        });
        
        elemBtnUpdateStatus.addEventListener('click', function() {
            thisObj.onClickUpdateStatus();
        });
    }
    
    
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        
        // Remove validation classes
        

        elemUiDateStatus.reset();
        elemUiNotes.reset();  
        
        const radios = elemDivContainer.querySelectorAll('input[name="statusOption"]');
        for (const cur_entry of radios){
            cur_entry.checked = false;
        }
        
        
        elemStatusInv.style.display = 'none';
        elemServerErrorMsg.style.display = 'none';
    }
    
    
    this.beforeShow = function(data_sow_boar, options){

        curDataSowBoar = data_sow_boar;
        if (data_sow_boar == null){return;}
        
        const sow_boar_name = getSowBoarReference(curDataSowBoar.sow_boar);
        
        elemPanelTitle.textContent = 'Update Pig Status: ' + sow_boar_name;
        
        thisObj._resetForm()
        
        if (!elemPanelBody.classList.contains('collapsed')) {
            thisObj.togglePanel();
        }
    }
    
       
    this.show = function(){
        elemUpdateStatusShow.style.display = 'block';
    }
    
    
    this.hide = function(){
        elemUpdateStatusShow.style.display = 'none';
    }
    
    
    this.togglePanel = function(){
        const panelBody = elemPanelBody;
        const panelHeader = elemPanelHeader;
        const arrowIcon = elemPanelArrowIcon;
        
        // Toggle visibility
        panelBody.classList.toggle('collapsed');
        
        // Toggle header border radius
        panelHeader.classList.toggle('collapsed');
        
        // Rotate arrow icon
        arrowIcon.classList.toggle('rotated');
    }
    
       
       
    this.onClickUpdateStatus = function(){
        let input_elem      = null;
        let validation      = 0;
        
        let is_duplicate    = 0;
        
       
        
        let input_date_status= elemUiDateStatus.getValue().trim();
        let input_notes     = elemUiNotes.getValue().trim();
        

        
        let dt_status_s     = null;
        
        input_elem          = elemUiDateStatus.getElemText();
        if (input_date_status.length == 0){
            validation = -1;
            addValidationClassToElem(input_elem, validation);
            return;
        } 
        
        
        // Convert date to YYYY-MM-DD format
        const dt_status     = new Date(input_date_status);
        if (isNaN(dt_status.getTime())){
            validation      = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        dt_status_s         = dt_status.toLocaleDateString('en-CA');
        validation          = 0;
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        input_elem = elemUiNotes.getElemText();
        if (input_notes.length == 0){
            validation = -1;
        }
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
        
        let dispose_status_id = 0;
        
        
        // Delete has no mapped sow_status_id in the backend.
        // The sow_status_id is for both sows and boars
        // and purely for operations only. The delete action is
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
                dispose_status_id = SOW_STATUS.DELETE;
                break;
            }
            
            case 'Sold':{
                dispose_status_id = SOW_STATUS.SOLD;
                break;
            }
            
            case 'Culled':{
                dispose_status_id = SOW_STATUS.CULLED;
                break;
            }
            
            case 'Dead':{
                dispose_status_id = SOW_STATUS.DEAD;
                break;
            }
            
        }
        
        const user_hid      = navigation.userControl.getUserHid();
        const pig_farm_hid  = navigation.userControl.getCurrentFarmHid();
        const base_url      = window.location.origin;
        
        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'sow_boar_hid':     curDataSowBoar.sow_boar.hid,
            
            'dispose_status_id': dispose_status_id,
            'date_dispose':     dt_status_s,
            'dispose_notes':    input_notes
        };
        
        
        let url = `${base_url}/sow_boar/dispose`;
        
        
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
                    
                    if (thisObj.callbackOnSuccessUpdate){
                        thisObj.callbackOnSuccessUpdate();
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
    
    

}   
