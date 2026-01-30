// January 23, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PAGE_ID,
        SOW_STATUS,
        PIG_PROD_TYPE,
        PIG_OPERATION_TYPE,
        SUPPLIER_TYPE}          from '../../../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}         from '../../../../utils.js';

import {UiBasic}                from '../../../common/ui/ui_basic.js';

import {CommonSelectOptions}    from '../../../common/common_select_options.js';


export function ComponentSemenSupplier(input_settings){
    UiBasic.call(this);
    
    /* Typical settings
    settings = {
        navigation:             navigation,
        parentObj:              thisObj,
        uniqueKey:              ''
        
        pageDivContainer:       elemDivContainer,
        
        labelSelect:            ''
        helpText:               ''
        
    }
    
    
    */
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    const navigation            = input_settings.navigation;
    
    const settings              = input_settings;
    
    
    const pageDivContainer      = settings.pageDivContainer;
    
    const commonSelectOptions   = new CommonSelectOptions();
    

    const elemIdUiShow          = `${settings.uniqueKey}-show`;
    const elemIdSelect          = `${settings.uniqueKey}-select`;
    const elemIdEntryCount      = `${settings.uniqueKey}-entry-count`;
    const elemIdEntryAdd        = `${settings.uniqueKey}-entry-add`;
    
    const elemIdSupplierInfo    = `${settings.uniqueKey}-info`;
        
    let elemSelect              = null;
    let elemEntryCount          = null;
    let elemEntryAdd            = null;
    
    let elemSupplierInfo        = null;
    
    
    let dataSupplierList        = null;
    
    
    let componentSemenType      = null;
    
    
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
            
            <div id="${elemIdSupplierInfo}"></div>
        </div>
        `
        ;
        
    }
    
    
    this._findElements = function(){
        thisObj.elemUiShow      = pageDivContainer.querySelector('#'+elemIdUiShow)
                                 
        elemSelect              = pageDivContainer.querySelector('#'+elemIdSelect);
        elemEntryCount          = pageDivContainer.querySelector('#'+elemIdEntryCount);
        elemEntryAdd            = pageDivContainer.querySelector('#'+elemIdEntryAdd);
        
        elemSupplierInfo        = pageDivContainer.querySelector('#'+elemIdSupplierInfo);
    }
    
    
    this._bindEventListeners = function(){
        
        elemSelect.addEventListener('change', function() {
            thisObj.onChangeSemenSupplier();
        });
        
        elemEntryAdd.addEventListener('click', function() {
            // Should open SemenSupplierAddEdit page.
            // after success add or cancel/close should go back to this page
            
            const options_supplier ={
                is_add:         true,
                supplier_type:  SUPPLIER_TYPE.SEMEN,
                go_back_page:   settings.pageDivContainer   // Go back to this page
            };
            
            
            const callback_success = function(new_supplier_hid){
                const cur_supplier = thisObj.getDataSemenSupplier(new_supplier_hid);
                
                if (cur_supplier == null){return;}
                
                elemSelect.value = new_supplier_hid;
            };
            
            navigation.pageSupplierAddEdit.beforeShow(options_supplier);
            navigation.pageSupplierAddEdit.callbackOnSuccessAdd = callback_success;
            
            const next_page = navigation.getPageContainer(PAGE_ID.SUPPLIER_ADD_EDIT);
            navigation.showThisPage(next_page)
        });
        
        
    }

    
    this.setComponentSemenType = function(component){
        componentSemenType = component;
        componentSemenType.hide(); // hidden until there is a change in semen supplier
    }
    
    
    this.getElemSelect  = function(){
        return elemSelect;
    }

    
    this.getValue = function(){
        return elemSelect.value;
    }
    
    
    this.setValue = function(semen_supplier_hid, semen_type_hid){
        elemSelect.value = semen_supplier_hid;
        thisObj.onChangeSemenSupplier(semen_type_hid);
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
        
        elemSupplierInfo.innerHTML = '';
    } 
    
    
    this.setDataSupplierList = function(data){
        dataSupplierList = data;


        commonSelectOptions.setDataSupplierList(data, elemSelect);
        thisObj.setEntryCount(data)
        
        // Show this already
        componentSemenType.show();
    }
    
   
    this.beforeShow = function(){
        const account_semen_suppliers = navigation.pigFarm.accountLists.dataSemenSupplierList;
        
        // Request semen_supplier if not yet requested
        if (account_semen_suppliers == null){
            navigation.pigFarm.accountLists.requestDataSupplier(SUPPLIER_TYPE.SEMEN,
                    thisObj.setDataSupplierList);
        }
        else{
            thisObj.setDataSupplierList(account_semen_suppliers);
        }
    }
    
   
    this.populateSupplierDetails = function(supplier_hid){
        const cur_supplier = this.getDataSemenSupplier(supplier_hid);
        const supplier_address = cur_supplier.location.address;
        let s = '';
        
        s = `${supplier_address.level_1.name}, ${supplier_address.level_2.name}`;
        if ('hid' in supplier_address.level_3){
            s += `, ${supplier_address.level_3.name}`
        }
        elemSupplierInfo.innerHTML = s;
        
    }
    
    
    this.onChangeSemenSupplier = function(semen_type_hid){
        elemSelect.classList.remove('is-valid', 'is-invalid');
        
        const supplier_hid = elemSelect.value;
        
        thisObj.populateSupplierDetails(supplier_hid);
        
        const callback_success = function(data) {
            componentSemenType.setSupplierHid(supplier_hid);
            if (semen_type_hid){
                componentSemenType.setDataSemenTypeList(data, semen_type_hid);
            }
            else{
                componentSemenType.setDataSemenTypeList(data);
            }
            componentSemenType.show();
        };
        
        navigation.managerPublicData.requestDataSemenSupplierSemen(supplier_hid, 
            callback_success);
    }
    
    
    this.getDataSemenSupplier = function(supplier_hid){
        for (const cur_entry of dataSupplierList){
            if (cur_entry.supplier.hid == supplier_hid){return cur_entry;}
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
     
}