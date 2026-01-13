// January 13, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {updateCharCounter}          from '../page_view_basic.js'


export function UiInputTextWithCounter(input_settings){
    
    /* Typical settings
    settings = {
        uniqueKey:      ''
        
        className:      'form-group-text',
        textLabel:      'Name',
        textMaxChars:   ''
        helpText:       ''  
    }
    
    
    */
    
    const settings              = input_settings;
    
    const elemIdText            = `${settings.uniqueKey}-text`;
    const elemIdCharCounter     = `${settings.uniqueKey}-char-counter`;
    const elemIdTextInv         = `${settings.uniqueKey}-text-inv`;
    
    
    
    let elemText                = null;
    let elemCharCounter         = null;
    let elemTextInv             = null;
    
    
    
    this.getHtml = function(){
        
        return `
        <div class="${settings.className}">
            <label for="${elemIdText}" class="form-label">${settings.textLabel}
                <span id="${elemIdCharCounter}" class="char-counter">0/${settings.textMaxChars}</span>
            </label>
            <input  type="text" class="form-control" id="${settings.elemIdText}" maxlength="${settings.textMaxChars}">
            <div class="invalid-feedback" id="${elemIdTextInv}">Please enter a valid name. </div>
            <div class="form-text">${settings.textHelpText}</div>
        </div>
        `;
        
    }
    
    
    this._findElements = function(){
        elemText                = document.getElementById(elemIdText);
        elemCharCounter         = document.getElementById(elemIdCharCounter);
        elemTextInv             = document.getElementById(elemIdTextInv);
        
    }
    
    
    this._bindEventListeners = function(){
        elemText.addEventListener('input', function(){
            updateCharCounter(elemText, elemCharCounter, 
                settings.textMaxChars);
            
            elemText.classList.remove('is-invalid');
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
    
    
    this.reset = function(){
        elemText.value = '';
        elemText.classList.remove('is-valid', 'is-invalid');
        
        elemTextInv.style.display = 'none';
        
        updateCharCounter(elemText, elemCharCounter, settings.textMaxChars);
    } 
    
    
    this.setTextInvalid = function(text){
        elemTextInv.textContent = text;
    }
    
}