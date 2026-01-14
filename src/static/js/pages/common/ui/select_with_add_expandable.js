// January 13, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {updateCharCounter}          from '../page_view_basic.js'


export function UiSelectWithAddExpandable(input_settings){
    
    /* Typical settings
    settings = {
        uniqueKey:              ''
        
        titleExpandSection:     'Add New MedVac Brand',
        htmlExpandSection:      '',
        labelBtnExpandSave:    '',
        
        labelSelect:            ''
        helpText:               ''
        
    }
    
    
    */
    const thisObj               = this;
    const settings              = input_settings;

    
    const elemIdExpandSection   = `${settings.uniqueKey}-show`;
    const elemIdServerErrorMsg  = `${settings.uniqueKey}-server-error`;
    const elemIdExpandCancel    = `${settings.uniqueKey}-cancel`;
    const elemIdExpandSave      = `${settings.uniqueKey}-save`;
    const elemIdSelect          = `${settings.uniqueKey}-select`;
    const elemIdEntryCount      = `${settings.uniqueKey}-entry-count`;
    const elemIdEntryAdd        = `${settings.uniqueKey}-entry-add`;
        
    let elemExpandSection       = null;
    let elemServerErrorMsg      = null;
    let elemExpandCancel        = null;
    let elemExpandSave          = null;
    let elemSelect              = null;
    let elemEntryCount          = null;
    let elemEntryAdd            = null;
    
    
    let isExpandSectionExpanded = false;
    

    this.callbackBeforeExpand   = null;
    
    this.getHtml = function(){
        
        
        
        return `
        <div class="form-group-select">
            <div class="expandable-section" id="${elemIdExpandSection}">
                <h5>${settings.titleExpandSection}</h5>
                
                ${settings.htmlExpandSection}
                
                <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
                
                <button class="btn btn-cancel" id="${elemIdExpandCancel}">Cancel</button>
                <button class="btn btn-success" id="${elemIdExpandSave}">${settings.labelBtnExpandSave}</button>
            </div>
        
        
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
            <div class="form-text">${settings.helpText}</div>
        </div>
        `
        ;
        
    }
    
    
    this._findElements = function(){
        elemExpandSection       = document.getElementById(elemIdExpandSection);
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
    
    
    this.afterHtmlRenderExpandable = function(){
        
        this._findElements();
        this._bindEventListeners();
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
        elemServerErrorMsg.style.display = 'none';
    } 
    
}