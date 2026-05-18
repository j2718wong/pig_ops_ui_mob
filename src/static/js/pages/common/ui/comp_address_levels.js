// comp_address_levels.js

// January 14, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {CommonSelectOptions}    from '../common_select_options.js';


export function ComponentAddressLevels(input_settings){
    
    /* Typical settings
    settings = {
        navigation:             navigation,
        parentObj:              this,
        uniqueKey:              '',
        elemDivContainer:       elemDivContainer,
        
                
        level1Label:            'Select Province or Region',
        level2Label:            'Select City or Municipality',
        level3Label:            'Select Baranggay'
    }
    
    
    */
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    const managerAddress        = navigation.managerAddress;
    
    const settings              = input_settings;
    const elemDivContainer      = settings.elemDivContainer;
    
    
    const elemIdServerErrorMsg      = `${settings.uniqueKey}-server-error-msg`;
    
    const elemIdCountry             = `${settings.uniqueKey}-country`;
    
    const elemIdAddressLevels       = `${settings.uniqueKey}-adrs-levels`;
    
    const elemIdAddressLevel1       = `${settings.uniqueKey}-adrs-level1`;
    const elemIdAddressLevel1Count  = `${settings.uniqueKey}-adrs-level1-count`;
        
    const elemIdAddressLevel2       = `${settings.uniqueKey}-adrs-level2`;
    const elemIdAddressLevel2Count  = `${settings.uniqueKey}-adrs-level2-count`;
        
    const elemIdAddressLevel3       = `${settings.uniqueKey}-adrs-level3`;
    const elemIdAddressLevel3Count  = `${settings.uniqueKey}-adrs-level3-count`;
    
    
    let elemServerErrorMsg          = null;
    
    let elemCountry                 = null;
    let elemAddressLevels           = null;
    
    let elemAddressLevel1           = null;
    let elemAddressLevel1Count      = null; 
                                    
    let elemAddressLevel2           = null;
    let elemAddressLevel2Count      = null;
                                    
    let elemAddressLevel3           = null;
    let elemAddressLevel3Count      = null;
    
    let countryHasAddressLevels     = 0;
    
    
    const commonSelectOptions       = new CommonSelectOptions(navigation);

    
    this.curAddressLevel1           = null;
    this.curAddressLevel2           = null;
    this.curAddressLevel3           = null;
    
    this.callbackOnChangeLevel1     = null;
    this.callbackOnChangeLevel2     = null;
    this.callbackOnChangeLevel3     = null;
    
    
    let showOptions                 = null;
    
    
    // This is a function to request an item count per address level 2
    this.requestItemCountPerAddressLevel2 = null;
    
    
    
    this.getHtml = function(){
      
        
        return `
        
        <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
        
        <div class="form-group-check">
            <label class="form-label">Country</label>
            <span class="read-only-field" id="${elemIdCountry}">Philippines</span>
                        
        </div>
        
        
        <div id="${elemIdAddressLevels}">
        
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
            
        </div>
        `;
        
    }
    
    
    this._findElements = function(){
        elemServerErrorMsg          = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);
        
        elemCountry                 = elemDivContainer.querySelector('#'+elemIdCountry);
        
        elemAddressLevels           = elemDivContainer.querySelector('#'+elemIdAddressLevels);
        
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
    
    
    this.beforeShow = function(options){
        
        showOptions = options;
        
        const cur_country = navigation.managerAddress.getCurCountry();
        elemCountry.textContent = cur_country.name;
        
        const data = navigation.managerAddress.getAddressLevel1List();
        commonSelectOptions.setDataAddressLevelList(data, elemAddressLevel1);
        
        elemAddressLevel2.selectedIndex = 0;
        elemAddressLevel2.dispatchEvent(new Event('change')); 
        
        elemAddressLevel3.selectedIndex = 0;
        elemAddressLevel3.dispatchEvent(new Event('change')); 
        
        
        elemAddressLevel2.disabled = true;
        elemAddressLevel3.disabled = true;
    }
    
    
    this.setLocationAddress = function(location, has_address_levels) {
        const country_hid = location.country.hid;
        elemCountry.textContent = location.country.name;

        const address = location.address;
        
        if (has_address_levels == 0){
            elemAddressLevels.style.display = 'none';
        }
        else{
            countryHasAddressLevels = 1;
        }
        
        
        if (has_address_levels > 0 && address.level_1 && address.level_1.hid) {
            const level_1_hid = address.level_1.hid;
            
            // Set the level 1 select element (options should already exist)
            elemAddressLevel1.value = level_1_hid;
            
            // Get address_level_1 from managerAddress
            this.curAddressLevel1 = navigation.managerAddress.getAddressLevel1(level_1_hid);
            
            if (this.curAddressLevel1) {
                
                // Check if level 2 data is already loaded
                let level_2_addresses = navigation.managerAddress.getLevel2Addresses(
                                            this.curAddressLevel1);
                
                if (level_2_addresses && level_2_addresses.length > 0) {
                    // Level 2 data is already loaded, populate dropdown first
                    commonSelectOptions.setDataAddressLevelList(level_2_addresses, elemAddressLevel2);
                    elemAddressLevel2.disabled = false;
                    
                    // Now set the value
                    this._setAddressLevel2(location);
                } else {
                    // Need to load level 2 data first
                    this.requestDataAddressLevel2(this.curAddressLevel1, function(data) {
                        // Data loaded, now populate dropdown
                        commonSelectOptions.setDataAddressLevelList(data, elemAddressLevel2);
                        elemAddressLevel2.disabled = false;
                        
                        // Now set the value
                        thisObj._setAddressLevel2(location);
                    });
                }
            } 
        }
    }
    
    
    this._setAddressLevel2 = function(location) {
        const address = location.address;
    
        if (address.level_2 && address.level_2.hid) {
            const level_2_hid = address.level_2.hid;
            
            // Set the level 2 select element (options should now exist)
            elemAddressLevel2.value = level_2_hid;
            
            // Get level_2 from curAddressLevel1
            this.curAddressLevel2 = navigation.managerAddress.getAddressLevel2(
                                        this.curAddressLevel1, level_2_hid);
            
            if (this.curAddressLevel2) {
                // Check if level 3 data is already loaded
                let level_3_addresses = navigation.managerAddress.getLevel3Addresses(
                                            this.curAddressLevel2);
                
                if (level_3_addresses && level_3_addresses.length > 0) {
                    // Level 3 data is already loaded, populate dropdown first
                    commonSelectOptions.setDataAddressLevelList(level_3_addresses, elemAddressLevel3);
                    elemAddressLevel3.disabled = false;
                    
                    // Now set the value
                    this._setAddressLevel3(location);
                } else {
                    // Need to load level 3 data first
                    this.requestDataAddressLevel3(this.curAddressLevel2, function(data) {
                        // Data loaded, now populate dropdown
                        commonSelectOptions.setDataAddressLevelList(data, elemAddressLevel3);
                        elemAddressLevel3.disabled = false;
                        
                        // Now set the value
                        thisObj._setAddressLevel3(location);
                    });
                }
            }
        }
    }
    
    
    this._setAddressLevel3 = function(location) {
        const address = location.address;
    
        if (address.level_3 && address.level_3.hid) {
            const level_3_hid = address.level_3.hid;
            
            // Set the level 3 select element (options should now exist)
            elemAddressLevel3.value = level_3_hid;
            elemAddressLevel3.disabled = false;
            
            // Get level_3 from curAddressLevel2
            this.curAddressLevel3 = navigation.managerAddress.getAddressLevel3(
                                        this.curAddressLevel2, level_3_hid);
        }
    }
    
    
    this.requestDataAddressLevel1 = function(){
        elemServerErrorMsg.style.display = 'none';
                
        elemAddressLevel1.disabled = true;
        elemAddressLevel2.disabled = true;
        elemAddressLevel3.disabled = true;
        
        
        let callback_success = function(data){
            elemAddressLevel1.disabled = false;
            
            commonSelectOptions.setDataAddressLevelList(data, elemAddressLevel1);
        };
        
        const country_hid = managerAddress.getCurCountry().hid;
        
        managerAddress.requestDataAddressLevel1(country_hid, callback_success, 
                elemServerErrorMsg);
    }
    
    
    this.requestDataAddressLevel2 = function(address_level_1, custom_callback){ 
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
        
                commonSelectOptions.setDataAddressLevelList(data, elemAddressLevel2);
            }
            
            // Call the custom callback if provided
            if (custom_callback) {
                custom_callback(data);
            }
        };
        
        managerAddress.requestDataAddressLevel2(address_level_1, 
            callback_success, elemServerErrorMsg);
    }
    
    
    this.onChangeAddressLevel1 = function(){
        commonSelectOptions.setDataAddressLevelList([], elemAddressLevel3, []);
        elemAddressLevel3.disabled = true;
        
        const level_1_hid = elemAddressLevel1.value;
        
        
        // Get address_level_1 data from managerAddress
        this.curAddressLevel1   = managerAddress.getAddressLevel1(level_1_hid);
        let level_2_addresses   = managerAddress.getLevel2Addresses(
                                        thisObj.curAddressLevel1);
        
        
        // Request data from server only if not yet requested
        if (level_2_addresses == null){
            thisObj.requestDataAddressLevel2(thisObj.curAddressLevel1);
        }
        else{
            elemAddressLevel1.disabled = false;
            elemAddressLevel2.disabled = false;

            commonSelectOptions.setDataAddressLevelList(level_2_addresses, 
                    elemAddressLevel2);
        }
        
        if (thisObj.callbackOnChangeLevel1){
            thisObj.callbackOnChangeLevel1(level_1_hid);
        }
        
        

    }
    
    
    this.onChangeAddressLevel2 = function(){
        elemServerErrorMsg.style.display = 'none';
        
        
        const level_2_hid = elemAddressLevel2.value;

        if (level_2_hid == '0' || level_2_hid == '-1'){return;}
        
        // Get level_2 from  this.curAddressLevel1
        this.curAddressLevel2   = managerAddress.getAddressLevel2(
                                    this.curAddressLevel1, level_2_hid);
        let level_3_addresses   = managerAddress.getLevel3Addresses(
                                    this.curAddressLevel2);
        
        
        // Request data from server only if not yet requested
        if (level_3_addresses == null){
            // Request AddressLevel3
            this.requestDataAddressLevel3(this.curAddressLevel2);
        }
        else {
            elemAddressLevel1.disabled = false;
            elemAddressLevel2.disabled = false;
            elemAddressLevel3.disabled = false;
            
            commonSelectOptions.setDataAddressLevelList(level_3_addresses, elemAddressLevel3);
            
        }
        
        
        
        if (thisObj.callbackOnChangeLevel2){
            thisObj.callbackOnChangeLevel2(level_2_hid);
        }
    }
    
    
    this.onChangeAddressLevel3 = function(){
        const level_3_hid = elemAddressLevel3.value;

        if (level_3_hid == '0' || level_3_hid == '-1'){return;}
        
        // Get level_3 from  this.curAddressLevel2
        this.curAddressLevel3   = managerAddress.getAddressLevel3(
                                    this.curAddressLevel2, level_3_hid);

    }
    
    
    this.requestDataAddressLevel3 = function(address_level_2, custom_callback){
        elemServerErrorMsg.style.display = 'none';
                
        elemAddressLevel1.disabled = true;
        elemAddressLevel2.disabled = true;
        elemAddressLevel3.disabled = true;

        
        let callback_success = function(data){
            elemAddressLevel1.disabled = false;
            elemAddressLevel2.disabled = false;
            elemAddressLevel3.disabled = false;
            
            commonSelectOptions.setDataAddressLevelList(data, elemAddressLevel3);
            
            // Call the custom callback if provided
            if (custom_callback) {
                custom_callback(data);
            }
        };

        managerAddress.requestDataAddressLevel3(address_level_2, 
            callback_success, elemServerErrorMsg);
    }
    
    
    this.reset = function(){
        thisObj.beforeShow();
    }
    
    
    this.getAddressHids = function(){
        const country_hid = managerAddress.getCurCountry().hid;
        
        if (countryHasAddressLevels > 0) {
            return {
                'country_hid': country_hid,
                'level_1_hid': elemAddressLevel1.value,
                'level_2_hid': elemAddressLevel2.value,
                'level_3_hid': elemAddressLevel3.value
            } 
        }
        
        
        return {
                'country_hid': country_hid
        }
        
    }
}
