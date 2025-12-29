// December 25, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        PIG_OPERATION_TYPE,
        PROD_STATUS}            from '../../../constants.js';

import {FormatDate,
        FORMAT_SHORT_MONTH}     from '../../../utils.js';



export function PageMobGestaLacta(input_settings){
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    
    const NUM_MSECS_1DAY        = 1000 * 60 * 60 * 24;
    const DEFAULT_NUM_DAYS_WEAN = 45;
    
    /*
    Typical input_settings
    {
        parentObj:              this,
        isGesta:                true,
        uniqueKey:              'prod-gesta' // Use for uniqueness in elements
        pageTitle:              'Production Gestating'
    }   
    */  
    var settings                = input_settings;
    
    
    // This is needed as ths will be first element to be rendered
    var elemDivContainer        = null;
    if (settings.isGesta == true){
        elemDivContainer        = document.getElementById('container-prod-gesta-list');
    }
    else{
        elemDivContainer        = document.getElementById('container-prod-lacta-list');
    }
    
    
    var elemIdPageTitle         = null;
    var elemIdPageInfo          = null;
    
    var elemIdMobSearchInput    = null;
    var elemIdMobAddEntryBtn    = null;
    
    var elemIdListContainer     = null;



    var elemPageTitle           = null;
    var elemPageInfo            = null;

    var elemMobSearchInput      = null;
    var elemMobAddEntryBtn      = null;
    
    var elemListContainer       = null;
    
    
    
    var dataPigProd             = null;


    //var textTranslation         = new TextTranslation();
    var curUserLanguageKey      = 'en';

    
    // This must be set before rendering the autotable
    // See G_SAMPLE_JSON_ACCOUNT
    this.accountData            = null;
    
    
    
    this.init = function(){
        //textTranslation.setTranslations(TRANSLATION_PAGE_ACC_PIG_OPS);
        
        
        
        this.render();
        this.afterHtmlRender();
        
        
    }
    
    
    this.render = function(){
        
        elemIdPageTitle         = `page-title-${settings.uniqueKey}-list`;
        elemIdPageInfo          = `page-info-${settings.uniqueKey}-list`;
        
        elemIdListContainer     = `mobile-list-container-${settings.uniqueKey}`;
        
        elemIdMobSearchInput    = `mobile-search-input-${settings.uniqueKey}`;
        elemIdMobAddEntryBtn    = `mobile-add-entry-btn-${settings.uniqueKey}`;
           
		var style_hide_add_button = '';
		if (settings.isGesta == false){
			style_hide_add_button = 'display:none;';
		}
           
        const html = `
<div class="mobile-container">
    <div class="header">
        <h1 id="${elemIdPageTitle}">${settings.pageTitle}</h1>
        
        <!-- Mobile Info Box -->
        <!--
        <div class="mobile-info-box">
            <div class="info-text" id="${elemIdPageInfo}">
            </div>
        </div>
        -->
    </div>

    <!-- Search and Add Entry Controls -->
    <div class="mobile-controls">
        <div class="search-container">
            <i class="fas fa-search search-icon"></i>
            <input type="text" class="search-input" id=${elemIdMobSearchInput} placeholder="Search PID or Sow Name...">
        </div>
        <button class="btn-add-entry" id="${elemIdMobAddEntryBtn}" style="${style_hide_add_button}">
            <i class="fas fa-plus"></i>
            Add Entry
        </button>
    </div>

    <!-- Card Container -->
    <div class="card-container-pig-prod" id="${elemIdListContainer}"></div>
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
        elemPageInfo            = document.getElementById(elemIdPageInfo);

        elemMobSearchInput      = document.getElementById(elemIdMobSearchInput);
        elemMobAddEntryBtn      = document.getElementById(elemIdMobAddEntryBtn);
        elemListContainer       = document.getElementById(elemIdListContainer);
        
    }
    
    
    this._processAfterHtmlRender = function(){
        
        this.handleWindowResize();
    }
    
    
    this._bindEventListeners = function(){
     
    
    }
    
    
    this.setDataPigProd = function(data){
        var data_filtered = [];
        
        for(const cur_entry of data){
			if (settings.isGesta == true){
				if (cur_entry.pig_production.prod_status_id == PROD_STATUS.GESTATING){
					data_filtered.push(cur_entry);
				}
			}
			else{
				if (cur_entry.pig_production.prod_status_id == PROD_STATUS.LACTATING){
					data_filtered.push(cur_entry);
				}
			}
        } 
        
        
        dataPigProd = data_filtered;
    }
    
    
    // Handle window resize for view switching
    this.handleWindowResize = function() {
        const isMobile = window.innerWidth <= APPLICATION.MAX_WIDTH_WINDOW_IS_MOBILE;
                
        /*
        if (isMobile) {
            elemMobileContainer.style.display = 'flex';
            elemTableContainer.style.display = 'none';
        } else {
            elemMobileContainer.style.display = 'none';
            elemTableContainer.style.display = 'block';
        }*/
    }
    
    
    this.show = function(){
        if ((dataPigProd == null) || (dataPigProd.length == 0)){
            elemMobSearchInput.setAttribute("placeholder", "No entries found"); 
        }
        else{
            elemMobSearchInput.setAttribute("placeholder", "Search Sow Name or PID");
        }
        
        var html = '';
        
        if (dataPigProd != null){
            for (const cur_entry of dataPigProd){
                html += thisObj._getHtml(cur_entry)
            }
           
            elemListContainer.innerHTML = html;
        }
    }
    
    
    this._getHtml = function(data_prod){
        var diff_msecs;
        var diff_days;
        
        var dt_current = new Date();
        dt_current.setHours(0, 0, 0, 0);
        
        
        var sow_name = '';
        if ((data_prod.sow.name != null) && (data_prod.sow.name.length > 0)){
            sow_name = data_prod.sow.name;
        }
        else{
            sow_name = data_prod.sow.number;
        }
        
        
        const insemination = data_prod.insemination;
        
        var boar_name = '';
        switch (insemination.insem_type){
            case 'B':{
                const boar = insemination.boar;
                
                if ((boar.name != null) && (boar.name.length > 0)){
                    boar_name = boar.name;
                }
                else{
                    boar_name = boar.number;
                }
                break;
            }
            
            case 'AI_X':{
                boar_name = insemination.ai.semen_supplier.semen.name;
                boar_name += ' from ' + insemination.ai.semen_supplier.name;
                break;
            }
            
            case 'AI_N':{
                const internal_boar = insemination.ai.internal_boar;
                
                if ((internal_boar.name != null) && (internal_boar.name.length > 0)){
                    boar_name = internal_boar.name;
                }
                else{
                    boar_name = internal_boar.number;
                }
                
                boar_name += '(via AI)';
                
                break;
            }
            
        }
        
        
        var indicator_ai = '';
        if (insemination.insem_type != 'B'){
            indicator_ai = '<span class="ai-indicator"><i class="fas fa-syringe"></i></span>';
        }
        
        
        const birth = data_prod.birth;
        
        var date_important          = null;
        var header_class            = 'lactating-piglets';
        var label_date_important    = '';
        var label_num_days_since    = '';
        var value_num_days_since    = '';
        
        var dt_important            = null;
        var dt_important_sf         = null;
        var diff_days_important     = null;
        
        var dt_insem                = null;
        var dt_birth                = null;
        
        var numdays_since           = null;
        
        var html_due_soon           = '';
        
        var style_animation_horse   = 'display:none;';
        var style_animation_motor   = 'display:none;';
        var style_piglet_counter    = 'display:none;'
        
        var cur_num_pigs_male       = null;
        var cur_num_pigs_female     = null;
        var cur_num_pigs_stillbirth = null;
        var cur_num_pigs_dead       = null;
        
        
        
        switch(data_prod.pig_production.prod_status_id){
            case PROD_STATUS.GESTATING: {
                header_class        = 'gestating';
                
                
                date_important      = birth.date_expected;
                dt_important        = new Date(date_important);
                dt_important_sf     = FormatDate(dt_important);
                
                diff_msecs          = dt_important - dt_current;
                diff_days           = Math.round(diff_msecs / NUM_MSECS_1DAY);
                diff_days_important = diff_days;
                
                if ((diff_days >= 3) && (diff_days <= 5)) {
                    html_due_soon = `<span class="due-soon">(${diff_days} Days)</span>`;
                    style_animation_horse   = 'display:block';
                } 
                
                if ((diff_days == 1) || (diff_days == 2)) {
                    html_due_soon = `<span class="due-soon">(Due Soon)</span>`;
                    style_animation_motor   = 'display:block';
                
                    if (diff_days == 1){
                        dt_important_sf = 'Tomorrow';
                    }
                } 
                
                if (diff_days == 0) {
                    html_due_soon = `<span class="due-soon">(Today!)</span>`;
                    dt_important_sf = 'Today';
                }
                
                if ((diff_days == -1) || (diff_days == -2)){
                    html_due_soon = `<span class="due-soon">(Just Wait)</span>`;
                }
                
                if (diff_days == -1){
                    html_due_soon = `<span class="due-soon">(Panic!!!)</span>`;
                }
                
                
                
                
                
                dt_insem            = new Date(insemination.insem_date);
                diff_msecs          = dt_current - dt_insem;
                diff_days           = Math.round(diff_msecs / NUM_MSECS_1DAY);
                
                // Adjust Day 1 on date of insemination/coupling if needed
                if (thisObj.accountData != null){
                    if (thisObj.accountData.settings_operations.day_1_on_date_of_insem > 0){
                        days_diff += 1;
                    }
                }
                numdays_since       = diff_days;
                
                
                
                label_date_important= 'Expected Birth';
                label_num_days_since= 'Days Since Mating'; 
                
                const dt_insem_sf   = FormatDate(dt_insem, FORMAT_SHORT_MONTH);
                value_num_days_since= `${numdays_since} Days (${dt_insem_sf})`;
                
                break;
            }
        
            case PROD_STATUS.LACTATING: {
                header_class = 'lactating-sow';
				
                // Need to add number of days for date weaning
                date_important      = birth.date_actual;
                dt_important        = new Date(date_important);
                
                
                cur_num_pigs_male   = birth.pigs_live_m;
                cur_num_pigs_female = birth.pigs_live_f;
                cur_num_pigs_stillbirth = birth.num_dead_at_birth;
                
				// TODO needs to be computed at backend
				cur_num_pigs_dead   = (cur_num_pigs_male + cur_num_pigs_female) - 
                                        data_prod.pig_production.cur_pig_count;
                if (cur_num_pigs_dead < 0){cur_num_pigs_dead = 0;}
				
                style_piglet_counter= '';
                
                label_date_important= 'Expected Wean';
                label_num_days_since= 'Days Since Birth';
                break;
            }
        }
        
        
        
        
        
        var html = `
        <div class="card-pig-prod">
            <div class="card-header-pig-prod ${header_class}">
                <div class="header-top-row">
                    <div class="pid">${data_prod.pig_production.farm_prod_id}</div>
                    <div class="sow-name">
                        ${sow_name} <i class="fas fa-heart"></i> ${boar_name}
                        ${indicator_ai}
                    </div>
                </div>
                
                <!-- Dates side by side -->
                <div class="dates-container">
                    <div class="date-item">
                        <div class="date-label">
                            ${label_date_important}
                            ${html_due_soon}
                        </div>
                        <div class="date-value">
                            ${dt_important_sf}
                            <span class="running-animation">
                                <span class="horse-running" style="${style_animation_horse}">
                                    <i class="fas fa-horse"></i>
                                    <div class="animation-track"></div>
                                </span>
                                
                                
                                <span class="motorbike-running" style="${style_animation_motor}">
                                    <i class="fas fa-motorcycle"></i>
                                    <div class="animation-track"></div>
                                </span>
                            </span>
                        </div>
                    </div>
                    <div class="date-item">
                        <div class="date-label">${label_num_days_since}</div>
                        <div class="date-value">${value_num_days_since}</div>
                    </div>
                </div>
            </div>

            <!-- Piglet Count (only for lactating) - side by side -->
            <div class="piglet-count-container" style="${style_piglet_counter}">
                <div class="piglet-count male">
                    <div class="count-number">${cur_num_pigs_male}</div>
                    <div class="count-label">Male</div>
                </div>
                <div class="piglet-count female">
                    <div class="count-number">${cur_num_pigs_female}</div>
                    <div class="count-label">Female</div>
                </div>
                <div class="piglet-count stillbirth">
                    <div class="count-number">${cur_num_pigs_stillbirth}</div>
                    <div class="count-label">StillBirth</div>
                </div>
                <div class="piglet-count dead">
                    <div class="count-number">${cur_num_pigs_dead}</div>
                    <div class="count-label">Dead</div>
                </div>
            </div>

            <!-- Operations List -->
            <div class="operations-container" style="display: none;">
                <div class="operations-list">
                    <!-- Operation 1 - Done -->
                    <div class="operation-item operation-done">
                        <div class="operation-header">
                            <div class="operation-left">
                                <div class="operation-date">May 5, 2023</div>
                                <div class="operation-name">Vaccination</div>
                            </div>
                            <div class="operation-icon icon-done">
                                <i class="fas fa-check-circle"></i>
                            </div>
                        </div>
                        <div class="operation-description">
                            Pre-farrowing vaccination for leptospirosis and parvovirus
                        </div>
                    </div>
                    
                    <!-- Operation 2 - Due -->
                    <div class="operation-item operation-due">
                        <div class="operation-header">
                            <div class="operation-left">
                                <div class="operation-date">Apr 20, 2023</div>
                                <div class="operation-name">Pregnancy Check</div>
                            </div>
                            <div class="operation-icon icon-due">
                                <span class="bell-animated">
                                    <i class="fas fa-bell"></i>
                                </span>
                            </div>
                        </div>
                        <div class="operation-description">
                            Ultrasound pregnancy confirmation - Due 3 days ago
                        </div>
                    </div>
                </div>
            </div>

            <!-- Update Button -->
            <div class="controls">
                <button class="btn-update">Update Record</button>
            </div>
        </div>
        `;
        
        return html;
        
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