// January 2, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {replaceSelectOptions}   from './page_view_basic.js';

import {SOW_STATUS}             from '../../constants.js';
        
import {getSowBoarReference}    from './common_app.js'

        
export function CommonSelectOptions(){
    
    this.setDataSowList = function(data, select_elem, special_options){
        
        let select_data = [];
        if (data.length == 0){
            if (special_options){
                select_data.push({value:"0", text:"Please Select"});
                // do not use this
                //select_data.push(...special_options);
                for (const cur_option of special_options){select_data.push(cur_option);}
            }
            else{
                select_data.push({value:"-1", text:"No Entries"});
            }
            replaceSelectOptions(select_elem, select_data);
            return;
        }
        
        
        select_data.push({value:"0", text:"Please Select"});
        if (special_options){
            // do not use this
            // select_data.push(...special_options);
            for (const cur_option of special_options){select_data.push(cur_option);}
        }
        
        for (const cur_sow_boar of data){
            // This is because there is this data can come into
            // minimum and not minimum info.
            const cur_entry = ('sow_boar' in cur_sow_boar)? cur_sow_boar.sow_boar: cur_sow_boar;
            
            if (cur_entry.status_id == SOW_STATUS.GROWING ||
                cur_entry.status_id == SOW_STATUS.GESTATING ||
                cur_entry.status_id == SOW_STATUS.WEANING) {
            
                const sow_boar_name = getSowBoarReference(cur_entry, true);
                
                select_data.push({value: cur_entry.hid, text: sow_boar_name});
            }
        }
        

        replaceSelectOptions(select_elem, select_data);
    }
    
    
    this.setDataBoarList = function(data, select_elem, special_options){
        
        let select_data = [];
        if (!special_options) {
            if (data.length == 0){
                select_data.push({value:"-1", text:"No Entries"});
                replaceSelectOptions(select_elem, select_data);
                return;
            }
        }
        
        select_data.push({value:"0", text:"Please Select"});
        if (special_options){
            // do not use this
            // select_data.push(...special_options);
            for (const cur_option of special_options){select_data.push(cur_option);}
        }
        
        for (const cur_sow_boar of data){
            
            // This is because there is this data can come into
            // minimum and not minimum info.
            const cur_entry = ('sow_boar' in cur_sow_boar)? cur_sow_boar.sow_boar: cur_sow_boar;
            
            let sow_boar_name = getSowBoarReference(cur_entry, true);
            
            if (cur_entry.is_external && cur_entry.is_external > 0){
                sow_boar_name += ' (External)';
            }
            
            
            select_data.push({value: cur_entry.hid, text: sow_boar_name});
        }
        
        replaceSelectOptions(select_elem, select_data);
        
    }
    
    
    this.setDataSupplierList = function(data, select_elem){
        
        let select_data = [];
        if (data.length == 0){
            select_data.push({value:"-1", text:"No Entries"});
            replaceSelectOptions(select_elem, select_data);
            return;
        }
        
        
        select_data = [];
        select_data.push({value:"0", text:"Please Select"});
        
        for (const cur_entry of data){
            select_data.push({value: cur_entry.supplier.hid, 
                text: cur_entry.supplier.name});
        }
        
        replaceSelectOptions(select_elem, select_data);
    }
    
    
    this.setDataSemenTypeList = function(data, select_elem){
        
        let select_data = [];
        if (data.length == 0){
            select_data.push({value:"-1", text:"No Entries"});
            replaceSelectOptions(select_elem, select_data);
            return;
        }
        
        
        select_data = [];
        select_data.push({value:"0", text:"Please Select"});
        
        for (const cur_entry of data){
            select_data.push({value: cur_entry.hid, 
                text: cur_entry.name});
        }
        
        replaceSelectOptions(select_elem, select_data);
    }
    
    
    
    this.setDataStaffList = function(data, select_elem){
        
        let select_data = [];
        if (data.length == 0){
            select_data.push({value:"-1", text:"No Entries"});
            replaceSelectOptions(select_elem, select_data);
            return;
        }
        
        
        select_data = [];
        select_data.push({value:"0", text:"Please Select"});
        
        for (const cur_entry of data){
            select_data.push({value: cur_entry.pig_farm_staff.hid, 
                text: cur_entry.pig_farm_staff.name});
        }
        
        replaceSelectOptions(select_elem, select_data);
    }
    
    
    this.setDataMedVacBrand = function(data, select_elem){
        
        let select_data = [];
        if (data.length == 0){
            select_data.push({value:"-1", text:"No Entries"});
            replaceSelectOptions(select_elem, select_data);
            return;
        }
        
        
        select_data = [];
        select_data.push({value:"0", text:"Please Select"});
        
        for (const cur_entry of data){
            select_data.push({value: cur_entry.hid, 
                text: cur_entry.name});
        }
        
        replaceSelectOptions(select_elem, select_data);
    }
    
    
    this.setDataMedVacType = function(data, select_elem){
        
        let select_data = [];
        if (data.length == 0){
            select_data.push({value:"-1", text:"No Entries"});
            replaceSelectOptions(select_elem, select_data);
            return;
        }
        
        
        select_data = [];
        select_data.push({value:"0", text:"Please Select"});
        
        for (const cur_entry of data){
            select_data.push({value: cur_entry.hid, 
                text: cur_entry.name});
        }
        
        replaceSelectOptions(select_elem, select_data);
    }
    
    
    this.setDataAccMedVac = function(data, select_elem){
        
        let select_data = [];
        if (data.length == 0){
            select_data.push({value:"-1", text:"No Entries"});
            replaceSelectOptions(select_elem, select_data);
            return;
        }
        
        
        select_data = [];
        select_data.push({value:"0", text:"Please Select"});
        
        for (const cur_entry of data){
            select_data.push({value: cur_entry.acc_medvac.hid, 
                text: cur_entry.acc_medvac.name});
        }
        
        replaceSelectOptions(select_elem, select_data);
    }
    
    
    
    
    this.setDataAddressLevel = function(data, select_elem, special_options){
        
        let select_data = [];
        if (!special_options){
            if (data.length == 0){
                select_data.push({value:"-1", text:"No Entries"});
                replaceSelectOptions(select_elem, select_data);
                return;
            }
        }
        
        select_data = [];
        select_data.push({value:"0", text:"Please Select"});
        
        for (const cur_entry of data){
            select_data.push({value: cur_entry.hid, 
                text: cur_entry.name});
        }
        
        replaceSelectOptions(select_elem, select_data);
    }
    
    
    this.setDataFeedTypeList = function(data, select_elem){
        
        let select_data = [];
        if (data.length == 0){
            select_data.push({value:"-1", text:"No Entries"});
            replaceSelectOptions(select_elem, select_data);
            return;
        }
        
        
        select_data = [];
        select_data.push({value:"0", text:"Please Select"});
        
        for (const cur_entry of data){
            select_data.push({value: cur_entry.hid, 
                text: cur_entry.name});
        }
        
        replaceSelectOptions(select_elem, select_data);
    }
    
    
    this.setDataFeedBrandList = function(data, select_elem){
        
        let select_data = [];
        if (data.length == 0){
            select_data.push({value:"-1", text:"No Entries"});
            replaceSelectOptions(select_elem, select_data);
            return;
        }
        
        
        select_data = [];
        select_data.push({value:"0", text:"Please Select"});
        
        for (const cur_entry of data){
            select_data.push({value: cur_entry.hid, 
                text: cur_entry.name});
        }
        
        replaceSelectOptions(select_elem, select_data);
    }
    
}
