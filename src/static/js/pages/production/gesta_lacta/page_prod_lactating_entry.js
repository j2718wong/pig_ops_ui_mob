// January 1, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageProdEntryCommon}    from './page_prod_entry_common.js';

import {PAGE_ID,
        SOW_STATUS,
        PIG_OPERATION_TYPE,
        MULTIKEY_OBJ_TYPE}             from '../../../constants.js';


import {ProdEntryPigOps}        from './prod_entry_pig_ops.js'
import {ProdEntryMating}        from './prod_entry_mating.js'
import {ProdEntryBirth}         from './prod_entry_birth.js'
import {ProdEntryWean}          from './prod_entry_wean.js'

import {TableMedVac}            from '../../multikey/table_medvac.js'
import {TableNotes}             from '../../multikey/table_notes.js'
import {TableHealthIssue}       from '../../multikey/table_health_issue.js'

import {ProdFeedSummary}        from '../feeds/prod_feed_summary.js'

import {TablePigProdFeed}       from '../../feeds/prod_feed/table_prod_feed_add.js'



export function PageProdLactatingEntry(input_settings){
    PageProdEntryCommon.call(this, input_settings);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContProdLactaEntry
        uniqueKey:              'prod-lacta'
    };
    */
    const settings              = input_settings;

    
   
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
    
    
    this.TAB_LACTA_PIGOPS       = 1;
    this.TAB_LACTA_BIRTH        = 2;
    this.TAB_LACTA_WEAN         = 3;
    this.TAB_LACTA_MEDVAC       = 4;
    
    this.TAB_LACTA_HEALTH       = 5;
    this.TAB_LACTA_PIG_DEAD     = 6;
    this.TAB_LACTA_FEED_SUMMARY = 7;
    this.TAB_LACTA_PROD_FEED     = 8;
    this.TAB_LACTA_NOTES        = 9;
    this.TAB_LACTA_MATING       = 10;
    
    
    
    
    let elemIdTabLactaPigOps        = `prod-lacta-pigops`;
    let elemIdTabLactaBirth         = `prod-lacta-birth`;
    let elemIdTabLactaWean          = `prod-lacta-wean`;
    let elemIdTabLactaMedVac        = `prod-lacta-medvac`;
    
    let elemIdTabLactaHealth        = `prod-lacta-health`;
    let elemIdTabLactaPigDead       = `prod-lacta-pig-dead`;
    let elemIdTabLactaFeedSummary   = `prod-lacta-feed-summary`;
    let elemIdTabLactaProdFeed       = `prod-lacta-feed-add`;
    let elemIdTabLactaNotes         = `prod-lacta-notes`;
    let elemIdTabLactaMating        = `prod-lacta-mating`;
    let elemIdTabLactaExtra         = `prod-lacta-extra`;
    
    
    let tabsProdLacta = [
        {
            data_tab_id:    elemIdTabLactaPigOps,
            label:          'PigOps'
        },
        
        {
            data_tab_id:    elemIdTabLactaBirth,
            label:          'Birth'
        },
        
        {
            data_tab_id:    elemIdTabLactaWean,
            label:          'Wean'
        },
        
        {
            data_tab_id:    elemIdTabLactaMedVac,
            label:          'MedVac'
        },
        
        
        {
            data_tab_id:    elemIdTabLactaHealth,
            label:          'Health'
        },
        
        {
            data_tab_id:    elemIdTabLactaPigDead,
            label:          'Pig Dead'
        },
        
        {
            data_tab_id:    elemIdTabLactaFeedSummary,
            label:          'Feed Summary'
        },
        
        {
            data_tab_id:    elemIdTabLactaProdFeed,
            label:          'Feed Add'
        },
        
        
        {
            data_tab_id:    elemIdTabLactaNotes,
            label:          'Notes'
        },
        
        {
            data_tab_id:    elemIdTabLactaMating,
            label:          'Mating'
        }
    ];
    
    
    
    let elemTabLactaPigOps          = null;
    let elemTabLactaBirth           = null;
    let elemTabLactaWean            = null;
    let elemTabLactaMedVac          = null;
                                        
    let elemTabLactaHealth          = null;
    let elemTabLactaPigDead         = null;
    let elemTabLactaFeedSummary     = null;
    let elemTabLactaProdFeed         = null;
    let elemTabLactaNotes           = null;
    let elemTabLactaMating          = null;
    
                                        
    
    
    let dataPigProd                 = null;
    let showOptions                 = null;
    
    let curTabLacta                 = null;
    
    this.setDataTabMenus(tabsProdLacta);
    
    
    
    
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
        elemTabLactaPigOps          = elemDivContainer.querySelector('#'+elemIdTabLactaPigOps);
        elemTabLactaBirth           = elemDivContainer.querySelector('#'+elemIdTabLactaBirth);
        elemTabLactaWean            = elemDivContainer.querySelector('#'+elemIdTabLactaWean);
        elemTabLactaMedVac          = elemDivContainer.querySelector('#'+elemIdTabLactaMedVac);
                                                                                                    
        elemTabLactaHealth          = elemDivContainer.querySelector('#'+elemIdTabLactaHealth);
        elemTabLactaPigDead         = elemDivContainer.querySelector('#'+elemIdTabLactaPigDead);
        elemTabLactaFeedSummary     = elemDivContainer.querySelector('#'+elemIdTabLactaFeedSummary);
        elemTabLactaProdFeed        = elemDivContainer.querySelector('#'+elemIdTabLactaProdFeed);
        elemTabLactaNotes           = elemDivContainer.querySelector('#'+elemIdTabLactaNotes);
        elemTabLactaMating          = elemDivContainer.querySelector('#'+elemIdTabLactaMating);
        
    }
    
    
    this._processAfterHtmlRenderThis = function(){
        this.prodEntryPigOps    = new ProdEntryPigOps({
            navigation:         navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-lacta-pigops',
            elemDivContainer:   elemTabLactaPigOps
        });
        this.prodEntryPigOps.init();
        
        
        this.prodEntryBirth    = new ProdEntryBirth({
            navigation:         navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-lacta-birth',
            elemDivContainer:   elemTabLactaBirth
        });
        this.prodEntryBirth.init();
        
        
        this.prodEntryWean      = new ProdEntryWean({
            navigation:         navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-lacta-wean',
            elemDivContainer:   elemTabLactaWean
        });
        this.prodEntryWean.init();
        
    
        this.tableMedVac        = new TableMedVac({
            navigation:         settings.navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-lacta-medvac',
            elemDivContainer:   elemTabLactaMedVac,
            medvacType:         MULTIKEY_OBJ_TYPE.PIG_PROD
        });
        this.tableMedVac.init();
        
        
        this.prodFeedSummary    = new ProdFeedSummary({
            navigation:         settings.navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-lacta-feed-summary',
            elemDivContainer:   elemTabLactaFeedSummary
        });
        this.prodFeedSummary.init();
        
        
        this.tablePigProdFeed   = new TablePigProdFeed({
            navigation:         settings.navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-feed',
            elemDivContainer:   elemTabLactaProdFeed,
        });
        this.tablePigProdFeed.init();
        
        
        this.tablePigProdNotes  = new TableNotes({
            navigation:         settings.navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-lacta-notes',
            elemDivContainer:   elemTabLactaNotes,
            notesType:          MULTIKEY_OBJ_TYPE.PIG_PROD
        });
        this.tablePigProdNotes.init();
        
        
        this.tablePigProdHealth = new TableHealthIssue({
            navigation:         settings.navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-lacta-health',
            elemDivContainer:   elemTabLactaHealth,
            healthType:         MULTIKEY_OBJ_TYPE.PIG_PROD
        });
        this.tablePigProdHealth.init();
        
        
        
    
    
    
        
    
        this.prodEntryMating     = new ProdEntryMating({
            navigation:         navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-lacta-insem',
            elemDivContainer:   elemTabLactaMating
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
        
        if (curTabLacta == null){
            curTabLacta = thisObj.TAB_LACTA_PIGOPS;
        }
        
        
        // Override if specified
        if (showOptions.tab_lacta){
            curTabLacta = showOptions.tab_lacta;
        }
        
        // Request pig_prod data details if there is none yet
        if ('data_details' in data_pig_prod){
            thisObj.switchTab(curTabLacta);
        }
        else{
            const callback_success = function(){
                thisObj.switchTab(curTabLacta);
            }
            navigation.pigFarm.managerPigProd.requestPigProdDetails(
                dataPigProd, callback_success);
        }
        
        
    
        
    }
    

    
    this.switchTab = function(tab_lacta){
        
        switch(tab_lacta){
            case thisObj.TAB_LACTA_PIGOPS:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabLactaPigOps)
                break;
            }
            
            case thisObj.TAB_LACTA_BIRTH:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabLactaBirth);
                break;
            }
            
            case thisObj.TAB_LACTA_WEAN:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabLactaWean);
                break;
            }
            
            case thisObj.TAB_LACTA_MEDVAC:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabLactaMedVac);
                break;
            }
            
            case thisObj.TAB_LACTA_HEALTH:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabLactaHealth);
                break;
            }
            
            
            case thisObj.TAB_LACTA_PIG_DEAD:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabLactaPigDead);
                break;
            }
            
            case thisObj.TAB_LACTA_FEED_SUMMARY:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabLactaFeedSummary);
                break;
            }
            
            
            case thisObj.TAB_LACTA_PROD_FEED:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabLactaProdFeed);
                break;
            }
            
            
            case thisObj.TAB_LACTA_NOTES:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabLactaNotes);
                break;
            }
            
            case thisObj.TAB_GESTA_MATING:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabLactaMating);
                break;
            }
            
            default: {
                thisObj.componentTabsWithMore.switchTab(elemIdTabLactaPigOps)
                break;
            }

        }
        
    }
    
    
    this.beforeShowTab = function(tabId){
        console.log('beforeShowTab');
        console.log('beforeShowTab tabId = ' + tabId);
        console.log(dataPigProd);
        
        switch(tabId) {
            case elemIdTabLactaPigOps:{
                // Set PigProdOps tab
                const options_pig_prod_ops ={
                    show_gesta:   false
                }
                thisObj.prodEntryPigOps.show(dataPigProd, options_pig_prod_ops);
        
                curTabLacta = thisObj.TAB_LACTA_PIGOPS;
                break;
            }
            
            case elemIdTabLactaBirth:{
                // Set Birth tab
                const options_birth ={
                }
                thisObj.prodEntryBirth.show(dataPigProd, options_birth);
                
                curTabLacta = thisObj.TAB_LACTA_BIRTH;
                break;
            }
            
            
            case elemIdTabLactaWean:{
                // Set Birth tab
                const options_wean ={
                }
                thisObj.prodEntryWean.show(dataPigProd, options_wean);
                
                
                curTabLacta = thisObj.TAB_LACTA_WEAN;
                break;
            }
            
            
            case elemIdTabLactaMedVac:{
                thisObj.tableMedVac.beforeShow(dataPigProd);
                
                curTabLacta = thisObj.TAB_LACTA_MEDVAC;
                break;
            }
            
            case elemIdTabLactaHealth:{
                thisObj.tablePigProdHealth.beforeShow(dataPigProd);
                
                curTabLacta = thisObj.TAB_LACTA_HEALTH;
                break;
            }
            
            case elemIdTabLactaPigDead:{
                curTabLacta = thisObj.TAB_LACTA_PIG_DEAD;
                break;
            }
            
            case elemIdTabLactaFeedSummary:{
                thisObj.prodFeedSummary.beforeShow(dataPigProd);
                
                curTabLacta = thisObj.TAB_LACTA_FEED_SUMMARY;
                break;
            }
            
            
            case elemIdTabLactaProdFeed:{
                thisObj.tablePigProdFeed.beforeShow(dataPigProd);
                
                curTabLacta = thisObj.TAB_LACTA_PROD_FEED;
                break;
            }
            
            case elemIdTabLactaNotes:{
                thisObj.tablePigProdNotes.beforeShow(dataPigProd);
                
                curTabLacta = thisObj.TAB_LACTA_NOTES;
                break;
            }
            
            
            case elemIdTabLactaMating:{
                // Set Insemination tab
                const options_insem ={
                    is_read_only:   true
                }
                thisObj.prodEntryMating.show(dataPigProd, options_insem);
                
                curTabLacta = thisObj.TAB_GESTA_MATING;
                break;
            }
            
        }
        
    }
    
}   
