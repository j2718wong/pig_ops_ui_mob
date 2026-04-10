// December 23, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../../common/page_view_basic.js';

import {APPLICATION,
        PAGE_ID,
        SOW_STATUS,
        PIG_PROD_TYPE,
        PIG_OPERATION_TYPE,
        PROD_STATUS,
        SUPPLIER_TYPE}          from '../../../constants.js';


import {SelectBoarGesta}        from '../../production/gesta_lacta/components/select_boar_gesta.js';

import {UiInputDatePicker}      from '../../common/ui/input_datepicker.js';
import {UiInputTextWithCounter} from '../../common/ui/input_text_with_counter.js';

import {ComponentAccPigBuyer}   from '../../production/harvest/comp_acc_pig_buyer.js';   


import {addValidationClassToElem} from '../../common/ui/ui_utils.js';



export function PageBoarExtMateAddEdit(input_settings){
    PageViewPigFarmPage.call(this);
    
    const TAG                   = 'PageBoarExtMateAddEdit';
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
      
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContProdGestaAdd,
        uniqueKey:              'prod-add-gesta'
    };
    */
    const settings              = input_settings;

    
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
        
        
    let elemIdBtnClose          = null;
    
    let componentSelectBoar     = null;
    let elemUiDateMating        = null;
    let componentBoarCustomer   = null;
    let elemUiNotes             = null;
    
    let elemIdServerErrorMsg    = null;
    
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemBtnClose            = null;
    
    let elemServerErrorMsg      = null;
    
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
    let showOptions             = null;
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdBtnClose          = `${settings.uniqueKey}-select-close`;
        
        
        componentSelectBoar     = new SelectBoarGesta({
            navigation:         navigation,
            uniqueKey:          `${settings.uniqueKey}-select-boar`,
            
            pageDivContainer:   elemDivContainer,
            
            labelSelect:        'Select Boar',
            helpText:           null
        });
        
        
        elemUiDateMating        = new UiInputDatePicker({
            uniqueKey:          `${settings.uniqueKey}-date-mating`,
        
            textLabel:          'Date Mating',
            isRequired:         true,
            invalidFeedBack:    'Please input date.',
            helpText:           null
        });
        
        
        componentBoarCustomer   = new ComponentAccPigBuyer({
            navigation:         navigation,
            parentObj:          thisObj,
            uniqueKey:          `${settings.uniqueKey}-boar-customer`,
            
            isBoarCustomer:     true,

            titleExpandSection: 'Add Boar Customer',
            htmlExpandSection:  null,
            labelBtnExpandSave: 'Save Boar Customer',
            
            labelSelect:        'Select Boar Customer',
            helpText:           null
        });
       
       
    
        
        elemUiNotes             = new UiInputTextWithCounter({
            uniqueKey:          `${settings.uniqueKey}-notes`,
            
            isTextArea:         true,
            className:          'form-group-text-area',
            textLabel:          'Notes',
            isRequired:         false,
            textMaxChars:       160,
            rows:               3,
            helpText:           null  
        });
        

        
        
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        elemIdBtnCancel         = `${settings.uniqueKey}-cancel`;
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        
        
        const html_select_boar  = componentSelectBoar.getHtml();
        const html_date_mating  = elemUiDateMating.getHtml();
        const html_customer     = componentBoarCustomer.getHtml();
        
        const html_notes        = elemUiNotes.getHtml();
        
        const html =`

        
<div class="form-container">

    <div class="modal-header gestating">
        <h5 class="modal-title" id="add-entry-acc-pig-ops-modal-label">
            <i class="fas fa-plus me-2"></i><span>Add Boar External Mate</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    
    <div class="modal-body">
        
        
        ${html_select_boar}

        
        ${html_date_mating}
        
        
        ${html_customer}
       
        
        ${html_notes}
        
        
        <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
        
        <!-- Footer Buttons -->
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="${elemIdBtnCancel}" data-bs-dismiss="modal" style="margin-right:10px;">
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
        componentSelectBoar.afterHtmlRender();
        elemUiDateMating.afterHtmlRender();
        componentBoarCustomer.afterHtmlRender();
        elemUiNotes.afterHtmlRender();
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemBtnClose            = elemDivContainer.querySelector('#'+elemIdBtnClose);
        
        
        
        elemServerErrorMsg      = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);
            
        elemBtnCancel           = elemDivContainer.querySelector('#'+elemIdBtnCancel);
        elemBtnSave             = elemDivContainer.querySelector('#'+elemIdBtnSave);
    }
    
    
    this._processAfterHtmlRender = function(){
        
    }
    
    
    this._bindEventListeners = function(){
        
       
        
              
        elemBtnClose.addEventListener('click', function() {
            // Remove NavHistoryHead if same with go_back_page
            navigation.managerNavHistory.removeFromNavHistoryHead(
                showOptions.go_back_page);
            
            
            // This will not redraw the previous page; only shwo container
            navigation.showThisPage(showOptions.go_back_page);
            
            if (APPLICATION.DEBUG_NAV_HISTORY){
                thisObj.debugNavHistory(TAG);
            }
        });
        
        
        elemBtnCancel.addEventListener('click', function() {
            // Remove NavHistoryHead if same with go_back_page
            navigation.managerNavHistory.removeFromNavHistoryHead(
                showOptions.go_back_page);
            
            
            // This will not redraw the previous page; only shwo container
            navigation.showThisPage(showOptions.go_back_page);
            
            if (APPLICATION.DEBUG_NAV_HISTORY){
                thisObj.debugNavHistory(TAG);
            }
        });
        
        
        elemBtnSave.addEventListener('click', function() {
            thisObj.onClickSaveButton();
        });
        
        
    }
    
    
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        
      
        
        elemUiDateMating.reset();
        
        componentSelectBoar.reset();
        componentBoarCustomer.reset();
        elemUiNotes.reset();
        
    }
    
    
    this.show = function(options){
        thisObj._resetForm();
        
        componentSelectBoar.beforeShow();
        componentBoarCustomer.beforeShow();
        
        showOptions = options;
    }
    
        
    this._validateAfterChangeInput = function(ev, input_field){
        /* Use this to validate new entry form input.*/
    
        let input_elem  = null;
        let input_val   = null;
        let cur_field   = null;
        let validation  = null;
        


    }
    
    
    this.onClickSaveButton = function(){
        let input_elem      = null;
        let validation      = 0;
        

        let input_boar_hid      = componentSelectBoar.getValue();
        let input_date_mating   = elemUiDateMating.getValue();
        let input_customer_hid  = componentBoarCustomer.getValue();
        let input_notes         = elemUiNotes.getValue();
        
        
        input_elem          = componentSelectBoar.getElemSelect();
        if (input_boar_hid == '0'  || input_boar_hid == '-1'){
            validation = -1;
        }
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
            
        
        input_elem          = elemUiDateMating.getElemText();
        
        // Convert date to YYYY-MM-DD format
        const dt_mating     = new Date(input_date_mating);
        if (isNaN(dt_mating.getTime())){
            validation      = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        const dt_mating_s   = dt_mating.toLocaleDateString('en-CA');
        validation          = 0
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        input_elem          = componentBoarCustomer.getElemSelect();
        if (input_customer_hid == '0'  || input_customer_hid == '-1'){
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
            'boar_hid':         input_boar_hid,
            'boar_customer_hid': input_customer_hid,
            'notes':            input_notes,
            
            'date_mate':        dt_mating_s
        };
        
       
       
        
        const bearer_token = localStorage.getItem('access_token');
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: `${base_url}/boar_ext_mate/add`,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
                elemServerErrorMsg.style.display = 'none';
            },
  
            success: function(response){
                if (response.result.num == 0){
                    const go_back_page_id = PAGE_ID.SUMMARY_REPORT_LIST;
                    const go_back_page = navigation.getPageContainer(go_back_page_id);
                    
                    navigation.managerNavHistory.removeFromNavHistoryHead(
                        go_back_page);
                    
                    navigation.showThisPage(go_back_page);
                    navigation.pageBoarExtMateList.show();
                }
                else{
                    navigation.serverError.receivedErrorMessage(
                        response, elemServerErrorMsg);
                }
            },
  
            complete: function(){
                // TODO unsay buhaton
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
    }
    
      
    
}   
