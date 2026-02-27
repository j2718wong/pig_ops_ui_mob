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
        parentPageId:           PAGE_ID.PROD_FATTENING_ENTRY,
        isProdHistory:          false
        
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
        const settings_table = {
            uniqueKey:      `${settings.uniqueKey}-table`,
            noSearchAdd:    true,
            tableTitle:     'Feed Balance',
            
            addEntryLink: {
                label:      'Add Entry',
                onclickAddEntry: thisObj.onClickAddEntry
            }
        };
        
        if (settings.isProdHistory){
            delete settings_table.addEntryLink;
        }
        
        thisObj.setSettingsTable(settings_table);
        
        
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
            
            if (dataPigProd.data_details.list_feed_balance){
                // Set table entry list; This will set also the entry count;
                thisObj.setDataEntryList(dataPigProd.data_details.list_feed_balance);
                thisObj.renderTable(dataPigProd.data_details.list_feed_balance);
            }
            else{
                thisObj.requestDataProdFeedBalanceList();
            }
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

        
        navigation.pigFarm.managerPigProd.requestDataProdFeedBalanceList(
            dataPigProd, callback_success, elem_show_error);
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
                <col style="width: 30%;">
                <col style="width: 18%;">
                <col style="width: 52%;">
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
        const feed_balance = cur_entry.feed_balance;
        
        const elem_row = document.createElement('tr');
        
        const html = thisObj.getHtmlTableRow(cur_entry);
        elem_row.innerHTML = html;
        
        
        if (settings.isProdHistory){
            // No Click action;
            return elem_row;
        }
        
        
        const row_entry = thisObj.getEntry(feed_balance.hid);
        
        // Attach onclick listeners to td
        // No action to older entries other than first row
        if (row_entry.list_index == 0) {
        
            const elem_tds = elem_row.querySelectorAll('td'); 
            
            let index = 0
            for (const cur_td of elem_tds){

                if (index == 0 || index == 2){
                    cur_td.onclick = function(){
                        thisObj.onClickRowEntry(feed_balance.hid);
                    };

                }
                
                index += 1;
            }
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
        const data_list = dataPigProd.data_details.list_feed_balance;
        
        let index = 0;
        for (const cur_entry of data_list){
            if (cur_entry.feed_balance.hid == entry_hid){
                return {
                    list_index:     index,
                    feed_balance: cur_entry
                };
            }
            
            index += 1;
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
        
        
        const goto_page_id   = PAGE_ID.PROD_FEED_BAL_ADD_EDIT;
        const page_container = navigation.getPageContainer(goto_page_id);
        navigation.showThisPage(page_container);
    }
    
    
    this.onSuccessAddEntry = function(){
        thisObj.requestDataProdFeedBalanceList();
    }
    
    
    this.onClickRowEntry = function(entry_hid){
        const row_entry = thisObj.getEntry(entry_hid);
        
        // Cannot edit older entries;
        if (row_entry && row_entry.list_index == 0){
            const go_back_page_id = parentObj.PAGE_ID;
            const go_back_page = navigation.getPageContainer(go_back_page_id);
            
            
            const options ={
                is_add:                 false,   // false is edit
                callback_after_edit:    thisObj.onSuccessEditEntry,
                feed_balance:           row_entry.feed_balance, // this is entry to be edited
                go_back_page:           go_back_page
            };
            navigation.pageFeedBalanceAddEdit.beforeShow(dataPigProd, options);
            
            
            const goto_page_id   = PAGE_ID.PROD_FEED_BAL_ADD_EDIT;
            const page_container = navigation.getPageContainer(goto_page_id);
            navigation.showThisPage(page_container);
        }
    }
    
    
    this.onSuccessEditEntry = function(){
        thisObj.requestDataProdFeedBalanceList();
    }
}
