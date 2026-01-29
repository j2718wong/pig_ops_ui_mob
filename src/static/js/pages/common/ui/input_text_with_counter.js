// January 13, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {UiBasic}                    from './ui_basic.js';

import {updateCharCounter}          from '../page_view_basic.js'


export function UiInputTextWithCounter(input_settings){
    UiBasic.call(this);
    
    /* Typical settings
    settings = {
        uniqueKey:      ''
        
        isTextArea:     false,  //optional; for text areas
        className:      'form-group-text',
        textLabel:      'Name',
        isRequired:     false,
        textMaxChars:   160,
        invalidFeedBack: null,
        helpText:       ''  
    }
    
    
    */
    
    const thisObj               = this;
    
    const settings              = input_settings;
    
    const elemIdUiShow          = `${settings.uniqueKey}-show`;
    
    const elemIdText            = `${settings.uniqueKey}-text`;
    const elemIdCharCounter     = `${settings.uniqueKey}-char-counter`;
    const elemIdTextInv         = `${settings.uniqueKey}-text-inv`;
    const elemIdTextHelp        = `${settings.uniqueKey}-text-help`;
  
    
    let elemUiShow              = null;
    let elemText                = null;
    let elemCharCounter         = null;
    let elemTextInv             = null;
    let elemTextHelp            = null;
    
    
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
            s_invalid = settings.invalidFeedBack;
        }
        
        let s_help = '';
        if (settings.helpText && settings.helpText.length > 0){
            s_help = settings.helpText;
        }
        
        let s_input = '';
        if ('isTextArea' in settings){
            s_input = `
            <textarea  
                    class="form-control" 
                    id="${elemIdText}" 
                    rows="${settings.rows}" 
                    maxlength="${settings.textMaxChars}" 
                    ${s_required}>
            </textarea>
            `;
        }
        else{
            s_input = `
            <input  type="text" 
                    class="form-control" 
                    id="${elemIdText}" 
                    maxlength="${settings.textMaxChars}" 
                    ${s_required}>
            `;
        }
        
        
        return `
        <div class="${settings.className}" id="${elemIdUiShow}">
            <label for="${elemIdText}" class="form-label">
                ${settings.textLabel} ${s_required_mark}
                <span id="${elemIdCharCounter}" class="char-counter">0/${settings.textMaxChars}</span>
            </label>
            
            ${s_input}
            
            <div class="invalid-feedback" id="${elemIdTextInv}">${s_invalid} </div>
            <div class="form-text" id="${elemIdTextHelp}">${s_help}</div>
        </div>
        `;
        
    }
    
    
    this._findElements = function(){
        elemUiShow              = document.getElementById(elemIdUiShow);
        elemText                = document.getElementById(elemIdText);
        elemCharCounter         = document.getElementById(elemIdCharCounter);
        elemTextInv             = document.getElementById(elemIdTextInv);
        elemTextHelp            = document.getElementById(elemIdTextHelp);
        
        
        thisObj.elemUiShow      = elemUiShow;
        thisObj.elemTextInv     = elemTextInv;
        thisObj.elemTextHelp    = elemTextHelp;
    }
    
    
    this._bindEventListeners = function(){
        elemText.addEventListener('input', function(){
            updateCharCounter(elemText, elemCharCounter, 
                settings.textMaxChars);
            
            elemText.classList.remove('is-invalid');
        });
        
    }
    
    
    
    this.getElemText  = function(){
        return elemText;
    }
    
    
    // Override parent method
    this.getInputElements = function(){
        return elemText;
    }
    
    
    this.setValue = function(text){
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
    
    
}