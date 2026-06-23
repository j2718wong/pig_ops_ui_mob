// input_checkbox.js

// January 16, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {UiBasic}                    from './ui_basic.js';


export function UiInputCheckBox(input_settings){
    UiBasic.call(this);
    
    /* Typical settings
    settings = {
        uniqueKey:      'sow-boar-add-edit-is-external'
        
        textLabel:      'Is Ready for Mating?',
        checkBoxLabel   'Production Ready',
        helpText:       'Need to specify if ready to mate. 
                <span class="sow-only"> Not Production Ready sow will be listed in Gilt List. </span>'
                 
        onChangeFunc:   null   // Reference to a function to callback when 
                                // there is a change in checked state 
    }
    
    
    */
    
    const thisObj               = this;
    
    const settings              = input_settings;
    
    const elemIdUiShow          = `${settings.uniqueKey}-show`;
    const elemIdCheckBox        = `${settings.uniqueKey}-check-box`;
    
    
    let elemUiShow              = null;
    
    let elemCheckBox            = null;
    
    // Store the onChange callback function
    let onChangeCallback        = settings.onChangeFunc || null;
    
    
    this.getHtml = function(){
        
        let classname = 'form-group-check';
        
        if ('className' in settings){
            classname = settings.className;
        }
        
        let s_help = '';
        if (settings.helpText && settings.helpText.length > 0){
            s_help = `<div class="form-text">${settings.helpText}</div>`;
        }
        
        return `
        <div class="${classname}" id="${elemIdUiShow}">
            <label for="${elemIdCheckBox}" class="form-label">
                ${settings.textLabel}
            </label>
            <input  type="checkbox" id="${elemIdCheckBox}" >
            <label for="${elemIdCheckBox}" class="checkbox-label">
                ${settings.checkBoxLabel}
            </label>
            ${s_help}
        </div>
        `;
        
    }
    
    
    this._findElements = function(){
        thisObj.elemUiShow      = document.getElementById(elemIdUiShow);
        
        elemCheckBox            = document.getElementById(elemIdCheckBox);
    }
    
    
    this._bindEventListeners = function(){
        // Attach change event listener
        if (elemCheckBox) {
            elemCheckBox.addEventListener('change', function(event) {
                // If callback exists, call it with the current state
                if (onChangeCallback && typeof onChangeCallback === 'function') {
                    onChangeCallback(event, this.checked);
                }
            });
        }
    }
        
    
    /**
     * Set the onChange callback function
     * @param {Function} callback - Function to call when checkbox state changes
     */
    this.setOnChange = function(callback) {
        if (typeof callback === 'function') {
            onChangeCallback = callback;
        }
    };
    
    
    this.getElemCheckBox  = function(){
        return elemCheckBox;
    }
    
    
    // Override parent method
    this.getInputElements = function(){
        return elemCheckBox;
    }
    
    
    this.getValue = function(){
        return null;
    }
    
    
    this.reset = function(){
        elemCheckBox.checked = false;
    } 
    
    
    /**
     * Get the current checked state
     * @returns {boolean} - True if checked, false otherwise
     */
    this.isChecked = function() {
        return elemCheckBox ? elemCheckBox.checked : false;
    };
   
    
}
