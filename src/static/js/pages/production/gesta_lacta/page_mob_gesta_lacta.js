// December 25, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../../common/page_view_basic.js';

import {APPLICATION,
        PIG_OPERATION_TYPE,
        PROD_STATUS}            from '../../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        sortList}               from '../../../utils.js';




PageMobGestaLacta.prototype = new PageViewBasic();
export function PageMobGestaLacta(input_settings){
    PageViewBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    const NUM_MSECS_1DAY        = 1000 * 60 * 60 * 24;
    const DEFAULT_NUM_DAYS_WEAN = 45;
    
    const NUM_DAYS_BEFORE_OPERATION_DUE_SHOW_ALARM = 3;
    
    // This needs to be manually set once fix in backend
    const PIG_PROD_OPS_DATE_TARGET_ORDER_ASC = 1;
    
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
    
    
    let elemIdPageTitle         = null;
    let elemIdPageHeaderAlarm   = null;
    let elemIdEntryCount        = null;
    let elemIdPageInfo          = null;
    
    let elemIdMobSearchInput    = null;
    let elemIdMobAddEntryBtn    = null;
    
    let elemIdCardList          = null;
    let elemIdListContainer     = null;
    let elemIdPigOpsAlarmTable  = null;


    let elemPageTitle           = null;
    let elemPageHeaderAlarm     = null;
    let elemEntryCount          = null;
    let elemPageInfo            = null;

    let elemMobSearchInput      = null;
    let elemMobAddEntryBtn      = null;
    
    let elemCardList            = null;
    let elemListContainer       = null;
    let elemPigOpsAlarmTable    = null;

    // if false curView is PigOpsAlarmTable
    let curViewIsCardList       = true;
    
    let dataPigProdList         = null;


    //let textTranslation         = new TextTranslation();
    let curUserLanguageKey      = 'en';


    let showpageHeaderAlarm     = false;
    let pigOpsAlarmList         = null;
    
    
    // This must be set before rendering the autotable
    // See G_SAMPLE_JSON_ACCOUNT
    this.accountData            = null;
    
    
    // This should be set before editing ProdPigOps 
    this.editModalProdPigOps    = null;
    
    
    this.init = function(){
        //textTranslation.setTranslations(TRANSLATION_PAGE_ACC_PIG_OPS);
        
        
        
        this.render();
        this.afterHtmlRender();
        
        
    }
    
    
    this.render = function(){
        
        elemIdPageTitle         = `page-title-${settings.uniqueKey}-list`;
        elemIdPageHeaderAlarm   = `page-title-${settings.uniqueKey}-alarm`;
        elemIdEntryCount        = `page-title-${settings.uniqueKey}-prod-count`;
        elemIdPageInfo          = `page-info-${settings.uniqueKey}-list`;
        
        elemIdCardList          = `${settings.uniqueKey}-card-list`;
        elemIdListContainer     = `mobile-list-container-${settings.uniqueKey}`;
        elemIdPigOpsAlarmTable  = `${settings.uniqueKey}-alarm-table`;
        
        
        elemIdMobSearchInput    = `mobile-search-input-${settings.uniqueKey}`;
        elemIdMobAddEntryBtn    = `mobile-add-entry-btn-${settings.uniqueKey}`;
           
        let style_hide_add_button = '';
        if (settings.isGesta == false){
            style_hide_add_button = 'display:none;';
        }
           
        const html = `
<div class="mobile-container">
    <div class="header">
        <h1 id="${elemIdPageTitle}">
            <span id="${elemIdEntryCount}"></span>
            ${settings.pageTitle}
            <span class="inline-bell larger" id="${elemIdPageHeaderAlarm}" title="Due operations!" style="display:none;">
                <i class="fas fa-bell"></i>
            </span>
            
        </h1>
        
        <!-- Mobile Info Box -->
        <!--
        <div class="mobile-info-box">
            <div class="info-text" id="${elemIdPageInfo}">
            </div>
        </div>
        -->
    </div>
    
    <div id="${elemIdCardList}">
        <!-- Search and Add Entry Controls -->
        <div class="mobile-controls">
            <div class="search-container">
                <i class="fas fa-search search-icon"></i>
                <input type="text" class="search-input" id=${elemIdMobSearchInput} placeholder="Search PID or Sow Name...">
            </div>
            <button class="btn-add-entry" id="${elemIdMobAddEntryBtn}" style="${style_hide_add_button}">
                <i class="fas fa-plus"></i>
                Add Entry
            </button>
        </div>

        <!-- Card Container -->
        <div class="card-container-pig-prod" id="${elemIdListContainer}"></div>
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
        elemPageTitle           = document.getElementById(elemIdPageTitle);
        elemPageHeaderAlarm     = document.getElementById(elemIdPageHeaderAlarm);
        elemEntryCount          = document.getElementById(elemIdEntryCount);
        elemPageInfo            = document.getElementById(elemIdPageInfo);

        elemMobSearchInput      = document.getElementById(elemIdMobSearchInput);
        elemMobAddEntryBtn      = document.getElementById(elemIdMobAddEntryBtn);
        elemCardList            = document.getElementById(elemIdCardList);
        elemListContainer       = document.getElementById(elemIdListContainer);
        elemPigOpsAlarmTable    = document.getElementById(elemIdPigOpsAlarmTable);
        
    }
    
    
    this._processAfterHtmlRender = function(){
        
        this.handleWindowResize();
    }
    
    
    this._bindEventListeners = function(){
        
        elemPageHeaderAlarm.addEventListener('click', function() {
            thisObj.onClickPageHeaderAlarm();
        });

        
        elemMobAddEntryBtn.addEventListener('click', function() {
            navigation.onClickProdGestatingAdd();
        });
    
    }
    
    
    this.setDataStaffList = function(data){
        if (this.editModalProdPigOps){
            this.editModalProdPigOps.setDataStaffList(data);
        }
    }
    

    this.setDataPigProdList = function(data){
        let data_filtered = [];
        
        for(const cur_entry of data){
            
            if (PIG_PROD_OPS_DATE_TARGET_ORDER_ASC > 0){
                
                let gestating_ops = cur_entry.gestating_ops;
                gestating_ops = sortList(gestating_ops, 
                    'pig_prod_pig_ops.date_target', 'desc');
                
                let lactating_piglets_ops = cur_entry.lactating_piglets_ops;
                if (lactating_piglets_ops.length > 0){
                    lactating_piglets_ops = sortList(lactating_piglets_ops, 
                        'pig_prod_pig_ops.date_target', 'desc');
                }
                
                
                
                cur_entry.gestating_ops = gestating_ops;
                cur_entry.lactating_piglets_ops = lactating_piglets_ops;
                
                
                let lactating_sow_ops = [];
                if ('lactating_sow_ops' in cur_entry){
                    lactating_sow_ops = cur_entry.lactating_sow_ops;
                    
                    if (lactating_sow_ops.length > 0){
                        lactating_sow_ops = sortList(lactating_sow_ops, 
                            'pig_prod_pig_ops.date_target', 'desc');
                    }
                    
                }
                cur_entry.lactating_sow_ops = lactating_sow_ops;
            }
            
            
            if (settings.isGesta == true){
                if (cur_entry.pig_production.prod_status_id == PROD_STATUS.GESTATING){
                    data_filtered.push(cur_entry);
                }
            }
            else{
                if (cur_entry.pig_production.prod_status_id == PROD_STATUS.LACTATING){
                    data_filtered.push(cur_entry);
                }
            }
        } 
        
        
        dataPigProdList = data_filtered;
    }
    
    
    this.getDataPigProdList = function(){
        return dataPigProdList;
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
        showpageHeaderAlarm = false; // Need to reset this.
        elemPageHeaderAlarm.style.display = 'none';
        
        // Need to clear this;
        pigOpsAlarmList     = [];
        
        
        // Render HTML in elemListContainer
        if ((dataPigProdList == null) || (dataPigProdList.length == 0)){
            elemMobSearchInput.setAttribute("placeholder", "No entries found"); 
        }
        else{
            elemMobSearchInput.setAttribute("placeholder", "Search Sow Name or PID");
        }
        
        let html = '';
        
        if (dataPigProdList != null){
            for (const cur_entry of dataPigProdList){
                html += thisObj._getHtml(cur_entry)
            }
           
            elemListContainer.innerHTML = html;
        }
        
        
        // Search functionality
        const cards = elemListContainer.querySelectorAll('.card-pig-prod');
        
        elemMobSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            cards.forEach(card => {
                const pid = card.querySelector('.pid').textContent.toLowerCase();
                const sowName = card.querySelector('.sow-name').textContent.toLowerCase();
                
                if (pid.includes(searchTerm) || sowName.includes(searchTerm) || searchTerm === '') {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
        
        
        // Show PageHeaderAlarm
        if (showpageHeaderAlarm){
            elemPageHeaderAlarm.style.display = 'inline-block';
        }
        
        
        // Render HTML in elemPigOpsAlarmTable
        html = thisObj._getHtmlAlarmOperations();
        elemPigOpsAlarmTable.innerHTML = html;
    
    
        // Need to set this
        curViewIsCardList       = true;
        elemCardList.style.display = 'block';
        elemPigOpsAlarmTable.style.display = 'none';
        
        
        // Set entry count; only show if mobile screen
        if (navigation.curScreenIsMobile == true){
            let prod_count = 0;
            if (dataPigProdList){prod_count = dataPigProdList.length;}
            
            elemEntryCount.innerHTML = `${prod_count}`;
        }
    }
    
    
    this._getHtml = function(data_pig_prod){
        let diff_msecs;
        let diff_days;
        
        let dt_current = new Date();
        dt_current.setHours(0, 0, 0, 0);
        
        
        let sow_name = '';
        if ((data_pig_prod.sow.name != null) && (data_pig_prod.sow.name.length > 0)){
            sow_name = data_pig_prod.sow.name;
        }
        else{
            sow_name = data_pig_prod.sow.number;
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
                boar_name += ' from ' + insemination.ai.semen_supplier.name;
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
        
        
        let indicator_ai = '';
        if (insemination.insem_type != 'B'){
            indicator_ai = '<span class="ai-indicator"><i class="fas fa-syringe"></i></span>';
        }
        
        
        const birth = data_pig_prod.birth;
        
        let date_important          = null;
        let header_class            = 'lactating-piglets';
        let label_date_important    = '';
        let label_num_days_since    = '';
        let value_num_days_since    = '';
        
        let dt_important            = null;
        let dt_important_sf         = null;
        let diff_days_important     = null;
        
        let dt_insem                = null;
        let dt_birth                = null;
        
        let numdays_since           = null;
        
        let html_due_soon           = '';
        
        let style_animation_horse   = 'display:none;';
        let style_animation_motor   = 'display:none;';
        let style_piglet_counter    = 'display:none;'
        
        let cur_num_pigs_male       = null;
        let cur_num_pigs_female     = null;
        let cur_num_pigs_stillbirth = null;
        let cur_num_pigs_dead       = null;
        
        
        
        switch(data_pig_prod.pig_production.prod_status_id){
            case PROD_STATUS.GESTATING: {
                header_class        = 'gestating';
                
                
                date_important      = birth.date_expected;
                dt_important        = new Date(date_important);
                dt_important_sf     = formatDate(dt_important);
                
                diff_msecs          = dt_important - dt_current;
                diff_days           = Math.round(diff_msecs / NUM_MSECS_1DAY);
                diff_days_important = diff_days;
                
                if ((diff_days >= 3) && (diff_days <= 5)) {
                    html_due_soon = `<span class="due-soon">(${diff_days} Days)</span>`;
                    style_animation_horse   = 'display:block';
                } 
                
                if ((diff_days == 1) || (diff_days == 2)) {
                    html_due_soon = `<span class="due-soon">(Due Soon)</span>`;
                    style_animation_motor   = 'display:block';
                
                    if (diff_days == 1){
                        dt_important_sf = 'Tomorrow';
                    }
                } 
                
                if (diff_days == 0) {
                    html_due_soon = `<span class="due-soon">(Today!)</span>`;
                    dt_important_sf = 'Today';
                }
                
                if ((diff_days == -1) || (diff_days == -2)){
                    html_due_soon = `<span class="due-soon">(Just Wait)</span>`;
                }
                
                if (diff_days == -1){
                    html_due_soon = `<span class="due-soon">(Panic!!!)</span>`;
                }
                
                
                
                
                
                dt_insem            = new Date(insemination.insem_date);
                diff_msecs          = dt_current - dt_insem;
                diff_days           = Math.round(diff_msecs / NUM_MSECS_1DAY);
                
                // Adjust Day 1 on date of insemination/coupling if needed
                if (thisObj.accountData != null){
                    if (thisObj.accountData.settings_operations.day_1_on_date_of_insem > 0){
                        days_diff += 1;
                    }
                }
                numdays_since       = diff_days;
                
                
                
                label_date_important= 'Expected Birth';
                label_num_days_since= 'Days Since Mating'; 
                
                const dt_insem_sf   = formatDate(dt_insem, FORMAT_SHORT_MONTH);
                value_num_days_since= `${numdays_since} Days (${dt_insem_sf})`;
                
                break;
            }
        
            case PROD_STATUS.LACTATING: {
                header_class = 'lactating-sow';
                
                // Need to add number of days for date weaning
                date_important      = birth.date_actual;
                dt_important        = new Date(date_important);
                
                
                cur_num_pigs_male   = birth.pigs_live_m;
                cur_num_pigs_female = birth.pigs_live_f;
                cur_num_pigs_stillbirth = birth.num_dead_at_birth;
                
                // TODO needs to be computed at backend
                cur_num_pigs_dead   = (cur_num_pigs_male + cur_num_pigs_female) - 
                                        data_pig_prod.pig_production.cur_pig_count;
                if (cur_num_pigs_dead < 0){cur_num_pigs_dead = 0;}
                
                style_piglet_counter= '';
                
                label_date_important= 'Expected Wean';
                label_num_days_since= 'Days Since Birth';
                break;
            }
        }
        
        
        const html_operations = thisObj._getHtmlOperations(data_pig_prod);
        
        const farm_prod_id = data_pig_prod.pig_production.farm_prod_id;
        
        let html = `
        <div class="card-pig-prod" data-pid="${farm_prod_id}">
            <div class="card-header-pig-prod ${header_class}">
                <div class="header-top-row">
                    <div class="pid">${farm_prod_id}</div>
                    <div class="sow-name" onclick="gNavigation.onClickProdGestatingEntry(${farm_prod_id});">
                        <!--${sow_name} <i class="fas fa-heart"></i> ${boar_name} -->
                        ${sow_name} ❤️ ${boar_name}
                        ${indicator_ai}
                    </div>
                </div>
                
                <!-- Dates side by side -->
                <div class="dates-container">
                    <div class="date-item">
                        <div class="date-label">
                            ${label_date_important}
                            ${html_due_soon}
                        </div>
                        <div class="date-value">
                            ${dt_important_sf}
                            <span class="running-animation">
                                <span class="horse-running" style="${style_animation_horse}">
                                    <i class="fas fa-horse"></i>
                                    <div class="animation-track"></div>
                                </span>
                                
                                
                                <span class="motorbike-running" style="${style_animation_motor}">
                                    <i class="fas fa-motorcycle"></i>
                                    <div class="animation-track"></div>
                                </span>
                            </span>
                        </div>
                    </div>
                    <div class="date-item">
                        <div class="date-label">${label_num_days_since}</div>
                        <div class="date-value">${value_num_days_since}</div>
                    </div>
                </div>
            </div>

            <!-- Piglet Count (only for lactating) - side by side -->
            <div class="piglet-count-container" style="${style_piglet_counter}">
                <div class="piglet-count male">
                    <div class="count-number">${cur_num_pigs_male}</div>
                    <div class="count-label">Male</div>
                </div>
                <div class="piglet-count female">
                    <div class="count-number">${cur_num_pigs_female}</div>
                    <div class="count-label">Female</div>
                </div>
                <div class="piglet-count stillbirth">
                    <div class="count-number">${cur_num_pigs_stillbirth}</div>
                    <div class="count-label">StillBirth</div>
                </div>
                <div class="piglet-count dead">
                    <div class="count-number">${cur_num_pigs_dead}</div>
                    <div class="count-label">Dead</div>
                </div>
            </div>


            <!-- Operations List -->
            <div class ="operations-list-container">
                ${html_operations}
            </div>

            <!-- Update Button -->
            <div class="controls">
                <button class="btn-update">Update Record</button>
            </div>
        </div>
        `;
        
        return html;
        
    }
    
    
    this._getHtmlOperations = function(data_pig_prod){
        const pid = data_pig_prod.pig_production.farm_prod_id;
        
        let operations = null;
        
        if (data_pig_prod.pig_production.prod_status_id == PROD_STATUS.GESTATING){
            operations = data_pig_prod.gestating_ops;
        }
        else{
            operations = data_pig_prod.lactating_ops;
        }
        
        if (operations == null){return '';}
        if (operations.length == 0){return '';}
        
        
        const data_sow = data_pig_prod.sow;
        let sow_reference = '';
        
        if ((data_sow.name != null) && (data_sow.name.length >0)){
            sow_reference = data_sow.name;
        }
        else{
            sow_reference = data_sow.number;
        }
        
        
        /*
        When the operations data is set, this is sorted in descending date_target.
        There should only be 2 operations by default to be shown at a time.
        
        1.) When the number of operations <= 2, 
            - no controls for future-operations-control
            
        
        */
        
        
        // Loop through the operations to see if there are done Operations
        let has_completed_ops = 0;
        for (const cur_entry of operations){
            if (cur_entry.pig_prod_pig_ops.date_actual != null){
                has_completed_ops = 1;
            }
        }
        
        
        
        let style_future_ops_control = '';
        let style_operations_control = '';
        
        // Fill these 3 arrays 
        let operations_above    = [];
        let operations_cur_view = []; // can only view 2 operation items on default
        let operations_below    = [];
        
        
        if (operations.length <= 2){
            operations_cur_view = operations;
        }
        else{
            let index;
            let cur_entry;
            let count = 0;
            
            index = operations.length -1;
        
            let index_begin = -1;
            let index_end   = -1;
            
            while (index >= 0){
                cur_entry = operations[index];
                
                if (cur_entry.pig_prod_pig_ops.date_actual == null){
                    index_end   = index +1;
                    index_begin = index -1;

                    if (index_begin < 0) {
                        index_begin = 0;
                        index_end   = 2;
                    }
                    break;
                }
                                
                index = index - 1;
            }
            
            if (index_begin > 0){
                operations_above    = operations.slice(0,index_begin);
                operations_cur_view = operations.slice(index_begin, index_end);
                
                if (index_end < operations.length){
                    operations_below = operations.slice(index_end);
                }
                
            }
            
            else{
                operations_cur_view = operations.slice(index_begin, index_end);
                
                if (index_end < operations.length){
                    operations_below = operations.slice(index_end);
                }
            }
            
            
        }
        
        
        
        if (operations_below.length == 0){
            style_operations_control = 'display:none;';
        }
        
        if (operations_above.length == 0){
            style_future_ops_control = 'display:none;';
        }
        
        
        let html_operations_above = '';
        operations_above.forEach((operation, index) => {
            
            const options = {
                placement_class:    'operation-above',
                is_hidden:          true,
                pid:                pid,
                sow:                sow_reference,
                data_index:         index,
                operation_hid:      operation.pig_prod_pig_ops.hid
            };
            
            html_operations_above += thisObj._getHtmlOperation(
                operation, options);
        });
        
        let html_operations_cur_view = '';
        operations_cur_view.forEach((operation, index) => {
            
            const options = {
                placement_class:    '',
                is_hidden:          false,
                pid:                pid,
                sow:                sow_reference,
                data_index:         index,
                operation_hid:      operation.pig_prod_pig_ops.hid
            };
            
            html_operations_cur_view += thisObj._getHtmlOperation(
                operation, options);
        });
        
        let html_operations_below = '';
        operations_below.forEach((operation, index) => {
            
            const options = {
                placement_class:    'operation-below',
                is_hidden:          true,
                pid:                pid,
                sow:                sow_reference,
                data_index:         index,
                operation_hid:      operation.pig_prod_pig_ops.hid
            };
            
            html_operations_below += thisObj._getHtmlOperation(
                operation, options);
        });
        
        
        function debugOperations(){
            let s = '';
            
            s += 'Operations above: \n';
            for (const cur_entry of operations_above){
                s += cur_entry.pig_prod_pig_ops.date_target + ' - '
                s += cur_entry.account_pig_ops.name +'\n';
            }
            
            s += '\nOperations current: \n';
            for (const cur_entry of operations_cur_view){
                s += cur_entry.pig_prod_pig_ops.date_target + ' - '
                s += cur_entry.account_pig_ops.name +'\n';
            }
            
            s += '\nOperations below: \n';
            for (const cur_entry of operations_below){
                s += cur_entry.pig_prod_pig_ops.date_target + ' - '
                s += cur_entry.account_pig_ops.name +'\n';
            }
            
        }
        
        //debugOperations();
        
        let show_upcoming_operation = `Show ${operations_above.length} Upcoming Operation`;
        if (operations_above.length > 1){show_upcoming_operation += 's';}
        
        
        let s_click_more;
        let s_click_comp;
        if (settings.isGesta){
            s_click_more = `gNavigation.pageMobGestatingList.onClickShowMore(this);`;
            s_click_comp = `gNavigation.pageMobGestatingList.onClickShowCompleted(this);`;
        }
        else{
            s_click_more = `gNavigation.pageMobLactatingList.onClickShowMore(this);`;
            s_click_comp = `gNavigation.pageMobLactatingList.onClickShowCompleted(this);`;
        }
        
        let html = `
        <!-- Operations List -->
        <div class="operations-list">
            <!--
            <div class="operations-title">
                <span>Operations</span>
            </div>
            -->
            
            <!-- Control for future operations (if exists) -->
            <div class="future-operations-control" style="${style_future_ops_control}">
                <span class="btn-show-more" onclick="${s_click_more}">
                    <i class="fas fa-calendar-alt"></i>
                    <span class="span-show-more" >${show_upcoming_operation}</span>
                </span>
            </div>
            
            
            ${html_operations_above}
            
            
            ${html_operations_cur_view}
            
            
            ${html_operations_below}
            
            
            <!-- Control for showing completed operations -->
            <div class="operations-controls" style="${style_operations_control}">
                <span class="btn-show-completed" onclick="${s_click_comp}">
                    <i class="fas fa-history"></i>
                    <span class="span-show-completed">Show Completed Operations (${operations_below.length})</span>
                </span>
            </div>
            
        </div>
        `;
        
        return html;
    }
    
    
    this._getHtmlOperation = function(data_operation, options){
        const placement_class   = options.placement_class;
        const is_hidden         = options.is_hidden;
        const sow               = options.sow;
        const pid               = options.pid;
        const data_index        = options.data_index;
        const operation_hid     = options.operation_hid;
        
        let diff_msecs;
        let diff_days;
        
        let dt_current = new Date();
        dt_current.setHours(0, 0, 0, 0);
        
        
        const date_target   = data_operation.pig_prod_pig_ops.date_target;
        const dt_target     = new Date(date_target);
        const date_target_s = formatDate(dt_target, FORMAT_SHORT_MONTH);
        
        const date_actual   = data_operation.pig_prod_pig_ops.date_actual;
        const operation_name= data_operation.account_pig_ops.name;
        const operation_desc= data_operation.account_pig_ops.description;
            
        
        
        let style_animation_alarm       = '';
        let style_operation_desc        = '';
        let style_operation_completion  = '';
        
        if (operation_desc == null){style_operation_desc = 'display:none;';}
        if (data_operation.staff.name == null){
            style_operation_completion = 'display:none;';
        }
        
        
        
        let html = '';
        
        let style_hidden = '';
        if (is_hidden){style_hidden = 'display:none;';}
        
        if (date_actual != null){
            const date_actual_s = formatDate(new Date(date_actual), FORMAT_SHORT_MONTH);
            const staff_name    = data_operation.staff.name;
            
            html = `
                <div class="operation-item operation-done ${placement_class}" data-pid="${pid}" data-index="${data_index}"  style="${style_hidden}">
                    <div class="operation-header">
                        <div class="operation-left">
                            <div class="operation-date">${date_target_s}</div>
                            <div class="operation-name">${operation_name}</div>
                        </div>
                        <div class="operation-icon icon-done">
                            <i class="fas fa-check-circle"></i>
                        </div>
                    </div>
                    <div class="operation-description" style="${style_operation_desc}">
                        ${operation_desc}
                    </div>
                    <div class="operation-completion" style="${style_operation_completion}">
                        <span>Done: ${date_actual_s}</span>
                        <span>By: ${staff_name}</span>
                    </div>
                </div>
            `;
            
            return html;
        }
        
        
        // Compute the number of days from  dt_target to dt_current
        diff_msecs          = dt_target - dt_current;
        diff_days           = Math.round(diff_msecs / NUM_MSECS_1DAY);
        
        let operation_class = '';
        let has_action      = 0;
        
        if (diff_days > NUM_DAYS_BEFORE_OPERATION_DUE_SHOW_ALARM){
            style_animation_alarm = 'display:none;';
            operation_class = 'operation-pending';
        }
        else{
            has_action          = 1;
            operation_class     = 'operation-due';
            showpageHeaderAlarm = true;
            
            const options_date_short = {
                month: 'short', // "Dec"
                day: 'numeric', // "20"
                year: 'numeric'
            };
            
            let is_overdue = 0;
            if (diff_days < 0){is_overdue = 1;}
            
            
            const short_dt_target = formatDate(dt_target, FORMAT_COMPACT);
            
            pigOpsAlarmList.push({
                pid:            pid,
                sow:            sow,
                date:           short_dt_target,
                is_overdue:     is_overdue,
                operation_hid:  operation_hid,
                pig_ops_name:   operation_name
            });
        }
        
        
        let s_click = '';
        
        if (has_action > 0){
            if (settings.isGesta){
                s_click = `gNavigation.pageMobGestatingList.onClickMarkAsDone(${pid},'${operation_hid}');`;
            }
            else{
                s_click = `gNavigation.pageMobLactatingList.onClickShowMore(${pid},'${operation_hid}');`;
            }
        }
        
        html = `
        <div class="operation-item ${operation_class} ${placement_class}" data-pid="${pid}" data-index="${data_index}" style="${style_hidden}">
            <div class="operation-header">
                <div class="operation-left">
                    <div class="operation-date">${date_target_s}</div>
                    <div class="operation-name">
                        ${operation_name}
                        
                        <span class="inline-bell" title="Operation due today!" style="${style_animation_alarm}">
                            <i class="fas fa-bell"></i>
                        </span>
                    
                    </div>
                </div>
                <div class="operation-actions" style="${style_animation_alarm}">
                    <button class="btn-mark-done" onclick="${s_click}">
                        <i class="fas fa-check"></i>
                        Mark Done
                    </button>
                </div>
            </div>
            <div class="operation-description" style="${style_operation_desc}">
                ${operation_desc}
            </div>
        </div>
        `;
            
        return html;
    } 
    
    
    this._getHtmlAlarmOperations = function(){
        
        let html_tbody = '';
        
        let index = 0;
        for (const cur_entry of pigOpsAlarmList){
            const pid = cur_entry.pid;
            const operation_hid = cur_entry.operation_hid;
            
            let html_overdue ='';
            
            if (cur_entry.is_overdue){
                html_overdue = `<span class="status-overdue" aria-label="Overdue"></span>`;
            }
            
            let s_click;
            if (settings.isGesta){
                s_click = `gNavigation.pageMobGestatingList.onClickMarkAsDone(${pid},'${operation_hid}');`;
            }
            else{
                s_click = `gNavigation.pageMobLactatingList.onClickShowMore(${pid},'${operation_hid}');`;
            }
            
            
            html_tbody += `
            <tr>
                <td class="sow-name" tabindex="0" role="button" onclick="${s_click}" style="padding-left:0;">${cur_entry.sow}</td>
                <td class="date date-today" tabindex="0" role="button" onclick="${s_click}">
                    <span class="compact-date">${cur_entry.date}</span>
                    ${html_overdue}
                </td>
                <td class="operation">${cur_entry.pig_ops_name}
                    <span class="inline-bell">
                        <i class="fas fa-bell"></i>
                    </span>
                </td>
            </tr>
            `;
            
            index += 1;
        }
        
        
        let html = `
        <table class="operations-table">
            <thead>
                <tr>
                    <th>Sow</th>
                    <th>Date</th>
                    <th>Operation Name</th>
                </tr>
            </thead>
            <tbody>
                ${html_tbody}
            </tbody>
        </table>
        `;
        
        return html;
    }
    
    
    this.setUserLanguage = function(language_key){
        curUserLanguageKey = language_key;
        thisObj.onUserChangeLanguage();
    }
    
    
    this.onUserChangeLanguage = function(){
        
       
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
    
    
    this.onClickShowMore = function(clicked_elem){
        const operations_list   = clicked_elem.closest('.operations-list');
        const operations_above  = operations_list.querySelectorAll('.operation-above');
        const span_show_more    = operations_list.querySelector('.span-show-more');
        

        
        let isDisplayed = 0;
        
        operations_above.forEach(operation => {
            const computedStyle = window.getComputedStyle(operation);
            const displayValue = computedStyle.getPropertyValue('display');
            
            if (displayValue == 'none'){
                isDisplayed = 1;
                operation.style.display = 'block';
            }
            else{
                isDisplayed = 0;
                operation.style.display = 'none';
            }
        });
        
        let s_text;
        if (isDisplayed == 0){
            s_text = `Show ${operations_above.length} Upcoming Operation`;
            if (operations_above.length > 1){show_upcoming_operation += 's';}
        }
        else{
            s_text = `Hide ${operations_above.length} Upcoming Operation`;
            if (operations_above.length > 1){show_upcoming_operation += 's';}
        }
        
        span_show_more.innerHTML = s_text;
        
    }
    
    
    this.onClickShowCompleted = function(clicked_elem){
        const operations_list   = clicked_elem.closest('.operations-list');
        const operations_below  = operations_list.querySelectorAll('.operation-below');
        const span_show_comp    = operations_list.querySelector('.span-show-completed');
        

        
        let isDisplayed = 0;
        
        operations_below.forEach(operation => {
            const computedStyle = window.getComputedStyle(operation);
            const displayValue = computedStyle.getPropertyValue('display');
            
            if (displayValue == 'none'){
                isDisplayed = 1;
                operation.style.display = 'block';
            }
            else{
                isDisplayed = 0;
                operation.style.display = 'none';
            }
        });
        
        let s_text;
        if (isDisplayed == 0){
            s_text = `Show Completed Operations (${operations_below.length})`;
        }
        else{
            s_text = `Hide Completed Operations (${operations_below.length}`;
        }
        
        span_show_comp.innerHTML = s_text;
    }
    
    
    this.onClickMarkAsDone = function(pid, entry_hid){
        console.log(`onClickMarkAsDone pid =${pid}; entry_hid=${entry_hid}`);
    
        const data_pig_prod = thisObj.getDataPigProd(pid);
    
        
        const operation = thisObj.getDataProdPigOps(data_pig_prod, entry_hid);
        if (operation == null) {return;}
        
        const data_sow = data_pig_prod.sow;
        let sow_reference = '';
        
        if ((data_sow.name != null) && (data_sow.name.length >0)){
            sow_reference = data_sow.name;
        }
        else{
            sow_reference = data_sow.number;
        }
        
        
        const options = {
            pid:            pid,
            sow:            sow_reference,
            is_gesta:       settings.isGesta
        };
        thisObj.editModalProdPigOps.show(operation, options);
    }
    
    
    this.onClickPageHeaderAlarm = function(){
        console.log('onClickPageHeaderAlarm');
        
        if (curViewIsCardList == true){
            elemCardList.style.display = 'none';
            elemPigOpsAlarmTable.style.display = 'block';
        
            curViewIsCardList = false;
        }
        else{
            elemCardList.style.display = 'block';
            elemPigOpsAlarmTable.style.display = 'none';
            
            curViewIsCardList = true;
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
    
    
    
    
    
    this.onSuccessEditPigOps = function(pid){
        // Query the card where this pid is found
        const div_pig_prod_entry =  elemListContainer.querySelector(`div.card-pig-prod[data-pid="${pid}"]`);
        
        if (div_pig_prod_entry == null){
            editModalProdPigOps.hide();
            console.log(`PigProd with pid = ${pid} cannot be found in UI.`)
            return;
        }
        
        const data_prod = thisObj.getDataPigProd(pid)
        const html_operations = thisObj._getHtmlOperations(data_prod);
        
        
        // Query the operations-list-container 
        const div_container = div_pig_prod_entry.querySelector('operations-list-container');
        
        // Redraw operations list
        div_container.innerHTML = html_operations;
        editModalProdPigOps.hide();
    }
}