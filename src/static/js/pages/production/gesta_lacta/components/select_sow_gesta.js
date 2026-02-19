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
    
    const commonSelectOptions   = new CommonSelectOptions();
    

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
    
    
    let dataSowList             = null;
    
    
    this.getHtml = function(){
        
        return `
        <div class="form-group-select" id="${elemIdUiShow}">
        
            <label for="${elemIdSelect}" class="form-label">
                ${settings.labelSelect} <span class="entries-count" id="${elemIdEntryCount}"></span>
            </label>
            
            <div class="input-group">
                <select class="form-select" id="${elemIdSelect}">
                    <option value="-1" selected disabled>No Entries</option>
                </select>
                <button class="btn" type="button" id="${elemIdEntryAdd}">
                    <i class="bi bi-plus"></i> New
                </button>
            </div>
            
            
            <!-- Combined Breeding Status Warning -->
            <div id="${elemIdSowStatusShow}" class="warning-box" style="display: none;">
                <div class="warning-header">
                    <i class="bi bi-exclamation-triangle-fill warning-icon"></i>
                    <span>Sow Already Bred</span>
                </div>
                <div class="warning-details">
                    <span>
                        This sow was last bred on <span id="${elemIdSowLastInsem}">Jan 15, 2024</span>
                        with production <b>PID: <span id="${elemIdSowLastPid}">20</span></b>. 
                        If this new entry will be saved, the previous production gestating  
                        entry will be marked as <b>Not Pregnant</b> and will
                        be removed from the Prod Gestating List.
                        
                        Please ensure this is an intentional breeding due to sow reheat.
                    </span>
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
        elemSowLastInsem        = pageDivContainer.querySelector('#'+elemIdSowLastInsem);
        elemSowLastPid          = pageDivContainer.querySelector('#'+elemIdSowLastPid);
    }
    
    
    this._bindEventListeners = function(){
        elemSelect.addEventListener('change', function(){
            thisObj.onChangeSow();
        });
        
        
        elemEntryAdd.addEventListener('click', function() {
            // Should open SowBoarAddEdit page.
            // after success add or cancel/close should go back to this page
            
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
            
            navigation.pageSowBoarAddEdit.beforeShow(options_sow_boar);
            navigation.pageSowBoarAddEdit.callbackOnSuccessAdd = callback_success;
            
            const next_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_ADD_EDIT);
            navigation.showThisPage(next_page)
        });
        
        
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
            elemEntryCount.textContent = ` (${data.length} Entry)`;
        }
        else{
            elemEntryCount.textContent = ` (${data.length} Entries)`;
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
        
        for(index = 0; index < dataSowList.length; index++){
            cur_entry = dataSowList[index];
            if ('sow_boar' in cur_entry){
                cur_entry = cur_entry.sow_boar;
            }
            
            if (cur_entry.hid == sow_hid){
                if (cur_entry.status_id == SOW_STATUS.GESTATING){
                    if (cur_entry.last_farm_prod_id){
                        
                        const dt_insem = new Date(cur_entry.date_insemination);
                        
                        elemSowLastInsem.textContent  = formatDate(dt_insem);
                        elemSowLastPid.textContent    = cur_entry.last_farm_prod_id;  
                        
                        elemSowStatusShow.style.display = 'block';
                    }
                }
                break;
            }
        }
    }
    
    
    this.getDataSow = function(sow_hid){
        for (const cur_entry of sowList){
            if (cur_entry.sow_boar.hid == sow_hid){return cur_entry;}
        } 
        
        return null;
    }
       

}
