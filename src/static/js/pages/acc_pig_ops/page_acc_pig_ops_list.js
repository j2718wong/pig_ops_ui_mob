// December 25, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageTableBasic}         from '../common/page_table_basic.js';


import {PAGE_ID,
        APPLICATION,
        PIG_OPERATION_TYPE}     from '../../constants.js';

import {TextTranslation}        from '../common/translation.js';

import {TRANSLATION_PAGE_ACC_PIG_OPS}   from '../../translations/page_acc_pig_ops_i8n.js'

import {textSubstituteToControl}        from '../navigation/text_substitute_control.js';



export function PageAccPigOpsList(input_settings){
    PageTableBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    /*
    Typical input_settings
    {
        navigation:             navigation,
        elemIdDivContainer:     '<element>',
        uniqueKey:              acc-pig-ops
    }   
    */ 
    const settings              = input_settings;
    
    
    // This is needed as this will be first element to be rendered
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);



    let elemIdNavPrevEntry      = null;
    let elemIdNavNextEntry      = null;

    let elemIdPageTitle         = null;
    let elemIdEntryCount        = null;
    let elemIdPageInfo          = null;

    let elemIdTableBody         = null;


    let elemNavPrevEntry        = null;
    let elemNavNextEntry        = null;

    let elemPageTitle           = null;
    let elemEntryCount          = null;
    let elemPageInfo            = null;

    let elemTableBody           = null;
    

    let textTranslation         = new TextTranslation();
    let curUserLanguageKey      = 'en';


    let dataAccGestatingOps     = [];
    let dataAccLactatingPigletOps= [];
    let dataAccLactatingSowOps  = [];
    let dataAccWeaningSowOps    = [];
    let dataAccGiltOps          = [];

    let curAccPigOpsType        = null;
    let curDataAccPigOpsList    = null;


    let curDataEntry            = null;
    
    
    
    
    this.init = function(){
        textTranslation.setTranslations(TRANSLATION_PAGE_ACC_PIG_OPS);

        thisObj.setSettingsTable({
            uniqueKey:      settings.uniqueKey,
            noHeader:       true,
            itemsPerPage:   20
        });
        
        

        this.render();
        this.afterHtmlRender(); // Will call parent.afterHtmlRender 
        
        this.afterHtmlRenderThis();
    }
    
    
    
    
    
    this.render = function(){
        elemIdNavPrevEntry      = `${settings.uniqueKey}-page-title-prev`;
        elemIdNavNextEntry      = `${settings.uniqueKey}-page-title-next`;
        
        elemIdPageTitle         = `${settings.uniqueKey}-page-title`;
        elemIdEntryCount        = `${settings.uniqueKey}-page-title-entry-count`;
        elemIdPageInfo          = `${settings.uniqueKey}-page-info`;
        
        
        const html_table        = thisObj.getHtml();
        
        
        const html = `
        
    <div class="mobile-container">
        
        <div class="nav-left-right">
            <button class="nav-button blue" id="${elemIdNavPrevEntry}"><i class="fa-solid fa-arrow-left"></i></button>
                    
            <span>
                <span class="nav-title blue" id="${elemIdEntryCount}"></span>
                <span class="nav-title blue" id="${elemIdPageTitle}"></span>
            </span>
            
            <button class="nav-button blue" id="${elemIdNavNextEntry}"><i class="fa-solid fa-arrow-right"></i></button>
                
        </div>
        
        
        <!-- Mobile Info Box -->
        <div class="mobile-info-box" style="margin-bottom:10px;">
            <div class="info-text" id="${elemIdPageInfo}">
                Track and manage all pig farming operations. Each card shows operation details including day count, description, and last update information. Tap the edit icon to modify or delete operations.
            </div>
        </div>
        
        ${html_table}
        
    </div>
        `;
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRenderThis = function(){
        elemNavPrevEntry        = document.getElementById(elemIdNavPrevEntry);
        elemNavNextEntry        = document.getElementById(elemIdNavNextEntry);
        
        elemPageTitle           = document.getElementById(elemIdPageTitle);
        elemPageInfo            = document.getElementById(elemIdPageInfo);
        
        elemTableBody           = document.getElementById(elemIdTableBody);
        
        
        // Set onclick listener to parent object
        thisObj.setOnClickAddEntry(thisObj.onClickAddEntry); 
    }
    
        
    this.setDataAccPigOpsList = function(data, operation_type){
        if (operation_type){
            switch(operation_type){
                case PIG_OPERATION_TYPE.GESTATING:{
                    dataAccGestatingOps         = data;
                    break;
                }
                
                case PIG_OPERATION_TYPE.LACTATING_PIGLETS:{
                    dataAccLactatingPigletOps   = data;
                    break;
                }
                
                case PIG_OPERATION_TYPE.LACTATING_SOW:{
                    dataAccLactatingSowOps      = data;
                    break;
                }
                
                case PIG_OPERATION_TYPE.WEANING_SOW:{
                    dataAccWeaningSowOps        = data;
                    break;
                }
                
                case PIG_OPERATION_TYPE.GILT:{
                    dataAccGiltOps              = data;
                    break;
                }
            }
        }
        
        else{
            // Separate by operation type
            dataAccGestatingOps         = [];
            dataAccLactatingPigletOps   = [];
            dataAccLactatingSowOps      = [];
            dataAccWeaningSowOps        = [];
            dataAccGiltOps              = [];
        
        
            for (const cur_entry of data){
                switch(cur_entry.acc_pig_ops.operation_type){
                    case PIG_OPERATION_TYPE.GESTATING:{
                        dataAccGestatingOps.push(cur_entry);
                        break;
                    }
                    
                    case PIG_OPERATION_TYPE.LACTATING_PIGLETS:{
                        dataAccLactatingPigletOps.push(cur_entry);
                        break;
                    }
                    
                    case PIG_OPERATION_TYPE.LACTATING_SOW:{
                        dataAccLactatingSowOps.push(cur_entry);
                        break;
                    }
                    
                    case PIG_OPERATION_TYPE.WEANING_SOW:{
                        dataAccWeaningSowOps.push(cur_entry);
                        break;
                    }
                    
                    case PIG_OPERATION_TYPE.GILT:{
                        dataAccGiltOps.push(cur_entry);
                        break;
                    }
                }
            }
        }
    }
    
    
    // Handle window resize for view switching
    this.handleWindowResize = function() {
        const isMobile = window.innerWidth <= APPLICATION.MAX_WIDTH_WINDOW_IS_MOBILE;
    
    }
    
    
    this.show = function(pig_ops_type){
        // Change only if needed
        if (pig_ops_type){
            curAccPigOpsType = pig_ops_type;
        }
        
        switch(curAccPigOpsType){
            case PIG_OPERATION_TYPE.GESTATING:{
                curDataAccPigOpsList = dataAccGestatingOps;
                
                // Set up listeners for navigation arrows
                elemNavPrevEntry.onclick = function(){
                    navigation._onClickNavAccOpsSettings(null);
                }
        
                elemNavNextEntry.onclick = function(){
                    navigation._onClickNavAccPigOps(null, PIG_OPERATION_TYPE.LACTATING_PIGLETS);
                }
                break;
            }
            
            case PIG_OPERATION_TYPE.LACTATING_PIGLETS:{
                curDataAccPigOpsList = dataAccLactatingPigletOps;
                
                // Set up listeners for navigation arrows
                elemNavPrevEntry.onclick = function(){
                    navigation._onClickNavAccPigOps(null, PIG_OPERATION_TYPE.GESTATING);
                }
        
                elemNavNextEntry.onclick = function(){
                    navigation._onClickNavAccPigOps(null, PIG_OPERATION_TYPE.LACTATING_SOW);
                }
                break;
            }
            
            case PIG_OPERATION_TYPE.LACTATING_SOW:{
                curDataAccPigOpsList = dataAccLactatingSowOps;
                
                // Set up listeners for navigation arrows
                elemNavPrevEntry.onclick = function(){
                    navigation._onClickNavAccPigOps(null, PIG_OPERATION_TYPE.LACTATING_PIGLETS);
                }
        
                elemNavNextEntry.onclick = function(){
                    navigation._onClickNavAccPigOps(null, PIG_OPERATION_TYPE.WEANING_SOW);
                }
                break;
            }
            
            case PIG_OPERATION_TYPE.WEANING_SOW:{
                curDataAccPigOpsList = dataAccWeaningSowOps;
                
                // Set up listeners for navigation arrows
                elemNavPrevEntry.onclick = function(){
                    navigation._onClickNavAccPigOps(null, PIG_OPERATION_TYPE.LACTATING_SOW);
                }
        
                elemNavNextEntry.onclick = function(){
                    navigation._onClickNavAccPigOps(null, PIG_OPERATION_TYPE.GILT);
                }
                break;
            }
            
            case PIG_OPERATION_TYPE.GILT:{
                curDataAccPigOpsList = dataAccGiltOps;
                
                // Set up listeners for navigation arrows
                elemNavPrevEntry.onclick = function(){
                    navigation._onClickNavAccPigOps(null, PIG_OPERATION_TYPE.WEANING_SOW);
                }
        
                elemNavNextEntry.onclick = function(){
                    navigation._onClickNavAccOpsSettings(null);
                }
                break;
            }
        }
        
        
        thisObj.renderTable(curDataAccPigOpsList);

        thisObj.onUserChangeLanguage();
    }
    
    
    this._writeInlineStyle = function(){
        const html = `
        <style>
            
            /* Updated Table Styles */
            .table-acc-pig-ops td {padding-right:0}
            .table-acc-pig-ops th {padding-right:0}
        </style>
        `;
        return html;

    }
    
    
    this.getElemTableBody = function(){
        return elemTableBody;
    }

    
    this.getHtmlTableHeader = function(){
        elemIdTableBody         = `${settings.uniqueKey}-table-tbody`;
        
        const html_style = this._writeInlineStyle();
        
        
        const html = `
        ${html_style}
        
        <table class="data-table table-acc-pig-ops" id="">
            <colgroup>
                <col style="width: 15%;">
                <col style="width: 35%;">
                <col style="width: 50%;">
            </colgroup>
            
            <thead>
                <tr>
                    <th>Day</th>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
            </thead>
            
            <tbody id="${elemIdTableBody}">
            </tbody>
        </table>
        
        `;
        
        return html;
        
    }
       

    this.getHtmlTableRowEmpty = function(){
        const html = `
            <tr>
                <td colspan="3"><div>No Entries</div></td>
            </tr>
        `;
        return html;
    }
    

    this.getHtmlTableRow = function(cur_entry){
        
        let description = '';
        if (cur_entry.acc_pig_ops.desc){
            description = cur_entry.acc_pig_ops.desc;
        }
        
        
        const html = `
            <tr>
                <td><span>${cur_entry.acc_pig_ops.num_days_since}</span></td>
                <td>${cur_entry.acc_pig_ops.name}</td>
                <td>${description}</td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.getElemTableRow = function(cur_entry){
        const elem_row = document.createElement('tr');
        
        const html = thisObj.getHtmlTableRow(cur_entry);
        elem_row.innerHTML = html;
         

        
        // TODO still evaluating if onclick is for row, td or span in td;
        // To avoid un necessary clicks while scrolling. 
        
        
        // Attach onclick listeners to td
        
        const elem_tds = elem_row.querySelectorAll('td'); 
        
        let index = 0
        for (const cur_td of elem_tds){

            if (index == 1 || index == 2){
                cur_td.onclick = function(){
                    thisObj.onClickRowEntry(cur_entry.acc_pig_ops.hid);
                }
            }
            
            index += 1;
        
        }
        
        return elem_row;
    }
  
    
    
    this.onUserChangeLanguage = function(){
        
        let cur_text = null;
        
        
        switch(curAccPigOpsType){
            case PIG_OPERATION_TYPE.GESTATING:{
                cur_text = textTranslation.getTranslatedText(
                    curUserLanguageKey, 'gestating_ops.title');
                if (cur_text != null){
                    elemPageTitle.innerHTML = cur_text;
                }
                
                
                cur_text = textTranslation.getTranslatedText(
                    curUserLanguageKey, 'gestating_ops.info_text');
                    
                if (cur_text != null){
                    const substitute_list = textSubstituteToControl(cur_text);
                    
                    for (const cur_entry of substitute_list){
                        cur_text = cur_text.replaceAll(cur_entry.key, cur_entry.substitute);
                    }
                    
                    elemPageInfo.innerHTML = cur_text;
                    
                    const buttons_gesta = elemPageInfo.querySelectorAll('.gestating'); 
                    for(const cur_entry of buttons_gesta){
                        cur_entry.onclick = function(){
                            navigation._onClickNavProdGestaLacta(null, 
                                PIG_OPERATION_TYPE.GESTATING);
                        };
                    } 
                    
                    const buttons_lacta = elemPageInfo.querySelectorAll('.lactating'); 
                    for(const cur_entry of buttons_lacta){
                        cur_entry.onclick = function(){
                            navigation._onClickNavProdGestaLacta(null, 
                                PIG_OPERATION_TYPE.LACTATING_PIGLETS);
                        };
                    } 
                    
                }
                
                break;
            }
            
            case PIG_OPERATION_TYPE.LACTATING_PIGLETS:{
                cur_text = textTranslation.getTranslatedText(
                    curUserLanguageKey, 'lactating_piglets_ops.title');
                if (cur_text != null){
                    elemPageTitle.innerHTML = cur_text;
                }
                
                
                cur_text = textTranslation.getTranslatedText(
                    curUserLanguageKey, 'lactating_piglets_ops.info_text');
                if (cur_text != null){
                    const substitute_list = textSubstituteToControl(cur_text);
                    
                    for (const cur_entry of substitute_list){
                        cur_text = cur_text.replaceAll(cur_entry.key, cur_entry.substitute);
                    }
                    
                    elemPageInfo.innerHTML = cur_text;
                }
                
                break;
            }
            
            case PIG_OPERATION_TYPE.LACTATING_SOW:{
                cur_text = textTranslation.getTranslatedText(
                    curUserLanguageKey, 'lactating_sow_ops.title');
                if (cur_text != null){
                    elemPageTitle.innerHTML = cur_text;
                }
                
                
                cur_text = textTranslation.getTranslatedText(
                    curUserLanguageKey, 'lactating_sow_ops.info_text');
                if (cur_text != null){
                    const substitute_list = textSubstituteToControl(cur_text);
                    
                    for (const cur_entry of substitute_list){
                        cur_text = cur_text.replaceAll(cur_entry.key, cur_entry.substitute);
                    }
                    
                    elemPageInfo.innerHTML = cur_text;
                }
                
                break;
            }
            
            case PIG_OPERATION_TYPE.WEANING_SOW:{
                cur_text = textTranslation.getTranslatedText(
                    curUserLanguageKey, 'weaning_sow_ops.title');
                if (cur_text != null){
                    elemPageTitle.innerHTML = cur_text;
                }
                
                
                cur_text = textTranslation.getTranslatedText(
                    curUserLanguageKey, 'weaning_sow_ops.info_text');
                if (cur_text != null){
                    const substitute_list = textSubstituteToControl(cur_text);
                    
                    for (const cur_entry of substitute_list){
                        cur_text = cur_text.replaceAll(cur_entry.key, cur_entry.substitute);
                    }
                    
                    elemPageInfo.innerHTML = cur_text;
                }
                
                break;
            }
            
            case PIG_OPERATION_TYPE.GILT:{
                cur_text = textTranslation.getTranslatedText(
                    curUserLanguageKey, 'gilt_ops.title');
                if (cur_text != null){
                    elemPageTitle.innerHTML = cur_text;
                }
                
                
                cur_text = textTranslation.getTranslatedText(
                    curUserLanguageKey, 'gilt_ops.info_text');
                if (cur_text != null){
                    
                    const substitute_list = textSubstituteToControl(cur_text);
                    
                    for (const cur_entry of substitute_list){
                        cur_text = cur_text.replaceAll(cur_entry.key, cur_entry.substitute);
                    }
                    
                    elemPageInfo.innerHTML = cur_text;
                }
                
                break;
            }
        }
        
        
        // Update entry_count
        if (navigation.curScreenIsMobile == true){
            elemEntryCount     = document.getElementById(elemIdEntryCount);
            elemEntryCount.textContent = curDataAccPigOpsList.length;
        }
    }
    
    
    this.getDataAccPigOps = function(entry_hid){
        for (const cur_entry of curDataAccPigOpsList){
            if(cur_entry.acc_pig_ops.hid == entry_hid){return cur_entry;}
        }
        return null;
    }
    
    
    this.searchEntries = function(key){
        if (key == '') {return curDataAccPigOpsList;}
        
        const filtered_entries  = [];
        
        for (const cur_entry of curDataAccPigOpsList){
            const u_name = cur_entry.acc_pig_ops.name.toUpperCase();
            
            if (u_name.includes(key)){
                filtered_entries.push(cur_entry);
                continue;
            }
            
            if (cur_entry.acc_pig_ops.desc){
                const u_desc = cur_entry.acc_pig_ops.desc.toUpperCase();
                if (u_desc.includes(key)){
                    filtered_entries.push(cur_entry);
                    continue;
                }
            }
            
        }
        
        return filtered_entries;
    }
    
    
    this.onClickAddEntry = function(){
        let go_back_page_id = PAGE_ID.ACC_PIG_OPS_LIST;
        
        const go_back_page = navigation.getPageContainer(go_back_page_id);
        
        
        const options ={
            operation_type:         curAccPigOpsType,
            is_add:                 true,   // false is edit
            callback_after_add:     thisObj.onSuccessAddEntry,
            go_back_page:           go_back_page   
        }
        
        navigation.pageAccPigOpsAddEdit.beforeShow(options);
        const page_container = navigation.getPageContainer(PAGE_ID.ACC_PIG_OPS_ADD_EDIT);
        navigation.showThisPage(page_container);
        
        
    }
    
    
    this.onSuccessAddEntry = function(){
        
    }
    
    
    this.onSuccessEditEntry = function(){
        
    }
    
    
    this.onClickRowEntry = function(entry_hid){
        const data_acc_pig_ops = thisObj.getDataAccPigOps(entry_hid);   
        
        const go_back_page_id = PAGE_ID.ACC_PIG_OPS_LIST;
        const go_back_page = navigation.getPageContainer(go_back_page_id);
    
        const options ={
            operation_type:         curAccPigOpsType,
            is_add:                 false,   // false is edit
            callback_after_edit:    thisObj.onSuccessEditEntry,
            go_back_page:           go_back_page 
        }
        navigation.pageAccPigOpsAddEdit.beforeShow(options, data_acc_pig_ops);
        
        
        const goto_page_id   = PAGE_ID.ACC_PIG_OPS_ADD_EDIT;
        const page_container = navigation.getPageContainer(goto_page_id);
        navigation.showThisPage(page_container);
    }
    
}
