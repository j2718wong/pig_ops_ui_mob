// January 12, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageTableBasic}         from '../common/page_table_basic.js';

import {APPLICATION,
        PAGE_ID,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        SOW_STATUS_NAME,
        MULTIKEY_OBJ_TYPE,
        PROD_STATUS}            from '../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        FORMAT_COMPACT_NO_SPACE,
        createPaginationManager} from '../../utils.js';


/*
TableMedVac is used in these objects

1.) SowBoar entry
2.) PigProd entry
3.) ProdGroup Entry

This is set in settings.medvacType;

*/

export function TableMedVac(input_settings){
    PageTableBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    
    /*
    Typical input_settings
    {
        navigation:             navigation,
        parentObj:              thisObj,
        uniqueKey:              'sow-boar-medvac',
        elemDivContainer:       '<element>'
        medvacType:             MULTIKEY_OBJ_TYPE.SOW_BOAR
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
    
    // This can be a data_sow_boar, data_pig_prod or data_prod_group
    let curDataEntry            = null;
    
    
    this.init = function(){
        
        thisObj.setSettingsTable({
            uniqueKey:      settings.uniqueKey,
            tableTitle:     'Medicines & Vaccines'
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
    
    
    this._writeInlineStyle = function(){
        const html = `
    <style>
        
        /* Updated Table Styles */
        .table-medvac td {padding-right:0}
    </style>
    `;
        return html;
    }
    
    
    this.getElemTableBody = function(){
        return elemTableBody;
    }
    
    
    this.beforeShow = function(data_entry){
        curDataEntry = data_entry;
        
        // Request data if not yet requested
        if ('data_details' in curDataEntry){
            
            // Set table entry list; This will set also the entry count;
            thisObj.setDataEntryList(curDataEntry.data_details.list_medvac);
            thisObj.renderTable(curDataEntry.data_details.list_medvac);
        } else{
            
            thisObj.requestDataPigMedVacList();
        }
        
        
        // Hide elements if not needed
        const elem = thisObj.getElemSearchAddControl();
        
        
        switch(settings.medvacType){
        
            case MULTIKEY_OBJ_TYPE.SOW_BOAR: {
                
                if ('dispose_status_id' in curDataEntry.sow_boar){
                    elem.style.display = 'none';
                }
                else{
                    elem.style.display = 'flex';
                }
                break;
            }
        
            case MULTIKEY_OBJ_TYPE.PIG_PROD: {
                const pig_prod_status = curDataEntry.pig_production.prod_status_id;
                
                switch (pig_prod_status){
                    case PROD_STATUS.LACTATING:
                    case PROD_STATUS.WEANING:
                    case PROD_STATUS.GROWING: {
                        elem.style.display = 'flex';
                        break;
                    }
                    
                    default: {
                        elem.style.display = 'none';
                        break;
                    }
                }
                
                break;
            }
            
            case MULTIKEY_OBJ_TYPE.FATTENING: {
                const pig_prod_status = curDataEntry.pig_production.prod_status_id;
                
                switch (pig_prod_status){
                    case PROD_STATUS.WEANING:
                    case PROD_STATUS.GROWING: {
                        elem.style.display = 'flex';
                        break;
                    }
                    
                    default: {
                        elem.style.display = 'none';
                        break;
                    }
                }
                
                break;
            }
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
        
        const html_style = this._writeInlineStyle();
        
        
        const html = `
        ${html_style}
        
        <table class="data-table table-medvac" id="">
            <thead>
                <colgroup>
                    <col style="width: 26%; padding-right:0;">
                    <col style="width: 34%;">
                    <col style="width: 40%;">
                </colgroup>
                
                <tr>
                    <th>Date</th>
                    <th>MedVac</th>
                    <th>Description</th>
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
        let  s_click = '';
        
        
        switch(settings.medvacType){
        
            case MULTIKEY_OBJ_TYPE.SOW_BOAR: {
                s_click = `gNavigation.pageSowBoarEntry.tableMedVac.onClickRowEntry("${cur_entry.medvac.hid}");`;
                
                if ('dispose_status_id' in curDataEntry.sow_boar){
                    s_click = '';
                }
                break;
            }
        
            case MULTIKEY_OBJ_TYPE.PIG_PROD: {
                // how to chekc if pig prod is still active
                break;
            }
            
            case MULTIKEY_OBJ_TYPE.FATTENING: {
                break;
            }
        }
        
        let s_medvac = `
            <span class="medvac-type"><b>${cur_entry.medvac.type.name}</b></span>
            <span class="medvac-brand">${cur_entry.medvac.brand.name}</span><br>
            
        `;
        
        let s_desc = `
            <span class="medvac-name"><b>${cur_entry.medvac.acc_medvac.name}</b></span>
            <span class="medvac-notes">${cur_entry.medvac.notes}</span>
        `;
        
        const dt_medvac = new Date(cur_entry.medvac.date_medvac);
        
        const html = `
            <tr>
                <td><span>${formatDate(dt_medvac, FORMAT_COMPACT)}</span></td>
                <td onclick='${s_click}'>${s_medvac}</td>
                <td onclick='${s_click}'>${s_desc}</td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.search = function(key){
        
    }
    
    
    this.requestDataPigMedVacList = function(){
        const callback_success = function(data){
            thisObj.setDataEntryList(data);
            thisObj.renderTable(data);
        };
        

        navigation.pigFarm.requestDataPigMedVacList(settings.medvacType, 
            curDataEntry, callback_success, thisObj.elemServerErrorMsg);
        
    }
    
    
    this.setUserLanguage = function(language_key){
        curUserLanguageKey = language_key;
        thisObj.onUserChangeLanguage();
    }
    
    
    this.onUserChangeLanguage = function(){
        
       
    }
    
    
    this.getEntry = function(entry_hid){
        if ('list_medvac' in curDataEntry.data_details){
            for (const cur_entry of curDataEntry.data_details.list_medvac){
                if (cur_entry.medvac.hid == entry_hid){
                    return cur_entry;
                }
            }
        }
        
        return null;
    }
    
    
    this.onClickAddEntry = function(){
        let go_back_page_id = null;
        
        
        switch(settings.medvacType){
        
            case MULTIKEY_OBJ_TYPE.SOW_BOAR: {
                go_back_page_id = PAGE_ID.SOW_BOAR_ENTRY;
                break;
            }
        
            case MULTIKEY_OBJ_TYPE.PIG_PROD: {
                go_back_page_id = PAGE_ID.PROD_LACTA_ENTRY;
                break;
            }
            
            case MULTIKEY_OBJ_TYPE.FATTENING: {
                go_back_page_id = PAGE_ID.PROD_FATTENING_ENTRY;
                break;
            }
        }
        
        const go_back_page = navigation.getPageContainer(go_back_page_id);
        
        
        const options ={
            medvac_type:             settings.medvacType,
            is_add:                 true,   // false is edit
            callback_after_add:     thisObj.onSuccessAddEntry,
            go_back_page:           go_back_page   // Go back to this page; this is Div element
        }
        
        navigation.pageMedVacAddEdit.beforeShow(curDataEntry, options);
        const page_container = navigation.getPageContainer(PAGE_ID.MEDVAC_ADD_EDIT);
        navigation.showThisPage(page_container);
        
        
    }
    
    
    this.onSuccessAddEntry = function(){
        thisObj.requestDataPigMedVacList();
    }
    
    
    this.onSuccessEditEntry = function(){
        thisObj.requestDataPigMedVacList();
    }
    
    
    
    this.onClickRowEntry = function(entry_hid){
        const row_entry = thisObj.getEntry(entry_hid);
        

        if (row_entry){
            let go_back_page_id;
            
            switch(settings.medvacType){
        
                case MULTIKEY_OBJ_TYPE.SOW_BOAR: {
                    go_back_page_id = PAGE_ID.SOW_BOAR_ENTRY;
                    break;
                }
            
                case MULTIKEY_OBJ_TYPE.PIG_PROD: {
                    go_back_page_id = PAGE_ID.PROD_LACTA_ENTRY;
                    break;
                }
                
                case MULTIKEY_OBJ_TYPE.FATTENING: {
                    go_back_page_id = PAGE_ID.PROD_FATTENING_ENTRY;
                    break;
                }
            }
            
            const go_back_page = navigation.getPageContainer(go_back_page_id);
        
            const options ={
                medvac_type:            settings.medvacType,
                is_add:                 false,   // false is edit
                medvac_hid:             entry_hid,
                callback_after_edit:    thisObj.onSuccessEditEntry,
                go_back_page:           go_back_page   // Go back to this page; this is Div element
            }
            
            navigation.pageMedVacAddEdit.beforeShow(curDataEntry, options);
            const page_container = navigation.getPageContainer(PAGE_ID.MEDVAC_ADD_EDIT);
            navigation.showThisPage(page_container);
            
            // Important; otherwise select dropdown not rendered
            navigation.pageMedVacAddEdit.show();
        
        }
    }
}