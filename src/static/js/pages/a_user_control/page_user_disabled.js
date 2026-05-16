// page_user_disabled.js

// January 9, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../common/page_view_basic.js';

import {APPLICATION,
        PIG_OPERATION_TYPE}     from '../../constants.js';



PageUserDisabled.prototype = new PageViewBasic();
export function PageUserDisabled(input_settings){
    PageViewBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContUserDisabled
    };
    */
    const settings              = input_settings;
    
    
    // This is needed as this will be first element to be rendered
    let elemDivContainer        = document.getElementById(settings.elemIdDivContainer);

    
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

        const html = `
        
    <!-- Card 2: User Access Disabled -->
        <div class="notification-card">
            <div class="user-control-card-header">
                <i class="fas fa-lock"></i>
                <h2>User Access Disabled</h2>
            </div>
            <div class="card-content">
                <p class="message">Your account access has been disabled by your Account Admin. Please contact your Account Admin to restore your access.</p>
                
                <div class="contact-info">
                    <div class="contact-title">
                        <i class="fas fa-user-tie"></i>
                        Required Action
                    </div>
                    <p>Contact your Account Administrator directly to request access restoration.</p>
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