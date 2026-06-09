// page_acc_access_code_add_edit.js

// March 8, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}        from '../common/page_view_basic.js';
    
import {APPLICATION,    
        PAGE_ID,    
        ACC_USER_GROUP}             from '../../constants.js';
    
import {ComponentBreadCrumbs}       from '../common/ui/comp_breadcrumb.js';
    
    
import {addValidationClassToElem}   from '../common/ui/ui_utils.js';

import {ComponentUserRole}          from './comp_user_role.js';



export function PageAccessCodeAddEdit(input_settings){
    PageViewPigFarmPage.call(this);
    
    const TAG                   = 'PageAccessCodeAddEdit';
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    this.setNavigation(navigation);
    

    
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
                'label':        'Access Codes',
                'gotoPageId':   PAGE_ID.ACCESS_CODE_LIST
            }
        ]
        
    };
    let componentBreadcrumb     = null;
    
    
    let elemIdHeaderTitle       = null;
    let elemIdBtnClose          = null;
    

    let componentUserRole       = null;
    

   
    
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
        
    
    let operationType           = null;
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        componentBreadcrumb     = new ComponentBreadCrumbs(settingsBreadcrumb);
        
        
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
        
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        elemIdBtnCancel         = `${settings.uniqueKey}-cancel`;
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
    
    
        
        
        componentUserRole       = new ComponentUserRole({
            uniqueKey:          `${settings.uniqueKey}-user-role`,
        
            elemDivContainer:   elemDivContainer
        });
        
        
        
        
        const html_breadcrumb   = componentBreadcrumb.getHtml();
        
        const html_user_role    = componentUserRole.getHtml();
        
        
        const html =`
    <div class="form-container">
        ${html_breadcrumb}
        
        <div class="modal-header">
            <h5 class="modal-title">
                <span id="${elemIdHeaderTitle}"><i class="fas fa-plus me-2"></i>Add Access Code</span>
            </h5>
            <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
        </div>
        
        <div class="modal-body">
            <div class="warning-box">
                Access Code will be created after saving. You need to assign a 
                role for this access code. 
            </div>
                
            
            ${html_user_role}
            
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
        
        componentUserRole.afterHtmlRender();         
        
        
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
        componentUserRole.setUserRole(ACC_USER_GROUP.OPERATIONS);
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
    
    
    // Reset add form
    this.show = function(options){
        // Check if Offline
        if (navigation.managerSystem.isOffLine){
            // Display modal offline
            navigation.managerSystem.showOfflineMessageModal();
        }
        
        
        thisObj._resetForm();
        
        showOptions = options;
        
        
        componentUserRole.setUserRole(ACC_USER_GROUP.OPERATIONS);
        
        
        thisObj.setClickListenersOnCloseAndCancelButtons({
            TAG:            TAG,         
            elem_close:     elemBtnClose,  
            elem_cancel:    elemBtnCancel, 
            go_back_page:   showOptions.go_back_page
        });
        
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
        
        const user_group_num = componentUserRole.getUserRole();
        
        if (user_group_num){}
        else{
            elemServerErrorMsg.textContent = 'Must select a user role';
            return;
        }
        
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
            return;
        } 
        
        
        
        const user_hid      = navigation.userControl.getUserHid();
        const base_url      = window.location.origin;
        
        
        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'group_num':        user_group_num
        };
        
        
        
        let url;
        
        if (showOptions.is_add == true){
            url = `${base_url}/access_code/add`;
        }
        else{
            url = `${base_url}/access_code/update`;
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
                    // Fixed return route; After Add/edit should return to list page
                    const dataHashRoute = {
                        pageId:         PAGE_ID.ACCESS_CODE_LIST,
                        refreshList:    true
                    };
                    
                    navigation.managerHashRoute.hashRouter.replace(
                        HASH_ROUTES.ACCESS_CODE_LIST, dataHashRoute);
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
