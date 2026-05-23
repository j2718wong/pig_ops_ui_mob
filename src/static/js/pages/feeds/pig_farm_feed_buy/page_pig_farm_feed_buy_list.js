// page_pig_farm_feed_buy_list.js

// February 3, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageTableBasic}         from '../../common/page_table_basic.js';

import {APPLICATION,
        PAGE_ID,
        DATA_VER_NUM_PIG_FARM,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        SOW_STATUS_NAME,
        MULTIKEY_OBJ_TYPE,
        PROD_STATUS}            from '../../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        FORMAT_COMPACT_NO_SPACE} from '../../../utils.js';

import {ComponentNavLeftRight}  from '../../common/ui/comp_nav_left_right.js';

/*

*/

export function PagePigFarmFeedBuyList(input_settings){
    PageTableBasic.call(this);
    
    const TAG                   = 'PagePigFarmFeedBuyList';
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    
    /*
    Typical input_settings
    {
        navigation:             navigation,
        elemIdDivContainer:     elemIdContFarmFeedBuyList,
        uniqueKey:              'farm-feed-buy-list'
    }   
    */  
    const settings              = input_settings;
    
    
    let elemDivContainer        = document.getElementById(settings.elemIdDivContainer);

    let componentNavLeftRight   = null;
    
    
    let elemIdPageInfo          = null;
    let elemIdTableBody         = null;
    

    let elemPageInfo            = null;
    let elemTableBody           = null;
    
    



    //let textTranslation         = new TextTranslation();
    let curUserLanguageKey      = 'en';


    let showOptions             = null;
    
    let dtCurrentDate           = null;
    
    
    
    this.init = function(){
        
        thisObj.setSettingsTable({
            uniqueKey:      settings.uniqueKey,
            noHeader:       true
        });
        
        
        this.render();
        
        this.afterHtmlRender();  // This will call the parent method 
        this.afterHtmlRenderThis();

    }
    
    
    this.render = function(){
        
        componentNavLeftRight   = new ComponentNavLeftRight({
           uniqueKey:           settings.uniqueKey,
           elemDivContainer:    elemDivContainer,
           pageTitle:           'Farm Feed Buy'
        });


        elemIdPageInfo          = `${settings.uniqueKey}-page-info`;
        
        const html_nav          = componentNavLeftRight.getHtml();
        const html_table        = thisObj.getHtml();
           

        const html = `

<div class="mobile-container">
    ${html_nav}
    
    <!-- Mobile Info Box -->
    <!--
    <div class="mobile-info-box">
        <div class="info-text" id="${elemIdPageInfo}">
        </div>
    </div>
    -->
    
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
        elemTableBody           = document.getElementById(elemIdTableBody);
    }
    
    
    this._processAfterHtmlRenderThis = function(){
        componentNavLeftRight.callbackNavLeft = function(){
            navigation.managerNavLinks.onClickNavProdSales();
        };
        
          
        componentNavLeftRight.callbackNavRight = function(){
            navigation.managerNavLinks.onClickNavSummaryReports();
        };
        
        
        componentNavLeftRight.bindEventListeners();

        
        
        // Set onclick listener to parent object
        thisObj.setOnClickAddEntry(thisObj.onClickAddEntry); 
    }
    
    
    this._bindEventListenersThis = function(){
    }
    
    
    
    this._writeInlineStyle = function(){
        const html = `
    <style>
        
        /* Updated Table Styles */
        .table-farm-feed-buy td {padding-right:0}
    </style>
    `;
        return html;
    }
    
    
    this.getElemTableBody = function(){
        return elemTableBody;
    }
    
    
    this.renderPage = function(page_data){
        thisObj.show();
    }
    
    
    this.getStorageKey = function(){
        return navigation.managerLocalData.STORAGE_KEY.FINANCIALS.FEED_BUY;
    }
    
    
    // The data, data_ver_num comes from localStorage.
    this.updateDataSource = function(data, data_ver_num){
        // Update data source
        navigation.pigFarm.dataFarmFeedBuyList = data;
        
        // Update data source version
        navigation.pigFarm.dataVerNum.feed_buy = data_ver_num;
    }
    
    
    // Display data
    this.displayData = function(){
        const data_list = navigation.pigFarm.dataFarmFeedBuyList;
        thisObj.showInfoBox(data_list, elemPageInfo);
        thisObj.renderTable(data_list);
    }
    
    
    // Check server data update
    this.checkServerDataUpdate = function(){
        navigation.pigFarm.checkServerDataUpdate(
            DATA_VER_NUM_PIG_FARM.FEED_BUY,
            thisObj.requestServerData);
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
        let data_list = navigation.pigFarm.dataFarmFeedBuyList;
        
        
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
        const callback_success = function(data){
            const data_list = navigation.pigFarm.dataFarmFeedBuyList;
            thisObj.showInfoBox(data_list, elemPageInfo);
            thisObj.renderTable(data_list);
        };


        const callback_offline = function(){
            const data_list = navigation.pigFarm.dataFarmFeedBuyList;
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
        // - navigation.pigFarm.dataFarmFeedBuyList
        // - navigation.pigFarm.dataVerNum.feed_buy
        navigation.pigFarm.requestDataPigFarmFeedBuyList(
                callback_success, callback_offline, null);
    }

    
     
    this.getHtmlTableHeader = function(){
        elemIdTableBody         = `${settings.uniqueKey}-table-tbody`;
        
        const html_style = this._writeInlineStyle();
        
        
        const html = `
        ${html_style}
        
        <table class="data-table table-medvac" id="">
            <colgroup>
                <col style="width: 20%;">
                <col style="width: 25%;">
                <col style="width: 28%;">
                <col style="width: 27%;">
            </colgroup>
            
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Supplier</th>
                    <th>Feeds</th>
                    <th>Cost</th>
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
                <td colspan="4"><div>No Entries</div></td>
            </tr>
        `;
        return html;
    }
    

    this.getHtmlTableRow = function(cur_entry){
        
        const dt_feed_buy = new Date(cur_entry.pf_feed_buy.date_buy);
        
        let html_feeds = '';
        let total_cost = 0.0;
        
        for (const cur_item of cur_entry.feed_items){
            const html_feed = `
            <div>${cur_item.feed_item.quantity} ${cur_item.feed_type.name}   
            </div>
            `;
            html_feeds += html_feed;
            
            total_cost += cur_item.feed_item.total_cost;
        }
        
        if (cur_entry.pf_feed_buy.other_cost){
            total_cost += cur_entry.pf_feed_buy.other_cost;
        }
        
        
        const s_total_cost = thisObj.moneyFormatter.format(total_cost);
        
        const html = `
            <tr>
                <td>${formatDate(dt_feed_buy, FORMAT_COMPACT)}</td>
                <td>${cur_entry.feed_supplier.name}</td>
                <td>${html_feeds}</td>
                <td>${s_total_cost}</td>
            </tr>
        `;
        
        return html;
    }
    
    
      
    this.getElemTableRow = function(cur_entry){
        const elem_row = document.createElement('tr');
        
        const html = thisObj.getHtmlTableRow(cur_entry);
        elem_row.innerHTML = html;
         

        
        // TODO still evaluating if onclick is for row, td or span in td;
        // To avoid un necessary clicks while scrolling. 
        
        
        // Attach onclick listeners to td
        
        
        const elem_tds = elem_row.querySelectorAll('td'); 
        
        let index = 0
        for (const cur_td of elem_tds){
            
            if (index == 0 || index == 1 || index == 2){
                cur_td.onclick = function(){
                    thisObj.onClickRowEntry(cur_entry.pf_feed_buy.hid);
                };
                        
            }
            
            index += 1;
        } 
        
        return elem_row;
    }
    
    
    
    this.searchEntries = function(key){
        const data_list = navigation.pigFarm.dataFarmFeedBuyList;
        
        if (key == ''){return data_list;}
        
        
        const filtered = [];
        
        
        for (const cur_entry of data_list){
            let u_feed_supplier = cur_entry.feed_supplier.name.toUpperCase();
            
            if (u_feed_supplier.includes(key)){
                filtered.push(cur_entry);
            }
        }
        
        return filtered;
    }
    
    
    this.getEntry = function(entry_hid){
        const data_list = navigation.pigFarm.dataFarmFeedBuyList;
        
        for (const cur_entry of data_list){
            if (cur_entry.pf_feed_buy.hid == entry_hid){
                return cur_entry;
            }
        }
        
        return null;
    }
    
    
    this.onClickAddEntry = function(){
        // Show Container
        const next_page = navigation.getPageContainer(PAGE_ID.FARM_FEED_BUY_ADD_EDIT);
        
        // Push currentPage to NavHistory; 
        // Will also compare current page and  next_page NAV_MENU_GROUP.
        navigation.pushCurrentPageToNavHistory(next_page);
        
        navigation.showThisPage(next_page);
        
        
        // Show Page
        const go_back_page_id = PAGE_ID.FARM_FEED_BUY_LIST;
        const go_back_page = navigation.getPageContainer(go_back_page_id);
        
        const options ={
            is_add:                 true,   // false is edit
            callback_after_add:     thisObj.onSuccessAddEntry,
            go_back_page:           go_back_page   
        };
        navigation.pagePfFeedBuyAddEdit.show(options);
    }
    
    
    
    this.onClickRowEntry = function(entry_hid){
        const row_entry = thisObj.getEntry(entry_hid);

        if (row_entry){
            const go_back_page_id = PAGE_ID.FARM_FEED_BUY_LIST;
            const go_back_page = navigation.getPageContainer(go_back_page_id);
        
            const options ={
                is_add:                 false,   // false is edit
                callback_after_edit:    thisObj.onSuccessEditEntry,
                go_back_page:           go_back_page
            }
            navigation.pagePfFeedBuyAddEdit.show(options, row_entry);
            
            
            const goto_page_id   = PAGE_ID.FARM_FEED_BUY_ADD_EDIT;
            const page_container = navigation.getPageContainer(goto_page_id);
            navigation.showThisPage(page_container);
        }
    }
}
