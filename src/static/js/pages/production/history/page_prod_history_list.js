// February 21, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}        from '../../common/page_view_basic.js';

import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        SOW_STATUS_NAME,
        PIG_PROD_TYPE}              from '../../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        sortList,
        createPaginationManager}    from '../../../utils.js';

import {getSowBoarReference}        from '../../common/common_app.js';


import {ProdHistTableAll}           from './prod_hist_tables/table_prod_hist_all.js'
import {ProdHistTableWeights}       from './prod_hist_tables/table_prod_hist_weights.js'
import {ProdGrossSalesTable}        from './prod_hist_tables/table_prod_gross_sales.js'
import {ProdGrossProfitTable}       from './prod_hist_tables/table_prod_gross_profit.js'


export function PageProdHistoryList(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;

    
    this.TABLE_ROW_PER_PAGE     = 10;
    
    /*
    Typical input_settings
    {
        navigation:             this,
        elemIdDivContainer:     elemIdContSowBoarList,
        uniqueKey:              'sow-boar',
        isProdSalesHistory:     true
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
    
    
    let elemTableRowCount       = null;
    let elemTablePagination     = null;
    let elemTablePrevPage       = null;
    let elemTableCurPage        = null;
    let elemTableTotalPages     = null;
    let elemTableNextPage       = null;
    

    
    let dataProdHistoryList     = null;

    
    
    let curDataListView         = null;
    
    let curDataFilter            = null;
    
    
    
    let showOptions             = null;
    
    
    let dtCurrentDate           = null;
    
    
    let tableProdHistAll        = null;
    let tableProdHistWeights    = null;
    let tableProdGrossSales     = null;
    let tableProdGrossProfit    = null;
    
    
    if (settings.isProdSalesHistory){
        tableProdGrossSales         = new ProdGrossSalesTable({
            navigation:             navigation,
            parentObj:              this,
            elemDivContainer:       elemDivContainer,
            uniqueKey:              settings.uniqueKey
        });
        
        tableProdGrossProfit        = new ProdGrossProfitTable({
            navigation:             navigation,
            parentObj:              this,
            elemDivContainer:       elemDivContainer,
            uniqueKey:              settings.uniqueKey
        });
    }
    
    else{
        tableProdHistAll            = new ProdHistTableAll({
            navigation:             navigation,
            parentObj:              this,
            elemDivContainer:       elemDivContainer,
            uniqueKey:              settings.uniqueKey 
        });
        
        
        tableProdHistWeights        = new ProdHistTableWeights({
            navigation:             navigation,
            parentObj:              this,
            elemDivContainer:       elemDivContainer,
            uniqueKey:              settings.uniqueKey 
        });
    }
    
    
    this.elemTableRowCount      = null;
    this.elemTablePagination    = null;
    this.elemTablePrevPage      = null;
    this.elemTableCurPage       = null;
    this.elemTableTotalPages    = null;
    this.elemTableNextPage      = null;
    
    this.dtCurrentDate          = null;
    
    
    let dataProdHistList        = null;
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    

    
    this.render = function(){
        
        elemIdNavPrevEntry      = `${settings.uniqueKey}-page-title-prev`;
        elemIdNavNextEntry      = `${settings.uniqueKey}-page-title-next`;
        
        elemIdPageTitle         = `${settings.uniqueKey}-page-title-list`;
        elemIdPageHeaderAlarm   = `${settings.uniqueKey}-page-title-alarm`;
        elemIdEntryCount        = `${settings.uniqueKey}-page-title-entry-count`;
        elemIdPageInfo          = `${settings.uniqueKey}-page-info-list`;
        
        elemIdSearchInput       = `${settings.uniqueKey}-search-input`;
        elemIdAddEntryBtn       = `${settings.uniqueKey}-add-entry-btn`;
        elemIdFilterControls    = `${settings.uniqueKey}-filter-control`;
        
        
        elemIdTableRowCount     = `${settings.uniqueKey}-table-row-count`;
        elemIdTablePagination   = `${settings.uniqueKey}-table-pagination`;
        elemIdTablePrevPage     = `${settings.uniqueKey}-table-prev-page`;
        elemIdTableCurPage      = `${settings.uniqueKey}-table-cur-page`;
        elemIdTableTotalPages   = `${settings.uniqueKey}-table-total-pages`;
        elemIdTableNextPage     = `${settings.uniqueKey}-table-next-page`;
        
        
        let page_title          = '';
        
        if (settings.isProdSalesHistory){
            page_title          = 'Prod Sales List';
        }
        else{
            page_title          = 'Prod History List';
        }
        
        
        let html_table_gross_sales= '';
        let html_table_gross_profit ='';
        
        let html_table_hist_all = '';
        let html_table_weights  = '';
        
        let html_filter_buttons = '';
        
        if (settings.isProdSalesHistory){
            html_table_gross_sales    = tableProdGrossSales.getHtml();
            html_table_gross_profit   = tableProdGrossProfit.getHtml();
            
            html_filter_buttons = `
                        <button class="filter-button active" data-filter="sales">Sales</button>
                        <button class="filter-button" data-filter="profit">Profit</button>
            `;
            
             
        }
        else{
            html_table_hist_all     = tableProdHistAll.getHtml(); 
            html_table_weights      = tableProdHistWeights.getHtml();
            
            html_filter_buttons = `
                        <button class="filter-button active" data-filter="all">All</button>
                        <button class="filter-button" data-filter="weights">Weight</button>
                        <button class="filter-button" data-filter="harvests">Harvest</button>
            `;
        }
    
        const html = `

        
<div class="mobile-container">
    <div class="nav-left-right">
        <button class="nav-button blue" id="${elemIdNavPrevEntry}"><i class="fa-solid fa-arrow-left"></i></button>
                
        <span>
            <span class="nav-title blue" id="${elemIdEntryCount}"></span>
            <span class="nav-title blue" id="${elemIdPageTitle}">${page_title}</span>
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
                <input type="text" class="search-input" id=${elemIdSearchInput} placeholder="Sow Name or PID">
            </div>
            
        </div>
        
        <!-- Centered Filter Controls -->
        <div id="${elemIdFilterControls}">
        
            <div class="filter-controls">
                <!-- Animal Filter Buttons - Centered, no gaps -->
                <div class="animal-filter">
                    <div class="filter-buttons sow">
                        ${html_filter_buttons}
                    </div>
 
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

        
        <!-- Table Prod Gross Sales-->
        ${html_table_gross_sales}
        
        <!-- Table Prod Gross Profit-->
        ${html_table_gross_profit}

        <!-- Table Prod History All-->
        ${html_table_hist_all}
            
        <!-- Table Weights-->
        ${html_table_weights}
        
    </div>
    
    
</div>
        `;
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        if (settings.isProdSalesHistory){
            tableProdGrossSales.afterHtmlRender();
            tableProdGrossProfit.afterHtmlRender();
        } else{
            tableProdHistAll.afterHtmlRender();
            tableProdHistWeights.afterHtmlRender();
        }
        
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

        
        const filterButtons  = elemDivContainer.querySelectorAll('.filter-button');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const data_filter = button.getAttribute('data-filter');
                
                // Update active tab button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
    
                thisObj.onClickDataFilter(data_filter);

            });
        });
        
        
        elemSearchInput.addEventListener('input', function() {
            const search_term = this.value.toUpperCase().trim();
            thisObj.searchProdHist(search_term);
            
        });
        
        
        if (settings.isProdSalesHistory){}
        else{
            // Set up listeners for navigation arrows
            elemNavPrevEntry.onclick = function(){
                navigation._onClickNavProdFattening();
            }

            elemNavNextEntry.onclick = function(){
                navigation._onClickNavProdNotPregnant();
            }
        }
        
    }
    
    
    this.resetFilterButtons = function(){
        const filterButtons  = elemDivContainer.querySelectorAll('.filter-button');
        
        
        for (const cur_entry of filterButtons){
            cur_entry.classList.remove('active');
        } 
        
        filterButtons[0].classList.add('active');
        
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
        dataProdHistList  = navigation.pigFarm.managerPigProd.dataProdHistoryList;

        if (dataProdHistList == null){
        
            const callback_success = function(data){
                dataProdHistList  = navigation.pigFarm.managerPigProd.dataProdHistoryList;
                
                if (settings.isProdSalesHistory){
                    tableProdGrossSales.renderTable(dataProdHistList);
                }
                else{
                    tableProdHistAll.renderTable(dataProdHistList);
                }
            };
            
            // Request ProdHistory List
            navigation.pigFarm.managerPigProd.requestPigProdList(
                PIG_PROD_TYPE.HARVESTED, callback_success, null);
        
        }
        else{
            dataProdHistList  = navigation.pigFarm.managerPigProd.dataProdHistoryList;
            if (settings.isProdSalesHistory){
                tableProdGrossSales.renderTable(dataProdHistList);
            }
            else{
                tableProdHistAll.renderTable(dataProdHistList);
            }
        }


        if (settings.isProdSalesHistory){
            // Default all
            curDataFilter = 'sales';
            tableProdGrossSales.show();
            tableProdGrossProfit.hide();
        }
        else{
            // Default all
            curDataFilter = 'all';
            tableProdHistAll.show();
            tableProdHistWeights.hide();
        }
        
        
        // show the last showOptions if there is no options
        if (options == null){options = showOptions;}
        
        
        
        
        
        // So that not to instantiate in every table redraw
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        this.dtCurrentDate = dtCurrentDate;
        
        
        showOptions = options;
        

    }
    
    
       
    this.onClickDataFilter = function(filter_type){
        
        if (curDataFilter == filter_type){return;}

        
        let sow_status_id = null;
        let filtered_data_list = null;
        
        
        
        switch(filter_type){
            case 'sales':{
                tableProdGrossSales.show();
                tableProdGrossProfit.hide();

                
                curDataListView = dataProdHistList;
                tableProdGrossSales.renderTable(curDataListView);
                break;
            }
            
            case 'profit':{
                tableProdGrossSales.hide();
                tableProdGrossProfit.show();

                
                curDataListView = dataProdHistList;
                tableProdGrossProfit.renderTable(curDataListView);
                break;
            }
            
            
            case 'all':{
                tableProdHistAll.show();
                tableProdHistWeights.hide();

                
                curDataListView = dataProdHistList;
                tableProdHistAll.renderTable(curDataListView);
                break;
            }
            
            case 'weights':{
                tableProdHistAll.hide();
                tableProdHistWeights.show();
                
                curDataListView = dataProdHistList;
                tableProdHistWeights.renderTable(curDataListView);
                break;
            }
            
           
        }
        
        curDataFilter = filter_type;
    }
    
      
    this.addToolTips = function(){
        const with_tooltips  = elemDivContainer.querySelectorAll('[data-bs-toggle="tooltip"]');

        for (const cur_entry of with_tooltips){
            new bootstrap.Tooltip(cur_entry);
        }
    }
    
    
    this.searchProdHist = function(key){
        let cur_list;
        
        if (key.length == 0){
            thisObj.renderTableFilteredData(dataProdHistList);
            return;
        }

        
        const filtered = [];
        
        for (const cur_entry of dataProdHistList){
            if (thisObj.searchStrInPigProdEntry(cur_entry, key)){
                filtered.push(cur_entry);
            }
        }
        
        thisObj.renderTableFilteredData(filtered);
    }
    
    
    this.renderTableFilteredData = function(filtered_data){
        switch(curDataFilter){
            case 'all': {
                tableProdHistAll.renderTable(filtered_data)
                break;
            }
            
            case 'weights': {
                tableProdHistWeights.renderTable(filtered_data)
            }

        }

    }
    
    
    this.setUserLanguage = function(language_key){
        curUserLanguageKey = language_key;
        thisObj.onUserChangeLanguage();
    }
    
    
    this.onUserChangeLanguage = function(){
        
       
    }
         
         
    this.onClickProdHistEntry = function(pig_prod_pid, tab_id){
        if (pig_prod_pid == null){
            navigation._onClickNavProdHistory(null);
            return;
        }
        
        
        let prev_prod_pid = null;
        let next_prod_pid = null;
        
        let index;
        let cur_entry   = null;
        let prev_entry  = null;
        let next_entry  = null;
        
        const data_pig_prod_list = dataProdHistList;
        
        for (index = 0; index< data_pig_prod_list.length; index++){
            cur_entry = data_pig_prod_list[index];
            
            if (cur_entry.pig_production.farm_prod_id == pig_prod_pid){
        
                if ((index-1) >=0){
                    prev_entry = data_pig_prod_list[index-1];
                    prev_prod_pid = prev_entry.pig_production.farm_prod_id;
                }
                
                if ((index+1) < data_pig_prod_list.length){
                    next_entry = data_pig_prod_list[index+1];
                    next_prod_pid = next_entry.pig_production.farm_prod_id;
                }
                
                const options = {
                    pig_prod_type:      PIG_PROD_TYPE.HARVESTED,
                    prev_prod_pid:      prev_prod_pid,
                    next_prod_pid:      next_prod_pid,
                    pig_prod_list:      data_pig_prod_list,
                    data_index:         index+1,
                    total_entries:      data_pig_prod_list.length
                };
                
                if (tab_id){
                    options.tab_id = tab_id;
                }
                
                if (settings.isProdSalesHistory){
                    options.is_prod_sales = true;
                    navigation.pageProdSalesEntry.show(cur_entry, options);
                    const page_container = navigation.getPageContainer(PAGE_ID.PROD_SALES_ENTRY);
                    navigation.showThisPage(page_container);
                }
                else{
                    navigation.pageProdHistoryEntry.show(cur_entry, options);
                    const page_container = navigation.getPageContainer(PAGE_ID.PROD_HISTORY_ENTRY);
                    navigation.showThisPage(page_container);
                }
                
                return;
            }

        }
        

        
        const next_page = navigation.getPageContainer(PAGE_ID.PROD_HISTORY_ENTRY);
        navigation.showThisPage(next_page)

        
        
    }
        
}
