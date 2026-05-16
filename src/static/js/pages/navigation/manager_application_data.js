// manager_application_data.js

// March 28, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION}                from '../../constants.js';


const REPORT_LANGUAGE = {
    'en':       'English',
    'ph-bis':   'Bisdak',
    'ph-tag':   'Tagalog'
};


export function ManagerApplicationData(_navigation) {
    const thisObj                   = this;
    const navigation                = _navigation;
    
    this.reportLanguageOptions      = null;
    
    
    this.dataApplication    = null;
    
    this.setDataCompanyApp = function(data){
        thisObj.dataApplication = data;
    }
    
    
    this.requestCountryDetails = function(country_hid, callback_success, 
            elem_show_error){
        
        
        const base_url = window.location.origin;
        let url = `${base_url}/country/details/${country_hid}`;
        
        
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
                    
                    if (callback_success){
                        callback_success();
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



