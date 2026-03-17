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
import {PageTermsOfService}         from './page_terms_of_service.js';
import {PagePrivacyPolicy}          from './page_privacy_policy.js';


// This is used for signup or login
export function ManagerLogin(){
    
    const thisObj                       = this;
    
    
    const elemIdContSignupOrLogin       = 'container-signup';
    const elemIdContVerifyEmail         = 'container-verify-code';
    const elemIdContCreateOrJoinAcc     = 'container-create-or-join-acc';
    const elemIdContAddFarm             = 'container-add-farm';
    const elemIdContReqJoinAccSent      = 'container-req-join-acc-sent';
    const elemIdContTermsOfService      = 'container-terms-of-service';
    const elemIdContPrivacyPolicy       = 'container-privacy-policy';
    
    
    
    let elemPageContSignupOrLogin       = null;
    let elemPageContVerifyEmail         = null;
    let elemPageContCreateOrJoinAcc     = null;
    let elemPageContAddFarm             = null;
    let elemPageContReqJoinAccSent      = null;
    let elemPageContTermsOfService      = null;
    let elemPageContPrivacyPolicy       = null;
    
    let elemCopyRightYear               = null;
    
    
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
    
    
    this.pageTermsOfService         = new PageTermsOfService({
        parentObj:                  this,
        elemIdDivContainer:         elemIdContTermsOfService,
        uniqueKey:                  'terms-of-service'
    });
    
    
    this.pagePrivacyPolicy          = new PagePrivacyPolicy({
        parentObj:                  this,
        elemIdDivContainer:         elemIdContPrivacyPolicy,
        uniqueKey:                  'privacy-policy'
    });
    
    
    
    this.dataAddressCountryList     = null;
    
    
    this.currentPage                = null;
    
    
    this.init = function(){
        this.pageUserSignUpOrLogin.init();
        this.pageEmailVerifyCode.init();
        this.pageCreateOrJoinAccount.init();
        this.pageAddFarm.init();
        this.pageReqJoinAccountSent.init();
        this.pageTermsOfService.init();
        this.pagePrivacyPolicy.init();
        
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
        elemPageContTermsOfService      = document.getElementById(elemIdContTermsOfService);
        elemPageContPrivacyPolicy       = document.getElementById(elemIdContPrivacyPolicy);
        
        elemCopyRightYear               = document.getElementById('copyright-year');
        
        
    }
    
    
    this._processAfterHtmlRender = function(){}
    
    
    this._bindEventListeners = function(){}
    
    
    
    this.onPageLoad = function(){
        // Set CopyRight Year
        const currentYear = new Date().getFullYear();
        elemCopyRightYear.textContent = currentYear;
        
        const bearer_token = localStorage.getItem('access_token');
                        
        
        // Check if there is a access_token stored;
        if (bearer_token){
            console.log('\n\n\nmanagerLogin; has bearer token');
        
            
            const callback_failure = function(){
                // Clear all items from localStorage
                localStorage.clear();
            
                console.log('\n\n\nonmanagerLogin; failure; to remove token');


                const goto_page_id   = PAGE_ID.SIGNUP_OR_LOGIN;
                const page_container = thisObj.getPageContainer(goto_page_id);
                    
                thisObj.showThisPage(page_container);
                thisObj.pageUserSignUpOrLogin.show({is_login: true});
                
                return;
            };
            
            
            const callback_success = function(data_user_account){
                if (data_user_account.account){
                    // Redirect to Dashboard if user has account
                    window.location.href = '/'
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
        const url_path = window.location.pathname;
        
        
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
            
            case PAGE_ID.TERMS_OF_SERVICE:{
                return elemPageContTermsOfService;
            }
            
            
            case PAGE_ID.PRIVACY_POLICY:{
                return elemPageContPrivacyPolicy;
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

