// December 18, 2025
// Jack Wong
// j2718wong@gmail.com
'use strict';

import {APPLICATION}        from '../../constants.js';


export function ManagerAddress(_navigation){
    const thisObj           = this;
    const navigation        = _navigation;
    
    this.STORAGE_KEY        = 'superpig_manager_address';
    
    
    // This will be ordered by what? for faster search
    let addressLevel1List   = null;


    let curCountry          = null;
    
    
    this.getDataToSaveToStorage = function(){
        return {
            level1List:         addressLevel1List,
            curCountry:         curCountry
        }
    }
    
    
    
    this.saveToStorage = function() {
        const data = thisObj.getDataToSaveToStorage();
        localStorage.setItem(thisObj.STORAGE_KEY, JSON.stringify(data));
    }


    
    this.loadDataFromStorage = function(){
        const cached = localStorage.getItem(thisObj.STORAGE_KEY);
        if (cached) {
            const data = JSON.parse(cached);
            
            addressLevel1List               = data.level1List;
            curCountry                      = data.curCountry;
        }
    }
    
    
    this.setCurCountry      = function(country){
        curCountry = country;
        
        let to_request_level_1 = 1;
        
        const cached = localStorage.getItem(thisObj.STORAGE_KEY);
        if (cached) {
            const data = JSON.parse(cached);
            
            // Same country as saved in local storage;
            if (curCountry.hid == data.curCountry.hid){
            
                addressLevel1List   = data.level1List;
                
                to_request_level_1  = 0;
            }
        }
        
        if (to_request_level_1 > 0) {
            thisObj.requestDataAddressLevel1(curCountry.hid);
        }
        
    }
    
    
    this.getCurCountry  = function(){
        return curCountry;
    }
    
    
    this.getAddressLevel1List  = function(){
        return addressLevel1List;
    }
    
    
    this.setAddressLevel1List  = function(data){
        addressLevel1List  = data;
    } 
    
    
    this.getAddressLevel1 = function(level_1_hid){
        let index;
        let cur_entry;
        
        for (index = 0; index < addressLevel1List.length; index++){
            cur_entry = addressLevel1List[index];
            if (cur_entry.hid == level_1_hid){return cur_entry;}
        }
        return null;
    }
    
    
    this.getLevel2Addresses = function(address_level_1){
        if ('level2' in address_level_1){
            return address_level_1.level2;
        }
        
        return null;
    }
    
    
    this.setLevel2Addresses = function(address_level_1, data){
        address_level_1.level2 = data;
    }
    
    
    this.getAddressLevel2 = function(address_level_1, level_2_hid){
        
        if ('level2' in address_level_1){
            
            let level2 = address_level_1.level2;
            
            let index;
            let cur_entry;
    
    
            for (index = 0; index < level2.length; index++){
                cur_entry = level2[index];
                if (cur_entry.hid == level_2_hid){return cur_entry;}
            }
        }
        return null;
    }
  
    
    this.getLevel3Addresses = function(address_level_2){
        if ('level3' in address_level_2){
            return address_level_2.level3;
        }
        
        return null;
    }
    
    
    this.setLevel3Addresses = function(address_level_2, data){
        address_level_2.level3 = data;
    }
    
    
    this.getAddressLevel3 = function(address_level_2, level_3_hid){
        
        if ('level3_addresses' in address_level_2){
            
            let level3_addresses = address_level_2.level3_addresses;
            
            let index;
            let cur_entry;
    
    
            for (index = 0; index < level3_addresses.length; index++){
                cur_entry = level3_addresses[index];
                if (cur_entry.hid == level_2_hid){return cur_entry;}
            }
        }
        return null;
    }
    
    
    this.requestDataAddressLevel1 = function(country_hid, callback_success,
            elem_show_error){
        // Need to request address level list
        const base_url = window.location.origin;
        const url = `${base_url}/address/level_1/list?country_hid=${country_hid}`;
        
        
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
                
            },
  
            success: function(response){
                if (response.result.num == 0){
                    // Set managerAddress.setAddressLevel1List
                    thisObj.setAddressLevel1List(response.data);
                    
                    // Update local storage
                    thisObj.saveToStorage();
                  
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
    
    
    this.requestDataAddressLevel2 = function(address_level_1, callback_success, 
            elem_show_error){ 
        
        const level_1_hid = address_level_1.hid;
        
        // Need to request address level list
        const base_url = window.location.origin;
        const url = `${base_url}/address/level_2/list?level_1_hid=${level_1_hid}`;
        
        
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
                
            },
  
            success: function(response){
                if (response.result.num == 0){
                   
                    // Set address_level_1.level2 data; 
                    thisObj.setLevel2Addresses(address_level_1, response.data);
                    
                    // Update local storage
                    thisObj.saveToStorage();
                                        
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
    
    
    this.requestDataAddressLevel3 = function(address_level_2, callback_success,
            elem_show_error){
        const level_2_hid = address_level_2.hid;
        
        // Need to request address level list
        const base_url = window.location.origin;
        const url = `${base_url}/address/level_3/list?level_2_hid=${level_2_hid}`;
        
        
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
                
            },
  
            success: function(response){
                if (response.result.num == 0){
                    // Set address_level_2.level3 data; 
                    thisObj.setLevel3Addresses(address_level_2, response.data);
                    
                    // Update local storage
                    thisObj.saveToStorage();
                    
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
    
    
    this.requestDataSupplier = function(address_level_2, callback_success, 
            elem_show_error){ 
        
        
        const level_2_hid = address_level_2.hid;
        
        const base_url = window.location.origin;
        const url = `${base_url}/supplier/list?level_2_hid=${level_2_hid}`;
        
        
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
                
            },
  
            success: function(response){
                if (response.result.num == 0){
                   
                    // Set address_level_2.list_supplier data; 
                    address_level_2.list_supplier = response.data;
                    
 
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
    
    
    this.requestDataSupplierCountPerAddressLevel = function(supplier_type, 
            address_level_1, address_level_2, callback_success, elem_show_error){
        let param = '';
        
        switch (supplier_type){
            case SUPPLIER_TYPE.FEED:{
                param = 'is_fs';
                break;
            }
            
            case SUPPLIER_TYPE.SEMEN:{
                param = 'is_ss';
                break;
            }
            
            case SUPPLIER_TYPE.GILT:{
                param = 'is_gs';
                break;
            }
        }
        
        
        const base_url = window.location.origin;
        const url = `${base_url}/supplier/list?ahid=${accountHid}&${param}=1`;
        
        
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
            },
  
            success: function(response){
                if (response.result.num == 0){
                    
                    switch (supplier_type){
                        case SUPPLIER_TYPE.FEED:{
                            thisObj.dataFeedSupplierList = response.data;
                            break;
                        }
                        
                        case SUPPLIER_TYPE.SEMEN:{
                            thisObj.dataSemenSupplierList = response.data;
                            break;
                        }
                        
                        case SUPPLIER_TYPE.GILT:{
                            this.dataGiltSupplierList   = response.data;
                            break;
                        }
                    }
                    
                    
                    if (callback_success){callback_success(response.data);}
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
