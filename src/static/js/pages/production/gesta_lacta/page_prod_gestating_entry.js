// January 1, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageProdEntryCommon}    from './page_prod_entry_common.js';

import {PAGE_ID,
        SOW_STATUS,
        PIG_OPERATION_TYPE}     from '../../../constants.js';


import {ProdEntryNotes}         from './prod_entry_notes.js'
import {ProdEntryPigOps}        from './prod_entry_pig_ops.js'
import {ProdEntryInsem}         from './prod_entry_insem.js'
import {ProdEntryBirth}         from './prod_entry_birth.js'



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
        
    
    let elemIdTabGestaPigOps    = `prod-gesta-pigops`;
    let elemIdTabGestaBirth     = `prod-gesta-birth`;
    let elemIdTabGestaInsem     = `prod-gesta-insem`;
    let elemIdTabGestaNotes     = `prod-gesta-notes`;
        
    
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
            data_tab_id:    elemIdTabGestaInsem,
            label:          'Insem'
        },
        
        {
            data_tab_id:    elemIdTabGestaNotes,
            label:          'Notes'
        }
    ];
    
    
    
    let elemTabGestaPigOps          = null;
    let elemTabGestaBirth           = null;
    let elemTabGestaInsem           = null;
    let elemTabGestaNotes           = null;
                                        
    
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
        elemTabGestaInsem       = elemDivContainer.querySelector('#'+elemIdTabGestaInsem);
        elemTabGestaNotes       = elemDivContainer.querySelector('#'+elemIdTabGestaNotes);
    }
    
    
    this._processAfterHtmlRenderThis = function(){
        this.prodEntryPigOps    = new ProdEntryPigOps({
            navigation:         navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-gesta-pigops',
            elemDivContainer:   elemTabGestaPigOps
        });
        this.prodEntryPigOps.init();
        
    
        this.prodEntryInsem     = new ProdEntryInsem({
            navigation:         navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-gesta-insem',
            elemDivContainer:   elemTabGestaInsem
        });
        this.prodEntryInsem.init();
        
        
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
        this.populateHeader(data_pig_prod, options);
        
        
        // Set PigProdOps tab
        const options_pig_prod_ops ={
            show_gesta:   true
        }
        this.prodEntryPigOps.show(data_pig_prod, options_pig_prod_ops);
        
        
        // Set Birth tab
        const options_birth ={
        }
        this.prodEntryBirth.show(data_pig_prod, options_birth);
        
        
        
        // Set Insemination tab
        const options_insem ={
            is_read_only:   false
        }
        this.prodEntryInsem.show(data_pig_prod, options_insem);
        
    }
    
    
    this.beforeShowTab = function(tab_id){
        
        
    }
    
}   