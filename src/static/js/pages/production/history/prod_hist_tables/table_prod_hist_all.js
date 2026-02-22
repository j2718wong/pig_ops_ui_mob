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


export function ProdHistTableAll(input_settings){
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
        
        elemIdTableShow         = `${settings.uniqueKey}-prod-hist-all-show`;
        elemIdTableBody         = `${settings.uniqueKey}-prod-hist-all-tbody`;
        
        const html = `
        
        
        <div id="${elemIdTableShow}">
            <table class="data-table table-prod-hist">
                <colgroup>
                    <col style="width: 33%;">
                    <col style="width: 18%;">
                    <col style="width: 14%;">
                    <col style="width: 15%;">
                    <col style="width: 20%;">
                </colgroup>
      
                <thead>
                    <tr>
                        <th>
                            <div>PID, Sow</div> 
                            <div><span class="love-icon">❤️</span> Boar</div>
                        </th>
                        <th style="padding-left:0; text-align:center;">Date Birth</th>
                        <th style="padding-left:0; text-align:center;">Pigs Birth</th>
                        <th style="padding-left:0; text-align:center;">Pigs Dead</th>
                        <th>Pigs Wean</th>
                    </tr>
                </thead>
                
                <tbody id="${elemIdTableBody}">
                </tbody>
            </table>
            
            <div class="data-table-legend">Pigs Dead = Deat At Birth | Dead before Wean</div>
            <div class="data-table-legend">Pigs Wean = Pigs weaned | Average Weight</div>
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
                <td colspan="4"><div>No Entries</div></td>
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
        
        
        // Pigs Birth column
        let num_pigs_birth = birth.pigs_live_m + birth.pigs_live_f;
        
        let num_pigs_dead_birth = 0;
        if (birth.num_dead_at_birth){
            num_pigs_dead_birth = birth.num_dead_at_birth;
        }
        
        
        // Pigs Wean column
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
        
        
        // Pigs Dead column
        let num_pigs_dead_wean = num_pigs_birth - num_pigs_wean;
        
        let s_dead = '';
        if (num_pigs_dead_birth > 0 || num_pigs_dead_wean > 0){
            if (num_pigs_dead_birth > 0){
                s_dead += `${num_pigs_dead_birth}`
            }
            else{
                s_dead += '--';
            }
            
            s_dead += '|';
            
            if (num_pigs_dead_wean > 0){
                s_dead += `${num_pigs_dead_wean}`
            }
            else{
                s_dead += '--';
            }
            
        }
        
        
        // Pigs Wean column
        let s_wean = `${num_pigs_wean}`
        
        let ave_wean_wt = null;
        if (weaning.weight && num_pigs_wean > 0){
            let ave_wean_wt = weaning.weight/num_pigs_wean;
            let s_ave_wean_wt = parentObj.moneyFormatter.format(ave_wean_wt);
            
            s_wean += ` <span class="nowrap" style="font-weight: 600; color:var(--corporate-blue);">${s_ave_wean_wt} kg</span>` 
        }
        
        
        
        const html = `
        <tr>
            <td>${html_pid_sow}</td>
            <td style="padding-left:0; text-align:center;">${s_dt_birth}</td>
            <td style="padding-left:0; text-align:center;">${num_pigs_birth}</td>
            <td style="padding-left:0; text-align:center;">${s_dead}</td>
            <td style="padding-left:0; text-align:center;">${s_wean}</td>
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
