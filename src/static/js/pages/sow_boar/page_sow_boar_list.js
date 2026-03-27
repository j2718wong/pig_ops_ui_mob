// December 25, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}        from '../common/page_view_basic.js';

import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        SOW_STATUS_NAME}            from '../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        sortList}                   from '../../utils.js';

import {getSowBoarReference}        from '../common/common_app.js';


import {SowBoarTableSowAll}         from './sow_boar_tables/table_sow_all.js'
import {SowBoarTableSowGesta}       from './sow_boar_tables/table_sow_gesta.js'
import {SowBoarTableSowLacta}       from './sow_boar_tables/table_sow_lacta.js'
import {SowBoarTableSowWean}        from './sow_boar_tables/table_sow_wean.js'
import {SowBoarTableSowOutput}      from './sow_boar_tables/table_sow_output.js'

import {SowBoarTableBoar}           from './sow_boar_tables/table_boar.js'
import {SowBoarTableGilt}           from './sow_boar_tables/table_gilt.js'
import {SowBoarTableDisposed}       from './sow_boar_tables/table_disposed.js'




export function PageSowBoarList(input_settings){
    PageViewPigFarmPage.call(this);
    
    const TAG                   = 'PageSowBoarList';
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    this.setNavigation(navigation);
    
    
    this.TABLE_ROW_PER_PAGE     = 10;
    
    /*
    Typical input_settings
    {
        navigation:             this,
        elemIdDivContainer:     elemIdContSowBoarList,
        uniqueKey:              'sow-boar'
    }   
    */  
    const settings               = input_settings;
    
    
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
    let elemIdFilterControls    = null;
    
    let elemIdSowControls       = null;     
    let elemIdIncludeDisposed   = null;
    let elemIdSowOutputToggle   = null;
    
    let elemIdDateTodayShow     = null;
    let elemIdLabelToday        = null;
    let elemIdDateToday         = null;
    
    
    let elemIdTableRowCount     = null;
    let elemIdTablePagination   = null;
    let elemIdTablePrevPage     = null;
    let elemIdTableCurPage      = null;
    let elemIdTableTotalPages   = null;
    let elemIdTableNextPage     = null;
    
    
    let elemIdTableSowOutput    = null;
    let elemIdTableSowOutputBody= null;


    let elemNavPrevEntry        = null;
    let elemNavNextEntry        = null;

    let elemPageTitle           = null;
    let elemPageHeaderAlarm     = null;
    let elemEntryCount          = null;
    let elemPageInfo            = null;

    let elemSearchInput         = null;
    let elemAddEntryBtn         = null;
    let elemFilterControls      = null;
    
    let elemSowControls         = null;     
    let elemIncludeDisposed     = null;
    let elemSowOutputToggle     = null;
    
    let elemDateTodayShow       = null;
    let elemLabelToday          = null;
    let elemDateToday           = null;
    
    let elemTableRowCount       = null;
    let elemTablePagination     = null;
    let elemTablePrevPage       = null;
    let elemTableCurPage        = null;
    let elemTableTotalPages     = null;
    let elemTableNextPage       = null;
    

    
    let elemTableSowOutput      = null;
    let elemTableSowOutputBody  = null;

    
    let dataSowList             = null;
    let dataBoarList            = null;
    let dataGiltList            = null;
    
    let dataDisposedList        = null;
    
    let curDataView             = null;
    

    let curSowBoarType          = null;

    //let textTranslation         = new TextTranslation();
    let curUserLanguageKey      = 'en';


    let showpageHeaderAlarm     = false;
    let pigOpsAlarmList         = null;
    
    
    let curDataListView         = null;
    
    let curDataFilter            = null;
    
    
    // This must be set before rendering the autotable
    // See G_SAMPLE_JSON_ACCOUNT
    this.accountData            = null;
    
    
    let showOptions             = null;
    
    
    let dtCurrentDate           = null;
    
    
    let tableSowAll             = new SowBoarTableSowAll({
        navigation:             navigation,
        parentObj:              this,
        elemDivContainer:       elemDivContainer,
        uniqueKey:              settings.uniqueKey 
    });
    
    
    let tableSowGesta           = new SowBoarTableSowGesta({
        navigation:             navigation,
        parentObj:              this,
        elemDivContainer:       elemDivContainer,
        uniqueKey:              settings.uniqueKey 
    });
    
    
    let tableSowLacta           = new SowBoarTableSowLacta({
        navigation:             navigation,
        parentObj:              this,
        elemDivContainer:       elemDivContainer,
        uniqueKey:              settings.uniqueKey 
    });
    
    
    let tableSowWean            = new SowBoarTableSowWean({
        navigation:             navigation,
        parentObj:              this,
        elemDivContainer:       elemDivContainer,
        uniqueKey:              settings.uniqueKey
    });
    
    
    let tableSowOutput          = new SowBoarTableSowOutput({
        navigation:             navigation,
        parentObj:              this,
        elemDivContainer:       elemDivContainer,
        uniqueKey:              settings.uniqueKey 
    });
    
    
    
    let tableBoar               = new SowBoarTableBoar({
        navigation:             navigation,
        parentObj:              this,
        elemDivContainer:       elemDivContainer,
        uniqueKey:              settings.uniqueKey 
    });
    
    
    let tableGilt               = new SowBoarTableGilt({
        navigation:             navigation,
        parentObj:              this,
        elemDivContainer:       elemDivContainer,
        uniqueKey:              settings.uniqueKey 
    });
    
    
    let tableDiposed            = new SowBoarTableDisposed({
        navigation:             navigation,
        parentObj:              this,
        elemDivContainer:       elemDivContainer,
        uniqueKey:              settings.uniqueKey
    }); 
    
    
    this.elemTableRowCount      = null;
    this.elemTablePagination    = null;
    this.elemTablePrevPage      = null;
    this.elemTableCurPage       = null;
    this.elemTableTotalPages    = null;
    this.elemTableNextPage      = null;
    
    this.dtCurrentDate          = null;
    
    
    this.init = function(){
        //textTranslation.setTranslations(TRANSLATION_PAGE_ACC_PIG_OPS);
        
        this.render();
        this.afterHtmlRender();
        
        
    }
    
    
    this._writeInlineStyle = function(){
        const html = `
    <style>
        
        .sow-boar-controls{
            display: flex;
            justify-content:center;
        }
        
        /* Updated Table Styles */
        .table-sow td {padding-right:0}
        .table-sow th {padding-right:0}
       
        .data-table.table-boar td:nth-child(3) { text-align: center;}
            
        .table-boar td {padding-right:0}
        .table-boar th {padding-right:0}
        
        .table-gilt td {padding-right:0}
        
        .table-disposed td {padding-right:0}
        
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
        
        elemIdSearchInput       = `${settings.uniqueKey}-search-input`;
        elemIdAddEntryBtn       = `${settings.uniqueKey}-add-entry-btn`;
        elemIdFilterControls    = `${settings.uniqueKey}-filter-control`;
        
        
        elemIdSowControls       = `${settings.uniqueKey}-sow-controls`;
        elemIdIncludeDisposed   = `${settings.uniqueKey}-inc-disposed`;
        elemIdSowOutputToggle   = `${settings.uniqueKey}-output-toggle`;
        
        elemIdDateTodayShow     = `${settings.uniqueKey}-today-show`;
        elemIdLabelToday        = `${settings.uniqueKey}-label-today`;
        elemIdDateToday         = `${settings.uniqueKey}-date-today`;
        

        
        elemIdTableRowCount     = `${settings.uniqueKey}-table-row-count`;
        elemIdTablePagination   = `${settings.uniqueKey}-table-pagination`;
        elemIdTablePrevPage     = `${settings.uniqueKey}-table-prev-page`;
        elemIdTableCurPage      = `${settings.uniqueKey}-table-cur-page`;
        elemIdTableTotalPages   = `${settings.uniqueKey}-table-total-pages`;
        elemIdTableNextPage     = `${settings.uniqueKey}-table-next-page`;
        
        
        
        
        const html_style        = thisObj._writeInlineStyle();
        
        
        const html_table_sow_all    = tableSowAll.getHtml(); 
        const html_table_sow_gesta  = tableSowGesta.getHtml();  
        const html_table_sow_lacta  = tableSowLacta.getHtml(); 
        const html_table_sow_wean   = tableSowWean.getHtml();
        const html_table_sow_output = tableSowOutput.getHtml();
        
        const html_table_boar       = tableBoar.getHtml(); 
        const html_table_gilt       = tableGilt.getHtml();  
        const html_table_disposed   = tableDiposed.getHtml();
        
        
        let label_add_entry     = 'Add Entry';
        let label_search_pig    = 'Search Pig Name or Number';
        let label_sow_all       = 'All';
        let label_sow_gesta     = 'Gesta';
        let label_sow_lacta     = 'Lacta';
        let label_sow_wean      = 'Wean';
        let label_sow_output    = 'Output';
        
        let label_today         = 'Today';
        
        
        const helper = navigation.managerTranslations.translationHelper;

        label_add_entry     = helper.getSimpleTranslation('common.labels.add_entry') || label_add_entry;
        
        label_today         = helper.getSimpleTranslation('common_app.labels.today') || label_today;

        label_search_pig    = helper.getSimpleTranslation('page_sow_boar_list.labels.search_pig') || label_search_pig;
        
        label_sow_all       = helper.getSimpleTranslation('page_sow_boar_list.labels.sow_all') || label_sow_all;
        label_sow_gesta     = helper.getSimpleTranslation('page_sow_boar_list.labels.sow_gesta') || label_sow_gesta;
        label_sow_lacta     = helper.getSimpleTranslation('page_sow_boar_list.labels.sow_lacta') || label_sow_lacta;
        label_sow_wean      = helper.getSimpleTranslation('page_sow_boar_list.labels.sow_wean') || label_sow_wean;
        label_sow_output    = helper.getSimpleTranslation('page_sow_boar_list.labels.sow_output') || label_sow_output;
        
        
        const html = `

${html_style}
        
<div class="mobile-container">
    <div class="nav-left-right">
        <button class="nav-button blue" id="${elemIdNavPrevEntry}"><i class="fa-solid fa-arrow-left"></i></button>
                
        <span>
            <span class="nav-title blue" id="${elemIdEntryCount}"></span>
            <span class="nav-title blue" id="${elemIdPageTitle}"></span>
            <span class="inline-bell larger" id="${elemIdPageHeaderAlarm}" title="Due operations!" style="display:none;">
                <i class="fas fa-bell"></i>
            </span>
        </span>
        
        <button class="nav-button blue" id="${elemIdNavNextEntry}"><i class="fa-solid fa-arrow-right"></i></button>
            
    </div>
    
    <!-- Mobile Info Box -->
        <!--
        <div class="mobile-info-box">
            <div class="info-text" id="${elemIdPageInfo}">
            </div>
        </div>
        -->
    
    
    <div>

        <div class="mobile-controls">
            <div class="search-container">
                <i class="fas fa-search search-icon"></i>
                <input type="text" class="search-input" id=${elemIdSearchInput} placeholder="${label_search_pig}">
            </div>
            <button class="btn-add-entry" id="${elemIdAddEntryBtn}">
                <i class="fas fa-plus"></i>
                ${label_add_entry}
            </button>
        </div>
        
        <div id="${elemIdFilterControls}">
        
            <div class="filter-controls">

                <div class="animal-filter">
                    <div class="filter-buttons sow">
                        <button class="filter-button active" data-filter="all">${label_sow_all}</button>
                        <button class="filter-button" data-filter="gestating">${label_sow_gesta}</button>
                        <button class="filter-button" data-filter="lactating">${label_sow_lacta}</button>
                        <button class="filter-button" data-filter="weaning">${label_sow_wean}</button>
                        <button class="filter-button" data-filter="output">${label_sow_output}</button>
                    </div>

                </div>
                
            </div>
            
            <div class="sow-boar-controls" id="${elemIdSowControls}" style="display:none;">
                <div class="checkbox-group" style="padding:6px; margin-top:0; margin-bottom:4px;">
                    <input type="checkbox" id="${elemIdIncludeDisposed}">
                    <label for="${elemIdIncludeDisposed}" class="checkbox-label">
                        Include Disposed
                    </label>
                
                    <a id="${elemIdSowOutputToggle}" href="javascript:void(0)" class="text-link">Show Per Mate</a>
                </div>
            </div>
            
        </div>
        
        
        <div id="${elemIdDateTodayShow}" style="text-align: center;">
            <span id="${elemIdLabelToday}">${label_today}</span>
            <span id="${elemIdDateToday}" style="color:blue; font-weight:600;"></span>
        </div>
        
        
        <!-- Controls Bar -->
        <div class="controls-bar">
            <div class="entry-count" id="${elemIdTableRowCount}">
            </div>
            
            <div class="pagination-controls" id="${elemIdTablePagination}">
                <button class="pagination-btn" id="${elemIdTablePrevPage}" disabled>
                    <i class="fas fa-chevron-left"></i>
                </button>
                <span class="page-indicator">
                    <span id="${elemIdTableCurPage}">1</span> / <span id="${elemIdTableTotalPages}">3</span>
                </span>
                <button class="pagination-btn" id="${elemIdTableNextPage}">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
        

        <!-- Table Sow All-->
        ${html_table_sow_all}
        
        <!-- Table Sow Gesta-->
        ${html_table_sow_gesta}
        
        <!-- Table Sow Lacta-->
        ${html_table_sow_lacta}
        
        <!-- Table Sow Wean-->
        ${html_table_sow_wean}
        
        
        <!-- Table Sow Output-->
        ${html_table_sow_output}
        
        
        <!-- Table Boar -->
        ${html_table_boar}
        
        
        <!-- Table Gilt -->
        ${html_table_gilt}
        
        
        <!-- Table Disposed -->
        ${html_table_disposed}
        
    </div>
    
    
</div>
        `;
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        tableSowAll.afterHtmlRender();
        tableSowGesta.afterHtmlRender();
        tableSowLacta.afterHtmlRender();
        tableSowWean.afterHtmlRender();
        tableSowOutput.afterHtmlRender();
        
        tableBoar.afterHtmlRender();
        tableGilt.afterHtmlRender();
        tableDiposed.afterHtmlRender();
        
        
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
        elemFilterControls      = elemDivContainer.querySelector('#'+elemIdFilterControls);
        
        elemSowControls         = elemDivContainer.querySelector('#'+elemIdSowControls);    
        elemIncludeDisposed     = elemDivContainer.querySelector('#'+elemIdIncludeDisposed);
        elemSowOutputToggle     = elemDivContainer.querySelector('#'+elemIdSowOutputToggle);
        
        elemDateTodayShow       = elemDivContainer.querySelector('#'+elemIdDateTodayShow);
        elemLabelToday          = elemDivContainer.querySelector('#'+elemIdLabelToday);
        elemDateToday           = elemDivContainer.querySelector('#'+elemIdDateToday);
        
        
        elemTableRowCount       = elemDivContainer.querySelector('#'+elemIdTableRowCount);
        elemTablePagination     = elemDivContainer.querySelector('#'+elemIdTablePagination);
        elemTablePrevPage       = elemDivContainer.querySelector('#'+elemIdTablePrevPage);
        elemTableCurPage        = elemDivContainer.querySelector('#'+elemIdTableCurPage);
        elemTableTotalPages     = elemDivContainer.querySelector('#'+elemIdTableTotalPages);
        elemTableNextPage       = elemDivContainer.querySelector('#'+elemIdTableNextPage);
        
        
        
        
        this.elemTableRowCount      = elemTableRowCount;
        this.elemTablePagination    = elemTablePagination;
        this.elemTablePrevPage      = elemTablePrevPage;  
        this.elemTableCurPage       = elemTableCurPage;   
        this.elemTableTotalPages    = elemTableTotalPages;
        this.elemTableNextPage      = elemTableNextPage;  
        
        
    }
    
    
    this._processAfterHtmlRender = function(){
        this.handleWindowResize();
    }
    
    
    this._bindEventListeners = function(){
        
        elemPageHeaderAlarm.addEventListener('click', function() {
            thisObj.onClickPageHeaderAlarm();
        });

        
        const filterButtons  = elemDivContainer.querySelectorAll('.filter-button');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const data_filter = button.getAttribute('data-filter');
                
                // Update active tab button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                if (data_filter != 'output') {
                    thisObj.onClickDataFilter(data_filter);
                }
                else{
                    thisObj.onClickSowListOutput();
                }
            });
        });
        
        
        elemSearchInput.addEventListener('input', function() {
            const search_term = this.value.toUpperCase().trim();
            thisObj.searchSowBoar(search_term);
            
        });
        
    }
    
    
    this.resetSowFilterButton = function(index_element){
        const filterButtons  = elemDivContainer.querySelectorAll('.filter-button');
        
        
        for (const cur_entry of filterButtons){
            cur_entry.classList.remove('active');
        } 
        
        if (index_element){
            filterButtons[index_element].classList.add('active');

        } else{
            filterButtons[0].classList.add('active');
        }
    }
    
    
    this.getSowBoarEntry = function(entry_hid){
        let cur_sow_boar_list = null;
        
        switch (showOptions.sow_boar_type){
            case SOW_BOAR_TYPE.SOW:  {cur_sow_boar_list = dataSowList; 
                for(const cur_entry of  cur_sow_boar_list){
                    if (cur_entry.hid == entry_hid);
                }
                break;
            }
            case SOW_BOAR_TYPE.BOAR: {cur_sow_boar_list = dataBoarList; break;}
            case SOW_BOAR_TYPE.GILT: {cur_sow_boar_list = dataGiltList; break;}
            
            case SOW_BOAR_TYPE.DISPOSED: {cur_sow_boar_list = dataDisposedList; break;}
        }
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
    
    
    this.renderPage = function(page_data){
        thisObj.show(page_data.options);
    }
    
    
    this.show = function(options){
        // So that not to instantiate in every table redraw
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        this.dtCurrentDate = dtCurrentDate;
        
        
        const s_dt_current = formatDate(dtCurrentDate, FORMAT_COMPACT);
        
        // This is only shown in Gesta tab
        elemDateToday.textContent = s_dt_current;
        elemDateTodayShow.style.display = 'none';
        
        
        
        dataSowList     = navigation.pigFarm.managerSowBoar.dataSowList;
        dataBoarList    = navigation.pigFarm.managerSowBoar.dataBoarList;
        dataGiltList    = navigation.pigFarm.managerSowBoar.dataGiltList;
        
        // Default all
        curDataFilter = 'all';
        
        // show the last showOptions if there is no options
        if (options == null){options = showOptions;}
        
        
        thisObj.debugNavHistory(TAG);
        
        // Update navigation.curPageNavigated
        navigation.curPageNavigated.pageData = {options:options};
        navigation.curPageNavigated.renderPageFunc = thisObj.renderPage;
        
        
        
        // Request requestFarmPigletsOutput 
        if (navigation.pigFarm.managerSowBoar.dataFarmPigletsOutput == null){
            const callback_success = function(){
                // Render Table later
            };
            
            navigation.pigFarm.managerSowBoar.requestFarmPigletsOutput(
                callback_success);
        }
        
        
        
        
        showOptions = options;
        
        showpageHeaderAlarm = false; // Need to reset this.
        elemPageHeaderAlarm.style.display = 'none';
        
        curSowBoarType = options.sow_boar_type;
        
        let is_add_sow = false;
        let entry_count = 0;
        
        
        const translations      = navigation.getTranslations();
        
        let label_sow_list      = 'Sow List';
        let label_boar_list     = 'Boar List';
        let label_gilt_list     = 'Gilt List';
        let label_disposed_list = 'Disposed List';
        
        
        if (translations){
            if (translations.page_sow_boar_list && 
                translations.page_sow_boar_list.labels){
                
                const labels_sow_boar_list = translations.page_sow_boar_list.labels;
                
                if (labels_sow_boar_list) {
                    if(labels_sow_boar_list.sow_list) {
                        label_sow_list = labels_sow_boar_list.sow_list;}
                
                    if(labels_sow_boar_list.boar_list) {
                        label_boar_list = labels_sow_boar_list.boar_list;}
                
                    if(labels_sow_boar_list.gilt_list) {
                        label_gilt_list = labels_sow_boar_list.gilt_list;}
                
                    if(labels_sow_boar_list.disposed_list) {
                        label_disposed_list = labels_sow_boar_list.disposed_list;}
                }
            }
        }
        

        
        switch (showOptions.sow_boar_type){
            case SOW_BOAR_TYPE.SOW: {
                elemPageTitle.textContent = label_sow_list;
                
                elemAddEntryBtn.style.display = 'block';
                
                is_add_sow = true;
                
                // Update EntryCount
                if (dataSowList != null){
                    entry_count = dataSowList.length; 
                }
                
                if (entry_count == 0){
                    elemFilterControls.style.display = 'none';
                }
                else{
                    elemFilterControls.style.display = 'block';
                }
                
                
                // Set up listeners for navigation arrows
                elemNavPrevEntry.onclick = function(){
                    navigation.managerNavLinks.onClickNavSowBoar(null, 
                        SOW_BOAR_TYPE.DISPOSED);
                }
        
                elemNavNextEntry.onclick = function(){
                    navigation.managerNavLinks.onClickNavSowBoar(null, 
                        SOW_BOAR_TYPE.BOAR);
                }
                
                curDataListView = dataSowList;
                
                if (showOptions.filter_type && 
                    showOptions.filter_type == 'weaning'){
                    
                    tableBoar.hide();
                    tableGilt.hide();
                    tableDiposed.hide();
                    
                    
                    // set the button to weaning sows
                    thisObj.resetSowFilterButton(3); 
                    thisObj.onClickDataFilter('weaning')
                    return;
                 }
                


                tableSowAll.show();
                tableSowGesta.hide();
                tableSowLacta.hide();
                tableSowWean.hide();
                tableSowOutput.hide();
                
                tableBoar.hide();
                tableGilt.hide();
                tableDiposed.hide();
                
                
                thisObj.resetSowFilterButton();
                
                
                tableSowAll.renderTable(curDataListView);
                
                break;
            }
            
            case SOW_BOAR_TYPE.BOAR: {
                elemPageTitle.textContent = label_boar_list;
                
                elemAddEntryBtn.style.display = 'block';
                
                if (dataBoarList != null){
                    entry_count = dataBoarList.length; 
                }
                
                // Set up listeners for navigation arrows
                elemNavPrevEntry.onclick = function(){
                    navigation.managerNavLinks.onClickNavSowBoar(null, 
                        SOW_BOAR_TYPE.SOW);
                }
        
                elemNavNextEntry.onclick = function(){
                    navigation.managerNavLinks.onClickNavSowBoar(null, 
                        SOW_BOAR_TYPE.GILT);
                }
                
                
                elemFilterControls.style.display = 'none';
                
                tableSowAll.hide();
                tableSowGesta.hide();
                tableSowLacta.hide();
                tableSowWean.hide();
                tableSowOutput.hide();
                
                tableBoar.show();
                tableGilt.hide();
                tableDiposed.hide();
                
                
                curDataListView = dataBoarList;
                tableBoar.renderTable(curDataListView); 
                break;
            }
            
            case SOW_BOAR_TYPE.GILT:{
                elemPageTitle.textContent = label_gilt_list;
                
                elemAddEntryBtn.style.display = 'block';
                
                if (dataGiltList != null){
                    entry_count = dataGiltList.length; 
                }
                
                // Set up listeners for navigation arrows
                elemNavPrevEntry.onclick = function(){
                    navigation.managerNavLinks.onClickNavSowBoar(null, 
                        SOW_BOAR_TYPE.BOAR);
                }
        
                elemNavNextEntry.onclick = function(){
                    navigation.managerNavLinks.onClickNavSowBoar(null, 
                        SOW_BOAR_TYPE.DISPOSED);
                }
                
                
                elemFilterControls.style.display = 'none';
                
                
                tableSowAll.hide();
                tableSowGesta.hide();
                tableSowLacta.hide();
                tableSowWean.hide();
                tableSowOutput.hide();
                
                tableBoar.hide();
                tableGilt.show();
                tableDiposed.hide();
                
                
                curDataListView = dataGiltList;
                tableGilt.renderTable(curDataListView);
                break;
            }
            
            case SOW_BOAR_TYPE.DISPOSED:{
                elemPageTitle.textContent = label_disposed_list;
                
                elemAddEntryBtn.style.display = 'none';
                
                if (dataDisposedList != null){
                    entry_count = dataDisposedList.length; 
                }
                
                // Set up listeners for navigation arrows
                elemNavPrevEntry.onclick = function(){
                    navigation.managerNavLinks.onClickNavSowBoar(null, 
                        SOW_BOAR_TYPE.GILT);
                }
        
                elemNavNextEntry.onclick = function(){
                    navigation.managerNavLinks.onClickNavSowBoar(null, 
                        SOW_BOAR_TYPE.SOW);
                }
                
                
                if (dataDisposedList == null){
                    const callback = function(data){
                        dataDisposedList = data;
                        curDataListView = dataDisposedList;
                        tableDiposed.renderTable(curDataListView);
                        
                        entry_count = dataDisposedList.length;
                        elemEntryCount.textContent = entry_count;
                    };
                    
                    tableDiposed.requestDisposedSowBoar(callback);
                }
                else {
                    curDataListView = dataDisposedList;
                    tableDiposed.renderTable(curDataListView);
                }
                
                
                elemFilterControls.style.display = 'none';
                
                
                tableSowAll.hide();
                tableSowGesta.hide();
                tableSowLacta.hide();
                tableSowWean.hide();
                tableSowOutput.hide();
                
                tableBoar.hide();
                tableGilt.hide();
                tableDiposed.show();
                
                
                break;
            }
        
        }
        
        
        // Set Entry count
        elemEntryCount.textContent = entry_count;
        
        
        // Need to set click listener
        elemAddEntryBtn.onclick = function(){
            // Show Container
            const next_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_ADD_EDIT);
            
            // Push currentPage to NavHistory; 
            // Will also compare current page and  next_page NAV_MENU_GROUP.
            navigation.pushCurrentPageToNavHistory(next_page);
        
            navigation.showThisPage(next_page);
            
            
            
            // Show Page
            const options_sow_boar ={
                is_add:         true,   // false is edit
                sow_boar_type:  showOptions.sow_boar_type, 
                go_back_page:   elemDivContainer,   // Go back to this page
                go_back_page_id: PAGE_ID.SOW_BOAR_LIST
            };
            
            
            // callback on successful add;
            // will redraw table regardless if filtered or not
            const callback = function(new_sow_boar_hid){
                switch (showOptions.sow_boar_type){
                    case SOW_BOAR_TYPE.SOW: {
                        tableSowAll.renderTable(dataSowList);
                        break;
                    }
            
                    case SOW_BOAR_TYPE.BOAR: {
                        tableBoar.renderTable(dataBoarList);
                        break;
                    }
            
                    case SOW_BOAR_TYPE.GILT:{
                        tableGilt.renderTable(dataGiltList);
                        break;
                    }
                    
                }
            };
            

            navigation.pageSowBoarAddEdit.callbackOnSuccessAdd = callback;
            navigation.pageSowBoarAddEdit.show(options_sow_boar);

            
        };
        
        
        // 
        navigation.pageSowBoarEntry.resetToFirstTab();
        
        elemSowControls.style.display = 'none';

    }
    
    
    this.getSowBoarReference = function(sow_boar){
        let sow_reference = '';
        
        // The Sow Boar name and number are shown together.
        if (sow_boar.name  && sow_boar.name.length >0 ){
            sow_reference = `<span class="sow-boar-name">${sow_boar.name}</span>`;
            if (sow_boar.number && sow_boar.name.length >0){
                sow_reference += `<br>${sow_boar.number}`;
            }
        }
        else{
            sow_reference = `<span class="sow-boar-name">${sow_boar.number}</span>`;
        }
        
        return sow_reference;
    }
    
    
    this.getSowBoarAge = function(sow_boar){
        let diff_msecs;
        let diff_days;
        
        let dt_birth = null;
        let s_age = '';
        
        if (sow_boar.date_of_birth != null){
            dt_birth            = new Date(sow_boar.date_of_birth);
        
            diff_msecs          = dtCurrentDate - dt_birth;
            diff_days           = Math.round(diff_msecs / APPLICATION.NUM_MSECS_1DAY);
            
            let num_years       = Math.floor(diff_days / 365);
            let excess_days     = diff_days % 365;
            let num_months      = Math.round(excess_days / 30);
            
            const translations  = navigation.getTranslations();
        
            let label_year      = 'year';
            let label_month     = 'month';
            let label_years     = 'years';
            let label_months    = 'months';
            
            
            
            if (translations){
                if (translations.common_app && translations.common_app.labels){
                    const labels_common = translations.common_app.labels;
                    
                    if (labels_common) {
                        if(labels_common.year)  {label_year   = labels_common.year;}
                        if(labels_common.month) {label_month  = labels_common.month;}
                        if(labels_common.years) {label_years  = labels_common.years;}
                        if(labels_common.months){label_months = labels_common.months;}
                    }
                }
            }
            
            
            
            if (num_months == 12){
                num_years += 1;  num_months = 0;
            }
            
            if (num_years == 0){
                s_age = `${num_months} ${label_months}`;
            }
            else{
                if (num_years == 1){
                    s_age = `${num_years} ${label_year}`;
                } else{
                    s_age = `${num_years} ${label_year}`;
                }
                
                if (num_months  >0){
                    if (num_months == 1){
                        s_age += `, <span class="nowrap">${num_months} ${label_month}</span>`;
                    }
                    else{
                        s_age += `, <span class="nowrap">${num_months} ${label_months}</span>`;
                    }
                }
            }
        }
        
        return s_age;
    }
    
    
    this.onClickDataFilter = function(filter_type){
        
        if (curDataFilter == filter_type){return;}
        
        elemSowControls.style.display = 'none';
        
        
        let sow_status_id = null;
        let filtered_data_list = null;
        
        
        
        switch(filter_type){
            case 'all':{
                elemDateTodayShow.style.display = 'none';
                
                tableSowAll.show();
                tableSowGesta.hide();
                tableSowLacta.hide();
                tableSowWean.hide();
                tableSowOutput.hide();

                
                curDataListView = dataSowList;
                tableSowAll.renderTable(curDataListView);
                break;
            }
            
            case 'gestating':{
                elemDateTodayShow.style.display = 'block';

                
                tableSowAll.hide();
                tableSowGesta.show();
                tableSowLacta.hide();
                tableSowWean.hide();
                tableSowOutput.hide();

                
                sow_status_id = SOW_STATUS.GESTATING;
                const filtered_list = thisObj.filterDataSowList(sow_status_id);
                const sort_key = 'sow_boar.cur_pig_production.birth.date_expected';
                const sorted_list   = sortList(filtered_list, sort_key, 'asc');  
                
                curDataListView = sorted_list;
                tableSowGesta.renderTable(curDataListView);
                break;
            }
            
            case 'lactating':{
                elemDateTodayShow.style.display = 'none';

                
                tableSowAll.hide();
                tableSowGesta.hide();
                tableSowLacta.show();
                tableSowWean.hide();
                tableSowOutput.hide();


                sow_status_id = SOW_STATUS.LACTATING;
                const filtered_list = thisObj.filterDataSowList(sow_status_id);
                const sort_key = 'sow_boar.cur_pig_production.birth.date_actual';
                const sorted_list   = sortList(filtered_list, sort_key, 'asc');  
                
                curDataListView = sorted_list;
                tableSowLacta.renderTable(curDataListView);
                break;
            }
            
            case 'weaning':{
                elemDateTodayShow.style.display = 'none';

                tableSowAll.hide();
                tableSowGesta.hide();
                tableSowLacta.hide();
                tableSowWean.show();
                tableSowOutput.hide();
                
                sow_status_id = SOW_STATUS.WEANING;
                const filtered_list = thisObj.filterDataSowList(sow_status_id);
                const sort_key = 'sow_boar.cur_pig_production.weaning.date_weaning';
                const sorted_list   = sortList(filtered_list, sort_key, 'asc');  
                
                curDataListView = sorted_list;
                tableSowWean.renderTable(curDataListView);
                break;
            }
            
            
        }
        
        curDataFilter = filter_type;
    }
    
    
    this.filterDataSowList = function(sow_status_id){
        let data_filtered = [];
        
        for (const cur_entry of dataSowList){
            let sow_boar = null;
            if ('sow_boar' in cur_entry){
                sow_boar = cur_entry.sow_boar;
            }
            else{
                sow_boar = cur_entry;
            }
            
            if (sow_boar.status_id == sow_status_id){
                data_filtered.push(cur_entry)
            }
            
        }
        
        return data_filtered;
    }
    
    
    this.onClickSowListOutput = function(){
        elemDateTodayShow.style.display = 'none';
        
        tableSowAll.hide();
        tableSowGesta.hide();
        tableSowLacta.hide();
        tableSowWean.hide();
        
        
        
        
        curDataListView         = dataSowList;
        
        // Need to render this back to refresh row count 
        tableSowOutput.renderTable(dataSowList);
        
        tableSowOutput.show();
        
        
        
        
        curDataFilter = 'output';
        
        //elemSowControls.style.display = 'block';
    }
    
   
 
    
    this.addToolTips = function(){
        const with_tooltips  = elemDivContainer.querySelectorAll('[data-bs-toggle="tooltip"]');

        for (const cur_entry of with_tooltips){
            new bootstrap.Tooltip(cur_entry);
        }
    }
    
    
    this.searchSowBoar = function(key){
        let cur_list;
        
        switch (showOptions.sow_boar_type){
            case SOW_BOAR_TYPE.SOW:{
                cur_list = curDataListView;
                
                if (key.length == 0){
                    if (curDataFilter != 'output') {
                        tableSowAll.renderTable(cur_list);
                    }
                    else{

                        cur_list = dataSowList;
                        tableSowOutput.renderTable(cur_list);
                    }
                    return;
                }
                
                break;
            }
            
            case SOW_BOAR_TYPE.BOAR:{
                cur_list = dataBoarList;
                
                if (key.length == 0){
                    tableBoar.renderTable(cur_list);
                    return;
                }
                
                break;
            }
            
            case SOW_BOAR_TYPE.GILT:{
                cur_list = dataGiltList;
                
                if (key.length == 0){
                    tableGilt.renderTable(cur_list);
                    return;
                }
                
                break;
            }
            
            default:{
                cur_list = dataDisposedList;
                
                if (key.length == 0){
                    return;
                }
                
                break;
            }
            
        }
        
        
        
        
        
        
        let upper_key = key.toUpperCase();
        
        let filtered = [];
        
        for (const cur_entry of cur_list){
            const sow_boar_name = cur_entry.sow_boar.name; 
            
            if (sow_boar_name && sow_boar_name.toUpperCase().startsWith(upper_key)){
                filtered.push(cur_entry)
            }
            else{
                const sow_boar_number = cur_entry.sow_boar.number; 
                
                if (sow_boar_number && sow_boar_number.toUpperCase().startsWith(upper_key)){
                    filtered.push(cur_entry)
                }
            }
        }
        
        
        switch (showOptions.sow_boar_type){
            case SOW_BOAR_TYPE.SOW:{
                if (curDataFilter != 'output') {
                    tableSowAll.renderTable(filtered);
                }
                else{
                    tableSowOutput.renderTable(filtered);
                }
                return;
            }
            case SOW_BOAR_TYPE.BOAR:{
                tableBoar.renderTable(filtered);
                return;
            }
            case SOW_BOAR_TYPE.GILT:{
                tableGilt.renderTable(filtered);
                return;
            }
            
            default:{
                    return;
            }
            
        }

        
    }
    
    
    this.setUserLanguage = function(language_key){
        curUserLanguageKey = language_key;
        thisObj.onUserChangeLanguage();
    }
    
    
    this.onUserChangeLanguage = function(){
        
       
    }
         
         
    this.onClickSowBoarEntry = function(sow_boar_hid, pig_prod_id, tab_id, sow_boar_type){
        if (sow_boar_hid == null){
            
            // Go back to this page
            const next_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_LIST);
            
            // Remove NavHistoryHead if same with go_back_page
            navigation.managerNavHistory.removeFromNavHistoryHead(next_page);
            
            
            navigation.showThisPage(next_page);
            
            if (sow_boar_type){
                const options= {
                    sow_boar_type: sow_boar_type
                };
                navigation.pageSowBoarList.show(options);
            }
            
            return;
        }
    
        if (pig_prod_id){
            navigation.onClickProdGestatingEntry(pig_prod_id);
            return;
        }
    
        let cur_sow_boar_list = null;
        
        if (sow_boar_type){}
        else{
            // use showOptions.sow_boar_type if sow_boar_type is not specified
            sow_boar_type = showOptions.sow_boar_type;
        }
        
        switch (sow_boar_type){
            case SOW_BOAR_TYPE.SOW:  {cur_sow_boar_list = dataSowList; break;}
            case SOW_BOAR_TYPE.BOAR: {cur_sow_boar_list = dataBoarList; break;}
            case SOW_BOAR_TYPE.GILT: {cur_sow_boar_list = dataGiltList; break;}
            
            case SOW_BOAR_TYPE.DISPOSED: {cur_sow_boar_list = dataDisposedList; break;}
        }
        
        this.gotoSowBoarEntryPage(cur_sow_boar_list, sow_boar_hid, 
            sow_boar_type, tab_id); 
    }
        
        
    this.gotoSowBoarEntryPage = function(sow_boar_list, sow_boar_hid, 
            sow_boar_type, tab_id){
        
        let prev_sow_boar_hid = null;
        let next_sow_boar_hid = null;
        
        let index;
        let cur_entry   = null;
        let prev_entry  = null;
        let next_entry  = null;
        
        if (sow_boar_list == null){
            sow_boar_list = navigation.pigFarm.managerSowBoar.dataSowList;
            sow_boar_type = SOW_BOAR_TYPE.SOW;
            
            
            // Use default show options
            showOptions = {
                sow_boar_type: sow_boar_type
            }
        }
        
        for (index = 0; index< sow_boar_list.length; index++){
            cur_entry = sow_boar_list[index];
            
            if (cur_entry.sow_boar.hid == sow_boar_hid){
                // Show Container
                const next_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_ENTRY);
                
                // Push currentPage to NavHistory; 
                // Will also compare current page and  next_page NAV_MENU_GROUP.
                navigation.pushCurrentPageToNavHistory(next_page);
                
                
                navigation.showThisPage(next_page);
                
        
                // Show Page
                if ((index-1) >=0){
                    prev_entry = sow_boar_list[index-1];
                    prev_sow_boar_hid = prev_entry.sow_boar.hid;
                }
                
                if ((index+1) < sow_boar_list.length){
                    next_entry = sow_boar_list[index+1];
                    next_sow_boar_hid = next_entry.sow_boar.hid;
                }
                
                const options = {
                    sow_boar_type:      sow_boar_type,
                    prev_sow_boar_hid:  prev_sow_boar_hid,
                    next_sow_boar_hid:  next_sow_boar_hid,
                    sow_boar_list:      sow_boar_list,
                    data_index:         index+1,
                    total_entries:      sow_boar_list.length
                };
                
                if (tab_id){
                    options.tab_id = tab_id;
                }
                
                navigation.pageSowBoarEntry.show(cur_entry, options);
                return;
            }

        }
        

        
        const next_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_ENTRY);
        navigation.showThisPage(next_page)

    }

}
