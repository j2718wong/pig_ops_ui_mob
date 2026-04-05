// April 5, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';



import {APPLICATION,
        PAGE_ID,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        SOW_STATUS_NAME,
        MULTIKEY_OBJ_TYPE,
        PROD_STATUS,
        HARVEST_TYPE,
        ACC_USER_GROUP}         from '../../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        FORMAT_COMPACT_NO_SPACE} from '../../../utils.js';

import {TableFeedChangeDate}    from './table_feed_change_date.js'
import {TablePigProdFeed}       from './table_prod_feed.js'


export function ProdFeeds(input_settings){

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
        includeProdSummary:     true,
        showFinancial:          true
    }   
    */  
    const settings              = input_settings;
    
    
    let elemDivContainer        = settings.elemDivContainer;

    let elemIdContChangeFeed    = null;   
    let elemIdContTableProdFeed = null;
    
    
    let elemContChangeFeed      = null;   
    let elemContTableProdFeed   = null;
    
    
    
    
    let showOptions             = null;
    
    let dtCurrentDate           = null;
    
    
    
    this.init = function(){
        
        
        const html = thisObj.getHtml();
        elemDivContainer.innerHTML = html;
        
        
        thisObj.afterHtmlRender();   
    
    }
    
    
    this.getHtml = function(){
        elemIdContChangeFeed    = `${settings.uniqueKey}-change-feed`;
        elemIdContTableProdFeed = `${settings.uniqueKey}-prod-feed`;

        const html = `
    <div>
        <div id="${elemIdContChangeFeed}" style="margin-bottom:15px; display:none;"></div>
        <div id="${elemIdContTableProdFeed}"></div>
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
        elemContChangeFeed      = elemDivContainer.querySelector('#'+elemIdContChangeFeed);
        elemContTableProdFeed   = elemDivContainer.querySelector('#'+elemIdContTableProdFeed);
    }
    
    
    this._processAfterHtmlRender= function(){
        this.tableFeedChangeDate= new TableFeedChangeDate({
            navigation:         settings.navigation,
            parentObj:          parentObj,
            uniqueKey:          `${settings.uniqueKey}-change-date`,
            elemDivContainer:   elemContChangeFeed,
            parentPageId:       PAGE_ID.PROD_FATTENING_ENTRY,
            isProdHistory:      settings.isProdHistory
        });
        this.tableFeedChangeDate.init();
        
        
        this.tablePigProdFeed   = new TablePigProdFeed({
            navigation:         settings.navigation,
            parentObj:          parentObj,
            uniqueKey:          `${settings.uniqueKey}-feed`,
            elemDivContainer:   elemContTableProdFeed,
            parentPageId:       PAGE_ID.PROD_FATTENING_ENTRY,
            isProdHistory:      settings.isProdHistory
        });
        this.tablePigProdFeed.init();
        
    }
    
    
    this._bindEventListeners= function(){}
    
    
    this.beforeShow = function(data_pig_prod, options){
        thisObj.tableFeedChangeDate.beforeShow(data_pig_prod);
        thisObj.tablePigProdFeed.beforeShow(data_pig_prod, options);
        
    }
    
    

       
}
