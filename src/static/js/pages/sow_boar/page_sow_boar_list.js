// December 25, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../common/page_view_basic.js';

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




PageSowBoarList.prototype = new PageViewBasic();
export function PageSowBoarList(input_settings){
    PageViewBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    const NUM_MSECS_1DAY        = 1000 * 60 * 60 * 24;
    
    
    /*
    Typical input_settings
    {
        navigation:             this
    }   
    */  
    let settings                = input_settings;
    
    
    // This is needed as ths will be first element to be rendered
    let elemDivContainer        = document.getElementById('container-sow-boar-list');
    
    
    let elemIdNavPrevEntry      = null;
    let elemIdNavNextEntry      = null;
    
    let elemIdPageTitle         = null;
    let elemIdPageHeaderAlarm   = null;
    let elemIdEntryCount        = null;
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
    
    
    let elemIdPigOpsAlarmTable  = null;


    let elemNavPrevEntry        = null;
    let elemNavNextEntry        = null;

    let elemPageTitle           = null;
    let elemPageHeaderAlarm     = null;
    let elemEntryCount          = null;
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
    
    
    
    let elemPigOpsAlarmTable    = null;

    // if false curView is PigOpsAlarmTable
    let curViewIsCardList       = true;
    
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
		.data-table.table-sow th {position:sticky; top: 0;}
		.data-table.table-sow td {position:sticky; top: 0;}
        
        .data-table.table-boar th:nth-child(1) { width: 30%; }
        .data-table.table-boar th:nth-child(2) { width: 30%; }
        .data-table.table-boar th:nth-child(3) { width: 15%; }
        .data-table.table-boar th:nth-child(4) { width: 25%; }
        
        .data-table.table-boar td:nth-child(3) { text-align: center; }
        
        .data-table.table-gilt th:nth-child(1) { width: 25%; }
        .data-table.table-gilt th:nth-child(2) { width: 25%; }
        .data-table.table-gilt th:nth-child(3) { width: 50%; }
        
        
      </style>
    `;
        return html;
    }
    
    
    this.render = function(){
        
        elemIdNavPrevEntry      = `page-title-sow-boar-list-prev`;
        elemIdNavNextEntry      = `page-title-sow-boar-list-next`;
        
        elemIdPageTitle         = `page-title-sow-boar-list`;
        elemIdPageHeaderAlarm   = `page-title-sow-boar-alarm`;
        elemIdEntryCount        = `page-title-sow-boar-count`;
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
        
       
        elemIdPigOpsAlarmTable  = `${settings.uniqueKey}-alarm-table`;
        
        
        
        
        const html_style = thisObj._writeInlineStyle();
           
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
                    <button class="filter-button" data-filter="disposed">Disposed</button>
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
        <table class="data-table table-sow" id="${elemIdTableSow}" style="display:table;">
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
        elemNavPrevEntry        = document.getElementById(elemIdNavPrevEntry);
        elemNavNextEntry        = document.getElementById(elemIdNavNextEntry);
        
        elemPageTitle           = document.getElementById(elemIdPageTitle);
        elemPageHeaderAlarm     = document.getElementById(elemIdPageHeaderAlarm);
        elemEntryCount          = document.getElementById(elemIdEntryCount);
        elemPageInfo            = document.getElementById(elemIdPageInfo);

        elemSearchInput         = document.getElementById(elemIdSearchInput);
        elemAddEntryBtn         = document.getElementById(elemIdAddEntryBtn);
        elemFilterControls      = document.getElementById(elemIdFilterControls);
        
        elemTableRowCount       = document.getElementById(elemIdTableRowCount);
        elemTablePagination     = document.getElementById(elemIdTablePagination);
        elemTablePrevPage       = document.getElementById(elemIdTablePrevPage);
        elemTableCurPage        = document.getElementById(elemIdTableCurPage);
        elemTableTotalPages     = document.getElementById(elemIdTableTotalPages);
        elemTableNextPage       = document.getElementById(elemIdTableNextPage);
        
        
        elemTableSow            = document.getElementById(elemIdTableSow);
        elemTableSowBody        = document.getElementById(elemIdTableSowBody);
        
        elemTableBoar           = document.getElementById(elemIdTableBoar);
        elemTableBoarBody       = document.getElementById(elemIdTableBoarBody);
        
        elemTableGilt           = document.getElementById(elemIdTableGilt);
        elemTableGiltBody       = document.getElementById(elemIdTableGiltBody);
        
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
        
    
    }
    

    this.setDataSowList = function(data){
        // When this is set, the data includes the gilts (SOW_STATUS.GROWING)
        // Need to seperate gilts data  
        
        dataSowList = []
        dataGiltList = []
        
        let sow_boar = null;
        
        for (const cur_entry of data){
            if ('sow_boar' in cur_entry){
                sow_boar = cur_entry.sow_boar;
            }
            else{sow_boar = cur_entry;}
            
            if (sow_boar.status_id == SOW_STATUS.GROWING){
                dataGiltList.push(cur_entry);
            }
            else{
                dataSowList.push(cur_entry);
            }
            
        }
        
        // Default all
        curSowFilter = 'all';
    }
    
    
    this.setDataBoarList = function(data){
        dataBoarList    = data;

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
                is_add_sow = true;
                
                // Update EntryCount
                if (dataSowList != null){
                    entry_count = dataSowList.length; // TODO need to separate gilt
                }
                
                if (entry_count == 0){
                    elemFilterControls.style.display = 'none';
                }
                else{
                    elemFilterControls.style.display = 'block';
                }
                
                
                // Set up listeners for navigation arrows
                elemNavPrevEntry.onclick = function(){
                    navigation._onClickNavSowBoar(null, SOW_BOAR_TYPE.GILT);
                }
        
                elemNavNextEntry.onclick = function(){
                    navigation._onClickNavSowBoar(null, SOW_BOAR_TYPE.BOAR);
                }
                
                
                elemTableRowCount.style.display = 'block';
                
                elemTableSow.style.display = 'block';
                elemTableBoar.style.display = 'none';
                elemTableGilt.style.display = 'none';
                
                thisObj.renderSowTable(dataSowList);
                break;
                
            }
            
            case SOW_BOAR_TYPE.BOAR: {
                elemPageTitle.textContent = 'Boar List';
                
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
                
                elemTableRowCount.style.display = 'none';
                
                elemTableSow.style.display = 'none';
                elemTableBoar.style.display = 'block';
                elemTableGilt.style.display = 'none';
                
                thisObj.renderBoarTable(dataBoarList);
                break;
            }
            
            case SOW_BOAR_TYPE.GILT:{
                elemPageTitle.textContent = 'Gilt List';
                
                // Set up listeners for navigation arrows
                elemNavPrevEntry.onclick = function(){
                    navigation._onClickNavSowBoar(null, SOW_BOAR_TYPE.BOAR);
                }
        
                elemNavNextEntry.onclick = function(){
                    navigation._onClickNavSowBoar(null, SOW_BOAR_TYPE.SOW);
                }
                
                
                elemFilterControls.style.display = 'none';
                
                elemTableRowCount.style.display = 'none';
                
                elemTableSow.style.display = 'none';
                elemTableBoar.style.display = 'none';
                elemTableGilt.style.display = 'block';
                
                break;
            }
        }
        
        // Set Entry count
        elemEntryCount.textContent = entry_count;
        
        
        // Need to set click listener
        elemAddEntryBtn.onclick = function(){
            const options_sow_boar ={
                is_add:         true,   // false is edit
                sow_boar_type:  showOptions.sow_boar_type, 
                go_back_page:   elemDivContainer   // Go back to this page
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
            
            
            navigation.pageSowBoarAddEdit.beforeShow(options_sow_boar);
            navigation.pageSowBoarAddEdit.callbackOnSuccessAdd = callback;
            
            
            const next_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_ADD_EDIT);
            navigation.showThisPage(next_page)
        };
        
        
    }
    
    
    this.renderSowTable = function(sow_list){
        curDataView = sow_list;
        
        let html = '';  
        
        /*
        for (const cur_entry of sow_list){
            html+= thisObj.getHtmlTableRowSow(cur_entry);
        }
        
        elemTableSowBody.innerHTML = html;
        */
        
        const config = {
            elemPagination:     elemTablePagination,
            elemTableBody:      elemTableSowBody,
            elemEntryCount:     elemTableRowCount,
            elemCurrentPage:    elemTableCurPage,
            elemTotalPages:     elemTableTotalPages,
            elemPrevPageBtn:    elemTablePrevPage,
            elemNextPageBtn:    elemTableNextPage,
            data:               curDataView,
            itemsPerPage:       10,
            renderRow:          thisObj.getHtmlTableRowSow,
			renderRowEmpty:		thisObj.getHtmlTableRowSowEmpty
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
                <td><span>No Entries</span></td>
                <td>&nbsp;</td>
				<td>&nbsp;</td>
				<td>&nbsp;</td>
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
    
        if ((sow_boar.name != null) && (sow_boar.name.length >0)){
            sow_reference = sow_boar.name;
        }
        else{
            sow_reference = sow_boar.number;
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
        
        
        let s_click = 'gNavigation.pageSowBoarList.onClickSowBoarName(';
        s_click += `${SOW_BOAR_TYPE.SOW}, ${sow_boar.farm_sow_id});`;
        
        const html = `
            <tr>
                <td><span onclick="${s_click}">${sow_reference}</span></td>
                <td>${SOW_STATUS_NAME[sow_boar.status_id]}</td>
                <td>${s_age}</td>
                <td></td>
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
        
        console.log(boar_list);
        
        let html = '';  
        
        for (const cur_entry of boar_list){
            html += thisObj.getHtmlTableRowBoar(cur_entry);
        }
        
        elemTableBoarBody.innerHTML = html;
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
    
        if ((sow_boar.name != null) && (sow_boar.name.length >0)){
            sow_reference = sow_boar.name;
        }
        else{
            sow_reference = sow_boar.number;
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
        
        
        let s_click = 'gNavigation.pageSowBoarList.onClickSowBoarName(';
        s_click += `${SOW_BOAR_TYPE.BOAR}, ${sow_boar.farm_boar_id});`;
        
        let s_last_mate ='';
        if (cur_entry.date_last_mate != null){
            s_last_mate = cur_entry.date_last_mate;
        }
        
        
        const html = `
            <tr>
                <td>${sow_reference}</td>
                <td>${s_age}</td>
                <td>${cur_entry.mate_count}</td>
                <td>${s_last_mate}</td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.renderGiltTable = function(gilt_list){
        curDataView = gilt_list;
        
    }
    
    
    this.setUserLanguage = function(language_key){
        curUserLanguageKey = language_key;
        thisObj.onUserChangeLanguage();
    }
    
    
    this.onUserChangeLanguage = function(){
        
       
    }
    
    
    this.onClickSowBoarName = function(sow_boar_type, farm_sow_boar_id){
        console.log(`onClickSowBoarName; sow_boar_type=${sow_boar_type}; farm_sow_boar_id = ${farm_sow_boar_id}`);
        
        let index;
        let cur_entry;
        let edit_entry = null;
        
        switch (sow_boar_type){
            case SOW_BOAR_TYPE.SOW: {
                for (cur_entry of curDataView){
                    if (cur_entry.farm_sow_id == farm_sow_boar_id){
                        edit_entry = cur_entry;
                        break;
                    }
                }
                break;
            }
    
            case SOW_BOAR_TYPE.BOAR: {
                for (cur_entry of curDataView){
                    if (cur_entry.farm_boar_id == farm_sow_boar_id){
                        edit_entry = cur_entry;
                        break;
                    }
                }
                break;
            }
    
            case SOW_BOAR_TYPE.GILT:{
                for (cur_entry of curDataView){
                    if (cur_entry.farm_sow_id == farm_sow_boar_id){
                        edit_entry = cur_entry;
                        break;
                    }
                }
                break;
            }
            
        }
        
        
        const options_sow_boar ={
            is_add:         false,   // false is edit
            sow_boar_type:  sow_boar_type,   // false is boar
            farm_sow_boar_id: farm_sow_boar_id,
            go_back_page:   elemDivContainer   // Go back to this page
        };
            
            
        const callback = function(new_sow_boar_hid){
            switch (sow_boar_type){
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
            
            
        navigation.pageSowBoarAddEdit.beforeShow(options_sow_boar);
        navigation.pageSowBoarAddEdit.callbackOnSuccessEdit = callback;
        
        
        const next_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_ADD_EDIT);
        navigation.showThisPage(next_page)
        
        
        
    }

    
    this.requestDisposedSowBoar = function(){
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
                    
                }
                else {
                    // TODO
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                gfRequestError(jqXHR, textStatus, errorThrown, gController.getAppName());
            }
        });
    }
}