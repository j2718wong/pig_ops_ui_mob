// January 1, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../../common/page_view_basic.js';

import {SOW_STATUS,
        PIG_OPERATION_TYPE}     from '../../../constants.js';



import {ProdEntryInsem}         from './prod_entry_insem.js'
import {ProdEntryBirth}         from './prod_entry_birth.js'



PageProdGestatingEntry.prototype = new PageViewBasic();
export function PageProdGestatingEntry(input_settings){
    PageViewBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    
    /*
    Typical settings = {
        navigation:             this
    };
    */
    const settings              = input_settings;

    
   
    const elemDivContainer      = document.getElementById('container-prod-gesta-entry');
        
        
    var elemIdNavPrevEntry      = null;
    var elemIdEntryTitle        = null;
    var elemIdPigProdPid        = null;
    var elemIdHeaderSowName     = null;
    var elemIdHeaderBoarName    = null;
    var elemIdNavNextEntry      = null;
    
    
    
    var elemNavPrevEntry        = null;
    var elemEntryTitle          = null;
    var elemPigProdPid          = null;
    var elemHeaderSowName       = null;
    var elemHeaderBoarName      = null;
    var elemNavNextEntry        = null;
    
    
    
    
    
    
    
    
    var sowList                 = null;
    var boarList                = null;
    var semenSupplierList       = null;
    
    
    const settingsInsem = {
        parentObj:              this
    }
    var prodEntryInsem          = new ProdEntryInsem(settingsInsem);
    
    
    const settingsBirth = {
        parentObj:              this
    }
    var prodEntryBirth          = new ProdEntryBirth(settingsBirth);
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this._writeInlineStyle = function(){
        const html = `
    <style>
        
        :root{
            --height-fixed-prod-entry: 130px;
        }

        /* Fixed Top Section */
        .top-section {
            position: fixed;
            top: 60px;
            left: 0;
            width: 100%;
            background-color: var(--corporate-blue);
            color: white;
            z-index: 150;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .navigation-bar {
            display: block;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nav-button {
            background: none;
            border: none;
            color: white;
            font-size: 32px; /* Bigger arrow icons */
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s;
            cursor: pointer;
        }

        .nav-button:active {
            background-color: rgba(255, 255, 255, 0.15);
        }

        .entry-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex-grow: 1;
            text-align: center;
        }

        .pid-and-sow {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            flex-wrap: wrap;
        }

        .pid {
            font-size: 22px;
            font-weight: 700;
            letter-spacing: 1px;
        }

        .sow-name {
            display: flex;
            align-items: center;
            font-size: 16px;
            opacity: 0.95;
        }

        .love-icon {
            margin: 0 8px;
            font-size: 18px;
            color: #f472b6; /* Pink color for love icon */
        }

        /* Tabs Navigation */
        .tabs-container {
            display: flex;
            overflow-y: auto;
            background-color: var(--corporate-blue);
            padding: 0 5px;
            -webkit-overflow-scrolling: touch;
        }

        .tab-button {
            flex: 1;
            min-width: 80px;
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.7);
            padding: 12px 10px;
            font-size: 16px;
            font-weight: 500;
            text-align: center;
            border-bottom: 3px solid transparent;
            transition: all 0.2s;
            white-space: nowrap;
            cursor: pointer;
        }

        .tab-button.active {
            color: white;
            border-bottom-color: white;
            background-color: rgba(255, 255, 255, 0.05);
        }


        /* Tab Content Area - Scrolls below fixed sections */
        .tab-content-area {
            margin-top: var(--height-fixed-prod-entry); /* Height of top nav (60px) + top section (120px) */
            padding: 0 0 20px 0;
            overflow-y: auto;
            max-height: calc(200vh - var(--height-fixed-prod-entry)); /* Viewport height minus fixed headers */
        }

        /* Individual Tab Content */
        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }


        /* Form Styles */
        .form-group {
            margin-bottom: 20px;
        }

        .form-label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--text-dark);
            font-size: 15px;
        }


        

        .number-input {
            flex-grow: 1;
            text-align: center;
            border-left: none;
            border-right: none;
            border-radius: 0;
            font-weight: 600;
        }


        .radio-group {
            margin-bottom: 15px;
        }

        .radio-option {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;
            padding: 12px;
            border: 1px solid var(--corporate-border);
            border-radius: 8px;
            transition: all 0.2s;
            cursor: pointer;
        }

        .radio-option.selected {
            border-color: var(--corporate-light-blue);
            background-color: rgba(59, 130, 246, 0.05);
        }

        .radio-input {
            margin-right: 12px;
            margin-top: 3px;
        }

        .radio-text {
            flex-grow: 1;
        }

        .radio-title {
            font-weight: 600;
            margin-bottom: 4px;
            color: var(--text-dark);
        }

        .radio-description {
            font-size: 14px;
            color: var(--text-light);
        }

        /* Dynamic Field Sections */
        .dynamic-section {
            margin-top: 15px;
            padding: 15px;
            background-color: #f8fafc;
            border-radius: 8px;
            border: 1px solid var(--corporate-border);
        }

        /* Buttons */
        /*
        .btn {
            display: block;
            width: 100%;
            padding: 14px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            text-align: center;
        }

        .btn-primary {
            background-color: var(--corporate-blue);
            color: white;
        }

        .btn-primary:active {
            background-color: #1e40af;
            transform: translateY(1px);
        }
        */
        
        .btn-success {
            background-color: var(--success-border);
            color: white;
            margin-bottom: 10px;
        }

        .btn-success:active {
            background-color: #0da271;
            transform: translateY(1px);
        }

        /* Table */
        .notes-table {
            width: 100%;
            margin-top: 25px;
            border-collapse: collapse;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
            background-color: white;
        }

        .notes-table th {
            background-color: var(--corporate-blue);
            color: white;
            text-align: left;
            padding: 12px 15px;
            font-weight: 600;
            font-size: 14px;
        }

        .notes-table td {
            padding: 12px 15px;
            border-bottom: 1px solid var(--corporate-border);
            font-size: 14px;
        }

        .notes-table tr:last-child td {
            border-bottom: none;
        }

        .notes-table tr:hover {
            background-color: #f9fafb;
        }

        /* Responsive Adjustments */
        @media (max-width: 480px) {
           
            .top-section {
                top: 60px;
            }
            
            .nav-button {
                font-size: 28px;
            }
            
            .pid {
                font-size: 20px;
            }
            
            .sow-name {
                font-size: 15px;
            }
            
            .tab-button {
                font-size: 16px;
                padding: 10px 8px;
                min-width: 70px;
            }
            
            .tab-content-area {
                margin-top: var(--height-fixed-prod-entry);
                max-height: calc(200vh - var(--height-fixed-prod-entry)); /* Viewport height minus fixed headers */
        
            }
            
            
            .btn {
                padding: 12px;
            }
            
        }

        @media (max-width: 380px) {
            .pid-and-sow {
                flex-direction: column;
                gap: 5px;
            }
            
            .tab-content-area {
                margin-top: var(--height-fixed-prod-entry);
                max-height: calc(200vh - var(--height-fixed-prod-entry)); /* Viewport height minus fixed headers */
        
            }
            
        }
        
        @media (max-height: 600px) {
            .tab-content {
                
            }
        }
    </style>
        `;
        
        return html;
    }
    
    
    this.render = function(){
        
        elemIdNavPrevEntry      = `pig-prod-entry-prev-entry`;
        elemIdEntryTitle        = `pig-prod-entry-title`;
        elemIdPigProdPid        = `pig-prod-entry-pig-prod-pid`;
        elemIdHeaderSowName     = `pig-prod-entry-header-sow-name`;
        elemIdHeaderBoarName    = `pig-prod-entry-header-boar-name`;
        elemIdNavNextEntry      = `pig-prod-entry-next-entry`;
        
        

        const html_style        = thisObj._writeInlineStyle();
        
        const html_tab_insem    = prodEntryInsem.getHtml();
        const html_tab_birth    = prodEntryBirth.getHtml();
        
        const html =`

    ${html_style}
        
    <!-- Fixed Top Section -->
    <div class="top-section">
        <div class="navigation-bar">
            <div style="display:flex; align-items: center;justify-content: space-between;">
                <button class="nav-button" id="${elemIdNavPrevEntry}"><i class="fa-solid fa-arrow-left"></i></button>
                <span id="${elemIdEntryTitle}">1 of 4</span>
                <button class="nav-button" id="${elemIdNavNextEntry}"><i class="fa-solid fa-arrow-right"></i></button>
            </div>
            
            <div class="entry-info">
                <div class="pid-and-sow">
                    <div class="sow-name">
                        <span style="margin-right:10px;">(PID <span id="${elemIdPigProdPid}">1</span>)</span>
                        <span id="${elemIdHeaderSowName}">Sow</span>
                        <span class="love-icon">❤️</span>
                        <span id="${elemIdHeaderBoarName}">Boar</span>
                    </div>
                </div>
            </div>
            
            
        </div>
        
        <!-- Tabs Navigation -->
        <div class="tabs-container">
            <button class="tab-button active" data-tab="insem">Insem</button>
            <button class="tab-button" data-tab="birth">Birth</button>
            <button class="tab-button" data-tab="status">Status</button>
            <button class="tab-button" data-tab="notes">Notes</button>
        </div>
    </div>
    
    <!-- Tab Content Area - Scrolls below fixed sections -->
    <div class="tab-content-area">
        <!-- Tab Content -->
        <div id="insem-tab" class="tab-content active">
            ${html_tab_insem}
        </div>

        <!-- Birth Tab -->
        <div id="birth-tab" class="tab-content">
            ${html_tab_birth}
        </div>

        <!-- Status Tab -->
        <div id="status-tab" class="tab-content">
            <h2 style="margin-bottom: 20px; color: var(--corporate-blue);">Update Gestation Status</h2>
            
            <div class="warning-box">
                This is used in abnormal cases of hog gestation. Updating the production status to any of the status below will remove this entry from the production list and will be visible only in reports. <b>This cannot be undone.</b>
            </div>
            
            <div class="form-group">
                <label class="form-label">Date Status</label>
                <input type="date" class="form-control" value="2023-11-20">
            </div>
            
            <div class="radio-group">
                <div class="radio-option" data-option="reheat">
                    <input type="radio" name="status" id="reheat" class="radio-input">
                    <div class="radio-text">
                        <div class="radio-title">Sow not pregnant. Sow reheat.</div>
                        <div class="radio-description">Just try again.</div>
                    </div>
                </div>
                
                <div class="radio-option" data-option="sold">
                    <input type="radio" name="status" id="sold" class="radio-input">
                    <div class="radio-text">
                        <div class="radio-title">Sow is Sold or Dead.</div>
                        <div class="radio-description">Sow will also be removed from sow list.</div>
                    </div>
                </div>
                
                <div class="radio-option" data-option="nolive">
                    <input type="radio" name="status" id="nolive" class="radio-input">
                    <div class="radio-text">
                        <div class="radio-title">No Live piglets</div>
                        <div class="radio-description">Sow has given birth all mummified/dead piglets.</div>
                    </div>
                </div>
            </div>
            
            <button class="btn btn-primary">Save Changes</button>
        </div>

        <!-- Notes Tab -->
        <div id="notes-tab" class="tab-content">
            <h2 style="margin-bottom: 20px; color: var(--corporate-blue);">Add New Note</h2>
            
            <div class="form-group">
                <label class="form-label">Date Notes</label>
                <input type="date" class="form-control" value="2023-12-15">
            </div>
            
            <div class="form-group">
                <label class="form-label">Notes</label>
                <textarea class="form-control" rows="4" placeholder="Enter your notes here..."></textarea>
            </div>
            
            <button class="btn btn-success">Save Note</button>
            
            <h3 style="margin-top: 30px; margin-bottom: 15px; color: var(--corporate-blue);">Previous Notes</h3>
            
            <table class="notes-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Notes</th>
                        <th>Last Update By</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>2023-11-10</td>
                        <td>Sow appears healthy with good appetite. All vital signs normal.</td>
                        <td>John Smith</td>
                    </tr>
                    <tr>
                        <td>2023-10-30</td>
                        <td>Routine checkup completed. No issues detected.</td>
                        <td>Maria Garcia</td>
                    </tr>
                    <tr>
                        <td>2023-10-18</td>
                        <td>Initial post-insemination check. Sow resting comfortably.</td>
                        <td>Robert Johnson</td>
                    </tr>
                    <tr>
                        <td>2023-10-15</td>
                        <td>Insemination completed successfully. Sow returned to pen.</td>
                        <td>Lisa Chen</td>
                    </tr>
                </tbody>
            </table>
        </div>
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
        elemNavPrevEntry        = document.getElementById(elemIdNavPrevEntry);
        elemEntryTitle          = document.getElementById(elemIdEntryTitle);
        elemPigProdPid          = document.getElementById(elemIdPigProdPid);
        elemHeaderSowName       = document.getElementById(elemIdHeaderSowName);
        elemHeaderBoarName      = document.getElementById(elemIdHeaderBoarName);
        elemNavNextEntry        = document.getElementById(elemIdNavNextEntry);
        
        
        
        
       
    }
    
    
    this._processAfterHtmlRender = function(){
        prodEntryInsem.afterHtmlRender();
        prodEntryBirth.afterHtmlRender();
    }
    
    
    this._bindEventListeners = function(){
        
        const tabButtons  = elemDivContainer.querySelectorAll('.tab-button');
        const tabContents = elemDivContainer.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Update active tab button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Show corresponding content
                tabContents.forEach(content => content.classList.remove('active'));
                document.getElementById(`${tabId}-tab`).classList.add('active');
                
                // Scroll to top of content area
                elemDivContainer.querySelector('.tab-content-area').scrollTop = 0;
            });
        });
    }
    
    
    this.setDataSowList = function(data){
        prodEntryInsem.setDataSowList(data);
    }
    
    
    this.setDataBoarList = function(data){
        prodEntryInsem.setDataBoarList(data);
    }
    
    
    this.setDataSemenSupplierList = function(data){
        prodEntryInsem.setDataSemenSupplierList(data);
    }
    
    
    this.setDataStaffList = function(data){
        prodEntryInsem.setDataStaffList(data);
        prodEntryBirth.setDataStaffList(data);
    }
    
    
    this.show = function(data_pig_prod, options){
        console.log('PageAddGestating show');
        console.log(data_pig_prod);
        
        // Set Header Data
        const title = `Production Gestating ${options.data_index} Of ${options.total_entries}`;
        elemEntryTitle.textContent = title;
        
        const pid = data_pig_prod.pig_production.farm_prod_id;
        elemPigProdPid.textContent = pid;
        
        const data_sow = data_pig_prod.sow;
        var sow_reference = '';
        
        if ((data_sow.name != null) && (data_sow.name.length >0)){
            sow_reference = data_sow.name;
        }
        else{
            sow_reference = data_sow.number;
        }
        const insemination = data_pig_prod.insemination;
        
        var boar_name = '';
        switch (insemination.insem_type){
            case 'B':{
                const boar = insemination.boar;
                
                if ((boar.name != null) && (boar.name.length > 0)){
                    boar_name = boar.name;
                }
                else{
                    boar_name = boar.number;
                }
                break;
            }
            
            case 'AI_X':{
                boar_name = insemination.ai.semen_supplier.semen.name;
                boar_name += ' from ' + insemination.ai.semen_supplier.name;
                break;
            }
            
            case 'AI_N':{
                const internal_boar = insemination.ai.internal_boar;
                
                if ((internal_boar.name != null) && (internal_boar.name.length > 0)){
                    boar_name = internal_boar.name;
                }
                else{
                    boar_name = internal_boar.number;
                }
                
                boar_name += '(via AI)';
                
                break;
            }
            
        }
        
        
        
        elemHeaderSowName.textContent   = sow_reference;
        elemHeaderBoarName.textContent  = boar_name;
        
        
        // set arrow navigation
        elemNavPrevEntry.onclick = function(){
            navigation.onClickProdGestatingEntry(options.prev_prod_pid);
        }
        
        elemNavNextEntry.onclick = function(){
            navigation.onClickProdGestatingEntry(options.next_prod_pid);
        }
        
        
        // Set Insemination tab
        const options_insem ={
            is_read_only:   false
        }
        prodEntryInsem.show(data_pig_prod, options_insem);
    }
    
}   