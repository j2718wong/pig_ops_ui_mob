// page_boar_external_mate_list.js

// March 22, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageTableBasic}         from '../../common/page_table_basic.js';
import {calculateNumDaysSinceInsem}  from '../../common/page_view_basic.js';


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


export function PageBoarExternalMateList(input_settings){
    PageTableBasic.call(this);
    
    const TAG                   = 'PageBoarExternalMateList';
    
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
    let elemIdLabelToday        = null;
    let elemIdDateToday         = null;
    
    let elemIdTableBody         = null;
    

    let elemPageInfo            = null;
    let elemLabelToday          = null;
    let elemDateToday           = null;
    
    let elemTableBody           = null;

    
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
        let label_page_title    = 'Boar External Mates';
        
        let label_today         = 'Today';
        
        let page_info   = `
            This is a list of External Mates of your Boars. This is used to record 
            if your boars are used to breed your neighbor sows.
        `;
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_page_title    = helper.getSimpleTranslation('navigation.nav_links.Operations3') || label_page_title;
        label_today         = helper.getSimpleTranslation('common_app.labels.today') || label_today;
        
        page_info           = helper.getSimpleTranslation('page_info.boar_ext_mate') || page_info;
        
        componentNavLeftRight   = new ComponentNavLeftRight({
           uniqueKey:           settings.uniqueKey,
           elemDivContainer:    elemDivContainer,
           pageTitle:           label_page_title
        });
        
        
        elemIdPageInfo          = `${settings.uniqueKey}-page-info`;
        
        elemIdLabelToday        = `${settings.uniqueKey}-label-today`;
        elemIdDateToday         = `${settings.uniqueKey}-date-today`;
        
        
        
        const html_nav          = componentNavLeftRight.getHtml();   
        const html_table        = thisObj.getHtml();
           

           
        const html = `

<div class="mobile-container">
    ${html_nav}
    
    <div class="mobile-info-box" id="${elemIdPageInfo}">
        ${page_info}
    </div>
    
    <div style="text-align: center;">
        <span id="${elemIdLabelToday}">${label_today}</span>
        <span id="${elemIdDateToday}" style="color:blue; font-weight:600;"></span>
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
        
        elemLabelToday          = elemDivContainer.querySelector('#'+elemIdLabelToday);
        elemDateToday           = elemDivContainer.querySelector('#'+elemIdDateToday);
        
        elemTableBody           = elemDivContainer.querySelector('#'+elemIdTableBody);
    }
    
    
    this._processAfterHtmlRenderThis = function(){
        
        componentNavLeftRight.callbackNavLeft = function(){
            navigation.managerNavLinks.onClickNavFarrowingSchedule();
        };
        
          
        componentNavLeftRight.callbackNavRight = function(){
            navigation.managerNavLinks.onClickNavPigDead();
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
        
        
        const s_dt_current = formatDate(dtCurrentDate, FORMAT_COMPACT);
        elemDateToday.textContent = s_dt_current;
        

        
        if (options && options.refresh_list){
            this.requestServerData();
            return;
        }
        

        // Get data source
        let data_list = navigation.pigFarm.managerSowBoar.dataBoarExtMateList;
        
        if (data_list){
            // Display last known data
            thisObj.showInfoBox(data_list, elemPageInfo);
            thisObj.renderTable(data_list);
            
            this.checkDataUpdate();
            
            return;
        } 

        
        // If data source is null, that means the page was unloaded;
            
        // Load cached data 
        const key = navigation.managerLocalData.STORAGE_KEY.OPERATIONS.BOAR_EXT_MATE;
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
        navigation.pigFarm.managerSowBoar.dataBoarExtMateList = data.data;
        
        // Update data source version
        navigation.pigFarm.dataVerNum.boar_ext_mate = data.ver_num;
        
        // Display cached data
        data_list = navigation.pigFarm.managerSowBoar.dataBoarExtMateList;
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
            
            if (data_ver_num_boar_ext_mate > navigation.pigFarm.dataVerNum.boar_ext_mate){
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
            const data_list = navigation.pigFarm.managerSowBoar.dataBoarExtMateList;
            thisObj.showInfoBox(data_list, elemPageInfo);
            thisObj.renderTable(data_list);
        };
        
        const callback_offline = function(){
            const data_list = navigation.pigFarm.managerSowBoar.dataBoarExtMateList;
            
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
        // - navigation.pigFarm.managerSowBoar.dataBoarExtMateList
        // - navigation.pigFarm.dataVerNum.boar_ext_mate
        navigation.pigFarm.managerSowBoar.requestBoarExtMateList(
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
        let label_sow_owner     = 'Sow Owner';
        let label_date_mate     = 'Date Mate';
        let label_date_expected = 'Date Expected';
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_boar              = helper.getSimpleTranslation('common_app.labels.boar') || label_boar;
        
        label_sow_owner         = helper.getSimpleTranslation('page_boar_external_mates.labels.sow_owner') || label_sow_owner;
        label_date_mate         = helper.getSimpleTranslation('page_boar_external_mates.labels.date_mate') || label_date_mate;
        label_date_expected     = helper.getSimpleTranslation('page_boar_external_mates.labels.date_expected') || label_date_expected;
        
        
        const html = `
        ${html_style}
        
        <table class="data-table table-prod-hist" id="">
            <colgroup>
                <col style="width: 25%;">
                <col style="width: 25%;">
                <col style="width: 22%;">
                <col style="width: 28%;">

               
            </colgroup>

            <thead>
                <tr>
                    <th>${label_boar}</th>
                    <th>${label_sow_owner}</th>
                    <th>${label_date_mate}</th>
                    <th>${label_date_expected}</th>
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
                <td colspan="4"><div>${label_no_entries}</div></td>
            </tr>
        `;
        return html;
    }
    

    this.getHtmlTableRow = function(cur_entry){

        const boar_name = getSowBoarReference(cur_entry.sow_boar);
        
        const dt_mate           = new Date(cur_entry.date_mate);
        const s_date_mate       = formatDate(dt_mate, FORMAT_COMPACT);
        
        const dt_expected       = new Date(cur_entry.date_expected_birth);
        const s_date_exp_birth  = formatDate(dt_expected, FORMAT_COMPACT);
        
        
        const acc_settings_ops  = navigation.pigFarm.getSettingsOperations();
        
        // Set important date; 
        let s_date_important = ''
        let dt_important = new Date(cur_entry.date_expected_birth);
        let dt_important_s = formatDate(dt_important, FORMAT_COMPACT);
        
        let diff_days = calculateNumDaysSinceInsem(
                    cur_entry.date_mate, 
                    dtCurrentDate,
                    acc_settings_ops);
                    
        s_date_important = `${dt_important_s} <span class="nowrap">(Day ${diff_days}</span>)`;

        
        const html = `
            <tr>
                <td>${boar_name}</td>
                <td>${cur_entry.boar_customer.name}</td>
                <td>${s_date_mate}</td>
                <td>${s_date_important}</td>
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
        

            if (index == 0 || index == 1) {
                cur_td.onclick = function(){
                   
                }
            }
            
        
            index += 1;
        }
        
        return elem_row;
    }
    
    
    
    
    this.searchEntries = function(key){
        const data_list = navigation.pigFarm.managerSowBoar.dataBoarExtMateList;
        
        const filtered = [];
        for (const cur_entry of data_list){
            
            let u_boar_name         = null;
            let u_boar_number       = null;
            
            let u_customer_name     = null;
            
                      
            if (cur_entry.sow_boar.name){
                u_boar_name = cur_entry.sow_boar.name.toUpperCase();
            }
            
            if (cur_entry.sow_boar.number){
                u_boar_number = cur_entry.sow_boar.number.toUpperCase();
            }
            
            
            u_customer_name = cur_entry.boar_customer.name.toUpperCase();
            
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
            
            
            if (u_customer_name.startsWith(key)){
                filtered.push(cur_entry);
                continue;
            }
            
        } 
        
        
        return filtered;
    }
    
    
    this.getEntry = function(entry_hid){
        const data_list = navigation.pigFarm.managerSowBoar.dataBoarExtMateList;
        
        for (const cur_entry of data_list){
            if (cur_entry.hid == entry_hid){
                return cur_entry;
            }
        }
        
        return null;
    }
    
    
    
    
    this.onClickAddEntry = function(){
        // Show Container
        const next_page = navigation.getPageContainer(PAGE_ID.BOAR_EXT_MATE_ADD_EDIT);
        
        // Push currentPage to NavHistory; 
        // Will also compare current page and  next_page NAV_MENU_GROUP.
        navigation.pushCurrentPageToNavHistory(next_page);
        
        navigation.showThisPage(next_page);
        
        
        // Show Page
        const go_back_page_id = PAGE_ID.BOAR_EXT_MATE_LIST;
        const go_back_page = navigation.getPageContainer(go_back_page_id);
        
        const options ={
            is_add:                 true,   // false is edit
            go_back_page:           go_back_page   
        }
        navigation.pageBoarExtMateAddEdit.show(options);
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
