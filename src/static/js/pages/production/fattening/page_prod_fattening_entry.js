// February 9, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageProdEntryCommon}    from '../gesta_lacta/page_prod_entry_common.js';

import {PAGE_ID,
        SOW_STATUS,
        PIG_OPERATION_TYPE,
        MULTIKEY_OBJ_TYPE}             from '../../../constants.js';


import {ComponentTabsWithMore}  from '../../common/ui/comp_tabs_with_more.js';

import {ProdEntryMating}        from '../gesta_lacta/prod_entry_mating.js'
import {ProdEntryBirth}         from '../gesta_lacta/prod_entry_birth.js'
import {ProdEntryWean}          from '../gesta_lacta/prod_entry_wean.js'

import {TableMedVac}            from '../../multikey/table_medvac.js'
import {TableNotes}             from '../../multikey/table_notes.js'
import {TableHealthIssue}       from '../../multikey/table_health_issue.js'

import {ProdFeedSummary}        from '../feeds/prod_feed_summary.js'
import {TablePigProdFeed}       from '../../feeds/prod_feed/table_prod_feed.js'
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
        uniqueKey:              'prod-fat'
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
    this.TAB_FAT_PIG_DEAD       = 7;
    this.TAB_FAT_NOTES          = 8;
    this.TAB_FAT_WEAN           = 9;
    this.TAB_FAT_BIRTH          = 10;
    this.TAB_FAT_MATING         = 11;
    this.TAB_FAT_EXTRA          = 12;
    
    
    let elemIdTabFatProdSummary = `prod-fat-feed-summary`;
    let elemIdTabFatProdFeed    = `prod-fat-prod-feed`;
    let elemIdTabFatFeedBalance = `prod-fat-feed-bal`;
    let elemIdTabFatHarvest     = `prod-fat-harvest`;
    
    let elemIdTabFatMedVac      = `prod-fat-medvac`;
    let elemIdTabFatHealth      = `prod-fat-health`;
    let elemIdTabFatPigDead     = `prod-fat-pig-dead`;
    let elemIdTabFatNotes       = `prod-fat-notes`;
    let elemIdTabFatWean        = `prod-fat-wean`;
    let elemIdTabFatBirth       = `prod-fat-birth`;
    let elemIdTabFatMating      = `prod-fat-mating`;
    let elemIdTabFatExtra       = `prod-fat-extra`;
    
    
    let tabsProdFattening = [
        {
            data_tab_id:    elemIdTabFatProdSummary,
            label:          'Prod'
        },
        
        {
            data_tab_id:    elemIdTabFatProdFeed,
            label:          'Feeds'
        },
        
        {
            data_tab_id:    elemIdTabFatFeedBalance,
            label:          'Bal'
        },
        
        {
            data_tab_id:    elemIdTabFatHarvest,
            label:          'Harvest'
        },
        
        
        
        {
            data_tab_id:    elemIdTabFatMedVac,
            label:          'MedVac'
        },
        
        {
            data_tab_id:    elemIdTabFatHealth,
            label:          'Health'
        },
        
        {
            data_tab_id:    elemIdTabFatPigDead,
            label:          'Pig Dead'
        },
        
        
        {
            data_tab_id:    elemIdTabFatNotes,
            label:          'Notes'
        },
        
        {
            data_tab_id:    elemIdTabFatWean,
            label:          'Wean'
        },
        
        {
            data_tab_id:    elemIdTabFatBirth,
            label:          'Birth'
        },
        
        {
            data_tab_id:    elemIdTabFatMating,
            label:          'Mating'
        },
        
        {
            data_tab_id:    elemIdTabFatExtra,
            label:          'Extra'
        }
    ];
    
    
    let elemTabFatProdSummary   = null; 
    let elemTabFatProdFeed       = null;
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
        elemTabFatPigDead       = elemDivContainer.querySelector('#'+elemIdTabFatPigDead); 
        elemTabFatNotes         = elemDivContainer.querySelector('#'+elemIdTabFatNotes);  
        elemTabFatWean          = elemDivContainer.querySelector('#'+elemIdTabFatWean);  
        elemTabFatBirth         = elemDivContainer.querySelector('#'+elemIdTabFatBirth);     
        elemTabFatMating        = elemDivContainer.querySelector('#'+elemIdTabFatMating);    
        elemTabFatExtra         = elemDivContainer.querySelector('#'+elemIdTabFatExtra);   
       
    }
    
    
    this._processAfterHtmlRenderThis = function(){
       
        this.pigProdSummary    = new ProdFeedSummary({
            navigation:         settings.navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-fat-feed-summary',
            elemDivContainer:   elemTabFatProdSummary,
            includeProdSummary: true
        });
        this.pigProdSummary.init();
        
        
        this.tablePigProdFeed   = new TablePigProdFeed({
            navigation:         settings.navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-fat-feed',
            elemDivContainer:   elemTabFatProdFeed,
            parentPageId:       PAGE_ID.PROD_FATTENING_ENTRY
        });
        this.tablePigProdFeed.init();
        
        
        this.tableFeedBalance   = new TableFeedBalance({
            navigation:         settings.navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-fat-feed-bal',
            elemDivContainer:   elemTabFatFeedBalance,
            parentPageId:       PAGE_ID.PROD_FATTENING_ENTRY
        });
        this.tableFeedBalance.init();

        
        this.prodHarvestList    = new ProdHarvestList({
            navigation:         settings.navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-harvest-list',
            elemDivContainer:   elemTabFatHarvest,
            parentPageId:       PAGE_ID.PROD_FATTENING_ENTRY
        });
        this.prodHarvestList.init();
        
        
        this.tableMedVac        = new TableMedVac({
            navigation:         settings.navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-fat-medvac',
            elemDivContainer:   elemTabFatMedVac,
            medvacType:         MULTIKEY_OBJ_TYPE.PIG_PROD
        });
        this.tableMedVac.init();
        
        
        this.tablePigProdNotes  = new TableNotes({
            navigation:         settings.navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-fat-notes',
            elemDivContainer:   elemTabFatNotes,
            notesType:          MULTIKEY_OBJ_TYPE.PIG_PROD
        });
        this.tablePigProdNotes.init();
        
        
        this.tablePigProdHealth = new TableHealthIssue({
            navigation:         settings.navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-fat-health',
            elemDivContainer:   elemTabFatHealth,
            healthType:         MULTIKEY_OBJ_TYPE.PIG_PROD
        });
        this.tablePigProdHealth.init();
        
        
        
        
       
        this.prodEntryBirth    = new ProdEntryBirth({
            navigation:         navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-fat-birth',
            elemDivContainer:   elemTabFatBirth
        });
        this.prodEntryBirth.init();
        
        
        this.prodEntryWean      = new ProdEntryWean({
            navigation:         navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-fat-wean',
            elemDivContainer:   elemTabFatWean
        });
        this.prodEntryWean.init();
        
    
        this.prodEntryMating     = new ProdEntryMating({
            navigation:         navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-fat-insem',
            elemDivContainer:   elemTabFatMating
        });
        this.prodEntryMating.init();
        
        
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
        
        if (curTabFat == null){
            curTabFat = thisObj.TAB_FAT_FEED_SUMMARY;
        }
        
        
        // Override if specified
        if (showOptions.tab_lacta){
            curTabFat = showOptions.tab_lacta;
        }
        
        // Request pig_prod data details if there is none yet
        if ('data_details' in data_pig_prod){
            thisObj.switchTab(curTabFat);
        }
        else{
            const callback_success = function(){
                thisObj.switchTab(curTabFat);
            }
            navigation.pigFarm.managerPigProd.requestPigProdDetails(
                dataPigProd, callback_success);
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
            
            
            case thisObj.TAB_FAT_PIG_DEAD:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabFatPigDead);
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
            
            case thisObj.TAB_GESTA_MATING:{
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
        console.log('beforeShowTab');
        console.log('beforeShowTab tabId = ' + tabId);
        console.log(dataPigProd);
        
        switch(tabId) {
            case elemIdTabFatProdSummary:{
                thisObj.pigProdSummary.beforeShow(dataPigProd);
                
                curTabFat = thisObj.TAB_FAT_FEED_SUMMARY;
                break;
            }
            
            
            case elemIdTabFatProdFeed:{
                thisObj.tablePigProdFeed.beforeShow(dataPigProd);
                
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
            
            case elemIdTabFatPigDead:{
                curTabFat = thisObj.TAB_FAT_PIG_DEAD;
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
                thisObj.prodEntryWean.show(dataPigProd, options_wean);
                
                
                curTabFat = thisObj.TAB_FAT_WEAN;
                break;
            }
            
            case elemIdTabFatBirth:{
                // Set Birth tab
                const options_birth ={
                    is_read_only: true
                }
                thisObj.prodEntryBirth.show(dataPigProd, options_birth);
                
                curTabFat = thisObj.TAB_FAT_BIRTH;
                break;
            }
            
            case elemIdTabFatMating:{
                // Set Insemination tab
                const options_insem ={
                    is_read_only:   true
                }
                thisObj.prodEntryMating.show(dataPigProd, options_insem);
                
                curTabFat = thisObj.TAB_GESTA_MATING;
                break;
            }
            
        }
        
    }
    
}   
