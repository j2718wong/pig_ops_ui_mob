// December 25, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../../common/page_view_basic.js';

import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE,
        PIG_PROD_TYPE,
        PROD_STATUS,
        SOW_BOAR_TYPE}          from '../../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        sortList}               from '../../../utils.js';

import {getSowBoarReference}    from '../../common/common_app.js';


import {GestaLactaCards}        from './gesta_lacta_cards.js'



export function PageMobGestaLacta(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    
    const LACTA_TABLE_PIGOPS    = 1;
    const LACTA_TABLE_PIG_COUNT = 2;
    const LACTA_TABLE_FEEDS     = 3;
    
    
    
    
    
    /*
    Typical input_settings
    {
        navigation:             this,
        isGesta:                true,
        uniqueKey:              'prod-gesta' // Use for uniqueness in elements
        pageTitle:              'Production Gestating'
    }   
    */  
    let settings                = input_settings;
    
    
    // This is needed as this will be first element to be rendered
    let elemDivContainer        = document.getElementById(settings.elemIdDivContainer);
    
    
    let elemIdNavPrevEntry      = null;
    let elemIdNavNextEntry      = null;

    let elemIdPageTitle         = null;
    let elemIdPageHeaderAlarm   = null;
    let elemIdEntryCount        = null;
    let elemIdPageInfo          = null;
    
    let elemIdSearchInput       = null;
    let elemIdAddEntryBtn       = null;
    
    let elemIdPigProdList       = null;
    let elemIdProdCardsContainer= null;
    
    let elemIdTableColControls  = null;
    let elemIdLactaPigOps       = null;
    let elemIdLactaPigCount     = null;
    let elemIdLactaFeeds        = null;
    
    let elemIdTablePigOpsShow   = null;
    let elemIdTablePigOps       = null;
    let elemIdPigOpsSeeSample   = null;
    let elemIdCheckFarrowing    = null;
    
    let elemIdTablePigCountShow = null;
    let elemIdTablePigCount     = null;
    let elemIdPigCountSeeSample = null;
    
    let elemIdLabelToday        = null;
    let elemIdDateToday         = null;
    
    let elemIdProdTableContainer= null;
    let elemIdPigOpsTableBody  = null;
    let elemIdPigCountTableBody = null;
    
    let elemIdPigOpsAlarmTable  = null;


    let elemNavPrevEntry        = null;
    let elemNavNextEntry        = null;

    let elemPageTitle           = null;
    let elemPageHeaderAlarm     = null;
    let elemEntryCount          = null;
    let elemPageInfo            = null;

    let elemSearchInput         = null;
    let elemAddEntryBtn         = null;
    
    let elemPigProdList         = null;
    let elemProdCardsContainer  = null;
    
    let elemTableColControls    = null;
    let elemLactaPigOps         = null;
    let elemLactaPigCount       = null;
    let elemLactaFeeds          = null;
    
    
    let elemTablePigOpsShow     = null;
    let elemTablePigOps         = null;
    let elemPigOpsSeeSample     = null;
    let elemCheckFarrowing      = null;


    let elemTablePigCountShow   = null;
    let elemTablePigCount       = null;
    let elemPigCountSeeSample   = null;
    
    
    
    let elemLabelToday          = null;    
    let elemDateToday           = null;
    
      
    
    
    
    let elemProdTableContainer  = null;
    let elemPigOpsTableBody    = null;
    let elemPigCountTableBody   = null;
    
    
    let elemPigOpsAlarmTable    = null;

    // if false current view is PigOpsAlarmTable
    let curViewIsPigProdList    = true;
    
    
    // if false, current  pig prod view is table
    let curPigProdViewIsCards   = false;
    
    // Store the previous view state before switching to alarms
    let previousViewWasCards    = false;
    
    
    let dataPigProdList         = null;


    this.showPageHeaderAlarm     = false;
    
    
    // When this is true, entry search will include boar_name,
    // semen_supplier_name, semen_name 
    let searchIncludeInsem      = false;
    
    
    let curLactaTable           = null;
    
    
    this.gestaLactaCards        = new GestaLactaCards({
        navigation:             navigation,
        parentObj:              thisObj,
        isGesta:                settings.isGesta
    });
    
    
    // This should be set before editing ProdPigOps 
    this.pageProdPigOpsEdit    = null;
    
    
    let dtCurrentDate           = null;
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this._writeInlineStyle = function(){
        const html = `
    <style>
        
        /* Updated Table Styles */
        .table-gesta-lacta td {padding-right:0;}
        .table-gesta-lacta th {padding-right:0;}
    </style>
    `;
        return html;
    }
    
    
    
    this.render = function(){
        elemIdNavPrevEntry      = `${settings.uniqueKey}-page-title-prev`;
        elemIdNavNextEntry      = `${settings.uniqueKey}-page-title-next`;
        
        elemIdPageTitle         = `${settings.uniqueKey}-page-title-list`;
        elemIdPageHeaderAlarm   = `${settings.uniqueKey}-page-title-alarm`;
        elemIdEntryCount        = `${settings.uniqueKey}-page-title-entry-count`;
        elemIdPageInfo          = `${settings.uniqueKey}-page-info`;
        
        elemIdPigProdList       = `${settings.uniqueKey}-card-list`;
        elemIdProdCardsContainer= `${settings.uniqueKey}-mobile-list-container`;
        
        
        elemIdTableColControls  = `${settings.uniqueKey}-mobile-pig-prod-table-cols`;
        elemIdLactaPigOps       = `${settings.uniqueKey}-lacta-pigops`;
        elemIdLactaPigCount     = `${settings.uniqueKey}-lacta-piglets`;
        elemIdLactaFeeds        = `${settings.uniqueKey}-lacta-feeds`;
        
        elemIdTablePigOpsShow   = `${settings.uniqueKey}-table-pigops-show`;
        elemIdTablePigOps       = `${settings.uniqueKey}-table-pigops`;
        elemIdPigOpsSeeSample   = `${settings.uniqueKey}-pigops-see-sample`;
        elemIdCheckFarrowing    = `${settings.uniqueKey}-check-farrowing`;
        
        
        elemIdTablePigCountShow = `${settings.uniqueKey}-table-pig-count-show`;
        elemIdTablePigCount     = `${settings.uniqueKey}-table-pig-count`;
        elemIdPigCountSeeSample = `${settings.uniqueKey}-pig-count-see-sample`;
        
        elemIdLabelToday        = `${settings.uniqueKey}-label-today`;
        elemIdDateToday         = `${settings.uniqueKey}-date-today`;
        
        
        elemIdProdTableContainer= `${settings.uniqueKey}-mobile-pig-prod-table`;
        elemIdPigOpsTableBody   = `${settings.uniqueKey}-mobile-pig-prod-tbody`;
        elemIdPigCountTableBody = `${settings.uniqueKey}-mobile-pig-count-tbody`;
        
        
        
        elemIdPigOpsAlarmTable  = `${settings.uniqueKey}-alarm-table`;
        
        
        elemIdSearchInput       = `${settings.uniqueKey}-mobile-search-input`;
        elemIdAddEntryBtn       = `${settings.uniqueKey}-mobile-add-entry-btn`;
           
           
        let html_prod_tables    = '';
        
        let page_info           = '';
        
        let label_prod_gesta    = 'Prod Gestating';
        let label_prod_lacta    = 'Prod Lactating';
        
        let label_today         = 'Today';
        let label_sow           = 'Sow';
        let label_boar          = 'Boar';
        let label_expected      = 'Expected';
        let label_wean          = 'Wean';
        let label_operation     = 'What to do?';
        
        
        let label_num_pigs      = 'Num Pigs';
        let label_dead_at_birth = 'Dead at Birth';
        let label_dead_b4_wean  = 'Dead before Wean';
        
        let page_info_gesta   = `
            This is a list of Gestating Sows. This is the entry point for pig production.
        `;
        
        let page_info_lacta   = `
            This is a list of Lactating entries. This is auto generated. When a 
            Gesta Entry Birth Information is updated, the production entry 
            will be updated from Gesta to Lacta status.
        `;
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_prod_gesta    = helper.getSimpleTranslation('page_gesta_lacta_list.labels.prod_gestating') || label_prod_gesta;
        label_prod_lacta    = helper.getSimpleTranslation('page_gesta_lacta_list.labels.prod_lactating') || label_prod_lacta;
        
        page_info_gesta     = helper.getSimpleTranslation('page_info.gesta_list') || page_info_gesta;
        page_info_lacta     = helper.getSimpleTranslation('page_info.lacta_list') || page_info_lacta;
        
        
        label_today         = helper.getSimpleTranslation('common_app.labels.today') || label_today;
        label_sow           = helper.getSimpleTranslation('common_app.labels.sow') || label_sow;
        label_boar          = helper.getSimpleTranslation('common_app.labels.boar') || label_boar;
    
        label_expected      = helper.getSimpleTranslation('page_gesta_lacta_list.labels.expected') || label_expected;
        label_wean          = helper.getSimpleTranslation('page_gesta_lacta_list.labels.weaning') || label_wean;
        label_operation     = helper.getSimpleTranslation('page_gesta_lacta_list.labels.operation') || label_operation;
        
        
        label_num_pigs      = helper.getSimpleTranslation('page_sow_boar_list.labels.num_piglets') || label_num_pigs;
        label_dead_at_birth = helper.getSimpleTranslation('page_sow_boar_list.labels.dead_at_birth') || label_dead_at_birth;
        label_dead_b4_wean  = helper.getSimpleTranslation('page_sow_boar_list.labels.dead_before_wean') || label_dead_b4_wean;
        
        
        let page_title      = settings.pageTitle;
        
        // The settings.pageTitle will be overriden using the translated PageTitle
        if (settings.isGesta){
            page_title      = label_prod_gesta;
            page_info       = page_info_gesta;
        } else{
            page_title      = label_prod_lacta;
            page_info       = page_info_lacta;
        }
        
           
        let style_hide_add_button = '';
        if (settings.isGesta == false){
            style_hide_add_button = 'display:none;';
            
            html_prod_tables = `
            
            <div class="filter-controls" id="${elemIdTableColControls}">
                <div class="animal-filter">
                    <div class="filter-buttons sow">
                        <button class="filter-button active" id="${elemIdLactaPigOps}" style="min-width:120px;">PigOps</button>
                        <button class="filter-button" id="${elemIdLactaPigCount}" style="min-width:120px;">Pig Count</button>
                        <!--<button class="filter-button" id="${elemIdLactaFeeds}">Feeds</button>-->
                    </div>
                </div>
            </div>
            
            <div>
                <span id="${elemIdLabelToday}">${label_today}</span>
                <span id="${elemIdDateToday}" style="color:blue; font-weight:600;"></span>
            </div>
            
            
            <!-- PigProd Lacta Table -->
            <div id="${elemIdTablePigOpsShow}">
                <table class="data-table table-gesta-lacta" id="${elemIdTablePigOps}">
                    <colgroup>
                        <col style="width: 34%;">
                        <col style="width: 30%;">
                        <col style="width: 36%;">
                    </colgroup>
      
                    <thead>
                        <tr>
                            <th>
                                <div>PID, ${label_sow}</div> 
                                <div><span class="love-icon">❤️</span> ${label_boar}</div>
                            </th>
                            <th>${label_wean}</th>
                            <th>${label_operation}</th>
                        </tr>
                    </thead>
                    
                    <tbody id="${elemIdPigOpsTableBody}">
                    </tbody>
                </table>
                
                <div>
                    <a href="javascript:void(0)" class="text-link" id="${elemIdPigOpsSeeSample}">
                        See sample Data
                    </a>                    
                </div>
                
            </div>
            
            <div id="${elemIdTablePigCountShow}">
                <table class="data-table table-gesta-lacta" id="${elemIdTablePigCount}">
                    <colgroup>
                        <col style="width: 35%;">
                        <col style="width: 15%;">
                        <col style="width: 22%;">
                    </colgroup>
      
                    <thead>
                        <tr>
                            <th>
                                <div>PID, ${label_sow}</div> 
                                <div><span class="love-icon">❤️</span> ${label_boar}</div>
                            </th>
                            <th>${label_num_pigs}</th>
                            <th>${label_dead_at_birth}</th>
                            <th>${label_dead_b4_wean}</th>
                        </tr>
                    </thead>
                    
                    <tbody id="${elemIdPigCountTableBody}">
                    </tbody>
                </table>
                
                <div>
                    <a href="javascript:void(0)" class="text-link" id="${elemIdPigCountSeeSample}">
                        See sample Data
                    </a> 
                    
                    <a href="javascript:void(0)" class="text-link" id="${elemIdCheckFarrowing}">
                        Check Farrowing Schedule
                    </a>                   
                </div>
            </div>
            `;
        }
        
        else{
            html_prod_tables = `
            <!-- PigProd Gesta Table -->
            <div>
                <span id="${elemIdLabelToday}">${label_today}</span>
                <span id="${elemIdDateToday}" style="color:blue; font-weight:600;"></span>
            </div>
            
            <table class="data-table table-gesta-lacta">
                <colgroup>
                    <col style="width: 34%;">
                    <col style="width: 30%;">
                    <col style="width: 36%;">
                </colgroup>
  
                <thead>
                    <tr>
                        <th>
                            <div>PID, ${label_sow}</div> 
                            <div><span class="love-icon">❤️</span> ${label_boar}</div>
                        </th>
                        <th>${label_expected}</th>
                        <th>${label_operation}</th>
                    </tr>
                </thead>
                
                <tbody id="${elemIdPigOpsTableBody}">
                </tbody>
            </table>
            
            <div>
                <a href="javascript:void(0)" class="text-link" id="${elemIdPigOpsSeeSample}">
                    See sample Data
                </a>
                
                <a href="javascript:void(0)" class="text-link" id="${elemIdCheckFarrowing}">
                    Check Farrowing Schedule
                </a>                    
            </div>
            `;
        }
           
           
        const html_style = thisObj._writeInlineStyle();
           
           
        const html = `
        
${html_style}
        

<div class="mobile-container">
    <div class="nav-left-right">
        <button class="nav-button blue" id="${elemIdNavPrevEntry}"><i class="fa-solid fa-arrow-left"></i></button>
            
        <span>
            <span class="nav-title blue" id="${elemIdEntryCount}"></span>
            <span class="nav-title blue" id="${elemIdPageTitle}" style="margin-right:8px;">${page_title}</span>
            <span class="inline-bell larger" id="${elemIdPageHeaderAlarm}" title="Due operations!" style="display:none;">
                <i class="fas fa-bell"></i>
            </span>
        </span>
        
        <button class="nav-button blue" id="${elemIdNavNextEntry}"><i class="fa-solid fa-arrow-right"></i></button>
            
    </div>
    

    <div class="mobile-info-box" id="${elemIdPageInfo}">
        ${page_info}
    </div>
    
    
    <div id="${elemIdPigProdList}">
        <!-- Search and Add Entry Controls -->
        <div class="mobile-controls">
            <div class="search-container">
                <i class="fas fa-search search-icon"></i>
                <input type="text" class="search-input" id=${elemIdSearchInput} placeholder="Search PID or Sow Name...">
            </div>
            <button class="btn-add-entry" id="${elemIdAddEntryBtn}" style="${style_hide_add_button}">
                <i class="fas fa-plus"></i>
                Add Entry
            </button>
        </div>

        <!-- Card Container -->
        <div class="card-container-pig-prod" id="${elemIdProdCardsContainer}" style="display:none;"></div>
        
        <div id="${elemIdProdTableContainer}">
            ${html_prod_tables}
        </div>
    </div>
    
    <div id="${elemIdPigOpsAlarmTable}"></div>
    
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
        elemNavPrevEntry        = elemDivContainer.querySelector('#'+elemIdNavPrevEntry);
        elemNavNextEntry        = elemDivContainer.querySelector('#'+elemIdNavNextEntry);
        
        elemPageTitle           = elemDivContainer.querySelector('#'+elemIdPageTitle);
        elemPageHeaderAlarm     = elemDivContainer.querySelector('#'+elemIdPageHeaderAlarm);
        elemEntryCount          = elemDivContainer.querySelector('#'+elemIdEntryCount);
        elemPageInfo            = elemDivContainer.querySelector('#'+elemIdPageInfo);

        elemSearchInput         = elemDivContainer.querySelector('#'+elemIdSearchInput);
        elemAddEntryBtn         = elemDivContainer.querySelector('#'+elemIdAddEntryBtn);
        elemPigProdList         = elemDivContainer.querySelector('#'+elemIdPigProdList);
        elemProdCardsContainer  = elemDivContainer.querySelector('#'+elemIdProdCardsContainer);
        
        elemTableColControls    = elemDivContainer.querySelector('#'+elemIdTableColControls);
        elemLactaPigOps         = elemDivContainer.querySelector('#'+elemIdLactaPigOps);
        elemLactaPigCount       = elemDivContainer.querySelector('#'+elemIdLactaPigCount);
        elemLactaFeeds          = elemDivContainer.querySelector('#'+elemIdLactaFeeds);
        
        
        elemTablePigOpsShow     = elemDivContainer.querySelector('#'+elemIdTablePigOpsShow);
        elemTablePigOps         = elemDivContainer.querySelector('#'+elemIdTablePigOps);
        elemPigOpsSeeSample     = elemDivContainer.querySelector('#'+elemIdPigOpsSeeSample);
        elemCheckFarrowing      = elemDivContainer.querySelector('#'+elemIdCheckFarrowing);
        
        
        elemTablePigCountShow   = elemDivContainer.querySelector('#'+elemIdTablePigCountShow);
        elemTablePigCount       = elemDivContainer.querySelector('#'+elemIdTablePigCount);
        elemPigCountSeeSample   = elemDivContainer.querySelector('#'+elemIdPigCountSeeSample);
        
        
        elemLabelToday          = elemDivContainer.querySelector('#'+elemIdLabelToday);
        elemDateToday           = elemDivContainer.querySelector('#'+elemIdDateToday);
        
        elemProdTableContainer  = elemDivContainer.querySelector('#'+elemIdProdTableContainer);
        elemPigOpsTableBody    = elemDivContainer.querySelector('#'+elemIdPigOpsTableBody);
        elemPigCountTableBody   = elemDivContainer.querySelector('#'+elemIdPigCountTableBody);
        
        elemPigOpsAlarmTable    = elemDivContainer.querySelector('#'+elemIdPigOpsAlarmTable);
        
    }
    
    
    this._processAfterHtmlRender = function(){

    }
    
    
    this._bindEventListeners = function(){
        
        elemPageTitle.addEventListener('click', function() {
            thisObj.onClickPageHeaderTitle();
        });
        
        
        elemPageHeaderAlarm.addEventListener('click', function() {
            thisObj.onClickPageHeaderAlarm();
        });

        
        elemAddEntryBtn.addEventListener('click', function() {
            const next_page = navigation.getPageContainer(PAGE_ID.PROD_GESTA_ADD);
            
            navigation.showThisPage(next_page);
            navigation.pageProdGestatingAdd.show();
        });
        
        
        if (settings.isGesta == true){
            // Set up listeners for navigation arrows
            elemNavPrevEntry.onclick = function(){
                navigation.managerNavLinks.onClickNavProdNotPregnant(null);
            }

            elemNavNextEntry.onclick = function(){
                navigation.managerNavLinks.onClickNavProdGestaLacta(null, 
                    PIG_OPERATION_TYPE.LACTATING_PIGLETS);
            }
        
            elemPigOpsSeeSample.addEventListener('click', function() {
                thisObj.onClickShowSample({
                    title:      'Sample Gesta List',
                    img_src:    '/static_m/images/mar/mar_gesta.png',
                    img_alt:    'Sample Gesta List'
                });
            });
        
        }
        
        else{
            // Setup listeners for column controls
            
            elemLactaPigOps.addEventListener('click', function() {
                const filterButtons  = elemDivContainer.querySelectorAll('.filter-button');
                for (const cur_entry of filterButtons){
                    cur_entry.classList.remove('active');
                }
                
                this.classList.add('active');
                
                thisObj.changeLactaTable(LACTA_TABLE_PIGOPS);
            });
            
            
            elemLactaPigCount.addEventListener('click', function() {
                const filterButtons  = elemDivContainer.querySelectorAll('.filter-button');
                for (const cur_entry of filterButtons){
                    cur_entry.classList.remove('active');
                }
                
                this.classList.add('active');
                
                thisObj.changeLactaTable(LACTA_TABLE_PIG_COUNT);
            });
            
            
            elemPigOpsSeeSample.addEventListener('click', function() {
                
                thisObj.onClickShowSample({
                    title:      'Sample Lacta List',
                    img_src:    '/static_m/images/mar/sample_lacta_list.png',
                    img_alt:    'Sample Lacta List'
                });
            });


            elemPigCountSeeSample.addEventListener('click', function() {
                
                thisObj.onClickShowSample({
                    title:      'Sample Lacta Pig Count',
                    img_src:    '/static_m/images/mar/sample_lacta_pig_count.png',
                    img_alt:    'Sample Lacta Pig Count'
                });
            });




            
            
            // Set up listeners for navigation arrows
            elemNavPrevEntry.onclick = function(){
                navigation.managerNavLinks.onClickNavProdGestaLacta(null, 
                    PIG_OPERATION_TYPE.GESTATING);
            }

            elemNavNextEntry.onclick = function(){
                navigation.managerNavLinks.onClickNavProdFattening(null);
            }
        }
        
        
        elemCheckFarrowing.addEventListener('click', function() {
            navigation.managerNavLinks.onClickNavFarrowingSchedule(null);
        });
             
    }
    
    
    // Use to force redraw Lacta table in case there is change in data
    this.resetLactaTable = function(){
        curLactaTable = null;
    }
    
    
    this.changeLactaTable = function(lacta_table, pig_prod_list){
        if (lacta_table){
            if (lacta_table == curLactaTable){return;}
        }
        
        switch(lacta_table){
            
            case LACTA_TABLE_PIGOPS:{
                elemTablePigOpsShow.style.display   = 'block';
                elemTablePigCountShow.style.display = 'none';
                
                thisObj.renderGestaLactaTable(pig_prod_list);
                curLactaTable = LACTA_TABLE_PIGOPS;
                break;
            }
            
            case LACTA_TABLE_PIG_COUNT:{
                elemTablePigOpsShow.style.display   = 'none';
                elemTablePigCountShow.style.display = 'block';
                
                thisObj.renderLactaPigCountTable();
                curLactaTable = LACTA_TABLE_PIG_COUNT;
                break;
            }
            
            case LACTA_TABLE_FEEDS:{
                elemTablePigOps.style.display = 'none';
                break;
            }
            
            default:{
                elemTablePigOpsShow.style.display   = 'block';
                elemTablePigCountShow.style.display = 'none';
                
                thisObj.renderGestaLactaTable(pig_prod_list);
                curLactaTable = LACTA_TABLE_PIGOPS;
                break;
            }
            
        }
    }
    

    
    this.show = function(){
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        const s_dt_current = formatDate(dtCurrentDate, FORMAT_COMPACT);
        
        elemDateToday.textContent = s_dt_current;
        
        
        if (settings.isGesta){
            dataPigProdList = navigation.pigFarm.managerPigProd.dataGestatingList;
        }
        else{
            dataPigProdList = navigation.pigFarm.managerPigProd.dataLactatingList;
        }
        
        
        thisObj.showPageHeaderAlarm = false; // Need to reset this.
        elemPageHeaderAlarm.style.display = 'none';
        
        // Need to clear this;
        thisObj.gestaLactaCards.clearAlarmList();
        
        
        let label_no_entries    = 'No Entries';    
        let label_sow           = 'Sow';
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        label_no_entries = helper.getSimpleTranslation('common.labels.no_entries') || label_no_entries;
        label_sow        = helper.getSimpleTranslation('common_app.labels.sow') || label_sow;
        
        
        
        // Show/Hide see sample
        if ((dataPigProdList == null) || (dataPigProdList.length == 0)){
            elemSearchInput.setAttribute("placeholder", label_no_entries); 
            elemPigOpsSeeSample.style.display   = 'block';
            
            if (settings.isGesta == false){
                elemPigCountSeeSample.style.display = 'block';
            }
            
            elemCheckFarrowing.style.display    = 'none';
            
        }
        else{
            elemSearchInput.setAttribute("placeholder", `${label_sow} or PID`);
            elemPigOpsSeeSample.style.display   = 'none';
            
            if (settings.isGesta == false){
                elemPigCountSeeSample.style.display = 'none';
            }
            
            elemCheckFarrowing.style.display    = 'block';
        }
        
        
        let html = '';
        
        // Render HTML in elemProdCardsContainer
        if (dataPigProdList != null){
            for (const cur_entry of dataPigProdList){
                const cardElement = thisObj.gestaLactaCards.getElemPigProdCard(cur_entry);
                elemProdCardsContainer.appendChild(cardElement);
            }
        }
        
        
        // Search functionality
        const cards = elemProdCardsContainer.querySelectorAll('.card-pig-prod');
        
        elemSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toUpperCase().trim();
            
            cards.forEach(card => {
                const pid = card.querySelector('.pid').textContent.toUpperCase();
                const sowName = card.querySelector('.sow-name').textContent.toUpperCase();
                
                if (pid.includes(searchTerm) || sowName.includes(searchTerm) || searchTerm === '') {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            
            // Search for table
            const filtered_entries = thisObj.searchEntries(searchTerm);
            if (settings.isGesta){
                thisObj.renderGestaLactaTable(filtered_entries);
            }
            else{
                thisObj.changeLactaTable(null, filtered_entries);
            }
            
        });
        
        
        // Render HTML in elemPigOpsTableBody
        const is_gesta = settings.isGesta;
        
        if (settings.isGesta){
            thisObj.renderGestaLactaTable(dataPigProdList);
        }
        else{
            thisObj.changeLactaTable();
        }
        
        // Show PageHeaderAlarm
        if (thisObj.showPageHeaderAlarm){
            elemPageHeaderAlarm.style.display = 'inline-block';
        }
        
        
        // Render HTML in elemPigOpsAlarmTable
        html = thisObj.gestaLactaCards.getHtmlAlarmOperations();
        elemPigOpsAlarmTable.innerHTML = html;
    
    
        // Need to set this
        curViewIsPigProdList       = true;
        elemPigProdList.style.display = 'block';
        elemPigOpsAlarmTable.style.display = 'none';
        
        
        // Set Entry Count
        let prod_count = 0;
        if (dataPigProdList){prod_count = dataPigProdList.length;}
        
        elemEntryCount.innerHTML = `${prod_count}`;
        
        
        thisObj.showInfoBox(dataPigProdList, elemPageInfo);
    }
    
    
    this.renderGestaLactaTable = function(pig_prod_list){
        elemPigOpsTableBody.innerHTML = '';
        
        if (pig_prod_list){}
        else{
            pig_prod_list = dataPigProdList;
        }
        
        
        if (pig_prod_list.length > 0) {

            for (const cur_entry of pig_prod_list){
                const elem_row = thisObj.getElemTableRowGestaLacta(cur_entry)
                elemPigOpsTableBody.appendChild(elem_row);
            }
        }
        else{
            let label_no_entries    = 'No Entries';
            
            const helper = navigation.managerTranslations.translationHelper;
            
            
            label_no_entries = helper.getSimpleTranslation('common.labels.no_entries') || label_no_entries;
            
            
            const html = `
                <tr>
                    <td colspan="3"><div>${label_no_entries}</div></td>
                </tr>
            `;
            
            const elem_row = document.createElement('tr');
            elem_row.innerHTML = html;
            
            elemPigOpsTableBody.appendChild(elem_row);
        }
    }
    

    
    // The Gesta and Lacta tables have very similar structures.
    // It only differs at the 3rd column. 
    this.getElemTableRowGestaLacta = function(cur_entry){
        let s_date_expected = ''
        let s_operation = '';
        
        let pid;
        let data_sow;
        let sow_reference;
        
        let dt_important; 
        let dt_important_s;
        let diff_days;
        let num_days_wean; 
        let s_date_important;
        
        let dt_actual;
        let msecs_wean;
        let dt_wean;
        
        let operations;
        let len_items;
        
        let has_operations = 0;
        let are_all_done= 0;
        let pending_operation = null;
        
        let cur_operation;
        let dt_target;
        let dt_target_s;
        let operation_name;
        
        
        
        
        const acc_settings_ops  = navigation.pigFarm.getSettingsOperations();
        
        
        pid = cur_entry.pig_production.farm_prod_id;
        
        data_sow = cur_entry.sow;
        sow_reference = getSowBoarReference(data_sow);
        
        const html_pid_sow = thisObj.getHtmlPidSowLoveBoar(cur_entry);
        
        
        // Set important date; 
        // gesta: expected date of birth 
        // lacta: date of weaning
        s_date_important = '';
        if (settings.isGesta){
            dt_important = new Date(cur_entry.birth.date_expected);
            dt_important_s = formatDate(dt_important, FORMAT_COMPACT);
            
            diff_days = thisObj.calculateNumDaysSinceInsem(
                        cur_entry.insemination.insem_date, dtCurrentDate,
                        acc_settings_ops);
                        
            s_date_important = `${dt_important_s} <span class="nowrap">(Day ${diff_days})</span>`;
        }
        else{

            dt_important_s  = thisObj.calculateDateExpectedWean(
                        cur_entry.birth.date_actual, acc_settings_ops);
                                    
            diff_days = thisObj.calculateNumDaysSinceBirth(
                        cur_entry.birth.date_actual, dtCurrentDate,
                        acc_settings_ops);
            
            s_date_important = `${dt_important_s} <span class="nowrap">(Day ${diff_days})</span>`;
        }
        
        
        // The Operation column should display either one of the following
        // 1.) Over due not yet done operation; display Date, operation name 
        // + overdue indicator
        // 2.) If no overdue, show the upcoming operation
        // 3.) If all Done, should display ALL DONE 
        s_operation = '';
        
        if (settings.isGesta){
            operations = cur_entry.gestating_ops;
        }
        else{
            operations = cur_entry.lactating_ops;
        }
        
        len_items = operations.length;
        
        has_operations = 1;
        if (len_items == 0){has_operations = 0;}
        
        
        let index;
        pending_operation = null;
        are_all_done = 1;
        
        
        if (len_items > 0){
            index = len_items -1;
            while (index >= 0){
                cur_operation = operations[index];
                
                if (cur_operation.pig_prod_pig_ops.date_actual == null){
                    are_all_done = 0;
                    pending_operation = cur_operation;
                    break; // break the while loop
                }
                
                index -= 1;
            }
        }
        
        
        if (pending_operation){

            dt_target   = new Date(pending_operation.pig_prod_pig_ops.date_target);
            dt_target_s  = formatDate(dt_target, FORMAT_COMPACT);
            operation_name = pending_operation.account_pig_ops.name;
            
            let class_overdue = '';
            if (dtCurrentDate >= dt_target){
                class_overdue = 'text-overdue';
            }
            
            s_operation = `
                <div class="${class_overdue}">${dt_target_s}</div>
                <div class="${class_overdue}">${operation_name}</div>`;
        } 
        else {
            s_operation = `
                <div>All Done
                    <span class="operation-icon large icon-done">
                        <i class="fas fa-check-circle"></i>
                    </span>
                </div>`;
        }
        
        
        
        const html = `
        <tr>
            <td>${html_pid_sow}</td>
            <td class="date">${s_date_important}</td>
            <td class="operation" style="margin-left:0; padding-left:0;">
                ${s_operation}
            </td>
        </tr>
        `;
        
        const elem_row = document.createElement('tr');
        elem_row.innerHTML = html;
        
        
        
        // Attach onclick listeners to td
        
        const elem_tds = elem_row.querySelectorAll('td'); 
        
        index = 0
        for (const cur_td of elem_tds){
            
            switch(index){
                
                
                case 0: {
                    cur_td.onclick = function (event) {
                        const clickedElement = event.target;
                        
                        // Check if the clicked element is within the first div of the td
                        // (assuming the first div contains the sow name)
                        const firstDiv = cur_td.querySelector('div:first-child');
                        const isInFirstDiv = firstDiv && firstDiv.contains(clickedElement);
                        
                        if (isInFirstDiv && clickedElement.classList.contains('sow-boar-name')) {
                            // Clicked on the sow name in the first div - navigate to sow entry
                            navigation.pageSowBoarList.gotoSowBoarEntryPage(null, data_sow.hid);
                            event.stopPropagation();
                        } else {
                            // Clicked anywhere else - navigate to production entry
                            if (settings.isGesta) {
                                navigation.onClickProdGestatingEntry(pid);
                            } else {
                                navigation.onClickProdLactatingEntry(pid);
                            }
                        }
                    };
                    break;
                }
                
                case 1:
                case 2: {
                    cur_td.onclick = function (){
                        if (settings.isGesta){
                            navigation.onClickProdGestatingEntry(pid);
                        }
                        else{
                            navigation.onClickProdLactatingEntry(pid);
                        }
                    };
                    
                    break;
                }
                
                
                
                default: {break;}
                
            }
                        
            index += 1;
        
        }
        
        
        return elem_row;
    }
    
    
    this.renderLactaPigCountTable = function(){
        elemPigCountTableBody.innerHTML = '';
        
        let pig_prod_list = dataPigProdList;
        
        
        if (pig_prod_list.length > 0){
            for (const cur_entry of pig_prod_list){
                const elem_row = thisObj.getElemTableRowPigCount(cur_entry)
                elemPigCountTableBody.appendChild(elem_row);
            }
        }
        else{
            const html = `
                <tr>
                    <td colspan="4"><div>No Entries</div></td>
                </tr>
            `;
            
            const elem_row = document.createElement('tr');
            elem_row.innerHTML = html;
            
            elemPigCountTableBody.appendChild(elem_row);
        }
    }
    
    
    this.getElemTableRowPigCount = function(cur_entry){

        let pid;
        let data_sow;
        let sow_reference;
        let s_num_dead_at_birth = '';
        
        let s_num_dead_after_birth = '';
        
        
        let index = 0;
            
        pid = cur_entry.pig_production.farm_prod_id;
        
        data_sow = cur_entry.sow;
        sow_reference = getSowBoarReference(data_sow);
        
        const html_pid_sow = thisObj.getHtmlPidSowLoveBoar(cur_entry);
    
        s_num_dead_at_birth = '';
        
        s_num_dead_after_birth = '';
        
        
        if (cur_entry.birth.num_dead_at_birth > 0){
            s_num_dead_at_birth = `${cur_entry.birth.num_dead_at_birth}`;
        }
        
        if (cur_entry.pig_production.dead_after_birth){
            s_num_dead_after_birth = `${cur_entry.pig_production.dead_after_birth}`;
        }
        
       const html = `
        <tr>
            <td>${html_pid_sow}</td>
            <td style="text-align:center;">${cur_entry.pig_production.cur_pig_count}</td>
            <td style="text-align:center;">${s_num_dead_at_birth}</td>
            <td style="text-align:center;">${s_num_dead_after_birth}</td>
        </tr>
        `;
            
        
        const elem_row = document.createElement('tr');
        elem_row.innerHTML = html;
        
        
        
        // Attach onclick listeners to td
        
        const elem_tds = elem_row.querySelectorAll('td'); 
        
        index = 0
        for (const cur_td of elem_tds){
            
            switch(index){
                case 0:{
                    cur_td.onclick = function (){
                        navigation.onClickProdLactatingEntry(pid);
                    };
                    
                    break;
                }
                
                case 1:
                case 2: {
                    const tab_id_sow_ouput = navigation.pageSowBoarEntry.elemIdTabOutput;
                    
                    
                    cur_td.onclick = function (){
                        navigation.pageSowBoarList.gotoSowBoarEntryPage(null, 
                            data_sow.hid, SOW_BOAR_TYPE.SOW, tab_id_sow_ouput);
                    };
                    break;
                }
                
                default: {break;}
                
            }
                        
            index += 1;
        
        }
        
        
        return elem_row;
        
    }
    
    
    this.searchEntries = function(key){
        let data_pig_prod_list = null;
        
        if (settings.isGesta){
            data_pig_prod_list = navigation.pigFarm.managerPigProd.dataGestatingList;
        }
        else{
            data_pig_prod_list = navigation.pigFarm.managerPigProd.dataLactatingList;
        }
        
        
        if (key == ''){return data_pig_prod_list;}
        
        
        const filtered = [];
        for (const cur_entry of data_pig_prod_list){
            
            let u_sow_name          = null;
            let u_sow_number        = null;
            
            let u_boar_name         = null;
            let u_boar_number       = null;
            
            let u_semen_supplier    = null;
            let u_semen_name        = null;
            
            
            let s_pid   = `${cur_entry.pig_production.farm_prod_id}`;
            
            if (cur_entry.sow.name){
                u_sow_name = cur_entry.sow.name.toUpperCase();
            }
            
            if (cur_entry.sow.number){
                u_sow_number = cur_entry.sow.number.toUpperCase();
            }
            
            
            let insemination = cur_entry.insemination;
            
            switch (insemination.insem_type){
                case 'B': {
                    if (insemination.boar.name){
                        u_boar_name = insemination.boar.name.toUpperCase();
                    }
                    
                    if (insemination.boar.number){
                        u_boar_number = insemination.boar.number.toUpperCase();
                    }
                    
                    break;
                }
                
                case 'AI_X': {
                    u_semen_supplier = insemination.ai.semen_supplier.name.toUpperCase();
                    u_semen_name    = insemination.ai.semen_supplier.semen.name.toUpperCase();
                    
                    break;
                }
                
                case 'AI_N': {
                    if (insemination.ai.internal_boar.name){
                        u_boar_name = insemination.ai.internal_boar.name.toUpperCase();
                    }
                    
                    if (insemination.ai.internal_boar.number){
                        u_boar_number = insemination.ai.internal_boar.number.toUpperCase();
                    }
                    
                    break;
                }
            }
            
            
            if (s_pid.startsWith(key)){
                filtered.push(cur_entry);
                continue;
            }
            
            
            if (u_sow_name){
                if (u_sow_name.startsWith(key)){
                    filtered.push(cur_entry);
                    continue;
                }
            }
            
            if (u_sow_number){
                if (u_sow_name.startsWith(key)){
                    filtered.push(cur_entry);
                    continue;
                }
            }
            
            
            if (searchIncludeInsem){
                if (u_boar_name){
                    if (u_boar_name.startsWith(key)){
                        filtered.push(cur_entry);
                        continue;
                    }
                }
                
                if (u_boar_number){
                    if (u_boar_number.startsWith(key)){
                        filtered.push(cur_entry);
                        continue;
                    }
                }
                
                if (u_semen_supplier){
                    if (u_semen_supplier.startsWith(key)){
                        filtered.push(cur_entry);
                        continue;
                    }
                }
            
                if (u_semen_name){
                    if (u_semen_name.startsWith(key)){
                        filtered.push(cur_entry);
                        continue;
                    }
                }
            }
            
        } 
        
        
        return filtered;
    }
    
    
    this.getDataPigProd = function(pid){
        // Most functions with getData*** always use entry_hid as 
        // input parameter. The DataPigProd will use pid instead
        // as this is highly visible by in the page.
        for (const cur_entry of dataPigProdList){
            if(cur_entry.pig_production.farm_prod_id == pid){return cur_entry;}
        }
        return null;
    }
    
    
    this.clickLactaPigOps = function(){
        elemLactaPigOps.click();
    }
    
    
    this.clickLactaPigCount = function(){
        elemLactaPigCount.click();
    }
    
    
    this.onClickPageHeaderTitle = function(){
        
        // Hide alarms table
        elemPigOpsAlarmTable.style.display = 'none';
    
        // Don't force curViewIsPigProdList - respect actual state
        // Instead, just show the main view
        elemPigProdList.style.display = 'block';
        curViewIsPigProdList = true;
        
        // Toggle Cards or Table View (keep existing logic)
        if (curPigProdViewIsCards == true){
            elemProdCardsContainer.style.display = 'none';
            elemProdTableContainer.style.display = 'block';
            curPigProdViewIsCards = false;
        } else {
            elemProdCardsContainer.style.display = 'block';
            elemProdTableContainer.style.display = 'none';
            curPigProdViewIsCards = true;
        }
        
        
    }
    
    
    this.onClickPageHeaderAlarm = function(){
        // Save current view state before switching to alarms
        previousViewWasCards = curPigProdViewIsCards;
        
        if (curViewIsPigProdList == true){
            // Currently showing list, switch to alarms
            elemPigProdList.style.display = 'none';
            elemPigOpsAlarmTable.style.display = 'block';
            curViewIsPigProdList = false;
        } else {
            // Currently showing alarms, switch back to list
            elemPigProdList.style.display = 'block';
            elemPigOpsAlarmTable.style.display = 'none';
            curViewIsPigProdList = true;
            
            // Restore previous card/table state
            if (previousViewWasCards) {
                elemProdCardsContainer.style.display = 'block';
                elemProdTableContainer.style.display = 'none';
                curPigProdViewIsCards = true;
            } else {
                elemProdCardsContainer.style.display = 'none';
                elemProdTableContainer.style.display = 'block';
                curPigProdViewIsCards = false;
            }
        }
    }
    
    
    this.getDataProdPigOps = function(data_pig_prod, entry_hid){
        /**
        20251231: 
        1.) There are 3 data blocks to read for this
            - gestating_ops
            - lactating_piglets_ops
            - lactating_sow_ops
        
        2.) Later on, lactating_piglets_ops and lactating_sow_ops
            planned to be combined into one data block: lactating_ops 
        
        3.) Each of prod_pig_ops in these blocks are distinct.
            Different entry_hid
        */
        
        let pig_prod_ops_list = null;
        
        if (settings.isGesta == true){
            pig_prod_ops_list = data_pig_prod.gestating_ops;
        }
        else{
            if ('lactating_ops' in data_pig_prod){
                pig_prod_ops_list = data_pig_prod.lactating_ops;
            }
            else{
                pig_prod_ops_list = data_pig_prod.lactating_piglets_ops;
            }
        }
        
        for(const cur_entry of pig_prod_ops_list){
            if (cur_entry.pig_prod_pig_ops.hid == entry_hid){
                return cur_entry;
            }
        }
        
        return null;
    }
    
    
    this.onSuccessEditPigOps = function(){
        // Need to redraw Page, because an alarm is maybe already addressed
        // by PigProdPigOps edit
            

        let pig_prod_type = PIG_PROD_TYPE.GESTATING;
        if (settings.isGesta == false){pig_prod_type = PIG_PROD_TYPE.LACTATING;}

        const callback_success = function(data){
            thisObj.show(); 
            navigation.pageProdPigOpsEdit.hide();
        };
        
        navigation.pigFarm.managerPigProd.requestPigProdList(pig_prod_type, callback_success);
        
    }
}
