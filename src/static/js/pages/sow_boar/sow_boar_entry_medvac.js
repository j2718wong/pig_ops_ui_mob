// Jnauary 12, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageTableBasic}        	from '../common/page_table_basic.js';

import {APPLICATION,
        PAGE_ID,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        SOW_STATUS_NAME}        from '../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        sortList,
        createPaginationManager} from '../../utils.js';



TableMedVac.prototype = new PageTableBasic();
export function TableMedVac(input_settings){
    PageTableBasic.call(this);
	
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
	
    /*
    Typical input_settings
    {
        navigation:             this,
        elemDivContainer:      	'<element>'
    }   
    */  
    let settings                = input_settings;
    
    
	let elemDivContainer        = settings.elemDivContainer;

	let elemIdTableBody			= null;

    
    let elemTableBody        	= null;
    



    //let textTranslation         = new TextTranslation();
    let curUserLanguageKey      = 'en';


    let showOptions				= null;
    
    let dtCurrentDate           = null;
    
	
	let dataSowBoar				= null;
	
	
    this.init = function(){
		console.log('Test 1');
		
		const settingsTable = {
			uniqueKey:		'sow-boar-medvac',
			tableTitle:		'Medicines & Vaccines'
		}
		
		thisObj.setSettings(settingsTable);
        
        const html_table = thisObj.getHtml();
		
		elemDivContainer.innerHTML = html_table;
        thisObj.afterHtmlRender();
		
		console.log('thisObj');
		console.log(thisObj);
		
		thisObj.setDataEntryList([]);
    }
    
        
	this.setDataSowBoar = function(data){
		dataSowBoar = data;
	}
	
		
    this.show = function(options){
        
        // show the last showOptions if there is no options
        if (options == null){options = showOptions;}
        
        // So that not to instantiate in every table redraw
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        showOptions = options;
		
		
		const callback_success = function(data){
			// Set table entry list; This will set also the entry count;
			thisObj.setDataEntryList(data);
		};
		
		
        const data_sow_boar_medvac = null;
		if !('list_medvac' in dataSowBoar){
			this.requestData(callback_success);
		}
    }
    
	 
	this.getHtmlTableHeader = function(){
		elemIdTableBody			= `${settings.uniqueKey}-table-tbody`;
		
		const html = `
		<table class="data-table" id="">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Brand</th>
                    <th>Type</th>
                    <th>Name</th>
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
                <td><div>No Entries</div></td>
                <td><div>&nbsp;</div></td>
                <td><div>&nbsp;</div></td>
                <td><div>&nbsp;</div></td>
            </tr>
		`;
        return html;
    }
    
    

    this.getHtmlTableRow = function(cur_entry){
		
		let  s_click = '';
		
        const html = `
            <tr>
                <td><span>${cur_entry.medvac.date_medvac}</span></td>
                <td>${cur_entry.medvac.brand.name}</td>
                <td></td>
                <td onclick='${s_click}'></td>
            </tr>
        `;
        
        return html;
    }
    

    this.addToolTips = function(){
        const with_tooltips  = elemDivContainer.querySelectorAll('[data-bs-toggle="tooltip"]');
        console.log('with_tooltips='+with_tooltips.length);
        for (const cur_entry of with_tooltips){
            new bootstrap.Tooltip(cur_entry);
        }
    }
    
    
    this.searchSowBoar = function(key){
        
    }
	
	
	this.requestData = function(callback){
		const sow_boar_hid = dataSowBoar.hid;
		
		const base_url = window.location.origin;
        const url = `${base_url}/pig_medvac/list?sow_boar_hid=${sow_boar_hid}`;
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            async: true,
  
            beforeSend: function(){
				elemServerErrorMsg.style.display = 'none';
            },
  
            success: function(response){
                if (response.result.num == 0){
                    dataSowBoar['list_medvac'] = response.data;
					
					if (callback){
						callback(dataSowBoar['list_medvac']);
					}
                }
                else {
					navigation.errorServerMessage.receivedErrorMessage(
						response, elemServerErrorMsg);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                gfRequestError(jqXHR, textStatus, errorThrown, gController.getAppName());
            }
        });
		
	}
    
    
    this.setUserLanguage = function(language_key){
        curUserLanguageKey = language_key;
        thisObj.onUserChangeLanguage();
    }
    
    
    this.onUserChangeLanguage = function(){
        
       
    }
	
	
    
}