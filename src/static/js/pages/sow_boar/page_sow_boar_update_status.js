// January 2, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../common/page_view_basic.js';

import {TRANSLATION_PAGE_SOW_BOAR_ADD_EDIT} from  '../../translations/page_sow_boar_add_edit_i8n.js';

import {TextTranslation}        from '../common/translation.js';
import {UiInputTextWithCounter} from '../common/ui/input_text_with_counter.js';
import {UiSelectWithEntryCount} from '../common/ui/select_with_entry_count.js';
import {UiInputCheckBox}		from '../common/ui/input_checkbox.js';


import {PAGE_ID,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        REQUEST_ERROR_NUM}      from '../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}         from '../../utils.js';



import {FIELD_VALIDATION_OK}    from '../../models/model_basic.js'


import {UiInputTextWithCounter} from '../../common/ui/input_text_with_counter.js';



export function PageSowBoarUpdateStatus(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    const MAXCHAR_NOTES         = 160;
    
    /*
    Typical settings = {
        navigation:             this
    };
    */
    const settings              = input_settings;

    
    // Collapsible  panel elements
    let elemIdUpdateStatusShow  = null;
    
    let elemIdPanelHeader       = null;
    let elemIdPanelTitle        = null;
    let elemIdPanelArrowIcon    = null;
    let elemIdPanelBody         = null;
    let elemIdDateStatus        = null;
    let elemIdStatusInv         = null;
    
	let elemIdServerErrorMsg  	= null;
    let elemIdBtnUpdateStatus   = null;
    
    let elemUpdateStatusShow    = null;
    
    let elemPanelHeader         = null;
    let elemPanelTitle          = null;
    let elemPanelArrowIcon      = null;
    let elemPanelBody           = null;
    let elemDateStatus          = null;
    let elemStatusInv           = null;
    let elemStatusNotes         = null;
    let elemStatusNotesCharCounter = null;
    let elemServerErrorMsg = null;
    let elemBtnUpdateStatus     = null;

    let showOptions             = null;
    

    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.getHtml = function(){
        elemIdUpdateStatusShow  = `sow-boar-update-status-show`;
        
        elemIdPanelHeader       = `sow-boar-update-status-panel-header`;
        elemIdPanelTitle        = `sow-boar-update-status-panel-title`;
        elemIdPanelArrowIcon    = `sow-boar-update-status-panel-arrow`;
        elemIdPanelBody         = `sow-boar-update-status-panel-body`;
        elemIdDateStatus        = `sow-boar-update-status-date-status`;
        elemIdStatusInv         = `sow-boar-update-status-status-inv`;
        
		
		elemUiNotes             = new UiInputTextWithCounter({
            uniqueKey:          'sow-boar-update-status-notes',
            
            isTextArea:         true,
            className:          'form-group-text-area',
            textLabel:          'Notes',
            textMaxChars:       160,
            rows:               3,
            helpText:           null  
        });
		
		
        elemIdServerErrorMsg 	= `sow-boar-update-status-btn-update-status-error-msg`;
        elemIdBtnUpdateStatus   = `sow-boar-update-status-btn-update-status`;
        
        const html = `
        <!-- Collapsible Panel -->
        <div class="collapsible-panel mb-4" id="${elemIdUpdateStatusShow}" style="display:none;">
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
                <div class="mb-3">
                    <label for="${elemIdDateStatus}" class="form-label">Date Status <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="${elemIdDateStatus}" required>
                </div>
                
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
                <div class="mb-4">
                    <label for="${elemIdStatusNotes}" class="form-label">
                        Notes <span class="text-danger">*</span>
                        <span id="${elemIdStatusNotesCharCounter}" class="char-counter">0/${MAXCHAR_NOTES}</span>
                    </label>
                    <textarea class="form-control" id="${elemIdStatusNotes}" rows="3" placeholder="Add any additional notes here..." required></textarea>
                    <div class="invalid-feedback">Please add some notes. </div>
                </div>
                
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
        elemDateStatus          = document.getElementById(elemIdDateStatus);
		
        elemServerErrorMsg		= document.getElementById(elemIdServerErrorMsg);
        elemBtnUpdateStatus     = document.getElementById(elemIdBtnUpdateStatus);
    }
    
    
    this._processAfterHtmlRender = function(){
        
        $('#'+elemIdDateStatus).datepicker({
            format: 'MM d, yyyy',  // This gives "January 31, 2026"
            autoclose: true,
            orientation: 'bottom',
            endDate: new Date() // Max date is today
        }).on('show', function(e) {
            $('.datepicker').addClass('datepicker-material');
        });
        
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
        let cur_elem = null;
        

        cur_elem = elemDateStatus;
        cur_elem.value = ''; 
        cur_elem.classList.remove('is-valid', 'is-invalid'); 
        
        cur_elem = elemStatusNotes;
        cur_elem.value = ''; 
        cur_elem.classList.remove('is-valid', 'is-invalid'); 
        
        const radios = elemDivContainer.querySelectorAll('input[name="statusOption"]');
        for (const cur_entry of radios){
            cur_entry.checked = false;
        }
        
        
        elemStatusInv.style.display = 'none';
        elemServerErrorMsg.style.display = 'none';
    }
    
    
    this.beforeShow = function(options){
        /*
        Typical options
        options ={
            is_add:         true,   // false is edit
            sow_boar_type:  1,   
            farm_sow_boar_id: 1,    // only needed for edit
            go_back_page:   elemDivContainer,   // Go back to this page; this is Div element
            go_back_page_id: PAGE_ID.SOW_BOAR_LIST, optional
            from_prod_pid:  null    // can be null or undefined
        }
        */
        
        
        if (!elemPanelBody.classList.contains('collapsed')) {
            thisObj.togglePanel();
        }
    }
    
       
    this.show = function(){
        thisObj._resetForm();
        
        console.log('PageAddGestating show');
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
        let input_val       = null;
        let cur_field       = null;
        let validation      = -1;
        let proceed_to_save = 1;
        
        let is_duplicate    = 0;
        
       
        
        let input_date_status= elemDateStatus.value.trim();
        let input_notes     = elemStatusNotes.value.trim();
        
        input_elem          = elemDateStatus;
        cur_field           = sowBoarEntry.fieldBirthDate;
        
        let dt_status_s     = null;
        
        if (input_date_status.length == 0){
            validation = -1;
        }
        else{
            // Convert date to YYYY-MM-DD format
            const dt_status     = new Date(input_date_status);
            
            dt_status_s         = dt_status.toLocaleDateString('en-CA');
            validation          = 0;
        }
            
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
        
        if (proceed_to_save == 0) {return;}
        
          
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
        let post_data = {
            'uhid':             user_hid,
            'sow_boar_hid':     curDataSowBoar.hid,
            
            'dispose_status_id': dispose_status_id,
            'date_dispose':     dt_status_s,
            'dispose_notes':    input_notes
        };
        
        
        let url = `${base_url}/sow_boar/dispose`;
        
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
                    
                    const callback_success = function(){
                        navigation.pageSowBoarList.show(null);
                        navigation.showThisPage(showOptions.go_back_page);
                    };
                    
                    navigation.pigFarm.requestDataSowBoar(showOptions.is_sow, 
                        callback_success, callback_error);
                        
                    
                    
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