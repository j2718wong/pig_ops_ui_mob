// December 18, 2025
// Jack Wong
// j2718wong@gmail.com
'use strict';


import {APPLICATION}            from '../../constants.js';


export function ManagerPublicData(_navigation){
    const thisObj           = this;
    const navigation        = _navigation;
    
    
    this.dataFeedTypeList   = null;
    
    // This is all feed brands available in the Pig Farm country_hid
    this.dataFeedBrandList  = null;
    
    
    // This will be ordered by what? for faster search
    this.dataMedVacBrandList = null;
    
    // This will be ordered by what? for faster search
    this.dataMedVacTypeList  = null;
    
    
    this.dataHarvestTypeList = null;
    
    
    this.requestDataFeedType = function(callback_success, elem_show_error){
        
        // Need to request feed brands
        const base_url = window.location.origin;
        const url = `${base_url}/lookup/feed_type/list`;
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            beforeSend: function(){
                
            },
  
            success: function(response){
                if (response.result.num == 0){
                    thisObj.dataFeedTypeList = response.data;
                    
                    if (callback_success){
                        callback_success(response.data);
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
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
    }
    
    
    this.requestDataFeedBrand = function(callback_success, elem_show_error){
        // Get the country hid of the pig farm account
        const country_hid = navigation.pigFarm.getCountryHid();
        
        // Need to request feed brands
        const base_url = window.location.origin;
        const url = `${base_url}/feed_brand/list?country_hid=${country_hid}`;
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            beforeSend: function(){
                
            },
  
            success: function(response){
                if (response.result.num == 0){
                    thisObj.dataFeedBrandList = response.data;
                    
                    if (callback_success){
                        callback_success(response.data);
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
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
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
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            beforeSend: function(){
                
            },
  
            success: function(response){
                if (response.result.num == 0){
                    thisObj.dataMedVacBrandList = response.data;
                    
                    if (callback_success){
                        callback_success(response.data);
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
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
    }
    
    
    this.requestDataMedVacType = function(callback_success, elem_show_error){
        
        // Need to request medvac brands
        const base_url = window.location.origin;
        const url = `${base_url}/medvac_type/list`;
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            beforeSend: function(){
                
            },
  
            success: function(response){
                if (response.result.num == 0){
                    thisObj.dataMedVacTypeList = response.data;
                    
                    if (callback_success){
                        callback_success(response.data);
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
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
    }
    
    
    this.requestDataSemenSupplierSemen = function(supplier_hid, callback_success, 
                elem_show_error){
        
        const base_url = window.location.origin;
        const url = `${base_url}/semen_sup_semen/list?semen_supplier_hid=${supplier_hid}`;
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    if (callback_success) {callback_success(response.data);}
                }
                else {
                    navigation.serverError.receivedErrorMessage(
                        response, elem_show_error);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
    }
    
    
    this.requestDataHarvestType = function(callback_success, elem_show_error){
        
        // Need to request feed brands
        const base_url = window.location.origin;
        const url = `${base_url}/lookup/harvest_type/list`;
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            beforeSend: function(){
                
            },
  
            success: function(response){
                if (response.result.num == 0){
                    thisObj.dataFeedTypeList = response.data;
                    
                    if (callback_success){
                        callback_success(response.data);
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
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
    }
    
    
    
    
}


