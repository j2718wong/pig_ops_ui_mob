// January 2, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}          from '../../common/page_view_basic.js';

import {SOW_STATUS,
        PIG_OPERATION_TYPE}     from '../../../constants.js';





ProdEntryInsem.prototype = new PageViewPigFarmPage();
export function ProdEntryInsem(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    
    
    let elemIdNavPrevEntry      = null;
    let elemIdEntryTitle        = null;
    let elemIdPigProdPid        = null;
    let elemIdHeaderSowName     = null;
    let elemIdHeaderBoarName    = null;
    let elemIdNavNextEntry      = null;
    
    
    
    let elemNavPrevEntry        = null;
    let elemEntryTitle          = null;
    let elemPigProdPid          = null;
    let elemHeaderSowName       = null;
    let elemHeaderBoarName      = null;
    let elemNavNextEntry        = null;
    
    
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