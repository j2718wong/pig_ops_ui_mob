// page_user_list.js

// February 23, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageTableBasic}         from '../common/page_table_basic.js';


import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE,
        PIG_PROD_TYPE,
        PROD_STATUS}            from '../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        sortList}               from '../../utils.js';

import {ComponentNavLeftRight}  from '../common/ui/comp_nav_left_right.js';




export function PageUserList(input_settings){
    PageTableBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    /*
    Typical input_settings
    {
        navigation:             this,
        uniqueKey:              'prod-not-pregnant' 
        pageTitle:              'User List'
    }   
    */  
    let settings                = input_settings;
    
    
    
    
    // This is needed as this will be first element to be rendered
    let elemDivContainer        = document.getElementById(settings.elemIdDivContainer);
    
    
    let componentNavLeftRight   = null;
    
    let elemIdPageInfo          = null;
    let elemIdTableBody         = null;
    
    
    let elemPageInfo            = null;
    let elemTableBody           = null;
    
    
    let dataUserList            = null;

    
    let dtCurrentDate           = null;



    
    this.init = function(){

        
        thisObj.setSettingsTable({
            uniqueKey:      settings.uniqueKey,
            noAddButton:    true,
            noHeader:       true,
            itemsPerPage:   20
        });
        
        
        this.render();
        this.afterHtmlRender();
        
        this.afterHtmlRenderThis();
        
    }
    
    
    
    this.render = function(){
        
        componentNavLeftRight   = new ComponentNavLeftRight({
           uniqueKey:           settings.uniqueKey,
           elemDivContainer:    elemDivContainer,
           pageTitle:           'User List'
        });
        
        elemIdPageInfo          = `${settings.uniqueKey}-page-info`;
        
        
        const html_nav          = componentNavLeftRight.getHtml();
        const html_table        = thisObj.getHtml();
           

        const html = `

<div class="mobile-container">
    ${html_nav}
    
    <!-- Mobile Info Box -->
    <!--
    <div class="mobile-info-box">
        <div class="info-text" id="${elemIdPageInfo}">
        </div>
    </div>
    -->
    
    ${html_table}

    
</div>
        `;
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRenderThis = function(){
        componentNavLeftRight.afterHtmlRender();
        
        
        this._findElementsThis();
        this._processAfterHtmlRenderThis();
        this._bindEventListenersThis();
    }
    
    
    this._findElementsThis = function(){
       
        elemPageInfo            = elemDivContainer.querySelector('#'+elemIdPageInfo);
        
        elemTableBody           = elemDivContainer.querySelector('#'+elemIdTableBody);
    }
    
    
    this._processAfterHtmlRenderThis = function(){
        componentNavLeftRight.callbackNavLeft = function(){
            if (window.SUPERPIG_UI_SETTINGS.enable_referral > 0){
                // TODO
            }
            else{
                navigation.managerNavLinks.onClickNavAccessCodes(null, true);
            }
        };
        
          
        componentNavLeftRight.callbackNavRight = function(){
            navigation.managerNavLinks.onClickNavAccessCodes(null, true);
        };
        
        
        componentNavLeftRight.bindEventListeners();
    }
    
    
    this._bindEventListenersThis = function(){
    }
    
    
    this.show = function(){
        

        const callback_success = function(data){
            dataUserList  = navigation.pigFarm.accountLists.dataUserList;
            thisObj.renderTable(dataUserList);
        };
        
        
        const callback_offline = function(){
            dataUserList  = navigation.pigFarm.accountLists.dataUserList;
            
            if (dataUserList){
                // Display last known data if available
                thisObj.renderTable(dataUserList);
            }
            else{
                // Display modal offline
                navigation.managerSystem.showOfflineMessageModal();
            }
        };
        
        
        // Request User List
        navigation.pigFarm.accountLists.requestDataUserList(
            callback_success, callback_offline, null);
    }
    

    
    this.getElemTableBody = function(){
        return elemTableBody;
    }

    
    this.getHtmlTableHeader = function(){
        elemIdTableBody         = `${settings.uniqueKey}-table-tbody`;
        

        
        const html = `

        
        <table class="data-table" id="">
            <colgroup>
                <col style="width: 70%;">
                <col style="width: 40%;">
            </colgroup>

            <thead>
                <tr>
                    <th>Name</th>
                    <th>Group</th>
                </tr>
            </thead>
            
            
            <tbody id="${elemIdTableBody}">
            </tbody>
        </table>
        
        `;
        
        return html;
        
    }
       

    this.getHtmlTableRowEmpty = function(){
        const html = `
            <tr>
                <td colspan="2"><div>No Entries</div></td>
            </tr>
        `;
        return html;
    }
    

    this.getHtmlTableRow = function(cur_entry){
        let user_name = `${cur_entry.user.name_first} ${cur_entry.user.name_last}`;
        let user_email = '';
        
        if (cur_entry.user.email){
            user_email = cur_entry.user.email;
        }
        
        let html_user = `
            <div>${user_name}</div>
            <div style="color:blue;">${user_email}</div>
        `;
        
        
        const html = `
            <tr>
                <td>${html_user}</td>
                <td>${cur_entry.user_group.name}</td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.getElemTableRow = function(cur_entry){
        const elem_row = document.createElement('tr');
        
        const html = thisObj.getHtmlTableRow(cur_entry);
        elem_row.innerHTML = html;
        

        
        // Attach onclick listeners to td
        
        const elem_tds = elem_row.querySelectorAll('td'); 
        
        let index = 0
        for (const cur_td of elem_tds){
        

            if (index == 0 || index == 1) {
                cur_td.onclick = function(){
                   
                }
            }
            
        
            index += 1;
        }
        
        return elem_row;
    }
    
    
    
    
    
    
    this.setUserLanguage = function(language_key){
        curUserLanguageKey = language_key;
        thisObj.onUserChangeLanguage();
    }
    
    
    this.onUserChangeLanguage = function(){
        
       
    }
    
    
    this.searchEntries = function(key){
        let data_pig_prod_list = dataUserList;
        
        
        const filtered = [];
        for (const cur_entry of data_pig_prod_list){
            let user_name = `${cur_entry.user.name_first} ${cur_entry.user.name_last}`;
            let user_email = null;
            
            user_name = user_name.toUpperCase();
            
            if (cur_entry.user.email){
                user_email = cur_entry.user.email.toUpperCase();
            }
            
            if (user_name.includes(key)){
                filtered.push(cur_entry)
                continue;
            }
            
            if (user_email && user_email.includes(key)){
                filtered.push(cur_entry)
                continue;
            }
            
        }
        return filtered;
    }
    
    
    
    
    this.onClickPageHeaderTitle = function(){
        
        
    }
    
    
    
      
}
