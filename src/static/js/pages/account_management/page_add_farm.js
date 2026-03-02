// February 27, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {APPLICATION,
        PAGE_ID,
        SOW_STATUS,
        PIG_PROD_TYPE,
        PIG_OPERATION_TYPE,
        SUPPLIER_TYPE}          from '../../constants.js';





export function PageAddFarm(input_settings){
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;

    
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
    
    

    

    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        
        
        const html =`

        
<div class="signup-card">
    <!-- 1.) PRODUCT & LOGO: centered -->
    <div class="product-row">
        <div class="company-logo">J</div>
        <div class="product-name">SuperPig</div>
    </div>


    <div class="option-title">Add Pig Farm to Account</div>

    <!-- ========== ACCOUNT SECTION ========== -->
    <div>
        <div id="accountPlainGroup">
            <div class="account-plain">
                <!-- editable account name (read-only text by default) -->
                <div id="accountNameDisplay" class="account-name-text">Farm Name</div>
            
                <!-- inline input for editing (hidden by default) -->
                <input type="text" id="accountNameEditInput" class="account-name-input hidden-section" value="" placeholder="Account name">

                <!-- account code (always plain text below) -->
                <div id="accountCodeDisplay" class="account-code">CODE-0000</div>
            </div>
          
        </div>
    </div>


    <!-- ========== FARM SECTION ========== -->
    <div id="farmSection" class="hidden-section">
        <div class="divider"></div>
        
        <div style="margin-top: 0.2rem;">
            <div class="section-label">🏡 ADD FARM</div>
            
            <input type="text" id="farmNameInput" class="input-field" placeholder="e.g., North pasture" value="">
            <button class="btn btn-secondary" id="createFarmBtn">+ Create farm</button>
          
            <!-- farm list feedback -->
            <div id="farmFeedback" class="farm-feedback-area"></div>
        </div>
    </div>


    <!-- FOOTER (Option 1: Simple Legal) added exactly as recommended -->
    <div class="legal-footer">
        <div class="footer-links">
            <a href="#">Terms</a>
            <span class="dot">•</span>
            <a href="#">Privacy</a>
            <span class="dot">•</span>
            <a href="#">Contact</a>
        </div>
      
        <div class="copyright">
            © 2026 J SysDev. All rights reserved.
        </div>
    </div>
</div>



        `;
        
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemHeaderTitle         = elemDivContainer.querySelector('#'+elemIdHeaderTitle);

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
       
        
    }
    
    
    this.beforeShow = function(options){
       
    }
    
    
    this.populateForm = function(){

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
