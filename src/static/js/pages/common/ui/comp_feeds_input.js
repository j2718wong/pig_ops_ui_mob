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
        
       
        
    }
    
    
    */
    const thisObj               = this;
    
    const settings              = input_settings;
    
    
        
    let elemIdUiShow            = `${settings.uniqueKey}-show`;
    let elemIdFeedInputBody     = `${settings.uniqueKey}-tbody`;
    
    let elemIdFinisherRow       = `${settings.uniqueKey}-finisher`;
    let elemIdFinisherCol2      = `${settings.uniqueKey}-finisher-col2`;
    let elemIdFinisherInput     = `${settings.uniqueKey}-finisher-input`;
    
    let elemIdGrowerRow         = `${settings.uniqueKey}-grower`;
    let elemIdGrowerCol2        = `${settings.uniqueKey}-grower-col2`;
    let elemIdGrowerInput       = `${settings.uniqueKey}-grower-input`;
    
    let elemIdStarterRow        = `${settings.uniqueKey}-starter`;
    let elemIdStarterCol2       = `${settings.uniqueKey}-starter-col2`;
    let elemIdStarterInput      = `${settings.uniqueKey}-starter-input`;
    
    let elemIdPreStarterRow     = `${settings.uniqueKey}-prestarter`;
    let elemIdPreStarterCol2    = `${settings.uniqueKey}-prestarter-col2`;
    let elemIdPreStarterInput   = `${settings.uniqueKey}-prestarter-input`;
    
    let elemIdBoosterRow        = `${settings.uniqueKey}-booster`;
    let elemIdBoosterCol2       = `${settings.uniqueKey}-booster-col2`;
    let elemIdBoosterInput      = `${settings.uniqueKey}-booster-input`;
    
    let elemIdLactaRow          = `${settings.uniqueKey}-lacta`;
    let elemIdLactaCol2         = `${settings.uniqueKey}-lacta-col2`;
    let elemIdLactaInput        = `${settings.uniqueKey}-lacta-input`;
    
    let elemIdGestaRow          = `${settings.uniqueKey}-gesta`;
    let elemIdGestaCol2         = `${settings.uniqueKey}-gesta-col2`;
    let elemIdGestaInput        = `${settings.uniqueKey}-gesta-input`;
    
    

    let elemFeedInputBody       = null;
        
    let elemFinisherRow         = null;
    let elemFinisherCol2        = null;
    let elemFinisherInput       = null;
        
    let elemGrowerRow           = null;
    let elemGrowerCol2          = null;
    let elemGrowerInput         = null;
        
    let elemStarterRow          = null;
    let elemStarterCol2         = null;
    let elemStarterInput        = null;
        
    let elemPreStarterRow       = null;
    let elemPreStarterCol2      = null;
    let elemPreStarterInput     = null;
        
    let elemBoosterRow          = null;
    let elemBoosterCol2         = null;
    let elemBoosterInput        = null;
        
    let elemLactaRow            = null;
    let elemLactaCol2           = null;
    let elemLactaInput          = null;
        
    let elemGestaRow            = null;
    let elemGestaCol2           = null;
    let elemGestaInput          = null;
    
    
    const dataFeed = {
        gesta:      { input: 0 },
        lacta:      { input: 0 },
        booster:    { input: 0 },
        prestarter: { input: 0 },
        starter:    { input: 0 },
        grower:     { input: 0 },
        finisher:   { input: 0 }
    };
    
    
    this.getHtml = function(){
        
        const html = `
            <div class="table-responsive data-table" id="${elemIdUiShow}">
                <table class="data-table" style="vertical-align:center;">
					<colgroup>
						<col style="width: 20%;">
						<col style="width: 25%;">
					</colgroup>
                    
					<thead>
                        <tr>
                            <th>${settings.header.col1Name}</th>
                            <th class="fi-col2">${settings.header.col2Name}</th>
                            <th>${settings.header.col3Name}</th>
                        </tr>
                    </thead>
                    
                    <tbody id="${elemIdFeedInputBody}">
                        <tr id="${elemIdFinisherRow}">
                            <td class="readonly-cell">Finisher</td>
                            <td class="readonly-cell fi-col2" id="${elemIdFinisherCol2}">150</td>
                            <td class="fi-input-cell">
                                <div class="fi-number-input-container">
                                    <input type="text" class="fi-number-input" id="${elemIdFinisherInput}" value="0" step="0.5" min="0" data-feed="finisher">
                                    <div class="fi-step-buttons">
                                        <button type="button" class="fi-step-btn up" data-feed="finisher" aria-label="Increase value">▲</button>
                                        <button type="button" class="fi-step-btn down" data-feed="finisher" aria-label="Decrease value">▼</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        
                        
                        <tr id="${elemIdGrowerRow}">
                            <td class="readonly-cell">Grower</td>
                            <td class="readonly-cell fi-col2" id="${elemIdGrowerCol2}">150</td>
                            <td class="fi-input-cell">
                                <div class="fi-number-input-container">
                                    <input type="text" class="fi-number-input" id="${elemIdGrowerInput}" value="0" step="0.5" min="0" data-feed="grower">
                                    <div class="fi-step-buttons">
                                        <button type="button" class="fi-step-btn up" data-feed="grower" aria-label="Increase value">▲</button>
                                        <button type="button" class="fi-step-btn down" data-feed="grower" aria-label="Decrease value">▼</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        
                        
                        <tr id="${elemIdStarterRow}">
                            <td class="readonly-cell">Starter</td>
                            <td class="readonly-cell fi-col2" id="${elemIdStarterCol2}">150</td>
                            <td class="fi-input-cell">
                                <div class="fi-number-input-container">
                                    <input type="text" class="fi-number-input" id="${elemIdStarterInput}" value="0" step="0.5" min="0" data-feed="starter">
                                    <div class="fi-step-buttons">
                                        <button type="button" class="fi-step-btn up" data-feed="starter" aria-label="Increase value">▲</button>
                                        <button type="button" class="fi-step-btn down" data-feed="starter" aria-label="Decrease value">▼</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        
                        
                        <tr id="${elemIdPreStarterRow}">
                            <td class="readonly-cell">PreStart</td>
                            <td class="readonly-cell fi-col2" id="${elemIdPreStarterCol2}">150</td>
                            <td class="fi-input-cell">
                                <div class="fi-number-input-container">
                                    <input type="text" class="fi-number-input" id="${elemIdPreStarterInput}" value="0" step="0.5" min="0" data-feed="prestarter">
                                    <div class="fi-step-buttons">
                                        <button type="button" class="fi-step-btn up" data-feed="prestarter" aria-label="Increase value">▲</button>
                                        <button type="button" class="fi-step-btn down" data-feed="prestarter" aria-label="Decrease value">▼</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        
                        <tr id="${elemIdBoosterRow}">
                            <td class="readonly-cell">Booster</td>
                            <td class="readonly-cell fi-col2" id="${elemIdBoosterCol2}">150</td>
                            <td class="fi-input-cell">
                                <div class="fi-number-input-container">
                                    <input type="text" class="fi-number-input" id="${elemIdBoosterInput}" value="0" step="0.5" min="0" data-feed="booster">
                                    <div class="fi-step-buttons">
                                        <button type="button" class="fi-step-btn up" data-feed="booster" aria-label="Increase value">▲</button>
                                        <button type="button" class="fi-step-btn down" data-feed="booster" aria-label="Decrease value">▼</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        
                        
                        <tr id="${elemIdLactaRow}">
                            <td class="readonly-cell">Lacta</td>
                            <td class="readonly-cell fi-col2" id="${elemIdLactaCol2}">150</td>
                            <td class="fi-input-cell">
                                <div class="fi-number-input-container">
                                    <input type="text" class="fi-number-input" id="${elemIdLactaInput}" value="0" step="0.5" min="0" data-feed="lacta">
                                    <div class="fi-step-buttons">
                                        <button type="button" class="fi-step-btn up" data-feed="lacta" aria-label="Increase value">▲</button>
                                        <button type="button" class="fi-step-btn down" data-feed="lacta" aria-label="Decrease value">▼</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        
                        <tr id="${elemIdGestaRow}">
                            <td class="readonly-cell">Gesta</td>
                            <td class="readonly-cell fi-col2" id="${elemIdGestaCol2}">150</td>
                            <td class="fi-input-cell">
                                <div class="fi-number-input-container">
                                    <input type="text" class="fi-number-input" id="${elemIdGestaInput}" value="0" step="0.5" min="0" data-feed="gesta">
                                    <div class="fi-step-buttons">
                                        <button type="button" class="fi-step-btn up" data-feed="gesta" aria-label="Increase value">▲</button>
                                        <button type="button" class="fi-step-btn down" data-feed="gesta" aria-label="Decrease value">▼</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    
                    </tbody>
                    
                </table>
            </div>
        
        `;
        
        return html;
        
    }
    
    
    
    
    this._findElements = function(){
        thisObj.elemUiShow      = document.getElementById(elemIdUiShow);
        
        elemFeedInputBody       = document.getElementById(elemIdFeedInputBody);
                                  
        elemFinisherRow         = document.getElementById(elemIdFinisherRow);
        elemFinisherCol2        = document.getElementById(elemIdFinisherCol2);
        elemFinisherInput       = document.getElementById(elemIdFinisherInput);
                                  
        elemGrowerRow           = document.getElementById(elemIdGrowerRow);
        elemGrowerCol2          = document.getElementById(elemIdGrowerCol2);
        elemGrowerInput         = document.getElementById(elemIdGrowerInput);
                                  
        elemStarterRow          = document.getElementById(elemIdStarterRow);
        elemStarterCol2         = document.getElementById(elemIdStarterCol2);
        elemStarterInput        = document.getElementById(elemIdStarterInput);
                                  
        elemPreStarterRow       = document.getElementById(elemIdPreStarterRow);
        elemPreStarterCol2      = document.getElementById(elemIdPreStarterCol2);
        elemPreStarterInput     = document.getElementById(elemIdPreStarterInput);
                                  
        elemBoosterRow          = document.getElementById(elemIdBoosterRow);
        elemBoosterCol2         = document.getElementById(elemIdBoosterCol2);
        elemBoosterInput        = document.getElementById(elemIdBoosterInput);
                                  
        elemLactaRow            = document.getElementById(elemIdLactaRow);
        elemLactaCol2           = document.getElementById(elemIdLactaCol2);
        elemLactaInput          = document.getElementById(elemIdLactaInput);
                                  
        elemGestaRow            = document.getElementById(elemIdGestaRow);
        elemGestaCol2           = document.getElementById(elemIdGestaCol2);
        elemGestaInput          = document.getElementById(elemIdGestaInput);
        
    }
    
    
    this._bindEventListeners = function(){
		// Function to update value
		function updateBalance(feedType, newValue) {
			const inputField = document.querySelector(`.fi-number-input[data-feed="${feedType}"]`);
			inputField.value = newValue;
			dataFeed[feedType].balance = newValue;
			console.log(`Updated ${feedType}: ${newValue} kg`);
		}
		
		// Set up up/down buttons
        document.querySelectorAll('.fi-step-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const feedType = this.getAttribute('data-feed');
                const inputField = this.closest('.fi-number-input-container').querySelector('.fi-number-input');
                let currentValue = parseFloat(inputField.value) || 0;
                
                if (this.classList.contains('up')) {
                    // Increase by 0.5
                    currentValue += 0.5;
                } else {
                    // Decrease by 0.5, but not below 0
                    currentValue = Math.max(0, currentValue - 0.5);
                }
                
                updateBalance(feedType, currentValue);
                
                // Visual feedback for mobile
                this.style.backgroundColor = '#dee2e6';
                setTimeout(() => {
                    this.style.backgroundColor = '';
                }, 150);
            });
            
            // Add touch feedback for mobile
            button.addEventListener('touchstart', function(e) {
                e.preventDefault();
                this.style.backgroundColor = '#dee2e6';
            }, { passive: false });
            
            button.addEventListener('touchend', function(e) {
                e.preventDefault();
                setTimeout(() => {
                    this.style.backgroundColor = '';
                }, 150);
            }, { passive: false });
        });
        
        
        // Handle direct input changes
        document.querySelectorAll('.fi-number-input').forEach(input => {
            input.addEventListener('input', function() {
                const feedType = this.getAttribute('data-feed');
                let value = parseFloat(this.value) || 0;
                
                // Round to nearest 0.5 if needed
                if (this.value.includes('.')) {
                    const decimal = this.value.split('.')[1];
                    if (decimal && decimal.length > 1) {
                        value = Math.round(value * 2) / 2;
                        this.value = value;
                    }
                }
                
                // Ensure value is not negative
                if (value < 0) {
                    value = 0;
                    this.value = 0;
                }
                
                dataFeed[feedType].input = value;
            });
            
            
            // Keyboard arrow support
            input.addEventListener('keydown', function(e) {
                const feedType = this.getAttribute('data-feed');
                let currentValue = parseFloat(this.value) || 0;
                
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    currentValue += 0.5;
                    updateBalance(feedType, currentValue);
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    currentValue = Math.max(0, currentValue - 0.5);
                    updateBalance(feedType, currentValue);
                }
            });
            
            // Fix for iOS Safari
            input.addEventListener('focus', function() {
                this.style.fontSize = '16px'; // Prevent iOS zoom
            });
        });
    }
    

	
    
    
}