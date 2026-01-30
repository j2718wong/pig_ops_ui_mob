// January 1, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageProdEntryCommon}    from './page_prod_entry_common.js';

import {PAGE_ID,
        SOW_STATUS,
        PIG_OPERATION_TYPE}     from '../../../constants.js';



import {ProdEntryPigOps}        from './prod_entry_pig_ops.js'
import {ProdEntryBirth}         from './prod_entry_birth.js'
import {prodEntryMating}        from './prod_entry_mating.js'



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
    
    
    this.TAB_GESTA_PIGOPS       = 1;
    this.TAB_GESTA_BIRTH        = 2;
    this.TAB_GESTA_MATING       = 3;
    
    
    let elemIdTabGestaPigOps    = `prod-gesta-pigops`;
    let elemIdTabGestaBirth     = `prod-gesta-birth`;
    let elemIdTabGestaMating    = `prod-gesta-mating`;
        
    
    let tabsProdGesta = [
        {
            data_tab_id:    elemIdTabGestaPigOps,
            label:          'PigOps'
        },
        
        {
            data_tab_id:    elemIdTabGestaBirth,
            label:          'Birth'
        },
        
        {
            data_tab_id:    elemIdTabGestaMating,
            label:          'Mating'
        }
    ];
    
    
    
    let elemTabGestaPigOps          = null;
    let elemTabGestaBirth           = null;
    let elemTabGestaMating          = null;
                                        
    
    
    let dataPigProd                 = null;
    
    
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
        
        
        
        this.componentTabsWithMore.beforeShowTab = this.beforeShowTab;
    }
    
    
    this._bindEventListenersThis = function(){
       
    }
    

    
    this.show = function(data_pig_prod, options){
        dataPigProd = data_pig_prod;
        
        this.populateHeader(dataPigProd, options);
        
        
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

        }
        
    }
    
    
    this.beforeShowTab = function(tabId){
        switch(tabId) {
            case elemIdTabGestaPigOps:{
                // Set PigProdOps tab
                const options_pig_prod_ops ={
                    show_gesta:   true
                }
                thisObj.prodEntryPigOps.show(dataPigProd, options_pig_prod_ops);
            
                curTab = thisObj.TAB_GESTA_PIGOPS;
                break;
            }
            
            case elemIdTabGestaBirth:{
                // Set Birth tab
                const options_birth ={
                }
                thisObj.prodEntryBirth.show(dataPigProd, options_birth);
                
                curTab = thisObj.TAB_GESTA_BIRTH;
                break;
            }
            
            case elemIdTabGestaMating:{
                // Set Insemination tab
                const options_insem ={
                    is_read_only:   false
                }
                thisObj.prodEntryMating.show(dataPigProd, options_insem);
                
                curTab = thisObj.TAB_GESTA_MATING;
                break;
            }
            
        }
    }
      
    
    
    
}   