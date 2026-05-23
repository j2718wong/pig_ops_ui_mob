// page_acc_farrow_checklist.js

// May 20, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageTableBasic}         from '../common/page_table_basic.js';


import {APPLICATION,
        PAGE_ID,
        DATA_VER_NUM_ACCOUNT}   from '../../constants.js';


import {ComponentNavLeftRight}  from '../common/ui/comp_nav_left_right.js';



export function PageAccFarrowChecklist(input_settings){
    PageTableBasic.call(this);
    
    const TAG                   = 'PageAccFarrowChecklist';
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    this.setNavigation(navigation);
    
    
    /*
    Typical input_settings
    {
        navigation:             this,
        uniqueKey:              'prod-not-pregnant' 
        pageTitle:              'Not Pregnant'
    }   
    */  
    let settings                = input_settings;
    
    
    
    
    // This is needed as this will be first element to be rendered
    let elemDivContainer        = document.getElementById(settings.elemIdDivContainer);
    
    let componentNavLeftRight   = null;
    
    let elemIdPageInfo          = null;
   
    
    let elemIdTableBody         = null;
    

    let elemPageInfo            = null;
    
    let elemTableBody           = null;
    
    
    let dataAccFarrowChecklist  = null;

    
    let localDataVerNum         = 0;
    
    
    
    let dtCurrentDate           = null;

    
    this.init = function(){

        
        thisObj.setSettingsTable({
            uniqueKey:      settings.uniqueKey,
            noHeader:       true,
            itemsPerPage:   10
        });
        
        
        this.render();
        this.afterHtmlRender();
        
        this.afterHtmlRenderThis();
        
    }
    
    
    
    this.render = function(){
        let label_page_title    = 'Farrowing Checklist';
        
        
        let page_info   = `
            This is a list supplies you may need to prepare for Farrowing.
            You can modify this list according to your needs.
            This will show up when a sow is near to its due date.
        `;
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_page_title    = helper.getSimpleTranslation('navigation.nav_links.Operations5') || label_page_title;
        
        page_info           = helper.getSimpleTranslation('page_info.acc_farrow_checklist') || page_info;
        
        componentNavLeftRight   = new ComponentNavLeftRight({
           uniqueKey:           settings.uniqueKey,
           elemDivContainer:    elemDivContainer,
           pageTitle:           label_page_title
        });
        
        
        elemIdPageInfo          = `${settings.uniqueKey}-page-info`;
        
        
        
        const html_nav          = componentNavLeftRight.getHtml();   
        const html_table        = thisObj.getHtml();
           

           
        const html = `

<div class="mobile-container">
    ${html_nav}
    
    <div class="mobile-info-box" id="${elemIdPageInfo}">
        ${page_info}
    </div>
        
    
    ${html_table}

</div>
        `;
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRenderThis = function(){
        componentNavLeftRight.afterHtmlRender();
        
        
        this._findElementsThis();
        this._processAfterHtmlRenderThis();
        this._bindEventListenersThis();
    }
    
    
    this._findElementsThis = function(){
        elemPageInfo            = elemDivContainer.querySelector('#'+elemIdPageInfo);
        
        
        elemTableBody           = elemDivContainer.querySelector('#'+elemIdTableBody);
    }
    
    
    this._processAfterHtmlRenderThis = function(){
        
        componentNavLeftRight.callbackNavLeft = function(){
            navigation.managerNavLinks.onClickNavPigDead();
        };
        
          
        componentNavLeftRight.callbackNavRight = function(){
            navigation.managerNavLinks.onClickNavFeedBalance();
        };
        
        
        componentNavLeftRight.bindEventListeners();
        
        
        thisObj.setOnClickAddEntry(thisObj.onClickAddEntry);
    }
    
    
    this._bindEventListenersThis = function(){
        
       
    }
    
    
    
    this.renderPage = function(page_data){
        thisObj.show();
    }
    
    
    this.getStorageKey = function(){
        return navigation.managerLocalData.STORAGE_KEY.OPERATIONS.SOW_DUE_CHECKLIST;
    }
    
    
    // The data, data_ver_num comes from localStorage.
    this.updateDataSource = function(data, data_ver_num){
        // Update data source
        navigation.pigFarm.accountLists.dataAccSowDueChecklist = data;
        
        // Update data source version
        navigation.pigFarm.accountLists.dataVerNum.sow_due_checklist = data_ver_num;
    }
    
    
    // Display data
    this.displayData = function(){
        const data_list = navigation.pigFarm.accountLists.dataAccSowDueChecklist;
        thisObj.showInfoBox(data_list, elemPageInfo);
        thisObj.renderTable(data_list);
    }
    
    
    // Check server data update
    this.checkServerDataUpdate = function(){
        navigation.pigFarm.accountLists.checkServerDataUpdate(
            DATA_VER_NUM_ACCOUNT.SOW_DUE_CHECKLIST,
            thisObj.requestServerData);
    }
    
    
    this.show = function(options){
        thisObj.debugNavHistory(TAG);
        
        // Update navigation.curPageNavigated
        navigation.curPageNavigated.pageData = null;
        navigation.curPageNavigated.renderPageFunc = thisObj.renderPage;
        
        
        // So that not to instantiate in every table redraw
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
       
        if (options && options.refresh_list){
            this.requestServerData();
            return;
        }
  
   
        // Get data source
        let data_list  = navigation.pigFarm.accountLists.dataAccSowDueChecklist;
        
        
        if (data_list){
            // Display last known data
            this.displayData();
            
            // Check server data update
            this.checkServerDataUpdate();
            
            return;
        }
        
        
        // If data source is null, that means the page was unloaded;
        // Load cached data 
        const pig_farm_hid = navigation.pigFarm.getPigFarmHid();
        this.loadCachedData(pig_farm_hid);
    }
    

    this.requestServerData = function(){
        const callback_success = function(){
            thisObj.displayData();
        };


        const callback_offline = function(){
            const data_list = navigation.pigFarm.accountLists.dataAccSowDueChecklist;
            if (data_list){
                // Display last known data
                thisObj.showInfoBox(data_list, elemPageInfo);
                thisObj.renderTable(data_list);            
            }
            else{
                // Display modal offline
                navigation.managerSystem.showOfflineMessageModal();
            }
        };
        
        
        // This should update:
        // - navigation.pigFarm.accountLists.dataAccSowDueChecklist
        // - navigation.pigFarm.accountLists.dataVerNum.sow_due_checklist
        navigation.pigFarm.accountLists.requestDataAccSowDueChecklist(
                callback_success, callback_offline, null);
    }



    this._writeInlineStyle = function(){
        const html = `
        `;
        return html;

    }
    
    
    this.getElemTableBody = function(){
        return elemTableBody;
    }

    
    this.getHtmlTableHeader = function(){
        elemIdTableBody         = `${settings.uniqueKey}-table-tbody`;
        
        const html_style = this._writeInlineStyle();
        
        
        let label_boar          = 'Boar';
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_boar              = helper.getSimpleTranslation('common_app.labels.boar') || label_boar;
        
        
        
        const html = `
        ${html_style}
        
        <table class="data-table table-prod-hist" id="">
            <colgroup>
                <col style="width: 10%;">
                <col style="width: 90%;">
                
               
            </colgroup>

            <thead>
                <tr>
                    <th></th>
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
        let label_no_entries = thisObj.writeLabelNoEntries();
        
        if (label_no_entries){}
        else{label_no_entries = 'No Entries';}
        
        
        const html = `
            <tr>
                <td colspan="2"><div>${label_no_entries}</div></td>
            </tr>
        `;
        return html;
    }
    

    this.getHtmlTableRow = function(cur_entry){

       
        const html = `
            <tr>
                <td></td>
                <td>${cur_entry.name}</td>
            
            </tr>
        `;
        
        return html;
    }
    
    
    this.getElemTableRow = function(cur_entry){
        const elem_row = document.createElement('tr');
        
        const html = thisObj.getHtmlTableRow(cur_entry);
        elem_row.innerHTML = html;
        
        
        // Attach onclick listeners to td
        
        const elem_tds = elem_row.querySelectorAll('td'); 
        
        let index = 0
        for (const cur_td of elem_tds){
        

            if (index == 1) {
                cur_td.onclick = function(){
                    thisObj.onClickRowEntry(cur_entry.hid);
                }
            }
            
        
            index += 1;
        }
        
        return elem_row;
    }
    
    
    
    this.searchEntries = function(key){
        let data_list = dataAccFarrowChecklist;
        
        const filtered = [];
        for (const cur_entry of data_list){
            
            let u_name              = null;
            
            
            u_name = cur_entry.name.toUpperCase();
            
           
            if (u_name.startsWith(key)){
                filtered.push(cur_entry);
                continue;
            }
            
        } 
        
        
        return filtered;
    }
    
    
    this.getDataEntry = function(entry_hid){
        if (dataAccFarrowChecklist == null) {return null;}
        
        for (const cur_entry of dataAccFarrowChecklist){
            if (cur_entry.hid == entry_hid){return cur_entry;}
        } 
        
        return null;
    }
    
    
    this.onClickAddEntry = function(){
        // Show Container
        const next_page_id  = PAGE_ID.ACC_F_CHECKLIST_ADD_EDIT;
        const next_page = navigation.getPageContainer(next_page_id);
        
        // Push currentPage to NavHistory; 
        // Will also compare current page and  next_page NAV_MENU_GROUP.
        navigation.pushCurrentPageToNavHistory(next_page);
        
        navigation.showThisPage(next_page);
        
        
        // Show Page
        const go_back_page_id = PAGE_ID.ACC_FARROW_CHECKLIST;
        const go_back_page = navigation.getPageContainer(go_back_page_id);
        
        const options ={
            is_add:                 true,   // false is edit
            go_back_page:           go_back_page   
        };
        navigation.pageAccFChecklistAddEdit.show(options);
    }
    
    
    
    this.onClickRowEntry = function(entry_hid){
        console.log('onClickRowEntry entry_hid = ' + entry_hid);
        
        
        
        const data_row_entry = thisObj.getDataEntry(entry_hid);  
        if (data_row_entry == null){return;}
        
        
        // Show container
        const next_page_id  = PAGE_ID.ACC_F_CHECKLIST_ADD_EDIT;
        const next_page = navigation.getPageContainer(next_page_id);
        
        // Push currentPage to NavHistory; 
        // Will also compare current page and  next_page NAV_MENU_GROUP.
        navigation.pushCurrentPageToNavHistory(next_page);
        
        navigation.showThisPage(next_page);
        
        
        // Show Page
        const go_back_page_id = PAGE_ID.ACC_FARROW_CHECKLIST;
        const go_back_page = navigation.getPageContainer(go_back_page_id);
    
        const options = {
            is_add:             false,   // false is edit
            go_back_page:       go_back_page,
            data_row_entry:     data_row_entry
        };
        navigation.pageAccFChecklistAddEdit.show(options);
    }
}
