// February 19, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {UiBasic}                    from '../../common/ui/ui_basic.js';


export function ComponentWeightPerPig(input_settings){
    UiBasic.call(this);
    
    /* Typical settings
    settings = {
        uniqueKey:              '',
        elemDivContainer:       elemDivContainer,
    
        
        labelSelect:            '',
        helpText:               ''
        
    }
    
    
    */
    const thisObj               = this;
    const settings              = input_settings;

    const elemDivContainer      = settings.elemDivContainer;

    const elemIdUiShow          = `${settings.uniqueKey}-show`;


    const elemIdText            = `${settings.uniqueKey}-text`;
    
    const elemIdEntryAdd        = `${settings.uniqueKey}-entry-add`;
        
   
   
    let elemText                = null;
    let elemEntryAdd            = null;
    
    let elemListContainer       = null;
    let elemEmptyMsg            = null;     
  
    
    const listPigWeights        = [];
    
    
    this.callbackOnChangeInputs = null;
    
    
    this.getHtml = function(){
        let is_required = false;
        
        if ('isRequired' in settings){
            is_required = settings.isRequired;
        }
        
        let s_required = '';
        let s_required_mark = '';
        if (is_required){
            s_required = 'required';
            s_required_mark = `<span class="required">*</span>`;
        }
        
        let s_help = '';
        if (settings.helpText){
            s_help = settings.helpText;
        }
        
        
        return `
        <div class="form-group-number" id="${elemIdUiShow}">
            
        
            <label for="${elemIdText}" class="form-label">
                ${settings.labelText}, kg
            </label>
            
            <div class="input-group">
                <!--
                <select class="form-select" id="">
                </select>
                -->
                
                <input  type="text" 
                    class="form-control" 
                    id="${elemIdText}" 
                    maxlength="${settings.textMaxChars}" 
                    ${s_required}>
                
                <button class="btn" type="button" id="${elemIdEntryAdd}">
                    <i class="bi bi-plus"></i> Add
                </button>
            </div>
            ${s_help}
            
            <div class="weight-list"> 
                <div class="weight-list-empty-msg" id="">No weights yet.</div>
            </div>
            
        </div>
        `
        ;
        
    }
    
    
    this._findElements = function(){
        thisObj.elemUiShow      = elemDivContainer.querySelector('#'+elemIdUiShow);
        
       
        elemText                = elemDivContainer.querySelector('#'+elemIdText);
        
        elemEntryAdd            = elemDivContainer.querySelector('#'+elemIdEntryAdd);
        
        elemListContainer       = thisObj.elemUiShow.querySelector('.weight-list');
        elemEmptyMsg            = elemListContainer.querySelector('.weight-list-empty-msg');
        
    }
    
    
    this._bindEventListeners = function(){
        elemEntryAdd.addEventListener('click', function() {
            thisObj.addWeightFromInput();
        });
        
        
    }


    this.afterHtmlRenderExpandable = function(){
        this._findElements();
        this._bindEventListeners();
    }
    

    // Override parent method
    this.getInputElements = function(){
        const elems = [];
        elems.push(elemText);
        elems.push(elemEntryAdd);
        
        return elems;
    }
    

    
    this.reset = function(){
        const items = elemListContainer.querySelectorAll('.weight-badge');
        for (const cur_entry of items){
            cur_entry.remove();
        }
        
        thisObj.refreshEmptyMessage();
    } 
    
    
    this.enabled = function(){
        elemSelect.disabled = false;
        
        if (elemEntryAdd){
            elemEntryAdd.disabled = false;
        }
    }
    
    
    // helper: create a new weight element (span with remove button)
    this.createWeightBadge = function(weightValue, onRemoveCallback) {
        const badge = document.createElement('span');
        badge.className = 'weight-badge';
        
        // format weight (keep decimals tidy)
        const formatted = Number(weightValue).toFixed(1).replace(/\.0$/, '');
        badge.innerHTML = `${formatted} `;  // space before button

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-weight';
        removeBtn.setAttribute('aria-label', 'remove weight');
        removeBtn.innerHTML = '<i class="bi bi-x-circle"></i>';  // bootstrap icon
        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            onRemoveCallback(badge);
        });
        badge.appendChild(removeBtn);
        return badge;
    }
    
    
    // function to update empty message visibility
    this.refreshEmptyMessage = function() {
        const items = elemListContainer.querySelectorAll('.weight-badge');
        if (items.length === 0) {
            if (!elemListContainer.contains(elemEmptyMsg)) {
                elemListContainer.appendChild(elemEmptyMsg);
            }
        } else {
            if (elemListContainer.contains(elemEmptyMsg)) {
                elemEmptyMsg.remove();
            }
        }
    }
    
    
    // attach add event
    this.addWeightFromInput = function() {
        let rawValue = elemText.value.trim();
        if (rawValue === '') {
            // optional: alert or just ignore
            return;
        }
        
        // try to convert to number
        const num = parseFloat(rawValue);
        if (isNaN(num) || num < 0) {
            alert('Please enter a valid positive number.');
            return;
        }
        
        
        // create badge
        const newBadge = thisObj.createWeightBadge(num, function(badgeToRemove) {
            badgeToRemove.remove();
            thisObj.refreshEmptyMessage();
            
            if (thisObj.callbackOnChangeInputs){
                thisObj.callbackOnChangeInputs();
            }

        });



        // insert before empty message if present, or just append
        if (elemListContainer.contains(elemEmptyMsg)) {
            elemListContainer.insertBefore(newBadge, elemEmptyMsg);
        } else {
            elemListContainer.appendChild(newBadge);
        }

        // clear input
        elemText.value = '';
        thisObj.refreshEmptyMessage();
        
        if (thisObj.callbackOnChangeInputs){
            thisObj.callbackOnChangeInputs();
        }
    }
    
    
    
    // return weights in csv
    this.getPigWeights = function(){
        const items = elemListContainer.querySelectorAll('.weight-badge');
        
        let result = [];
        
        for (const cur_entry of items){
            let cur_weight = null;
            
            try{
                cur_weight= parseFloat(cur_entry.textContent)
                result.push(cur_weight);
            }
            catch(error){}
             
            
        }
        
        if (result.length == 0) {return null;}
        
        return result.sort(function(a,b){return b-a;});
    }
    
       
   
}
