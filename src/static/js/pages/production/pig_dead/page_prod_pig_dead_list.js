// page_prod_pig_dead_list.js

// March 7, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageTableBasic}         from '../../common/page_table_basic.js';
import {PageViewPigFarmPage}    from '../../common/page_view_basic.js';


import {APPLICATION,
        PAGE_ID,
        HASH_ROUTES,
        DATA_VER_NUM_PIG_FARM,
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
        
    }
    
    
    this._bindEventListenersThis = function(){
        
       
    }
    
    
    
    this.renderPage = function(page_data){
        thisObj.show();
    }
    
    
    this.getStorageKey = function(){
        return navigation.managerLocalData.STORAGE_KEY.OPERATIONS.PIG_DEAD;
    }
    
    
    // The data, data_ver_num comes from localStorage.
    this.updateDataSource = function(data, data_ver_num){
        // Update data source
        navigation.pigFarm.managerPigProd.dataProdPigDeadList = data;
        
        // Update data source version
        navigation.pigFarm.dataVerNum.pig_dead = data_ver_num;
    }
    
    
    // Display data
    this.displayData = function(){
        const data_list = navigation.pigFarm.managerPigProd.dataProdPigDeadList;
        thisObj.showInfoBox(data_list, elemPageInfo);
        thisObj.renderTable(data_list);
    }
    
    
    // Check server data update
    this.checkServerDataUpdate = function(){
        navigation.pigFarm.checkServerDataUpdate(
            DATA_VER_NUM_PIG_FARM.PIG_DEAD,
            thisObj.requestServerData);
    }
    
    
    this.show = function(options){
   
        // Get data source
        let data_list  = navigation.pigFarm.managerPigProd.dataProdPigDeadList;

        
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
                    //thisObj.showEditEntryPage(cur_entry);
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
    
    
    this.getPageIdAddEditPage = function(){
        return PAGE_ID.PIG_DEAD_ADD_EDIT;}
    
    
    this.getPageIdListPage = function(){
        return PAGE_ID.PIG_DEAD_LIST;}
    
    
    // Should return a reference to a function that has this signature:
    // func_name(options, row_entry);
    this.getFuncAddEditShowPage = function(){
        return navigation.pagePigDeadAddEdit.show;}
   
    
    this.getHashRouteAddEditPage = function(){
        return HASH_ROUTES.PIG_DEAD_ADD_EDIT;
    }
    
    
    this.getHashRouteListPage = function(){
        return HASH_ROUTES.PIG_DEAD_LIST;
    }
    
    
    
}
