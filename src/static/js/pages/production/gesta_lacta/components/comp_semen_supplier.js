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
    
    
    
    this.setDataSemenSupplierList = function(data){
        dataSupplierList = data;


        commonSelectOptions.setDataSemenSupplierList(data, elemSelect);
        thisObj.setEntryCount(data)
    }
    
   
    
    this.onChangeSemenSupplier = function(semen_hid){
        elemSelect.classList.remove('is-valid', 'is-invalid');
        
        const supplier_hid = elemSelect.value;
        
        
        // Need to request semen_supplier_semen
        const base_url = window.location.origin;
        const url = `${base_url}/semen_sup_semen/list?semen_supplier_hid=${supplier_hid}`;
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            async: true,
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    
                    let semen_supplier = thisObj.getDataSemenSupplier(supplier_hid);
                    
                    const elem_select_semen_type = componentSemenType.getElemSelect();
                    
                    
                    if (semen_hid){
                        componentSemenType.setDataSemenTypeList(response.data, semen_hid);
                    }
                    else{
                        componentSemenType.setDataSemenTypeList(response.data);
                    }
                    
                    componentSemenType.show();
                    
                    
                }
                else {
                    navigation.serverError.receivedErrorMessage(
                        response, null);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
    }
    
    
    this.getDataSemenSupplier = function(supplier_hid){
        for (const cur_entry of dataSupplierList){
            if (cur_entry.hid == supplier_hid){return cur_entry;}
        } 
        
        return null;
    }
       
}