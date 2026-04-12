// April 12, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION}                from '../../constants.js';



export function ManagerBusiness(_navigation) {
    const thisObj                   = this;
    const navigation                = _navigation;
    
    
    this.requestDataPricing = function(callback_success, 
            elem_show_error){
        
        
        
        
        
        // Get the country_hid of the account
        //const country_hid = navigation.pigFarm.
        
        const base_url = window.location.origin;
        let url = `${base_url}/b/pricing/current?chid=${country_hid}`;
        
        
        const bearer_token = localStorage.getItem('access_token');
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            beforeSend: function(){
                if (elem_show_error){
                    elem_show_error.style.display = 'none';
                }
            },
  
            success: function(response){
                if (response.result.num == 0){
                    const country_data = response.data;
                    
                    if (country_data.report_languages){
                        const report_languages = country_data.report_languages.split(',');
                        
                        thisObj.reportLanguageOptions = [];
                        for (let cur_entry of report_languages){
                            const cur_key = cur_entry.trim();
                            const cur_value = REPORT_LANGUAGE[cur_key];
                            
                            if (cur_value){
                                thisObj.reportLanguageOptions.push({
                                    key: cur_key, value:  cur_value
                                });
                            }
                        }
                        
                        if (thisObj.reportLanguageOptions.length == 0){
                            thisObj.reportLanguageOptions.push({
                                key: 'en', value:  'English'
                            });
                        }
                        

                        
                    }
                    else{
                        thisObj.reportLanguageOptions = [];
                        thisObj.reportLanguageOptions.push({
                            key: 'en', value:  'English'
                        });
                    }
                    
                }
                else {
                    navigation.serverError.receivedErrorMessage(
                        response, elem_show_error);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, 
                    textStatus, errorThrown);
            }
        });
        
    }
 
    
    

}



