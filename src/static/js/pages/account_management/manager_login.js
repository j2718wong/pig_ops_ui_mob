// February 27, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        SOCIAL_MEDIA,
        PAGE_ID}                    from '../../constants.js';



import {PageUserSignUpOrLogin}      from './page_user_signup_or_login.js';
import {PageCreateOrJoinAccount}    from './page_create_or_join_account.js';
import {PageAddFarm}                from './page_add_farm.js';
import {PageRequestJoinAccountSent} from './page_request_join_account_sent.js';
import {PageTermsOfService}         from './page_terms_of_service.js';
import {PagePrivacyPolicy}          from './page_privacy_policy.js';


// This is used for signup or login
export function ManagerLogin(){
    
    const thisObj                       = this;
    
    
    const elemIdContSignupOrLogin       = 'container-signup';
    const elemIdContCreateOrJoinAcc     = 'container-create-or-join-acc';
    const elemIdContAddFarm             = 'container-add-farm';
    const elemIdContReqJoinAccSent      = 'container-req-join-acc-sent';
    const elemIdContTermsOfService      = 'container-terms-of-service';
    const elemIdContPrivacyPolicy       = 'container-privacy-policy';
    
    
    
    let elemPageContSignupOrLogin       = null;
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
        const url_path = window.location.pathname;
        
        // Automatic login if there is a valid token
        // Check if there is a access_token stored
        const bearer_token = localStorage.getItem('access_token');
        if (bearer_token){
            window.location.href = '/'
            return;
        }
        
        
        
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
        
        
        // Set CopyRight Year
        const currentYear = new Date().getFullYear();
        elemCopyRightYear.textContent = currentYear;
        
        
        const goto_page_id   = PAGE_ID.SIGNUP_OR_LOGIN;
        const page_container = this.getPageContainer(goto_page_id);
            
        this.showThisPage(page_container);
        this.pageUserSignUpOrLogin.beforeShow(options);
      
        
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
                break;
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

