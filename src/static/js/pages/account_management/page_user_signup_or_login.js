// February 27, 2026
// Jack Wong
// j2718wong@gmail.com
// UPDATED: Fixed Google Sign-In popup closing issue

'use strict';

import {APPLICATION,
        SOCIAL_MEDIA,
        PAGE_ID}                from '../../constants.js';

import {LoadingAnimation}       from './loading_animation.js';

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


// This is used for signup or login
export function PageUserSignUpOrLogin(input_settings){
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    
    const settings              = input_settings;
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
    
    // DOM Elements
    let elemIntroText           = null;
    let elemTermsText           = null;
    let elemTermsOfService      = null;
    let elemPrivacyPolicy       = null;
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
    
    // Google Sign-In configuration
    const GOOGLE_CLIENT_ID = "466858490005-irmhmqrbnmtkmah0baa27sgorivueu6g.apps.googleusercontent.com";
    const API_BASE_URL = window.location.origin;
    const REDIRECT_URI = window.location.origin + '/auth/google/callback'; // You'll need to create this endpoint
    
    
    
    // Flags to manage Google Sign-In state
    let isGoogleInitialized     = false;
    let isGoogleLoginInProgress = false;
    
    // Track popup window reference
    let googlePopupWindow       = null;
    
    // =============================================
    // PUBLIC METHODS
    // =============================================
    
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
    
    
    this.render = function(){
        const html = `
<div class="signup-card">
    <!-- 1.) PRODUCT & LOGO: centered -->
    <div class="product-row">
        <div class="company-logo">J</div>
        <div class="product-name">SuperPig</div>
    </div>

    <!-- 2.) "Sign up to continue" (centered) + email -->
    <h1 class="intro-text">Sign up to continue</h1>

    <label class="login-label" for="email">Email</label>
    <input type="email" id="email" class="email-input" placeholder="Enter your email" inputmode="email" autocomplete="email">
    <div id="invalid-email-show" class="invalid-feedback" style="display:none;">
        <i class="fas fa-triangle-exclamation"></i>
        <span id="invalid-email-msg">Please enter an email address</span> 
    </div>

    <div class="terms-text">
        By Signing up, I accept the <a href="#" id="terms-of-service">J SysDev Terms of Service</a> 
        and acknowledge the <a href="#" id="privacy-policy">Privacy Policy</a>.
    </div>

    <button class="signup-btn">Sign up</button>

    <!-- 3.) "Or continue with:" + social one per line (actual icons) -->
    <div class="or-section">
        <span class="or-line"></span>
        <span class="login-label" id="continue-using-social">Or continue with</span>
        <span class="or-line"></span>
    </div>

    <div class="social-list">
        <!-- Google -->
        <div id="social-btn-google" class="social-btn google" role="button" tabindex="0" aria-label="Sign up with Google">
            <i class="fab fa-google"></i>
            <span>Google</span>
        </div>
  
        <!-- Facebook -->
        <div id="social-btn-facebook" class="social-btn facebook" role="button" tabindex="0" aria-label="Sign up with Facebook">
            <i class="fab fa-facebook-f"></i>
            <span>Facebook</span>
        </div>
  
        <!-- TikTok -->
        <div id="social-btn-tiktok" class="social-btn tiktok" role="button" tabindex="0" aria-label="Sign up with TikTok">
            <i class="fab fa-tiktok"></i>
            <span>TikTok</span>
        </div>
    </div>

    <!-- 4.) Already Have an Account? – ENTIRE LINE CLICKABLE (easy mobile tap) -->
    <div class="login-redirect">
        <a href="#" class="login-full-link">
        Already have an account? <span>Log in</span>
        </a>
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
        elemIntroText           = elemDivContainer.querySelector('.intro-text');
        elemTermsText           = elemDivContainer.querySelector('.terms-text');
        elemTermsOfService      = elemDivContainer.querySelector('#terms-of-service');
        elemPrivacyPolicy       = elemDivContainer.querySelector('#privacy-policy');
        elemEmail               = elemDivContainer.querySelector('#email');
        elemEmailInvalidShow    = elemDivContainer.querySelector('#invalid-email-show');
        elemEmailInvalidMsg     = elemDivContainer.querySelector('#invalid-email-msg');
        elemBtnSignUpOrLogin    = elemDivContainer.querySelector('.signup-btn');
        elemContinueUsingSocial = elemDivContainer.querySelector('#continue-using-social');
        elemUseGoogle           = elemDivContainer.querySelector('#social-btn-google'); 
        elemUseFacebook         = elemDivContainer.querySelector('#social-btn-facebook');
        elemUseTiktok           = elemDivContainer.querySelector('#social-btn-tiktok');
        elemLoginOrSignUpLink   = elemDivContainer.querySelector('.login-full-link');
    }
    
    
    this._processAfterHtmlRender = function(){
        // Any post-render processing
    }
    
    
    this._bindEventListeners = function(){
        elemBtnSignUpOrLogin.addEventListener('click', function(event) {
            event.preventDefault();
            event.target.style.transform = 'scale(0.98)';
            setTimeout(() => event.target.style.transform = '', 120);
            thisObj.onClickSignUpOrLogin();
        });
        
        elemTermsOfService.addEventListener('click', function(event) {
            const go_back_page_id = PAGE_ID.SIGNUP_OR_LOGIN;
            const go_back_page  = parentObj.getPageContainer(go_back_page_id);
            
            const options ={
                go_back_page: go_back_page
            };
            parentObj.pageTermsOfService.beforeShow(options);
            
            const next_page_id  = PAGE_ID.TERMS_OF_SERVICE;
            const next_page     = parentObj.getPageContainer(next_page_id);
            parentObj.showThisPage(next_page);
        });
        
        elemPrivacyPolicy.addEventListener('click', function(event) {
            const go_back_page_id = PAGE_ID.SIGNUP_OR_LOGIN;
            const go_back_page  = parentObj.getPageContainer(go_back_page_id);
            
            const options ={
                go_back_page: go_back_page
            };
            parentObj.pagePrivacyPolicy.beforeShow(options);
            
            const next_page_id  = PAGE_ID.PRIVACY_POLICY;
            const next_page     = parentObj.getPageContainer(next_page_id);
            parentObj.showThisPage(next_page);
        });
        
        elemLoginOrSignUpLink.addEventListener('click', function(event) {
            if (showOptions.is_login){
                window.location.href = '/signup';
            }
            else{
                window.location.href = '/login';
            }
        });
        
        
        /*
        elemUseGoogle.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            // Visual feedback
            const btn = event.currentTarget;
            btn.style.transform = 'scale(0.98)';
            setTimeout(() => btn.style.transform = '', 120);
            
            thisObj.initiateGoogleLogin();
        }); */
        
        
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
        
        elemUseTiktok.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            const btn = event.currentTarget;
            btn.style.transform = 'scale(0.98)';
            setTimeout(() => btn.style.transform = '', 120);
            
            thisObj.onClickUseTiktok();
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
    
    // UPDATED: Handle Google credential response with popup closing
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
            const viewport_width = window.innerWidth;
            const viewport_height = window.innerHeight;
            let locationData = await getLocationWithFallback();
            
            // Send to backend
            const backendResponse = await fetch(`${API_BASE_URL}/api/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important for cookies
                body: JSON.stringify({
                    token: response.credential,
                    viewport_width: viewport_width,
                    viewport_height: viewport_height,
                    login_country_code: locationData.login_country_code,
                    login_country_name: locationData.login_country_name,
                    login_city: locationData.login_city,
                    login_region: locationData.login_region
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
            
            // Hide loading and proceed
            loadingAnimation.hide();
            this.handlePostLoginFlow(data.user_account);
            
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
    
    // =============================================
    // FORM METHODS
    // =============================================
    
    this._resetForm = function(){
        // Reset form if needed
    }
    
    this.beforeShow = function(options){
        showOptions = options;
        elemEmailInvalidShow.style.display = 'none';
    
        if (showOptions.is_login){
            elemIntroText.textContent           = 'Login';
            elemTermsText.style.display         = 'none';
            elemBtnSignUpOrLogin.textContent    = 'Continue';
            elemContinueUsingSocial.textContent = 'Or login using:';    
            elemLoginOrSignUpLink.innerHTML     = '<span>Create Account</span>';
        }
        else{
            elemIntroText.textContent           = 'Sign up to continue';
            elemTermsText.style.display         = 'block';
            elemBtnSignUpOrLogin.textContent    = 'Sign up';
            elemContinueUsingSocial.textContent = 'Or continue with:';
            elemLoginOrSignUpLink.innerHTML     = 'Already have an account? <span>Log in</span>';
        }
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
    
    this.onClickSignUpOrLogin = function(){
        let input_email = elemEmail.value;
        
        if (input_email.length == 0){
            elemEmailInvalidShow.style.display = 'block';
            return;
        }
        
        const base_url = window.location.origin;
        let url = showOptions.is_login ? `${base_url}/user/login_email` : `${base_url}/user/register_email`;
        
        const post_data = { 'email': input_email };
        
        loadingAnimation.show(showOptions.is_login ? 'Logging in...' : 'Creating account...');
        
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
                    loadingAnimation.hide();
                    thisObj.handlePostLoginFlow(data_user_account);
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
    
    async function loadHomePageWithToken() {
        const token = localStorage.getItem('access_token');
        
        try {
            const response = await fetch('/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const html = await response.text();
                document.open();
                document.write(html);
                document.close();
                history.pushState({}, '', '/');
            } else {
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Failed to load homepage:', error);
        }
    }
    
    this.handlePostLoginFlow = function(data_user_account) {
        let account_hid = null;
        let user_req_join_acc = null;
        
        if (data_user_account.account && data_user_account.account.account){
            account_hid = data_user_account.account.account.hid;
        }
        
        if (data_user_account.user && data_user_account.user.user_request){
            user_req_join_acc = data_user_account.user.user_request;
        }
        
        if (user_req_join_acc == null) {
            if (account_hid == null){
                // User has no account
                const goto_page_id = PAGE_ID.CREATE_OR_JOIN_ACCOUNT;
                const page_container = parentObj.getPageContainer(goto_page_id);
                parentObj.showThisPage(page_container);
                parentObj.pageCreateOrJoinAccount.beforeShow(data_user_account);
            } else {
                console.log('user has account_hid = ' + account_hid);
                
                let account_has_farms = 0;
                if (data_user_account.account.pig_farms && data_user_account.account.pig_farms.length > 0){
                    account_has_farms = 1;
                }
                
                if (account_has_farms > 0){
                    loadHomePageWithToken();
                    return;
                } else {
                    const goto_page_id = PAGE_ID.ADD_FARM;
                    const page_container = parentObj.getPageContainer(goto_page_id);
                    parentObj.showThisPage(page_container);
                    parentObj.pageAddFarm.beforeShow(data_user_account);
                }
            }
            return;
        } else {
            const goto_page_id = PAGE_ID.REQ_JOIN_ACC_SENT;
            const page_container = parentObj.getPageContainer(goto_page_id);
            parentObj.showThisPage(page_container);
            parentObj.pageReqJoinAccountSent.beforeShow(data_user_account);
        }
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
                    thisObj.handlePostLoginFlow(data_user_account);
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
