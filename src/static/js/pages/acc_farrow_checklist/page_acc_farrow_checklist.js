// page_acc_farrow_checklist.js

// May 20, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageTableBasic}         from '../common/page_table_basic.js';


import {APPLICATION,
        PAGE_ID}                from '../../constants.js';


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
    
    
    let dataAccFarrowChecklist     = null;

    
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
    
    
    
    this.show = function(options){
        thisObj.debugNavHistory(TAG);
        
        // Update navigation.curPageNavigated
        navigation.curPageNavigated.pageData = null;
        navigation.curPageNavigated.renderPageFunc = thisObj.renderPage;
        
        
        // So that not to instantiate in every table redraw
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
       
        
        
        const callback_success = function(data){
            dataAccFarrowChecklist = navigation.pigFarm.accountLists.dataAccSowDueChecklist;
            thisObj.renderTable(dataAccFarrowChecklist);
        };
        
        const callback_offline = function(){
            
            dataAccFarrowChecklist = navigation.pigFarm.managerSowBoar.dataAccFarrowChecklist;
            
            if (dataAccFarrowChecklist){
                thisObj.showInfoBox(dataAccFarrowChecklist, elemPageInfo);
                thisObj.renderTable(dataAccFarrowChecklist);
            }
            else{
                // Display modal offline
                navigation.managerSystem.showOfflineMessageModal();
            }
        };
        
        
        
        let is_to_request_data = 0;
        
        
        dataAccFarrowChecklist = navigation.pigFarm.accountLists.dataAccSowDueChecklist;
        
        if (dataAccFarrowChecklist == null){
            is_to_request_data = 1;
        } 
        
        if (options && options.refresh_list){
            is_to_request_data = 1;
        }
        
        
        // Request data only if needed
        if (is_to_request_data > 0){
            navigation.pigFarm.accountLists.requestDataAccSowDueChecklist(
                callback_success, callback_offline, null);
        }
        else{
            // Display last known data
            thisObj.renderTable(dataAccFarrowChecklist);
        }
        
        
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
    
    
    this.onClickAddEntry = function(){
        // Show Container
        const next_page = navigation.getPageContainer(PAGE_ID.ACC_F_CHECKLIST_ADD_EDIT);
        
        // Push currentPage to NavHistory; 
        // Will also compare current page and  next_page NAV_MENU_GROUP.
        navigation.pushCurrentPageToNavHistory(next_page);
        
        navigation.showThisPage(next_page);
        
        
        // Show Page
        const go_back_page_id = PAGE_ID.ACC_FARROW_CHECKLIST;
        const go_back_page = navigation.getPageContainer(go_back_page_id);
        
        const options ={
            is_add:                 true,   // false is edit
            callback_after_add:     thisObj.onSuccessAddEntry,
            go_back_page:           go_back_page   
        }
        navigation.pageAccFChecklistAddEdit.show(options);
    }
    
    
    this.onSuccessAddEntry = function(){
        const callback_success = function(data){
            dataAccFarrowChecklist = navigation.pigFarm.accountLists.dataAccSowDueChecklist;
            thisObj.renderTable(dataAccFarrowChecklist);
        };
        
        navigation.pigFarm.accountLists.requestDataAccSowDueChecklist(
                callback_success, null, null);
    }
    
    
    this.onSuccessEditEntry = function(){
        
    }
    
    
    this.onClickRowEntry = function(entry_hid){
        const data_acc_pig_ops = thisObj.getDataAccPigOps(entry_hid);   
        
        const go_back_page_id = PAGE_ID.ACC_PIG_OPS_LIST;
        const go_back_page = navigation.getPageContainer(go_back_page_id);
    
        const options ={
            operation_type:         curAccPigOpsType,
            is_add:                 false,   // false is edit
            callback_after_edit:    thisObj.onSuccessEditEntry,
            go_back_page:           go_back_page 
        }
        navigation.pageAccPigOpsAddEdit.beforeShow(options, data_acc_pig_ops);
        
        
        const goto_page_id   = PAGE_ID.ACC_PIG_OPS_ADD_EDIT;
        const page_container = navigation.getPageContainer(goto_page_id);
        navigation.showThisPage(page_container);
    }
  
    
    
}
