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
		MULTIKEY_OBJ_TYPE}        from '../../constants.js';

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
		healthType:             MULTIKEY_OBJ_TYPE.SOW_BOAR
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
        
        thisObj.setSettingsTable({
            uniqueKey:      `${settings.uniqueKey}-table`,
            tableTitle:     'Health Issues'
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
    
    
    
    this.beforeShow = function(data, options){
        showOptions     = options;
		
		switch (settings.healthType){
            case MULTIKEY_OBJ_TYPE.SOW_BOAR:{
				dataSowBoar     = data;
        

				if ('list_health_issues' in dataSowBoar.data_details){
					thisObj.setDataEntryList(dataSowBoar.data_details.list_health_issues);
					thisObj.renderTable(dataSowBoar.data_details.list_health_issues);
				} else{
					const callback_success = function(){
						thisObj.setDataEntryList(dataSowBoar.data_details.list_health_issues);
						thisObj.renderTable(dataSowBoar.data_details.list_health_issues);
					}
					
					navigation.pigFarm.managerSowBoar.requestNotesList(
						dataSowBoar, callback_success, thisObj.elemServerErrorMsg);
				}
				
				
				const elem = thisObj.getElemSearchAddControl();
				if ('dispose_status_id' in dataSowBoar.sow_boar){
					elem.style.display = 'none';
				}
				else{
					elem.style.display = 'flex';
				}
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
        let s_click = `gNavigation.pageSowBoarEntry.tablePigHealth.onClickRowEntry("${cur_entry.prod_notes.hid}");`;
        
        if ('dispose_status_id' in dataSowBoar.sow_boar){
            s_click = '';
        }
        
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
            <tr>
                <td><span>${formatDate(dt_notes, FORMAT_COMPACT)}</span></td>
                <td>${s_last_med}</td>
                <td onclick='${s_click}'>${cur_entry.prod_notes.notes}</td>
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
    
    
    this.getEntry = function(entry_hid){
        if ('list_health_issues' in dataSowBoar.data_details){
            for (const cur_entry of dataSowBoar.data_details.list_health_issues){
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
            thisObj.setDataEntryList(dataSowBoar.data_details.list_health_issues);
            thisObj.renderTable(dataSowBoar.data_details.list_health_issues);
            
            // need also to request pig_medvac data
            parentObj.tableMedVac.requestDataPigMedVacList();
        };

        navigation.pigFarm.managerSowBoar.requestNotesList(
			dataSowBoar, callback_success, thisObj.elemServerErrorMsg)
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

        if (row_entry){
            const go_back_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_ENTRY);
        
            const options ={
                is_add:                 false,   // false is edit
                row_entry:              row_entry,
                callback_after_edit:    thisObj.onSuccessAddEntry,   // same action as onSuccessAddEntry
                go_back_page:           go_back_page   // Go back to this page; this is Div element
            }
            
            navigation.pageHealthAddEdit.beforeShow(dataSowBoar, options);
            const page_container = navigation.getPageContainer(PAGE_ID.HEALTH_ADD_EDIT);
            navigation.showThisPage(page_container);
            

        }
    }
    
    
    this.onClickAddMedVacEntry = function(row_entry){
        console.log('onClickAddMedVacEntry');
        const go_back_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_ENTRY);
        
        const options ={
			medvac_type:			MULTIKEY_OBJ_TYPE.SOW_BOAR,
            is_add:                 true,   // false is edit
            callback_after_add:     thisObj.onSuccessAddEntry,
            health_issue_entry:     row_entry,
            go_back_page:           go_back_page   // Go back to this page; this is Div element
        }
        
        navigation.pageMedVacAddEdit.beforeShow(dataSowBoar, options);
        const page_container = navigation.getPageContainer(PAGE_ID.MEDVAC_ADD_EDIT);
        navigation.showThisPage(page_container);
       
    }
    
    
}