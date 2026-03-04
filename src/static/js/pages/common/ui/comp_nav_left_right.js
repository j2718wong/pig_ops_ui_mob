// January 15, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {UiBasic}                    from './ui_basic.js';


export function ComponentNavLeftRight(input_settings){
    UiBasic.call(this);
    
    /* Typical settings
    settings = {
        uniqueKey:              '',
        pageTitle:              '',
        elemDivContainer:       el
    }
    
    
    */
    const thisObj               = this;
    
    const settings              = input_settings;
    
    const elemDivContainer      = settings.elemDivContainer;
    
    
    let elemIdNavLeftEntry      = null;
    let elemIdNavRightEntry     = null;

    let elemIdPageTitle         = null;
    let elemIdEntryCount        = null;
    

    let elemNavLeftEntry        = null;
    let elemNavRightEntry       = null;

    let elemPageTitle           = null;
    let elemEntryCount          = null;


    this.callbackNavLeft        = null;
    this.callbackNavRight       = null;
    this.callbackClickTitle     = null;
    
    
    this.getHtml = function(){
        elemIdNavLeftEntry      = `${settings.uniqueKey}-prev`;
        elemIdNavRightEntry      = `${settings.uniqueKey}-next`;
        
        elemIdPageTitle         = `${settings.uniqueKey}-page-title`;
        elemIdEntryCount        = `${settings.uniqueKey}-entry-count`;
        
        
        const html = `
            <div class="nav-left-right">
                <button class="nav-button blue" id="${elemIdNavLeftEntry}"><i class="fa-solid fa-arrow-left"></i></button>
                    
                <span>
                    <span class="nav-title blue" id="${elemIdEntryCount}"></span>
                    <span class="nav-title blue" id="${elemIdPageTitle}" style="margin-right:8px;">${settings.pageTitle}</span>
                </span>
                
                <button class="nav-button blue" id="${elemIdNavRightEntry}"><i class="fa-solid fa-arrow-right"></i></button>
                    
            </div>

        `;
        
        return html;
    }
    
    
    
    
    
       
    this._findElements = function(){
        elemNavLeftEntry        = elemDivContainer.querySelector('#'+elemIdNavLeftEntry);
        elemNavRightEntry       = elemDivContainer.querySelector('#'+elemIdNavRightEntry);
        
        elemPageTitle           = elemDivContainer.querySelector('#'+elemIdPageTitle);
        elemEntryCount          = elemDivContainer.querySelector('#'+elemIdEntryCount);
    }
    
    
    this._bindEventListeners = function(){}
    
    
    // This is called after elemenst are instantiated
    this.bindEventListeners = function(){
        elemNavLeftEntry.onclick = function(){
            if(thisObj.callbackNavLeft){thisObj.callbackNavLeft();}
        };
        
        
        elemNavRightEntry.onclick = function(){
            if(thisObj.callbackNavRight){thisObj.callbackNavRight();}
        };
        
        
        elemPageTitle.onclick = function(){
            if(thisObj.callbackClickTitle){thisObj.callbackClickTitle();}
        };
        
    
    }
    
    
   
    
}
