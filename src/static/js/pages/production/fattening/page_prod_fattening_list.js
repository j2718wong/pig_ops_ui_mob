// February 9, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageTableBasic}         from '../../common/page_table_basic.js';
import {PageViewPigFarmPage}    from '../../common/page_view_basic.js';


import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE,
        PIG_PROD_TYPE,
        PROD_STATUS}            from '../../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        sortList}               from '../../../utils.js';





export function PageProdFatteningList(input_settings){
    PageTableBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    this.setNavigation(navigation)
    
    
    /*
    Typical input_settings
    {
        navigation:             this,
        uniqueKey:              'prod-fattening' 
        pageTitle:              'Fattening'
    }   
    */  
    let settings                = input_settings;
    
    
    const DEFAULT_NUM_DAYS_HARVEST_FROM_BIRTH   = 145;
    const DEFAULT_NUM_DAYS_HARVEST_FROM_WEAN    = 100;
    
    
    // This is needed as this will be first element to be rendered
    let elemDivContainer        = document.getElementById(settings.elemIdDivContainer);
    
    let elemIdNavPrevEntry      = null;
    let elemIdNavNextEntry      = null;

    let elemIdPageTitle         = null;
    let elemIdPageHeaderAlarm   = null;
    let elemIdEntryCount        = null;
    let elemIdPageInfo          = null;
    
    let elemIdTableBody         = null;
    

    let elemNavPrevEntry        = null;
    let elemNavNextEntry        = null;

    let elemPageTitle           = null;
    let elemPageHeaderAlarm     = null;
    let elemEntryCount          = null;
    let elemPageInfo            = null;

    let elemTableBody           = null;
    
    
    let dataPigProdList         = null;

    
    let dtCurrentDate           = null;


    let farmPage                = new PageViewPigFarmPage();

    
    this.init = function(){

        
        thisObj.setSettingsTable({
            uniqueKey:      settings.uniqueKey,
            noHeader:       true,
            itemsPerPage:   20
        });
        
        
        this.render();
        this.afterHtmlRender();
        
        this.afterHtmlRenderThis();
        
    }
    
    
    
    this.render = function(){
        elemIdNavPrevEntry      = `${settings.uniqueKey}-page-title-prev`;
        elemIdNavNextEntry      = `${settings.uniqueKey}-page-title-next`;
        
        elemIdPageTitle         = `${settings.uniqueKey}-page-title-list`;
        elemIdPageHeaderAlarm   = `${settings.uniqueKey}-page-title-alarm`;
        elemIdEntryCount        = `${settings.uniqueKey}-page-title-entry-count`;
        elemIdPageInfo          = `${settings.uniqueKey}-page-info`;
        
           
        const html_table        = thisObj.getHtml();
           

           
        const html = `

<div class="mobile-container">
    <div class="nav-left-right">
        <button class="nav-button blue" id="${elemIdNavPrevEntry}"><i class="fa-solid fa-arrow-left"></i></button>
            
        <span>
            <span class="nav-title blue" id="${elemIdEntryCount}"></span>
            <span class="nav-title blue" id="${elemIdPageTitle}" style="margin-right:8px;">${settings.pageTitle}</span>
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
    
    ${html_table}

    
    
</div>
        `;
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRenderThis = function(){
        this._findElementsThis();
        this._processAfterHtmlRenderThis();
        this._bindEventListenersThis();
    }
    
    
    this._findElementsThis = function(){
        elemNavPrevEntry        = elemDivContainer.querySelector('#'+elemIdNavPrevEntry);
        elemNavNextEntry        = elemDivContainer.querySelector('#'+elemIdNavNextEntry);
        
        elemPageTitle           = elemDivContainer.querySelector('#'+elemIdPageTitle);
        elemPageHeaderAlarm     = elemDivContainer.querySelector('#'+elemIdPageHeaderAlarm);
        elemEntryCount          = elemDivContainer.querySelector('#'+elemIdEntryCount);
        elemPageInfo            = elemDivContainer.querySelector('#'+elemIdPageInfo);
        
        
        elemTableBody           = elemDivContainer.querySelector('#'+elemIdTableBody);

    }
    
    
    this._processAfterHtmlRenderThis = function(){
        
        this.handleWindowResize();
    
        
    }
    
    
    this._bindEventListenersThis = function(){
        
        elemPageTitle.addEventListener('click', function() {

        });
        
     

        
        // Set up listeners for navigation arrows
        elemNavPrevEntry.onclick = function(){
            navigation.managerNavLinks.onClickNavProdGestaLacta(null, PIG_OPERATION_TYPE.LACTATING_PIGLETS);
        }

        elemNavNextEntry.onclick = function(){
            navigation.managerNavLinks.onClickNavProdHistory();
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
        // So that not to instantiate in every table redraw
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        
        dataPigProdList = navigation.pigFarm.managerPigProd.dataFatteningList;
        
        
        // Set entry count; only show if mobile screen        
        let prod_count = 0;
        if (dataPigProdList){prod_count = dataPigProdList.length;}
        
        elemEntryCount.innerHTML = `${prod_count}`;
        
        
        
        thisObj.renderTable(dataPigProdList);
    }
    

    this.getElemTableBody = function(){
        return elemTableBody;
    }

    
    this.getHtmlTableHeader = function(){
        elemIdTableBody         = `${settings.uniqueKey}-table-tbody`;
        
        let label_sow           = 'Sow';
        let label_boar          = 'Boar';
        let label_days          = 'Days';
        let label_pigs          = 'Pigs';
        
        
        let label_date_harvest  = 'Target Harvest';
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        label_sow           = helper.getSimpleTranslation('common_app.labels.sow') || label_sow;
        label_boar          = helper.getSimpleTranslation('common_app.labels.boar') || label_boar;
        label_days          = helper.getSimpleTranslation('common_app.labels.num_days') || label_days;
        label_pigs          = helper.getSimpleTranslation('common_app.labels.num_pigs') || label_pigs;

        
        label_date_harvest  = helper.getSimpleTranslation('page_sow_boar_list.labels.date_harvest') || label_date_harvest;
        
        
        
        const html = `
        
        <table class="data-table table-fattening" id="">
            <colgroup>
                <col style="width: 33%;">
                <col style="width: 15%;">
                <col style="width: 15%;">
                <col style="width: 27%;">
            </colgroup>

            <thead>
                <tr>
                    <th>
                        <div>PID, ${label_sow}</div> 
                        <div><span class="love-icon">❤️</span> ${label_boar}</div>
                    </th>
                    <th>${label_days}</th>
                    <th>${label_pigs}</th>
                    <th>${label_date_harvest}</th>
                </tr>
            </thead>
            
            
            <tbody id="${elemIdTableBody}">
            </tbody>
        </table>
        
        `;
        
        return html;
        
    }
       

    this.getHtmlTableRowEmpty = function(){
        let label_no_entries = thisObj.writeLabelNoEntries();
        
        if (label_no_entries){}
        else{label_no_entries = 'No Entries';}
        
        
        const html = `
            <tr>
                <td colspan="4"><div>${label_no_entries}</div></td>
            </tr>
        `;
        return html;
    }
    

    this.getHtmlTableRow = function(cur_entry){
        const acc_settings_ops = navigation.pigFarm.getSettingsOperations();
        
        const target_harvest = farmPage.calculateDateTargetHarvest(cur_entry, 
            dtCurrentDate, acc_settings_ops);
        
        
        const html_pid_sow_boar = farmPage.getHtmlPidSowLoveBoar(cur_entry);
        
        
        let diff_days = null;
        let s_days = '';
        let s_target_harvest = '';
        
        if (target_harvest.days_since_birth) {
            diff_days = target_harvest.days_since_birth;
        }
        else{
            diff_days = target_harvest.days_since_wean;
        }
        
        
        if (diff_days){s_days = `${diff_days}`;}
        s_target_harvest = target_harvest.date_target_harvest;
        
        
        const html = `
            <tr>
                <td>${html_pid_sow_boar}</td>
                <td style="text-align:center;">${s_days}</td>
                <td style="text-align:center;">${cur_entry.pig_production.cur_pig_count}</td>
                <td>${s_target_harvest}</td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.getElemTableRow = function(cur_entry){
        const elem_row = document.createElement('tr');
        
        const html = thisObj.getHtmlTableRow(cur_entry);
        elem_row.innerHTML = html;
        
        let pid = cur_entry.pig_production.farm_prod_id;
        
         

        
        // Attach onclick listeners to td
        
        const elem_tds = elem_row.querySelectorAll('td'); 
        
        let index = 0
        for (const cur_td of elem_tds){
        

            if (index == 0 || index == 1) {
                cur_td.onclick = function(){
                    thisObj.onClickProdFatteningEntry(pid);
                }
            }
            
        
            index += 1;
        }
        
        return elem_row;
    }
    
    
    // This is currently defined as 140 days+ pigs from birth
    this.getNumPigsToHarvest = function(){
        const fattening_list = navigation.pigFarm.managerPigProd.dataFatteningList;
    
        let num_pigs  = 0;
        let diff_days;
        
        
        const acc_settings_ops = navigation.pigFarm.getSettingsOperations();
        
        
        for (const cur_entry of fattening_list){
            
        
            const target_harvest = farmPage.calculateDateTargetHarvest(cur_entry, 
                dtCurrentDate, acc_settings_ops);
            
            
            const html_pid_sow_boar = farmPage.getHtmlPidSowLoveBoar(cur_entry);
            
        
            
            if (target_harvest.days_since_birth) {
                // The current fattening entry has date of birth
                diff_days = target_harvest.days_since_birth;
            }
            else{
                // The current fattening entry has no date of birth;
                // either bought from outside or combined to groups 
                
                
                diff_days = target_harvest.days_since_wean;
                
                // Add this days 
                diff_days += APPLICATION.DEFAULT_NUM_DAYS_WEAN;    
                
            }
            
            
            if (diff_days >= APPLICATION.DEFAULT_NUM_DAYS_MIN_HARVEST){
                // Add the current pig count
                num_pigs = cur_entry.pig_production.cur_pig_count;
            }
            
        
        } 
        
        
        
        return num_pigs;
    
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
        
        
    }
    
    
    this.onClickProdFatteningEntry = function(pig_prod_pid, show_options){
        if (pig_prod_pid == null){
            navigation.managerNavLinks.onClickNavProdFattening(null);
            return;
        }
        

        const next_page = navigation.getPageContainer(PAGE_ID.PROD_FATTENING_ENTRY);
        navigation.showThisPage(next_page);
        
        const data_pig_prod_list = navigation.pigFarm.managerPigProd.dataFatteningList;
        
        let prev_prod_pid = null;
        let next_prod_pid = null;
        
        let index;
        let prev_entry  = null;
        let cur_entry   = null;
        let next_entry  = null;
        
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
                    pig_prod_type:  PIG_PROD_TYPE.FATTENING,
                    prev_prod_pid:  prev_prod_pid,
                    next_prod_pid:  next_prod_pid,
                    data_index:     index+1,
                    total_entries:  data_pig_prod_list.length
                };
                
                if (show_options){
                    
                }
                
                navigation.pageProdFatteningEntry.show(cur_entry, options);
                return;
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
    
}
