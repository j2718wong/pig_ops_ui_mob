// February 19, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';



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
        FORMAT_COMPACT_NO_SPACE,
        createPaginationManager} from '../../../utils.js';


import {HarvestCard}            from './harvest_card.js';



export function ProdHarvestList(input_settings){

    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    /*
    Typical input_settings
    {
        navigation:             navigation,
        parentObj:              thisObj,
        uniqueKey:              'sow-boar-medvac',
        elemDivContainer:       '<element>'
    }   
    */  
    const settings              = input_settings;
    
    
    
    
    
    
    let elemDivContainer        = settings.elemDivContainer;


    let elemIdSearchAddControl  = null;
    let elemIdSearchInput       = null;
    let elemIdAddEntryBtn       = null;
    
    let elemIdCardContainer     = null;
    let elemIdNoEntries         = null;
    
    
    let elemSearchAddControl    = null;
    let elemSearchInput         = null;
    let elemAddEntryBtn         = null;
    
    let elemCardContainer       = null;
    let elemNoEntries           = null;


    //let textTranslation         = new TextTranslation();
    let curUserLanguageKey      = 'en';


    let showOptions             = null;
    
    let dtCurrentDate           = null;
    
    // This can be a data_pig_prod or data_prod_group
    let dataPigProd            = null;
    
    
    let harvestCard             = new HarvestCard({
        navigation:             navigation,
        parentObj:              thisObj,  
        parentPageId:           settings.parentPageId
    });
    
    
    this.init = function(){
        
        
        const html = thisObj.getHtml();
        elemDivContainer.innerHTML = html;
        
        
        thisObj.afterHtmlRender();  // This will call the parent method 
    
    }
    
    
    this.getHtml = function(){
        
        elemIdSearchAddControl  = `${settings.uniqueKey}-search-add-control`;
        elemIdSearchInput       = `${settings.uniqueKey}-mobile-search-input`;
        elemIdAddEntryBtn       = `${settings.uniqueKey}-mobile-add-entry-btn`;
        
        elemIdCardContainer     = `${settings.uniqueKey}-card-container`;
        elemIdNoEntries         = `${settings.uniqueKey}-no-entries`;
        
        const html_style        = this._writeInlineStyle();
        
        
        
        const html = `
    <div class="modal-body" id="">
        
        <h2>
            <span class="nav-title blue">Production Harvest</span>
        </h2>
        
    
        ${html_style}
        
        <div class="mobile-controls" id="${elemIdSearchAddControl}">
            <div class="search-container">
                <i class="fas fa-search search-icon"></i>
                <input type="text" class="search-input" id=${elemIdSearchInput} placeholder="Search">
            </div>
            <button class="btn-add-entry" id="${elemIdAddEntryBtn}">
                <i class="fas fa-plus"></i>
                Add Entry
            </button>
        </div>
        
        <div id="${elemIdCardContainer}"></div>
        
        <div id="${elemIdNoEntries}">No Entries</div>

        
    </div>
        `;
       
        return html;

    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemSearchAddControl        = elemDivContainer.querySelector('#'+elemIdSearchAddControl);
        elemSearchInput             = elemDivContainer.querySelector('#'+elemIdSearchInput);
        elemAddEntryBtn             = elemDivContainer.querySelector('#'+elemIdAddEntryBtn);
        
        elemCardContainer           = elemDivContainer.querySelector('#'+elemIdCardContainer);
        elemNoEntries               = elemDivContainer.querySelector('#'+elemIdNoEntries);
    }
    
    
    this._processAfterHtmlRender= function(){}
    
    
    this._bindEventListeners= function(){
        elemAddEntryBtn.addEventListener('click', function() {
            thisObj.onClickAddEntry();
        });
        
    }
    
    
    
    
    this._writeInlineStyle = function(){
        const html = `
    <style>
        
        /* Updated Table Styles */
        .table-feed-summary td {padding-right:0}
    </style>
    `;
        return html;
    }
    

    
    this.beforeShow = function(data_pig_prod, options){
        dataPigProd     = data_pig_prod;
        this.dataPigProd = dataPigProd;
        
        showOptions     = options;
        
        // Hide Search Add Controls if already harvested
        const prod_status_id = dataPigProd.pig_production.prod_status_id; 
        if (prod_status_id == PROD_STATUS.HARVESTED || prod_status_id == PROD_STATUS.CLOSED){
            elemSearchAddControl.style.display = 'none';
        }
        else{
            elemSearchAddControl.style.display = 'block';
        }
        
        
        
        // Request data if not yet requested
        if ('data_details' in dataPigProd){
            
            if (dataPigProd.data_details.list_harvest){
                thisObj.renderTable(dataPigProd.data_details.list_harvest);
            }
            else{
                thisObj.requestDataProdHarvestList();

            }
        } else{
            
            thisObj.requestDataProdHarvestList();
        }
        
    }
    
    
    this.requestDataProdHarvestList = function(){
        // Request data if not yet requested
            
        const callback_success = function(data){
            thisObj.renderTable(dataPigProd.data_details.list_harvest);
            
        };
        
        let elem_show_error = null;
   
        
        navigation.pigFarm.managerPigProd.requestDataProdHarvestList(dataPigProd,
            callback_success, elem_show_error);
        
    }
    
    
        
    this.show = function(options){
        
        // show the last showOptions if there is no options
        if (options == null){options = showOptions;}
        
        // So that not to instantiate in every table redraw
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        showOptions = options;
        
        
        
        
        
        
        
    }
    
    
    this.renderTable = function(data){
        elemCardContainer.innerHTML = '';
        
        
        for (const cur_entry of data){
            const cur_card = harvestCard.getElemHarvestCard(dataPigProd, cur_entry);
            if (cur_card){
                elemCardContainer.appendChild(cur_card);
            }
        }
        
        if (data.length == 0){
            elemNoEntries.style.display  = 'block';
        }
        else{
            elemNoEntries.style.display  = 'none';
        }
    }
    
    
    this.getEntry = function(entry_hid){
        const data_list = dataPigProd.data_details.list_prod_feed;
        /*
        for (const cur_entry of data_list){
            if (cur_entry.pig_prod_feed.hid == entry_hid){
                return cur_entry;
            }
        }
        */
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
        navigation.pageProdHarvestAddEdit.beforeShow(dataPigProd, options);
        
        
        const goto_page_id   = PAGE_ID.PROD_HARVEST_ADD_EDIT;
        const page_container = navigation.getPageContainer(goto_page_id);
        navigation.showThisPage(page_container);
    }
    
    
    this.onSuccessAddEntry = function(){
        thisObj.requestDataProdHarvestList();
    }
    
    
    this.onSuccessEditEntry = function(){
        thisObj.requestDataProdHarvestList();
    } 
    
}
