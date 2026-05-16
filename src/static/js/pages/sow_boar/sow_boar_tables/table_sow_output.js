// table_sow_output.js

// February 12, 2025
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


export function SowBoarTableSowOutput(input_settings){
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
    
    
    let htmlSowDueWarning       = null;
    
    
  
    
    this.getHtml = function(){
        
        elemIdTableShow         = `${settings.uniqueKey}-sow-output-show`;
        elemIdTableBody         = `${settings.uniqueKey}-sow-output-tbody`;
        
        
        const translations      = navigation.getTranslations();
        
        let label_sow           = 'Sow';
        
        let label_live_pigs_birth   = 'Live Pigs Birth';
        let label_dead_at_birth     = 'Dead at Birth';
        let label_dead_before_wean  = 'Dead before Wean';
        let label_live_pigs_wean    = 'Live Pigs Wean';
        
        
        
        
        if (translations){
            if (translations.common_app && translations.common_app.labels){
                const labels_common = translations.common_app.labels;
                
                if (labels_common) {
                    if(labels_common.sow)    {label_sow = labels_common.sow;}
                }
            }
            
            
            
            if (translations.page_sow_boar_list && 
                translations.page_sow_boar_list.labels){
                
                const labels_sow_boar_list = translations.page_sow_boar_list.labels;
                
                if (labels_sow_boar_list) {
                    if(labels_sow_boar_list.live_pigs_birth) {
                        label_live_pigs_birth = labels_sow_boar_list.live_pigs_birth;
                    }
                    
                    if(labels_sow_boar_list.dead_at_birth) {
                        label_dead_at_birth = labels_sow_boar_list.dead_at_birth;
                    }
                    
                    if(labels_sow_boar_list.dead_before_wean) {
                        label_dead_before_wean = labels_sow_boar_list.dead_before_wean;
                    }
                    
                    if(labels_sow_boar_list.live_pigs_wean) {
                        label_live_pigs_wean = labels_sow_boar_list.live_pigs_wean;
                    }
                }
            }
        }
        
        
        
        const html = `
        
        <div id="${elemIdTableShow}">
            <table class="data-table table-output" id="">
                <thead>
                    <colgroup>
                        <col style="width: 30%;">
                        <col style="width: 16%;">
                        <col style="width: 16%;">
                        <col style="width: 19%;">
                    </colgroup>
                    
                    
                    <tr>
                        <th>${label_sow}</th>
                        <th>${label_live_pigs_birth}</th>
                        <th>${label_dead_at_birth}</th>
                        <th>${label_dead_before_wean}</th>
                        <th>${label_live_pigs_wean}</th>
                    </tr>
                    
                </thead>
                
                <tbody id="${elemIdTableBody}">
                </tbody>
            </table>
            
            <div>Output at Wean (Number Birth)</div>
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
        let label_no_entries = thisObj.writeLabelNoEntries();
        
        if (label_no_entries){}
        else{label_no_entries = 'No Entries';}
        
        
        const html = `
            <tr>
                <td colspan="5"><div>${label_no_entries}</div></td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.getHtmlTableRow = function(cur_entry){
        const list_output = navigation.pigFarm.managerSowBoar.dataFarmPigletsOutput;
        
        
        let live_pigs_birth   = 0;
        let dead_at_birth     = 0;
        let live_pigs_wean    = 0;
        let dead_before_wean  = 0;
        
        const sow_boar = cur_entry.sow_boar;
        const sow_boar_hid = sow_boar.hid;
        
        
        
        if (list_output){
            for (const cur_output of list_output){
                if (cur_output.sow_hid == sow_boar_hid){
                    live_pigs_birth   = cur_output.num_pigs_live_m + cur_output.num_pigs_live_f ;
                    dead_at_birth     = cur_output.dead_at_birth;
                    live_pigs_wean    = cur_output.num_pigs_wean;
                    dead_before_wean  = cur_output.dead_before_wean;
                    
                    break;
                }
            }
        }
        
        let sow_reference = '';
    
    
        if (sow_boar.name  && sow_boar.name.length >0 ){
            sow_reference = `<span class="sow-boar-name">${sow_boar.name}</span>`;
            if (sow_boar.number && sow_boar.name.length >0){
                sow_reference += `<br>${sow_boar.number}`;
            }
        }
        else{
            sow_reference = `<span class="sow-boar-name">${sow_boar.number}</span>`;
        }
       
        
        const html = `
            <tr>
                <td class = "">${sow_reference}</td>
                <td class = "data-table-cell-no-padding">${live_pigs_birth}</td>
                <td class = "data-table-cell-no-padding">${dead_at_birth}</td>
                <td class = "data-table-cell-no-padding">${dead_before_wean}</td>
                <td class = "data-table-cell-no-padding">${live_pigs_wean}</td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.getElemTableRow = function(cur_entry){
        const sow_boar = cur_entry.sow_boar;
        
        const elem_row = document.createElement('tr');
        
        const html = thisObj.getHtmlTableRow(cur_entry);
        elem_row.innerHTML = html;
         

        
        // Attach onclick listeners to td
        
        const elem_tds = elem_row.querySelectorAll('td'); 
        
        let index = 0
        for (const cur_td of elem_tds){
            // Clicking on sow_name should goto SowBoarEntry
            if (index == 0){
                cur_td.onclick = function(){
                    parentObj.onClickSowBoarEntry(sow_boar.hid);
                }
            }
            
            else{
            
                // Clicking on sow_output should go to SowBoar entry page, 
                // Piglet Output Tab
                const tab_id_output = navigation.pageSowBoarEntry.elemIdTabOutput;
                
                cur_td.onclick = function(){
                    thisObj.onClickSowBoarEntry(sow_boar.hid, null, tab_id_output);
                }
            }
            
            index += 1;
        }
        
        return elem_row;
    }
    
    
} 
