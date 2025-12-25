// December 24, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {AddEntryProdGestating}      from './gestating_add_entry.js';




export function PageGestating(){
    const thisObj               = this;
    
    
    const settingsAddEntry ={
        parentObj:              this,
        elemUniqueKey:          'gestating',
        elemIdDivContainer:     'div-container-gestating-add-entry'
    }
    const addEntryGestating     = new AddEntryProdGestating(settingsAddEntry);
    
    
    var accountData             = null;
    
    
    this.init = function(){
        
        addEntryGestating.init();
        
        if (accountData == null){
            this._requestAccountData();
        }
        
        console.log(gController);
        
        this._test();
    }
    
    
    
    
    
    this._requestAccountData = function(){
        
    }
    
    
    
	this._test = function(){
		//this._testNoEntries();
		
		this._testWithEntries();
	}
    
    
    this._testNoEntries = function(){
        const sow_list = [];
        addEntryGestating.setSowList(sow_list);
        
        const boar_list = [];
        addEntryGestating.setBoarList(boar_list);
        
        const staff_list = [];
        addEntryGestating.setStaffList(staff_list);
    }
	
	
	this._testWithEntries = function(){
        const sow_list = G_SAMPLE_JSON_SOW_LIST;
        addEntryGestating.setSowList(sow_list);
        
        const boar_list =G_SAMPLE_JSON_BOAR_LIST;
        addEntryGestating.setBoarList(boar_list);
        
        const staff_list = G_SAMPLE_JSON_STAFF;
        addEntryGestating.setStaffList(staff_list);
    }
	
	
	
} 