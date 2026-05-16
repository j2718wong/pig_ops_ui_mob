// select_with_add_expandable.js

// January 13, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {UiBasic}                    from './ui_basic.js';

import {DEFAULT_LABEL_PLEASE_SELECT,
        DEFAULT_LABEL_NO_ENTRIES,   
        DEFAULT_LABEL_ENTRY,        
        DEFAULT_LABEL_ENTRIES}      from './select_with_entry_count.js';      



export function UiSelectWithAddExpandable(input_settings){
    UiBasic.call(this);
    
    /* Typical settings
    settings = {
        uniqueKey:              '',
        elemDivContainer:       elemDivContainer,
        
        titleExpandSection:     'Add New MedVac Brand',
        htmlExpandSection:      '',
        labelBtnExpandSave:     '',
        
        labelSelect:            '',
        helpText:               ''
        
    }
    
    
    */
    const thisObj               = this;
    const settings              = input_settings;
    const navigation            = input_settings.navigation;

    const elemDivContainer      = settings.elemDivContainer;

    const elemIdUiShow          = `${settings.uniqueKey}-show`;
    const elemIdExpandSection   = `${settings.uniqueKey}-expand-show`;
    const elemIdExpandSectionTitle = `${settings.uniqueKey}-expand-title`;
    const elemIdServerErrorMsg  = `${settings.uniqueKey}-server-error`;
    const elemIdExpandCancel    = `${settings.uniqueKey}-cancel`;
    const elemIdExpandSave      = `${settings.uniqueKey}-save`;
    const elemIdSelect          = `${settings.uniqueKey}-select`;
    const elemIdEntryCount      = `${settings.uniqueKey}-entry-count`;
    const elemIdEntryAdd        = `${settings.uniqueKey}-entry-add`;
        
    let elemExpandSection       = null;
    let elemExpandSectionTitle  = null;
    let elemServerErrorMsg      = null;
    let elemExpandCancel        = null;
    let elemExpandSave          = null;
    let elemSelect              = null;
    let elemEntryCount          = null;
    let elemEntryAdd            = null;
    
    
    let isExpandSectionExpanded = false;
    

    this.callbackBeforeExpand   = null;
    
    
    let label_cancel            = 'Cancel';
    let label_new               = 'New';
    
    let label_please_select     = DEFAULT_LABEL_PLEASE_SELECT;
    let label_no_entries        = DEFAULT_LABEL_NO_ENTRIES;
    let label_entry             = DEFAULT_LABEL_ENTRY;
    let label_entries           = DEFAULT_LABEL_ENTRIES;
    
    
    const helper = navigation.managerTranslations.translationHelper;
    
    
    // Common labels
    label_cancel            = helper.getSimpleTranslation('common.labels.cancel') || label_cancel;
    label_new               = helper.getSimpleTranslation('common.labels.new') || label_new;
    
        
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
            <div class="expandable-section" id="${elemIdExpandSection}">
                <h5 id="${elemIdExpandSectionTitle}">${settings.titleExpandSection}</h5>
                
                ${settings.htmlExpandSection}
                
                <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
                
                <button class="btn btn-cancel" id="${elemIdExpandCancel}">${label_cancel}</button>
                <button class="btn btn-success" id="${elemIdExpandSave}">${settings.labelBtnExpandSave}</button>
            </div>
        
        
            <label for="${elemIdSelect}" class="form-label">
                ${settings.labelSelect} <span class="entries-count" id="${elemIdEntryCount}"></span>
            </label>
            
            <div class="input-group">
                <select class="form-select" id="${elemIdSelect}">
                    <option value="-1" selected disabled>${label_no_entries}</option>
                </select>
                <button class="btn" type="button" id="${elemIdEntryAdd}">
                    <i class="bi bi-plus"></i> ${label_new}
                </button>
            </div>
            ${s_help}
        </div>
        `
        ;
        
    }
    
    
    this._findElements = function(){
        thisObj.elemUiShow      = document.getElementById(elemIdUiShow);
        
        elemExpandSection       = document.getElementById(elemIdExpandSection);
        elemExpandSectionTitle  = document.getElementById(elemIdExpandSectionTitle);
        elemServerErrorMsg      = document.getElementById(elemIdServerErrorMsg);
        elemExpandCancel        = document.getElementById(elemIdExpandCancel);
        elemExpandSave          = document.getElementById(elemIdExpandSave);
        elemSelect              = document.getElementById(elemIdSelect);
        elemEntryCount          = document.getElementById(elemIdEntryCount);
        elemEntryAdd            = document.getElementById(elemIdEntryAdd);
        
    }
    
    
    this._bindEventListeners = function(){
        elemEntryAdd.addEventListener('click', function() {
            thisObj.toggleExpandable();
        });
        
        
        elemExpandCancel.addEventListener('click', function() {
            thisObj.closeExpandable();
        });
    }


    this.afterHtmlRenderExpandable = function(){
        this._findElements();
        this._bindEventListeners();
    }
    

    // Override parent method
    this.getInputElements = function(){
        const elems = [];
        elems.push(elemSelect);
        elems.push(elemEntryAdd);
        
        return elems;
    }
    

    this.toggleExpandable = function(){
        isExpandSectionExpanded = !isExpandSectionExpanded;
            
        if (isExpandSectionExpanded) {
            if (thisObj.callbackBeforeExpand){
                thisObj.callbackBeforeExpand();
            }
            
            elemExpandSection.classList.add('expanded');
            elemExpandSection.style.marginBottom = '15px';
            
            elemServerErrorMsg.style.display = 'none';

            
        } else {
            elemExpandSection.classList.remove('expanded');
            elemExpandSection.style.marginBottom = 0;
        }
    }


    this.closeExpandable = function(){
        elemExpandSection.classList.remove('expanded');
        elemExpandSection.style.marginBottom = 0;
        isExpandSectionExpanded = false;
    }
    
    
    this.getElemExpandSectionTitle = function(){
        return elemExpandSectionTitle;
    }
    
    
    this.getElemSelect  = function(){
        return elemSelect;
    }


    this.getElemEntrySave  = function(){
        return elemExpandSave;
    }
    

    this.getElemServerErrorMsg = function(){
        return elemServerErrorMsg;
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
        elemServerErrorMsg.style.display = 'none';
        
        elemSelect.classList.remove('is-valid', 'is-invalid');
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
