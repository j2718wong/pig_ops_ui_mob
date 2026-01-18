// January 12, 2026
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




export function TableHealthIssue(input_settings){
    PageTableBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    /*
    Typical input_settings
    {
        navigation:             this,
        parentObj:              thisObj,
        elemDivContainer:       elemTabHealth
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
        
        let settingsTable;
        settingsTable = {
            uniqueKey:      'sow-boar-health-table',
            tableTitle:     'Health Issues'
        }
        
        
        thisObj.setSettings(settingsTable);
        
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

        if ('list_health_issues' in dataSowBoar){
            
            thisObj.setDataEntryList(dataSowBoar.list_health_issues);
            thisObj.renderTable(dataSowBoar.list_health_issues);
        } else{
            console.log('to request notes');
            thisObj.requestDataNotes();
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
                    <col style="width: 28%; padding-right:0;">
                    <col style="width: 32%;">
                    <col style="width: 40%;">
                    
                    
                </colgroup>
                
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
    
        let  s_click = '';
        
        s_click = `gNavigation.pageSowBoarEntry.tablePigHealth.onClickRowEntry("${cur_entry.prod_notes.hid}");`;
        
        let s_last_med = ''
        let s_last_update = '';
        
        
        
        const health_issue_hid = cur_entry.prod_notes.hid;
        let last_med_health_issue =  null;
        
        // dataSowBoar.list_medvac is listed in date DESC
        if ('list_medvac' in dataSowBoar){
            // Get the first 
            const  list_medvac = dataSowBoar.list_medvac;
            
            for (const cur_medvac in list_medvac){
                if (cur_medvac.health_issue_hid == health_issue_hid){
                    last_med_health_issue = cur_medvac;
                    break;
                }
            }
            
        }
        
        
        if (last_med_health_issue){
            s_last_med = `
                <span class="medvac-name">${last_med_health_issue.medvac.acc_medvac.name}</span>
                <span class="medvac-notes">${last_med_health_issue.medvac.notes}</span>
            `;
            
        }
        
        
        const dt_notes = new Date(cur_entry.prod_notes.date_notes);
        
        const html = `
            <tr>
                <td><span>${formatDate(dt_notes, FORMAT_COMPACT)}</span></td>
                <td>${s_last_med}</td>
                <td onclick='${s_click}'>${cur_entry.prod_notes.notes}</td>
            </tr>
        `;
        
        return html;
    }
    

    this.addToolTips = function(){
        const with_tooltips  = elemDivContainer.querySelectorAll('[data-bs-toggle="tooltip"]');
        console.log('with_tooltips='+with_tooltips.length);
        for (const cur_entry of with_tooltips){
            new bootstrap.Tooltip(cur_entry);
        }
    }
    
    
    this.requestDataNotes = function(callback){
        const sow_boar_hid = dataSowBoar.sow_boar.hid;
        
        const base_url = window.location.origin;
        const url = `${base_url}/pig_prod_notes/list?sow_boar_hid=${sow_boar_hid}`;
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            async: true,
  
            beforeSend: function(){
                thisObj.elemServerErrorMsg.style.display = 'none';
            },
  
            success: function(response){
                if (response.result.num == 0){
                    
                    const sow_boar_notes = [];
                    const health_issues = [];
                    
                    for (const cur_entry of response.data){
                        if ('is_health_issue' in cur_entry.prod_notes){
                            health_issues.push(cur_entry);
                        }
                        else{
                            sow_boar_notes.push(cur_entry);
                        }
                    }
                    
                    dataSowBoar.list_notes = sow_boar_notes;
                    dataSowBoar.list_health_issues = health_issues;
                    
                    
                    thisObj.setDataEntryList(dataSowBoar.list_health_issues);
                    thisObj.renderTable(dataSowBoar.list_health_issues);
                    
                    if (callback){
                        
                    }
                }
                else {
                    navigation.serverError.receivedErrorMessage(
                        response, thisObj.elemServerErrorMsg);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
        
    }
    
    
    this.setUserLanguage = function(language_key){
        curUserLanguageKey = language_key;
        thisObj.onUserChangeLanguage();
    }
    
    
    this.onUserChangeLanguage = function(){
        
       
    }
    
    
    this.getEntry = function(entry_hid){
        if ('health_issues' in dataSowBoar){
            for (const cur_entry of dataSowBoar.health_issues){
                if (cur_entry.prod_notes.hid == entry_hid){
                    return cur_entry;
                }
            }
        }
        
        return null;
    }
    
    
    this.onClickAddEntry = function(){
        
        const go_back_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_ENTRY);
        
        const options ={
            is_add:                 true,   // false is edit
            callback_after_add:     thisObj.onSuccessAddEntry,
            go_back_page:           go_back_page   // Go back to this page; this is Div element
        }
        
        navigation.pageHealthAddEdit.beforeShow(dataSowBoar, options);
        const page_container = navigation.getPageContainer(PAGE_ID.HEALTH_ADD_EDIT);
        navigation.showThisPage(page_container);
        
        
    }
    
    
    this.onSuccessAddEntry = function(){
        
        const callback_success = function(data){
            console.log('To render again heakth issues');
            thisObj.setDataEntryList(dataSowBoar.health_issues);
            thisObj.renderTable(dataSowBoar.health_issues);
        };
        console.log('to reuest');
        parentObj.requestDataSowBoarNotes(dataSowBoar, callback_success, 
            thisObj.elemServerErrorMsg)
    }
    
    
    this.onSuccessEditEntry = function(){
        console.log('onSuccessEditEntry');
    }
    
    
    this.onClickRowEntry = function(entry_hid){
        const row_entry = thisObj.getEntry(entry_hid);
        
        if (row_entry){
            const go_back_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_ENTRY);
        
            const options ={
                is_add:                 false,   // false is edit
                prod_notes_hid:         entry_hid,
                callback_after_edit:    thisObj.onSuccessEditEntry,
                go_back_page:           go_back_page   // Go back to this page; this is Div element
            }
            
            navigation.pageHealthAddEdit.beforeShow(dataSowBoar, options);
            const page_container = navigation.getPageContainer(PAGE_ID.HEALTH_ADD_EDIT);
            navigation.showThisPage(page_container);
            

        }
    }
    
}