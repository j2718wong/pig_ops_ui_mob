// February 3, 2026
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

import {ComponentNavLeftRight}  from '../../common/ui/comp_nav_left_right.js';



/*

*/

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
    



    //let textTranslation         = new TextTranslation();
    let curUserLanguageKey      = 'en';


    let showOptions             = null;
    
    let dtCurrentDate           = null;
    
    
    let dataFarmFeedBalanceList     = null;
    
    
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
        componentNavLeftRight   = new ComponentNavLeftRight({
           uniqueKey:           settings.uniqueKey,
           elemDivContainer:    elemDivContainer,
           pageTitle:           'Feed Balance List'
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
            navigation._onClickNavPigDead();
        };
        
          
        componentNavLeftRight.callbackNavRight = function(){
            navigation._onClickNavPigDead();
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
    
    
    this.show = function(){
        thisObj.debugNavHistory(TAG);
        
        // Update navigation.curPageNavigated
        navigation.curPageNavigated.pageData = null;;
        navigation.curPageNavigated.renderPageFunc = thisObj.renderPage;
        
        
        const callback_success = function(data){
            thisObj.renderTable(data);
        };
        
        navigation.pigFarm.requestDataPigFarmFeedBalance(null, callback_success);
    }
    
     
    this.getHtmlTableHeader = function(){
        elemIdTableBody         = `${settings.uniqueKey}-table-tbody`;
        
        const html_style = this._writeInlineStyle();
        
        
        const html = `
        ${html_style}
        
        <table class="data-table" id="">
            <colgroup>
                <col style="width: 30%;">
                <col style="width: 70%;">
            </colgroup>
            
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Feed Balance</th>
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
                <td colspan="2"><div>No Entries</div></td>
            </tr>
        `;
        return html;
    }
    

    this.getHtmlTableRow = function(cur_entry){
        
        const dt_balance    = new Date(cur_entry.date_balance);
        const s_dt_balance  = formatDate(dt_balance, FORMAT_COMPACT);
        
        
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
        
        
        let html_feeds = '';
        
        if (total_gesta > 0){
            html_feeds += `<div>${total_gesta} GESTA</div>`;
        } 
        
        if (total_lacta > 0){
            html_feeds += `<div>${total_lacta} LACTA</div>`;
        }
        
        if (total_booster > 0){
            html_feeds += `<div>${total_booster} BOOSTER</div>`;
        }
        
        if (total_prestarter > 0){
            html_feeds += `<div>${total_prestarter} PRESTARTER</div>`;
        }
        
        if (total_starter > 0){
            html_feeds += `<div>${total_starter} STARTER</div>`;
        }
        
        if (total_grower > 0){
            html_feeds += `<div>${total_grower} GROWER</div>`;
        }
        
        if (total_finisher > 0){
            html_feeds += `<div>${total_finisher} FINISHER</div>`;
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
        
        
        const elem_tds = elem_row.querySelectorAll('td'); 
        
        let index = 0
        for (const cur_td of elem_tds){
            
            if (index == 0 || index == 1){
                cur_td.onclick = function(){
                    thisObj.onClickRowEntry(cur_entry);
                };
                        
            }
            
            index += 1;
        } 
        
        return elem_row;
    }
    
    
    
    
    
    this.searchEntries = function(key){
    }
    
    

    
    this.setUserLanguage = function(language_key){
        curUserLanguageKey = language_key;
        thisObj.onUserChangeLanguage();
    }
    
    
    this.onUserChangeLanguage = function(){
        
       
    }
    
    
    this.getEntry = function(entry_hid){
        dataFarmFeedBuyList = navigation.pigFarm.dataFarmFeedBuyList;
        
        const data_list = dataFarmFeedBuyList;
        
        for (const cur_entry of data_list){
            if (cur_entry.pf_feed_buy.hid == entry_hid){
                return cur_entry;
            }
        }
        
        return null;
    }
    
    
    this.onClickAddEntry = function(){
        
        const go_back_page_id = PAGE_ID.ALL_FEED_BAL_LIST;
        const go_back_page = navigation.getPageContainer(go_back_page_id);
        
        const options ={
            is_add:                 true,   // false is edit
            callback_after_add:     thisObj.onSuccessAddEntry,
            go_back_page:           go_back_page   
        };
        navigation.pageAllFeedBalanceAddEdit.beforeShow(options);
        

        const goto_page_id   = PAGE_ID.ALL_FEED_BAL_ADD_EDIT;
        const page_container = navigation.getPageContainer(goto_page_id);
        navigation.showThisPage(page_container);
    }
    
    
    this.onSuccessAddEntry = function(){
        
    }
    
    
    this.onSuccessEditEntry = function(){

    }
    
    
    
    this.onClickRowEntry = function(row_entry){
        
        if (row_entry){
            const go_back_page_id = PAGE_ID.ALL_FEED_BAL_LIST;
            const go_back_page = navigation.getPageContainer(go_back_page_id);
        
            const options ={
                is_add:                 false,   // false is edit
                callback_after_edit:    thisObj.onSuccessEditEntry,
                go_back_page:           go_back_page
            }
            navigation.pageAllFeedBalanceAddEdit.beforeShow(options, row_entry);
            
            
            const goto_page_id   = PAGE_ID.ALL_FEED_BAL_ADD_EDIT;
            const page_container = navigation.getPageContainer(goto_page_id);
            navigation.showThisPage(page_container);
        }
    }
}
