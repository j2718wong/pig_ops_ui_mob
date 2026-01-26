// January 1, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../../common/page_view_basic.js';

import {SOW_STATUS,
        PIG_OPERATION_TYPE}     from '../../../constants.js';


import {ComponentTabsWithMore}  from '../../common/ui/comp_tabs_with_more.js';

import {ProdEntryNotes}         from './prod_entry_notes.js'
import {ProdEntryPigOps}        from './prod_entry_pig_ops.js'
import {ProdEntryInsem}         from './prod_entry_insem.js'
import {ProdEntryBirth}         from './prod_entry_birth.js'



export function PageProdGestatingEntry(input_settings){
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
    
    let elemIdPigProdPid        = null;
    let elemIdHeaderSowName     = null;
    let elemIdHeaderBoarName    = null;
    
    
    let elemIdTabsContainer     = null;
    let elemIdTabContentArea    = null;
    
    
    let componentTabsWithMore   = null;
    
    let elemIdTabGestaPigOps        = `prod-gesta-pigops`;
    let elemIdTabGestaBirth         = `prod-gesta-birth`;
    let elemIdTabGestaInsem         = `prod-gesta-insem`;
    let elemIdTabGestaNotes         = `prod-gesta-notes`;
        
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
    
    
    let elemIdTabFattenerFeedSummary= `prod-fattener-feed-summary`;
    let elemIdTabFattenerFeedAdd    = `prod-fattener-feed-add`;
    let elemIdTabFattenerFeedBalance= `prod-fattener-feed-balance`;
    let elemIdTabFattenerHarvest    = `prod-fattener-harvest`;
    
    let elemIdTabFattenerMedVac     = `prod-fattener-medvac`;
    let elemIdTabFattenerHealth     = `prod-fattener-health`;
    let elemIdTabFattenerNotes      = `prod-fattener-notes`;
    let elemIdTabFattenerPigCount   = `prod-fattener-count`;
    let elemIdTabFattenerPigDead    = `prod-fattener-pig-dead`;
    let elemIdTabFattenerWean       = `prod-fattener-wean`;
    let elemIdTabFattenerBirth      = `prod-fattener-birth`;
    let elemIdTabFattenerInsem      = `prod-fattener-insem`;
    
    
    
    let elemIdTabPGroupFeedSummary  = `prod-pgroup-feed-summary`;
    let elemIdTabPGroupFeedAdd      = `prod-pgroup-feed-add`;
    let elemIdTabPGroupFeedBalance  = `prod-pgroup-feed-balance`;
    let elemIdTabPGroupHarvest      = `prod-pgroup-harvest`;
    
    let elemIdTabPGroupMedVac       = `prod-pgroup-medvac`;
    let elemIdTabPGroupHealth       = `prod-pgroup-health`;
    let elemIdTabPGroupNotes        = `prod-pgroup-notes`;
    let elemIdTabPGroupPigCount     = `prod-pgroup-count`;
    let elemIdTabPGroupPigDead      = `prod-pgroup-pig-dead`;
    
    
    
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
            data_tab_id:    elemIdTabGestaNotes,
            label:          'Notes'
        },
        
        {
            data_tab_id:    elemIdTabGestaInsem,
            label:          'Insem'
        }
    ];
    
    
    let tabsProdFattener = [
        {
            data_tab_id:    elemIdTabFattenerFeedSummary,
            label:          'Summary'
        },
        
        {
            data_tab_id:    elemIdTabFattenerFeedAdd,
            label:          'FeedAdd'
        },
        
        {
            data_tab_id:    elemIdTabFattenerFeedBalance,
            label:          'FeedBal'
        },
        
        {
            data_tab_id:    elemIdTabFattenerHarvest,
            label:          'Harvest'
        },
        
        
        {
            data_tab_id:    elemIdTabFattenerMedVac,
            label:          'MedVac'
        },
        
        {
            data_tab_id:    elemIdTabFattenerHealth,
            label:          'Health'
        },
        
        {
            data_tab_id:    elemIdTabFattenerNotes,
            label:          'Notes'
        },
        
        
        {
            data_tab_id:    elemIdTabFattenerPigCount,
            label:          'Pig Count'
        },
        
        {
            data_tab_id:    elemIdTabFattenerPigDead,
            label:          'Pig Dead'
        },
        
        
        {
            data_tab_id:    elemIdTabFattenerWean,
            label:          'Wean'
        },
        
        {
            data_tab_id:    elemIdTabFattenerBirth,
            label:          'Birth'
        },
        
        {
            data_tab_id:    elemIdTabFattenerInsem,
            label:          'Insem'
        }
    ];

    
    let tabsProdGroup = [
        {
            data_tab_id:    elemIdTabPGroupFeedSummary,
            label:          'Summary'
        },
        
        {
            data_tab_id:    elemIdTabPGroupFeedAdd,
            label:          'FeedAdd'
        },
        
        {
            data_tab_id:    elemIdTabPGroupFeedBalance,
            label:          'FeedBal'
        },
        
        {
            data_tab_id:    elemIdTabPGroupHarvest,
            label:          'Harvest'
        },
        
        
        {
            data_tab_id:    elemIdTabPGroupMedVac,
            label:          'MedVac'
        },
        
        {
            data_tab_id:    elemIdTabPGroupHealth,
            label:          'Health'
        },
        
        {
            data_tab_id:    elemIdTabPGroupNotes,
            label:          'Notes'
        },
        
        
        {
            data_tab_id:    elemIdTabPGroupPigCount,
            label:          'Pig Count'
        },
        
        {
            data_tab_id:    elemIdTabPGroupPigDead,
            label:          'Pig Dead'
        },
        
        {
            data_tab_id:    elemIdTabPGroupPigDead,
            label:          'Pig Dead'
        }
        
        
    ];

    
    
    let elemTabGestaPigOps          = null;
    let elemTabGestaBirth           = null;
    let elemTabGestaInsem           = null;
    let elemTabGestaNotes           = null;
                                        
    let elemTabLactaPigOps          = null;
    let elemTabLactaBirth           = null;
    let elemTabLactaWean            = null;
    let elemTabLactaMedVac          = null;
                                        
    let elemTabLactaHealth          = null;
    let elemTabLactaPigDead         = null;
    let elemTabLactaFeedSummary     = null;
    let elemTabLactaFeedAdd         = null;
    let elemTabLactaNotes           = null;
    let elemTabLactaInsem           = null;
                                        
                                        
    let elemTabFattenerFeedSummary  = null;
    let elemTabFattenerFeedAdd      = null;
    let elemTabFattenerFeedBalance  = null;
    let elemTabFattenerHarvest      = null;
                                        
    let elemTabFattenerMedVac       = null;
    let elemTabFattenerHealth       = null;
    let elemTabFattenerNotes        = null;
    let elemTabFattenerPigCount     = null;
    let elemTabFattenerPigDead      = null;
    let elemTabFattenerWean         = null;
    let elemTabFattenerBirth        = null;
    let elemTabFattenerInsem        = null;
    
    
    
    let elemTabPGroupFeedSummary    = null;
    let elemTabPGroupFeedAdd        = null;
    let elemTabPGroupFeedBalance    = null;
    let elemTabPGroupHarvest        = null;
                                        
    let elemTabPGroupMedVac         = null;
    let elemTabPGroupHealth         = null;
    let elemTabPGroupNotes          = null;
    let elemTabPGroupPigCount       = null;
    let elemTabPGroupPigDead        = null;
    
    
    
    
    
    
    let elemNavPrevEntry        = null;
    let elemNavNextEntry        = null;
    
    let elemEntryTitle          = null;
    
    let elemPigProdPid          = null;
    let elemHeaderSowName       = null;
    let elemHeaderBoarName      = null;
    
    
    let elemTabsContainer       = null;
    let elemTabContentArea      = null;
    
    
    
        
    let sowList                 = null;
    let boarList                = null;
    
    
    
    
    
    const settingsNotes = {
        parentObj:              this
    } 
    const prodEntryNotes        = new ProdEntryNotes(settingsNotes);
    prodEntryNotes.setNavigation(navigation);
    
    
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


        .radio-group {
            margin-bottom: 15px;
        }

        .radio-option {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;
            padding: 12px;
            border: 1px solid var(--corporate-border);
            border-radius: 8px;
            transition: all 0.2s;
            cursor: pointer;
        }

        .radio-option.selected {
            border-color: var(--corporate-light-blue);
            background-color: rgba(59, 130, 246, 0.05);
        }

        .radio-input {
            margin-right: 12px;
            margin-top: 3px;
        }

        .radio-text {
            flex-grow: 1;
        }

        .radio-title {
            font-weight: 600;
            margin-bottom: 4px;
            color: var(--text-dark);
        }

        .radio-description {
            font-size: 14px;
            color: var(--text-light);
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
        
        

        /* Table */
        .notes-table {
            width: 100%;
            margin-top: 25px;
            border-collapse: collapse;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
            background-color: white;
        }

        .notes-table th {
            background-color: var(--corporate-blue);
            color: white;
            text-align: left;
            padding: 12px 15px;
            font-weight: 600;
            font-size: 14px;
        }

        .notes-table td {
            padding: 12px 15px;
            border-bottom: 1px solid var(--corporate-border);
            font-size: 14px;
        }

        .notes-table tr:last-child td {
            border-bottom: none;
        }

        .notes-table tr:hover {
            background-color: #f9fafb;
        }

        /* Responsive Adjustments */
        @media (max-width: 480px) {
           
            .top-section {
                top: 60px;
            }
            
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
                font-size: 16px;
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
        
        elemIdPigProdPid        = `${settings.uniqueKey}-pig-prod-pid`;
        elemIdHeaderSowName     = `${settings.uniqueKey}-header-sow-name`;
        elemIdHeaderBoarName    = `${settings.uniqueKey}-header-boar-name`;
        

        
        elemIdTabsContainer     = `${settings.uniqueKey}-tabs-container`;
        elemIdTabContentArea    = `${settings.uniqueKey}-tab-content`;


        componentTabsWithMore   = new ComponentTabsWithMore({
            navigation:         navigation,
            uniqueKey:          `${settings.uniqueKey}-tab`,
            elemIdDivContainer:     settings.elemIdDivContainer,
            elemIdTabsContainer:    elemIdTabsContainer,
            elemIdTabContentArea:   elemIdTabContentArea,
            
            showMoreTitle:      null, // this dynamically change
            
            tabs:               tabsProdGesta
        });

        const html_style        = thisObj._writeInlineStyle();
        
        const html_tab_buttons  = componentTabsWithMore.getHtml();
        const html_tab_contents = thisObj.getHtmlTabContents(tabsProdGesta);
        
        
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
                <div class="sow-name">
                    <span style="margin-right:10px;">(PID <span id="${elemIdPigProdPid}">1</span>)</span>
                    <span id="${elemIdHeaderSowName}">Sow</span>
                    <span class="love-icon">❤️</span>
                    <span id="${elemIdHeaderBoarName}">Boar</span>
                </div>
            </div>
        </div>
            
            
        
        <!-- Tabs Navigation -->
        <div class="tabs-container" id="${elemIdTabsContainer}">
            ${html_tab_buttons}
        </div>
    </div>
    
    <!-- Tab Content Area Gesta-->
    <div class="tab-content-area" id="${elemIdTabContentArea}" style="margin-top:0;">
        ${html_tab_contents}
    </div>
        `;
        
        
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
		componentTabsWithMore.afterHtmlRender();
		
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemNavPrevEntry        = elemDivContainer.querySelector('#'+elemIdNavPrevEntry);
        elemNavNextEntry        = elemDivContainer.querySelector('#'+elemIdNavNextEntry);
        
        elemEntryTitle          = elemDivContainer.querySelector('#'+elemIdEntryTitle);
        
        elemPigProdPid          = elemDivContainer.querySelector('#'+elemIdPigProdPid);
        elemHeaderSowName       = elemDivContainer.querySelector('#'+elemIdHeaderSowName);
        elemHeaderBoarName      = elemDivContainer.querySelector('#'+elemIdHeaderBoarName);
        
        
        elemTabsContainer       = elemDivContainer.querySelector('#'+elemIdTabsContainer);
        elemTabContentArea      = elemDivContainer.querySelector('#'+elemIdTabContentArea);
        
        elemTabGestaPigOps      = elemDivContainer.querySelector('#'+elemIdTabGestaPigOps);
        elemTabGestaBirth       = elemDivContainer.querySelector('#'+elemIdTabGestaBirth);
        elemTabGestaInsem       = elemDivContainer.querySelector('#'+elemIdTabGestaInsem);
        elemTabGestaNotes       = elemDivContainer.querySelector('#'+elemIdTabGestaNotes);
    }
    
    
    this._processAfterHtmlRender = function(){
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
        
		
		componentTabsWithMore.beforeShowTab = thisObj.beforeShowTab;
    }
    
    
    this._bindEventListeners = function(){
        
        
        
    }
    

    
    this.setDataStaffList = function(data){
        prodEntryBirth.setDataStaffList(data);
    }
    
    
    this.show = function(data_pig_prod, options){
        console.log('PageAddGestating show');
        
        /** Typicla options 
        const options = {
            prev_prod_pid:  prev_prod_pid,
            next_prod_pid:  next_prod_pid,
            data_index:     index+1,
            total_entries:  data_pig_prod_list.length
        };
        
        */
        
        
        // Set Header Data
        const title = `Prod Gestating ${options.data_index} Of ${options.total_entries}`;
        elemEntryTitle.textContent = title;
        
        const pid = data_pig_prod.pig_production.farm_prod_id;
        elemPigProdPid.textContent = pid;
        
        const data_sow = data_pig_prod.sow;
        let sow_reference = '';
        
        if ((data_sow.name != null) && (data_sow.name.length >0)){
            sow_reference = data_sow.name;
        }
        else{
            sow_reference = data_sow.number;
        }
        const insemination = data_pig_prod.insemination;
        
        let boar_name = '';
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
                //boar_name += ' from ' + insemination.ai.semen_supplier.name;
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
        
        
        
        elemHeaderSowName.textContent   = sow_reference;
        elemHeaderBoarName.textContent  = boar_name;
        
        
        // Set arrow navigation
        elemNavPrevEntry.onclick = function(){
            navigation.onClickProdGestatingEntry(options.prev_prod_pid);
        }
        
        elemNavNextEntry.onclick = function(){
            navigation.onClickProdGestatingEntry(options.next_prod_pid);
        }
        
        // Set PigProdOps tab
        const options_pig_prod_ops ={
            show_gesta:   true
        }
        this.prodEntryPigOps.show(data_pig_prod, options_pig_prod_ops);
        
        
        // Set Insemination tab
        const options_insem ={
            is_read_only:   false
        }
        this.prodEntryInsem.show(data_pig_prod, options_insem);
        
    }
    
	
	this.beforeShowTab = function(tab_id){
		
		
	}
    
}   