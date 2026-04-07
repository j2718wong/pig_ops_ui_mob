// February 27, 2026
// Jack Wong
// j2718wong@gmail.com

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
    
    
    this._processAfterHtmlRender = function(){}
    
    
    this._bindEventListeners = function(){}
    
    
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

    
    
    
    this.onPageLoad = function(){
        const url_path = window.location.pathname;
        
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
            // Clear cookies and storage
            localStorage.clear();
            sessionStorage.clear();
            
            // Redirect to home or login
            window.location.href = '/login';
            return;
        }
        
        
        // Set CopyRight Year
        const currentYear = new Date().getFullYear();
        elemCopyRightYear.textContent = currentYear;
        
        const bearer_token = localStorage.getItem('access_token');
                        
        
        // Check if there is a access_token stored;
        if (bearer_token){
            console.log('\n\n\nmanagerLogin; has bearer token');
            
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
                // Clear all items from localStorage
                localStorage.clear();
            
                console.log('\n\n\nonmanagerLogin; failure; to remove token');


                // Preserve language if it exists
                const savedLang = localStorage.getItem('user_language');
                let loginUrl = '/login';
                if (savedLang && savedLang !== 'default') {
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
                    
                    window.location.href = '/';
                    
                    /*
                    // ALWAYS include language if it exists
                    if (savedLang && savedLang !== 'default'){
                        console.log('Redirecting with language:', savedLang);
                        window.location.href = '/?lang=' + savedLang;
                    } 
                    else if (savedLang === 'default') {
                        // If language is explicitly set to 'default', don't include lang param
                        window.location.href = '/';
                    }
                    else {
                        // No language saved, check URL for language
                        const urlParams = new URLSearchParams(window.location.search);
                        const urlLang = urlParams.get('lang');
                        if (urlLang && urlLang !== 'default') {
                            console.log('Found language in URL, preserving:', urlLang);
                            window.location.href = '/?lang=' + urlLang;
                        } else {
                            window.location.href = '/';
                        }
                    }
                    */
                    
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
    
    
    this.checkIfUserHasPigFarms = function(data_user_account){
        thisObj.isProcessingNF = false;
        
        // Check if user has really no assigned Farm
        const user = data_user_account.user;
        
        if (user.pig_farms && user.pig_farms.length > 0){
            // User has assigned farms even the URL path tells that user has no farm
            // redirect to "/"
            // redirect to "/" with language
            
            
            const savedLang = localStorage.getItem('user_language');
            
            
            // Build clean URL without duplicate parameters
            let redirectUrl = '/';
            /*
            if (savedLang && savedLang !== 'default') {
                // Use path-based language, not query parameter
                const langMap = {'en': 'en', 'fil': 'tag', 'ceb': 'bis', 'zh': 'zh'};
                const urlLang = langMap[savedLang] || 'en';
                redirectUrl = `/?lang=${urlLang}`;
            }
            */
            window.location.href = redirectUrl
            
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
                    
                    //loadHomePageWithToken();
                    //return;
                    
                    // Use the stored language for redirect
                    /*
                    const savedLang = localStorage.getItem('user_language');
                    if (savedLang && savedLang !== 'default') {
                        console.log('Redirecting to home with language:', savedLang);
                        window.location.href = '/?lang=' + savedLang;
                    } else {
                        // Check if language exists in URL before redirecting without it
                        const urlParams = new URLSearchParams(window.location.search);
                        const urlLang = urlParams.get('lang');
                        if (urlLang && urlLang !== 'default') {
                            console.log('Preserving language from URL:', urlLang);
                            window.location.href = '/?lang=' + urlLang;
                        } else {
                            window.location.href = '/';
                        }
                    }
                    */
                    
                    window.location.href = '/';
                    
                    
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
        
        
        const bearer_token = localStorage.getItem('access_token');
        
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
                if (callback_failure){
                    callback_failure();
                }

            }
        });
    }
    
    
    this.requestUserAccount = function(callback_success, elem_show_error){
        
        const base_url = window.location.origin;
        let url = `${base_url}/user_account`;
        
        
        const bearer_token = localStorage.getItem('access_token');
        
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
        
        
        const bearer_token = localStorage.getItem('access_token');
        
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
                navigation.serverError.serverErrorThrown(jqXHR, 
                    textStatus, errorThrown);
            }
        });
    }
    
    
    
}

