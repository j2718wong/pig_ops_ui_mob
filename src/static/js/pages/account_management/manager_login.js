// February 27, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        PAGE_ID}                    from '../../constants.js';



import {PagePigUserSignUpOrLogin}   from './page_user_signup_or_login.js';


// This is used for signup or login
export function ManagerLogin(){
    
    const thisObj                       = this;
    
    
    const elemIdContSignupOrLogin       = 'container-signup';
    
    
    let elemPageContSignupOrLogin       = null;
    
    
    
    this.pageSignUpOrLogin      = new  PagePigUserSignUpOrLogin({
        parentObj:              this
        elemIdDivContainer:     elemIdContSowBoarList,
        uniqueKey:              'login-or-signup'
    });
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();

        
    }
    
    
    
    this.render = function(){}
    
    
    this.afterHtmlRender = function(){
        this.pageSignUpOrLogin.afterHtmlRender();
        
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        
        elemPageContSignupOrLogin       = document.getElementById(elemIdContSignupOrLogin);
    }
    
    
    this._processAfterHtmlRender = function(){}
    
    
    this._bindEventListeners = function(){}
    
    
    
    this.onPageLoad = function(){
        const url_path = window.location.pathname;
        
        console.log('url_path = ' + url_path);
        
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
        
        this.pageSignUpOrLogin.beforeShow(options);
      
        
    }
    
    
    this.getPageContainer = function(page_id){
        switch(page_id){
            case PAGE_ID.NOT_LOGGED_IN:{
                return null;
            }
            
            
            case PAGE_ID.SIGNUP_OR_LOGIN: {
                break;
            } 
                  
            case PAGE_ID.USER_EMAIL_VERIFY: {
                break;
            }
                  
            case PAGE_ID.USER_WAIT_ACCOUNT_ACCESS:{
                break;
            }
            
            case PAGE_ID.CREATE_OR_JOIN_ACCOUNT: {
                break;
            }
            
            case PAGE_ID.ACCOUNT_CREATE_EDIT: {
                break;
            }    
            
            
        }
    }
    
    
    this.showThisPage = function(page_container){
        
        const hidden_containers = document.getElementsByClassName("hidden-container");
        
        for (const cur_entry of hidden_containers){
            
            if (cur_entry == page_container){
                cur_entry.style.display = 'block';
            }
            else{
                cur_entry.style.display = 'none';
            }
        }
    }
    
    
    
}

