// page_home_dashboard.js

// January 9, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../common/page_view_basic.js';

import {APPLICATION,
        FLAG_BITS,
        DEFAULT_WEEKDAY,
        PAGE_ID,
        HASH_ROUTES,
        PIG_OPERATION_TYPE,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        ACC_USER_GROUP}         from '../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        FORMAT_MONTH_DATE_ONLY} from '../../utils.js';
        
        
import {ManagerPwa}             from './manager_pwa.js';
import {PigFarmSowDueChecklist} from './pig_farm_sow_due_checklist.js';
import {LastFeedBalance}        from './last_feed_balance.js';



export function PageHomeDashBoard(input_settings){
    PageViewPigFarmPage.call(this);
    
    const TAG                   = 'PageHomeDashBoard';
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    this.setNavigation(navigation);
    
    this.STORAGE_KEY            = 'superpig_dashboard';
    
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContUserDisabled
    };
    */
    const settings              = input_settings;
    
    const MIN_DAYS_SHOW_EXPECTING   = 7;
    
    
    // This is needed as this will be first element to be rendered
    let elemDivContainer        = document.getElementById(settings.elemIdDivContainer);
    
    
    let elemDashboard           = null;
    
    let elemIdFarmName          = null;
    let elemIdTodayDate         = null;
                     
    let elemIdDashBoardMain     = null;
    
    let elemIdCardLactaPiglets  = null;
    let elemIdCardFatteningPigs = null;
                                            
    let elemIdCardLactaSows     = null;         
    let elemIdCardGestaSows     = null;         
                                            
    let elemIdCardBoars         = null;         
    let elemIdCardGilts         = null;         
                 
    let elemIdCardWeanedSows    = null;
    let elemIdCardToHarvest     = null;
    
    
    
    let elemIdLabelExpectingSows= null;
    let elemIdExpectingSowsShow = null;
    let elemIdExpectingSows     = null;
    
    
    let elemIdServerErrorMsg    = null;
    let elemIdDebug             = null;
    
    
    let elemIdAccountLocked     = null;
    let elemIdAccountLockedMsg  = null;
    let elemIdAccountViewBill   = null;
    
    
    
    
    let elemFarmName            = null;
    let elemTodayDate           = null;
    
    
    let elemDashBoardMain       = null;
   
    let elemCardLactaPiglets    = null;
    let elemCardFatteningPigs   = null;
                                            
    let elemCardLactaSows       = null;         
    let elemCardGestaSows       = null;         
                                            
    let elemCardBoars           = null;         
    let elemCardGilts           = null;         
    
    let elemCardWeanedSows      = null;
    let elemCardToHarvest       = null;
    
    
    
    let elemLabelLactaPiglets   = null;
    let elemLabelFatteningPigs  = null;
                          
    let elemLabelLactaSows      = null;
    let elemLabelGestaSows      = null;
                           
    let elemLabelBoars          = null;
    let elemLabelGilts          = null;
    
    let elemLabelWeanedSows     = null;
    let elemLabelToHarvest      = null;
    
    
                              
    let elemNumLactaPiglets     = null;
    let elemNumFatteningPigs    = null;
                              
    let elemNumLactaSows        = null;
    let elemNumGestaSows        = null;
                              
    let elemNumBoars            = null;
    let elemNumGilts            = null;
    
    let elemNumWeanedSows       = null;
    let elemNumToHarvest        = null;
    
    
    let elemLabelExpectingSows  = null;
    let elemExpectingSowsShow   = null;
    let elemExpectingSows       = null;
    
    
    let elemServerErrorMsg      = null;
    let elemDebug               = null;
    
    
    
    let elemAccountLocked       = null;
    let elemAccountLockedMsg    = null;
    let elemAccountViewBill     = null;

    
    
    let dtCurrentDate           = null;

   
    let managerPwa              = new ManagerPwa({
        navigation:             navigation,
        parentObj:              thisObj,
        elemDivContainer:       elemDivContainer,
        uniqueKey:              settings.uniqueKey
    });
    
    
    let sowDueChecklist         = new PigFarmSowDueChecklist({
        navigation:             navigation,
        parentObj:              thisObj,
        elemDivContainer:       elemDivContainer,
        uniqueKey:              settings.uniqueKey
    });
    
    
    let lastFeedBalance         = new LastFeedBalance({
        navigation:             navigation,
        parentObj:              thisObj,
        elemDivContainer:       elemDivContainer,
        uniqueKey:              settings.uniqueKey
    })
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this._writeInlineStyle = function(){
        const html = `
        <style>
        /* Account Locked Styles */
        .account-locked-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .account-locked-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
        }
        
        .account-locked-card {
            position: relative;
            background: white;
            border-radius: 12px;
            padding: 2rem;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            z-index: 1001;
        }
        
        .account-locked-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
        }
        
        .account-locked-title {
            font-size: 1.5rem;
            font-weight: bold;
            color: #dc2626;
            margin-bottom: 1rem;
        }
        
        .account-locked-message {
            color: #4b5563;
            line-height: 1.5;
            font-size: 1.2rem;
            margin-bottom: 1.5rem;
        }
        
        .account-locked-btn {
            background: #2e7d64;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .account-locked-btn:hover {
            background: #236b55;
        }
        
        
        
        
        
        
        .checklist-table {
            width: 100%;
            border-collapse: collapse;
        }

        .checklist-table tr:nth-child(even) {
            background-color: #f8f9fa;
        }

        .checklist-table tr:nth-child(odd) {
            background-color: #ffffff;
        }

        .checklist-table tr.checked {
            background-color: #f0fdf4;
        }

        .checklist-table td {
            padding: 10px 8px;
            border-bottom: 1px solid #e9ecef;
        }

        .checklist-checkbox {
            width: 20px;
            height: 20px;
            accent-color: #2e7d64;
            cursor: pointer;
            margin: 0;
        }

        .checklist-label {
            display: block;
            font-size: 0.95rem;
            cursor: pointer;
            margin: 0;
        }

        .checklist-label.checked {
            color: #28a745;
            text-decoration: line-through;
        }
        </style>`;
        
        return html;
    }
    
    
    this.render = function(){
        elemIdFarmName          = `${settings.uniqueKey}-farm-name`;
        elemIdTodayDate         = `${settings.uniqueKey}-today-date`;
        
        elemIdDashBoardMain     = `${settings.uniqueKey}-dashboard`;
        
        elemIdCardLactaPiglets  = `${settings.uniqueKey}-card-lacta-piglets`;
        elemIdCardFatteningPigs = `${settings.uniqueKey}-card-fattening-pigs`;
                                                        
        elemIdCardLactaSows     = `${settings.uniqueKey}-card-lacta-sows`;
        elemIdCardGestaSows     = `${settings.uniqueKey}-card-gesta-sows`;
                                                        
        elemIdCardBoars         = `${settings.uniqueKey}-card-boars`;
        elemIdCardGilts         = `${settings.uniqueKey}-card-gilts`;
        
        elemIdCardWeanedSows    = `${settings.uniqueKey}-card-weaned-sows`;
        elemIdCardToHarvest     = `${settings.uniqueKey}-card-to-harvest`;
        
        
        elemIdExpectingSowsShow = `${settings.uniqueKey}-expecting-sows-show`;
        elemIdLabelExpectingSows= `${settings.uniqueKey}-expecting-sows-label`;
        elemIdExpectingSows     = `${settings.uniqueKey}-expecting-sows`;
        
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        elemIdDebug             = `${settings.uniqueKey}-debug`;
        
        
        const html_style        = thisObj._writeInlineStyle();
        
        const html_install_btn  = managerPwa.getHtml();

        const html_account_locked       = thisObj.getAccountLockedHtml();

        const html_sow_due_checklist    = sowDueChecklist.getHtml();
        
        const html_last_feed_balance    = lastFeedBalance.getHtml();
        
        
        const html = `
    ${html_style}
    
        
    <div class="dashboard">
        
        <div class="customer-header">
            <div class="farm-name" id="${elemIdFarmName}"></div>
        </div>
        <div class="today-date" id="${elemIdTodayDate}"></div>


        ${html_install_btn}

        
        ${html_account_locked}


        <div id="${elemIdDashBoardMain}">
            <div class="stats-grid">

                <!-- row 1: Lacta Piglets | Fattening Pigs -->
                <div class="grid-row">
                    <div class="stat-cell card-lacta-piglets" id="${elemIdCardLactaPiglets}">
                        <div class="label">Lacta Piglets</div>
                        <div class="number">0</div>
                    </div>
                    <div class="stat-cell card-fattening" id="${elemIdCardFatteningPigs}">
                        <div class="label">Fattening Pigs</div>
                        <div class="number">0</div>
                    </div>
                </div>

                <!-- row 2: Lacta Sow | Gesta Sow -->
                <div class="grid-row">
                    <div class="stat-cell card-lacta-sows" id="${elemIdCardLactaSows}">
                        <div class="label">Lacta Sows</div>
                        <div class="number">0</div>
                    </div>
                    <div class="stat-cell card-gesta" id="${elemIdCardGestaSows}">
                        <div class="label">Gesta Sows</div>
                        <div class="number">0</div>
                    </div>
                </div>

                <!-- row 3: Boars | Gilts -->
                <div class="grid-row">
                    <div class="stat-cell" id="${elemIdCardBoars}">
                        <div class="label">Boars</div>
                        <div class="number">0</div>
                    </div>
                    <div class="stat-cell card-gilts" id="${elemIdCardGilts}">
                        <div class="label">Gilts</div>
                        <div class="number">0</div>
                    </div>
                </div>
                
                <!-- row 4: Weaned Sows | 140 Days+ -->
                <div class="grid-row">
                    <div class="stat-cell card-wean-sows" id="${elemIdCardWeanedSows}">
                        <div class="label">Weaned Sows</div>
                        <div class="number">0</div>
                    </div>
                    <div class="stat-cell card-to-harvest" id="${elemIdCardToHarvest}">
                        <div class="label">140 Days+</div>
                        <div class="number">0</div>
                    </div>
                </div>
                
                
            </div>


            <!-- row 4: Expecting Next 7 days (list) -->
            <div class="expecting-section" id="${elemIdExpectingSowsShow}">
                <div class="section-title">
                    <span>⏳</span><span id="${elemIdLabelExpectingSows}">Expecting next 7 days</span>
                </div>
                
                <div class="sow-name-pills" id="${elemIdExpectingSows}"></div>
            
                ${html_sow_due_checklist}
            </div>

            
            <!-- NEW ROW 4.5: Last Feed Balance -->
            ${html_last_feed_balance}


            <!-- row 5: Harvest Next 7 days (table) -->
            <div class="harvest-section" style="display:none;">
                <div class="section-title">
                    <span>🔪</span> Harvest next 7 days
                </div>
                <div class="table-container-harvest">
                    <table class="dashboard-table-harvest">
                        <thead>
                            <tr>
                                <th>PID</th>
                                <th>Num Pigs</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td class="dashboard-pid">H-2410</td><td><span class="dashboard-pig-count">6</span></td></tr>
                            <tr><td class="dashboard-pid">H-2411</td><td><span class="dashboard-pig-count">4</span></td></tr>
                            <tr><td class="dashboard-pid">H-2412</td><td><span class="dashboard-pig-count">8</span></td></tr>
                            <tr><td class="dashboard-pid">H-2413</td><td><span class="dashboard-pig-count">5</span></td></tr>
                            <tr><td class="dashboard-pid">H-2414</td><td><span class="dashboard-pig-count">7</span></td></tr>
                        </tbody>
                    </table>
                </div>
                <div style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--icon-syringe); display: flex; justify-content: space-between;">
                    <span>total 30 head</span>
                    <span style="color:var(--corporate-blue);">⬇️ schedule</span>
                </div>
            </div>
        </div>
        
        <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
        
        <div id="${elemIdDebug}" style="display:none;">
        </div>
        
    </div>
    `
        ;
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
        
        
        managerPwa.afterHtmlRender();
        sowDueChecklist.afterHtmlRender();
        lastFeedBalance.afterHtmlRender();
    }
    
    
    this._findElements = function(){
        elemDashboard           = elemDivContainer.querySelector('.dashboard');
        
        elemFarmName            = elemDivContainer.querySelector('#'+elemIdFarmName);        
        elemTodayDate           = elemDivContainer.querySelector('#'+elemIdTodayDate);       
        
        
        elemAccountLocked       = elemDivContainer.querySelector('#'+elemIdAccountLocked);
        elemAccountLockedMsg    = elemDivContainer.querySelector('#'+elemIdAccountLockedMsg);
        elemAccountViewBill     = elemDivContainer.querySelector('#'+elemIdAccountViewBill);
        
        
        
        elemDashBoardMain       = elemDivContainer.querySelector('#'+elemIdDashBoardMain);
               
        elemCardLactaPiglets    = elemDivContainer.querySelector('#'+elemIdCardLactaPiglets); 
        elemCardFatteningPigs   = elemDivContainer.querySelector('#'+elemIdCardFatteningPigs);
                                                                                             
        elemCardLactaSows       = elemDivContainer.querySelector('#'+elemIdCardLactaSows);    
        elemCardGestaSows       = elemDivContainer.querySelector('#'+elemIdCardGestaSows);        
                                                                                             
        elemCardBoars           = elemDivContainer.querySelector('#'+elemIdCardBoars);            
        elemCardGilts           = elemDivContainer.querySelector('#'+elemIdCardGilts);        
        
        elemCardWeanedSows      = elemDivContainer.querySelector('#'+elemIdCardWeanedSows);
        elemCardToHarvest       = elemDivContainer.querySelector('#'+elemIdCardToHarvest);
        
        
        // Label elements - query from their parent stat-cells
        elemLabelLactaPiglets   = elemCardLactaPiglets.querySelector('.label');
        elemLabelFatteningPigs  = elemCardFatteningPigs.querySelector('.label');
                               
        elemLabelLactaSows      = elemCardLactaSows.querySelector('.label');
        elemLabelGestaSows      = elemCardGestaSows.querySelector('.label');
                               
        elemLabelBoars          = elemCardBoars.querySelector('.label');
        elemLabelGilts          = elemCardGilts.querySelector('.label');
        
        elemLabelBoars          = elemCardBoars.querySelector('.label');
        elemLabelGilts          = elemCardGilts.querySelector('.label');
        
        elemLabelWeanedSows     = elemCardWeanedSows.querySelector('.label');
        elemLabelToHarvest      = elemCardToHarvest.querySelector('.label');        
        
        
        
        // Number elements - query from their parent stat-cells
        elemNumLactaPiglets     = elemCardLactaPiglets.querySelector('.number');
        elemNumFatteningPigs    = elemCardFatteningPigs.querySelector('.number');
                                  
        elemNumLactaSows        = elemCardLactaSows.querySelector('.number');
        elemNumGestaSows        = elemCardGestaSows.querySelector('.number');
                                  
        elemNumBoars            = elemCardBoars.querySelector('.number');
        elemNumGilts            = elemCardGilts.querySelector('.number');
        
        elemNumWeanedSows       = elemCardWeanedSows.querySelector('.number');
        elemNumToHarvest        = elemCardToHarvest.querySelector('.number');        
        
        
        elemLabelExpectingSows  = elemDivContainer.querySelector('#'+elemIdLabelExpectingSows);
        elemExpectingSowsShow   = elemDivContainer.querySelector('#'+elemIdExpectingSowsShow);
        elemExpectingSows       = elemDivContainer.querySelector('#'+elemIdExpectingSows);
    
    
        elemServerErrorMsg      = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);
        elemDebug               = elemDivContainer.querySelector('#'+elemIdDebug);
        
        
        this.elemServerErrorMsg = elemServerErrorMsg;
    
    }
    
    
    this._processAfterHtmlRender = function(){
        
        this.onUserChangeLanguage();
    }
    
    
    this._bindEventListeners = function(){
        
        elemAccountViewBill.addEventListener('click', function() {
            const go_back_page = navigation.getPageContainer(PAGE_ID.HOME);
                        
            const next_page = navigation.getPageContainer(PAGE_ID.BILL_NEW);
            navigation.pushCurrentPageToNavHistory(next_page);
            navigation.showThisPage(next_page);
            
            const options = {
                go_back_page: go_back_page
            };
            navigation.pageAccountNewBill.show(options);
                        
        });
        
        
        elemCardLactaPiglets.addEventListener('click', function() {
            navigation.managerNavLinks.onClickNavProdGestaLacta(true, 
                PIG_OPERATION_TYPE.LACTATING_PIGLETS);
            navigation.pageMobLactatingList.clickLactaPigCount();
        });
    
        elemCardFatteningPigs.addEventListener('click', function() {
            navigation.managerNavLinks.onClickNavProdFattening(true);
        });
        
        
        elemCardLactaSows.addEventListener('click', function() {
            navigation.managerNavLinks.onClickNavProdGestaLacta(true, 
                PIG_OPERATION_TYPE.LACTATING_PIGLETS);
            navigation.pageMobLactatingList.clickLactaPigOps();
        });
        
        elemCardGestaSows.addEventListener('click', function() {
             navigation.managerNavLinks.onClickNavProdGestaLacta(true, 
                PIG_OPERATION_TYPE.GESTATING);
        }); 
        
        
        elemCardBoars.addEventListener('click', function() {
            navigation.managerNavLinks.onClickNavSowBoar(true, SOW_BOAR_TYPE.BOAR);
        });

        elemCardGilts.addEventListener('click', function() {
            navigation.managerNavLinks.onClickNavSowBoar(true, SOW_BOAR_TYPE.GILT);
        });
        
        
        elemCardWeanedSows.addEventListener('click', function() {
            const show_options = {filter_type: "weaning"};
            navigation.managerNavLinks.onClickNavSowBoar(true, SOW_BOAR_TYPE.SOW, 
                show_options);
        });

        elemNumToHarvest.addEventListener('click', function() {
            //navigation.managerNavLinks.onClickNavSowBoar(true, SOW_BOAR_TYPE.GILT);
        });
    }
    
    
    
    this.getAccountLockedHtml = function(){
        elemIdAccountLocked     = `${settings.uniqueKey}-account-locked`;
        elemIdAccountLockedMsg  = `${settings.uniqueKey}-acc-locked-msg`;
        elemIdAccountViewBill   = `${settings.uniqueKey}-view-bill`;
        
        
        /**
         Account Locked
         
         Your Pig Farm Account data has been temporary locked due ovedue bill.
         
         Message 1: For Staff
            Please contact you account admins to settle your account bill.
            
            
         Message 2: For Admin and Management
            Please settle your account bill to restore access to all users 
            of your Pig Farm Account. Note we can restore access only after
            we verify the bill payment.
            
            
            View Bill 
        **/
        
        let label_title         = 'Account Locked';
        let label_view_bill     = 'View Bill';
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_title             = helper.getSimpleTranslation('page_dashboard.labels.account_locked.title') || label_title;
        label_view_bill         = helper.getSimpleTranslation('page_dashboard.labels.account_locked.view_bill') || label_view_bill;
        
       
        const html = `
        <div id="${elemIdAccountLocked}" class="account-locked-container" style="">
            <div class="account-locked-overlay"></div>
            <div class="account-locked-card">
                <div class="account-locked-icon">🔒</div>
                <div class="account-locked-title">${label_title}</div>
                <div class="account-locked-message" id="${elemIdAccountLockedMsg}"></div>
                <button class="account-locked-btn" id="${elemIdAccountViewBill}">${label_view_bill}</button>
            </div>
        </div>
        `;
        return html;
    }
        
    
    this.onUserChangeLanguage = function(){
        const translations = navigation.getTranslations();
        
        let trans_page_dashboard = null;
        
        if (translations){
            if (translations.page_dashboard){
                trans_page_dashboard = translations.page_dashboard;
            }
        }
        
        if (trans_page_dashboard == null){
            return;
        }
        
        
        // Get the stats card labels from translations
        const stats_card_labels = trans_page_dashboard.labels.stats_card;
        
        if (stats_card_labels) {
        
            // Update the labels for each stat card
            if (elemLabelLactaPiglets && stats_card_labels.LactaPiglets) {
                elemLabelLactaPiglets.textContent = stats_card_labels.LactaPiglets;
            }
            
            if (elemLabelFatteningPigs && stats_card_labels.FatteningPigs) {
                elemLabelFatteningPigs.textContent = stats_card_labels.FatteningPigs;
            }
            
            if (elemLabelLactaSows && stats_card_labels.LactaSows) {
                elemLabelLactaSows.textContent = stats_card_labels.LactaSows;
            }
            
            if (elemLabelGestaSows && stats_card_labels.GestaSows) {
                elemLabelGestaSows.textContent = stats_card_labels.GestaSows;
            }
            
            if (elemLabelBoars && stats_card_labels.Boars) {
                elemLabelBoars.textContent = stats_card_labels.Boars;
            }
            
            if (elemLabelGilts && stats_card_labels.Gilts) {
                elemLabelGilts.textContent = stats_card_labels.Gilts;
            }
            
            if (elemLabelWeanedSows && stats_card_labels.WeanedSows) {
                elemLabelWeanedSows.textContent = stats_card_labels.WeanedSows;
            }
            
            if (elemLabelToHarvest && stats_card_labels.ToHarvest) {
                elemLabelToHarvest.textContent = stats_card_labels.ToHarvest;
            }
            
        }
        
        if (elemLabelExpectingSows && trans_page_dashboard.labels.ExpectingSows){
            elemLabelExpectingSows.textContent = trans_page_dashboard.labels.ExpectingSows;
        }
            
     
    }
    
    


    this.renderPage = function(page_data){
        thisObj.show();
    }
    
    
    this.show = function(){
        // Show/ Hide debug  elemnts
        const user = navigation.userControl.dataUserAccount.user.user;
        
        /*
        if ((user.flag & FLAG_BITS.USER.IS_SYS_ADMIN) > 0){
            elemDebug.style.display = 'block';
        } else{
            elemDebug.style.display = 'none';
        }
        */

        
        // Do not delete this; useful in tracing back buton issues
        //console.trace();

        // For first-time users with native prompt
        managerPwa.showPwaInstallButton();
                
        // For returning users who dismissed before
        managerPwa.showDashboardInstallBanner();
        
        
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        let day = dtCurrentDate.getDay();
        
        let label_weekday   = DEFAULT_WEEKDAY[day];
        
        const translations = navigation.getTranslations();
        
        if (translations) {        
            if (translations.common.day_of_week){
                label_weekday = translations.common.day_of_week[day]
            }
        }
        
        
        const pig_farm = navigation.pigFarm.dataPigFarm.pig_farm;
        elemFarmName.textContent = pig_farm.name;
        
        
        const s_dt_today    = formatDate(dtCurrentDate, FORMAT_COMPACT);
        elemTodayDate.textContent = `${s_dt_today}, ${label_weekday}`;
        
        
        thisObj.populateAccountLocked(); 
        
        // Pig Farm Metrics
        thisObj.populatePigFarmMetrics();
        
        
        // Populate Expecting sows next MIN_DAYS_SHOW_EXPECTING days
        thisObj.populateExpectingSows();
        
        
        // Populate last Farm Feed Balance
        lastFeedBalance.populateLastFeedBalance();
        
        
        // Set Editable PigFarm
        thisObj.setEditablePigFarm(); 
        
        
        // Force a reflow to recalculate height
        setTimeout(function() {
            // Force a reflow
            elemDashboard.style.overflow = 'hidden';
            elemDashboard.offsetHeight; // Force reflow
            elemDashboard.style.overflow = 'auto';
            
        }, 100);
        
        
        // Refresh alerts
        navigation.managerAlerts.refreshAlerts();
    }
    
    
    this.populateAccountLocked = function(){
        const translations = navigation.getTranslations();
        
        let label_staff_msg = 'Please contact your account admins to settle your account bill.';
        let label_admin_msg = 'Please settle your account bill to restore access to all users of your Pig Farm Account. Note we can restore access only after we verify the bill payment.';        
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_staff_msg         = helper.getSimpleTranslation('page_dashboard.labels.account_locked.staff_msg') || label_staff_msg;
        label_admin_msg         = helper.getSimpleTranslation('page_dashboard.labels.account_locked.admin_msg') || label_admin_msg;
        
        
        let label_locked_msg    = '';
        
        const user = navigation.userControl.dataUserAccount.user;
        const user_group_num = user.user_group.group_num;
        
        if (user_group_num === ACC_USER_GROUP.ADMIN || 
            user_group_num === ACC_USER_GROUP.MANAGEMENT) {
            label_locked_msg = label_admin_msg;
        } else {
            label_locked_msg = label_staff_msg;
        }
        
        
        elemAccountLockedMsg.textContent = label_locked_msg;
        
        
        // Locked account if overdue bill
        if (navigation.userControl.isAccountLocked()){
            elemAccountLocked.style.display = '';
        }
        else{
            elemAccountLocked.style.display = 'none';
        }
        
    }
    
    
    this.populatePigFarmMetrics = function(){
        // Populate Lacta Piglets / sows
        let data_prod_list = navigation.pigFarm.managerPigProd.dataLactatingList;
    
        let num_pigs = 0;
        let num_lacta_sows = 0;
        for (const cur_entry of data_prod_list){
            num_pigs += cur_entry.pig_production.cur_pig_count;
            num_lacta_sows += 1;
        }
        elemNumLactaPiglets.textContent = num_pigs;
        elemNumLactaSows.textContent = num_lacta_sows;
        
        
        // Populate Fattening Pigs
        data_prod_list = navigation.pigFarm.managerPigProd.dataFatteningList;
        num_pigs = 0;
        for (const cur_entry of data_prod_list){
            num_pigs += cur_entry.pig_production.cur_pig_count;
        }
        elemNumFatteningPigs.textContent = num_pigs;
        
        
        // Populate Gesta Sows
        data_prod_list = navigation.pigFarm.managerPigProd.dataGestatingList;
        num_pigs = data_prod_list.length;
        elemNumGestaSows.textContent = num_pigs;
        
        
        // Populate Gilts
        const data_gilt_list = navigation.pigFarm.managerSowBoar.dataGiltList;
        num_pigs = data_gilt_list.length;
        elemNumGilts.textContent = num_pigs;
        
        
        // Populate Boars
        const data_boar_list = navigation.pigFarm.managerSowBoar.dataBoarList;
        num_pigs = 0;
        
        for (const cur_entry of data_boar_list){
            const sow_boar = cur_entry.sow_boar;
            
            if (sow_boar.is_external){}
            else{
                num_pigs += 1;
            }
        }
        
        elemNumBoars.textContent = num_pigs;
        
        
        // Populate Weaning sows
        const data_sow_list = navigation.pigFarm.managerSowBoar.dataSowList;
        num_pigs = 0;
        
        
        const sow_status_id = SOW_STATUS.WEANING;
        
        for (const cur_entry of data_sow_list){
            const sow_boar = cur_entry.sow_boar;
            
            if (sow_boar.status_id == sow_status_id){
                num_pigs += 1;
            }
        }
        
        elemNumWeanedSows.textContent = num_pigs;
        
        
        // Populate Number Pigs >= 140 Days +
        num_pigs = navigation.pageProdFatteningList.getNumPigsToHarvest();
        elemNumToHarvest.textContent = num_pigs;
        
    }
    
    
    this.populateExpectingSows = function(){
        const expecting_sows = [];
        const data_prod_list = navigation.pigFarm.managerPigProd.dataGestatingList;
        
        for (const cur_entry of data_prod_list){
            const date_expected = cur_entry.birth.date_expected
            const dt_expected   = new Date(date_expected);
            
            const diff_msecs    = dt_expected - dtCurrentDate;
            const diff_days     = Math.round(diff_msecs / APPLICATION.NUM_MSECS_1DAY);
            
            
            if (diff_days <= MIN_DAYS_SHOW_EXPECTING){
                let dt_expected_s = formatDate(dt_expected, FORMAT_MONTH_DATE_ONLY);
                cur_entry.birth.date_expected_s = dt_expected_s;
                expecting_sows.push(cur_entry);
            }
        } 
        
        
        if (expecting_sows.length > 0){
            elemExpectingSowsShow.style.display = 'block';
            elemExpectingSows.innerHTML = '';
            

            // Check PigFarm sow due checklist is available
            const data_checklist = navigation.pigFarm.dataSowDueChecklist;
            
            
            if (data_checklist && data_checklist.length > 0){
                sowDueChecklist.showChecklistBtn();
            }
            else{
                sowDueChecklist.hideChecklistBtn();
            }


            let index = 0;
            for (index = 0; index < expecting_sows.length; index++){
                const cur_entry = expecting_sows[index];
                
                let html_sow = thisObj.getSowBoarReference(cur_entry.sow);
                
                const html = `
                    ${html_sow}
                    <span class="">${cur_entry.birth.date_expected_s}</span>
                `;
                
                const pid = cur_entry.pig_production.farm_prod_id;
                
                const elem = document.createElement('div');
                elem.innerHTML = html;
                elem.classList.add('pill');
                
                elem.onclick = function(){
                    navigation.onClickProdGestatingEntry(pid);
                };
                
                elemExpectingSows.appendChild(elem);
                
            }
            
            
            
            //<span class="pill" style="background:#f0f0f0; border-color:var(--border-color); color:#555;">+1 more</span>
            

            
        }
        else{
            elemExpectingSowsShow.style.display = 'none';
        }
    }
    
    
    this.setEditablePigFarm = function(){
        // Get user.user_group.group_num
        const cur_user = navigation.userControl.dataUserAccount.user;
        const user_group_num = cur_user.user_group.group_num;
        
        
        // Pig Farm name is editable only for Admin and managers
        if (user_group_num == ACC_USER_GROUP.ADMIN || 
            user_group_num == ACC_USER_GROUP.MANAGEMENT){
            elemFarmName.onclick = function() {
                // Show Container
                const next_page_id      = PAGE_ID.PIG_FARM_ADD_EDIT;
                const next_page_hash    = HASH_ROUTES.PIG_FARM_ADD_EDIT;
                
                // Use hash router 
                navigation.managerHashRoute.hashRouter.navigate(next_page_hash, {
                    pageId:         next_page_id,
                    isAdd:          false,
                    returnPageId:   PAGE_ID.HOME
                });
                
                
                const next_page = navigation.getPageContainer(next_page_id);
                navigation.showThisPage(next_page);
                
                
                // Show Page
                const go_back_page_id   = PAGE_ID.HOME;
                const go_back_page = navigation.getPageContainer(go_back_page_id);
                
            
                const options = {
                    is_add:                 false,   // false is edit
                    go_back_page:           go_back_page 
                }
                navigation.pagePigFarmAddEdit.show(options);
                
            };
        }
    }
    
    
    
    this.showEnableNotification = function(){
        // This is called in every show dashboard; so there should be a way to 
        // minimize data traffic between user and server.
    
    }
    
    
      
    this.addDebugMessage = function(message) {
       
        if (elemDebug) {
            const msg = document.createElement('div');
            msg.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
            msg.style.fontSize = '11px';
            msg.style.padding = '2px 0';
            msg.style.borderBottom = '1px solid #eee';
            
            elemDebug.appendChild(msg);
            // Auto-scroll to bottom
            //elemDebug.scrollTop = elemDebug.scrollHeight;
        }
    }
        
}
