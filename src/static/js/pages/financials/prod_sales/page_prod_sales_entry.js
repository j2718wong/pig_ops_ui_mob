// February 22, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageProdEntryCommon}    from '../../production/gesta_lacta/page_prod_entry_common.js';

import {PAGE_ID,
        SOW_STATUS,
        PIG_OPERATION_TYPE,
        MULTIKEY_OBJ_TYPE}      from '../../../constants.js';


import {ComponentTabsWithMore}  from '../../common/ui/comp_tabs_with_more.js';

import {ProdSummary}            from '../../production/summary/prod_summary.js'
import {ProdHarvestList}        from '../../production/harvest/prod_harvest_list.js'



export function PageProdSalesEntry(input_settings){
    PageProdEntryCommon.call(this, input_settings);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContProdLactaEntry
        uniqueKey:              'prod-fat'
    };
    */
    const settings              = input_settings;

   
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
    
    
    this.PAGE_ID                = PAGE_ID.PROD_SALES_ENTRY;
    
    
    this.TAB_SALES_FEED_SUMMARY   = 1;
    this.TAB_SALES_HARVEST        = 4;
    
    
    let elemIdTabSalesProdSummary = `${settings.uniqueKey}-feed-summary`;
    let elemIdTabSalesHarvest     = `${settings.uniqueKey}-harvest`;
    

    let tabsProdSales = [
        {
            data_tab_id:    elemIdTabSalesProdSummary,
            label:          'Prod'
        },
        
                
        {
            data_tab_id:    elemIdTabSalesHarvest,
            label:          'Harvest'
        }
    ];
    
    
    
    
    let elemTabSalesProdSummary   = null; 
    let elemTabSalesHarvest       = null;
                                
                                        
    
    
    let dataPigProd             = null;
    let showOptions             = null;
    
    let curTabSales               = null;
  
  
    this.setDataTabMenus(tabsProdSales);
    
    
    
    
    this.init = function(){
        this.render();              // Call parent method
        this.afterHtmlRender();     // Call parent method
        
        this.afterHtmlRenderThis();
        
    }
 
    
    this.afterHtmlRenderThis = function(){
        this._findElementsThis();
        this._processAfterHtmlRenderThis();
        this._bindEventListenersThis();
    }
    
    
    this._findElementsThis = function(){
   
        elemTabSalesProdSummary   = elemDivContainer.querySelector('#'+elemIdTabSalesProdSummary);
        elemTabSalesHarvest       = elemDivContainer.querySelector('#'+elemIdTabSalesHarvest);    
    }
    
    
    this._processAfterHtmlRenderThis = function(){
       
        this.pigProdSummary    = new ProdSummary({
            navigation:         settings.navigation,
            parentObj:          this,
            uniqueKey:          `${settings.uniqueKey}-feed-summary`,
            elemDivContainer:   elemTabSalesProdSummary,
            includeProdSummary: true,
            isProdHistory:      true
        });
        this.pigProdSummary.init();
        

        this.prodHarvestList    = new ProdHarvestList({
            navigation:         settings.navigation,
            parentObj:          this,
            uniqueKey:          `${settings.uniqueKey}-harvest-list`,
            elemDivContainer:   elemTabSalesHarvest,
            parentPageId:       PAGE_ID.PROD_SALES_ENTRY,
            isProdHistory:      true
        });
        this.prodHarvestList.init();

        
        this.componentTabsWithMore.beforeShowTab = this.beforeShowTab;
    }
    
    
    this._bindEventListenersThis = function(){
       
    }
    

    
    this.show = function(data_pig_prod, options){
        dataPigProd = data_pig_prod;
        
        // Change options only if there is a given options
        if (options){
            showOptions = options;
        }
        
        this.populateHeader(data_pig_prod, showOptions);
        
        if (curTabSales == null){
            curTabSales = thisObj.TAB_SALES_FEED_SUMMARY;
        }
        
        
        // Override if specified
        if (showOptions.tab_lacta){
            curTabSales = showOptions.tab_lacta;
        }
        
        
        let is_to_request_details = 0;
        
        
        // Request pig_prod data details if there is none yet
        if ('data_details' in data_pig_prod){
            thisObj.switchTab(curTabSales);
            
            // Prod History List will only include the list_harvest data during 
            // list request. Other details need to be requested.
            
            if (data_pig_prod.list_prod_feed){}
            else{
                is_to_request_details = 1;
            }
        }
        else{
            is_to_request_details = 1;
        }
        
        
        if (is_to_request_details > 0) {
            const callback_success = function(){
                thisObj.switchTab(curTabSales);
            }
            navigation.pigFarm.managerPigProd.requestPigProdDetails(
                dataPigProd, callback_success);
        }
        else{
            thisObj.switchTab(curTabSales);
        }
        
        
        
    }
    

    
    this.switchTab = function(tab_fattening){
        
        switch(tab_fattening){
            case thisObj.TAB_SALES_FEED_SUMMARY:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabSalesProdSummary);
                break;
            }
            
            
            case thisObj.TAB_SALES_HARVEST:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabSalesHarvest);
                break;
            }
            
             
            default: {
                thisObj.componentTabsWithMore.switchTab(elemIdTabSalesProdSummary)
                break;
            }

        }
        
    }
    
    
    this.beforeShowTab = function(tabId){

        switch(tabId) {
            case elemIdTabSalesProdSummary:{
                thisObj.pigProdSummary.beforeShow(dataPigProd);
                
                curTabSales = thisObj.TAB_SALES_FEED_SUMMARY;
                break;
            }
            
            
            case elemIdTabSalesHarvest:{
                thisObj.prodHarvestList.beforeShow(dataPigProd);
                
                curTabSales = thisObj.TAB_SALES_HARVEST;
                break;
            }

        }
        
    }
    
}   
