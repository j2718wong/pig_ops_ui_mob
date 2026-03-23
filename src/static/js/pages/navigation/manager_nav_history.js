// March 14, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        ACC_USER_GROUP,
        PAGE_ID}              from '../../constants.js';
        

/**
 * PHONE BACK BUTTON STRATEGY (March 2026)
 * =======================================
 * The phone back button is NOT a primary navigation method for our farmers.
 * Primary navigation: swipe gestures, header buttons, breadcrumbs.
 * 
 * We implemented back button sync for:
 *   - Dashboard → List → Detail (drill-down)
 *   - List ↔ List (same group = replace, not push)
 * 
 * This covers 80% of user flows. The remaining pages follow the same
 * pattern, so they work automatically via the same logic.
 * 
 * Platform limitation: Android Chrome/Firefox still have bugs where
 * back button closes the browser. This is a Google/Mozilla issue,
 * not our code. We accept this limitation.
 * 
 * If you're debugging back button behavior, test on DESKTOP browser.
 * Desktop works correctly. Phone issues are platform problems.
 */


export function ManagerNavHistory(_navigation) {
    const thisObj                   = this;
    const navigation                = _navigation;
    
    
    const MAX_NAV_HISTORY           = 8;
    
    /**
     * This should be an array of 
     * {
     *      pageContainer:    <elemContainer>, // Hidden Page container
     * 
     *      navMenuGroup:   int, // Navigation menu group of the page.
     *                      
     * 
     *      pageData: {},   // data to be rendered on the page if there is any.
     *                      // Because some pages may initiate a request
     *                      // on beforeShow or show method.
     *                      // This can be null;
     * 
     *      renderPageFunc: function // reference to a function to render the 
     *                      // page and should receive the pageData.  
     *                      // This maybe a new function to call page.show
     *                      // or beforeShow methods with the pageData 
     *                      // as input. This cannot be null.  
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
        
        
        if (navHistoryList.length > 0){
            const last_nav = navHistoryList[0];
            
            if (last_nav.renderPageFunc){
                navigation.showThisPage(last_nav.pageContainer);
                
                last_nav.renderPageFunc(last_nav.pageData);
            }
            
            // Remove head 
            thisObj.popHead();
            
        }
        
        
        if (APPLICATION.DEBUG_NAV_HISTORY){
            console.log('\n\n\nNavHistory List AFTER clicking Back browser button');
            console.log(this.navHistoryToString());
        }
        
    }
    
    
    // Will push current page to navHistory list;
    this.pushCurrentPage = function(page_container, page_data, render_func){
        const nav_menu_group = navigation.getNavigationMenuGroup(page_container);
        
        const cur_entry = {
            pageContainer:  page_container,
            navMenuGroup:   nav_menu_group,
            pageData:       page_data,
            renderPageFunc: render_func
        };
        
        
        if (navHistoryList.length == 0){
            navHistoryList.push(cur_entry);
            return;
        }
        
        
        // Check if the last_navigation.pageContainer in stack is same 
        // with the input page_container
        const last_navigation = navHistoryList[0];
        if (last_navigation.pageContainer == page_container){
            // Only replace the pageData
            last_navigation.pageData = page_data;
            return; // No need to push to stack
        }
        
        
        // Check if the last_navigation.navMenuGroup is same with the 
        // with the input menu_group.
        // If same menu_group, it means a left - right navigation.
        // The Back Navigation should go back to one level up, not in
        // left - right navigation.
        //
        // If same menu_group, the head should be remove from the navHistoryList 
        // and push the cur_entry into the navHistoryList stack.
        // 
        // TODO this
        
        // Check if the last_navigation.navMenuGroup is same with the input menu_group
        if (last_navigation.navMenuGroup && nav_menu_group) {
            if (last_navigation.navMenuGroup == nav_menu_group) {
                // SAME GROUP = left-right navigation (swipe between lists or entries)
                // Back should go UP one level, not through each swipe
                
                // Remove the current head (the page we're replacing)
                thisObj.popHead();
                
                // Now push the new entry as the current page
                if (navHistoryList.length < MAX_NAV_HISTORY) {
                    navHistoryList.unshift(cur_entry);
                } else {
                    navHistoryList.pop();
                    navHistoryList.unshift(cur_entry);
                }
                
                if (APPLICATION.DEBUG_NAV_HISTORY) {
                    console.log('Same menu group navigation - replaced head');
                }
                
                return;
            } 
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
    
    
    // Will remove head of navHistoryList if the head_entry.pageContainer 
    // is the page_container.
    this.removeFromNavHistoryHead = function(page_container){
        if (page_container){}
        else{return;}
        
        if (navHistoryList.length == 0){return;}
        
        const last_navigation = navHistoryList[0];
        
        if (last_navigation.pageContainer == page_container){
            thisObj.popHead();
            return; 
        }

    }
    
    
    // Will remove from head until the given page container is found;
    // If not found, nothing is removed.
    this.removeFromHeadUntilThisPage = function(page_container){
        let is_found = 0; // is page_container found
        
        let index  = 0;
        for(const cur_entry of navHistoryList){
            if (cur_entry.pageContainer == page_container){
                is_found = 1;
                break;
            }
            
            index += 1;
        }
        
        if (is_found > 0){
            navHistoryList.splice(0, index+1);
        }
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
