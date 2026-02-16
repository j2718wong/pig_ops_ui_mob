// February 12, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {SowBoarTableBasic}          from './sow_boar_table_basic.js';


import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        SOW_STATUS_NAME}            from '../../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        createPaginationManager}    from '../../../utils.js';

import {getSowBoarReference}        from '../../common/common_app.js';


export function SowBoarTableSowLacta(input_settings){
    SowBoarTableBasic.call(this, input_settings);
    
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
    
    
    const DEFAULT_NUM_DAYS_WEAN = 45;
    
    
    let elemIdTableShow         = null;
    let elemIdTableBody         = null;
    
    
    let elemTableShow           = null;
    let elemTableBody           = null;
    
    
    this._writeInlineStyle = function(){
        const html = `
    <style>
        
        /* Updated Table Styles */
        
        .table-lacta th  {
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
        
        elemIdTableShow         = `${settings.uniqueKey}-sow-lacta-show`;
        elemIdTableBody         = `${settings.uniqueKey}-sow-lacta-tbody`;
        
        const html_style    = this._writeInlineStyle();
        
        
        const html = `
        ${html_style}
        
        <div id="${elemIdTableShow}">
            <table class="data-table table-lacta">
                <colgroup>
                    <col style="width: 30%;">
                    <col style="width: 30%;">
                    <col style="width: 20%;">
                </colgroup>
      
                <thead>
                    <tr>
                        <th>Sow</th>
                        <th>Target Date Wean</th>
                        <th style="text-align:center;">Num Piglets</th>
                        <th>Dead after Birth</th>
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
                <td colspan="4"><div>No Entries</div></td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.getHtmlTableRow = function(cur_entry){
        // Sow Name column
        let sow_boar = cur_entry.sow_boar;
        let sow_reference = parentObj.getSowBoarReference(sow_boar);
        
        
        
        
        // Date Expected Wean
        const pig_production    = sow_boar.cur_pig_production.pig_production;
        const birth             = sow_boar.cur_pig_production.birth;
        const date_actual_birth = birth.date_actual;
        
        
        const acc_settings_ops  = navigation.pigFarm.getSettingsOperations();
        
        // Set important date; 
        // lacta: expected date wean 
        const dt_actual = new Date(date_actual_birth);
            
        let num_days_wean = DEFAULT_NUM_DAYS_WEAN;
        
        // check if the account has set num_days_wean
        if (acc_settings_ops){
            num_days_wean = acc_settings_ops.num_days_wean;
            
            // Adjust Day 1 on date of birth if needed
            if (acc_settings_ops.day_1_on_date_of_birth > 0){
                num_days_wean -= 1;
            }
        }
        
        let msecs_wean = dt_actual.getTime() + num_days_wean * APPLICATION.NUM_MSECS_1DAY;
        let dt_wean = new Date(msecs_wean);
        
        let dt_important    = dt_wean;
        let dt_important_s  = formatDate(dt_important, FORMAT_COMPACT);
        
        
        
        let diff_days = parentObj.calculateNumDaysSinceBirth(
                    date_actual_birth, 
                    parentObj.dtCurrentDate,
                    acc_settings_ops);
                    
        let s_date_important = `${dt_important_s} (Day ${diff_days})`;
        
        
        // Current number of pigs
        const cur_pig_count = pig_production.cur_pig_count;
        
        // Compute num_pigs dead after birth
        
        
        
        const num_live_pigs = birth.pigs_live_m + birth.pigs_live_f;
        const num_dead_after_birth = num_live_pigs - cur_pig_count;    
    
        let s_dead = '';
        if (num_dead_after_birth > 0){s_dead = `${num_dead_after_birth}`;} 
        
        const html = `
        <tr>
            <td><span>${sow_reference}</span></td>
            <td>${s_date_important}</td>
            <td style="text-align:center;">${cur_pig_count}</td>
            <td>${s_dead}</td>
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
                // Goto GestaEntry Page
                cur_td.onclick = function(){
                    navigation.onClickProdGestatingEntry(pid);
                };
            }
            
        
            index += 1;
        }
        
        return elem_row;
    }
    
    
} 
