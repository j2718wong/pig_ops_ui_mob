// March 7, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageTableBasic}         from '../../common/page_table_basic.js';
import {PageViewPigFarmPage}    from '../../common/page_view_basic.js';


import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE,
        PIG_PROD_TYPE,
        PROD_STATUS}            from '../../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        sortList}               from '../../../utils.js';

import {ComponentNavLeftRight}  from '../../common/ui/comp_nav_left_right.js';

import {getSowBoarReference}    from '../../common/common_app.js';


export function PageProdPigDeadList(input_settings){
    PageTableBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    /*
    Typical input_settings
    {
        navigation:             this,
        uniqueKey:              'prod-not-pregnant' 
        pageTitle:              'Not Pregnant'
    }   
    */  
    let settings                = input_settings;
    
    
    
    
    // This is needed as this will be first element to be rendered
    let elemDivContainer        = document.getElementById(settings.elemIdDivContainer);
    
    let componentNavLeftRight   = null;
    
    let elemIdPageInfo          = null;
    let elemIdTableBody         = null;
    

    let elemPageInfo            = null;
    let elemTableBody           = null;
    
    
    let dataPigDeadList     = null;

    
    let searchIncludeInsem      = true;
    
    let dtCurrentDate           = null;


    let farmPage                = new PageViewPigFarmPage();

    
    this.init = function(){

        
        thisObj.setSettingsTable({
            uniqueKey:      settings.uniqueKey,
            itemsPerPage:   20
        });
        
        
        this.render();
        this.afterHtmlRender();
        
        this.afterHtmlRenderThis();
        
    }
    
    
    
    this.render = function(){
        
        componentNavLeftRight   = new ComponentNavLeftRight({
           uniqueKey:           settings.uniqueKey,
           elemDivContainer:    elemDivContainer,
           pageTitle:           'Dead Pigs'
        });
        
        
        elemIdPageInfo          = `${settings.uniqueKey}-page-info`;
        
        
        const html_nav          = componentNavLeftRight.getHtml();   
        const html_table        = thisObj.getHtml();
           

           
        const html = `

<div class="mobile-container">
    ${html_nav}
    
    <!-- Mobile Info Box -->
    <!--
    <div class="mobile-info-box">
        <div class="info-text" id="${elemIdPageInfo}">
        </div>
    </div>
    -->
    
    ${html_table}

</div>
        `;
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRenderThis = function(){
        componentNavLeftRight.afterHtmlRender();
        
        
        this._findElementsThis();
        this._processAfterHtmlRenderThis();
        this._bindEventListenersThis();
    }
    
    
    this._findElementsThis = function(){
        elemPageInfo            = elemDivContainer.querySelector('#'+elemIdPageInfo);
        
        
        elemTableBody           = elemDivContainer.querySelector('#'+elemIdTableBody);
    }
    
    
    this._processAfterHtmlRenderThis = function(){
        
        componentNavLeftRight.callbackNavLeft = function(){
            navigation._onClickNavProdHistory();
        };
        
          
        componentNavLeftRight.callbackNavRight = function(){
            navigation._onClickNavProdGestaLacta(null, PIG_OPERATION_TYPE.GESTATING);
        };
        
        
        componentNavLeftRight.bindEventListeners();
    }
    
    
    this._bindEventListenersThis = function(){
        
       
    }
    
    
    
    // Handle window resize for view switching
    this.handleWindowResize = function() {
        const isMobile = window.innerWidth <= APPLICATION.MAX_WIDTH_WINDOW_IS_MOBILE;
                
        /*
        if (isMobile) {
            elemMobileContainer.style.display = 'flex';
            elemTableContainer.style.display = 'none';
        } else {
            elemMobileContainer.style.display = 'none';
            elemTableContainer.style.display = 'block';
        }*/
    }
    
    
    this.beforeShow = function(){
        /*
        dataPigDeadList  = navigation.pigFarm.managerPigProd.dataPigDeadList;

   
             // Request ProdNotPregnant List
            navigation.pigFarm.managerPigProd.requestPigProdNotPregnantList(
                callback_success, null);
        */
        
        
        
    }
    

    this._writeInlineStyle = function(){
        const html = `
        `;
        return html;

    }
    
    
    this.getElemTableBody = function(){
        return elemTableBody;
    }

    
    this.getHtmlTableHeader = function(){
        elemIdTableBody         = `${settings.uniqueKey}-table-tbody`;
        
        const html_style = this._writeInlineStyle();
        
        
        const html = `
        ${html_style}
        
        <table class="data-table table-prod-hist" id="">
            <colgroup>
                <col style="width: 33%;">
                <col style="width: 25%;">
                <col style="width: 42%;">
               
            </colgroup>

            <thead>
                <tr>
                    <th>
                        <div>PID, Sow</div> 
                        <div><span class="love-icon">❤️</span> Boar</div>
                    </th>
                    <th>Date Dead</th>
                    <th>Description</th>
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
        
        let pid = cur_entry.pig_production.farm_prod_id;
        
        const insemination = cur_entry.insemination; 
        
        const data_sow = cur_entry.sow;
        const sow_name = getSowBoarReference(data_sow);
        

        
        let boar_name = '';
        switch (insemination.insem_type){
            case 'B':{
                boar_name = getSowBoarReference(insemination.boar);
                break;
            }
            
            case 'AI_X':{
                boar_name = insemination.ai.semen_supplier.semen.name;
                break;
            }
            
            case 'AI_N':{
                const internal_boar = insemination.ai.internal_boar;
                
                boar_name = getSowBoarReference(internal_boar);
                boar_name += '(via AI)';
                
                break;
            }
            
        }
            
        
        const dt_insem  = new Date(insemination.insem_date);
        const s_dt_insem = formatDate(dt_insem, FORMAT_COMPACT);
        
        const html = `
            <tr>
                <td>${pid}</td>
                <td>${sow_name}</td>
                <td>${boar_name}</td>
                <td>${s_dt_insem}</td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.getElemTableRow = function(cur_entry){
        const elem_row = document.createElement('tr');
        
        const html = thisObj.getHtmlTableRow(cur_entry);
        elem_row.innerHTML = html;
        
        let pid = cur_entry.pig_production.farm_prod_id;
        
         

        
        // Attach onclick listeners to td
        
        const elem_tds = elem_row.querySelectorAll('td'); 
        
        let index = 0
        for (const cur_td of elem_tds){
        

            if (index == 0 || index == 1) {
                cur_td.onclick = function(){
                   
                }
            }
            
        
            index += 1;
        }
        
        return elem_row;
    }
    
    
    
    
    
    
    this.setUserLanguage = function(language_key){
        curUserLanguageKey = language_key;
        thisObj.onUserChangeLanguage();
    }
    
    
    this.onUserChangeLanguage = function(){
        
       
    }
    
    
    this.searchEntries = function(key){
        let data_pig_prod_list = dataPigDeadList;
        
        
        
        const filtered = [];
        for (const cur_entry of data_pig_prod_list){
            
            let u_sow_name          = null;
            let u_sow_number        = null;
            
            let u_boar_name         = null;
            let u_boar_number       = null;
            
            let u_semen_supplier    = null;
            let u_semen_name        = null;
            
            
            let s_pid   = `${cur_entry.pig_production.farm_prod_id}`;
            
            if (cur_entry.sow.name){
                u_sow_name = cur_entry.sow.name.toUpperCase();
            }
            
            if (cur_entry.sow.number){
                u_sow_number = cur_entry.sow.number.toUpperCase();
            }
            
            
            let insemination = cur_entry.insemination;
            
            switch (insemination.insem_type){
                case 'B': {
                    if (insemination.boar.name){
                        u_boar_name = insemination.boar.name.toUpperCase();
                    }
                    
                    if (insemination.boar.number){
                        u_boar_number = insemination.boar.number.toUpperCase();
                    }
                    
                    break;
                }
                
                case 'AI_X': {
                    u_semen_supplier = insemination.ai.semen_supplier.name.toUpperCase();
                    u_semen_name    = insemination.ai.semen_supplier.semen.name.toUpperCase();
                    
                    break;
                }
                
                case 'AI_N': {
                    if (insemination.ai.internal_boar.name){
                        u_boar_name = insemination.ai.internal_boar.name.toUpperCase();
                    }
                    
                    if (insemination.ai.internal_boar.number){
                        u_boar_number = insemination.ai.internal_boar.number.toUpperCase();
                    }
                    
                    break;
                }
            }
            
            
            if (s_pid.startsWith(key)){
                filtered.push(cur_entry);
                continue;
            }
            
            
            if (u_sow_name){
                if (u_sow_name.startsWith(key)){
                    filtered.push(cur_entry);
                    continue;
                }
            }
            
            if (u_sow_number){
                if (u_sow_name.startsWith(key)){
                    filtered.push(cur_entry);
                    continue;
                }
            }
            
            
            if (searchIncludeInsem){
                if (u_boar_name){
                    if (u_boar_name.startsWith(key)){
                        filtered.push(cur_entry);
                        continue;
                    }
                }
                
                if (u_boar_number){
                    if (u_boar_number.startsWith(key)){
                        filtered.push(cur_entry);
                        continue;
                    }
                }
                
                if (u_semen_supplier){
                    if (u_semen_supplier.startsWith(key)){
                        filtered.push(cur_entry);
                        continue;
                    }
                }
            
                if (u_semen_name){
                    if (u_semen_name.startsWith(key)){
                        filtered.push(cur_entry);
                        continue;
                    }
                }
            }
            
        } 
        
        
        return filtered;
    }
    
    
    this.getDataPigProd = function(pid){
        // Most functions with getData*** always use entry_hid as 
        // input parameter. The DataPigProd will use pid instead
        // as this is highly visible by in the page.
        for (const cur_entry of dataPigProdList){
            if(cur_entry.pig_production.farm_prod_id == pid){return cur_entry;}
        }
        return null;
    }
    
    
  
    
    
}
