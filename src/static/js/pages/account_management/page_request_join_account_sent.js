// page_request_join_account_sent.js

// March 3, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {APPLICATION,
        SOCIAL_MEDIA,
        PAGE_ID}                from '../../constants.js';


import {formatDate,
        FORMAT_COMPACT}         from '../../utils.js';



export function PageRequestJoinAccountSent(input_settings){
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContSupplierAddEdit,
        uniqueKey:              'supplier-add-edit'
    };
    */
    const settings              = input_settings;

    
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
        
    
    let elemIdAccountName       = null;
    let elemIdAccountCode       = null;
    let elemIdRequestSent       = null;
    
    
    let elemAccountName         = null;
    let elemAccountCode         = null;
    let elemRequestSent         = null;
    
    
    
    let curDataUserAccount             = null;
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdAccountName       = `${settings.uniqueKey}-account-name`;
        elemIdAccountCode       = `${settings.uniqueKey}-account-code`;
        elemIdRequestSent       = `${settings.uniqueKey}-request-sent`;
        
        const html =`

        
<div class="signup-card">
    <!-- 1.) PRODUCT & LOGO: centered -->
    <div class="product-row">
        <div class="company-logo">J</div>
        <div class="product-name">SuperPig</div>
    </div>

    <h2 class="intro-text">Join Account Request</h2>
        
    <!-- status chip with alert-gold / warning color -->
    <div class="status-chip">
        Your request to join a Pig Farm Account has been sent
    </div>

    <div class="option-card">
        <p>✅ <strong>Request sent</strong> — farm account admins will review your request.</p>
        
        <br>
        <p>⏳ Please wait for your request to be approved. You’ll receive a confirmation once access is granted.</p>
    </div>

    
    <div class="option-title" style="margin-bottom:0;">
        🧑‍🌾 Pig Farm Account
    </div>
    
    <div class="detail-grid" style="padding-top:0;">
        <!-- Account line: plain text -->
        <div class="detail-row">
            <span class="detail-label">Account</span>
            <span class="detail-value" id="${elemIdAccountName}">Leolex Farms</span>
        </div>
        <!-- Account Code line: plain monospace, no decoration -->
        <div class="detail-row">
            <span class="detail-label">Account Code</span>
            <span class="detail-value" id="${elemIdAccountCode}">45678SXDFG</span>
        </div>
        <!-- Request sent line: plain date, only icon is decorative -->
        <div class="detail-row">
            <span class="detail-label">Request Sent</span>
            <span class="detail-value" id="${elemIdRequestSent}">02 Mar 2026</span>
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
        
        elemAccountName         = elemDivContainer.querySelector('#'+elemIdAccountName);
        elemAccountCode         = elemDivContainer.querySelector('#'+elemIdAccountCode);
        elemRequestSent         = elemDivContainer.querySelector('#'+elemIdRequestSent);
        
    }
    
    
    this._processAfterHtmlRender = function(){

    }
    
    
    this._bindEventListeners = function(){
        
       
    }
    
    
    
    
   
    this._resetForm = function(){
        
        
    }
    
    
    this.show = function(data_user_account, options){
        this._resetForm();
        
        
        let user_req_join_acc = null;
        
        if (data_user_account.user && data_user_account.user.user_request){
            user_req_join_acc = data_user_account.user.user_request;
        }

        if (user_req_join_acc){
            elemAccountName.textContent = user_req_join_acc.account_name;
            elemAccountCode.textContent = user_req_join_acc.account_hid;
            
            
            const dt_req_sent = new Date(user_req_join_acc.date_req_sent);
            const s_dt_req_sent = formatDate(dt_req_sent, FORMAT_COMPACT);
            
            elemRequestSent.textContent = s_dt_req_sent;
        }
        
    }
    
    
    this.populateForm = function(){

    }
    
    

}   
