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
    
    
    this.getElemTableBody = function(){
        return elemTableBody;
    }
    
    
    
    this.beforeShow = function(data_pig_prod, options){
        dataPigProd     = data_pig_prod;
        showOptions     = options;
        
        thisObj.requestDataPigFarmFeedBuyList();
        
        thisObj.setDataEntryList([]);
        thisObj.renderTable([]);
        
       
       
        
        console.log(dataPigProd);
        
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
                <col style="width: 82%;">
            </colgroup>
                
            <thead>
                <tr>
                    <th>Date</th>
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
                <td colspan="2"><div>No Entries</div></td>
            </tr>
        `;
        return html;
    }
    

    this.getHtmlTableRow = function(cur_entry){


        const dt_mate = new Date(cur_entry.date_mate);
        
        const sow_boar_name     = getSowBoarReference(dataPigProd.sow_boar, false)
        const sow_boar_mate_name = getSowBoarReference(cur_entry.mate_sow_boar, false)
        
        const html = `
            <tr>
                <td><span>${formatDate(dt_mate, FORMAT_COMPACT)}</span></td>
                <td >${cur_entry.farm_prod_id}</td>
                <td >${sow_boar_name} <span class="love-icon">❤️</span> ${sow_boar_mate_name}</td>
            </tr>
        `;
        
        return html;
    }
    
      
    this.setUserLanguage = function(language_key){
        curUserLanguageKey = language_key;
        thisObj.onUserChangeLanguage();
    }
    
    
    this.onUserChangeLanguage = function(){
        
       
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
    
    
}
