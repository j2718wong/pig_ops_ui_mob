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
        thisObj.navigation = navigation;
    }
    
    
    this.debugNavHistory = function(TAG){
        if (APPLICATION.DEBUG_NAV_HISTORY){
            if (thisObj.navigation){
                console.log('\n\n\nNavHistory List on showing this ' + TAG);
                console.log(navigation.managerNavHistory.navHistoryToString());
            }
            else{
                console.log('\n\n\nPageViewBasic.debugNavHistory; navigation NOT SET');
            }
        }
    }
    
    
    this.setClickListenersOnCloseAndCancelButtons = function(options){
        // Update Close and cancel button on click
        
        const TAG           = options.TAG;
        const elem_close    = options.elem_close;
        const elem_cancel   = options.elem_cancel;
        const go_back_page  = options.go_back_page;

        if (elem_close){
            elem_close.onclick = function() {
                // Remove NavHistoryHead if same with go_back_page
                thisObj.navigation.managerNavHistory.removeFromNavHistoryHead(
                    go_back_page);

                
                // This will not redraw the previous page; only show container
                thisObj.navigation.showThisPage(go_back_page);
                
                if (APPLICATION.DEBUG_NAV_HISTORY){
                    thisObj.debugNavHistory(TAG);
                }
            };
        }
        
        if (elem_cancel){
            elem_cancel.onclick = function() {
                // Remove NavHistoryHead if same with go_back_page
                thisObj.navigation.managerNavHistory.removeFromNavHistoryHead(
                    go_back_page);
                
                
                // This will not redraw the previous page; only show container
                thisObj.navigation.showThisPage(go_back_page);

                
                if (APPLICATION.DEBUG_NAV_HISTORY){
                    thisObj.debugNavHistory(TAG);
                }

            };
        }
    }
    
}
    
    
    

export function PageViewPigFarmPage(){  
    const thisObj       = this;
    
    PageViewBasic.call(this);
    

    
    this.commonSelectOptions    = new CommonSelectOptions();
    this.commonSelectOptions.navigation = thisObj.navigation;
    
    
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
    
    
    this.calculateDateTargetHarvest = function(data_pig_prod, dt_current, acc_settings_ops){
        if (!dt_current){
            dt_current = new Date();
            dt_current.setHours(0, 0, 0, 0);
        }
        
        let diff_msecs;
        let diff_days_birth = null;
        let diff_days_wean  = null;
        
        let num_days_harvest;
        let msecs_harvest;
        let dt_target_harvest;
        
        if (data_pig_prod.birth.date_actual){
            const dt_birth  = new Date(data_pig_prod.birth.date_actual);
            
            diff_msecs      = dt_current - dt_birth;
            diff_days_birth = Math.round(diff_msecs / APPLICATION.NUM_MSECS_1DAY);
            
            
            // num_days from birth
            num_days_harvest    = acc_settings_ops.num_days_harvest_from_birth;
                
            
            msecs_harvest = dt_birth.getTime() + num_days_harvest * APPLICATION.NUM_MSECS_1DAY;
            dt_target_harvest   = new Date(msecs_harvest);
            
        }
        else{
            // No cur_entry.birth.date_actual are fatteners brought from outside
            
            if (data_pig_prod.weaning.date_weaning){
                const dt_wean   = new Date(cur_entry.weaning.date_weaning);
                
                diff_msecs      = dt_current - dt_wean;
                diff_days_wean  = Math.round(diff_msecs / APPLICATION.NUM_MSECS_1DAY);
            
                
                // num_days from wean
                num_days_harvest    = acc_settings_ops.num_days_harvest_from_wean;


                msecs_harvest = dt_wean.getTime() + num_days_harvest * APPLICATION.NUM_MSECS_1DAY;
                dt_target_harvest   = new Date(msecs_harvest);
            }
        }
        
        return {
            date_target_harvest:  formatDate(dt_target_harvest, FORMAT_COMPACT),
            days_since_birth:     diff_days_birth,
            days_since_wean:      diff_days_wean  
        }
    
    }
    
    
    // Will search searchable string in data_pig_prod;
    // If found, return true; else return false
    this.searchStrInPigProdEntry = function(data_pig_prod, key){
        const s_pid = `${data_pig_prod.pig_production.farm_prod_id}`;
            
        let sow_name = data_pig_prod.sow.name;
        if (sow_name == null) {sow_name = data_pig_prod.sow.number;}
        
        let u_sow_name = sow_name.toUpperCase();
            
        
        const insemination = data_pig_prod.insemination;
        
        let boar_name = '';
        switch (insemination.insem_type){
            case 'B':{
                boar_name = insemination.boar.name;
                if (boar_name == null){
                    boar_name = insemination.boar.number;
                }
                break;
            }
            
            case 'AI_X':{
                boar_name = insemination.ai.semen_supplier.semen.name;
                break;
            }
            
            case 'AI_N':{
                const internal_boar = insemination.ai.internal_boar;
                
                boar_name = internal_boar.name;
                if (boar_name == null){
                    boar_name = internal_boar.number;
                }

                break;
            }
            
        }
        
        let u_boar_name = boar_name.toUpperCase();
        
        
        if (s_pid.startsWith(key)){return true;} 
        if (u_sow_name.startsWith(key)){return true;} 
        if (u_boar_name.startsWith(key)){return true;} 
        
        return false;
    }
 
 
    this.getSowBoarReference = function(sow_boar){
        let sow_reference = '';
        
        if (sow_boar.name  && sow_boar.name.length >0 ){
            sow_reference = `<span class="sow-boar-name">${sow_boar.name}</span>`;
        }
        else{
            sow_reference = `<span class="sow-boar-name">${sow_boar.number}</span>`;
        }
        
        return sow_reference;
    }
    
    
    this.getHtmlPidSowLoveBoar = function(data_pig_prod, exclude_boar_name){
        const pig_production = data_pig_prod.pig_production;
        
        // PID, Sow ❤ Boar column
        const s_pid = `<span>${pig_production.farm_prod_id}</span>`; 
        
        let sow_name = thisObj.getSowBoarReference(data_pig_prod.sow);
        let boar_name = '';
        
        
        const insemination = data_pig_prod.insemination;
        switch (insemination.insem_type){
            case 'B': {
                boar_name = thisObj.getSowBoarReference(insemination.boar);
                break;
            }
            
            case 'AI_X':{
                boar_name = `<span class="sow-boar-name">${insemination.ai.semen_supplier.semen.name}</span>`;
                break;
            }
            
            case 'AI_N':{
                boar_name = thisObj.getSowBoarReference(insemination.ai.internal_boar);
                break;
            }
        }
        
        
        let html_boar_name = `<div><span class="love-icon">❤️</span> ${boar_name}</div>`;
        if (exclude_boar_name){html_boar_name = '';}
        
        return `
            <div>${s_pid}, ${sow_name} </div>
            ${html_boar_name}
        `;
        
        
    }
    
}
