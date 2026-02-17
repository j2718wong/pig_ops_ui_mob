// February 14, 2026
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



export function TablePigProdFeed(input_settings){
    PageTableBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    
    /*
    Typical input_settings
    {
        navigation:             this,
        parentObj:              thisObj,
        uniqueKey:              'pig-prod-feed'
        elemDivContainer:       '<element>',
        parentPageId:           PAGE_ID.PROD_LACTA_ENTRY
        
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
            noControlsBar:  true,
            tableTitle:     'Feed Add',
            
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
        
        // This is needed when adding and editing PigProdFeed
        thisObj.requestDataPigFarmFeedBuyList();
        
        // Request data if not yet requested
        if ('data_details' in dataPigProd){
            
            // Set table entry list; This will set also the entry count;
            thisObj.setDataEntryList(dataPigProd.data_details.list_prod_feed);
            thisObj.renderTable(dataPigProd.data_details.list_prod_feed);
        } else{
            
            thisObj.requestDataPigProdFeedList();
        }

    }
    
    
    this.requestDataPigFarmFeedBuyList = function(){
        // Request data if not yet requested
        let feed_buy_list = navigation.pigFarm.dataFarmFeedBuyList;
        if (feed_buy_list == null){
            
            const callback_success = function(data){
                feed_buy_list = navigation.pigFarm.dataFarmFeedBuyList;
                
            };
            
            let elem_show_error = thisObj.elemServerErrorMsg;
       
            
            navigation.pigFarm.requestDataPigFarmFeedBuyList(callback_success, 
                elem_show_error);
        
        }
     
        
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
                <col style="width: 47%;">
                <col style="width: 35%;">
            </colgroup>
                
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Feed Item</th>
                    <th>Supplier</th>
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
        const dt_add = new Date(cur_entry.pig_prod_feed.date_add);
        
        let html_items = '';
        
        for (const cur_item of cur_entry.feed_items){
            const html_item = `
            <div>
                <span>
                ${cur_item.feed_item.quantity} ${cur_item.feed_type.name}, ${cur_item.feed_brand.name}  
                </span>
            </div>
            `;
            
            html_items += html_item;
        }
        
        
        const html = `
            <tr>
                <td><span>${formatDate(dt_add, FORMAT_COMPACT)}</span></td>
                <td>${html_items}</td>
                <td>${cur_entry.feed_supplier.name}</td>
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
        navigation.pageProdFeedAddEdit.beforeShow(dataPigProd, options);
        
        
        const goto_page_id   = PAGE_ID.PROD_FEED_ADD_EDIT;
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
