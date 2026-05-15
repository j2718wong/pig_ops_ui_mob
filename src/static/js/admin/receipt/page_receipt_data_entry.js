// May 12, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION}                from '../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        FORMAT_COMPACT_NO_SPACE}    from '../../utils.js';




export function PageReceiptDataEntry(){
    
    const TAG                   = 'PageReceiptDataEntry';
    
    const thisObj               = this;

    let elemDivContainer        = document.getElementById('container-receipt-entry');

    let elemModalAuth           = null;
    
    let elemModalEmail          = null;
    let elemBtnSendCode         = null;
    
    let elemUnAuthorizedShow    = null;
    let elemVerificationShow    = null;
    let elemVerificationCode    = null;
    let elemVerifyCodeBtn       = null;
    
    let elemServerErrorMsg      = null;
    let elemBtnModalClose       = null;
    
    
    let dataUnverifiedUser      = null;

    
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
        
        if (!elemDivContainer){
            console.log('elemDivContainer is null');
        }
        
        elemModalAuth           = elemDivContainer.querySelector('#authModal');
        
        elemModalEmail          = elemDivContainer.querySelector('#modalEmail');
        elemBtnSendCode         = elemDivContainer.querySelector('#sendCodeBtn');
        
        elemUnAuthorizedShow    = elemDivContainer.querySelector('#unauthorizedDiv');
        elemVerificationShow    = elemDivContainer.querySelector('#verificationSection');
        elemVerificationCode    = elemDivContainer.querySelector('#verificationCode');
        elemVerifyCodeBtn       = elemDivContainer.querySelector('#verifyCodeBtn');
        
        elemServerErrorMsg      = elemDivContainer.querySelector('#serverErrorMsg');
        elemBtnModalClose       = elemDivContainer.querySelector('#closeModalBtn');
        
        
        

    }
    
    
    this._processAfterHtmlRender = function(){
        
    }
    
    
    this._bindEventListeners = function(){
        elemBtnSendCode.addEventListener('click', function() {
            thisObj.onClickSendCodeToEmail();
        });
        
        
        elemModalEmail.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') onClickSendCodeToEmail();
        });
        
        
        elemVerifyCodeBtn.addEventListener('click', function() {
            thisObj.onClickVerifyCode();
        });
        
    }
    
    
    this._resetForm = function(){
       
    }
    
    
    this.renderPage = function(page_data){
        
    }
    
    
    this.onPageLoad = function(){
        this.show();
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
        
        const base_url      = window.location.origin;
        
        let url = `${base_url}/user_internal/login`;
        
        const post_data = {
            'email':        input_email,
        };

        
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            
            headers: {
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
                elemUnAuthorizedShow.style.display = 'none';
            },
  
            success: function(response){
                if (response.result.num == 0){
                    elemVerificationShow.style.display = 'block';
                    
                    dataUnverifiedUser = response.user_unverified;
                    
                }
                else{
                    elemUnAuthorizedShow.style.display = 'block';
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                
            }
        });

    }
    
    
    this.onClickVerifyCode = function() {
        
        const enteredCode = elemVerificationCode ? elemVerificationCode.value : '';
        
        // Validation
        if (enteredCode.length < 6) {
            elemServerErrorMsg.textContent = 'Please enter the complete 6-digit code';
            return;
        }

        // Show loading state
        if (elemVerifyCodeBtn) {
            elemVerifyCodeBtn.disabled = true;
            elemVerifyCodeBtn.textContent = 'Verifying...';
        }
        
        
        const user_hid = dataUnverifiedUser.uhid;
        
        const base_url      = window.location.origin;
        let url = `${base_url}/user/email/verify_code`;
        
        // Get viewport dimensions
        const viewport_width  = window.innerWidth;
        const viewport_height = window.innerHeight;
            
        
        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'auth_code':        enteredCode,
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
                    if (response.bearer_token){
                        if (elemVerificationCode) {
                            elemVerificationCode.classList.remove('error');
                        }

                        
                        // Store token
                        //localStorage.setItem('access_token', response.bearer_token);
                        
                        // handle post login
                        //parentObj.handlePostLoginFlow(response.user_account);
                        return;
                    }
                    else{
                        console.log('\n\nNo bearer_token after user is verified');
                        
                    }
                }
                else{
                    // The invalid response.result.code can be either one of these
                    //DECLARE RES_NUM_CANNOT_FIND_VERIFICATION        INT             DEFAULT 1;
                    //DECLARE RES_NUM_INVALID_CODE                    INT             DEFAULT 2;
                    //DECLARE RES_NUM_CODE_EXPIRED                    INT             DEFAULT 3;
                    
                    console.log('response.result.code = ' + response.result.code);
                    
                    switch(response.result.code){
                        case 'RES_NUM_CANNOT_FIND_VERIFICATION':
                        case 'RES_NUM_INVALID_CODE':{
                            thisObj._showMessage('✗ Invalid code. Please try again.', 'error');
                            if (elemVerificationCode) {
                                elemVerificationCode.classList.add('error');
                                elemVerificationCode.focus();
                            }
                            if (elemVerifyCodeBtn) {
                                elemVerifyCodeBtn.disabled = false;
                                elemVerifyCodeBtn.textContent = 'Verify Email';
                            }
                            break;
                        }
                        
                        case 'RES_NUM_CODE_EXPIRED':{
                            thisObj._showMessage('✗ Code Expired. Please request code again.', 'error');
                            if (elemVerificationCode) {
                                elemVerificationCode.classList.add('error');
                                elemVerificationCode.focus();
                            }
                            if (elemVerifyCodeBtn) {
                                elemVerifyCodeBtn.disabled = false;
                                elemVerifyCodeBtn.textContent = 'Verify Email';
                            }
                            
                            break;
                        }
                    }
                }
            },
  
            complete: function(){
                // TODO unsay buhaton
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                
            }
        });


    }
    
    
    
}   
