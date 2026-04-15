// February 27, 2026
// Jack Wong
// j2718wong@gmail.com
// UPDATED: Added farm owner and farm staff tabs

'use strict';

import {APPLICATION,
        SOCIAL_MEDIA,
        PAGE_ID}                from '../../constants.js';

import {LoadingAnimation}       from './loading_animation.js';
import {UiLanguageSwitch}       from './comp_language_switch.js';
import {PageUserSignUpGoogle}   from './page_user_signup_google.js'


// Add this helper function at the top of your module, after the imports
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}


export async function getLocationWithFallback() {
    const services = [
        // Service 1: ipapi.co (your primary)
        async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            
            try {
                const res = await fetch('https://ipapi.co/json/', { 
                    signal: controller.signal 
                });
                clearTimeout(timeoutId);
                
                if (res.ok) {
                    const data = await res.json();
                    return {
                        login_country_code: data.country_code,
                        login_country_name: data.country_name,
                        login_city: data.city,
                        login_region: data.region
                    };
                }
            } catch (e) {
                console.warn('ipapi.co failed:', e);
            }
            return null;
        },
        
        // Service 2: ip-api.com (no API key needed)
        async () => {
            try {
                const res = await fetch('http://ip-api.com/json/?fields=status,country,countryCode,city,region');
                if (res.ok) {
                    const data = await res.json();
                    if (data.status === 'success') {
                        return {
                            login_country_code: data.countryCode,
                            login_country_name: data.country,
                            login_city: data.city,
                            login_region: data.region
                        };
                    }
                }
            } catch (e) {
                console.warn('ip-api.com failed:', e);
            }
            return null;
        },
        
        // Service 3: ipwhois.io
        async () => {
            try {
                const res = await fetch('https://ipwhois.app/json/');
                if (res.ok) {
                    const data = await res.json();
                    return {
                        login_country_code: data.country_code,
                        login_country_name: data.country,
                        login_city: data.city,
                        login_region: data.region
                    };
                }
            } catch (e) {
                console.warn('ipwhois.io failed:', e);
            }
            return null;
        }
    ];
    
    // Try each service in order until one succeeds
    for (const service of services) {
        const result = await service();
        if (result) {
            console.log('Location data obtained from fallback service');
            return result;
        }
    }
    
    // All services failed - return nulls
    console.warn('All location services failed');
    return {
        login_country_code: null,
        login_country_name: null,
        login_city: null,
        login_region: null
    };
}


// In page_user_signup_or_login.js
export async function loadHomePageWithToken() {
    // Try to get token from cookie first (new flow)
    let token = getCookie('access_token');
    
    // If not in cookie, try localStorage (old flow)
    if (!token) {
        token = localStorage.getItem('access_token');
    }
    
    console.log('Token found:', token ? 'Yes' : 'No');
    
    if (!token) {
        console.log('No token found, redirecting to login');
        // Preserve language when redirecting to login
        const savedLang = localStorage.getItem('user_language');
        let loginUrl = '/login';
        if (savedLang && savedLang !== 'default') {
            loginUrl += '?lang=' + savedLang;
        }
        window.location.href = loginUrl;
        return;
    }
    
    try {
        // Get language preference
        const savedLang = localStorage.getItem('user_language');
        let url = '/';
        if (savedLang && savedLang !== 'default') {
            url = '/?lang=' + savedLang;
            console.log('loadHomePageWithToken - loading homepage with language:', savedLang);
        } else {
            console.log('loadHomePageWithToken - loading homepage without language');
        }
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const html = await response.text();
            document.open();
            document.write(html);
            document.close();
            // Update URL to include language if needed
            if (savedLang && savedLang !== 'default') {
                history.pushState({}, '', '/?lang=' + savedLang);
            } else {
                history.pushState({}, '', '/');
            }
        } else {
            console.log('Failed to load homepage, redirecting to login');
            const savedLang = localStorage.getItem('user_language');
            let loginUrl = '/login';
            if (savedLang && savedLang !== 'default') {
                loginUrl += '?lang=' + savedLang;
            }
            window.location.href = loginUrl;
        }
    } catch (error) {
        console.error('Failed to load homepage:', error);
        const savedLang = localStorage.getItem('user_language');
        let loginUrl = '/login';
        if (savedLang && savedLang !== 'default') {
            loginUrl += '?lang=' + savedLang;
        }
        window.location.href = loginUrl;
    }
}




// This is used for signup or login
export function PageUserSignUpOrLogin(input_settings){
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    
    const settings              = input_settings;
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
    
    
    // DOM Elements
    let elemUiLangSwitch        = null; 
    
    let elemIdIntroText         = null; 
    let elemIdFarmOwner         = null; 
    let elemIdFarmStaff         = null; 
    let elemIdFarmOwnerDesc     = null; 
    let elemIdFarmStaffDesc     = null; 
    
    
    let elemIntroText           = null;
    let elemFarmOwner           = null; 
    let elemFarmStaff           = null; 
    let elemFarmOwnerDesc       = null; 
    let elemFarmStaffDesc       = null; 
    
    
    
    
    let elemTermsText           = null;
    
    let elemUseFacebook         = null;
    let elemUseTiktok           = null;
    
    
    let showOptions             = null;
    let loadingAnimation        = null;
    
    // Tab elements
    let elemTabFarmOwner        = null;
    let elemTabFarmStaff        = null;
    let elemTabOwnerBtn         = null;
    let elemTabStaffBtn         = null;
    let elemFarmOwnerContent    = null;
    let elemFarmStaffContent    = null;
    
    // Owner form elements
    
    let elemManualEmail         = null
    let elemContinueUsingEmail  = null;
    let elemEmail               = null;
    let elemEmailInvalidShow    = null; 
    let elemEmailInvalidMsg     = null;
    let elemBtnSignUpOrLogin    = null;
    let elemLoginOrSignUpLink   = null;
    
    let elemUserLoginNoSignUp   = null;
    
    let elemUserFirstNameShow   = null; 
    let elemUserFirstName       = null;
    let elemUserFirstNameInv    = null;
                                
    let elemUserLastNameShow    = null;
    let elemUserLastName        = null;
    let elemUserLastNameInv     = null;
    
    
    // Staff form elements
    let elemStaffFirstName      = null;
    let elemStaffLastName       = null;
    let elemAccessCode          = null;

    let elemStaffBtnSignUp      = null;
    

    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
        
        this.googleLogin = new PageUserSignUpGoogle({
            parentObj:          this,
            managerLogin:       parentObj,
            elemDivContainer:   elemDivContainer
        });
        
        this.googleLogin.init();
        
        
    }
    
    
    this._writeInlineStyle  = function(){
        // write style here
        return `
        <style>
            /* Tab Navigation */
            .tab-navigation {
                display: flex;
                gap: 10px;
                margin: 0;
                border-bottom: 2px solid #e0e0e0;
                padding-bottom: 10px;
            }
            
            .tab-btn {
                flex: 1;
                padding: 12px 20px;
                border: none;
                background: none;
                font-size: 16px;
                font-weight: 600;
                color: #666;
                cursor: pointer;
                border-radius: 8px 8px 0 0;
                transition: all 0.2s ease;
                position: relative;
            }
            
            .tab-btn:hover {
                background-color: #f5f5f5;
                color: #1877F0;
            }
            
            .tab-btn.active {
                color: #1877F0;
            }
            
            .tab-btn.active::after {
                content: '';
                position: absolute;
                bottom: -12px;
                left: 0;
                right: 0;
                height: 3px;
                background-color: #1877F0;
                border-radius: 3px 3px 0 0;
            }
            
            /* Tab Content */
            .tab-content {
                display: none;
                animation: fadeIn 0.3s ease;
            }
            
            .tab-content.active {
                display: block;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            /* Improved role description text */
            .role-description {
                background-color: #f8f9fa;
                border-left: 4px solid #e83e8c;
                padding: 8px 8px;
                margin: 20px 0;
                border-radius: 8px;
                font-size: 1.2rem;
                line-height: 1.6;
                color: #2c3e50;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            
            .role-description.staff{
                border-left: 4px solid #fd7e14;
            }
            
            .role-description i {
                color: #1877F0;
                margin-right: 8px;
                font-size: 18px;
            }
            
            .role-description strong {
                color: #1877F0;
                font-weight: 700;
            }
            
            /* Staff form styles */
            .staff-form {
                margin-top: 20px;
            }
            
            .name-row {
                display: flex;
                gap: 12px;
                margin-bottom: 20px;
            }
            
            .name-field {
                flex: 1;
            }
            
            .name-field label {
                display: block;
                margin-bottom: 6px;
                font-weight: 500;
                color: #2c3e50;
                font-size: 14px;
            }
            
            .staff-input {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #e0e0e0;
                border-radius: 12px;
                font-size: 1.3rem;
                transition: all 0.2s ease;
                background-color: white;
            }
            
            .staff-input:focus {
                outline: none;
                border-color: #1877F0;
                box-shadow: 0 0 0 3px rgba(24, 119, 240, 0.1);
            }
            
            .staff-input.error {
                border-color: #dc3545;
            }
            
            /* Access code hint */
            .access-code-hint {
                display: block;
                margin-top: 6px;
                color: #666;
                font-size: 13px;
                font-style: italic;
            }
            
            .access-code-hint i {
                color: #1877F0;
            }
            
            /* Sign up button for staff */
            .staff-signup-btn {
                width: 100%;
                padding: 14px;
                margin-top: 10px;
                border: none;
                border-radius: 40px;
                font-weight: 600;
                font-size: 16px;
                color: white;
                background: linear-gradient(135deg, #1877F0 0%, #0a4da8 100%);
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 4px 12px rgba(24, 119, 240, 0.3);
            }
            
            .staff-signup-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(24, 119, 240, 0.4);
            }
            
            .staff-signup-btn:active {
                transform: translateY(0);
            }
            
            /* Responsive adjustments */
            @media (max-width: 480px) {
                .name-row {
                    flex-direction: column;
                    gap: 15px;
                }
                
                .role-description {
                    padding: 8px 8px;
                    font-size: 1.2rem;
                }
            }
        </style>
        `;
    }
    
    
    this.render = function(){
        const html_style = thisObj._writeInlineStyle();
        
        let html_show_manual_email = 'display:none;';
        if (window.SUPERPIG_UI_SETTINGS.enable_manual_email > 0){
            html_show_manual_email = '';
        }
        
        
        elemUiLangSwitch = new UiLanguageSwitch({
            uniqueKey:      'signup_or_login'
        });
        
        
        elemIdIntroText         = `${settings.uniqueKey}-intro-text`;
        elemIdFarmOwner         = `${settings.uniqueKey}-farm-owner`;
        elemIdFarmStaff         = `${settings.uniqueKey}-farm-staff`;
        elemIdFarmOwnerDesc     = `${settings.uniqueKey}-farm-owner-desc`;
        elemIdFarmStaffDesc     = `${settings.uniqueKey}-farm-staff-desc`;
        
        
        let label_signup_to_continue  = 'Sign up to Continue';
        let label_farm_owner    = 'Farm Owner';
        let label_farm_staff    = 'Farm Staff';
        
        let label_farm_owner_desc = '<strong>Farm Owner or Manager</strong> — You own or manage a pig farm and need full access to manage operations, staff, and financial data.';
        let label_farm_staff_desc = '<strong>Farm Staff</strong> — You work on a pig farm and need to join an existing farm account. Ask the account admin for the access code.';
        
        let label_terms_text = `By Signing up, I accept the <a href="/terms">J SysDev Terms of Service</a> 
            and acknowledge the <a href="/privacy" >Privacy Policy</a>.`
        
        let label_continue_email = 'Or use your email';
        let label_enter_email   = 'Enter your email';
        let label_valid_email   = 'Please enter a valid email address';
        
        let label_first_name    = 'First Name';
        let label_last_name     = 'Last Name';
        let label_access_code   = 'Access Code';
        let label_access_code_enter   = 'Enter your Access Code';
        
        let label_login         = 'Login';
        let label_signup        = 'Sign up';
        
        
        const helper = parentObj.translationHelper;

            
        label_signup_to_continue= helper.getSimpleTranslation('page_signup.signup_to_continue') || label_signup_to_continue;
        label_farm_owner        = helper.getSimpleTranslation('page_signup.farm_owner') || label_farm_owner;
        label_farm_staff        = helper.getSimpleTranslation('page_signup.farm_staff') || label_farm_staff;
        
        label_farm_owner_desc   = helper.getSimpleTranslation('page_signup.farm_owner_desc') || label_farm_owner_desc;
        label_farm_staff_desc   = helper.getSimpleTranslation('page_signup.farm_staff_desc') || label_farm_staff_desc;
        
        label_terms_text        = helper.getSimpleTranslation('page_signup.terms_text') || label_terms_text;
        
        label_continue_email    = helper.getSimpleTranslation('page_signup.continue_email') || label_continue_email;
        label_enter_email       = helper.getSimpleTranslation('page_signup.enter_email') || label_enter_email;
        label_valid_email       = helper.getSimpleTranslation('page_signup.valid_email') || label_valid_email;
        
        label_first_name        = helper.getSimpleTranslation('page_signup.first_name') || label_first_name;
        label_last_name         = helper.getSimpleTranslation('page_signup.last_name') || label_last_name;
        label_access_code       = helper.getSimpleTranslation('page_signup.access_code') || label_access_code;
        label_access_code_enter = helper.getSimpleTranslation('page_signup.access_code_enter') || label_access_code_enter;
        
        
        const html_lang_switch  = elemUiLangSwitch.getHtml();
        
        
        const html = `
<div class="signup-card">
    ${html_style}
    
    ${html_lang_switch}
    
    <!-- 1.) PRODUCT & LOGO: centered -->
    <div class="product-row" onclick="window.location.href='/';">
        <div class="company-logo">J</div>
        <div class="product-name">SuperPig</div>
    </div>

    <!-- 2.) "Sign up to continue" (centered) -->
    <h1 class="intro-text" id="${elemIdIntroText}">${label_signup_to_continue}</h1>

    <!-- Tab Navigation -->
    <div class="tab-navigation">
        <button class="tab-btn active" id="tab-owner-btn">
            <i class="fas fa-user-tie"></i> <span id="${elemIdFarmOwner}">${label_farm_owner}</span>
        </button>
        <button class="tab-btn" id="tab-staff-btn">
            <i class="fas fa-users"></i> <span id="${elemIdFarmStaff}">${label_farm_staff}</span>
        </button>
    </div>

    

    <!-- Farm Owner Tab Content -->
    <div id="tab-farm-owner" class="tab-content active">
        <div class="role-description">
            <i class="fas fa-crown"></i>
            <span id="${elemIdFarmOwnerDesc}">
                ${label_farm_owner_desc}
            </span>
        </div>

        <div class="terms-text" style="margin-bottom:12px;">
            ${label_terms_text}
        </div>

        <h1 class="intro-text">Sign In With</h1>
        
        <!-- Social Media login will be the default login  -->
        <div class="social-list">
            <!-- Google -->
            <div id="social-btn-google" class="social-btn google" role="button" tabindex="0" aria-label="Sign up with Google">
                <img src="static_m/images/logo/google-logo.svg" 
                    alt="Google" 
                    width="24" height="24">
                <span>Google</span>
            </div>
            
            
            <!-- Facebook -->
            
            <div id="social-btn-facebook" class="social-btn facebook" role="button" tabindex="0" aria-label="Sign up with Facebook" style="display:none;">
                <i class="fab fa-facebook-f"></i>
                <span>Facebook</span>
            </div>
            
        </div>

        <div id="manual-email" style="${html_show_manual_email}">

            <div class="or-section">
                <span class="or-line"></span>
                <span class="login-label" id="continue-using-email">${label_continue_email}</span>
                <span class="or-line"></span>
            </div>

            <div>
                <label class="login-label" for="email">Email</label>
                <input type="email" id="email" class="email-input" placeholder="Enter your email" inputmode="email" autocomplete="email">
                <div id="invalid-email-show" class="invalid-feedback" style="display:none;">
                    <i class="fas fa-triangle-exclamation"></i>
                    <span id="invalid-email-msg">${label_valid_email}</span> 
                </div>
            </div>

            <!--Should show up only when user directly login withour previous signup. -->
            <div  id="user-login-no-signup" style="margin-top:8px; display:none">
                We can signup you after providing your name. 
            </div>

            <div style="margin-top:8px;" id="user-first-name-show">
                <label class="login-label" for="user-first-name">${label_first_name}</label>
                <input type="text" id="user-first-name" class="email-input" placeholder="Enter your First Name">
                <div id="invalid-first-name-show" class="invalid-feedback" style="display:none;">
                    <i class="fas fa-triangle-exclamation"></i>
                    <span id="invalid-first-name-msg">Please Enter a valid a name</span> 
                </div>
            </div>
            
            <div style="margin-top:8px;" id="user-last-name-show">
                <label class="login-label" for="user-last-name">${label_last_name}</label>
                <input type="text" id="user-last-name" class="email-input" placeholder="Enter your Last Name">
                <div id="invalid-last-name-show" class="invalid-feedback" style="display:none;">
                    <i class="fas fa-triangle-exclamation"></i>
                    <span id="invalid-last-name-msg">Please Enter a valid a name</span> 
                </div>
            </div>
            

            <button class="signup-btn">${label_signup}</button>
        
            <!-- 4.) Already Have an Account? – ENTIRE LINE CLICKABLE (easy mobile tap) -->
            <div class="login-redirect">
                <a href="#" class="login-full-link">
                Already have an account? <span>Log in</span>
                </a>
            </div>
        </div>
    </div>
    
    <!-- Farm Staff Tab Content -->
    <div id="tab-farm-staff" class="tab-content">
        <div class="role-description staff">
            <i class="fas fa-user-check"></i>
            <span="${elemIdFarmStaffDesc}">
                ${label_farm_staff_desc}
            </span>
        </div>
        
        <div class="staff-form">
            <div class="name-row">
                <div>
                    <label for="staff-first-name" class="login-label">${label_first_name}</label>
                    <input type="text" id="staff-first-name" class="staff-input" placeholder="${label_first_name}" inputmode="text" autocomplete="given-name">
                </div>
                <div>
                    <label for="staff-last-name" class="login-label">${label_last_name}</label>
                    <input type="text" id="staff-last-name" class="staff-input" placeholder="${label_last_name}" inputmode="text" autocomplete="family-name">
                </div>
            </div>
            
            
            <label class="login-label" for="access-code" style="margin-top: 20px;">${label_access_code}</label>
            <input type="text" id="access-code" class="staff-input" placeholder="${label_access_code_enter}" inputmode="text" autocomplete="off">
            
            <button class="staff-signup-btn" id="staff-signup-btn">
                ${label_login}
            </button>
        </div>
        
        
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
        // Existing elements
        elemIntroText           = elemDivContainer.querySelector('#'+elemIdIntroText);
        
        elemFarmOwner           = elemDivContainer.querySelector('#'+elemIdFarmOwner);
        elemFarmStaff           = elemDivContainer.querySelector('#'+elemIdFarmStaff);
        elemFarmOwnerDesc       = elemDivContainer.querySelector('#'+elemIdFarmOwnerDesc);
        elemFarmStaffDesc       = elemDivContainer.querySelector('#'+elemIdFarmStaffDesc);
        
        elemTermsText           = elemDivContainer.querySelector('.terms-text');
        
        
        elemUseFacebook         = elemDivContainer.querySelector('#social-btn-facebook');
        elemUseTiktok           = elemDivContainer.querySelector('#social-btn-tiktok');
        
        
        elemManualEmail         = elemDivContainer.querySelector('#manual-email');
        elemContinueUsingEmail  = elemDivContainer.querySelector('#continue-using-email');
        elemEmail               = elemDivContainer.querySelector('#email');
        elemEmailInvalidShow    = elemDivContainer.querySelector('#invalid-email-show');
        elemEmailInvalidMsg     = elemDivContainer.querySelector('#invalid-email-msg');
        
        elemUserLoginNoSignUp   = elemDivContainer.querySelector('#user-login-no-signup');
        
        elemUserFirstNameShow   = elemDivContainer.querySelector('#user-first-name-show');
        elemUserFirstName       = elemDivContainer.querySelector('#user-first-name');
        elemUserFirstNameInv    = elemDivContainer.querySelector('#invalid-first-name-show');
        
        elemUserLastNameShow    = elemDivContainer.querySelector('#user-last-name-show');
        elemUserLastName        = elemDivContainer.querySelector('#user-last-name');
        elemUserLastNameInv     = elemDivContainer.querySelector('#invalid-last-name-show');
        
        
        
        elemBtnSignUpOrLogin    = elemDivContainer.querySelector('.signup-btn');
        
        elemLoginOrSignUpLink   = elemDivContainer.querySelector('.login-full-link');
        
        // Tab elements
        elemTabOwnerBtn         = elemDivContainer.querySelector('#tab-owner-btn');
        elemTabStaffBtn         = elemDivContainer.querySelector('#tab-staff-btn');
        elemFarmOwnerContent    = elemDivContainer.querySelector('#tab-farm-owner');
        elemFarmStaffContent    = elemDivContainer.querySelector('#tab-farm-staff');
        
        // Staff form elements
        elemStaffFirstName      = elemDivContainer.querySelector('#staff-first-name');
        elemStaffLastName       = elemDivContainer.querySelector('#staff-last-name');
        elemAccessCode          = elemDivContainer.querySelector('#access-code');
        elemStaffBtnSignUp      = elemDivContainer.querySelector('#staff-signup-btn');
    }
    
    
    this.initLoadingAnimation = function() {
        loadingAnimation = new LoadingAnimation('google-login-loading', {
            size: '50px',
            color: '#4285f4',
            message: 'Authenticating...',
            type: 'spinner'
        });
    }
    
    
    this._processAfterHtmlRender = function(){
        this.initLoadingAnimation();
    }
    
    
    this._bindEventListeners = function(){
        // Owner tab sign up button
        elemBtnSignUpOrLogin.addEventListener('click', function(event) {
            event.preventDefault();
            event.target.style.transform = 'scale(0.98)';
            setTimeout(() => event.target.style.transform = '', 120);
            thisObj.onClickSignUpOrLogin();
        });
        
        // Staff tab sign up button
        if (elemStaffBtnSignUp) {
            elemStaffBtnSignUp.addEventListener('click', function(event) {
                event.preventDefault();
                event.target.style.transform = 'scale(0.98)';
                setTimeout(() => event.target.style.transform = '', 120);
                thisObj.onClickStaffSignUp();
            });
        }
        
        // Tab switching
        elemTabOwnerBtn.addEventListener('click', function() {
            thisObj.switchTab('owner');
        });
        
        elemTabStaffBtn.addEventListener('click', function() {
            thisObj.switchTab('staff');
        });
        
        
        
        elemLoginOrSignUpLink.addEventListener('click', function(event) {
            if (showOptions.is_login){
                window.location.href = '/signup';
            }
            else{
                window.location.href = '/login';
            }
        });
        
        
          
        elemUseFacebook.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            const btn = event.currentTarget;
            btn.style.transform = 'scale(0.98)';
            setTimeout(() => btn.style.transform = '', 120);
            
            thisObj.onClickUseFacebook();
        });
        
        
        if (elemUseTiktok){
            elemUseTiktok.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                const btn = event.currentTarget;
                btn.style.transform = 'scale(0.98)';
                setTimeout(() => btn.style.transform = '', 120);
                
                thisObj.onClickUseTiktok();
            });  
        }
    }
    
    
    // Tab switching method
    this.switchTab = function(tabName) {
        // Update tab buttons
        if (tabName === 'owner') {
            elemTabOwnerBtn.classList.add('active');
            elemTabStaffBtn.classList.remove('active');
            elemFarmOwnerContent.classList.add('active');
            elemFarmStaffContent.classList.remove('active');
        } else {
            elemTabOwnerBtn.classList.remove('active');
            elemTabStaffBtn.classList.add('active');
            elemFarmOwnerContent.classList.remove('active');
            elemFarmStaffContent.classList.add('active');
        }
    }
    
    
    // Staff sign up handler
    this.onClickStaffSignUp = async function() {
        // Validate first name
        
        if (!elemStaffFirstName.value || elemStaffFirstName.value.trim().length === 0) {
            elemStaffFirstName.classList.add('error');
            setTimeout(() => elemStaffFirstName.classList.remove('error'), 2000);
            this.showError('Please enter your first name');
            return;
        }
        
        // Validate last name
        if (!elemStaffLastName.value || elemStaffLastName.value.trim().length === 0) {
            elemStaffLastName.classList.add('error');
            setTimeout(() => elemStaffLastName.classList.remove('error'), 2000);
            this.showError('Please enter your last name');
            return;
        }
        
        
        // Validate access code
        if (!elemAccessCode.value || elemAccessCode.value.trim().length === 0) {
            elemAccessCode.classList.add('error');
            setTimeout(() => elemAccessCode.classList.remove('error'), 2000);
            this.showError('Please enter your access code');
            return;
        }
        
        let firstName   = elemStaffFirstName.value.trim();
        let lastName    = elemStaffLastName.value.trim();
        let accessCode  = elemAccessCode.value.trim();
        

        
        // Get location and viewport data
        const viewport_width    = window.innerWidth;
        const viewport_height   = window.innerHeight;
        let locationData        = await getLocationWithFallback();
        
        
        
        const base_url = window.location.origin;
        let url = `${base_url}/user/register_or_login`;
        
        const post_data = { 
            access_code_hid:    accessCode,
            
            name_last:          lastName,
            name_first:         firstName,
            
            viewport_width:     viewport_width,
            viewport_height:    viewport_height,
            
            login_country_code: locationData.login_country_code,
            login_country_name: locationData.login_country_name,
            login_city:         locationData.login_city,
            login_region:       locationData.login_region
        };
        
        
        // Show loading
        loadingAnimation.show('Logging you in ...');
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
            data: JSON.stringify(post_data),
  
            success: function(response){
                if (response.result.num == 0){
                    // Hide loading and proceed
                    loadingAnimation.hide();
                    
                    // User is already verified here; save token
                    if (response.bearer_token){
                        console.log('\n\n\nonClickStaffSignUp; User token to be saved in storage');
                        
                        // Store token
                        localStorage.setItem('access_token', response.bearer_token);
                        const data_user_account = response.user_account;
                        
                        
                        // Capture language from URL or localStorage before redirect
                        const urlParams = new URLSearchParams(window.location.search);
                        const urlLang = urlParams.get('lang');
                        if (urlLang) {
                            localStorage.setItem('user_language', urlLang);
                        }
                        
                        
                        parentObj.handlePostLoginFlow(data_user_account);
                        return;
                    }
                    
                    
                    
                    console.log('\n\n\nonClickStaffSignUp; no bearer_token');
                    
                } else {
                    thisObj.showError(response.result.msg || 'An error occurred');
                }
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                thisObj.showError('Server error. Please try again.');
                loadingAnimation.hide();
            }
        });
    }
    
     
  
    this._resetForm = function(){
        // Reset form if needed
    }
    
    
    this.show = function(options){
        thisObj._resetForm();
        
        showOptions = options;
        elemEmailInvalidShow.style.display = 'none';
    
        elemUiLangSwitch.beforeShow();
        
        // Reset to owner tab by default
        this.switchTab('owner');
    
    
        let label_signup_to_continue  = 'Sign up to Continue';    
        let label_login         = 'Login'; 
        let label_sign_up       = 'Sign up'; 
        let label_continue_email= 'Or use your email';
        let label_create_account= '<span>Create Account</span>';
        let label_have_account  = 'Already have an account? <span>Log in</span>';
        
        
        const helper = parentObj.translationHelper;

            
        label_signup_to_continue = helper.getSimpleTranslation('page_signup.signup_to_continue') || label_signup_to_continue;
        label_login         = helper.getSimpleTranslation('page_signup.login') || label_login;
        label_sign_up       = helper.getSimpleTranslation('page_signup.sign_up') || label_sign_up;
        label_continue_email= helper.getSimpleTranslation('page_signup.continue_email') || label_continue_email;    
        label_create_account= helper.getSimpleTranslation('page_signup.create_account') || label_create_account;
        label_have_account  = helper.getSimpleTranslation('page_signup.have_account') || label_have_account;
    
    
        if (showOptions.is_login){
            elemIntroText.textContent           = label_login;
            elemTermsText.style.display         = 'none';
            elemBtnSignUpOrLogin.textContent    = 'Continue';
            elemContinueUsingEmail.textContent  = label_continue_email;    
            elemLoginOrSignUpLink.innerHTML     = label_create_account;
            
            // Hide manual email login, user name 
            elemUserFirstNameShow.style.display = 'none';
            elemUserLastNameShow.style.display  = 'none';
        }
        else{
            elemIntroText.textContent           = label_signup_to_continue;
            elemTermsText.style.display         = 'block';
            elemBtnSignUpOrLogin.textContent    = label_sign_up;
            elemContinueUsingEmail.textContent  = label_continue_email;
            elemLoginOrSignUpLink.innerHTML     = label_have_account;
        
            // Hide manual email login, user name 
            elemUserFirstNameShow.style.display = 'block';
            elemUserLastNameShow.style.display  = 'block';
        }
    }
    
    
    this.populateLanguageOptions = function(){
        
    }
    
    
    this.populateForm = function(){
        // Populate form if needed
    }
    
    
    this.showError = function(message) {
        console.error('Error:', message);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #dc3545;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #dc3545;
            border-radius: 4px;
            background-color: #f8d7da;
            font-size: 14px;
            text-align: center;
        `;
        
        const socialList = elemDivContainer.querySelector('.social-list');
        if (socialList) {
            const existingErrors = elemDivContainer.querySelectorAll('.error-message');
            existingErrors.forEach(el => el.remove());
            
            socialList.parentNode.insertBefore(errorDiv, socialList);
            
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.remove();
                }
            }, 5000);
        } else {
            alert(message);
        }
    }
    
    
    this.onClickSignUpOrLogin = async function(){
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        let input_email = elemEmail.value.toLowerCase();
        
        if (input_email.length == 0){
            elemEmailInvalidShow.style.display = 'block';
            return;
        }
        
        
        if (isValidEmail(input_email) == false){
            elemEmailInvalidShow.style.display = 'block';
            return;
        }
    
    
        // Get user name_last, name_first is signup 
        let input_name_first    = null;
        let input_name_last     = null;

        
        if (showOptions.is_login){}
        else{
            input_name_first    = elemUserFirstName.value.trim();
            input_name_last     = elemUserLastName.value.trim();
            
            if (input_name_first.length == 0){
                elemUserFirstNameInv.style.display = 'block';
                return;
            }
            else{
                elemUserFirstNameInv.style.display = 'none';
            }
            
            if (input_name_last.length == 0){
                elemUserLastNameInv.style.display = 'block';
                return;
            }
            else{
                elemUserLastNameInv.style.display = 'none';
            }
            
            
        }
        
    
        // Get location and viewport data
        const viewport_width    = window.innerWidth;
        const viewport_height   = window.innerHeight;
        let locationData        = await getLocationWithFallback();
        
        
        
        const base_url = window.location.origin;
        let url = `${base_url}/user/register_or_login`;
        
        const post_data = { 
            email:              input_email, 
            viewport_width:     viewport_width,
            viewport_height:    viewport_height,
            
            login_country_code: locationData.login_country_code,
            login_country_name: locationData.login_country_name,
            login_city:         locationData.login_city,
            login_region:       locationData.login_region
        };
        
        if (showOptions.is_login){}
        else{
            post_data.name_last     = input_name_last;
            post_data.name_first    = input_name_first;
        }
        
        
        loadingAnimation.show(showOptions.is_login ? 'Logging in...' : 'Signing you up...');
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
            data: JSON.stringify(post_data),
  
            success: function(response){
                if (response.result.num == 0){
                    // Hide loading and proceed
                    loadingAnimation.hide();
                        
                    if (response.user_unverified){
                        
                        const data = response.user_unverified;
                        data.user_email = input_email;
                        
                        const goto_page_id = PAGE_ID.USER_EMAIL_VERIFY;
                        const page_container = parentObj.getPageContainer(goto_page_id);
                        parentObj.showThisPage(page_container);
                        parentObj.pageEmailVerifyCode.show(data);
                        
                        return;
                    }
                    
                    
                    // User is already verified here; save token
                    if (response.bearer_token){
                        console.log('\n\n\nonClickSignUpOrLogin; User token to be saved in storage');
                        
                        // Store token
                        localStorage.setItem('access_token', response.bearer_token);
                        const data_user_account = response.user_account;
                        
                        
                        // Capture language from URL or localStorage before redirect
                        const urlParams = new URLSearchParams(window.location.search);
                        const urlLang = urlParams.get('lang');
                        if (urlLang) {
                            localStorage.setItem('user_language', urlLang);
                        }
                        
                        
                        parentObj.handlePostLoginFlow(data_user_account);
                        return;
                    }
                    
                    
                    
                    console.log('\n\n\nonClickSignUpOrLogin; no bearer_token');
                    
                } else {
                    // Process response.result.num
                    if (response.result.code == 'RES_NUM_EMAIL_HAS_NO_NAME'){
                        // A manual email signup or login has no user name_first
                        // or name_last
                        loadingAnimation.hide();
                        
                        elemUserLoginNoSignUp.style.display = 'block';
                        elemUserFirstNameShow.style.display = 'block';
                        elemUserLastNameShow.style.display  = 'block';
                        
                        return;
                    }
                }
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                thisObj.showError('Server error. Please try again.');
                loadingAnimation.hide();
            }
        });
    }
    
    
    
  
    
    this.onClickUseFacebook = function(){
        console.log('Facebook login clicked - to be implemented');
        const data = {
            social_media_id: SOCIAL_MEDIA.FACEBOOK,
            email: 'dwong@gmail.com',
            name_first: 'David',
            name_last: 'Wong'
        };
        thisObj.afterSuccessSocialMediaLogin(data);
    }
    
    this.onClickUseTiktok = function(){
        console.log('TikTok login clicked - to be implemented');
    }
    
    this.afterSuccessSocialMediaLogin = function(data){
        const viewport_width = window.innerWidth;
        const viewport_height = window.innerHeight;
        
        data.viewport_width = viewport_width;
        data.viewport_height = viewport_height;
        
        const base_url = window.location.origin;
        let url = base_url + 'in_login_social_media_id';
        
        const post_data = {
            'login_social_media_id': data.social_media_id,
            'email': data.email,
            'name_first': data.name_first,
            'name_last': data.name_last,
            'viewport_width': viewport_width,
            'viewport_height': viewport_height,
            'login_country_code': null,
            'login_country_name': null,
            'login_city': null,
            'login_region': null
        };
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
            data: JSON.stringify(post_data),
  
            success: function(response){
                if (response.result.num == 0){
                    const data_user_account = response.user_account;
                    parentObj.handlePostLoginFlow(data_user_account);
                } else {
                    thisObj.showError(response.result.msg || 'An error occurred');
                }
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                thisObj.showError('Server error. Please try again.');
            }
        });
    }


    
}
