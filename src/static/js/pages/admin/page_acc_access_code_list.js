// page_acc_access_code_list.js

// March 17, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageTableBasic}         from '../common/page_table_basic.js';


import {APPLICATION,
        PAGE_ID,
        HASH_ROUTES,
        ACC_USER_GROUP}         from '../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}         from '../../utils.js';

import {ComponentNavLeftRight}  from '../common/ui/comp_nav_left_right.js';



export function PageAccessCodeList(input_settings){
    PageTableBasic.call(this);
    
    const TAG                   = 'PageAccessCodeList';
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    this.setNavigation(navigation);
    
    
    /*
    Typical input_settings
    {
        navigation:             this,
        uniqueKey:              'prod-not-pregnant' 
        pageTitle:              'Not Pregnant'
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
    
    
    let dataAccessCodeList     = null;

    
    let searchIncludeInsem      = true;
    
    let dtCurrentDate           = null;


    
    this.init = function(){

        
        thisObj.setSettingsTable({
            uniqueKey:      settings.uniqueKey,
            noHeader:       true,
            itemsPerPage:   10
        });
        
        
        this.render();
        this.afterHtmlRender();
        
        this.afterHtmlRenderThis();
        
    }
    
    
    
    this.render = function(){
        
        componentNavLeftRight   = new ComponentNavLeftRight({
           uniqueKey:           settings.uniqueKey,
           elemDivContainer:    elemDivContainer,
           pageTitle:           'Access Codes'
        });
        
        
        elemIdPageInfo          = `${settings.uniqueKey}-page-info`;
        
        
        const html_nav          = componentNavLeftRight.getHtml();   
        const html_table        = thisObj.getHtml();
           

           
        const html = `

<div class="mobile-container">
    ${html_nav}

    <!-- Mobile Info Box -->
    <div class="mobile-info-box" style="margin-bottom:10px;">
        <div class="info-text" id="${elemIdPageInfo}">
            This is a list of access codes you can give to anyone you wish to share your farm data.
            This can be used by one person only. When an access code code is used,
            the User will be automatically added to your Account User list.
            You can revoke any code anytime to disable access.
            Just share this website and give the access code. 
            
            
            <p style="text-align: center; font-size: 1.1rem; font-weight: 700; margin-top: 1rem; word-break: break-word;">
                superpig.jsysdev.com
            </p>
            
            <div class="warning-box">
                Most likely you will share this link in Facebook Messenger App.
                For convenience and not to disrupt communications with your farm staff, 
                you can open the link in external browser. 
            </div>
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
            navigation.managerNavLinks.onClickNavUsers(null, true);
        };
        
          
        componentNavLeftRight.callbackNavRight = function(){
            navigation.managerNavLinks.onClickNavUsers(null, true);
        };
        
        
        componentNavLeftRight.bindEventListeners();

    }
    
    
    this._bindEventListenersThis = function(){
        
       
    }
    
    
    
    this.renderPage = function(page_data){
        thisObj.show();
    }
    
    
    
    this.show = function(){
        
        const callback_success = function(data){
            dataAccessCodeList = data;
            thisObj.renderTable(dataAccessCodeList);
        };


        navigation.pigFarm.accountLists.requestDataAccessCodeList(
            callback_success, null);
        
    }
    

    this._writeInlineStyle = function(){
        const html = `
        `;
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
        
        <table class="data-table table-prod-hist" id="">
            <colgroup>
                <col style="width: 33%;">
                <col style="width: 27%;">
                <col style="width: 40%;">
               
            </colgroup>

            <thead>
                <tr>
                    <th>Access Code</th>
                    <th>Role</th>
                    <th>Used By</th>
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
                <td colspan="3"><div>No Entries</div></td>
            </tr>
        `;
        return html;
    }
    

    this.getHtmlTableRow = function(cur_entry){
        const access_code   = cur_entry.access_code
        const code          = access_code.hid;
        let user_group    = '';
        
        let user_name_last  = '';
        let user_name_first  = '';
        
        if (access_code.used_by_user) {
            if (access_code.used_by_user.name_last){
                user_name_last = access_code.used_by_user.name_last;
            }
            
            if (access_code.used_by_user.name_first){
                user_name_first = access_code.used_by_user.name_first;
            }

        }
        
        const used_by       = `${user_name_first} ${user_name_last}`;
        
        
        switch (cur_entry.access_code.user_group.number) {
            case ACC_USER_GROUP.ADMIN:
                user_group= 'Admin';
                break;
                
            case ACC_USER_GROUP.MANAGEMENT:
                user_group= 'Management';
                break;
                
            case ACC_USER_GROUP.OPERATIONS:
                user_group= 'Operations';
                break;

                
            default:
                break;
        }
        
        
        
        const html = `
            <tr>
                <td>${code}</td>
                <td>${user_group}</td>
                <td>${used_by}</td>
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
    
    
    this.searchEntries = function(key){
        let data_list = dataAccessCodeList;
        
        
        
        const filtered = [];
        for (const cur_entry of data_list){
            
        } 
        
        
        return data_list;
    }
    
    
    this.getPageIdAddEditPage = function(){
        return PAGE_ID.ACCESS_CODE_ADD_EDIT;}
    
    
    this.getPageIdListPage = function(){
        return PAGE_ID.ACCESS_CODE_LIST;}
    
    
    // Should return a reference to a function that has this signature:
    // func_name(options, row_entry);
    this.getFuncAddEditShowPage = function(){
        return navigation.pageAccessCodeAddEdit.show;}
    
    
    this.getHashRouteAddEditPage = function(){
        return HASH_ROUTES.ACCESS_CODE_ADD_EDIT;
    }
    
    
    this.getHashRouteListPage = function(){
        return HASH_ROUTES.ACCESS_CODE_LIST;
    }
  
  
    this.getRowEntryHashId = function(row_entry){
        if (!row_entry){return null;}
        return row_entry.access_code.hid;
    }
    
    
}
