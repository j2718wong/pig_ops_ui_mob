// January 9, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../common/page_view_basic.js';

import {APPLICATION,
        PIG_OPERATION_TYPE}     from '../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}         from '../../utils.js';


PageAccountUnpaidBill.prototype = new PageViewBasic();
export function PageAccountUnpaidBill(input_settings){
    PageViewBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContAccountBillUnpaid
    };
    */
    const settings              = input_settings;
    
    const MAX_TRUNCATE_ACC_NAME = 18;
    
    // This is needed as this will be first element to be rendered
    let elemDivContainer        = document.getElementById(settings.elemIdDivContainer);

    
    let elemIdAccountCode       = null;
    let elemIdAccountName       = null;
    
    let elemIdBillNumber        = null;
    let elemIdBillDateIssue     = null;
    let elemIdBillDateDue       = null;
    let elemIdBillDateStart     = null;
    let elemIdBillDateEnd       = null;
    let elemIdBillAmount        = null;
    
    
    let elemAccountCode         = null;
    let elemAccountName         = null;
    
    let elemBillNumber          = null;
    let elemBillDateIssue       = null;
    let elemBillDateDue         = null;
    let elemBillDateStart       = null;
    let elemBillDateEnd         = null;
    let elemBillAmount          = null;
    
    

    //let textTranslation         = new TextTranslation();
    let curUserLanguageKey      = 'en';

    
    
    this.init = function(){
        //textTranslation.setTranslations(TRANSLATION_PAGE_ACC_PIG_OPS);

        
        this.render();
        this.afterHtmlRender();
        

    }
    
    
    this.render = function(){
        elemIdAccountCode       = `account-bill-unpaid-account-code`;
        elemIdAccountName       = `account-bill-unpaid-account-name`;
        elemIdBillNumber        = `account-bill-unpaid-bill-number`;
        elemIdBillDateIssue     = `account-bill-unpaid-bill-date-issue`;
        elemIdBillDateDue       = `account-bill-unpaid-bill-date-due`;
        elemIdBillDateStart     = `account-bill-unpaid-bill-date-start`;
        elemIdBillDateEnd       = `account-bill-unpaid-bill-date-end`;
        elemIdBillAmount        = `account-bill-unpaid-bill-amount`;
        

        const html = `
        
    <div class="container">
        <!-- Card 3: Bill Unpaid -->
        <div class="notification-card">
            <div class="user-control-card-header">
                <i class="fas fa-file-invoice-dollar"></i>
                <h2>Bill Unpaid</h2>
            </div>
            <div class="card-content">
                <p class="message">Your account has been temporarily locked because of your pending bill. Please contact your account admins to settle this bill.</p>
                
                <div class="account-info">
                    <div class="info-row">
                        <span class="label">Account Code</span>
                        <span class="value" id="${elemIdAccountCode}">ABC123</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Account Name</span>
                        <span class="value" id="${elemIdAccountName}">Leolex Farms</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Bill Number</span>
                        <span class="value" id="${elemIdBillNumber}">2789 7890</span>
                    </div>
                </div>
                
                <div class="bill-details">
                    <div class="bill-item">
                        <div class="bill-label">Date Issued</div>
                        <div class="bill-value" id="${elemIdBillDateIssue}">January 8, 2026</div>
                    </div>
                    <div class="bill-item">
                        <div class="bill-label">Date Due</div>
                        <div class="bill-value" id="${elemIdBillDateDue}">January 23, 2026</div>
                    </div>
                    <div class="bill-item">
                        <div class="bill-label">Billing Start</div>
                        <div class="bill-value" id="${elemIdBillDateStart}">December 6, 2025</div>
                    </div>
                    <div class="bill-item">
                        <div class="bill-label">Billing End</div>
                        <div class="bill-value" id="${elemIdBillDateEnd}">January 7, 2025</div>
                    </div>
                </div>
                
                <div class="amount" id="${elemIdBillAmount}">PHP 1,500.00</div>
                
                <div class="payment-methods">
                    <div class="payment-title">
                        <i class="fas fa-credit-card"></i>
                        Payment Instructions
                    </div>
                    
                    <div class="method">
                        <span class="method-number">1.)</span>
                        <span class="method-name">Bank Transfer</span>
                        <span class="method-detail">BDO: 2342323223</span>
                    </div>
                    
                    <div class="method">
                        <span class="method-number">2.)</span>
                        <span class="method-name">GCash</span>
                        <span class="method-detail">6061 5575</span>
                    </div>
                    
                    <div class="method">
                        <span class="method-number">3.)</span>
                        <span class="method-name">Credit Card</span>
                        <span class="method-detail">Online portal or phone payment</span>
                    </div>
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
        
        elemBillNumber          = document.getElementById(elemIdBillNumber);
        elemBillDateIssue       = document.getElementById(elemIdBillDateIssue);
        elemBillDateDue         = document.getElementById(elemIdBillDateDue);
        elemBillDateStart       = document.getElementById(elemIdBillDateStart);
        elemBillDateEnd         = document.getElementById(elemIdBillDateEnd);
        elemBillAmount          = document.getElementById(elemIdBillAmount);
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
   
    
    this.beforeShow = function(options){
        
        /* Typical options
        options ={
            pig_farm_account:   pig_farm_account,
            account_bill:       account_bill
        }
        */
        
        let display_name;
        const account_name = options.pig_farm_account.name;
        
        if (account_name.length > MAX_TRUNCATE_ACC_NAME){
            display_name = account_name.substring(0, MAX_TRUNCATE_ACC_NAME) + '...';
        }
        else{
            display_name = account_name;
        }
        
        const account_bill = options.account_bill;
        
        const s_money   = thisObj.moneyFormatter.format(account_bill.amount);
        const s_amount  = `${account_bill.currency_code} ${s_money}`;
        
        elemAccountCode.textContent     = options.pig_farm_account.hid;
        elemAccountName.textContent     = display_name;  
        elemBillNumber.textContent      = account_bill.reference;
        elemBillDateIssue.textContent   = formatDate(new Date(account_bill.date_issue));
        elemBillDateDue.textContent     = formatDate(new Date(account_bill.date_due));
        elemBillDateStart.textContent   = formatDate(new Date(account_bill.date_bill_start));
        elemBillDateEnd.textContent     = formatDate(new Date(account_bill.date_bill_end));
        elemBillAmount.textContent      = s_amount;
        
        
        // TODO: 20260110
        // Hide money figures and payment instructions if user is not account admin user
        
    }
    
}