// manager_login.js

// February 27, 2026
// Jack Wong
// j2718wong@gmail.com
// Updated: May 25, 2026 - Enhanced PWA token handling

'use strict';

import {APPLICATION,
        SOCIAL_MEDIA,
        PAGE_ID}                    from '../../constants.js';



import {PageUserSignUpOrLogin,
        loadHomePageWithToken}      from './page_user_signup_or_login.js';

import {PageEmailVerifyCode}        from './page_email_verify_code.js'
import {PageCreateOrJoinAccount}    from './page_create_or_join_account.js';
import {PageAddFarm}                from './page_add_farm.js';
import {PageRequestJoinAccountSent} from './page_request_join_account_sent.js';

// This is attaached directly to this object
import {TranslationHelper}          from '../navigation/translation_helper.js';



// This is used for signup or login
export function ManagerLogin(){
    
    const thisObj                       = this;
    
    
    const elemIdContSignupOrLogin       = 'container-signup';
    const elemIdContVerifyEmail         = 'container-verify-code';
    const elemIdContCreateOrJoinAcc     = 'container-create-or-join-acc';
    const elemIdContAddFarm             = 'container-add-farm';
    const elemIdContReqJoinAccSent      = 'container-req-join-acc-sent';
    
    
    
    let elemPageContSignupOrLogin       = null;
    let elemPageContVerifyEmail         = null;
    let elemPageContCreateOrJoinAcc     = null;
    let elemPageContAddFarm             = null;
    let elemPageContReqJoinAccSent      = null;


    
    let elemCopyRightYear               = null;
    
    
    let isProcessingNF = false;
    
    
    this.translationHelper          = new TranslationHelper({
        parentObj:                  this
    });
    
    
    
    this.pageUserSignUpOrLogin      = new PageUserSignUpOrLogin({
        parentObj:                  this,
        elemIdDivContainer:         elemIdContSignupOrLogin,
        uniqueKey:                  'login-or-signup'
    });
    
    
    this.pageEmailVerifyCode        = new PageEmailVerifyCode({
        parentObj:                  this,
        elemIdDivContainer:         elemIdContVerifyEmail,
        uniqueKey:                  'email-verify-code'
    });
    
    
    
    this.pageCreateOrJoinAccount    = new PageCreateOrJoinAccount({
        parentObj:                  this,
        elemIdDivContainer:         elemIdContCreateOrJoinAcc,
        uniqueKey:                  'create-or-join-acc'
    });
    
    
    
    
    this.pageAddFarm                = new PageAddFarm({
        parentObj:                  this,
        elemIdDivContainer:         elemIdContAddFarm,
        uniqueKey:                  'acc-add-farm'
    });
    
    
    this.pageReqJoinAccountSent     = new PageRequestJoinAccountSent({
        parentObj:                  this,
        elemIdDivContainer:         elemIdContReqJoinAccSent,
        uniqueKey:                  'req-join-acc-sent'
    });
    
    


    
    this.dataAddressCountryList     = null;
    
    
    this.currentPage                = null;
    
    
    this.init = function(){
        this.pageUserSignUpOrLogin.init();
        this.pageEmailVerifyCode.init();
        this.pageCreateOrJoinAccount.init();
        this.pageAddFarm.init();
        this.pageReqJoinAccountSent.init();

        
        this.render();
        this.afterHtmlRender();

        
    }
    
    
    
    this.render = function(){}
    
    
    this.afterHtmlRender = function(){
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        
        elemPageContSignupOrLogin       = document.getElementById(elemIdContSignupOrLogin);
        elemPageContVerifyEmail         = document.getElementById(elemIdContVerifyEmail);
        elemPageContCreateOrJoinAcc     = document.getElementById(elemIdContCreateOrJoinAcc);
        elemPageContAddFarm             = document.getElementById(elemIdContAddFarm);
        elemPageContReqJoinAccSent      = document.getElementById(elemIdContReqJoinAccSent);

        
        elemCopyRightYear               = document.getElementById('copyright-year');
        
        
    }
    
    
    this._processAfterHtmlRender = function(){
        // NEW: Add PWA detection logging
        thisObj.detectPWAEnvironment();
    }
    
    
    this._bindEventListeners = function(){
        // NEW: Listen for online/offline events
        window.addEventListener('online', () => {
            console.log('ManagerLogin: Connection restored');
            thisObj.handleConnectionRestored();
        });
        
        window.addEventListener('offline', () => {
            console.log('ManagerLogin: Connection lost');
        });
        
        // NEW: Listen for storage events (cross-tab sync)
        window.addEventListener('storage', (event) => {
            if (event.key === 'access_token') {
                console.log('ManagerLogin: Token changed in another tab');
                if (event.newValue) {
                    thisObj.syncTokenFromOtherTab(event.newValue);
                }
            }
        });
    }
    
    
    // NEW: Detect PWA environment
    this.detectPWAEnvironment = function() {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                            window.navigator.standalone === true;
        
        if (isStandalone) {
            console.log('Running as PWA - enhanced token persistence enabled');
            document.body.classList.add('pwa-mode');
        } else {
            console.log('Running in browser');
        }
        
        // Log token status
        const token = thisObj.getAuthToken();
        console.log('Initial token status:', token ? 'Present' : 'Missing');
    }
    
    
    // NEW: Handle connection restored
    this.handleConnectionRestored = async function() {
        const token = thisObj.getAuthToken();
        
        if (token && window.location.pathname !== '/app') {
            console.log('Connection restored with token, verifying...');
            
            try {
                const response = await fetch('/user/verify_token', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    console.log('Token valid, redirecting to app');
                    window.location.href = '/app';
                } else {
                    console.log('Token invalid, staying on login page');
                    // Clear invalid token
                    thisObj.clearAllTokens();
                }
            } catch (error) {
                console.log('Network error during verification');
            }
        }
    }
    
    
    // NEW: Sync token from another tab
    this.syncTokenFromOtherTab = function(token) {
        console.log('Syncing token from another tab');
        
        // Update all storage locations
        localStorage.setItem('access_token', token);
        sessionStorage.setItem('access_token', token);
        thisObj.setCookieToken(token);
        
        // If we're on login page and got a token, redirect to app
        if (token && (window.location.pathname === '/login' || 
                      window.location.pathname === '/signup')) {
            console.log('Token received from another tab, redirecting to app');
            window.location.href = '/app';
        }
    }
    
    
    // NEW: Set cookie with proper PWA persistence
    this.setCookieToken = function(token) {
        if (!token) return;
        
        const expires = new Date();
        expires.setTime(expires.getTime() + (60 * 24 * 60 * 60 * 1000)); // 60 days
        
        const isSecure = window.location.protocol === 'https:';
        const secureFlag = isSecure ? '; Secure' : '';
        
        // Fix domain handling for PWA
        let domainFlag = '';
        if (window.location.hostname !== 'localhost') {
            const domain = window.location.hostname.split(':')[0];
            domainFlag = `; domain=${domain}`;
        }
        
        document.cookie = `access_token=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Strict${secureFlag}${domainFlag}`;
    }
    
    
    // NEW: Clear all tokens from all storage
    this.clearAllTokens = function() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        sessionStorage.removeItem('access_token');
        
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        document.cookie = 'access_token=; path=/; domain=.jsysdev.com; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        
        if (window.__auth_token) {
            delete window.__auth_token;
        }
        
        console.log('All tokens cleared');
    }
    
    
    this.getLanguageFromUrl = function() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('lang');
    }


    this.getLanguageFromCookie = function() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'user_lang') return value;
        }
        return null;
    }


    this.setLanguageCookie = function(lang) {
        document.cookie = `user_lang=${lang}; path=/; max-age=31536000`;
    }

    
    /**
     * Will check connection test; To use:
     * 
     * // Usage
     * connectionTest((status) => {
     *     if (!status.hasInternet) {
     *         console.log('No internet - 0 bytes transferred');
     *         showNoInternetMessage();
     *     } else if (!status.serverReachable) {
     *         console.log('Server down - 0 bytes transferred');
     *         showServerDownMessage();
     *     } else {
     *         console.log('Both working - 0 bytes transferred');
     *         proceedWithRequest();
     *     }
     * });
     * 
     * */
    this.connectionTest = function(callback) {
        const testResults = {
            hasInternet: false,
            serverReachable: false,
            bytesTransferred: 0,
            timestamp: Date.now()
        };
        
        let testsCompleted = 0;
        
        // Test 1: HEAD request to reliable CDN (tests internet connectivity)
        fetch('https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js', {
            method: 'HEAD',
            cache: 'no-store',
            timeout: 3000
        })
        .then(() => {
            testResults.hasInternet = true;
            console.log('Check Internet connection: HEAD request successful - 0 bytes');
        })
        .catch(() => {
            testResults.hasInternet = false;
            console.log('Check Internet connection: HEAD request failed');
        })
        .finally(() => {
            testsCompleted++;
            if (testsCompleted === 2) callback(testResults);
        });
        
        // Test 2: HEAD request to favicon.ico (tests if server is reachable)
        fetch(`${window.location.origin}/favicon.ico?t=${Date.now()}`, {
            method: 'GET',
            cache: 'no-store',
            timeout: 3000
        })
        .then(() => {
            testResults.serverReachable = true;
            console.log('Check Server Connection: favicon.ico GET request successful');
        })
        .catch((error) => {
            testResults.serverReachable = false;
            console.log('Check Server Connection: favicon.ico GET request failed -', error.message);
        })
        .finally(() => {
            testsCompleted++;
            if (testsCompleted === 2) callback(testResults);
        });
    };

    
    
    this.onPageLoad = function(){
        const url_path = window.location.pathname;
        const bearer_token = thisObj.getAuthToken();
        
        // NEW: Enhanced offline detection for PWA
        if (!navigator.onLine && bearer_token) {
            console.log('Offline with token - attempting to use cached app');
            // Store that we're offline but have token
            sessionStorage.setItem('offline_with_token', 'true');
            window.location.href = '/app';
            return;
        }
        
        // Get language from URL or cookie
        let currentLang = this.getLanguageFromUrl();
        if (!currentLang) {
            currentLang = this.getLanguageFromCookie();
        }
        if (currentLang && currentLang !== 'default') {
            this.setLanguageCookie(currentLang);
            localStorage.setItem('user_language', currentLang);
        }
        
        
        if (url_path == '/logout'){
            // Clear all storage including PWA persistent storage
            thisObj.clearAllTokens();
            
            // Clear auth cookies with all possible paths/domains
            document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'access_token=; path=/; domain=.jsysdev.com; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'user_lang=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            
            // Clear IndexedDB if needed
            if (window.indexedDB) {
                indexedDB.deleteDatabase('app_auth');
            }
            
            // Redirect to home or login
            window.location.href = '/login';
            return;
        }
        
        
        // Set CopyRight Year
        const currentYear = new Date().getFullYear();
        if (elemCopyRightYear) {
            elemCopyRightYear.textContent = currentYear;
        }
        
        
                        
        // Check if there is a access_token stored;
        if (bearer_token){
            console.log('\n\n\nmanagerLogin; has bearer token');
            console.log('Token source:', thisObj.getTokenSource());
            
            const urlParams = new URLSearchParams(window.location.search);
            const state     = urlParams.get('state');
            const urlLang   = urlParams.get('lang');
    
            // If language is present in URL, store it immediately
            if (urlLang) {
                console.log('Language found in URL:', urlLang);
                localStorage.setItem('user_language', urlLang);
            }
            

            
            if (state) {
            
                switch (state){
                    case 'NF':{
                        // This comes from Navigation class redirect. 
                        // 
                        // window.location.href = "/login?state=NF";
                        
                        // In normal flow,
                        // 1.) User (pig_farm owner) use google or any social 
                        //      media. Or Manual enter email.
                        // 2.) User is saved into the system. 
                        // 3.) User creates new account
                        // 4.) After success creating account, User adds first farm
                        // 5.) After success adding first pig farm, redirects to "/" 
                        
                        // No Farm state; but the user has bearer token;
                        
                        // This is the case for:
                        //
                        // 1.) The user creates an account, but did not 
                        //  finish creating a pig_farm. And the user refreshes 
                        // the page. Or user switch language.
                        //  So the User at this time has a user_id and account_id
                        //  which are all valid. At this point also the user 
                        // access_token is already saved in storage.
                        // The user in this case is cleary a farm owner 
                        // not staff since was able to create account.
                        //
                        // In this case the user should go back to the registration 
                        // page where to input first pig farm. 
                        
                        
                        // 2026-03-23 Notes:
                        // 2.) It is also possible that user, use the back button
                        // or simply refresh again this URL "/login?state=NF". 
                        // It should be checked if user has really no farms
                        // before going to  PAGE_ID.ADD_FARM;
                        
                        // Prevent multiple simultaneous calls
                        if (thisObj.isProcessingNF) {
                            console.log('Already processing NF state, ignoring...');
                            return;
                        }
                        thisObj.isProcessingNF = true;

                        
                        const callback_success = thisObj.checkIfUserHasPigFarms;
                        thisObj.requestUserAccount(callback_success);
                        
                        
                        break;
                    }
                }
                
                return;
            }
            
            
            // 2026-04-05
            // It is also possible  that the user already in /login?state=NF
            // but just delete the ?state=NF and refresh the page again
            // This needs to be handled as well.
            
            const callback_failure = function(){
                console.log('Token verification failed - clearing tokens');
                
                // Delete token from ALL storage locations
                thisObj.clearAllTokens();
                
                // Preserve language preference (don't delete this)
                const savedLang = localStorage.getItem('user_language');
                let loginUrl = '/login';
                if (savedLang && savedLang !== 'default' && savedLang !== 'null') {
                    loginUrl += '?lang=' + savedLang;
                }
                
                window.location.href = loginUrl;
                
                return;
            };
            
            
            const callback_success = function(data_user_account){
                if (data_user_account.account){
                    // Check if user has farms
                    const user_has_farms = thisObj.checkIfUserHasPigFarms(data_user_account);
                    if (user_has_farms == false){return;}
                    
                    // Redirect to Dashboard if user has account
                    const savedLang = localStorage.getItem('user_language');
                    
                    window.location.href = '/app';
                    
                    return;
                }
                
                thisObj.handlePostLoginFlow(data_user_account); 
                return;
            };
            
            
            // Verify access_token
            thisObj.requestVerifyToken(callback_success, callback_failure);
            
            return;
        }
        
        
        // No bearer token;
        let options;
        
        if (url_path == '/signup'){
            options = {
                is_login: false
            };
        }
        else{
            options = {
                is_login: true
            };
        }
        

        const goto_page_id   = PAGE_ID.SIGNUP_OR_LOGIN;
        const page_container = this.getPageContainer(goto_page_id);
            
        this.showThisPage(page_container);
        this.pageUserSignUpOrLogin.show(options);
        
    }
    
    
    // NEW: Get token source for debugging
    this.getTokenSource = function() {
        if (localStorage.getItem('access_token')) return 'localStorage';
        if (sessionStorage.getItem('access_token')) return 'sessionStorage';
        if (this.getCookieToken()) return 'cookie';
        return 'none';
    }
    
    
    // NEW: Get cookie token
    this.getCookieToken = function() {
        const value = `; ${document.cookie}`;
        const parts = value.split('; access_token=');
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
    
    
    this.checkIfUserHasPigFarms = function(data_user_account){
        thisObj.isProcessingNF = false;
        
        // Check if user has really no assigned Farm
        const user = data_user_account.user;
        
        if (user.pig_farms && user.pig_farms.length > 0){
            // User has assigned farms even the URL path tells that user has no farm
            // redirect to "/" with language
            window.location.href = '/app'
            return true;
        }
        
        
        
        // IMPORTANT: Remove state=NF from URL to prevent loop
        // Replace the URL without the state parameter
        const newUrl = window.location.pathname;  // Just '/login' or '/signup'
        window.history.replaceState({}, '', newUrl);
        
        
        
        // Now show the Add Farm page
        const goto_page_id   = PAGE_ID.ADD_FARM;
        const page_container = thisObj.getPageContainer(goto_page_id);
            
        thisObj.showThisPage(page_container);
        thisObj.pageAddFarm.show(data_user_account);
        
        return false;
    }
    

    this.getTranslations = function(){
        return window.SUPERPIG_PUBLIC_PAGES;
    }


    this.getPageContainer = function(page_id){
        switch(page_id){
            case PAGE_ID.NOT_LOGGED_IN:{
                return null;
            }
            
            case PAGE_ID.SIGNUP_OR_LOGIN: {
                return elemPageContSignupOrLogin;
            } 
                  
            case PAGE_ID.USER_EMAIL_VERIFY: {
                return elemPageContVerifyEmail;
            }
                  
            case PAGE_ID.USER_WAIT_ACCOUNT_ACCESS:{
                break;
            }
            
            case PAGE_ID.CREATE_OR_JOIN_ACCOUNT: {
                return elemPageContCreateOrJoinAcc;
            }
            
            case PAGE_ID.ADD_FARM: {
                return elemPageContAddFarm;
            }    
            
            case PAGE_ID.REQ_JOIN_ACC_SENT:{
                return elemPageContReqJoinAccSent;
            }
            

            
            
        }
    }
    
    
    // Save access token to multiple places;
    // 2026-05-15: This is because in PWA app, sometimes the localStorage
    // is cleared.    
    this.saveAuthToken = function(token) {
        if (!token) {
            console.error('saveAuthToken called with no token');
            return;
        }
        
        // Primary: localStorage (PWA)
        localStorage.setItem('access_token', token);
        
        // Backup: Cookie with longer expiration for PWA
        const isSecure = window.location.protocol === 'https:';
        const secureFlag = isSecure ? '; Secure' : '';
        
        // Fix domain handling - don't hardcode domain
        let domainFlag = '';
        if (window.location.hostname !== 'localhost') {
            const domain = window.location.hostname.split(':')[0];
            domainFlag = `; domain=${domain}`;
        }
        
        // 60 days for PWA (increased from 30)
        const maxAge = 60 * 24 * 60 * 60; // 60 days in seconds
        
        document.cookie = `access_token=${token}; path=/; max-age=${maxAge}; SameSite=Strict${secureFlag}${domainFlag}`;
        
        // Also try sessionStorage as fallback
        sessionStorage.setItem('access_token', token);
        
        // Store in window object for in-memory access
        window.__auth_token = token;
        
        // Debug log
        console.log('Token saved. PWA Mode:', thisObj.isPWA());
        console.log('  localStorage:', !!localStorage.getItem('access_token'));
        console.log('  sessionStorage:', !!sessionStorage.getItem('access_token'));
        console.log('  cookie:', document.cookie.includes('access_token'));
        console.log('  window.__auth_token:', !!window.__auth_token);
    }


    // NEW: Check if running as PWA
    this.isPWA = function() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true ||
               document.referrer.includes('android-app://');
    }


    // Will read access_token from multiple places
    this.getAuthToken = function() {
        // Check in-memory first (fastest)
        if (window.__auth_token) {
            return window.__auth_token;
        }
        
        // Check localStorage (primary for PWA)
        let token = localStorage.getItem('access_token');
        if (token) {
            // Sync to window object for faster access next time
            window.__auth_token = token;
            return token;
        }
        
        // Check cookie (backup for PWA)
        token = this.getCookieToken();
        if (token) {
            // Restore to localStorage
            localStorage.setItem('access_token', token);
            window.__auth_token = token;
            console.log('Token restored from cookie to localStorage');
            return token;
        }
        
        // Check sessionStorage (last resort)
        token = sessionStorage.getItem('access_token');
        if (token) {
            // Restore to localStorage and cookie
            localStorage.setItem('access_token', token);
            this.setCookieToken(token);
            window.__auth_token = token;
            console.log('Token restored from sessionStorage');
            return token;
        }
        
        return null;
    }


    
    this.showThisPage = function(page_container){
        
        const hidden_containers = document.getElementsByClassName("hidden-container");
        
        for (const cur_entry of hidden_containers){
            
            if (cur_entry == page_container){
                cur_entry.style.display = 'flex';
                thisObj.currentPage = cur_entry;
            }
            else{
                cur_entry.style.display = 'none';
            }
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
                const page_container = thisObj.getPageContainer(goto_page_id);
                thisObj.showThisPage(page_container);
                thisObj.pageCreateOrJoinAccount.show(data_user_account);
                
            } else {
                
                let account_has_farms = 0;
                if (data_user_account.account.pig_farms){
                    if (data_user_account.account.pig_farms.length > 0){
                        account_has_farms = 1;
                    }
                }
                
                if (account_has_farms > 0){
                    window.location.href = '/app';
                } else {
                    const goto_page_id = PAGE_ID.ADD_FARM;
                    const page_container = thisObj.getPageContainer(goto_page_id);
                    thisObj.showThisPage(page_container);
                    thisObj.pageAddFarm.show(data_user_account);
                }
            }
            return;
        } else {
            const goto_page_id = PAGE_ID.REQ_JOIN_ACC_SENT;
            const page_container = thisObj.getPageContainer(goto_page_id);
            thisObj.showThisPage(page_container);
            thisObj.pageReqJoinAccountSent.show(data_user_account);
        }
    }
    
    
    this.showError = function(jqXHR, textStatus, errorThrown){
        
    }
    
    
    this.requestVerifyToken = function(callback_success, callback_failure, 
            elem_show_error){
        
        const base_url = window.location.origin;
        let url = `${base_url}/user/verify_token`;
        
        
        const bearer_token = thisObj.getAuthToken(); // Use enhanced getter
        
        if (!bearer_token) {
            console.log('No token to verify');
            if (callback_failure) callback_failure();
            return;
        }
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            beforeSend: function(){
                if (elem_show_error){
                    elem_show_error.style.display = 'none';
                }
            },
  
            success: function(response){
                if (response.result.num == 0){
                    
                    if (callback_success){
                        const data_user_account = response.user_account;
                        callback_success(data_user_account);
                    }
                }
                else {
                    if (callback_failure){
                        callback_failure();
                    }
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                console.log('Token verification error:', textStatus);
                if (callback_failure){
                    callback_failure();
                }

            }
        });
    }
    
    
    this.requestUserAccount = function(callback_success, elem_show_error){
        
        const base_url = window.location.origin;
        let url = `${base_url}/user_account`;
        
        
        const bearer_token = thisObj.getAuthToken(); // Use enhanced getter
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            beforeSend: function(){
                if (elem_show_error){
                    elem_show_error.style.display = 'none';
                }
            },
  
            success: function(response){
                if (response.result.num == 0){
                    
                    if (callback_success){
                        callback_success(response.user_account);
                    }
                }
                else {
                   
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                
            }
        });
    }
    
    
    
    
    this.requestDataActiveCountryList = function(callback_success,
            elem_show_error){
        
        const base_url = window.location.origin;
        let url = `${base_url}/country/list`;
        
        
        const bearer_token = thisObj.getAuthToken(); // Use enhanced getter
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            beforeSend: function(){
                if (elem_show_error){
                    elem_show_error.style.display = 'none';
                }
            },
  
            success: function(response){
                if (response.result.num == 0){
                    thisObj.dataAddressCountryList = response.data;
                    
                    if (callback_success){
                        callback_success(response.data);
                    }
                }
                else {
                    navigation.serverError.receivedErrorMessage(
                        response, elem_show_error);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                
            }
        });
    }
}
