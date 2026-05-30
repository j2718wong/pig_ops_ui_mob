// page_all_feed_balance_list.js

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



export function PageAllFeedBalanceList(input_settings){
    PageTableBasic.call(this);
    
    const TAG                   = 'PageAllFeedBalanceList';
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    this.setNavigation(navigation);
    
    
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
    

    let showOptions             = null;
    
    let dtCurrentDate           = null;
    
    
    this.init = function(){
        
        thisObj.setSettingsTable({
            noSearchAdd:    true,
            noHeader:       true,
            uniqueKey:      settings.uniqueKey,
            tableTitle:     'Feed Balance List',
            
            addEntryLink: {
                label:      'Add Feed Balance',
                onclickAddEntry:    thisObj.onClickAddEntry
            }
        });
        
        
        this.render();
        this.afterHtmlRender();
        
        this.afterHtmlRenderThis();

    }
    
    
    this.render = function(){
        let label_page_title    = 'Feed Balance List';
        
        let page_info   = `
            This is a list of Feed Balance. You can record periodic feed balance
            for each individual Production entry or for the whole farm. 
        `;
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_page_title    = helper.getSimpleTranslation('navigation.nav_links.Operations1') || label_page_title;
        page_info           = helper.getSimpleTranslation('page_info.feed_balance') || page_info;
                
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
        
        elemTableBody           = document.getElementById(elemIdTableBody);
    }
    
    
    this._processAfterHtmlRenderThis = function(){
        
        componentNavLeftRight.callbackNavLeft = function(){
            navigation.managerNavLinks.onClickNavFarrowingChecklist();
        };
        
          
        componentNavLeftRight.callbackNavRight = function(){
            navigation.managerNavLinks.onClickNavFarrowingSchedule();
        };
        
        
        componentNavLeftRight.bindEventListeners();
    }
    
    
    this._bindEventListenersThis = function(){
        
       
    }

    
    
    this._writeInlineStyle = function(){
        const html = ``;
        return html;
    }
    
    
    this.getElemTableBody = function(){
        return elemTableBody;
    }
    
    
    this.renderPage = function(){
        thisObj.show();
    }
    
    
    this.getStorageKey = function(){
        return navigation.managerLocalData.STORAGE_KEY.OPERATIONS.FEED_BALANCE;
    }
    
    
    // The data, data_ver_num comes from localStorage.
    this.updateDataSource = function(data, data_ver_num){
        // Update data source
        navigation.pigFarm.dataFeedBalanceList = data;
        
        // Update data source version
        navigation.pigFarm.dataVerNum.feed_balance = data_ver_num;
    }
    
    
    // Display data
    this.displayData = function(){
        const feed_balance_list = navigation.pigFarm.dataFeedBalanceList;
        
        // Get the last_entry of the list
        let data_list = feed_balance_list;
        
        if (feed_balance_list.length > 0){
            // Get the feed_buy from earliest date of feed_balance until now
            
            let feed_buy_list = navigation.pigFarm.dataFarmFeedBuyList;
            
            
            if (feed_buy_list == null){
                // The current design is the navigation.pigFarm.dataFarmFeedBuyList
                // is loaded from cache when user navigates to pagePigFarmFeedBuyList;
                // But since user is currently in feed balance list, need to load
                // feed_buy list from cache. 
                navigation.pagePigFarmFeedBuyList.loadCachedDataOnly();
            
                feed_buy_list = navigation.pigFarm.dataFarmFeedBuyList;
            }
             
            
            
            if (feed_buy_list){
                const combined = thisObj.insertFeedBuyToFeedBalance(feed_balance_list, feed_buy_list);
                data_list = combined;
            }
        }
        
        
        
        thisObj.showInfoBox(data_list, elemPageInfo);
        thisObj.renderTable(data_list);
    }
    
    
    this.insertFeedBuyToFeedBalance = function(feed_balance_list, feed_buy_list) {
        if (!feed_balance_list || feed_balance_list.length === 0) {
            return [];
        }
        
        if (!feed_buy_list || feed_buy_list.length === 0) {
            return feed_balance_list;
        }
        
        // Get the earliest feed_balance date (last entry in the list)
        const earliestBalance = feed_balance_list[feed_balance_list.length - 1];
        const earliestBalanceDate = earliestBalance.date_balance;
        
        // Filter feed_buy entries with date_buy >= earliest balance date
        // feed_buy_list is already sorted by date_buy descending (newest first)
        const relevantBuys = feed_buy_list.filter(buy => buy.pf_feed_buy.date_buy >= earliestBalanceDate);
        
       
        
        // Transform feed_buy entries to feed_balance format
        const transformedBuys = relevantBuys.map(buy => {
            // Initialize all feed type quantities to 0 (in sacks)
            const feedQuantities = {
                num_gestating: 0,
                num_lactating: 0,
                num_booster: 0,
                num_prestarter: 0,
                num_starter: 0,
                num_grower: 0,
                num_finisher: 0
            };
            
            // Aggregate quantities from feed_items (in sacks)
            if (buy.feed_items && buy.feed_items.length > 0) {
                for (const item of buy.feed_items) {
                    const feedTypeName = item.feed_type.name;
                    const quantity = item.feed_item.quantity;  // Number of sacks
                    
                    // Map feed_type.name to feed_balance field
                    switch (feedTypeName) {
                        case 'GESTA':
                            feedQuantities.num_gestating += quantity;
                            break;
                        case 'LACTA':
                            feedQuantities.num_lactating += quantity;
                            break;
                        case 'BOST':
                            feedQuantities.num_booster += quantity;
                            break;
                        case 'PRES':
                            feedQuantities.num_prestarter += quantity;
                            break;
                        case 'START':
                            feedQuantities.num_starter += quantity;
                            break;
                        case 'GROW':
                            feedQuantities.num_grower += quantity;
                            break;
                        case 'FINISH':
                            feedQuantities.num_finisher += quantity;
                            break;
                        default:
                            console.warn('Unknown feed type:', feedTypeName);
                    }
                }
            }
            
            // Create feed_balance object and filter out null/0 values
            const feedBalance = {
                hid: null
            };
            
            if (feedQuantities.num_gestating > 0){
                feedBalance.num_gestating = feedQuantities.num_gestating;
            }
            
            if (feedQuantities.num_lactating > 0){
                feedBalance.num_lactating = feedQuantities.num_lactating;
            }
            
            if (feedQuantities.num_booster > 0){
                feedBalance.num_booster = feedQuantities.num_booster;
            }
            
            if (feedQuantities.num_prestarter > 0){
                feedBalance.num_prestarter = feedQuantities.num_prestarter;
            }
            
            if (feedQuantities.num_starter > 0){
                feedBalance.num_starter = feedQuantities.num_starter;
            }
            
            if (feedQuantities.num_grower > 0){
                feedBalance.num_grower = feedQuantities.num_grower;
            }
            
            if (feedQuantities.num_finisher > 0){
                feedBalance.num_finisher = feedQuantities.num_finisher
            }
            
            
            return {
                date_balance: buy.pf_feed_buy.date_buy,
                is_feed_buy: 1,
                feed_balance: [feedBalance]
            };
        });
        
        
        
        // Merge transformed buys with original feed_balance
        const mergedList = [...transformedBuys, ...feed_balance_list];
        
        // Sort by date_balance in descending order (newest first)
        mergedList.sort((a, b) => new Date(b.date_balance) - new Date(a.date_balance));
    
        return mergedList;
    }
    
    
    // Check server data update
    this.checkServerDataUpdate = function(){
        navigation.pigFarm.checkServerDataUpdate(
            DATA_VER_NUM_PIG_FARM.FEED_BALANCE,
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
        let data_list  = navigation.pigFarm.dataFeedBalanceList;
        
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
            const data_list = navigation.pigFarm.dataFeedBalanceList;
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
        // - navigation.pigFarm.dataFeedBalanceList
        // - navigation.pigFarm.dataVerNum.feed_balance
        navigation.pigFarm.requestDataPigFarmFeedBalance(
                null, callback_success, callback_offline, null);
    }
    
     
    this.getHtmlTableHeader = function(){
        elemIdTableBody         = `${settings.uniqueKey}-table-tbody`;
        
        const html_style = this._writeInlineStyle();
        
        
        let label_date          = 'Date';
        let label_feed_balance  = 'Feed Balance';
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_date          = helper.getSimpleTranslation('common_app.labels.date') || label_date;
        label_feed_balance  = helper.getSimpleTranslation('feed_balance.labels.feed_balance') || label_feed_balance;
        
        
        const html = `
        ${html_style}
        
        <table class="data-table" id="">
            <colgroup>
                <col style="width: 30%;">
                <col style="width: 70%;">
            </colgroup>
            
            <thead>
                <tr>
                    <th>${label_date}</th>
                    <th>${label_feed_balance}</th>
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
        
        const dt_balance    = new Date(cur_entry.date_balance);
        const s_dt_balance  = formatDate(dt_balance, FORMAT_COMPACT);
        
        let is_feed_buy     = 0;
        
        let total_gesta     = 0;
        let total_lacta     = 0;
        let total_booster   = 0;
        let total_prestarter= 0;
        let total_starter   = 0;
        let total_grower    = 0;
        let total_finisher  = 0;
        
        
        for (const cur_item of cur_entry.feed_balance){
            if (cur_item.num_gestating) {total_gesta    += cur_item.num_gestating;}
            if (cur_item.num_lactating) {total_lacta    += cur_item.num_lactating;}
            if (cur_item.num_booster)   {total_booster  += cur_item.num_booster;}
            
            if (cur_item.num_prestarter){total_prestarter += cur_item.num_prestarter;}
            if (cur_item.num_starter)   {total_starter  += cur_item.num_starter;}
            if (cur_item.num_grower)    {total_grower   += cur_item.num_grower;}
            if (cur_item.num_finisher)  {total_finisher += cur_item.num_finisher;}
        }
        
        let s_plus = '';
        let s_style = '';
        
        if (cur_entry.is_feed_buy && cur_entry.is_feed_buy > 0){
            is_feed_buy = 1;
            s_plus = '+';
            s_style = `style="color:var(--corporate-blue-company)";`;
        }
        
        let html_feeds = '';
        
        if (total_gesta > 0){
            html_feeds += `<div ${s_style}>${s_plus}${total_gesta} GESTA</div>`;
        } 
        
        if (total_lacta > 0){
            html_feeds += `<div ${s_style}>${s_plus}${total_lacta} LACTA</div>`;
        }
        
        if (total_booster > 0){
            html_feeds += `<div ${s_style}>${s_plus}${total_booster} BOOSTER</div>`;
        }
        
        if (total_prestarter > 0){
            html_feeds += `<div ${s_style}>${s_plus}${total_prestarter} PRESTARTER</div>`;
        }
        
        if (total_starter > 0){
            html_feeds += `<divv${s_style}>${s_plus}${total_starter} STARTER</div>`;
        }
        
        if (total_grower > 0){
            html_feeds += `<div ${s_style}>${s_plus}${total_grower} GROWER</div>`;
        }
        
        if (total_finisher > 0){
            html_feeds += `<div ${s_style}>${s_plus}${total_finisher} FINISHER</div>`;
        }
        
        
        const html = `
            <tr>
                <td>${s_dt_balance}</td>
                <td>${html_feeds}</td>
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
        
        let is_feed_buy = 0;
        if (cur_entry.is_feed_buy && cur_entry.is_feed_buy > 0){
            is_feed_buy = 1;
        }
        
        const elem_tds = elem_row.querySelectorAll('td'); 
        
        let index = 0
        for (const cur_td of elem_tds){
            if (is_feed_buy == 0){
                if (index == 0 || index == 1){
                    cur_td.onclick = function(){
                        thisObj.onClickRowEntry(cur_entry);
                    };
                }
            }
            index += 1;
            
        } 
        
        return elem_row;
    }
    
    
    this.searchEntries = function(key){
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
        const goto_page_id   = PAGE_ID.ALL_FEED_BAL_ADD_EDIT;
        const next_page = navigation.getPageContainer(goto_page_id);
        
        // Push currentPage to NavHistory; 
        // Will also compare current page and  next_page NAV_MENU_GROUP.
        navigation.pushCurrentPageToNavHistory(next_page);
        
        navigation.showThisPage(next_page);
        
        
        // Show Page
        const go_back_page_id = PAGE_ID.ALL_FEED_BAL_LIST;
        const go_back_page = navigation.getPageContainer(go_back_page_id);
        
        const options ={
            is_add:                 true,   // false is edit
            go_back_page:           go_back_page   
        };
        navigation.pageAllFeedBalanceAddEdit.show(options);
        
    }
    

    
    this.onClickRowEntry = function(row_entry){
        
        if (row_entry){
            const goto_page_id   = PAGE_ID.ALL_FEED_BAL_ADD_EDIT;
            const page_container = navigation.getPageContainer(goto_page_id);
            navigation.showThisPage(page_container);
            
            
            const go_back_page_id = PAGE_ID.ALL_FEED_BAL_LIST;
            const go_back_page = navigation.getPageContainer(go_back_page_id);
        
            const options = {
                is_add:                 false,   // false is edit
                go_back_page:           go_back_page
            }
            navigation.pageAllFeedBalanceAddEdit.show(options, row_entry);

        }
    }
}
