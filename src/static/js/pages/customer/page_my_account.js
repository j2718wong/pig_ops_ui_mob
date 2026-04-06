// March 6, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}              from '../common/page_view_basic.js';
import {PageTableBasic}             from '../common/page_table_basic.js';

import {APPLICATION,
        ACC_USER_GROUP,
        PAGE_ID,
        SOW_STATUS,
        PIG_PROD_TYPE,
        PIG_OPERATION_TYPE,
        PROD_STATUS,
        SUPPLIER_TYPE}              from '../../constants.js';


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
    let elemIdInfoBox           = null;
    
    
    
    let elemIdServerErrorMsg    = null;
    
    let elemIdBtnCancel         = null;
    let elemIdBtnSave           = null;
    
    let elemIdTableBody         = null;
    
    
    let elemHeaderTitle         = null;
    let elemBtnClose            = null;
    let elemInfoBox             = null;
    
    
    let elemAccountNameDisplay  = null;
    let elemAccountNameEditInput= null;
    let elemInvalidAccNameShow  = null;
    
    let elemAccountCodeDisplay  = null;
    
    
    let elemFreeTrialSection    = null;
    let elemFreeTrialExpiry     = null;
    let elemFreeTrialLink       = null;
    
    
    let elemServerErrorMsg      = null;
    
    let elemBtnCancel           = null;
    let elemBtnSave             = null;
    
    
    let elemTableBody           = null;
    
    
    
    

    
    
    let showOptions             = null;
    
    
    let dataUserAccount         = null;
    
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
    
    
    
    this.render = function(){
        
        elemIdHeaderTitle       = `${settings.uniqueKey}-title`;
        elemIdBtnClose          = `${settings.uniqueKey}-close`;
        
        
        const html_table_farm   =  pigFarmTable.getHtml();
    
        
        const html =`

        
<div class="form-container">

    <div class="modal-header">
        <h5 class="modal-title">
            <span id="${elemIdHeaderTitle}">My Account</span>
        </h5>
        <button type="button" class="btn-close btn-close-white" id="${elemIdBtnClose}" aria-label="Close"></button>
    </div>
    
    
    <div class="modal-body">
        <!-- ========== ACCOUNT SECTION ========== -->
        <div id="accountPlainGroup">
            <div class="account-plain">
                <!-- editable account name (read-only text by default) -->
                <div id="accountNameDisplay" class="account-name-text"></div>
            
                <!-- inline input for editing (hidden by default) -->
                <input type="text" id="accountNameEditInput" class="account-name-input hidden-section" value="" placeholder="Account name">

                <div id="invalid-acc-name-show" class="invalid-feedback" style="display:none;">
                    <i class="fas fa-triangle-exclamation"></i>
                    <span id="invalid-acc-name-msg">Invalid. Minimum 8 characters</span> 
                </div>

                <!-- account code (always plain text below) -->
                <div id="accountCodeDisplay" class="account-code">Account Code: 0000</div>
            </div>
          
        </div>
        
        <!-- ========== FREE TRIAL EXPIRY SECTION ========== -->
        <div id="freeTrialSection" class="free-trial-section">
            <div class="free-trial-container">
                <div class="free-trial-expiry-text">Your 90 days free trial will expire on</div>
                <div id="freeTrialExpiry" class="free-trial-expiry-date">02 June 2026</div> 
                <a href="#" id="freeTrialLearnMore" class="free-trial-link">What happens after free trial?</a>
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
        
        
        elemAccountNameDisplay  = elemDivContainer.querySelector('#accountNameDisplay');
        elemAccountNameEditInput= elemDivContainer.querySelector('#accountNameEditInput');
        elemInvalidAccNameShow  = elemDivContainer.querySelector('#invalid-acc-name-show');
        
        elemAccountCodeDisplay  = elemDivContainer.querySelector('#accountCodeDisplay');
        
        // New elements for free trial
        elemFreeTrialSection    = elemDivContainer.querySelector('#freeTrialSection');
        elemFreeTrialExpiry     = elemDivContainer.querySelector('#freeTrialExpiry');
        elemFreeTrialLink       = elemDivContainer.querySelector('#freeTrialLearnMore');
        
        elemTableBody           = elemDivContainer.querySelector('#'+elemIdTableBody);
        
        
        elemServerErrorMsg      = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);

      
    }
    
    
    this._processAfterHtmlRender = function(){
        
    }
    
    
    this._bindEventListeners = function(){
        elemAccountNameDisplay.addEventListener('click', function(event){
            if (!dataUserAccount) return; // safety
            
            const data_user     = dataUserAccount.user;
            
            // switch to edit mode
            const data_account  = dataUserAccount.account;
            const account_name  = data_account.account.name;
            
            
            
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
        
        // Bind free trial link click event
        if (elemFreeTrialLink) {
            elemFreeTrialLink.addEventListener('click', function(event) {
                event.preventDefault();
                
                let go_back_page    = navigation.curPageNavigated.pageContainer;
                if (go_back_page == null){
                    go_back_page    = navigation.getPageContainer(PAGE_ID.HOME);
                } 
                
                const next_page = navigation.getPageContainer(PAGE_ID.CUSTOMER_PRICING);
                
                // Push currentPage to NavHistory; 
                // Will also compare current page and  next_page NAV_MENU_GROUP.
                navigation.pushCurrentPageToNavHistory(next_page);
                
                
                navigation.showThisPage(next_page);
                
                
                const options ={
                    go_back_page:   go_back_page,
                };
                navigation.pageCustomerPricing.show(options);
                
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
        thisObj.debugNavHistory(TAG);
        
        // Update navigation.curPageNavigated
        navigation.curPageNavigated.pageData = {options: options};
        navigation.curPageNavigated.renderPageFunc = thisObj.renderPage;
        
        
        thisObj._resetForm();
        

        
        dataUserAccount  = navigation.userControl.dataUserAccount;
        
        
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
        
    

        this.populateForm();
       
    }
    
    
    this.refreshAccountName =  function(){
        const account_name  = dataUserAccount.account.account.name;
        const account_hid   = dataUserAccount.account.account.hid;
            
        elemAccountNameDisplay.textContent = account_name;
        elemAccountNameEditInput.value = account_name;
        elemAccountCodeDisplay.textContent = `Account Code: ${account_hid}`;
    }
    
    
    this.populateForm = function(){
        this.refreshAccountName();
        
        if (dataUserAccount.account.account.date_trial_end){
            elemFreeTrialSection.classList.remove('hidden-section');
            
            const dt_expiry     = new Date(dataUserAccount.account.account.date_trial_end);
            const s_dt_expiry   = formatDate(dt_expiry, FORMAT_COMPACT) 
            
            elemFreeTrialExpiry.textContent = s_dt_expiry; 
            
        }
        else{
            elemFreeTrialSection.classList.add('hidden-section');
        }
        
        
        const data_farm_list =  dataUserAccount.account.pig_farms;
        pigFarmTable.setDataEntryList(data_farm_list);
        pigFarmTable.renderTable(data_farm_list);
        
        
        // Show/Hide AddTextLink based on user role
        const data_user     = dataUserAccount.user;
            
            
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
        if (!dataUserAccount) return;
        
        // already not editing
        if (elemAccountNameEditInput.classList.contains('hidden-section')) return; 

        const newName = elemAccountNameEditInput.value.trim();
        if (newName.length < 8) {
            
            elemInvalidAccNameShow.style.display = 'block';
            return;
        }
        
        
        if (newName !== dataUserAccount.account.account.name) {
            thisObj.onSaveAccountName(newName);
        }
        
        
        const account_name  = dataUserAccount.account.account.name;
        

        // always switch back to read-only display (even if same or empty we revert display)
        elemAccountNameDisplay.innerText = account_name;   // ensure fresh
        elemAccountNameDisplay.classList.remove('hidden-section');
        elemAccountNameEditInput.classList.add('hidden-section');

    }

    
    this.onSaveAccountName = function(new_acc_name){
        const user_hid      = dataUserAccount.user.user.hid;
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
                    dataUserAccount.account.account = response.account;
                    
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
