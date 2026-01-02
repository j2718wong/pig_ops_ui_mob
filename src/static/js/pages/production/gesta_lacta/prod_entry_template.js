// January 2, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../../common/page_view_basic.js';

import {SOW_STATUS,
        PIG_OPERATION_TYPE}     from '../../../constants.js';

//import {AddModalSowBoar}        from './add_modal_sow.js';



ProdEntryInsem.prototype = new PageViewBasic();
export function ProdEntryInsem(input_settings){
    PageViewBasic.call(this);
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
	
	
	var elemIdNavPrevEntry      = null;
    var elemIdEntryTitle        = null;
    var elemIdPigProdPid        = null;
    var elemIdHeaderSowName     = null;
    var elemIdHeaderBoarName    = null;
    var elemIdNavNextEntry      = null;
    
    
    
    var elemNavPrevEntry        = null;
    var elemEntryTitle          = null;
    var elemPigProdPid          = null;
    var elemHeaderSowName       = null;
    var elemHeaderBoarName      = null;
    var elemNavNextEntry        = null;
	
	
	this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
	
	
	this.getHtml = function(){
		const html = `
		`;
		
		return html
	}
	
	
	this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
	
	
	this._findElements = function(){
        elemNavPrevEntry        = document.getElementById(elemIdNavPrevEntry);
        elemEntryTitle          = document.getElementById(elemIdEntryTitle);
        elemPigProdPid          = document.getElementById(elemIdPigProdPid);
        elemHeaderSowName       = document.getElementById(elemIdHeaderSowName);
        elemHeaderBoarName      = document.getElementById(elemIdHeaderBoarName);
        elemNavNextEntry        = document.getElementById(elemIdNavNextEntry);
        
        
        
        
       
    }
    
    
    this._processAfterHtmlRender = function(){
        
    }
    
    
    this._bindEventListeners = function(){
        
    }
	
	
	this.show = function(){
		
		
	}
	
	

}