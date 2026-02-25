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
    
    let elemIdNavPrevEntry      = null;
    let elemIdNavNextEntry      = null;

    let elemIdPageTitle         = null;
    let elemIdPageHeaderAlarm   = null;
    let elemIdEntryCount        = null;
    let elemIdPageInfo          = null;
    
    let elemIdTableBody         = null;
    

    let elemNavPrevEntry        = null;
    let elemNavNextEntry        = null;

    let elemPageTitle           = null;
    let elemPageHeaderAlarm     = null;
    let elemEntryCount          = null;
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
        elemIdNavPrevEntry      = `${settings.uniqueKey}-page-title-prev`;
        elemIdNavNextEntry      = `${settings.uniqueKey}-page-title-next`;
        
        elemIdPageTitle         = `${settings.uniqueKey}-page-title-list`;
        elemIdPageHeaderAlarm   = `${settings.uniqueKey}-page-title-alarm`;
        elemIdEntryCount        = `${settings.uniqueKey}-page-title-entry-count`;
        elemIdPageInfo          = `${settings.uniqueKey}-page-info-list`;
        
           
        const html_table        = thisObj.getHtml();
           

           
        const html = `

<div class="mobile-container">
    <div class="nav-left-right">
        <button class="nav-button blue" id="${elemIdNavPrevEntry}"><i class="fa-solid fa-arrow-left"></i></button>
            
        <span>
            <span class="nav-title blue" id="${elemIdEntryCount}"></span>
            <span class="nav-title blue" id="${elemIdPageTitle}" style="margin-right:8px;">User List</span>
        </span>
        
        <button class="nav-button blue" id="${elemIdNavNextEntry}"><i class="fa-solid fa-arrow-right"></i></button>
            
    </div>
    
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
        this._findElementsThis();
        this._processAfterHtmlRenderThis();
        this._bindEventListenersThis();
    }
    
    
    this._findElementsThis = function(){
        elemNavPrevEntry        = elemDivContainer.querySelector('#'+elemIdNavPrevEntry);
        elemNavNextEntry        = elemDivContainer.querySelector('#'+elemIdNavNextEntry);
        
        elemPageTitle           = elemDivContainer.querySelector('#'+elemIdPageTitle);
        elemPageHeaderAlarm     = elemDivContainer.querySelector('#'+elemIdPageHeaderAlarm);
        elemEntryCount          = elemDivContainer.querySelector('#'+elemIdEntryCount);
        elemPageInfo            = elemDivContainer.querySelector('#'+elemIdPageInfo);
        
        
        elemTableBody           = elemDivContainer.querySelector('#'+elemIdTableBody);

    }
    
    
    this._processAfterHtmlRenderThis = function(){
        
    
        
    }
    
    
    this._bindEventListenersThis = function(){
        
        elemPageTitle.addEventListener('click', function() {

        });
        
     

        
        // Set up listeners for navigation arrows
        elemNavPrevEntry.onclick = function(){
           
        };

        elemNavNextEntry.onclick = function(){
            
        };
        
             
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
    
    
    this.show = function(){
        dataUserList  = navigation.pigFarm.accountLists.dataUserList;

        if (dataUserList == null){
        
            const callback_success = function(data){
                dataUserList  = navigation.pigFarm.accountLists.dataUserList;
                thisObj.renderTable(dataUserList);
            };
            
            // Request User List
            navigation.pigFarm.accountLists.requestDataUserList(
                callback_success, null);
        
        }
        else{
            dataUserList  = navigation.pigFarm.accountLists.dataUserList;
            thisObj.renderTable(dataUserList);
        }
        
        
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
                <col style="width: 50%;">
                <col style="width: 50%;">
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
        
        
        const html = `
            <tr>
                <td>${user_name}</td>
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
            
        }
        return filtered;
    }
    
    
    
    
    this.onClickPageHeaderTitle = function(){
        
        
    }
    
    
    
      
}
