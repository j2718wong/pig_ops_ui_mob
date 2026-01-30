// January 1, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageProdEntryCommon}    from './page_prod_entry_common.js';

import {PAGE_ID,
        SOW_STATUS,
        PIG_OPERATION_TYPE}     from '../../../constants.js';


import {ComponentTabsWithMore}  from '../../common/ui/comp_tabs_with_more.js';

import {ProdEntryNotes}         from './prod_entry_notes.js'
import {ProdEntryPigOps}        from './prod_entry_pig_ops.js'
import {ProdEntryMating}         from './prod_entry_insem.js'
import {ProdEntryBirth}         from './prod_entry_birth.js'



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
    this.TAB_LACTA_FEED_ADD     = 8;
    this.TAB_LACTA_NOTES        = 9;
    this.TAB_LACTA_MATING       = 10;
    
    
    
    
    let elemIdTabLactaPigOps        = `prod-lacta-pigops`;
    let elemIdTabLactaBirth         = `prod-lacta-birth`;
    let elemIdTabLactaWean          = `prod-lacta-wean`;
    let elemIdTabLactaMedVac        = `prod-lacta-medvac`;
    
    let elemIdTabLactaHealth        = `prod-lacta-health`;
    let elemIdTabLactaPigDead       = `prod-lacta-pig-dead`;
    let elemIdTabLactaFeedSummary   = `prod-lacta-feed-summary`;
    let elemIdTabLactaFeedAdd       = `prod-lacta-feed-add`;
    let elemIdTabLactaNotes         = `prod-lacta-notes`;
    let elemIdTabLactaMating        = `prod-lacta-mating`;
    
    
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
            data_tab_id:    elemIdTabLactaFeedAdd,
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
    let elemTabLactaFeedAdd         = null;
    let elemTabLactaNotes           = null;
    let elemTabLactaMating          = null;
    
                                        
    
    
    let dataPigProd                 = null;
    
    
    let curTab                      = null;
    
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
        elemTabLactaFeedAdd         = elemDivContainer.querySelector('#'+elemIdTabLactaFeedAdd);
        elemTabLactaNotes           = elemDivContainer.querySelector('#'+elemIdTabLactaNotes);
        elemTabLactaMating          = elemDivContainer.querySelector('#'+elemIdTabLactaMating);
        
    }
    
    
    this._processAfterHtmlRenderThis = function(){
        this.prodEntryPigOps    = new ProdEntryPigOps({
            navigation:         navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-lacta-pigops',
            elemDivContainer:   elemTabGestaPigOps
        });
        this.prodEntryPigOps.init();
        
        
        this.prodEntryBirth    = new ProdEntryBirth({
            navigation:         navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-lacta-birth',
            elemDivContainer:   elemTabGestaBirth
        });
        this.prodEntryBirth.init();
        
    
        this.ProdEntryMating     = new ProdEntryMating({
            navigation:         navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-lacta-insem',
            elemDivContainer:   elemTabGestaInsem
        });
        this.ProdEntryMating.init();
        
        

    }
    
    
    this._bindEventListenersThis = function(){
       
    }
    

    
    this.show = function(data_pig_prod, options){
        dataPigProd = data_pig_prod;
        
        this.populateHeader(data_pig_prod, options);
        
        if (curTab == null){
            curTab = thisObj.TAB_LACTA_PIGOPS;
        }
        
        thisObj.switchTab(curTab);
        
    }
    

    
    this.switchTab = function(tab_lacta){
        curTab = tab_lacta;
        
        
        switch(tab_lacta){
            case thisObj.TAB_LACTA_PIGOPS:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabGestaPigOps)
                break;
            }
            
            case thisObj.TAB_LACTA_BIRTH:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabGestaBirth);
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
            
            
            case thisObj.TAB_LACTA_FEED_ADD:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabLactaFeedAdd);
                break;
            }
            
            
            case thisObj.TAB_LACTA_NOTES:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabLactaNotes);
                break;
            }
            
            case thisObj.TAB_GESTA_MATING:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabGestaMating);
                break;
            }

        }
        
    }
    
    
    this.beforeShowTab = function(tab_id){
        switch(tabId) {
            case elemIdTabLactaPigOps:{
                // Set PigProdOps tab
                const options_pig_prod_ops ={
                    show_gesta:   false
                }
                thisObj.prodEntryPigOps.show(dataPigProd, options_pig_prod_ops);
        
                break;
            }
            
            case elemIdTabLactaBirth:{
                // Set Birth tab
                const options_birth ={
                }
                thisObj.prodEntryBirth.show(dataPigProd, options_birth);
                
                break;
            }
            
            
            case elemIdTabLactaWean:{
                break;
            }
            
            
            case elemIdTabLactaMedVac:{
                break;
            }
            
            case elemIdTabLactaHealth:{
                break;
            }
            
            case elemIdTabLactaPigDead:{
                break;
            }
            
            case elemIdTabLactaFeedSummary:{
                break;
            }
            
            
            case elemIdTabLactaFeedAdd:{
                break;
            }
            
            case elemIdTabLactaNotes:{
                break;
            }
            
            
            case elemIdTabGestaMating:{
                // Set Insemination tab
                const options_insem ={
                    is_read_only:   true
                }
                thisObj.prodEntryMating.show(dataPigProd, options_insem);
                
                
                break;
            }
            
        }
        
    }
    
}   