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
        isRequired:     false,
        textMaxChars:   '',
        invalidFeedBack: null,
        helpText:       ''  
    }
    
    
    */
    
    const thisObj               = this;
    
    const settings              = input_settings;
    
    const elemIdText            = `${settings.uniqueKey}-text`;
    const elemIdCharCounter     = `${settings.uniqueKey}-char-counter`;
    const elemIdTextInv         = `${settings.uniqueKey}-text-inv`;
  
    
    let elemText                = null;
    let elemCharCounter         = null;
    let elemTextInv             = null;
    
    
    
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
        
        
        let s_invalid = '';
        if (settings.invalidFeedBack && settings.invalidFeedBack.length > 0){
            s_invalid = `<div class="invalid-feedback" id="${elemIdTextInv}">${settings.invalidFeedBack} </div>`;
        }
        
        let s_help = '';
        if (settings.helpText && settings.helpText.length > 0){
            s_help = `<div class="form-text">${settings.helpText}</div>`;
        }
        
        return `
        <div class="${settings.className}">
            <label for="${elemIdText}" class="form-label">
                ${settings.textLabel} ${s_required_mark}
                <span id="${elemIdCharCounter}" class="char-counter">0/${settings.textMaxChars}</span>
            </label>
            <input  type="text" class="form-control" id="${elemIdText}" maxlength="${settings.textMaxChars}" ${s_required}>
            ${s_invalid}
            ${s_help}
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
    
    
    this.getValue = function(){
        return elemText.value;
    }
    
    
    this.reset = function(){
        elemText.value = '';
        elemText.classList.remove('is-valid', 'is-invalid');
        
        updateCharCounter(elemText, elemCharCounter, settings.textMaxChars);
    } 
    
    
    this.setTextInvalid = function(text){
        elemTextInv.textContent = text;
    }
    
    
    this.disableInput = function(){
        elemText.disabled = true;
    }
    
    
    this.enableInput = function(){
        elemText.disabled = false;
    }
    
}