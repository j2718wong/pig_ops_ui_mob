// February 18, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageTableBasic}         from '../../common/page_table_basic.js';


import {getSowBoarReference}    from '../../common/common_app.js';


import {APPLICATION,
        PAGE_ID,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        SOW_STATUS_NAME}        from '../../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        sortList,
        createPaginationManager} from '../../../utils.js';



export function TableFeedBalance(input_settings){
    PageTableBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    
    /*
    Typical input_settings
    {
        navigation:             this,
        parentObj:              thisObj,
        uniqueKey:              'prod-fat-feed-bal'
        elemDivContainer:       '<element>',
        parentPageId:           PAGE_ID.PROD_FATTENING_ENTRY
        
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
    
    
    let dataPigProd             = null;
    
    
    this.init = function(){
        
        thisObj.setSettingsTable({
            uniqueKey:      `${settings.uniqueKey}-table`,
            noSearchAdd:    true,
            tableTitle:     'Feed Balance',
            
            addEntryLink: {
                label:      'Add Entry',
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
    
    
    this.getElemTableBody = function(){
        return elemTableBody;
    }
    
    
    
    this.beforeShow = function(data_pig_prod, options){
        dataPigProd     = data_pig_prod;
        showOptions     = options;
        
        
        // Request data if not yet requested
        if ('data_details' in dataPigProd){
            
            // Set table entry list; This will set also the entry count;
            thisObj.setDataEntryList(dataPigProd.data_details.list_feed_balance);
            thisObj.renderTable(dataPigProd.data_details.list_feed_balance);
        } else{
            
            thisObj.requestDataProdFeedBalanceList();
        }
        

        
    }
    
    
    this.requestDataProdFeedBalanceList = function(){
        // Request data if not yet requested
            
        const callback_success = function(data){
             // Set table entry list; This will set also the entry count;
            thisObj.setDataEntryList(dataPigProd.data_details.list_feed_balance);
            thisObj.renderTable(dataPigProd.data_details.list_feed_balance);
            
        };
        
        let elem_show_error = thisObj.elemServerErrorMsg;

        
        navigation.pigFarm.requestDataProdFeedBalanceList(callback_success, 
            elem_show_error);
        
     
        
    }
    
    
    
    this.requestDataPigProdFeedList = function(){
        const callback_success = function(data){
            thisObj.setDataEntryList(dataPigProd.data_details.list_prod_feed);
            thisObj.renderTable(dataPigProd.data_details.list_prod_feed);
        };
        
        navigation.pigFarm.managerPigProd.requestPigProdFeedList(dataPigProd, 
            callback_success, thisObj.elemServerErrorMsg);
            
            
        // Parallel request as this is needed later on.
        navigation.pigFarm.requestDataPigFarmFeedBuyList();
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
            <colgroup>
                <col style="width: 18%;">
                <col style="width: 18%;">
                <col style="width: 64%;">
            </colgroup>
                
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Pigs</th>
                    <th>Feed Item</th>
                    
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
        const dt_balance = new Date(cur_entry.feed_balance.date_balance);
        
        let html_items = '';
        
        
        if (cur_entry.feed_balance.num_finisher) {
            const html_item = `
            <div>
                <span>
                ${cur_entry.feed_balance.num_finisher} Finisher  
                </span>
            </div>
            `;
            
            html_items += html_item;
        }
        
        if (cur_entry.feed_balance.num_grower) {
            const html_item = `
            <div>
                <span>
                ${cur_entry.feed_balance.num_grower} Grower  
                </span>
            </div>
            `;
            
            html_items += html_item;
        }
        
        
        if (cur_entry.feed_balance.num_starter) {
            const html_item = `
            <div>
                <span>
                ${cur_entry.feed_balance.num_starter} Starter  
                </span>
            </div>
            `;
            
            html_items += html_item;
        }
        
        
        if (cur_entry.feed_balance.num_prestarter) {
            const html_item = `
            <div>
                <span>
                ${cur_entry.feed_balance.num_prestarter} Prestart
                </span>
            </div>
            `;
            
            html_items += html_item;
        }

        
        if (cur_entry.feed_balance.num_booster) {
            const html_item = `
            <div>
                <span>
                ${cur_entry.feed_balance.num_booster} Booster
                </span>
            </div>
            `;
            
            html_items += html_item;
        }

        
        if (cur_entry.feed_balance.num_lactating) {
            const html_item = `
            <div>
                <span>
                ${cur_entry.feed_balance.num_lactating} Lacta
                </span>
            </div>
            `;
            
            html_items += html_item;
        }


        if (cur_entry.feed_balance.num_gestating) {
            const html_item = `
            <div>
                <span>
                ${cur_entry.feed_balance.num_gestating} Gesta
                </span>
            </div>
            `;
            
            html_items += html_item;
        }

        const html = `
            <tr>
                <td><span>${formatDate(dt_balance, FORMAT_COMPACT)}</span></td>
                <td style="text-align:center;">${cur_entry.feed_balance.num_pigs}</td>
                <td>${html_items}</td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.getElemTableRow = function(cur_entry){
        const pig_prod_feed = cur_entry.pig_prod_feed;
        
        const elem_row = document.createElement('tr');
        
        const html = thisObj.getHtmlTableRow(cur_entry);
        elem_row.innerHTML = html;
         

        
        // Attach onclick listeners to td
        
        const elem_tds = elem_row.querySelectorAll('td'); 
        
        let index = 0
        for (const cur_td of elem_tds){

            if (index == 1){
                cur_td.onclick = function(){
                    thisObj.onClickRowEntry(pig_prod_feed.hid);
                };

            }
            
            index += 1;
        }
        
        return elem_row;
    }
    
      
    this.setUserLanguage = function(language_key){
        curUserLanguageKey = language_key;
        thisObj.onUserChangeLanguage();
    }
    
    
    this.onUserChangeLanguage = function(){
        
       
    }
    
    
    this.getEntry = function(entry_hid){
        const data_list = dataPigProd.data_details.list_prod_feed;
        
        for (const cur_entry of data_list){
            if (cur_entry.pig_prod_feed.hid == entry_hid){
                return cur_entry;
            }
        }
        
        return null;
    }
    
    
    this.onClickAddEntry = function(){
        let go_back_page_id = settings.parentPageId;
        
        
        const go_back_page = navigation.getPageContainer(go_back_page_id);
        const options ={
            is_add:                 true,   // false is edit
            callback_after_add:     thisObj.onSuccessAddEntry,
            go_back_page:           go_back_page   
        };
        navigation.pageFeedBalanceAddEdit.beforeShow(dataPigProd, options);
        
        
        const goto_page_id   = PAGE_ID.FEED_BALANCE_ADD_EDIT;
        const page_container = navigation.getPageContainer(goto_page_id);
        navigation.showThisPage(page_container);
    }
    
    
    this.onSuccessAddEntry = function(){
        thisObj.requestDataPigProdFeedList();
    }
    
    
    this.onClickRowEntry = function(entry_hid){
        const row_entry = thisObj.getEntry(entry_hid);
        

        if (row_entry){
            const go_back_page_id = parentObj.PAGE_ID;
            const go_back_page = navigation.getPageContainer(go_back_page_id);
            
            //TODO: This is the pig_farm_feed_buy where the pig_prod_feed was taken.
            const pf_feed_buy_hid = row_entry.pig_prod_feed.pf_feed_buy_hid;
            const pig_farm_feed_buy = navigation.pagePigFarmFeedBuyList.getEntry(pf_feed_buy_hid);
            
            const options ={
                is_add:                 false,   // false is edit
                callback_after_edit:    thisObj.onSuccessEditEntry,
                pig_farm_feed_buy:      pig_farm_feed_buy, 
                pig_prod_feed:          row_entry, // this is entry to be edited
                go_back_page:           go_back_page
            };
            navigation.pageProdFeedAddEdit.beforeShow(dataPigProd, options);
            
            
            const goto_page_id   = PAGE_ID.PROD_FEED_ADD_EDIT;
            const page_container = navigation.getPageContainer(goto_page_id);
            navigation.showThisPage(page_container);
        }
    }
    
    
    this.onSuccessEditEntry = function(){
        thisObj.requestDataPigProdFeedList();
    }
}
