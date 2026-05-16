// comp_read_only_field.js

// January 22, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {UiBasic}                    from './ui_basic.js';


export function ComponentReadOnly(input_settings){
    UiBasic.call(this);
    
    /* Typical settings
    settings = {
        uniqueKey:      ''
        
        className:      'form-group-text',
        textLabel:      'Name',
        textValue:      ''  
    }
    
    
    */
    
    const thisObj               = this;
    
    const settings              = input_settings;
    
    const elemIdUiShow          = `${settings.uniqueKey}-show`;
    
    const elemIdLabel           = `${settings.uniqueKey}-label`;
    const elemIdValue           = `${settings.uniqueKey}-value`;
  
    
    let elemLabel               = '';
    let elemValue               = '';
    
    
    
    this.getHtml = function(){
        
        
        return `
        <div class="${settings.className}" id="${elemIdUiShow}">
            <label id="${elemIdLabel}">
                ${settings.textLabel}
            </label>
            
            <div>
                <b>
                    <label id="${elemIdValue}">
                        ${settings.elemValue}
                    </label>
                </b>
            </div>
        </div>
        `;
        
    }
    
    
    this._findElements = function(){
        thisObj.elemUiShow      = document.getElementById(elemIdUiShow);
        
        elemLabel               = document.getElementById(elemIdLabel);
        elemValue               = document.getElementById(elemIdValue);
    }
    
    
    this._bindEventListeners = function(){
    }
    
    
    // Override parent method
    this.getInputElements = function(){
        return null;
    }
    
    
    this.setValue = function(text){
        if (text){
            elemValue.textContent = text;
        }
        else{
            elemValue.textContent = '';
        }

    }
    
    
    this.reset = function(){
		elemValue.textContent = '';
    } 
    
    
    
}