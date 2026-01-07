// January 7, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PIG_PROD_TYPE,
		SUPPLIER_TYPE}          from '../../constants.js';


export function PigFarm(input_settings){
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    let pigFarmHid              = null;
    
    
    this.dataPigFarmAccount     = null;
    
    this.dataSowList            = null;
    this.dataBoarList           = null;
    this.dataStaffList          = null;
    
	
	
    
    this.setPigFarmHid = function(hid){
        pigFarmHid = hid;
    }
    
    
	this.setDataPigFarmAccount = function(data){
		thisObj.dataPigFarmAccount = data;
        
            
        if ('acc_pig_ops' in data){
            navigation.pageAccPigOps.setDataAccPigOps(data.acc_pig_ops);
        }
        else{
            if ('acc_gestating_ops' in data){
                navigation.pageAccPigOps.setDataAccPigOps(data.acc_gestating_ops);
            }
            
            if ('acc_lactating_piglets_ops' in data){
                navigation.pageAccPigOps.setDataAccPigOps(data.acc_lactating_piglets_ops);
            }
            
            if ('acc_lactating_sow_ops' in data){
                navigation.pageAccPigOps.setDataAccPigOps(data.acc_lactating_sow_ops);
            }
        }
        
        
        navigation.setDataStaffList(data.staff_list);
        navigation.setDataSowList(data.sow_list);
        navigation.setDataBoarList(data.boar_list);
            
            
        if ('pig_production' in data){
            navigation.setDataPigProdList(data.pig_production);
        }
        else{
            
            const pig_prod_type = PIG_PROD_TYPE.GESTATING + PIG_PROD_TYPE.LACTATING;
            thisObj.requestPigProdData(pig_prod_type, 
                navigation.setDataPigProdList);
        }
        
	}
	
	
    this.getSettingsOperations  = function(){
        if (thisObj.dataPigFarmAccount == null){return null;}
        return thisObj.dataPigFarmAccount.account.settings_operations;
    }
    
	
	this.requestPigProdData = function(pig_prod_type, callback){
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
            },
  
            success: function(response){
                if (response.result.num == 0){
                    if (callback){callback(response.data);}
                }
                else {
                    // TODO
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                gfRequestError(jqXHR, textStatus, errorThrown, gController.getAppName());
            }
        });
        
    }
    
    
    this.requestSowBoar = function(is_sow, callback){

        const sex               = is_sow? 'F':'M';


        // Need to request sow_boar list
        
        const base_url = window.location.origin;
        let url = `${base_url}/sow_boar/list?pfhid=${pigFarmHid}`;
        url += `&sex=${sex}&is_production_ready=1`;
        
        if (is_sow == false){
            url += '&inc_external=1';
        }
        
        url += '&inc_user_audit=0';
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            async: true,
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    if (is_sow){
                        navigation.setDataSowList(response.data);
                    }
                    else{
                        navigation.setDataBoarList(response.data);
                    }
                    
                    if (callback){callback(response.data);}
                }
                else {
                    // TODO
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