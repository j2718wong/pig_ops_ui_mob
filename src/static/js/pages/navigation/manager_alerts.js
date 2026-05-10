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
    
        
    let elemAlertContainer      = null;
    let elemAlertIcon           = null;
    let elemAlertCount          = null;
    
    let elemAlertModal          = null;
    let elemBtnClose            = null;
    let elemBtnCloseModal       = null;
    let elemAlertModalBody      = null;
    
    
    let dataAlertList           = [];
    
    
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
        
        // Close alert modal when clicking outside
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
        // make sure there is no duplicate
        
        let is_duplicate = 0;
        
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
        
        this.renderAlerts();
    }


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
        
        // Remove alert for this bill
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
            // Check user role; only admin and manager should be alerted
            const cur_user = navigation.userControl.dataUserAccount.user;
            let user_group_num = null;
            
            if (cur_user && cur_user.user_group) {
                user_group_num = cur_user.user_group.group_num;
            }
            
            if (user_group_num === ACC_USER_GROUP.ADMIN || 
                user_group_num === ACC_USER_GROUP.MANAGEMENT) {
                
                const bill_reference = current_bill.bill_reference;
                
                // Check if this bill is already viewed by user
                const is_bill_viewed = this.isBillViewed(bill_reference);
                
                if (!is_bill_viewed) {
                    const onclick_alert = function() {
                        // Mark as viewed when clicked
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
                        
                        // Close modal if open
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
            // If there is no current bill, remove any existing new bill alerts
            this.clearAlertsByType(ALERT_TYPE.NEW_BILL);
        }
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
        
        // Build alert modal content
        if (!elemAlertModalBody) {
            return;
        }
        
        let html = '';
        
        // Separate alerts by type for better organization
        const billAlerts = [];
        for (let i = 0; i < dataAlertList.length; i++) {
            if (dataAlertList[i].type === ALERT_TYPE.NEW_BILL) {
                billAlerts.push(dataAlertList[i]);
            }
        }
        
        // Critical Alerts section
        if (billAlerts.length > 0) {
            html += '<h3 style="color: var(--critical-color, #f44336); margin-bottom: 15px;">';
            html += '<i class="fas fa-exclamation-circle"></i> New Bills';
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
                
                const dueClass = isOverdue ? 'alert-critical' : 'alert-warning';
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
                    html += '<div class="alert-time">Issued: ' + formatDate(new Date(bill.date_issue), FORMAT_COMPACT) + '</div>';
                }
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



