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
    
    let elemEmail               = null;
    let elemEmailInvalidShow    = null; 
    let elemEmailInvalidMsg     = null;
    let elemBtnSignUpOrLogin    = null;
    let elemContinueUsingSocial = null;
    let elemUseGoogle           = null;
    let elemUseFacebook         = null;
    let elemUseTiktok           = null;
    let elemLoginOrSignUpLink   = null;
    let showOptions             = null;
    let loadingAnimation        = null;
    
    // Tab elements
    let elemTabFarmOwner        = null;
    let elemTabFarmStaff        = null;
    let elemTabOwnerBtn         = null;
    let elemTabStaffBtn         = null;
    let elemFarmOwnerContent    = null;
    let elemFarmStaffContent    = null;
    
    // Staff form elements
    let elemFirstName           = null;
    let elemLastName            = null;
    let elemAccessCode          = null;
    let elemStaffEmail          = null;
    let elemStaffEmailInvalidShow = null;
    let elemStaffEmailInvalidMsg = null;
    let elemStaffBtnSignUp      = null;
    
    // Google Sign-In configuration
    // This is the first Google Client ID used; working but the problem is cannot
    // create token for sending email using port 443
    // This project is from jsysdev.contact@gmail.com, SuperPig project 
    //const GOOGLE_CLIENT_ID = "466858490005-irmhmqrbnmtkmah0baa27sgorivueu6g.apps.googleusercontent.com";
    
    // 2026-03-20: New project created from jsysdev.contact@gmail.com, SuperPig2 project
    const GOOGLE_CLIENT_ID = "528524387884-cgehid63a3k9813421ajctmf280p2o7c.apps.googleusercontent.com"
    
    const API_BASE_URL = window.location.origin;
    const REDIRECT_URI = window.location.origin + '/auth/google/callback'; 
    
    
    
    // Flags to manage Google Sign-In state
    let isGoogleInitialized     = false;
    let isGoogleLoginInProgress = false;
    
    // Track popup window reference
    let googlePopupWindow       = null;


    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
        this.loadGoogleScript();
        this.initLoadingAnimation();
        this.setupMessageListener(); // NEW: Listen for popup messages
    }
    
    
    this.initLoadingAnimation = function() {
        loadingAnimation = new LoadingAnimation('google-login-loading', {
            size: '50px',
            color: '#4285f4',
            message: 'Authenticating with Google...',
            type: 'spinner'
        });
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


        <div class="or-section">
            <span class="or-line"></span>
            <span class="login-label" id="continue-using-social">${label_continue_email}</span>
            <span class="or-line"></span>
        </div>

        <label class="login-label" for="email">Email</label>
        <input type="email" id="email" class="email-input" placeholder="Enter your email" inputmode="email" autocomplete="email">
        <div id="invalid-email-show" class="invalid-feedback" style="display:none;">
            <i class="fas fa-triangle-exclamation"></i>
            <span id="invalid-email-msg">${label_valid_email}</span> 
        </div>

        <button class="signup-btn">${label_signup}</button>


        
        <!-- 4.) Already Have an Account? – ENTIRE LINE CLICKABLE (easy mobile tap) -->
        <div class="login-redirect">
            <a href="#" class="login-full-link">
            Already have an account? <span>Log in</span>
            </a>
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
                    <label for="first-name" class="login-label">${label_first_name}</label>
                    <input type="text" id="first-name" class="staff-input" placeholder="${label_first_name}" inputmode="text" autocomplete="given-name">
                </div>
                <div>
                    <label for="last-name" class="login-label">${label_last_name}</label>
                    <input type="text" id="last-name" class="staff-input" placeholder="${label_last_name}" inputmode="text" autocomplete="family-name">
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
        
        
        
        elemEmail               = elemDivContainer.querySelector('#email');
        elemEmailInvalidShow    = elemDivContainer.querySelector('#invalid-email-show');
        elemEmailInvalidMsg     = elemDivContainer.querySelector('#invalid-email-msg');
        elemBtnSignUpOrLogin    = elemDivContainer.querySelector('.signup-btn');
        elemContinueUsingSocial = elemDivContainer.querySelector('#continue-using-social');
        elemUseGoogle           = elemDivContainer.querySelector('#social-btn-google'); 
        elemUseFacebook         = elemDivContainer.querySelector('#social-btn-facebook');
        elemUseTiktok           = elemDivContainer.querySelector('#social-btn-tiktok');
        elemLoginOrSignUpLink   = elemDivContainer.querySelector('.login-full-link');
        
        // Tab elements
        elemTabOwnerBtn         = elemDivContainer.querySelector('#tab-owner-btn');
        elemTabStaffBtn         = elemDivContainer.querySelector('#tab-staff-btn');
        elemFarmOwnerContent    = elemDivContainer.querySelector('#tab-farm-owner');
        elemFarmStaffContent    = elemDivContainer.querySelector('#tab-farm-staff');
        
        // Staff form elements
        elemFirstName           = elemDivContainer.querySelector('#first-name');
        elemLastName            = elemDivContainer.querySelector('#last-name');
        elemStaffEmail          = elemDivContainer.querySelector('#staff-email');
        elemStaffEmailInvalidShow = elemDivContainer.querySelector('#staff-invalid-email-show');
        elemStaffEmailInvalidMsg = elemDivContainer.querySelector('#staff-invalid-email-msg');
        elemAccessCode          = elemDivContainer.querySelector('#access-code');
        elemStaffBtnSignUp      = elemDivContainer.querySelector('#staff-signup-btn');
    }
    
    
    this._processAfterHtmlRender = function(){
        // Any post-render processing
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
        
        
        // In your page_user_signup_or_login.js, update the Google click handler
        elemUseGoogle.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            // Visual feedback
            const btn = event.currentTarget;
            btn.style.transform = 'scale(0.98)';
            setTimeout(() => btn.style.transform = '', 120);
            
            // Get viewport dimensions
            const viewport_width = window.innerWidth;
            const viewport_height = window.innerHeight;
            
            // Redirect to Google login endpoint with viewport data
            window.location.href = `/auth/google/login?viewport_width=${viewport_width}&viewport_height=${viewport_height}`;
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
        
        if (!elemFirstName.value || elemFirstName.value.trim().length === 0) {
            elemFirstName.classList.add('error');
            setTimeout(() => elemFirstName.classList.remove('error'), 2000);
            this.showError('Please enter your first name');
            return;
        }
        
        // Validate last name
        if (!elemLastName.value || elemLastName.value.trim().length === 0) {
            elemLastName.classList.add('error');
            setTimeout(() => elemLastName.classList.remove('error'), 2000);
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
        
        let firstName   = elemFirstName.value.trim();
        let lastName    = elemLastName.value.trim();
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
    
    
    // =============================================
    // NEW: Setup message listener for Google popup
    // =============================================
    this.setupMessageListener = function() {
        window.addEventListener('message', (event) => {
            // Verify the origin for security
            if (event.origin !== 'https://accounts.google.com') {
                return;
            }
            
            console.log('📨 Message from Google popup:', event.data);
            
            // If this is a close message or we detect the popup should close
            if (event.data === 'close' || event.data?.type === 'credential_returned') {
                console.log('Closing Google popup');
                if (googlePopupWindow && !googlePopupWindow.closed) {
                    googlePopupWindow.close();
                    googlePopupWindow = null;
                }
            }
        });
    }
    
    
    // =============================================
    // GOOGLE SIGN-IN METHODS (REDIRECT MODE)
    // =============================================

    this.loadGoogleScript = function() {
        // Check if script already loaded
        if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
            this.initializeGoogleSignIn();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => this.initializeGoogleSignIn();
        script.onerror = () => {
            console.error('Failed to load Google Sign-In script');
            this.showError('Failed to load Google Sign-In. Please refresh the page.');
        };
        document.head.appendChild(script);
    }


    // Initialize Google Sign-In with redirect mode
    this.initializeGoogleSignIn = function() {
        if (window.google && window.google.accounts) {
            try {
                // Use the newer OAuth2 client for redirect mode
                window.google.accounts.oauth2.initCodeClient({
                    client_id: GOOGLE_CLIENT_ID,
                    scope: 'email profile openid',
                    ux_mode: 'redirect',  // CRITICAL: Use redirect instead of popup
                    redirect_uri: REDIRECT_URI,
                    callback: (response) => {
                        // This won't be called in redirect mode
                        // The redirect will handle the response
                        console.log('Redirect callback (should not happen)');
                    }
                });
                
                isGoogleInitialized = true;
                console.log('✅ Google Sign-In initialized with REDIRECT mode');
                console.log('   Redirect URI:', REDIRECT_URI);
                
            } catch (error) {
                console.error('❌ Error initializing Google Sign-In:', error);
            }
        }
    }


    // Initiate Google login - triggers full-page redirect
    this.initiateGoogleLogin = function() {
        if (isGoogleLoginInProgress) {
            console.log('Login already in progress');
            return;
        }
        
        if (!isGoogleInitialized) {
            console.log('Google not initialized, waiting...');
            setTimeout(() => this.initiateGoogleLogin(), 500);
            return;
        }
        
        try {
            console.log('🚀 Redirecting to Google for authentication...');
            isGoogleLoginInProgress = true;
            
            // Store current page to return after login
            sessionStorage.setItem('pre_login_page', window.location.href);
            
            // Trigger the Google redirect
            window.google.accounts.oauth2.initCodeClient({
                client_id: GOOGLE_CLIENT_ID,
                scope: 'email profile openid',
                ux_mode: 'redirect',
                redirect_uri: REDIRECT_URI,
                state: window.location.pathname // Optional: store where to redirect after
            }).requestCode();
            
        } catch (error) {
            console.error('❌ Error during Google redirect:', error);
            this.showError('Failed to initiate Google login. Please try again.');
            isGoogleLoginInProgress = false;
        }
    }   

 
    // NEW: Simplified login trigger (removed fallback button complexity)
    this.triggerGoogleLogin = function() {
        if (!window.google || !window.google.accounts) {
            console.error('Google Sign-In not available');
            this.showError('Google Sign-In is not available. Please try again later.');
            return;
        }
        
        try {
            console.log('🚀 Opening Google login popup...');
            
            // Track the popup window
            googlePopupWindow = window.open('about:blank', '_blank');
            
            // Request Google login
            window.google.accounts.id.prompt((notification) => {
                console.log('Google prompt notification:', notification);
                
                if (notification.isNotDisplayed()) {
                    console.log('Prompt not displayed - popup may be blocked');
                    this.showError('Popup was blocked. Please allow popups for this site.');
                    isGoogleLoginInProgress = false;
                }
                
                if (notification.getDismissedReason()) {
                    console.log('Prompt dismissed:', notification.getDismissedReason());
                    isGoogleLoginInProgress = false;
                }
            });
            
            // Set a timeout to reset if popup doesn't appear
            setTimeout(() => {
                if (googlePopupWindow && googlePopupWindow.closed) {
                    console.log('Popup was closed without authentication');
                    isGoogleLoginInProgress = false;
                }
            }, 30000); // 30 second timeout
            
        } catch (error) {
            console.error('Error during Google login:', error);
            this.showError('Failed to open Google login. Please check if popups are blocked.');
            isGoogleLoginInProgress = false;
        }
    }
    
    

    this.handleGoogleCredential = async function(response) {
        // Prevent multiple simultaneous calls
        if (isGoogleLoginInProgress) {
            console.log('Google login already in progress');
            return;
        }
        
        isGoogleLoginInProgress = true;
        
        try {
            console.log("✅ Google ID token received");
            console.log("Token preview:", response.credential.substring(0, 50) + "...");
            
            // Close the popup immediately
            if (googlePopupWindow && !googlePopupWindow.closed) {
                googlePopupWindow.close();
                googlePopupWindow = null;
                console.log('Popup closed after receiving token');
            }
            
            
            // Also tell Google to clean up
            if (window.google?.accounts?.id) {
                google.accounts.id.cancel();
            }
            
            
            // Show loading state
            elemUseGoogle.classList.add('loading');
            elemUseGoogle.querySelector('span').textContent = 'Processing...';
            loadingAnimation.show('Verifying credentials...');
            
            
            // Get location and viewport data
            const viewport_width    = window.innerWidth;
            const viewport_height   = window.innerHeight;
            let locationData        = await getLocationWithFallback();
            
            
            // Send to backend
            const backendResponse = await fetch(`${API_BASE_URL}/api/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important for cookies
                body: JSON.stringify({
                    token:              response.credential, // Google token
                    viewport_width:     viewport_width,
                    viewport_height:    viewport_height,
                    login_country_code: locationData.login_country_code,
                    login_country_name: locationData.login_country_name,
                    login_city:         locationData.login_city,
                    login_region:       locationData.login_region
                })
            });

            if (!backendResponse.ok) {
                const errorData = await backendResponse.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Authentication failed');
            }

            const data = await backendResponse.json();
            console.log("✅ Backend response received");
            
            // Store token
            localStorage.setItem('access_token', data.bearer_token);
            localStorage.setItem('user_picture', data.user_picture);
            
            // Capture language from URL or localStorage before redirect
            const urlParams = new URLSearchParams(window.location.search);
            const urlLang = urlParams.get('lang');
            if (urlLang) {
                localStorage.setItem('user_language', urlLang);
            }
            
            
            // Hide loading and proceed
            loadingAnimation.hide();
            parentObj.handlePostLoginFlow(data.user_account);
            
        } catch (error) {
            console.error('❌ Google authentication error:', error);
            loadingAnimation.hide();
            this.showError('Failed to authenticate with Google. Please try again.');
        } finally {
            // Reset state
            isGoogleLoginInProgress = false;
            elemUseGoogle.classList.remove('loading');
            elemUseGoogle.querySelector('span').textContent = 'Google';
            
            // Ensure popup is closed
            if (googlePopupWindow && !googlePopupWindow.closed) {
                googlePopupWindow.close();
                googlePopupWindow = null;
            }
        }
    }
    
    
    this._resetForm = function(){
        // Reset form if needed
    }
    
    
    this.show = function(options){
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
            elemContinueUsingSocial.textContent = label_continue_email;    
            elemLoginOrSignUpLink.innerHTML     = label_create_account;
        }
        else{
            elemIntroText.textContent           = label_signup_to_continue;
            elemTermsText.style.display         = 'block';
            elemBtnSignUpOrLogin.textContent    = label_sign_up;
            elemContinueUsingSocial.textContent = label_continue_email;
            elemLoginOrSignUpLink.innerHTML     = label_have_account;
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
    
    
    this.showSuccess = function(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            color: #155724;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #c3e6cb;
            border-radius: 4px;
            background-color: #d4edda;
            font-size: 14px;
            text-align: center;
        `;
        
        const socialList = elemDivContainer.querySelector('.social-list');
        if (socialList) {
            const existingMessages = elemDivContainer.querySelectorAll('.success-message');
            existingMessages.forEach(el => el.remove());
            
            socialList.parentNode.insertBefore(successDiv, socialList);
            
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.remove();
                }
            }, 5000);
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
                    thisObj.showError(response.result.msg || 'An error occurred');
                }
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                thisObj.showError('Server error. Please try again.');
                loadingAnimation.hide();
            }
        });
    }
    
    
    
    
    // =============================================
    // SOCIAL MEDIA METHODS (Facebook, TikTok)
    // =============================================
    
    this.onClickUseGoogle = function(){
        this.initiateGoogleLogin();
    }
    
    
    this.onClickUseFacebook = function(){
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
