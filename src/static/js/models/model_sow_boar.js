// December 24, 2025
// Jack Wong
// j2718wong@gmail.com

"use strict";


import {Field, 
		ModelBasic}             from './model_master.js';


ModelSowBoar.prototype = new ModelBasic();
export function ModelSowBoar(){
    const thisObj               = this;
    
    ModelBasic.call(this);
        
    this.sowStatus              = '';
    
    this.birthProdId            = null;
    this.lastProdId             = 0;


    this.fieldSowBoarNumber     = new Field();
    this.fieldSowBoarName       = new Field();
    this.fieldBirthDate         = new Field();
    this.fieldIsExternal        = new Field();
    this.fieldIsProductionReady = new Field();
   
    
    this.fieldSowBoarNumber     .maxStrLen  = 10;
    this.fieldSowBoarName       .maxStrLen  = 20;
    this.fieldBirthDate         .maxStrLen  = 10;
    
    this.editableFields         .push(this.fieldSowBoarNumber);
    this.editableFields         .push(this.fieldSowBoarName);
    this.editableFields         .push(this.fieldBirthDate);
    this.editableFields         .push(this.fieldIsExternal);
    
    this.searchableFields       .push(this.fieldSowBoarNumber);
    this.searchableFields       .push(this.fieldSowBoarName);
    this.searchableFields       .push(this.fieldBirthDate);
    this.searchableFields       .push(this.fieldLastUpdateBy);
    
    
    
    /**
     * 
     */
    this.setData                = function(json){
        const sow_boar          = json["sow_boar"]
        
        this.id                 = sow_boar["farm_sow_id"] | sow_boar["farm_boar_id"]; // this cannot be both filled up
        this.birthProdId        = sow_boar["farm_birth_prod_id"] > 0? sow_boar["farm_birth_prod_id"] : null;
        this.hid                = sow_boar["hid"];
        this.sowStatus          = sow_boar["status"];
        this.lastProdId         = sow_boar["last_prod_id"];
        
        
        
        var last_update         = null;
        var added_by            = null;
        var name_last           = null;
        var name_first          = null;
        var dt_update           = null;
        
        last_update             = json["last_update"];
        name_last               = last_update["name_last"];
        name_first              = last_update["name_first"];
        dt_update               = last_update["dt_update"];
        
        if (dt_update == null) {
            added_by            = json["added_by"];
            name_last           = added_by["name_last"];
            name_first          = added_by["name_first"];
            dt_update           = added_by["dt_entry"];
        }
        
        this.lastUpdateBy       = name_first + ' ' + name_last;
        this.lastUpdate         = dt_update;
        
        if (this.lastUpdateBy   == null){this.lastUpdateBy = '';}
        this.fieldLastUpdateBy  .setValue(this.lastUpdateBy);
        
        
       
        
        if (sow_boar["number"]  == null){sow_boar["number"] = '';}
        if (sow_boar["name"]    == null){sow_boar["name"] = ''}
        
        this.fieldSowBoarNumber .setValue(sow_boar["number"]);
        this.fieldSowBoarName   .setValue(sow_boar["name"]);
        this.fieldBirthDate     .setValue(sow_boar["date_of_birth"]);
        this.fieldIsExternal    .setValue(sow_boar["is_external"]);
        
        
        
        
        if ("is_external" in sow_boar){
            this.fieldIsExternal    .setValue(sow_boar["is_external"]);
        }
        
        if ("is_production_ready" in sow_boar){
            this.fieldIsProductionReady     .setValue(sow_boar["is_production_ready"]);
        }
    }


}