// December 31, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {CommonSelectOptions}    from './common_select_options.js';

import {APPLICATION}            from '../../constants.js';

import {formatDate,
        FORMAT_COMPACT}         from '../../utils.js';



export function replaceSelectOptions(select_elem, new_options){
    select_elem.innerHTML = '';
    
    for (const cur_entry of new_options){
        const cur_value = cur_entry.value;
        const cur_text  = cur_entry.text;
        
        let classname = null;
        if ('classname' in cur_entry){classname = cur_entry.classname;}
        
        const new_option        = document.createElement('option');
        new_option.value        = cur_value;
        new_option.textContent  = cur_text;
        if (classname){
            new_option.classList.add(classname);
        }
            
        if ((cur_value == '0') || (cur_value == '-1')){
            new_option.disabled     = true;
        }
        select_elem.appendChild(new_option);
    }
    
    select_elem.selectedIndex = 0;
    
}


export function updateCharCounter(input_elem, counter_elem, max_length) {
    const length = input_elem.value.length;
    counter_elem.textContent = `${length}/${max_length}`;
    
    // Update styling based on character count
    const percentUsed = (length / max_length) * 100;
    
    counter_elem.classList.remove('warning', 'danger');
    input_elem.classList.remove('warning', 'danger');
    
    if (percentUsed >= 90) {
        counter_elem.classList.add('danger');
        input_elem.classList.add('danger');
    } else if (percentUsed >= 75) {
        counter_elem.classList.add('warning');
        input_elem.classList.add('warning');
    }
}




export function PageViewBasic(){
    const thisObj           = this;
    
    this.navigation         = null;
    
    this.curUserLanguageKey = 'en';
    
    
    this.setUserLanguage = function(language_key){
        this.curUserLanguageKey = language_key;
        thisObj.onUserChangeLanguage();
    }
    
    this.moneyFormatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
    
    
    this.setNavigation = function(navigation){
        this.navigation = navigation;
    }
    
    
    // Update character counter
    this.updateCharCounter = function(input_elem, counter_elem, max_length) {
        updateCharCounter(input_elem, counter_elem, max_length);
        return;
    }
    
    
    this.replaceSelectOptions = function(select_elem, new_options){
        replaceSelectOptions(select_elem, new_options);
        return;
    }
    
}
    
    
    

export function PageViewPigFarmPage(){  
    const thisObj       = this;
    
    PageViewBasic.call(this);
    
    

    
    this.commonSelectOptions    = new CommonSelectOptions();
    
    
    
    this.calculateNumDaysSinceInsem = function(insem_date, dt_current, acc_settings_ops){
        if (!dt_current){
            dt_current = new Date();
            dt_current.setHours(0, 0, 0, 0);
        }
        
        const dt_insem            = new Date(insem_date);
        const diff_msecs          = dt_current - dt_insem;
        
        let   diff_days           = Math.round(diff_msecs / APPLICATION.NUM_MSECS_1DAY);
        
        // Adjust Day 1 on date of insemination/coupling if needed
        if (acc_settings_ops){
            if (acc_settings_ops.day_1_on_date_of_insem > 0){
                diff_days += 1;
            }
        }
        return diff_days;
    }

    
    this.calculateNumDaysSinceBirth = function(date_of_birth, dt_current, acc_settings_ops){
        if (!dt_current){
            dt_current = new Date();
            dt_current.setHours(0, 0, 0, 0);
        }
        
        const dt_birth            = new Date(date_of_birth);
        const diff_msecs          = dt_current - dt_birth;
        
        let   diff_days           = Math.round(diff_msecs / APPLICATION.NUM_MSECS_1DAY);
        
        // Adjust Day 1 on date of birth if needed
        if (acc_settings_ops){
            if (acc_settings_ops.day_1_on_date_of_birth > 0){
                diff_days += 1;
            }
        }
        return diff_days;
    }
    
    
    this.calculateDateExpectedWean = function(date_of_birth, acc_settings_ops){
        const dt_actual = new Date(date_of_birth);
            
        let num_days_wean = APPLICATION.DEFAULT_NUM_DAYS_WEAN;
        
        // check if the account has set num_days_wean
        if (acc_settings_ops){
            num_days_wean = acc_settings_ops.num_days_wean;
            
            // Adjust Day 1 on date of birth if needed
            if (acc_settings_ops.day_1_on_date_of_birth > 0){
                num_days_wean -= 1;
            }
        }
        
        let msecs_wean = dt_actual.getTime() + num_days_wean * APPLICATION.NUM_MSECS_1DAY;
        let dt_wean = new Date(msecs_wean);
        
        return formatDate(dt_wean, FORMAT_COMPACT);
    }
    
}
