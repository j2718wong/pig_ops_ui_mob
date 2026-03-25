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
        FORMAT_COMPACT}     from '../../../utils.js';

import {getSowBoarReference}        from '../../common/common_app.js';


export function SowBoarTableSowGesta(input_settings){
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
        
        elemIdTableShow         = `${settings.uniqueKey}-sow-gesta-show`;
        elemIdTableBody         = `${settings.uniqueKey}-sow-gesta-tbody`;
        

        const translations      = navigation.getTranslations();
        

        let label_sow           = 'Sow';
        let label_last_mate     = 'Last Mate';
        let label_expected      = 'Expected';
        
        
        
        if (translations){
            if (translations.common_app && translations.common_app.labels){
                const labels_common = translations.common_app.labels;
                
                if (labels_common) {
                    if(labels_common.sow)   {label_sow = labels_common.sow;}
                }
            }
            
            
            
            if (translations.page_sow_boar_list && 
                translations.page_sow_boar_list.labels){
                
                const labels_sow_boar_list = translations.page_sow_boar_list.labels;
                
                if (labels_sow_boar_list) {
                    if(labels_sow_boar_list.last_mate) {
                        label_last_mate = labels_sow_boar_list.last_mate;
                    }
                    
                    if(labels_sow_boar_list.expected) {
                        label_expected = labels_sow_boar_list.expected;
                    }
                }
            }
        }
        
        
        
        const html = `
        
        <div id="${elemIdTableShow}">
            
            <table class="data-table table-sow">
                <colgroup>
                    <col style="width: 30%;">
                    <col style="width: 35%;">
                    <col style="width: 35%;">
                </colgroup>
      
                <thead>
                    <tr>
                        <th>${label_sow}</th>
                        <th>${label_last_mate}</th>
                        <th>${label_expected}</th>
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
        let label_no_entries = thisObj.writeLabelNoEntries();
        
        if (label_no_entries){}
        else{label_no_entries = 'No Entries';}
        
        const html = `
            <tr>
                <td colspan="3"><div>label_no_entries</div></td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.getHtmlTableRow = function(cur_entry){
        // Sow Name column
        let sow_boar = cur_entry.sow_boar;
        let sow_reference = parentObj.getSowBoarReference(sow_boar);
        
        
        // Last Mate
        const cur_pig_production = sow_boar.cur_pig_production;
        const insemination = cur_pig_production.insemination;
        const insem_type = insemination.insem_type;
        
        let s_last_mate = '';
        
        switch(insem_type){
            case 'B': {
                const insem_boar = insemination.boar;
                s_last_mate = parentObj.getSowBoarReference(insem_boar);
                
                if (insem_boar.is_external){
                    s_last_mate += ' (External)';
                }
                
                break;
            }
            
            case 'AI_X': {
                s_last_mate = insemination.ai.semen_supplier.semen.name;
                s_last_mate += ` (${insemination.ai.semen_supplier.name})`
                break;
            }
            
            case 'AI_N': {
                const internal_boar = insemination.ai.internal_boar;
                s_last_mate = parentObj.getSowBoarReference(internal_boar);
                s_last_mate += `<span class="no-wrap"> (via AI)</span>`; 
                break;
            }
        }
        
        
        // Date Expected
        const date_expected = sow_boar.cur_pig_production.birth.date_expected;
        
        const acc_settings_ops  = navigation.pigFarm.getSettingsOperations();
        
        
        // Set important date; 
        // gesta: expected date of birth 
        let s_date_important = ''
        let dt_important = new Date(date_expected);
        let dt_important_s = formatDate(dt_important, FORMAT_COMPACT);
        
        let diff_days = parentObj.calculateNumDaysSinceInsem(
                    sow_boar.cur_pig_production.insemination.insem_date, 
                    parentObj.dtCurrentDate,
                    acc_settings_ops);
                    
        s_date_important = `${dt_important_s} <span class="nowrap">(Day ${diff_days}</span>)`;
        
        
        
        const html = `
        <tr>
            <td><span>${sow_reference}</span></td>
            <td>${s_last_mate}</td>
            <td>${s_date_important}</td>
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
