// table_disposed.js

// February 13, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {TableBasic}                 from '../../common/table_basic.js';


import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        SOW_STATUS_NAME}            from '../../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}             from '../../../utils.js';

import {getSowBoarReference}        from '../../common/common_app.js';


export function SowBoarTableDisposed(input_settings){
    TableBasic.call(this, input_settings);
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    const navigation            = input_settings.navigation;
    
    /*
    Typical input_settings
    {
        navigation:             this,
        parentObj:              parentObj,
        elemDivContainer:       null,
        uniqueKey:              'sow-boar'
    }   
    */  
    const settings              = input_settings;
    
    const elemDivContainer      = settings.elemDivContainer;
    
    
    let elemIdTableShow         = null;
    let elemIdTableBody         = null;
    
    
    let elemTableShow           = null;
    let elemTableBody           = null;
    
    
    
    this.getHtml = function(){
        
        elemIdTableShow         = `${settings.uniqueKey}-disposed-table`;
        elemIdTableBody         = `${settings.uniqueKey}-disposed-tbody`;
        
        
        const translations      = navigation.getTranslations();
        
        let label_date_disposed = 'Date';
        let label_disposed_type = 'Type';
        let label_disposed_name = 'Name';
        let label_status        = 'Status';
        
        
        
        if (translations){
            if (translations.common_app && translations.common_app.labels){
                const labels_common = translations.common_app.labels;
                
                if (labels_common) {
                    if(labels_common.status)   {label_status = labels_common.status;}
                }
            }
            
            
            
            if (translations.page_sow_boar_list && 
                translations.page_sow_boar_list.labels){
                
                const labels_sow_boar_list = translations.page_sow_boar_list.labels;
                
                if (labels_sow_boar_list) {
                    if(labels_sow_boar_list.date_disposed) {
                        label_date_disposed = labels_sow_boar_list.date_disposed;
                    }
                    
                    if(labels_sow_boar_list.disposed_type) {
                        label_disposed_type = labels_sow_boar_list.disposed_type;
                    }

                    if(labels_sow_boar_list.disposed_name) {
                        label_disposed_name = labels_sow_boar_list.disposed_name;
                    }
                }
            }
        }
        
        
        const html = `
        
        <div id="${elemIdTableShow}">
            <table class="data-table table-disposed" >
                <colgroup>
                    <col style="width: 30%;">
                    <col style="width: 20%;">
                    <col style="width: 30%;">
                    <col style="width: 20%;">
                </colgroup>
                
                <thead>
                    <tr>
                        <th>${label_date_disposed}</th>
                        <th>${label_disposed_type}</th>
                        <th>${label_disposed_name}</th>
                        <th>${label_status}</th>
                    </tr>
                </thead>
                
                <tbody id="${elemIdTableBody}">
                </tbody>
            </table>
        </div>
        `;
        
        return html;
    }
    
    
    this._findElements = function(){
        elemTableShow           = elemDivContainer.querySelector('#'+elemIdTableShow);
        elemTableBody           = elemDivContainer.querySelector('#'+elemIdTableBody);
    }
    
    
    this._processAfterHtmlRender = function(){}
    
    
    this._bindEventListeners = function(){}

    
    this.getElemTableBody = function(){
        return elemTableBody;
    }
    
    
    this.show = function(){
        elemTableShow.style.display = 'block';
    }
    
    
    this.hide = function(){
        elemTableShow.style.display = 'none';
    }
    

    
    this.getHtmlTableRowEmpty = function(){
        let label_no_entries = thisObj.writeLabelNoEntries();
        
        if (label_no_entries){}
        else{label_no_entries = 'No Entries';}
        
        
        const html = `
            <tr>
                <td colspan="4"><div>${label_no_entries}</div></td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.getHtmlTableRow = function(cur_entry){
        const translations      = navigation.getTranslations();
        
        let label_sow           = 'Sow';
        let label_boar          = 'Boar';
        let label_gilt          = 'Gilt';
        
        if (translations){
            if (translations.common_app && translations.common_app.labels){
                const labels_common = translations.common_app.labels;
                
                if (labels_common) {
                    if(labels_common.sow)   {label_sow = labels_common.sow;}
                    if(labels_common.boar)  {label_boar = labels_common.boar;}
                    if(labels_common.gilt)  {label_gilt = labels_common.gilt;}
                }
            }
        }
        
        
        let pig_type = '';
        
        if (cur_entry.sow_boar.farm_boar_id){
            pig_type = label_boar;
        }
        else{
            if (cur_entry.sow_boar.status_id == SOW_STATUS.GROWING){
                pig_type = label_gilt;
            }
            else{
                pig_type = label_sow;
            }
        }
        
        
        const dt_disposed = new Date(cur_entry.sow_boar.date_dispose);
        const dt_disposed_s = formatDate(dt_disposed, FORMAT_COMPACT);
        
        
        let sow_reference = '';
        let sow_boar;
        
        if ('sow_boar' in cur_entry){
            sow_boar = cur_entry.sow_boar;
        }
        else{
            sow_boar = cur_entry;
        }
    
        if ((sow_boar.name != null) && (sow_boar.name.length >0)){
            sow_reference = `<span class="sow-boar-name">${sow_boar.name}</span>`;
            
            if (sow_boar.number && sow_boar.number.length >0){
                sow_reference += `<br>${sow_boar.number}`;
            }
        }
        else{
            sow_reference = `<span class="sow-boar-name">${sow_boar.number}</span>`;
        }
        
        let s_status = '';
        
        switch(cur_entry.sow_boar.dispose_status_id){
            case SOW_STATUS.CULLED: {s_status = 'Culled'; break;}
            case SOW_STATUS.DEAD:   {s_status = 'Dead'; break;}
            case SOW_STATUS.SOLD:   {s_status = 'Sold'; break;}
            case SOW_STATUS.DELETE: {s_status = 'Deleted'; break;}
                    
        }
        
        
        const html = `
            <tr>
                <td>${dt_disposed_s}</td>
                <td>${pig_type}</td>
                <td>${sow_reference}</td>
                <td>${s_status}</td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.getElemTableRow = function(cur_entry){
        const sow_boar = cur_entry.sow_boar;
        
        const elem_row = document.createElement('tr');
        
        const html = thisObj.getHtmlTableRow(cur_entry);
        elem_row.innerHTML = html;
         

        
        // Attach onclick listeners to td
        
        const elem_tds = elem_row.querySelectorAll('td'); 
        
        let index = 0
        for (const cur_td of elem_tds){
            // Clicking on boar_name should goto SowBoarEntry
            if (index == 2){
                cur_td.onclick = function(){
                    parentObj.onClickSowBoarEntry(sow_boar.hid);
                }
            }
            
            index += 1;
        }
        
        return elem_row;
    }
    
    
    this.requestDisposedSowBoar = function(callback){
        const cur_pig_farm_hid  = navigation.userControl.getCurrentFarmHid()
        
        const is_mob_view = 1; // TODO for desktop view
        
        const base_url = window.location.origin;
        const url = `${base_url}/sow_boar/list?pfhid=${cur_pig_farm_hid}&is_disposed=1&inc_user_audit=1`;
        
        
        const bearer_token = localStorage.getItem('access_token');
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    
                    if (callback){
                        callback(response.data)
                    }
                }
                else {
                    // TODO
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
    }
    
} 
