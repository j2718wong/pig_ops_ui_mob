// December 23, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../common/page_view_basic.js';

import {PAGE_ID,
        SOW_STATUS,
        PIG_PROD_TYPE,
        PIG_OPERATION_TYPE,
        SUPPLIER_TYPE}          from '../../constants.js';

import {UiSelectWithEntryCount} from '../common/ui/select_with_entry_count.js';



export function PageParentTrace(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     element
    };
    */
    const settings              = input_settings;

    
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
    
    let elemIdLinkParentTrace   = null;
    let elemIdLinkSowList       = null;
    let elemIdLinkBoarList      = null;
    
    let elemIdSowBoarTrace		= null;
    
	let elemUiSow               = null;
    let elemUiBoar              = null;
    
    
    let elemIdBtnTrace          = null;
    let elemIdServerErrorMsg    = null;
	
    let elemIdTable             = null;
    let elemIdTableBody         = null;
    
	
	
	let elemSowBoarTrace		= null;
    
    let elemLinkParentTrace     = null;
    let elemLinkSowList         = null;
    let elemLinkBoarList        = null;
    
    
    let elemBtnTrace            = null;
    let elemServerErrorMsg      = null;
    let elemTable               = null;
    let elemTableBody           = null;
    
    
    let dataSowList             = null;
    let dataBoarList            = null;

    
    
    let curDataSow              = null;
    let curDataBoar             = null;
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        elemIdLinkParentTrace   = `parent-trace-link-0`;
        elemIdLinkSowList       = `parent-trace-link-1`;
        elemIdLinkBoarList      = `parent-trace-link-2`;
        
		elemIdSowBoarTrace		= `parent-trace-sow-boar`;
        
        elemUiSow               = new UiSelectWithEntryCount({
            uniqueKey:           'parent-trace-sow',
        
            labelSelect:         '<i class="fas fa-venus" style="color: var(--icon-pink);"></i> Select Sow or Gilt'
        });
        
        elemUiBoar              = new UiSelectWithEntryCount({
            uniqueKey:           'parent-trace-boar',
        
            labelSelect:         '<i class="fas fa-mars" style="color: var(--icon-blue);"></i> Select Boar'
        });
        
        
        elemIdBtnTrace          = `parent-trace-btn-trace`;
        
		
		elemIdServerErrorMsg    = `parent-trace-server-error`;
        elemIdTable             = `parent-trace-table`;
        elemIdTableBody         = `parent-trace-tbody`;
        
		
		const html_ui_sow       = elemUiSow.getHtml();
        const html_ui_boar      = elemUiBoar.getHtml();
        
		
        
        const html =`

        
<div class="form-container">

    <div class="modal-header">
        <h5 class="modal-title" id="add-entry-acc-pig-ops-modal-label">
            <i class="fas fa-dna" style="margin-right:10px;"></i><span>Parent Trace</span>
        </h5>
    </div>
    
    
    <div class="modal-body">
        <div class="breadcrumb" id="">
            <div class="breadcrumb-item" >
                <a href="javascript:void(0)" class="breadcrumb-link" id="${elemIdLinkParentTrace}" style="max-width:none;">Parent Trace</a>
            </div>
            
            <div class="breadcrumb-separator">|</div>
            
            <div class="breadcrumb-item">
                <a href="javascript:void(0)" class="breadcrumb-link" id="${elemIdLinkSowList}">Sow List</a>
            </div>
            
            <div class="breadcrumb-separator">|</div>
            
            <div class="breadcrumb-item">
                <a href="javascript:void(0)" class="breadcrumb-link" id="${elemIdLinkBoarList}">Boar List</a>
            </div>
            
            
        </div>
        
		<div id="${elemIdSowBoarTrace}">
			<!-- 1. Sow Field -->
			${html_ui_sow}
				
			
			<!-- 2. Boar Field -->
			${html_ui_boar}
			
			<button type="button" class="btn-full btn-success" id="${elemIdBtnTrace}">
				Parent Trace
			</button>
		</div>
        
        <br>
        <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
        
        <table class="data-table" id="${elemIdTable}">
            <colgroup>
                <col style="width: 34%;">
                <col style="width: 33%;">
                <col style="width: 33%;">
            </colgroup>
                
            <thead>
                <tr>
                    <th><div></div></th>
                    <th>Parent Sow</th>
                    <th>Parent Boar</th>
                </tr>
            </thead>
            <tbody id="${elemIdTableBody}">
            </tbody>
        </table>
        
        
    </div>
</div>

        `;
        
        
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        
        elemUiSow.afterHtmlRender();
        elemUiBoar.afterHtmlRender();
        
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemLinkParentTrace     = document.getElementById(elemIdLinkParentTrace);
        elemLinkSowList         = document.getElementById(elemIdLinkSowList);
        elemLinkBoarList        = document.getElementById(elemIdLinkBoarList);
        
		elemSowBoarTrace		= document.getElementById(elemIdSowBoarTrace);
		
        elemBtnTrace            = document.getElementById(elemIdBtnTrace);
        
        elemServerErrorMsg      = document.getElementById(elemIdServerErrorMsg);
        
        elemTable               = document.getElementById(elemIdTable);
        elemTableBody           = document.getElementById(elemIdTableBody);
    }
    
    
    this._processAfterHtmlRender = function(){
        
    }
    
    
    this._bindEventListeners = function(){
        
        
        elemLinkParentTrace.addEventListener('click', function() {
			elemSowBoarTrace.style.display = 'block';
        });
        
        elemLinkSowList.addEventListener('click', function() {
			elemSowBoarTrace.style.display = 'none';
			
			/*
			const data_list = [];
			
			for(const cur_entry of dataSowList){
				data_list.push(cur_entry.parent_trace);
			}
			*/
			thisObj.renderTableBody(dataSowList);
			
        });
        
        elemLinkBoarList.addEventListener('click', function() {
			elemSowBoarTrace.style.display = 'none';
			
			/*
			const data_list = [];
			
			for(const cur_entry of dataBoarList){
				data_list.push(cur_entry.parent_trace);
			}
			
			thisObj.renderTableBody(data_list);
			*/
			
			thisObj.renderTableBody(dataBoarList);
		});
        
        
        

        elemBtnTrace.addEventListener('click', function() {
            thisObj.onClickTraceButton();
        });
        
    }
    
   
    this.getDataSow = function(sow_hid){
        for (const cur_entry of dataSowList){
            if (cur_entry.sow_boar.hid == sow_hid){return cur_entry;}
        } 
        
        return null;
    }
    
    
    this.getDataBoar = function(boar_hid){
        for (const cur_entry of dataBoarList){
            if (cur_entry.sow_boar.hid == boar_hid){return cur_entry;}
        } 
        
        return null;
    }
    
    
       
   
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        elemUiSow.reset();
        elemUiBoar.reset();
      
        
    }
    
    
    this.show = function(){
        this._resetForm();
        
        // Check farm account if hasRequestedParentTrace
        
        console.log('navigation.pigFarm.dataPigFarm');
        console.log(navigation.pigFarm.dataPigFarm);
		
		dataSowList     = navigation.pigFarm.dataSowList;
        dataBoarList    = navigation.pigFarm.dataBoarList;
        
        
        elemUiSow.setEntryCount(dataSowList);
        elemUiBoar.setEntryCount(dataBoarList);
        
        
        
        thisObj.commonSelectOptions.setDataSowList(dataSowList, elemUiSow.getElemSelect());
        thisObj.commonSelectOptions.setDataBoarList(dataBoarList, elemUiBoar.getElemSelect());
        
        
        
        // This is to prevent multiple request for the pig_farm
        if ('hasRequestedParentTrace' in navigation.pigFarm.dataPigFarm){
            
        }
        
        else{
            const callback_success = function(data){
                let cur_sow_boar = null;
				
				let cur_entry;
                for (cur_entry of data){
					console.log('cur_entry.sow_boar.sex ='+ cur_entry.sow_boar.sex );
                    if (cur_entry.sow_boar.sex = 'M'){
                        cur_sow_boar = thisObj.getDataBoar(cur_entry.sow_boar.hid);
                    }
                    else{
                        cur_sow_boar = thisObj.getDataSow(cur_entry.sow_boar.hid);
						if (cur_sow_boar == null){
							
						}
                    }
                    
                    if (cur_sow_boar != null){
                        cur_sow_boar['parent_trace'] = cur_entry;
						console.log(`cur_sow_boar`);
						console.log(cur_sow_boar);
						
                    }
                }
				
				console.log(`dataSowList`);
				console.log(dataSowList);
				navigation.pigFarm.dataPigFarm.hasRequestedParentTrace = true;
            };
            
            
            const pig_farm_id = navigation.pigFarm.dataPigFarm.pig_farm.hid;
            thisObj.requestDataParentTrace(null, null, pig_farm_id,
                callback_success, elemServerErrorMsg);
        }
        
        
        elemTable.style.display = 'none';
        
        
    }
  

  
    this.onClickTraceButton = function(){
        const sow_hid   = elemUiSow.getValue();
        const boar_hid  = elemUiBoar.getValue();
        
        if ((sow_hid == '-1' || sow_hid == '0') || (boar_hid == '-1' || boar_hid == '0')){
            return;
        }
        
        
        curDataSow   = this.getDataSow(sow_hid);
        curDataBoar  = this.getDataBoar(boar_hid);
        
        
		
        
		if (('parent_trace' in curDataSow) && ('parent_trace' in curDataBoar)){
			const data_list = [];
			data_list.push(curDataSow);
			data_list.push(curDataBoar);
			
			thisObj.renderTableBody(data_list);
		}
		else{
			const callback_success = function(data){
				for (const cur_entry of data){
					if (cur_entry.sow_boar.hid == curDataSow.sow_boar.hid){
						curDataSow.parent_trace = cur_entry;
					}
					
					if (cur_entry.sow_boar.hid == curDataBoar.sow_boar.hid){
						curDataBoar.parent_trace = cur_entry;
					}
				}
				
				const data_list = [];
				data_list.push(curDataSow);
				data_list.push(curDataBoar);
				
				thisObj.renderTableBody(data_list);
			};
			
			thisObj.requestDataParentTrace(sow_hid, boar_hid, null, callback_success,
				callback_success, elemServerErrorMsg);
        }
    }
    
    
    // Note sow_boar.notes and sow_boar.health_issue are merged together in
    // prod_notes table. There is a flag to tell if is  a health issue
    this.requestDataParentTrace = function(sow_hid, boar_hid, pig_farm_hid, 
                callback_success, elem_show_error){
        
        const base_url = window.location.origin;
        let url = `${base_url}/sow_boar/get_parent_trace?sow_hid=${sow_hid}&boar_hid=${boar_hid}`;
        
        if (pig_farm_hid){
            url = `${base_url}/sow_boar/get_parent_trace?pfhid=${pig_farm_hid}`;
        }
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            async: true,
  
            beforeSend: function(){
            },
  
            success: function(response){
                
                if (response.result.num == 0){
                    if (callback_success){callback_success(response.data);}
                }    
                else{
                    navigation.serverError.receivedErrorMessage(
                        response, elem_show_error);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
    }
    
    
    this.renderTableBody = function(data){
        elemTable.style.display = 'table';
        
			
        
		const table_data = []; 
        
		console.log(data);
		for (const cur_entry of data){
			let sow_boar_reference = '';
			if (cur_entry.sow_boar.name && cur_entry.sow_boar.name.length > 0){
				sow_boar_reference = cur_entry.sow_boar.name;
			}
			else{
				sow_boar_reference = cur_entry.sow_boar.number;
			}
			
			
			
			let cur_parent_sow = '';
			let cur_parent_boar = '';
			let cur_parent_trace = cur_entry.parent_trace;

			
			if (cur_parent_trace.parent_sow.name  && cur_parent_trace.parent_sow.name.length > 0){
				cur_parent_sow = cur_parent_trace.parent_sow.name;
			}
			else{
				if (cur_parent_trace.parent_sow.number  && cur_parent_trace.parent_sow.number.length > 0){
					cur_parent_sow = cur_parent_trace.parent_sow.number;
				}
				else{
					cur_parent_sow = '';
				}
			}
        
			if (cur_parent_trace.parent_boar.name  && cur_parent_trace.parent_boar.name.length > 0){
				cur_parent_boar = cur_parent_trace.parent_boar.name;
			}
			else{
				if (cur_parent_trace.parent_boar.number  && cur_parent_trace.parent_boar.number.length > 0){
					cur_parent_boar = cur_parent_trace.parent_boar.number;
				}
				else{
					cur_parent_boar = '';
				}
			}
			
			
			table_data.push({
                'sow_boar_name':    sow_boar_reference,
                'parent_sow_name':  cur_parent_sow,
                'parent_boar_name': cur_parent_boar
            });
			
		}
        
        
       
        
        
        let html = '';
        
        for (const cur_entry of table_data) {
            const s_click = '';
            const html_row = `
            <tr>
                <td onclick='${s_click}'><span>${cur_entry.sow_boar_name}</span></td>
                <td >${cur_entry.parent_sow_name}</td>
                <td >${cur_entry.parent_boar_name}</td>
            </tr>
            `;
            
            html += html_row;
        }
        
        elemTableBody.innerHTML = html; 
        
    }
    
}   