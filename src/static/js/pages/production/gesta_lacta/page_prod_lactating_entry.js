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
import {ProdEntryInsem}         from './prod_entry_insem.js'
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
        
    
    let elemIdTabLactaPigOps        = `prod-lacta-pigops`;
    let elemIdTabLactaBirth         = `prod-lacta-birth`;
    let elemIdTabLactaWean          = `prod-lacta-wean`;
    let elemIdTabLactaMedVac        = `prod-lacta-medvac`;
    
    let elemIdTabLactaHealth        = `prod-lacta-health`;
    let elemIdTabLactaPigDead       = `prod-lacta-pig-dead`;
    let elemIdTabLactaFeedSummary   = `prod-lacta-feed-summary`;
    let elemIdTabLactaFeedAdd       = `prod-lacta-feed-add`;
    let elemIdTabLactaNotes         = `prod-lacta-notes`;
    let elemIdTabLactaInsem         = `prod-lacta-insem`;
    
    
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
            data_tab_id:    elemIdTabLactaInsem,
            label:          'Insem'
        }
    ];
	
	
    
    let elemTabLactaPigOps        	= null;
    let elemTabLactaBirth         	= null;
    let elemTabLactaWean          	= null;
    let elemTabLactaMedVac        	= null;
										
    let elemTabLactaHealth        	= null;
    let elemTabLactaPigDead       	= null;
    let elemTabLactaFeedSummary   	= null;
    let elemTabLactaFeedAdd       	= null;
    let elemTabLactaNotes         	= null;
    let elemTabLactaInsem         	= null;
	
                                        
    
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
        elemTabLactaPigOps        	= elemDivContainer.querySelector('#'+elemIdTabLactaPigOps);
		elemTabLactaBirth         	= elemDivContainer.querySelector('#'+elemIdTabLactaBirth);
		elemTabLactaWean          	= elemDivContainer.querySelector('#'+elemIdTabLactaWean);
		elemTabLactaMedVac        	= elemDivContainer.querySelector('#'+elemIdTabLactaMedVac);
									                                              					
		elemTabLactaHealth        	= elemDivContainer.querySelector('#'+elemIdTabLactaHealth);
		elemTabLactaPigDead       	= elemDivContainer.querySelector('#'+elemIdTabLactaPigDead);
		elemTabLactaFeedSummary   	= elemDivContainer.querySelector('#'+elemIdTabLactaFeedSummary);
		elemTabLactaFeedAdd       	= elemDivContainer.querySelector('#'+elemIdTabLactaFeedAdd);
		elemTabLactaNotes         	= elemDivContainer.querySelector('#'+elemIdTabLactaNotes);
		elemTabLactaInsem         	= elemDivContainer.querySelector('#'+elemIdTabLactaInsem);
		
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
        
    
        this.prodEntryInsem     = new ProdEntryInsem({
            navigation:         navigation,
            parentObj:          this,
            uniqueKey:          'pig-prod-lacta-insem',
            elemDivContainer:   elemTabGestaInsem
        });
        this.prodEntryInsem.init();
        
        

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