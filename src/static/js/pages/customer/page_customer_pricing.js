// page_customer_pricing.js

// December 23, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../common/page_view_basic.js';

import {APPLICATION,
        PAGE_ID}                from '../../constants.js';


/** Per breeding head charging method; sow, boar, gilt*/
const CHARGING_METHOD_PER_HEAD  = 0;
const CHARGING_METHOD_PER_FARM  = 1;


export function PageCustomerPricing(input_settings){
    PageViewBasic.call(this);
    
    const TAG                   = 'PageCustomerPricing';
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    this.setNavigation(navigation);
    
    
    const FLAG_BIT_TAXES_INCLUDED   = 1;
    
    
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
    
    let elemIdChargingDesc      = null;
    let elemIdThChargingLabel   = null;
    
    let elemIdCountryName       = null;
    let elemIdCurrencyCode      = null;
    let elemIdPricePerHead      = null;
    let elemIdTaxNote           = null;
    
    
    
    let elemHeaderTitle         = null;
    let elemBtnClose            = null;
    
    let elemChargingDesc        = null;
    let elemThChargingLabel     = null;
    
    let elemCountryName         = null;
    let elemCurrencyCode        = null;
    let elemPricePerHead        = null;
    let elemTaxNote             = null;
    
    
    
    let showOptions             = null;
    
    
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
        
        elemIdChargingDesc      = `${settings.uniqueKey}-charging-desc`;
        elemIdThChargingLabel   = `${settings.uniqueKey}-charging-label`;
        
        elemIdCountryName       = `${settings.uniqueKey}-country-name`;
        elemIdCurrencyCode      = `${settings.uniqueKey}-cur-code`;
        elemIdPricePerHead      = `${settings.uniqueKey}-price-per-head`;
        elemIdTaxNote           = `${settings.uniqueKey}-tax-note`;
        
        
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
                <li id="${elemIdChargingDesc}"><strong>We send your first bill.</strong>  We count your active <span class="highlight">sows, gilts, and boars</span> across all your farms. <strong>Fattening pigs are never charged</strong>.</li>
                <li><strong>We charged every 30 days after.</strong>
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
                            <th id="${elemIdThChargingLabel}">Per Head</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td id="${elemIdCountryName}">Philippines</td>
                            <td id="${elemIdCurrencyCode}">PHP</td>
                            <td id="${elemIdPricePerHead}" class="value-number">150.0</td>
                        </tr>
                    </tbody>
                </table>
                
            </div>
            
            <div id="${elemIdTaxNote}"></div>
            

            <!-- billing & notifications – as plain list, no pills, no background, no radius -->
            <ul class="reminder-list">
                <li><strong>Bills are sent by email</strong> — to account admins only. We also send instructions how to settle your bill.</li>
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

        elemChargingDesc        = elemDivContainer.querySelector('#'+elemIdChargingDesc);
        elemThChargingLabel     = elemDivContainer.querySelector('#'+elemIdThChargingLabel);

        elemCountryName         = elemDivContainer.querySelector('#'+elemIdCountryName);           
        elemCurrencyCode        = elemDivContainer.querySelector('#'+elemIdCurrencyCode);
        elemPricePerHead        = elemDivContainer.querySelector('#'+elemIdPricePerHead);
        elemTaxNote             = elemDivContainer.querySelector('#'+elemIdTaxNote);
    }
    
    
    this._processAfterHtmlRender = function(){

    }
    
    
    this._bindEventListeners = function(){
        elemBtnClose.addEventListener('click', function(event) {
            history.back();
        });
    }
    
   
    this._resetForm = function(){
        // Clear previous Form values and validation classes

        
    }
    
    
    this.renderPage = function(page_data){
        thisObj.show(page_data.options);
    }
    
    
    this.show = function(options){
        
        thisObj._resetForm();
        
        
        showOptions = options;

        
        const callback_success = function(data){
            thisObj.populateForm(data);
        };
        
        
        navigation.managerBusiness.requestDataPricing(callback_success);        
        
    }
    
    
    this.populateForm = function(data){
        // Get Account
        const account = navigation.account.accountInfo.account;

        
        // This is a dictionary
        const list_of_values = navigation.managerBusiness.listOfValues
        
        let charging_method = list_of_values.GLOBAL_CHARGING_METHOD;
        
        if (!charging_method) {charging_method = CHARGING_METHOD_PER_HEAD;}
        
        
        // Update charging method labels; The default is per head charging
        if (charging_method != CHARGING_METHOD_PER_HEAD){
            elemChargingDesc.innerHTML = `<strong>We send your first bill.</strong>  We charge a flat rate per farm on your account.`;
            elemThChargingLabel.textContent = 'Per Farm';
        }
        

        // Get the country_pricing
        let country_pricing = null;
        
        const account_country_hid = account.country.hid;
       
        
        for (const cur_entry of data){
            if (cur_entry.pricing.country_hid == account_country_hid){
                country_pricing = cur_entry;
                break;
            }
        }
        
        if (country_pricing == null){
            country_pricing = data[0]; // This is the default pricing
        }
        
        if(country_pricing){
            const pricing = country_pricing.pricing;
            
            elemCountryName.textContent     = pricing.country_name;  
            elemCurrencyCode.textContent    = pricing.currency_code;  
            elemPricePerHead.textContent    = pricing.price_per_head;  
            
            if (charging_method != CHARGING_METHOD_PER_HEAD){
                elemPricePerHead.textContent    = pricing.price_per_farm; 
            }
            
            
            let are_taxes_included = 0;
            
            if ((pricing.flag & FLAG_BIT_TAXES_INCLUDED) > 0){
                are_taxes_included = 1;
            }
            
            let s = '';
            if (are_taxes_included >0){
                s = 'All taxes included.'
            }
            else{
                s = 'Taxes not yet included.'
            }
            
            elemTaxNote.textContent    = s;
        }
        
    }
    
        
    
}   
