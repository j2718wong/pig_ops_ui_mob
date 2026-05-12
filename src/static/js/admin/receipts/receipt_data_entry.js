// May 12, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        FORMAT_COMPACT_NO_SPACE}    from '../../utils.js';




export function PageReceiptDataEntry(){
    
    const TAG                   = 'PageReceiptDataEntry';
    
    const thisObj               = this;


    let elemModalAuth           = null;
    
    let elemModalEmail          = null;
    let elemBtnSendCode         = null;
    
    let elemUnAuthorizedShow    = null;
    let elemVerificationShow    = null;
    let elemVerificationCode    = null;
    let elemBtnVerifyCode       = null;
    
    let elemBtnModalClose       = null;
    
    

    
    this.init = function(){
        
       
        
        this.render();
        this.afterHtmlRender();
        

    }
    
    
    this.render = function(){
        
      
    }
    
    
    this.afterHtmlRender = function(){
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemModalAuth           = elemDivContainer.querySelector('#authModal');
        
        elemModalEmail          = elemDivContainer.querySelector('#modalEmail');
        elemBtnSendCode         = elemDivContainer.querySelector('#sendCodeBtn');
        
        elemUnAuthorizedShow    = elemDivContainer.querySelector('#unauthorizedDiv');
        elemVerificationShow    = elemDivContainer.querySelector('#verificationSection');
        elemVerificationCode    = elemDivContainer.querySelector('#verificationCode');
        elemBtnVerifyCode       = elemDivContainer.querySelector('#verifyCodeBtn');
        
        elemBtnModalClose       = elemDivContainer.querySelector('#closeModalBtn');
        
        
        

    }
    
    
    this._processAfterHtmlRender = function(){
        
    }
    
    
    this._bindEventListeners = function(){
        elemBtnSendCode.addEventListener('click', function() {
            thisObj.onClickSendCodeToEmail();
        });
    }
    
    
    this._resetForm = function(){
       
    }
    
    
    this.renderPage = function(page_data){
        
    }
    
    
    this.show = function(options){
        
        // Step 1: Check local storage for user

        // Check if there is a access_token stored
        const bearer_token  = localStorage.getItem('access_token');
        
        if (!bearer_token){
            elemModalAuth.style.display = 'flex';
            return;
        }
        
        // Request to check access_token
        
        
       
    }
    
    
    this.onClickSendCodeToEmail = function(){
        let input_elem      = null;
        let validation      = 0;
        
        
        let input_email     = elemModalEmail.value;
        
        if (input_email.lenght == 0){
            // Show invalid email
            return;
        }
        
        
        
    }
    
    
    
    
    
    
}   
