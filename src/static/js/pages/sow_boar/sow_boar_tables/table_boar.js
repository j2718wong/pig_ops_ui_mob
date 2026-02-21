// February 13, 2025
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
        FORMAT_COMPACT,
        createPaginationManager}    from '../../../utils.js';

import {getSowBoarReference}        from '../../common/common_app.js';


export function SowBoarTableBoar(input_settings){
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
        
        elemIdTableShow         = `${settings.uniqueKey}-boar-table`;
        elemIdTableBody         = `${settings.uniqueKey}-boar-tbody`;
        
        
        const html = `
        
        <div id="${elemIdTableShow}">
            <table class="data-table table-boar" >
                <colgroup>
                    <col style="width: 30%;">
                    <col style="width: 25%;">
                    <col style="width: 16%;">
                    
                </colgroup>
                
                <thead>
                    <tr>
                        <th>Boar</th>
                        <th>Age</th>
                        <th style="padding-left:0;">Mates</th>
                        <th style="padding-left:0;">Last Mate</th>
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
        let sow_boar = cur_entry.sow_boar;        
        
        let sow_reference = '';
    
        
        // Boar Name column
        let not_ready   = '';
        let external    = '';
        let boar_name   = '';
        
        if (sow_boar.is_production_ready == 0){
            not_ready = '<span class="data-table-cell-detail"> Not Ready</span>';
        }
        
        if (sow_boar.is_external && sow_boar.is_external > 0){
            external = '<span class="data-table-cell-detail"> (External)</span>';
        }
            
        boar_name = getSowBoarReference(sow_boar);
    
        sow_reference = `<span class="sow-boar-name">${boar_name} ${not_ready} ${external}</span>`;
        
        
        // Boar Age column
        let s_age = parentObj.getSowBoarAge(sow_boar);
        
        
        let s_last_mate = '';
        if (sow_boar.date_last_mate){
            const dt_mate = new Date(sow_boar.date_last_mate);
            s_last_mate = formatDate(dt_mate, FORMAT_COMPACT);
        }
        
        let mate_count =  sow_boar.mate_count;
        
        const html = `
            <tr>
                <td>${sow_reference}</td>
                <td>${s_age}</td>
                <td style="padding-left:0;">${mate_count}</td>
                <td style="padding-left:0;">${s_last_mate}</td>
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
            // Clicking on boar_name should goto SowBoarEntry
            if (index == 0 || index == 1){
                cur_td.onclick = function(){
                    parentObj.onClickSowBoarEntry(sow_boar.hid);
                }
            }
            
            
            // Clicking on boar number of mates and last Mate should goto 
            // SowBoarEntry Mates Tab
            if (index == 2 || index == 3) {
            
                // Clicking on sow_output should go to SowBoar entry page, 
                // Piglet Output Tab
                const tab_id_output = navigation.pageSowBoarEntry.elemIdTabMates;
                
                cur_td.onclick = function(){
                    parentObj.onClickSowBoarEntry(sow_boar.hid, null, tab_id_output);
                }
            }
            
            index += 1;
        }
        
        return elem_row;
    }
    
    
} 
