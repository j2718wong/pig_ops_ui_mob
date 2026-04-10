// April 5, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageTableBasic}         from '../../common/page_table_basic.js';


import {getSowBoarReference}    from '../../common/common_app.js';


import {APPLICATION,
        PAGE_ID,
        FEED_TYPE_NAME}        from '../../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}         from '../../../utils.js';


import {calculateNumDaysSinceBirth}  from '../../common/page_view_basic.js'


export function TableFeedChangeDate(input_settings){
    PageTableBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    
    /*
    Typical input_settings
    {
        navigation:             this,
        parentObj:              thisObj,
        uniqueKey:              'pig-prod-feed'
        elemDivContainer:       '<element>',
        parentPageId:           PAGE_ID.PROD_LACTA_ENTRY
        
    }   
    */  
    let settings                = input_settings;
    
    
    let elemDivContainer        = settings.elemDivContainer;

    let elemIdTableBody         = null;

    
    let elemTableBody           = null;
    



    let showOptions             = null;
    
    let dtCurrentDate           = null;
    
    
    let dataPigProd             = null;
    
    
    this.init = function(){
        
        thisObj.setSettingsTable({
            uniqueKey:      `${settings.uniqueKey}-feed-change-date`,
            noSearchAdd:    true,
            noRowCount:     true,
            tableTitle:     'Feed Change Date'
        });
        
        const html = thisObj.getHtml();
        elemDivContainer.innerHTML = html;
        
        
        thisObj.afterHtmlRender();  // This will call the parent method 
        thisObj.afterHtmlRenderThis();

    }
    
    
    this.afterHtmlRenderThis = function(){
        elemTableBody           = document.getElementById(elemIdTableBody);
    }
    
    
    this.getElemTableBody = function(){
        return elemTableBody;
    }
    
    
    
    this.beforeShow = function(data_pig_prod, options){
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        
        dataPigProd     = data_pig_prod;
        showOptions     = options;
        
        
        const acc_settings_ops  = navigation.pigFarm.getSettingsOperations();
        const date_of_birth     = dataPigProd.birth.date_actual_birth;
        
        
        const change_feed = [];
        
        
        let date_change_feed    = null;
        let num_days_since_birth = null;
        let date_change         = null;
        
        if (dataPigProd.feeds && dataPigProd.feeds.date_change_feed){
            date_change_feed = dataPigProd.feeds.date_change_feed;
            
            
            // Finisher
            num_days_since_birth = null;
            date_change          = null;

            if (date_change_feed.finisher){
                date_change = date_change_feed.finisher;
                
                if (date_of_birth){
                    num_days_since_birth = calculateNumDaysSinceBirth(
                        date_of_birth, new Date(date_change), acc_settings_ops);
                }
            }
            
            change_feed.push({
                feed_type:      FEED_TYPE_NAME.FINISH,
                date_change:    date_change,
                num_days:       num_days_since_birth 
            });
            
            
            // Grower
            num_days_since_birth = null;
            date_change          = null;

            if (date_change_feed.grower){
                date_change = date_change_feed.grower;
                
                if (date_of_birth){
                    num_days_since_birth = calculateNumDaysSinceBirth(
                        date_of_birth, new Date(date_change), acc_settings_ops);
                }
            }
            
            change_feed.push({
                feed_type:      FEED_TYPE_NAME.GROW,
                date_change:    date_change,
                num_days:       num_days_since_birth 
            });
            
            
            // Starter
            num_days_since_birth = null;
            date_change          = null;

            if (date_change_feed.starter){
                date_change = date_change_feed.starter;
                
                if (date_of_birth){
                    num_days_since_birth = calculateNumDaysSinceBirth(
                        date_of_birth, new Date(date_change), acc_settings_ops);
                }
            }
            
            change_feed.push({
                feed_type:      FEED_TYPE_NAME.START,
                date_change:    date_change,
                num_days:       num_days_since_birth 
            });
            
            
            // PreStarter
            num_days_since_birth = null;
            date_change          = null;

            if (date_change_feed.prestarter){
                date_change = date_change_feed.prestarter;
                
                if (date_of_birth){
                    num_days_since_birth = calculateNumDaysSinceBirth(
                        date_of_birth, new Date(date_change), acc_settings_ops);
                }
            }
            
            change_feed.push({
                feed_type:      FEED_TYPE_NAME.PRES,
                date_change:    date_change,
                num_days:       num_days_since_birth 
            });
            
            
            // Booster
            num_days_since_birth = null;
            date_change          = null;

            if (date_change_feed.booster){
                date_change = date_change_feed.booster;
                
                if (date_of_birth){
                    num_days_since_birth = calculateNumDaysSinceBirth(
                        date_of_birth, new Date(date_change), acc_settings_ops);
                }
            }
            
            change_feed.push({
                feed_type:      FEED_TYPE_NAME.BOST,
                date_change:    date_change,
                num_days:       num_days_since_birth 
            });
        }
        
        else{
            change_feed.push({
                feed_type:      FEED_TYPE_NAME.FINISH,
                date_change:    null,
                num_days:       null 
            });
            
            change_feed.push({
                feed_type:      FEED_TYPE_NAME.GROW,
                date_change:    null,
                num_days:       null 
            });

            change_feed.push({
                feed_type:      FEED_TYPE_NAME.START,
                date_change:    null,
                num_days:       null 
            });

            change_feed.push({
                feed_type:      FEED_TYPE_NAME.PRES,
                date_change:    null,
                num_days:       null 
            });
            
            change_feed.push({
                feed_type:      FEED_TYPE_NAME.BOST,
                date_change:    null,
                num_days:       null 
            });
            
        }
        
        thisObj.renderTable(change_feed);
        
    }
    
    
     
     
    this.getHtmlTableHeader = function(){
        elemIdTableBody         = `${settings.uniqueKey}-table-tbody`;
        
        const html = `
        <table class="data-table" id="">
            <colgroup>
                <col style="width: 28%;">
                <col style="width: 47%;">
                <col style="width: 25%;">
            </colgroup>
                
            <thead>
                <tr>
                    <th>Feed Type</th>
                    <th>Change Date</th>
                    <th>Day Num</th>
                </tr>
            </thead>
            
            <tbody id="${elemIdTableBody}">
            </tbody>
        </table>
        
        `;
        
        return html;
        
    }
       

    this.getHtmlTableRowEmpty = function(){
        const html = `
            <tr>
                <td colspan="3"><div>No Entries</div></td>
            </tr>
        `;
        return html;
    }
    

    this.getHtmlTableRow = function(cur_entry){
        let s_num_days = '';
        
        if (cur_entry.num_days){
            s_num_days = `${cur_entry.num_days}`;
        }
        

        let s_date_change = '&nbsp;';
        if (cur_entry.date_change){
            s_date_change = formatDate(cur_entry.date_change, FORMAT_COMPACT)
        }
        
        
        
        const html = `
            <tr>
                <td>${cur_entry.feed_type}</td>
                <td>${s_date_change}</td>
                <td>${s_num_days}</td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.getElemTableRow = function(cur_entry){
        
        const elem_row = document.createElement('tr');
        
        const html = thisObj.getHtmlTableRow(cur_entry);
        elem_row.innerHTML = html;
         

        
        // Attach onclick listeners to td
        
        const elem_tds = elem_row.querySelectorAll('td'); 
        
        let index = 0
        for (const cur_td of elem_tds){

            if (index == 1){ // Only the date column
                // Store original values
                const originalDate = cur_entry.date_change;
                
                // Style the cell to look clickable
                cur_td.style.cursor = 'pointer';
                cur_td.style.backgroundColor = '#f9f9f9';
                
                cur_td.onclick = function(event){
                    event.stopPropagation();
                    
                    // Get the position of the clicked cell
                    const rect = cur_td.getBoundingClientRect();
                    
                    // Create a temporary container for the datepicker
                    const containerId = `datepicker-container-${Date.now()}-${Math.random()}`;
                    const container = document.createElement('div');
                    container.id = containerId;
                    container.style.position = 'absolute';
                    container.style.top = `${rect.bottom + window.scrollY}px`;
                    container.style.left = `${rect.left + window.scrollX}px`;
                    container.style.zIndex = '10000';
                    container.style.backgroundColor = 'white';
                    container.style.padding = '10px';
                    container.style.borderRadius = '4px';
                    container.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
                    
                    // Create input element
                    const tempInput = document.createElement('input');
                    tempInput.type = 'text';
                    tempInput.id = `temp-date-input-${Date.now()}`;
                    tempInput.style.padding = '8px';
                    tempInput.style.border = '1px solid #ccc';
                    tempInput.style.borderRadius = '4px';
                    tempInput.style.fontSize = '14px';
                    
                    container.appendChild(tempInput);
                    
                    // Add close button
                    const closeBtn = document.createElement('button');
                    closeBtn.innerHTML = '×';
                    closeBtn.style.position = 'absolute';
                    closeBtn.style.top = '5px';
                    closeBtn.style.right = '5px';
                    closeBtn.style.border = 'none';
                    closeBtn.style.background = 'none';
                    closeBtn.style.fontSize = '18px';
                    closeBtn.style.cursor = 'pointer';
                    closeBtn.onclick = function() {
                        if (container && container.parentNode) {
                            container.remove();
                        }
                        if (tempInput && tempInput.datepicker) {
                            $(tempInput).datepicker('destroy');
                        }
                    };
                    container.appendChild(closeBtn);
                    
                    document.body.appendChild(container);
                    
                    // Initialize datepicker on the visible input
                    $(tempInput).datepicker({
                        format: 'dd M yyyy',  // This gives "05 Apr 2026"
                        autoclose: true,
                        orientation: 'auto',
                        endDate: new Date(), // Max date is today
                        todayHighlight: true,
                        container: 'body'  // Attach to body to avoid positioning issues
                    }).on('show', function(e) {
                        $('.datepicker').addClass('datepicker-material');
                    }).on('changeDate', function(e) {
                        const selectedDate = e.date;
                        
                        // Format date as "05 Apr 2026"
                        const day = selectedDate.getDate().toString().padStart(2, '0');
                        const month = selectedDate.toLocaleString('en-US', { month: 'short' });
                        const year = selectedDate.getFullYear();
                        const formattedDate = `${day} ${month} ${year}`;
                        
                        // Update the cell text
                        cur_td.innerHTML = formattedDate;
                        
                        // Update your data model
                        cur_entry.date_change = selectedDate.toISOString().split('T')[0];
                        
                        // Calculate days since birth if needed
                        if (dataPigProd && dataPigProd.birth && dataPigProd.birth.date_actual_birth) {
                            const acc_settings_ops = navigation.pigFarm.getSettingsOperations();
                            const birthDate = new Date(dataPigProd.birth.date_actual_birth);
                            const daysSinceBirth = calculateNumDaysSinceBirth(
                                birthDate, 
                                selectedDate, 
                                acc_settings_ops
                            );
                            
                            // Update the days column (third column, index 2)
                            const daysTd = elem_tds[2];
                            if (daysTd) {
                                daysTd.innerHTML = daysSinceBirth || '';
                            }
                            
                            // Update cur_entry
                            cur_entry.num_days = daysSinceBirth;
                        }
                        
                        // Clean up
                        if (container && container.parentNode) {
                            container.remove();
                        }
                        $(tempInput).datepicker('destroy');
                    });
                    
                    // Set the date if exists
                    if (originalDate && originalDate !== '&nbsp;') {
                        let dateObj = originalDate;
                        if (typeof originalDate === 'string') {
                            dateObj = new Date(originalDate);
                        }
                        if (!isNaN(dateObj.getTime())) {
                            $(tempInput).datepicker('setDate', dateObj);
                        }
                    }
                    
                    // Remove container when clicking outside
                    const removeContainer = function(e) {
                        if (container && !container.contains(e.target) && e.target !== tempInput) {
                            if (container.parentNode) {
                                container.remove();
                            }
                            $(tempInput).datepicker('destroy');
                            document.removeEventListener('click', removeContainer);
                        }
                    };
                    
                    // Delay adding the event listener to avoid immediate trigger
                    setTimeout(() => {
                        document.addEventListener('click', removeContainer);
                    }, 100);
                };
            }
            
            index += 1;
        }
        
        return elem_row;
    }
    
      
   
    
    
    this.getEntry = function(entry_hid){
        const data_list = dataPigProd.data_details.list_prod_feed;
        
        for (const cur_entry of data_list){
            if (cur_entry.pig_prod_feed.hid == entry_hid){
                return cur_entry;
            }
        }
        
        return null;
    }
    
    
    
    this.onClickRowEntry = function(entry_hid){
        
    }
    
    
    this.onSuccessEditEntry = function(){
        
    }
}
