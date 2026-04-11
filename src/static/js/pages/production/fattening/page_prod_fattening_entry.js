// February 9, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageProdEntryCommon}    from '../gesta_lacta/page_prod_entry_common.js';

import {PAGE_ID,
        SOW_STATUS,
        PIG_OPERATION_TYPE,
        MULTIKEY_OBJ_TYPE}      from '../../../constants.js';


import {DEFAULT_LABEL_TABS}     from '../default_strings_gesta_lacta.js';


import {ComponentTabsWithMore}  from '../../common/ui/comp_tabs_with_more.js';

import {ProdEntryMating}        from '../gesta_lacta/prod_entry_mating.js'
import {ProdEntryBirth}         from '../gesta_lacta/prod_entry_birth.js'
import {ProdEntryWean}          from '../gesta_lacta/prod_entry_wean.js'

import {TableMedVac}            from '../../multikey/table_medvac.js'
import {TableNotes}             from '../../multikey/table_notes.js'
import {TableHealthIssue}       from '../../multikey/table_health_issue.js'

import {ProdSummary}            from '../summary/prod_summary.js'
//import {TablePigProdFeed}       from '../../feeds/prod_feed/table_prod_feed.js'
import {ProdFeeds}              from '../../feeds/prod_feed/prod_feeds.js'

import {TableFeedBalance}       from '../../feeds/feed_balance/table_feed_balance.js'


import {ProdHarvestList}        from '../harvest/prod_harvest_list.js'



export function PageProdFatteningEntry(input_settings){
    PageProdEntryCommon.call(this, input_settings);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContProdLactaEntry
        uniqueKey:              'prod-fat',
        isProdHistory:          false
    };
    */
    const settings              = input_settings;

   
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
    
    
    this.PAGE_ID                = PAGE_ID.PROD_FATTENING_ENTRY;
    
    
    this.TAB_FAT_FEED_SUMMARY   = 1;
    this.TAB_FAT_PROD_FEED      = 2;
    this.TAB_FAT_FEED_BALANCE   = 3;
    this.TAB_FAT_HARVEST        = 4;
    
    this.TAB_FAT_MEDVAC         = 5;
    this.TAB_FAT_HEALTH         = 6;
    this.TAB_FAT_NOTES          = 7;
    this.TAB_FAT_WEAN           = 8;
    this.TAB_FAT_BIRTH          = 9;
    this.TAB_FAT_MATING         = 10;
    this.TAB_FAT_EXTRA          = 11;
    
    
    let elemIdTabFatProdSummary = `${settings.uniqueKey}-prod-summary`;
    let elemIdTabFatProdFeed    = `${settings.uniqueKey}-prod-feed`;
    let elemIdTabFatFeedBalance = `${settings.uniqueKey}-feed-bal`;
    let elemIdTabFatHarvest     = `${settings.uniqueKey}-harvest`;
    
    let elemIdTabFatMedVac      = `${settings.uniqueKey}-medvac`;
    let elemIdTabFatHealth      = `${settings.uniqueKey}-health`;
    let elemIdTabFatNotes       = `${settings.uniqueKey}-notes`;
    let elemIdTabFatWean        = `${settings.uniqueKey}-wean`;
    let elemIdTabFatBirth       = `${settings.uniqueKey}-birth`;
    let elemIdTabFatMating      = `${settings.uniqueKey}-mating`;
    let elemIdTabFatExtra       = `${settings.uniqueKey}-extra`;
    
    
    // Keep the labels short on the first 4 tabs
    let labelTabFatProduction   = DEFAULT_LABEL_TABS.PRODUCTION;
    let labelTabFatFeeds        = DEFAULT_LABEL_TABS.FEEDS;
    let labelTabFatFeedBalance  = DEFAULT_LABEL_TABS.FEED_BALANCE;
    let labelTabFatHarvest      = DEFAULT_LABEL_TABS.HARVEST;
    
    
    // Tabs shown on More modal
    let labelTabFatMedVac       = DEFAULT_LABEL_TABS.MEDVAC;
    let labelTabFatHealth       = DEFAULT_LABEL_TABS.HEALTH;
    let labelTabFatNotes        = DEFAULT_LABEL_TABS.NOTES;
    let labelTabFatWean         = DEFAULT_LABEL_TABS.WEAN;
    let labelTabFatBirth        = DEFAULT_LABEL_TABS.BIRTH;
    let labelTabFatMating       = DEFAULT_LABEL_TABS.MATING;
    let labelTabFatExtra        = DEFAULT_LABEL_TABS.EXTRA;
    
    
    const helper = navigation.managerTranslations.translationHelper;

    
    labelTabFatProduction       = helper.getSimpleTranslation('common_app.label_tabs.production') || labelTabFatProduction;
    labelTabFatFeeds            = helper.getSimpleTranslation('common_app.label_tabs.feeds') || labelTabFatFeeds;
    labelTabFatFeedBalance      = helper.getSimpleTranslation('common_app.label_tabs.feed_balance') || labelTabFatFeedBalance;
    labelTabFatHarvest          = helper.getSimpleTranslation('common_app.label_tabs.harvest') || labelTabFatHarvest;


    labelTabFatMedVac           = helper.getSimpleTranslation('common_app.label_tabs.medvac') || labelTabFatMedVac;
    labelTabFatHealth           = helper.getSimpleTranslation('common_app.label_tabs.health') || labelTabFatHealth;
    labelTabFatNotes            = helper.getSimpleTranslation('common_app.label_tabs.notes') || labelTabFatNotes;
    labelTabFatWean             = helper.getSimpleTranslation('common_app.label_tabs.wean') || labelTabFatWean;
    labelTabFatBirth            = helper.getSimpleTranslation('common_app.label_tabs.birth')   || labelTabFatBirth;
    labelTabFatMating           = helper.getSimpleTranslation('common_app.label_tabs.mating') || labelTabFatMating;
    labelTabFatExtra            = helper.getSimpleTranslation('common_app.label_tabs.extra') || labelTabFatExtra;
    
    
    let tabsProdFattening = [
        {
            data_tab_id:    elemIdTabFatProdSummary,
            label:          labelTabFatProduction
        },
        
        {
            data_tab_id:    elemIdTabFatProdFeed,
            label:          labelTabFatFeeds
        },
        
        {
            data_tab_id:    elemIdTabFatFeedBalance,
            label:          labelTabFatFeedBalance
        },
        
        {
            data_tab_id:    elemIdTabFatHarvest,
            label:          labelTabFatHarvest
        },
        
        
        
        {
            data_tab_id:    elemIdTabFatMedVac,
            label:          labelTabFatMedVac
        },
        
        {
            data_tab_id:    elemIdTabFatHealth,
            label:          labelTabFatHealth
        },
        
        
        {
            data_tab_id:    elemIdTabFatNotes,
            label:          labelTabFatNotes
        },
        
        {
            data_tab_id:    elemIdTabFatWean,
            label:          labelTabFatWean
        },
        
        {
            data_tab_id:    elemIdTabFatBirth,
            label:          labelTabFatBirth
        },
        
        {
            data_tab_id:    elemIdTabFatMating,
            label:          labelTabFatMating
        },
        
        {
            data_tab_id:    elemIdTabFatExtra,
            label:          labelTabFatExtra
        }
    ];
    
    
    if (settings.isProdHistory){
        // Remove the following tabs: Harvest, Extra
        tabsProdFattening.splice(10, 1); // remove Extra
        
        // The Harvest Tab is purposely removed and will go to
        // Prod Sales History as this page contains
        // money data. The ProdHistory will only show Production data
        // after Harvest.  
        tabsProdFattening.splice(3, 1); // remove Harvest
    }
    
    
    
    let elemTabFatProdSummary   = null; 
    let elemTabFatProdFeed      = null;
    let elemTabFatFeedBalance   = null;
    let elemTabFatHarvest       = null;
                                
    let elemTabFatMedVac        = null;
    let elemTabFatHealth        = null;
    let elemTabFatPigDead       = null;
    let elemTabFatNotes         = null;
    let elemTabFatWean          = null;
    let elemTabFatBirth         = null;
    let elemTabFatMating        = null;
    let elemTabFatExtra         = null;
    

    
    let dataPigProd             = null;
    let showOptions             = null;
    
    let curTabFat               = null;
    
    let isProdHistory           = false;
    if (settings.isProdHistory){
        isProdHistory = true;
    }
    
    
    this.setDataTabMenus(tabsProdFattening);
    
    
    
    
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
   
        elemTabFatProdSummary   = elemDivContainer.querySelector('#'+elemIdTabFatProdSummary);
        elemTabFatProdFeed      = elemDivContainer.querySelector('#'+elemIdTabFatProdFeed);
        elemTabFatFeedBalance   = elemDivContainer.querySelector('#'+elemIdTabFatFeedBalance);
        elemTabFatHarvest       = elemDivContainer.querySelector('#'+elemIdTabFatHarvest);    
                                                                                            
        elemTabFatMedVac        = elemDivContainer.querySelector('#'+elemIdTabFatMedVac);     
        elemTabFatHealth        = elemDivContainer.querySelector('#'+elemIdTabFatHealth);
        elemTabFatNotes         = elemDivContainer.querySelector('#'+elemIdTabFatNotes);  
        elemTabFatWean          = elemDivContainer.querySelector('#'+elemIdTabFatWean);  
        elemTabFatBirth         = elemDivContainer.querySelector('#'+elemIdTabFatBirth);     
        elemTabFatMating        = elemDivContainer.querySelector('#'+elemIdTabFatMating);    
        elemTabFatExtra         = elemDivContainer.querySelector('#'+elemIdTabFatExtra);   
    }
    
    
    this._processAfterHtmlRenderThis = function(){
       
        this.pigProdSummary    = new ProdSummary({
            navigation:         settings.navigation,
            parentObj:          this,
            uniqueKey:          `${settings.uniqueKey}-feed-summary`,
            elemDivContainer:   elemTabFatProdSummary,
            includeProdSummary: true,
            isProdHistory:      isProdHistory
        });
        this.pigProdSummary.init();
        
        /* Replace this with ProdFeeds; do not delete until stable
        this.tablePigProdFeed   = new TablePigProdFeed({
            navigation:         settings.navigation,
            parentObj:          this,
            uniqueKey:          `${settings.uniqueKey}-feed`,
            elemDivContainer:   elemTabFatProdFeed,
            parentPageId:       PAGE_ID.PROD_FATTENING_ENTRY,
            isProdHistory:      isProdHistory
        });
        this.tablePigProdFeed.init();
        */
        
        this.prodFeeds          = new ProdFeeds({
            navigation:         settings.navigation,
            parentObj:          this,
            uniqueKey:          `${settings.uniqueKey}-feed`,
            elemDivContainer:   elemTabFatProdFeed,
            parentPageId:       PAGE_ID.PROD_FATTENING_ENTRY,
            isProdHistory:      isProdHistory
        });
        this.prodFeeds.init();
        
        
        this.tableFeedBalance   = new TableFeedBalance({
            navigation:         settings.navigation,
            parentObj:          this,
            uniqueKey:          `${settings.uniqueKey}-feed-bal`,
            elemDivContainer:   elemTabFatFeedBalance,
            parentPageId:       PAGE_ID.PROD_FATTENING_ENTRY,
            isProdHistory:      isProdHistory
        });
        this.tableFeedBalance.init();

        
        if (settings.isProdHistory){
            // No prodHarvestList if isProdHistory; 
            this.prodHarvestList = null
        }
        else{
            this.prodHarvestList    = new ProdHarvestList({
                navigation:         settings.navigation,
                parentObj:          this,
                uniqueKey:          `${settings.uniqueKey}-harvest-list`,
                elemDivContainer:   elemTabFatHarvest,
                parentPageId:       PAGE_ID.PROD_FATTENING_ENTRY,
                isProdHistory:      isProdHistory
            });
            this.prodHarvestList.init();
        }
        
        
        this.tableMedVac        = new TableMedVac({
            navigation:         settings.navigation,
            parentObj:          this,
            uniqueKey:          `${settings.uniqueKey}-medvac`,
            elemDivContainer:   elemTabFatMedVac,
            medvacType:         MULTIKEY_OBJ_TYPE.PIG_PROD,
            isProdHistory:      isProdHistory
        });
        this.tableMedVac.init();
        
        
        this.tablePigProdNotes  = new TableNotes({
            navigation:         settings.navigation,
            parentObj:          this,
            uniqueKey:          `${settings.uniqueKey}-notes`,
            elemDivContainer:   elemTabFatNotes,
            notesType:          MULTIKEY_OBJ_TYPE.PIG_PROD,
            isProdHistory:      isProdHistory
        });
        this.tablePigProdNotes.init();
        
        
        this.tablePigProdHealth = new TableHealthIssue({
            navigation:         settings.navigation,
            parentObj:          this,
            uniqueKey:          `${settings.uniqueKey}-health`,
            elemDivContainer:   elemTabFatHealth,
            healthType:         MULTIKEY_OBJ_TYPE.PIG_PROD,
            isProdHistory:      isProdHistory
        });
        this.tablePigProdHealth.init();
        
        
        
        
       
        this.prodEntryBirth    = new ProdEntryBirth({
            navigation:         navigation,
            parentObj:          this,
            uniqueKey:          `${settings.uniqueKey}-birth`,
            elemDivContainer:   elemTabFatBirth,
            isProdHistory:      isProdHistory
        });
        this.prodEntryBirth.init();
        
        
        this.prodEntryWean      = new ProdEntryWean({
            navigation:         navigation,
            parentObj:          this,
            uniqueKey:          `${settings.uniqueKey}-wean`,
            elemDivContainer:   elemTabFatWean,
            isProdHistory:      isProdHistory
        });
        this.prodEntryWean.init();
        
    
        this.prodEntryMating     = new ProdEntryMating({
            navigation:         navigation,
            parentObj:          this,
            uniqueKey:          `${settings.uniqueKey}-insem`,
            elemDivContainer:   elemTabFatMating,
            isProdHistory:      isProdHistory
        });
        this.prodEntryMating.init();
        
        
        this.componentTabsWithMore.beforeShowTab = this.beforeShowTab;
    }
    
    
    this._bindEventListenersThis = function(){
       
    }
    

    
    this.show = function(data_pig_prod, options){
        dataPigProd = data_pig_prod;
        
        console.log('dataPigProd');
        console.log(dataPigProd);
        
        // Change options only if there is a given options
        if (options){
            showOptions = options;
        }
        
        this.populateHeader(data_pig_prod, showOptions);
        
        if (curTabFat == null){
            curTabFat = thisObj.TAB_FAT_FEED_SUMMARY;
        }
        
        
        // Override if specified
        if (showOptions.tab_lacta){
            curTabFat = showOptions.tab_lacta;
        }
        
        
        let is_to_request_details = 0;
        
        
        // Request pig_prod data details if there is none yet
        if ('data_details' in data_pig_prod){
            thisObj.switchTab(curTabFat);
            
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
                thisObj.switchTab(curTabFat);
            }
            navigation.pigFarm.managerPigProd.requestPigProdDetails(
                dataPigProd, callback_success);
        }
        else{
            thisObj.switchTab(curTabFat);
        }
    }
    

    
    this.switchTab = function(tab_fattening){
        
        switch(tab_fattening){
            case thisObj.TAB_FAT_FEED_SUMMARY:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabFatProdSummary);
                break;
            }
            
            case thisObj.TAB_FAT_PROD_FEED:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabFatProdFeed);
                break;
            }
            
            case thisObj.TAB_FAT_FEED_BALANCE:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabFatFeedBalance);
                break;
            }
            
            
            case thisObj.TAB_FAT_HARVEST:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabFatHarvest);
                break;
            }
            
            
            
            case thisObj.TAB_FAT_MEDVAC:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabFatMedVac);
                break;
            }
            
            case thisObj.TAB_FAT_HEALTH:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabFatHealth);
                break;
            }
            
            
            
            case thisObj.TAB_FAT_NOTES:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabFatNotes);
                break;
            }
            
            
            case thisObj.TAB_FAT_WEAN:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabFatWean);
                break;
            }
            
            case thisObj.TAB_FAT_BIRTH:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabFatBirth);
                break;
            }
            
            case thisObj.TAB_FAT_MATING:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabFatMating);
                break;
            }
            
            default: {
                thisObj.componentTabsWithMore.switchTab(elemIdTabFatProdSummary)
                break;
            }

        }
        
    }
    
    
    this.beforeShowTab = function(tabId){

        switch(tabId) {
            case elemIdTabFatProdSummary:{
                thisObj.pigProdSummary.beforeShow(dataPigProd);
                
                curTabFat = thisObj.TAB_FAT_FEED_SUMMARY;
                break;
            }
            
            
            case elemIdTabFatProdFeed:{
                //thisObj.tablePigProdFeed.beforeShow(dataPigProd);
                thisObj.prodFeeds.beforeShow(dataPigProd);
                
                curTabFat = thisObj.TAB_FAT_PROD_FEED;
                break;
            }
            
            
            case elemIdTabFatFeedBalance:{
                thisObj.tableFeedBalance.beforeShow(dataPigProd);
                
                curTabFat = thisObj.TAB_FAT_FEED_BALANCE;
                break;
            }
            
            
            case elemIdTabFatHarvest:{
                thisObj.prodHarvestList.beforeShow(dataPigProd);
                
                curTabFat = thisObj.TAB_FAT_HARVEST;
                break;
            }
            
            
            
            case elemIdTabFatMedVac:{
                thisObj.tableMedVac.beforeShow(dataPigProd);
                
                curTabFat = thisObj.TAB_FAT_MEDVAC;
                break;
            }
            
            case elemIdTabFatHealth:{
                thisObj.tablePigProdHealth.beforeShow(dataPigProd);
                
                curTabFat = thisObj.TAB_FAT_HEALTH;
                break;
            }
            
            
            
            case elemIdTabFatNotes:{
                thisObj.tablePigProdNotes.beforeShow(dataPigProd);
                
                curTabFat = thisObj.TAB_FAT_NOTES;
                break;
            }
            
            case elemIdTabFatWean:{
                // Set Wean tab
                const options_wean ={
                }
                thisObj.prodEntryWean.beforeShow(dataPigProd, options_wean);
                
                
                curTabFat = thisObj.TAB_FAT_WEAN;
                break;
            }
            
            case elemIdTabFatBirth:{
                // Set Birth tab
                const options_birth ={
                    is_read_only: true
                }
                thisObj.prodEntryBirth.beforeShow(dataPigProd, options_birth);
                
                curTabFat = thisObj.TAB_FAT_BIRTH;
                break;
            }
            
            case elemIdTabFatMating:{
                // Set Insemination tab
                const options_insem ={
                    is_read_only:   true
                }
                thisObj.prodEntryMating.beforeShow(dataPigProd, options_insem);
                
                curTabFat = thisObj.TAB_FAT_MATING;
                break;
            }
            
        }
        
    }
    
}   
