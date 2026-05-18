// page_pig_farm_add_edit.js

// December 23, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../common/page_view_basic.js';

import {APPLICATION,
        PAGE_ID,
        FLAG_BITS,
        SOW_STATUS,
        PIG_PROD_TYPE,
        PIG_OPERATION_TYPE,
        SUPPLIER_TYPE}          from '../../constants.js';

import {CommonSelectOptions}    from '../common/common_select_options.js';


import {addValidationClassToElem} from '../common/ui/ui_utils.js';

import {ComponentAddressLevels} from '../common/ui/comp_address_levels.js'
import {UiInputTextWithCounter} from '../common/ui/input_text_with_counter.js'
import {ComponentPlusMinusInput} from '../common/ui/comp_plus_minus_input.js';


export function PagePigFarmAddEdit(input_settings){
    PageViewPigFarmPage.call(this);
    
    const TAG                   = 'PagePigFarmAddEdit';
    
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
    
    let elemIdWarningBox        = null;
    
    let elemIdServerErrorMsg    = null;
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    
    let elemHeaderTitle         = null;
    let elemBtnClose            = null;
    
    let elemWarningBox          = null;
    
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
    
    
    const compNumFarrowingCrate = new ComponentPlusMinusInput({
        uniqueKey:              `${settings.uniqueKey}-num-farrowing-crate`,
            
        className:              'form-group-number',
        textLabel:              'Number of Farrowing Crates in the Farm',
        minValue:               0,
        step:                   1,
        isRequired:             false,
        invalidFeedBack:        null,
        helpText:               'This is used for calculating Farrowing Schedule'
    });
    
    
    
    this.callbackOnSuccessAdd   = null;
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
        
        elemIdWarningBox        = `${settings.uniqueKey}-warning-box`;
        
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

        const html_farrowing_crates = compNumFarrowingCrate.getHtml();
        
        
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
    
        
        <div class="warning-box" id="${elemIdWarningBox}">
            Please set you Pig Farm address so that the suppliers can be filtered
            based from your address.
        </div>
    
        
        ${html_address_levels}
        
        ${html_farrowing_crates}

        
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
        
        compNumFarrowingCrate.afterHtmlRender();

        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemHeaderTitle         = elemDivContainer.querySelector('#'+elemIdHeaderTitle);
        elemBtnClose            = elemDivContainer.querySelector('#'+elemIdBtnClose);
            
        elemWarningBox          = elemDivContainer.querySelector('#'+elemIdWarningBox);
            
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
        compNumFarrowingCrate.reset();
        
        elemServerErrorMsg.style.display = 'none';
    }
    
    
    this.show = function(options){
        thisObj.debugNavHistory(TAG);
        
        // Update navigation.curPageNavigated
        navigation.curPageNavigated.pageData = {options: options};
        navigation.curPageNavigated.renderPageFunc = thisObj.renderPage;
        
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
            navigation.managerNavHistory.removeFromNavHistoryHead(
                showOptions.go_back_page);
            
            navigation.showThisPage(showOptions.go_back_page);
        };
        
        elemBtnCancel.onclick = function() {
            navigation.managerNavHistory.removeFromNavHistoryHead(
                        showOptions.go_back_page);
                    
            navigation.showThisPage(showOptions.go_back_page);
        };
    }
    
    
    this.populateForm = function(){

        const pig_farm = navigation.pigFarm.dataPigFarm;
        
        console.log(`pig_farm`);
        console.log(pig_farm);
        
        
        
        
        elemUiName.setValue(pig_farm.pig_farm.name);
        
        if (pig_farm.location.address){
            if (pig_farm.location.address.level_1 && pig_farm.location.address.level_1.hid){
                elemWarningBox.style.display = 'none';
            }
            else{
                elemWarningBox.style.display = 'block';
            }
        }
        
        
        // Get pig_farm country
        const loc_country   = pig_farm.location.country;
        const country_flag  = loc_country.flag;
        
        
        // 2026-05-18 notes:
        // 1.) The original address design has address levels business objects:
        //      - country_id
        //      - address_level_1_id
        //      - address_level_2_id
        //      - address_level_3_id
        //
        // where address_level_1 is the highest geographic division. This
        // was intended for nearby suppliers filtering of the pig farm.
        // 
        // 2.) The address_levels by default are optional, and of this writing
        // only the country Philippines has address levels saved static data in 
        // different database.
        //
        // 3.) Setting up an address level of a country is a major effort, 
        // therefore this must be optional.
        //
        // 
        
        let has_address_levels = 0;
        
        if ((country_flag & FLAG_BITS.APP_COUNTRY.HAS_ADDRESS_LEVELS) > 0){
            has_address_levels = 1;
        }
        
        
        compAddressLevels.setLocationAddress(pig_farm.location, has_address_levels);
        
        compNumFarrowingCrate.setValue(pig_farm.pig_farm.num_farrow_crates);
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
        let input_num_crates= compNumFarrowingCrate.getValue();
        
        
        input_elem          = elemUiName.getElemText();
        
        
        if (input_name.length == 0){
            validation = -1;
        }
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        let address_hids = compAddressLevels.getAddressHids();
        
        
        // Validate number counts
        let number_crates = 0;
        
        input_elem          = compNumFarrowingCrate.getElemText();
        
        try{
            number_crates = parseInt(input_num_crates)
        }catch (error){
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

        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'name':             input_name,
            'num_farrowing_crates': number_crates
        };
        
        if (address_hids){
            if (address_hids.level_1_hid) {
                if (address_hids.level_1_hid == '0' || address_hids.level_1_hid == '-1'){}
                else{
                    if (address_hids.level_1_hid.length > 0){
                        post_data.level_1_hid = address_hids.level_1_hid;
                    }
                }
            }

            
            if (address_hids.level_2_hid) {
                if (address_hids.level_2_hid == '0' || address_hids.level_2_hid == '-1'){}
                else{
                    if (address_hids.level_2_hid.length > 0){
                        post_data.level_2_hid = address_hids.level_2_hid;
                    }
                }
            }
            
            
            if (address_hids.level_3_hid){
                if (address_hids.level_3_hid == '0' || address_hids.level_3_hid == '-1'){}
                else{
                    if (address_hids.level_3_hid.length > 0){
                        post_data.level_3_hid = address_hids.level_3_hid;
                    }
                }
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
                    
                    // This will return the data pig farm
                    navigation.pigFarm.setDataPigFarm(response.data);
                    
                    // Show Container
                    navigation.showThisPage(showOptions.go_back_page);
                    
                    
                    // Show page
                    
                    const go_back_page_id = navigation.getPageIdFromContainer(showOptions.go_back_page);
                    
                    
                    switch (go_back_page_id){
                        case PAGE_ID.MY_ACCOUNT:{
                            navigation.pageMyAccount.show();
                            break;
                        }
                        
                        case PAGE_ID.HOME:{
                            navigation.pageHomeDashBoard.show();
                            break;
                        }
                        
                        default:{
                            if (showOptions.nav_page_obj){
                                showOptions.nav_page_obj.show();
                            }
                            
                            break;
                        }
                    
                    }
                    
                    
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
