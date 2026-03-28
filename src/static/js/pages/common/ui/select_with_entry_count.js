// January 13, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {UiBasic}                    from './ui_basic.js';



export const DEFAULT_LABEL_PLEASE_SELECT   = 'Please Select';
export const DEFAULT_LABEL_NO_ENTRIES      = 'No Entries';
export const DEFAULT_LABEL_ENTRY           = 'Entry';
export const DEFAULT_LABEL_ENTRIES         = 'Entries';



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
    
    
    let label_please_select     = DEFAULT_LABEL_PLEASE_SELECT;
    let label_no_entries        = DEFAULT_LABEL_NO_ENTRIES;
    let label_entry             = DEFAULT_LABEL_ENTRY;
    let label_entries           = DEFAULT_LABEL_ENTRIES;
    
    
    const helper = navigation.managerTranslations.translationHelper;
    
    
    // Common labels
    label_please_select     = helper.getSimpleTranslation('common.labels.please_select') || label_please_select;
    label_no_entries        = helper.getSimpleTranslation('common.labels.select_no_entries') || label_no_entries;
    label_entry             = helper.getSimpleTranslation('common.labels.entry') || label_entry;
    label_entries           = helper.getSimpleTranslation('common.labels.entries') || label_entries;
    
    
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
                <option value="-1" selected disabled>${label_no_entries}</option>
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
                elemEntryCount.textContent = ` (1 ${label_entry})`;
            }
            else{
                elemEntryCount.textContent = ` (${data.length} ${label_entries})`;
            }
        }
        else{
            elemEntryCount.textContent = ` (0 ${label_entries})`;
        }
    }
    
    
    this.reset = function(){
        elemSelect.selectedIndex = 0;
        
        elemSelect.classList.remove('is-valid', 'is-invalid');
    } 
    

    
}
