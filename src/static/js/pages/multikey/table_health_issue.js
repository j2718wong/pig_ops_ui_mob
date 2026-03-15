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
        sortList,
        createPaginationManager} from '../../utils.js';



/*
TableHealthIssue are used in different objects

1.) Sow Boar Health; key = sow_boar_id
2.) Pig Prod Health; key = pig_prod_id
3.) ProdGroup Health; key = production_group_id 

*/


export function TableHealthIssue(input_settings){
    PageTableBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    /*
    Typical input_settings
    {
        navigation:             navigation,
        parentObj:              thisObj,
        uniqueKey:              'sow-boar-health',
        elemDivContainer:       elemTabHealth,
        healthType:             MULTIKEY_OBJ_TYPE.SOW_BOAR,
        isProdHistory:          false
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
    let dataPigProd             = null;
    
    
    this.init = function(){
        
        const settings_table = {
            uniqueKey:      `${settings.uniqueKey}-table`,
            tableTitle:     'Health Issues'
        };
        if (settings.isProdHistory){
            settings_table.noAddButton = true;
        }
        
        thisObj.setSettingsTable(settings_table);
        
        
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
    
    
    
    this.beforeShow = function(data_entry, options){
        showOptions     = options;
        
        switch (settings.healthType){
            case MULTIKEY_OBJ_TYPE.SOW_BOAR:{
                dataSowBoar     = data_entry;
        
                if (dataSowBoar.data_details){
                    if ('list_health_issues' in dataSowBoar.data_details){
                        let data_list = dataSowBoar.data_details.list_health_issues;
                        
                        thisObj.setDataEntryList(data_list);
                        thisObj.renderTable(data_list);
                    } else{
                        const callback_success = function(){
                            let data_list = dataSowBoar.data_details.list_health_issues;
                            
                            thisObj.setDataEntryList(data_list);
                            thisObj.renderTable(data_list);
                        }
                        
                        navigation.pigFarm.managerSowBoar.requestNotesList(
                            dataSowBoar, callback_success, thisObj.elemServerErrorMsg);
                    }
                }
                else{
                    thisObj.setDataEntryList([]);
                    thisObj.renderTable([]);
                }
                
                
                const elem = thisObj.getElemSearchAddControl();
                if ('dispose_status_id' in dataSowBoar.sow_boar){
                    elem.style.display = 'none';
                }
                else{
                    elem.style.display = 'flex';
                }
                
                break;
            }
            
            
            case MULTIKEY_OBJ_TYPE.PIG_PROD:{
                dataPigProd     = data_entry;

                if (dataPigProd.data_details) {
                    if ('list_health_issues' in dataPigProd.data_details){
                        let data_list = dataPigProd.data_details.list_health_issues;
                        
                        thisObj.setDataEntryList(data_list);
                        thisObj.renderTable(data_list);
                    } else{
                        const callback_success = function(){
                            let data_list = dataPigProd.data_details.list_health_issues;
                            
                            thisObj.setDataEntryList(data_list);
                            thisObj.renderTable(data_list);
                        }
                    }
                }
                else{
                    thisObj.setDataEntryList([]);
                    thisObj.renderTable([]);
                }
                
                
                
                break;
            }
        }
    }
    
        
    this.show = function(options){

    }
    
     
    this.getHtmlTableHeader = function(){
        elemIdTableBody         = `${settings.uniqueKey}-table-tbody`;
        
        const html = `
        <table class="data-table" id="">
            <colgroup>
                <col style="width: 28%; padding-right:0;">
                <col style="width: 32%;">
                <col style="width: 40%;">
            </colgroup>
            
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Last Med</th>
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
        
        let s_last_med = ''
        let s_last_update = '';
        
        
        
        const health_issue_hid = cur_entry.prod_notes.hid;
        let last_med_health_issue =  null;
        
        
        if (cur_entry.pig_medvac){
            s_last_med = `
                <span class="medvac-name"><b>${cur_entry.pig_medvac.acc_medvac_name}</b></span>
                <span class="medvac-notes">${cur_entry.pig_medvac.medvac_notes}</span>
            `;
        }
        
        
        const dt_notes = new Date(cur_entry.prod_notes.date_notes);
        
        const html = `
            <tr data-hid="${cur_entry.prod_notes.hid}">
                <td>${formatDate(dt_notes, FORMAT_COMPACT)}</td>
                <td>${s_last_med}</td>
                <td>${cur_entry.prod_notes.notes}</td>
            </tr>
        `;
        
        return html;
    }
    
 
    this.getElemTableRow = function(cur_entry){
        const elem_row = document.createElement('tr');
        
        const html = thisObj.getHtmlTableRow(cur_entry);
        elem_row.innerHTML = html;
         
        
        if (settings.isProdHistory){
            // No Click action;
            return elem_row;
        }
        
        
        // TODO still evaluating if onclick is for row, td or span in td;
        // To avoid un necessary clicks while scrolling. 
        
        
        // Attach onclick listeners to td
        
        const elem_tds = elem_row.querySelectorAll('td'); 
        
        let index = 0
        for (const cur_td of elem_tds){
        
            if (index == 1){
                // TODO: Should edit Medvac?
                
            }
        
            if (index == 0 || index == 2){
                // Edit notes
                
                let s_click = '';
                
                switch (settings.healthType){
                    case MULTIKEY_OBJ_TYPE.SOW_BOAR:{
                
                        if ('dispose_status_id' in dataSowBoar.sow_boar){}
                        else{
                            cur_td.onclick = function(){
                                thisObj.onClickRowEntry(cur_entry.prod_notes.hid);
                            }
                        }

                        break;
                    }
                
                    case MULTIKEY_OBJ_TYPE.PIG_PROD:{
                        // Todo how to check if still active
                        
                        cur_td.onclick = function(){
                            thisObj.onClickRowEntry(cur_entry.prod_notes.hid);
                        }
                        
                        break;
                    }
                }
            }
            
            index += 1;
        
        }
        
        return elem_row;
    }
 
 
    this.setUserLanguage = function(language_key){
        curUserLanguageKey = language_key;
        thisObj.onUserChangeLanguage();
    }
    
    
    this.onUserChangeLanguage = function(){
        
       
    }
    
    
    this.getEntry = function(entry_hid){
        let data_list = null;
        
        
        switch (settings.healthType) {
            case MULTIKEY_OBJ_TYPE.SOW_BOAR:{
                if ('list_health_issues' in dataSowBoar.data_details){
                    data_list = dataSowBoar.data_details.list_health_issues;
                }
                
                break;
            }
            
            case MULTIKEY_OBJ_TYPE.PIG_PROD:{
                if ('list_health_issues' in dataPigProd.data_details){
                    data_list = dataPigProd.data_details.list_health_issues;
                }
                
                break;
            }
        }
        
        
        if (data_list) {
            for (const cur_entry of data_list){
                if (cur_entry.prod_notes.hid == entry_hid){
                    return cur_entry;
                }
            }
        }
        
        return null;
    }
    
    
    this.onClickAddEntry = function(){
        let go_back_page_id = null;
        let data_entry      = null;
        
        // Calculate go_back_page_id
        switch (settings.healthType) {
            case MULTIKEY_OBJ_TYPE.SOW_BOAR:{
                data_entry      = dataSowBoar;
                
                go_back_page_id = PAGE_ID.SOW_BOAR_ENTRY;
                
                break;
            }
            
            case MULTIKEY_OBJ_TYPE.PIG_PROD:{
                data_entry      = dataPigProd;
                
                
                let prod_status_id = dataPigProd.pig_production.prod_status_id;
                
                if (prod_status_id == PROD_STATUS.LACTATING){
                    go_back_page_id = PAGE_ID.PROD_LACTA_ENTRY;
                } else {
                    go_back_page_id = PAGE_ID.PROD_FATTENING_ENTRY;
                }
                
                break;
            }
            
        }
        
        
        // Show Next Page Container
        const goto_page_id   = PAGE_ID.HEALTH_ADD_EDIT;
        const page_container = navigation.getPageContainer(goto_page_id);
        navigation.showThisPage(page_container);

        
        // Render Page
        const go_back_page = navigation.getPageContainer(go_back_page_id);
        const options ={
            health_type:            settings.healthType,
            is_add:                 true,   // false is edit
            callback_after_add:     thisObj.onSuccessAddEntry,
            go_back_page:           go_back_page
        };
        navigation.pageHealthAddEdit.beforeShow(data_entry, options);
    }
    
    
    this.onSuccessAddEntry = function(){
        
        switch (settings.healthType) {
            case MULTIKEY_OBJ_TYPE.SOW_BOAR:{
                const callback_success = function(data){
                    let data_list = dataSowBoar.data_details.list_health_issues;
                    
                    thisObj.setDataEntryList(data_list);
                    thisObj.renderTable(data_list);
                    
                    // need also to request pig_medvac data
                    parentObj.tableMedVac.requestDataPigMedVacList();
                };

                navigation.pigFarm.managerSowBoar.requestNotesList(
                    dataSowBoar, callback_success, thisObj.elemServerErrorMsg);
                    
                break;
            }
            
            case MULTIKEY_OBJ_TYPE.PIG_PROD:{
                const callback_success = function(data){
                    let data_list = dataPigProd.data_details.list_health_issues;
                    
                    thisObj.setDataEntryList(data_list);
                    thisObj.renderTable(data_list);
                    
                    // need also to request pig_medvac data
                    //parentObj.tableMedVac.requestDataPigMedVacList();
                };

                navigation.pigFarm.managerPigProd.requestNotesList(
                    dataPigProd, callback_success, thisObj.elemServerErrorMsg);
                
                break;
            }
        }
    }
    

    this.onClickRowEntry = function(entry_hid){
        const row_entry = thisObj.getEntry(entry_hid);
        
        
        const menu_items = [
            {   label: 'Edit',
                action: thisObj.onClickEditEntry,
                data:   row_entry
            },
            
            {
                label: 'Add MedVac',
                action: thisObj.onClickAddMedVacEntry,
                data:   row_entry
            }
            
        ];
        
        const options = {
            title: 'Health Issue'
        };
        
        navigation.moreModal.beforeShow(menu_items, options);
    }
    
    
    this.onClickEditEntry = function(row_entry){
        if (row_entry == null){return;}


        switch (settings.healthType) {
            case MULTIKEY_OBJ_TYPE.SOW_BOAR:{
                const go_back_page_id = PAGE_ID.SOW_BOAR_ENTRY;
                const go_back_page = navigation.getPageContainer(go_back_page_id);
            
                const options ={
                    health_type:            settings.healthType,
                    is_add:                 false,   // false is edit
                    row_entry:              row_entry,
                    callback_after_edit:    thisObj.onSuccessAddEntry,   
                    go_back_page:           go_back_page 
                }
                navigation.pageHealthAddEdit.beforeShow(dataSowBoar, options);
                
                
                const goto_page_id = PAGE_ID.HEALTH_ADD_EDIT;
                const page_container = navigation.getPageContainer(goto_page_id);
                navigation.showThisPage(page_container);
                
                break;
            }
            
            case MULTIKEY_OBJ_TYPE.PIG_PROD:{
        
                const prod_status_id = dataPigProd.pig_production.prod_status_id;
                
                let go_back_page_id = null;
                if (prod_status_id == PROD_STATUS.LACTATING){
                    go_back_page_id = PAGE_ID.PROD_LACTA_ENTRY;
                } else {
                    go_back_page_id = PAGE_ID.PROD_FATTENING_ENTRY;
                }
        
                const go_back_page = navigation.getPageContainer(go_back_page_id);
            
                const options ={
                    health_type:             settings.healthType,
                    is_add:                 false,   // false is edit
                    row_entry:              row_entry,
                    callback_after_edit:    thisObj.onSuccessAddEntry,
                    go_back_page:           go_back_page
                };
                navigation.pageHealthAddEdit.beforeShow(dataPigProd, options);
                
                
                const goto_page_id   = PAGE_ID.HEALTH_ADD_EDIT;
                const page_container = navigation.getPageContainer(goto_page_id);
                navigation.showThisPage(page_container);
                
                break;
            }
        }
    }
    
    
    this.onClickAddMedVacEntry = function(row_entry){
        
        switch (settings.healthType) {
            case MULTIKEY_OBJ_TYPE.SOW_BOAR:{
                const go_back_page_id = PAGE_ID.SOW_BOAR_ENTRY;
                const go_back_page = navigation.getPageContainer(go_back_page_id);
                
                const options ={
                    medvac_type:            MULTIKEY_OBJ_TYPE.SOW_BOAR,
                    is_add:                 true,   // false is edit
                    callback_after_add:     thisObj.onSuccessAddEntry,
                    health_issue_entry:     row_entry,
                    go_back_page:           go_back_page
                }
                navigation.pageMedVacAddEdit.beforeShow(dataSowBoar, options);
                
                
                const goto_page_id   = PAGE_ID.MEDVAC_ADD_EDIT;
                const page_container = navigation.getPageContainer(goto_page_id);
                navigation.showThisPage(page_container);
                
                break;
            }
         
            case MULTIKEY_OBJ_TYPE.PIG_PROD:{
        
                const prod_status_id = dataPigProd.pig_production.prod_status_id;
                
                let go_back_page_id = null;
                if (prod_status_id == PROD_STATUS.LACTATING){
                    go_back_page_id = PAGE_ID.PROD_LACTA_ENTRY;
                } else {
                    go_back_page_id = PAGE_ID.PROD_FATTENING_ENTRY;
                }
        
                const go_back_page = navigation.getPageContainer(go_back_page_id);
            
                const options ={
                    medvac_type:            MULTIKEY_OBJ_TYPE.PIG_PROD,
                    is_add:                 true,   // false is edit
                    callback_after_add:     thisObj.onSuccessAddEntry,
                    health_issue_entry:     row_entry,
                    go_back_page:           go_back_page
                }
                navigation.pageMedVacAddEdit.beforeShow(dataPigProd, options);
                
                
                const goto_page_id   = PAGE_ID.MEDVAC_ADD_EDIT;
                const page_container = navigation.getPageContainer(goto_page_id);
                navigation.showThisPage(page_container);
                
                break;
            }
        }
       
    }
    
    
}
