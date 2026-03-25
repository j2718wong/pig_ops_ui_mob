// January 12, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageTableBasic}         from '../../common/page_table_basic.js';

import {APPLICATION,
        PAGE_ID,
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



export function TableFeedBuyItems(input_settings){
    PageTableBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    /*
    Typical input_settings
    {
        navigation:             navigation,
        parentObj:              thisObj,
        uniqueKey:              'feed-buy-items',
        elemDivContainer:       '<element>'
    }   
    */  
    const settings              = input_settings;
    
    
    let elemDivContainer        = settings.elemDivContainer;

    let elemIdTableBody         = null;

    
    let elemTableBody           = null;
    



    //let textTranslation         = new TextTranslation();
    let curUserLanguageKey      = 'en';


    let showOptions             = null;
    
    let dtCurrentDate           = null;
    
    // This can be a data_sow_boar, data_pig_prod or data_prod_group
    let curDataEntry            = null;
    
    
    this.init = function(){
        
        thisObj.setSettingsTable({
            uniqueKey:      settings.uniqueKey,
            noHeader:       false,
            noSearchAdd:    true,
            noControlsBar:  true,
            itemsPerPage:   20,
            tableTitle:     'Feed Items',
            
            addEntryLink: {
                label:      'Add Feed Item',
                onclickAddEntry: thisObj.onClickAddEntry
            }
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
    
    
    this._writeInlineStyle = function(){
        const html = `
    <style>
        
        /* Updated Table Styles */
        .table-feed-buy-items td {padding-right:0;}
        .table-feed-buy-items th {padding-right:0;}
    </style>
    `;
        return html;
    }
    
    
    this.getElemTableBody = function(){
        return elemTableBody;
    }
    
    
    this.beforeShow = function(data_entry){
        curDataEntry = data_entry;

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
        
        const html_style = this._writeInlineStyle();
        
        
        const html = `
        ${html_style}
        
        <table class="data-table table-feed-buy-items" id="">
            <colgroup>
                <col style="width: 14%;">
                <col style="width: 16%;">
                <col style="width: 25%;">
                <col style="width: 21%;">
            </colgroup>
            
            <thead>
                
                <tr>
                    <th>Qty</th>
                    <th>Type</th>
                    <th>Brand</th>
                    <th>Price</th>
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
                <td colspan="5"><div>No Entries</div></td>
            </tr>
        `;
        return html;
    }
    

    this.getHtmlTableRow = function(cur_entry){
        
        const s_unit_cost = thisObj.moneyFormatter.format(cur_entry.feed_item.unit_cost);
        const s_total_cost = thisObj.moneyFormatter.format(cur_entry.feed_item.total_cost);
        
        const html = `
            <tr>
                <td>${cur_entry.feed_item.quantity}</td>
                <td>${cur_entry.feed_type.name}</td>
                <td>${cur_entry.feed_brand.name}</td>
                <td style="text-align:right;">${s_unit_cost}</td>
                <td style="text-align:right; padding-right:4px;">${s_total_cost}</td>
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
                    thisObj.onClickRowEntry(cur_entry.feed_item.hid);
                };
                        
            }
            
            index += 1;
        } 
        
        return elem_row;
    
    }
    
    
    
    this.search = function(key){
        
    }
    
    
        
    this.setUserLanguage = function(language_key){
        curUserLanguageKey = language_key;
        thisObj.onUserChangeLanguage();
    }
    
    
    this.onUserChangeLanguage = function(){
        
       
    }
    
    
    this.getEntry = function(entry_hid){
        const cur_data_entry = parentObj.getDataPigFarmFeedBuy();
        const data_list = cur_data_entry.feed_items;
        
        for (const cur_entry of data_list){
            if (cur_entry.feed_item.hid == entry_hid){
                return cur_entry;
            }
        } 
        
         
        return null;
    }
    
    
    this.onClickAddEntry = function(){
        const go_back_page_id = PAGE_ID.FARM_FEED_BUY_ADD_EDIT;
        const go_back_page = navigation.getPageContainer(go_back_page_id);
        
        const cur_data_entry = parentObj.getDataPigFarmFeedBuy();
        const options ={
            is_add:                 true,   // false is edit
            callback_after_add:     thisObj.onSuccessAddEntry,
            pig_farm_feed_buy:      cur_data_entry,
            go_back_page:           go_back_page 
        };
        navigation.pagePfFeedBuyItemAddEdit.beforeShow(null, options);
        
        
        
        const goto_page_id  = PAGE_ID.FARM_FEED_BUY_ITEM_ADD_EDIT;
        const page_container = navigation.getPageContainer(goto_page_id);
        navigation.showThisPage(page_container);
        
        
    }
    
    
    
    this.onSuccessAddEntry = function(){
        const pig_farm_feed_buy = parentObj.getDataPigFarmFeedBuy();
        
        const callback_success = function(data){
            const data_list = pig_farm_feed_buy.feed_items;
            thisObj.setDataEntryList(data_list);
            thisObj.renderTable(data_list);
            
            // Jusy use this instead of requesting the whole pig_farm_feed_buy
            // object.
            parentObj.recalculateFeedItemsTotal();
        };
        
        navigation.pigFarm.requestDataPigFarmFeedBuyItems(
            pig_farm_feed_buy, callback_success, thisObj.elemServerErrorMsg
        );
        
    }
    
    
    this.onSuccessEditEntry = function(){
        thisObj.onSuccessAddEntry();  // same as this.onSuccessAddEntry
    }
    
    
    
    this.onClickRowEntry = function(entry_hid){
        const row_entry = thisObj.getEntry(entry_hid);
        

        if (row_entry){
            const go_back_page_id = PAGE_ID.FARM_FEED_BUY_ADD_EDIT;
            const go_back_page = navigation.getPageContainer(go_back_page_id);
            
            const cur_data_entry = parentObj.getDataPigFarmFeedBuy();
            
            const options ={
                is_add:                 false,   // false is edit
                callback_after_edit:    thisObj.onSuccessEditEntry,
                pig_farm_feed_buy:      cur_data_entry,
                go_back_page:           go_back_page
            };
            navigation.pagePfFeedBuyItemAddEdit.beforeShow(row_entry, options);
            
            
            const goto_page_id   = PAGE_ID.FARM_FEED_BUY_ITEM_ADD_EDIT;
            const page_container = navigation.getPageContainer(goto_page_id);
            navigation.showThisPage(page_container);
        }
    }
}
