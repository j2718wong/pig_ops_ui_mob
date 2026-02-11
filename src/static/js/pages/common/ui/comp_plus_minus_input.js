// January 23, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {UiBasic}                    from './ui_basic.js';



export function ComponentPlusMinusInput(input_settings){
    UiBasic.call(this);
    
    /* Typical settings
    settings = {
        uniqueKey:      ''
        
        className:      'form-group',
        iconLabel:      '<i class="fas fa-venus" style="color: var(--icon-pink);"></i>',
        textLabel:      'Number of Live Female Piglets',
        minValue:       0,
        value:          0,
        step:           1,
        isRequired:     true,
        invalidFeedBack: null,
        helpText:       null  
    }
    
    
    */
    
    const thisObj               = this;
    
    const settings              = input_settings;
    
    if ('minValue' in settings){}
    else{settings.minValue = 0;}
    
    if ('step' in settings){}
    else{settings.step = 1;}
    
    if ('value' in settings){}
    else{settings.value = 0;}
    
    
    const elemIdUiShow          = `${settings.uniqueKey}-show`;
    
    const elemIdText            = `${settings.uniqueKey}-num-input`;
    const elemIdTextInv         = `${settings.uniqueKey}-text-inv`;
    const elemIdTextHelp        = `${settings.uniqueKey}-text-help`;
    
    
    let elemUiShow              = null;
    let elemText                = null;
    let elemTextInv             = null;
    let elemTextHelp            = null;
    
    
    this.callbackOnChangeInput   = null;
    
    
    this.getHtml = function(){
        let html_icon = '';
        if ('iconLabel' in settings){
            html_icon = settings.iconLabel;
        }
        
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
        
        
        
        return `
        <div class="${settings.className}" id="${elemIdUiShow}">
            <label for="${elemIdText}" class="form-label">
                ${html_icon}
                ${settings.textLabel} ${s_required_mark}
            </label>
            
            <div class="number-input-group">
                <button class="number-btn minus" data-target="${elemIdText}">-</button>
                <input type="number" class="form-control number-input" id="${elemIdText}" value="${settings.value}" min="${settings.minValue}">
                <button class="number-btn plus" data-target="${elemIdText}">+</button>
            </div>
            
            <div class="invalid-feedback" id="${elemIdTextInv}">${s_invalid} </div>
            <div class="form-text" id="${elemIdTextHelp}">${s_help}</div>
        </div>
        `;
        
    }
    
    
    this._findElements = function(){
        elemUiShow              = document.getElementById(elemIdUiShow);
        elemText                = document.getElementById(elemIdText);
        elemTextInv             = document.getElementById(elemIdTextInv);
        elemTextHelp            = document.getElementById(elemIdTextHelp);
        
        
        thisObj.elemUiShow      = elemUiShow;
        thisObj.elemTextInv     = elemTextInv;
        thisObj.elemTextHelp    = elemTextHelp;
    }
    
    
    this._bindEventListeners = function(){
        // Plus/Minus buttons for piglet counts
        const container     =  thisObj.elemUiShow;
        
        const plusButtons   = container.querySelectorAll('.number-btn.plus');
        const minusButtons  = container.querySelectorAll('.number-btn.minus');
        
        plusButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                const input = document.getElementById(target);
                let value = parseInt(input.value) || 0;
                input.value = value + settings.step;
                input.dispatchEvent(new Event('change'));
                
                if (thisObj.callbackOnChangeInput){
                    thisObj.callbackOnChangeInput();
                }
            });
        });
        
        minusButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                const input = document.getElementById(target);
                let value = parseInt(input.value) || 0;
                if (value > 0) {
                    input.value = value - settings.step;
                    input.dispatchEvent(new Event('change'));
                }
                
                if (thisObj.callbackOnChangeInput){
                    thisObj.callbackOnChangeInput();
                }

            });
        });
        
        
        elemText.addEventListener('input', function(event){
            if (thisObj.callbackOnChangeInput) {
                thisObj.callbackOnChangeInput();
            }
        });
        
    }
    
    
    
    
    this.getElemText  = function(){
        return elemText;
    }
    
    
    // Override parent method
    this.getInputElements = function(){
        return elemIdText;
    }
    
    
    this.setValue = function(text){
        elemText.value      = text;
    }
    
    
    this.getValue = function(){
        return elemText.value;
    }
    
    
    this.reset = function(){
        elemText.value = '0';
        elemText.classList.remove('is-valid', 'is-invalid');
        
        if (settings.invalidFeedBack && settings.invalidFeedBack.length > 0){
            thisObj.setTextInvalid(settings.invalidFeedBack);
        }
        
        if (settings.helpText && settings.helpText.length > 0){
            thisObj.setTextHelp(settings.helpText);
        }
    } 
    
    
    this.enabled = function(){
        elemText.disabled = false;
        
        const container     =  thisObj.elemUiShow;
        
        const plusButtons   = container.querySelectorAll('.number-btn.plus');
        const minusButtons  = container.querySelectorAll('.number-btn.minus');
        
        plusButtons.forEach(button => {
            button.disabled = false;
        });
        
        minusButtons.forEach(button => {
            button.disabled = false;
        });
        
    }
    
    
    this.disabled = function(){
        elemText.disabled = true;
        
        const container     =  thisObj.elemUiShow;
        
        const plusButtons   = container.querySelectorAll('.number-btn.plus');
        const minusButtons  = container.querySelectorAll('.number-btn.minus');
        
        plusButtons.forEach(button => {
            button.disabled = true;
        });
        
        minusButtons.forEach(button => {
            button.disabled = true;
        });

    }
    

}
