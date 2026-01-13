// Jnauary 12, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {APPLICATION}            from '../../constants.js';

import {createPaginationManager} from '../../utils.js';




export function PageTableBasic(){
    
    const thisObj               = this;
    
    const NUM_MSECS_1DAY        = 1000 * 60 * 60 * 24;
    
    let TABLE_ROW_PER_PAGE      = APPLICATION.MOBILE_TABLE_ROW_PER_PAGE;
    
    /*
    Typical input_settings
    {
        uniqueKey:              'sow-boar-medvac'
    }   
    */  
    let settings                = null;
    
    
   
    let elemIdTableTitle        = null;
    let elemIdTableEntryCount   = null;
    let elemIdTableInfo         = null;
    
    let elemIdSearchInput       = null;
    let elemIdAddEntryBtn       = null;
    let elemIdFilterControls    = null;
    
    let elemIdServerErrorMsg    = null;
    
    
    let elemIdTableRowCount     = null;
    let elemIdTablePagination   = null;
    let elemIdTablePrevPage     = null;
    let elemIdTableCurPage      = null;
    let elemIdTableTotalPages   = null;
    let elemIdTableNextPage     = null;
    
    let elemIdTableContent      = null;
    

    let elemTableTitle          = null;
    let elemTableEntryCount     = null;
    let elemTableInfo           = null;

    let elemSearchInput         = null;
    let elemAddEntryBtn         = null;
    let elemFilterControls      = null;
    
    this.elemServerErrorMsg     = null;
    
    
    let elemTableRowCount       = null;
    let elemTablePagination     = null;
    let elemTablePrevPage       = null;
    let elemTableCurPage        = null;
    let elemTableTotalPages     = null;
    let elemTableNextPage       = null;
    
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
    
    
    this.setSettings = function(input_settings){
        settings = input_settings;
    }
    
    
    this.getHtml = function(){
     
        elemIdTableTitle        = `${settings.uniqueKey}-table-title`;
        elemIdTableEntryCount   = `${settings.uniqueKey}-table-entry-count`;
        elemIdTableInfo         = `${settings.uniqueKey}-table-info`;
        
        elemIdSearchInput       = `${settings.uniqueKey}-mobile-search-input`;
        elemIdAddEntryBtn       = `${settings.uniqueKey}-mobile-add-entry-btn`;
        elemIdFilterControls    = `${settings.uniqueKey}-mobile-filter-control`;
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        elemIdTableRowCount     = `${settings.uniqueKey}-row-count`;
        elemIdTablePagination   = `${settings.uniqueKey}-pagination`;
        elemIdTablePrevPage     = `${settings.uniqueKey}-prev-page`;
        elemIdTableCurPage      = `${settings.uniqueKey}-cur-page`;
        elemIdTableTotalPages   = `${settings.uniqueKey}-total-pages`;
        elemIdTableNextPage     = `${settings.uniqueKey}-next-page`;
        
        elemIdTableContent      = `${settings.uniqueKey}-table-content`;
           
        
        const html_table = thisObj.getHtmlTableHeader();
           
           
        const html = `

        
<div class="mobile-container">

    <h2>
        <span class="nav-title blue" id="${elemIdTableEntryCount}">8</span>
        <span class="nav-title blue" id="${elemIdTableTitle}">${settings.tableTitle}</span>
    </h2>

    <div class="mobile-info-box hidden" >
        <div class="info-text" id="${elemIdTableInfo}">
        </div>
    </div>
    
    
    <div>
        <!-- Search and Add Entry Controls -->
        <div class="mobile-controls">
            <div class="search-container">
                <i class="fas fa-search search-icon"></i>
                <input type="text" class="search-input" id=${elemIdSearchInput} placeholder="Search">
            </div>
            <button class="btn-add-entry" id="${elemIdAddEntryBtn}">
                <i class="fas fa-plus"></i>
                Add Entry
            </button>
        </div>
		
	
    
        <div id="${elemIdServerErrorMsg}"></div>
    
        
        <!-- Controls Bar -->
        <div class="controls-bar">
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
        
        elemTableTitle          = document.getElementById(elemIdTableTitle);
        elemTableEntryCount     = document.getElementById(elemIdTableEntryCount);
        elemTableInfo           = document.getElementById(elemIdTableInfo);

        elemSearchInput         = document.getElementById(elemIdSearchInput);
        elemAddEntryBtn         = document.getElementById(elemIdAddEntryBtn);
        elemFilterControls      = document.getElementById(elemIdFilterControls);
        
        thisObj.elemServerErrorMsg  = document.getElementById(elemIdServerErrorMsg);
        
        
        elemTableRowCount       = document.getElementById(elemIdTableRowCount);
        elemTablePagination     = document.getElementById(elemIdTablePagination);
        elemTablePrevPage       = document.getElementById(elemIdTablePrevPage);
        elemTableCurPage        = document.getElementById(elemIdTableCurPage);
        elemTableTotalPages     = document.getElementById(elemIdTableTotalPages);
        elemTableNextPage       = document.getElementById(elemIdTableNextPage);
        
        thisObj.elemIdTableContent  = document.getElementById(elemIdTableContent);
             
    }
    
    
    this._processAfterHtmlRender = function(){
        this.handleWindowResize();
    }
    
    
    this._bindEventListeners = function(){
        
        elemSearchInput.addEventListener('input', function() {
            const search_term = this.value.toUpperCase().trim();
            thisObj.searchEntry(search_term);
            
        });
        
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
		
		
		elemAddEntryBtn.addEventListener('click', function() {
            callback();
        });
	}
	
    
    this.setDataEntryList = function(data_entry_list){
        dataEntryList = data_entry_list;    
        console.log('PageTableBasic');
        console.log('dataEntryList.length = ' + dataEntryList.length)
        
        elemTableEntryCount.textContent = dataEntryList.length;
    }
    
        
    this.renderTable = function(entry_list){
        curDataView = entry_list;

        const config = {
            elemPagination:     elemTablePagination,
            elemTableBody:      thisObj.getElemTableBody(),
            elemEntryCount:     elemTableRowCount,
            elemCurrentPage:    elemTableCurPage,
            elemTotalPages:     elemTableTotalPages,
            elemPrevPageBtn:    elemTablePrevPage,
            elemNextPageBtn:    elemTableNextPage,
            data:               curDataView,
            itemsPerPage:       TABLE_ROW_PER_PAGE,
            renderRow:          thisObj.getHtmlTableRow,
            renderRowEmpty:     thisObj.getHtmlTableRowEmpty
        } 
        
        const paginationManager = new createPaginationManager(config); 
        paginationManager.init();
        
        
        
    }
    
    
    // Need to overwrite
    this.getHtmlTableRowEmpty = function(){
        const html = ``;
        return html;
    }
    
    
    // Need to overwrite
    this.getHtmlTableRow = function(cur_entry){
        const html = ``;
        return html;
    }
    

    this.addToolTips = function(){
        const with_tooltips  = elemDivContainer.querySelectorAll('[data-bs-toggle="tooltip"]');
        console.log('with_tooltips='+with_tooltips.length);
        for (const cur_entry of with_tooltips){
            new bootstrap.Tooltip(cur_entry);
        }
    }
    
    
    this.searchEntry = function(key){
        
    }
    
    
    this.setUserLanguage = function(language_key){
        curUserLanguageKey = language_key;
        thisObj.onUserChangeLanguage();
    }
    
    
    this.onUserChangeLanguage = function(){
        
       
    }
    
}