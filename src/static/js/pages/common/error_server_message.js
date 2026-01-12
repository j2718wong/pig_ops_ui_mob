// January 12, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {PAGE_ID,
        REQUEST_ERROR_NUM}      from '../constants.js';
        

function ErrorServerMessage(_navigation){
    const thisObj               = this;
    const navigation            = _navigation;
    
    
    this.receivedErrorMessage = function(response, elem_show_error){
        let error_code = response.result.code;
        let error_desc = response.result.desc;
        
        if (elem_show_error) {
            let html;
            html = `<span>${error_code}</span>`;
            
            if (error_desc && error_desc.length > 0){
                html += `<span>${error_desc}</span>`;
            }
            
            
            elem_show_error.innerHTML = html;
            elem_show_error.style.display = 'block'
        }
        
        // Check special error numbers;
        // These will open to a new page
        switch (response.result.num){
            case REQUEST_ERROR_NUM.ERROR_USER_INACTIVE: {
                navigation.userControl.setUserIsEnabled(false);
                navigation.showThisPage(null); // reroute page
                return;
            }
            
            case REQUEST_ERROR_NUM.ERROR_ACCOUNT_DISABLED: {
                navigation.userControl.setUserAccountIsEnabled(false);
                navigation.showThisPage(null); // reroute page
                return;
            }
            
            case REQUEST_ERROR_NUM.ERROR_ACCOUNT_BILL_OVERDUE: {
                const due_bill_hid = response.result.due_bill_hid;
                navigation.pigFarm.setPigFarmAccountHasUnpaidBill(due_bill_hid);
                
                // Check if current user is company support, marketing related users
                if (navigation.userControl.isUserCompanyUser() == false){
                    navigation.showThisPage(null); // reroute page
                }
                break;
            } 
        }
    }
    
}