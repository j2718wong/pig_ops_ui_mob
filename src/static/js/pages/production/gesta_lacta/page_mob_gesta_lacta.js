// December 25, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../../common/page_view_basic.js';

import {PAGE_ID,
        APPLICATION,
        PIG_OPERATION_TYPE,
        PIG_PROD_TYPE,
        PROD_STATUS}            from '../../../constants.js';

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
    
    const DEFAULT_NUM_DAYS_WEAN = 45;
    
    
    
    
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
    
    
    // This is needed as ths will be first element to be rendered
    let elemDivContainer        = null;
    if (settings.isGesta == true){
        elemDivContainer        = document.getElementById('container-prod-gesta-list');
    }
    else{
        elemDivContainer        = document.getElementById('container-prod-lacta-list');
    }
    
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
    
    let elemIdTablePigOps       = null;
    let elemIdTablePigCount     = null;
    
    let elemIdProdTableContainer= null;
    let elemIdPigProdTableBody  = null;
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
    
    let elemTablePigOps         = null;
    let elemTablePigCount       = null;
    
    
    
    let elemProdTableContainer  = null;
    let elemPigProdTableBody    = null;
    let elemPigCountTableBody   = null;
    
    
    let elemPigOpsAlarmTable    = null;

    // if false current view is PigOpsAlarmTable
    let curViewIsPigProdList    = true;
    
    
    // if false, current  pig prod view is table
    let curPigProdViewIsCards   = false;
    
    
    let dataPigProdList         = null;


    //let textTranslation         = new TextTranslation();
    let curUserLanguageKey      = 'en';


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
    
    
    this.init = function(){
        //textTranslation.setTranslations(TRANSLATION_PAGE_ACC_PIG_OPS);
        
        
        
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
        elemIdEntryCount        = `${settings.uniqueKey}-page-title-prod-count`;
        elemIdPageInfo          = `${settings.uniqueKey}-page-info-list`;
        
        elemIdPigProdList       = `${settings.uniqueKey}-card-list`;
        elemIdProdCardsContainer= `${settings.uniqueKey}-mobile-list-container`;
        
        
        elemIdTableColControls  = `${settings.uniqueKey}-mobile-pig-prod-table-cols`;
        elemIdLactaPigOps       = `${settings.uniqueKey}-lacta-pigops`;
        elemIdLactaPigCount     = `${settings.uniqueKey}-lacta-piglets`;
        elemIdLactaFeeds        = `${settings.uniqueKey}-lacta-feeds`;
        
        elemIdTablePigOps       = `${settings.uniqueKey}-table-pigops`;
        elemIdTablePigCount     = `${settings.uniqueKey}-table-pig-count`;
        
        
        elemIdProdTableContainer= `${settings.uniqueKey}-mobile-pig-prod-table`;
        elemIdPigProdTableBody  = `${settings.uniqueKey}-mobile-pig-prod-tbody`;
        elemIdPigCountTableBody = `${settings.uniqueKey}-mobile-pig-count-tbody`;
        
        elemIdPigOpsAlarmTable  = `${settings.uniqueKey}-alarm-table`;
        
        
        elemIdSearchInput       = `${settings.uniqueKey}-mobile-search-input`;
        elemIdAddEntryBtn       = `${settings.uniqueKey}-mobile-add-entry-btn`;
           
           
        let html_pig_prod_table = '';
           
        let style_hide_add_button = '';
        if (settings.isGesta == false){
            style_hide_add_button = 'display:none;';
            
            html_pig_prod_table = `
            <!-- Centered Filter Controls -->
            <div class="filter-controls" id="${elemIdTableColControls}">
                <!-- Animal Filter Buttons - Centered, no gaps -->
                <div class="animal-filter">
                    <div class="filter-buttons sow">
                        <button class="filter-button active" id="${elemIdLactaPigOps}">PigOps</button>
                        <button class="filter-button" id="${elemIdLactaPigCount}">Pig Count</button>
                        <button class="filter-button" id="${elemIdLactaFeeds}">Feeds</button>
                    </div>
                </div>
                
            </div>
            
            
            
            <!-- PogProd Lacta Table -->
            <table class="data-table table-gesta-lacta" id="${elemIdTablePigOps}">
                <colgroup>
                    <col style="width: 15%;">
                    <col style="width: 22%;">
                    <col style="width: 33%;">
                    <col style="width: 30%;">
                </colgroup>
  
                <thead>
                    <tr>
                        <th>PID</th>
                        <th>Sow</th>
                        <th>Wean</th>
                        <th>Operation</th>
                    </tr>
                </thead>
                <tbody id="${elemIdPigProdTableBody}">
                </tbody>
            </table>
            
            
            <table class="data-table table-gesta-lacta" id="${elemIdTablePigCount}">
                <colgroup>
                    <col style="width: 15%;">
                    <col style="width: 20%;">
                    <col style="width: 15%;">
                    <col style="width: 22%;">
                </colgroup>
  
                <thead>
                    <tr>
                        <th>PID</th>
                        <th>Sow</th>
                        <th>Num<br>Pigs</th>
                        <th>Dead at<br>Birth</th>
                        <th>Dead after<br>Birth</th>
                    </tr>
                </thead>
                <tbody id="${elemIdPigCountTableBody}">
                </tbody>
            </table>
            `;
        }
        
        else{
            html_pig_prod_table = `
            <!-- PogProd Gesta Table -->
            <table class="data-table table-gesta-lacta">
                <colgroup>
                    <col style="width: 15%;">
                    <col style="width: 22%;">
                    <col style="width: 33%;">
                    <col style="width: 30%;">
                </colgroup>
  
                <thead>
                    <tr>
                        <th>PID</th>
                        <th>Sow</th>
                        <th>Expected</th>
                        <th>Operation</th>
                    </tr>
                </thead>
                <tbody id="${elemIdPigProdTableBody}">
                </tbody>
            </table>
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
            <span class="nav-title blue" id="${elemIdPageTitle}" style="margin-right:8px;">${settings.pageTitle}</span>
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
        
        <div id="${elemIdProdTableContainer}" >
            ${html_pig_prod_table}
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
        
        elemTablePigOps         = elemDivContainer.querySelector('#'+elemIdTablePigOps);
        elemTablePigCount       = elemDivContainer.querySelector('#'+elemIdTablePigCount);
        
        elemProdTableContainer  = elemDivContainer.querySelector('#'+elemIdProdTableContainer);
        elemPigProdTableBody    = elemDivContainer.querySelector('#'+elemIdPigProdTableBody);
        elemPigCountTableBody   = elemDivContainer.querySelector('#'+elemIdPigCountTableBody);
        
        elemPigOpsAlarmTable    = elemDivContainer.querySelector('#'+elemIdPigOpsAlarmTable);
        
    }
    
    
    this._processAfterHtmlRender = function(){
        
        this.handleWindowResize();
    
        
    }
    
    
    this._bindEventListeners = function(){
        
        elemPageTitle.addEventListener('click', function() {
            thisObj.onClickPageHeaderTitle();
        });
        
        
        elemPageHeaderAlarm.addEventListener('click', function() {
            thisObj.onClickPageHeaderAlarm();
        });

        
        elemAddEntryBtn.addEventListener('click', function() {
            navigation.onClickProdGestatingAdd();
        });
        
        
        if (settings.isGesta == true){
            // Set up listeners for navigation arrows
            elemNavPrevEntry.onclick = function(){
                navigation._onClickNavProdFeeds(null);
            }

            elemNavNextEntry.onclick = function(){
                navigation._onClickNavProdGestaLacta(null, PIG_OPERATION_TYPE.LACTATING_PIGLETS);
            }
        
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
            
            
            
            
            
            // Set up listeners for navigation arrows
            elemNavPrevEntry.onclick = function(){
                navigation._onClickNavProdGestaLacta(null, PIG_OPERATION_TYPE.GESTATING);
            }

            elemNavNextEntry.onclick = function(){
                navigation._onClickNavProdFattening(null);
            }
        }
             
    }
    
    
    this.changeLactaTable = function(lacta_table, pig_prod_list){
        if (lacta_table){
            if (lacta_table == curLactaTable){return;}
        }
        
        switch(lacta_table){
            
            case LACTA_TABLE_PIGOPS:{
                elemTablePigOps.style.display = 'table';
                elemTablePigCount.style.display = 'none';
                
                elemPigProdTableBody.innerHTML = thisObj._getHtmlPigProdTableBody(pig_prod_list);
                curLactaTable = LACTA_TABLE_PIGOPS;
                break;
            }
            
            case LACTA_TABLE_PIG_COUNT:{
                elemTablePigOps.style.display = 'none';
                elemTablePigCount.style.display = 'table';
                
                elemPigCountTableBody.innerHTML = thisObj._getHtmlPigCountTableBody();
                curLactaTable = LACTA_TABLE_PIG_COUNT;
                break;
            }
            
            case LACTA_TABLE_FEEDS:{
                elemTablePigOps.style.display = 'none';
                break;
            }
            
            default:{
                elemTablePigOps.style.display = 'table';
                elemTablePigCount.style.display = 'none';
                
                elemPigProdTableBody.innerHTML = thisObj._getHtmlPigProdTableBody();
                curLactaTable = LACTA_TABLE_PIGOPS;
                break;
            }
            
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
    
    
    this.show = function(){
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
        
        
        // Render HTML in elemProdCardsContainer
        if ((dataPigProdList == null) || (dataPigProdList.length == 0)){
            elemSearchInput.setAttribute("placeholder", "No entries found"); 
        }
        else{
            elemSearchInput.setAttribute("placeholder", "Sow Name or PID");
        }
        
        let html = '';
        
        if (dataPigProdList != null){
            for (const cur_entry of dataPigProdList){
                html += thisObj.gestaLactaCards.getHtmlPigProdCard(cur_entry)
            }
           
            elemProdCardsContainer.innerHTML = html;
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

                const html = thisObj._getHtmlPigProdTableBody(filtered_entries);
                
                elemPigProdTableBody.innerHTML = html;
            }
            else{
                //elemPigProdTableBody.innerHTML = thisObj._getHtmlPigProdTableBody();
                thisObj.changeLactaTable(null, filtered_entries);
            }
            
        });
        
        
        // Render HTML in elemPigProdTableBody
        const is_gesta = settings.isGesta;
        
        if (settings.isGesta){
            elemPigProdTableBody.innerHTML = thisObj._getHtmlPigProdTableBody();
        }
        else{
            //elemPigProdTableBody.innerHTML = thisObj._getHtmlPigProdTableBody();
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
        
        
        // Set entry count; only show if mobile screen
        if (navigation.curScreenIsMobile == true){
            let prod_count = 0;
            if (dataPigProdList){prod_count = dataPigProdList.length;}
            
            elemEntryCount.innerHTML = `${prod_count}`;
        }
        
        
        
        
        
        
    }
    
    
    
    
    
    this._getHtmlPigProdTableBody = function(pig_prod_list){
        
        let html_tbody = '';
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
        
        
        const dt_current = new Date();
        dt_current.setHours(0, 0, 0, 0);
        
        const acc_settings_ops  = navigation.pigFarm.getSettingsOperations();
        
        if (pig_prod_list){}
        else{pig_prod_list = dataPigProdList;}
        
        let index = 0;
        for (const cur_entry of pig_prod_list){
            pid = cur_entry.pig_production.farm_prod_id;
            
            data_sow = cur_entry.sow;
            sow_reference = getSowBoarReference(data_sow);
        
            
            // Set important date; 
            // gesta: expected date of birth 
            // lacta: date of weaning
            s_date_important = ''
            if (settings.isGesta){
                dt_important = new Date(cur_entry.birth.date_expected);
                dt_important_s = formatDate(dt_important, FORMAT_COMPACT);
                
                diff_days = thisObj.calculateNumDaysSinceInsem(
                            cur_entry.insemination.insem_date, dt_current,
                            acc_settings_ops);
                            
                s_date_important = `${dt_important_s} (Day ${diff_days})`;
            }
            else{
                dt_actual = new Date(cur_entry.birth.date_actual);
                
                num_days_wean = DEFAULT_NUM_DAYS_WEAN;
                
                // check if the account has set num_days_wean
                if (acc_settings_ops){
                    num_days_wean = acc_settings_ops.num_days_wean;
                    
                    // Adjust Day 1 on date of birth if needed
                    if (acc_settings_ops.day_1_on_date_of_birth > 0){
                        num_days_wean -= 1;
                    }
                }
                
                msecs_wean = dt_actual.getTime() + num_days_wean * thisObj.NUM_MSECS_1DAY;
                dt_wean = new Date(msecs_wean);
                
                dt_important    = dt_wean;
                dt_important_s  = formatDate(dt_important, FORMAT_COMPACT);
                
                diff_days = thisObj.calculateNumDaysSinceBirth(
                            cur_entry.birth.date_actual, dt_current,
                            acc_settings_ops);
                
                s_date_important = `${dt_important_s} (Day ${diff_days})`;
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
                if (dt_current >= dt_target){
                    class_overdue = 'text-overdue';
                }
                
                s_operation = `<div class="${class_overdue}">${dt_target_s}</div><div class="${class_overdue}">${operation_name}</div>`;
            } else{
                s_operation = `<div>All Done
                                    <span class="operation-icon large icon-done">
                                        <i class="fas fa-check-circle"></i>
                                    </span>
                                </div>`;
            }
            
            
            
            // Clicking on SowName should go to SowBoar Page
            // Clicking on PID or important date should open Gesta or Lacta Page
            
            let s_click_sow = `gNavigation.pageSowBoarList.gotoSowBoarEntryPage(null, "${data_sow.hid}")`;
            
            let s_click = '';
            if (settings.isGesta){
                s_click = `gNavigation.onClickProdGestatingEntry(${pid});`;
            }
            else{
                s_click = `gNavigation.onClickProdLactatingEntry(${pid});`;
            }
            
            
            html_tbody += `
            <tr>
                <td onclick="${s_click}">${pid}</td>
                <td class="sow-name"  role="button" onclick='${s_click_sow}' style="margin-left:0; padding-left:0;">${sow_reference}</td>
                <td class="date" role="button" onclick='${s_click}'>${s_date_important}</td>
                <td class="operation" style="margin-left:0; padding-left:0;" onclick="${s_click}">
                    ${s_operation}
                </td>
            </tr>
            `;
            
        }
        
        return html_tbody;
        
    }
    
    
    this._getHtmlPigCountTableBody = function(){
        
        let html_tbody = '';
        
        let pid;
        let data_sow;
        let sow_reference;
        let s_num_dead_at_birth = '';
        
        let s_num_dead_after_birth = '';
        
        

        
        let index = 0;
        for (const cur_entry of dataPigProdList){
            pid = cur_entry.pig_production.farm_prod_id;
            
            data_sow = cur_entry.sow;
            sow_reference = getSowBoarReference(data_sow);
        
        
            s_num_dead_at_birth = '';
            
            s_num_dead_after_birth = '';
            
            
            if (cur_entry.birth.num_dead_at_birth > 0){
                s_num_dead_at_birth = `${cur_entry.birth.num_dead_at_birth}`;
            }
            
            
            
            
            
            // Clicking on SowName should go to SowBoar Page
            // Clicking on PID or important date should open Gesta or Lacta Page
            
            let s_click_sow = `gNavigation.pageSowBoarList.gotoSowBoarEntryPage(null, "${data_sow.hid}")`;
            
            let s_click = `gNavigation.onClickProdLactatingEntry(${pid});`;
            
            
            html_tbody += `
            <tr>
                <td onclick="${s_click}">${pid}</td>
                <td class="sow-name"  role="button" onclick='${s_click_sow}' style="margin-left:0; padding-left:0;">${sow_reference}</td>
                <td>${cur_entry.pig_production.cur_pig_count}</td>
                <td>${s_num_dead_at_birth}</td>
                <td></td>
            </tr>
            `;
            
        }
        
        return html_tbody;
        
    }
    
    
    
    
    
    this.setUserLanguage = function(language_key){
        curUserLanguageKey = language_key;
        thisObj.onUserChangeLanguage();
    }
    
    
    this.onUserChangeLanguage = function(){
        
       
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
    
    
    this.onClickPageHeaderTitle = function(){
        
        // Hide alarms table
        elemPigOpsAlarmTable.style.display = 'none';
        curViewIsPigProdList = true;
        
        console.log('Test A');
        
        // Toggle Cards or Table View`
        if (curPigProdViewIsCards == true){
            console.log('Test 1');
            elemProdCardsContainer.style.display = 'none';
            elemProdTableContainer.style.display = 'block';
            
            curPigProdViewIsCards = false;
        } else {
            console.log('Test 2');
            elemProdCardsContainer.style.display = 'block';
            elemProdTableContainer.style.display = 'none';
            
            curPigProdViewIsCards = true;
        }
    
        
    }
    
    
    this.onClickPageHeaderAlarm = function(){
        curPigProdViewIsCards = false;
        
        if (curViewIsPigProdList == true){
            elemPigProdList.style.display = 'none';
            elemPigOpsAlarmTable.style.display = 'block';
        
            curViewIsPigProdList = false;
        }
        else{
            elemPigProdList.style.display = 'block';
            elemPigOpsAlarmTable.style.display = 'none';
            
            elemProdCardsContainer.style.display = 'block';
            elemProdTableContainer.style.display = 'none';
            
            curViewIsPigProdList = true;
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
            navigation.setDataPigProdList(data);
            
            thisObj.show(); 
            
            navigation.pageProdPigOpsEdit.hide();
        };
        
        navigation.pigFarm.managerPigProd.requestPigProdList(pig_prod_type, callback_success);
        
    }
}
