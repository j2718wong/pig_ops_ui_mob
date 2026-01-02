// December 24, 2025
// Jack Wong
// j2718wong@gmail.com

"use strict";


import {Field, 
        ModelBasic}             from './model_basic.js';



ModelPigProduction.prototype = new ModelBasic();
export function ModelPigProduction(){
    const thisObj               = this;
    
    ModelBasic.call(this);
    
        
    this.data                   = null;
    
    this.fieldBoarHid           = new Field();
    this.fieldInsemDate         = new Field();
    this.fieldSemenCost         = new Field();
    this.fieldInsemCost         = new Field();
    this.fieldInsemNotes        = new Field();
    this.fieldInsemStaffHid     = new Field();
    
    this.fieldBirthDate         = new Field();
    
    this.fieldWeanDate          = new Field();
    this.fieldWeanWeight        = new Field();
    
    this.fieldDateLactating     = new Field();
    this.fieldDateBooster       = new Field();
    this.fieldDatePrestarter    = new Field();
    this.fieldDateStarter       = new Field();
    this.fieldDateGrower        = new Field();
    this.fieldDateFinisher      = new Field();
    
    
    
    this.fieldInsemDate         .setValidation({cannotBeEmptyStr: true, isDateStr:true});
    this.fieldSemenCost         .setValidation({isNumeric: true});
    this.fieldInsemCost         .setValidation({isNumeric: true});
    
    this.fieldBirthDate         .setValidation({cannotBeEmptyStr: true, isDateStr:true});
    this.fieldWeanDate          .setValidation({isDateStr: true});
    //this.fieldWeanWeight      .setValidation({isNumeric: true});
    
    
    
    
    
    
    this.fieldInsemNotes        .maxStrByteLen  = 160;
    
    
    this.editableFields         .push(this.fieldBoarHid);
    this.editableFields         .push(this.fieldInsemDate);
    this.editableFields         .push(this.fieldSemenCost);
    this.editableFields         .push(this.fieldInsemCost);
    this.editableFields         .push(this.fieldInsemNotes);
    this.editableFields         .push(this.fieldInsemStaffHid);
    
    this.editableFields         .push(this.fieldBirthDate);
    
    
    
    
    /**
     * 
     */
    this.setData                = function(json){
        
        this.data               = json;
        this.hid                = json['pig_production']['hid'];
        
        const insemination = json['insemination'];
        
        if (insemination['insem_type'] == 'B'){
            this.fieldBoarHid.setValue(insemination['boar']['hid']);
        }
        else{
           
            var semen_cost = insemination['ai']['semen_cost'] || 0.0;
            this.fieldSemenCost     .setValue(semen_cost);
            
        }
        
        this.fieldInsemDate         .setValue(insemination['insem_date']);
        
        var insem_cost = insemination['insem_cost'] || 0.0;
        this.fieldInsemCost         .setValue(insem_cost);
        
        const insem_notes = insemination['insem_notes'];
        if (insem_notes != null){
            this.fieldInsemNotes        .setValue(insem_notes);
        }
        
        const insem_staff_hid = insemination['insem_staff_hid'];
        if (insem_staff_hid != null){
            this.fieldInsemStaffHid     .setValue(insem_staff_hid);
        }
        
        
        const change_feed = json['feeds']['date_change_feed'];
        
        
        this.fieldDateLactating     .setValue(change_feed.lactating);
        this.fieldDateBooster       .setValue(change_feed.booster);
        this.fieldDatePrestarter    .setValue(change_feed.prestarter);
        this.fieldDateStarter       .setValue(change_feed.starter);
        this.fieldDateGrower        .setValue(change_feed.grower);
        this.fieldDateFinisher      .setValue(change_feed.finisher);
    }

}

