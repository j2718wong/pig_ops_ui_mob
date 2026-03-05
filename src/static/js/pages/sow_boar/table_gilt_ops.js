// January 21, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageTableBasic}         from '../common/page_table_basic.js';


import {getSowBoarReference}    from '../common/common_app.js';


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



export function TableGiltOps(input_settings){
    PageTableBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    
    /*
    Typical input_settings
    {
        navigation:             this,
        parentObj:              thisObj,
        uniqueKey:              'sow-boar-gilt-ops'
        elemDivContainer:       '<element>'
    }   
    */  
    const settings              = input_settings;
    
    
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
            tableTitle:     'Gilt Operations'
        });
        
        const html = thisObj.getHtml();
        elemDivContainer.innerHTML = html;
        
        
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
        
        if (dataSowBoar.data_details) {
            if ('list_mates' in dataSowBoar.data_details){
                thisObj.setDataEntryList(dataSowBoar.data_details.list_mates);
                thisObj.renderTable(dataSowBoar.data_details.list_mates);
            } else{
                const callback_success = function(){
                    // Set table entry list; This will set also the entry count;
                    thisObj.setDataEntryList(dataSowBoar.list_notes);
                    thisObj.renderTable(dataSowBoar.list_notes);
                };
            }
        }
        else{
            thisObj.setDataEntryList([]);
            thisObj.renderTable([]);
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
    
     
    this.getHtmlTableHeader = function(){
        elemIdTableBody         = `${settings.uniqueKey}-table-tbody`;
        
        const html = `
        <table class="data-table" id="">
            <thead>
                
                <tr>
                    <th>Date</th>
                    <th>Operation</th>
                    <th>Done By</th>
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
                <td colspan="3"><div>No Entries</div></td>
            </tr>
        `;
        return html;
    }
    

    this.getHtmlTableRow = function(cur_entry){
        const pig_ops_hid   = cur_entry.pig_prod_pig_ops.hid;
        const dt_target     = new Date(cur_entry.pig_prod_pig_ops.date_target);
        
        const acc_pig_ops_hid= cur_entry.account_pig_ops.hid; 
        const pig_ops_name  = cur_entry.account_pig_ops.name;
        
        let staff_name = '';
        if (cur_entry.staff.name){
            staff_name = cur_entry.staff.name;
        }
        
        
        const html = `
            <tr>
                <td><span>${formatDate(dt_target, FORMAT_COMPACT)}</span></td>
                <td >${pig_ops_name}</td>
                <td ></td>
            </tr>
        `;
        
        return html;
    }
    
      
    this.setUserLanguage = function(language_key){
        curUserLanguageKey = language_key;
        thisObj.onUserChangeLanguage();
    }
    
    
    this.onUserChangeLanguage = function(){
        
       
    }
    
    
    
    
}
