// February 2, 2026
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


/*
 is used in these objects


*/

export function ProdFeedSummary(input_settings){

    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    /*
    Typical input_settings
    {
        navigation:             navigation,
        parentObj:              thisObj,
        uniqueKey:              'sow-boar-medvac',
        elemDivContainer:       '<element>'
        medvacType:             MULTIKEY_OBJ_TYPE.SOW_BOAR
    }   
    */  
    let settings                = input_settings;
    
    const FEED_TYPE_LABEL = {
        'GESTA':    'Gesta',
        'LACTA':    'Lacta',
        'BOOSTER':  'Booster',
        'PRESTART': 'PreStart',
        'STARTER':  'Starter',
        'GROWER':   'Grower',
        'FINISHER': 'Finisher'
    };
    
    
    
    
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
        
        
        const html = thisObj.getHtml();
        elemDivContainer.innerHTML = html;
        
        
        thisObj.afterHtmlRender();  // This will call the parent method 
    
    }
    
    
    this.getHtml = function(){
        
        const html_style = thisObj._writeInlineStyle();
        const html_table = thisObj.getHtmlTableHeader();
        
        const html = `
        
        ${html_style}
        
        ${html_table}
        `;
        
        
        return html;
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemTableBody           = document.getElementById(elemIdTableBody);
    }
    
    this._processAfterHtmlRender= function(){}
    this._bindEventListeners= function(){}
    
    
    
    
    this._writeInlineStyle = function(){
        const html = `
    <style>
        
        /* Updated Table Styles */
        .table-feed-summary td {padding-right:0}
    </style>
    `;
        return html;
    }
    

    
    this.beforeShow = function(data_entry){
        curDataEntry = data_entry;
        
        const prod_entry_feeds = curDataEntry.feeds;
        const feeds_bought  = prod_entry_feeds.bought;
        const feeds_balance = prod_entry_feeds.balance;
        
        const feed_summary = [
            {   
                type:   FEED_TYPE_LABEL.GESTA,
                buy:    feeds_bought.gestating,
                bal:    feeds_balance.gestating
            },
            
            {   
                type:   FEED_TYPE_LABEL.LACTA,
                buy:    feeds_bought.lactating,
                bal:    feeds_balance.lactating
            },
            
            {   
                type:   FEED_TYPE_LABEL.BOOSTER,
                buy:    feeds_bought.booster,
                bal:    feeds_balance.booster
            },
            
            {   
                type:   FEED_TYPE_LABEL.PRESTART,
                buy:    feeds_bought.prestarter,
                bal:    feeds_balance.prestarter
            },
            
            {   
                type:   FEED_TYPE_LABEL.STARTER,
                buy:    feeds_bought.starter,
                bal:    feeds_balance.starter
            },
            
            {   
                type:   FEED_TYPE_LABEL.GROWER,
                buy:    feeds_bought.grower,
                bal:    feeds_balance.grower
            },
            
            {   
                type:   FEED_TYPE_LABEL.FINISHER,
                buy:    feeds_bought.finisher,
                bal:    feeds_balance.finisher
            }
        
        ];
        
        
        let html = '';
        
        for (const cur_entry of feed_summary){
            html += thisObj.getHtmlTableRow(cur_entry);
        }
        
        elemTableBody.innerHTML = html;
        
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
	<div class="modal-body" id="">
		<h2 class="tab-title">
			Feed Summary
		</h2>
    
        ${html_style}
        
		<div>Last Feed Balance: 02 Feb 2026  </div>
		
        <table class="data-table table-feed-summary" id="">
            <thead>
                <colgroup>
                    <col style="width: 25%;">
                    <col style="width: 25%;">
                    <col style="width: 25%;">
                    <col style="width: 25%;">
                </colgroup>
                
                <tr>
                    <th>Feed<br>Type</th>
                    <th>Buy<br>(sacks)</th>
                    <th>Cons<br>(sacks)</th>
                    <th>Bal<br>(sacks)</th>
                </tr>
            </thead>
            <tbody id="${elemIdTableBody}">
            </tbody>
        </table>
    
	</div>
        `;
       
        return html;
        
    }
       


    this.getHtmlTableRow = function(cur_entry){
        let s_feed_buy      = '';
        let s_feed_consumed = '';
        let s_feed_balance  = '';
        
        if (cur_entry.buy){s_feed_buy = `${cur_entry.buy}`;}
        
        
        const html = `
            <tr>
                <td>${cur_entry.type}</td>
                <td>${s_feed_buy}</td>
                <td>${s_feed_consumed}</td>
                <td>${s_feed_balance}</td>
            </tr>
        `;
        
        return html;
    }
    
}