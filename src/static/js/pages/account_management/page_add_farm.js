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
        

    
    let elemAccountNameDisplay  = null;  
    let elemAccountNameEditInput= null;
    let elemInvalidAccNameShow  = null;

    let elemAccountCodeDisplay  = null;  
    
    let elemFarmName            = null;           
    let elemInvalidFarmNameShow = null;
    let elemInvalidFarmNameMsg  = null;
    
    let elemBtnSave             = null;

    let dataUserAccount         = null;

    
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


    
    <!-- ========== ACCOUNT SECTION ========== -->
    <div>
        <div id="accountPlainGroup">
            <div class="account-plain">
                <!-- editable account name (read-only text by default) -->
                <div id="accountNameDisplay" class="account-name-text"></div>
            
                <!-- inline input for editing (hidden by default) -->
                <input type="text" id="accountNameEditInput" class="account-name-input hidden-section" value="" placeholder="Account name">

                <div id="invalid-acc-name-show" class="invalid-feedback" style="display:none;">
                    <i class="fas fa-triangle-exclamation"></i>
                    <span id="invalid-acc-name-msg">Invalid. Minimum 8 characters</span> 
                </div>

                <!-- account code (always plain text below) -->
                <div id="accountCodeDisplay" class="account-code">Account Code: 0000</div>
            </div>
          
        </div>
    </div>
    
    

    <!-- ========== FARM SECTION ========== -->
    <div id="farmSection">
        <div class="option-title" style="justify-content:center;">Add Pig Farm to Account</div>

        <div class="divider"></div>
        
        <div style="margin-top: 0.2rem;">
            <div class="section-label">🏡 Enter Farm Name </div>
            
            <input type="text" id="farmNameInput" class="input-field" placeholder="e.g., North pasture" value="">
            
            <div id="invalid-farm-name-show" class="invalid-feedback" style="display:none;">
                <i class="fas fa-triangle-exclamation"></i>
                <span id="invalid-farm-name-msg">Invalid. Minimum 8 characters</span> 
            </div>
            
            <div class="field-help">Name your first farm — you can add more later</div>
            <button class="btn btn-secondary" id="createFarmBtn">+ Create farm</button>
          
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
        elemAccountNameDisplay      = elemDivContainer.querySelector('#accountNameDisplay');
        elemAccountNameEditInput    = elemDivContainer.querySelector('#accountNameEditInput');
        elemInvalidAccNameShow      = elemDivContainer.querySelector('#invalid-acc-name-show');
        
        elemAccountCodeDisplay      = elemDivContainer.querySelector('#accountCodeDisplay');
        
        
        elemFarmName                = elemDivContainer.querySelector('#farmNameInput');
        elemInvalidFarmNameShow     = elemDivContainer.querySelector('#invalid-farm-name-show');
        elemInvalidFarmNameMsg      = elemDivContainer.querySelector('#invalid-farm-name-msg');
        
        elemBtnSave                 = elemDivContainer.querySelector('#createFarmBtn');
        
        
    }
    
    
    this._processAfterHtmlRender = function(){

    }
    
    
    this._bindEventListeners = function(){
        
        elemAccountNameDisplay.addEventListener('click', function(event){
            if (!dataUserAccount) return; // safety
            
            // switch to edit mode
            const data_account  = dataUserAccount.account;
            const account_name  = data_account.account.account_name;
            
            elemAccountNameEditInput.value = account_name;
            elemAccountNameDisplay.classList.add('hidden-section');
            
            elemAccountNameEditInput.classList.remove('hidden-section');
            elemAccountNameEditInput.focus();
        });
        
        
        elemAccountNameEditInput.addEventListener('blur', thisObj.exitEditAccAndSave);
    
        elemBtnSave.addEventListener('click', thisObj.onClickCreateFarm);
        
        
    }
    
    
    
    
   
    this._resetForm = function(){
       
        
    }
    
    
    this.beforeShow = function(data_user_account){
        dataUserAccount     = data_user_account;
        
        console.log('before show dataUserAccount');
        console.log(dataUserAccount);
        
        
        thisObj.refreshAccountName();
    }
    
    
    this.refreshAccountName =  function(){
        const account_name  = dataUserAccount.account.account.account_name;
        const account_hid   = dataUserAccount.account.account.hid;
            
        elemAccountNameDisplay.textContent = account_name;
        elemAccountNameEditInput.value = account_name;
        elemAccountCodeDisplay.textContent = `Account Code: ${account_hid}`;
    }
    
    
    this.populateForm = function(){

    }
    
    
    this.exitEditAccAndSave = function(){
        if (!dataUserAccount) return;
        
        // already not editing
        if (elemAccountNameEditInput.classList.contains('hidden-section')) return; 

        const newName = elemAccountNameEditInput.value.trim();
        if (newName.length < 8) {
            
            elemInvalidAccNameShow.style.display = 'block';
            return;
        }
        
        
        if (newName !== dataUserAccount.account.account.account_name) {
            // save to database (simulate)
            console.log('to save to database');
            thisObj.onSaveAccountName(newName);
        }
        
        
        const account_name  = dataUserAccount.account.account.account_name;
        

        // always switch back to read-only display (even if same or empty we revert display)
        elemAccountNameDisplay.innerText = account_name;   // ensure fresh
        elemAccountNameDisplay.classList.remove('hidden-section');
        elemAccountNameEditInput.classList.add('hidden-section');

    }
    
        
    this.onSaveAccountName = function(new_acc_name){
        
        
        const user_hid      = dataUserAccount.user.user.hid;
        const base_url      = window.location.origin;

        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'name':             new_acc_name
            
        };
        
        
        let url = `${base_url}/account/update`
        
        
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
                    dataUserAccount.account.account = response.account;
                    
                    thisObj.refreshAccountName();
                    
                    elemInvalidAccNameShow.style.display = 'none';
                }
                else{
                    let error_code = response.result.code;
                    let error_desc = response.result.desc;
                    
                    let html = `<span>${error_code}</span>`;
                    
                    if (error_desc && error_desc.length > 0){
                        html += `<br><span>${error_desc}</span>`;
                    }
                    

                    elemInvalidAccNameShow.style.display = 'block';
                    elemInvalidAccNameShow.innerHTML = html;  
                    
                }
            },
  
            complete: function(){
                // TODO unsay buhaton
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                
            }
        });
    }
    
    
    
        
        
    this.onClickCreateFarm = function(){
        let input_elem;
        let validation      = 0;
        

        let input_name      = elemFarmName.value.trim();
        
        
        
        if (input_name.length < 0){
            elemInvalidFarmNameShow.style.display = 'block';
            return;
        }
        

        
        
        const user_hid      = dataUserAccount.user.user.hid;
        const base_url      = window.location.origin;


        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'name':             input_name
            
        };
        
        
        let url = `${base_url}/pig_farm/add`


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
                    // This is temporary; should href via tokens
                    window.location.href = `/?u=${user_hid}`;
                }
                else{
                    let error_code = response.result.code;
                    let error_desc = response.result.desc;
                    
                    let html = `<span>${error_code}</span>`;
                    
                    if (error_desc && error_desc.length > 0){
                        html += `<br><span>${error_desc}</span>`;
                    }
                    

                    elemInvalidFarmNameShow.style.display = 'block';
                    elemInvalidFarmNameMsg.innerHTML = html;  
                }
            },
  
            complete: function(){
                // TODO unsay buhaton
            },
  
            error: function(jqXHR, textStatus, errorThrown){
               
            }
        });
    }
    
    
    this.requestPageDashBoard = function(){
        
    }
    
}   
