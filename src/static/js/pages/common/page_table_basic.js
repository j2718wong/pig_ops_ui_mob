// Jnauary 12, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {APPLICATION}            from '../../constants.js';

import {createPaginationManager} from '../../utils.js';




export function PageTableBasic(){
    
    const thisObj               = this;
    
    this.NUM_MSECS_1DAY         = 1000 * 60 * 60 * 24;
    
    let TABLE_ROW_PER_PAGE      = APPLICATION.MOBILE_TABLE_ROW_PER_PAGE;
    
    /*
    Typical input_settings
    {
        uniqueKey:              'sow-boar-medvac'
    }   
    */  
    let settings                = null;
    
    
    let elemIdTableContainer    = null;
    let elemIdTableTitle        = null;
    let elemIdTableEntryCount   = null;
    let elemIdTableInfo         = null;
    
    let elemIdSeachAddControl   = null;
    let elemIdSearchInput       = null;
    let elemIdAddEntryBtn       = null;
    let elemIdFilterControls    = null;
    
    let elemIdServerErrorMsg    = null;
    
    let elemIdControlsBar       = null;
    
    let elemIdTableRowCount     = null;
    let elemIdTablePagination   = null;
    let elemIdTablePrevPage     = null;
    let elemIdTableCurPage      = null;
    let elemIdTableTotalPages   = null;
    let elemIdTableNextPage     = null;
    
    let elemIdAddTextLinkShow   = null;
    let elemIdAddTextLink       = null;
    
    let elemIdTableContent      = null;
    

    let elemTableContainer      = null
    let elemTableTitle          = null;
    let elemTableEntryCount     = null;
    let elemTableInfo           = null;

    let elemSeachAddControl     = null;
    let elemSearchInput         = null;
    let elemAddEntryBtn         = null;
    let elemFilterControls      = null;
    
    this.elemServerErrorMsg     = null;
    
    let elemControlsBar         = null;
    
    let elemTableRowCount       = null;
    let elemTablePagination     = null;
    let elemTablePrevPage       = null;
    let elemTableCurPage        = null;
    let elemTableTotalPages     = null;
    let elemTableNextPage       = null;
    
    let elemAddTextLinkShow     = null;
    let elemAddTextLink         = null;
    
    this.elemTableContent       = null;
   
    
    
    let dataEntryList           = null;
    
    let curDataView             = null;
    


    //let textTranslation         = new TextTranslation();
    let curUserLanguageKey      = 'en';


    
    let dtCurrentDate           = null;
    
    this.init = function(){
        //textTranslation.setTranslations(TRANSLATION_PAGE_ACC_PIG_OPS);
        
        this.render();
        this.afterHtmlRender();
        
        
    }
    
    
    /*
    settings = {
        uniqueKey:      `parent-trace-sow-boar-table`,
        noHeader:       false,
        noSearchAdd:    true,
        noControlsBar:  false,
        itemsPerPage:   20,
        tableTitle:     'Sow List',
        
        addEntryLink: {
            label:      'Add Item',
            onclickAddEntry:    function
        }
    }
    */
    this.setSettingsTable = function(input_settings){
        settings = input_settings;
    }
    
    
    this.getHtml = function(){
     
        elemIdTableContainer    = `${settings.uniqueKey}-table-container`;
     
        elemIdTableTitle        = `${settings.uniqueKey}-table-title`;
        elemIdTableEntryCount   = `${settings.uniqueKey}-table-entry-count`;
        elemIdTableInfo         = `${settings.uniqueKey}-table-info`;
        
        elemIdSeachAddControl   = `${settings.uniqueKey}-search-add-control`;
        elemIdSearchInput       = `${settings.uniqueKey}-mobile-search-input`;
        elemIdAddEntryBtn       = `${settings.uniqueKey}-mobile-add-entry-btn`;
        elemIdFilterControls    = `${settings.uniqueKey}-mobile-filter-control`;
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        elemIdControlsBar       = `${settings.uniqueKey}-controls-bar`;
        
        elemIdTableRowCount     = `${settings.uniqueKey}-row-count`;
        elemIdTablePagination   = `${settings.uniqueKey}-pagination`;
        elemIdTablePrevPage     = `${settings.uniqueKey}-prev-page`;
        elemIdTableCurPage      = `${settings.uniqueKey}-cur-page`;
        elemIdTableTotalPages   = `${settings.uniqueKey}-total-pages`;
        elemIdTableNextPage     = `${settings.uniqueKey}-next-page`;
        
        
        elemIdAddTextLinkShow   = `${settings.uniqueKey}-add-entry-link-show`;
        elemIdAddTextLink       = `${settings.uniqueKey}-add-entry-link`;
        
        elemIdTableContent      = `${settings.uniqueKey}-table-content`;

        let htm_header = `
        <h2>
            <span class="nav-title blue" id="${elemIdTableEntryCount}">8</span>
            <span class="nav-title blue" id="${elemIdTableTitle}">${settings.tableTitle}</span>
        </h2>
        `;
        
        if (settings.noHeader){
            htm_header = '';
        }
        
        
        
        let html_search_add     = `
        <div class="mobile-controls" id="${elemIdSeachAddControl}">
            <div class="search-container">
                <i class="fas fa-search search-icon"></i>
                <input type="text" class="search-input" id=${elemIdSearchInput} placeholder="Search">
            </div>
            <button class="btn-add-entry" id="${elemIdAddEntryBtn}">
                <i class="fas fa-plus"></i>
                Add Entry
            </button>
        </div>
        `;
        
        if (settings.noSearchAdd){
            html_search_add = '';
        }
        
        
        let html_controls_bar = `
        <div class="controls-bar" id="${elemIdControlsBar}">
            <div class="entry-count" id="${elemIdTableRowCount}">
                12 Entries
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
        `;
        
        if (settings.noControlsBar){
            html_controls_bar = '';
        }
        
        let html_add_entry_link = '';
        if (settings.addEntryLink){
            html_add_entry_link =`
            <div id ="${elemIdAddTextLinkShow}">
                <a href="javascript:void(0)" class="text-link" id ="${elemIdAddTextLink}">
                    ${settings.addEntryLink.label}
                </a>
            </div>
            `;
            
        }
        
        
        
        let html_table = '';
        
        if (thisObj.getHtmlTableHeader){
            html_table = thisObj.getHtmlTableHeader();
        }
           
        const html = `

        
<div class="mobile-container" id="${elemIdTableContainer}">

    ${htm_header}
    
    
    <div class="mobile-info-box hidden" >
        <div class="info-text" id="${elemIdTableInfo}">
        </div>
    </div>
    
    
    <div>
        <!-- Search and Add Entry Controls -->
        ${html_search_add}
    
    
        <div id="${elemIdServerErrorMsg}"></div>
    
        
        <!-- Controls Bar -->
        ${html_controls_bar}
    
        <!-- Add entry Link instead of button -->
        ${html_add_entry_link}
        

        <div id="${elemIdTableContent}">
            ${html_table}
        <div>
        
    </div>
    
    
</div>
        `;
        
        return html;
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemTableContainer      = document.getElementById(elemTableContainer);
        
        elemTableTitle          = document.getElementById(elemIdTableTitle);
        elemTableEntryCount     = document.getElementById(elemIdTableEntryCount);
        elemTableInfo           = document.getElementById(elemIdTableInfo);

        elemSeachAddControl     = document.getElementById(elemIdSeachAddControl);
        elemSearchInput         = document.getElementById(elemIdSearchInput);
        elemAddEntryBtn         = document.getElementById(elemIdAddEntryBtn);
        elemFilterControls      = document.getElementById(elemIdFilterControls);
        
        thisObj.elemServerErrorMsg  = document.getElementById(elemIdServerErrorMsg);
        
        elemControlsBar         = document.getElementById(elemIdControlsBar);
        
        elemTableRowCount       = document.getElementById(elemIdTableRowCount);
        elemTablePagination     = document.getElementById(elemIdTablePagination);
        elemTablePrevPage       = document.getElementById(elemIdTablePrevPage);
        elemTableCurPage        = document.getElementById(elemIdTableCurPage);
        elemTableTotalPages     = document.getElementById(elemIdTableTotalPages);
        elemTableNextPage       = document.getElementById(elemIdTableNextPage);
        
        
        elemAddTextLinkShow     = document.getElementById(elemIdAddTextLink);
        elemAddTextLink         = document.getElementById(elemIdAddTextLink);
        
        thisObj.elemIdTableContent  = document.getElementById(elemIdTableContent);
             
    }
    
    
    this._processAfterHtmlRender = function(){
        this.handleWindowResize();
    }
    
    
    this._bindEventListeners = function(){
        
        if ('noSearchAdd' in settings){}
        else{
            elemSearchInput.addEventListener('input', function() {
                const search_term = this.value.toUpperCase().trim();
                const filtered_entries = thisObj.searchEntries(search_term);
                thisObj.renderTable(filtered_entries);
            });
        }
        
        if ('addEntryLink' in settings){
            elemAddTextLink.addEventListener('click', function() {
                settings.addEntryLink.onclickAddEntry();
            });
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
    
    
    this.setOnClickAddEntry = function(callback){
        if ('noSearchAdd' in settings){}
        else{
            elemAddEntryBtn.addEventListener('click', function() {
                callback();
            });
        }
    }
    
    
    this.setDataEntryList = function(data_entry_list){
        dataEntryList = data_entry_list;    
        
        if (elemTableEntryCount){
            elemTableEntryCount.textContent = dataEntryList.length;
        }
    }
    
        
    this.renderTable = function(entry_list){
        curDataView = entry_list;
        
        let items_per_page = TABLE_ROW_PER_PAGE;
        if (settings.itemsPerPage){
            items_per_page = settings.itemsPerPage;
        }
        
        
        const config = {
            elemPagination:     elemTablePagination,
            elemTableBody:      thisObj.getElemTableBody(),
            elemEntryCount:     elemTableRowCount,
            elemCurrentPage:    elemTableCurPage,
            elemTotalPages:     elemTableTotalPages,
            elemPrevPageBtn:    elemTablePrevPage,
            elemNextPageBtn:    elemTableNextPage,
            data:               curDataView,
            itemsPerPage:       items_per_page,
            renderRow:          thisObj.getHtmlTableRow,
            renderRowEmpty:     thisObj.getHtmlTableRowEmpty,
            getRowDataHid:      thisObj.getRowDataHid,
            getRowElement:      thisObj.getElemTableRow
        }; 
        
        const paginationManager = new createPaginationManager(config); 
        paginationManager.init();
        
        
        if (settings.noControlsBar && settings.noControlsBar == true){}
        else{
            // One event handler at a time
            config.elemPrevPageBtn.onclick = function(){
                paginationManager.goToPrevPage();
            }
            
            // One event handler at a time
            config.elemNextPageBtn.onclick = function(){
                paginationManager.goToNextPage();
            }
        }
    }
    
    
    this.addTextLinkShow = function(){
        elemAddTextLinkShow.style.display = 'block';
    }
    
    
    this.addTextLinkHide = function(){
        elemAddTextLinkShow.style.display = 'none';
    }
    
    
    this.getElemSearchAddControl = function(){
        return elemSeachAddControl;
    }
    
    
    this.getElemSearchInput = function(){
        return elemSearchInput;
    }
    
    
    this.getElemTableTitle = function(){
        return elemTableTitle;
    } 
    
    
    this.getElemControlsBar = function(){
        return elemControlsBar;
    }
    
    
    this.getElemTableEntryCount = function(){
        return elemTableEntryCount;
    } 
    
    
    this.getElemTableContainer = function(){
        return elemTableContainer;
    }
    
    
    this.getElemTableContent = function(){
        return elemTableContent;
    }
    
    
    // Need to overwrite
    this.getHtmlTableRowEmpty = function(){
        const html = ``;
        return html;
    }
    
    
    // Need to overwrite; This will be checked first if exists.
    this.getElemTableRow = function(cur_entry){
        return null;
    }
    
    
    // Need to overwrite; if this.getElemTableRow is null, then this will executed.
    this.getHtmlTableRow = function(cur_entry){
        const html = ``;
        return html;
    }
    
    
    // Need to overwrite
    this.getRowDataHid = function(cur_entry){
        return null;
    }
    
    
    
    this.attachClickListenerToEachRow = function(){
        const elem_tbody = thisObj.getElemTableBody();
        
        if (elem_tbody){
            const table_rows = elem_tbody.querySelectorAll('tr');
            
            for (const cur_row of table_rows){
                
            
            } 
            
        }
        
    }
    
    
    this.addToolTips = function(){
        const with_tooltips  = elemDivContainer.querySelectorAll('[data-bs-toggle="tooltip"]');

        for (const cur_entry of with_tooltips){
            new bootstrap.Tooltip(cur_entry);
        }
    }
    
    
    // This should be overrridden
    this.searchEntries = function(key){
        return [];
    }
    
    
    this.setUserLanguage = function(language_key){
        curUserLanguageKey = language_key;
        thisObj.onUserChangeLanguage();
    }
    
    
    this.onUserChangeLanguage = function(){
        
       
    }
    
}
