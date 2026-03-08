// February 27, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        SOCIAL_MEDIA,
        PAGE_ID}                from '../../constants.js';


// This is used for signup or login
export function PageUserSignUpOrLogin(input_settings){
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    
    const settings              = input_settings;

    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
    

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

    // Google Sign-In configuration
    const GOOGLE_CLIENT_ID = "466858490005-irmhmqrbnmtkmah0baa27sgorivueu6g.apps.googleusercontent.com"; // Replace with your actual client ID
    const API_BASE_URL = window.location.origin;
    
    // Flags to manage Google Sign-In state
    let isGoogleInitialized = false;
    let isGoogleLoginInProgress = false;
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
        this.loadGoogleScript();
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
        
        
        elemUseGoogle.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            // Visual feedback
            const btn = event.currentTarget;
            btn.style.transform = 'scale(0.98)';
            setTimeout(() => btn.style.transform = '', 120);
            
            thisObj.initiateGoogleLogin();
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
    
    
    // Load Google Sign-In script dynamically
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
    
    
    // Initialize Google Sign-In - using ID token flow
    this.initializeGoogleSignIn = function() {
        // Prevent multiple initializations
        if (isGoogleInitialized) {
            console.log('Google Sign-In already initialized');
            return;
        }
        
        if (window.google && window.google.accounts) {
            try {
                // Initialize the ID token client
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: (response) => thisObj.handleGoogleCredential(response),
                    auto_select: false,
                    cancel_on_tap_outside: true,
                    ux_mode: 'popup'
                });
                
                isGoogleInitialized = true;
                console.log('Google Sign-In initialized successfully for ID tokens');
                
            } catch (error) {
                console.error('Error initializing Google Sign-In:', error);
            }
        } else {
            console.error('Google Sign-In failed to initialize - library not loaded');
            // Retry after a short delay
            setTimeout(() => this.initializeGoogleSignIn(), 500);
        }
    }
    
    
    // Handle Google credential response (receives ID token)
    this.handleGoogleCredential = async function(response) {
        // Prevent multiple simultaneous calls
        if (isGoogleLoginInProgress) {
            console.log('Google login already in progress');
            return;
        }
        
        isGoogleLoginInProgress = true;
        
        try {
            console.log("Google ID token received, sending to backend...");
            console.log("Token preview:", response.credential.substring(0, 50) + "...");
            
            // Show loading state on the Google button
            elemUseGoogle.classList.add('loading');
            const originalText = elemUseGoogle.querySelector('span').textContent;
            elemUseGoogle.querySelector('span').textContent = 'Processing...';
            
            
            // Viewport dimensions (visible page area)
            const viewport_width    = window.innerWidth;
            const viewport_height   = window.innerHeight;
            
            
            
            // Send the credential token to backend
            // The thisObj.afterSuccessSocialMediaLogin action is done together
            // with this request to minimize data traffic.
            const backendResponse = await fetch(`${API_BASE_URL}/api/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token:          response.credential,
                    viewport_width: viewport_width,
                    viewport_height: viewport_height
                })
            });


            if (!backendResponse.ok) {
                const errorData = await backendResponse.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Authentication failed');
            }


            const data = await backendResponse.json();
            console.log("Backend response received:", data);
            
            
            
            // Store token for future API calls
            localStorage.setItem('access_token', data.bearer_token);
            localStorage.setItem('user_picture', data.user_picture);
            
            
            
            thisObj.handlePostLoginFlow(data.user_account)
            
        } catch (error) {
            console.error('Google authentication error:', error);
            this.showError('Failed to authenticate with Google. Please try again.');
        } finally {
            // Reset Google button
            isGoogleLoginInProgress = false;
            elemUseGoogle.classList.remove('loading');
            elemUseGoogle.querySelector('span').textContent = 'Google';
        }
    }
    
    
    // Initiate Google login - requests ID token
    this.initiateGoogleLogin = function() {
        // Prevent multiple login attempts
        if (isGoogleLoginInProgress) {
            console.log('Login already in progress');
            return;
        }
        
        if (!isGoogleInitialized) {
            console.log('Google Sign-In not initialized yet, trying to initialize...');
            this.initializeGoogleSignIn();
            
            // Wait a moment for initialization, then try again
            setTimeout(() => {
                if (isGoogleInitialized) {
                    this.triggerGoogleIdPrompt();
                } else {
                    this.showError('Google Sign-In is still initializing. Please try again.');
                }
            }, 500);
            return;
        }
        
        this.triggerGoogleIdPrompt();
    }
    
    
    // Trigger Google ID token prompt
    this.triggerGoogleIdPrompt = function() {
        if (!window.google || !window.google.accounts) {
            console.error('Google Sign-In not available');
            this.showError('Google Sign-In is not available. Please try again later.');
            return;
        }
        
        try {
            console.log('Requesting Google ID token...');
            
            // First, try the One Tap prompt
            window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    console.log('One Tap not displayed, using button fallback');
                    // If One Tap doesn't work, use button fallback
                    this.fallbackGoogleButton();
                } else if (notification.isDismissedMoment()) {
                    console.log('One Tap dismissed by user');
                }
            });
            
            // Also set up a fallback button click after a short delay
            setTimeout(() => {
                if (!isGoogleLoginInProgress) {
                    console.log('Using fallback button click');
                    this.fallbackGoogleButton();
                }
            }, 800);
            
        } catch (error) {
            console.error('Error during Google prompt:', error);
            this.fallbackGoogleButton();
        }
    }
    
    
    // Fallback method using rendered button
    this.fallbackGoogleButton = function() {
        try {
            // Create a temporary container for the button
            const tempDiv = document.createElement('div');
            tempDiv.id = 'temp-google-button';
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            tempDiv.style.top = '-9999px';
            document.body.appendChild(tempDiv);
            
            // Render Google button that returns ID token
            window.google.accounts.id.renderButton(tempDiv, {
                type: 'standard',
                theme: 'outline',
                size: 'large',
                text: 'signin_with',
                shape: 'rectangular',
                width: '200'
            });
            
            // Find and click the Google button
            setTimeout(() => {
                const googleButton = tempDiv.querySelector('div[role="button"]');
                if (googleButton) {
                    console.log('Clicking Google button for ID token');
                    googleButton.click();
                } else {
                    console.error('Google button not found');
                    this.showError('Could not initialize Google Sign-In button');
                }
                
                // Clean up after a delay
                setTimeout(() => {
                    if (tempDiv.parentNode) {
                        tempDiv.parentNode.removeChild(tempDiv);
                    }
                }, 3000);
            }, 100);
            
        } catch (error) {
            console.error('Fallback Google button failed:', error);
            this.showError('Failed to open Google Sign-In. Please check if popups are blocked.');
        }
    }
    
    
   
    this._resetForm = function(){
       
        
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

    }
    
    
    // Helper method to show errors
    this.showError = function(message) {
        console.error('Error:', message);
        
        // Create a temporary error display
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
        
        // Insert before the social buttons
        const socialList = elemDivContainer.querySelector('.social-list');
        if (socialList) {
            // Remove any existing error messages
            const existingErrors = elemDivContainer.querySelectorAll('.error-message');
            existingErrors.forEach(el => el.remove());
            
            socialList.parentNode.insertBefore(errorDiv, socialList);
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.remove();
                }
            }, 5000);
        } else {
            // Fallback to alert if we can't show the error in the UI
            alert(message);
        }
    }
    

        
    this.onClickSignUpOrLogin = function(){
        let input_elem;
        let validation      = 0;
        

        let input_email     = elemEmail.value;
        
        if (input_email.length == 0){
            elemEmailInvalidShow.style.display = 'block';
            return;
        }
        
        const base_url      = window.location.origin;

        let url;
        
        if (showOptions.is_login){
            url = `${base_url}/user/login_email`;
        }
        else{
            url = `${base_url}/user/register_email`;
        }
        
        
        // send post request
        const post_data = {
            'email':        input_email
        };
        
        
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
                    if (showOptions.is_login){
                        // Handle email login success
                        const data_user_account = response.user_account;
                        thisObj.handlePostLoginFlow(data_user_account);
                    }
                    else{
                        // Handle email signup success
                        const data_user_account = response.user_account;
                        thisObj.handlePostLoginFlow(data_user_account);
                    }
                }
                else{
                    thisObj.showError(response.result.msg || 'An error occurred');
                }
            },
  
            complete: function(){
                // TODO unsay buhaton
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                thisObj.showError('Server error. Please try again.');
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
                // Update URL without reload
                history.pushState({}, '', '/');
            } else {
                // Handle error (redirect to login)
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Failed to load homepage:', error);
        }
    }
    
    
    // Handle post-login flow (extracted from afterSuccessSocialMediaLogin)
    this.handlePostLoginFlow = function(data_user_account) {
        let account_hid         = null;
        let user_req_join_acc   = null;
        
        
        if (data_user_account.account && data_user_account.account.account){
            account_hid = data_user_account.account.account.hid;
        }
        
        if (data_user_account.user && data_user_account.user.user_request){
            user_req_join_acc = data_user_account.user.user_request;
        }
        
        
        if (user_req_join_acc == null) {
        
            if (account_hid == null){
                // User has no account;
                const goto_page_id   = PAGE_ID.CREATE_OR_JOIN_ACCOUNT;
                const page_container = parentObj.getPageContainer(goto_page_id);
                    
                parentObj.showThisPage(page_container);
                parentObj.pageCreateOrJoinAccount.beforeShow(data_user_account);

            }
            
            else{
                // User has already an account;
                console.log('user has account_hid = ' + account_hid);
                
                let account_has_farms = 0;
                
                if (data_user_account.account.pig_farms){
                    if (data_user_account.account.pig_farms.length > 0){
                        account_has_farms = 1;
                    }
                }
                
                
                if (account_has_farms > 0){
                    loadHomePageWithToken();
                    return;
                }
                else {
                    // User has already an account but no pig_farm(s);
                    // It is implied that the user must have chosen 
                    // to be a farm owner or manager
                    
                    const goto_page_id   = PAGE_ID.ADD_FARM;
                    const page_container = parentObj.getPageContainer(goto_page_id);
                        
                    parentObj.showThisPage(page_container);
                    parentObj.pageAddFarm.beforeShow(data_user_account);
                }
            }
            
            return;
        }
        
        else{
            const goto_page_id   = PAGE_ID.REQ_JOIN_ACC_SENT;
            const page_container = parentObj.getPageContainer(goto_page_id);
                
            parentObj.showThisPage(page_container);
            parentObj.pageReqJoinAccountSent.beforeShow(data_user_account);
        }
    }
    
    
    this.onClickUseGoogle = function(){
        // This is now handled by initiateGoogleLogin()
        this.initiateGoogleLogin();
    }
    
    
    this.onClickUseFacebook = function(){
        // TODO: Implement Facebook Sign-In
        // temporary
        const data = {
            social_media_id:    SOCIAL_MEDIA.FACEBOOK,
            email:              'dwong@gmail.com',
            name_first:         'David',
            name_last:          'Wong'
        };
        
        thisObj.afterSuccessSocialMediaLogin(data);
    }
    
    
    this.onClickUseTiktok = function(){
        // TODO: Implement TikTok Sign-In
        console.log('TikTok login clicked - to be implemented');
    }
    
    
    
    
    // This is called after success Social Media login
    /**
     * parameter - data = {
     *      social_media_id:    1,
     *      email:              '',
     *      name_first:         ''
     *      name_last:          ''
     * }
     * 
     * */
    this.afterSuccessSocialMediaLogin = function(data){
        
        // Viewport dimensions (visible page area)
        const viewport_width    = window.innerWidth;
        const viewport_height   = window.innerHeight;
        
        data.viewport_width     = viewport_width;
        data.viewport_height    = viewport_height;
        
        
        const base_url      = window.location.origin;
        let url = base_url + '/user/login_social';
        
        
        // send post request
        const post_data = {
            'social_media_id':  data.social_media_id,
            'email':            data.email,
            'name_first':       data.name_first,
            'name_last':        data.name_last,
            'viewport_width':   viewport_width,
            'viewport_height':  viewport_height
        };
        
        
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
                    
                    const data_user_account = response.user_account;
                    thisObj.handlePostLoginFlow(data_user_account);
                    
                }
                else{
                    thisObj.showError(response.result.msg || 'An error occurred');
                }
            },
  
            complete: function(){
                // TODO unsay buhaton
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                thisObj.showError('Server error. Please try again.');
            }
        });
    }
    
    
}
