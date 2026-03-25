// February 21, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {TableBasic}                 from '../../common/table_basic.js';


import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        SOW_STATUS_NAME}            from '../../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}             from '../../../utils.js';

import {getSowBoarReference}        from '../../common/common_app.js';


export function SowBoarTableSowWean(input_settings){
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
        uniqueKey:              'sow-boar'
    }   
    */  
    const settings              = input_settings;
    
    const elemDivContainer      = settings.elemDivContainer;
    
    
    let elemIdTableShow         = null;
    let elemIdTableBody         = null;
    
    
    let elemTableShow           = null;
    let elemTableBody           = null;
    
    
    this._writeInlineStyle = function(){
        const html = `
    <style>
        
        /* Updated Table Styles */
        
        .table-wean th  {
            padding-right:0;
            overflow-wrap: anywhere; /* Breaks anywhere if needed */
            word-break: break-word;
            white-space: normal;
        }
        
      </style>
    `;
        return html;
    }
    
    
    this.getHtml = function(){
        
        elemIdTableShow         = `${settings.uniqueKey}-sow-wean-show`;
        elemIdTableBody         = `${settings.uniqueKey}-sow-wean-tbody`;
        
        const html_style    = this._writeInlineStyle();
        
        
        const html = `
        ${html_style}
        
        <div id="${elemIdTableShow}">
            <table class="data-table table-wean">
                <colgroup>
                    <col style="width: 30%;">
                    <col style="width: 35%;">
                    <col style="width: 45%;">
                </colgroup>
      
                <thead>
                    <tr>
                        <th>Sow</th>
                        <th>Date Wean</th>
                        <th>Pig Operation</th>
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
        elemTableShow           = elemDivContainer.querySelector('#'+elemIdTableShow);
        elemTableBody           = elemDivContainer.querySelector('#'+elemIdTableBody);
    }
    
    
    this._processAfterHtmlRender= function(){}
    
    
    this._bindEventListeners= function(){}

    
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
        const html = `
            <tr>
                <td colspan="3"><div>No Entries</div></td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.getHtmlTableRow = function(cur_entry){
        // Sow Name column
        let sow_boar = cur_entry.sow_boar;
        let sow_reference = parentObj.getSowBoarReference(sow_boar);
        
        
        // Date Actual Wean
        const weaning       = sow_boar.cur_pig_production.weaning;
        const date_wean     = weaning.date_weaning;
        const dt_wean       = new Date(date_wean)
        const s_dt_wean     = formatDate(dt_wean, FORMAT_COMPACT); 
                    
        
        const html = `
        <tr>
            <td><span>${sow_reference}</span></td>
            <td>${s_dt_wean}</td>
            <td></td>
        </tr>
        `;
        
        return html;
    }
    
    
    this.getElemTableRow = function(cur_entry){
        const sow_boar = cur_entry.sow_boar;
        
        const elem_row = document.createElement('tr');
        
        const html = thisObj.getHtmlTableRow(cur_entry);
        elem_row.innerHTML = html;
         
        const pid = sow_boar.cur_pig_production.pig_production.farm_prod_id;
        
        // Attach onclick listeners to td
        
        const elem_tds = elem_row.querySelectorAll('td'); 
        
        let index = 0
        for (const cur_td of elem_tds){
        
            // Clicking on sow_name should goto Sow SowBoarEntry
            if (index == 0) {
                cur_td.onclick = function(){
                    parentObj.onClickSowBoarEntry(sow_boar.hid);
                }
            }
            
            
            if (index == 2){
                
            }
            
        
            index += 1;
        }
        
        return elem_row;
    }
    
    
} 
