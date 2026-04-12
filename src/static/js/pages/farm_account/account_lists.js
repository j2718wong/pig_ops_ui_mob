// January 7, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION, 
        SUPPLIER_TYPE}          from '../../constants.js';


export function AccountLists(_navigation){
    const thisObj               = this;
    const navigation            = _navigation;
    
    
    this.dataVerNum             = {
        gestating_ops:          0,        
        lactating_piglets_ops:  0,
        lactating_sow_ops:      0,    
        gilt_ops:               0,             
        weaning_sow_ops:        0,      
        
        account:                0,
        pig_buyer:              0             
       
    };
    
    
    
    this.dataUserList           = null;
    
    
    this.dataSemenSupplierList  = null;
    this.dataFeedSupplierList   = null;
    this.dataGiltSupplierList   = null;
    
    this.dataAccMedVacList      = null;
    
    this.dataAccPigBuyerList    = null;
    this.dataAccBoarCustomerList= null;
    
    
    let accountHid      = null;
    
    
    this.setPigFarmAccountHid = function(hid){
        accountHid = hid;
    }
    
    
    this.requestAccountDataVerNum = function(callback_success, elem_show_error){
        const base_url = window.location.origin;
        let url = `${base_url}/account/data_ver_num?ahid=${accountHid}&r=1`;
        
        
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
                navigation.serverError.serverErrorThrown(jqXHR, 
                    textStatus, errorThrown);
            }
        });
        
    }
    
    
    this.requestDataUserList = function(callback_success, elem_show_error){
        
        const base_url = window.location.origin;
        const url = `${base_url}/user/list?ahid=${accountHid}`;
        
        
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
                    thisObj.dataUserList = response.data;
                    
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
    
 
    this.requestDataAccessCodeList = function(callback_success, elem_show_error){
        
        const base_url = window.location.origin;
        const url = `${base_url}/access_code/list?ahid=${accountHid}`;
        
        
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
    
 
    this.requestDataJoinAccReqList = function(callback_success, elem_show_error){
        
        const base_url = window.location.origin;
        const url = `${base_url}/user_request/list?ahid=${accountHid}`;
        
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
    
  
    this.requestDataSupplier = function(supplier_type, callback_success, elem_show_error){
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
    
    
    this.requestDataAccMedVac = function(callback_success, elem_show_error){
        
        const base_url = window.location.origin;
        const url = `${base_url}/account_medvac/list?ahid=${accountHid}`;
        
        
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
                    thisObj.dataAccMedVacList = response.data;
                    
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
    
    
    this.requestDataAccPigBuyer = function(callback_success, elem_show_error){
        const base_url = window.location.origin;
        const url = `${base_url}/account_pig_buyer/list?ahid=${accountHid}`;
        
        
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
                    
                    const acc_boar_customer = []
                    
                    for (const cur_entry of response.data){
                        if (cur_entry.pig_buyer.is_boar_customer > 0){
                            acc_boar_customer.push(cur_entry);
                        }
                    }
                    
                    // Boar customer can be also considered pig buyer
                    thisObj.dataAccPigBuyerList = response.data; 
                    
                    // There is also a dedicated list for just boar customer
                    thisObj.dataAccBoarCustomerList = acc_boar_customer;
                    
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
