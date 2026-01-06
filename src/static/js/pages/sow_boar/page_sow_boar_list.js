// December 25, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../common/page_view_basic.js';

import {APPLICATION,
        PAGE_ID,
        SOW_BOAR_TYPE,
        SOW_STATUS}            	from '../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        sortList}               from '../../utils.js';




PageSowBoarList.prototype = new PageViewBasic();
export function PageSowBoarList(input_settings){
    PageViewBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
	const NUM_MSECS_1DAY        = 1000 * 60 * 60 * 24;
	
    
    /*
    Typical input_settings
    {
        navigation:             this,
        livestock:              'sow',   // 
        pageTitle:              'Sow'
    }   
    */  
    let settings                = input_settings;
    
    
    // This is needed as ths will be first element to be rendered
    let elemDivContainer        = document.getElementById('container-sow-boar-list');
    
    
    
    let elemIdPageTitle         = null;
    let elemIdPageHeaderAlarm   = null;
    let elemIdEntryCount        = null;
    let elemIdPageInfo          = null;
    
    let elemIdSearchInput       = null;
    let elemIdAddEntryBtn       = null;
    let elemIdFilterControls    = null;
    
    let elemIdTableSow          = null;
    let elemIdTableSowBody      = null;
    
    let elemIdTableBoar         = null;
    let elemIdTableBoarBody     = null;
    
    let elemIdTableGilt         = null;
    let elemIdTableGiltBody     = null;
    
	let elemIdNumEntriesCurView	= null;
	
    let elemIdPigOpsAlarmTable  = null;


    let elemPageTitle           = null;
    let elemPageHeaderAlarm     = null;
    let elemEntryCount          = null;
    let elemPageInfo            = null;

    let elemSearchInput         = null;
    let elemAddEntryBtn         = null;
    let elemFilterControls      = null;
    
    let elemTableSow            = null;
    let elemTableSowBody        = null;
    
    let elemTableBoar           = null;
    let elemTableBoarBody       = null;
    
    let elemTableGilt           = null;
    let elemTableGiltBody       = null;
    
    let elemNumEntriesCurView	= null;
    
    
    let elemPigOpsAlarmTable    = null;

    // if false curView is PigOpsAlarmTable
    let curViewIsCardList       = true;
    
    let dataSowList             = null;
    let dataBoarList            = null;
    let dataGiltList			= null;

    let curSowBoarType          = null;

    //let textTranslation         = new TextTranslation();
    let curUserLanguageKey      = 'en';


    let showpageHeaderAlarm     = false;
    let pigOpsAlarmList         = null;
    
    
    // This must be set before rendering the autotable
    // See G_SAMPLE_JSON_ACCOUNT
    this.accountData            = null;
    
    
    
    this.init = function(){
        //textTranslation.setTranslations(TRANSLATION_PAGE_ACC_PIG_OPS);
        
        this.render();
        this.afterHtmlRender();
        
        
    }
    
    
    this._writeInlineStyle = function(){
        const html = `
    <style>
        
        /* Updated Table Styles */
        
        .data-table.table-sow th:nth-child(1) { width: 25%; }
        .data-table.table-sow th:nth-child(2) { width: 25%; }
        .data-table.table-sow th:nth-child(3) { width: 25%; }
        .data-table.table-sow th:nth-child(4) { width: 25%; }
        
        .data-table.table-boar th:nth-child(1) { width: 25%; }
        .data-table.table-boar th:nth-child(2) { width: 25%; }
        .data-table.table-boar th:nth-child(3) { width: 25%; }
        .data-table.table-boar th:nth-child(4) { width: 25%; }
        
        .data-table.table-gilt th:nth-child(1) { width: 25%; }
        .data-table.table-gilt th:nth-child(2) { width: 25%; }
        .data-table.table-gilt th:nth-child(3) { width: 50%; }
        
        
      </style>
    `;
        return html;
    }
    
    
    this.render = function(){
        
        elemIdPageTitle         = `page-title-sow-boar-list`;
        elemIdPageHeaderAlarm   = `page-title-sow-boar-alarm`;
        elemIdEntryCount        = `page-title-sow-boar-count`;
        elemIdPageInfo          = `page-info-sow-boar-list`;
        
		elemIdSearchInput       = `mobile-search-input-sow-boar`;
        elemIdAddEntryBtn       = `mobile-add-entry-btn-sow-boar`;
        elemIdFilterControls    = `mobile-filter-control-sow-boar`;
        
		
        elemIdTableSow          = `sow-boar-sow-table`;
        elemIdTableSowBody      = `sow-boar-sow-tbody`;
        
        elemIdTableBoar         = `sow-boar-boar-table`;
        elemIdTableBoarBody     = `sow-boar-boar-tbody`;
        
        elemIdTableGilt         = `sow-boar-gilt-table`;
        elemIdTableGiltBody     = `sow-boar-gilt-tbody`;
        
		elemIdNumEntriesCurView = `sow-boar-num-entries-view`;
        
        elemIdPigOpsAlarmTable  = `${settings.uniqueKey}-alarm-table`;
        
        
        
        
        const html_style = thisObj._writeInlineStyle();
           
        const html = `

${html_style}
        
<div class="mobile-container">
    <div class="header">
        <h1 >
            <span id="${elemIdEntryCount}"></span>
            <span id="${elemIdPageTitle}"></span>
            <span class="inline-bell larger" id="${elemIdPageHeaderAlarm}" title="Due operations!" style="display:none;">
                <i class="fas fa-bell"></i>
            </span>
            
        </h1>
        
        <!-- Mobile Info Box -->
        <!--
        <div class="mobile-info-box">
            <div class="info-text" id="${elemIdPageInfo}">
            </div>
        </div>
        -->
    </div>
    
    <div>
        <!-- Search and Add Entry Controls -->
        <div class="mobile-controls">
            <div class="search-container">
                <i class="fas fa-search search-icon"></i>
                <input type="text" class="search-input" id=${elemIdSearchInput} placeholder="Search Pig Name or Number">
            </div>
            <button class="btn-add-entry" id="${elemIdAddEntryBtn}">
                <i class="fas fa-plus"></i>
                Add Entry
            </button>
        </div>
        
        <!-- Centered Filter Controls -->
        <div class="filter-controls" id="${elemIdFilterControls}">
            <!-- Animal Filter Buttons - Centered, no gaps -->
            <div class="animal-filter">
                <div class="filter-buttons sow">
                    <button class="filter-button active" data-filter="all">All</button>
                    <button class="filter-button" data-filter="gestating">Gestating</button>
                    <button class="filter-button" data-filter="lactating">Lactating</button>
                    <button class="filter-button" data-filter="weaning">Weaning</button>
                    <button class="filter-button" data-filter="disposed">Disposed</button>
                </div>
            </div>
            
        </div>

        <!-- Sow Boar -->
        <table class="data-table table-sow" id="${elemIdTableSow}">
            <thead>
                <tr>
                    <th>Sow</th>
                    <th>Status</th>
                    <th>Age</th>
                    <th>Output</th>
                </tr>
            </thead>
            <tbody id="${elemIdTableSowBody}">
                <!-- Operations populated by JavaScript -->
            </tbody>
        </table>
        
        <table class="data-table table-boar" id="${elemIdTableBoar}">
            <thead>
                <tr>
                    <th>Boar</th>
                    <th>Age</th>
                    <th>Num Mating</th>
                    <th>Last Mate</th>
                </tr>
            </thead>
            <tbody id="${elemIdTableBoarBody}">
                <!-- Operations populated by JavaScript -->
            </tbody>
        </table>
        
        <table class="data-table table-gilt" id="${elemIdTableGilt}">
            <thead>
                <tr>
                    <th>Gilt</th>
                    <th>Age</th>
                    <th>Next PigOp</th>
                </tr>
            </thead>
            <tbody id="${elemIdTableGiltBody}">
                <!-- Operations populated by JavaScript -->
            </tbody>
        </table>
        
		<span id="${elemIdNumEntriesCurView}"></span>
        
        
        
    </div>
    
    <div id="${elemIdPigOpsAlarmTable}"></div>
    
</div>
        `;
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemPageTitle           = document.getElementById(elemIdPageTitle);
        elemPageHeaderAlarm     = document.getElementById(elemIdPageHeaderAlarm);
        elemEntryCount          = document.getElementById(elemIdEntryCount);
        elemPageInfo            = document.getElementById(elemIdPageInfo);

        elemSearchInput         = document.getElementById(elemIdSearchInput);
        elemAddEntryBtn         = document.getElementById(elemIdAddEntryBtn);
        elemFilterControls		= document.getElementById(elemIdFilterControls);
		
        elemTableSow            = document.getElementById(elemIdTableSow);
        elemTableSowBody        = document.getElementById(elemIdTableSowBody);
        
        elemTableBoar           = document.getElementById(elemIdTableBoar);
        elemTableBoarBody       = document.getElementById(elemIdTableBoarBody);
        
        elemTableGilt           = document.getElementById(elemIdTableGilt);
        elemTableGiltBody       = document.getElementById(elemIdTableGiltBody);
        
        elemNumEntriesCurView	= document.getElementById(elemIdNumEntriesCurView);
    }
    
    
    this._processAfterHtmlRender = function(){
        
        this.handleWindowResize();
    }
    
    
    this._bindEventListeners = function(){
        
        elemPageHeaderAlarm.addEventListener('click', function() {
            thisObj.onClickPageHeaderAlarm();
        });

        
       
    
    }
    

    this.setDataSowList = function(data){
		// When this is set, the data includes the gilts (SOW_STATUS.GROWING)
		// Need to seperate	gilts data	
		
		dataSowList = []
		dataGiltList = []
		
		let sow_boar = null;
		
		for (const cur_entry of data){
			if ('sow_boar' in cur_entry){
				sow_boar = cur_entry.sow_boar;
			}
			else{sow_boar = cur_entry;}
			
			if (sow_boar.status_id == SOW_STATUS.GROWING){
				dataGiltList.push(cur_entry);
			}
			else{
				dataSowList.push(cur_entry);
			}
			
		}
		
        
    }
    
    
    this.setDataBoarList = function(data){
        dataBoarList    = data;
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
    
    
    this.show = function(options){
        showpageHeaderAlarm = false; // Need to reset this.
        elemPageHeaderAlarm.style.display = 'none';
        
        curSowBoarType = options.sow_boar_type;
        
        let is_add_sow = false;
        let entry_count = 0;
        
        switch (options.sow_boar_type){
            case SOW_BOAR_TYPE.SOW: {
                elemPageTitle.textContent = 'Sow List';
                is_add_sow = true;
                
                // Update EntryCount
                if (dataSowList != null){
                    entry_count = dataSowList.length; // TODO need to separate gilt
                }
                
                if (entry_count == 0){
                    elemFilterControls.style.display = 'none';
                }
                else{
                    elemFilterControls.style.display = 'block';
                }
                
                elemTableSow.style.display = 'block';
                elemTableBoar.style.display = 'none';
                elemTableGilt.style.display = 'none';
                
				thisObj._renderSowTable(dataSowList);
                break;
            }
            
            case SOW_BOAR_TYPE.BOAR: {
                elemPageTitle.textContent = 'Boar List';
                
                if (dataBoarList != null){
                    entry_count = dataBoarList.length; 
                }
                
                elemFilterControls.style.display = 'none';
                
                elemTableSow.style.display = 'none';
                elemTableBoar.style.display = 'block';
                elemTableGilt.style.display = 'none';
                
				break;
            }
            
            case SOW_BOAR_TYPE.GILT:{
                elemPageTitle.textContent = 'Gilt List';
                
                elemFilterControls.style.display = 'none';
                
                elemTableSow.style.display = 'none';
                elemTableBoar.style.display = 'none';
                elemTableGilt.style.display = 'block';
                
                break;
            }
        }
        
        // Set Entry count
        elemEntryCount.textContent = entry_count;
        
        
        // Need to set click listener
        elemAddEntryBtn.onclick = function(){
            const options_sow_boar ={
                is_add:         true,   // false is edit
                is_sow:         is_add_sow,   // false is boar
                go_back_page:   elemDivContainer   // Go back to this page
            };
            
            navigation.pageSowBoarAddEdit.beforeShow(options_sow_boar);
            
            const next_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_ADD_EDIT);
            navigation.showThisPage(next_page)
        };
        
        
    }
    
	
	this._renderSowTable = function(sow_list){
		let html = '';	
		
		
		let diff_msecs;
        let diff_days;
        
		
		let dt_current = new Date();
		dt_current.setHours(0, 0, 0, 0);
		
			    
		
		for (const cur_entry of sow_list){
			let sow_boar = null;
			let sow_reference = '';
        
			if ('sow_boar' in cur_entry){
				sow_boar = cur_entry.sow_boar;
			}
			else{
				sow_boar = cur_entry;
			}
		
			if ((sow_boar.name != null) && (sow_boar.name.length >0)){
				sow_reference = sow_boar.name;
			}
			else{
				sow_reference = sow_boar.number;
			}
			
			let dt_birth = null;
			let s_age = '';
			
			if (sow_boar.date_of_birth != null){
				dt_birth = new Date(sow_boar.date_of_birth);
			
				diff_msecs          = dt_current - dt_birth;
				diff_days           = Math.round(diff_msecs / NUM_MSECS_1DAY);
				
				let num_years 		= Math.floor(diff_days / 365);
				let excess_days 	= diff_days % 365;
				let num_months 		= Math.round(excess_days / 30);
				
				
				if (num_years == 0){
					s_age = `${num_months} months`;
				}
				else{
					if (num_years == 1){
						s_age = `${num_years} year`;
					} else{
						s_age = `${num_years} years`;
					}
					
					if (num_months  >0){
						if (num_months == 1){
							s_age += `, <span>${num_months} month</span>`;
						}
						else{
							s_age += `, <span>${num_months} months</span>`;
						}
					}
				}
				
			
			}
			
			html += `<tr>`;
			html += `<td>${sow_reference}</td>`;
			html += `<td>${sow_boar.status}</td>`;
			html += `<td>${s_age}</td>`;
			html += `<td></td>`;
			
			
			html += '</tr>';
		}
		
		elemTableSowBody.innerHTML = html;
	}
	
    
	this.filterDataSowList = function(sow_status_id){
		let data_filtered = [];
		
		for (const cur_entry of dataSowList){
			let sow_boar = null;
			if ('sow_boar' in cur_entry){
				sow_boar = cur_entry.sow_boar;
			}
			else{
				sow_boar = cur_entry;
			}
			
			if (sow_boar.status_id == sow_status_id){
				data_filtered.push(cur_entry)
			}
			
		}
		
		return data_filtered;
	}
	
    
    this.setUserLanguage = function(language_key){
        curUserLanguageKey = language_key;
        thisObj.onUserChangeLanguage();
    }
    
    
    this.onUserChangeLanguage = function(){
        
       
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