// January 17, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {UiBasic}                from './ui_basic.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}         from '../../../utils.js';


export function UiInputDatePicker(input_settings){
    UiBasic.call(this);
    
    /* Typical settings
    settings = {
        uniqueKey:      ''
        
        className:      'form-group-date',
        textLabel:      'Name',
        isRequired:     false,
        invalidFeedBack: null,
        helpText:       ''  
    }
    
    
    */
    
    const thisObj               = this;
    
    const settings              = input_settings;
    
    const elemIdUiShow          = `${settings.uniqueKey}-show`;
    
    const elemIdText            = `${settings.uniqueKey}-text`;
    const elemIdTextInv         = `${settings.uniqueKey}-text-inv`;
	const elemIdTextHelp        = `${settings.uniqueKey}-text-help`;
	
    
	let elemUiShow              = null;
    let elemText                = null;
    let elemTextInv             = null;
	let elemTextHelp            = null;
    
    
    this.getHtml = function(){
        let className = 'form-group-date';
        if (settings.className){className = settings.className;}
        
        
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
        <div class="${className}" id="${elemIdUiShow}">
            <label for="${elemIdText}" class="form-label">
                ${settings.textLabel} ${s_required_mark}
            </label>
            
            <input  type="text" 
                    class="form-control" 
                    id="${elemIdText}" 
                    ${s_required}>
            
            <div class="invalid-feedback" id="${elemIdTextInv}">${s_invalid} </div>
            <div class="form-text" id="${elemIdTextHelp}">${s_help}</div>
        
        </div>
        `;
        
    }
    
    
    this._findElements = function(){
        elemUiShow      		= document.getElementById(elemIdUiShow);
        elemText                = document.getElementById(elemIdText);
        elemTextInv             = document.getElementById(elemIdTextInv);
		elemTextHelp            = document.getElementById(elemIdTextHelp);
        
        
        thisObj.elemUiShow      = elemUiShow;
        thisObj.elemTextInv     = elemTextInv;
        thisObj.elemTextHelp    = elemTextHelp;
    }
    
    
    this._bindEventListeners = function(){
        
    }
    
    
    this._processAfterHtmlRender = function(){
        // The date picker is purposely set to give the text format
        // so that there is no ambuiguity which number is date or month
        // because the users are not that tech savvy.
        //
        // So there will be date format conversions along the way
        // from getting data from the database, presenting to user 
        // and going back to database.
        
        
        // jquery to the rescue
        $('#'+elemIdText).datepicker({
            format: 'MM d, yyyy',  // This gives "January 31, 2026"
            autoclose: true,
            orientation: 'bottom',
            endDate: new Date() // Max date is today
        }).on('show', function(e) {
            $('.datepicker').addClass('datepicker-material');
        });
    }
    
    
    
    this.getElemText  = function(){
        return elemText;
    }
    
    
    // Override parent method
    this.getInputElements = function(){
        return elemText;
    }
    
    
    
    /**
    Will set date to datepicker.
    @param date_str - date string in YYYY-MM-DD format
    */
    this.setDate = function(date_str){
        const dt        = new Date(date_str);
        const dt_s      = formatDate(dt);
        elemText.value  = dt_s;
        
        // Set the datepicker to this date
        const $elemText = $(elemText);
        $elemText.datepicker('setDate', dt_s);
    }
    
    
    this.getValue = function(){
        return elemText.value;
    }
    
    
    this.reset = function(){
        elemText.value = '';
        elemText.classList.remove('is-valid', 'is-invalid');
    } 
    
    
    this.enabled = function(){
        elemText.disabled = false;
    }
    
    
    this.disabled = function(){
        elemText.disabled = true;
    }
    
}
