// January 19, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {ACC_USER_GROUP}             from '../../constants.js';

import {UiBasic}                    from '../common/ui/ui_basic.js';


export function ComponentUserRole(input_settings){
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
    
    

    
    this.getHtml = function(){

        
        
        const html = `
        <div class="form-group-number">
            <label class="form-label">Select User Role</label>

            <div class="radio-group">
                <div class="radio-option" data-option="admin">
                    <input type="radio" name="user-role" id="admin" class="radio-input" value="admin">
                    <div class="radio-text">
                        <div class="radio-title">Admin</div>
                        <div class="radio-description">
                            <ul >
                                <li>Has full data access</li>
                                <li>Receives bills</li>
                                <li>Can approve join request</li>
                                <li>Can add more pig farms</li>
                                <li>Can delete non-admin users</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="radio-option" data-option="manager">
                    <input type="radio" name="user-role" id="manager" class="radio-input" value="manager">
                    <div class="radio-text">
                        <div class="radio-title">Farm Manager</div>
                        <div class="radio-description">
                            <ul>
                                <li>Has full data access</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="radio-option" data-option="operations">
                    <input type="radio" name="user-role" id="operations" class="radio-input" value="operations">
                    <div class="radio-text">
                        <div class="radio-title">Operations Staff</div>
                        <div class="radio-description">
                            <ul>
                                <li>Limited data access</li>
                                <li>No access to Financials</li>
                                <li>No access to Admin tasks</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        
        </div>
        

        `;
        
        return html;
    }
    
    
    
    
    
       
    this._findElements = function(){

    }
    
    
    this._bindEventListeners = function(){}
    
    
    // This is called after elemenst are instantiated
    this.bindEventListeners = function(){
       
        
    
    }
    
    
    /* Sets the radio button based on user group_num*/
    this.setUserRole = function(group_num){
        // Get all radio inputs
        const radioInputs = elemDivContainer.querySelectorAll('.radio-input');
        
        // Reset all radios
        radioInputs.forEach(radio => {
            radio.checked = false;
        });
        
        // Set the appropriate radio based on group_num
        switch (group_num) {
            case ACC_USER_GROUP.ADMIN:
                const adminRadio = elemDivContainer.querySelector('input[value="admin"]');
                if (adminRadio) adminRadio.checked = true;
                break;
                
            case ACC_USER_GROUP.MANAGEMENT:
                const managerRadio = elemDivContainer.querySelector('input[value="manager"]');
                if (managerRadio) managerRadio.checked = true;
                break;
                
            case ACC_USER_GROUP.OPERATIONS:
                const opsRadio = elemDivContainer.querySelector('input[value="operations"]');
                if (opsRadio) opsRadio.checked = true;
                break;
                
            default:
                console.log('Unknown group_num:', group_num);
        }
    }


    this.getUserRole = function(){
        // Get all radio inputs
        const radioInputs = elemDivContainer.querySelectorAll('.radio-input');
        let selectedValue = null;
        
        // Find which one is checked
        radioInputs.forEach(radio => {
            if (radio.checked) {
                selectedValue = radio.value;
            }
        });
        
        // Convert the string value to the corresponding group number
        switch (selectedValue) {
            case 'admin':
                return ACC_USER_GROUP.ADMIN;
            case 'manager':
                return ACC_USER_GROUP.MANAGEMENT;
            case 'operations':
                return ACC_USER_GROUP.USER_ROLE;
            default:
                return null; // No role selected
        }
    }
    
}
