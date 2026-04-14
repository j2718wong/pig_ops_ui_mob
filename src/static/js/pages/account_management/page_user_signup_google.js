// February 27, 2026
// Jack Wong
// j2718wong@gmail.com


'use strict';

import {APPLICATION,
        SOCIAL_MEDIA,
        PAGE_ID}                from '../../constants.js';


import {LoadingAnimation}       from './loading_animation.js';

import { getLocationWithFallback } from './page_user_signup_or_login.js';


// This is used for signup or login
export function PageUserSignUpGoogle(input_settings){
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    const managerLogin          = input_settings.managerLogin;
    
    const settings              = input_settings;
    
    const elemDivContainer      = settings.elemDivContainer;
    
    let elemUseGoogle           = null;
    
    
    // Google Sign-In configuration
    // This is the first Google Client ID used; working but the problem is cannot
    // create token for sending email using port 443
    // This project is from jsysdev.contact@gmail.com, SuperPig project 
    //const GOOGLE_CLIENT_ID = "466858490005-irmhmqrbnmtkmah0baa27sgorivueu6g.apps.googleusercontent.com";
    
    // 2026-03-20: New project created from jsysdev.contact@gmail.com, SuperPig2 project
    const GOOGLE_CLIENT_ID = "528524387884-cgehid63a3k9813421ajctmf280p2o7c.apps.googleusercontent.com"
    
    const API_BASE_URL = window.location.origin;
    const REDIRECT_URI = window.location.origin + '/auth/google/callback'; 
    
    
    let loadingAnimation = null;
    
    
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
    
    
       
    this.render = function(){
    }
    
    
    this.afterHtmlRender = function(){
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        
        elemUseGoogle           = elemDivContainer.querySelector('#social-btn-google'); 
    }
    
    
    this._processAfterHtmlRender = function(){
        // Any post-render processing
    }
    
    
    this._bindEventListeners = function(){
        
        
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
    }
    
        
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
            parentObj.showError('Failed to load Google Sign-In. Please refresh the page.');
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
            parentObj.showError('Failed to initiate Google login. Please try again.');
            isGoogleLoginInProgress = false;
        }
    }   

 
    // NEW: Simplified login trigger (removed fallback button complexity)
    this.triggerGoogleLogin = function() {
        if (!window.google || !window.google.accounts) {
            console.error('Google Sign-In not available');
            parentObj.showError('Google Sign-In is not available. Please try again later.');
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
                    parentObj.showError('Popup was blocked. Please allow popups for this site.');
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
            parentObj.showError('Failed to open Google login. Please check if popups are blocked.');
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
            managerLogin.handlePostLoginFlow(data.user_account);
            
        } catch (error) {
            console.error('❌ Google authentication error:', error);
            loadingAnimation.hide();
            parentObj.showError('Failed to authenticate with Google. Please try again.');
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

    }
    
    
    this.show = function(options){
        
    }
    
    
}
