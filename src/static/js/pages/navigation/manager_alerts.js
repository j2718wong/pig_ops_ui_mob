// manager_alerts.js

// May 9, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        PAGE_ID,
        ACC_USER_GROUP,
        ALERT_TYPE}             from '../../constants.js';

import {formatDate,
        FORMAT_COMPACT}         from '../../utils.js';



export function ManagerAlerts(_navigation) {
    const thisObj               = this;
    const navigation            = _navigation;
    
    const STORAGE_KEY_VIEWED_BILLS = 'superpig_viewed_bills';
    const STORAGE_KEY_VIEWED_PREP_ALERTS = 'superpig_viewed_prep_alerts';
    
    let elemAlertContainer      = null;
    let elemAlertIcon           = null;
    let elemAlertCount          = null;
    
    let elemAlertModal          = null;
    let elemBtnClose            = null;
    let elemBtnCloseModal       = null;
    let elemAlertModalBody      = null;
    
    let dataAlertList           = [];
    let dataPrepAlertsList      = [];
    
    this.init = function(){
        this.afterHtmlRender();
    }
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    this._findElements  = function(){
        elemAlertContainer      = document.getElementById('alertContainer');
        elemAlertIcon           = document.getElementById('alertIcon');
        elemAlertCount          = document.getElementById('alertCount');
        
        elemAlertModal          = document.getElementById('alertModal');
        if (elemAlertModal) {
            elemBtnClose        = elemAlertModal.querySelector('#closeAlertModal');
            elemBtnCloseModal   = elemAlertModal.querySelector('#closeAlertModalBtn');
            elemAlertModalBody  = elemAlertModal.querySelector('.alert-modal-body');
        }
    }
    
    this._processAfterHtmlRender = function(){}
    
    this._bindEventListeners = function(){
        if (elemAlertIcon) {
            elemAlertIcon.addEventListener('click', function(event) {
                if (navigation.userControl.isAccountLocked()){
                    navigation.showHomeDashBoard();
                    return;
                }
                
                
                thisObj.renderAlerts();
                elemAlertModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
    
        if (elemBtnClose) {
            elemBtnClose.addEventListener('click', function(event) {
                elemAlertModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
        
        if (elemBtnCloseModal) {
            elemBtnCloseModal.addEventListener('click', function(event) {
                elemAlertModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
        
        if (elemAlertModal) {
            elemAlertModal.addEventListener('click', function(event) {
                if (event.target === elemAlertModal) {
                    elemAlertModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        }
    }

    this.checkAndShowNotificationBell = function(){
        if (dataAlertList.length === 0) {
            if (elemAlertContainer) elemAlertContainer.style.display = 'none';
        } else {
            if (elemAlertContainer) elemAlertContainer.style.display = 'flex';
            if (elemAlertCount) elemAlertCount.textContent = dataAlertList.length;
        }
    }

    this.addAlertEntry = function(alert_entry){
        let is_duplicate = false;
        
        for (let i = 0; i < dataAlertList.length; i++) {
            let cur_entry = dataAlertList[i];
            if (cur_entry.type === alert_entry.type && 
                cur_entry.uniqueKey === alert_entry.uniqueKey) {
                is_duplicate = true;
                return false;
            }
        }
        
        if (!is_duplicate) {
            dataAlertList.push(alert_entry);
            console.log('Alert is added');
            console.log(alert_entry);
        }
        
        if (elemAlertCount) {
            elemAlertCount.textContent = dataAlertList.length;
        }
        
        this.checkAndShowNotificationBell();
        
        return true;
    }

    this.removeAlertEntry = function(uniqueKey) {
        const newList = [];
        for (let i = 0; i < dataAlertList.length; i++) {
            if (dataAlertList[i].uniqueKey !== uniqueKey) {
                newList.push(dataAlertList[i]);
            }
        }
        dataAlertList = newList;
        this.checkAndShowNotificationBell();
    }
    
    this.clearAlertsByType = function(alertType) {
        const newList = [];
        for (let i = 0; i < dataAlertList.length; i++) {
            if (dataAlertList[i].type !== alertType) {
                newList.push(dataAlertList[i]);
            }
        }
        dataAlertList = newList;
        this.checkAndShowNotificationBell();
    }
    
    this.refreshAlerts = function(){
        this.checkForNewBillAlert();
        this.checkForGestaPigOpsPrepAlert();
        this.renderAlerts();
    }

    // Bill notification methods
    this.getViewedBills = function() {
        const viewed = localStorage.getItem(STORAGE_KEY_VIEWED_BILLS);
        if (viewed) {
            return JSON.parse(viewed);
        }
        return [];
    }

    this.markBillAsViewed = function(billReference) {
        const viewed = this.getViewedBills();
        let alreadyViewed = false;
        
        for (let i = 0; i < viewed.length; i++) {
            if (viewed[i] === billReference) {
                alreadyViewed = true;
                break;
            }
        }
        
        if (!alreadyViewed) {
            viewed.push(billReference);
            localStorage.setItem(STORAGE_KEY_VIEWED_BILLS, JSON.stringify(viewed));
        }
        
        this.removeAlertEntry(billReference);
    }

    this.isBillViewed = function(billReference) {
        const viewed = this.getViewedBills();
        for (let i = 0; i < viewed.length; i++) {
            if (viewed[i] === billReference) {
                return true;
            }
        }
        return false;
    }

    this.checkForNewBillAlert = function() {
        let account = null;
        if (navigation.userControl.dataUserAccount && 
            navigation.userControl.dataUserAccount.account && 
            navigation.userControl.dataUserAccount.account.account) {
            account = navigation.userControl.dataUserAccount.account.account;
        }
        
        if (!account) {
            return;
        }
        
        const current_bill = account.current_bill;
        
        if (current_bill && current_bill.bill_reference) {
            const cur_user = navigation.userControl.dataUserAccount.user;
            let user_group_num = null;
            
            if (cur_user && cur_user.user_group) {
                user_group_num = cur_user.user_group.group_num;
            }
            
            if (user_group_num === ACC_USER_GROUP.ADMIN || 
                user_group_num === ACC_USER_GROUP.MANAGEMENT) {
                
                const bill_reference = current_bill.bill_reference;
                const is_bill_viewed = this.isBillViewed(bill_reference);
                
                if (!is_bill_viewed) {
                    const onclick_alert = function() {
                        thisObj.markBillAsViewed(bill_reference);
                        
                        let go_back_page = navigation.curPageNavigated.pageContainer;
                        if (!go_back_page) {
                            go_back_page = navigation.getPageContainer(PAGE_ID.HOME);
                        } 
                        
                        const next_page = navigation.getPageContainer(PAGE_ID.BILL_NEW);
                        navigation.pushCurrentPageToNavHistory(next_page);
                        navigation.showThisPage(next_page);
                        
                        const options = {
                            go_back_page: go_back_page,
                            bill_reference: bill_reference
                        };
                        navigation.pageAccountNewBill.show(options);
                        
                        if (elemAlertModal && elemAlertModal.classList.contains('active')) {
                            elemAlertModal.classList.remove('active');
                            document.body.style.overflow = 'auto';
                        }
                    };
                    
                    const cur_alert = {
                        type:       ALERT_TYPE.NEW_BILL,
                        uniqueKey:  current_bill.bill_reference,
                        data:       current_bill,
                        onClick:    onclick_alert
                    };
                    
                    thisObj.addAlertEntry(cur_alert);
                }
            }
        } else {
            this.clearAlertsByType(ALERT_TYPE.NEW_BILL);
        }
    }

    // Gesta PigOps Prep Alert methods
    this.getViewedPrepAlerts = function() {
        const viewed = localStorage.getItem(STORAGE_KEY_VIEWED_PREP_ALERTS);
        if (viewed) {
            return JSON.parse(viewed);
        }
        return [];
    }

    this.markPrepAlertAsViewed = function(uniqueKey) {
        const viewed = this.getViewedPrepAlerts();
        let alreadyViewed = false;
        
        for (let i = 0; i < viewed.length; i++) {
            if (viewed[i] === uniqueKey) {
                alreadyViewed = true;
                break;
            }
        }
        
        if (!alreadyViewed) {
            viewed.push(uniqueKey);
            localStorage.setItem(STORAGE_KEY_VIEWED_PREP_ALERTS, JSON.stringify(viewed));
        }
        
        this.removeAlertEntry(uniqueKey);
    }

    this.isPrepAlertViewed = function(uniqueKey) {
        const viewed = this.getViewedPrepAlerts();
        for (let i = 0; i < viewed.length; i++) {
            if (viewed[i] === uniqueKey) {
                return true;
            }
        }
        return false;
    }


    this.addGestaPigOpsPrepListToAlerts = function(data) {
        console.log('addGestaPigOpsPrepListToAlerts');
        console.log(data);
        
        if (!data || data.length === 0) {
            return;
        }
        
        for (let i = 0; i < data.length; i++) {
            const cur_entry = data[i];
            const pig_ops_hid = cur_entry.pig_prod_pig_ops.hid;
            const unique_key = 'pig_ops_prep_' + pig_ops_hid;
            
            // Check if already viewed
            const is_viewed = this.isPrepAlertViewed(unique_key);
            if (is_viewed) {
                console.log('Alert is already viewed; unique_key: ' + unique_key);
                continue;
            }
            
            const onclick_alert = function() {
                thisObj.markPrepAlertAsViewed(unique_key);
                
                // Navigate to gestating list
                const next_page = navigation.getPageContainer(PAGE_ID.PROD_GESTA_LIST);
                navigation.showThisPage(next_page);
                navigation.pageMobGestatingList.show();
                
                if (elemAlertModal && elemAlertModal.classList.contains('active')) {
                    elemAlertModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            };
        
            const cur_alert = {
                type:       ALERT_TYPE.PIG_OPS_MEDVAC_PREP,
                uniqueKey:  unique_key,
                data:       cur_entry,
                onClick:    onclick_alert
            };
            
            thisObj.addAlertEntry(cur_alert);
        }
    }
    
    this.checkForGestaPigOpsPrepAlert = function() {
        const farm_account_hid = navigation.pigFarm.getPigFarmAccountHid();
        
        if (!farm_account_hid) {
            return;
        }
        
        const callback_success = function(data) {
            thisObj.addGestaPigOpsPrepListToAlerts(data);
            thisObj.renderAlerts();
        };
        
        this.requestDataGestaPigOpsPrepList(callback_success, null);
    }
    
    this.requestDataGestaPigOpsPrepList = function(callback_success, elem_show_error) {
        const farm_account_hid = navigation.pigFarm.getPigFarmAccountHid();
        
        const base_url = window.location.origin;
        let url = base_url + '/gesta_pig_ops_medvac/prep_list?ahid=' + farm_account_hid;
        
        const bearer_token = localStorage.getItem('access_token');
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + bearer_token
            },
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
            beforeSend: function() {
                if (elem_show_error) {
                    elem_show_error.style.display = 'none';
                }
            },
            success: function(response) {
                if (response.result.num === 0) {
                    if (callback_success) {
                        callback_success(response.data);
                    }
                } else {
                    if (navigation.serverError && elem_show_error) {
                        navigation.serverError.receivedErrorMessage(response, elem_show_error);
                    }
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                if (navigation.serverError) {
                    navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
                }
            }
        });
    }

    this.renderAlerts = function() {
        if (dataAlertList.length === 0) {
            if (elemAlertContainer) {
                elemAlertContainer.style.display = 'none';
            }
            return;
        }
        
        if (elemAlertContainer) {
            elemAlertContainer.style.display = 'flex';
        }
        if (elemAlertCount) {
            elemAlertCount.textContent = dataAlertList.length;
        }
        
        if (!elemAlertModalBody) {
            return;
        }
        
        let html = '';
        
        // Separate alerts by type
        const billAlerts = [];
        const prepAlerts = [];
        
        for (let i = 0; i < dataAlertList.length; i++) {
            if (dataAlertList[i].type === ALERT_TYPE.NEW_BILL) {
                billAlerts.push(dataAlertList[i]);
            } else if (dataAlertList[i].type === ALERT_TYPE.PIG_OPS_MEDVAC_PREP) {
                prepAlerts.push(dataAlertList[i]);
            }
        }
        
        // Bill Alerts section
        if (billAlerts.length > 0) {
            html += '<h3 style="color: var(--critical-color, #f44336);">';
            html += '<i class="fas fa-exclamation-circle"></i> New Bill';
            html += '</h3>';
            
            for (let j = 0; j < billAlerts.length; j++) {
                const alert = billAlerts[j];
                const bill = alert.data;
                
                let dateDue = null;
                if (bill.date_due) {
                    dateDue = new Date(bill.date_due);
                }
                
                const today = new Date();
                let isOverdue = false;
                if (dateDue && dateDue < today) {
                    isOverdue = true;
                }
                
                const dueClass  = isOverdue ? 'alert-critical' : 'alert-warning';
                let sDateDue    = formatDate(dateDue, FORMAT_COMPACT);
                let dueText = '';
                if (isOverdue) {
                    dueText = 'OVERDUE';
                } else if (dateDue) {
                    dueText = 'Due ' + formatDate(dateDue, FORMAT_COMPACT);
                }
                
                const amount = bill.total_amount_due || bill.amount || 0;
                const formattedAmount = amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2
                });
                
                
                let sDateIssue  = formatDate(new Date(bill.date_issue), FORMAT_COMPACT)
                
                html += '<div class="alert-item clickable" data-alert-key="' + alert.uniqueKey + '">';
                html += '<div class="alert-content">';
                html += '<div>';
                html += '<span class="alert-category ' + dueClass + '">' + dueText + '</span>';
                html += '<span class="alert-title">Bill #' + bill.bill_reference + '</span>';
                html += '</div>';
                html += '<div class="alert-description">';
                html += 'Amount: ' + (bill.currency_code || 'PHP') + ' ' + formattedAmount;
                html += '</div>';
                if (bill.date_issue) {
                    html += '<div class="alert-time">Issued: ' + sDateIssue; 
                    if (isOverdue){
                        html += `<span class ="nowrap"; style="margin-left:20px;">Due: ${sDateDue}</span>`;
                    }
                    html += '</div>';
                }
                html += '</div>';
                html += '</div>';
            }
        }
        
        // Gesta PigOps Preparation Alerts section
        if (prepAlerts.length > 0) {
            html += '<h3 style="color: var(--gestating-color);">';
            html += '<i class="fas fa-syringe"></i> Gesta Sow MedVac';
            html += '</h3>';
            
            for (let j = 0; j < prepAlerts.length; j++) {
                const alert = prepAlerts[j];
                const entry = alert.data;
                const pigOps = entry.pig_prod_pig_ops;
                const pigProduction = entry.pig_production;
                const pigOpsName = pigOps.pig_ops ? pigOps.pig_ops.name : 'Procedure';
                const sowName = pigProduction.sow ? pigProduction.sow.name : 'Unknown Sow';
                const dateTarget = pigOps.date_target;
                
                let dateDisplay = '';
                if (dateTarget) {
                    const targetDate = new Date(dateTarget);
                    const today = new Date();
                    const daysRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
                    dateDisplay = ' in ' + daysRemaining + ' days';
                }
                
                html += '<div class="alert-item clickable" data-alert-key="' + alert.uniqueKey + '">';
                html += '<div class="alert-content">';
                html += '<div>';
                html += '<span class="alert-category alert-warning">Prepare Now</span>';
                html += '<span class="alert-title">' + pigOpsName + ' for ' + sowName + '</span>';
                html += '</div>';
                html += '<div class="alert-description">';
                html += 'Scheduled for ' + formatDate(new Date(dateTarget), FORMAT_COMPACT) + dateDisplay;
                html += '</div>';
                html += '<div class="alert-time">Prepare supplies in advance</div>';
                html += '</div>';
                html += '</div>';
            }
        }
        
        // If no alerts
        if (html === '') {
            html = '<div style="text-align: center; padding: 40px 20px;">';
            html += '<div style="font-size: 48px; margin-bottom: 16px;">🔔</div>';
            html += '<div style="font-size: 16px; color: #666;">No new notifications</div>';
            html += '</div>';
        }
        
        elemAlertModalBody.innerHTML = html;
        
        // Bind click handlers to alert items
        const alertItems = elemAlertModalBody.querySelectorAll('.alert-item.clickable');
        for (let k = 0; k < alertItems.length; k++) {
            const item = alertItems[k];
            item.addEventListener('click', function(event) {
                const alertKey = this.getAttribute('data-alert-key');
                let alert = null;
                for (let m = 0; m < dataAlertList.length; m++) {
                    if (dataAlertList[m].uniqueKey === alertKey) {
                        alert = dataAlertList[m];
                        break;
                    }
                }
                if (alert && alert.onClick) {
                    alert.onClick();
                }
            });
        }
    }
    
    this.onBillPaid = function(billReference) {
        this.removeAlertEntry(billReference);
    }
    
    this.onBillViewed = function(billReference) {
        this.markBillAsViewed(billReference);
    }
}
