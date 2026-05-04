// January 1, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../../common/page_view_basic.js';

import {PAGE_ID,
        SOW_STATUS,
        PIG_OPERATION_TYPE,
        PIG_PROD_TYPE,
        FLAG_BITS}              from '../../../constants.js';


import {ComponentTabsWithMore}  from '../../common/ui/comp_tabs_with_more.js';


import {getSowBoarReference}    from '../../common/common_app.js';




export function PageProdEntryCommon(input_settings){
    PageViewPigFarmPage.call(this);
    
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
        
        
    let elemIdNavPrevEntry      = null;
    let elemIdNavNextEntry      = null;
    
    let elemIdEntryTitle        = null;
    
    let elemIdPidSowBoar        = null;
    let elemIdPigProdPid        = null;
    let elemIdHeaderSowName     = null;
    let elemIdHeaderBoarName    = null;
    
    let elemIdPidOnly           = null;
    let elemIdPigProdPid2       = null;
    let elemIdPidOnlyDesc       = null;
        
    let elemIdTabsContainer     = null;
    let elemIdTabContentArea    = null;
    
    
    this.componentTabsWithMore  = null;
    
    
    
    
    let elemNavPrevEntry        = null;
    let elemNavNextEntry        = null;
    
    let elemEntryTitle          = null;
    
    let elemPidSowBoar          = null;
    let elemPigProdPid          = null;
    let elemHeaderSowName       = null;
    let elemHeaderBoarName      = null;
    
    let elemPidOnly             = null;
    let elemPigProdPid2         = null;
    let elemPidOnlyDesc         = null;
    
    let elemTabsContainer       = null;
    
    this.elemTabContentArea     = null;
    
    let showOptions             = null;
    
    
    let dataTabMenus            = null;
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this._writeInlineStyle = function(){
        const html = `
    <style>
      

        .entry-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex-grow: 1;
            text-align: center;
        }

        .pid-and-sow {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            flex-wrap: wrap;
        }

        .pid {
            font-size: 22px;
            font-weight: 700;
            letter-spacing: 1px;
        }

        .sow-name {
            display: flex;
            align-items: center;
            font-size: 16px;
            opacity: 0.95;
        }

        .love-icon {
            font-size: 18px;
            color: #f472b6; /* Pink color for love icon */
        }


        

        /* Form Styles */
        .form-group {
            margin-bottom: 20px;
        }

        .form-label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--text-dark);
            font-size: 15px;
        }


        

        .number-input {
            flex-grow: 1;
            text-align: center;
            border-left: none;
            border-right: none;
            border-radius: 0;
            font-weight: 600;
        }


        
        /* Dynamic Field Sections */
        .dynamic-section {
            margin-top: 15px;
            padding: 15px;
            background-color: #f8fafc;
            border-radius: 8px;
            border: 1px solid var(--corporate-border);
        }

        /* Buttons */
        /*
        .btn {
            display: block;
            width: 100%;
            padding: 14px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            text-align: center;
        }

        .btn-primary {
            background-color: var(--corporate-blue);
            color: white;
        }

        .btn-primary:active {
            background-color: #1e40af;
            transform: translateY(1px);
        }
        */
        
        

        
        /* Responsive Adjustments */
        @media (max-width: 480px) {
           
           
            
            .nav-button {
                font-size: 28px;
            }
            
            .pid {
                font-size: 20px;
            }
            
            .sow-name {
                font-size: 15px;
            }
            
            .tab-button {
                font-size: 15px;
                padding: 10px 5px;
                min-width: 60px;
            }
            
            .tab-content-area {
                margin-top: var(--height-fixed-prod-entry);
                max-height: calc(200vh - var(--height-fixed-prod-entry)); /* Viewport height minus fixed headers */
        
            }
            
            
            .btn {
                padding: 12px;
            }
            
        }

        @media (max-width: 380px) {
            .pid-and-sow {
                flex-direction: column;
                gap: 5px;
            }
            
            .tab-content-area {
                margin-top: var(--height-fixed-prod-entry);
                max-height: calc(200vh - var(--height-fixed-prod-entry)); /* Viewport height minus fixed headers */
        
            }
            
        }
        
        @media (max-height: 600px) {
            .tab-content {
                
            }
        }
    </style>
        `;
        
        return html;
    }
    
    
    this.setDataTabMenus = function(data){
        dataTabMenus = data;
    }
    
    
    this.getHtmlTabContents = function(tabs){
        let s_active = '';
        let html = '';
        
        let index = 0;
        
        for (const cur_entry of tabs){
            s_active = '';
            if (index == 0){s_active = 'active';}
            
            html += `
            <div id="${cur_entry.data_tab_id}" class="tab-content ${s_active}">
                <h2 class="tab-title">${cur_entry.label}</h2>
            </div>
        
            `;
            
            index += 1;
        }
        return html;
    }
    
    
    this.render = function(){
        
        elemIdNavPrevEntry      = `${settings.uniqueKey}-prev-entry`;
        elemIdNavNextEntry      = `${settings.uniqueKey}-next-entry`;
        
        
        elemIdEntryTitle        = `${settings.uniqueKey}-title`;
        
        elemIdPidSowBoar        = `${settings.uniqueKey}-pid-sow-boar`;
        elemIdPigProdPid        = `${settings.uniqueKey}-pig-prod-pid`;
        elemIdHeaderSowName     = `${settings.uniqueKey}-header-sow-name`;
        elemIdHeaderBoarName    = `${settings.uniqueKey}-header-boar-name`;
        
        elemIdPidOnly           = `${settings.uniqueKey}-pid-only`;
        elemIdPigProdPid2       = `${settings.uniqueKey}-pig-prod-pid2`;
        elemIdPidOnlyDesc       = `${settings.uniqueKey}-pid-only-desc`;
        
        elemIdTabsContainer     = `${settings.uniqueKey}-tabs-container`;
        elemIdTabContentArea    = `${settings.uniqueKey}-tab-content`;


        this.componentTabsWithMore   = new ComponentTabsWithMore({
            navigation:             navigation,
            uniqueKey:              `${settings.uniqueKey}-tab`,
            elemIdDivContainer:     settings.elemIdDivContainer,
            elemIdTabsContainer:    elemIdTabsContainer,
            elemIdTabContentArea:   thisObj.elemIdTabContentArea,
            
            showMoreTitle:      null, // this dynamically change
            
            tabs:               dataTabMenus
        });

        const html_style        = thisObj._writeInlineStyle();
        
        const html_tab_buttons  = this.componentTabsWithMore.getHtml();
        const html_tab_contents = thisObj.getHtmlTabContents(dataTabMenus);
        
                
        const html =`

    ${html_style}
        
    
    <div class="mobile-container">
        <div class="nav-left-right">
            <button class="nav-button blue" id="${elemIdNavPrevEntry}"><i class="fa-solid fa-arrow-left"></i></button>
            <span class="nav-title" id="${elemIdEntryTitle}">1 of 4</span>
            <button class="nav-button blue" id="${elemIdNavNextEntry}"><i class="fa-solid fa-arrow-right"></i></button>
        </div>
        
        
        <div class="entry-info">
            <div class="pid-and-sow">
                <div class="sow-name" id="${elemIdPidSowBoar}">
                    <span style="margin-right:10px;">(PID <span id="${elemIdPigProdPid}">1</span>)</span>
                    <span id="${elemIdHeaderSowName}">Sow</span>
                    <span class="love-icon">❤️</span>
                    <span id="${elemIdHeaderBoarName}">Boar</span>
                </div>
                
                <div class="sow-name" id="${elemIdPidOnly}" style="display:none">
                    <span>
                        PID <span id="${elemIdPigProdPid2}">1</span>
                        <span id="${elemIdPidOnlyDesc}" style="margin-left:8px;"></span>
                    </span>
                </div>
            </div>
        </div>
            
        
        <!-- Tabs Navigation -->
        <div class="tabs-container" id="${elemIdTabsContainer}">
            ${html_tab_buttons}
        </div>
    </div>
    
    
    <!-- Tab Content Area-->
    <div class="tab-content-area" id="${elemIdTabContentArea}" style="margin-top:0;">
        ${html_tab_contents}
    </div>
        `;
        
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        this.componentTabsWithMore.afterHtmlRender();
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemNavPrevEntry        = elemDivContainer.querySelector('#'+elemIdNavPrevEntry);
        elemNavNextEntry        = elemDivContainer.querySelector('#'+elemIdNavNextEntry);
        
        elemEntryTitle          = elemDivContainer.querySelector('#'+elemIdEntryTitle);
        
        elemPidSowBoar          = elemDivContainer.querySelector('#'+elemIdPidSowBoar);
        elemPigProdPid          = elemDivContainer.querySelector('#'+elemIdPigProdPid);
        elemHeaderSowName       = elemDivContainer.querySelector('#'+elemIdHeaderSowName);
        elemHeaderBoarName      = elemDivContainer.querySelector('#'+elemIdHeaderBoarName);
        
        elemPidOnly             = elemDivContainer.querySelector('#'+elemIdPidOnly);
        elemPigProdPid2         = elemDivContainer.querySelector('#'+elemIdPigProdPid2);
        elemPidOnlyDesc         = elemDivContainer.querySelector('#'+elemIdPidOnlyDesc);
        
        elemTabsContainer       = elemDivContainer.querySelector('#'+elemIdTabsContainer);
        this.elemTabContentArea = elemDivContainer.querySelector('#'+elemIdTabContentArea);
        
    }
    
    
    this._processAfterHtmlRender = function(){
        
    }
    
    
    this._bindEventListeners = function(){
        elemEntryTitle.addEventListener('click', function() {
            
            switch(showOptions.pig_prod_type){
                case PIG_PROD_TYPE.GESTATING:{
                    const next_page = navigation.getPageContainer(PAGE_ID.PROD_GESTA_LIST);
                    navigation.showThisPage(next_page);
                    navigation.pageMobGestatingList.show();
                    break;
                }
                
                case PIG_PROD_TYPE.LACTATING:{
                    const next_page = navigation.getPageContainer(PAGE_ID.PROD_LACTA_LIST);
                    navigation.showThisPage(next_page);
                    navigation.pageMobLactatingList.show();
                    break;
                }
                
                case PIG_PROD_TYPE.FATTENING:{
                    const next_page = navigation.getPageContainer(PAGE_ID.PROD_FATTENING_LIST);
                    navigation.showThisPage(next_page);
                    navigation.pageProdFatteningList.show();
                    break;
                }
                
                case PIG_PROD_TYPE.HARVESTED:{
                    const next_page = navigation.getPageContainer(PAGE_ID.PROD_HISTORY_LIST);
                    navigation.showThisPage(next_page);
                    navigation.pageProdHistoryList.show();
                    break;
                }
                
            }
            
            
            
        });
    }
    

    
    this.populateHeader = function(data_pig_prod, options){
        showOptions = options;
        
        /** Typical options 
        const options = {
            pig_prod_type:  PIG_PROD_TYPE.GESTATING,
            prev_prod_pid:  prev_prod_pid,
            next_prod_pid:  next_prod_pid,
            data_index:     index+1,
            total_entries:  data_pig_prod_list.length
        };
        
        */
        
        let title_list = '';
        switch(showOptions.pig_prod_type){
            case PIG_PROD_TYPE.GESTATING:{
                title_list = 'Prod Gesta';
                break;
            }
            
            case PIG_PROD_TYPE.LACTATING:{
                title_list = 'Prod Lacta';
                break;
            }
            
            case PIG_PROD_TYPE.FATTENING:{
                title_list = 'Fattening';
                break;
            }
            
            case PIG_PROD_TYPE.HARVESTED:{
                title_list = 'Prod Hist';
                
                if (showOptions.is_prod_sales){
                    title_list = 'Prod Sales';
                }
                break;
            }
            
        }
        
        
        // Set Header Data
        const title = `${title_list} ${options.data_index} Of ${options.total_entries}`;
        elemEntryTitle.textContent = title;
        
        const pid = data_pig_prod.pig_production.farm_prod_id;
        elemPigProdPid.textContent = pid;
        elemPigProdPid2.textContent = pid;
        
        
        // Get pig_production.flag
        let prod_flag = data_pig_prod.pig_production.flag;

        
        if ((prod_flag & FLAG_BITS.PIG_PROD.IS_A_GROUP) > 0){
            elemPidOnlyDesc.textContent = 'Group';
        }
        else{
            elemPidOnlyDesc.textContent = '';
        }
        
        
        // Production Entries that the piglets are brought from outside
        // have no  data_pig_prod.sow, birth and minimum wean information.
        // If no  data_pig_prod.sow, only show the PID 
        
        
        
        const data_sow = data_pig_prod.sow;
        let sow_name = null;
        
        if (data_sow && data_sow.hid) {
            elemPidSowBoar.style.display = 'flex';
            
        
            sow_name = getSowBoarReference(data_sow);
            
            
            const insemination = data_pig_prod.insemination;
            
            let boar_name = '';
            switch (insemination.insem_type){
                case 'B':{
                    boar_name = getSowBoarReference(insemination.boar);
                    break;
                }
                
                case 'AI_X':{
                    boar_name = insemination.ai.semen_supplier.semen.name;
                    //boar_name += ' from ' + insemination.ai.semen_supplier.name;
                    break;
                }
                
                case 'AI_N':{
                    const internal_boar = insemination.ai.internal_boar;
                    
                    boar_name = getSowBoarReference(internal_boar);
                    boar_name += '(via AI)';
                    
                    break;
                }
                
            }
            
            
            elemHeaderSowName.textContent   = sow_name;
            elemHeaderBoarName.textContent  = boar_name;
            
            
            elemPidOnly.style.display = 'none';
        }
        else{
            elemPidSowBoar.style.display = 'none';
            elemPidOnly.style.display = 'block';
        }
        
    

        
        // Set arrow navigation
        switch(options.pig_prod_type){
            case PIG_PROD_TYPE.GESTATING:{
                elemNavPrevEntry.onclick = function(){
                    navigation.onClickProdGestatingEntry(options.prev_prod_pid);
                }
                
                elemNavNextEntry.onclick = function(){
                    navigation.onClickProdGestatingEntry(options.next_prod_pid);
                }
        
                break;
            }
            
            case PIG_PROD_TYPE.LACTATING:{
                elemNavPrevEntry.onclick = function(){
                    navigation.onClickProdLactatingEntry(options.prev_prod_pid);
                }
                
                elemNavNextEntry.onclick = function(){
                    navigation.onClickProdLactatingEntry(options.next_prod_pid);
                }
                
                break;
            }
            
            case PIG_PROD_TYPE.FATTENING:{
                elemNavPrevEntry.onclick = function(){
                    navigation.pageProdFatteningList.onClickProdFatteningEntry(
                        options.prev_prod_pid);
                }
                
                elemNavNextEntry.onclick = function(){
                    navigation.pageProdFatteningList.onClickProdFatteningEntry(
                        options.next_prod_pid);
                }
                break;
            }
            
            
            case PIG_PROD_TYPE.HARVESTED:{
                    
                if (options.is_prod_sales){
                    elemNavPrevEntry.onclick = function(){
                        navigation.pageProdSalesList.onClickProdHistEntry(
                            options.prev_prod_pid);
                    }
                    
                    elemNavNextEntry.onclick = function(){
                        navigation.pageProdSalesList.onClickProdHistEntry(
                            options.next_prod_pid);
                    }

                }
                else{
                    elemNavPrevEntry.onclick = function(){
                        navigation.pageProdHistoryList.onClickProdHistEntry(
                            options.prev_prod_pid);
                    }
                    
                    elemNavNextEntry.onclick = function(){
                        navigation.pageProdHistoryList.onClickProdHistEntry(
                            options.next_prod_pid);
                    }
                }
                break;
            }
        }
        
  
    }
    
    

}   
