// January 14, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {CommonSelectOptions}    from '../common_select_options.js';


export function ComponentAddressLevels(input_settings){
    
    /* Typical settings
    settings = {
        navigation:             navigation,
        uniqueKey:              '',
        elemDivContainer:       elemDivContainer,
        
                
        level1Label:            'Select Province or Region',
        level2Label:            'Select City or Municipality',
        level3Label:            'Select Baranggay'
    }
    
    
    */
    
    const thisObj               = this;
    
    const navigation            = input_settings.navigation;
    const managerAddress        = navigation.managerAddress;
    
    const settings              = input_settings;
    const elemDivContainer      = settings.elemDivContainer;
    
    
    const elemIdServerErrorMsg      = `${settings.uniqueKey}-adrs-server-error`;
    
    const elemIdCountry             = `${settings.uniqueKey}-country`;
    
    const elemIdAddressLevel1       = `${settings.uniqueKey}-adrs-level1`;
    const elemIdAddressLevel1Count  = `${settings.uniqueKey}-adrs-level1-count`;
        
    const elemIdAddressLevel2       = `${settings.uniqueKey}-adrs-level2`;
    const elemIdAddressLevel2Count  = `${settings.uniqueKey}-adrs-level2-count`;
        
    const elemIdAddressLevel3       = `${settings.uniqueKey}-adrs-level3`;
    const elemIdAddressLevel3Count  = `${settings.uniqueKey}-adrs-level3-count`;
    
    
    let elemServerErrorMsg          = null;
    
    let elemCountry                 = null;
    
    let elemAddressLevel1           = null;
    let elemAddressLevel1Count      = null; 
                                    
    let elemAddressLevel2           = null;
    let elemAddressLevel2Count      = null;
                                    
    let elemAddressLevel3           = null;
    let elemAddressLevel3Count      = null;
                                
    
    const commonSelectOptions       = new CommonSelectOptions();
    
    
    let curAddressLevel1            = null;
    let curAddressLevel2            = null;
    
    
    this.callbackOnChangeLevel1     = null;
    this.callbackOnChangeLevel2     = null;
    this.callbackOnChangeLevel3     = null;
    
    
    // This is a function to request an item count per address level 2
    this.requestItemCountPerAddressLevel2 = null;
    
    
    
    this.getHtml = function(){
      
        
        return `
        
        <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
        
        <div class="form-group-check">
            <label class="form-label">Country</label>
            
            <div>
                <b>
                    <label id="${elemIdCountry}">
                        Philippines
                    </label>
                </b>
                
            </div>            
        </div>
        
        
        
        <!-- 1. Address Level 1 -->
        <div class="form-group-select">
            <label for="${elemIdAddressLevel1}" class="form-label">
                ${settings.level1Label} <span class="entries-count" id=${elemIdAddressLevel1Count}></span>
            </label>
                        
            <select class="form-select" id="${elemIdAddressLevel1}">
                <option value="-1" selected disabled>No Entries</option>
            </select>
            
        </div>
            
        <!-- 2. Address Level 2 -->
        <div class="form-group-select">
            <label for="${elemIdAddressLevel2}" class="form-label">
                ${settings.level2Label} <span class="entries-count" id=${elemIdAddressLevel2Count}></span>
            </label>
                        
            <select class="form-select" id="${elemIdAddressLevel2}">
                <option value="0" selected disabled>Please Select</option>
            </select>
        </div>
        
        
        <!-- 3. Address Level 3 -->
        <div class="form-group-select">
            <label for="${elemIdAddressLevel3}" class="form-label">
                ${settings.level3Label} <span class="entries-count" id=${elemIdAddressLevel3Count}></span>
            </label>
                        
            <select class="form-select" id="${elemIdAddressLevel3}">
                <option value="0" selected disabled>Please Select</option>
            </select>
        </div>
        
        
        `;
        
    }
    
    
    this._findElements = function(){
        elemServerErrorMsg          = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);
        
        elemCountry                 = elemDivContainer.querySelector('#'+elemIdCountry);
        
        elemAddressLevel1           = elemDivContainer.querySelector('#'+elemIdAddressLevel1);
        elemAddressLevel1Count      = elemDivContainer.querySelector('#'+elemIdAddressLevel1Count);
                                
        elemAddressLevel2           = elemDivContainer.querySelector('#'+elemIdAddressLevel2);
        elemAddressLevel2Count      = elemDivContainer.querySelector('#'+elemIdAddressLevel2Count);
                                
        elemAddressLevel3           = elemDivContainer.querySelector('#'+elemIdAddressLevel3);
        elemAddressLevel3Count      = elemDivContainer.querySelector('#'+elemIdAddressLevel3Count);
        
    }
    
    
    this._bindEventListeners = function(){
        elemAddressLevel1.addEventListener('change', function(){
            thisObj.onChangeAddressLevel1();
        });
        
        elemAddressLevel2.addEventListener('change', function(){
            thisObj.onChangeAddressLevel2();
        });
        
        
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._bindEventListeners();
    }
    
    
    this.getElemText  = function(){
        return elemText;
    }
    
    
    this.setValue = function(text){
        elemText.value      = text;
        
        updateCharCounter(elemText, elemCharCounter, settings.textMaxChars);
    }
    
    
    this.geValueAddressLevel1 = function(){
        return elemAddressLevel1.value;
    }
    
    
    this.geValueAddressLevel2 = function(){
        return elemAddressLeve2.value;
    }
    
    
    this.geValueAddressLevel3 = function(){
        return elemAddressLeve3.value;
    }
    
    
    this.beforeShow = function(){
        
        
        const cur_country = navigation.managerAddress.getCurCountry();
        elemCountry.textContent = cur_country.name;
        
        const data = navigation.managerAddress.getAddressLevel1List();
        commonSelectOptions.setDataAddressLevel(data, elemAddressLevel1);
        
        elemAddressLevel2.selectedIndex = 0;
        elemAddressLevel2.dispatchEvent(new Event('change')); 
        
        elemAddressLevel3.selectedIndex = 0;
        elemAddressLevel3.dispatchEvent(new Event('change')); 
        
        
        elemAddressLevel2.disabled = true;
        elemAddressLevel3.disabled = true;
    }
    
    
    this.requestDataAddressLevel1 = function(){
        elemServerErrorMsg.style.display = 'none';
                
        elemAddressLevel1.disabled = true;
        elemAddressLevel2.disabled = true;
        elemAddressLevel3.disabled = true;
        
        
        let callback_success = function(data){
            elemAddressLevel1.disabled = false;
            
            commonSelectOptions.setDataAddressLevel(data, elemAddressLevel1);
        };
        
        const country_hid = managerAddress.getCurCountry().hid;
        
        managerAddress.requestDataAddressLevel1(country_hid, callback_success, 
                elemServerErrorMsg);
    }
    
    
    this.requestDataAddressLevel2 = function(address_level_1){ 
        elemServerErrorMsg.style.display = 'none';
                
        elemAddressLevel1   .disabled = true;
        elemAddressLevel2   .disabled = true;
        elemAddressLevel3   .disabled = true;
        
            
        const callback_success = function(data){
            
            if (thisObj.requestItemCountPerAddressLevel2){
                const level_1_hid = elemAddressLevel1.value;
                thisObj.requestItemCountPerAddressLevel2(level_1_hid, data);
            }
            else{
                elemAddressLevel1   .disabled = false;
                elemAddressLevel2   .disabled = false;
        
                commonSelectOptions.setDataAddressLevel(data, elemAddressLevel2);
            }
        };
        
        managerAddress.requestDataAddressLevel2(address_level_1, 
            callback_success, elemServerErrorMsg);
    }
    
    
    this.onChangeAddressLevel1 = function(){
        commonSelectOptions.setDataAddressLevel([], elemAddressLevel3, []);
        
        const level_1_hid = elemAddressLevel1.value;
        
        
        // Get address_level_1 data from managerAddress
        curAddressLevel1        = managerAddress.getAddressLevel1(level_1_hid);
        let level_2_addresses   = managerAddress.getLevel2Addresses(curAddressLevel1);
        
        
        // Request data from server only if not yet requested
        if (level_2_addresses == null){
            thisObj.requestDataAddressLevel2(curAddressLevel1);
        }
        else{
            elemAddressLevel1.disabled = false;
            elemAddressLevel2.disabled = false;

        }
        
        if (thisObj.callbackOnChangeLevel1){
            thisObj.callbackOnChangeLevel1(level_1_hid);
        }
        
        

    }
    
    
    this.onChangeAddressLevel2 = function(){
        elemServerErrorMsg.style.display = 'none';
        
        
        const level_2_hid = elemAddressLevel2.value;

        if (level_2_hid == '0' || level_2_hid == '-1'){return;}
        
        // Get level_2 from  curAddressLevel1
        curAddressLevel2        = managerAddress.getAddressLevel2(
                                        curAddressLevel1, level_2_hid);
        let level_3_addresses   = managerAddress.getLevel3Addresses(curAddressLevel2);
        
        
        // Request data from server only if not yet requested
        if (level_3_addresses == null){
            // Request AddressLevel3
            thisObj.requestDataAddressLevel3(curAddressLevel2);
        }
        else {
            elemAddressLevel1.disabled = false;
            elemAddressLevel2.disabled = false;
            elemAddressLevel3.disabled = false;
            
            commonSelectOptions.setDataAddressLevel(level_3_addresses, elemAddressLevel3);
            
        }
        
        
        
        if (thisObj.callbackOnChangeLevel2){
            thisObj.callbackOnChangeLevel2(level_2_hid);
        }
    }
    
    
    this.requestDataAddressLevel3 = function(address_level_2){
        elemServerErrorMsg.style.display = 'none';
                
        elemAddressLevel1.disabled = true;
        elemAddressLevel2.disabled = true;
        elemAddressLevel3.disabled = true;

        
        let callback_success = function(data){
            elemAddressLevel1.disabled = false;
            elemAddressLevel2.disabled = false;
            elemAddressLevel3.disabled = false;
            
            commonSelectOptions.setDataAddressLevel(data, elemAddressLevel3);
        };

        managerAddress.requestDataAddressLevel3(address_level_2, 
            callback_success, elemServerErrorMsg);
    }
    
    
    this.reset = function(){
        thisObj.beforeShow();
    }
}