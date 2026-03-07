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
    
    let elemIdUserName          = null;

    let elemIdServerErrorMsg    = null;
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemHeaderTitle         = null;
    let elemBtnClose            = null;
    
    
    let elemUserName            = null;
    
    
    let elemServerErrorMsg      = null;
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
    let dataJoinAccRequest      = null;
    
        
        
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
        
        elemIdUserName          = `${settings.uniqueKey}-user-name`;
        
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
                a role for this user.
            </div>
        </div>
            
        <div class="form-group-check">
            <label class="form-label">Requesting User</label>
            <span class="read-only-field" id="${elemIdUserName}"></span>
        </div>
        
        <div class="form-group-number">
            <label class="form-label">Select User Role</label>

            <div class="radio-group">
                <div class="radio-option" data-option="admin">
                    <input type="radio" name="user-role" id="admin" class="radio-input">
                    <div class="radio-text">
                        <div class="radio-title">Admin</div>
                        <div class="radio-description">
                            <ul>
                                <li>Has full data access</li>
                                <li>Receives bills</li>
                                <li>Can approve join request</li>
                                <li>Can delete non-admin users</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="radio-option" data-option="manager">
                    <input type="radio" name="user-role" id="manager" class="radio-input">
                    <div class="radio-text">
                        <div class="radio-title">Farm Manager</div>
                        <div class="radio-description">
                            <ul>
                                <li>Has full data access</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="radio-option" data-option="operations">
                    <input type="radio" name="user-role" id="operations" class="radio-input">
                    <div class="radio-text">
                        <div class="radio-title">Operations Staff</div>
                        <div class="radio-description">
                            <ul>
                                <li>Limited data access</li>
                                <li>No access to Financials</li>
                                <li>No access to Admin tasks</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        
        </div>
        
        <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
    
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="${elemIdBtnCancel}" style="margin-right:10px;">
                <i class="fas fa-times me-2"></i>Reject
            </button>
            <button type="button" class="btn btn-primary" id="${elemIdBtnSave}">
                <i class="fas fa-save me-2"></i>Approve
            </button>
        </div>
    
        
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
        
        
        elemUserName            = elemDivContainer.querySelector('#'+elemIdUserName);
        
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
    this.beforeShow = function(options, data_join_acc_request){
        
        /** Typical options
         options ={
            is_add:                 true,   // false is edit
            callback_after_add:     thisObj.onSuccessAddEntry,
            go_back_page:           go_back_page
        }
         
         * */
        
        
        thisObj._resetForm();
        
        showOptions = options;
        
        dataJoinAccRequest = data_join_acc_request;
        
        
        thisObj.populateForm();
        
        
        // Update Close and cancel button on click
        
        elemBtnClose.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
        
        elemBtnCancel.onclick = function() {
            navigation.showThisPage(showOptions.go_back_page);
        };
    }
    
    
    this.populateForm = function(){
        console.log(dataJoinAccRequest);
        
        const user = dataJoinAccRequest.requesting_user;
        
        let user_name = '';
        if (user.name){
            user_name = user.name;
        }
        else{
            user_name = `${user.name_first} ${user.name_last}`;
        }
        
        elemUserName.textContent  = user_name;
        
        
        
        
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
        
        
        const checkedRadio = elemDivContainer.querySelector('input[name="user-role"]:checked');
        
        
        console.log('checkedRadio.value =' +checkedRadio.value);
        
        return ;
        
        
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
