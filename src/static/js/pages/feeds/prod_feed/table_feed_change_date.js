// table_feed_change_date.js

// April 5, 2026 - Updated June 16, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageTableBasic}         from '../../common/page_table_basic.js';


import {getSowBoarReference}    from '../../common/common_app.js';


import {APPLICATION,
        PAGE_ID,
        FEED_TYPE,
        FEED_TYPE_NAME,
        PROD_STATUS,
        PIG_PROD_TYPE}          from '../../../constants.js';

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
    
    let elemServerErrorMsg      = null;


    let showOptions             = null;
    
    let dtCurrentDate           = null;
    
    
    let dataPigProd             = null;
    
    let isEditable              = true;
    
    // Map feed type name to FEED_TYPE ID
    const FEED_TYPE_NAME_TO_ID = {
        [FEED_TYPE_NAME.BOST]: FEED_TYPE.BOOSTER,
        [FEED_TYPE_NAME.PRES]: FEED_TYPE.PRESTARTER,
        [FEED_TYPE_NAME.START]: FEED_TYPE.STARTER,
        [FEED_TYPE_NAME.GROW]: FEED_TYPE.GROWER,
        [FEED_TYPE_NAME.FINISH]: FEED_TYPE.FINISHER
    };
    
    
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
        elemServerErrorMsg      = document.getElementById(`${settings.uniqueKey}-server-error-msg`);
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
                feed_type_id:   FEED_TYPE.BOOSTER,
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
                feed_type_id:   FEED_TYPE.PRESTARTER,
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
                feed_type_id:   FEED_TYPE.STARTER,
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
                feed_type_id:   FEED_TYPE.GROWER,
                date_change:    date_change,
                num_days:       num_days_since_birth 
            });
            
            
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
                feed_type_id:   FEED_TYPE.FINISHER,
                date_change:    date_change,
                num_days:       num_days_since_birth 
            });
            
            
        }
        else{
            change_feed.push({
                feed_type:      FEED_TYPE_NAME.BOST,
                feed_type_id:   FEED_TYPE.BOOSTER,
                date_change:    null,
                num_days:       null 
            });
            
            change_feed.push({
                feed_type:      FEED_TYPE_NAME.PRES,
                feed_type_id:   FEED_TYPE.PRESTARTER,
                date_change:    null,
                num_days:       null 
            });

            change_feed.push({
                feed_type:      FEED_TYPE_NAME.START,
                feed_type_id:   FEED_TYPE.STARTER,
                date_change:    null,
                num_days:       null 
            });

            change_feed.push({
                feed_type:      FEED_TYPE_NAME.GROW,
                feed_type_id:   FEED_TYPE.GROWER,
                date_change:    null,
                num_days:       null 
            });

            change_feed.push({
                feed_type:      FEED_TYPE_NAME.FINISH,
                feed_type_id:   FEED_TYPE.FINISHER,
                date_change:    null,
                num_days:       null 
            });
            
        }
        
        
        // If already in history, user should not be able to add or edit entry;
        const pig_prod_status = dataPigProd.pig_production.prod_status_id;

                
        switch (pig_prod_status){
            case PROD_STATUS.LACTATING:
            case PROD_STATUS.WEANING:
            case PROD_STATUS.GROWING: {
                isEditable = true;
                break;
            }
            
            default: {
                isEditable = false;
                break;
            }
        }

        
        thisObj.renderTable(change_feed);
    }
    
     
     
    this.getHtmlTableHeader = function(){
        elemIdTableBody         = `${settings.uniqueKey}-table-tbody`;
        
        // Create server error message element
        const errorMsgHtml = `<div id="${settings.uniqueKey}-server-error-msg" class="server-error-msg" style="display: none;"></div>`;
        
        const html = `
        ${errorMsgHtml}
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
            // Format as "MMM DD, YYYY" for display (e.g., "Jun 16, 2026")
            const dateObj = new Date(cur_entry.date_change);
            const month = dateObj.toLocaleString('en-US', { month: 'short' });
            const day = dateObj.getDate();
            const year = dateObj.getFullYear();
            s_date_change = `${month} ${day}, ${year}`;
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
        
        let index = 0;
        for (const cur_td of elem_tds){

            if (isEditable == true && index === 1){ // Only the date column
                // Style the cell to look clickable
                cur_td.style.cursor = 'pointer';
                cur_td.style.backgroundColor = '#f9f9f9';
                
                // Store the original date value and feed_type_id
                const originalDate = cur_entry.date_change;
                const feed_type_id = cur_entry.feed_type_id;
                
                // Create a hidden input for jQuery datepicker
                const tempInputId = `temp-date-input-${Date.now()}-${index}`;
                const tempInput = document.createElement('input');
                tempInput.type = 'text';
                tempInput.id = tempInputId;
                tempInput.style.position = 'absolute';
                tempInput.style.opacity = '0';
                tempInput.style.pointerEvents = 'none';
                tempInput.style.width = '0';
                tempInput.style.height = '0';
                document.body.appendChild(tempInput);
                
                cur_td.onclick = function(event){
                    event.stopPropagation();
                    
                    // Set the current date value to the hidden input
                    if (originalDate) {
                        const displayDate = new Date(originalDate);
                        if (!isNaN(displayDate.getTime())) {
                            $(tempInput).datepicker('setDate', displayDate);
                        }
                    } else {
                        $(tempInput).datepicker('setDate', null);
                    }
                    
                    // Show the datepicker
                    $(tempInput).datepicker('show');
                };
                
                // Initialize jQuery datepicker on the hidden input
                $(tempInput).datepicker({
                    format: 'M dd, yyyy',  // "Jun 16, 2026" format
                    autoclose: true,
                    orientation: 'bottom',
                    endDate: new Date(), // Max date is today
                    todayHighlight: true
                }).on('show', function(e) {
                    $('.datepicker').addClass('datepicker-material');
                    
                    // Position the datepicker near the clicked cell
                    const rect = cur_td.getBoundingClientRect();
                    const $datepicker = $('.datepicker');
                    $datepicker.css({
                        'position': 'absolute',
                        'top': rect.bottom + window.scrollY + 'px',
                        'left': rect.left + window.scrollX + 'px'
                    });
                }).on('changeDate', function(e) {
                    const selectedDate = e.date;
                    
                    if (selectedDate && !isNaN(selectedDate.getTime())) {
                        // Format the date as "MMM DD, YYYY" for display
                        const month = selectedDate.toLocaleString('en-US', { month: 'short' });
                        const day = selectedDate.getDate();
                        const year = selectedDate.getFullYear();
                        const formattedDate = `${month} ${day}, ${year}`;
                        
                        // Update the cell text
                        cur_td.innerHTML = formattedDate;
                        
                        // Store the date in YYYY-MM-DD format for the backend
                        const yyyy = selectedDate.getFullYear();
                        const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                        const dd = String(selectedDate.getDate()).padStart(2, '0');
                        const isoDate = `${yyyy}-${mm}-${dd}`;
                        
                        // Update cur_entry with the ISO date
                        cur_entry.date_change = isoDate;
                        
                        // Calculate days since birth if applicable
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
                                if (daysSinceBirth !== null && daysSinceBirth !== undefined) {
                                    daysTd.innerHTML = daysSinceBirth;
                                } else {
                                    daysTd.innerHTML = '';
                                }
                            }
                            
                            // Update cur_entry
                            cur_entry.num_days = daysSinceBirth;
                        }
                        
                        // Call the onChangeFeedDate method
                        thisObj.onChangeFeedDate(feed_type_id, isoDate);
                    }
                    
                    // Hide the datepicker
                    $(tempInput).datepicker('hide');
                });
            }
            
            index += 1;
        }
        
        return elem_row;
    }
    
    
    this.setDateChangeCallback = function(callback) {
        thisObj.onDateChange = callback;
    };
    
    
    this.onClickRowEntry = function(entry_hid){
        
    }
    
    
    this.calculateNumDaysSinceBirth = function(date_change){
        
    }
    

    this.onChangeFeedDate = function(feed_type_id, date_change){
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
            return;
        }
        
        const user_hid = navigation.userControl.getUserHid();
        const base_url = window.location.origin;
        const pig_prod_hid = dataPigProd.pig_production.hid;
        
        // Send post request
        const post_data = {
            'uhid': user_hid,
            'pig_prod_hid': pig_prod_hid,
            'feed_type_id': feed_type_id,
            'date_change': date_change
        };
        
        let url = `${base_url}/pig_prod_feed/change_date`;
        
        const bearer_token = localStorage.getItem('access_token');
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
                if (elemServerErrorMsg) {
                    elemServerErrorMsg.style.display = 'none';
                }
            },
  
            success: function(response){
                if (response.result.num == 0){
                    const feed_change_date = response.feed_change_date;
                    console.log('Feed change date updated:', feed_change_date);
                    

                    if (feed_change_date) {
                        
                        // Update the dataPigProd with the new feed change dates
                        if (!dataPigProd.feeds) {
                            dataPigProd.feeds = {};
                        }
                        if (!dataPigProd.feeds.date_change_feed) {
                            dataPigProd.feeds.date_change_feed = {};
                        }
                        
                        // Map feed_type_id to the correct property name
                        const feedTypeMap = {
                            [FEED_TYPE.BOOSTER]:    'booster',
                            [FEED_TYPE.PRESTARTER]: 'prestarter',
                            [FEED_TYPE.STARTER]:    'starter',
                            [FEED_TYPE.GROWER]:     'grower',
                            [FEED_TYPE.FINISHER]:   'finisher'
                        };
                        
                        const feedKey = feedTypeMap[feed_type_id];
                        if (feedKey) {
                            dataPigProd.feeds.date_change_feed[feedKey] = date_change;
                        }
                        
                        navigation.pigFarm.managerPigProd.savePigProdListToCache(
                            PIG_PROD_TYPE.FATTENING);
                        
                    }
                }
                else{
                    if (elemServerErrorMsg) {
                        navigation.serverError.receivedErrorMessage(
                            response, elemServerErrorMsg);
                    }
                }
            },
  
            complete: function(){
                // TODO: what to do on complete
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
    }
}
