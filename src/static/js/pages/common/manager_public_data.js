// December 18, 2025
// Jack Wong
// j2718wong@gmail.com
'use strict';

export function ManagerPublicData(_navigation){
    const thisObj           = this;
    const navigation        = _navigation;
    
    
    
    // This will be ordered by what? for faster search
    let medVacBrandList     = null;
    
    // This will be ordered by what? for faster search
    let medVacTypeList      = null;
    
    
    
    this.getMedVacBrandList  = function(){
        return medVacBrandList;
    }
    
    
    this.getMedVacTypeList  = function(){
        return medVacTypeList;
    }
    
    
    
    this.requestDataMedVacBrand = function(callback_success, elem_show_error){
        // Get the country hid of the pig farm account
        const country_hid = navigation.pigFarm.getCountryHid();
        
        // Need to request medvac brands
        const base_url = window.location.origin;
        const url = `${base_url}/medvac_brand/list?country_hid=${country_hid}`;
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            async: true,
  
            beforeSend: function(){
                
            },
  
            success: function(response){
                if (response.result.num == 0){
                    medVacBrandList = response.data;
                    
                    if (callback_success){
                        callback_success(response.data);
                    }
                }
                else {
                    navigation.errorServerMessage.receivedErrorMessage(
                        response, elem_show_error);
                    
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                gfRequestError(jqXHR, textStatus, errorThrown, gController.getAppName());
            }
        });
    }
    
    
    this.requestDataMedVacType = function(callback_success, callback_erorr){
        
        // Need to request medvac brands
        const base_url = window.location.origin;
        const url = `${base_url}/medvac_type/list`;
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            async: true,
  
            beforeSend: function(){
                
            },
  
            success: function(response){
                if (response.result.num == 0){
                    medVacTypeList = response.data;
                    
                    if (callback_success){
                        callback_success(response.data);
                    }
                }
                else {
                    navigation.errorServerMessage.receivedErrorMessage(
                        response, elem_show_error);
                    
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                gfRequestError(jqXHR, textStatus, errorThrown, gController.getAppName());
            }
        });
    }
}