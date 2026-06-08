// page_my_account.js

// March 6, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}              from '../common/page_view_basic.js';
import {PageTableBasic}             from '../common/page_table_basic.js';

import {APPLICATION,
        FLAG_BITS,
        ACC_USER_GROUP,
        PAGE_ID,
        HASH_ROUTES}                from '../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        FORMAT_COMPACT_NO_SPACE}    from '../../utils.js';


import {addValidationClassToElem}   from '../common/ui/ui_utils.js';




export function PageMyAccount(input_settings){
    PageViewBasic.call(this);
    
    const TAG                   = 'PageMyAccount';
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    this.setNavigation(navigation);
    
    const DEFAULT_ACC_MAX_NUM_SOW_BOAR_FREE = 3;
    
      
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContProdGestaAdd,
        uniqueKey:              'prod-add-gesta'
    };
    */
    const settings              = input_settings;

    
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
        
    
    
    let elemIdHeaderTitle       = null;
    let elemIdBtnClose          = null;
    
    let elemIdAccountNameDisplay    = null;
    let elemIdAccountNameEditInput  = null;
    let elemIdInvalidAccNameShow    = null;
    let elemIdAccountCodeDisplay    = null;
    
    let elemIdAccountNotStarted = null;
    
    let elemIdMaxSowBoarGilt    = null;
    
    let elemIdFreeTrialSection  = null;
    let elemIdFreeTrialStarted  = null;
    let elemIdFreeTrialExpiry   = null;
    let elemIdAfterFreeTrialLink= null;
    
    let elemIdServerErrorMsg    = null;
    
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    let elemIdTableBody         = null;
    
    
    let elemHeaderTitle         = null;
    let elemBtnClose            = null;

    
    let elemAccountNameDisplay  = null;
    let elemAccountNameEditInput= null;
    let elemInvalidAccNameShow  = null;
    let elemAccountCodeDisplay  = null;
    
    
    let elemAccountNotStarted   = null;
    
    let elemMaxSowBoarGilt      = null;
    
    let elemFreeTrialSection    = null;
    let elemFreeTrialStarted    = null;
    let elemFreeTrialExpiry     = null;
    let elemAfterFreeTrialLink  = null;
    
    
    let elemServerErrorMsg      = null;
    
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
    let elemTableBody           = null;
    
    
    
    

    
    
    let showOptions             = null;
    
    
    let accountInfo             = null;
    
    let pigFarmTable            = new PageTableBasic();
    
    
    this.init = function(){
        
        pigFarmTable.setSettingsTable({
            uniqueKey:      settings.uniqueKey,
            tableTitle:     'Pig Farm List',
            noSearchAdd:    true,
            noRowCount:     true,
            itemsPerPage:   10,
            
            addEntryLink: {
                label:      'Add Farm',
                onclickAddEntry:    thisObj.onClickAddFarm
            }
        });
        this.initPigFarmTable();
        
        
        this.render();
        this.afterHtmlRender();
        
        pigFarmTable.afterHtmlRender();
    }
    
    
    this.initPigFarmTable = function(){
        // Implement pigFarmTable functions
        
        pigFarmTable.getElemTableBody = function(){
            return elemTableBody;
        };
        
        
        pigFarmTable.getHtmlTableHeader = function(){
            elemIdTableBody         = `${settings.uniqueKey}-farm-tbody`;
            
            
            const html = `
            
            <table class="data-table" id="">
                <colgroup>
                    <col style="width: 50%;">
                    <col style="width: 50%;">
                    
                </colgroup>
                
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                    </tr>
                </thead>
                
                <tbody id="${elemIdTableBody}">
                </tbody>
            </table>
            
            `;
            
            return html;
            
        };
        
        
        pigFarmTable.getHtmlTableRowEmpty = function(){
            const html = `
                <tr>
                    <td colspan="2"><div>No Entries</div></td>
                </tr>
            `;
            return html;
        };
    

        pigFarmTable.getHtmlTableRow = function(cur_entry){

            
            const pig_farm_name = cur_entry.pig_farm.name;
            
            const pig_farm_location = cur_entry.location;
            
            let s_address = '';
            
            s_address = pig_farm_location.country.name;
            if (pig_farm_location.address){
                const address = pig_farm_location.address;
                
                if (address.level_1 && address.level_1.name ){
                    s_address += `, ${address.level_1.name}`;
                    
                    if (address.level_2 && address.level_2.name){
                        s_address += `, ${address.level_2.name}`;
                        
                        if (address.level_3 && address.level_3.name){
                            s_address += `, ${address.level_3.name}`;
                        }
                    }
                }
            }
            
            
            const html = `
                <tr>
                    <td>${pig_farm_name}</td>
                    <td>${s_address}</td>
                </tr>
            `;
            
            return html;
        }
    
    
    
    
        pigFarmTable.getElemTableRow = function(cur_entry){
            const elem_row = document.createElement('tr');
            
            const html = pigFarmTable.getHtmlTableRow(cur_entry);
            elem_row.innerHTML = html;
             

            
            // TODO still evaluating if onclick is for row, td or span in td;
            // To avoid un necessary clicks while scrolling. 
            
            
            // Attach onclick listeners to td
            
            
            const elem_tds = elem_row.querySelectorAll('td'); 
            
            let index = 0
            for (const cur_td of elem_tds){
                
                if (index == 0 || index == 1){
                    cur_td.onclick = function(){
                        // Show Container
                        const next_page_id   = PAGE_ID.PIG_FARM_ADD_EDIT;
                        const next_page = navigation.getPageContainer(next_page_id);
                        
                        // Push currentPage to NavHistory; 
                        // Will also compare current page and  next_page NAV_MENU_GROUP.
                        navigation.pushCurrentPageToNavHistory(next_page);
                        
                        navigation.showThisPage(next_page);
                        
                        
                        // Show Page
                        const go_back_page_id   = PAGE_ID.MY_ACCOUNT;
                        const go_back_page = navigation.getPageContainer(go_back_page_id);
                        
                    
                        const options ={
                            is_add:                 false,   // false is edit
                            go_back_page:           go_back_page 
                        }
                        navigation.pagePigFarmAddEdit.show(options);

                    
                    };
                            
                }
                
                index += 1;
            } 
            
            return elem_row;
        }
    }
    
    
    
    this._writeInlineStyle = function(){
        const html = `
        <style>
            
            .limit-info {
                background: #e3f2fd;
                border-radius: 12px;
                padding: 0.8rem 0.8rem;
                margin-bottom: 1rem;
            }
            
            .limit-number {
                font-size: 1.25rem;
                font-weight: 700;
                color: #1565c0;
                background: white;
                padding: 0.2rem 0.75rem;
                border-radius: 20px;
                display: inline-block;
            }
            
            .billing-info-compact {
                background: #f0f7f4;
                border-radius: 10px;
                padding: 0.75rem 1rem;
                margin: 0.75rem 0;
            }
            
            .billing-compact-title {
                font-size: 0.8rem;
                font-weight: 600;
                color: #2e7d64;
                margin-bottom: 0.5rem;
            }
            
            .billing-compact-items {
                display: flex;
                flex-direction: column;
                gap: 0.3rem;
            }
            
            .billing-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.8rem;
                color: #333;
            }
            
            .billing-bullet {
                width: 18px;
                font-size: 0.75rem;
                color: #2e7d64;
            }
            
            .limit-badge {
                display: inline-block;
                background: #2e7d64;
                color: white;
                font-weight: 700;
                font-size: 0.7rem;
                padding: 0.05rem 0.4rem;
                border-radius: 16px;
                min-width: 24px;
                text-align: center;
            }
            
            .billing-item strong {
                color: #1a5c4a;
            }
        </style>
        `;
        return html;
        
    }
    
    
    this.render = function(){
        
        elemIdHeaderTitle           = `${settings.uniqueKey}-title`;
        elemIdBtnClose              = `${settings.uniqueKey}-close`;
        
        elemIdAccountNameDisplay    = `${settings.uniqueKey}-acc-name-display`;
        elemIdAccountNameEditInput  = `${settings.uniqueKey}-acc-name-edit`;
        elemIdInvalidAccNameShow    = `${settings.uniqueKey}-inv-account-show`;
        elemIdAccountCodeDisplay    = `${settings.uniqueKey}-acc-code-display`;
        
        elemIdAccountNotStarted     = `${settings.uniqueKey}-acc-not-started`;
        
        elemIdMaxSowBoarGilt        = `${settings.uniqueKey}-max-sow-boar-gilt`;
        
        
        elemIdFreeTrialSection      = `${settings.uniqueKey}-free-trial-section`;
        elemIdFreeTrialStarted      = `${settings.uniqueKey}-free-trial-started`;
        elemIdFreeTrialExpiry       = `${settings.uniqueKey}-free-trial-expiry`;
        elemIdAfterFreeTrialLink    = `${settings.uniqueKey}-after-free-trial`;
        
        
        const html_style        = thisObj._writeInlineStyle();
        
        const html_table_farm   =  pigFarmTable.getHtml();
    
        
        const html =`

${html_style}
        
<div class="form-container">

    <div class="modal-header">
        <h5 class="modal-title">
            <span id="${elemIdHeaderTitle}">My Account</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    
    <div class="modal-body">
        <!-- ========== ACCOUNT SECTION ========== -->
        <div>
            <div>
                <!-- editable account name (read-only text by default) -->
                <div id="${elemIdAccountNameDisplay}" class="account-name-text"></div>
            
                <!-- inline input for editing (hidden by default) -->
                <input type="text" id="${elemIdAccountNameEditInput}" 
                    class="account-name-input hidden-section" 
                    value="" placeholder="Account name">

                <div id="${elemIdInvalidAccNameShow}" class="invalid-feedback" style="display:none;">
                    <i class="fas fa-triangle-exclamation"></i>
                    <span id="invalid-acc-name-msg">Invalid. Minimum 8 characters</span> 
                </div>

                <div id="${elemIdAccountCodeDisplay}" class="account-code">Account Code: 0000</div>
            </div>
          
        </div>
        
        
        <!-- INFO BANNER - New Account -->
        <div id="${elemIdAccountNotStarted}">
            <h4>Welcome to SuperPig!</h4>
            
            <p>Your account is ready. Start adding sows, boars, and gilts 
            to unlock farm insights and activate your free trial.
            Please feel free to explore how to use Superpig.</p>
        </div>

        
        <!-- FREE TRIAL INFO -->
        <div class="limit-info">
            <h2 style="margin: 0 0 0.5rem 0;">Free Tier Limit</h2>
            <p style="margin: 0 0 0.5rem 0;">Your account remains <strong>completely free</strong> 
            as long as your sow/boar/gilt count stays at or below</p>
            <div class="limit-number">
                MAX: <span id="${elemIdMaxSowBoarGilt}">${DEFAULT_ACC_MAX_NUM_SOW_BOAR_FREE}</span> pigs
            </div>
            
            <p> 
                Once your account exceed this limit, the 90-day free trial will begin automatically.
            </p>
            
            <a href="#" id="${elemIdAfterFreeTrialLink}" class="free-trial-link">What happens after free trial?</a>
        </div>
        
        <!-- FREE TRIAL EXPIRY SECTION -->
        <div id="${elemFreeTrialSection}" class="free-trial-section">
                
            <div id="${elemIdFreeTrialStarted}">
                <div class="free-trial-expiry-text">Your 90 days free trial will expire on</div>
                <div id="${elemIdFreeTrialExpiry}" class="free-trial-expiry-date">02 June 2026</div> 
            </div>
            
            
        </div>
        
        
        
        <div style = "margin-top:1rem;">
        ${html_table_farm}
        <div>
        
        <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
        

        
        
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
        
        
        elemAccountNameDisplay  = elemDivContainer.querySelector('#'+elemIdAccountNameDisplay);
        elemAccountNameEditInput= elemDivContainer.querySelector('#'+elemIdAccountNameEditInput);
        elemInvalidAccNameShow  = elemDivContainer.querySelector('#'+elemIdInvalidAccNameShow);
        elemAccountCodeDisplay  = elemDivContainer.querySelector('#'+elemIdAccountCodeDisplay);
        
        elemAccountNotStarted   = elemDivContainer.querySelector('#'+elemIdAccountNotStarted);


        elemMaxSowBoarGilt      = elemDivContainer.querySelector('#'+elemIdMaxSowBoarGilt);

        elemFreeTrialSection    = elemDivContainer.querySelector('#'+elemIdFreeTrialSection);
        
        elemFreeTrialStarted    = elemDivContainer.querySelector('#'+elemIdFreeTrialStarted);
        elemFreeTrialExpiry     = elemDivContainer.querySelector('#'+elemIdFreeTrialExpiry);
        elemAfterFreeTrialLink  = elemDivContainer.querySelector('#'+elemIdAfterFreeTrialLink);
        
        elemTableBody           = elemDivContainer.querySelector('#'+elemIdTableBody);
        
        
        elemServerErrorMsg      = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);

      
    }
    
    
    this._processAfterHtmlRender = function(){
        
    }
    
    
    this._bindEventListeners = function(){
        
        elemBtnClose.addEventListener('click', function(event){
            history.back();
        });
        
        
        elemAccountNameDisplay.addEventListener('click', function(event){
            if (!accountInfo) return; // safety
            
            
            // switch to edit mode
            const account_name  = accountInfo.account.name;
            
            
            const data_user     = navigation.userControl.dataUserAccount.user;
            
            
            // Only account admins can change account name
            // Get user.user_group.group_num
            const user_group_num = data_user.user_group.group_num;
            
            if (user_group_num == ACC_USER_GROUP.ADMIN) {
                elemAccountNameEditInput.value = account_name;
                elemAccountNameDisplay.classList.add('hidden-section');
                
                elemAccountNameEditInput.classList.remove('hidden-section');
                elemAccountNameEditInput.focus();
            }
        });
        
        
        elemAccountNameEditInput.addEventListener('blur', thisObj.exitEditAccAndSave);
        
        // Bind after free trial link click event
        if (elemAfterFreeTrialLink) {
            elemAfterFreeTrialLink.addEventListener('click', function(event) {
                event.preventDefault();
                
                const dataHashRoute = {
                    pageId:         PAGE_ID.CUSTOMER_PRICING
                };
                
                navigation.managerHashRoute.hashRouter.navigate(
                    HASH_ROUTES.CUSTOMER_PRICING, dataHashRoute);
                
                const next_page = navigation.getPageContainer(PAGE_ID.CUSTOMER_PRICING);
                navigation.showThisPage(next_page);
                
                navigation.pageCustomerPricing.show();
            });
        }
    
       
        
    }
    
    
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        elemServerErrorMsg.style.display = 'none';
    }
    
    
    this.renderPage = function(page_data){
        thisObj.show(page_data.options);
    }
    
    
    this.show = function(options){
        
        thisObj._resetForm();
        
        accountInfo  = navigation.account.accountInfo;
        
        console.log(`accountInfo`);
        console.log(accountInfo);
        
        
        const account_flag = accountInfo.account.flag;
        
        if (accountInfo.account.count_sow_boar == 0){
            elemAccountNotStarted.style.display      = 'block';
        }
        else{
            elemAccountNotStarted.style.display      = 'none';
        }
        
        
        let to_show_free_trial_started = 0; 
        
        
        // Do not show free trial has started if account is IS_BILL_EXEMPTED > 0  
        if ((account_flag & FLAG_BITS.ACCOUNT.IS_BILL_EXEMPTED) == 0){
            if ((account_flag & FLAG_BITS.ACCOUNT.FREE_TRIAL_STARTED) > 0){
                to_show_free_trial_started = 1;
            }
        }
        
        
        
        elemFreeTrialExpiry.textContent = '';
        
        
        
        if (to_show_free_trial_started > 0){
            elemFreeTrialStarted.style.display      = 'block';   
        }
        else{
            elemFreeTrialStarted.style.display      = 'none';
        }
        
        
        /*
        Typical options
        options ={
            go_back_page:           go_back_page
        }
         
        */
        if (options){ // Change showOptions if there is a given options.  
            showOptions = options;
        }
        
        
        
        this.populateFreeTrialValues();
    

        this.populateForm();
       
    }
    
    
    this.populateFreeTrialValues = function(){
        const callback_success = function(data){
            
            let  max_num_sow_boar_free = data.ACC_MAX_NUM_SOW_BOAR_FREE;
            
            if (max_num_sow_boar_free >= DEFAULT_ACC_MAX_NUM_SOW_BOAR_FREE){
                elemMaxSowBoarGilt.textContent = max_num_sow_boar_free;
            }
            
        };
        
        navigation.managerBusiness.requestListOfValues(callback_success);
        
    }
    
    
    this.refreshAccountName =  function(){
        const account_name  = accountInfo.account.name;
        const account_hid   = accountInfo.account.hid;
            
        elemAccountNameDisplay.textContent  = account_name;
        elemAccountNameEditInput.value      = account_name;
        elemAccountCodeDisplay.textContent  = `Account Code: ${account_hid}`;
    }
    
    
    this.populateForm = function(){
        this.refreshAccountName();
        
        const dt_expiry     = new Date(accountInfo.account.date_trial_end);
        const s_dt_expiry   = formatDate(dt_expiry, FORMAT_COMPACT) 
        
        elemFreeTrialExpiry.textContent = s_dt_expiry; 
        
        
        
        const data_farm_list =  accountInfo.pig_farms;
        pigFarmTable.setDataEntryList(data_farm_list);
        pigFarmTable.renderTable(data_farm_list);
        
        
        // Show/Hide AddTextLink based on user role
        const data_user     = navigation.userControl.dataUserAccount.user;
            
            
        // Only account admins can add farms
        // Get user.user_group.group_num
        const user_group_num = data_user.user_group.group_num;
        
        if (user_group_num == ACC_USER_GROUP.ADMIN) {
            pigFarmTable.addTextLinkShow();
        }
        else{
            pigFarmTable.addTextLinkHide();
        }
        
    }
    
    
    this.exitEditAccAndSave = function(){
        if (!accountInfo) return;
        
        // already not editing
        if (elemAccountNameEditInput.classList.contains('hidden-section')) return; 

        const newName = elemAccountNameEditInput.value.trim();
        if (newName.length < 8) {
            
            elemInvalidAccNameShow.style.display = 'block';
            return;
        }
        
        
        if (newName !== accountInfo.account.name) {
            thisObj.onSaveAccountName(newName);
        }
        
        
        const account_name  = accountInfo.account.name;
        

        // always switch back to read-only display (even if same or empty we revert display)
        elemAccountNameDisplay.innerText = account_name;   // ensure fresh
        elemAccountNameDisplay.classList.remove('hidden-section');
        elemAccountNameEditInput.classList.add('hidden-section');

    }

    
    this.onSaveAccountName = function(new_acc_name){
        const user_hid      = navigation.userControl.getUserHid();
        const base_url      = window.location.origin;

        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'name':             new_acc_name
        };
        
        
        let url = `${base_url}/account/update`
        
        
        const bearer_token = localStorage.getItem('access_token');

        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    accountInfo.account = response.account;
                    
                    thisObj.refreshAccountName();
                    
                    elemInvalidAccNameShow.style.display = 'none';
                }
                else{
                    let error_code = response.result.code;
                    let error_desc = response.result.desc;
                    
                    let html = `<span>${error_code}</span>`;
                    
                    if (error_desc && error_desc.length > 0){
                        html += `<br><span>${error_desc}</span>`;
                    }
                    

                    elemInvalidAccNameShow.style.display = 'block';
                    elemInvalidAccNameShow.innerHTML = html;  
                    
                }
            },
  
            complete: function(){
                // TODO unsay buhaton
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                
            }
        });
    }
    
    
    
    
    this.onClickAddFarm = function(){
        
    }
    
    this.onClickSaveButton = function(){
        
    }
    
    
  
    
    
}   
