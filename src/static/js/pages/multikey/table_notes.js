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
        MULTIKEY_OBJ_TYPE}      from '../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        sortList,
        createPaginationManager} from '../../utils.js';



/*
Table Notes are used in different objects

1.) Sow Boar Notes; key = sow_boar_id
2.) Pig Prod Notes; key = pig_prod_id
3.) ProdGroup Notes; key = production_group_id 

*/




export function TableNotes(input_settings){
    PageTableBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    
    /*
    Typical input_settings
    {
        navigation:             navigation,
        parentObj:              thisObj,
        uniqueKey:              'sow-boar-notes'
        elemDivContainer:       '<element>',
        notesType:              MULTIKEY_OBJ_TYPE.SOW_BOAR,
        isProdHistory:          false
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
    let dataPigProd             = null;
    
    
    let dataNotesList           = null;
    
    
    this.init = function(){
        
        const settings_table ={
            uniqueKey:      `${settings.uniqueKey}-table`,
            tableTitle:     'Notes'
        };
        if (settings.isProdHistory){
            settings_table.noAddButton = true;
        }
        
        thisObj.setSettingsTable(settings_table);
        
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
    
    
    
    this.beforeShow = function(data_entry, options){
        showOptions     = options;
        
        switch (settings.notesType){
            case MULTIKEY_OBJ_TYPE.SOW_BOAR:{
                dataSowBoar     = data_entry;
                
                if (dataSowBoar.data_details){
                    if ('list_notes' in dataSowBoar.data_details){
                        dataNotesList = dataSowBoar.data_details.list_notes;
                        
                        thisObj.setDataEntryList(dataNotesList);
                        thisObj.renderTable(dataNotesList);
                    } else{
                        const callback_success = function(){
                            dataNotesList = dataSowBoar.data_details.list_notes;
                            
                            thisObj.setDataEntryList(dataNotesList);
                            thisObj.renderTable(dataNotesList);
                        };
                        
                        navigation.pigFarm.managerSowBoar.requestNotesList(
                            dataSowBoar, callback_success, thisObj.elemServerErrorMsg);
                    }
                }
                else{
                    dataNotesList = [];
                    
                    thisObj.setDataEntryList(dataNotesList);
                    thisObj.renderTable(dataNotesList);
                }
                
                // no add entry if already disposed
                // Still thinking if search control will be removed
                const elem_search_add = thisObj.getElemSearchAddControl();
                if ('dispose_status_id' in dataSowBoar.sow_boar){
                    elem_search_add.style.display = 'none';
                }
                else{
                    elem_search_add.style.display = 'flex';
                }
                
                break;
            }
            
            case MULTIKEY_OBJ_TYPE.PIG_PROD:{
                dataPigProd     = data_entry;
                
                if ('list_notes' in dataPigProd.data_details){
                    dataNotesList = dataPigProd.data_details.list_notes;
                    
                    thisObj.setDataEntryList(dataNotesList);
                    thisObj.renderTable(dataNotesList);
                } else{
                    const callback_success = function(){
                        dataNotesList = dataPigProd.data_details.list_notes;
                        
                        thisObj.setDataEntryList(dataNotesList);
                        thisObj.renderTable(dataNotesList);
                    };
                    
                    navigation.pigFarm.managerPigProd.requestNotesList(
                        dataPigProd, callback_success, thisObj.elemServerErrorMsg);
                }
                
                
                
                
                break;
            }
            
            case MULTIKEY_OBJ_TYPE.PROD_GROUP:{
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
        
        const html = `
        <table class="data-table" id="">
            <colgroup>
                <col style="width: 18%;">
                <col style="width: 15%;">
                <col style="width: 67%;">
            </colgroup>
            
            <thead>
                <tr>
                    <th>Date</th>
                    <th>PID</th>
                    <th>Notes</th>
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
        
        const dt_notes = new Date(cur_entry.prod_notes.date_notes);
        
        let pid = '';
        const farm_prod_id = cur_entry.prod_notes.farm_prod_id;
        if (farm_prod_id && farm_prod_id > 0){
            pid = `${farm_prod_id}`;
        }
        
        const html = `
            <tr>
                <td style="padding-right:0;"><span >${formatDate(dt_notes, FORMAT_COMPACT)}</span></td>
                <td style="padding-left:0; padding-right:0; text-align:center;">${pid}</td>
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
                // TODO: in the future need to link redirect to production page
                // if PID is clicked.
                
            }
        
            if (index == 0 || index == 2){
                // Edit notes
                
                let s_click = '';
                
                switch (settings.notesType){
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
    
    
    this.searchEntries = function(key){
        
        if (key == '') {return dataNotesList;}
        
        const filtered_entries  = [];
        
        for (const cur_entry of dataNotesList){
            const u_notes = cur_entry.prod_notes.notes.toUpperCase();
            
            if (u_notes.includes(key)){
                filtered_entries.push(cur_entry);
                continue;
            }
            
        }
        
        return filtered_entries;
    }
    
    
    this.onClickAddEntry = function(){
        let go_back_page_id = null;
        let data_entry      = null;
        
        switch (settings.notesType) {
            case MULTIKEY_OBJ_TYPE.SOW_BOAR:{
                go_back_page_id = PAGE_ID.SOW_BOAR_ENTRY;
                data_entry      = dataSowBoar;
                
                break;
            }
            
            case MULTIKEY_OBJ_TYPE.PIG_PROD:{
                go_back_page_id = PAGE_ID.PROD_LACTA_ENTRY;
                data_entry      = dataPigProd;
                
                break;
            }
        }
        
        
        const go_back_page = navigation.getPageContainer(go_back_page_id);
        
        const options ={
            notes_type:             settings.notesType,
            is_add:                 true,   // false is edit
            callback_after_add:     thisObj.onSuccessAddEntry,
            go_back_page:           go_back_page  
        };
        navigation.pageNotesAddEdit.beforeShow(data_entry, options);
        
        
        const goto_page_id   = PAGE_ID.NOTES_ADD_EDIT;
        const page_container = navigation.getPageContainer(goto_page_id);
        navigation.showThisPage(page_container);

    }
    
    
    this.getEntry = function(entry_hid){
        let data_entry      = null;
        
        switch (settings.notesType) {
            case MULTIKEY_OBJ_TYPE.SOW_BOAR:{
                data_entry = dataSowBoar;
                break;
            }
            
            case MULTIKEY_OBJ_TYPE.PIG_PROD:{
                data_entry = dataPigProd;
                break;
            }
        }
        
        if (data_entry){
            if ('list_notes' in data_entry.data_details){
                let data_list = data_entry.data_details.list_notes;
                for (const cur_entry of data_list){
                    if (cur_entry.prod_notes.hid == entry_hid){
                        return cur_entry;
                    }
                }
            }
        }
        
        return null;
    }
    
    
    this.onSuccessAddEntry = function(){
        
        switch (settings.notesType) {
            case MULTIKEY_OBJ_TYPE.SOW_BOAR:{
                const callback_success = function(data){
                    thisObj.setDataEntryList(dataSowBoar.data_details.list_notes);
                    thisObj.renderTable(dataSowBoar.data_details.list_notes);
                };

                navigation.pigFarm.managerSowBoar.requestNotesList(
                    dataSowBoar, callback_success, thisObj.elemServerErrorMsg)
                break;
                
            }
            
            case MULTIKEY_OBJ_TYPE.PIG_PROD:{
                const callback_success = function(data){
                    thisObj.setDataEntryList(dataPigProd.data_details.list_notes);
                    thisObj.renderTable(dataPigProd.data_details.list_notes);
                };

                navigation.pigFarm.managerPigProd.requestNotesList(
                    dataPigProd, callback_success, thisObj.elemServerErrorMsg)
                break;
                
            }
        }
    }
    
    
    this.onClickRowEntry = function(entry_hid){
        const row_entry = thisObj.getEntry(entry_hid);
        
       
        thisObj.onClickEditEntry(row_entry);
        
    }
    
    
    this.onClickEditEntry = function(row_entry){
        if (row_entry == null){return;}
        
        let go_back_page_id = null;
        let data_entry      = null;
        
        switch (settings.notesType) {
            case MULTIKEY_OBJ_TYPE.SOW_BOAR:{
                go_back_page_id = PAGE_ID.SOW_BOAR_ENTRY;
                data_entry      = dataSowBoar;
                
                break;
            }
            
            case MULTIKEY_OBJ_TYPE.PIG_PROD:{
                go_back_page_id = PAGE_ID.PROD_LACTA_ENTRY;
                data_entry      = dataPigProd;
                
                break;
            }
        }
        
        
        const go_back_page = navigation.getPageContainer(go_back_page_id);
        
        const options ={
            notes_type:             settings.notesType,
            is_add:                 false,   // false is edit
            row_entry:              row_entry,
            callback_after_edit:    thisObj.onSuccessAddEntry,  
            go_back_page:           go_back_page
        }
        navigation.pageNotesAddEdit.beforeShow(data_entry, options);
        
        
        const goto_page_id   = PAGE_ID.NOTES_ADD_EDIT;
        const page_container = navigation.getPageContainer(goto_page_id);
        navigation.showThisPage(page_container);
    }
}
