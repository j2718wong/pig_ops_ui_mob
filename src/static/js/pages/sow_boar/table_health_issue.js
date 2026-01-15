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



TableHealthIssues.prototype = new PageTableBasic();
export function TableHealthIssues(input_settings){
    PageTableBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    
    /*
    Typical input_settings
    {
        navigation:             this,
		uniqueKey:				'sow-boar-health'
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
        
		let settingsTable;
		settingsTable = {
			uniqueKey:      settings.uniqueKey,
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
    
    
    
    this.beforeShow = function(data_sow_boar){
        dataSowBoar = data_sow_boar;
        
        const data_sow_boar_medvac = null;
        if ('notes' in dataSowBoar){
            // TODO
            const test = 1;
        } else{
            const callback_success = function(data){
                // Set table entry list; This will set also the entry count;
                thisObj.setDataEntryList(data);
                thisObj.renderTable(data);
            };
            thisObj.requestData(callback_success);
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
                    <col style="width: 15%;">
                    <col style="width: 25%;">
					<col style="width: 45%;">
					<col style="width: 15%;">
					
                </colgroup>
                
                <tr>
                    <th>Date</th>
                    <th>Last Med</th>
                    <th>Description</th>
					<th>Last Update</th>
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
                <td><div>No Entries</div></td>
                <td><div>&nbsp;</div></td>
                <td><div>&nbsp;</div></td>
				<td><div>&nbsp;</div></td>
            </tr>
        `;
        return html;
    }
    

    this.getHtmlTableRow = function(cur_entry){
        
        let  s_click = '';
        
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
		
        const html = `
            <tr>=
                <td><span>${cur_entry.prod_notes.date_notes}</span></td>
                <td>${s_last_med}</td>
                <td onclick='${s_click}'>${cur_entry.prod_notes.notes}</td>
				<td>${s_last_update}</td>
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
    
    
    this.requestData = function(callback){
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
                    
                    if (callback){
                        callback(dataSowBoar['list_medvac']);
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
            is_add:         true,   // false is edit
            go_back_page:   go_back_page   // Go back to this page; this is Div element
        }
        
        navigation.pageMedVacAddEdit.beforeShow(dataSowBoar, options);
        const page_container = navigation.getPageContainer(PAGE_ID.MEDVAC_ADD_EDIT);
        navigation.showThisPage(page_container);
        
        
    }
    
}