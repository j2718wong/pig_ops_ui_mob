// February 27, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {APPLICATION,
        SOCIAL_MEDIA,
        PAGE_ID}                from '../../constants.js';






export function PageCreateOrJoinAccount(input_settings){
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContSupplierAddEdit,
        uniqueKey:              'supplier-add-edit'
    };
    */
    const settings              = input_settings;

    
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
        
    
    let elemCreateAccount       = null;
    let elemAccountName         = null;      
    let elemInvalidAccNameShow  = null;

    
    let elemJoinAccount         = null;
    let elemAccountCode         = null;
    let elemInvalidAccCodeShow  = null;
    let elemInvalidAccCodeMsg   = null;
    
    
    
    let curDataUser             = null;
    
    
    
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


    <!-- two clickable options -->
    <!-- option 1: create (owner/manager) -->
    <div class="option-card" id="create-account">
        <div class="option-title">
            🐖 Create a Pig Farm Account
            <span class="create-badge">Admin</span>
        </div>
        <div class="option-sub">Are you the owner or manager of a pig farm?</div>
        <ul class="feature-list">
            <li>You will be an account admin.</li>
            <li>You can grant access to other users who wish to access your PigFarm account.</li>
            <li>Manage multiple pig farms under one account.</li>
            <li>Full access to your data.</li>
        </ul>
        
        <div class="code-area">
            <div class="code-label">
                Create Farm Account Name
            </div>
            <div class="input-wrapper">
                <input id="account-name" type="text" maxlength="50" autocomplete="off">
            </div>
            
            <div id="invalid-account-name-show" class="invalid-feedback" style="display:none;">
                <i class="fas fa-triangle-exclamation"></i>
                <span>Please enter valid name.</span> 
            </div>
        </div>
        
        <div style="font-size:0.85rem; margin-top:0.5rem; color: var(--corporate-blue); font-weight:500;">
            👆 Click to Continue
        </div>
    </div>

    <!-- option 2: join (staff) -->
    <div class="option-card" id="join-account">
        <div class="option-title">
            🧑‍🌾 Join a Pig Farm Account
            <span class="join-badge">Needs Approval</span>
        </div>
        <div class="option-sub">You work as staff on the pig farm. Or you want to joint the Farm Account</div>
        <ul class="feature-list">
            <li>The PigFarm account admins need to approve your access.</li>
            <li>You may have limited access to the PigFarm account data based on approved role.</li>
        </ul>
        
        
        <div class="code-area">
            <div class="code-label">
                Enter Account Code
            </div>
            <div class="input-wrapper">
                <input id="account-code" type="text" maxlength="12" autocomplete="off">
            </div>
            <div id="invalid-account-code-show" class="invalid-feedback" style="display:none;">
                <i class="fas fa-triangle-exclamation"></i>
                <span id="invalid-account-code-msg">Please enter valid code.</span> 
            </div>
            
            <p style="font-size:0.75rem; margin-top:0.7rem; color:var(--dark-gray);">
                <span style="color:var(--icon-indigo);">🔐</span> Ask your farm admins for the code.
            </p>
        </div>

        
        
        <!-- subtle extra badge recycled -->
        <div style="font-size:0.85rem; margin-top:0.5rem; color: var(--corporate-blue); font-weight:500;">
            👆 Click to Continue
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
        elemCreateAccount       = elemDivContainer.querySelector('#create-account');
        elemAccountName         = elemDivContainer.querySelector('#account-name');
        elemInvalidAccNameShow  = elemDivContainer.querySelector('#invalid-account-name-show');
        
        
        elemJoinAccount         = elemDivContainer.querySelector('#join-account');
        elemAccountCode         = elemDivContainer.querySelector('#account-code');
        elemInvalidAccCodeShow  = elemDivContainer.querySelector('#invalid-account-code-show');
        elemInvalidAccCodeMsg   = elemDivContainer.querySelector('#invalid-account-code-msg');
        
        
    }
    
    
    this._processAfterHtmlRender = function(){

    }
    
    
    this._bindEventListeners = function(){
        
        
        elemCreateAccount.addEventListener('click', function() {
            thisObj.onClickCreateAccount();
        });
        
        elemJoinAccount.addEventListener('click', function() {
            thisObj.onClickJoinAccount();
        });

        
    }
    
    
    
    
   
    this._resetForm = function(){
        elemInvalidAccNameShow.style.display = 'none';
        
        const html = `
            <i class="fas fa-triangle-exclamation"></i>
            <span>Please enter valid name.</span> 
        `;
        
        elemInvalidAccNameShow.innerHTML = html;
        
    }
    
    
    this.beforeShow = function(data_user, options){
        this._resetForm();
        
        curDataUser = data_user;
        
        console.log('create or join');
        console.log(curDataUser);
    }
    
    
    this.populateForm = function(){

    }
    
    
    
        
    this.onClickCreateAccount = function(){
        
        let input_acc_code     = elemAccountCode.value;
        
        if (input_acc_code.length == 0){
            elemInvalidAccCodeShow.style.display = 'block';
            return;
        }
        
        
        
        
        
        const user_hid      = curDataUser.hid;
        const base_url      = window.location.origin;

        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'name':             input_acc_name
            
        };
        
      
        
        let url = `${base_url}/account/register`
        
        
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
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
    }
    
    
    this.onClickJoinAccount = function(){
        let input_acc_name     = elemAccountName.value;
        
        if (input_acc_name.length == 0){
            elemInvalidAccNameShow.style.display = 'block';
            return;
        }
        

        const user_hid      = curDataUser.hid;
        const base_url      = window.location.origin;

        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'name':             input_acc_name
            
        };
        
      
        
        let url = `${base_url}/account/register`
        
        
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
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
    }
    
}   
