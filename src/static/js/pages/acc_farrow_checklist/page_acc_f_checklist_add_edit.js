// page_acc_f_checklist_add_edit.js

// May 20, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../common/page_view_basic.js';

import {APPLICATION,
        PAGE_ID,
        HASH_ROUTES}            from '../../constants.js';



import {UiInputTextWithCounter} from '../common/ui/input_text_with_counter.js';



export function PageAccFChecklistAddEdit(input_settings){
    PageViewPigFarmPage.call(this);
    
    const TAG                   = 'PageAccFChecklistAddEdit';
    
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
        
    
    let elemIdHeaderTitle       = null;    
    let elemIdBtnClose          = null;
    

    let elemUiDescription             = null;
    
    let elemIdServerErrorMsg    = null;
    
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    let elemHeaderTitle         = null;
    let elemBtnClose            = null;
    
    let elemServerErrorMsg      = null;
    
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
    let showOptions             = null;
    
    let dataAccChecklistItem    = null;  
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        elemIdBtnClose          = `${settings.uniqueKey}-select-close`;
        
        
        elemUiDescription        = new UiInputTextWithCounter({
            uniqueKey:          `${settings.uniqueKey}-notes`,
            
            isTextArea:         true,
            className:          'form-group-text-area',
            textLabel:          'Description',
            isRequired:         false,
            textMaxChars:       50,
            rows:               2,
            helpText:           null  
        });
        

        
        
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        elemIdBtnCancel         = `${settings.uniqueKey}-cancel`;
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        
        
      
        const html_description  = elemUiDescription.getHtml();
        
        const html =`

        
<div class="form-container">

    <div class="modal-header gestating">
        <h5 class="modal-title">
            <span id="${elemIdHeaderTitle}"><i class="fas fa-plus me-2"></i>Add Farrowing Checklist</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    
    <div class="modal-body">
        
        
        ${html_description}
        
        
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
        elemUiDescription.afterHtmlRender();
        
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

        elemBtnClose.addEventListener('click', function() {
            history.back();
        });
        
        
        elemBtnCancel.addEventListener('click', function() {
            history.back();
        });
        
        
        elemBtnSave.addEventListener('click', function() {
            thisObj.onClickSaveButton();
        });
        
        
    }
    
    
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        
        
        elemUiDescription.reset();
        
    }
    
    
    this.getEntry = function(entry_hid){
        const data_list = navigation.pigFarm.accountLists.dataAccSowDueChecklist;
        
        for (const cur_entry of data_list){
            if (cur_entry.hid == entry_hid){
                return cur_entry;
            }
        }
        
        return null;
    }
    
    
    
    this.show = function(options, data_checklist_item){
        // Store return route for back button
        thisObj.returnRoute = HASH_ROUTES.ACC_FARROW_CHECKLIST;
        
        // Check if Offline
        if (navigation.managerSystem.isOffLine){
            // Display modal offline
            navigation.managerSystem.showOfflineMessageModal();
        }
        
        
        thisObj._resetForm();
        
        
        showOptions = options;
        
        let html = '';
        if (showOptions.is_add){
            html = `<i class="fas fa-plus me-2"></i>Add Farrowing Checklist`;
        }
        else{
            html = `<i class="fas fa-edit me-2"></i>Edit Farrowing Checklist`;
            
            dataAccChecklistItem = data_checklist_item;
            thisObj.populateForm();
        }
        elemHeaderTitle.innerHTML = html;
    }
    
    
    this.populateForm = function(){
        elemUiDescription.setValue(dataAccChecklistItem.name);
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
        

        let input_description         = elemUiDescription.getValue();
        
        
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
            return;
        }
        
        
        const user_hid      = navigation.userControl.getUserHid();
        const base_url      = window.location.origin;

        let url ='';
        if (showOptions.is_add){
            url = `${base_url}/acc_sow_due_chklst/add`
        }
        else{
            url = `${base_url}/acc_sow_due_chklst/update`
        }
        
        // send post request
        const post_data = {
            'name':         input_description
        };
        
        if (!showOptions.is_add){
            post_data.checklist_hid = dataAccChecklistItem.hid;
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
                elemServerErrorMsg.style.display = 'none';
            },
  
            success: function(response){
                if (response.result.num == 0){
                    
                    // Adding or updating an account_sow_due_chklst entry should 
                    // also update pig_farm_sow_due_chklst
                    
                    const pig_farm_data_checklist = navigation.pigFarm.dataSowDueChecklist;
                    
                    if (pig_farm_data_checklist){
                        // Only update this is there is an entry
                        
                        const callback_success = function(){
                            
                            // Fixed return route; After Add/edit should return to list page
                            const dataHashRoute = {
                                pageId:         PAGE_ID.ACC_FARROW_CHECKLIST,
                                refreshList:    true
                            };
                            
                            navigation.managerHashRoute.hashRouter.replace(
                                HASH_ROUTES.ACC_FARROW_CHECKLIST, dataHashRoute);
                        };
                        
                        
                        navigation.pigFarm.requestDataPigFarmSowDueChecklist(
                            callback_success, elemServerErrorMsg);
                       
                        return; 
                    }
                    
                    
                    // Fixed return route; After Add/edit should return to list page
                    const dataHashRoute = {
                        pageId:         PAGE_ID.ACC_FARROW_CHECKLIST,
                        refreshList:    true
                    };
                    
                    navigation.managerHashRoute.hashRouter.replace(
                        HASH_ROUTES.ACC_FARROW_CHECKLIST, dataHashRoute);
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
