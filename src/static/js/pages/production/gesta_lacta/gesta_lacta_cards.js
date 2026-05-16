// gesta_lacta_cards.js

// February 4, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE,
        PIG_PROD_TYPE,
        PROD_STATUS}            from '../../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        sortList}               from '../../../utils.js';

import {getSowBoarReference}    from '../../common/common_app.js';


export function GestaLactaCards(input_settings){
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    
    const settings              = input_settings;
    
    
    const NUM_DAYS_BEFORE_OPERATION_DUE_SHOW_ALARM = 3;
    
    
    let pigOpsAlarmList         = null;
    
    
    this.clearAlarmList = function(){
        pigOpsAlarmList = [];
    }
    
    
    this.getElemPigProdCard = function(data_pig_prod){
        let diff_msecs;
        let diff_days;
        
        let dt_current = new Date();
        dt_current.setHours(0, 0, 0, 0);
        
        
        let sow_name = getSowBoarReference(data_pig_prod.sow);
        
        const insemination = data_pig_prod.insemination;
        
        let boar_name = '';
        switch (insemination.insem_type){
            case 'B':{
                boar_name = getSowBoarReference(insemination.boar);
                break;
            }
            
            case 'AI_X':{
                boar_name = insemination.ai.semen_supplier.semen.name;
                boar_name += ' from ' + insemination.ai.semen_supplier.name;
                break;
            }
            
            case 'AI_N':{
                const internal_boar = insemination.ai.internal_boar;
                boar_name = getSowBoarReference(internal_boar);
                boar_name += '(via AI)';
                
                break;
            }
            
        }
        
        
        let indicator_ai = '';
        if (insemination.insem_type != 'B'){
            indicator_ai = '<span class="ai-indicator"><i class="fas fa-syringe"></i></span>';
        }
        
        
        const birth = data_pig_prod.birth;
        
        let date_important          = null;
        let header_class            = 'lactating-piglets';
        let label_date_important    = '';
        let label_num_days_since    = '';
        let value_num_days_since    = '';
        
        let dt_important            = null;
        let dt_important_sf         = null;
        let diff_days_important     = null;
        
        let dt_insem                = null;
        let dt_birth                = null;
        
        let numdays_since           = null;
        
        let html_due_soon           = '';
        
        let style_animation_horse   = 'display:none;';
        let style_animation_motor   = 'display:none;';
        let style_piglet_counter    = 'display:none;'
        
        let cur_num_pigs_male       = null;
        let cur_num_pigs_female     = null;
        let cur_num_pigs_stillbirth = null;
        let cur_num_pigs_dead       = null;
        
        
        
        switch(data_pig_prod.pig_production.prod_status_id){
            case PROD_STATUS.GESTATING: {
                header_class        = 'gestating';
                
                
                date_important      = birth.date_expected;
                dt_important        = new Date(date_important);
                dt_important_sf     = formatDate(dt_important);
                
                diff_msecs          = dt_important - dt_current;
                diff_days           = Math.round(diff_msecs / APPLICATION.NUM_MSECS_1DAY);
                diff_days_important = diff_days;
                
                if ((diff_days >= 3) && (diff_days <= 5)) {
                    html_due_soon = `<span class="due-soon">(${diff_days} Days)</span>`;
                    style_animation_horse   = 'display:block';
                } 
                
                if ((diff_days == 1) || (diff_days == 2)) {
                    html_due_soon = `<span class="due-soon">(Due Soon)</span>`;
                    style_animation_motor   = 'display:block';
                
                    if (diff_days == 1){
                        dt_important_sf = 'Tomorrow';
                    }
                } 
                
                if (diff_days == 0) {
                    html_due_soon = `<span class="due-soon">(Today!)</span>`;
                    dt_important_sf = 'Today';
                }
                
                if ((diff_days == -1) || (diff_days == -2)){
                    html_due_soon = `<span class="due-soon">(Just Wait)</span>`;
                }
                
                if (diff_days == -1){
                    html_due_soon = `<span class="due-soon">(Panic!!!)</span>`;
                }
                
                
                
                diff_days = parentObj.calculateNumDaysSinceInsem(
                        insemination.insem_date, dt_current,
                        navigation.pigFarm.getSettingsOperations());
                        
                numdays_since       = diff_days;
                
                
                
                label_date_important= 'Expected Birth';
                label_num_days_since= 'Days Since Mating'; 
                
                const dt_insem      = new Date(insemination.insem_date);
                const dt_insem_s    = formatDate(dt_insem, FORMAT_SHORT_MONTH);
                value_num_days_since= `${numdays_since} Days (${dt_insem_s})`;
                
                break;
            }
        
            case PROD_STATUS.LACTATING: {
                header_class = 'lactating-sow';
                
                
                
                cur_num_pigs_male   = birth.pigs_live_m;
                cur_num_pigs_female = birth.pigs_live_f;
                cur_num_pigs_stillbirth = birth.num_dead_at_birth;
                
                // TODO needs to be computed at backend
                cur_num_pigs_dead   = (cur_num_pigs_male + cur_num_pigs_female) - 
                                        data_pig_prod.pig_production.cur_pig_count;
                if (cur_num_pigs_dead < 0){cur_num_pigs_dead = 0;}
                
                style_piglet_counter= '';
                
                
                dt_important_sf = parentObj.calculateDateExpectedWean(
                        birth.date_actual, 
                        navigation.pigFarm.getSettingsOperations());

                
                diff_days = parentObj.calculateNumDaysSinceBirth(
                        birth.date_actual, dt_current,
                        navigation.pigFarm.getSettingsOperations());
                        
                numdays_since       = diff_days;
                
                
                
                label_date_important= 'Expected Wean';
                label_num_days_since= 'Days Since Birth';
                
                const dt_birth      = new Date(birth.date_actual);
                const dt_birth_s    = formatDate(dt_birth, FORMAT_SHORT_MONTH);
                value_num_days_since= `${numdays_since} Days (${dt_birth_s})`;
                
                break;
            }
        }
        
        const farm_prod_id = data_pig_prod.pig_production.farm_prod_id;
        
        // Create the main card element
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card-pig-prod';
        cardDiv.dataset.pid = farm_prod_id;
        
        // Create header
        const headerDiv = document.createElement('div');
        headerDiv.className = `card-header-pig-prod ${header_class}`;
        
        // Header top row
        const topRowDiv = document.createElement('div');
        topRowDiv.className = 'header-top-row';
        
        const pidDiv = document.createElement('div');
        pidDiv.className = 'pid';
        pidDiv.textContent = farm_prod_id;
        
        const sowNameDiv = document.createElement('div');
        sowNameDiv.className = 'sow-name';
        sowNameDiv.dataset.pid = farm_prod_id;
        sowNameDiv.dataset.sowName = sow_name;
        sowNameDiv.dataset.boarName = boar_name;
        sowNameDiv.dataset.indicatorAi = indicator_ai ? 'true' : 'false';
        sowNameDiv.innerHTML = `${sow_name} ❤️ ${boar_name} ${indicator_ai}`;
        
        // Add click handler for sow name
        sowNameDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            navigation.onClickProdGestatingEntry(farm_prod_id);
        });
        
        topRowDiv.appendChild(pidDiv);
        topRowDiv.appendChild(sowNameDiv);
        
        // Dates container
        const datesContainer = document.createElement('div');
        datesContainer.className = 'dates-container';
        
        // First date item
        const dateItem1 = document.createElement('div');
        dateItem1.className = 'date-item';
        dateItem1.style.width = '50%';
        
        const dateLabel1 = document.createElement('div');
        dateLabel1.className = 'date-label';
        dateLabel1.innerHTML = `${label_date_important} ${html_due_soon}`;
        
        const dateValue1 = document.createElement('div');
        dateValue1.className = 'date-value';
        dateValue1.innerHTML = `
            ${dt_important_sf}
            <span class="running-animation">
                <span class="horse-running" style="${style_animation_horse}">
                    <i class="fas fa-horse"></i>
                    <div class="animation-track"></div>
                </span>
                <span class="motorbike-running" style="${style_animation_motor}">
                    <i class="fas fa-motorcycle"></i>
                    <div class="animation-track"></div>
                </span>
            </span>
        `;
        
        dateItem1.appendChild(dateLabel1);
        dateItem1.appendChild(dateValue1);
        
        // Second date item
        const dateItem2 = document.createElement('div');
        dateItem2.className = 'date-item';
        dateItem2.style.width = '55%';
        
        const dateLabel2 = document.createElement('div');
        dateLabel2.className = 'date-label';
        dateLabel2.textContent = label_num_days_since;
        
        const dateValue2 = document.createElement('div');
        dateValue2.className = 'date-value';
        dateValue2.textContent = value_num_days_since;
        
        dateItem2.appendChild(dateLabel2);
        dateItem2.appendChild(dateValue2);
        
        datesContainer.appendChild(dateItem1);
        datesContainer.appendChild(dateItem2);
        
        headerDiv.appendChild(topRowDiv);
        headerDiv.appendChild(datesContainer);
        
        // Piglet count container (only for lactating)
        const pigletContainer = document.createElement('div');
        pigletContainer.className = 'piglet-count-container';
        pigletContainer.style.cssText = style_piglet_counter;
        
        if (data_pig_prod.pig_production.prod_status_id == PROD_STATUS.LACTATING) {
            const maleDiv = document.createElement('div');
            maleDiv.className = 'piglet-count male';
            maleDiv.innerHTML = `<div class="count-number">${cur_num_pigs_male}</div><div class="count-label">Male</div>`;
            
            const femaleDiv = document.createElement('div');
            femaleDiv.className = 'piglet-count female';
            femaleDiv.innerHTML = `<div class="count-number">${cur_num_pigs_female}</div><div class="count-label">Female</div>`;
            
            const stillbirthDiv = document.createElement('div');
            stillbirthDiv.className = 'piglet-count stillbirth';
            stillbirthDiv.innerHTML = `<div class="count-number">${cur_num_pigs_stillbirth}</div><div class="count-label">StillBirth</div>`;
            
            const deadDiv = document.createElement('div');
            deadDiv.className = 'piglet-count dead';
            deadDiv.innerHTML = `<div class="count-number">${cur_num_pigs_dead}</div><div class="count-label">Dead</div>`;
            
            pigletContainer.appendChild(maleDiv);
            pigletContainer.appendChild(femaleDiv);
            pigletContainer.appendChild(stillbirthDiv);
            pigletContainer.appendChild(deadDiv);
        }
        
        // Operations container
        const operationsContainer = document.createElement('div');
        operationsContainer.className = 'operations-list-container';
        
        const operationsElem = thisObj._getElemCardOperations(data_pig_prod);
        operationsContainer.appendChild(operationsElem);
        
        // Assemble the card
        cardDiv.appendChild(headerDiv);
        cardDiv.appendChild(pigletContainer);
        cardDiv.appendChild(operationsContainer);
        
        return cardDiv;
    }
    
    
    this._getElemCardOperations = function(data_pig_prod){
        const pid = data_pig_prod.pig_production.farm_prod_id;
        
        let operations = null;
        
        if (data_pig_prod.pig_production.prod_status_id == PROD_STATUS.GESTATING){
            operations = data_pig_prod.gestating_ops;
        }
        else{
            operations = data_pig_prod.lactating_ops;
        }
        
        if (operations == null || operations.length == 0){
            return document.createElement('div'); // Return empty div
        }
        
        const data_sow = data_pig_prod.sow;
        const sow_reference = getSowBoarReference(data_sow);
        
        // Loop through the operations to see if there are done Operations
        let count_completed_ops = 0;
        for (const cur_entry of operations){
            if (cur_entry.pig_prod_pig_ops.date_actual != null){
                count_completed_ops += 1;
            }
        }
        
        let style_future_ops_control = '';
        let style_operations_control = '';
        
        // Fill these 3 arrays 
        let operations_above    = [];
        let operations_cur_view = [];
        let operations_below    = [];
        
        if (count_completed_ops == operations.length){
            operations_below = operations;
        }
        else{
            if (operations.length <= 2){
                operations_cur_view = operations;
            }
            else{
                let index;
                let cur_entry;
                
                index = operations.length -1;
            
                let index_begin = -1;
                let index_end   = -1;
                
                while (index >= 0){
                    cur_entry = operations[index];
                    
                    if (cur_entry.pig_prod_pig_ops.date_actual == null){
                        index_end   = index +1;
                        index_begin = index -1;

                        if (index_begin < 0) {
                            index_begin = 0;
                            index_end   = 2;
                        }
                        break;
                    }
                                    
                    index = index - 1;
                }
                
                if (index_begin > 0){
                    operations_above    = operations.slice(0,index_begin);
                    operations_cur_view = operations.slice(index_begin, index_end);
                    
                    if (index_end < operations.length){
                        operations_below = operations.slice(index_end);
                    }
                    
                }
                else{
                    operations_cur_view = operations.slice(index_begin, index_end);
                    
                    if (index_end < operations.length){
                        operations_below = operations.slice(index_end);
                    }
                }
            }        
        }
        
        if (operations_below.length == 0){
            style_operations_control = 'display:none;';
        }
        
        if (operations_above.length == 0){
            style_future_ops_control = 'display:none;';
        }
        
        // Create operations list container
        const operationsListDiv = document.createElement('div');
        operationsListDiv.className = 'operations-list';
        operationsListDiv.dataset.pid = pid;
        
        // Future operations control
        if (operations_above.length > 0) {
            const futureControlDiv = document.createElement('div');
            futureControlDiv.className = 'future-operations-control';
            futureControlDiv.style.cssText = style_future_ops_control;
            
            const showMoreSpan = document.createElement('span');
            showMoreSpan.className = 'btn-show-more';
            showMoreSpan.dataset.pid = pid;
            showMoreSpan.dataset.operationsCount = operations_above.length;
            showMoreSpan.innerHTML = `<i class="fas fa-calendar-alt"></i><span class="span-show-more">Show ${operations_above.length} Upcoming Operation${operations_above.length > 1 ? 's' : ''}</span>`;
            
            // Add click handler
            showMoreSpan.addEventListener('click', (e) => {
                e.stopPropagation();
                thisObj.onClickShowMore(showMoreSpan);
            });
            
            futureControlDiv.appendChild(showMoreSpan);
            operationsListDiv.appendChild(futureControlDiv);
        }
        
        // Add above operations
        operations_above.forEach((operation, index) => {
            const options = {
                placement_class: 'operation-above',
                is_hidden: true,
                pid: pid,
                sow: sow_reference,
                data_index: index,
                operation_hid: operation.pig_prod_pig_ops.hid
            };
            
            const opElem = thisObj._getElemCardOperation(operation, options);
            operationsListDiv.appendChild(opElem);
        });
        
        // Add current view operations
        operations_cur_view.forEach((operation, index) => {
            const options = {
                placement_class: '',
                is_hidden: false,
                pid: pid,
                sow: sow_reference,
                data_index: index,
                operation_hid: operation.pig_prod_pig_ops.hid
            };
            
            const opElem = thisObj._getElemCardOperation(operation, options);
            operationsListDiv.appendChild(opElem);
        });
        
        // Add below operations
        operations_below.forEach((operation, index) => {
            const options = {
                placement_class: 'operation-below',
                is_hidden: true,
                pid: pid,
                sow: sow_reference,
                data_index: index,
                operation_hid: operation.pig_prod_pig_ops.hid
            };
            
            const opElem = thisObj._getElemCardOperation(operation, options);
            operationsListDiv.appendChild(opElem);
        });
        
        // Completed operations control
        if (operations_below.length > 0) {
            const completedControlDiv = document.createElement('div');
            completedControlDiv.className = 'operations-controls';
            completedControlDiv.style.cssText = style_operations_control;
            
            const showCompletedSpan = document.createElement('span');
            showCompletedSpan.className = 'btn-show-completed';
            showCompletedSpan.dataset.pid = pid;
            showCompletedSpan.dataset.completedCount = operations_below.length;
            showCompletedSpan.innerHTML = `<i class="fas fa-history"></i><span class="span-show-completed">Show Completed Operations (${operations_below.length})</span>`;
            
            // Add click handler
            showCompletedSpan.addEventListener('click', (e) => {
                e.stopPropagation();
                thisObj.onClickShowCompleted(showCompletedSpan);
            });
            
            completedControlDiv.appendChild(showCompletedSpan);
            operationsListDiv.appendChild(completedControlDiv);
        }
        
        return operationsListDiv;
    }
    
    
    this._getElemCardOperation = function(data_operation, options){
        const placement_class   = options.placement_class;
        const is_hidden         = options.is_hidden;
        const sow               = options.sow;
        const pid               = options.pid;
        const data_index        = options.data_index;
        const operation_hid     = options.operation_hid;
        
        let diff_msecs;
        let diff_days;
        
        let dt_current = new Date();
        dt_current.setHours(0, 0, 0, 0);
        
        const date_target   = data_operation.pig_prod_pig_ops.date_target;
        const dt_target     = new Date(date_target);
        const date_target_s = formatDate(dt_target, FORMAT_SHORT_MONTH);
        
        const date_actual   = data_operation.pig_prod_pig_ops.date_actual;
        const operation_name= data_operation.account_pig_ops.name;
        const operation_desc= data_operation.account_pig_ops.description;
        
        let style_animation_alarm = '';
        let style_operation_desc = '';
        let style_operation_completion = '';
        
        if (operation_desc == null){style_operation_desc = 'display:none;';}
        if (!data_operation.staff || data_operation.staff.name == null){
            style_operation_completion = 'display:none;';
        }
        
        // Create operation element
        const opDiv = document.createElement('div');
        opDiv.className = `operation-item ${placement_class}`;
        opDiv.dataset.pid = pid;
        opDiv.dataset.index = data_index;
        opDiv.dataset.operationHid = operation_hid;
        
        if (is_hidden) {
            opDiv.style.display = 'none';
        }
        
        if (date_actual != null) {
            // Completed operation
            opDiv.classList.add('operation-done');
            opDiv.dataset.completed = 'true';
            
            const date_actual_s = formatDate(new Date(date_actual), FORMAT_SHORT_MONTH);
            const staff_name = data_operation.staff ? data_operation.staff.name : '';
            
            opDiv.innerHTML = `
                <div class="operation-header">
                    <div class="operation-left">
                        <div class="operation-date">${date_target_s}</div>
                        <div class="operation-name">${operation_name}</div>
                    </div>
                    <div class="operation-icon icon-done">
                        <i class="fas fa-check-circle"></i>
                    </div>
                </div>
                <div class="operation-description" style="${style_operation_desc}">
                    ${operation_desc || ''}
                </div>
                <div class="operation-completion" style="${style_operation_completion}">
                    <span>Done: ${date_actual_s}</span>
                    <span>By: ${staff_name}</span>
                </div>
            `;
            
            return opDiv;
        }
        
        // Compute the number of days from dt_target to dt_current
        diff_msecs = dt_target - dt_current;
        diff_days = Math.round(diff_msecs / APPLICATION.NUM_MSECS_1DAY);
        
        let operation_class = '';
        let has_action = 0;
        
        if (diff_days > NUM_DAYS_BEFORE_OPERATION_DUE_SHOW_ALARM){
            style_animation_alarm = 'display:none;';
            operation_class = 'operation-pending';
        }
        else{
            has_action = 1;
            operation_class = 'operation-due';
            parentObj.showPageHeaderAlarm = true;
            
            let is_overdue = 0;
            if (diff_days < 0){is_overdue = 1;}
            
            const short_dt_target = formatDate(dt_target, FORMAT_COMPACT);
            
            if (!pigOpsAlarmList) pigOpsAlarmList = [];
            pigOpsAlarmList.push({
                pid: pid,
                sow: sow,
                date: short_dt_target,
                is_overdue: is_overdue,
                operation_hid: operation_hid,
                pig_ops_name: operation_name
            });
        }
        
        opDiv.classList.add(operation_class);
        opDiv.dataset.hasAction = has_action;
        opDiv.dataset.dateTarget = date_target;
        opDiv.dataset.sow = sow;
        
        // Create the operation HTML
        opDiv.innerHTML = `
            <div class="operation-header">
                <div class="operation-left">
                    <div class="operation-date">${date_target_s}</div>
                    <div class="operation-name">
                        ${operation_name}
                        <span class="inline-bell" title="Operation due today!" style="${style_animation_alarm}">
                            <i class="fas fa-bell"></i>
                        </span>
                    </div>
                </div>
                <div class="operation-actions" style="${style_animation_alarm}">
                    <button class="btn-mark-done" data-pid="${pid}" data-operation-hid="${operation_hid}">
                        <i class="fas fa-check"></i>
                        Mark Done
                    </button>
                </div>
            </div>
            <div class="operation-description" style="${style_operation_desc}">
                ${operation_desc || ''}
            </div>
        `;
        
        // Add click handler for the mark done button
        const markDoneBtn = opDiv.querySelector('.btn-mark-done');
        if (markDoneBtn) {
            markDoneBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const pid = markDoneBtn.dataset.pid;
                const operationHid = markDoneBtn.dataset.operationHid;
                thisObj.onClickMarkAsDone(parseInt(pid), operationHid);
            });
        }
        
        return opDiv;
    }
    
    
    this.getHtmlAlarmOperations = function(){
        if (!pigOpsAlarmList || pigOpsAlarmList.length === 0) {
            return '<p>No pending operations</p>';
        }
        
        let html_tbody = '';
        
        for (const cur_entry of pigOpsAlarmList){
            const pid = cur_entry.pid;
            const operation_hid = cur_entry.operation_hid;
            
            let html_overdue = '';
            if (cur_entry.is_overdue){
                html_overdue = `<span class="status-overdue" aria-label="Overdue"></span>`;
            }
            
            // Create data attributes for alarm row
            const rowData = `data-pid="${pid}" data-operation-hid="${operation_hid}" data-sow="${cur_entry.sow}" data-date="${cur_entry.date}" data-is-overdue="${cur_entry.is_overdue}" data-pig-ops-name="${cur_entry.pig_ops_name}"`;
            
            html_tbody += `
            <tr ${rowData}>
                <td class="sow-name" tabindex="0" role="button" style="padding-left:0;">${cur_entry.sow}</td>
                <td class="date date-today" tabindex="0" role="button" style="padding-left:0; padding-right:0;">
                    <span class="compact-date">${cur_entry.date}</span>
                    ${html_overdue}
                </td>
                <td class="operation">${cur_entry.pig_ops_name}
                    <span class="inline-bell">
                        <i class="fas fa-bell"></i>
                    </span>
                </td>
            </tr>
            `;
        }
        
        let html = `
        <table class="operations-table">
            <thead>
                <tr>
                    <th>Sow</th>
                    <th style="padding-left:0;">Date</th>
                    <th>Operation Name</th>
                </tr>
            </thead>
            <tbody>
                ${html_tbody}
            </tbody>
        </table>
        `;
        
        return html;
    }
    
    
    this.onClickShowMore = function(clicked_elem){
        const operations_list = clicked_elem.closest('.operations-list');
        if (!operations_list) return;
        
        const operations_above = operations_list.querySelectorAll('.operation-above');
        const span_show_more = operations_list.querySelector('.span-show-more');
        const operationsCount = parseInt(clicked_elem.dataset.operationsCount) || 0;
        
        let isDisplayed = 0;
        
        operations_above.forEach(operation => {
            const computedStyle = window.getComputedStyle(operation);
            const displayValue = computedStyle.getPropertyValue('display');
            
            if (displayValue == 'none'){
                isDisplayed = 1;
                operation.style.display = 'block';
            }
            else{
                isDisplayed = 0;
                operation.style.display = 'none';
            }
        });
        
        let s_text;
        if (isDisplayed == 0){
            s_text = `Show ${operationsCount} Upcoming Operation`;
            if (operationsCount > 1){s_text += 's';}
        }
        else{
            s_text = `Hide ${operationsCount} Upcoming Operation`;
            if (operationsCount > 1){s_text += 's';}
        }
        
        if (span_show_more) {
            span_show_more.innerHTML = s_text;
        }
    }
    
    
    this.onClickShowCompleted = function(clicked_elem){
        const operations_list = clicked_elem.closest('.operations-list');
        if (!operations_list) return;
        
        const operations_below = operations_list.querySelectorAll('.operation-below');
        const span_show_comp = operations_list.querySelector('.span-show-completed');
        const completedCount = parseInt(clicked_elem.dataset.completedCount) || 0;
        
        let isDisplayed = 0;
        
        operations_below.forEach(operation => {
            const computedStyle = window.getComputedStyle(operation);
            const displayValue = computedStyle.getPropertyValue('display');
            
            if (displayValue == 'none'){
                isDisplayed = 1;
                operation.style.display = 'block';
            }
            else{
                isDisplayed = 0;
                operation.style.display = 'none';
            }
        });
        
        let s_text;
        if (isDisplayed == 0){
            s_text = `Show Completed Operations (${completedCount})`;
        }
        else{
            s_text = `Hide Completed Operations (${completedCount})`;
        }
        
        if (span_show_comp) {
            span_show_comp.innerHTML = s_text;
        }
    }
    
    
    this.onClickMarkAsDone = function(pid, entry_hid){
        const data_pig_prod = parentObj.getDataPigProd(pid);
        if (!data_pig_prod) return;
        
        const operation = parentObj.getDataProdPigOps(data_pig_prod, entry_hid);
        if (operation == null) {return;}
        
        const data_sow = data_pig_prod.sow;
        let sow_reference = '';
        
        if ((data_sow.name != null) && (data_sow.name.length > 0)){
            sow_reference = data_sow.name;
        }
        else{
            sow_reference = data_sow.number;
        }
        
        let page_id = PAGE_ID.PROD_LACTA_LIST;
        if (settings.isGesta){
            page_id = PAGE_ID.PROD_GESTA_LIST;
        }
        
        const go_back_page = navigation.getPageContainer(page_id);
        
        const options = {
            pid: pid,
            sow: sow_reference,
            is_gesta: settings.isGesta,
            is_mark_done: true,
            go_back_page: go_back_page
        };
        
        // Set this callback
        navigation.pageProdPigOpsEdit.callbackOnSuccessEdit = thisObj.onSuccessEditPigOps;
        
        navigation.pageProdPigOpsEdit.curDataPigProd = data_pig_prod;
        navigation.pageProdPigOpsEdit.beforeShow(operation, options);
        
        const next_page = navigation.getPageContainer(PAGE_ID.PROD_PIG_OPS_EDIT);
        navigation.showThisPage(next_page);
    }
    
    
    this.onClickSowName = function(pid) {
        navigation.onClickProdGestatingEntry(pid);
    }
    
    
    this.onClickAlarmRow = function(pid, operation_hid, isOverdue, settings) {
        if (settings.isGesta){
            navigation.pageMobGestatingList.onClickMarkAsDone(pid, operation_hid);
        }
        else{
            navigation.pageMobLactatingList.onClickShowMore(pid, operation_hid);
        }
    }
}
