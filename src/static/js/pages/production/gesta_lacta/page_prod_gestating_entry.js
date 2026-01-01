// January 1, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../../common/page_view_basic.js';

import {SOW_STATUS,
        PIG_OPERATION_TYPE}     from '../../../constants.js';

//import {AddModalSowBoar}        from './add_modal_sow.js';



PageProdGestatingEntry.prototype = new PageViewBasic();
export function PageProdGestatingEntry(input_settings){
    PageViewBasic.call(this);
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    
    
    /*
    Typical settings = {
        parentObj:              this
    };
    */
    const settings              = input_settings;

    
   
    const elemDivContainer      = document.getElementById('container-prod-gesta-entry');
        
        
    var elemIdNavPrevEntry      = null;
    var elemIdPigProdPid        = null;
    var elemIdHeaderSowName     = null;
    var elemIdHeaderBoarName    = null;
    var elemIdNavNextEntry      = null;
    
    
    
    var elemNavPrevEntry        = null;
    var elemPigProdPid          = null;
    var elemHeaderSowName       = null;
    var elemHeaderBoarName      = null;
    var elemNavNextEntry        = null;
    
    
    
    
    
    
    
    
    var sowList                 = null;
    var boarList                = null;
    var semenSupplierList       = null;
    
    var staffList               = null; 
    
    
    
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
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nav-button {
            background: none;
            border: none;
            color: white;
            font-size: 32px; /* Bigger arrow icons */
            width: 50px;
            height: 50px;
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
            max-height: calc(100vh - var(--height-fixed-prod-entry)); /* Viewport height minus fixed headers */
        }

        /* Individual Tab Content */
        .tab-content {
            display: none;
            padding: 12px 12px;
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

        .form-control {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid var(--corporate-border);
            border-radius: 8px;
            font-size: 16px;
            background-color: white;
            transition: border-color 0.2s;
        }

        .form-control:focus {
            outline: none;
            border-color: var(--corporate-light-blue);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-control.readonly {
            background-color: #f9fafb;
            color: var(--text-light);
        }

        /*
        .input-group {
            display: flex;
            gap: 10px;
        }

        .input-group .form-control {
            flex-grow: 1;
        }*/

        /* Number input with plus/minus buttons */
        .number-input-group {
            display: flex;
            align-items: center;
        }

        .number-btn {
            width: 44px;
            height: 44px;
            background-color: var(--corporate-blue);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .number-btn:active {
            background-color: #1e40af;
        }

        .number-btn.minus {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }

        .number-btn.plus {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }

        .number-input {
            flex-grow: 1;
            text-align: center;
            border-left: none;
            border-right: none;
            border-radius: 0;
            font-weight: 600;
        }

       
        .warning-box {
            background-color: var(--warning-bg);
            border-left: 4px solid var(--warning-border);
            padding: 12px 15px;
            margin-bottom: 20px;
            border-radius: 0 8px 8px 0;
            font-size: 14px;
            color: var(--text-dark);
        }

        .warning-box b {
            color: #dc2626;
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
                width: 44px;
                height: 44px;
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
                max-height: calc(100vh - var(--height-fixed-prod-entry));
            }
            
            .form-control {
                padding: 10px 12px;
            }
            
            .btn {
                padding: 12px;
            }
            
            .number-btn {
                width: 40px;
                height: 40px;
            }
        }

        @media (max-width: 380px) {
            .pid-and-sow {
                flex-direction: column;
                gap: 5px;
            }
            
            .tab-content-area {
                margin-top: var(--height-fixed-prod-entry);
                max-height: calc(100vh - var(--height-fixed-prod-entry));
            }
            
        }
        
        @media (max-height: 600px) {
            .tab-content {
                max-height: calc(100vh - 180px);
            }
        }
    </style>
        `;
        
        return html;
    }
    
    
    this.render = function(){
        
        elemIdNavPrevEntry      = `pig-prod-entry-prev-entry`;
        elemIdPigProdPid        = `pig-prod-entry-pig-prod-pid`;
        elemIdHeaderSowName     = `pig-prod-entry-header-sow-name`;
        elemIdHeaderBoarName    = `pig-prod-entry-header-boar-name`;
        elemIdNavNextEntry      = `pig-prod-entry-next-entry`;
        
        

        const html_style = thisObj._writeInlineStyle();
        
        
        const html =`

    ${html_style}
        
    <!-- Fixed Top Section -->
    <div class="top-section">
        <div class="navigation-bar">
            <button class="nav-button" id="${elemIdNavPrevEntry}">←</button>
            
            <div class="entry-info">
                <div class="pid-and-sow">
                    <!--<div class="pid">PID <span id="${elemIdPigProdPid}">1</span></div>-->
                    <div class="sow-name">
                        <span id="${elemIdPigProdPid}">PID: 1</span>
                        <span id="${elemIdHeaderSowName}">Sow</span>
                        <span class="love-icon">❤️</span>
                        <span id="${elemIdHeaderBoarName}">Boar</span>
                    </div>
                </div>
            </div>
            
            <button class="nav-button" id="${elemIdNavNextEntry}">→</button>
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
            <h2 style="margin-bottom: 20px; color: var(--corporate-blue);">Insemination Information</h2>
            
            <div class="form-group-text">
                <label class="form-label">Sow Name</label>
                <input type="text" class="form-control readonly" value="Sow ❤️ Boar Maximus" readonly>
            </div>
            
            <div class="form-group-date">
                <label class="form-label">Date Mating</label>
                <input type="date" class="form-control" id="date-mating" value="2023-10-15">
            
                <div class="warning-box" id="mating-warning" style="display: none;">
                    Changing the Date Mating will affect gestation period calculations.
                </div>
            </div>
            
            <div class="form-group-select">
                <label class="form-label">Insemination Type</label>
                <select class="form-control" id="insem-type">
                    <option value="boar">Boar Mating</option>
                    <option value="artificial">Artificial Insemination</option>
                </select>
            </div>
            
            <!-- Boar Mating Section (shown by default) -->
            <div id="boar-mating-section" class="dynamic-section">
                <div class="form-group-select">
                    <label class="form-label">Select Boar</label>
                    <select class="form-control">
                        <option value="boar1">Big Boy (Duroc)</option>
                        <option value="boar2" selected>Maximus (Landrace)</option>
                        <option value="boar3">Titan (Hampshire)</option>
                        <option value="boar4">Hercules (Yorkshire)</option>
                    </select>
                </div>
            </div>
            
            <!-- Artificial Insemination Section (hidden by default) -->
            <div id="artificial-section" class="dynamic-section" style="display: none;">
                <div class="form-group-select">
                    <label class="form-label">Semen Supplier</label>
                    <select class="form-control">
                        <option value="">Select supplier</option>
                        <option value="supplier1">Premium Swine Genetics</option>
                        <option value="supplier2">Elite Boar Semen Co.</option>
                        <option value="supplier3">Top Genetics Inc.</option>
                    </select>
                </div>
                
                <div class="form-group-select">
                    <label class="form-label">Semen Type</label>
                    <select class="form-control">
                        <option value="">Select type</option>
                        <option value="fresh">Fresh</option>
                        <option value="frozen">Frozen</option>
                        <option value="chilled">Chilled</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Semen Cost ($)</label>
                    <input type="number" class="form-control" placeholder="0.00" min="0" step="0.01">
                </div>
            </div>
            
            <div class="form-group-number">
                <label class="form-label">Other Costs ($)</label>
                <input type="number" class="form-control" placeholder="Enter additional costs" min="0" step="0.01">
            </div>
            
            <div class="form-group-text-area">
                <label class="form-label">Notes</label>
                <textarea class="form-control" rows="4" id="insem-notes" placeholder="Add notes about this insemination..."></textarea>
                <div class="char-counter"><span id="char-count">0</span>/500 characters</div>
            </div>
            
            <div class="form-group-select">
                <label class="form-label">Staff</label>
                <select class="form-control">
                    <option value="">Select staff member</option>
                    <option value="staff1" selected>John Smith</option>
                    <option value="staff2">Maria Garcia</option>
                    <option value="staff3">Robert Johnson</option>
                    <option value="staff4">Lisa Chen</option>
                </select>
            </div>
            
            <button class="btn btn-primary">Save Changes</button>
        </div>

        <!-- Birth Tab -->
        <div id="birth-tab" class="tab-content">
            <h2 style="margin-bottom: 20px; color: var(--corporate-blue);">Birth Information</h2>
            
            <div class="warning-box">
                Setting the Date Actual Birth will update the production entry from Gestating status to Lactating Status and will be removed from Production Gestating List. Will be put in Production Lactating List.
            </div>
            
            <div class="form-group">
                <label class="form-label">Date Expected Birth</label>
                <input type="date" class="form-control readonly" value="2024-02-07" readonly>
            </div>
            
            <div class="form-group">
                <label class="form-label">Date Actual Birth</label>
                <input type="date" class="form-control" id="actual-birth-date">
                <div style="font-size: 14px; color: var(--text-light); margin-top: 5px;" id="gestation-days">Gestation period: -- days</div>
            </div>
            
            <!-- Number of Female Piglets with plus/minus buttons -->
            <div class="form-group">
                <label class="form-label">Number of Female Piglets</label>
                <div class="number-input-group">
                    <button class="number-btn minus" data-field="female">-</button>
                    <input type="number" class="form-control number-input" id="female-piglets" value="7" min="0">
                    <button class="number-btn plus" data-field="female">+</button>
                </div>
            </div>
            
            <!-- Number of Male Piglets with plus/minus buttons -->
            <div class="form-group">
                <label class="form-label">Number of Male Piglets</label>
                <div class="number-input-group">
                    <button class="number-btn minus" data-field="male">-</button>
                    <input type="number" class="form-control number-input" id="male-piglets" value="6" min="0">
                    <button class="number-btn plus" data-field="male">+</button>
                </div>
            </div>
            
            <!-- Number of Stillbirth Piglets with plus/minus buttons -->
            <div class="form-group">
                <label class="form-label">Number of Stillbirth Piglets</label>
                <div class="number-input-group">
                    <button class="number-btn minus" data-field="stillbirth">-</button>
                    <input type="number" class="form-control number-input" id="stillbirth-piglets" value="1" min="0">
                    <button class="number-btn plus" data-field="stillbirth">+</button>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Birth Staff</label>
                <div class="input-group">
                    <select class="form-control">
                        <option value="">Select staff member</option>
                        <option value="staff1">John Smith</option>
                        <option value="staff2" selected>Maria Garcia</option>
                        <option value="staff3">Robert Johnson</option>
                        <option value="staff4">Lisa Chen</option>
                    </select>
                    <input type="text" class="form-control" placeholder="New staff name">
                </div>
            </div>
            
            <button class="btn btn-primary">Save Changes</button>
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
        elemPigProdPid          = document.getElementById(elemIdNavPrevEntry);
        elemHeaderSowName       = document.getElementById(elemIdNavPrevEntry);
        elemHeaderBoarName      = document.getElementById(elemIdNavPrevEntry);
        elemNavNextEntry        = document.getElementById(elemIdNavPrevEntry);
        
        
        
        
       
    }
    
    
    this._processAfterHtmlRender = function(){
        
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
                document.querySelector('.tab-content-area').scrollTop = 0;
            });
        });
    }
    
    
    this.setDataSowList = function(data){
        sowList = data;
        
        var select_data = [];
        if (sowList.length == 0){
            select_data.push({value:"-1", text:"No Entries"});
            thisObj.replaceSelectOptions(elemSelectSow, select_data);
            return;
        }
        
        
        select_data.push({value:"0", text:"Please Select"});
        
        for (const cur_sow_boar of data){
            var reference;
            
            // This is because there is this data can come into
            // minimum and not minimum info.
            const cur_entry = ('sow_boar' in cur_sow_boar)? cur_sow_boar.sow_boar: cur_sow_boar;
            
            if (cur_entry.status_id == SOW_STATUS.GROWING ||
                cur_entry.status_id == SOW_STATUS.GESTATING ||
                cur_entry.status_id == SOW_STATUS.WEANING) {
            
                if (cur_entry.name != null && cur_entry.name.length > 0){
                    reference = cur_entry.name;
                    
                    if (cur_entry.number != null &&  cur_entry.number.length > 0) {
                        reference +=  ' (' + cur_entry.number + ')';
                    }
                }
                else{
                    reference = cur_entry.number;
                }
                
                select_data.push({value: cur_entry.hid, text: reference});
            }
        }
        
        thisObj.replaceSelectOptions(elemSelectSow, select_data);
    }
    
    
    this.setDataBoarList = function(data){
        boarList = data;
        
        var select_data = [];
        if (boarList.length == 0){
            select_data.push({value:"-1", text:"No Entries"});
            thisObj.replaceSelectOptions(elemSelectBoar, select_data);
            return;
        }
        
        
        select_data.push({value:"0", text:"Please Select"});
        
        for (const cur_sow_boar of data){
            var reference;
            
            // This is because there is this data can come into
            // minimum and not minimum info.
            const cur_entry = ('sow_boar' in cur_sow_boar)? cur_sow_boar.sow_boar: cur_sow_boar;
            
            
            if (cur_entry.name != null && cur_entry.name.length > 0){
                reference = cur_entry.name;
                
                if (cur_entry.number != null &&  cur_entry.number.length > 0) {
                    reference +=  ' (' + cur_entry.number + ')';
                }
            }
            else{
                reference = cur_entry.number;
            }
            
            select_data.push({value: cur_entry.hid, text: reference});
        }
        
        thisObj.replaceSelectOptions(elemSelectBoar, select_data);
        
    }
    
    
    this.setDataSemenSupplierList = function(data){
        semenSupplierList = data;
    }
    
    
    this.setDataStaffList = function(data){
        staffList = data;
        
        var select_data = [];
        if (staffList.length == 0){
            select_data.push({value:"-1", text:"No Entries"});
            thisObj.replaceSelectOptions(elemStaff, select_data);
            return;
        }
        
        
        var select_data = [];
        select_data.push({value:"0", text:"Please Select"});
        
        for (const cur_entry of data){
            select_data.push({value: cur_entry.hid, text: cur_entry.name});
        }
        
        thisObj.replaceSelectOptions(elemStaff, select_data);
    }
    
    
    this.show = function(){
        console.log('PageAddGestating show');
    }
    
    this._onChangeSow = function(){
        var sow_hid       = elemSelectSow.value;
        
        var index;
        var cur_entry;
        
        var gestating_sow = null;
        
        elemSowStatusShow.style.display = 'none';
        
        for(index = 0; index < sowList.length; index++){
            cur_entry = sowList[index];
            if ('sow_boar' in cur_entry){
                cur_entry = cur_entry.sow_boar;
            }
            
            if (cur_entry.hid == sow_hid){
                if (cur_entry.status_id == SOW_STATUS.GESTATING){
                    elemSowLastInsem.innerHTML  = cur_entry.date_insemination;
                    elemSowLastPid.innerHTML    = cur_entry.last_prod_id;  
                    
                    
                    elemSowStatusShow.style.display = 'block';
                }
                break;
            }
        }
    }
    
}   