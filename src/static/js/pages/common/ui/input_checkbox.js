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
    }
    
    
    */
    
    const thisObj               = this;
    
    const settings              = input_settings;
    
    const elemIdUiShow          = `${settings.uniqueKey}-show`;
    const elemIdCheckBox        = `${settings.uniqueKey}-check-box`;
    
    
    let elemUiShow              = null;
    
    let elemCheckBox            = null;
    
    
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
    }
        
    
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
    
    
   
    
}