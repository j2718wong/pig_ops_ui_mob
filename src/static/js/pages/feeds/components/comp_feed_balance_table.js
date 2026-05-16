// comp_feed_balance_table.js

// February 22, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';



import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        SOW_STATUS_NAME,
        HARVEST_TYPE}               from '../../../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}             from '../../../../utils.js';

import {getSowBoarReference}        from '../../../common/common_app.js';


import {FEED_BALANCE_COLS}          from './comp_feed_balance.js';



export function ComponentFeedBalanceTable(input_settings){
    TableBasic.call(this, input_settings);
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    const navigation            = input_settings.navigation;
    
    /*
    Typical input_settings
    {
        navigation:             this,
        parentObj:              parentObj,
        elemDivContainer:       null,
        uniqueKey:              'sow-boar',
        feedBalanceCols:        FEED_BALANCE_COLS.AFTER_PRESTART
         
    }   
    */  
    const settings              = input_settings;
    
    const elemDivContainer      = settings.elemDivContainer;
    
    
    let elemIdTableShow         = null;
    let elemIdTableBody         = null;
    
    
    let elemTableShow           = null;
    let elemTableBody           = null;
    
    
    
    
    
    this.getHtml = function(){
        
        elemIdTableShow         = `${settings.uniqueKey}-prod-gross-sales-show`;
        elemIdTableBody         = `${settings.uniqueKey}-prod-gross-sales-tbody`;
        
        
        const table_before_starter = `
            <table class="data-table">
                <colgroup>
                    <col style="width: 20%;">
                    <col style="width: 20%;">
                    <col style="width: 20%;">
                    <col style="width: 20%;">
                    <col style="width: 20%;">
                </colgroup>
      
                <thead>
                    <tr>
                        <th>PID</th>
                        <th style="padding-left:0; text-align:center;">Gesta</th>
                        <th style="padding-left:0; text-align:center;">Lacta</th>
                        <th style="padding-left:0; text-align:center;">Boost</th>
                        <th style="padding-left:0; text-align:center;">Pres</th>
                    </tr>
                </thead>
                
                <tbody id="${elemIdTableBody}">
                </tbody>
            </table>
        `;
        
        
        const table_after_prestart = `
            <table class="data-table table-prod-hist">
                <colgroup>
                    <col style="width: 19%;">
                    <col style="width: 27%;">
                    <col style="width: 27%;">
                    <col style="width: 27%;">
                </colgroup>
      
                <thead>
                    <tr>
                        <th>PID</th>
                        <th style="padding-left:0; text-align:center;">Start</th>
                        <th style="padding-left:0; text-align:center;">Grower</th>
                        <th style="padding-left:0; text-align:center;">Finish</th>
                    </tr>
                </thead>
                
                <tbody id="${elemIdTableBody}">
                </tbody>
            </table>
        `;
        
        
        
        const table_all = `
            <table class="data-table table-prod-hist">
                
                <thead>
                    <tr>
                        <th>PID</th>
                        <th style="padding-left:0; text-align:center;">Gesta</th>
                        <th style="padding-left:0; text-align:center;">Lacta</th>
                        <th style="padding-left:0; text-align:center;">Boost</th>
                        <th style="padding-left:0; text-align:center;">Pres</th>
                        <th style="padding-left:0; text-align:center;">Start</th>
                        <th style="padding-left:0; text-align:center;">Grower</th>
                        <th style="padding-left:0; text-align:center;">Finish</th>
                    </tr>
                </thead>
                
                <tbody id="${elemIdTableBody}">
                </tbody>
            </table>
        `;
        
        
        let html_table;
        
        switch (settings.feedBalanceCols){
            case FEED_BALANCE_COLS.ALL:{
                html_table = table_all; 
                break;
            }
            
            case FEED_BALANCE_COLS.BEFORE_STARTER:{
                html_table = table_before_starter; 
                break;
            }
            
            case FEED_BALANCE_COLS.AFTER_PRESTART:{
                html_table = table_after_prestart; 
                break;
            }
            
            default:{
                html_table = table_all; 
                break;
            }
            
        }
        
        
        const html = `
        <div id="${elemIdTableShow}">
            ${html_table}
        </div>
        `;
        
        return html;
    }
    
    
    

    this._findElements = function(){
        elemTableShow           = elemDivContainer.querySelector('#'+elemIdTableShow);
        elemTableBody           = elemDivContainer.querySelector('#'+elemIdTableBody);
    }
    
    
    this._processAfterHtmlRender = function(){}
    
    
    this._bindEventListeners = function(){}


    this.getElemTableBody = function(){
        return elemTableBody;
    }
    
    
    this.show = function(){
        elemTableShow.style.display = 'block';
    }
    
    
    this.hide = function(){
        elemTableShow.style.display = 'none';
    }
    
    
    this.getHtmlTableRowEmpty = function(){
        let num_cols = 4;
        
        switch (settings.feedBalanceCols){
            case FEED_BALANCE_COLS.ALL:{
                num_cols = 7; 
                break;
            }
            
            case FEED_BALANCE_COLS.BEFORE_STARTER:{
                num_cols = 4; 
                break;
            }
            
            case FEED_BALANCE_COLS.AFTER_PRESTART:{
                num_cols = 3; 
                break;
            }
            
            default:{
                num_cols = 7; 
                break;
            }
            
        }
        
        
        
        const html = `
            <tr>
                <td colspan="${num_cols}"><div>No Entries</div></td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.getHtmlTableRow = function(cur_entry){
        
        let html_pid_sow = '';
        if (cur_entry.pig_prod){
            html_pid_sow = parentObj.farmPage.getHtmlPidSowLoveBoar(cur_entry.pig_prod);
        }
        else{
            html_pid_sow = 'Non Prod';
        }
        
        
        const tr_before_starter = `
        <tr>
            <td style="background-color: #f5f5f5; border: 1px solid #ccc;">${html_pid_sow}</td>
            
            <td style="border: 1px solid #ccc; padding: 0;">
                <input type="number" style="width: 100%; padding: 4px; border: none; outline: none; -moz-appearance: textfield;" step="any">
            </td>
            
            <td style="border: 1px solid #ccc; padding: 0;">
                <input type="number" style="width: 100%; padding: 4px; border: none; outline: none; -moz-appearance: textfield;" step="any">
            </td>
            
            <td style="border: 1px solid #ccc; padding: 0;">
                <input type="number" style="width: 100%; padding: 4px; border: none; outline: none; -moz-appearance: textfield;" step="any">
            </td>
            
            <td style="border: 1px solid #ccc; padding: 0;">
                <input type="number" style="width: 100%; padding: 4px; border: none; outline: none; -moz-appearance: textfield;" step="any">
            </td>
            
        </tr>
        `;
        
         
        
        const tr_after_prestart = `
        <tr>
            <td style="background-color: #f5f5f5; border: 1px solid #ccc;">${html_pid_sow}</td>
            
            <td style="border: 1px solid #ccc; padding: 0;">
                <input type="number" style="width: 100%; padding: 4px; border: none; outline: none; -moz-appearance: textfield;" step="any">
            </td>
            
            <td style="border: 1px solid #ccc; padding: 0;">
                <input type="number" style="width: 100%; padding: 4px; border: none; outline: none; -moz-appearance: textfield;" step="any">
            </td>
            
            <td style="border: 1px solid #ccc; padding: 0;">
                <input type="number" style="width: 100%; padding: 4px; border: none; outline: none; -moz-appearance: textfield;" step="any">
            </td>
        </tr>
        `;
        
        
        const tr_after_all = `
        <tr>
            <td style="background-color: #f5f5f5; border: 1px solid #ccc;">${html_pid_sow}</td>
            
            <td style="border: 1px solid #ccc; padding: 0;">
                <input type="number" style="width: 100%; padding: 4px; border: none; outline: none; -moz-appearance: textfield;" step="any">
            </td>
            
            <td style="border: 1px solid #ccc; padding: 0;">
                <input type="number" style="width: 100%; padding: 4px; border: none; outline: none; -moz-appearance: textfield;" step="any">
            </td>
            
            <td style="border: 1px solid #ccc; padding: 0;">
                <input type="number" style="width: 100%; padding: 4px; border: none; outline: none; -moz-appearance: textfield;" step="any">
            </td>
            
            <td style="border: 1px solid #ccc; padding: 0;">
                <input type="number" style="width: 100%; padding: 4px; border: none; outline: none; -moz-appearance: textfield;" step="any">
            </td>
            
            <td style="border: 1px solid #ccc; padding: 0;">
                <input type="number" style="width: 100%; padding: 4px; border: none; outline: none; -moz-appearance: textfield;" step="any">
            </td>
            
            <td style="border: 1px solid #ccc; padding: 0;">
                <input type="number" style="width: 100%; padding: 4px; border: none; outline: none; -moz-appearance: textfield;" step="any">
            </td>
            
            <td style="border: 1px solid #ccc; padding: 0;">
                <input type="number" style="width: 100%; padding: 4px; border: none; outline: none; -moz-appearance: textfield;" step="any">
            </td>
            
        </tr>
        `;

        
        return html;
    }
    
    
    this.getElemTableRow = function(cur_entry){
        const pig_prod  = cur_entry.pig_production;
        const pid       = pig_prod.farm_prod_id; 
        
        const elem_row = document.createElement('tr');
        
        const html = thisObj.getHtmlTableRow(cur_entry);
        elem_row.innerHTML = html;
         

        

        
        const elem_tds = elem_row.querySelectorAll('td'); 
        
        let index = 0
        for (const cur_td of elem_tds){
        

            if (index == 0 || index== 1) {
                cur_td.onclick = function(){
                    parentObj.onClickProdHistEntry(pid);
                }
            }
            
            
            
            if (index == 3){
            }
        
        
        
            index += 1;
        }
        
        return elem_row;
    }
    
    
    this.beforeShow = function(){
        
    
    }

} 
