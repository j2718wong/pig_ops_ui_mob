// December 31, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';


export function replaceSelectOptions(select_elem, new_options){
    select_elem.innerHTML = '';
    
    for (const cur_entry of new_options){
        const cur_value = cur_entry.value;
        const cur_text  = cur_entry.text;
        
        const new_option        = document.createElement('option');
        new_option.value        = cur_value;
        new_option.textContent  = cur_text;
            
            
        if ((cur_value == '0') || (cur_value == '-1')){
            new_option.disabled     = true;
        }
        select_elem.appendChild(new_option);
    }
    
    select_elem.selectedIndex = 0;
    
}



export function PageViewBasic(){
    const thisObj           = this;
    const NUM_MSECS_1DAY    = 1000 * 60 * 60 * 24;
    
    this.navigation         = null;
    
    
    this.moneyFormatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    
    this.setNavigation = function(navigation){
        this.navigation = navigation;
    }
    
    
    // Update character counter
    this.updateCharCounter = function (input_elem, counter_elem, max_length) {
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
    
    
    this.replaceSelectOptions = function(select_elem, new_options){
        replaceSelectOptions(select_elem, new_options);
        return;
    }
    
    
    /*
    Will calculate the number of days since date insemination up to now.
    
    @param insem_date: dat estr in YYYY-MM-DD format
    
    */
    
    this.calculateNumDaysSinceInsem = function(insem_date, dt_current, settings_operations){
        if (!dt_current){
            dt_current = new Date();
            dt_current.setHours(0, 0, 0, 0);
        }
        
        const dt_insem            = new Date(insem_date);
        const diff_msecs          = dt_current - dt_insem;
        
        let   diff_days           = Math.round(diff_msecs / NUM_MSECS_1DAY);
        
        // Adjust Day 1 on date of insemination/coupling if needed
        if (settings_operations){
            if (settings_operations.day_1_on_date_of_insem > 0){
                diff_days += 1;
            }
        }
        return diff_days;
    }

    
	this.calculateNumDaysSinceBirth = function(date_of_birth, dt_current, settings_operations){
        if (!dt_current){
            dt_current = new Date();
            dt_current.setHours(0, 0, 0, 0);
        }
        
        const dt_birth            = new Date(date_of_birth);
        const diff_msecs          = dt_current - dt_birth;
        
        let   diff_days           = Math.round(diff_msecs / NUM_MSECS_1DAY);
        
        // Adjust Day 1 on date of birth if needed
        if (settings_operations){
            if (settings_operations.day_1_on_date_of_birth > 0){
                diff_days += 1;
            }
        }
        return diff_days;
    }
    
}