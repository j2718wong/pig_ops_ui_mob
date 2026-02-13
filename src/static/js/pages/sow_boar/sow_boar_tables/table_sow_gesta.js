// February 12, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

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


export function SowBoarTableSowGesta(input_settings){
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
    
    
    let elemIdTableSowGesta     = null;
    let elemIdTableSowGestaBody = null;
    
    
    let elemTableSowGesta       = null;
    let elemTableSowGestaBody   = null;
    
    
    
    this.getHtml = function(){
        
        elemIdTableSowGesta       = `${settings.uniqueKey}-sow-gesta-table`;
        elemIdTableSowGestaBody   = `${settings.uniqueKey}-sow-gesta-tbody`;
        
        
        const html = `
        <!-- Table Sow Gesta-->
        <div id="${elemIdTableSowGesta}">
            <table class="data-table table-sow">
                <colgroup>
                    <col style="width: 30%;">
                    <col style="width: 25%;">
                    <col style="width: 25%;">
                    <col style="width: 20%;">
                </colgroup>
      
                <thead>
                    <tr>
                        <th>Sow</th>
                        <th>Last Mate</th>
                        <th>Expected</th>
                        <th>Age</th>
                    </tr>
                </thead>
                
                <tbody id="${elemIdTableSowGestaBody}">
                </tbody>
            </table>
            
            <div>Output at Wean (Number Birth)</div>
        </div>
        `;
        
        return html;
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemTableSowGesta         = elemDivContainer.querySelector('#'+elemIdTableSowGesta);
        elemTableSowGestaBody     = elemDivContainer.querySelector('#'+elemIdTableSowGestaBody);
    }
    
    
    this._processAfterHtmlRender= function(){}
    
    
    this._bindEventListeners= function(){}

    
    
    
    this.renderSowTable = function(data_list){
        
        const config = {
            elemPagination:     parentObj.elemTablePagination,
            elemTableBody:      elemTableSowGestaBody,
            elemEntryCount:     parentObj.elemTableRowCount,
            elemCurrentPage:    parentObj.elemTableCurPage,
            elemTotalPages:     parentObj.elemTableTotalPages,
            elemPrevPageBtn:    parentObj.elemTablePrevPage,
            elemNextPageBtn:    parentObj.elemTableNextPage,
            data:               data_list,
            itemsPerPage:       parentObj.TABLE_ROW_PER_PAGE,
            
            renderRow:          thisObj.getHtmlTableRowSow,
            renderRowEmpty:     thisObj.getHtmlTableRowSowEmpty,
            getRowElement:      thisObj.getElemTableRowSow
        } 
        
        const paginationManager = new createPaginationManager(config); 
        paginationManager.init();
        
        // One event handler at a time
        elemTablePrevPage.onclick = function(){
            paginationManager.goToPrevPage();
        }
        
        // One event handler at a time
        elemTableNextPage.onclick = function(){
            paginationManager.goToNextPage();
        }
        
    }
    
    
    this.getHtmlTableRowSowEmpty = function(){
        const html = `
            <tr>
                <td colspan="4"><div>No Entries</div></td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.getHtmlTableRowSow = function(cur_entry){
        
        // Sow Name column
        let sow_boar = cur_entry.sow_boar;
        let sow_reference = parentObj.getSowBoarReference(sow_boar);
        
        
        
        // Sow Age column
        let s_age = parentObj.getSowBoarAge(sow_boar);
        
        
        
        // Sow Status
        
        // This is declared at top level so that can be read in 
        // this.getElemTableRowSow 
        htmlSowDueWarning = null;
        
        
        if (sow_boar.status_id == SOW_STATUS.GESTATING){
            if ('date_expected_birth' in sow_boar){
                const date_expected_birth   = sow_boar.date_expected_birth;
                const dt_expected_birth     = new Date(date_expected_birth);
                
                const diff_msecs    = dt_expected_birth - dtCurrentDate;
                const diff_days     = Math.round(diff_msecs / NUM_MSECS_1DAY);
                
                if ((diff_days >= 3) && (diff_days <= 7)) {
                    htmlSowDueWarning = `<span class="due-soon">Due ${diff_days} Days</span>`;
                } 
                
                if ((diff_days == 1) || (diff_days == 2)) {
                    htmlSowDueWarning = `<span class="due-soon">Due Soon</span>`;
                } 
                
                if (diff_days == 0) {
                    htmlSowDueWarning = `<span class="due-soon">Due Today</span>`;
                }
                
                if (diff_days < 0) {
                    htmlSowDueWarning = `<span class="due-soon">Overdue</span>`;
                }
            }
        }
        
        
        let s_status = SOW_STATUS_NAME[sow_boar.status_id];
            
        switch (sow_boar.status_id){
            case SOW_STATUS.GROWING:    {break;}
            case SOW_STATUS.GESTATING:  {
                
                if (htmlSowDueWarning){
                    s_status = `<span class="due-soon">${s_status}</span>`;
                    s_status += '<br>' + htmlSowDueWarning;
                } else{
                    s_status = `<span>${s_status}</span>`;
                    
                }
                        
                break;
            }
            
            case SOW_STATUS.LACTATING:  {
                s_status = `<span>${s_status}</span>`;
                break;
            }
            
            case SOW_STATUS.WEANING:    {
                s_status = `<span>${s_status}</span>`;
                break;
            }
        }
    
        
        
        
        // Sow Num piglets column
        let s_num_piglets = ''
        let num_pigs_wean = 0;
        
        if (sow_boar.num_pigs_wean){
            num_pigs_wean = sow_boar.num_pigs_wean;
        }
        
        if (num_pigs_wean > 0){
            s_num_piglets = `${num_pigs_wean} (${sow_boar.num_births}B)`;
        }
        
        
        
        let html = `
        <tr>
            <td><span>${sow_reference}</span></td>
            <td>${s_status}</td>
            <td>${s_age}</td>
            <td>${s_num_piglets}</td>
        </tr>
        `;
        
        return html;
    }
    
    
    this.getElemTableRowSow = function(cur_entry){
        let sow_boar = cur_entry.sow_boar;
        
        const elem_row = document.createElement('tr');
        
        const html = thisObj.getHtmlTableRowSow(cur_entry);
        elem_row.innerHTML = html;
         

        
        // Attach onclick listeners to td
        
        const elem_tds = elem_row.querySelectorAll('td'); 
        
        let index = 0
        for (const cur_td of elem_tds){
        
            // Clicking on sow_name should goto SowBoarEntry
            if (index == 0) {
                cur_td.onclick = function(){
                    thisObj.onClickSowBoarEntry(sow_boar.hid);
                }
            }
            
            
            // Clicking on sow_status should do this:
            // if SOW_STATUS.GESTATING 
            //      if there is due warning, should go to GestatingEntry page
            //      if no due warning, should go GestatingList page
            //
            // if SOW_STATUS.LACTATING
            //      should go to LactatingEntry page
            if (index == 1){
            
                switch (sow_boar.status_id){
                    case SOW_STATUS.GROWING:    {break;}
                    case SOW_STATUS.GESTATING:  {
                        
                        if (htmlSowDueWarning){
                            // Goto GestatingEntry page
                            cur_td.onclick = function(){
                                navigation.onClickProdGestatingEntry(
                                    sow_boar.last_farm_prod_id);
                            };
                                
                        } else{
                            // Goto GestaList Page
                            cur_td.onclick = function(){
                                navigation._onClickNavProdGestaLacta(null, 
                                    PIG_OPERATION_TYPE.GESTATING);
                            };
                        }
                                
                        break;
                    }
                    
                    case SOW_STATUS.LACTATING:  {
                        // Goto LactatingEntry page
                        cur_td.onclick = function(){
                            navigation.onClickProdLactatingEntry(
                                sow_boar.last_farm_prod_id);
                        };
                        
                        break;
                    }
                    
                    case SOW_STATUS.WEANING:    {
                        // TODO
                        break;
                    }
                }
            
            }
            
            
            
            // Clicking on sow_output should go to SowBoar entry page, 
            // Piglet Output Tab
            if (index == 3){
                const tab_id_output = navigation.pageSowBoarEntry.elemIdTabOutput;
            
                cur_td.onclick = function(){
                    navigation.pageSowBoarList.onClickSowBoarEntry(
                        sow_boar.hid, null, tab_id_output);
                };
            }
        
        
        
            index += 1;
        }
        
        return elem_row;
    }
    
    
} 
