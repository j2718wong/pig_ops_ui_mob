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


export function SelectBoarGesta(input_settings){
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
    
        
    let elemSelect              = null;
    let elemEntryCount          = null;
    let elemEntryAdd            = null;
    
    
    let dataBoarList             = null;
    
    
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
            
        </div>
        `
        ;
        
    }
    
    
    this._findElements = function(){
        thisObj.elemUiShow      = pageDivContainer.querySelector('#'+elemIdUiShow);
       
        elemSelect              = pageDivContainer.querySelector('#'+elemIdSelect);
        elemEntryCount          = pageDivContainer.querySelector('#'+elemIdEntryCount);
        elemEntryAdd            = pageDivContainer.querySelector('#'+elemIdEntryAdd);
    }
    
    
    this._bindEventListeners = function(){
        
        
        elemEntryAdd.addEventListener('click', function() {
            // Should open BoarBoarAddEdit page.
            // after success add or cancel/close should go back to this page
            
            const options_sow_boar ={
                is_add:         true,
                sow_boar_type:  SOW_BOAR_TYPE.BOAR, 
                go_back_page:   settings.pageDivContainer   // Go back to this page
            }
            
            
            const callback_success = function(new_sow_boar_hid){
                const cur_sow = thisObj.getDataBoar(new_sow_boar_hid);
                
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
    } 
    
    
    this.refreshList = function(){
        this.setDataBoarList(navigation.pigFarm.managerSowBoar.dataBoarList);
    }
    
    
    this.setDataBoarList = function(data){
        dataBoarList = data;
        
        // Exclude not production ready
        let filtered = [];
        for (const cur_entry of data){
            if (cur_entry.sow_boar.is_production_ready > 0){
                filtered.push(cur_entry);
            }
        }

        commonSelectOptions.setDataBoarList(filtered, elemSelect);
        thisObj.setEntryCount(filtered)
    }
    
    
    this.beforeShow = function(){
        this.setDataBoarList(navigation.pigFarm.managerSowBoar.dataBoarList);
    }
    
    
    this.getDataBoar = function(sow_hid){
        for (const cur_entry of sowList){
            if (cur_entry.sow_boar.hid == sow_hid){return cur_entry;}
        } 
        
        return null;
    }
       
    
    this.enabled = function(){
        elemSelect.disabled = false;
        
        if (elemEntryAdd){
            elemEntryAdd.disabled = false;
        }
    }
    
    
    this.disabled = function(){
        elemSelect.disabled = true;
        
        if (elemEntryAdd){
            elemEntryAdd.disabled = true;
        }
    }
    
    
    /*
    // Override parent
    this.show = function(){
        thisObj.elemUiShow.classList.add('expanded');
    }
    
    
    // Override parent
    this.hide = function(){
        thisObj.elemUiShow.classList.remove('expanded');
    }
    */
}
