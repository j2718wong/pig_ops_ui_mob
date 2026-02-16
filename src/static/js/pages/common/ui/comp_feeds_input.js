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
    
    
    const dataFeedInput = {
        gesta:      0,
        lacta:      0,
        booster:    0,
        prestarter: 0,
        starter:    0,
        grower:     0,
        finisher:   0
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
        

        // 20260215: 
        // There is a current problem when using a table format;
        // When rows are hidden and displayed again, the table row is messed up.
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
                            <td class="fi-readonly-cell" style="vertical-align:middle;">Finisher</td>
                            <td class="fi-readonly-cell fi-col2 ${class_hidden}" id="${elemIdFinisherCol2}" style="vertical-align:middle;">150</td>
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
                            <td class="fi-readonly-cell" style="vertical-align:middle;">Grower</td>
                            <td class="fi-readonly-cell fi-col2 ${class_hidden}" id="${elemIdGrowerCol2}" style="vertical-align:middle;">150</td>
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
                            <td class="fi-readonly-cell" style="vertical-align:middle;">Starter</td>
                            <td class="fi-readonly-cell fi-col2 ${class_hidden}" id="${elemIdStarterCol2}" style="vertical-align:middle;">150</td>
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
                            <td class="fi-readonly-cell" style="vertical-align:middle;">PreStart</td>
                            <td class="fi-readonly-cell fi-col2 ${class_hidden}" id="${elemIdPreStarterCol2}" style="vertical-align:middle;">150</td>
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
                            <td class="fi-readonly-cell" style="vertical-align:middle;">Booster</td>
                            <td class="fi-readonly-cell fi-col2 ${class_hidden}" id="${elemIdBoosterCol2}" style="vertical-align:middle;">150</td>
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
                            <td class="fi-readonly-cell" style="vertical-align:middle;">Lacta</td>
                            <td class="fi-readonly-cell fi-col2 ${class_hidden}" id="${elemIdLactaCol2}" style="vertical-align:middle;">150</td>
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
                            <td class="fi-readonly-cell" style="vertical-align:middle;">Gesta</td>
                            <td class="fi-readonly-cell fi-col2 ${class_hidden}" id="${elemIdGestaCol2}" style="vertical-align:middle;">150</td>
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
        
        
// Recommended layout by deepseek        
const html_2 = `
<!-- Grid Layout -->
<div class="grid-feed-input" id="${elemIdFeedInputBody}">
  
  <!-- Header Row -->
  <div class="grid-header">
    <div class="grid-cell">${settings.header.col1Name}</div>
    <div class="grid-cell fi-col2 no-wrap ${class_hidden}">${settings.header.col2Name}</div>
    <div class="grid-cell">${settings.header.col3Name}</div>
  </div>
  
  <!-- Finisher Row -->
  <div class="grid-row" id="${elemIdFinisherRow}">
    <div class="grid-cell fi-readonly-cell">Finisher</div>
    <div class="grid-cell fi-readonly-cell fi-col2 ${class_hidden}" id="${elemIdFinisherCol2}">150</div>
    <div class="grid-cell fi-input-cell">
      <div class="fi-number-input-container">
        <input type="text" class="fi-number-input" id="${elemIdFinisherInput}" value="0" step="${step}" min="0" data-feed="finisher">
        <div class="fi-step-buttons">
          <button type="button" class="fi-step-btn up" data-feed="finisher" aria-label="Increase value">▲</button>
          <button type="button" class="fi-step-btn down" data-feed="finisher" aria-label="Decrease value">▼</button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Grower Row -->
  <div class="grid-row" id="${elemIdGrowerRow}">
    <div class="grid-cell fi-readonly-cell">Grower</div>
    <div class="grid-cell fi-readonly-cell fi-col2 ${class_hidden}" id="${elemIdGrowerCol2}">150</div>
    <div class="grid-cell fi-input-cell">
      <div class="fi-number-input-container">
        <input type="text" class="fi-number-input" id="${elemIdGrowerInput}" value="0" step="${step}" min="0" data-feed="grower">
        <div class="fi-step-buttons">
          <button type="button" class="fi-step-btn up" data-feed="grower" aria-label="Increase value">▲</button>
          <button type="button" class="fi-step-btn down" data-feed="grower" aria-label="Decrease value">▼</button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Starter Row -->
  <div class="grid-row" id="${elemIdStarterRow}">
    <div class="grid-cell fi-readonly-cell">Starter</div>
    <div class="grid-cell fi-readonly-cell fi-col2 ${class_hidden}" id="${elemIdStarterCol2}">150</div>
    <div class="grid-cell fi-input-cell">
      <div class="fi-number-input-container">
        <input type="text" class="fi-number-input" id="${elemIdStarterInput}" value="0" step="${step}" min="0" data-feed="starter">
        <div class="fi-step-buttons">
          <button type="button" class="fi-step-btn up" data-feed="starter" aria-label="Increase value">▲</button>
          <button type="button" class="fi-step-btn down" data-feed="starter" aria-label="Decrease value">▼</button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- PreStarter Row -->
  <div class="grid-row" id="${elemIdPreStarterRow}">
    <div class="grid-cell fi-readonly-cell">PreStart</div>
    <div class="grid-cell fi-readonly-cell fi-col2 ${class_hidden}" id="${elemIdPreStarterCol2}">150</div>
    <div class="grid-cell fi-input-cell">
      <div class="fi-number-input-container">
        <input type="text" class="fi-number-input" id="${elemIdPreStarterInput}" value="0" step="${step}" min="0" data-feed="prestarter">
        <div class="fi-step-buttons">
          <button type="button" class="fi-step-btn up" data-feed="prestarter" aria-label="Increase value">▲</button>
          <button type="button" class="fi-step-btn down" data-feed="prestarter" aria-label="Decrease value">▼</button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Booster Row -->
  <div class="grid-row" id="${elemIdBoosterRow}">
    <div class="grid-cell fi-readonly-cell">Booster</div>
    <div class="grid-cell fi-readonly-cell fi-col2 ${class_hidden}" id="${elemIdBoosterCol2}">150</div>
    <div class="grid-cell fi-input-cell">
      <div class="fi-number-input-container">
        <input type="text" class="fi-number-input" id="${elemIdBoosterInput}" value="0" step="${step}" min="0" data-feed="booster">
        <div class="fi-step-buttons">
          <button type="button" class="fi-step-btn up" data-feed="booster" aria-label="Increase value">▲</button>
          <button type="button" class="fi-step-btn down" data-feed="booster" aria-label="Decrease value">▼</button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Lacta Row -->
  <div class="grid-row" id="${elemIdLactaRow}">
    <div class="grid-cell fi-readonly-cell">Lacta</div>
    <div class="grid-cell fi-readonly-cell fi-col2 ${class_hidden}" id="${elemIdLactaCol2}">150</div>
    <div class="grid-cell fi-input-cell">
      <div class="fi-number-input-container">
        <input type="text" class="fi-number-input" id="${elemIdLactaInput}" value="0" step="${step}" min="0" data-feed="lacta">
        <div class="fi-step-buttons">
          <button type="button" class="fi-step-btn up" data-feed="lacta" aria-label="Increase value">▲</button>
          <button type="button" class="fi-step-btn down" data-feed="lacta" aria-label="Decrease value">▼</button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Gesta Row -->
  <div class="grid-row" id="${elemIdGestaRow}">
    <div class="grid-cell fi-readonly-cell">Gesta</div>
    <div class="grid-cell fi-readonly-cell fi-col2 ${class_hidden}" id="${elemIdGestaCol2}">150</div>
    <div class="grid-cell fi-input-cell">
      <div class="fi-number-input-container">
        <input type="text" class="fi-number-input" id="${elemIdGestaInput}" value="0" step="${step}" min="0" data-feed="gesta">
        <div class="fi-step-buttons">
          <button type="button" class="fi-step-btn up" data-feed="gesta" aria-label="Increase value">▲</button>
          <button type="button" class="fi-step-btn down" data-feed="gesta" aria-label="Decrease value">▼</button>
        </div>
      </div>
    </div>
  </div>
  
</div>
`;
        
        return html_2;
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
            dataFeedInput[feedType] = newValue;
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
                
                dataFeedInput[feedType] = value;
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
        
        dataFeedInput.gesta         = 0;
        dataFeedInput.lacta         = 0;
        dataFeedInput.booster       = 0;
        dataFeedInput.prestarter    = 0;
        dataFeedInput.grower        = 0;
        dataFeedInput.starter       = 0;
        dataFeedInput.finisher      = 0;
        
    }
    
    
    this.getDataFeedInput = function(){
        return dataFeedInput;
    }
    
    
    this.showFeedType = function(data){
        /*data is a dictionary like this
         * 
         * data = {
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
        
        if (data.gesta){
            elemGestaRow.style.display = 'contents';
        }
        else{
            elemGestaRow.style.display = 'none';
        }
        
        
        if (data.lacta){
            elemLactaRow.style.display = 'contents';
        }
        else{
            elemLactaRow.style.display = 'none';
        }
        
        
        if (data.booster){
            elemBoosterRow.style.display = 'contents';
        }
        else{
            elemBoosterRow.style.display = 'none';
        }
        
        
        if (data.prestarter){
            elemPreStarterRow.style.display = 'contents';
        }
        else{
            elemPreStarterRow.style.display = 'none';
        }
        
        
        if (data.starter){
            elemStarterRow.style.display = 'contents';
        }
        else{
            elemStarterRow.style.display = 'none';
        }
        
        
        if (data.grower){
            elemGrowerRow.style.display = 'contents';
        }
        else{
            elemGrowerRow.style.display = 'none';
        }
        
        
        if (data.finisher){
            elemFinisherRow.style.display = 'contents';
        }
        else{
            elemFinisherRow.style.display = 'none';
        }
        
    }
    
    
    this.setColumn2 = function(data){
        /*data is a dictionary like this
         * 
         * data = {
         *  gesta: 1,
         *  lacta: 2,
         *  booster: null,
         *  prestarter: null,
         *  grower: null,
         *  starter: null,
         *  finisher: null
         * }
         * 
         * */
        
        if (data.gesta && data.gesta > 0){
            elemGestaCol2.textContent = data.gesta;
        }
        else{
            elemGestaCol2.textContent = '';
        }
        
        
        if (data.lacta && data.lacta > 0){
            elemLactaCol2.textContent = data.lacta;
        }
        else{
            elemLactaCol2.textContent = '';
        }
        
        
        if (data.booster && data.booster > 0){
            elemBoosterCol2.textContent = data.booster;
        }
        else{
            elemBoosterCol2.textContent = '';
        }
        
        
        if (data.prestarter && data.prestarter > 0){
            elemPreStarterCol2.textContent = data.prestarter;
        }
        else{
            elemPreStarterCol2.textContent = '';
        }

        
        if (data.starter && data.starter > 0){
            elemStarterCol2.textContent = data.starter;
        }
        else{
            elemStarterCol2.textContent = '';
        }
        
        
        if (data.grower && data.grower > 0){
            elemGrowerCol2.textContent = data.grower;
        }
        else{
            elemGrowerCol2.textContent = '';
        }
        
        
        if (data.finisher && data.grower > 0){
            elemFinisherCol2.textContent = data.finisher;
        }
        else{
            elemFinisherCol2.textContent = '';
        }
    }


    this.setFeedInput = function(data){
        /*data is a dictionary like this
         * 
         * data = {
         *  gesta: 1,
         *  lacta: 2,
         *  booster: null,
         *  prestarter: null,
         *  grower: null,
         *  starter: null,
         *  finisher: null
         * }
         * 
         * */
        
        if (data.gesta && data.gesta > 0){
            elemGestaInput.value = data.gesta;
            dataFeedInput.gesta = data.gesta;
        }
        else{
            elemGestaInput.value = 0;
            dataFeedInput.gesta = 0;
        }
        
        
        if (data.lacta && data.lacta > 0){
            elemLactaInput.value = data.lacta;
            dataFeedInput.lacta = data.lacta;
        }
        else{
            elemLactaInput.value = 0;
            dataFeedInput.lacta = 0;
        }
        
        
        if (data.booster && data.booster > 0){
            elemBoosterInput.value = data.booster;
            dataFeedInput.booster = data.booster;
        }
        else{
            elemBoosterInput.value = 0;
            dataFeedInput.booster = 0;
        }
        
        
        if (data.prestarter && data.prestarter > 0){
            elemPreStarterInput.value = data.prestarter;
            dataFeedInput.prestarter = data.prestarter;
        }
        else{
            elemPreStarterInput.value = 0;
            dataFeedInput.prestarter = 0;
        }

        
        if (data.starter && data.starter > 0){
            elemStarterInput.value = data.starter;
            dataFeedInput.starter = data.starter;
        }
        else{
            elemStarterInput.value = 0;
            dataFeedInput.starter = 0;
        }
        
        
        if (data.grower && data.grower > 0){
            elemGrowerInput.value = data.grower;
            dataFeedInput.grower = data.grower;
        }
        else{
            elemGrowerInput.value = 0;
            dataFeedInput.grower = 0;
        }
        
        
        if (data.finisher && data.grower > 0){
            elemFinisherInput.value = data.finisher;
            dataFeedInput.finisher = data.finisher;
        }
        else{
            elemFinisherInput.value = 0;
            dataFeedInput.finisher = 0;
        }
    }


    this.areAllInputsZero = function(){
        let temp =  dataFeedInput.gesta +
                    dataFeedInput.lacta +
                    dataFeedInput.booster +
                    dataFeedInput.prestarter +
                    dataFeedInput.starter +
                    dataFeedInput.grower +
                    dataFeedInput.finisher;
        if (temp > 0){return false;}
        return true;
    }
}
