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



export function PageCustomerPricing(input_settings){
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
    
    
    
    let elemHeaderTitle         = null;
    let elemBtnClose            = null;
    
    
    
    let showOptions             = null;
    
    
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
        
    

        const html_name             = elemUiName.getHtml();
        
        const html_address_levels   = compAddressLevels.getHtml();

        
        
        const html =`

        
<div class="form-container">

    <div class="modal-header">
        <h5 class="modal-title">
            <i class="fas fa-plus me-2"></i><span id="${elemIdHeaderTitle}">After Free Trial</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    
    <div class="modal-body">
        <div class="customer-container">
            <!-- simple badge (no background) -->
            
            <!--
            <div class="badge-simple">✦ free trial completed</div>

            <h1>Continue with SuperPig</h1>
            <div class="subhead">
                Your 30‑day trial ended. Billing is straightforward — only for breeding stock.
            </div>
            -->

            <!-- plain list: two main policy points (cards removed) -->
            <ul class="plain-list">
                <li><strong>All your users keep access</strong> — If SuperPig helps your operation, every user (owner, manager, staff) continues seamlessly.</li>
                <li><strong>Every 30 days we count</strong> your active <span class="highlight">sows, gilts, and boars</span> across all farms. <strong>Fattening pigs are never charged</strong>.</li>
            </ul>

            <!-- PRICING TABLE (only card-like element) -->
            <div class="pricing-wrap">
                <div class="pricing-header">
                    <h4>🐖 Current Pricing</h4>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Country</th>
                            <th>Currency</th>
                            <th>Per head</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td id="countryName">Philippines</td>
                            <td id="currencyCode">PHP</td>
                            <td id="ratePerHead" class="value-number">200.0</td>
                        </tr>
                    </tbody>
                </table>
                
            </div>

            <!-- billing & notifications – as plain list, no pills, no background, no radius -->
            <ul class="reminder-list">
                <li><strong>Bills are sent by email</strong> — to account admins only. You can also add farm managers to receive them.</li>
                <li><strong>In-app notice</strong> — visible for admins and managers (not shown to operations users).</li>
                <li><strong>15 days to pay</strong> — grace period after each invoice.</li>
            </ul>

            <!-- if unpaid – flat with border, but still no background color -->
            <div class="unpaid-flat">
                <h4>⚠️ If bill is not paid after 15 days</h4>
                <ul>
                    <li>All users lose access to farm data — only the payment verification page remains available.</li>
                    <li>Full access is restored immediately once payment is verified. Your data is never deleted.</li>
                </ul>
                <div class="access-flat">
                    🔐 Your records stay safe — a single verified payment reopens everything.
                </div>
            </div>

            <!-- role visibility – simple line -->
            <div class="role-flat">
                📋 <strong>Billing visibility:</strong> Only admins and managers see payment reminders. Operators (workers) see only production.
            </div>

            <!-- demo hint (very light) -->
            <div class="footer-note">
                ⚡ Prices are based on your account’s country. 
            </div>
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

        const pig_farm = navigation.pigFarm.dataPigFarm;
        
        elemUiName.setValue(pig_farm.pig_farm.name);
        
        
        compAddressLevels.setLocationAddress(pig_farm.location);
        
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
