// December 23, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../common/page_view_basic.js';

import {APPLICATION,
        PAGE_ID,
        SOW_STATUS,
        PIG_PROD_TYPE,
        PIG_OPERATION_TYPE,
        SUPPLIER_TYPE}          from '../../constants.js';

import {CommonSelectOptions}    from '../common/common_select_options.js';


import {addValidationClassToElem} from '../common/ui/ui_utils.js';

import {ComponentAddressLevels} from '../common/ui/comp_address_levels.js'
import {UiInputTextWithCounter} from '../common/ui/input_text_with_counter.js'



export function PagePigFarmAddEdit(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const managerAddress        = navigation.managerAddress;
    
    const MAXCHAR_FARM_NAME     = 30;
    
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContSupplierAddEdit,
        uniqueKey:              'supplier-add-edit'
    };
    */
    const settings              = input_settings;

    
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
        

        
    
    let elemIdHeaderTitle       = null;
    let elemIdBtnClose          = null;
    
    let elemIdServerErrorMsg    = null;
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemHeaderTitle         = null;
    let elemBtnClose            = null;
    
    
    let elemUiName              = null;
    
    let elemServerErrorMsg      = null;
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
    let showOptions             = null;
    
    
    let curAddressLevel1        = null;
    let curAddressLevel2        = null;
    
    
    const compAddressLevels     = new ComponentAddressLevels({
        navigation:             navigation,
        parentObj:              this,
        uniqueKey:              `${settings.uniqueKey}-address`,
        elemDivContainer:       elemDivContainer,
        
        level1Label:            'Select Province or Region',
        level2Label:            'Select City or Municipality',
        level3Label:            'Select Baranggay'
    });
    
    
    
    
    
    this.callbackOnSuccessAdd   = null;
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        elemIdBtnCancel         = `${settings.uniqueKey}-cancel`;
        elemIdBtnSave           = `${settings.uniqueKey}-save`;
        
        
        elemUiName              = new UiInputTextWithCounter({
            uniqueKey:          `${settings.uniqueKey}-name`,
        
            className:          'form-group-text',
            textLabel:          'Name',
            isRequired:         true,
            textMaxChars:       MAXCHAR_FARM_NAME,
            invalidFeedBack:    'Please enter a valid name.',
            helpText:           null
        });
        

        const html_name             = elemUiName.getHtml();
        
        const html_address_levels   = compAddressLevels.getHtml();

        
        
        const html =`

        
<div class="form-container">

    <div class="modal-header">
        <h5 class="modal-title">
            <i class="fas fa-plus me-2"></i><span id="${elemIdHeaderTitle}">Add Semen Supplier</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    
    <div class="modal-body">
        ${html_name}
    
        
        ${html_address_levels}
        

        
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
        elemUiName.afterHtmlRender();
        
        compAddressLevels.afterHtmlRender();

        
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
        compAddressLevels.callbackOnChangeLevel1 = this.onChangeAddressLevel1;
        compAddressLevels.callbackOnChangeLevel2 = this.onChangeAddressLevel2;
        compAddressLevels.callbackOnChangeLevel3 = this.onChangeAddressLevel3;
    }
    
    
    this._bindEventListeners = function(){
        

        elemBtnSave.addEventListener('click', function() {
            thisObj.onClickSaveButton();
        });
        
        
    }
    
    
    
    
   
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        elemUiName.reset();
        
        compAddressLevels.reset();

        
    }
    
    
    this.beforeShow = function(options){
        /*
        
        Typical options 
        {
            is_add:         true,
            supplier_type:  SUPPLIER_TYPE.SEMEN,
            go_back_page:   settings.pageDivContainer   // Go back to this page
            callback_on_success_add : function
        }
        
        */
        
        
        thisObj._resetForm();
        
        
        showOptions = options;
        
        
        // Set title
        let title = 'Edit Pig Farm';
        
        
        
        elemHeaderTitle.textContent  = title;
        

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
        console.log(`navigation.pigFarm.dataPigFarm`);

        console.log(navigation.pigFarm.dataPigFarm);
        
        const pig_farm = navigation.pigFarm.dataPigFarm;
        
        elemUiName.setValue(pig_farm.pig_farm.name);
    }
    
    
    
    this.onChangeAddressLevel1 = function(level_1_hid){
    }
    
    
    this.onChangeAddressLevel2 = function(level_2_hid){
        curAddressLevel2 = compAddressLevels.curAddressLevel2;
    }
    
    
    this.onChangeAddressLevel3 = function(level_3_hid){
       
    }
    
    
    this.onSuccessAddPigFarm = function(pig_farm_hid){
       
        
        
    }
    
    
    this.getAddressHids = function(){
        return compAddressLevels.getAddressHids();
    }
    
        
    this.onClickSaveButton = function(){
        let input_elem;
        let validation      = 0;
        

        let input_name      = elemUiName.getValue();
        
        
        input_elem          = elemUiName.getElemText();
        
        
        if (input_name.length == 0){
            validation = -1;
        }
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        let address_hids = compAddressLevels.getAddressHids();
        
        
        
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
            return;
        }
        
        
        
        const user_hid      = navigation.userControl.getUserHid();
        const base_url      = window.location.origin;

        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'name':             input_name,
            
        };
        
        if (address_hids){
            if (address_hids.level_1_hid != '0' || address_hids.level_1_hid != '-1'){
                post_data.level_1_hid = address_hids.level_1_hid;
            }
            
            if (address_hids.level_2_hid != '0' || address_hids.level_2_hid != '-1'){
                post_data.level_2_hid = address_hids.level_2_hid;
            }
            
            if (address_hids.level_3_hid != '0' || address_hids.level_3_hid != '-1'){
                post_data.level_3_hid = address_hids.level_3_hid;
            }
        }
        
        
        let url;

        
        if (showOptions.is_add){
            url = `${base_url}/pig_farm/add`
        }
        else{
            const pig_farm_hid = navigation.pigFarm.getPigFarmHid();
            post_data.pig_farm_hid = pig_farm_hid;
            
            url = `${base_url}/pig_farm/update`
        }
        
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    // This will return the data pig farm
                    navigation.pigFarm.setDataPigFarm(response.data);
                    navigation.showThisPage(showOptions.go_back_page);
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
