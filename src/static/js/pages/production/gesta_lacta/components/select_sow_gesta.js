// January 13, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PAGE_ID,
        SOW_STATUS,
        SOW_BOAR_TYPE,
        PIG_PROD_TYPE,
        PIG_OPERATION_TYPE,
        SUPPLIER_TYPE}          from '../../../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}         from '../../../../utils.js';


import {DEFAULT_LABEL_PLEASE_SELECT,
        DEFAULT_LABEL_NO_ENTRIES,   
        DEFAULT_LABEL_ENTRY,        
        DEFAULT_LABEL_ENTRIES}  from '../../../common/ui/select_with_entry_count.js';


import {UiBasic}                from '../../../common/ui/ui_basic.js';

import {CommonSelectOptions}    from '../../../common/common_select_options.js';


export function SelectSowGesta(input_settings){
    UiBasic.call(this);
    
    /* Typical settings
    settings = {
        navigation:             navigation,
        uniqueKey:              ''
        
        pageDivContainer:       elemDivContainer,
        
        labelSelect:            ''
        helpText:               ''
        
    }
    
    
    */
    const thisObj               = this;
    const settings              = input_settings;
    const navigation            = input_settings.navigation;
    
    
    const pageDivContainer      = settings.pageDivContainer;
    
    const commonSelectOptions   = new CommonSelectOptions(navigation);
    

    const elemIdUiShow          = `${settings.uniqueKey}-show`;
    const elemIdSelect          = `${settings.uniqueKey}-select`;
    const elemIdEntryCount      = `${settings.uniqueKey}-entry-count`;
    const elemIdEntryAdd        = `${settings.uniqueKey}-entry-add`;
    
    const elemIdSowStatusShow   = `${settings.uniqueKey}-status-show`;
    const elemIdSowLastInsem    = `${settings.uniqueKey}-last-insem`;
    const elemIdSowLastPid      = `${settings.uniqueKey}-last-pid`;
        
        
    let elemSelect              = null;
    let elemEntryCount          = null;
    let elemEntryAdd            = null;
    
    
    let elemSowStatusShow       = null;
    let elemSowLastInsem        = null;
    let elemSowLastPid          = null;
    
    
    let label_please_select     = DEFAULT_LABEL_PLEASE_SELECT;
    let label_no_entries        = DEFAULT_LABEL_NO_ENTRIES;
    let label_entry             = DEFAULT_LABEL_ENTRY;
    let label_entries           = DEFAULT_LABEL_ENTRIES;
    
    
    // Breeding warning
    let label_warning_header       = "Sow Already Bred";
    let label_warning_message      = "This sow was last bred on {date} with production PID: {pid}. If this new entry will be saved, the previous production gestating entry will be marked as {not_pregnant} and will be removed from the {prod_gestating_list}. Please ensure this is an intentional breeding due to sow reheat. {cannot_undo}";
    let label_cannot_undo          = "This cannot be undone.";  
    let label_not_pregnant         = "Not Pregnant";
    let label_prod_gestating_list  = "Prod Gestating List";
    
    
    
    const translations = window.SUPERPIG_TRANSLATIONS;

    if (translations){
        if (translations.common && translations.common.labels){
            const labels_common = translations.common.labels;
            
            if (labels_common){
                if (labels_common.please_select){
                    label_please_select = labels_common.please_select;
                }
                
                if (labels_common.select_no_entries){
                    label_no_entries = labels_common.select_no_entries;
                } 
                
                if (labels_common.entry){
                    label_entry = labels_common.entry;
                }
                
                if (labels_common.entries){
                    label_entries = labels_common.entries;
                } 

            }
            
        }
        
        
        if (translations.page_gestating_add && 
            translations.page_gestating_add.labels){
            
            const labels_page = translations.page_gestating_add.labels;
            
            if (labels_page) {
                
                const labels_warning = labels_page.breeding_warning;
                
                if (labels_warning.header){
                    label_warning_header = labels_warning.header;
                }
                
                if (labels_warning.message){
                    label_warning_message = labels_warning.message;
                }
                
                if (labels_warning.cannot_undo){
                    label_cannot_undo = labels_warning.cannot_undo;
                }
                
                
                if (labels_warning.not_pregnant){
                    label_not_pregnant = labels_warning.not_pregnant;
                }
                
                if (labels_warning.prod_gestating_list){
                    label_prod_gestating_list = labels_warning.prod_gestating_list;
                }
            }
        }
    }
    
    
    
    
    let dataSowList             = null;
    
    
    // It is possible to make new Gestating entry os an already gestated sow.
    // This means that the previous breeding results to not pregnant.
    this.isSelectedSowGestating = null;
    
    
    this.getHtml = function(){
        
        return `
        <div class="form-group-select" id="${elemIdUiShow}">
        
            <label for="${elemIdSelect}" class="form-label">
                ${settings.labelSelect} <span class="entries-count" id="${elemIdEntryCount}"></span>
            </label>
            
            <div class="input-group">
                <select class="form-select" id="${elemIdSelect}">
                    <option value="-1" selected disabled>${label_no_entries}</option>
                </select>
                <button class="btn" type="button" id="${elemIdEntryAdd}">
                    <i class="bi bi-plus"></i> New
                </button>
            </div>
            
            
            <div id="${elemIdSowStatusShow}" class="warning-box" style="display: none;">
                <div class="warning-header">
                    <i class="bi bi-exclamation-triangle-fill warning-icon"></i>
                    <span class="warning-header-text"></span>
                </div>
                <div class="warning-details">
                    <span class="warning-message-text"></span>
                </div>
            </div>
            
        </div>
        `
        ;
        
    }
    
    
    this._findElements = function(){
        thisObj.elemUiShow      = pageDivContainer.querySelector('#'+elemIdUiShow);
       
        elemSelect              = pageDivContainer.querySelector('#'+elemIdSelect);
        elemEntryCount          = pageDivContainer.querySelector('#'+elemIdEntryCount);
        elemEntryAdd            = pageDivContainer.querySelector('#'+elemIdEntryAdd);
        
        elemSowStatusShow       = pageDivContainer.querySelector('#'+elemIdSowStatusShow);
    
    
        // New: elements for dynamic content
        thisObj.elemWarningHeader  = pageDivContainer.querySelector('.warning-header-text');
        thisObj.elemWarningMessage = pageDivContainer.querySelector('.warning-message-text');
        thisObj.elemCannotUndo     = pageDivContainer.querySelector('.warning-cannot-undo');
    }
    
    
    this._bindEventListeners = function(){
        elemSelect.addEventListener('change', function(){
            thisObj.onChangeSow();
        });
        
        
        elemEntryAdd.addEventListener('click', function() {
            // Should open SowBoarAddEdit page.
            // after success add or cancel/close should go back to this page
            
            // Show Container
            const next_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_ADD_EDIT);
            
            // Push currentPage to NavHistory; 
            // Will also compare current page and  next_page NAV_MENU_GROUP.
            navigation.pushCurrentPageToNavHistory(next_page);
            
            navigation.showThisPage(next_page);
            
            
            
            // Show Page
            const options_sow_boar ={
                is_add:         true,
                sow_boar_type:  SOW_BOAR_TYPE.SOW, 
                go_back_page:   settings.pageDivContainer   // Go back to this page
            }
            
            
            const callback_success = function(new_sow_boar_hid){
                const cur_sow = thisObj.getDataSow(new_sow_boar_hid);
                
                if (cur_sow == null){return;}
                if (cur_sow.sow_boar.is_production_ready == 0){return;}
                
                elemSelect.value = new_sow_boar_hid;
            };
            
            navigation.pageSowBoarAddEdit.show(options_sow_boar);
            navigation.pageSowBoarAddEdit.callbackOnSuccessAdd = callback_success;
            
            
        });
        
        
    }


    
    this._renderBreedingWarning = function(dateValue, pidValue){
        if (!thisObj.elemWarningHeader || !thisObj.elemWarningMessage) return;
        
        // Set header (plain text)
        thisObj.elemWarningHeader.textContent = label_warning_header;
        
        // Create dynamic spans
        const dateSpan = document.createElement('span');
        dateSpan.id = elemIdSowLastInsem;
        dateSpan.textContent = dateValue;
        
        const pidSpan = document.createElement('span');
        pidSpan.id = elemIdSowLastPid;
        pidSpan.textContent = pidValue;
        
        // Build the message with replacements
        let message = label_warning_message
            .replace('{date}', dateSpan.outerHTML)
            .replace('{pid}', pidSpan.outerHTML)
            .replace('{not_pregnant}', `<strong>${label_not_pregnant}</strong>`)
            .replace('{prod_gestating_list}', `<strong>${label_prod_gestating_list}</strong>`)
            .replace('{cannot_undo}', `<strong style="color:red;">${label_cannot_undo}</strong>`);
        
        thisObj.elemWarningMessage.innerHTML = message;
    }
    
    
    this.getElemSelect  = function(){
        return elemSelect;
    }

    
    this.getValue = function(){
        return elemSelect.value;
    }
    
    
    this.setValue = function(value){
        elemSelect.value = value;
    }
    
    
    this.setEntryCount = function(data){
        if (data.length == 1){
            elemEntryCount.textContent = ` (1 ${label_entry})`;
        }
        else{
            elemEntryCount.textContent = ` (${data.length} ${label_entries})`;
        }
    }
    
    
    this.reset = function(){
        elemSelect.selectedIndex = 0;
        elemSelect.classList.remove('is-valid', 'is-invalid');
        
        elemSowStatusShow.style.display = 'none';
    } 
    
    
    this.refreshList = function(){
        this.setDataSowList(navigation.pigFarm.managerSowBoar.dataSowList);
    }
    
    
    this.setDataSowList = function(data){
        dataSowList = data;
        
        // Exclude not production ready
        let filtered = [];
        for (const cur_entry of data){
            const sow_status_id = cur_entry.sow_boar.status_id;
            
            switch(sow_status_id){
                case SOW_STATUS.GROWING:{
                    if (cur_entry.sow_boar.is_production_ready > 0){
                        filtered.push(cur_entry);
                    }
                    break;
                }
                case SOW_STATUS.GESTATING:
                case SOW_STATUS.WEANING:{
                    filtered.push(cur_entry);
                }
                
                default: break;
            }
            
        }

        commonSelectOptions.setDataSowList(filtered, elemSelect);
        thisObj.setEntryCount(filtered)
    }
    
    
    this.beforeShow = function(){
        this.setDataSowList(navigation.pigFarm.managerSowBoar.dataSowList);
    }
    
    
    this.onChangeSow = function(){
        let sow_hid       = elemSelect.value;
        
        let index;
        let cur_entry;
        
        let gestating_sow = null;
        
        elemSowStatusShow.style.display = 'none';
        
        thisObj.isSelectedSowGestating = false;
        
        
        
        for(index = 0; index < dataSowList.length; index++){
            cur_entry = dataSowList[index];
            

            const sow_boar = cur_entry.sow_boar;

            
            // Display warning not pregnant if sow has cur_pig_production; 
            if (sow_boar.hid == sow_hid){
                
                if (sow_boar.status_id == SOW_STATUS.GESTATING){
                    if (sow_boar.cur_pig_production){
                        
                        const pig_production = sow_boar.cur_pig_production;
                        const dt_insem = new Date(pig_production.insemination.insem_date);
                        
                        const date_formatted = formatDate(dt_insem);
                        const pid = pig_production.pig_production.farm_prod_id;
                    
                        // Use the new render method
                        thisObj._renderBreedingWarning(date_formatted, pid);
                            
                        
                        elemSowStatusShow.style.display = 'block';
                        
                        thisObj.isSelectedSowGestating = true;
                    }
                }
                
                break;
            }
        }
    }
    
    
    this.getDataSow = function(sow_hid){
        for (const cur_entry of dataSowList){
            if (cur_entry.sow_boar.hid == sow_hid){return cur_entry;}
        } 
        
        return null;
    }
       

}
