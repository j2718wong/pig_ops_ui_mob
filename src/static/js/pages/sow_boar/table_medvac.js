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
		FORMAT_COMPACT_NO_SPACE,
        createPaginationManager} from '../../utils.js';




export function TableMedVac(input_settings){
    PageTableBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    
    /*
    Typical input_settings
    {
        navigation:             this,
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
        
        const settingsTable = {
            uniqueKey:      'sow-boar-medvac',
            tableTitle:     'Medicines & Vaccines'
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
    
    
    
    this.beforeShow = function(data_sow_boar){
        dataSowBoar = data_sow_boar;
        
        const data_sow_boar_medvac = null;
        if ('list_medvac' in dataSowBoar){
            // Set table entry list; This will set also the entry count;
            thisObj.setDataEntryList(dataSowBoar.list_medvac);
            thisObj.renderTable(dataSowBoar.list_medvac);
        } else{
            
            thisObj.requestDataPigMedVac();
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
                    <col style="width: 25%;">
                    <col style="width: 45%;">
                    <col style="width: 50%;">
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
        
        let  s_click = `gNavigation.pageSowBoarEntry.`;
        
        let s_medvac = `<span class="medvac-brand">${cur_entry.medvac.brand.name}</span>`;
        s_medvac +=  `<span class="medvac-type">${cur_entry.medvac.type.name}</span>`;
        
        let s_desc = `<span class="medvac-name">${cur_entry.medvac.name}</span>`;
        s_desc += `<span class="medvac-notes">${cur_entry.medvac.notes}</span>`;
        
        const html = `
            <tr>
                <td><span>${formatDate(cur_entry.medvac.date_medvac, FORMAT_COMPACT_NO_SPACE)}</span></td>
                <td onclick='${s_click}'>${s_medvac}</td>
                <td onclick='${s_click}'>${s_desc}</td>
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
    
    
    this.searchSowBoar = function(key){
        
    }
    
    
    this.requestDataPigMedVac = function(callback){
        const sow_boar_hid = dataSowBoar.hid;
        
        const base_url = window.location.origin;
        const url = `${base_url}/pig_medvac/list?sow_boar_hid=${sow_boar_hid}`;
        
        
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
                    dataSowBoar['list_medvac'] = response.data;
                    
                    // Set table entry list; This will set also the entry count;
                    thisObj.setDataEntryList(response.data);
                    thisObj.renderTable(response.data);
                    
                    if (callback){
                        callback(response.data);
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
    
    this.onClickAddEntry = function(){
        
        const go_back_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_ENTRY);
        
        const options ={
            is_add:                 true,   // false is edit
            callback_after_add:     thisObj.onSuccessAddEntry,
            go_back_page:           go_back_page   // Go back to this page; this is Div element
        }
        
        navigation.pageMedVacAddEdit.beforeShow(dataSowBoar, options);
        const page_container = navigation.getPageContainer(PAGE_ID.MEDVAC_ADD_EDIT);
        navigation.showThisPage(page_container);
        
        
    }
    
    
    this.onSuccessAddEntry = function(){
        thisObj.requestDataPigMedVac();
    }
    
}