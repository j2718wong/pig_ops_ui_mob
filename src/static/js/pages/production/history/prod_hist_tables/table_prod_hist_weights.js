// February 21, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {TableBasic}                 from '../../../common/table_basic.js';


import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        SOW_STATUS_NAME}            from '../../../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        createPaginationManager}    from '../../../../utils.js';

import {getSowBoarReference}        from '../../../common/common_app.js';


export function ProdHistTableWeights(input_settings){
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
    
    
    this._writeInlineStyle = function(){
        const html = `
    <style>
        
        /* Updated Table Styles */
        
        .table-prod-weights th  {
            padding-right:0;
            overflow-wrap: anywhere; /* Breaks anywhere if needed */
            word-break: break-word;
            white-space: normal;
        }
        
        .table-prod-weights td {
            padding-right:0;
        }
        
      </style>
    `;
        return html;
    }
    
    
    
    
    this.getHtml = function(){
        
        elemIdTableShow         = `${settings.uniqueKey}-prod-hist-weights-show`;
        elemIdTableBody         = `${settings.uniqueKey}-prod-hist-weights-tbody`;
        
        const html_style    = this._writeInlineStyle();
        
        
        const html = `
        
        ${html_style}
        
        <div id="${elemIdTableShow}">
            <table class="data-table table-prod-weights">
                <colgroup>
                    <col style="width: 34%;">
                    <col style="width: 24%;">
                    <col style="width: 42%;">
                </colgroup>
      
                <thead>
                    <tr>
                        <th>
                            <div>PID, Sow</div> 
                            <div><span class="love-icon">❤️</span> Boar</div>
                        </th>
                        <th style="text-align:center;">Average <span class="nowrap">Wt, kg</span></th>
                        <th style="text-align:center;">Weights, kg</th>
                    </tr>
                </thead>
                
                <tbody id="${elemIdTableBody}">
                </tbody>
            </table>
            
            <div class="data-table-legend">Average Wt = Live Weight| Slaughter Weight</div>
            
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
        const html = `
            <tr>
                <td colspan="3"><div>No Entries</div></td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.getHtmlTableRow = function(cur_entry){
        const pig_production = cur_entry.pig_production;
        
        const s_pid = `<span>${pig_production.farm_prod_id}</span>`; 
        
        
        // PID, Sow ❤ Boar column
        
        let sow_name = parentObj.getSowBoarReference(cur_entry.sow);
        let boar_name = '';
        
        
        const insemination = cur_entry.insemination;
        switch (insemination.insem_type){
            case 'B': {
                boar_name = parentObj.getSowBoarReference(insemination.boar);
                break;
            }
            
            case 'AI_X':{
                boar_name = insemination.ai.semen_supplier.semen.name;
                break;
            }
            
            case 'AI_N':{
                boar_name = parentObj.getSowBoarReference(insemination.ai.internal_boar);
                break;
            }
        }
        
        const html_pid_sow = `
            <div>${s_pid}, ${sow_name} </div>
            <div><span class="love-icon">❤️</span> ${boar_name}</div>`;
        
        
        
        const birth         = cur_entry.birth; 
        const weaning       = cur_entry.weaning; 
        
        const date_birth    = birth.date_actual;
        const dt_birth      = new Date(date_birth);
        const s_dt_birth    = formatDate(dt_birth, FORMAT_COMPACT);
        
        
        // Average weight wean column
        let num_pigs_wean = 0;
        if (weaning.num_pigs){
            num_pigs_wean = weaning.num_pigs;
        } else{
            if (weaning.num_pigs_m) {
                num_pigs_wean += weaning.num_pigs_m;
            }
            
            if (weaning.num_pigs_f) {
                num_pigs_wean += weaning.num_pigs_f;
            }
        }
        
        
        // Process pig_prod_harvest
        const list_harvest = cur_entry.data_details.list_harvest;
        
        let live_total_pigs         = 0;
        let live_total_weight       = 0;
        
        let slaughter_total_pigs    = 0;
        let slaughter_total_weight  = 0;
        
        let weight_per_pig_live     = [];
        let weight_per_pig_slaughter= [];

        
        for (const cur_harvest of list_harvest) {
            const cur_live_weight = cur_harvest.prod_harvest.live_weight;
            const cur_slaughter_weight = cur_harvest.prod_harvest.slaughter_weight;
            
            if (cur_live_weight){
                if (cur_live_weight.weight){
                    live_total_pigs     += cur_harvest.prod_harvest.num_pigs;
                    live_total_weight   += cur_live_weight.weight;
                }
                
                if (cur_live_weight.pp_csv){
                    const pp_csv = cur_live_weight.pp_csv.split(',');
                    for(const cur_pig_wt of pp_csv){
                        try{
                            weight_per_pig_live.push(parseFloat(cur_pig_wt))
                        }
                        catch(error){}
                    } 
                }
            }
            
            if (cur_slaughter_weight){
                if (cur_slaughter_weight.weight){
                    slaughter_total_pigs    += cur_harvest.prod_harvest.num_pigs;
                    slaughter_total_weight  += cur_slaughter_weight.weight;
                }
                
                if (cur_slaughter_weight.pp_csv){
                    const pp_csv = cur_slaughter_weight.pp_csv.split(',');
                    for(const cur_pig_wt of pp_csv){
                        try{
                            weight_per_pig_slaughter.push(parseFloat(cur_pig_wt))
                        }
                        catch(error){}
                    } 
                }
            }
        }
    
    
        let average_live_wt         = null;
        let average_slaughhter_wt   = null;
        let s_average_live_wt       = 'N/A';
        let s_average_slaughter_wt  = 'N/A';
    
        if (live_total_pigs > 0){
            average_live_wt = live_total_weight / live_total_pigs;
            s_average_live_wt = parentObj.moneyFormatter.format(average_live_wt);
        }
        
        if (slaughter_total_pigs > 0){
            average_live_wt = slaughter_total_weight / slaughter_total_pigs;
            s_average_slaughter_wt  = parentObj.moneyFormatter.format(average_live_wt);
        }
        
        
        let s_weight_per_pig_live = null;
        let s_weight_per_pig_slaughter = null;
        
        // Sort in descending order
        if (weight_per_pig_live.length > 0) {
            weight_per_pig_live = weight_per_pig_live.sort(function(a,b){return b-a;});
            s_weight_per_pig_live = weight_per_pig_live.join(', ');
            s_weight_per_pig_live = 'LW: ' + s_weight_per_pig_live;
        }
        
        if (weight_per_pig_slaughter.length > 0) {
            weight_per_pig_slaughter = weight_per_pig_slaughter.sort(function(a,b){return b-a;});
            s_weight_per_pig_slaughter = weight_per_pig_slaughter.join(', ');
            s_weight_per_pig_slaughter = 'SW: ' + s_weight_per_pig_slaughter;
        }
        
        
        // Average weight column
        let s_average_wt = `
        <span class="nowrap">LW: ${s_average_live_wt}</span>
        <span class="nowrap">SW: ${s_average_slaughter_wt}</span>
        `;
        
        // Weights column
        let s_weights_list = '';
        if (s_weight_per_pig_live){
            s_weights_list = s_weight_per_pig_live;
        }
        else{
            if (s_weight_per_pig_slaughter){
                s_weights_list = s_weight_per_pig_slaughter;
            }

        }
    
    
        const html = `
        <tr>
            <td>${html_pid_sow}</td>
            <td>${s_average_wt}</td>
            <td>${s_weights_list}</td>
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
        
            // Clicking on sow_name should goto SowBoarEntry
            if (index == 0) {
                cur_td.onclick = function(){
                    parentObj.onClickSowBoarEntry(sow_boar.hid);
                }
            }
            
            
            if (index == 1){
            
                
            
            }
            
            
            
            if (index == 3){
            }
        
        
        
            index += 1;
        }
        
        return elem_row;
    }
    
    
} 
