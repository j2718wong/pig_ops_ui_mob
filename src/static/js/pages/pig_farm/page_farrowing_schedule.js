// April 7, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}         from '../common/page_view_basic.js';
import {calculateNumDaysSinceInsem}  from '../common/page_view_basic.js';


import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE,
        PIG_PROD_TYPE,
        PROD_STATUS}            from '../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}         from '../../utils.js';

import {ComponentNavLeftRight}  from '../common/ui/comp_nav_left_right.js';


import {getSowBoarReference}    from '../common/common_app.js';


export function PageFarrowingSchedule(input_settings){
    PageViewPigFarmPage.call(this);
    
    const TAG                   = 'PageFarrowingSchedule';
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    this.setNavigation(navigation);
    
    
    /*
    Typical input_settings
    {
        navigation:             this,
        uniqueKey:              'farrowing-schedule' 
        pageTitle:              'Farrowing Schedule'
    }   
    */  
    let settings                = input_settings;
    
    
    
    
    // This is needed as this will be first element to be rendered
    let elemDivContainer        = document.getElementById(settings.elemIdDivContainer);
    
    let componentNavLeftRight   = null;
    
    let elemIdPageInfo          = null;
    let elemIdLabelToday        = null;
    let elemIdDateToday         = null;
    
    let elemIdUpdateNumCrates   = null;
    let elemIdShowSample        = null;
    
    let elemIdFarrowingCalendar = null;
 
    
    let elemPageInfo            = null;
    let elemLabelToday          = null;
    let elemDateToday           = null;
    
    let elemUpdateNumCrates     = null;
    let elemShowSample          = null;
    
    let elemFarrowingCalendar   = null;

    
    let dtCurrentDate           = null;

    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this._writeInlineStyle = function(){
        const html = `
        <style>
            .gantt-table {
                border-collapse: collapse;
                font-size: 11px;
                width: 100%;
            }
            
            .gantt-table th,
            .gantt-table td {
                border-right: 1px solid #e0e0e0;
                position: relative;
            }
            
            .gantt-table th:first-child,
            .gantt-table td:first-child {
                border-right: 1px solid #ddd;
                border-left: none;
            }
            
            .gantt-table th.monday-col::after,
            .gantt-table td.monday-col::after {
                content: '';
                position: absolute;
                left: 50%;
                top: 0;
                bottom: 0;
                width: 1px;
                background-color: #999;
                transform: translateX(-50%);
            }
            
            .gantt-table .crate-header {
                position: sticky;
                left: 0;
                background-color: #f5f5f5;
                z-index: 2;
                font-weight: bold;
                width: 60px;
                text-align: center;
            }
            
            .gantt-table .crate-cell {
                position: sticky;
                left: 0;
                background-color: #f5f5f5;
                z-index: 1;
                font-weight: bold;
                vertical-align: middle;
                text-align: center;
                width: 60px;
            }
            
            /* High visibility timeline blocks */
            .timeline-block {
                border-radius: 6px;
                padding: 6px 8px;
                margin: 2px 0;
                font-weight: bold;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }
            
            /* Lactating blocks - Green background */
            .timeline-block.lactating {
                background: #4caf50;
                color: #ffffff;
                text-shadow: 0 1px 1px rgba(0,0,0,0.2);
            }
            
            /* Gestating blocks - Orange background */
            .timeline-block.gestating {
                background: #ff9800;
                color: #ffffff;
                text-shadow: 0 1px 1px rgba(0,0,0,0.2);
            }
            
            /* Sow ID and name - largest */
            .timeline-sow-name {
                font-size: 15px;
                font-weight: bold;
                margin-bottom: 3px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            /* Sub information - Move, Due, Wean dates - target size 13px */
            .timeline-sub {
                font-size: 14px;
                font-weight: normal;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.4;
            }
            
            /* Urgency text */
            .timeline-urgency {
                font-size: 12px;
                font-weight: bold;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            /* Critical alert highlight */
            .timeline-block.critical {
                background: #f44336;
                color: #ffffff;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% { opacity: 0.8; }
                50% { opacity: 1; }
                100% { opacity: 0.8; }
            }
            
            .conflict-summary {
                margin-top: 16px;
                padding: 12px;
                border-radius: 8px;
                font-size: 12px;
            }
            
            .conflict-summary.error {
                background-color: #ffebee;
                border-left: 4px solid #f44336;
            }
            
            .conflict-summary.warning {
                background-color: #fff3e0;
                border-left: 4px solid #ff9800;
            }
            
            .conflict-summary.success {
                background-color: #e8f5e9;
                border-left: 4px solid #4caf50;
            }
            
            .legend {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                margin-top: 16px;
                padding: 8px;
                font-size: 13px;
                background-color: #fafafa;
                border-radius: 8px;
                border-top: 1px solid #eee;
            }
            
            .legend-item {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            
            .legend-color {
                width: 20px;
                height: 20px;
                border-radius: 4px;
                opacity: 0.85;
            }
            
            .legend-color.lactating { background: #4caf50; }
            .legend-color.gestating { background: #ff9800; }
            .legend-line {
                width: 20px;
                height: 2px;
                background: #ccc;
            }
        </style>
        `;
        return html;
    }
    
    
    this.render = function(){
        let label_page_title    = 'Farrowing Schedule';
        let label_today         = 'Today';
        
        let label_update_crates = 'Update Farrowing Crates';
        let label_see_sample    = 'See Sample Schedule';
        
        
        let page_info   = `
            This is a Farrowing scheduler that automatically plots your 
            Lactating and Gestating Sows against the Farrowing crates in your farm. 
            It schedules 115 days in advance starting today. This is to check 
            if your Farrowing crates are enough for the lactating and pregnant sows.
        `;
        
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_page_title    = helper.getSimpleTranslation('navigation.nav_links.Operations2') || label_page_title;
        label_today         = helper.getSimpleTranslation('common_app.labels.today') || label_today;
        
        label_update_crates = helper.getSimpleTranslation('page_farrowing_schedule.labels.update_crates') || label_update_crates;
        label_see_sample    = helper.getSimpleTranslation('page_farrowing_schedule.labels.see_sample') || label_see_sample;
        
        page_info           = helper.getSimpleTranslation('page_info.farrowing_sched') || page_info;
        
        
        componentNavLeftRight   = new ComponentNavLeftRight({
           uniqueKey:           settings.uniqueKey,
           elemDivContainer:    elemDivContainer,
           pageTitle:           label_page_title
        });
        
        
        elemIdPageInfo          = `${settings.uniqueKey}-page-info`;
        
        elemIdLabelToday        = `${settings.uniqueKey}-label-today`;
        elemIdDateToday         = `${settings.uniqueKey}-date-today`;
        
        elemIdUpdateNumCrates   = `${settings.uniqueKey}-update-crates`;
        elemIdShowSample        = `${settings.uniqueKey}-show-sample`;
        
        elemIdFarrowingCalendar = `${settings.uniqueKey}-farrowing-calendar`;
        
        
        const html_style        = thisObj._writeInlineStyle();
        
        const html_nav          = componentNavLeftRight.getHtml();   
 
           
        const html = `

${html_style}

<div class="mobile-container">
    ${html_nav}
    
    <div class="mobile-info-box" id="${elemIdPageInfo}">
        ${page_info}
    </div>
    
    <div style="text-align: center;">
        <span id="${elemIdLabelToday}">${label_today}</span>
        <span id="${elemIdDateToday}" style="color:blue; font-weight:600;"></span>
    </div>

    <div style="margin: 8px 0;">
        <a href="javascript:void(0)" class="text-link" id="${elemIdUpdateNumCrates}">
            ${label_update_crates}
        </a>
        
        <a href="javascript:void(0)" class="text-link" id="${elemIdShowSample}">
            ${label_see_sample}
        </a>
    </div>
    
    <div id="${elemIdFarrowingCalendar}"></div>

</div>
        `;
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        componentNavLeftRight.afterHtmlRender();
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemPageInfo            = elemDivContainer.querySelector('#'+elemIdPageInfo);
        
        elemLabelToday          = elemDivContainer.querySelector('#'+elemIdLabelToday);
        elemDateToday           = elemDivContainer.querySelector('#'+elemIdDateToday);
        
        elemUpdateNumCrates     = elemDivContainer.querySelector('#'+elemIdUpdateNumCrates);
        elemShowSample          = elemDivContainer.querySelector('#'+elemIdShowSample);
        
        elemFarrowingCalendar   = elemDivContainer.querySelector('#'+elemIdFarrowingCalendar);
    }
    
    
    this._processAfterHtmlRender = function(){
        
        componentNavLeftRight.callbackNavLeft = function(){
            navigation.managerNavLinks.onClickNavFeedBalance();
        };
        
          
        componentNavLeftRight.callbackNavRight = function(){
            navigation.managerNavLinks.onClickNavBoarExternalMate();
        };
        
        
        componentNavLeftRight.bindEventListeners();
        

    }
    
    
    this._bindEventListeners = function(){
        elemUpdateNumCrates.addEventListener('click', function() {
            const next_page_id   = PAGE_ID.PIG_FARM_ADD_EDIT;
            const next_page = navigation.getPageContainer(next_page_id);
            
            navigation.pushCurrentPageToNavHistory(next_page);
            
            navigation.showThisPage(next_page);
            
            const go_back_page_id   = PAGE_ID.FARROWING_SCHEDULE;
            const go_back_page = navigation.getPageContainer(go_back_page_id);
            
        
            const options = {
                is_add:                 false,
                go_back_page:           go_back_page,
                nav_page_obj:           thisObj 
            };
            
            
            navigation.pagePigFarmAddEdit.show(options);
        });


        elemShowSample.addEventListener('click', function() {
            thisObj.onClickShowSample({
                title:      'Sample Farrowing Schedule',
                img_src:    '/static_m/images/mar/mar_farrowing.png',
                img_alt:    'Sample Farrowing Schedule'
            });
        });
       
    }
    
    
    this.renderPage = function(page_data){
        thisObj.show();
    }
    
    
    
    this.show = function(){
        thisObj.debugNavHistory(TAG);
        
        navigation.curPageNavigated.pageData = null;
        navigation.curPageNavigated.renderPageFunc = thisObj.renderPage;
        
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        const s_dt_current = formatDate(dtCurrentDate, FORMAT_COMPACT);
        
        elemDateToday.textContent = s_dt_current;

        thisObj.renderFarrowingCalendar();
    }
    
    
    this.showSeeSampleLink = function(total_prod, num_crates){
        // This will controls the visibility of the  See Sample Link;
        // 1.) This is provided so people can check what this page look like
        //    if there is a valid data. 
        //
        // 2.) If there are zero crates, 
        //      hide elemUpdateNumCrates (because there is also a button to update crates)
        //      show elemShowSample     
        //
        // 3.) If num_crates > 0 and total_prod = 0
        //      hide elemUpdateNumCrates
        //      show elemShowSample 
        //
        // 4.) If num_crates > 0 and total_prod > 0
        //      show elemUpdateNumCrates
        //      hide elemShowSample
        
        if (num_crates == 0){
            elemUpdateNumCrates.style.display = 'none';
            elemShowSample.style.display = 'block';
            return;
        }
        
        if (total_prod == 0){
            elemUpdateNumCrates.style.display = 'none';
            elemShowSample.style.display = 'block';
            return;
        }
        
        elemUpdateNumCrates.style.display = 'block';
        elemShowSample.style.display = 'none';
        
    }
    
    
    this.renderFarrowingCalendar = function(){
        const accSettingsOps    = navigation.pigFarm.getSettingsOperations();
        const dataLactatingList = navigation.pigFarm.managerPigProd.dataLactatingList;
        const dataGestatingList = navigation.pigFarm.managerPigProd.dataGestatingList;
        
        console.log(`dataGestatingList`);
        console.log(dataGestatingList);
        
        
        
        const dataPigFarm = navigation.pigFarm.dataPigFarm;
        
        let num_farrowing_crates = dataPigFarm.pig_farm.num_farrow_crates;
        
        let num_days_allow_early_wean = 35;
        
        
        // Show info box if needed
        let total_prod = 0;
        if (dataLactatingList){total_prod += dataLactatingList.length;}
        if (dataGestatingList){total_prod += dataGestatingList.length;}
        
        if (total_prod == 0){
            elemPageInfo.style.display = 'block';
        }
        else{
            elemPageInfo.style.display = 'none';
        }
        
        
        // Show SeeSampleLink if needed
        thisObj.showSeeSampleLink(total_prod, num_farrowing_crates);
        
        
        // Check conditions
        const hasCrates = num_farrowing_crates > 0;
        const hasProductionData = (dataLactatingList && dataLactatingList.length > 0) || 
                                  (dataGestatingList && dataGestatingList.length > 0);
            
        
        const container = elemFarrowingCalendar;
        container.innerHTML = '';
        
        // Case 1: No farrowing crates
        if (!hasCrates) {
            const emptyDiv = document.createElement('div');
            emptyDiv.style.padding          = '40px 20px';
            emptyDiv.style.textAlign        = 'center';
            emptyDiv.style.backgroundColor  = '#fff3e0';
            emptyDiv.style.borderRadius     = '12px';
            emptyDiv.style.margin           = '20px 0';
            
            emptyDiv.innerHTML = `
                <div style="font-size: 48px; margin-bottom: 16px;">🏠</div>
                <div style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">No Farrowing Crates</div>
                <div style="font-size: 14px; color: #666; margin-bottom: 16px;">Please add farrowing crates in Farm Settings</div>
                <button id="goto-crate-settings" style="background: #2196F3; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; cursor: pointer;">
                    Go to Farm Settings
                </button>
            `;
            
            container.appendChild(emptyDiv);
            
            const settingsBtn = emptyDiv.querySelector('#goto-crate-settings');
            if (settingsBtn) {
                settingsBtn.onclick = function(){
                    const next_page_id = PAGE_ID.PIG_FARM_ADD_EDIT;
                    const next_page = navigation.getPageContainer(next_page_id);
                    navigation.pushCurrentPageToNavHistory(next_page);
                    navigation.showThisPage(next_page);
                    
                    
                    const go_back_page_id = PAGE_ID.FARROWING_SCHEDULE;
                    const go_back_page = navigation.getPageContainer(go_back_page_id);
                    const options = {
                        is_add:                 false,
                        go_back_page:           go_back_page,
                        nav_page_obj:           thisObj 
                    }
                    navigation.pagePigFarmAddEdit.show(options);
                };
            }
            return;
        }
        
        // Case 2: No production data
        if (!hasProductionData) {
            const emptyDiv = document.createElement('div');
            emptyDiv.style.padding          = '40px 20px';
            emptyDiv.style.textAlign        = 'center';
            emptyDiv.style.backgroundColor  = '#e3f2fd';
            emptyDiv.style.borderRadius     = '12px';
            emptyDiv.style.margin           = '20px 0';
            
            emptyDiv.innerHTML = `
                <div style="font-size: 48px; margin-bottom: 16px;">🐷</div>
                <div style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">No Production Data</div>
                <div style="font-size: 14px; color: #666;">Add gestating entry to see the farrowing schedule</div>
            `;
            
            container.appendChild(emptyDiv);
            return;
        }
            
        
        // Normal Case
        
        const startDate = new Date(dtCurrentDate);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 125);
        
        const weeklyDates = thisObj.getWeeklyMondays(startDate, endDate);
        
        const crateOccupancy = thisObj.buildCrateOccupancy(
            dataLactatingList, 
            dataGestatingList, 
            accSettingsOps, 
            num_farrowing_crates
        );
        
        const conflicts = thisObj.detectCrateConflicts(crateOccupancy, 
                num_farrowing_crates);
        
        const earlyWeanOptions = thisObj.findEarlyWeanOpportunities(
            crateOccupancy, num_days_allow_early_wean);
        
        thisObj.renderCrateGanttChart(weeklyDates, crateOccupancy, conflicts, 
            earlyWeanOptions);
    }
    
    
    this.getWeeklyMondays = function(startDate, endDate) {
        const mondays = [];
        
        
        // Normalize dates to UTC midnight to avoid timezone issues
        const start = new Date(Date.UTC(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()
        ));
        
        const end = new Date(Date.UTC(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate()
        ));
        
        // Find first Monday on or after start
        const current = new Date(start);
        while (current.getUTCDay() !== 1) {
            current.setUTCDate(current.getUTCDate() + 1);
        }
        
        // Keep adding weeks until we exceed end
        while (current <= end) {
            const monday = new Date(current);
            mondays.push(monday);
            current.setUTCDate(current.getUTCDate() + 7);
        }
        
        
        return mondays;
    }
    
    
    this.buildCrateOccupancy = function(lactatingList, gestatingList, 
        accSettingsOps, numCrates) {

        const day1Adjustment = accSettingsOps.day_1_on_date_of_birth === 1 ? 1 : 0;
        const today = new Date(dtCurrentDate);
        today.setHours(0, 0, 0, 0);
        
        const events = [];
        
        // Lactating sows (already in crates)
        for (const sow of lactatingList) {
            if (!sow.birth || !sow.birth.date_actual) continue;
            
            const birthDate = new Date(sow.birth.date_actual);
            const moveOutDate = new Date(birthDate);
            moveOutDate.setDate(moveOutDate.getDate() + 
                    accSettingsOps.num_days_wean - day1Adjustment);
            
            if (moveOutDate >= today) {
                events.push({
                    type: 'lactating',
                    pid: sow.pig_production.farm_prod_id,
                    sowName: sow.sow.name,
                    startDate: new Date(today),
                    endDate: moveOutDate,
                    expectedBirth: birthDate,
                    isExisting: true
                });
            }
        }
        
        // Gestating sows (need crates)
        for (const sow of gestatingList) {
            if (!sow.birth || !sow.birth.date_expected) continue;
            
            const expectedBirth = new Date(sow.birth.date_expected);
            const moveInDate = new Date(expectedBirth);
            moveInDate.setDate(moveInDate.getDate() - 
                    accSettingsOps.num_days_move_to_farrow);
            
            const moveOutDate = new Date(expectedBirth);
            moveOutDate.setDate(moveOutDate.getDate() + 
                    accSettingsOps.num_days_wean - day1Adjustment);
            
            if (moveOutDate >= today) {
                events.push({
                    type: 'gestating',
                    pid: sow.pig_production.farm_prod_id,
                    sowName: sow.sow.name,
                    startDate: moveInDate,
                    endDate: moveOutDate,
                    expectedBirth: expectedBirth,
                    originalStartDate: new Date(moveInDate),
                    isExisting: false,
                    isAdjusted: false,
                    adjustedStartDate: null
                });
            }
        }
        
        // Sort by start date
        events.sort((a, b) => a.startDate - b.startDate);
        
        // Initialize crates
        const crates = [];
        for (let i = 0; i < numCrates; i++) {
            crates.push({
                crateNumber: i + 1,
                assignments: []
            });
        }
        
        // Assign events to crates
        for (const event of events) {
            let assigned = false;
            
            for (const crate of crates) {
                let hasConflict = false;
                let conflictingAssignment = null;
                
                // Check for overlap
                for (const assignment of crate.assignments) {
                    if (event.startDate <= assignment.endDate && 
                        event.endDate >= assignment.startDate) {
                        hasConflict = true;
                        conflictingAssignment = assignment;
                        break;
                    }
                }
                
                // Try to resolve conflict by adjusting move-in date
                if (hasConflict && !event.isExisting && conflictingAssignment) {
                    // Adjust move-in date to start after the conflicting assignment ends
                    const adjustedStartDate = new Date(conflictingAssignment.endDate);
                    adjustedStartDate.setDate(adjustedStartDate.getDate() + 1);
                    
                    // Make sure the adjusted start is before expected birth
                    if (adjustedStartDate < event.expectedBirth) {
                        event.startDate = adjustedStartDate;
                        event.isAdjusted = true;
                        event.adjustedStartDate = adjustedStartDate;
                        event.adjustmentReason = `Move: ${thisObj.formatDateShort(adjustedStartDate)} (was ${thisObj.formatDateShort(event.originalStartDate)})`;
                        hasConflict = false; // Resolved
                    }
                }
                
                if (!hasConflict) {
                    crate.assignments.push({
                        ...event,
                        assignedCrate: crate.crateNumber
                    });
                    assigned = true;
                    break;
                }
            }
            
            if (!assigned) {
                event.noCrateAvailable = true;
                if (crates[0]) {
                    crates[0].assignments.push({
                        ...event,
                        assignedCrate: 1,
                        isConflict: true
                    });
                }
            }
        }
        
        // Sort assignments within each crate by start date
        for (const crate of crates) {
            crate.assignments.sort((a, b) => a.startDate - b.startDate);
            
            // Detect overlaps
            for (let i = 0; i < crate.assignments.length - 1; i++) {
                const current = crate.assignments[i];
                const next = crate.assignments[i + 1];
                
                if (current.endDate >= next.startDate) {
                    current.hasOverlap = true;
                    next.hasOverlap = true;
                    next.overlapWith = current.sowName;
                }
            }
        }
        
        return crates;
    }

    
    this.detectCrateConflicts = function(crateOccupancy, numCrates) {
        const conflicts = [];
        
        for (const crate of crateOccupancy) {
            for (const assignment of crate.assignments) {
                if (assignment.noCrateAvailable) {
                    conflicts.push({
                        type: 'no_crate',
                        pid: assignment.pid,
                        sowName: assignment.sowName,
                        startDate: assignment.startDate,
                        message: `Gesta Sow ${assignment.pid} (${assignment.sowName}) has no crate available starting ${thisObj.formatDateShort(assignment.startDate)}`
                    });
                }
            }
        }
        
        return conflicts;
    }
    
    
    this.findEarlyWeanOpportunities = function(crateOccupancy, earlyWeanDays) {
        const opportunities = [];
        const today = new Date(dtCurrentDate);
        today.setHours(0, 0, 0, 0);
        
        for (const crate of crateOccupancy) {
            for (const assignment of crate.assignments) {
                if (assignment.type === 'lactating') {
                    const daysRemaining = Math.ceil((assignment.endDate - today) / (1000 * 60 * 60 * 24));
                    
                    if (daysRemaining <= earlyWeanDays && daysRemaining > 0) {
                        opportunities.push({
                            crateNumber: crate.crateNumber,
                            pid: assignment.pid,
                            sowName: assignment.sowName,
                            currentEndDate: assignment.endDate,
                            daysSaved: daysRemaining,
                            message: `Lacta Sow ${assignment.pid} (${assignment.sowName}) in Crate ${crate.crateNumber} can be early weaned to free a crate`
                        });
                    }
                }
            }
        }
        
        return opportunities;
    }
    
    
    this.renderCrateGanttChart = function(weeklyDates, crateOccupancy, conflicts, earlyWeanOptions) {
        const container = elemFarrowingCalendar;
        container.innerHTML = '';
        
        if (!weeklyDates || weeklyDates.length === 0) {
            container.innerHTML = '<div style="padding: 20px; text-align: center;">No data available</div>';
            return;
        }
        
        const startDate = weeklyDates[0];
        const endDate = new Date(weeklyDates[weeklyDates.length - 1]);
        endDate.setDate(endDate.getDate() + 6);
        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const pixelsPerDay = 4;
        
        const scrollDiv = document.createElement('div');
        scrollDiv.style.overflowX = 'auto';
        scrollDiv.style.overflowY = 'auto';
        scrollDiv.style.maxHeight = '70vh';
        scrollDiv.style.WebkitOverflowScrolling = 'touch';
        scrollDiv.style.position = 'relative';
        
        // Header
        const headerContainer = document.createElement('div');
        headerContainer.style.position = 'sticky';
        headerContainer.style.top = '0';
        headerContainer.style.backgroundColor = 'white';
        headerContainer.style.zIndex = '3';
        headerContainer.style.borderBottom = '1px solid #ddd';
        
        const headerDiv = document.createElement('div');
        headerDiv.style.display = 'flex';
        headerDiv.style.minWidth = `${totalDays * pixelsPerDay + 60}px`;
        
        // Crate label header
        const labelHeader = document.createElement('div');
        labelHeader.textContent = 'Crate';
        labelHeader.style.width = '60px';
        labelHeader.style.padding = '8px 0';
        labelHeader.style.fontWeight = 'bold';
        labelHeader.style.textAlign = 'center';
        labelHeader.style.position = 'sticky';
        labelHeader.style.left = '0';
        labelHeader.style.backgroundColor = 'white';
        labelHeader.style.zIndex = '2';
        headerDiv.appendChild(labelHeader);
        
        // Date markers
        for (let i = 0; i < weeklyDates.length; i++) {
            const date = weeklyDates[i];
            const nextDate = i + 1 < weeklyDates.length ? weeklyDates[i + 1] : endDate;
            const daysToNext = Math.ceil((nextDate - date) / (1000 * 60 * 60 * 24));
            const width = daysToNext * pixelsPerDay;
            
            const dateDiv = document.createElement('div');
            dateDiv.textContent = thisObj.formatShortDate(date);
            dateDiv.style.width = `${width}px`;
            dateDiv.style.textAlign = 'center';
            dateDiv.style.fontSize = '11px';
            dateDiv.style.padding = '8px 0';
            dateDiv.style.borderRight = '1px solid #ccc';
            dateDiv.style.fontWeight = 'bold';
            headerDiv.appendChild(dateDiv);
        }
        headerContainer.appendChild(headerDiv);
        scrollDiv.appendChild(headerContainer);
        
        // Body
        const bodyContainer = document.createElement('div');
        
        for (const crate of crateOccupancy) {
            const crateRow = document.createElement('div');
            crateRow.style.display = 'flex';
            crateRow.style.minWidth = `${totalDays * pixelsPerDay + 60}px`;
            crateRow.style.borderBottom = '1px solid #eee';
            crateRow.style.position = 'relative';
            
            // Crate number
            const crateLabel = document.createElement('div');
            crateLabel.textContent = `${crate.crateNumber}`;
            crateLabel.style.width = '60px';
            crateLabel.style.padding = '8px 0';
            crateLabel.style.fontWeight = 'bold';
            crateLabel.style.textAlign = 'center';
            crateLabel.style.fontSize = '16px';
            crateLabel.style.position = 'sticky';
            crateLabel.style.left = '0';
            crateLabel.style.backgroundColor = '#fafafa';
            crateLabel.style.zIndex = '1';
            crateLabel.style.borderRight = '1px solid #ddd';
            crateRow.appendChild(crateLabel);
            
            // Timeline track
            const timelineTrack = document.createElement('div');
            timelineTrack.style.flex = '1';
            timelineTrack.style.position = 'relative';
            timelineTrack.style.height = 'auto';
            timelineTrack.style.minHeight = '85px';
            timelineTrack.style.backgroundColor = '#f9f9f9';
            
            // Grid lines
            let currentX = 0;
            for (let i = 0; i < weeklyDates.length; i++) {
                const date = weeklyDates[i];
                const nextDate = i + 1 < weeklyDates.length ? weeklyDates[i + 1] : endDate;
                const daysToNext = Math.ceil((nextDate - date) / (1000 * 60 * 60 * 24));
                const width = daysToNext * pixelsPerDay;
                
                const gridLine = document.createElement('div');
                gridLine.style.position = 'absolute';
                gridLine.style.left = `${currentX}px`;
                gridLine.style.top = '0';
                gridLine.style.bottom = '0';
                gridLine.style.width = '1px';
                gridLine.style.backgroundColor = '#ccc';
                timelineTrack.appendChild(gridLine);
                
                currentX += width;
            }
            
            // Assignment blocks
            for (const assignment of crate.assignments) {
                const startDateToUse = assignment.startDate;
                const endDateToUse = assignment.endDate;
                
                const blockStartX = thisObj.getXPosition(startDateToUse, startDate, pixelsPerDay);
                const blockEndX = thisObj.getXPosition(endDateToUse, startDate, pixelsPerDay);
                const blockWidth = blockEndX - blockStartX;
                
                if (blockWidth > 2) {
                    const block = document.createElement('div');
                    block.style.position = 'absolute';
                    block.style.left = `${blockStartX}px`;
                    block.style.top = '4px';
                    block.style.width = `${blockWidth}px`;
                    block.style.height = 'auto';
                    block.style.minHeight = '76px';
                    block.style.borderRadius = '6px';
                    block.style.padding = '4px 3px';
                    block.style.overflow = 'hidden';
                    block.style.boxSizing = 'border-box';
                    block.style.cursor = 'pointer';
                    
                    // Determine block color based on status
                    if (assignment.isConflict || assignment.noCrateAvailable || assignment.hasOverlap) {
                        // Red - Conflict
                        block.style.backgroundColor = '#f44336';
                        block.style.color = '#ffffff';
                        block.style.border = '2px solid #b71c1c';
                        block.style.animation = 'pulse 2s infinite';
                    } 
                    else if (assignment.isAdjusted) {
                        // Orange striped - Early wean required
                        block.style.backgroundColor = '#ff9800';
                        block.style.color = '#ffffff';
                        block.style.border = '2px solid #e65100';
                        block.style.backgroundImage = 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px)';
                    } 
                    else if (assignment.type === 'lactating') {
                        // Green - Lactating (in crate)
                        block.style.backgroundColor = '#4caf50';
                        block.style.color = '#ffffff';
                    } 
                    else {
                        // Blue - Normal gestating
                        block.style.backgroundColor = '#2196F3';
                        block.style.color = '#ffffff';
                    }
                    
                    const today = new Date(dtCurrentDate);
                    today.setHours(0, 0, 0, 0);
                    
                    let contentHtml = '';
                    
                    // Build content based on type and status
                    if (assignment.isConflict || assignment.noCrateAvailable || assignment.hasOverlap) {
                        let overlapMessage = '';
                        if (assignment.overlapWith) {
                            overlapMessage = `⚠️ Conflicts with ${assignment.overlapWith}`;
                        } else if (assignment.noCrateAvailable) {
                            overlapMessage = '⚠️ NO CRATE AVAILABLE';
                        } else {
                            overlapMessage = '⚠️ CRATE CONFLICT';
                        }
                        contentHtml = `
                            <div class="timeline-sow-name" style="font-size: 11px;">${overlapMessage}</div>
                            <div class="timeline-sow-name" style="font-size: 12px;">🐖 ${assignment.pid} ${assignment.sowName}</div>
                        `;
                    }
                    else if (assignment.isAdjusted && assignment.adjustmentReason) {
                        contentHtml = `
                            <div class="timeline-sow-name">🐖 ${assignment.pid} ${assignment.sowName}</div>
                            <div class="timeline-sub">
                                ${assignment.adjustmentReason}
                            </div>
                            <div class="timeline-sub">
                                Due: ${thisObj.formatDateShort(assignment.expectedBirth)}
                            </div>
                        `;
                    }
                    else if (assignment.type === 'lactating') {
                        const weanDate = endDateToUse;
                        const daysRemaining = Math.ceil((weanDate - today) / (1000 * 60 * 60 * 24));
                        
                        let urgencyIcon = '🍼';
                        let urgencyText = '';
                        if (daysRemaining <= 3) {
                            urgencyIcon = '🚨';
                            urgencyText = 'URGENT!';
                        } else if (daysRemaining <= 7) {
                            urgencyIcon = '⚠️';
                            urgencyText = 'Soon';
                        }
                        
                        contentHtml = `
                            <div class="timeline-sow-name">🐖 ${assignment.pid} ${assignment.sowName}</div>
                            <div class="timeline-sub">${urgencyIcon} Wean: ${thisObj.formatDateShort(weanDate)} | ${daysRemaining} days left</div>
                            ${urgencyText ? `<div class="timeline-urgency">${urgencyText}</div>` : ''}
                        `;
                    } 
                    else {
                        const moveInDate = startDateToUse;
                        const moveOutDate = endDateToUse;
                        const expectedBirth = assignment.expectedBirth;
                        const durationDays = Math.ceil((moveOutDate - moveInDate) / (1000 * 60 * 60 * 24));
                        
                        let daysToMoveIn = Math.ceil((moveInDate - today) / (1000 * 60 * 60 * 24));
                        let moveIcon = '📦';
                        if (daysToMoveIn <= 3 && daysToMoveIn > 0) {
                            moveIcon = '🚨';
                        } else if (daysToMoveIn <= 7 && daysToMoveIn > 0) {
                            moveIcon = '⚠️';
                        }
                        
                        // Show original move in date if adjusted
                        if (assignment.originalStartDate && assignment.isAdjusted) {
                            const originalMoveIn = assignment.originalStartDate;
                            contentHtml = `
                                <div class="timeline-sow-name">🐖 ${assignment.pid} ${assignment.sowName}</div>
                                <div class="timeline-sub">Move: ${thisObj.formatDateShort(moveInDate)} (was ${thisObj.formatDateShort(originalMoveIn)})</div>
                                <div class="timeline-sub">Out: ${thisObj.formatDateShort(moveOutDate)} | Due: ${thisObj.formatDateShort(expectedBirth)}</div>
                            `;
                        } else {
                            contentHtml = `
                                <div class="timeline-sow-name">🐖 ${assignment.pid} ${assignment.sowName}</div>
                                <div class="timeline-sub">Move: ${thisObj.formatDateShort(moveInDate)} | Out: ${thisObj.formatDateShort(moveOutDate)}</div>
                                <div class="timeline-sub">Due: ${thisObj.formatDateShort(expectedBirth)} | Stay: ${durationDays} days</div>
                            `;
                        }
                    }
                    
                    block.innerHTML = contentHtml;
                    
                    // Set title for hover tooltip
                    if (assignment.isAdjusted) {
                        block.title = `${assignment.pid} ${assignment.sowName}\nMove in: ${thisObj.formatDateShort(assignment.startDate)} (adjusted)\nOriginal move in: ${thisObj.formatDateShort(assignment.originalStartDate)}\nDue: ${thisObj.formatDateShort(assignment.expectedBirth)}\n⚠️ Previous sow needs early wean`;
                    } else if (assignment.type === 'lactating') {
                        block.title = `${assignment.pid} ${assignment.sowName}\nWeans: ${thisObj.formatDateShort(endDateToUse)}`;
                    } else {
                        block.title = `${assignment.pid} ${assignment.sowName}\nMove in: ${thisObj.formatDateShort(startDateToUse)}\nMove out: ${thisObj.formatDateShort(endDateToUse)}\nDue: ${thisObj.formatDateShort(assignment.expectedBirth)}`;
                    }
                    
                    if (assignment.isConflict || assignment.noCrateAvailable || assignment.hasOverlap) {
                        block.title += '\n⚠️ CRATE CONFLICT - Needs attention';
                    }
                    
                    // Add click handler to show more details
                    block.onclick = function() {
                        thisObj.showAssignmentDetails(assignment);
                    };
                    
                    timelineTrack.appendChild(block);
                }
            }
            
            crateRow.appendChild(timelineTrack);
            bodyContainer.appendChild(crateRow);
        }
        
        scrollDiv.appendChild(bodyContainer);
        container.appendChild(scrollDiv);
        
        this.renderLegend(container);
        this.renderConflictsSummary(container, conflicts, earlyWeanOptions);
    }
    
    
    this.showAssignmentDetails = function(assignment) {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.right = '0';
        modal.style.bottom = '0';
        modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
        modal.style.zIndex = '10000';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        
        let statusColor = '#4caf50';
        let statusText = 'Normal';
        let recommendations = '';
        
        if (assignment.noCrateAvailable || assignment.isOverlap) {
            statusColor = '#f44336';
            statusText = '⚠️ CRITICAL - No Crate Available';
            recommendations = `
                <div style="margin-top: 12px; padding: 10px; background: #ffebee; border-radius: 8px;">
                    <strong>Recommendations:</strong><br>
                    • Consider early weaning of conflicting sow<br>
                    • Add more farrowing crates<br>
                    • Check if any sow can be moved to another crate
                </div>
            `;
        } else if (assignment.isAdjusted) {
            statusColor = '#ff9800';
            statusText = '⚠️ Adjusted - Early Wean Recommended';
            recommendations = `
                <div style="margin-top: 12px; padding: 10px; background: #fff3e0; border-radius: 8px;">
                    <strong>Recommendation:</strong><br>
                    • Early wean to ${thisObj.formatDateShort(assignment.assignedEndDate)} to avoid conflict
                </div>
            `;
        }
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 12px; max-width: 400px; width: 90%; padding: 20px;">
                <h3 style="margin: 0 0 8px 0; color: ${statusColor};">${statusText}</h3>
                <div style="border-bottom: 1px solid #eee; margin-bottom: 12px;"></div>
                <div style="margin-bottom: 12px;">
                    <strong>Sow:</strong> ${assignment.pid} - ${assignment.sowName || 'Unknown'}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Crate:</strong> ${assignment.assignedCrate || 'Not assigned'}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Expected Birth:</strong> ${thisObj.formatDateShort(assignment.expectedBirth)}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Move In:</strong> ${thisObj.formatDateShort(assignment.assignedStartDate || assignment.startDate)}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Wean Date:</strong> ${thisObj.formatDateShort(assignment.assignedEndDate || assignment.endDate)}
                </div>
                ${recommendations}
                <button id="closeModal" style="margin-top: 16px; width: 100%; padding: 10px; background: #2196F3; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;">
                    Close
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeBtn = modal.querySelector('#closeModal');
        closeBtn.onclick = function() {
            modal.remove();
        };
        
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        };
    }

    
    this.getXPosition = function(date, startDate, pixelsPerDay) {
        const diffDays = Math.ceil((date - startDate) / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays * pixelsPerDay);
    }
    
    
    this.renderLegend = function(container) {
        const legendDiv = document.createElement('div');
        legendDiv.className = 'legend';
        
        legendDiv.innerHTML = `
            <div class="legend-item">
                <div class="legend-color" style="background: #4caf50;"></div>
                <span>Lactating (in crate)</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #2196F3;"></div>
                <span>Gestating (normal)</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #ff9800; background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px);"></div>
                <span>Gestating (adjusted / early wean needed)</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #f44336;"></div>
                <span>Crate conflict / overlap</span>
            </div>
            <div class="legend-item">
                <div class="legend-line"></div>
                <span>Monday boundary</span>
            </div>
        `;
        
        container.appendChild(legendDiv);
    }
    
    
    this.renderConflictsSummary = function(container, conflicts, earlyWeanOptions) {
        if (conflicts.length === 0 && earlyWeanOptions.length === 0) {
            const okDiv = document.createElement('div');
            okDiv.className = 'conflict-summary success';
            okDiv.innerHTML = '✅ All sows can be accommodated with current crates';
            container.appendChild(okDiv);
            return;
        }
        
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'conflict-summary error';
        
        let html = '<div style="font-weight: bold; margin-bottom: 8px;">⚠️ CRATE CONFLICTS</div>';
        
        for (const conflict of conflicts) {
            html += `<div style="margin-bottom: 8px; font-size: 12px;">• ${conflict.message}</div>`;
        }
        
        if (earlyWeanOptions.length > 0) {
            html += '<div style="font-weight: bold; margin-top: 12px; margin-bottom: 8px;">💡 EARLY WEAN OPTIONS</div>';
            for (const option of earlyWeanOptions) {
                html += `<div style="margin-bottom: 8px; font-size: 12px;">• ${option.message}</div>`;
            }
        }
        
        summaryDiv.innerHTML = html;
        container.appendChild(summaryDiv);
    }
    
    
    this.formatShortDate = function(date) {
        if (!date) return '';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}`;
    }
    
    
    this.formatDateShort = function(date) {
        if (!date) return '';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}`;
    }
    
    
    this.findWeekIndex = function(weeklyDates, targetDate) {
        for (let i = 0; i < weeklyDates.length; i++) {
            const weekStart = weeklyDates[i];
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            
            if (targetDate >= weekStart && targetDate <= weekEnd) {
                return i;
            }
        }
        return weeklyDates.length - 1;
    }

}
