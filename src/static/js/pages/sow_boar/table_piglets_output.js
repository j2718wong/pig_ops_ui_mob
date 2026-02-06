// January 19, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageTableBasic}         from '../common/page_table_basic.js';

import {APPLICATION,
        PAGE_ID,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        SOW_STATUS_NAME}        from '../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        sortList,
        createPaginationManager} from '../../utils.js';

import {getSowBoarReference}    from '../common/common_app.js';



export function TablePigletsOutput(input_settings){
    PageTableBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    
    /*
    Typical input_settings
    {
        navigation:             this,
        parentObj:              thisObj,
        uniqueKey:              'sow-boar-notes'
        elemDivContainer:       '<element>'
    }   
    */  
    let settings                = input_settings;
    
    
    let elemDivContainer        = settings.elemDivContainer;

    let elemIdTableBody         = null;

    
    let elemTableBody           = null;
    



    //let textTranslation         = new TextTranslation();
    let curUserLanguageKey      = 'en';


    let showOptions             = null;
    
    let dtCurrentDate           = null;
    
    
    let dataSowBoar             = null;
    
    
    this.init = function(){
        
        thisObj.setSettingsTable({
            uniqueKey:      `${settings.uniqueKey}-table`,
            noSearchAdd:    true,
            tableTitle:     'Birth Output'
        });
        
        const html_table = thisObj.getHtml();
        
        elemDivContainer.innerHTML = html_table;
        thisObj.afterHtmlRender();  // This will call the parent method 
        thisObj.afterHtmlRenderThis();

    }
    
    
    this.afterHtmlRenderThis = function(){
        elemTableBody           = document.getElementById(elemIdTableBody);
        
        // Set onclick listener to parent object
        thisObj.setOnClickAddEntry(thisObj.onClickAddEntry); 
    }
    
    
    this.getElemTableBody = function(){
        return elemTableBody;
    }
    
    
    
    this.beforeShow = function(data_sow_boar, options){
        dataSowBoar     = data_sow_boar;
        showOptions     = options;
        
        if ('list_output' in dataSowBoar.data_details){
            thisObj.setDataEntryList(dataSowBoar.data_details.list_output);
            thisObj.renderTable(dataSowBoar.data_details.list_output);
        } else{
            const callback_success = function(){
                // Set table entry list; This will set also the entry count;
                thisObj.setDataEntryList(dataSowBoar.list_notes);
                thisObj.renderTable(dataSowBoar.list_notes);
            };
            
            
        }
        
    }
    
        
    this.show = function(options){
        
        // show the last showOptions if there is no options
        if (options == null){options = showOptions;}
        
        // So that not to instantiate in every table redraw
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        showOptions = options;
        

        
    }
    
    
    this._writeInlineStyle = function(){
        const html = `
    <style>
        
        /* Updated Table Styles */
        
        .table-output th  {
            padding-right:0;
            overflow-wrap: anywhere; /* Breaks anywhere if needed */
            word-break: break-word;
            white-space: normal;
        }
        
      </style>
    `;
        return html;
    }
    
    
    this.getHtmlTableHeader = function(){
        return thisObj.getHtmlTableHeader2(); 
    }
     
     
    this.getHtmlTableHeader1 = function(){
        elemIdTableBody         = `${settings.uniqueKey}-table-tbody`;
        
        const html_style = thisObj._writeInlineStyle();
        
        const html = `
        ${html_style}
        
        <table class="data-table table-output" id="">
            <thead>
                <colgroup>
                    <col style="width: 14%;">
                    <col style="width: 18%;">
                    <col style="width: 16%;">
                    <col style="width: 16%;">
                    <col style="width: 19%;">
                </colgroup>
                
                
                <tr>
                    <th>PID</th>
                    <th>Birth</th>
                    <th>Live Pigs Birth</th>
                    <th>Dead at Birth</th>
                    <th>Dead before Wean</th>
                    <th>Live Pigs Wean</th>
                </tr>
                
            </thead>
            <tbody id="${elemIdTableBody}">
            </tbody>
        </table>
        
        `;
        
        return html;
        
    }
    
    
    this.getHtmlTableHeader2 = function(){
        elemIdTableBody         = `${settings.uniqueKey}-table-tbody`;
        
        const html_style = thisObj._writeInlineStyle();
        
        const html = `
        ${html_style}
        
        <table class="data-table table-output" id="">
            <thead>
                <colgroup>
                    <col style="width: 32%;">
                    <col style="width: 16%;">
                    <col style="width: 16%;">
                    <col style="width: 19%;">
                </colgroup>
                
                
                <tr>
                    <th>Birth</th>
                    <th>Live Pigs Birth</th>
                    <th>Dead at Birth</th>
                    <th>Dead before Wean</th>
                    <th>Live Pigs Wean</th>
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
                <td colspan="4"><div>No Entries</div></td>
            </tr>
        `;
        return html;
    }
    

    this.getHtmlTableRow = function(cur_entry){
        let s_click = ``;


        let s_pid = cur_entry.pig_production.farm_prod_id;


        const dt_birth = new Date(cur_entry.birth.date_actual);
        
        
        let live_pigs_birth = 0;
        let dead_at_birth = 0;
        let live_pigs_wean = 0;
        let dead_before_wean = 0;
        
        
        if (cur_entry.birth.pigs_live_f){live_pigs_birth += cur_entry.birth.pigs_live_f;}
        if (cur_entry.birth.pigs_live_m){live_pigs_birth += cur_entry.birth.pigs_live_m;}
        
        
        if (cur_entry.birth.dead){dead_at_birth = cur_entry.birth.dead;}
        
        
        if (cur_entry.weaning.date_weaning){
            if (cur_entry.weaning.num_pigs_f){live_pigs_wean += cur_entry.weaning.num_pigs_f;}
            if (cur_entry.weaning.num_pigs_m){live_pigs_wean += cur_entry.weaning.num_pigs_m;}
            
            // This is the case when weaning pigs count not separated by sex
            if (cur_entry.weaning.num_pigs){live_pigs_wean += cur_entry.weaning.num_pigs;}
        }
        else{
            live_pigs_wean = live_pigs_birth;
        }
            
        dead_before_wean = live_pigs_birth - live_pigs_wean;
        
        
        const html_1 = `
            <tr>
                <td class = "data-table-cell-no-padding">${s_pid}</td>
                <td style="padding-left:0;" onclick='${s_click}'><span>${formatDate(dt_birth, FORMAT_COMPACT)}</span></td>
                <td class = "data-table-cell-no-padding">${live_pigs_birth}</td>
                <td class = "data-table-cell-no-padding">${dead_at_birth}</td>
                <td class = "data-table-cell-no-padding">${dead_before_wean}</td>
                <td class = "data-table-cell-no-padding">${live_pigs_wean}</td>
            </tr>
        `;
        
        
        let boar_name = '';
        
        if (cur_entry.insemination.boar){
            boar_name = getSowBoarReference(cur_entry.insemination.boar);
        }
        else{
            boar_name = cur_entry.insemination.ai.semen_supplier.semen.name;
            boar_name += ` (${cur_entry.insemination.ai.semen_supplier.name})`
        }
        
        
        const html_2 = `
            <tr>
                <td onclick='${s_click}'>
                    <div>
                        <div>
                            <span>${formatDate(dt_birth, FORMAT_COMPACT)}</span>
                        </div>
                        <div>
                            <span class="love-icon">❤️</span> ${boar_name}
                        </div>
                    
                    </div>
                </td>
                <td class = "data-table-cell-no-padding">${live_pigs_birth}</td>
                <td class = "data-table-cell-no-padding">${dead_at_birth}</td>
                <td class = "data-table-cell-no-padding">${dead_before_wean}</td>
                <td class = "data-table-cell-no-padding">${live_pigs_wean}</td>
            </tr>
        `;
        
        
        return html_2;
    }
    
      
    this.setUserLanguage = function(language_key){
        curUserLanguageKey = language_key;
        thisObj.onUserChangeLanguage();
    }
    
    
    this.onUserChangeLanguage = function(){
        
       
    }
    
    
    
    
}
