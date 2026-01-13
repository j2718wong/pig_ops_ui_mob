// January 13, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {updateCharCounter}          from '../page_view_basic.js'


export function InputTextWithCounter(input_settings){
    
    /* Typical settings
    settings = {
        className:          'form-group-text',
        textLabel:      'Name',
        elemIdText:     '',
        elemIdCharCounter: '',
        textMaxChars:   ''
        elemIdTextInv:  '',
        textHelpText:   
    }
    
    
    */
    
    const settings              = input_settings;
    
    let elemText                = null;
    let elemCharCounter         = null;
    let elemTextInv           	= null;
    
    
    
    this.getHtml = function(){
        return `
        <div class="${settings.className}">
            <label for="${settings.elemIdText}" class="form-label">${settings.textLabel}
                <span id="${settings.elemIdCharCounter}" class="char-counter">0/${settings.textMaxChars}</span>
            </label>
            <input  type="text" class="form-control" id="${settings.elemIdText}" maxlength="${settings.textMaxChars}">
            <div class="invalid-feedback" id="${settings.elemIdTextInv}">Please enter a valid name. </div>
            <div class="form-text">${settings.textHelpText}</div>
        </div>
        `;
        
    }
    
    
    this._findElements = function(){
        elemText                = document.getElementById(settings.elemIdText);
        elemCharCounter         = document.getElementById(settings.elemIdCharCounter);
        
        elemTextInv             = document.getElementById(settings.elemIdTextInv);
        
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
    
    
    this.reset = function(){
        elemText.value = '';
        elemText.classList.remove('is-valid', 'is-invalid');
        
        elemTextInv.style.display = 'none';
        
        updateCharCounter(elemText, elemCharCounter, settings.textMaxChars);
    } 
    
}