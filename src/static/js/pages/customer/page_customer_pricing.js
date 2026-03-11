// December 23, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../common/page_view_basic.js';

import {APPLICATION,
        PAGE_ID,
        SOW_STATUS,
        PIG_PROD_TYPE,
        PIG_OPERATION_TYPE,
        SUPPLIER_TYPE}          from '../../constants.js';




export function PageCustomerPricing(input_settings){
    PageViewBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContSupplierAddEdit,
        uniqueKey:              'supplier-add-edit'
    };
    */
    const settings              = input_settings;

    
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
        

        
    
    let elemIdHeaderTitle       = null;
    let elemIdBtnClose          = null;
    
    
    
    let elemHeaderTitle         = null;
    let elemBtnClose            = null;
    
    
    
    let showOptions             = null;
    
    
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
        
    


        
        
        const html =`

        
<div class="form-container">

    <div class="modal-header">
        <h5 class="modal-title">
            <span id="${elemIdHeaderTitle}">After Free Trial</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    
    <div class="modal-body">
        <div class="customer-container">
            
            <!-- plain list: two main policy points (cards removed) -->
            <ul class="plain-list">
                <li><strong>All your users keep access</strong> — If SuperPig helps your operation, every user (owner, manager, staff) continues seamlessly.</li>
                <li><strong>Every 30 days we count</strong> your active <span class="highlight">sows, gilts, and boars</span> across all your farms. <strong>Fattening pigs are never charged</strong>.</li>
            </ul>

            <!-- PRICING TABLE (only card-like element) -->
            <div class="pricing-wrap">
                <div class="pricing-header">
                    <h4>🐖 Current Pricing</h4>
                </div>

                <table class="data-pricing">
                    <thead>
                        <tr>
                            <th>Country</th>
                            <th>Currency</th>
                            <th>Per head</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td id="countryName">Philippines</td>
                            <td id="currencyCode">PHP</td>
                            <td id="ratePerHead" class="value-number">200.0</td>
                        </tr>
                    </tbody>
                </table>
                
            </div>

            <!-- billing & notifications – as plain list, no pills, no background, no radius -->
            <ul class="reminder-list">
                <li><strong>Bills are sent by email</strong> — to account admins only. You can also add farm managers to receive them.</li>
                <li><strong>In-app notice</strong> — visible for admins and managers (not shown to operations users).</li>
                <li><strong>15 days to pay</strong> — grace period after each invoice. We will send payment options and instructions how to pay.</li>
            </ul>

            <!-- if unpaid – flat with border, but still no background color -->
            <div class="unpaid-flat">
                <h4>⚠️ If bill is not paid after 15 days</h4>
                <ul>
                    <li>All users lose access to farm data — only the payment verification page remains available.</li>
                    <li>Full access is restored immediately once payment is verified. Your data is never deleted.</li>
                </ul>
                <div class="access-flat">
                    🔐 Your records stay safe — a single verified payment reopens everything.
                </div>
            </div>

            <!-- role visibility – simple line -->
            <div class="role-flat">
                📋 <strong>Billing visibility:</strong> Only admins and managers see payment reminders. Operators (workers) see only production.
            </div>

            <!-- demo hint (very light) -->
            <div class="footer-note">
                ⚡ Prices are based on your account’s country. 
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
        elemHeaderTitle         = elemDivContainer.querySelector('#'+elemIdHeaderTitle);
        elemBtnClose            = elemDivContainer.querySelector('#'+elemIdBtnClose);

    }
    
    
    this._processAfterHtmlRender = function(){

    }
    
    
    this._bindEventListeners = function(){
        elemBtnClose.addEventListener('click', function(event) {
            event.preventDefault();
            navigation.showThisPage(showOptions.go_back_page);
        });

    }
    
    
    
    
   
    this._resetForm = function(){
        // Clear previous Form values and validation classes

        
    }
    
    
    this.beforeShow = function(options){
        /*
        
        Typical options 
        {
            is_add:         true,
            supplier_type:  SUPPLIER_TYPE.SEMEN,
            go_back_page:   settings.pageDivContainer   // Go back to this page
            callback_on_success_add : function
        }
        
        */
        
        
        thisObj._resetForm();
        
        
        showOptions = options;
        
        
       
        thisObj.populateForm();
        
        
                
        
    }
    
    
    this.populateForm = function(){

        
    }
    
        
    
}   
