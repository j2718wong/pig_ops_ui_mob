// January 1, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageProdEntryCommon}    from './page_prod_entry_common.js';

import {PAGE_ID,
        SOW_STATUS,
        PIG_OPERATION_TYPE}     from '../../../constants.js';


import {DEFAULT_LABEL_TABS}     from '../default_strings_gesta_lacta.js';


import {ProdEntryPigOps}        from './prod_entry_pig_ops.js'
import {ProdEntryBirth}         from './prod_entry_birth.js'
import {ProdEntryMating}        from './prod_entry_mating.js'
import {ProdEntryUpdateGestaStatus} from './prod_entry_gesta_status.js'




export function PageProdGestatingEntry(input_settings){
    PageProdEntryCommon.call(this, input_settings);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContProdGestaEntry
        uniqueKey:              'prod-gesta'
    };
    */
    const settings              = input_settings;

   
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
    
    
    this.PAGE_ID                = PAGE_ID.PROD_GESTA_ENTRY;
    
    
    this.TAB_GESTA_PIGOPS       = 1;
    this.TAB_GESTA_BIRTH        = 2;
    this.TAB_GESTA_MATING       = 3;
    this.TAB_GESTA_STATUS       = 4;       
    
    
    let elemIdTabGestaPigOps    = `prod-gesta-pigops`;
    let elemIdTabGestaBirth     = `prod-gesta-birth`;
    let elemIdTabGestaMating    = `prod-gesta-mating`;
    let elemIdTabGestaStatus    = `prod-gesta-status`;
        
    
    let labelTabGestaPigOps     = DEFAULT_LABEL_TABS.PIGOPS;
    let labelTabGestaBirth      = DEFAULT_LABEL_TABS.BIRTH;
    let labelTabGestaMating     = DEFAULT_LABEL_TABS.MATING;
    let labelTabGestaStatus     = DEFAULT_LABEL_TABS.STATUS;
    
        
    const helper = navigation.managerTranslations.translationHelper;
    
    
    labelTabGestaPigOps         = helper.getSimpleTranslation('common_app.label_tabs.pigops') || labelTabGestaPigOps;
    labelTabGestaBirth          = helper.getSimpleTranslation('common_app.label_tabs.birth')   || labelTabGestaBirth;
    labelTabGestaMating         = helper.getSimpleTranslation('common_app.label_tabs.mating') || labelTabGestaMating;
    labelTabGestaStatus         = helper.getSimpleTranslation('common_app.label_tabs.status') || labelTabGestaStatus;
 
    
    let tabsProdGesta = [
        {
            data_tab_id:    elemIdTabGestaPigOps,
            label:          labelTabGestaPigOps
        },
        
        {
            data_tab_id:    elemIdTabGestaBirth,
            label:          labelTabGestaBirth
        },
        
        {
            data_tab_id:    elemIdTabGestaMating,
            label:          labelTabGestaMating
        },
        
        {
            data_tab_id:    elemIdTabGestaStatus,
            label:          labelTabGestaStatus
        }

    ];
    
    
    
    let elemTabGestaPigOps          = null;
    let elemTabGestaBirth           = null;
    let elemTabGestaMating          = null;
    let elemTabGestaStatus          = null;
                                        
    
    
    let dataPigProd                 = null;
    let showOptions                 = null;
    
    let curTab                      = null;
    
    
    this.setDataTabMenus(tabsProdGesta);
    
    
    
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
        elemTabGestaPigOps      = elemDivContainer.querySelector('#'+elemIdTabGestaPigOps);
        elemTabGestaBirth       = elemDivContainer.querySelector('#'+elemIdTabGestaBirth);
        elemTabGestaMating      = elemDivContainer.querySelector('#'+elemIdTabGestaMating);
        elemTabGestaStatus      = elemDivContainer.querySelector('#'+elemIdTabGestaStatus);
    }
    
    
    this._processAfterHtmlRenderThis = function(){
        this.prodEntryPigOps    = new ProdEntryPigOps({
            navigation:         navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-gesta-pigops',
            elemDivContainer:   elemTabGestaPigOps
        });
        this.prodEntryPigOps.init();
        
    
        this.prodEntryMating     = new ProdEntryMating({
            navigation:         navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-gesta-mating',
            elemDivContainer:   elemTabGestaMating
        });
        this.prodEntryMating.init();
        
        
        this.prodEntryBirth    = new ProdEntryBirth({
            navigation:         navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-gesta-birth',
            elemDivContainer:   elemTabGestaBirth
        });
        this.prodEntryBirth.init();
        
        
        
        this.prodEntryGestaStatus = new ProdEntryUpdateGestaStatus({
            navigation:         navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-gesta-status',
            elemDivContainer:   elemTabGestaStatus
        });
        this.prodEntryGestaStatus.init();
        
        
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
        
        this.populateHeader(dataPigProd, showOptions);
        
        
        if (curTab == null){
            curTab = thisObj.TAB_GESTA_PIGOPS;
        }
        
        thisObj.switchTab(curTab);
        
    }
    
    
    this.switchTab = function(tab_gesta){
        
        switch(tab_gesta){
            case thisObj.TAB_GESTA_PIGOPS:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabGestaPigOps)
                break;
            }
            
            case thisObj.TAB_GESTA_BIRTH:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabGestaBirth);
                break;
            }
            
            case thisObj.TAB_GESTA_MATING:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabGestaMating);
                break;
            }
            
            
            case thisObj.TAB_GESTA_STATUS:{
                thisObj.componentTabsWithMore.switchTab(prodEntryGestaStatus);
                break;
            }
            
            
            default:{
                thisObj.componentTabsWithMore.switchTab(elemIdTabGestaPigOps)
                break;
            }

        }
        
    }
    
    
    this.beforeShowTab = function(tabId){
        switch(tabId) {
            case elemIdTabGestaPigOps:{
                // Set PigProdOps tab
                const options = {
                    show_gesta:   true
                };
                
                thisObj.prodEntryPigOps.show(dataPigProd, options);
            
                curTab = thisObj.TAB_GESTA_PIGOPS;
                break;
            }
            
            case elemIdTabGestaBirth:{
                // Set Birth tab
                const options ={
                };
                
                thisObj.prodEntryBirth.beforeShow(dataPigProd, options);
                
                curTab = thisObj.TAB_GESTA_BIRTH;
                break;
            }
            
            case elemIdTabGestaMating:{
                // Set Mating tab
                const options ={
                };
                
                thisObj.prodEntryMating.beforeShow(dataPigProd, options);
                
                curTab = thisObj.TAB_GESTA_BIRTH;
                break;
            }
            
            case elemIdTabGestaStatus:{
                // Set Gesta Status Tab
                const options ={
                };

                thisObj.prodEntryGestaStatus.beforeShow(dataPigProd, options);
                
                curTab = thisObj.TAB_GESTA_STATUS;
                break;
            }
            
        }
    }
      
    
    
    
}   
