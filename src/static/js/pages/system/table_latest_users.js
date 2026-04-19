// February 13, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageTableBasic}             from '../common/page_table_basic.js';


import {APPLICATION,
        PAGE_ID}                    from '../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}             from '../../utils.js';




export function TableLatestUsers(input_settings){
    PageTableBasic.call(this);
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    const navigation            = input_settings.navigation;
    
    /*
    Typical input_settings
    {
        navigation:             this,
        parentObj:              parentObj,
        elemDivContainer:       null,
        uniqueKey:              'sow-boar'
    }   
    */  
    const settings              = input_settings;
    
    const elemDivContainer      = settings.elemDivContainer;
    
    
    let elemIdTableBody         = null;
    

    let elemTableBody           = null;
    
    
    
    this.getHtml = function(){
        
        elemIdTableBody         = `${settings.uniqueKey}-latest-users-tbody`;
  
      
        const html = `
        
        <div style = "margin-top:10px">
            <h2 class="tab-title">
                Latest Users
            </h2>
        
            <table class="data-table" id="">
                <colgroup>
                    <col style="width: 70%;">
                    <col style="width: 40%;">
                </colgroup>

                <thead>
                    <tr>
                        <th>User</th>
                        <th>Date Entry</th>
                    </tr>
                </thead>
                
                
                <tbody id="${elemIdTableBody}">
                </tbody>
            </table>
        
        </div>
        `;
        
        return html;
    }
    
    
    this._findElements = function(){
        elemTableBody           = elemDivContainer.querySelector('#'+elemIdTableBody);
        
    }
    
    
    this._processAfterHtmlRender= function(){}
    
    
    this._bindEventListeners= function(){}

    
    this.getElemTableBody = function(){
        return elemTableBody;
    }
    
    
    this.show = function(){
        const callback_success = function(data){
            thisObj.renderTable(data);
        };
        
        navigation.managerSystem.requestLatestUsers(callback_success);
    }
    



    
    this.getHtmlTableRowEmpty = function(){
        let label_no_entries = thisObj.writeLabelNoEntries();
        
        if (label_no_entries){}
        else{label_no_entries = 'No Entries';}
        
        
        const html = `
            <tr>
                <td colspan="2"><div>${label_no_entries}</div></td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.getHtmlTableRow = function(cur_entry){
        let user_name = `${cur_entry.name_first} ${cur_entry.name_last}`;
        let user_email = cur_entry.email;
        let html_user = `
            <div>${user_name}</div>
            <div style="color:blue;">${user_email}</div>
        `;
        
        
        const html = `
            <tr>
                <td>${html_user}</td>
                <td>${cur_entry.dt_entry}</td>
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

            if (index == 0 || index == 1){
                
            }
            
            
           
            index += 1;
        }
        
        return elem_row;
    }
    
    
} 
