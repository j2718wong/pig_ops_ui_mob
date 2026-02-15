// January 15, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {UiBasic}               from './ui_basic.js';


export function ComponentFeedsInput(input_settings){
    UiBasic.call(this);
    
    /* Typical settings
    settings = {
        uniqueKey:              '',
        elemDivContainer:       element,    // Root element where to search for elements
                                            // so that not all document will be searched
        col2Hide:       true,     
        step:           1,                               
                                             
        header: {
            col1Name:	'Feed<br>Type',
            col2Name:	'Feed Buy <br>(sacks)',
            col3Name:	'Balance <br>(sacks)'
        }
    }
    
    
    */
    const thisObj               = this;
    
    const settings              = input_settings;
    
    const elemDivContainer      = settings.elemDivContainer;
    
    const DEFAULT_FEED_QTY_STEP = 0.5;
    
            
    let step = DEFAULT_FEED_QTY_STEP;
    if (settings.step){
         step = settings.step;
    }


        
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
        let class_hidden = '';
        
        let html_col_group = `
                    <colgroup>
                        <col style="width: 25%;">
                        <col style="width: 25%;">
                        <col style="width: 50%;">
                    </colgroup>        
        `;
        
        if (settings.col2Hide){
            class_hidden = 'hidden';
            
            html_col_group = `
                    <colgroup>
                        <col style="width: 30%;">
                        <col style="width: 70%;">
                    </colgroup>
            `;
        }
        

        
        const html = `
            <div id="${elemIdUiShow}">
                <table class="data-table table-feed-input">
                    ${html_col_group}
                    
                    <thead>
                        <tr>
                            <th>${settings.header.col1Name}</th>
                            <th class="fi-col2 no-wrap ${class_hidden}">${settings.header.col2Name}</th>
                            <th>${settings.header.col3Name}</th>
                        </tr>
                    </thead>
                    
                    <tbody id="${elemIdFeedInputBody}">
                        <tr id="${elemIdFinisherRow}">
                            <td class="fi-readonly-cell">Finisher</td>
                            <td class="fi-readonly-cell fi-col2 ${class_hidden}" id="${elemIdFinisherCol2}">150</td>
                            <td class="fi-input-cell">
                                <div class="fi-number-input-container">
                                    <input type="text" class="fi-number-input" id="${elemIdFinisherInput}" value="0" step="${step}" min="0" data-feed="finisher">
                                    <div class="fi-step-buttons">
                                        <button type="button" class="fi-step-btn up" data-feed="finisher" aria-label="Increase value">▲</button>
                                        <button type="button" class="fi-step-btn down" data-feed="finisher" aria-label="Decrease value">▼</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        
                        
                        <tr id="${elemIdGrowerRow}">
                            <td class="fi-readonly-cell">Grower</td>
                            <td class="fi-readonly-cell fi-col2 ${class_hidden}" id="${elemIdGrowerCol2}">150</td>
                            <td class="fi-input-cell">
                                <div class="fi-number-input-container">
                                    <input type="text" class="fi-number-input" id="${elemIdGrowerInput}" value="0" step="${step}" min="0" data-feed="grower">
                                    <div class="fi-step-buttons">
                                        <button type="button" class="fi-step-btn up" data-feed="grower" aria-label="Increase value">▲</button>
                                        <button type="button" class="fi-step-btn down" data-feed="grower" aria-label="Decrease value">▼</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        
                        
                        <tr id="${elemIdStarterRow}">
                            <td class="fi-readonly-cell">Starter</td>
                            <td class="fi-readonly-cell fi-col2 ${class_hidden}" id="${elemIdStarterCol2}">150</td>
                            <td class="fi-input-cell">
                                <div class="fi-number-input-container">
                                    <input type="text" class="fi-number-input" id="${elemIdStarterInput}" value="0" step="${step}" min="0" data-feed="starter">
                                    <div class="fi-step-buttons">
                                        <button type="button" class="fi-step-btn up" data-feed="starter" aria-label="Increase value">▲</button>
                                        <button type="button" class="fi-step-btn down" data-feed="starter" aria-label="Decrease value">▼</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        
                        
                        <tr id="${elemIdPreStarterRow}">
                            <td class="fi-readonly-cell">PreStart</td>
                            <td class="fi-readonly-cell fi-col2 ${class_hidden}" id="${elemIdPreStarterCol2}">150</td>
                            <td class="fi-input-cell">
                                <div class="fi-number-input-container">
                                    <input type="text" class="fi-number-input" id="${elemIdPreStarterInput}" value="0" step="${step}" min="0" data-feed="prestarter">
                                    <div class="fi-step-buttons">
                                        <button type="button" class="fi-step-btn up" data-feed="prestarter" aria-label="Increase value">▲</button>
                                        <button type="button" class="fi-step-btn down" data-feed="prestarter" aria-label="Decrease value">▼</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        
                        <tr id="${elemIdBoosterRow}">
                            <td class="fi-readonly-cell">Booster</td>
                            <td class="fi-readonly-cell fi-col2 ${class_hidden}" id="${elemIdBoosterCol2}">150</td>
                            <td class="fi-input-cell">
                                <div class="fi-number-input-container">
                                    <input type="text" class="fi-number-input" id="${elemIdBoosterInput}" value="0" step="${step}" min="0" data-feed="booster">
                                    <div class="fi-step-buttons">
                                        <button type="button" class="fi-step-btn up" data-feed="booster" aria-label="Increase value">▲</button>
                                        <button type="button" class="fi-step-btn down" data-feed="booster" aria-label="Decrease value">▼</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        
                        
                        <tr id="${elemIdLactaRow}">
                            <td class="fi-readonly-cell">Lacta</td>
                            <td class="fi-readonly-cell fi-col2 ${class_hidden}" id="${elemIdLactaCol2}">150</td>
                            <td class="fi-input-cell">
                                <div class="fi-number-input-container">
                                    <input type="text" class="fi-number-input" id="${elemIdLactaInput}" value="0" step="${step}" min="0" data-feed="lacta">
                                    <div class="fi-step-buttons">
                                        <button type="button" class="fi-step-btn up" data-feed="lacta" aria-label="Increase value">▲</button>
                                        <button type="button" class="fi-step-btn down" data-feed="lacta" aria-label="Decrease value">▼</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        
                        <tr id="${elemIdGestaRow}">
                            <td class="fi-readonly-cell">Gesta</td>
                            <td class="fi-readonly-cell fi-col2 ${class_hidden}" id="${elemIdGestaCol2}">150</td>
                            <td class="fi-input-cell">
                                <div class="fi-number-input-container">
                                    <input type="text" class="fi-number-input" id="${elemIdGestaInput}" value="0" step="${step}" min="0" data-feed="gesta">
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
        thisObj.elemUiShow      = elemDivContainer.querySelector('#'+elemIdUiShow);
        
        elemFeedInputBody       = elemDivContainer.querySelector('#'+elemIdFeedInputBody);
                                  
        elemFinisherRow         = elemDivContainer.querySelector('#'+elemIdFinisherRow);
        elemFinisherCol2        = elemDivContainer.querySelector('#'+elemIdFinisherCol2);
        elemFinisherInput       = elemDivContainer.querySelector('#'+elemIdFinisherInput);
                                  
        elemGrowerRow           = elemDivContainer.querySelector('#'+elemIdGrowerRow);
        elemGrowerCol2          = elemDivContainer.querySelector('#'+elemIdGrowerCol2);
        elemGrowerInput         = elemDivContainer.querySelector('#'+elemIdGrowerInput);
                                  
        elemStarterRow          = elemDivContainer.querySelector('#'+elemIdStarterRow);
        elemStarterCol2         = elemDivContainer.querySelector('#'+elemIdStarterCol2);
        elemStarterInput        = elemDivContainer.querySelector('#'+elemIdStarterInput);
                                  
        elemPreStarterRow       = elemDivContainer.querySelector('#'+elemIdPreStarterRow);
        elemPreStarterCol2      = elemDivContainer.querySelector('#'+elemIdPreStarterCol2);
        elemPreStarterInput     = elemDivContainer.querySelector('#'+elemIdPreStarterInput);
                                  
        elemBoosterRow          = elemDivContainer.querySelector('#'+elemIdBoosterRow);
        elemBoosterCol2         = elemDivContainer.querySelector('#'+elemIdBoosterCol2);
        elemBoosterInput        = elemDivContainer.querySelector('#'+elemIdBoosterInput);
                                  
        elemLactaRow            = elemDivContainer.querySelector('#'+elemIdLactaRow);
        elemLactaCol2           = elemDivContainer.querySelector('#'+elemIdLactaCol2);
        elemLactaInput          = elemDivContainer.querySelector('#'+elemIdLactaInput);
                                  
        elemGestaRow            = elemDivContainer.querySelector('#'+elemIdGestaRow);
        elemGestaCol2           = elemDivContainer.querySelector('#'+elemIdGestaCol2);
        elemGestaInput          = elemDivContainer.querySelector('#'+elemIdGestaInput);
        
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
                    // Increase by step
                    currentValue += step;
                } else {
                    // Decrease by step, but not below 0
                    currentValue = Math.max(0, currentValue - step);
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
                
                // Round to nearest step if needed
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
                    currentValue += step;
                    updateBalance(feedType, currentValue);
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    currentValue = Math.max(0, currentValue - step);
                    updateBalance(feedType, currentValue);
                }
            });
            
            // Fix for iOS Safari
            //input.addEventListener('focus', function() {
            //    this.style.fontSize = '1.2rem'; // Prevent iOS zoom
            //});
        });
    }
    

    this.reset = function(){
        elemFinisherInput.value     = 0;
        elemGrowerInput.value       = 0;
        elemStarterInput.value      = 0;
        elemPreStarterInput.value   = 0;
        elemBoosterInput.value      = 0;
        elemLactaInput.value        = 0;
        elemGestaInput.value        = 0; 
        
        dataFeed.gesta.input        = 0;
        dataFeed.lacta.input        = 0;
        dataFeed.booster.input      = 0;
        dataFeed.prestarter.input   = 0;
        dataFeed.grower.input       = 0;
        dataFeed.starter.input      = 0;
        dataFeed.finisher.input     = 0;
        
    }
    
    
    this.getDataFeed = function(){
        return dataFeed;
    }
    
    
    this.showFeedType = function(show_feed){
        /*show_feed is a dictionary like this
         * 
         * show_feed = {
         *  gesta: true,
         *  lacta: true,
         *  booster: true,
         *  prestarter: true,
         *  grower: true,
         *  starter: true,
         *  finisher: true
         * }
         * 
         * */
        
        if (show_feed.gesta){
            elemGestaRow.style.display = 'table';
        }
        else{
            elemGestaRow.style.display = 'none';
        }
        
        
        if (show_feed.lacta){
            elemLactaRow.style.display = 'table';
        }
        else{
            elemLactaRow.style.display = 'none';
        }
        
        
        if (show_feed.booster){
            elemBoosterRow.style.display = 'table';
        }
        else{
            elemBoosterRow.style.display = 'none';
        }
        
        
        if (show_feed.prestarter){
            elemPreStarterRow.style.display = 'table';
        }
        else{
            elemPreStarterRow.style.display = 'none';
        }
        
        
        if (show_feed.starter){
            elemStarterRow.style.display = 'table';
        }
        else{
            elemStarterRow.style.display = 'none';
        }
        
        
        if (show_feed.grower){
            elemGrowerRow.style.display = 'table';
        }
        else{
            elemGrowerRow.style.display = 'none';
        }
        
        
        if (show_feed.finisher){
            elemFinisherRow.style.display = 'table';
        }
        else{
            elemFinisherRow.style.display = 'none';
        }
        
    }
}
