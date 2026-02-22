// February 22, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {TableBasic}                 from '../../../common/table_basic.js';


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
        FORMAT_COMPACT,
        createPaginationManager}    from '../../../../utils.js';

import {getSowBoarReference}        from '../../../common/common_app.js';


export function ProdFeedBalanceBTable(input_settings){
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
    
    
    this.getHtml = function(){
        
        elemIdTableShow         = `${settings.uniqueKey}-prod-gross-sales-show`;
        elemIdTableBody         = `${settings.uniqueKey}-prod-gross-sales-tbody`;
        
        
        
        const html = `
        
        
        <div id="${elemIdTableShow}">
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
                        <th style="padding-left:0; text-align:center;">Grow</th>
                        <th style="padding-left:0; text-align:center;">Finish</th>
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
        const html = `
            <tr>
                <td colspan="5"><div>No Entries</div></td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.getHtmlTableRow = function(cur_entry){
        
        const html = `
        <tr>
            <td>${html_pid_sow}</td>
            <td>${num_pigs_wean}</td>
            <td style="padding-left:0; text-align:center;">${num_pigs_sold}</td>
            <td style="padding-left:0; text-align:center;">${s_total_sales}</td>
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
         

        
        // Attach onclick listeners to td
        
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
    


} 
