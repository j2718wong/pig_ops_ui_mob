// January 15, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {UiBasic}                    from './ui_basic.js';


export function ComponentFeedsInput(input_settings){
    UiBasic.call(this);
    
    /* Typical settings
    settings = {
        uniqueKey:              '',
		elemRoot:               element,    // Root element where to search for elements
                                            // so that not all document will be searched.
        
        
		readOnlyCols:		[
			{
				'colName': 'Feed Type'
			},
			{
				'colName': 'Buy (sacks)'
			}
		],
		
		inputCol:{
			'colName': 'Balance (sacks)'
		}
        
        
        
    }
    
    
    */
    const thisObj               = this;
    
    const settings              = input_settings;
    
	
	const elemIdUiShow          = `${settings.uniqueKey}-show`;
    const elemIdFeedInputBody	= `${settings.uniqueKey}-body`;
	
	
	let elemFeedInputBody		= null;
	
	
    this.getHtml = function(){
        
        
		
		
		
		let col_read_only = '';
		
		for (const cur_entry of settings.readOnlyCols){
			col_read_only += `<th>${cur_entry.colName}</th>`;
		}
        
        const html = `
            <div class="table-responsive" id="${elemIdUiShow}">
				<table class="data-table">
					<thead>
						<tr>
							${col_read_only}
							<th>${settings.inputCol.colName}</th>
						</tr>
					</thead>
					
					<tbody id="${elemIdFeedInputBody}">
					</tbody>
					
				</table>
			</div>
        
        `;
        
        return html;
        
    }
    
    
    
    
    this._findElements = function(){
        thisObj.elemUiShow      = document.getElementById(elemIdUiShow);
		
		elemFeedInputBody		= document.getElementById(elemIdFeedInputBody);
    }
    
    
    this._bindEventListeners = function(){
       
    }
    

	this._getHtmlItem = function(item, data_index){
        return `
        <tr>
			<td class="readonly-cell">Gesta</td>
			<td class="readonly-cell">150</td>
			<td class="balance-cell">
				<div class="number-input-container">
					<input type="number" class="number-input" value="0" step="0.5" min="0" data-feed="gesta">
					<div class="step-buttons">
						<button type="button" class="step-btn up" data-feed="gesta" aria-label="Increase value">▲</button>
						<button type="button" class="step-btn down" data-feed="gesta" aria-label="Decrease value">▼</button>
					</div>
				</div>
			</td>
		</tr>
        `;
    }
    


  
    this.setupTable = function(items){
        let html = '';
		
		/*
		items = [
			{	'col_0': 'Gesta',
				'data-feed': 'gesta'
			}
		
		]
		
		
		*/
        for (const cur_entry of items){
            
        }
    }
	
	
	
    
}