// January 30, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PIG_PROD_TYPE,
        PIG_OPERATION_TYPE,
        SOW_STATUS,
        PROD_STATUS,
        SUPPLIER_TYPE,
        MEDVAC_TYPE}            from '../../constants.js';



function ManagerPigProd(input_settings){
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj
    
	
	
	this.dataPigProdGestating   = null;
    this.dataPigProdLactating   = null;
    this.dataPigProdFattening   = null;
    
	
	this.setDataPigProdList = function(data){
        thisObj.dataPigProdGestating   = [];
        thisObj.dataPigProdLactating   = [];
        thisObj.dataPigProdFattening   = [];
        
        
        for(const cur_entry of data){
            
            
            switch (cur_entry.pig_production.prod_status_id){
            
                case PROD_STATUS.GESTATING: {
                    thisObj.dataPigProdGestating.push(cur_entry);
                    break;
                }
                
                case PROD_STATUS.LACTATING: {
                    thisObj.dataPigProdLactating.push(cur_entry);
                    break;
                }
                
                case PROD_STATUS.WEANING:
                case PROD_STATUS.GROWING:{
                    thisObj.dataPigProdFattening.push(cur_entry);
                }
            
            }
        } 
        
    }
    
    
	this.getDataPigProd = function(pig_prod_type, pig_prod_hid){
        let pig_prod_list = null;
        
        switch(pig_prod_type){
            case PIG_PROD_TYPE.GESTATING: {
                pig_prod_list = thisObj.dataPigProdGestating;
                break;
            }
            case PIG_PROD_TYPE.LACTATING:{
                pig_prod_list = thisObj.dataPigProdLactating;
                break;
            }
            case PIG_PROD_TYPE.FATTENING:{
                pig_prod_list = thisObj.dataPigProdFattening;
                break;
            }
        }
        
        
        for (const cur_entry of pig_prod_list){
            if (cur_entry.pig_production.his == pig_prod_hid){
                return cur_entry;
            }
        }
        
        return null;
    }
    
	
	
    this.requestPigProdList = function(pig_prod_type, callback_success, 
            elem_show_error){
        
        // Note: There is a difference between PIG_PROD_TYPE and PROD_STATUS
        // constants.
        
        
        
        const cur_pig_farm_hid  = navigation.userControl.getCurrentFarmHid()
        
        const is_mob_view = 1; // TODO for desktop view
        
        const base_url = window.location.origin;
        const url = `${base_url}/pig_prod/list?pfhid=${cur_pig_farm_hid}&pig_prod_type=${pig_prod_type}&is_mob_view=${is_mob_view}`;
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
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
    
    
    
    this.requestPigProdEntry = function(pig_prod_hid, callback_success, 
            elem_show_error){
        
        const base_url = window.location.origin;
        let url = `${base_url}/pig_prod/entry/${pig_prod_hid}`;
        
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
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
 
    
    
    this.requestPigOpsEntry = function(data_pig_prod, prod_pig_ops_list,
            pig_prod_pig_ops_hid, callback_success, elem_show_error){
        
        const base_url = window.location.origin;
        let url = `${base_url}/pig_prod_pig_ops/entry/${pig_prod_pig_ops_hid}`;
        
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            async: true,
  
            beforeSend: function(){
                if (elem_show_error){
                    elem_show_error.style.display = 'none';
                }
            },
  
            success: function(response){
                if (response.result.num == 0){
                    
                    // Need to replace the pig_ops from the database
                    
                    if (prod_pig_ops_list){
                        let index = 0;
                        let cur_entry;
                        
                        for (index = 0; index < prod_pig_ops_list.length; index++){
                            cur_entry = prod_pig_ops_list[index];
                            
                            if (cur_entry.pig_prod_pig_ops.hid == pig_prod_pig_ops_hid){
                                prod_pig_ops_list.splice(index, 1, response.data);
                            }
                        }
                    }
                    
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
 
    
    
    this.requestNotesList = function(data_pig_prod, callback_success, 
            elem_show_error){
        
        const pig_prod_hid = data_pig_prod.pig_production.hid;
        
        const base_url = window.location.origin;
        let url = `${base_url}/pig_prod_notes/list?pig_prod_hid=${pig_prod_hid}`;
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            async: true,
  
            beforeSend: function(){
                if (elem_show_error){
                    elem_show_error.style.display = 'none';
                }
            },
  
            success: function(response){
                
                if (response.result.num == 0){
                    
                    data_pig_prod.data_details.list_notes = response.data;
                    
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
    
	
	/* Will remove pig_prod_entry from given prod_list.
    * @param prod_list - either 
        this.dataPigProdGestating
        this.dataPigProdLactating
        this.dataPigProdFattening
    
    
    */
    this.removeFromProdList = function(pig_prod_hid, prod_list){
        let index;
        let cur_entry;
        
        for(index = 0; index<prod_list.length; index++){
            cur_entry = thisObj.dataPigProdGestating[index];
            
            if (cur_entry.pig_production.hid == pig_prod_hid){
                prod_list.splice(index, 1);
                return;
            }
        }
    }
    
    
    this.replaceInProdList = function(pig_prod_hid, prod_list, new_prod_entry){
        let index;
        let cur_entry;
        
        for(index = 0; index<prod_list.length; index++){
            cur_entry = thisObj.dataPigProdGestating[index];
            
            if (cur_entry.pig_production.hid == pig_prod_hid){
                prod_list.splice(index, 1, new_prod_entry);
                return;
            }
        }
    }
    
    
    
}
