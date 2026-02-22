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
        SOW_STATUS_NAME,
        HARVEST_TYPE}               from '../../../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        createPaginationManager}    from '../../../../utils.js';

import {getSowBoarReference}        from '../../../common/common_app.js';


export function ProdGrossSalesTable(input_settings){
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
        
        elemIdTableShow         = `${settings.uniqueKey}-prod-gross-sales-show`;
        elemIdTableBody         = `${settings.uniqueKey}-prod-gross-sales-tbody`;
        
        
        
        const html = `
        
        
        <div id="${elemIdTableShow}">
            <table class="data-table table-prod-hist">
                <colgroup>
                    <col style="width: 33%;">
                    <col style="width: 20%;">
                    <col style="width: 20%;">
                    <col style="width: 27%;">
                </colgroup>
      
                <thead>
                    <tr>
                        <th>
                            <div>PID, Sow</div> 
                            <div><span class="love-icon">❤️</span> Boar</div>
                        </th>
                        <th style="padding-left:0; text-align:center;">Pigs Wean</th>
                        <th style="padding-left:0; text-align:center;">Pigs Sold</th>
                        <th style="padding-left:0; text-align:center;">Gross Sales</th>
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
        const html = `
            <tr>
                <td colspan="5"><div>No Entries</div></td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.getHtmlTableRow = function(cur_entry){
        
        const pig_production = cur_entry.pig_production;
        
        // PID, Sow ❤ Boar column
        const s_pid = `<span>${pig_production.farm_prod_id}</span>`; 
        
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
        
        
        let num_pigs_wean   = 0;
        if (weaning.num_pigs){
            num_pigs_wean = weaning.num_pigs;
        }
        else{
            if (weaning.num_pigs_m){
                num_pigs_wean += weaning.num_pigs_m;
            }
            
            if (weaning.num_pigs_f){
                num_pigs_wean += weaning.num_pigs_f;
            }

        }
        
        
        // Harvested pigs
        let num_pigs_sold       = 0;
        
        let total_sales         = 0.0;
        let feeds_cost          = 0.0;
        let gross_profit        = 0;
        
        const list_harvest      = cur_entry.data_details.list_harvest;
        if (list_harvest){
            let num_pigs_harvested  = 0;
            
            let num_gilt_boar_int   = 0;
            let num_gilt_boar_sold  = 0;
            
            
            
            for (const cur_entry of list_harvest){
                const prod_harvest  = cur_entry.prod_harvest;
                
                num_pigs_harvested  += prod_harvest.num_pigs;
                
                if (prod_harvest.sales && prod_harvest.sales.net_sales){
                    num_pigs_sold   += prod_harvest.num_pigs;
                    total_sales     += prod_harvest.sales.net_sales;
                }
                
                if (prod_harvest.harvest_type_hid == HARVEST_TYPE.INTERNAL_GILT_BOAR){
                    num_gilt_boar_int += prod_harvest.num_pigs;
                }
                
                if (prod_harvest.harvest_type_hid == HARVEST_TYPE.GILT_SALE){
                    num_gilt_boar_sold += prod_harvest.num_pigs;
                }
                
                if (prod_harvest.harvest_type_hid == HARVEST_TYPE.BOAR_SALE){
                    num_gilt_boar_sold += prod_harvest.num_pigs;
                }
            }
            
            
            
            
            
            // Compute feeds cost
            const prod_feeds_cost = cur_entry.feeds.cost;
            
            
            
            if (prod_feeds_cost.gestating)  {feeds_cost+= prod_feeds_cost.gestating;}
            if (prod_feeds_cost.lactating)  {feeds_cost+= prod_feeds_cost.lactating;}
            if (prod_feeds_cost.booster)    {feeds_cost+= prod_feeds_cost.booster;}
            if (prod_feeds_cost.prestarter) {feeds_cost+= prod_feeds_cost.prestarter;}
            if (prod_feeds_cost.starter)    {feeds_cost+= prod_feeds_cost.starter;}
            if (prod_feeds_cost.grower)     {feeds_cost+= prod_feeds_cost.grower;}
            if (prod_feeds_cost.finisher)   {feeds_cost+= prod_feeds_cost.finisher;}
            
            
            
            
            if (total_sales > 0){
                gross_profit  = total_sales - feeds_cost;
            }
        }
        
        
        const s_total_sales     = parentObj.moneyFormatter.format(total_sales);
        const s_feeds_cost      = parentObj.moneyFormatter.format(feeds_cost);
        const s_gross_profit    = parentObj.moneyFormatter.format(gross_profit);       
        
        
        
        const html = `
        <tr>
            <td>${html_pid_sow}</td>
            <td style="padding-left:0; text-align:center;">${num_pigs_wean}</td>
            <td style="padding-left:0; text-align:center;">${num_pigs_sold}</td>
            <td style="padding-left:0; text-align:center;">${s_total_sales}</td>
        </tr>
        `;
        
        return html;
    }
    
    
    this.getElemTableRow = function(cur_entry){
        const pig_prod  = cur_entry.pig_production;
        const pid       = pig_prod.farm_prod_id; 
        
        const elem_row = document.createElement('tr');
        
        const html = thisObj.getHtmlTableRow(cur_entry);
        elem_row.innerHTML = html;
         

        
        // Attach onclick listeners to td
        
        const elem_tds = elem_row.querySelectorAll('td'); 
        
        let index = 0
        for (const cur_td of elem_tds){
        

            if (index == 0 || index== 1) {
                cur_td.onclick = function(){
                    parentObj.onClickProdHistEntry(pid);
                }
            }
            
            
            
            if (index == 3){
            }
        
        
        
            index += 1;
        }
        
        return elem_row;
    }
    


} 
