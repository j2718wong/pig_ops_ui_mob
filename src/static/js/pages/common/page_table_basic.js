// page_table_basic.js

// January 12, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../common/page_view_basic.js';

import {APPLICATION,
        TRANSLATION_MODE}       from '../../constants.js';
        

import {createPaginationManager} from '../../utils.js';


export const DEFAULT_NO_ENTRIES_TABLE = ['No Entries', 'No Data', 'Nothing in here', 'Try Add Entry'];


export function CachedDataSource(){
    PageViewBasic.call(this);

    // This will load cache but will not request new data , will not display data
    this.loadCachedDataOnly = function(){
        // Load cached data 
        const key = this.getStorageKey();
        const cached = localStorage.getItem(key);
        
        if (cached){
            const data = JSON.parse(cached);
            
            // Update data source
            this.updateDataSource(data.data, data.ver_num);
        }
    }

    
    // This will load cache and display data
    this.loadCachedData = function(pig_farm_hid){
            
        // Load cached data 
        const key = this.getStorageKey();
        const cached = localStorage.getItem(key);
        if (!cached) {
            this.requestServerData();
            return;
        }
        
        
        const data = JSON.parse(cached);
        
        // Check if pig_farm_hid matched
        const cached_pig_farm_hid = data.pig_farm_hid;
        if (cached_pig_farm_hid != pig_farm_hid){
            this.requestServerData();
            return;
        }
        
        
        // Optionally expire cache after 7 days
        if (data.cached_at && (Date.now() - data.cached_at) > APPLICATION.NUM_MSECS_CACHE_DATA) {
            // Cache too old, fetch fresh
            this.requestServerData();
            return;
        }
        
        
        // Update data source
        this.updateDataSource(data.data, data.ver_num);
        
        
        // Display Data
        this.displayData();
        
        
        // Check server data update
        this.checkServerDataUpdate();
    
    }
    
    
    // Must be overriden; It should return the key string saved in localStorage.
    this.getStorageKey = function(){return null;}
 
    
    // Must be overriden;
    this.requestServerData = function(){}
    
    
    // Must be overriden;
    this.updateDataSource = function(){}
    
    
    // Must be overriden;
    this.displayData = function(){}
    
    
    // Must be overriden;
    this.checkServerDataUpdate = function(){}
    
}



export function PageTableBasic(){
    CachedDataSource.call(this);
    
    const thisObj               = this;
    
    
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
    
    let elemIdSearchAddControl  = null;
    let elemIdSearchInput       = null;
    let elemIdAddEntryBtn       = null;
    let elemIdFilterControls    = null;
    
    let elemIdServerErrorMsg    = null;
    
    let elemIdControlsBar       = null;
    
    let elemIdRefreshData       = null;
    
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

    let elemSearchAddControl    = null;
    let elemSearchInput         = null;
    let elemAddEntryBtn         = null;
    let elemFilterControls      = null;
    
    this.elemServerErrorMsg     = null;
    
    let elemControlsBar         = null;
    
    let elemRefreshData         = null;
    
    let elemTableRowCount       = null;
    let elemTablePagination     = null;
    let elemTablePrevPage       = null;
    let elemTableCurPage        = null;
    let elemTableTotalPages     = null;
    let elemTableNextPage       = null;
    
    let elemAddTextLinkShow     = null;
    let elemAddTextLink         = null;

    
    let dataEntryList           = null;
    
    let curDataView             = null;
    
    
    let dtCurrentDate           = null;
    
    
    
    this.init = function(){
        
        this.render();
        this.afterHtmlRender();
        
    }
    
    
    /*
    settings = {
        uniqueKey:      `parent-trace-sow-boar-table`,
        noHeader:       false,
        noSearchAdd:    false,
        noAddButton:    true,
        noRowCount:     false,
        itemsPerPage:   20,
        tableTitle:     'Sow List',
        
        extraHtml:      null,
        
        addEntryLink: {
            label:      'Add Item',
            onclickAddEntry:    function
        },
        
        refreshFunc:    null
    }
    */
    this.setSettingsTable = function(input_settings){
        settings = input_settings;
        
        if (input_settings.navigation){
            thisObj.setNavigation(input_settings.navigation);
        }
    }
    
    
    this.moneyFormatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
    
    
    this.getHtml = function(){
     
        elemIdTableContainer    = `${settings.uniqueKey}-table-container`;
     
        elemIdTableTitle        = `${settings.uniqueKey}-table-title`;
        elemIdTableEntryCount   = `${settings.uniqueKey}-table-entry-count`;
        elemIdTableInfo         = `${settings.uniqueKey}-table-info`;
        
        elemIdSearchAddControl  = `${settings.uniqueKey}-search-add-control`;
        elemIdSearchInput       = `${settings.uniqueKey}-mobile-search-input`;
        elemIdAddEntryBtn       = `${settings.uniqueKey}-mobile-add-entry-btn`;
        elemIdFilterControls    = `${settings.uniqueKey}-mobile-filter-control`;
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        elemIdControlsBar       = `${settings.uniqueKey}-controls-bar`;
        
        elemIdRefreshData       = `${settings.uniqueKey}-refresh-data`;
        
        elemIdTableRowCount     = `${settings.uniqueKey}-row-count`;
        elemIdTablePagination   = `${settings.uniqueKey}-pagination`;
        elemIdTablePrevPage     = `${settings.uniqueKey}-prev-page`;
        elemIdTableCurPage      = `${settings.uniqueKey}-cur-page`;
        elemIdTableTotalPages   = `${settings.uniqueKey}-total-pages`;
        elemIdTableNextPage     = `${settings.uniqueKey}-next-page`;
        
        elemIdAddTextLinkShow   = `${settings.uniqueKey}-add-entry-link-show`;
        elemIdAddTextLink       = `${settings.uniqueKey}-add-entry-link`;
        
        elemIdTableContent      = `${settings.uniqueKey}-table-content`;

        
        let label_add_entry     = 'Add Entry';
        let label_search        = 'Search';
        

        if (thisObj.navigation){
            const helper = thisObj.navigation.managerTranslations.translationHelper;
            
            label_add_entry     = helper.getSimpleTranslation('common.labels.add_entry') || label_add_entry;
            label_search        = helper.getSimpleTranslation('common.labels.search') || label_search;
        }
        

        let html_header = `
        <h2>
            <span class="nav-title blue" id="${elemIdTableEntryCount}"></span>
            <span class="nav-title blue" id="${elemIdTableTitle}">${settings.tableTitle}</span>
        </h2>
        `;
        
        if (settings.noHeader){
            html_header = '';
        }
        
        
        let html_add_button = `
            <button class="btn-add-entry" id="${elemIdAddEntryBtn}">
                <i class="fas fa-plus"></i>
                ${label_add_entry}
            </button>
        `;
        
        if (settings.noAddButton){
            html_add_button = '';
        }
         
        
        
        let html_search_add     = `
        <div class="mobile-controls" id="${elemIdSearchAddControl}">
            <div class="search-container">
                <i class="fas fa-search search-icon"></i>
                <input type="text" class="search-input" id=${elemIdSearchInput} placeholder="${label_search}">
            </div>
            ${html_add_button}
        </div>
        `;
        
        if (settings.noSearchAdd){
            html_search_add = '';
        }
        
        let html_hide_row_count = '';
        if (settings.noRowCount){
            html_hide_row_count = 'style="display:none;"'
        }
        
        let html_refresh = '';
        if (settings.refreshFunc){
            html_refresh = `<span id="${elemIdRefreshData}" style="cursor: pointer; color: var(--icon-blue);"><i class="fas fa-sync-alt"></i></span>`;
        }
        
        
        let html_controls_bar = `
        <div class="controls-bar" id="${elemIdControlsBar}">
            <div class="entry-count">
                <span id="${elemIdTableRowCount}" ${html_hide_row_count}>
                    0 Entries
                </span>
                
                ${html_refresh}
                
            </div>
            
            
            <!--The pagination controls is hidden until row_count > settings.itemsPerPage --> 
            <div class="pagination-controls" id="${elemIdTablePagination}">
                <button class="pagination-btn" id="${elemIdTablePrevPage}" disabled>
                    <i class="fas fa-chevron-left"></i>
                </button>
                <span class="page-indicator">
                    <span id="${elemIdTableCurPage}">1</span> / <span id="${elemIdTableTotalPages}">0</span>
                </span>
                <button class="pagination-btn" id="${elemIdTableNextPage}">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
        `;
        
        
        let html_extra_html = '';
        if (settings.extraHtml){
            html_extra_html = `
            <div>${settings.extraHtml}</div>
            `;
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

    ${html_header}
    
    
    <div class="mobile-info-box hidden" >
        <div class="info-text" id="${elemIdTableInfo}">
        </div>
    </div>
    
    
    <div>
        <!-- Search and Add Entry Controls -->
        ${html_search_add}
    
    
        <div id="${elemIdServerErrorMsg}"></div>
    
        <!-- Extra HTML for anything to add before the table -->
        ${html_extra_html}
        
        <!-- Add entry Link instead of button -->
        ${html_add_entry_link}
    
        
        <!-- Controls Bar -->
        ${html_controls_bar}
    

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
        elemTableContainer      = document.getElementById(elemIdTableContainer);
        
        elemTableTitle          = document.getElementById(elemIdTableTitle);
        elemTableEntryCount     = document.getElementById(elemIdTableEntryCount);
        elemTableInfo           = document.getElementById(elemIdTableInfo);

        elemSearchAddControl    = document.getElementById(elemIdSearchAddControl);
        elemSearchInput         = document.getElementById(elemIdSearchInput);
        elemAddEntryBtn         = document.getElementById(elemIdAddEntryBtn);
        elemFilterControls      = document.getElementById(elemIdFilterControls);
        
        thisObj.elemServerErrorMsg  = document.getElementById(elemIdServerErrorMsg);
        
        elemControlsBar         = document.getElementById(elemIdControlsBar);
        
        elemRefreshData         = document.getElementById(elemIdRefreshData);
        
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

    }
    
    
    this._bindEventListeners = function(){
        
        if (settings.noSearchAdd){}
        else{
            elemSearchInput.addEventListener('input', function() {
                const search_term = this.value.toUpperCase().trim();
                const filtered_entries = thisObj.searchEntries(search_term);
                thisObj.renderTable(filtered_entries);
            });
            
            if (settings.noAddButton){}
            else{
                elemAddEntryBtn.addEventListener('click', function() {
                    thisObj.showAddEntryPage();
                });
            }
            
        }
        
        if (settings.addEntryLink){
            elemAddTextLink.addEventListener('click', function() {
                settings.addEntryLink.onclickAddEntry();
            });
        }
        
        
        if (settings.refreshFunc){
            elemRefreshData.addEventListener('click', function() {
                settings.refreshFunc();
            });
        }
    }
    
    
    this.setOnClickAddEntry = function(callback){
        if (settings.noSearchAdd){}
        else{
            if (settings.noAddButton){}
            else{
                elemAddEntryBtn.addEventListener('click', function() {
                    callback();
                });
            }
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
            navigation:         thisObj.navigation,
            
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
        
        
        
        // One event handler at a time
        if (config.elemPrevPageBtn){
            config.elemPrevPageBtn.onclick = function(){
                paginationManager.goToPrevPage();
            }
        }
        
        // One event handler at a time
        if (config.elemNextPageBtn){
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
        return elemSearchAddControl;
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
    
    
    // Need to overwrite
    this.getElemTableBody = function(){
        return null;
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
    

    
    this.writeLabelNoEntries = function(){
        // If language is default or english, the label_no_entries is a 
        // random entry from DEFAULT_NO_ENTRIES_TABLE
        
        // If PH dialects, it should start with 'No Entries';
        // + local variation of 'No Entries'  translation.
        // Or much better tehre is a flag that can switched to and 
        // English 'No Entries; ' + local variation 
        
        // If non-PH dialects, it should be a random entry from translated
        // 'No Entries'  translation
        
        
        // TODO get a random entry from DEFAULT_NO_ENTRIES_TABLE
        let label_no_entries = 'No Entries';
        
        
        if(thisObj.navigation){
            const manager_translations = thisObj.navigation.managerTranslations; 
            const helper = manager_translations.translationHelper;

            const term_path = 'common.labels.no_entries';
            label_no_entries = helper.getTranslatedText(term_path, 
                DEFAULT_NO_ENTRIES_TABLE);
        }
        
        return label_no_entries;
    }
    
    
    // Must be overridden
    this.getPageIdAddEditPage = function(){return null;}
    
    
    // Must be overridden
    this.getPageIdListPage = function(){return null;}
    
    
    // Must be overridden
    // Should return a reference to a function that has this signature:
    // func_name(options, row_entry);
    this.getFuncAddEditShowPage = function(){return null;}
    
    
    // Optional: return hash route for add/edit page
    this.getHashRouteAddEditPage = function(){return null;}
    
    
    // Optional: return hash route for list page
    this.getHashRouteListPage = function(){return null;}
    
    
    // Return row_entry hash_id; must be overridden
    this.getRowEntryHashId = function(row_entry){return null;}
    
    
    this.showAddEntryPage = function(){
        const func_show_page = thisObj.getFuncAddEditShowPage();
        if (!func_show_page){return;}
        
        // Show Container
        const next_page_id  = thisObj.getPageIdAddEditPage();
        const next_page     = thisObj.navigation.getPageContainer(next_page_id);
        
        const next_page_hash = thisObj.getHashRouteAddEditPage();
        
        // Manual navigation history
        if (!next_page_hash){
            // Push currentPage to NavHistory; 
            // Will also compare current page and  next_page NAV_MENU_GROUP.
            thisObj.navigation.pushCurrentPageToNavHistory(next_page);
            
            thisObj.navigation.showThisPage(next_page);
        }
        
        
        // Show Page
        if (next_page_hash){
            const go_back_page_hash = thisObj.getHashRouteListPage();
            
            // This should not contain any DOM elements
            const options_hash_route_data = {
                is_add:         true      
            };
 
            
            // Use hash navigation instead of manual history
            thisObj.navigation.hashRouter.navigate(next_page_hash, {
                pageId:         next_page_id,
                isAdd:          true,
                options:        options_hash_route_data,
                returnRoute:    go_back_page_hash
            });
        }
        
        
        const options = {
            is_add:             true   // false is edit
        };
        
        func_show_page(options);
    }
    
    
    this.showEditEntryPage = function(row_entry){
        const func_show_page = thisObj.getFuncAddEditShowPage();
        if (!func_show_page){return;}
        
        // Show container
        const next_page_id  = thisObj.getPageIdAddEditPage();
        const next_page     = thisObj.navigation.getPageContainer(next_page_id);
        
        const next_page_hash = thisObj.getHashRouteAddEditPage();
        
        
        // Manual navigation history
        if (!next_page_hash){
            // Push currentPage to NavHistory; 
            // Will also compare current page and  next_page NAV_MENU_GROUP.
            thisObj.navigation.pushCurrentPageToNavHistory(next_page);
            
            thisObj.navigation.showThisPage(next_page);
        }
        
        
        // Show Page
        const row_entry_hid = thisObj.getRowEntryHashId(row_entry);
        
        if (next_page_hash){
            const go_back_page_hash = thisObj.getHashRouteListPage();
            
            // This should not contain any DOM elements
            const options_hash_route_data = {
                is_add:         false      
            };
 
            
            // Use hash navigation instead of manual history
            thisObj.navigation.hashRouter.navigate(next_page_hash, {
                pageId:         next_page_id,
                isAdd:          false,
                options:        options_hash_route_data,
                returnRoute:    go_back_page_hash,
                entryHid:       row_entry_hid
            });
        }
        
        const options = {
            is_add:             false
        };
        
        
        func_show_page(options, row_entry_hid);
    }
    
    
}
