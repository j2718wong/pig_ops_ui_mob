// January 30, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        PIG_PROD_TYPE,
        PIG_OPERATION_TYPE,
        SOW_STATUS,
        PROD_STATUS,
        SUPPLIER_TYPE,
        MULTIKEY_OBJ_TYPE}            from '../../constants.js';
        

export function ManagerSowBoar(input_settings){
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj
    
    this.STORAGE_KEY            = 'superpig_manager_sowboar';
    
    this.dataSowList            = null;
    this.dataGiltList           = null;
    this.dataBoarList           = null;
    
    
    // This is a number of piglets at weaning + currently lactating.
    // This includes both active sows and disposed sows.
    // This is requested at pig_farm level not at sow_level.
    this.dataFarmPigletsOutput  = null;
    
    
    // Boar external mates
    this.dataBoarExtMateList    = null;
    
    
    this.getDataToSaveToStorage = function(){
        return {
            sowList:            thisObj.dataSowList,
            giltList:           thisObj.dataGiltList,
            boarList:           thisObj.dataBoarList,
            
            farmPigLetsOutput:  thisObj.dataFarmPigletsOutput,
            boarExtMateList:    thisObj.dataBoarExtMateList
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
            
            thisObj.dataSowList             = data.sowList;
            thisObj.dataGiltList            = data.giltList;
            thisObj.dataBoarList            = data.boarList;
            thisObj.dataFarmPigletsOutput   = data.farmPigLetsOutput;
            
            thisObj.dataBoarExtMateList     = data.boarExtMateList;
        }
    }
    

    this.setDataSowList = function(data){
        // When this is set, the data includes the gilts (SOW_STATUS.GROWING)
        // Need to seperate gilts data  
        
        
        thisObj.dataSowList = []
        thisObj.dataGiltList = []
        
        let sow_boar = null;
        
        for (const cur_entry of data){
            if ('sow_boar' in cur_entry){
                sow_boar = cur_entry.sow_boar;
            }
            else{sow_boar = cur_entry;}
            
            if (sow_boar.status_id == SOW_STATUS.GROWING){
                if (sow_boar.is_production_ready > 0){
                    thisObj.dataSowList.push(cur_entry);
                }
                else{
                    thisObj.dataGiltList.push(cur_entry);
                }
            }
            else{
                thisObj.dataSowList.push(cur_entry);
            }
            
        }
        
    }
    
    
    this.setDataBoarList = function(data){
        thisObj.dataBoarList = data;
    }
    
    
    this.getDataSowBoar = function(sex, sow_boar_hid){
        let sow_boar_list  = thisObj.dataSowList;
        if (sex == 'M'){
            sow_boar_list  = thisObj.dataBoarList;
        }
        
        if (sow_boar_list == null){return null;}
        
        for (const cur_entry of sow_boar_list){
            if (cur_entry.sow_boar.hid == sow_boar_hid){return cur_entry}
        }
        return null;
    }
    
    
    this.requestSowBoarList = function(is_sow, callback_success, elem_show_error){
        const pig_farm_hid  = parentObj.getPigFarmHid();
        const sex           = is_sow? 'F':'M';


        // Need to request sow_boar list
        
        const base_url = window.location.origin;
        let url = `${base_url}/sow_boar/list?pfhid=${pig_farm_hid}&sex=${sex}`;
        
        if (is_sow == false){
            url += '&inc_external=1';
        }
        
        url += '&inc_user_audit=0';
        
        
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
                    if (is_sow){
                        thisObj.setDataSowList(response.data);
                    }
                    else{
                        thisObj.setDataBoarList(response.data);
                    }
                    
                    // Update local storage
                    thisObj.saveToStorage();
                    
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
    
    
    
    this.requestSowBoarEntry = function(sow_boar_hid, callback_success, 
            elem_show_error){
        
        const base_url = window.location.origin;
        const url = `${base_url}/sow_boar/entry/${sow_boar_hid}`;
        
        
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
                navigation.serverError.serverErrorThrown(jqXHR, 
                    textStatus, errorThrown);
            }
        });
        
    }
 
    
    
    this.requestSowBoarDataVerNum = function(data_sow_boar, callback_success, 
            elem_show_error){
        
        const sow_boar_hid = data_sow_boar.sow_boar.hid;
        
        const base_url = window.location.origin;
        const url = `${base_url}/sow_boar/data_ver_num?sow_boar_hid=${sow_boar_hid}`;
        
        
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
                    
                   
                }    
                else{
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
    
    
    // This is a request to get sow_boar details that returns tables.
    this.requestSowBoarDetails = function(data_sow_boar, callback_success, 
            elem_show_error){
        
        const sow_boar_hid = data_sow_boar.sow_boar.hid;
        
        const base_url = window.location.origin;
        const url = `${base_url}/sow_boar/data_details/${sow_boar_hid}`;
        
        
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
                    
                    // attach data to data_sow_boar
                    data_sow_boar.data_details = response.data;
                    
                    // Update local storage
                    thisObj.saveToStorage();
                    
                    if (callback_success){callback_success(response.data);}
                }    
                else{
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
    
    
    // Note sow_boar.notes and sow_boar.health_issue are merged together in
    // prod_notes table. There is a flag to tell if is  a health issue
    this.requestNotesList = function(data_sow_boar, callback_success, 
            elem_show_error){
        
        const sow_boar_hid = data_sow_boar.sow_boar.hid;
        
        const base_url = window.location.origin;
        const url = `${base_url}/pig_prod_notes/list?sow_boar_hid=${sow_boar_hid}`;
        
        
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
                    
                    // response.data is ORDERED BY date DESC
                    const health_issues = [];
                    const notes = [];
                    
                    for (const cur_entry of response.data){
                        if ('is_health_issue' in cur_entry.prod_notes){
                            health_issues.push(cur_entry);
                        }
                        else{
                            notes.push(cur_entry);
                        }
                    }
                    
                    data_sow_boar.data_details.list_health_issues = health_issues;
                    data_sow_boar.data_details.list_notes        = notes;
                    
                    // Update local storage
                    thisObj.saveToStorage();
                    
                    if (callback_success){callback_success(response.data);}
                }    
                else{
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
    

    this.requestFarmPigletsOutput = function(callback_success, elem_show_error){
        const pig_farm_hid  = parentObj.getPigFarmHid();
        
        const base_url = window.location.origin;
        let url = `${base_url}/pig_farm/piglets_output?pfhid=${pig_farm_hid}`;
        
        
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
                    thisObj.dataFarmPigletsOutput = response.data;
                    
                    // Update local storage
                    thisObj.saveToStorage();
                    
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


    this.replaceInSowBoarList = function(entry_hid, entry_list, new_entry){
        let index;
        let cur_entry;
        
        for(index = 0; index<entry_list.length; index++){
            cur_entry = entry_list[index];
            
            if (cur_entry.sow_boar.hid == entry_hid){
                entry_list.splice(index, 1, new_entry);
                return;
            }
        }
    }
    


    this.requestBoarExtMateList = function(callback_success, elem_show_error){
        
        const cur_pig_farm_hid  = navigation.userControl.getCurrentFarmHid()
        
        
        const base_url = window.location.origin;
        const url = `${base_url}/sow_boar_mate/list?pfhid=${cur_pig_farm_hid}&is_external=1`;
        
        
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
                    thisObj.dataBoarExtMateList = response.data;
                    
                    // Update local storage
                    thisObj.saveToStorage();
                    
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
    
    
    
    


}
