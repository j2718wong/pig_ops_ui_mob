// May 3, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';



import {APPLICATION,
        PAGE_ID}                from '../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}         from '../../utils.js';


export function PageAccountNewBill(input_settings){

    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    /*
    Typical input_settings
    {
        navigation:             navigation,
        parentObj:              thisObj,
        uniqueKey:              'sow-boar-medvac',
        elemDivContainer:       '<element>'

    }   
    */  
    const settings              = input_settings;
    
   
    
    let elemDivContainer        = document.getElementById(settings.elemIdDivContainer);

    
    let elemIdHeaderTitle       = null;
    let elemIdBtnClose          = null;   
    
    let elemIdAccountBillMsg    = null;
    
    let elemIdTdBillReference   = null;
    let elemIdTdDateIssue       = null;
    let elemIdTdDateDue         = null;
                                
    let elemIdTdCountedSowBoar  = null;
    let elemIdTdBilledSowBoar   = null;
                                
    let elemIdTdCurrency        = null;
    let elemIdTdChargePerPig    = null;
    let elemIdTdAmountBilled    = null;
                                
    let elemIdLabelTaxableSale  = null;
    let elemIdTdTaxableSale     = null;
                                
    let elemIdLabelTaxAmount    = null;
    let elemIdTdTaxAmount       = null;
              
    let elemIdTdAmountDue       = null;
    
    
    let elemIdPaymentInstructions   = null; 
    let elemIdPaymentUpload         = null;
                                    
    let elemIdPayGCashShow          = null;
    let elemIdPayGCashNumber        = null;
                                    
    let elemIdPayBankTransferShow   = null;
    let elemIdPayBankTransferNumber = null;
    let elemIdPayBankTransferAccount= null;
                                    
    let elemIdReferenceInput        = null;
    let elemIdScreenshotInput       = null;
    let elemIdSubmitPaymentBtn      = null;
    let elemIdPaymentStatus         = null;
    
    

    let elemHeaderTitle         = null;
    let elemBtnClose            = null;   
    
    let elemAccountBillMsg      = null;
    
    let elemTdBillReference     = null;
    let elemTdDateIssue         = null;
    let elemTdDateDue           = null;
                                
    let elemTdCountedSowBoar    = null;
    let elemTdBilledSowBoar     = null;
                                
    let elemTdCurrency          = null;
    let elemTdChargePerPig      = null;
    let elemTdAmountBilled      = null;
                                
    let elemLabelTaxableSale    = null;
    let elemTdTaxableSale       = null;
                                
    let elemLabelTaxAmount      = null;
    let elemTdTaxAmount         = null;
               
    let elemTdAmountDue         = null;
    
    
    let elemPaymentInstructions     = null; 
    let elemPaymentUpload           = null;
                                    
    let elemPayGCashShow            = null;
    let elemPayGCashNumber          = null;
                                    
    let elemPayBankTransferShow     = null;
    let elemPayBankTransferNumber   = null;
    let elemPayBankTransferAccount  = null;
                                    
    let elemReferenceInput          = null;
    let elemScreenshotInput         = null;
    let elemSubmitPaymentBtn        = null;
    let elemPaymentStatus           = null;
    
    


    let showOptions             = null;
    
    let dtCurrentDate           = null;
    
    
    
    
    const moneyFormatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
    
    
    
    
    this.init = function(){

        const html = thisObj.getHtml();
        elemDivContainer.innerHTML = html;
        
        
        thisObj.afterHtmlRender(); 
    
    }
    
       
    this._writeInlineStyle = function(){
        
        const html = `
            <style>
                
                .form-group {
                    margin-bottom: 12px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 4px;
                    font-weight: 500;
                    font-size: 0.85rem;
                }
                .form-control {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 0.85rem;
                    box-sizing: border-box;
                }
                .btn-primary {
                    background: #2e7d64;
                    color: white;
                    border: none;
                    padding: 10px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    width: 100%;
                }
                .btn-primary:hover {
                    background: #1a5c4a;
                }
                .payment-status {
                    margin-top: 10px;
                    padding: 8px;
                    border-radius: 4px;
                    text-align: center;
                    font-size: 0.85rem;
                }
                .payment-status.success {
                    background: #d4edda;
                    color: #155724;
                }
                .payment-status.error {
                    background: #f8d7da;
                    color: #721c24;
                }
                .payment-status.info {
                    background: #d1ecf1;
                    color: #0c5460;
                }
                .payment-instructions {
                    background: #e3f2fd;
                    padding: 12px;
                    border-radius: 4px;
                    margin-bottom: 10px;
                }
                .payment-number {
                    font-weight: 700;
                    font-size: 1.1rem;
                    margin: 8px 0;
                }
                hr {
                    margin: 12px 0;
                    border: none;
                    border-top: 1px solid #eee;
                }
            </style>
            `;
            
        return html;
    }
       
    
    this.getHtml = function(){
        
        elemIdHeaderTitle           = `${settings.uniqueKey}-title`;
        elemIdBtnClose              = `${settings.uniqueKey}-close`;
        
        elemIdAccountBillMsg        = `${settings.uniqueKey}-bill-msg`;
        
        
        let html_style              = thisObj._writeInlineStyle();
        
        let html_bill_info          = thisObj.getHtmlBillInfo();
        
        let html_payment_section    = thisObj.getHtmlPaymentSections();
        
        const html = `

${html_style}
        
<div class="form-container">

    <div class="modal-header">
        <h5 class="modal-title">
            <span id="${elemIdHeaderTitle}">New Account Bill</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    <div class="modal-body" id="">
        <div id="${elemIdAccountBillMsg}"></div>
    
        ${html_bill_info}
        
        ${html_payment_section}

    </div>
</div>    
    
        `;
       
        return html;

    }
    
    
    this.afterHtmlRender = function(){
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        
        elemHeaderTitle         = elemDivContainer.querySelector('#'+elemIdHeaderTitle); 
        elemBtnClose            = elemDivContainer.querySelector('#'+elemIdBtnClose); 
        
        elemAccountBillMsg      = elemDivContainer.querySelector('#'+elemIdAccountBillMsg);
        
        elemTdBillReference     = elemDivContainer.querySelector('#'+elemIdTdBillReference); 
        elemTdDateIssue         = elemDivContainer.querySelector('#'+elemIdTdDateIssue); 
        elemTdDateDue           = elemDivContainer.querySelector('#'+elemIdTdDateDue); 
                                                                                           
        elemTdCountedSowBoar    = elemDivContainer.querySelector('#'+elemIdTdCountedSowBoar); 
        elemTdBilledSowBoar     = elemDivContainer.querySelector('#'+elemIdTdBilledSowBoar); 
                                                                                           
        elemTdCurrency          = elemDivContainer.querySelector('#'+elemIdTdCurrency); 
        elemTdChargePerPig      = elemDivContainer.querySelector('#'+elemIdTdChargePerPig); 
        elemTdAmountBilled      = elemDivContainer.querySelector('#'+elemIdTdAmountBilled); 
                                                                                           
        elemLabelTaxableSale    = elemDivContainer.querySelector('#'+elemIdLabelTaxableSale); 
        elemTdTaxableSale       = elemDivContainer.querySelector('#'+elemIdTdTaxableSale); 
                                                                                           
        elemLabelTaxAmount      = elemDivContainer.querySelector('#'+elemIdLabelTaxAmount); 
        elemTdTaxAmount         = elemDivContainer.querySelector('#'+elemIdTdTaxAmount); 
                                                                                           
        elemTdAmountDue         = elemDivContainer.querySelector('#'+elemIdTdAmountDue); 
        
        
        elemPaymentInstructions     = elemDivContainer.querySelector('#'+elemIdPaymentInstructions); 
        elemPaymentUpload           = elemDivContainer.querySelector('#'+elemIdPaymentUpload);
                                                                                                     
        elemPayGCashShow            = elemDivContainer.querySelector('#'+elemIdPayGCashShow);
        elemPayGCashNumber          = elemDivContainer.querySelector('#'+elemIdPayGCashNumber);
                                                                                                     
        elemPayBankTransferShow     = elemDivContainer.querySelector('#'+elemIdPayBankTransferShow);
        elemPayBankTransferNumber   = elemDivContainer.querySelector('#'+elemIdPayBankTransferNumber);
        elemPayBankTransferAccount  = elemDivContainer.querySelector('#'+elemIdPayBankTransferAccount);
                                                                                                     
        elemReferenceInput          = elemDivContainer.querySelector('#'+elemIdReferenceInput);
        elemScreenshotInput         = elemDivContainer.querySelector('#'+elemIdScreenshotInput);
        elemSubmitPaymentBtn        = elemDivContainer.querySelector('#'+elemIdSubmitPaymentBtn);
        elemPaymentStatus           = elemDivContainer.querySelector('#'+elemIdPaymentStatus);
    }

    
    
    this._processAfterHtmlRender= function(){
        
    }
    
    
    this._bindEventListeners= function(){
        elemSubmitPaymentBtn.addEventListener('click', function() {
            thisObj.onClickSubmitPaymentProof();
        });
        
    }
    
    
    
    this.getHtmlBillInfo = function(){
       
        
        elemIdTdBillReference   = `${settings.uniqueKey}-bill-reference`;
        elemIdTdDateIssue       = `${settings.uniqueKey}-date-issue`;
        elemIdTdDateDue         = `${settings.uniqueKey}-date-due`;
              
        elemIdTdCountedSowBoar  = `${settings.uniqueKey}-counted-sow-boar`;
        elemIdTdBilledSowBoar   = `${settings.uniqueKey}-billed-sow-boar`;
              
        elemIdTdCurrency        = `${settings.uniqueKey}-currency`;
        elemIdTdChargePerPig    = `${settings.uniqueKey}-charge-per-pig`;
        elemIdTdAmountBilled    = `${settings.uniqueKey}-billed-amount`;
        
        elemIdLabelTaxableSale  = `${settings.uniqueKey}-taxable-sale-label`;
        elemIdTdTaxableSale     = `${settings.uniqueKey}-taxable-sale`;

        elemIdLabelTaxAmount    = `${settings.uniqueKey}-tax-label`;
        elemIdTdTaxAmount       = `${settings.uniqueKey}-tax-amount`;

        elemIdTdAmountDue       = `${settings.uniqueKey}-amount-due`;
        
        const html = `
        
        <table class="data-table">
            <colgroup>
                <col style="width: 60%;">
                <col style="width: 40%;">
            </colgroup>
            
            
            <tbody>
                <tr>
                    <td class="label">Bill Reference</td>
                    <td class="value" id="${elemIdTdBillReference}"></td>
                </tr>
                
                <tr>
                    <td class="label">Date Issue</td>
                    <td class="value" id="${elemIdTdDateIssue}"></td>
                </tr>
                
                <tr>
                    <td class="label">Date Due</td>
                    <td class="value" id="${elemIdTdDateDue}"></td>
                </tr>
                
                <tr>
                    <td class="label">Total Sows + Boars</td>
                    <td class="value" id="${elemIdTdCountedSowBoar}"></td>
                </tr>
                
                <tr>
                    <td class="label">Billed Sows + Boars</td>
                    <td class="value" id="${elemIdTdBilledSowBoar}"></td>
                </tr>
                
                <tr>
                    <td class="label">Currency</td>
                    <td class="value" id="${elemIdTdCurrency}"></td>
                </tr>
                
                <tr>
                    <td class="label">Charge per Pig</td>
                    <td class="value" id="${elemIdTdChargePerPig}"></td>
                </tr>
                
                <tr>
                    <td class="label">Billed Amount</td>
                    <td class="value" id="${elemIdTdAmountBilled}"></td>
                </tr>
                
                <tr>
                    <td class="label" id="${elemIdLabelTaxableSale}">Gross Sales</td>
                    <td class="value" id="${elemIdTdTaxableSale}"></td>
                </tr>
                
                <tr>
                    <td class="label" id="${elemIdLabelTaxAmount}">VAT 12%</td>
                    <td class="value" id="${elemIdTdTaxAmount}"></td>
                </tr>
                
                <tr>
                    <td class="label">Total Amount Due</td>
                    <td class="value" id="${elemIdTdAmountDue}"></td>
                </tr>
                
            </tbody>
        </table>
        
        
        
        `;
        
        return html;
    }

    
    this.getHtmlPaymentMethods = function(){
        
    }
    
    
    this.getHtmlPaymentSections = function(){
        elemIdPaymentInstructions   = `${settings.uniqueKey}-payment-instructions`;
        elemIdPaymentUpload         = `${settings.uniqueKey}-payment-upload`;
            
        elemIdPayGCashShow          = `${settings.uniqueKey}-pay-gcash-show`;
        elemIdPayGCashNumber        = `${settings.uniqueKey}-pay-gcash-number`;
        
        elemIdPayBankTransferShow   = `${settings.uniqueKey}-pay-bank-transfer-show`;
        elemIdPayBankTransferNumber = `${settings.uniqueKey}-pay-bank-transfer-number`;
        elemIdPayBankTransferAccount= `${settings.uniqueKey}-pay-bank-transfer-account`;
        
            
        elemIdReferenceInput        = `${settings.uniqueKey}-payment-reference`;
        elemIdScreenshotInput       = `${settings.uniqueKey}-payment-screenshot`;
        elemIdSubmitPaymentBtn      = `${settings.uniqueKey}-submit-payment`;
        elemIdPaymentStatus         = `${settings.uniqueKey}-payment-status`;
        
        
        // Store for later use
        this.elemIdReferenceInput   = elemIdReferenceInput;
        this.elemIdScreenshotInput  = elemIdScreenshotInput;
        this.elemIdSubmitPaymentBtn = elemIdSubmitPaymentBtn;
        this.elemIdPaymentStatus    = elemIdPaymentStatus;
        
        
        const html = `
            <div class="collapsible-panel mb-4" id="${elemIdPaymentInstructions}" style = "margin-top:1rem;">
                <div class="collapsible-header">
                    <span>Payment Instructions</span>
                </div>
                
                <div class="collapsible-body">
                    <div class="payment-instructions">
                        <div id="${elemIdPayGCashShow}">
                            <div>1.) GCash</div>
                            <div class="payment-number" id="${elemIdPayGCashNumber}">0912 345 6789</div>
                            <div>Send payment to this number.</div>
                        </div>
                        
                        <hr>
                        <div id="${elemIdPayBankTransferShow}">
                            <div>2.) Bank Transfer</div>
                            <div class="payment-number" id="${elemIdPayBankTransferNumber}">BDO: 0012 3456 7890</div>
                            <div id="${elemIdPayBankTransferAccount}">Account Name: J Systems Development</div>
                        </div>
                        
                        <hr>
                        <div><strong>Important:</strong> Use your <b>Bill Reference</b> as payment reference.</div>
                    </div>
                </div>
            </div>
            
            <div class="collapsible-panel" id="${elemIdPaymentUpload}">
                <div class="collapsible-header">
                    <span>Submit Payment Proof</span>
                </div>
                
                <div class="collapsible-body">
                    <div class="warning-box">
                        We will verify your payment after you upload the payment screenshot.
                        It may take some few business days to verify your payment. 
                    </div>
                
                    
                    <!-- If there is an already uploaded image for the current bill, 
                    it will overwrite that image; no need for image deletion; However this si save as 
                    separate entries in database.
                    -->
                    <div class="form-group">
                        <label>Payment Screenshot</label>
                        <input type="file" id="${elemIdScreenshotInput}" class="form-control" accept="image/*">
                    </div>
                    
                    <button id="${elemIdSubmitPaymentBtn}" class="btn-primary">Submit Payment Proof</button>
                    
                    <div id="${elemIdPaymentStatus}" class="payment-status"></div>
                    
                    <!-- Should display Image of the uploaded receipt-->
                    <div>
                    </div>
                    
                </div>
            </div>
        `;
        
        return html;
    }
    
    
    
          
    this.show = function(options){
        
        // show the last showOptions if there is no options
        if (options == null){options = showOptions;}
        
        // So that not to instantiate in every table redraw
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        
        /*
        Typical options
        options ={
            go_back_page:           go_back_page
        }
         
        */
        if (options){ // Change showOptions if there is a given options.  
            showOptions = options;
        }
        
        
        elemBtnClose.onclick = function(){
            // Remove NavHistoryHead if same with go_back_page
            navigation.managerNavHistory.removeFromNavHistoryHead(
                showOptions.go_back_page);
            
            navigation.showThisPage(showOptions.go_back_page);
        };
        
        
        const account = navigation.userControl.dataUserAccount.account.account;
        const current_bill = account.current_bill;
        
        console.log('\n\ncurrent_bill');
        console.log(current_bill);
        
        this.populateBill(current_bill);
    }
    
    
    
    this.populateBill = function(data){
        
        const dt_issue      = new Date(data.date_issue);
        const dt_issue_s    = formatDate(dt_issue, FORMAT_COMPACT);
        
        const dt_due        = new Date(data.date_due);
        const dt_due_s      = formatDate(dt_due, FORMAT_COMPACT);
        
        let counted_pigs    = 0;
        
        if (data.num_sow) {counted_pigs += data.num_sow;}
        if (data.num_boar){counted_pigs += data.num_boar;}


        let s_charge_per_pig    = moneyFormatter.format(data.charge_per_pig);
        let s_amount_billed     = moneyFormatter.format(data.amount);
        let s_taxable_sale      = moneyFormatter.format(data.taxable_amount);
        let s_tax_amount        = moneyFormatter.format(data.taxes);
        let s_amount_due        = moneyFormatter.format(data.total_amount_due);
        
        elemTdBillReference.textContent     = data.bill_reference;
        elemTdDateIssue.textContent         = dt_issue_s;     
        elemTdDateDue.textContent           = dt_due_s;       
                
        elemTdCountedSowBoar.textContent    = counted_pigs;
        elemTdBilledSowBoar.textContent     = data.num_billed;
                
        elemTdCurrency.textContent          = data.currency_code; 
        elemTdChargePerPig.textContent      = s_charge_per_pig;  
        elemTdAmountBilled.textContent      = s_amount_billed;
            
        //elemIdLabelTaxableSale    
        elemTdTaxableSale.textContent       = s_taxable_sale;   
            
        //elemIdLabelTaxAmount      
        elemTdTaxAmount.textContent         = s_tax_amount;     
            
        elemTdAmountDue.innerHTML           = `<b>${s_amount_due}</b>`;     
        
    }
    
    
    // In your PageAccountNewBill.js
    this.onClickSubmitPaymentProof = async function() {
        const screenshot = elemScreenshotInput ? elemScreenshotInput.files[0] : null;
        
        if (!screenshot) {
            this.showPaymentStatus('Please upload a screenshot of your payment', 'error');
            return;
        }
        
        // Get the current bill
        const account = navigation.userControl.dataUserAccount.account.account;
        const current_bill = account.current_bill;
        
        
        if (!current_bill || !current_bill.hid) {
            this.showPaymentStatus('No active bill found', 'error');
            return;
        }
        
        // Create FormData object
        const formData = new FormData();
        formData.append('uhid', navigation.userControl.getUserHid());
        formData.append('account_bill_hid', current_bill.hid);
        formData.append('screenshot', screenshot);
        
        this.showPaymentStatus('Submitting payment proof...', 'info');
        
        const bearer_token = localStorage.getItem('access_token');
        
        try {
            const response = await fetch('/account_bill/payment_proof/submit', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${bearer_token}`
                    // Do NOT set Content-Type header - browser sets it automatically with boundary for FormData
                },
                body: formData
            });
            
            const result = await response.json();
            
            if (result.result.num === 0) {
                this.showPaymentStatus('Payment proof submitted. We will verify within 24 hours.', 'success');
                if (elemScreenshotInput) elemScreenshotInput.value = '';
            } else {
                this.showPaymentStatus(result.result.desc || 'Submission failed', 'error');
            }
        } catch (error) {
            console.error('Upload error:', error);
            this.showPaymentStatus('Network error. Please try again.', 'error');
        }
    }



    this.showPaymentStatus = function(message, type) {
        if (!elemPaymentStatus) return;
        
        // Clear any existing timeout
        if (this.paymentStatusTimeout) {
            clearTimeout(this.paymentStatusTimeout);
        }
        
        // Set the message and style based on type
        elemPaymentStatus.textContent = message;
        elemPaymentStatus.className = `payment-status ${type}`;
        
        // Auto-hide success and info messages after 5 seconds
        if (type === 'success' || type === 'info') {
            this.paymentStatusTimeout = setTimeout(function() {
                if (elemPaymentStatus) {
                    elemPaymentStatus.textContent = '';
                    elemPaymentStatus.className = 'payment-status';
                }
            }, 5000);
        }
    }

}
