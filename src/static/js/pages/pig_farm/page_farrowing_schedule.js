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
        FORMAT_COMPACT,
        sortList}               from '../../utils.js';

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
    
    let elemIdFarrowingCalendar = null;
 
    
    let elemPageInfo            = null;
    let elemLabelToday          = null;
    let elemDateToday           = null;
    
    let elemUpdateNumCrates     = null;
    
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
                width: 100px;
            }
            
            .gantt-table .crate-cell {
                position: sticky;
                left: 0;
                background-color: #f5f5f5;
                z-index: 1;
                font-weight: bold;
                vertical-align: top;
            }
            
            /* High visibility timeline blocks */
            .timeline-block {
                border-radius: 6px;
                padding: 6px 8px;
                margin: 2px 0;
                font-size: 12px;
                font-weight: bold;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }
            
            /* Lactating blocks - Green background with dark text */
            .timeline-block.lactating {
                background: #4caf50;
                color: #ffffff;
                text-shadow: 0 1px 1px rgba(0,0,0,0.2);
            }
            
            .timeline-block.lactating .timeline-sub {
                color: #ffffff;
                opacity: 0.9;
            }
            
            /* Gestating blocks - Orange background with dark text */
            .timeline-block.gestating {
                background: #ff9800;
                color: #ffffff;
                text-shadow: 0 1px 1px rgba(0,0,0,0.2);
            }
            
            .timeline-block.gestating .timeline-sub {
                color: #ffffff;
                opacity: 0.9;
            }
            
            /* Sow ID and name - large and bold */
            .timeline-sow-name {
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 4px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            /* Sub information - smaller but still readable */
            .timeline-sub {
                font-size: 10px;
                font-weight: normal;
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
                font-size: 11px;
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
            
            /* Mobile optimization */
            @media (max-width: 768px) {
                .timeline-block {
                    padding: 4px 6px;
                }
                
                .timeline-sow-name {
                    font-size: 12px;
                }
                
                .timeline-sub {
                    font-size: 9px;
                }
            }
        </style>
        `;
        return html;
    }
    
    
    this.render = function(){
        let label_page_title    = 'Farrowing Schedule';
        
        let label_today         = 'Today';
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_page_title        = helper.getSimpleTranslation('navigation.nav_links.Operations2') || label_page_title;
        label_today             = helper.getSimpleTranslation('common_app.labels.today') || label_today;
        
        
        componentNavLeftRight   = new ComponentNavLeftRight({
           uniqueKey:           settings.uniqueKey,
           elemDivContainer:    elemDivContainer,
           pageTitle:           label_page_title
        });
        
        
        elemIdPageInfo          = `${settings.uniqueKey}-page-info`;
        
        elemIdLabelToday        = `${settings.uniqueKey}-label-today`;
        elemIdDateToday         = `${settings.uniqueKey}-date-today`;
        
        elemIdUpdateNumCrates   = `${settings.uniqueKey}-update-crates`;
        
        elemIdFarrowingCalendar = `${settings.uniqueKey}-farrowing-calendar`;
        
        
        const html_style        = thisObj._writeInlineStyle();
        
        const html_nav          = componentNavLeftRight.getHtml();   
 
           
        const html = `

${html_style}

<div class="mobile-container">
    ${html_nav}
    
    <!-- Mobile Info Box -->
    <!--
    <div class="mobile-info-box">
        <div class="info-text" id="${elemIdPageInfo}">
        </div>
    </div>
    -->
    
    <div style="text-align: center;">
        <span id="${elemIdLabelToday}">${label_today}</span>
        <span id="${elemIdDateToday}" style="color:blue; font-weight:600;"></span>
    </div>

    <div style="margin: 8px 0;">
        <a href="javascript:void(0)" class="text-link" id="${elemIdUpdateNumCrates}">
            Update Farrowing Crates
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
            // Show Container
            const next_page_id   = PAGE_ID.PIG_FARM_ADD_EDIT;
            const next_page = navigation.getPageContainer(next_page_id);
            
            // Push currentPage to NavHistory; 
            // Will also compare current page and  next_page NAV_MENU_GROUP.
            navigation.pushCurrentPageToNavHistory(next_page);
            
            navigation.showThisPage(next_page);
            
            
            // Show Page
            const go_back_page_id   = PAGE_ID.FARROWING_SCHEDULE;
            const go_back_page = navigation.getPageContainer(go_back_page_id);
            
        
            const options = {
                is_add:                 false,   // false is edit
                go_back_page:           go_back_page 
            }
            navigation.pagePigFarmAddEdit.show(options);
        });
       
    }
    
    
    this.renderPage = function(page_data){
        thisObj.show();
    }
    
    
    
    this.show = function(){
        thisObj.debugNavHistory(TAG);
        
        // Update navigation.curPageNavigated
        navigation.curPageNavigated.pageData = null;
        navigation.curPageNavigated.renderPageFunc = thisObj.renderPage;
        
        
        // So that not to instantiate in every table redraw
        dtCurrentDate = new Date();
        dtCurrentDate.setHours(0, 0, 0, 0);
        
        
        const s_dt_current = formatDate(dtCurrentDate, FORMAT_COMPACT);
        
        // This is only shown in Gesta, Lacta and Wean tabs
        elemDateToday.textContent = s_dt_current;

        thisObj.renderFarrowingCalendar();
    }
    
    
    this.renderFarrowingCalendar = function(){
        const accSettingsOps    = navigation.pigFarm.getSettingsOperations();
        const dataLactatingList = navigation.pigFarm.managerPigProd.dataLactatingList;
        const dataGestatingList = navigation.pigFarm.managerPigProd.dataGestatingList;
        
        const dataPigFarm = navigation.pigFarm.dataPigFarm;
        
        
        let num_farrowing_crates = dataPigFarm.pig_farm.num_farrow_crates;
        
        
        
        let num_days_allow_early_wean = 35;
        
        
        // Calculate date range (today to 115 days ahead)
        const startDate = new Date(dtCurrentDate);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 115);
        
        // Generate weekly intervals (Mondays only)
        const weeklyDates = thisObj.getWeeklyMondays(startDate, endDate);
        
        // Build crate occupancy
        const crateOccupancy = thisObj.buildCrateOccupancy(
            dataLactatingList, 
            dataGestatingList, 
            accSettingsOps, 
            num_farrowing_crates
        );
        
        // Detect conflicts
        const conflicts = thisObj.detectCrateConflicts(crateOccupancy, num_farrowing_crates);
        
        // Find early wean opportunities
        const earlyWeanOptions = thisObj.findEarlyWeanOpportunities(
            crateOccupancy, num_days_allow_early_wean);
        
        // Render the crate-based Gantt chart
        thisObj.renderCrateGanttChart(weeklyDates, crateOccupancy, conflicts, earlyWeanOptions);
    }
    
    
    this.getWeeklyMondays = function(startDate, endDate) {
        const mondays = [];
        const current = new Date(startDate);
        
        // Find first Monday
        while (current.getDay() !== 1) {
            current.setDate(current.getDate() + 1);
        }
        
        while (current <= endDate) {
            mondays.push(new Date(current));
            current.setDate(current.getDate() + 7);
        }
        
        return mondays;
    }
    
    
    this.buildCrateOccupancy = function(lactatingList, gestatingList, accSettingsOps, numCrates) {
        const day1Adjustment = accSettingsOps.day_1_on_date_of_birth === 1 ? 1 : 0;
        const today = new Date(dtCurrentDate);
        today.setHours(0, 0, 0, 0);
        
        // Step 1: Create timeline events for all sows
        const events = [];
        
        // Lactating sows (already in crates)
        for (const sow of lactatingList) {
            if (!sow.birth || !sow.birth.date_actual) continue;
            
            const birthDate = new Date(sow.birth.date_actual);
            const moveOutDate = new Date(birthDate);
            moveOutDate.setDate(moveOutDate.getDate() + accSettingsOps.num_days_wean - day1Adjustment);
            
            if (moveOutDate >= today) {
                events.push({
                    type: 'lactating',
                    sowId: sow.pig_production.farm_prod_id,
                    sowName: sow.sow.name,
                    startDate: new Date(today),
                    endDate: moveOutDate,
                    expectedBirth: birthDate,
                    isOccupying: true
                });
            }
        }
        
        // Gestating sows (need crates)
        for (const sow of gestatingList) {
            if (!sow.birth || !sow.birth.date_expected) continue;
            
            const expectedBirth = new Date(sow.birth.date_expected);
            const moveInDate = new Date(expectedBirth);
            moveInDate.setDate(moveInDate.getDate() - accSettingsOps.num_days_move_to_farrow);
            
            const moveOutDate = new Date(expectedBirth);
            moveOutDate.setDate(moveOutDate.getDate() + accSettingsOps.num_days_wean - day1Adjustment);
            
            if (moveOutDate >= today) {
                events.push({
                    type: 'gestating',
                    sowId: sow.pig_production.farm_prod_id,
                    sowName: sow.sow.name,
                    startDate: moveInDate,
                    endDate: moveOutDate,
                    expectedBirth: expectedBirth,
                    isOccupying: false
                });
            }
        }
        
        // Step 2: Sort events by start date
        events.sort((a, b) => a.startDate - b.startDate);
        
        // Step 3: Assign sows to crates (greedy algorithm)
        const crates = [];
        for (let i = 0; i < numCrates; i++) {
            crates.push({
                crateNumber: i + 1,
                assignments: []
            });
        }
        
        for (const event of events) {
            let assigned = false;
            
            // Try to find a crate that's available during this event's period
            for (const crate of crates) {
                // Check if crate has any conflict with existing assignments
                let hasConflict = false;
                for (const assignment of crate.assignments) {
                    if (event.startDate <= assignment.endDate && event.endDate >= assignment.startDate) {
                        hasConflict = true;
                        break;
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
                        sowId: assignment.sowId,
                        sowName: assignment.sowName,
                        startDate: assignment.startDate,
                        message: `Gesta Sow ${assignment.sowId} (${assignment.sowName}) has no crate available starting ${thisObj.formatDateShort(assignment.startDate)}`
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
                            sowId: assignment.sowId,
                            sowName: assignment.sowName,
                            currentEndDate: assignment.endDate,
                            daysSaved: daysRemaining,
                            message: `Lacta Sow ${assignment.sowId} (${assignment.sowName}) in Crate ${crate.crateNumber} can be early weaned to free a crate`
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
        
        // Calculate total timeline width in days
        const startDate = weeklyDates[0];
        const endDate = weeklyDates[weeklyDates.length - 1];
        endDate.setDate(endDate.getDate() + 6); // Extend to end of last week
        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const pixelsPerDay = 3.5; // Adjust for mobile readability
        
        // Create scrollable container
        const scrollDiv = document.createElement('div');
        scrollDiv.style.overflowX = 'auto';
        scrollDiv.style.overflowY = 'auto';
        scrollDiv.style.maxHeight = '70vh';
        scrollDiv.style.WebkitOverflowScrolling = 'touch';
        scrollDiv.style.position = 'relative';
        
        // Create fixed header container
        const headerContainer = document.createElement('div');
        headerContainer.style.position = 'sticky';
        headerContainer.style.top = '0';
        headerContainer.style.backgroundColor = 'white';
        headerContainer.style.zIndex = '3';
        headerContainer.style.borderBottom = '1px solid #ddd';
        
        // Header row with dates
        const headerDiv = document.createElement('div');
        headerDiv.style.display = 'flex';
        headerDiv.style.minWidth = `${totalDays * pixelsPerDay + 100}px`;
        
        // Crate label header
        const labelHeader = document.createElement('div');
        labelHeader.textContent = 'Crate';
        labelHeader.style.width = '80px';
        labelHeader.style.padding = '8px';
        labelHeader.style.fontWeight = 'bold';
        labelHeader.style.position = 'sticky';
        labelHeader.style.left = '0';
        labelHeader.style.backgroundColor = 'white';
        labelHeader.style.zIndex = '2';
        headerDiv.appendChild(labelHeader);
        
        // Date markers (Mondays)
        for (let i = 0; i < weeklyDates.length; i++) {
            const date = weeklyDates[i];
            const nextDate = i + 1 < weeklyDates.length ? weeklyDates[i + 1] : endDate;
            const daysToNext = Math.ceil((nextDate - date) / (1000 * 60 * 60 * 24));
            const width = daysToNext * pixelsPerDay;
            
            const dateDiv = document.createElement('div');
            dateDiv.textContent = thisObj.formatShortDate(date);
            dateDiv.style.width = `${width}px`;
            dateDiv.style.textAlign = 'center';
            dateDiv.style.fontSize = '10px';
            dateDiv.style.padding = '8px 0';
            dateDiv.style.borderRight = '1px solid #ccc';
            dateDiv.style.fontWeight = 'bold';
            headerDiv.appendChild(dateDiv);
        }
        headerContainer.appendChild(headerDiv);
        scrollDiv.appendChild(headerContainer);
        
        // Body container
        const bodyContainer = document.createElement('div');
        
        for (const crate of crateOccupancy) {
            const crateRow = document.createElement('div');
            crateRow.style.display = 'flex';
            crateRow.style.minWidth = `${totalDays * pixelsPerDay + 100}px`;
            crateRow.style.borderBottom = '1px solid #eee';
            crateRow.style.position = 'relative';
            
            // Crate label (sticky)
            const crateLabel = document.createElement('div');
            crateLabel.textContent = `Crate ${crate.crateNumber}`;
            crateLabel.style.width = '80px';
            crateLabel.style.padding = '8px';
            crateLabel.style.fontWeight = 'bold';
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
            timelineTrack.style.height = '80px';
            timelineTrack.style.backgroundColor = '#f9f9f9';
            
            // Draw background grid lines (Mondays)
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
            
            // Draw assignment blocks
            for (const assignment of crate.assignments) {
                const blockStartX = thisObj.getXPosition(assignment.startDate, startDate, pixelsPerDay);
                const blockEndX = thisObj.getXPosition(assignment.endDate, startDate, pixelsPerDay);
                const blockWidth = blockEndX - blockStartX;
                
                if (blockWidth > 2) {
                    const block = document.createElement('div');
                    block.style.position = 'absolute';
                    block.style.left = `${blockStartX}px`;
                    block.style.top = '4px';
                    block.style.width = `${blockWidth}px`;
                    block.style.height = 'auto';
                    block.style.minHeight = '68px';
                    block.style.borderRadius = '6px';
                    block.style.padding = '6px 8px';
                    block.style.overflow = 'hidden';
                    block.style.boxSizing = 'border-box';
                    block.style.cursor = 'pointer';
                    
                    // Add critical class if conflict
                    const hasConflict = conflicts && conflicts.some(c => c.sowId === assignment.sowId);
                    
                    if (assignment.type === 'lactating') {
                        block.style.backgroundColor = '#4caf50';
                        block.style.color = '#ffffff';
                    } else {
                        block.style.backgroundColor = '#ff9800';
                        block.style.color = '#ffffff';
                    }
                    
                    if (hasConflict) {
                        block.style.backgroundColor = '#f44336';
                        block.style.animation = 'pulse 2s infinite';
                    }
                    
                    const today = new Date(dtCurrentDate);
                    today.setHours(0, 0, 0, 0);
                    
                    let contentHtml = '';
                    
                    if (assignment.type === 'lactating') {
                        // Lactating block - show days remaining
                        const weanDate = assignment.endDate;
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
                            <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                🐖 ${assignment.sowId} ${assignment.sowName}
                            </div>
                            <div style="font-size: 11px; opacity: 0.9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                ${urgencyIcon} Wean: ${thisObj.formatDateShort(weanDate)} | ${daysRemaining} days left
                            </div>
                            ${urgencyText ? `<div style="font-size: 10px; opacity: 0.9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: bold;">${urgencyText}</div>` : ''}
                        `;
                    } else {
                        // Gestating block - show move in, move out, due date, total days
                        const moveInDate = assignment.startDate;
                        const moveOutDate = assignment.endDate;
                        const expectedBirth = assignment.expectedBirth;
                        const durationDays = Math.ceil((moveOutDate - moveInDate) / (1000 * 60 * 60 * 24));
                        
                        // Check if move in date is approaching
                        const daysToMoveIn = Math.ceil((moveInDate - today) / (1000 * 60 * 60 * 24));
                        let moveIcon = '📦';
                        if (daysToMoveIn <= 3 && daysToMoveIn > 0) {
                            moveIcon = '🚨';
                        } else if (daysToMoveIn <= 7 && daysToMoveIn > 0) {
                            moveIcon = '⚠️';
                        }
                        
                        contentHtml = `
                            <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                🐖 ${assignment.sowId} ${assignment.sowName}
                            </div>
                            <div style="font-size: 11px; opacity: 0.9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                ${moveIcon} Move: ${thisObj.formatDateShort(moveInDate)} | Out: ${thisObj.formatDateShort(moveOutDate)}
                            </div>
                            <div style="font-size: 11px; opacity: 0.9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                🤰 Due: ${thisObj.formatDateShort(expectedBirth)} | Stay: ${durationDays} days
                            </div>
                        `;
                    }
                    
                    block.innerHTML = contentHtml;
                    
                    // Tooltip on hover/tap
                    if (assignment.type === 'lactating') {
                        block.title = `${assignment.sowId} ${assignment.sowName}\nWeans: ${thisObj.formatDateShort(assignment.endDate)}`;
                    } else {
                        block.title = `${assignment.sowId} ${assignment.sowName}\nMove in: ${thisObj.formatDateShort(assignment.startDate)}\nMove out: ${thisObj.formatDateShort(assignment.endDate)}\nDue: ${thisObj.formatDateShort(assignment.expectedBirth)}`;
                    }
                    
                    timelineTrack.appendChild(block);
                }
            }
            
            crateRow.appendChild(timelineTrack);
            bodyContainer.appendChild(crateRow);
        }
        
        scrollDiv.appendChild(bodyContainer);
        container.appendChild(scrollDiv);
        
        // Render legend and conflicts
        this.renderLegend(container);
        this.renderConflictsSummary(container, conflicts, earlyWeanOptions);
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
                <div class="legend-color lactating"></div>
                <span>Lactating (in crate)</span>
            </div>
            <div class="legend-item">
                <div class="legend-color gestating"></div>
                <span>Gestating (needs crate)</span>
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
    
    
    this.getSowByHid = function(hid) {
        const dataLactatingList = navigation.pigFarm.managerPigProd.dataLactatingList;
        const dataGestatingList = navigation.pigFarm.managerPigProd.dataGestatingList;
        
        for (const sow of dataLactatingList) {
            if (sow.pig_production.hid === hid) return sow;
        }
        for (const sow of dataGestatingList) {
            if (sow.pig_production.hid === hid) return sow;
        }
        return null;
    }
    
} 
