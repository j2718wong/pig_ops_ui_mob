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
        thisObj.debugNavHistory(TAG);
        
        // Update navigation.curPageNavigated
        navigation.curPageNavigated.pageData = {options:options};
        navigation.curPageNavigated.renderPageFunc = thisObj.renderPage;
        
        
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
        
        
        let input_date_dead         = elemUiDateDead.getValue();
        let input_prod_hid          = elemUiCurrentProduction.getValue();
        let input_num_dead          = componentNumDead.getValue();
        let input_dead_type_hid     = componentDeadType.getValue();
        let input_notes             = elemUiNotes.getValue().trim();
        
        
        
        input_elem          = elemUiDateDead.getElemText();
        
        // Convert date to YYYY-MM-DD format
        const dt_dead       = new Date(input_date_dead);
        if (isNaN(dt_dead.getTime())){
            validation      = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        const dt_dead_s   = dt_dead.toLocaleDateString('en-CA');
        validation          = 0
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        // Validate pig_prod
        input_elem          = elemUiCurrentProduction.getElemSelect;
        if (input_prod_hid == '0' || input_prod_hid == '-1'){
            validation      = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        
        
        // Validate number counts
        let number_dead = 0;
        
        input_elem          = componentNumDead.getElemText();
        
        try{
            number_dead = parseInt(input_num_dead)
        }catch (error){
            componentNumDead.setTextInvalid(INVALID_MSG_NUM_INPUT);
            validation = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
        }
        
        
        
        // Validate pig_prod
        input_elem          = componentDeadType.getElemSelect;
        if (input_dead_type_hid == '0' || input_dead_type_hid == '-1'){
            validation      = -1;
            addValidationClassToElem(input_elem, validation);
            if (validation != 0) {return;}
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
            'pig_prod_hid':     input_prod_hid,
            'pig_dead_type_hid':input_dead_type_hid,
            
            'date_dead':        dt_dead_s,
            'num_pigs_dead':    input_num_dead
        };
        
        if (input_notes.length > 0){
            post_data.notes = input_notes;
        }
        
        
        
        
        if (showOptions.is_add == true){}
        else {
            
        }

        
        let url;
        
        if (showOptions.is_add == true){
            url = `${base_url}/prod_pig_dead/add`;
        }
        else{
            url = `${base_url}/prod_pig_dead/update`;
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
                    navigation.managerNavHistory.removeFromNavHistoryHead(
                        showOptions.go_back_page);
                    
                    navigation.showThisPage(showOptions.go_back_page);
                    navigation.pagePigDeadList.show();
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
