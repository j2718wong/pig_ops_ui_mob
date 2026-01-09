// January 9, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../common/page_view_basic.js';

import {APPLICATION,
        PIG_OPERATION_TYPE}     from '../../constants.js';



PageAccountDisabled.prototype = new PageViewBasic();
export function PageAccountDisabled(input_settings){
    PageViewBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    /*
    Typical settings = {
        navigation:             this
    };
    */
    const settings              = input_settings;
    
    
    // This is needed as this will be first element to be rendered
    let elemDivContainer        = document.getElementById('container-account-disabled');

    
    let elemIdAccountCode       = null;
    let elemIdAccountName       = null;
    let elemIdSupportEmail      = null;
 
    
    let elemAccountCode         = null;
    let elemAccountName         = null;
    let elemSupportEmail        = null;
 
    
    

    //let textTranslation         = new TextTranslation();
    let curUserLanguageKey      = 'en';

    
    
    this.init = function(){
        //textTranslation.setTranslations(TRANSLATION_PAGE_ACC_PIG_OPS);

        
        this.render();
        this.afterHtmlRender();
        

    }
    
    
    this.render = function(){
        elemIdAccountCode       = `account-disabled-account-code`;
        elemIdAccountName       = `account-disabled-account-name`;
        elemIdSupportEmail      = `account-disabled-support-email`;
        

        const html = `
        
    <div class="container">
        <!-- Card 1: Account Disabled -->
        <div class="notification-card">
            <div class="card-header">
                <i class="fas fa-user-slash"></i>
                <h2>Account Disabled</h2>
            </div>
            <div class="card-content">
                <p class="message">Your account has been disabled. Please contact our customer service if you want to appeal to enable again.</p>
                
                <div class="account-info">
                    <div class="info-row">
                        <span class="label">Account Code:</span>
                        <span class="value" id="${elemIdAccountCode}">ABC123</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Account Name:</span>
                        <span class="value" id="${elemIdAccountName}">Leolex Farms</span>
                    </div>
                </div>
                
                <div class="contact-info">
                    <div class="contact-title">
                        <i class="fas fa-headset"></i>
                        Customer Service
                    </div>
                    <p>Email: <a href="mailto:support@jsysdev.com" class="email-link" id="${elemIdSupportEmail}">support@jsysdev.com</a></p>
                </div>
            </div>
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
        elemAccountCode         = document.getElementById(elemIdAccountCode);
        elemAccountName         = document.getElementById(elemIdAccountName);
        elemSupportEmail        = document.getElementById(elemIdSupportEmail);
    }
    
    
    this._processAfterHtmlRender = function(){
        
        this.handleWindowResize();
    }
    
    
    this._bindEventListeners = function(){
        
    
    
    }
    
    
    // Handle window resize for view switching
    this.handleWindowResize = function() {
        const isMobile = window.innerWidth <= APPLICATION.MAX_WIDTH_WINDOW_IS_MOBILE;
                
    
    }
    
   
    
    this.onUserChangeLanguage = function(){
        
     
    }
   
    
}