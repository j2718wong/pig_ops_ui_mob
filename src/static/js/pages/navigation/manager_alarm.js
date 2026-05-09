// May 9, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        PAGE_ID,
        ACC_USER_GROUP}         from '../../constants.js';



export function ManagerAlarm(_navigation) {
    const thisObj               = this;
    const navigation            = _navigation;
        
        
    let elemAlertContainer      = null;
    let elemAlertCount          = null;
    
    
    let dataAlarmList           = [];
    
    
    this.init = function(){
        this.afterHtmlRender();
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements  = function(){
        
         
        elemAlertContainer             = document.getElementById('alertContainer');
        elemAlertCount                 = document.getElementById('alertCount');
        
    }
    
    
    
    this._processAfterHtmlRender = function(){}
    
    
    this._bindEventListeners = function(){}


    this.checkAndShowNotificationBell = function(){
        if (dataAlarmList.length == 0){
            elemAlertContainer.style.display = 'none';
        }
        else{
            elemAlertContainer.style.display = 'flex';
        }
    }


    this.checkIfToDisplayNewBillAlarm = function(){
        const account = navigation.userControl.dataUserAccount.account.account;
        
        const current_bill = account.current_bill;
        
        if (current_bill){
            // Check user role; only admin and manager should be alerted with 
            // the new bill
            
            const cur_user = navigation.userControl.dataUserAccount.user;
            const user_group_num = cur_user.user_group.group_num;
            
            if (user_group_num == ACC_USER_GROUP.ADMIN || 
                user_group_num == ACC_USER_GROUP.MANAGEMENT){
                
                const bill_reference = current_bill.bill_reference;
                
                // Check if this bill is already viewed by user
                const is_bill_viewed = navigation.userControl.isBillViewed(bill_reference);
            } 
            
        }
    }


}



