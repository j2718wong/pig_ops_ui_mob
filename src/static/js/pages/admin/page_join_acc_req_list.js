// page_join_acc_req_list.js

// March 4, 2026
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




export function PageJoinAccReqList(input_settings){
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


    let dataRequestJoinAccList  = null;


    
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
           pageTitle:           'Request Join Account'
        });
        
        elemIdPageInfo          = `${settings.uniqueKey}-page-info`;
        
        
        const html_nav          = componentNavLeftRight.getHtml();
        const html_table        = thisObj.getHtml();
           

        const html = `

<div class="mobile-container">
    ${html_nav}
    
    <!-- Mobile Info Box -->
    <div class="mobile-info-box">
        <div class="info-text" id="${elemIdPageInfo}">
            This is the list of users who wish to join to your Pig Farm Account.
        </div>
    </div>
    
    
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
            navigation.managerNavLinks.onClickNavAccessCodes();
        };
        
          
        componentNavLeftRight.callbackNavRight = function(){
            navigation.managerNavLinks.onClickNavUsers();
        };
        
        
        componentNavLeftRight.bindEventListeners();
    }
    
    
    this._bindEventListenersThis = function(){
    }
    
    
    
    // Handle window resize for view switching
    this.handleWindowResize = function() {
        const isMobile = window.innerWidth <= APPLICATION.MAX_WIDTH_WINDOW_IS_MOBILE;
                
        /*
        if (isMobile) {
            elemMobileContainer.style.display = 'flex';
            elemTableContainer.style.display = 'none';
        } else {
            elemMobileContainer.style.display = 'none';
            elemTableContainer.style.display = 'block';
        }*/
    }
    
    
    this.beforeShow = function(){
        
        const callback_success = function(data){
            dataRequestJoinAccList = data;
            thisObj.renderTable(dataRequestJoinAccList);
        };
        
        // Request UserRequest List
        navigation.pigFarm.accountLists.requestDataJoinAccReqList(
            callback_success, null);
    }
    

    this._writeInlineStyle = function(){
        const html = ``;
        return html;

    }
    
    
    this.getElemTableBody = function(){
        return elemTableBody;
    }

    
    this.getHtmlTableHeader = function(){
        elemIdTableBody         = `${settings.uniqueKey}-table-tbody`;
        
        const html_style = this._writeInlineStyle();
        
        
        const html = `
        ${html_style}
        
        <table class="data-table" id="">
            <colgroup>
                <col style="width: 75%;">
                <col style="width: 25%;">
            </colgroup>

            <thead>
                <tr>
                    <th>Name</th>
                    <th>Date</th>
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
        let html_user   = `
            <div>${cur_entry.requesting_user.name_first} ${cur_entry.requesting_user.name_last}</div>
            <div>${cur_entry.requesting_user.email}</div>
        `;
        
        let dt_request  = new Date(cur_entry.user_req.dt_entry);
        let s_dt_request= formatDate(dt_request, FORMAT_COMPACT) 
        
        const html = `
            <tr>
                <td>${html_user}</td>
                <td>${s_dt_request}</td>
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
                    thisObj.onClickRowEntry(cur_entry.user_req.hid);
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
            
        }
        return filtered;
    }
    
    
    this.getEntry = function(entry_hid){
        
        const data_list = dataRequestJoinAccList;
        
        for (const cur_entry of data_list){
            if (cur_entry.user_req.hid == entry_hid){
                return cur_entry;
            }
        }
        
        return null;
    }
    
    
    
    this.onClickRowEntry = function(entry_hid){
        const row_entry = thisObj.getEntry(entry_hid);

        if (row_entry){
            const go_back_page = navigation.currentPage;
        
            const options ={
                is_add:                 false,   // false is edit
                callback_after_edit:    thisObj.onSuccessEditEntry,
                go_back_page:           go_back_page
            }
            navigation.pageJoinAccReqApprove.beforeShow(options, row_entry);
            
            
            const goto_page_id   = PAGE_ID.JOIN_ACC_REQ_APPROVE;
            const page_container = navigation.getPageContainer(goto_page_id);
            navigation.showThisPage(page_container);
        }
        
    }
    
    
    
      
}
