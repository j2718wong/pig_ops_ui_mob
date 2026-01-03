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
    
    this.navigation        = null;
    
	
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

    
	
}