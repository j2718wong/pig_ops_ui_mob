// page_prod_lactating_entry.js

// January 1, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageProdEntryCommon}    from './page_prod_entry_common.js';

import {PAGE_ID,
        SOW_STATUS,
        PIG_OPERATION_TYPE,
        MULTIKEY_OBJ_TYPE}      from '../../../constants.js';


import {DEFAULT_LABEL_TABS}     from '../default_strings_gesta_lacta.js';


import {ProdEntryPigOps}        from './prod_entry_pig_ops.js'
import {ProdEntryMating}        from './prod_entry_mating.js'
import {ProdEntryBirth}         from './prod_entry_birth.js'
import {ProdEntryWean}          from './prod_entry_wean.js'

import {TableMedVac}            from '../../multikey/table_medvac.js'
import {TableNotes}             from '../../multikey/table_notes.js'
import {TableHealthIssue}       from '../../multikey/table_health_issue.js'

import {ProdSummary}            from '../summary/prod_summary.js'

import {TablePigProdFeed}       from '../../feeds/prod_feed/table_prod_feed.js'


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
    
    
    this.PAGE_ID                = PAGE_ID.PROD_LACTA_ENTRY;
    
    
    this.TAB_LACTA_PIGOPS       = 1;
    this.TAB_LACTA_BIRTH        = 2;
    this.TAB_LACTA_WEAN         = 3;
    this.TAB_LACTA_MEDVAC       = 4;
    
    this.TAB_LACTA_HEALTH       = 5;
    this.TAB_LACTA_FEED_SUMMARY = 6;
    this.TAB_LACTA_PROD_FEED    = 7;
    this.TAB_LACTA_NOTES        = 8;
    this.TAB_LACTA_MATING       = 9;
    
    
    let elemIdTabLactaPigOps        = `prod-lacta-pigops`;
    let elemIdTabLactaBirth         = `prod-lacta-birth`;
    let elemIdTabLactaWean          = `prod-lacta-wean`;
    let elemIdTabLactaMedVac        = `prod-lacta-medvac`;
    
    let elemIdTabLactaHealth        = `prod-lacta-health`;
    let elemIdTabLactaFeedSummary   = `prod-lacta-feed-summary`;
    let elemIdTabLactaProdFeed      = `prod-lacta-feed-add`;
    let elemIdTabLactaNotes         = `prod-lacta-notes`;
    let elemIdTabLactaMating        = `prod-lacta-mating`;
    let elemIdTabLactaExtra         = `prod-lacta-extra`;
    
    
    // Keep the labels short on the first 4 tabs
    let labelTabLactaPigOps         = DEFAULT_LABEL_TABS.PIGOPS;
    let labelTabLactaBirth          = DEFAULT_LABEL_TABS.BIRTH;
    let labelTabLactaWean           = DEFAULT_LABEL_TABS.WEAN;
    let labelTabLactaMedVac         = DEFAULT_LABEL_TABS.MEDVAC;
           
    
    // Tabs shown on More modal
    let labelTabLactaHealth         = DEFAULT_LABEL_TABS.HEALTH;
    let labelTabLactaFeedSummary    = DEFAULT_LABEL_TABS.FEED_SUMMARY;
    let labelTabLactaProdFeed       = DEFAULT_LABEL_TABS.PROD_FEED;
    let labelTabLactaNotes          = DEFAULT_LABEL_TABS.NOTES;
    let labelTabLactaMating         = DEFAULT_LABEL_TABS.MATING;
    let labelTabLactaExtra          = DEFAULT_LABEL_TABS.EXTRA;
    
    
    const helper = navigation.managerTranslations.translationHelper;

    
    labelTabLactaPigOps         = helper.getSimpleTranslation('common_app.label_tabs.pigops') || labelTabLactaPigOps;
    labelTabLactaBirth          = helper.getSimpleTranslation('common_app.label_tabs.birth')   || labelTabLactaBirth;
    labelTabLactaWean           = helper.getSimpleTranslation('common_app.label_tabs.wean') || labelTabLactaWean;
    labelTabLactaMedVac         = helper.getSimpleTranslation('common_app.label_tabs.medvac') || labelTabLactaMedVac;
                                                                                                                       
    labelTabLactaHealth         = helper.getSimpleTranslation('common_app.label_tabs.health') || labelTabLactaHealth;
    labelTabLactaFeedSummary    = helper.getSimpleTranslation('common_app.label_tabs.feed_summary') || labelTabLactaFeedSummary;
    labelTabLactaProdFeed       = helper.getSimpleTranslation('common_app.label_tabs.feed_add') || labelTabLactaProdFeed;
    labelTabLactaNotes          = helper.getSimpleTranslation('common_app.label_tabs.notes') || labelTabLactaNotes;
    labelTabLactaMating         = helper.getSimpleTranslation('common_app.label_tabs.mating') || labelTabLactaMating;
    labelTabLactaExtra          = helper.getSimpleTranslation('common_app.label_tabs.extra') || labelTabLactaExtra;
    
    
    let tabsProdLacta = [
        {
            data_tab_id:    elemIdTabLactaPigOps,
            label:          labelTabLactaPigOps
        },
        
        {
            data_tab_id:    elemIdTabLactaBirth,
            label:          labelTabLactaBirth
        },
        
        {
            data_tab_id:    elemIdTabLactaWean,
            label:          labelTabLactaWean
        },
        
        {
            data_tab_id:    elemIdTabLactaMedVac,
            label:          labelTabLactaMedVac
        },
        
        
        {
            data_tab_id:    elemIdTabLactaHealth,
            label:          labelTabLactaHealth
        },
        
        {
            data_tab_id:    elemIdTabLactaFeedSummary,
            label:          labelTabLactaFeedSummary
        },
        
        {
            data_tab_id:    elemIdTabLactaProdFeed,
            label:          labelTabLactaProdFeed
        },
        
        
        {
            data_tab_id:    elemIdTabLactaNotes,
            label:          labelTabLactaNotes
        },
        
        {
            data_tab_id:    elemIdTabLactaMating,
            label:          labelTabLactaMating
        }
    ];
    
    
    
    let elemTabLactaPigOps          = null;
    let elemTabLactaBirth           = null;
    let elemTabLactaWean            = null;
    let elemTabLactaMedVac          = null;
                                        
    let elemTabLactaHealth          = null;
    let elemTabLactaFeedSummary     = null;
    let elemTabLactaProdFeed        = null;
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
        
        
        this.prodSummary        = new ProdSummary({
            navigation:         settings.navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-lacta-feed-summary',
            elemDivContainer:   elemTabLactaFeedSummary
        });
        this.prodSummary.init();
        
        
        this.tablePigProdFeed   = new TablePigProdFeed({
            navigation:         settings.navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-feed',
            elemDivContainer:   elemTabLactaProdFeed,
            parentPageId:       PAGE_ID.PROD_LACTA_ENTRY
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
            
            case thisObj.TAB_LACTA_MATING:{
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
                thisObj.prodEntryBirth.beforeShow(dataPigProd, options_birth);
                
                curTabLacta = thisObj.TAB_LACTA_BIRTH;
                break;
            }
            
            
            case elemIdTabLactaWean:{
                // Set Birth tab
                const options_wean ={
                }
                thisObj.prodEntryWean.beforeShow(dataPigProd, options_wean);
                
                
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
            
            
            case elemIdTabLactaFeedSummary:{
                thisObj.prodSummary.beforeShow(dataPigProd);
                
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
                thisObj.prodEntryMating.beforeShow(dataPigProd, options_insem);
                
                curTabLacta = thisObj.TAB_GESTA_MATING;
                break;
            }
            
        }
        
    }
    
}   
