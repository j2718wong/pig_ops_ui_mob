// account_lists.js

// January 7, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION, 
        SUPPLIER_TYPE,
        DATA_VER_NUM_ACCOUNT}          from '../../constants.js';


const MAX_SECONDS_REQUEST_DATA_VER_NUM   = 60;

export function AccountLists(input_settings){
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj
    
    this.STORAGE_KEY            = 'superpig_manager_account_list';
    
    this.dataVerNum             = {
        gestating_ops:          0,        
        lactating_piglets_ops:  0,
        lactating_sow_ops:      0,    
        gilt_ops:               0,             
        weaning_sow_ops:        0,      
        
        account:                0,
        pig_buyer:              0,             
        sow_due_checklist:      0
    };
    
    
    // This should be filled up in every successful dataVerNum request 
    this.lastDataVerNumReq = {
        seconds:                null,
        dataVerNum:             null
    };
    
    
    this.dataUserList           = null;
    
    
    this.dataSemenSupplierList  = null;
    this.dataFeedSupplierList   = null;
    this.dataGiltSupplierList   = null;
    
    this.dataAccMedVacList      = null;
    
    this.dataAccPigBuyerList    = null;
    this.dataAccBoarCustomerList= null;
    this.dataAccSowDueChecklist = null;
    
    
    let accountHid      = null;
    
    
    this.setPigFarmAccountHid = function(hid){
        accountHid = hid;
    }
    
    
    this.getDataToSaveToStorage = function(){
        return {
            verNum:                 thisObj.dataVerNum,
            accSowDueChecklist:     thisObj.dataAccSowDueChecklist     
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
            
            thisObj.dataVerNum                  = data.verNum;
            
            thisObj.dataAccSowDueChecklist      = data.accSowDueChecklist;
            
                            
        }
    }
    
    
    
    this.requestAccountDataVerNum = function(callback_success, callback_offline, 
            elem_show_error){
                
        // Check if there was a previous request result
        if (thisObj.lastDataVerNumReq.seconds){
            const seconds   = Math.floor(Date.now() / 1000);
            const delta     = seconds - thisObj.lastDataVerNumReq.seconds;
            
            if (delta < MAX_SECONDS_REQUEST_DATA_VER_NUM){
                // If within this range there is expected no data change;
                // So return old result to minimize server request
                
                if (callback_success){
                    callback_success(thisObj.lastDataVerNumReq.dataVerNum);
                }
                
                return;
            }
        }
        
                
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
                    const seconds = Math.floor(Date.now() / 1000);
                    
                    thisObj.lastDataVerNumReq.seconds = seconds;
                    thisObj.lastDataVerNumReq.dataVerNum = response.data;
                    
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
                // Check if Offline
                if (navigation.managerSystem.isOffLine){
                    if (callback_offline) {callback_offline();}
                    return;
                }
                
                navigation.serverError.serverErrorThrown(jqXHR, 
                    textStatus, errorThrown);
            }
        });
        
    }
    
    
    this.checkServerDataUpdate = function(index_data_ver_num, 
            callback_request_server_data){
        
        // Request Server version num
        const callback_success = function(data){
            const cur_gesta_ops             = data[0];
            const cur_lacta_piglets_ops     = data[1];
            const cur_lacta_sow_ops         = data[2];
            const cur_gilt_ops              = data[3];
            const cur_weaning_sow_ops       = data[4];
                    
            const cur_account               = data[5];
            const cur_pig_buyer             = data[6];
            const cur_sow_due_checklist     = data[7];
           

            switch(index_data_ver_num){
                
                case DATA_VER_NUM_ACCOUNT.GESTA_OPS: {
                    if (cur_gesta_ops > thisObj.dataVerNum.gestating_ops){
                        if (callback_request_server_data){
                            callback_request_server_data();
                        }
                    }

                    break;
                }
                
                case DATA_VER_NUM_ACCOUNT.LACTA_PIGLETS_OPS:{
                    if (cur_lacta_piglets_ops > thisObj.dataVerNum.lactating_piglets_ops){
                        if (callback_request_server_data){
                            callback_request_server_data();
                        }
                    }

                    break;
                }
                             
                case DATA_VER_NUM_ACCOUNT.LACTA_SOW_OPS:{
                    if (cur_lacta_sow_ops > thisObj.dataVerNum.lactating_sow_ops){
                        if (callback_request_server_data){
                            callback_request_server_data();
                        }
                    }

                    break;
                }
                
                case DATA_VER_NUM_ACCOUNT.WEANING_SOW_OPS:{
                    if (cur_weaning_sow_ops > thisObj.dataVerNum.weaning_sow_ops){
                        if (callback_request_server_data){
                            callback_request_server_data();
                        }
                    }

                    break;
                }
                
                case DATA_VER_NUM_ACCOUNT.GILT_OPS:{
                    if (cur_gilt_ops > thisObj.dataVerNum.gilt_ops){
                        if (callback_request_server_data){
                            callback_request_server_data();
                        }
                    }

                    break;
                }
                         
                         
                case DATA_VER_NUM_ACCOUNT.SOW_DUE_CHECKLIST:{
                    if (cur_sow_due_checklist > thisObj.dataVerNum.sow_due_checklist){
                        if (callback_request_server_data){
                            callback_request_server_data();
                        }
                    }
                    break;
                }
               
            }
        };
        
        
        const callback_offline = function(){
            // nothing to do;
        };
        
        
        thisObj.requestAccountDataVerNum(callback_success, 
            callback_offline, null);
    }
    

    this.requestDataUserList = function(callback_success, callback_offline,
            elem_show_error){
        
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
                // Check if Offline
                if (navigation.managerSystem.isOffLine){
                    if (callback_offline) {callback_offline();}
                    return;
                }
                
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
    
    
    this.requestDataAccSowDueChecklist = function(callback_success, 
            callback_offline, elem_show_error){
        const base_url = window.location.origin;
        const url = `${base_url}/acc_sow_due_chklst?ahid=${accountHid}`;
        
        
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
                   
                    thisObj.dataAccSowDueChecklist = response.data;
                    
                    // Update thisObj.dataVerNum.sow_due_checklist
                    if (response.data_ver_num){
                        const ver_num = response.data_ver_num.account.sow_due_checklist;
                        thisObj.dataVerNum.sow_due_checklist = ver_num;
                    }
                    
                    // Update local storage
                    const key = navigation.managerLocalData.STORAGE_KEY.OPERATIONS.SOW_DUE_CHECKLIST;
                    const local_data = {
                        pig_farm_hid:   parentObj.getPigFarmHid(),
                        ver_num:        thisObj.dataVerNum.sow_due_checklist,
                        data:           thisObj.dataAccSowDueChecklist,
                        cached_at:      Date.now()
                    };
                    localStorage.setItem(key, JSON.stringify(local_data));
                    
                    
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
                // Check if Offline
                if (navigation.managerSystem.isOffLine){
                    if (callback_offline) {callback_offline();}
                    
                    return;
                }
                    
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
        
    }
    
}
