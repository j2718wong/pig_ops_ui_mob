// December 31, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {CommonSelectOptions}    from './common_select_options.js';

import {APPLICATION,
        FLAG_BITS}              from '../../constants.js';

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
    
    
    this.showInfoBox = function(data_list, elem_page_info){
        if (data_list){
            if (data_list.length == 0){
                elem_page_info.style.display = 'block';
            }
            else{
                elem_page_info.style.display = 'none';
            }
        }
        else{
            elem_page_info.style.display = 'block';
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
    
    
    this.onClickShowSample = function(config_sample){
        // This should show a modal of an image.
        // The modal should be simple with a close button and a simple title.
        // The modal should be maximum width, small paddings because the image
        // needs to be as large as possible.
        
        /**
         * Typical config_sample
         * 
         * config_sample = {
         *      title:
         *      img_src:
         *      img_alt:
         *  }
         * 
         * */
        
        

        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.style.position = 'fixed';
        modalOverlay.style.top = '0';
        modalOverlay.style.left = '0';
        modalOverlay.style.right = '0';
        modalOverlay.style.bottom = '0';
        modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        modalOverlay.style.zIndex = '10000';
        modalOverlay.style.display = 'flex';
        modalOverlay.style.alignItems = 'center';
        modalOverlay.style.justifyContent = 'center';
        
        // Modal container
        const modalContainer = document.createElement('div');
        modalContainer.style.backgroundColor = 'white';
        modalContainer.style.borderRadius = '12px';
        modalContainer.style.maxWidth = '95%';
        modalContainer.style.maxHeight = '90vh';
        modalContainer.style.width = 'auto';
        modalContainer.style.overflow = 'hidden';
        modalContainer.style.display = 'flex';
        modalContainer.style.flexDirection = 'column';
        
        // Modal header
        const modalHeader = document.createElement('div');
        modalHeader.style.display = 'flex';
        modalHeader.style.justifyContent = 'space-between';
        modalHeader.style.alignItems = 'center';
        modalHeader.style.padding = '12px 16px';
        modalHeader.style.borderBottom = '1px solid #eee';
        modalHeader.style.backgroundColor = 'white';
        
        const title = document.createElement('h3');
        title.textContent = config_sample.title;
        title.style.margin = '0';
        title.style.fontSize = '16px';
        title.style.fontWeight = '600';
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.fontSize = '28px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.color = '#999';
        closeBtn.style.padding = '0';
        closeBtn.style.width = '32px';
        closeBtn.style.height = '32px';
        closeBtn.style.display = 'flex';
        closeBtn.style.alignItems = 'center';
        closeBtn.style.justifyContent = 'center';
        
        modalHeader.appendChild(title);
        modalHeader.appendChild(closeBtn);
        
        // Image container (scrollable)
        const imageContainer = document.createElement('div');
        imageContainer.style.overflow = 'auto';
        imageContainer.style.padding = '16px';
        imageContainer.style.backgroundColor = '#f5f5f5';
        imageContainer.style.textAlign = 'center';
        
        // Sample image
        const sampleImg = document.createElement('img');
        sampleImg.src = config_title.img_src;
        sampleImg.alt = config_title.img_alt;
        sampleImg.style.maxWidth = '100%';
        sampleImg.style.height = 'auto';
        sampleImg.style.borderRadius = '8px';
        sampleImg.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        
        // Fallback if image doesn't exist yet
        sampleImg.onerror = function() {
            this.style.display = 'none';
            const fallbackText = document.createElement('div');
            fallbackText.style.padding = '40px 20px';
            fallbackText.style.textAlign = 'center';
            fallbackText.style.color = '#666';
            fallbackText.innerHTML = `
                <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
                <div style="font-size: 16px; margin-bottom: 8px;">Sample schedule preview</div>
                <div style="font-size: 13px;">Add farrowing crates and gestating sows to see your actual schedule</div>
            `;
            imageContainer.appendChild(fallbackText);
        };
        
        imageContainer.appendChild(sampleImg);
        
        // Modal footer
        const modalFooter = document.createElement('div');
        modalFooter.style.padding = '12px 16px';
        modalFooter.style.borderTop = '1px solid #eee';
        modalFooter.style.textAlign = 'center';
        modalFooter.style.backgroundColor = 'white';
        
        const closeFooterBtn = document.createElement('button');
        closeFooterBtn.textContent = 'Close';
        closeFooterBtn.style.background = '#2196F3';
        closeFooterBtn.style.color = 'white';
        closeFooterBtn.style.border = 'none';
        closeFooterBtn.style.padding = '8px 24px';
        closeFooterBtn.style.borderRadius = '6px';
        closeFooterBtn.style.fontSize = '14px';
        closeFooterBtn.style.cursor = 'pointer';
        
        modalFooter.appendChild(closeFooterBtn);
        
        modalContainer.appendChild(modalHeader);
        modalContainer.appendChild(imageContainer);
        modalContainer.appendChild(modalFooter);
        modalOverlay.appendChild(modalContainer);
        
        // Close modal function
        const closeModal = function() {
            modalOverlay.remove();
        };
        
        // Event listeners
        closeBtn.onclick = closeModal;
        closeFooterBtn.onclick = closeModal;
        modalOverlay.onclick = function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        };
        
        // Add to body
        document.body.appendChild(modalOverlay);
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        
        // Restore scroll when modal closes
        const restoreScroll = function() {
            document.body.style.overflow = '';
        };
        
        // Override closeModal to restore scroll
        const originalClose = closeModal;
        window.closeModal = function() {
            restoreScroll();
            originalClose();
            delete window.closeModal;
        };
        
        closeBtn.onclick = function() {
            restoreScroll();
            originalClose();
        };
        
        closeFooterBtn.onclick = function() {
            restoreScroll();
            originalClose();
        };
        
        modalOverlay.onclick = function(e) {
            if (e.target === modalOverlay) {
                restoreScroll();
                originalClose();
            }
        };
    }
    
}
    
  

export function calculateNumDaysSinceInsem(insem_date, dt_current, acc_settings_ops){
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


export function calculateNumDaysSinceBirth(date_of_birth, dt_current, acc_settings_ops){
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
    

export function PageViewPigFarmPage(){  
    const thisObj       = this;
    
    PageViewBasic.call(this);
    

    
    this.commonSelectOptions    = new CommonSelectOptions();
    this.commonSelectOptions.navigation = thisObj.navigation;
    
    
    this.calculateNumDaysSinceInsem = function(insem_date, dt_current, acc_settings_ops){
        return calculateNumDaysSinceInsem(insem_date, dt_current, acc_settings_ops);
    }

    
    this.calculateNumDaysSinceBirth = function(date_of_birth, dt_current, acc_settings_ops){
        return calculateNumDaysSinceBirth(date_of_birth, dt_current, acc_settings_ops);
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
        
        // 2026-04-09 Notes:
        // 1.) Production Groups are introduced on this date;
        //     Normally, the PidSowLoveBoar column is use to identify a 
        //     production entry; 
        //
        // 2.) With Groups, there is no Sow and Boar Mating info; but there is 
        //     always a PID info as Production Group is treated as Fattening
        //     production entry; These groups will be written as "30, Group"
        //     where 30 is the PID;
        //
        // 3.) To know if the production entry is a group, it has to check 
        //      the (pig_production.flag & FLAG_BIT_IS_A_GROUP) > 0
        
        const FLAG_BIT_IS_A_GROUP   = FLAG_BITS.PIG_PROD.FLAG_BIT_IS_A_GROUP;
        
        // Check if flag exists and if this is a production group
        let isGroup = false;
        if (pig_production.flag !== undefined && pig_production.flag !== null) {
            isGroup = (pig_production.flag & FLAG_BIT_IS_A_GROUP) > 0;
        }
        
        // PID column
        const s_pid = `<span>${pig_production.farm_prod_id}</span>`;
        
        // If it's a group, show as "PID, Group" without sow/boar info
        if (isGroup) {
            return `
                <div>${s_pid}, Group</div>
            `;
        }
        
        // Normal production entry (not a group)
        let sow_name = '';
        if (data_pig_prod.sow) {
            sow_name = thisObj.getSowBoarReference(data_pig_prod.sow);
        } else {
            sow_name = 'Unknown';
        }
        
        let boar_name = '';
        const insemination = data_pig_prod.insemination;
        
        if (insemination) {
            switch (insemination.insem_type){
                case 'B': {
                    if (insemination.boar) {
                        boar_name = thisObj.getSowBoarReference(insemination.boar);
                    }
                    break;
                }
                
                case 'AI_X':{
                    if (insemination.ai && insemination.ai.semen_supplier && insemination.ai.semen_supplier.semen) {
                        boar_name = `<span class="sow-boar-name">${insemination.ai.semen_supplier.semen.name}</span>`;
                    }
                    break;
                }
                
                case 'AI_N':{
                    if (insemination.ai && insemination.ai.internal_boar) {
                        boar_name = thisObj.getSowBoarReference(insemination.ai.internal_boar);
                    }
                    break;
                }
            }
        }
        
        let html_boar_name = '';
        if (boar_name && !exclude_boar_name) {
            html_boar_name = `<div><span class="love-icon">❤️</span> ${boar_name}</div>`;
        }
        
        return `
            <div>${s_pid}, ${sow_name}</div>
            ${html_boar_name}
        `;
    }
        
}
