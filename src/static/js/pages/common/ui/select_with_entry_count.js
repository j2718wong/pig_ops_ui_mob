// January 13, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {UiBasic}                    from './ui_basic.js';


export function UiSelectWithEntryCount(input_settings){
    UiBasic.call(this);
    
    /* Typical settings
    settings = {
        uniqueKey:              ''
        
        labelSelect:            ''
        helpText:               ''
        
    }
    
    
    */
    const thisObj               = this;
    const settings              = input_settings;

    
    const elemIdUiShow          = `${settings.uniqueKey}-show`;
    
    const elemIdSelect          = `${settings.uniqueKey}-select`;
    const elemIdEntryCount      = `${settings.uniqueKey}-entry-count`;
    

    let elemSelect              = null;
    let elemEntryCount          = null;
    
    
    this.getHtml = function(){
        let s_help = '';
        
        if (settings.helpText){
            s_help = settings.helpText;
        }
        
        return `
        <div class="form-group-select" id="${elemIdUiShow}">
            <label for="${elemIdSelect}" class="form-label">
                ${settings.labelSelect} <span class="entries-count" id="${elemIdEntryCount}"></span>
            </label>
            
            <select class="form-select" id="${elemIdSelect}">
                <option value="-1" selected disabled>No Entries</option>
            </select>
            
            ${s_help}
        </div>
        `
        ;
        
    }
    
    
    this._findElements = function(){
        thisObj.elemUiShow      = document.getElementById(elemIdUiShow);
        
        elemSelect              = document.getElementById(elemIdSelect);
        elemEntryCount          = document.getElementById(elemIdEntryCount);
    }
    
    
    this._bindEventListeners = function(){
    }

    
    this.getElemSelect  = function(){
        return elemSelect;
    }


    // Override parent method
    this.getInputElements = function(){
        return elemSelect;
    }
    

    this.getValue = function(){
        return elemSelect.value;
    }
    
    
    this.setValue = function(value){
        elemSelect.value = value;
    }
    
    
    this.setEntryCount = function(data){
        if (data){
            if (data.length == 1){
                elemEntryCount.textContent = ` (${data.length} Entry)`;
            }
            else{
                elemEntryCount.textContent = ` (${data.length} Entries)`;
            }
        }
        else{
            elemEntryCount.textContent = ` (0 Entries)`;
        }
    }
    
    
    this.reset = function(){
        elemSelect.selectedIndex = 0;
        
        elemSelect.classList.remove('is-valid', 'is-invalid');
    } 
    

    
}
