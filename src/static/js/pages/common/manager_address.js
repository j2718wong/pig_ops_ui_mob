// December 18, 2025
// Jack Wong
// j2718wong@gmail.com
'use strict';

export function ManagerAddress(_navigation){
    const thisObj           = this;
	const navigation 		= _navigation;
	
    
    // This will be ordered by what? for faster search
    let addressLevel1List   = null;

    
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
    
    
    this.getLevel2 = function(address_level_1){
        if ('level2' in address_level_1){
            return address_level_1.level2;
        }
        
        return null;
    }
    
    
    this.setLevel2 = function(address_level_1, data){
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
  
    
    this.getLevel3 = function(address_level_2){
        if ('level3' in address_level_2){
            return address_level_2.level3;
        }
        
        return null;
    }
    
    
    this.setLevel3 = function(address_level_2, data){
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
    
    
    this.requestDataAddressLevel1 = function(country_hid){
        // Need to request address level list
        const base_url = window.location.origin;
        const url = `${base_url}/address/level_1/list?country_hid=${country_hid}`;
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            async: true,
  
            beforeSend: function(){
                
            },
  
            success: function(response){
                if (response.result.num == 0){
                    // Set managerAddress.setAddressLevel1List
                    thisObj.setAddressLevel1List(response.data);
                  
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
    
    
	this.requestAddressLevel2Data = function(address_level_1, callback_on_success){ 
        const level_1_hid = address_level_1.hid;
        
        // Need to request address level list
        let url = gController.getBaseUrl();
        url += '/address/level_2/list?level_1_hid=' + level_1_hid;
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            async: true,
  
            beforeSend: function(){
                
            },
  
            success: function(response){
                if (response.result.num == 0){
                   
                    // Set address_level_1.level2 data; 
                    thisObj.setLevel2(address_level_1, response.data);
                                        
                    if (callback_on_success){
                        callback_on_success(response.data);
                    }
                    
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
    
	
	this.requestAddressLevel3Data = function(address_level_2, callback_on_success){
        const level_2_hid = address_level_2.hid;
        
        // Need to request address level list
        let url = gController.getBaseUrl();
        url += '/address/level_3/list?level_2_hid=' + level_2_hid;
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            async: true,
  
            beforeSend: function(){
                
            },
  
            success: function(response){
                if (response.result.num == 0){
                    // Set address_level_2.level3 data; 
                    thisObj.setLevel3(address_level_2, response.data);
                    
                    if (callback_on_success){
                        callback_on_success(response.data);
                    }
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