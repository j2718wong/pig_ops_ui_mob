// page_prod_pig_dead_list.js

// March 7, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageTableBasic}         from '../../common/page_table_basic.js';
import {PageViewPigFarmPage}    from '../../common/page_view_basic.js';


import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE,
        PIG_PROD_TYPE,
        PROD_STATUS}            from '../../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        sortList}               from '../../../utils.js';

import {ComponentNavLeftRight}  from '../../common/ui/comp_nav_left_right.js';

import {getSowBoarReference}    from '../../common/common_app.js';


export function PageProdPigDeadList(input_settings){
    PageTableBasic.call(this);
    
    const TAG                   = 'PageProdPigDeadList';
    
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
    
    
    let showOptions             = null;
    
    
    let searchIncludeInsem      = true;
    
    let dtCurrentDate           = null;


    let farmPage                = new PageViewPigFarmPage();

    
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
        let label_page_title    = 'Dead Pigs';
        
        let page_info   = `
            This is a list of Dead pigs after birth. It is important
            to record dead pigs so that the actual pig count per production entry
            is accurate. 
        `;
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_page_title    = helper.getSimpleTranslation('navigation.nav_links.Operations4') || label_page_title;
        page_info           = helper.getSimpleTranslation('page_info.dead_pigs') || page_info;
        
        
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
            navigation.managerNavLinks.onClickNavBoarExternalMate();
        };
        
          
        componentNavLeftRight.callbackNavRight = function(){
            navigation.managerNavLinks.onClickNavFarrowingChecklist();
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
        
  
  
        if (options && options.refresh_list){
            this.requestServerData();
            return;
        }
  
   
        // Get data source
        let data_list  = navigation.pigFarm.managerPigProd.dataProdPigDeadList;

        
        if (data_list){
            // Display last known data
            thisObj.showInfoBox(data_list, elemPageInfo);
            thisObj.renderTable(data_list);
            
            this.checkDataUpdate();
            
            return;
        }
        
        
        // If data source is null, that means the page was unloaded;
            
        // Load cached data 
        const key = navigation.managerLocalData.STORAGE_KEY.OPERATIONS.PIG_DEAD;
        const cached = localStorage.getItem(key);
        if (!cached) {
            this.requestServerData();
            return;
        }
        
        
        const data = JSON.parse(cached);
        
        // Check if pig_farm_hid matched
        const cached_pig_farm_hid = data.pig_farm_hid;
        const pig_farm_hid = navigation.pigFarm.getPigFarmHid();
        if (cached_pig_farm_hid != pig_farm_hid){
            this.requestServerData();
            return;
        }
        
        
        // Optionally expire cache after 7 days
        if (data.cached_at && (Date.now() - data.cached_at) > APPLICATION.NUM_MSECS_CACHE_DATA) {
            // Cache too old, fetch fresh
            this.requestServerData();
            return;
        }
        
        
        // Update data source
        navigation.pigFarm.managerPigProd.dataProdPigDeadList = data.data;
        
        // Update data source version
        navigation.pigFarm.dataVerNum.pig_dead = data.ver_num;
        
        // Display cached data
        data_list  = navigation.pigFarm.managerPigProd.dataProdPigDeadList;
        thisObj.showInfoBox(data_list, elemPageInfo);
        thisObj.renderTable(data_list);
        
        
        this.checkDataUpdate();
    }
    
    
    this.checkDataUpdate = function(){
        // Request Server version num
        const callback_success = function(data){
            const data_ver_num_sow              = data[0];
            const data_ver_num_boar             = data[1];
            const data_ver_num_pig_prod         = data[2];
            const data_ver_num_prod_history     = data[3];
            const data_ver_num_staff            = data[4];
            const data_ver_num_feed_buy         = data[5];
            const data_ver_num_feed_balance     = data[6];
            const data_ver_num_not_pregnant     = data[7];
            const data_ver_num_boar_ext_mate    = data[8];
            const data_ver_num_pig_dead         = data[9];
            const data_ver_num_sow_due_checklist= data[10];
            
            if (data_ver_num_pig_dead > navigation.pigFarm.dataVerNum.pig_dead){
                thisObj.requestServerData();
            }
        };
        
        
        const callback_offline = function(){
            // nothing to do;
        };
        
        
        navigation.pigFarm.requestPigFarmDataVerNum(null, callback_success, 
            callback_offline, null);
    }
    
    
    this.requestServerData = function(){
        const callback_success = function(data){
            const data_list = navigation.pigFarm.managerPigProd.dataProdPigDeadList;
            thisObj.showInfoBox(data_list, elemPageInfo);
            thisObj.renderTable(data_list);
        };


        const callback_offline = function(){
            const data_list = navigation.pigFarm.managerPigProd.dataProdPigDeadList;
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
        // - navigation.pigFarm.managerPigProd.dataProdPigDeadList
        // - navigation.pigFarm.dataVerNum.pig_dead
        navigation.pigFarm.managerPigProd.requestProdPigDeadList(
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
        
        
        const html = `
        ${html_style}
        
        <table class="data-table table-prod-hist" id="">
            <colgroup>
                <col style="width: 33%;">
                <col style="width: 27%;">
                <col style="width: 40%;">
               
            </colgroup>

            <thead>
                <tr>
                    <th>
                        <div>PID, Sow</div> 
                        <div><span class="love-icon">❤️</span> Boar</div>
                    </th>
                    <th>Date Dead</th>
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
                <td colspan="3"><div>${label_no_entries}</div></td>
            </tr>
        `;
        return html;
    }
    

    this.getHtmlTableRow = function(cur_entry){
        
        // PID, Sow ❤ Boar column
        const html_pid_sow  = farmPage.getHtmlPidSowLoveBoar(cur_entry.production);
        
        const dt_dead   = new Date(cur_entry.pig_dead.date_dead);
        
        
        // Count how many days since birth
        const date_actual_birth = cur_entry.production.birth.date_actual;
        
        let html_date_dead = `${cur_entry.pig_dead.date_dead}`;
        if (date_actual_birth){
            const dt_birth = new Date(date_actual_birth);
            
            let diff_msecs    = dt_dead - dt_birth;
            let diff_days     = Math.round(diff_msecs / APPLICATION.NUM_MSECS_1DAY);
            
            const acc_settings_ops  = navigation.pigFarm.getSettingsOperations();
            
            // Adjust Day 1 on date of birth if needed
            if (acc_settings_ops){
                if (acc_settings_ops.day_1_on_date_of_birth > 0){
                    diff_days += 1;
                }
            }
            
            html_date_dead += ` <span class="nowrap">(Day ${diff_days})</span>`;  
        }
        
        
        let notes = '';
        if (cur_entry.pig_dead.notes){
            notes = cur_entry.pig_dead.notes;
        }
        
        // Dead Type + comments
        const s_desc = `
            <span class="dead-type"><b>${cur_entry.pig_dead.dead_type}</b></span>
            <span class="notes">${notes}</span>
        `;
        
        
        
        const html = `
            <tr>
                <td>${html_pid_sow}</td>
                <td>${html_date_dead}</td>
                <td>${s_desc}</td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.getElemTableRow = function(cur_entry){
        const elem_row = document.createElement('tr');
        
        const html = thisObj.getHtmlTableRow(cur_entry);
        elem_row.innerHTML = html;
        
        let pid = cur_entry.production.pig_production.farm_prod_id;
        
         

        
        // Attach onclick listeners to td
        
        const elem_tds = elem_row.querySelectorAll('td'); 
        
        let index = 0
        for (const cur_td of elem_tds){
        

            if (index == 0 || index == 1) {
                cur_td.onclick = function(){
                   
                }
            }
            
        
            index += 1;
        }
        
        return elem_row;
    }
    
    
    this.searchEntries = function(key){
        const data_list = navigation.pigFarm.managerPigProd.dataProdPigDeadList;
        
        
        const filtered = [];
        for (const cur_entry of data_list){
            
            let u_sow_name          = null;
            let u_sow_number        = null;
            
            let u_boar_name         = null;
            let u_boar_number       = null;
            
            let u_semen_supplier    = null;
            let u_semen_name        = null;
            
            
            let s_pid   = `${cur_entry.pig_production.farm_prod_id}`;
            
            if (cur_entry.sow.name){
                u_sow_name = cur_entry.sow.name.toUpperCase();
            }
            
            if (cur_entry.sow.number){
                u_sow_number = cur_entry.sow.number.toUpperCase();
            }
            
            
            let insemination = cur_entry.insemination;
            
            switch (insemination.insem_type){
                case 'B': {
                    if (insemination.boar.name){
                        u_boar_name = insemination.boar.name.toUpperCase();
                    }
                    
                    if (insemination.boar.number){
                        u_boar_number = insemination.boar.number.toUpperCase();
                    }
                    
                    break;
                }
                
                case 'AI_X': {
                    u_semen_supplier = insemination.ai.semen_supplier.name.toUpperCase();
                    u_semen_name    = insemination.ai.semen_supplier.semen.name.toUpperCase();
                    
                    break;
                }
                
                case 'AI_N': {
                    if (insemination.ai.internal_boar.name){
                        u_boar_name = insemination.ai.internal_boar.name.toUpperCase();
                    }
                    
                    if (insemination.ai.internal_boar.number){
                        u_boar_number = insemination.ai.internal_boar.number.toUpperCase();
                    }
                    
                    break;
                }
            }
            
            
            if (s_pid.startsWith(key)){
                filtered.push(cur_entry);
                continue;
            }
            
            
            if (u_sow_name){
                if (u_sow_name.startsWith(key)){
                    filtered.push(cur_entry);
                    continue;
                }
            }
            
            if (u_sow_number){
                if (u_sow_name.startsWith(key)){
                    filtered.push(cur_entry);
                    continue;
                }
            }
            
            
            if (searchIncludeInsem){
                if (u_boar_name){
                    if (u_boar_name.startsWith(key)){
                        filtered.push(cur_entry);
                        continue;
                    }
                }
                
                if (u_boar_number){
                    if (u_boar_number.startsWith(key)){
                        filtered.push(cur_entry);
                        continue;
                    }
                }
                
                if (u_semen_supplier){
                    if (u_semen_supplier.startsWith(key)){
                        filtered.push(cur_entry);
                        continue;
                    }
                }
            
                if (u_semen_name){
                    if (u_semen_name.startsWith(key)){
                        filtered.push(cur_entry);
                        continue;
                    }
                }
            }
            
        } 
        
        
        return filtered;
    }
    
    
    this.getEntry = function(entry_hid){
        const data_list = navigation.pigFarm.managerPigProd.dataProdPigDeadList;
        
        for (const cur_entry of data_list){
            if (cur_entry.pig_dead.hid == entry_hid){
                return cur_entry;
            }
        }
        
        return null;
    }
    
    
    this.onClickAddEntry = function(){
        // Show Container
        const next_page = navigation.getPageContainer(PAGE_ID.PIG_DEAD_ADD_EDIT);
        
        // Push currentPage to NavHistory; 
        // Will also compare current page and  next_page NAV_MENU_GROUP.
        navigation.pushCurrentPageToNavHistory(next_page);
        
        navigation.showThisPage(next_page);
        
        
        // Show Page
        const go_back_page_id = PAGE_ID.PIG_DEAD_LIST;
        const go_back_page = navigation.getPageContainer(go_back_page_id);
        
        const options ={
            is_add:                 true,   // false is edit
            go_back_page:           go_back_page   
        }
        navigation.pagePigDeadAddEdit.show(options);
    }
    
    
    this.onClickRowEntry = function(entry_hid){
        /*
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
        */ 
    }
  
    
    
}
