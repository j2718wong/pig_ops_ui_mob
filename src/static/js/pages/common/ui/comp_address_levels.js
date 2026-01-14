// January 14, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {CommonSelectOptions}    from './common_select_options.js';


export function ComponentAddressLevels(input_settings){
    
    /* Typical settings
    settings = {
        uniqueKey:      ''
        
    }
    
    
    */
    
    const thisObj               = this;
    
    const navigation            = input_settings.navigation;
    const settings              = input_settings;
    
	
	const elemIdServerErrorMsg	= `${settings.uniqueKey}-adrs-server-error`;
	
    const elemIdAddressLevel1      = `${settings.uniqueKey}-adrs-level1`;
    const elemIdAddressLevel1Label = `${settings.uniqueKey}-adrs-level1-label`;
    const elemIdAddressLevel1Count = `${settings.uniqueKey}-adrs-level1-count`;
    
    const elemIdAddressLevel2      = `${settings.uniqueKey}-adrs-level2`;
    const elemIdAddressLevel2Label = `${settings.uniqueKey}-adrs-level2-label`;
    const elemIdAddressLevel2Count = `${settings.uniqueKey}-adrs-level2-count`;
    
    const elemIdAddressLevel3      = `${settings.uniqueKey}-adrs-level3`;
    const elemIdAddressLevel3Label = `${settings.uniqueKey}-adrs-level3-label`;
    const elemIdAddressLevel3Count = `${settings.uniqueKey}-adrs-level3-count`;
    
    
    
    let elemAddressLevel1          = null;
    let elemAddressLevel1Label     = null;
    let elemAddressLevel1Count     = null; 
                                
    let elemAddressLevel2          = null;
    let elemAddressLevel2Label     = null;
    let elemAddressLevel2Count     = null;
                                
    let elemAddressLevel3          = null;
    let elemAddressLevel3Label     = null;
    let elemAddressLevel3Count     = null;
                                
    
	const commonSelectOptions 		= new CommonSelectOptions();
	
    
	let curAddressLevel1			= null;
	
	
	// This is a function to request an item count per address level 2
	this.requestItemCountPerAddressLevel2 = null;
	
	
    
    this.getHtml = function(){
      
        
        return `
		
		<div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
		
        <!-- 1. Address Level 1 -->
        <div class="form-group-select">
            <label for="${elemIdAddressLevel1}" class="form-label">
                ${elemIdAddressLevel1Label} <span class="entries-count" id=${elemIdAddressLevel1Count}></span>
            </label>
                        
            <div class="input-group">
                <select class="form-select" id="${elemIdAddressLevel1}">
                    <option value="-1" selected disabled>No Entries</option>
                </select>
            </div>
        </div>
            
        <!-- 2. Address Level 2 -->
        <div class="form-group-select">
            <label for="${elemIdAddressLevel2}" class="form-label">
                ${elemIdLabelAddressLevel2} <span class="entries-count" id=${elemIdAddressLevel2Count}></span>
            </label>
                        
            <div class="input-group">
                <select class="form-select" id="${elemIdAddressLevel2}">
                    <option value="-1" selected disabled>No Entries</option>
                </select>
            </div>
        </div>
        
        
        <!-- 3. Address Level 3 -->
        <div class="form-group-select">
            <label for="${elemIdAddressLevel3}" class="form-label">
                ${elemIdLabelAddressLevel3} <span class="entries-count" id=${elemIdAddressLevel3Count}></span>
            </label>
                        
            <div class="input-group">
                <select class="form-select" id="${elemIdAddressLevel3}">
                    <option value="-1" selected disabled>No Entries</option>
                </select>
            </div>
        </div>
        
        
        `;
        
    }
    
    
    this._findElements = function(){
		elemServerErrorMsg			= document.getElementById(elemIdServerErrorMsg);
		
        elemAddressLevel1          	= document.getElementById(elemIdAddressLevel1);
        elemAddressLevel1Label     	= document.getElementById(elemIdAddressLevel1Label);
        elemAddressLevel1Count     	= document.getElementById(elemIdAddressLevel1Count);
								
        elemAddressLevel2          	= document.getElementById(elemIdAddressLevel2);
        elemAddressLevel2Label     	= document.getElementById(elemIdAddressLevel2Label);
        elemAddressLevel2Count     	= document.getElementById(elemIdAddressLevel2Count);
								
        elemAddressLevel3          	= document.getElementById(elemIdAddressLevel3);
        elemAddressLevel3Label     	= document.getElementById(elemIdAddressLevel3Label);
        elemAddressLevel3Count     	= document.getElementById(elemIdAddressLevel3Count);
        
    }
    
    
    this._bindEventListeners = function(){
        elemAddressLevel1.addEventListener('change', function(){
			thisObj._onChangeAddressLevel1();
        });
        
        elemAddressLevel2.addEventListener('change', function(){
            thisObj._onChangeAddressLevel2();
        });
        
        
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._bindEventListeners();
    }
    
    
    this.getElemText  = function(){
        return elemText;
    }
    
    
    this.setText = function(text){
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
	
	
	this.show = function(){
		const data = navigation.managerAddress.getAddressLevel1List();
		commonSelectOptions.setDataAddressLevel(data, elemAddressLevel1);
	}
	
	
	this.requestAddressLevel1Data = function(){
        elemServerErrorMsg.style.display = 'none';
                
        elemAddressLevel1.disabled = true;
        elemAddressLevel2.disabled = true;
        elemAddressLevel3.disabled = true;
        
        
        let callback_success = function(data){
            elemAddressLevel1.disabled = false;
            
            commonSelectOptions.setDataAddressLevel(data, elemAddressLevel1);
        };
        
        addressManager.requestAddressLevel1Data(callback_success);
    }
    
    
    this.requestAddressLevel2Data = function(address_level_1){ 
        elemServerErrorMsg.style.display = 'none';
                
        elemAddressLevel1   .disabled = true;
        elemAddressLevel2   .disabled = true;
        elemAddressLevel3   .disabled = true;
        
        
        let data_level_2 = null;
        
            
        let callback_success_request_level_2_data = function(data){
            data_level_2 = data;
            
            
            const level_1_hid = elemAddressLevel1.value;
            thisObj.requestItemCountPerAddressLevel2(level_1_hid, 
                callback_success_item_count);
        };
        
        addressManager.requestAddressLevel2Data(address_level_1, 
            callback_success_request_level_2_data);
    }
    
	
    this._onChangeAddressLevel1 = function(){
        commonSelectOptions.setDataAddressLevel([], elemAddressLevel3);
        
        const level_1_hid = elemAddressLevel1.val()
        if (level_1_hid == '0'){return;}
        
		
		const addressManager	= navigation.addressManager;
		
        
        // Get address_level_1 data from addressManager
        curAddressLevel1        = addressManager.getAddressLevel1(level_1_hid);
        let level_2_addresses   = addressManager.getLevel2(curAddressLevel1);
        
        
        // Request data from server only if not yet requested
        if (level_2_addresses == null){
            thisObj._requestAddressLevel2Data(curAddressLevel1);
        }
        else{
            elemAddressLevel1.disabled = false;
            elemAddressLevel2.disabled = false;
            
            thisObj._replaceAddressLevel2SelectOptions(level_2_addresses);
        }

    }
    
    
    this._onChangeAddressLevel2 = function(){
        elemSaveError.hide();
        
        elemNameShow.hide();
        
        const level_2_hid = elemAddressLevel2.val()
        if (level_2_hid == '0'){return;}
        
        
        // Get level_2 from  curAddressLevel1
        curAddressLevel2        = addressManager.getAddressLevel2(
                                        curAddressLevel1, level_2_hid);
        let level_3_addresses   = addressManager.getLevel3(curAddressLevel2);
        
        
        // Request data from server only if not yet requested
        if (level_3_addresses == null){
            // Request AddressLevel3
            thisObj._requestAddressLevel3Data(curAddressLevel2);
        }
        else {
            elemAddressLevel1.disabled = false;
            elemAddressLevel2.disabled = false;
            elemAddressLevel3.disabled = false;
            
            let new_options = [];
            new_options.push({value:"0", text:"Please Select"});
            
            $(level_3_addresses).each(function(){
                new_options.push({value:this.hid, text:this.name});
            });
            
            thisObj._replaceSelectOptions(elemAddressLevel3, new_options);
        }
        
        
        // Request AddressLevel2Items
        elemSelectResShow.hide();
        
        let input_elem = elemAdrsItemSelect;
            
        if (input_elem.hasClass('is-invalid') == true){
            input_elem.removeClass('is-invalid');
        }
        
        thisObj._requestAddressLevel2Items(level_2_hid);
    }
    
	
    
}