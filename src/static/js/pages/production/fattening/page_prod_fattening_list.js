// page_prod_fattening_list.js

// February 9, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageTableBasic}         from '../../common/page_table_basic.js';
import {PageViewPigFarmPage}    from '../../common/page_view_basic.js';


import {APPLICATION,
        PAGE_ID,
        HASH_ROUTES,
        PIG_OPERATION_TYPE,
        PIG_PROD_TYPE,
        FLAG_BITS}              from '../../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}         from '../../../utils.js';

import {ComponentNavLeftRight}  from '../../common/ui/comp_nav_left_right.js';



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
    
    const FLAG_BIT_IS_A_GROUP   = FLAG_BITS.PIG_PROD.IS_A_GROUP;
    
    
    // This is needed as this will be first element to be rendered
    let elemDivContainer        = document.getElementById(settings.elemIdDivContainer);
    
    let componentNavLeftRight   = null;
    
    let elemIdPageInfo          = null;
    
    let elemIdGroupTextLinkShow = null;
    let elemIdGroupTextLink     = null;
    
    let elemIdTableBody         = null;
    

    let elemPageInfo            = null;

    let elemGroupTextLinkShow   = null;
    let elemGroupTextLink       = null;


    let elemTableBody           = null;
    
    
    let dataPigProdList         = null;

    
    let dtCurrentDate           = null;


    let farmPage                = new PageViewPigFarmPage();

    
    this.init = function(){
        elemIdGroupTextLinkShow = `${settings.uniqueKey}-combine-to-group-show`;
        elemIdGroupTextLink     = `${settings.uniqueKey}-combine-to-group`;
        
        let label_combine_to_1_pen = 'Combine to 1 Pig Pen';
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_combine_to_1_pen  = helper.getSimpleTranslation('page_fattening_list.labels.combine_to_1_pen') || label_combine_to_1_pen;
        
        
        
        // Create combine link HTML
        const combineLinkHtml = `
            <div id="${elemIdGroupTextLinkShow}" style="margin: 8px 0;">
                <a href="javascript:void(0)" class="text-link" id="${elemIdGroupTextLink}">
                    ${label_combine_to_1_pen}
                </a>
            </div>
        `;


        
        thisObj.setSettingsTable({
            uniqueKey:      settings.uniqueKey,
            noHeader:       true,
            noRowCount:     true,
            itemsPerPage:   20,
            extraHtml:      combineLinkHtml
        });
        
        
        this.render();
        this.afterHtmlRender();
        
        this.afterHtmlRenderThis();
        
    }
    
    
    this._writeInlineStyle = function(){
        return `
        
        <style>
        /* Make checkboxes bigger for touch */
        .select-pig-checkbox {
            transform: scale(1.3);
            cursor: pointer;
        }

        /* Floating Action Button */
        .fab-button {
            position: fixed;
            bottom: 70px;
            right: 16px;
            width: 56px;
            height: 56px;
            border-radius: 28px;
            background-color: #2196F3;
            color: white;
            border: none;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            cursor: pointer;
            z-index: 1000;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }

        .fab-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background-color: #f44336;
            color: white;
            border-radius: 12px;
            padding: 2px 6px;
            font-size: 12px;
            font-weight: bold;
        }

        /* Selected row highlight */
        .row-selected {
            background-color: #e3f2fd;
        }

        /* Mobile touch optimization */
        @media (max-width: 768px) {
            .select-pig-checkbox {
                transform: scale(1.5);
            }
            
            td {
                padding: 12px 4px;
            }
        }
        
        
        /* Modal Overlay */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

/* Modal Container */
.modal-container {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 340px;
    max-height: 80vh;
    overflow: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* Modal Header */
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #eee;
}

.modal-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
}

/* Modal Close Button */
.modal-close {
    background: none;
    border: none;
    font-size: 32px;
    cursor: pointer;
    color: white;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-close:hover {
    color: #333;
}

/* Modal Body */
.modal-body {
    padding: 16px;
}

/* Modal Message */
.modal-message {
    font-size: 1.2rem;
    line-height: 1.5;
    margin-bottom: 12px;
    white-space: pre-line;
}

.modal-message.error {
    color: #d32f2f;
}

.modal-message.confirm {
    color: #333;
}

/* Modal Info Box */
.modal-info {
    background: #f5f5f5;
    padding: 10px;
    border-radius: 8px;
    font-size: 1.2rem;
    margin-top: 12px;
}

/* Modal Footer */
.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px;
    border-top: 1px solid #eee;
    flex-wrap: wrap;
}

/* Buttons */
.btn-primary {
    background: #2196F3;
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1.2rem;
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-secondary {
    background: #f5f5f5;
    color: #333;
    border: 1px solid #ddd;
    padding: 8px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1.2rem;
}


.modal-footer .btn,
.modal-footer .btn-primary,
.modal-footer .btn-secondary {
    flex: 0 0 auto;
    min-width: 120px;
}


/* For mobile screens */
@media (max-width: 480px) {
    .modal-footer {
        flex-direction: column;
        gap: 10px;
    }
    
    .modal-footer .btn,
    .modal-footer .btn-primary,
    .modal-footer .btn-secondary {
        width: 100%;
        flex: 1;
        text-align: center;
    }
}

/* For tablets and desktop */
@media (min-width: 481px) {
    .modal-footer {
        flex-direction: row;
    }
    
    .modal-footer .btn,
    .modal-footer .btn-primary,
    .modal-footer .btn-secondary {
        min-width: 120px;
        width: auto;
    }
}

/* Mobile optimization */
@media (max-width: 768px) {
    .modal-container {
        width: 95%;
        max-width: 320px;
    }
    
    
    .modal-header h3 {
        font-size: 1.3rem;
    }
    
    .modal-body {
        padding: 12px;
    }
}
        
        </style>
        `;
    }
    
    
    
    this.render = function(){
        let page_title          = settings.pageTitle;
        
        let page_info   = `
            This is a list of Fattening batches. This is auto generated. When  
            the Wean Date of a Lacta Production Entry is updated, that entry will be 
            updated to Fattening entry. The Add Entry is provided if you buy the
            piglets from outside.
        `;
        
        const helper = navigation.managerTranslations.translationHelper;

        page_title      = helper.getSimpleTranslation('navigation.nav_links.Production3') || page_title;
        page_info       = helper.getSimpleTranslation('page_info.fattening_list') || page_info;
        
        
        componentNavLeftRight   = new ComponentNavLeftRight({
           uniqueKey:           settings.uniqueKey,
           elemDivContainer:    elemDivContainer,
           pageTitle:           page_title
        });

        
        elemIdPageInfo          = `${settings.uniqueKey}-page-info`;
        
        
        
        const html_style        = thisObj._writeInlineStyle();
         
        const html_nav          = componentNavLeftRight.getHtml();    
           
        const html_table        = thisObj.getHtml();
           

           
        const html = `

${html_style}
        

<div class="mobile-container">
    ${html_nav}
    
    <div class="mobile-info-box" id="${elemIdPageInfo}">
        ${page_info}
    </div>
    
    
    ${html_table}

</div>
        `;
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRenderThis = function(){
        componentNavLeftRight.afterHtmlRender();
        
        this._findElementsThis();
        this._processAfterHtmlRenderThis();
        this._bindEventListenersThis();
    }
    
    
    this._findElementsThis = function(){
        elemPageInfo            = elemDivContainer.querySelector('#'+elemIdPageInfo);
        
        elemGroupTextLinkShow   = elemDivContainer.querySelector('#'+elemIdGroupTextLinkShow);
        elemGroupTextLink       = elemDivContainer.querySelector('#'+elemIdGroupTextLink);
        
        elemTableBody           = elemDivContainer.querySelector('#'+elemIdTableBody);
    }
    
    
    this._processAfterHtmlRenderThis = function(){
        componentNavLeftRight.callbackNavLeft = function(){
            navigation.managerNavLinks.onClickNavProdGestaLacta(null, 
                PIG_OPERATION_TYPE.LACTATING_PIGLETS, false, true);
        };
        
          
        componentNavLeftRight.callbackNavRight = function(){
            navigation.managerNavLinks.onClickNavProdHistory(null, true);
        };
        
        
        componentNavLeftRight.bindEventListeners();
        
        
        thisObj.setOnClickAddEntry(thisObj.onClickAddEntry);
    }
    
    
    this._bindEventListenersThis = function(){
        
        elemGroupTextLink.addEventListener('click', function() {
            thisObj.onClickCombineToGroup();
        });
        
    }
    

    this.show = function(){
        // So that not to instantiate in every table redraw
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        
        dataPigProdList = navigation.pigFarm.managerPigProd.dataFatteningList;
        
        
        // Set entry count; only show if mobile screen        
        let prod_count = 0;
        if (dataPigProdList){prod_count = dataPigProdList.length;}
        
        componentNavLeftRight.setEntryCount(prod_count);
        
        
        // Set elemGroupTextLinkShow visibility 
        if (prod_count < 2){
            elemGroupTextLinkShow.style.display = 'none';
        }
        else{
            elemGroupTextLinkShow.style.display = 'block';
        }
        
        thisObj.renderTable(dataPigProdList);
        
        thisObj.showInfoBox(dataPigProdList, elemPageInfo);
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
                <col style="width: 10%;">
                <col style="width: 18%;">
                <col style="width: 15%;">
                <col style="width: 15%;">
                <col style="width: 22%;">
            </colgroup>

            <thead>
                <tr>
                    <th>&nbsp;</th>
                    <th>
                        <div>PID, ${label_sow}</div> 
                        <div><span class="love-icon">❤️</span> ${label_boar}</div>
                    </th>
                    <th style="text-align:center;">${label_days}</th>
                    <th style="text-align:center;">${label_pigs}</th>
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
                <td colspan="5"><div>${label_no_entries}</div></td>
            </tr>
        `;
        return html;
    }
    

    this.getHtmlTableRow = function(cur_entry){
        const acc_settings_ops = navigation.pigFarm.getSettingsOperations();
        
        const target_harvest = farmPage.calculateDateTargetHarvest(cur_entry, 
            dtCurrentDate, acc_settings_ops);
        
        const hid = cur_entry.pig_production.hid;  
    
        // Checkbox with hid
        const html_checkbox = `<input type="checkbox" class="select-pig-checkbox" 
                                       data-hid="${hid}"
                                       style="transform: scale(1.5); cursor: pointer;">`;
            
        
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
                <td style="text-align:center;">${html_checkbox}</td>
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
        

            if (index == 1 || index == 2) {
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
            const target_harvest = farmPage.calculateDateTargetHarvest(
                cur_entry, dtCurrentDate, acc_settings_ops);
            
            
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
    
    
    this.getDataPigProd = function(pid, hid){
        // Most functions with getData*** always use entry_hid as 
        // input parameter. The DataPigProd will use pid instead
        // as this is highly visible by in the page.
        for (const cur_entry of dataPigProdList){
            if (pid){
                if(cur_entry.pig_production.farm_prod_id == pid){return cur_entry;}
            }
            
            if(hid){
                if(cur_entry.pig_production.hid == hid){return cur_entry;}
            }
        }
        return null;
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
    
    
    this.checkGroupSelection = function(list_entries_selected){
        let list_group          = [];
        let list_prod_entries   = [];
        
        
        for (const cur_entry of list_entries_selected){
            
            let cur_entry_flag = 0;
            
            if ('flag' in cur_entry.pig_production){
                cur_entry_flag = cur_entry.pig_production.flag;
            }  
            
            if ((cur_entry_flag & FLAG_BIT_IS_A_GROUP) > 0){
                list_group.push({
                    'hid': cur_entry.pig_production.hid,
                    'pid': cur_entry.pig_production.farm_prod_id 
                });
            }
            else{
                list_prod_entries.push({
                    'hid': cur_entry.pig_production.hid,
                    'pid': cur_entry.pig_production.farm_prod_id 
                });
            }
        } 
        
        return {
            groups:         list_group,
            prod_entries:   list_prod_entries
        }
        
    }
    
    
    this.onClickCombineToGroup = function(){
        let label_min_two_entries   = 'Please select at least two production entries to form a group.';
        let label_no_group_to_group = 'Cannot combine group to group. Please select only individual production entries.';
        
        let label_msg_add_to_group  = `The following PID will be added to existing Group PID {group_pid}:\n\n{list_pid}\n\nThe individual entries will no longer be listed in Fattening List and can only be found in Production History List.`;
        let label_save_add_to_group = 'Add to Group';
        
        let label_msg_create_group  = `The following PID will be formed into a Group:\n\n{list_pid}\n\nThe individual entries will no longer be listed in Fattening List and can only be found in Production History List. The new Group will be listed in Fattening List`;
        let label_save_create_group = 'Create Group';
        
        const helper = navigation.managerTranslations.translationHelper;
        
        label_min_two_entries       = helper.getSimpleTranslation('page_fattening_list.labels.min_two_entries') || label_min_two_entries;
        label_no_group_to_group     = helper.getSimpleTranslation('page_fattening_list.labels.no_group_to_group') || label_no_group_to_group;
        
        label_msg_add_to_group      = helper.getSimpleTranslation('page_fattening_list.labels.msg_add_to_group') || label_msg_add_to_group;
        label_save_add_to_group     = helper.getSimpleTranslation('page_fattening_list.labels.save_add_to_group') || label_save_add_to_group;
        
        label_msg_create_group      = helper.getSimpleTranslation('page_fattening_list.labels.msg_create_group') || label_msg_create_group;
        label_save_create_group     = helper.getSimpleTranslation('page_fattening_list.labels.save_create_group') || label_save_create_group;
        
        // Helper function to replace placeholders
        const replacePlaceholders = function(template, replacements) {
            let result = template;
            for (const key in replacements) {
                const regex = new RegExp('\\{' + key + '\\}', 'g');
                result = result.replace(regex, replacements[key]);
            }
            return result;
        };
        
        // Get all selected checkboxes
        const selectedCheckboxes = elemDivContainer.querySelectorAll('.select-pig-checkbox:checked');
        const selectedHids = Array.from(selectedCheckboxes).map(cb => cb.getAttribute('data-hid'));
        
        // Get the actual data objects for selected HIDs
        const selectedEntries = [];
        for (const hid of selectedHids) {
            const entry = thisObj.getPigProdByHid(hid);
            if (entry) selectedEntries.push(entry);
        }
        
        // Check if at least 2 entries selected
        if (selectedEntries.length < 2) {
            thisObj.showGroupModal({
                type:       'error',
                message:    label_min_two_entries,
                showCancel: false,
                showSave:   false
            });
            return;
        }
        
        // Check selection and categorize
        const selectionResult = thisObj.checkGroupSelection(selectedEntries);
        
        // Check if trying to combine group with group
        if (selectionResult.groups.length > 1) {
            thisObj.showGroupModal({
                type:       'error',
                message:    label_no_group_to_group,
                showCancel: false,
                showSave:   false
            });
            return;
        }
        
        // Build PID list string
        const buildPidList = function(entries) {
            let pidList = '';
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                
                const pid = entry.pid;
                pidList += `   PID ${pid}`;
                if (i < entries.length - 1) pidList += '\n';
            }
            return pidList;
        };
        
        // Build confirmation message with replacements
        let message = '';
        let groupInfo = null;
        
        if (selectionResult.groups.length === 1) {
            // Adding to existing group
            groupInfo = selectionResult.groups[0];
            const pidList = buildPidList(selectionResult.prod_entries);
            
            message = replacePlaceholders(label_msg_add_to_group, {
                'group_pid': groupInfo.pid,
                'list_pid': pidList
            });
            
            thisObj.showGroupModal({
                type:           'confirm_add',
                message:        message,
                groupInfo:      groupInfo,
                entriesToAdd:   selectionResult.prod_entries,
                showCancel:     true,
                showSave:       true,
                saveText:       label_save_add_to_group
            });
        } 
        else {
            // Creating new group from individuals
            const pidList = buildPidList(selectionResult.prod_entries);
            
            message = replacePlaceholders(label_msg_create_group, {
                'list_pid': pidList
            });
            
            thisObj.showGroupModal({
                type:               'confirm_create',
                message:            message,
                entriesToCombine:   selectionResult.prod_entries,
                showCancel:         true,
                showSave:           true,
                saveText:           label_save_create_group
            });
        }
    }


    this.getTotalPigsFromEntries = function(entries) {
        let total = 0;
        for (const entry of entries) {
            total += entry.pig_production.cur_pig_count || 0;
        }
        return total;
    }


    this.getPigProdByHid = function(hid) {
        return thisObj.getDataPigProd(null, hid);
    }


    this.showGroupModal = function(options) {
        // Remove existing modal if any
        const existingModal = elemDivContainer.querySelector('#group-modal-overlay');
        if (existingModal) existingModal.remove();
        
        
        let label_cannot_combine    = 'Cannot Combine';
        let label_confirm_combine   = 'Confirm Combine';
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_cannot_combine        = helper.getSimpleTranslation('page_fattening_list.labels.cannot_combine') || label_cannot_combine;
        label_confirm_combine       = helper.getSimpleTranslation('page_fattening_list.labels.confirm_combine') || label_confirm_combine;
        
        const label_header = options.type === 'error' ? label_cannot_combine : label_confirm_combine;
        
        const modalHtml = `
            <div id="group-modal-overlay" class="modal-overlay">
                <div class="modal-container">
                    <div class="modal-header">
                        <h3>${label_header}</h3>
                        <button class="modal-close" id="modal-close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-message ${options.type}">
                            ${options.message.replace(/\n/g, '<br>')}
                        </div>
                        ${options.groupInfo ? `
                            <div class="modal-info">
                                <strong>Target Group:</strong> PID ${options.groupInfo.pid}
                            </div>
                        ` : ''}
                    </div>
                    <div class="modal-footer">
                        ${options.showCancel ? '<button id="modal-cancel-btn" class="btn-secondary">Cancel</button>' : ''}
                        ${options.showSave ? `<button id="modal-save-btn" class="btn-primary">${options.saveText || 'Confirm'}</button>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        elemDivContainer.insertAdjacentHTML('beforeend', modalHtml);
        
        const modalOverlay  = elemDivContainer.querySelector('#group-modal-overlay');
        const closeBtn      = modalOverlay.querySelector('#modal-close-btn');
        const cancelBtn     = modalOverlay.querySelector('#modal-cancel-btn');
        const saveBtn       = modalOverlay.querySelector('#modal-save-btn');
        
        const closeModal = function(){modalOverlay.remove()};
        
        if (closeBtn) closeBtn.onclick = closeModal;
        if (cancelBtn) cancelBtn.onclick = closeModal;
        
        modalOverlay.onclick = function(e){
            if (e.target === modalOverlay) closeModal();
        };
        
        if (saveBtn) {
            saveBtn.onclick = function(){

                const list_selected_hid = [];
                let group_hid = null;
                 
                // Populate based on modal type
                if (options.type === 'confirm_create' && options.entriesToCombine) {
                    for (const entry of options.entriesToCombine) {
                        list_selected_hid.push(entry.hid);
                    }
                } else if (options.type === 'confirm_add' && options.entriesToAdd) {
                    // For adding to existing group, the group is separate
                    // The group is in options.groupInfo, not in entriesToAdd
                    for (const entry of options.entriesToAdd) {
                        list_selected_hid.push(entry.hid);
                    }
                    
                    // Get the group_hid from groupInfo
                    if (options.groupInfo && options.groupInfo.hid) {
                        group_hid = options.groupInfo.hid;
                    }
                }
                
                       
                if (list_selected_hid.length === 0) {
                    alert('No entries selected');
                    return;
                }
                
                
                thisObj.onClickCreateGroup(list_selected_hid, group_hid);
                closeModal();
            };
        }
    }

     
    this.showLoadingOverlay = function(message) {
        let overlay = elemDivContainer.querySelector('#loading-overlay');
        if (overlay) overlay.remove();
        
        const html = `
            <div id="loading-overlay" class="loading-overlay">
                <div class="loading-spinner"></div>
                <div class="loading-text">${message || 'Processing...'}</div>
            </div>
        `;
        elemDivContainer.insertAdjacentHTML('beforeend', html);
    }


    this.hideLoadingOverlay = function() {
        const overlay = elemDivContainer.querySelector('#loading-overlay');
        if (overlay) overlay.remove();
    }
    
    
    this.onClickCreateGroup = function(list_selected_hid, group_hid){
        let input_elem      = null;
        let validation      = 0;
        
        
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
            return;
        } 
        
        
        
        const user_hid      = navigation.userControl.getUserHid();
        const base_url      = window.location.origin;
        
        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'list_prod_hid':    list_selected_hid
        };
        
        if (group_hid){
            post_data.group_hid = group_hid;
        }
        
        let url = `${base_url}/production_group/add`;
        
        
        const bearer_token = localStorage.getItem('access_token');
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
                thisObj.elemServerErrorMsg.style.display = 'none';
            },
  
            success: function(response){
                if (response.result.num == 0){
                    // This should request Fattening list and refresh page
                    const callback_success = function(){
                        thisObj.show();
                    };
                    
                    const callback_offline = function(){
                        // TODO: what to do
                    };
                    
                    const pig_prod_type     = PIG_PROD_TYPE.FATTENING;
                    const elem_show_error   = thisObj.elemServerErrorMsg;
                    
                    navigation.pigFarm.managerPigProd.requestPigProdList(
                        pig_prod_type, callback_success, 
                        callback_offline, elem_show_error
                    );
                    
                }
                else{
                    navigation.serverError.receivedErrorMessage(
                        response, thisObj.elemServerErrorMsg);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
        
    }
    
    
    this.onClickAddEntry = function(){
        const next_page_id      = PAGE_ID.PROD_FATTENING_ADD;
        const next_page_hash    = HASH_ROUTES.PROD_FATTENING_ADD;
        
        // Get current route for return navigation
        const currentRoute  = navigation.managerHashRoute.hashRouter.getCurrentRoute();
        const listRoute     = HASH_ROUTES.PROD_FATTENING_LIST;
        
        // Use hash router for navigation
        navigation.managerHashRoute.hashRouter.navigate(next_page_hash, {
            pageId: next_page_id,
            isAdd:  true,
            returnRoute: listRoute,
            returnPageId: PAGE_ID.PROD_FATTENING_LIST
        });
        
        // Show the add/edit page (handleHashRoute will also show, but this ensures immediate response)
        const next_page = navigation.getPageContainer(next_page_id);
        navigation.showThisPage(next_page);
        
        // Prepare options for the add/edit page
        const options = {
            is_add:         true,
            returnRoute:    listRoute,
            returnPageId:   PAGE_ID.PROD_FATTENING_LIST
        };
        
        navigation.pageProdFatteningAdd.show(options);
    };
    
}
