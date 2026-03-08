// March 7, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../common/page_view_basic.js';

import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE}     from '../../constants.js';

import {ComponentBreadCrumbs}   from '../common/ui/comp_breadcrumb.js';


import {CommonSelectOptions}    from '../common/common_select_options.js';
import {UiSelectWithEntryCount} from '../common/ui/select_with_entry_count.js';

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
    
    
    let elemUiPigFarms          = null;
    
    let elemServerErrorMsg      = null;
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
    let commonSelectOptions     = new CommonSelectOptions();
    
    
    let dataJoinAccRequest      = null;
    
        
        
    let showOptions             = null;
        
    

    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        componentBreadcrumb     = new ComponentBreadCrumbs(settingsBreadcrumb);
        
        
        elemUiPigFarms          = new UiSelectWithEntryCount({
            uniqueKey:           `${settings.uniqueKey}-parent-sow`,
        
            labelSelect:         'Assign to Pig Farm',
            helpText:            null
        });
        
        
        
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
        
        elemIdPageInfo          = `${settings.uniqueKey}-page-info`;
        
        elemIdUserName          = `${settings.uniqueKey}-user-name`;
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        elemIdBtnCancel         = `${settings.uniqueKey}-cancel`;
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
    
        
        const html_breadcrumb   = componentBreadcrumb.getHtml();
        
        const html_pig_farms    = elemUiPigFarms.getHtml();
        
        
        
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
                    <input type="radio" name="user-role" id="admin" class="radio-input" value="admin">
                    <div class="radio-text">
                        <div class="radio-title">Admin</div>
                        <div class="radio-description">
                            <ul class = "permission-list">
                                <li>Has full data access</li>
                                <li>Receives bills</li>
                                <li>Can approve join request</li>
                                <li>Can add more pig farms</li>
                                <li>Can delete non-admin users</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="radio-option" data-option="manager">
                    <input type="radio" name="user-role" id="manager" class="radio-input" value="manager">
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
                    <input type="radio" name="user-role" id="operations" class="radio-input" value="operations">
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
        
        
        ${html_pig_farms}
        
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
        elemUiPigFarms.afterHtmlRender();
        
              
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();

    }
    
    
    this._findElements = function(){
        elemHeaderTitle         = elemDivContainer.querySelector('#'+elemIdHeaderTitle);
        elemBtnClose            = elemDivContainer.querySelector('#'+elemIdBtnClose);
        
        
        elemUserName            = elemDivContainer.querySelector('#'+elemIdUserName);
        
        elemServerErrorMsg      = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);
        
        elemBtnCancel           = elemDivContainer.querySelector('#'+elemIdBtnCancel); // This is mapped to reject request
        elemBtnSave             = elemDivContainer.querySelector('#'+elemIdBtnSave);   // This is mapped to approve request
    }
    
    
    this._processAfterHtmlRender = function(){
        
    }

    
    this._bindEventListeners = function(){
        
        elemBtnSave.addEventListener('click', function() {
            // Approve request
            thisObj.onApproveOrReject(1);
        });

        // Add event listeners for radio options
        this._bindRadioOptionClickEvents();
    }

    // New method to bind click events to radio options
    this._bindRadioOptionClickEvents = function() {
        const radioOptions = elemDivContainer.querySelectorAll('.radio-option');
        
        radioOptions.forEach(function(option) {
            option.addEventListener('click', function(event) {
                // Find the radio input within this option
                const radioInput = this.querySelector('input[type="radio"]');
                if (radioInput) {
                    // Check the radio button
                    radioInput.checked = true;
                    
                    // Optional: Trigger any change event if needed
                    const changeEvent = new Event('change', { bubbles: true });
                    radioInput.dispatchEvent(changeEvent);
                }
            });
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
            // Reject request
            thisObj.onApproveOrReject(0);
        };
    }
    
    
    this.populateForm = function(){
        console.log('dataJoinAccRequest');
        console.log(dataJoinAccRequest);
        
        // Hide this first;
        // If the account has only one farm, no need to show this.
        //elemUiPigFarms.hide()
        
        
        const account   = navigation.userControl.dataUserAccount.account;
        const pig_farms = account.pig_farms;
        
        console.log(pig_farms);
        
        const elem_select = elemUiPigFarms.getElemSelect();
        
        commonSelectOptions.setDataAccPigFarmList(pig_farms, elem_select);
        elemUiPigFarms.setEntryCount(pig_farms);
        
        if (pig_farms.length >= 1){
            elem_select.selectedIndex = 1;
        }
        
        
        const user = dataJoinAccRequest.requesting_user;
        
        let user_name = '';
        if (user.name){
            user_name = user.name;
        }
        else{
            user_name = `${user.name_first} ${user.name_last}`;
        }
        
        elemUserName.textContent  = user_name;
        
        // Optional: Pre-select a default radio option if needed
        // const defaultRadio = elemDivContainer.querySelector('input[value="operations"]');
        // if (defaultRadio) {
        //     defaultRadio.checked = true;
        // }
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
    
    
    
    this.onApproveOrReject = function(is_approved){
        let input_elem      = null;
        let validation      = 0;
        
        
        let user_group_num  = 3;
        
        
        if (is_approved > 0){
            const checkedRadio  = elemDivContainer.querySelector('input[name="user-role"]:checked');
            
            // Check if a radio button is selected
            if (!checkedRadio) {
                // Show error message
                elemServerErrorMsg.textContent = 'Please select a user role';
                elemServerErrorMsg.style.display = 'block';
                return;
            }
            
            const userRole      = checkedRadio.value;
            

            
            switch (userRole){
                case 'admin':       {user_group_num  = 1; break;}
                case 'manager':     {user_group_num  = 2; break;}
                case 'operations':  {user_group_num  = 3; break;}
                default:{user_group_num  = 3; break;}
            }        
        }
    
        
        const elem_select       = elemUiPigFarms.getElemSelect();
        let input_pig_farm_hid  = elem_select.value;
        
        
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
            return;
        } 
        
        
        
        const user_hid      = navigation.userControl.getUserHid();
        const base_url      = window.location.origin;
        
        
        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'user_req_hid':     dataJoinAccRequest.user_req.hid,
            'group_num':        user_group_num,
            'is_approved':      is_approved
        };
        
        if (input_pig_farm_hid != '0' || input_pig_farm_hid != '-1'){
            post_data.pig_farm_hid = input_pig_farm_hid;
        }
        
        
        
        
        let url = `${base_url}/user_request/approve_join_acc`;
        
        
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
                    navigation.showThisPage(showOptions.go_back_page);
                    navigation.pageJoinAccReqList.beforeShow();
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
