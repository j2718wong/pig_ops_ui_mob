// December 24, 2025
// Jack Wong
// j2718wong@gmail.com

"use strict";


import {Field, 
        ModelBasic}             from './model_basic.js';


ModelAccountPigOps.prototype = new ModelBasic();
export function ModelAccountPigOps(){
    const thisObj                 = this;
    
    ModelBasic.call(this);
    
    this.versionNum             = 0;

    this.fieldNumDaysSince      = new Field();
    this.fieldName              = new Field();
    this.fieldShortName         = new Field();
    this.fieldDescription       = new Field();
   
   
    this.fieldNumDaysSince      .setValidation({isNumeric: true, isPositiveInt: true, cannotBeZero: true});
    this.fieldName              .setValidation({cannotBeEmptyStr: true});
    this.fieldDescription       .setValidation({cannotBeEmptyStr: true});
    
    
    this.fieldName              .maxStrLen  = 20;
    this.fieldShortName         .maxStrLen  = 15;
    this.fieldDescription       .maxStrLen  = 160;
    
    
    this.editableFields         .push(this.fieldNumDaysSince);
    this.editableFields         .push(this.fieldName);
    this.editableFields         .push(this.fieldShortName);
    this.editableFields         .push(this.fieldDescription);
    
    
    
    /**
     * 
     */
    this.setData                = function(json){
        var acc_pig_ops         = json["acc_pig_ops"];
        
        this.hid                = acc_pig_ops["hid"];
        
        var last_update         = null;
        var added_by            = null;
        var name_last           = null;
        var name_first          = null;
        var dt_update           = null;
        
        if ('last_update' in json){
            last_update         = json["last_update"];
            name_last           = last_update["name_last"];
            name_first          = last_update["name_first"];
            dt_update           = last_update["dt_update"];
        }
        
        if (dt_update == null) {
            if ('added_by' in json){
                added_by            = json["added_by"];
                name_last           = added_by["name_last"];
                name_first          = added_by["name_first"];
                dt_update           = added_by["dt_entry"];
            }
        }
        
        if (name_first == null && name_last == null){
            this.lastUpdateBy   = 'System Default';
        }
        else{
            this.lastUpdateBy       = name_first + ' ' + name_last;
        }
        
        this.lastUpdate         = dt_update;
        
        if (this.lastUpdateBy   == null){this.lastUpdateBy = '';}
        this.fieldLastUpdateBy  .setValue(this.lastUpdateBy);
        
        
        this.versionNum         = acc_pig_ops["version_num"];
        this.fieldNumDaysSince  .setValue(acc_pig_ops["num_days_since"]);
        this.fieldName          .setValue(acc_pig_ops["name"]);
        this.fieldShortName     .setValue(acc_pig_ops["short_name"]);
        this.fieldDescription   .setValue(acc_pig_ops["desc"]);
    }

}
