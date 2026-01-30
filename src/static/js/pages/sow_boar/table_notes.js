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
        NOTES_TYPE}             from '../../constants.js';

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
        notesType:              NOTES_TYPE.SOW_BOAR
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
    
    
    this.init = function(){
        
        thisObj.setSettingsTable({
            uniqueKey:      `${settings.uniqueKey}-table`,
            tableTitle:     'Notes'
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
    
    
    
    this.beforeShow = function(data, options){
        showOptions     = options;
        
        switch (settings.notesType){
            case NOTES_TYPE.SOW_BOAR:{
                dataSowBoar     = data;
                
                if ('list_notes' in dataSowBoar.data_details){
                    thisObj.setDataEntryList(dataSowBoar.data_details.list_notes);
                    thisObj.renderTable(dataSowBoar.data_details.list_notes);
                } else{
                    const callback_success = function(){
                        // Set table entry list; This will set also the entry count;
                        thisObj.setDataEntryList(dataSowBoar.data_details.list_notes);
                        thisObj.renderTable(dataSowBoar.data_details.list_notes);
                    };
                    
                    navigation.pigFarm.managerSowBoar.requestDataSowBoarNotesList(
                        dataSowBoar, callback_success, thisObj.elemServerErrorMsg);
                }
                
                
                // no add entry if alredy disposed
                const elem = thisObj.getElemSearchAddControl();
                if ('dispose_status_id' in dataSowBoar.sow_boar){
                    elem.style.display = 'none';
                }
                else{
                    elem.style.display = 'flex';
                }
                
                break;
            }
            
            case NOTES_TYPE.PIG_PROD:{
                dataPigProd     = data;
                
                if ('list_notes' in dataPigProd.data_details){
                    thisObj.setDataEntryList(dataPigProd.data_details.list_notes);
                    thisObj.renderTable(dataPigProd.data_details.list_notes);
                } else{
                    const callback_success = function(){
                        // Set table entry list; This will set also the entry count;
                        thisObj.setDataEntryList(dataPigProd.data_details.list_notes);
                        thisObj.renderTable(dataPigProd.data_details.list_notes);
                    };
                    
                    navigation.pigFarm.managerPigProd.requestNotesList(
                        dataPigProd, callback_success, thisObj.elemServerErrorMsg);
                }
                
                
                
                
                break;
            }
            
            case NOTES_TYPE.PROD_GROUP:{
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
            <thead>
                <colgroup>
                    <col style="width: 28%;">
                    <col style="width: 72%;">
                </colgroup>
                
                <tr>
                    <th>Date</th>
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
                <td colspan="2"><div>No Entries</div></td>
            </tr>
        `;
        return html;
    }
    

    this.getHtmlTableRow = function(cur_entry){
        switch (settings.notesType){
            case NOTES_TYPE.SOW_BOAR:{
        
                let s_click = `gNavigation.pageSowBoarEntry.tableSowBoarNotes.onClickRowEntry("${cur_entry.prod_notes.hid}");`;

                if ('dispose_status_id' in dataSowBoar.sow_boar){
                    s_click = '';
                }

                const dt_notes = new Date(cur_entry.prod_notes.date_notes);
                
                const html = `
                    <tr>
                        <td><span>${formatDate(dt_notes, FORMAT_COMPACT)}</span></td>
                        <td onclick='${s_click}'>${cur_entry.prod_notes.notes}</td>
                    </tr>
                `;
                
                return html;
                
                break;
            }
        
            case NOTES_TYPE.PIG_PROD:{
        
                let s_click = `gNavigation.pageSowBoarEntry.tableSowBoarNotes.onClickRowEntry("${cur_entry.prod_notes.hid}");`;

                
                const dt_notes = new Date(cur_entry.prod_notes.date_notes);
                
                const html = `
                    <tr>
                        <td><span>${formatDate(dt_notes, FORMAT_COMPACT)}</span></td>
                        <td onclick='${s_click}'>${cur_entry.prod_notes.notes}</td>
                    </tr>
                `;
                
                return html;
                
                break;
            }
        
        
        }
    }
    
      
    this.setUserLanguage = function(language_key){
        curUserLanguageKey = language_key;
        thisObj.onUserChangeLanguage();
    }
    
    
    this.onUserChangeLanguage = function(){
        
       
    }
    
    
    this.onClickAddEntry = function(){
        
        const go_back_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_ENTRY);
        
        const options ={
            is_add:                 true,   // false is edit
            callback_after_add:     thisObj.onSuccessAddEntry,
            go_back_page:           go_back_page   // Go back to this page; this is Div element
        }
        
        navigation.pageNotesAddEdit.beforeShow(dataSowBoar, options);
        const page_container = navigation.getPageContainer(PAGE_ID.NOTES_ADD_EDIT);
        navigation.showThisPage(page_container);
        
        
    }
    
    
    this.getEntry = function(entry_hid){
        if ('list_notes' in dataSowBoar.data_details){
            for (const cur_entry of dataSowBoar.data_details.list_notes){
                if (cur_entry.prod_notes.hid == entry_hid){
                    return cur_entry;
                }
            }
        }
        
        return null;
    }
    
    
    this.onSuccessAddEntry = function(){
        
        const callback_success = function(data){
            thisObj.setDataEntryList(dataSowBoar.data_details.list_notes);
            thisObj.renderTable(dataSowBoar.data_details.list_notes);
        };

        navigation.pigFarm.managerSowBoar.requestDataSowBoarNotesList(
			dataSowBoar, callback_success, thisObj.elemServerErrorMsg)
    }
    
    
    this.onClickRowEntry = function(entry_hid){
        const row_entry = thisObj.getEntry(entry_hid);
        thisObj.onClickEditEntry(row_entry);
    }
    
    
    this.onClickEditEntry = function(row_entry){

        if (row_entry){
            const go_back_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_ENTRY);
        
            const options ={
                is_add:                 false,   // false is edit
                row_entry:              row_entry,
                callback_after_edit:    thisObj.onSuccessAddEntry,   // same action as onSuccessAddEntry
                go_back_page:           go_back_page   // Go back to this page; this is Div element
            }
            
            navigation.pageNotesAddEdit.beforeShow(dataSowBoar, options);
            const page_container = navigation.getPageContainer(PAGE_ID.NOTES_ADD_EDIT);
            navigation.showThisPage(page_container);
            

        }
    }
    
    
    
    
}