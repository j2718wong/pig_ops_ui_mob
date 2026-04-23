// January 9, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../common/page_view_basic.js';

import {APPLICATION,
        FLAG_BITS,
        DEFAULT_WEEKDAY,
        PAGE_ID,
        PIG_OPERATION_TYPE,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        ACC_USER_GROUP,
        FEED_TYPE_NAME}         from '../../constants.js';


import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        FORMAT_MONTH_DATE_ONLY} from '../../utils.js';
        


function isAppInstalled() {
    // For Chrome, Edge, Samsung Internet (modern Android)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    // For iOS Safari
    const isIOSStandalone = window.navigator.standalone === true;
    
    return isStandalone || isIOSStandalone;
}


function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
}


        

export function PageHomeDashBoard(input_settings){
    PageViewPigFarmPage.call(this);
    
    const TAG                   = 'PageHomeDashBoard';
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    this.setNavigation(navigation);
    
    
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
    
    
    let elemIdFeedBalanceShow   = null;
    let elemIdLabelFeedBalance  = null;
    let elemIdDateFeedBalance   = null;
    let elemIdFeedBalanceText   = null;
    
    let elemIdDebug             = null;
    
    
    let elemFarmName            = null;
    let elemTodayDate           = null;
    
    let elemInstallBtn          = null;
    
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
    
    
    let elemFeedBalanceShow     = null;
    let elemLabelFeedBalance    = null;
    let elemDateFeedBalance     = null;
    let elemFeedBalanceText     = null;
    
    let elemDebug               = null;
    
    
    let dtCurrentDate           = null;

    
    let lastVerNumFeedBalance   = null;
    
    
    // PWA Installation
    let deferredPrompt;
    
    
    this.init = function(){

        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        elemIdFarmName          = `${settings.uniqueKey}-farm-name`;
        elemIdTodayDate         = `${settings.uniqueKey}-today-date`;
        
        
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
        
        
        elemIdFeedBalanceShow   = `${settings.uniqueKey}-feed-balance-show`;
        elemIdLabelFeedBalance  = `${settings.uniqueKey}-feed-balance-label`;
        elemIdDateFeedBalance   = `${settings.uniqueKey}-feed-balance-date`;
        elemIdFeedBalanceText   = `${settings.uniqueKey}-feed-balance-text`;
        
        elemIdDebug             = `${settings.uniqueKey}-debug`;
        
        
        const html_install_btn = `
        <button id="install-superpig-btn" hidden style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #1e3a8a;
            color: white;
            border: none;
            border-radius: 40px;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 1000;
            cursor: pointer;
        ">

            📱 Install SuperPig
        </button>
        `;

        
        
        
        
        const html = `
    <div class="dashboard">
        
        <div class="customer-header">
            <div class="farm-name" id="${elemIdFarmName}"></div>
        </div>
        <div class="today-date" id="${elemIdTodayDate}"></div>


        ${html_install_btn}


        <!-- grid rows: only label + number, centered -->
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
        </div>

        
        <!-- NEW ROW 4.5: Last Feed Balance -->
        <div class="expecting-section" id="${elemIdFeedBalanceShow}">
            <div class="section-title">
                <span>📊</span> <span id="${elemIdLabelFeedBalance}">Last Feed Balance</span>
            </div>
            
            <div id="${elemIdDateFeedBalance}"></div>
            
            <div class="feed-balance-text" id="${elemIdFeedBalanceText}" style="font-size: 1.2rem; color: #4b5563; margin-top: 0.25rem;">
            </div>
        </div>


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
        
        
        <div id="${elemIdDebug}" hidden>
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
    }
    
    
    this._findElements = function(){
        elemDashboard           = elemDivContainer.querySelector('.dashboard');
        
        elemFarmName            = elemDivContainer.querySelector('#'+elemIdFarmName);        
        elemTodayDate           = elemDivContainer.querySelector('#'+elemIdTodayDate);       
        
        
        elemInstallBtn          = elemDivContainer.querySelector('#install-superpig-btn'); 
        
               
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
    
        elemFeedBalanceShow     = elemDivContainer.querySelector('#'+elemIdFeedBalanceShow);
        elemLabelFeedBalance    = elemDivContainer.querySelector('#'+elemIdLabelFeedBalance);
        elemDateFeedBalance     = elemDivContainer.querySelector('#'+elemIdDateFeedBalance);
        elemFeedBalanceText     = elemDivContainer.querySelector('#'+elemIdFeedBalanceText);
    
        elemDebug               = elemDivContainer.querySelector('#'+elemIdDebug);
    
    }
    
    
    this._processAfterHtmlRender = function(){
        
        this.onUserChangeLanguage();
    }
    
    
    this._bindEventListeners = function(){
        
        // Listen for beforeinstallprompt event (Chrome, Edge, Samsung Internet)
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('beforeinstallprompt event fired');
            
            // Prevent Chrome's mini-infobar from appearing
            e.preventDefault();
            
            // Stash the event for later use
            deferredPrompt = e;
            
            // Show install button
            if (elemInstallBtn) {
                elemInstallBtn.hidden = false;
            }
        });

        
        elemInstallBtn.addEventListener('click', async function(){
            if (!deferredPrompt) {
                console.log('No deferred prompt available');
                return;
            }
            
            // Show the native install prompt
            deferredPrompt.prompt();
            
            // Wait for user response
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User install choice: ${outcome}`);
            
            // Reset the deferred prompt variable (can only be used once)
            deferredPrompt = null;
            
            // Hide the install button
            elemInstallBtn.hidden = true;
            
        });

        
        window.addEventListener('appinstalled', () => {
            console.log('SuperPig was successfully installed');
            
            // Hide the install button permanently
            elemInstallBtn.hidden = true;
            
            // Optional: Send analytics event
            // trackEvent('pwa_installed');
        });



        // If already installed, hide button
        if (isAppInstalled()) {
            elemInstallBtn.hidden = true;
        }

        
        
        elemCardLactaPiglets.addEventListener('click', function() {
            navigation.managerNavLinks.onClickNavProdGestaLacta(true, PIG_OPERATION_TYPE.LACTATING_PIGLETS);
            navigation.pageMobLactatingList.clickLactaPigCount();
        });
    
        elemCardFatteningPigs.addEventListener('click', function() {
            navigation.managerNavLinks.onClickNavProdFattening(true);
        });
        
        
        
        elemCardLactaSows.addEventListener('click', function() {
            navigation.managerNavLinks.onClickNavProdGestaLacta(true, PIG_OPERATION_TYPE.LACTATING_PIGLETS);
            navigation.pageMobLactatingList.clickLactaPigOps();
        });
        
        elemCardGestaSows.addEventListener('click', function() {
             navigation.managerNavLinks.onClickNavProdGestaLacta(true, PIG_OPERATION_TYPE.GESTATING);
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
    
    
    // Handle window resize for view switching
    this.handleWindowResize = function() {
        const isMobile = window.innerWidth <= APPLICATION.MAX_WIDTH_WINDOW_IS_MOBILE;
                
    
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
        thisObj.debugNavHistory(TAG);
        
        // Update navigation.curPageNavigated
        navigation.curPageNavigated.pageData = null;
        navigation.curPageNavigated.renderPageFunc = thisObj.renderPage;
        
        // Register service worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service_worker.js')
                    .then(registration => {
                        elemDebug.textContent ='Service Worker registered';
                    })
                    .catch(err => {
                        elemDebug.textContent =`Service Worker registration failed: ${err}`;
                    });
            });
        }
        else{
            elemDebug.textContent = 'serviceWorker not in navigator';
        }
        
        
        // Show/ Hide debug  elemnts
        const user = navigation.userControl.dataUserAccount.user.user;
        
        
        if ((user.flag & FLAG_BITS.USER.IS_SYS_ADMIN) > 0){
            elemDebug.hidden = false;
        } else{
            elemDebug.hidden = true;
        }
        
        
        
        
        // Check if app is already installed (running in standalone mode)
        if (isAppInstalled()) {
            if (elemInstallBtn) {
                elemInstallBtn.hidden = true;
            }
        }
        
        
        
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
        
        
        
        // Populate Expecting sows next MIN_DAYS_SHOW_EXPECTING days
        const expecting_sows = [];
        data_prod_list = navigation.pigFarm.managerPigProd.dataGestatingList;
        
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
        
        
        
        // Populate last Farm Feed Balance
        thisObj.populateLastFeedBalance();
        
        
        // Get user.user_group.group_num

        const cur_user = navigation.userControl.dataUserAccount.user;
        const user_group_num = cur_user.user_group.group_num;
        
        if (user_group_num == ACC_USER_GROUP.ADMIN || 
            user_group_num == ACC_USER_GROUP.MANAGEMENT){
            elemFarmName.onclick = function() {
                // Show Container
                const next_page_id   = PAGE_ID.PIG_FARM_ADD_EDIT;
                const next_page = navigation.getPageContainer(next_page_id);
                
                // Push currentPage to NavHistory; 
                // Will also compare current page and  next_page NAV_MENU_GROUP.
                navigation.pushCurrentPageToNavHistory(next_page);
                
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
        
        
        // Force a reflow to recalculate height
        setTimeout(function() {
            // Force a reflow
            elemDashboard.style.overflow = 'hidden';
            elemDashboard.offsetHeight; // Force reflow
            elemDashboard.style.overflow = 'auto';
            
        }, 100);
        
        
    }
    
    
    this.displayFeedBalance = function(data){
        // Add up feeds;
            
        let date_balance = null;
        
        const feed_balance = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
        for (const cur_entry of data){
            
            for(let index = 0; index < 7; index++){
                feed_balance[index] += cur_entry.feeds[index];
            }
            
            date_balance = cur_entry.date_balance;
        }
        
        let s = '';
        let is_comma = 0;
        
        
        
        let index = 0;
        for (const cur_entry of feed_balance){
            if (cur_entry > 0){
                if (is_comma){s += ', ';}
                
                let feed_type_name = '';
                switch (index){
                    case 0: {feed_type_name = FEED_TYPE_NAME.GESTA; break;}
                    case 1: {feed_type_name = FEED_TYPE_NAME.LACTA; break;}
                    case 2: {feed_type_name = FEED_TYPE_NAME.BOST; break;}
                    case 3: {feed_type_name = FEED_TYPE_NAME.PRES; break;}
                    case 4: {feed_type_name = FEED_TYPE_NAME.START; break;}
                    case 5: {feed_type_name = FEED_TYPE_NAME.GROW; break;}
                    case 6: {feed_type_name = FEED_TYPE_NAME.FINISH; break;}
                    
                }
                
                
                let s_feed = `<span class="nowrap">${cur_entry} ${feed_type_name}</span>`;
                s += s_feed;
                
                
                
                is_comma = 1;
            }
            
            index += 1
        } 
        
        
        elemFeedBalanceText.innerHTML = s;
        
        if (date_balance){
            const dt_balance  = new Date(date_balance);
            const s_dt_balance = formatDate(dt_balance, FORMAT_COMPACT);
            
            let day = dt_balance.getDay();
    
            let label_weekday   = DEFAULT_WEEKDAY[day];
            
            const translations = navigation.getTranslations();
            if (translations){
                if (translations.common.day_of_week){
                    label_weekday = translations.common.day_of_week[day]
                }
            }
            elemDateFeedBalance.textContent = `${s_dt_balance}, ${label_weekday}`;
        }
        
        if (is_comma > 0){
            elemFeedBalanceShow.style.display = 'block';
        } 
        
    }
    

    this.requestFeedBalance = function(){
        const callback_success = function(data){
            thisObj.displayFeedBalance(data);
            
            // Set last version from pigFarm
            // This verison number increments when there is a chnage in farm feed balance
            lastVerNumFeedBalance = navigation.pigFarm.dataVerNum.feed_balance;
            
        };
        
            
        navigation.pigFarm.requestDataPigFarmLastFeedBalance(callback_success);
    }
    
    
    this.populateLastFeedBalance = function(){
        elemFeedBalanceShow.style.display = 'none';
        
        const farmLastBalance = navigation.pigFarm.dataLastFeedBalance;
        
        if (farmLastBalance == null){
            thisObj.requestFeedBalance();
        }
        else{
            const cur_ver_num = navigation.pigFarm.dataVerNum.feed_balance;
            
            if (cur_ver_num != lastVerNumFeedBalance){
                thisObj.requestFeedBalance();
            }
            else{
                thisObj.displayFeedBalance(farmLastBalance);
            }
        }
    }
}
