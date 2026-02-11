// February 3, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageTableBasic}         from '../common/page_table_basic.js';

import {APPLICATION,
        PAGE_ID,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        SOW_STATUS_NAME,
        MULTIKEY_OBJ_TYPE,
        PROD_STATUS}            from '../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        FORMAT_COMPACT_NO_SPACE} from '../../utils.js';


/*

*/

export function TablePigFarmFeedBuy(input_settings){
    PageTableBasic.call(this);
    
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

    let elemIdTableBody         = null;

    
    let elemTableBody           = null;
    



    //let textTranslation         = new TextTranslation();
    let curUserLanguageKey      = 'en';


    let showOptions             = null;
    
    let dtCurrentDate           = null;
    
    
    let dataFarmFeedBuyList     = null;
    
    
    this.init = function(){
        
        thisObj.setSettingsTable({
            uniqueKey:      settings.uniqueKey,
            tableTitle:     'Farm Feed Buy'
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
        .table-farm-feed-buy td {padding-right:0}
    </style>
    `;
        return html;
    }
    
    
    this.getElemTableBody = function(){
        return elemTableBody;
    }
    
    
    this.beforeShow = function(){
        
        
        // Request data if not yet requested
        dataFarmFeedBuyList = navigation.pigFarm.dataFarmFeedBuyList;
        if (dataFarmFeedBuyList == null){
            
            const callback_success = function(data){
                dataFarmFeedBuyList = navigation.pigFarm.dataFarmFeedBuyList;
                
                thisObj.setDataEntryList(dataFarmFeedBuyList);
                thisObj.renderTable(dataFarmFeedBuyList);
            };
            
            let elem_show_error = thisObj.elemServerErrorMsg;
       
            
            navigation.pigFarm.requestDataPigFarmFeedBuyList(callback_success, 
                elem_show_error);
        
        }
        else{
            thisObj.setDataEntryList(dataFarmFeedBuyList);
            thisObj.renderTable(dataFarmFeedBuyList);
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
        
        const html_style = this._writeInlineStyle();
        
        
        const html = `
        ${html_style}
        
        <table class="data-table table-medvac" id="">
            <colgroup>
                <col style="width: 20%;">
                <col style="width: 25%;">
                <col style="width: 35%;">
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
        
        const html = `
            <tr>
                <td>${formatDate(dt_feed_buy, FORMAT_COMPACT)}</td>
                <td>${cur_entry.feed_supplier.name}</td>
                <td></td>
                <td></td>
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
            
            if (index == 0 || index == 1){
                cur_td.onclick = function(){
                    thisObj.onClickRowEntry(cur_entry.pf_feed_buy.hid);
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
        for (const cur_entry of dataFarmFeedBuyList){
            if (cur_entry.pf_feed_buy.hid == entry_hid){
                return cur_entry;
            }
        }
        
        return null;
    }
    
    
    this.onClickAddEntry = function(){
        
        const go_back_page_id = PAGE_ID.FARM_FEED_BUY_LIST;
        const go_back_page = navigation.getPageContainer(go_back_page_id);
        
        const options ={
            is_add:                 true,   // false is edit
            callback_after_add:     thisObj.onSuccessAddEntry,
            go_back_page:           go_back_page   
        };
        navigation.pagePfFeedBuyAddEdit.beforeShow(options);
        

        const goto_page_id   = PAGE_ID.FARM_FEED_BUY_ADD_EDIT;
        const page_container = navigation.getPageContainer(goto_page_id);
        navigation.showThisPage(page_container);
    }
    
    
    this.onSuccessAddEntry = function(){
        console.log('todo  onSuccessAddEntry');
        
    }
    
    
    this.onSuccessEditEntry = function(){

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
            navigation.pagePfFeedBuyAddEdit.beforeShow(options, row_entry);
            
            
            const goto_page_id   = PAGE_ID.FARM_FEED_BUY_ADD_EDIT;
            const page_container = navigation.getPageContainer(goto_page_id);
            navigation.showThisPage(page_container);
        }
    }
}
