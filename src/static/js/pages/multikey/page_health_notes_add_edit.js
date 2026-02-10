// January 15, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageWithMultiBreadCrumbs} from './page_with_multi_breadcrumbs.js';

import {CommonSelectOptions}    from '../common/common_select_options.js';

import {addValidationClassToElem} from '../common/ui/ui_utils.js';

import {ComponentBreadCrumbs}    from '../common/ui/comp_breadcrumb.js';
import {UiInputDatePicker}      from '../common/ui/input_datepicker.js';
import {UiInputTextWithCounter} from '../common/ui/input_text_with_counter.js';



import {PAGE_ID,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        MULTIKEY_OBJ_TYPE,
        PROD_STATUS}            from '../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}         from '../../utils.js';


import {debugElementVisibility} from '../common/server_error.js';


/*
This is used to Add/Edit 
1.) SowBoar Health Issue
2.) SowBoar Notes 
3.) PigProd Notes
4.) ProdGroup Notes
*/


export function PageHealthNotesAddEdit(input_settings){
    PageWithMultiBreadCrumbs.call(this, input_settings);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    const MAXCHAR_NOTES         = 160;
    
    
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContHealthAddEdit,
        uniqueKey:              'health-add-edit',
        isNotes:                true   // false is for Health Issue
        
    };
    */
    const settings              = input_settings;

    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
        
    
    let elemIdBtnClose          = null;
    
    let elemIdHeaderTitle       = null;
    
        
    let elemIdInfoShow          = null;
    let elemIdInfo              = null;
    
    let elemUiDateNotes         = null;
    let elemUiNotes             = null;

    
    
    let elemIdServerErrorMsg    = null;
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemBtnClose            = null;
    
    let elemHeaderTitle         = null;
    
        
    let elemInfoShow            = null;
    let elemInfo                = null;
    
    
    let elemServerErrorMsg      = null;
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
    let curDataEntry            = null;
    let showOptions             = null;
    
    
    this.callbackOnSuccessAdd   = null;
    
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
        
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        
            
        elemIdInfoShow          = `${settings.uniqueKey}-info-show`;
        elemIdInfo              = `${settings.uniqueKey}-info`;
        
        
        
        elemUiDateNotes         = new UiInputDatePicker({
            uniqueKey:          `${settings.uniqueKey}-date`,
        
            textLabel:          'Date',
            isRequired:         true,
            invalidFeedBack:    'Please enter a date.',
            helpText:           null
        });
        
        
        
        let settings_notes = null;
        if (settings.isNotes) {
            settings_notes = {
                uniqueKey:          `${settings.uniqueKey}-notes`,
                
                isTextArea:         true,
                isRequired:         true,
                className:          'form-group-text-area',
                textLabel:          'Notes',
                textMaxChars:       160,
                rows:               3,
                helpText:           null  
            }
        }
        else{
            settings_notes = {
                uniqueKey:          `${settings.uniqueKey}-notes`,
                
                isTextArea:         true,
                isRequired:         true,
                className:          'form-group-text-area',
                textLabel:          'Description',
                textMaxChars:       160,
                rows:               3,
                helpText:           'Describe pig health problem.'
            }
        }
        
        
        
        elemUiNotes             = new UiInputTextWithCounter(settings_notes);



        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        elemIdBtnCancel         = `${settings.uniqueKey}-cancel`;
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        
        
    
        
        const html_breadcrumb   = thisObj.getHtmlBreadCrumbs();
        
        const html_date_notes   = elemUiDateNotes.getHtml();
        const html_notes        = elemUiNotes.getHtml();

        
        const html =`

        
<div class="form-container">
    ${html_breadcrumb}

    
    <div class="modal-header" style="padding-right:8px;">
        <h5 class="modal-title">
            <span id="${elemIdHeaderTitle}"><i class="fas fa-plus me-2"></i>Add Sow</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    
    <div class="modal-body">
        <!-- Mobile Info Box -->
        <div class="warning-box" id="${elemIdInfoShow}" style="display:none;"></div>
        
        
        <!-- 1. Date Notes -->
        ${html_date_notes}
        
        
        <!-- 2. Notes -->
        ${html_notes}
        
        
        <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
        
        <!-- Footer Buttons -->
        <div class="modal-footer">
                                           
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
        thisObj.afterHtmlRenderBreadCrumbComponent();

        elemUiDateNotes.afterHtmlRender();
        elemUiNotes.afterHtmlRender();
        
        
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
                                                          
        elemBtnClose            = elemDivContainer.querySelector('#'+elemIdBtnClose);
                                                          
        elemHeaderTitle         = elemDivContainer.querySelector('#'+elemIdHeaderTitle);
                                                          
                                                          
        elemInfoShow            = elemDivContainer.querySelector('#'+elemIdInfoShow);
        elemInfo                = elemDivContainer.querySelector('#'+elemIdInfo);
                                                          
        elemServerErrorMsg      = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);
        elemBtnCancel           = elemDivContainer.querySelector('#'+elemIdBtnCancel);
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
        
        elemUiDateNotes.reset();
        elemUiNotes.reset(); 
        
        elemServerErrorMsg.style.display = 'none';
    }
    
    
    this.beforeShow = function(data_entry, options){
        /*
        Typical options
        options ={
            is_add:                 true,   // false is edit
            notes_type:             MULTIKEY_OBJ_TYPE.SOW_BOAR,
            row_entry:              null,   // not null if edit; entry to be edited
            callback_after_add:     thisObj.onSuccessAddEntry
            go_back_page:           go_back_page   // Go back to this page; this is Div element
        }
        */
        
        curDataEntry    = data_entry;
        showOptions     = options;
        

        // Update BreadCrumbs
        let multikey_obj_type = null;
        if ('notes_type' in showOptions){
            multikey_obj_type = showOptions.notes_type;
        }
        else{
            if ('health_type' in showOptions){
                multikey_obj_type = showOptions.health_type;
            }
        }
        
        
        switch (multikey_obj_type){ 
            case MULTIKEY_OBJ_TYPE.SOW_BOAR:{
                thisObj.updateBreadCrumbs(curDataEntry, null);
                break;
            }
            
            case MULTIKEY_OBJ_TYPE.PIG_PROD:{
                thisObj.updateBreadCrumbs(null, curDataEntry);
                break;
            }
        }
        
        
        thisObj._resetForm();
        
        
        elemInfoShow.style.display = 'none';
        
        let html;
        
        if (settings.isNotes){
            if (options.is_add){
                html = `<i class="fas fa-plus me-2"></i>Add Notes`;
            }
            else{
                html = `<i class="fas fa-edit me-2"></i>Edit Notes`;
                
                thisObj.populateForm(curDataEntry, options.row_entry);
            }
        }
        else{
            if (options.is_add){
                html = `<i class="fas fa-plus me-2"></i>Add Health Issue`;
                
                
                if (multikey_obj_type == MULTIKEY_OBJ_TYPE.PIG_PROD){
                    
                    const prod_status_id = curDataEntry.pig_production.prod_status_id;
                    
                    if (prod_status_id == PROD_STATUS.LACTATING){
                        // Update infoBox
                        const sow_boar_hid = curDataEntry.sow.hid;
                        const tab_id = navigation.pageSowBoarEntry.elemIdTabHealth;
                        
                        let s_click = `gNavigation.pageSowBoarList.onClickSowBoarEntry(`;
                        s_click += `"${sow_boar_hid}", null, "${tab_id}", ${SOW_BOAR_TYPE.SOW});`;
                    
                        
                        let html_info = `
                        Use this to record health problem of the piglets of this 
                        production entry. If the sow has the health problem, 
                        <a href="javascript:void(0)" class="text-link" onclick='${s_click}'>click this</a>.
                        `;
                        
                        elemInfoShow.style.display = 'block';
                        elemInfoShow.innerHTML = html_info;
                    }
                }
            }
            else{
                html = `<i class="fas fa-edit me-2"></i>Edit Health Issue`;
                
                thisObj.populateForm(curDataEntry, options.row_entry);
            }
        }
        elemHeaderTitle.innerHTML = html;
                
        
        
        // Update Close and cancel button on click
        
        elemBtnClose.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
        
        elemBtnCancel.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
        
      
    }
    
    
    this.populateForm = function(data_sow_boar, row_entry){
        
        const cur_notes  = row_entry;
        
        
        // Set the datepicker to this date
        elemUiDateNotes.setDate(cur_notes.prod_notes.date_notes);
                
        elemUiNotes.setValue(cur_notes.prod_notes.notes);

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

           
            
            
        } else {
            ev.classList.remove('is-valid');
            ev.classList.add('is-invalid');
        }

    }
    
    
    this.onClickSaveButton = function(){
        let input_elem      = null;
        let validation      = 0;
        
        let is_duplicate    = 0;
        
        
        let input_date_notes    = elemUiDateNotes.getValue().trim();
        let input_notes         = elemUiNotes.getValue().trim();

        

        let dt_notes_s = null;
        
        input_elem          = elemUiDateNotes.getElemText();
        if (input_date_notes.length == 0){
            validation = -1;
            addValidationClassToElem(input_elem, validation);
            return;
        } 
        
        
        
        // Convert date to YYYY-MM-DD format
        const dt_notes      = new Date(input_date_notes);
        if (isNaN(dt_notes.getTime())){
            validation      = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        dt_notes_s          = dt_notes.toLocaleDateString('en-CA');
        validation          = 0
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
       
        input_elem = elemUiNotes.getElemText();
        if (input_notes.length == 0){
            validation = -1;
        }
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
            return;
        } 
        
        
        
        const user_hid      = navigation.userControl.getUserHid();
        const base_url      = window.location.origin;
        
        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            
            'date_notes':       dt_notes_s,
            'notes':            input_notes
            
        };
        
        
        // Add key
        if (showOptions.is_add == true){
            
            if (showOptions.notes_type) {
                switch (showOptions.notes_type){
                    case MULTIKEY_OBJ_TYPE.SOW_BOAR:{
                        post_data.sow_boar_hid = curDataEntry.sow_boar.hid;
                        break;
                    }
                    
                    case MULTIKEY_OBJ_TYPE.PIG_PROD:{
                        post_data.pig_prod_hid = curDataEntry.pig_production.hid;
                        break;
                    }
                }
            }
            
            
            
            if (showOptions.health_type) {
                switch (showOptions.health_type){
                    case MULTIKEY_OBJ_TYPE.SOW_BOAR:{
                        post_data.sow_boar_hid = curDataEntry.sow_boar.hid;
                        break;
                    }
                    
                    case MULTIKEY_OBJ_TYPE.PIG_PROD:{
                        post_data.pig_prod_hid = curDataEntry.pig_production.hid;
                        break;
                    }
                }
            }
            
            
            
            if (settings.isNotes == false){
                post_data.is_health_issue = 1;
            }
        }
        else{
            post_data.pig_prod_notes_hid = showOptions.row_entry.prod_notes.hid;
        }
        
        
        
        let url;
        
        if (showOptions.is_add == true){
            url = `${base_url}/pig_prod_notes/add`;
        }
        else{
            url = `${base_url}/pig_prod_notes/update`;
        }
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            url: url,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
                
            },
  
            success: function(response){
                if (response.result.num == 0){
                    if (showOptions.is_add == true){
                        if (showOptions.callback_after_add){
                            showOptions.callback_after_add();
                        }
                        
                        navigation.showThisPage(showOptions.go_back_page);
                    }
                    
                    else{
                        if (showOptions.callback_after_edit){
                            showOptions.callback_after_edit();
                        }
                        navigation.showThisPage(showOptions.go_back_page);
                    
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
