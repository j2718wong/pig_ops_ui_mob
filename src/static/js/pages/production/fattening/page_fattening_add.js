// April 20, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}        from '../../common/page_view_basic.js';
    
import {APPLICATION,    
        PAGE_ID,    
        PIG_OPERATION_TYPE,
        PIG_PROD_TYPE}              from '../../../constants.js';
    
import {ComponentBreadCrumbs}       from '../../common/ui/comp_breadcrumb.js';
    
    
import {UiInputDatePicker}          from '../../common/ui/input_datepicker.js';
import {UiSelectWithEntryCount}     from '../../common/ui/select_with_entry_count.js';
import {UiInputTextWithCounter}     from '../../common/ui/input_text_with_counter.js';
import {ComponentPlusMinusInput}    from '../../common/ui/comp_plus_minus_input.js';


import {addValidationClassToElem}   from '../../common/ui/ui_utils.js';



export function PageProdFatteningAdd(input_settings){
    PageViewPigFarmPage.call(this);
    
    const TAG                   = 'PageFatteningAdd';
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    this.setNavigation(navigation);
    
    
    const INVALID_MSG_NUM_INPUT = 'Please enter a valid number.';
    
    /*
    Typical settings = {
        navigation:             this
        elemIdDivContainer:     elemIdContSowBoarAddEdit
    };
    */
    const settings              = input_settings;
    
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
    

    
    
    // The settingsBreadcrumb.items is temporary; need to update dynamically
    const settingsBreadcrumb = {
        uniqueKey:              `${settings.uniqueKey}-breadcrumbs`,
        navigation:             navigation,
        
        items:[
            {
                'label':        'Fattening List',
                'gotoPageId':   PAGE_ID.PROD_FATTENING_LIST
            }
        ]
        
    };
    let componentBreadcrumb     = null;
    
    
    let elemIdHeaderTitle       = null;
    let elemIdBtnClose          = null;
    

    let elemUiDateBirth         = null;
    let elemUiDateWean          = null;
    let componentNumPigs        = null;
    let componentDeadType       = null;
    let elemUiNotes             = null;
    

    let elemIdDayNumber         = null;
    let elemIdDayNumberDesc     = null;
    
    let elemIdServerErrorMsg    = null;
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemHeaderTitle         = null;
    let elemBtnClose            = null;
    
    
    let elemDayNumber           = null;
    let elemDayNumberDesc       = null;
    
    let elemServerErrorMsg      = null;
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
    let curDataAccPigOps        = null;
    
        
        
    let showOptions             = null;
        
    
    let operationType           = null;
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        let page_info   = `
            This is used when piglets are coming from outside your farm. 
        `;
        
        
        
        componentBreadcrumb     = new ComponentBreadCrumbs(settingsBreadcrumb);
        
        
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
        
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        elemIdBtnCancel         = `${settings.uniqueKey}-cancel`;
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
    
        elemUiDateBirth         = new UiInputDatePicker({
            uniqueKey:          `${settings.uniqueKey}-date-birth`,
        
            textLabel:          'Date Birth',
            isRequired:         false,
            invalidFeedBack:    'Please input date.',
            helpText:           'Can be blank'
        });
    
    
        elemUiDateWean          = new UiInputDatePicker({
            uniqueKey:          `${settings.uniqueKey}-date-wean`,
        
            textLabel:          'Date Wean',
            isRequired:         true,
            invalidFeedBack:    'Please input date.',
            helpText:           'If this is blank, it will be set today'
        });
        
        
        componentNumPigs        = new ComponentPlusMinusInput({
            uniqueKey:          `${settings.uniqueKey}-num-birth`,
            
            className:          'form-group-number',
            textLabel:          'Number of Pigs',
            minValue:           0,
            step:               1,
            isRequired:         true,
            invalidFeedBack:    null,
            helpText:           null
        });
        
        
        elemUiNotes             = new UiInputTextWithCounter({
            uniqueKey:          `${settings.uniqueKey}-notes`,
            
            isTextArea:         true,
            className:          'form-group-text-area',
            textLabel:          'Notes',
            textMaxChars:       160,
            rows:               3,
            helpText:           null 
        });
        
        
        const html_breadcrumb   = componentBreadcrumb.getHtml();
        
        const html_date_birth   = elemUiDateBirth.getHtml();
        const html_date_wean    = elemUiDateWean.getHtml();
        const html_num_pigs     = componentNumPigs.getHtml();
        const html_notes        = elemUiNotes.getHtml();
        
        
        const html =`
    <div class="form-container">
        ${html_breadcrumb}
        
        <div class="mobile-info-box" id="">
            ${page_info}
        </div>
            
        <div class="modal-header">
            <h5 class="modal-title">
                <span id="${elemIdHeaderTitle}"><i class="fas fa-plus me-2"></i>Pigs From Outside</span>
            </h5>
            <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
        </div>
        
        <div class="modal-body">
            ${html_date_birth}
            
            ${html_date_wean}
            
            ${html_num_pigs}
            
            ${html_notes}
            
            <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
        
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
        componentBreadcrumb.afterHtmlRender();
        
        elemUiDateBirth.afterHtmlRender();
        elemUiDateBirth.afterHtmlRender();
        elemUiDateWean.afterHtmlRender();        
        componentNumPigs.afterHtmlRender();   
        elemUiNotes.afterHtmlRender();            
        
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();

    }
    
    
    this._findElements = function(){
        elemHeaderTitle         = elemDivContainer.querySelector('#'+elemIdHeaderTitle);
        elemBtnClose            = elemDivContainer.querySelector('#'+elemIdBtnClose);
        
        
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
        
    }
    
    
    this.renderPage = function(page_data){
        thisObj.show(page_data.options);
    }
    
    

    this.show = function(options){
        thisObj.debugNavHistory(TAG);
        
        // Update navigation.curPageNavigated
        navigation.curPageNavigated.pageData = {options:options};
        navigation.curPageNavigated.renderPageFunc = thisObj.renderPage;
        
        
        thisObj._resetForm();
        
        showOptions = options;
        
        
        let html;
        
        
        // Update Close and cancel button on click
        
        elemBtnClose.onclick = function() {
            // Remove NavHistoryHead if same with go_back_page
            navigation.managerNavHistory.removeFromNavHistoryHead(
                showOptions.go_back_page);
            
            
            // This will not redraw the previous page; only shwo container
            navigation.showThisPage(showOptions.go_back_page);
            
            if (APPLICATION.DEBUG_NAV_HISTORY){
                thisObj.debugNavHistory(TAG);
            }
        };
        
        elemBtnCancel.onclick = function() {
            // Remove NavHistoryHead if same with go_back_page
            navigation.managerNavHistory.removeFromNavHistoryHead(
                showOptions.go_back_page);
            
            
            // This will not redraw the previous page; only shwo container
            navigation.showThisPage(showOptions.go_back_page);

            
            if (APPLICATION.DEBUG_NAV_HISTORY){
                thisObj.debugNavHistory(TAG);
            }
        };
    }
    
     
    this.populateForm = function(data_acc_pig_ops){
    }
    
    
    this._validateAfterChangeInput = function(ev, input_field){
        /* Use this to validate new entry form input.*/
    
        let input_elem  = null;
        let input_val   = null;
        let cur_field   = null;
        let validation  = null;
     
        
        if (ev.checkValidity()) {
            
            
        } else {
            ev.classList.remove('is-valid');
            ev.classList.add('is-invalid');
        }

    }
    
    
    
    this.onClickSaveButton = function(){
        let input_elem      = null;
        let validation      = 0;
        
        
        let input_date_birth        = elemUiDateBirth.getValue();
        let input_date_wean         = elemUiDateWean.getValue();
        let input_num_pigs          = componentNumPigs.getValue();
        let input_notes             = elemUiNotes.getValue().trim();
        
        let dt_birth_s      = null;
        let dt_wean_s       = null; 
        
        
        // Validate date bor
        if (input_date_birth && input_date_birth.length > 0){
            input_elem          = elemUiDateBirth.getElemText();
            
            // Convert date to YYYY-MM-DD format
            const dt_birth       = new Date(input_date_birth);
            if (isNaN(dt_birth.getTime())){
                validation      = -1;
                addValidationClassToElem(input_elem, validation);
                if (validation != 0) {return;}
            }
            
            dt_birth_s   = dt_birth.toLocaleDateString('en-CA');
            validation          = 0
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
            
        }
        
        
        
        if (input_date_wean && input_date_wean.length > 0){
            input_elem          = elemUiDateWean.getElemText();
            
            // Convert date to YYYY-MM-DD format
            const dt_wean       = new Date(input_date_wean);
            if (isNaN(dt_wean.getTime())){
                validation      = -1;
                addValidationClassToElem(input_elem, validation);
                if (validation != 0) {return;}
            }
            
            dt_wean_s   = dt_wean.toLocaleDateString('en-CA');
            validation          = 0
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        
        // Validate number counts
        let number_pigs = 0;
        
        input_elem          = componentNumPigs.getElemText();
        
        try{
            number_pigs = parseInt(input_num_pigs)
        }catch (error){
            componentNumPigs.setTextInvalid(INVALID_MSG_NUM_INPUT);
            validation = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        
        if (number_pigs <= 0){
            componentNumPigs.setTextInvalid(INVALID_MSG_NUM_INPUT);
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
        
        
        const pig_farm_hid  = navigation.pigFarm.getPigFarmHid();       
        
        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'pig_farm_hid':     pig_farm_hid,
            'num_pigs':         number_pigs
        };
        
        
        if (dt_birth_s){
            post_data.date_birth = dt_birth_s;
        }
        
        
        if (dt_wean_s){
            post_data.date_weaning = dt_wean_s;
        }
        
        if (input_notes.length > 0){
            post_data.notes = input_notes;
        }
        
        
        
        let url = `${base_url}/pig_prod/fattening/add`;
        
        
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
            },
  
            success: function(response){
                if (response.result.num == 0){

                    const callback_success = function(data){
                        const go_back_page_id = PAGE_ID.PROD_FATTENING_LIST;
                        const go_back_page = navigation.getPageContainer(go_back_page_id);
                        
                        navigation.managerNavHistory.removeFromNavHistoryHead(
                            go_back_page);
                        
                        navigation.showThisPage(go_back_page);
                        navigation.pageProdFatteningList.show();
                    
                    };
            
                    // Request Fattening List
                    navigation.pigFarm.managerPigProd.requestPigProdList(
                        PIG_PROD_TYPE.FATTENING, callback_success, elemServerErrorMsg);
                            
                    
                    
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
