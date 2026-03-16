// January 12, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {PAGE_ID,
        REQUEST_ERROR_NUM}      from '../../constants.js';
        
        
export function debugElementVisibility(el) {
  
  if (!el) {
    console.error(`Element #${elementId} not found!`);
    return;
  }
  
  console.log('=== DEBUG ELEMENT VISIBILITY ===');
  console.log('innerHTML:', el.innerHTML);
  console.log('textContent:', el.textContent);
  console.log('outerHTML:', el.outerHTML);
  
  // Check styles
  const style = window.getComputedStyle(el);
  console.log('Display:', style.display);
  console.log('Visibility:', style.visibility);
  console.log('Opacity:', style.opacity);
  console.log('Width/Height:', style.width, style.height);
  console.log('Color/Background:', style.color, style.backgroundColor);
  
  // Check if in DOM
  console.log('Is connected:', el.isConnected);
  console.log('Parent:', el.parentElement);
  
  // Check for hidden attribute
  console.log('Hidden attribute:', el.hidden);
}

        

export function ServerError(_navigation){
    const thisObj               = this;
    const navigation            = _navigation;
    
    
    this.receivedErrorMessage = function(response, elem_show_error){
        let error_code = response.result.code;
        let error_desc = response.result.desc;
        
        let html = `<span>${error_code}</span>`;
        
        if (error_desc && error_desc.length > 0){
            html += `<br><span>${error_desc}</span>`;
        }
        
        if (elem_show_error) {
            // Display first before innerHTML
            elem_show_error.style.display = 'block'
            elem_show_error.innerHTML = html;
        }
        else{
            console.log('\n\nServerError.receivedErrorMessage(); elem_show_error is null');
            navigation.toastAlert.showToast('Oops something is wrong', html, 'error');
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
    
    
    this.serverErrorThrown = function(jqXHR, textStatus, errorThrown){
        console.log('\n\n\nServerError.serverErrorThrown');
        
        console.log('jqXHR')
        console.log(jqXHR)
        
        console.log('textStatus')
        console.log(textStatus)
        if (textStatus == 'timeout'){
            const title = navigation.managerPublicSections.dataCompanyApp.product_name;
            const msg = 'Cannot connect to server. Please check your network connection';
            navigation.toastAlert.showToast(title, msg, 'error', false);
        }
        
        
        console.log('errorThrown')
        console.log(errorThrown)
        
        
        
    }
    
}
