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
    
       
    
    this.getHtml = function(){
        
        elemIdHeaderTitle           = `${settings.uniqueKey}-title`;
        elemIdBtnClose              = `${settings.uniqueKey}-close`;
        
        elemIdAccountBillMsg        = `${settings.uniqueKey}-bill-msg`;
        
        let html_bill_info          = this.getHtmlBillInfo();
        
        
        
        const html = `
        
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
    }

    
    
    this._processAfterHtmlRender= function(){}
    
    
    this._bindEventListeners= function(){
        
        
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
        
        this.populateBill(current_bill);
    }
    
    
    
    this.populateBill = function(data){
        console.log('populate bill');
        console.log(data);
        
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

}
