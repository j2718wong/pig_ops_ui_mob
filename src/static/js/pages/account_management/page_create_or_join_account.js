// February 27, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {APPLICATION,
        SOCIAL_MEDIA,
        PAGE_ID}                from '../../constants.js';


import {UiLanguageSwitch}       from './comp_language_switch.js';



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
        
    let elemUiLangSwitch        = null;
        
    let elemGreetings           = null;

    
    let elemCreateAccount       = null;
    let elemAccountName         = null;      
    let elemInvalidAccNameShow  = null;

    
    let elemJoinAccount         = null;
    let elemAccessCode          = null;
    let elemInvalidAccCodeShow  = null;
    let elemInvalidAccCodeMsg   = null;
    
    let elemBackToSignUp        = null;
    
    let curDataUserAccount      = null;
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        elemUiLangSwitch = new UiLanguageSwitch({
            uniqueKey:      'create_or_join'
        });
        
        let label_choose_option     = 'Hello, please choose an option';
        
        let label_create_account    = 'Create a Pig Farm Account';
        let label_admin             = 'Admin';
        let label_owner_or_manager  = 'Are you the owner or manager of a pig farm?';
        
        let label_feature_a1        = 'You will be an account admin';
        let label_feature_a2        = 'You can grant access to other users who wish to access your PigFarm account.';
        let label_feature_a3        = 'Manage multiple pig farms under one account.';
        let label_feature_a4        = 'Full access to your data.';
        
        let label_create_account_name = 'Create Farm Account Name';
        let label_valid_name        = 'Please enter valid name.';
        
        let label_click_to_continue = 'Click to Continue';
        
        
        let label_join_account      = 'Join a Pig Farm Account';
        let label_needs_access_code = 'Needs Access Code';
        let label_staff_desc        = 'You work as staff on a pig farm. Or you want to join a Farm Account.';
        
        let label_feature_b1        = 'The PigFarm account admins need to provide you a code.';
        let label_feature_b2        = 'You may have limited access to the PigFarm account data based on approved role.';
        
        let label_enter_access_code = 'Enter Access Code';
        let label_valid_code        = 'Please enter valid code.';
        let label_ask_farm_admin    = 'Ask your farm admins for the code.';
        
        let label_back_to_signup    = 'Back to Signup';
        
        
        const helper = parentObj.translationHelper;

        
        label_choose_option     = helper.getSimpleTranslation('page_create_or_join.choose_option') || label_choose_option;
        
        label_create_account    = helper.getSimpleTranslation('page_create_or_join.create_account') || label_create_account;
        label_admin             = helper.getSimpleTranslation('page_create_or_join.admin') || label_admin;
        label_owner_or_manager  = helper.getSimpleTranslation('page_create_or_join.owner_or_manager_desc') || label_owner_or_manager;
        
        label_feature_a1        = helper.getSimpleTranslation('page_create_or_join.feature_a1') || label_feature_a1;
        label_feature_a2        = helper.getSimpleTranslation('page_create_or_join.feature_a2') || label_feature_a2;
        label_feature_a3        = helper.getSimpleTranslation('page_create_or_join.feature_a3') || label_feature_a3;
        label_feature_a4        = helper.getSimpleTranslation('page_create_or_join.feature_a4') || label_feature_a4;
        
        label_create_account_name = helper.getSimpleTranslation('page_create_or_join.create_account_name') || label_create_account_name;
        label_valid_name        = helper.getSimpleTranslation('page_create_or_join.valid_name') || label_valid_name;
        
        label_click_to_continue = helper.getSimpleTranslation('page_create_or_join.click_to_continue') || label_click_to_continue;
        
        
        label_join_account      = helper.getSimpleTranslation('page_create_or_join.join_account') || label_join_account;
        label_needs_access_code = helper.getSimpleTranslation('page_create_or_join.needs_access_code') || label_needs_access_code;
        label_staff_desc        = helper.getSimpleTranslation('page_create_or_join.staff_desc') || label_staff_desc;
        
        label_feature_b1        = helper.getSimpleTranslation('page_create_or_join.feature_b1') || label_feature_b1;
        label_feature_b2        = helper.getSimpleTranslation('page_create_or_join.feature_b2') || label_feature_b2;
        
        label_enter_access_code = helper.getSimpleTranslation('page_create_or_join.enter_access_code') || label_enter_access_code;
        label_valid_code        = helper.getSimpleTranslation('page_create_or_join.valid_code') || label_valid_code;
        label_ask_farm_admin    = helper.getSimpleTranslation('page_create_or_join.ask_farm_admin') || label_ask_farm_admin;
        
        label_back_to_signup    = helper.getSimpleTranslation('page_create_or_join.back_to_signup') || label_back_to_signup;
        
        
        const html_lang_switch  = elemUiLangSwitch.getHtml();
        
        
        const html =`
<div class="signup-card">
    
    ${html_lang_switch}
    
    <!-- 1.) PRODUCT & LOGO: centered -->
    <div class="product-row" onclick="window.location.href='/';">
        <div class="company-logo">J</div>
        <div class="product-name">SuperPig</div>
    </div>

    <div style="margin-bottom:0.5rem; font-weight:600;" id="greetings">
        ${label_choose_option}
    </div>

    <!-- two clickable options -->
    <!-- option 1: create (owner/manager) -->
    <div class="option-card">
        <div class="option-title">
            🐖 ${label_create_account}
            <span class="create-badge">${label_admin}</span>
        </div>
        <div class="option-sub">${label_owner_or_manager}</div>
        <ul class="feature-list">
            <li>${label_feature_a1}</li>
            <li>${label_feature_a2}</li>
            <li>${label_feature_a3}</li>
            <li>${label_feature_a4}</li>
        </ul>
        
        <div class="code-area">
            <div class="code-label">
                ${label_create_account_name}
            </div>
            <div class="input-wrapper">
                <input id="account-name" type="text" maxlength="50" autocomplete="off">
            </div>
            
            <div id="invalid-account-name-show" class="invalid-feedback" style="display:none;">
                <i class="fas fa-triangle-exclamation"></i>
                <span>${label_valid_name}</span> 
            </div>
        </div>
        
        <div id="create-account" style="font-size:1.3rem; margin-top:0.5rem; color: var(--corporate-blue); font-weight:500;">
            👆 ${label_click_to_continue}
        </div>
    </div>

    <!-- option 2: join (staff) -->
    <div class="option-card">
        <div class="option-title">
            🧑‍🌾 ${label_join_account}
            <span class="join-badge">${label_needs_access_code}</span>
        </div>
        <div class="option-sub">${label_staff_desc}</div>
        <ul class="feature-list">
            <li>${label_feature_b1}</li>
            <li>${label_feature_b2}</li>
        </ul>
        
        
        <div class="code-area">
            <div class="code-label">
                ${label_enter_access_code}
            </div>
            <div class="input-wrapper">
                <input id="account-code" type="text" maxlength="12" autocomplete="off">
            </div>
            <div id="invalid-account-code-show" class="invalid-feedback" style="display:none;">
                <i class="fas fa-triangle-exclamation"></i>
                <span id="invalid-account-code-msg">${label_valid_code}</span> 
            </div>
            
            <p style="font-size:1.1rem; margin-top:0.7rem; color:var(--dark-gray);">
                <span style="color:var(--icon-indigo);">🔐</span> ${label_ask_farm_admin}
            </p>
        </div>

        <div id="join-account" style="font-size:1.3rem; margin-top:0.5rem; color: var(--corporate-blue); font-weight:500;">
            👆 ${label_click_to_continue}
        </div>
    </div>
    
    <div style="margin-top: 0.5rem; text-align: center;">
        <button 
            id="back-signup-btn" 
            type="button" 
            style="
                background: none;
                border: none;
                color: var(--corporate-blue);
                font-size: 1rem;
                cursor: pointer;
                padding: 6px 12px;
                transition: all 0.2s ease;
                font-family: inherit;
            "
            onmouseover="this.style.textDecoration='underline';"
            onmouseout="this.style.textDecoration='none';"
        >
            ${label_back_to_signup}
        </button>
    </div>

    
</div>

        `;
        
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        elemUiLangSwitch.afterHtmlRender();
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemGreetings           = elemDivContainer.querySelector('#greetings');


        elemCreateAccount       = elemDivContainer.querySelector('#create-account');
        elemAccountName         = elemDivContainer.querySelector('#account-name');
        elemInvalidAccNameShow  = elemDivContainer.querySelector('#invalid-account-name-show');
        
        
        elemJoinAccount         = elemDivContainer.querySelector('#join-account');
        elemAccessCode          = elemDivContainer.querySelector('#account-code');
        elemInvalidAccCodeShow  = elemDivContainer.querySelector('#invalid-account-code-show');
        elemInvalidAccCodeMsg   = elemDivContainer.querySelector('#invalid-account-code-msg');
        
        elemBackToSignUp        = elemDivContainer.querySelector('#back-signup-btn');
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

        elemBackToSignUp.addEventListener('click', function() {
            // 2. Clear frontend storage
            localStorage.clear();
            sessionStorage.clear();
            
            // 3. Clear all cookies
            document.cookie.split(";").forEach(function(c) {
                var name = c.split("=")[0].trim();
                document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
                document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
            });
            
            // 4. Redirect to signup
            window.location.href = '/signup';
        });
    }
    
    
    
    
   
    this._resetForm = function(){
        elemInvalidAccNameShow.style.display = 'none';
        
        let label_valid_name        = 'Please enter valid name.';
        
        const helper = parentObj.translationHelper;

        label_valid_name        = helper.getSimpleTranslation('page_create_or_join.valid_name') || label_valid_name;
        
        
        const html = `
            <i class="fas fa-triangle-exclamation"></i>
            <span>${label_valid_name}</span> 
        `;
        
        elemInvalidAccNameShow.innerHTML = html;
        
    }
    
    
    this.show = function(data_user, options){
        this._resetForm();
        
        elemUiLangSwitch.beforeShow();
        
        curDataUserAccount = data_user;
        this.populateForm();
    }
    
    
    
    
    this.populateForm = function(){
        function maskEmail(email) {
            if (!email || !email.includes('@')) return email;
            
            const [localPart, domain] = email.split('@');
            
            // Get first 4 characters of local part
            const firstFour = localPart.substring(0, 4);
            
            // Return masked email
            return `${firstFour}*****@${domain}`;
        }
        
        
        function replacePlaceHolders(template, params){
            let result = template;
    
            for (const [key, value] of Object.entries(params)) {
                // Create regex to match {key} and replace with value
                const regex = new RegExp(`{${key}}`, 'g');
                result = result.replace(regex, value);
            }
            
            return result;
        }
        
        
        let label_greet_1 = "Hello, you have registered your email {masked_user_email} to SuperPig. Please choose an option to continue.";
        let label_greet_2 = "Hello <span>{user_name}</span>, you have registered your email {masked_user_email} to SuperPig. Please choose an option to continue.";
        
        
        const helper = parentObj.translationHelper;
        
        
        const user = curDataUserAccount.user.user;
        
        // Check if user was registered using Facebook or Tiktok
        // Note if registered via signin with google will have
        // user.social_media_id = SOCIAL_MEDIA.GOOGLE 
        
        let is_registered_via_email = 0;
        if (user.social_media_id){} 
        else{
            is_registered_via_email = 1;
        }
        
        const masked_user_email = maskEmail(user.email);
        
        let html_greetings;
        
        // If registered via manual email, there is no user name
        if (is_registered_via_email > 0){
            label_greet_1   = helper.getSimpleTranslation('page_create_or_join.greet_1') || label_greet_1;
            const template  = label_greet_1;

            const params = {
                masked_user_email:  masked_user_email   
            };

            
            html_greetings = replacePlaceHolders(template, params);
        }
        else{
            let user_name = '';
            
            if (user.name && user.name.length >0){
                user_name = user.name;
            }
            else {
                if (user.name_first && user.name_first.length >0){
                    user_name = user.name_first
                }
                
                if (user.name_last && user.name_last.length >0){
                    user_name += ' ' + user.name_last
                }
            }
            
            
            switch (user.social_media_id){
                case  SOCIAL_MEDIA.GOOGLE:{
                    
                    label_greet_2   = helper.getSimpleTranslation('page_create_or_join.greet_2') || label_greet_2;
                    const template  = label_greet_2;
        
                    const params = {
                        user_name:          user_name,
                        masked_user_email:  masked_user_email   
                    };
        
                    
                    html_greetings = replacePlaceHolders(template, params);
                    break;
                }
                
                case  SOCIAL_MEDIA.FACEBOOK:{
                    html_greetings = `
                    Hello <span>${user_name}</span>, you have Facebook Account to SuperPig.  
                    Please choose an option to continue.
                    `;
                    break;
                }
                
                case  SOCIAL_MEDIA.FACEBOOK:{
                    html_greetings = `
                    Hello <span>${user_name}</span>, you have Tiktok Account to SuperPig.  
                    Please choose an option to continue.
                    `;
                    break;
                }   
            }
        }
        
        elemGreetings.innerHTML = html_greetings;
    }
    
    
    
        
    this.onClickCreateAccount = function(){
        
        let input_acc_name     = elemAccountName.value;
        
        if (input_acc_name.length == 0){
            elemInvalidAccNameShow.style.display = 'block';
            return;
        }
        
        
        const user_hid      = curDataUserAccount.hid;
        const base_url      = window.location.origin;

        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'name':             input_acc_name
            
        };
        
      
        
        let url = `${base_url}/account/register`
        
        
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
                    
                    const data_user_account = response.user_account;

                    
                    const goto_page_id   = PAGE_ID.ADD_FARM;
                    const page_container = parentObj.getPageContainer(goto_page_id);
                        
                    parentObj.showThisPage(page_container);
                    parentObj.pageAddFarm.show(data_user_account);
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
        let input_access_code  = elemAccessCode.value;
        
        if (input_access_code.length == 0){
            elemInvalidAccCodeShow.style.display = 'block';
            return;
        }
        

        const user_hid      = curDataUserAccount.user.user.hid;
        const base_url      = window.location.origin;

        const bearer_token  = localStorage.getItem('access_token');
        
        
        
        let url = `${base_url}/user_request/join_account?code=${input_access_code}`;
        
        
        $.ajax({
            type: 'GET',
            contentType: "application/json",
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            dataType: 'json',
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    
                    // User is already verified here; save token
                    if (response.bearer_token){
                        console.log('\n\n\nonClickJoinAccount; User token to be saved in storage');
                        
                        // Store token
                        parentObj.saveAuthToken(response.bearer_token);
                        
                        const data_user_account = response.user_account;
                        
                        parentObj.handlePostLoginFlow(data_user_account);
                        return;
                    }

                }
                else{
                    let error_code = response.result.code;
                    let error_desc = response.result.desc;
                    
                    let s_desc = '';
                    if (error_desc && error_desc.length > 0){
                        s_desc  = error_desc;
                    } 
                    
                    let html = `<span>Sorry Invalid Access Code - ${s_desc}</span>`;
                    

                    elemInvalidAccCodeShow.style.display = 'block';
                    elemInvalidAccCodeShow.innerHTML = html;  
                    
                }
            },
  
            complete: function(){
                // TODO unsay buhaton
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                
            }
        });
    }
    
}   
