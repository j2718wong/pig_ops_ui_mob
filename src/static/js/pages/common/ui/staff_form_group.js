// January 13, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {updateCharCounter}          from '../page_view_basic.js'


export function UiStaffFormGroup(input_settings){
    
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
    
    
    this.getHtml = function(){
        
        
        
        return 
        <div class="form-group-select">
            <div class="expandable-section" id="${elemIdExpandSection}">
                <h5>${settings.titleExpandSection}</h5>
                
                ${settings.htmlExpandSection}
                
                <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
                
                <button class="btn btn-cancel" id="${elemIdExpandCancel}">Cancel</button>
                <button class="btn btn-success" id="${elemIdExpandSave}">${settings.labelBtnExpandSave}</button>
            </div>
        
        
            <label for="${elemIdStaff}" class="form-label">
                Staff Member <span class="entries-count" id=${elemIdStaffCount}></span>
            </label>
            
            <div class="input-group" >
                <select class="form-select" id="${elemIdStaff}">
                    <option value="-1" selected disabled>No Entries</option>
                </select>
                <button class="btn" type="button" id="${elemIdStaffAdd}">
                    <i class="bi bi-plus"></i> New
                </button>
            </div>
            
            <div class="invalid-feedback">
                Need to select if not done by you.
            </div>
            
            <!-- Done by Me Checkbox -->
            <div id="doneByMeContainer" class="checkbox-group">
                <input type="checkbox" id="${elemIdChkDoneByMe}">
                <label for="${elemIdChkDoneByMe}" class="checkbox-label">
                    <i class="fas fa-user-check checkbox-icon"></i>
                    Done by Me
                </label>
            </div>
            
            <div class="form-text">Who did the operation.</div>
        </div>
        
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
            
            isExpandSectionExpanded = !isExpandSectionExpanded;
            
            if (isExpandSectionExpanded) {
                elemExpandSection.classList.add('expanded');
                elemExpandSection.style.marginBottom = '15px';
                
                elemServerErrorMsg.style.display = 'none';
                
            } else {
                elemExpandSection.classList.remove('expanded');
                elemExpandSection.style.marginBottom = 0;
            }
            
        });
        
        
        elemExpandCancel.addEventListener('click', function() {
            elemExpandSection.classList.remove('expanded');
            elemExpandSection.style.marginBottom = 0;
            isExpandSectionExpanded = false;
        });
        
        
    }
    
	
	this.afterHtmlRender = function(){
        this._findElements();
        this._bindEventListeners();
    }
    
	
    this.getElemSelect  = function(){
        return elemSelect;
    }
    
    
    
	
    this.getElemEntrySave  = function(){
        return elemExpandSave;
    }
    
    
	this.setEntryCount = function(data){
		elemEntryCount.textContent = ` (${data.length} Entries)`;
	}
    
	
    this.reset = function(){
		elemSelect.selectedIndex = 0;
		elemServerErrorMsg.style.display = 'none';
    } 
    
}