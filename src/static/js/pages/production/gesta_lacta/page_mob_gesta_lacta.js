// December 25, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        PIG_OPERATION_TYPE}     from '../../constants.js';

import {TextTranslation}        from '../common/translation.js';

import {TRANSLATION_PAGE_ACC_PIG_OPS}   from '../../translations/page_acc_pig_ops_i8n.js'



export function PageMobGestaLacta(input_settings){
    const thisObj               = this;
	const parentObj             = input_settings.parentObj;
    
    
    /*
    Typical input_settings
    {
        parentObj:              this,
		isGesta:				true,
		uniqueKey:				'prod-gesta' // Use for uniqueness in elements
		pageTitle:				'Production Gestating'
    }   
    */  
    var settings                = input_settings;
	
	
    // This is needed as ths will be first element to be rendered
    var elemDivContainer		= null;
	if (settings.isGesta == true){
		elemDivContainer        = document.getElementById('container-prod-gesta-list');
	}
	else{
		elemDivContainer        = document.getElementById('container-prod-lacta-list');
	}
	
	
    var elemIdPageTitle         = null;
    var elemIdPageInfo        	= null;

    var elemIdBtnAddEntryShow   = null;
    var elemIdMobileContainer   = null;
    var elemIdTableContainer    = null;

    var elemPageTitle           = null;
    var elemPigOpsInfo          = null;

	var elemIdMobSearchInput	= null;
	var elemIdMobSearchBtn		= null;
	
	


    //var textTranslation         = new TextTranslation();
    var curUserLanguageKey      = 'en';


    
    this.init = function(){
        //textTranslation.setTranslations(TRANSLATION_PAGE_ACC_PIG_OPS);
        
        
        
        this.render();
        this.afterHtmlRender();
        
        
    }
    
    
    this.render = function(){
        
        elemIdPageTitle         = `page-title-${settings.uniqueKey}-list`;
        elemIdPageInfo        	= `page-info-${settings.uniqueKey}-list`;
        
        elemIdBtnAddEntryShow   = `add-entry-acc-pig-ops-show`;
        elemIdMobileContainer   = `mobile-container-acc-pig-ops`;
        elemIdTableContainer    = `table-container-acc-pig-ops`;
		
		elemIdMobSearchInput	= `mobile-search-input-${settings.uniqueKey}`;
        elemIdMobSearchBtn		= `mobile-search-btn-${settings.uniqueKey}`;
           
		   
        const html = `
<div class="mobile-container">
	<div class="header">
		<h1 id="${elemIdPageTitle}">${settings.pageTitle}</h1>
		
		<!-- Mobile Info Box -->
		<div class="mobile-info-box">
			<div class="info-text" id="${elemIdPageInfo}">
			</div>
		</div>
		
	</div>

	<!-- Search and Add Entry Controls -->
	<div class="mobile-controls">
		<div class="search-container">
			<i class="fas fa-search search-icon"></i>
			<input type="text" class="search-input" id=${elemIdMobSearchInput} placeholder="Search PID or Sow Name...">
		</div>
		<button class="btn-add-entry" id=${elemIdMobSearchBtn}>
			<i class="fas fa-plus"></i>
			Add Entry
		</button>
	</div>

	<!-- Card Container -->
	<div class="card-container"></div>
</div>
        `;
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemPageTitle           = document.getElementById(elemIdPageTitle);
        elemPigOpsInfo          = document.getElementById(elemIdPageInfo);

        elemBtnAddEntryShow     = document.getElementById(elemIdBtnAddEntryShow);
        elemMobileContainer     = document.getElementById(elemIdMobileContainer);
        elemTableContainer      = document.getElementById(elemIdTableContainer);
    }
    
    
    this._processAfterHtmlRender = function(){
        
        this.handleWindowResize();
    }
    
    
    this._bindEventListeners = function(){
     
    
    }
    
    
    this.setDataPigProd = function(data){
        

    }
    
    
    // Handle window resize for view switching
    this.handleWindowResize = function() {
        const isMobile = window.innerWidth <= APPLICATION.MAX_WIDTH_WINDOW_IS_MOBILE;
                
        if (isMobile) {
            elemMobileContainer.style.display = 'flex';
            elemTableContainer.style.display = 'none';
        } else {
            elemMobileContainer.style.display = 'none';
            elemTableContainer.style.display = 'block';
        }
    }
    
     
    this.setUserLanguage = function(language_key){
        curUserLanguageKey = language_key;
        thisObj.onUserChangeLanguage();
    }
    
    
    this.onUserChangeLanguage = function(){
        
       
    }
    
    
    this.getDataPigProd = function(entry_hid){
        for (const cur_entry of curAccPigOpsData){
            if(cur_entry.acc_pig_ops.hid == entry_hid){return cur_entry;}
        }
        return null;
    }
    
    
    // Open edit modal with operation data
    this.editModalOpen = function(entry_hid) {
        const operation = thisObj.getDataAccPigOps(entry_hid);
        if (operation == null) {return;}
        
        thisObj.editModalAccPigOps.beforeShow(operation);
        
    }
    
    
}