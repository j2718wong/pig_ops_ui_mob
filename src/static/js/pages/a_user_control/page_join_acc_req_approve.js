// March 7, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../common/page_view_basic.js';

import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE}     from '../../constants.js';

import {ComponentBreadCrumbs}   from '../common/ui/comp_breadcrumb.js';

import {UiInputTextWithCounter} from '../common/ui/input_text_with_counter.js';
import {UiInputCheckBox}        from '../common/ui/input_checkbox.js';

import {addValidationClassToElem}   from '../common/ui/ui_utils.js';



export function PageJoinAccReqApprove(input_settings){
    PageViewBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    
    /*
    Typical settings = {
        navigation:             this
        elemIdDivContainer:     elemIdContSowBoarAddEdit
    };
    */
    const settings              = input_settings;
    
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
    
    
    const MAXCHAR_PIG_OPS_NAME  = 20;
    
    
    // The settingsBreadcrumb.items is temporary; need to update dynamically
    const settingsBreadcrumb = {
        uniqueKey:              `${settings.uniqueKey}-breadcrumbs`,
        navigation:             navigation,
        
        items:[
            {
                'label':        'Request List',
                'gotoPageId':   PAGE_ID.JOIN_ACC_REQ_LIST
            }
        ]
        
    };
    let componentBreadcrumb     = null;
    
    
    let elemIdHeaderTitle       = null;
    let elemIdBtnClose          = null;
    
    let elemIdPageInfo          = null;

    let elemIdServerErrorMsg    = null;
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemHeaderTitle         = null;
    let elemBtnClose            = null;
    
    let elemServerErrorMsg      = null;
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
    let curDataAccPigOps        = null;
    
        
        
    let showOptions             = null;
        
    

    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        componentBreadcrumb     = new ComponentBreadCrumbs(settingsBreadcrumb);
        
        
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
        
        elemIdPageInfo          = `${settings.uniqueKey}-page-info`;
        
        
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        elemIdBtnCancel         = `${settings.uniqueKey}-cancel`;
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
    
        
        const html_breadcrumb   = componentBreadcrumb.getHtml();
        
        
        
        const html =`
    <div class="form-container">
        ${html_breadcrumb}
        
        <div class="modal-header">
            <h5 class="modal-title">
                <span id="${elemIdHeaderTitle}">Approve Join Request</span>
            </h5>
            <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
        </div>
        
        <div class="modal-body">
            
            <!-- Mobile Info Box -->
            <div class="mobile-info-box" style="margin-bottom:10px;">
                <div class="info-text" id="${elemIdPageInfo}">
                    This user requested to join your pig farm account. 
                    You may approve or reject this request. You need to assign
                    the role for this user.
                </div>
            </div>
                
            
            
        </div>
        
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

        `;
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        componentBreadcrumb.afterHtmlRender();
        
              
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
        elemServerErrorMsg.style.display = 'none';
        
    }
    
    
    // Reset add form
    this.beforeShow = function(options, data_acc_request){
        
        /** Typical options
         options ={
            is_add:                 true,   // false is edit
            callback_after_add:     thisObj.onSuccessAddEntry,
            go_back_page:           go_back_page
        }
         
         * */
        
        
        thisObj._resetForm();
        
        showOptions = options;
        
        
        
        
        // Update Close and cancel button on click
        
        elemBtnClose.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
        
        elemBtnCancel.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
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
        
        
        let input_name      = elemUiName.getValue().trim();
        let input_description= elemUiDescription.getValue().trim();
        let input_num_days  = elemDayNumber.value;
        

        input_elem          = elemUiName.getElemText();
        if (input_name.length == 0){
            validation = -1;
        }
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        input_elem          = elemUiDescription.getElemText();
        if (input_description.length == 0){
            validation = -1;
        }
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        
        
        input_elem          = elemDayNumber;
        
        let num_days = null;
        try{
            num_days = parseInt(input_num_days);
        }catch(error){
            validation = -1
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        
        
        
        const is_medvac   = elemUiIsMedVac.getElemCheckBox().checked;
        
        
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
            return;
        } 
        
        
        
        const user_hid      = navigation.userControl.getUserHid();
        const base_url      = window.location.origin;
        
        
        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'operation_type':   operationType,
            'num_days_since':   num_days,
            'is_medvac':        is_medvac? 1 : 0,
            'name':             input_name,
            'description':      input_description
        };
        
        if (showOptions.is_add == true){}
        else {
            post_data.account_pig_ops_hid = curDataAccPigOps.acc_pig_ops.hid;
        }

        
        let url;
        
        if (showOptions.is_add == true){
            url = `${base_url}/account_pig_ops/add`;
        }
        else{
            url = `${base_url}/account_pig_ops/update`;
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
            },
  
            success: function(response){
                if (response.result.num == 0){
                    if (showOptions.is_add == true){
                        const callback_success = function(){
                            navigation.showThisPage(showOptions.go_back_page);
                            navigation.pageAccPigOpsList.show();
                            
                            // This should request pig production since acc_pig_ops is added
                            
                        };
                        
                        navigation.pigFarm.requestDataAccPigOpsList(
                            callback_success, elemServerErrorMsg);

                        return;
                    }
                    
                    else{
                        const callback_success = function(){
                            navigation.showThisPage(showOptions.go_back_page);
                            navigation.pageAccPigOpsList.show();
                        };
                        
                        navigation.pigFarm.requestDataAccPigOpsList(
                            callback_success, elemServerErrorMsg);

                        return;
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
