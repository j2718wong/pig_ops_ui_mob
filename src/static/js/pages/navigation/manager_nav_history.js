// March 14, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {ACC_USER_GROUP,
        PAGE_ID}              from '../../constants.js';
        

export function ManagerNavHistory(_navigation) {
    const thisObj                   = this;
    const navigation                = _navigation;
    
    
    const MAX_NAV_HISTORY           = 8;
    
    /**
     * This should be an array of 
     * {
     *      pageContainer:    <elemContainer>, // Hidden Page container
     *      pageData: {},   // data to be rendered on the page if there is any.
     *                      // Because some pages may initiate a request
     *                      // on beforeShow or show method.
     *                      // This can be null;
     * 
     *      renderPageFunc: function // reference to a function to render the 
     *                             // page and should receive the pageData.  
     *                              // This maybe a new function to call page.show
     *                              // or beforeShow methods with the pageData 
     *                              // as input. This cannot be null.  
     * }
     * 
     * */
    const navHistoryList            = [];
    
    
    this.init = function(){
    }
    
    
    this.clearHistory = function(){
        navHistoryList.length = 0;
    }
    
    
    this.onClickBackBtn = function(is_mobile){
        console.log('\n\n\nNavHistory List On clicking Back browser button');
        console.log(this.navHistoryToString());
        
        
        if (navHistoryList.length > 0){
            const last_nav = navHistoryList[0];
            console.log('\n\nlast_nav');
            console.log(last_nav);
            
            if (last_nav.renderPageFunc){
                navigation.showThisPage(last_nav.pageContainer);
                
                last_nav.renderPageFunc(last_nav.pageData);
            }
            
            // Remove head 
            thisObj.popHead();
            
        }
        
    }
    
    
    // Will push current page to navHistory list;
    this.pushCurrentPage = function(page_container, page_data, render_func){
        const cur_entry = {
            pageContainer:  page_container,
            pageData:       page_data,
            renderPageFunc: render_func
        };
        
        
        if (navHistoryList.length == 0){
            navHistoryList.push(cur_entry);
            return;
        }
        
        
        // Check if the last page_container is stack is same with the input page_container
        const last_navigation = navHistoryList[0];
        if (last_navigation.pageContainer == page_container){
            // Only replace the pageData
            last_navigation.pageData = page_data;
            return; // No need to push to stack
        }
         
        
        
        // Push cur_entry to the head of the list
        if (navHistoryList.length < MAX_NAV_HISTORY){
            navHistoryList.unshift(cur_entry)
        }
        else{
            navHistoryList.pop();
            navHistoryList.unshift(cur_entry);
        }
    
    }
    
    
    // Will remove entry at index 0
    this.popHead = function(){
        navHistoryList.shift();
    }
    
    
    this.navHistoryToString = function(){
        let s = '';
        
        for (const cur_entry of navHistoryList){
            s += navigation.pageContainerToString(cur_entry.pageContainer);
            s += '\n';
        }
        
        return s;
    }
    
}
