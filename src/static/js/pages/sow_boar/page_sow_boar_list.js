// December 25, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}          from '../common/page_view_basic.js';

import {APPLICATION,
        PAGE_ID,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        SOW_STATUS_NAME}        from '../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        sortList,
        createPaginationManager} from '../../utils.js';




PageSowBoarList.prototype = new PageViewPigFarmPage();
export function PageSowBoarList(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    const NUM_MSECS_1DAY        = 1000 * 60 * 60 * 24;
    
    const TABLE_ROW_PER_PAGE    = 10;
    
    /*
    Typical input_settings
    {
        navigation:             this,
        elemIdDivContainer:     elemIdContSowBoarList
    }   
    */  
    let settings                = input_settings;
    
    
    // This is needed as ths will be first element to be rendered
    let elemDivContainer        = document.getElementById(settings.elemIdDivContainer);
    
    
    let elemIdNavPrevEntry      = null;
    let elemIdNavNextEntry      = null;
    
    let elemIdPageTitle         = null;
    let elemIdPageHeaderAlarm   = null;
    let elemIdPageHeaderEntryCount = null;
    let elemIdPageInfo          = null;
    
    let elemIdSearchInput       = null;
    let elemIdAddEntryBtn       = null;
    let elemIdFilterControls    = null;
    
    let elemIdTableRowCount     = null;
    let elemIdTablePagination   = null;
    let elemIdTablePrevPage     = null;
    let elemIdTableCurPage      = null;
    let elemIdTableTotalPages   = null;
    let elemIdTableNextPage     = null;
    
    
    
    let elemIdTableSow          = null;
    let elemIdTableSowBody      = null;
    
    let elemIdTableBoar         = null;
    let elemIdTableBoarBody     = null;
    
    let elemIdTableGilt         = null;
    let elemIdTableGiltBody     = null;
    
    let elemIdTableDisposed     = null;
    let elemIdTableDisposedBody = null;
    


    let elemNavPrevEntry        = null;
    let elemNavNextEntry        = null;

    let elemPageTitle           = null;
    let elemPageHeaderAlarm     = null;
    let elemPageHeaderEntryCount = null;
    let elemPageInfo            = null;

    let elemSearchInput         = null;
    let elemAddEntryBtn         = null;
    let elemFilterControls      = null;
    
    let elemTableRowCount       = null;
    let elemTablePagination     = null;
    let elemTablePrevPage       = null;
    let elemTableCurPage        = null;
    let elemTableTotalPages     = null;
    let elemTableNextPage       = null;
    
    
    let elemTableSow            = null;
    let elemTableSowBody        = null;
    
    let elemTableBoar           = null;
    let elemTableBoarBody       = null;
    
    let elemTableGilt           = null;
    let elemTableGiltBody       = null;
    
    let elemTableDisposed       = null;
    let elemTableDisposedBody   = null;
    
    
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
    
    
    let curSowFilter            = null;
    
    
    // This must be set before rendering the autotable
    // See G_SAMPLE_JSON_ACCOUNT
    this.accountData            = null;
    
    
    let showOptions             = null;
    
    
    let dtCurrentDate           = null;
    
    this.init = function(){
        //textTranslation.setTranslations(TRANSLATION_PAGE_ACC_PIG_OPS);
        
        this.render();
        this.afterHtmlRender();
        
        
    }
    
    
    this._writeInlineStyle = function(){
        const html = `
    <style>
        
        /* Updated Table Styles */
        .table-sow td {padding-right:0}
       
        .data-table.table-boar td:nth-child(3) { text-align: center;}
        .table-boar td {padding-right:0}
        
        
        .table-gilt td {padding-right:0}
        
        .table-disposed td {padding-right:0}
        
      </style>
    `;
        return html;
    }
    
    
    this.render = function(){
        
        elemIdNavPrevEntry      = `page-title-sow-boar-list-prev`;
        elemIdNavNextEntry      = `page-title-sow-boar-list-next`;
        
        elemIdPageTitle         = `page-title-sow-boar-list`;
        elemIdPageHeaderAlarm   = `page-title-sow-boar-alarm`;
        elemIdPageHeaderEntryCount = `page-title-sow-boar-count`;
        elemIdPageInfo          = `page-info-sow-boar-list`;
        
        elemIdSearchInput       = `mobile-search-input-sow-boar`;
        elemIdAddEntryBtn       = `mobile-add-entry-btn-sow-boar`;
        elemIdFilterControls    = `mobile-filter-control-sow-boar`;
        
        
        elemIdTableRowCount     = `sow-boar-table-row-count`;
        elemIdTablePagination   = `sow-boar-table-pagination`;
        elemIdTablePrevPage     = `sow-boar-table-prev-page`;
        elemIdTableCurPage      = `sow-boar-table-cur-page`;
        elemIdTableTotalPages   = `sow-boar-table-total-pages`;
        elemIdTableNextPage     = `sow-boar-table-next-page`;
        
        elemIdTableSow          = `sow-boar-sow-table`;
        elemIdTableSowBody      = `sow-boar-sow-tbody`;
        
        elemIdTableBoar         = `sow-boar-boar-table`;
        elemIdTableBoarBody     = `sow-boar-boar-tbody`;
        
        elemIdTableGilt         = `sow-boar-gilt-table`;
        elemIdTableGiltBody     = `sow-boar-gilt-tbody`;
        
        elemIdTableDisposed     = `sow-boar-disposed-table`;
        elemIdTableDisposedBody = `sow-boar-disposed-tbody`;
        

        
        
        const html_style = thisObj._writeInlineStyle();
           
        const html = `

${html_style}
        
<div class="mobile-container">
    <div class="nav-left-right">
        <button class="nav-button blue" id="${elemIdNavPrevEntry}"><i class="fa-solid fa-arrow-left"></i></button>
                
        <span>
            <span class="nav-title blue" id="${elemIdPageHeaderEntryCount}"></span>
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
        <!-- Search and Add Entry Controls -->
        <div class="mobile-controls">
            <div class="search-container">
                <i class="fas fa-search search-icon"></i>
                <input type="text" class="search-input" id=${elemIdSearchInput} placeholder="Search Pig Name or Number">
            </div>
            <button class="btn-add-entry" id="${elemIdAddEntryBtn}">
                <i class="fas fa-plus"></i>
                Add Entry
            </button>
        </div>
        
        <!-- Centered Filter Controls -->
        <div class="filter-controls" id="${elemIdFilterControls}">
            <!-- Animal Filter Buttons - Centered, no gaps -->
            <div class="animal-filter">
                <div class="filter-buttons sow">
                    <button class="filter-button active" data-filter="all">All</button>
                    <button class="filter-button" data-filter="gestating">Gesta</button>
                    <button class="filter-button" data-filter="lactating">Lacta</button>
                    <button class="filter-button" data-filter="weaning">Wean</button>
                </div>
            </div>
            
        </div>
        
        
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


        <!-- Sow Boar -->
        <table class="data-table table-sow" id="${elemIdTableSow}">
            <colgroup>
                <col style="width: 30%;">
                <col style="width: 25%;">
                <col style="width: 25%;">
                <col style="width: 20%;">
            </colgroup>
  
            <thead>
                <tr>
                    <th>Sow</th>
                    <th>Status</th>
                    <th>Age</th>
                    <th>Output</th>
                </tr>
            </thead>
            <tbody id="${elemIdTableSowBody}">
                <!-- Operations populated by JavaScript -->
            </tbody>
        </table>
        
        
        <table class="data-table table-boar" id="${elemIdTableBoar}">
            <colgroup>
                <col style="width: 30%;">
                <col style="width: 25%;">
                <col style="width: 20%;">
                <col style="width: 25%;">
            </colgroup>
            
            <thead>
                <tr>
                    <th>Boar</th>
                    <th>Age</th>
                    <th>Mates</th>
                    <th>Last Mate</th>
                </tr>
            </thead>
            <tbody id="${elemIdTableBoarBody}">
                <!-- Operations populated by JavaScript -->
            </tbody>
        </table>
        
        
        <table class="data-table table-gilt" id="${elemIdTableGilt}">
            <colgroup>
                <col style="width: 25%;">
                <col style="width: 25%;">
                <col style="width: 50%;">
            </colgroup>
            
            <thead>
                <tr>
                    <th>Gilt</th>
                    <th>Age</th>
                    <th>Next PigOp</th>
                </tr>
            </thead>
            <tbody id="${elemIdTableGiltBody}">
                <!-- Operations populated by JavaScript -->
            </tbody>
        </table>
        
        
        <table class="data-table table-disposed" id="${elemIdTableDisposed}">
            <colgroup>
                <col style="width: 30%;">
                <col style="width: 20%;">
                <col style="width: 30%;">
                <col style="width: 20%;">
            </colgroup>
            
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Pig Type</th>
                    <th>Name</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody id="${elemIdTableDisposedBody}">
                <!-- Operations populated by JavaScript -->
            </tbody>
        </table>
        
        
        
    </div>
    
    
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
        elemPageHeaderEntryCount = elemDivContainer.querySelector('#'+elemIdPageHeaderEntryCount);
        elemPageInfo            = elemDivContainer.querySelector('#'+elemIdPageInfo);

        elemSearchInput         = elemDivContainer.querySelector('#'+elemIdSearchInput);
        elemAddEntryBtn         = elemDivContainer.querySelector('#'+elemIdAddEntryBtn);
        elemFilterControls      = elemDivContainer.querySelector('#'+elemIdFilterControls);
        
        elemTableRowCount       = elemDivContainer.querySelector('#'+elemIdTableRowCount);
        elemTablePagination     = elemDivContainer.querySelector('#'+elemIdTablePagination);
        elemTablePrevPage       = elemDivContainer.querySelector('#'+elemIdTablePrevPage);
        elemTableCurPage        = elemDivContainer.querySelector('#'+elemIdTableCurPage);
        elemTableTotalPages     = elemDivContainer.querySelector('#'+elemIdTableTotalPages);
        elemTableNextPage       = elemDivContainer.querySelector('#'+elemIdTableNextPage);
        
        
        elemTableSow            = elemDivContainer.querySelector('#'+elemIdTableSow);
        elemTableSowBody        = elemDivContainer.querySelector('#'+elemIdTableSowBody);
        
        elemTableBoar           = elemDivContainer.querySelector('#'+elemIdTableBoar);
        elemTableBoarBody       = elemDivContainer.querySelector('#'+elemIdTableBoarBody);
        
        elemTableGilt           = elemDivContainer.querySelector('#'+elemIdTableGilt);
        elemTableGiltBody       = elemDivContainer.querySelector('#'+elemIdTableGiltBody);
        
        elemTableDisposed       = elemDivContainer.querySelector('#'+elemIdTableDisposed);
        elemTableDisposedBody   = elemDivContainer.querySelector('#'+elemIdTableDisposedBody);
        
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
                
                thisObj.onClickSowFilter(data_filter);
               
            });
        });
        
        
        elemSearchInput.addEventListener('input', function() {
            const search_term = this.value.toUpperCase().trim();
            thisObj.searchSowBoar(search_term);
            
        });
        
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
    
    
    this.show = function(options){
        dataSowList     = navigation.pigFarm.managerSowBoar.dataSowList;
        dataBoarList    = navigation.pigFarm.managerSowBoar.dataBoarList;
        dataGiltList    = navigation.pigFarm.managerSowBoar.dataGiltList;
        
		// Default all
        curSowFilter = 'all';
        
        
        // show the last showOptions if there is no options
        if (options == null){options = showOptions;}
        
        // So that not to instantiate in every table redraw
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        showOptions = options;
        
        showpageHeaderAlarm = false; // Need to reset this.
        elemPageHeaderAlarm.style.display = 'none';
        
        curSowBoarType = options.sow_boar_type;
        
        let is_add_sow = false;
        let entry_count = 0;
        
        switch (showOptions.sow_boar_type){
            case SOW_BOAR_TYPE.SOW: {
                elemPageTitle.textContent = 'Sow List';
                
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
                    navigation._onClickNavSowBoar(null, SOW_BOAR_TYPE.DISPOSED);
                }
        
                elemNavNextEntry.onclick = function(){
                    navigation._onClickNavSowBoar(null, SOW_BOAR_TYPE.BOAR);
                }
                

                elemTableSow.style.display      = 'table';
                elemTableBoar.style.display     = 'none';
                elemTableGilt.style.display     = 'none';
                elemTableDisposed.style.display = 'none';
                
                thisObj.renderSowTable(dataSowList);
                break;
            }
            
            case SOW_BOAR_TYPE.BOAR: {
                elemPageTitle.textContent = 'Boar List';
                
                elemAddEntryBtn.style.display = 'block';
                
                if (dataBoarList != null){
                    entry_count = dataBoarList.length; 
                }
                
                // Set up listeners for navigation arrows
                elemNavPrevEntry.onclick = function(){
                    navigation._onClickNavSowBoar(null, SOW_BOAR_TYPE.SOW);
                }
        
                elemNavNextEntry.onclick = function(){
                    navigation._onClickNavSowBoar(null, SOW_BOAR_TYPE.GILT);
                }
                
                
                elemFilterControls.style.display = 'none';
                
                elemTableSow.style.display      = 'none';
                elemTableBoar.style.display     = 'table';
                elemTableGilt.style.display     = 'none';
                elemTableDisposed.style.display = 'none';
                
                thisObj.renderBoarTable(dataBoarList);
                break;
            }
            
            case SOW_BOAR_TYPE.GILT:{
                elemPageTitle.textContent = 'Gilt List';
                
                elemAddEntryBtn.style.display = 'block';
                
                if (dataGiltList != null){
                    entry_count = dataGiltList.length; 
                }
                
                // Set up listeners for navigation arrows
                elemNavPrevEntry.onclick = function(){
                    navigation._onClickNavSowBoar(null, SOW_BOAR_TYPE.BOAR);
                }
        
                elemNavNextEntry.onclick = function(){
                    navigation._onClickNavSowBoar(null, SOW_BOAR_TYPE.DISPOSED);
                }
                
                
                elemFilterControls.style.display = 'none';
                
                
                elemTableSow.style.display      = 'none';
                elemTableBoar.style.display     = 'none';
                elemTableGilt.style.display     = 'table';
                elemTableDisposed.style.display = 'none';
                
                thisObj.renderGiltTable(dataGiltList);
                break;
            }
            
            case SOW_BOAR_TYPE.DISPOSED:{
                elemPageTitle.textContent = 'Disposed List';
                
                elemAddEntryBtn.style.display = 'none';
                
                if (dataDisposedList != null){
                    entry_count = dataDisposedList.length; 
                }
                
                // Set up listeners for navigation arrows
                elemNavPrevEntry.onclick = function(){
                    navigation._onClickNavSowBoar(null, SOW_BOAR_TYPE.GILT);
                }
        
                elemNavNextEntry.onclick = function(){
                    navigation._onClickNavSowBoar(null, SOW_BOAR_TYPE.SOW);
                }
                
                
                if (dataDisposedList == null){
                    const callback = function(data){
                        dataDisposedList = data;
                        thisObj.renderDisposedTable(dataDisposedList);
                    };
                    
                    thisObj.requestDisposedSowBoar(callback);
                }
                else {
                    thisObj.renderDisposedTable(dataDisposedList);
                }
                
                
                elemFilterControls.style.display = 'none';
                
                
                elemTableSow.style.display      = 'none';
                elemTableBoar.style.display     = 'none';
                elemTableGilt.style.display     = 'none';
                elemTableDisposed.style.display = 'table';
                
                
                break;
            }
        
        }
        
        // Set Entry count
        elemPageHeaderEntryCount.textContent = entry_count;
        
        
        // Need to set click listener
        elemAddEntryBtn.onclick = function(){
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
                        thisObj.renderSowTable(dataSowList);
                        break;
                    }
            
                    case SOW_BOAR_TYPE.BOAR: {
                        thisObj.renderBoarTable(dataBoarList);
                        break;
                    }
            
                    case SOW_BOAR_TYPE.GILT:{
                        thisObj.renderGiltTable(dataGiltList);
                        break;
                    }
                    
                }
            };
            
            
            navigation.pageSowBoarAddEdit.callbackOnSuccessAdd = callback;
            navigation.pageSowBoarAddEdit.beforeShow(options_sow_boar);
            
            
            const next_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_ADD_EDIT);
            navigation.showThisPage(next_page)
        };
        
        
        // 
        navigation.pageSowBoarEntry.resetToFirstTab();
    }
    
    
    this.renderSowTable = function(sow_list){
        curDataView = sow_list;

        const config = {
            elemPagination:     elemTablePagination,
            elemTableBody:      elemTableSowBody,
            elemEntryCount:     elemTableRowCount,
            elemCurrentPage:    elemTableCurPage,
            elemTotalPages:     elemTableTotalPages,
            elemPrevPageBtn:    elemTablePrevPage,
            elemNextPageBtn:    elemTableNextPage,
            data:               curDataView,
            itemsPerPage:       TABLE_ROW_PER_PAGE,
            renderRow:          thisObj.getHtmlTableRowSow,
            renderRowEmpty:     thisObj.getHtmlTableRowSowEmpty
        } 
        
        const paginationManager = new createPaginationManager(config); 
        paginationManager.init();
        
        // One event handler at a time
        elemTablePrevPage.onclick = function(){
            paginationManager.goToPrevPage();
        }
        
        // One event handler at a time
        elemTableNextPage.onclick = function(){
            paginationManager.goToNextPage();
        }
        
    }
    
    
    this.getHtmlTableRowSowEmpty = function(){
        const html = `
            <tr>
                <td><div>No Entries</div></td>
                <td><div>&nbsp;</div></td>
                <td><div>&nbsp;</div></td>
                <td><div>&nbsp;</div></td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.getHtmlTableRowSow = function(cur_entry){
         
        let diff_msecs;
        let diff_days;
        
        
        let sow_boar = null;
        let sow_reference = '';
    
        if ('sow_boar' in cur_entry){
            sow_boar = cur_entry.sow_boar;
        }
        else{
            sow_boar = cur_entry;
        }
    
        let sow_boar_name_class = '';
        switch (sow_boar.status_id){
            case SOW_STATUS.GROWING:    {sow_boar_name_class = 'growing'; break;}
            case SOW_STATUS.GESTATING:  {sow_boar_name_class = 'gestating'; break;}
            case SOW_STATUS.LACTATING:  {sow_boar_name_class = 'lactating-sow'; break;}
            case SOW_STATUS.WEANING:    {sow_boar_name_class = 'lactating-piglets'; break;}
        }
    
        if (sow_boar.name  && sow_boar.name.length >0 ){
            sow_reference = `<span class="sow-boar-name">${sow_boar.name}</span>`;
            if (sow_boar.number && sow_boar.name.length >0){
                sow_reference += `<br>${sow_boar.number}`;
            }
        }
        else{
            sow_reference = `<span class="sow-boar-name">${sow_boar.number}</span>`;
        }
        
        let dt_birth = null;
        let s_age = '';
        
        if (sow_boar.date_of_birth != null){
            dt_birth = new Date(sow_boar.date_of_birth);
        
            diff_msecs          = dtCurrentDate - dt_birth;
            diff_days           = Math.round(diff_msecs / NUM_MSECS_1DAY);
            
            let num_years       = Math.floor(diff_days / 365);
            let excess_days     = diff_days % 365;
            let num_months      = Math.round(excess_days / 30);
            
            if (num_months == 12){
                num_years += 1;  num_months = 0;
            }
            
            if (num_years == 0){
                s_age = `${num_months} months`;
            }
            else{
                if (num_years == 1){
                    s_age = `${num_years} year`;
                } else{
                    s_age = `${num_years} years`;
                }
                
                if (num_months  >0){
                    if (num_months == 1){
                        s_age += `, <span class="nowrap">${num_months} month</span>`;
                    }
                    else{
                        s_age += `, <span class="nowrap">${num_months} months</span>`;
                    }
                }
            }
        }
        
        
        let dt_expected_birth = null;
        let html_due_warning = null;
        
        
        if ('date_expected_birth' in sow_boar){
            const date_expected_birth =  sow_boar.date_expected_birth;
            dt_expected_birth = new Date(date_expected_birth);
            
            diff_msecs          = dt_expected_birth - dtCurrentDate;
            diff_days           = Math.round(diff_msecs / NUM_MSECS_1DAY);
            
            if ((diff_days >= 3) && (diff_days <= 7)) {
                html_due_warning = `<span class="due-soon">Due ${diff_days} Days</span>`;
            } 
            
            if ((diff_days == 1) || (diff_days == 2)) {
                html_due_warning = `<span class="due-soon">Due Soon</span>`;
            } 
            
            if (diff_days == 0) {
                html_due_warning = `<span class="due-soon">Due Today</span>`;
            }
            
            if (diff_days < 0) {
                html_due_warning = `<span class="due-soon">Overdue</span>`;
            }
        }
        
        
        
        let s_num_piglets = ''
        let num_pig_wean_f = 0;
        let num_pig_wean_m = 0;
        
        if ('num_pig_wean_f' in sow_boar){
            num_pig_wean_f = sow_boar.num_pig_wean_f;
        }
        
        if ('num_pig_wean_m' in sow_boar){
            num_pig_wean_m = sow_boar.num_pig_wean_m;
        }
        
        let num_piglets = num_pig_wean_f + num_pig_wean_m;
        if (num_piglets > 0){
            s_num_piglets = `${num_piglets} (${sow_boar.num_births}B)`;
        }
        
        let s_click = 'gNavigation.pageSowBoarList.onClickSowBoarEntry(';
        s_click += `"${sow_boar.hid}");`;
        
        let s_status = SOW_STATUS_NAME[sow_boar.status_id];
        
        let s_click_gesta = '';
        if (html_due_warning){
            if ('last_farm_prod_id' in sow_boar){
                s_click_gesta = 'gNavigation.pageSowBoarList.onClickSowBoarEntry(';
                s_click_gesta += `"${sow_boar.hid}", ${sow_boar.last_farm_prod_id});`;
            }
            
            s_status = `<span class="due-soon">${s_status}</span>`;
            s_status += '<br>' + html_due_warning;
        }
        
       
        let html;
        
        html = `
        <tr>
            <td><span onclick='${s_click}'>${sow_reference}</span></td>
            <td onclick='${s_click_gesta}'>${s_status}</td>
            <td>${s_age}</td>
            <td>${s_num_piglets}</td>
        </tr>
        `;
        
        
        
        return html;
    }
    
    
    this.onClickSowFilter = function(filter_type){
        
        if (curSowFilter == filter_type){return;}
        
        let sow_status_id = null;
        let filtered_sow_list = null;
        
        switch(filter_type){
            case 'all':{
                filtered_sow_list = dataSowList;
                thisObj.renderSowTable(filtered_sow_list);
                
                elemTableRowCount.textContent = `${filtered_sow_list.length} Entries`;
                break;
            }
            
            case 'gestating':{
                sow_status_id = SOW_STATUS.GESTATING;
                filtered_sow_list = thisObj.filterDataSowList(sow_status_id);
                thisObj.renderSowTable(filtered_sow_list);
                
                elemTableRowCount.textContent = `${filtered_sow_list.length} Entries`;
                break;
            }
            
            case 'lactating':{
                sow_status_id = SOW_STATUS.LACTATING;
                filtered_sow_list = thisObj.filterDataSowList(sow_status_id);
                thisObj.renderSowTable(filtered_sow_list);
                
                elemTableRowCount.textContent = `${filtered_sow_list.length} Entries`;
                break;
            }
            
            case 'weaning':{
                sow_status_id = SOW_STATUS.WEANING;
                filtered_sow_list = thisObj.filterDataSowList(sow_status_id);
                thisObj.renderSowTable(filtered_sow_list);
                
                elemTableRowCount.textContent = `${filtered_sow_list.length} Entries`;
                break;
            }
            
            case 'disposed':{
                // TODO
                break;
            }
        }
        
        curSowFilter = filter_type;
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
    
    
    this.renderBoarTable = function(boar_list){
        curDataView = boar_list;
        
        const config = {
            elemPagination:     elemTablePagination,
            elemTableBody:      elemTableBoarBody,
            elemEntryCount:     elemTableRowCount,
            elemCurrentPage:    elemTableCurPage,
            elemTotalPages:     elemTableTotalPages,
            elemPrevPageBtn:    elemTablePrevPage,
            elemNextPageBtn:    elemTableNextPage,
            data:               curDataView,
            itemsPerPage:       TABLE_ROW_PER_PAGE,
            renderRow:          thisObj.getHtmlTableRowBoar,
            renderRowEmpty:     thisObj.getHtmlTableRowSowEmpty
        }
        
        const paginationManager = new createPaginationManager(config); 
        paginationManager.init();
        
        // One event handler at a time
        elemTablePrevPage.onclick = function(){
            paginationManager.goToPrevPage();
        }
        
        // One event handler at a time
        elemTableNextPage.onclick = function(){
            paginationManager.goToNextPage();
        }
        
        thisObj.addToolTips();
    }
    
    
    this.getHtmlTableRowBoar = function(cur_entry){
        
        let diff_msecs;
        let diff_days;
        
        let sow_boar = null;
        let sow_reference = '';
    
        if ('sow_boar' in cur_entry){
            sow_boar = cur_entry.sow_boar;
        }
        else{
            sow_boar = cur_entry;
        }
    
        if (sow_boar.name && sow_boar.name.length >0){
            
            let not_ready = '';
            if (sow_boar.is_production_ready == 0){
                not_ready = '<span class="not-production-ready" data-bs-toggle="tooltip" data-bs-placement="top" title="Not Production Ready"></span>';
            }
            sow_reference = `
                <span class="sow-boar-name">${sow_boar.name} ${not_ready}</span>
            `;
            
            if (sow_boar.number && sow_boar.number.length >0){
                sow_reference += `<br>${sow_boar.number}`;
            }
            
        }
        else{
            sow_reference = `<span class="sow-boar-name">${sow_boar.number}</span>`;
            if (sow_boar.is_production_ready == 0){
                sow_reference += `<span class="not-production-ready" title="Not Production Ready"></span>`
            }
        }
        
        let dt_birth = null;
        let s_age = '';
        
        if (sow_boar.date_of_birth != null){
            dt_birth = new Date(sow_boar.date_of_birth);
        
            diff_msecs          = dtCurrentDate - dt_birth;
            diff_days           = Math.round(diff_msecs / NUM_MSECS_1DAY);
            
            let num_years       = Math.floor(diff_days / 365);
            let excess_days     = diff_days % 365;
            let num_months      = Math.round(excess_days / 30);
            
            
            if (num_years == 0){
                s_age = `${num_months} months`;
            }
            else{
                if (num_years == 1){
                    s_age = `${num_years} year`;
                } else{
                    s_age = `${num_years} years`;
                }
                
                if (num_months  >0){
                    if (num_months == 1){
                        s_age += `, <span class="nowrap">${num_months} month</span>`;
                    }
                    else{
                        s_age += `, <span class="nowrap">${num_months} months</span>`;
                    }
                }
            }
            
        
        }
        
        
        let s_click = 'gNavigation.pageSowBoarList.onClickSowBoarEntry(';
        s_click += `"${sow_boar.hid}");`;
        
        let s_last_mate = '';
        if (sow_boar.date_last_mate){s_last_mate = sow_boar.date_last_mate;}
        
        let mate_count =  sow_boar.mate_count;
        
        const html = `
            <tr>
                <td onclick='${s_click}'>${sow_reference}</td>
                <td>${s_age}</td>
                <td>${mate_count}</td>
                <td>${s_last_mate}</td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.renderGiltTable = function(gilt_list){
        curDataView = gilt_list;
        
        const config = {
            elemPagination:     elemTablePagination,
            elemTableBody:      elemTableGiltBody,
            elemEntryCount:     elemTableRowCount,
            elemCurrentPage:    elemTableCurPage,
            elemTotalPages:     elemTableTotalPages,
            elemPrevPageBtn:    elemTablePrevPage,
            elemNextPageBtn:    elemTableNextPage,
            data:               curDataView,
            itemsPerPage:       TABLE_ROW_PER_PAGE,
            renderRow:          thisObj.getHtmlTableRowGilt,
            renderRowEmpty:     thisObj.getHtmlTableRowSowEmpty
        } 

        const paginationManager = new createPaginationManager(config); 
        paginationManager.init();
        
        // One event handler at a time
        elemTablePrevPage.onclick = function(){
            paginationManager.goToPrevPage();
        }
        
        // One event handler at a time
        elemTableNextPage.onclick = function(){
            paginationManager.goToNextPage();
        }
    }
    
    
    this.getHtmlTableRowGilt= function(cur_entry){
         
        let diff_msecs;
        let diff_days;
        
        
        let sow_boar = null;
        let sow_reference = '';
    
        if ('sow_boar' in cur_entry){
            sow_boar = cur_entry.sow_boar;
        }
        else{
            sow_boar = cur_entry;
        }
    
        if ((sow_boar.name != null) && (sow_boar.name.length >0)){
            sow_reference = `<span class="sow-boar-name">${sow_boar.name} </span>`;
            
            if (sow_boar.number && sow_boar.number.length >0){
                sow_reference += `<br>${sow_boar.number}`;
            }
        }
        else{
            sow_reference = `<span class="sow-boar-name">${sow_boar.number}</span>`;
        }
        
        let dt_birth = null;
        let s_age = '';
        
        if (sow_boar.date_of_birth != null){
            dt_birth = new Date(sow_boar.date_of_birth);
        
            diff_msecs          = dtCurrentDate - dt_birth;
            diff_days           = Math.round(diff_msecs / NUM_MSECS_1DAY);
            
            let num_years       = Math.floor(diff_days / 365);
            let excess_days     = diff_days % 365;
            let num_months      = Math.round(excess_days / 30);
            
            
            if (num_years == 0){
                s_age = `${num_months} months`;
            }
            else{
                if (num_years == 1){
                    s_age = `${num_years} year`;
                } else{
                    s_age = `${num_years} years`;
                }
                
                if (num_months  >0){
                    if (num_months == 1){
                        s_age += `, <span class="nowrap">${num_months} month</span>`;
                    }
                    else{
                        s_age += `, <span class="nowrap">${num_months} months</span>`;
                    }
                }
            }
        }
        
        
        let s_click = 'gNavigation.pageSowBoarList.onClickSowBoarEntry(';
        s_click += `'${sow_boar.hid}');`;
        
        const html = `
            <tr>
                <td onclick="${s_click}">${sow_reference}</td>
                <td>${s_age}</td>
                <td></td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.renderDisposedTable = function(disposed_list){
        curDataView = disposed_list;
        
        const config = {
            elemPagination:     elemTablePagination,
            elemTableBody:      elemTableDisposedBody,
            elemEntryCount:     elemTableRowCount,
            elemCurrentPage:    elemTableCurPage,
            elemTotalPages:     elemTableTotalPages,
            elemPrevPageBtn:    elemTablePrevPage,
            elemNextPageBtn:    elemTableNextPage,
            data:               curDataView,
            itemsPerPage:       TABLE_ROW_PER_PAGE,
            renderRow:          thisObj.getHtmlTableRowDisposed,
            renderRowEmpty:     thisObj.getHtmlTableRowSowEmpty
        } 

        const paginationManager = new createPaginationManager(config); 
        paginationManager.init();
        
        // One event handler at a time
        elemTablePrevPage.onclick = function(){
            paginationManager.goToPrevPage();
        }
        
        // One event handler at a time
        elemTableNextPage.onclick = function(){
            paginationManager.goToNextPage();
        }
        
        // Set Entry count; This needs to be set since this is requested late
        const entry_count = disposed_list.length;
        elemPageHeaderEntryCount.textContent = entry_count;
        
    }
    
    
    this.getHtmlTableRowDisposed = function(cur_entry){
        let pig_type = '';
        
        if (cur_entry.sow_boar.farm_boar_id){
            pig_type = 'Boar';
        }
        else{
            if (cur_entry.sow_boar.status_id == SOW_STATUS.GROWING){
                pig_type = 'Gilt';
            }
            else{
                pig_type = 'Sow';
            }
        }
        
        let sow_reference = '';
        let sow_boar;
        
        if ('sow_boar' in cur_entry){
            sow_boar = cur_entry.sow_boar;
        }
        else{
            sow_boar = cur_entry;
        }
    
        if ((sow_boar.name != null) && (sow_boar.name.length >0)){
            sow_reference = `<span class="sow-boar-name">${sow_boar.name}</span>`;
            
            if (sow_boar.number && sow_boar.number.length >0){
                sow_reference += `<br>${sow_boar.number}`;
            }
        }
        else{
            sow_reference = `<span class="sow-boar-name">${sow_boar.number}</span>`;
        }
        
        let s_status = '';
        
        switch(cur_entry.sow_boar.dispose_status_id){
            case SOW_STATUS.CULLED: {s_status = 'Culled'; break;}
            case SOW_STATUS.DEAD:   {s_status = 'Dead'; break;}
            case SOW_STATUS.SOLD:   {s_status = 'Sold'; break;}
            case SOW_STATUS.DELETE: {s_status = 'Deleted'; break;}
                    
        }
        
        let s_click = 'gNavigation.pageSowBoarList.onClickSowBoarEntry(';
        s_click += `'${sow_boar.hid}');`;
        
        const html = `
            <tr>
                <td>${cur_entry.sow_boar.date_dispose}</td>
                <td>${pig_type}</td>
                <td onclick="${s_click}">${sow_reference}</td>
                <td>${s_status}</td>
            </tr>
        `;
        
        return html;
        
    }
    
    
    this.addToolTips = function(){
        const with_tooltips  = elemDivContainer.querySelectorAll('[data-bs-toggle="tooltip"]');
        console.log('with_tooltips='+with_tooltips.length);
        for (const cur_entry of with_tooltips){
            new bootstrap.Tooltip(cur_entry);
        }
    }
    
    
    this.searchSowBoar = function(key){
        let cur_list;
        
        switch (showOptions.sow_boar_type){
            case SOW_BOAR_TYPE.SOW:{
                cur_list = dataSowList;
                
                if (key.length == 0){
                    thisObj.renderSowTable(cur_list);
                    return;
                }
                
                break;
            }
            case SOW_BOAR_TYPE.BOAR:{
                cur_list = dataBoarList;
                
                if (key.length == 0){
                    thisObj.renderBoarTable(cur_list);
                    return;
                }
                
                break;
            }
            case SOW_BOAR_TYPE.GILT:{
                cur_list = dataGiltList;
                
                if (key.length == 0){
                    thisObj.renderGiltTable(cur_list);
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
            if (cur_entry.sow_boar.name && cur_entry.sow_boar.name.toUpperCase().includes(upper_key)){
                filtered.push(cur_entry)
            }
            else{
                if (cur_entry.sow_boar.number && cur_entry.sow_boar.number.toUpperCase().includes(upper_key)){
                    filtered.push(cur_entry)
                }
            }
        }
        
        
        switch (showOptions.sow_boar_type){
            case SOW_BOAR_TYPE.SOW:{
                thisObj.renderSowTable(filtered);
                return;
            }
            case SOW_BOAR_TYPE.BOAR:{
                thisObj.renderBoarTable(filtered);
                return;
            }
            case SOW_BOAR_TYPE.GILT:{
                thisObj.renderGiltTable(filtered);
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
         
         
    this.onClickSowBoarEntry = function(sow_boar_hid, pig_prod_id){
        if (sow_boar_hid == null){
            // Go back to this page
            const page_container = navigation.getPageContainer(PAGE_ID.SOW_BOAR_LIST);
            navigation.showThisPage(page_container);
            return;
        }
    
        if (pig_prod_id){
            navigation.onClickProdGestatingEntry(pig_prod_id);
            return;
        }
    
        let cur_sow_boar_list = null;
        
        switch (showOptions.sow_boar_type){
            case SOW_BOAR_TYPE.SOW:  {cur_sow_boar_list = dataSowList; break;}
            case SOW_BOAR_TYPE.BOAR: {cur_sow_boar_list = dataBoarList; break;}
            case SOW_BOAR_TYPE.GILT: {cur_sow_boar_list = dataGiltList; break;}
            
            case SOW_BOAR_TYPE.DISPOSED: {cur_sow_boar_list = dataDisposedList; break;}
        }
        
        this.gotoSowBoarEntryPage(cur_sow_boar_list, sow_boar_hid, showOptions.sow_boar_type); 
    }
        
        
    this.gotoSowBoarEntryPage = function(sow_boar_list, sow_boar_hid, sow_boar_type){
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
                
                
                navigation.pageSowBoarEntry.beforeShow(cur_entry, options);
                const page_container = navigation.getPageContainer(PAGE_ID.SOW_BOAR_ENTRY);
                navigation.showThisPage(page_container);
                return;
            }

        }
        

        
        const next_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_ENTRY);
        navigation.showThisPage(next_page)

    }

    
    this.requestDisposedSowBoar = function(callback){
        const cur_pig_farm_hid  = navigation.userControl.getCurrentFarmHid()
        
        const is_mob_view = 1; // TODO for desktop view
        
        const base_url = window.location.origin;
        const url = `${base_url}/sow_boar/list?pfhid=${cur_pig_farm_hid}&is_disposed=1&inc_user_audit=1`;
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            async: true,
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    console.log('response.data');
                    console.log(response.data);
                    
                    if (callback){
                        callback(response.data)
                    }
                }
                else {
                    // TODO
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
    }
}