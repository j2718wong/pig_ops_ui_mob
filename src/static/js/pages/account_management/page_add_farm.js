// February 27, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {APPLICATION,
        PAGE_ID,
        SOW_STATUS,
        PIG_PROD_TYPE,
        PIG_OPERATION_TYPE,
        SUPPLIER_TYPE}          from '../../constants.js';


import {getLocationWithFallback} from './page_user_signup_or_login.js';





export function PageAddFarm(input_settings){
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;

    
    const MAXCHAR_FARM_NAME     = 30;
    
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContSupplierAddEdit,
        uniqueKey:              'supplier-add-edit'
    };
    */
    const settings              = input_settings;

    
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
        
    let elemIdServerErrorMsg    = null;

    
    let elemAccountNameDisplay  = null;  
    let elemAccountNameEditInput= null;
    let elemInvalidAccNameShow  = null;

    let elemAccountCodeDisplay  = null;  
    
    let elemFarmName            = null;           
    let elemInvalidFarmNameShow = null;
    let elemInvalidFarmNameMsg  = null;
    
    // Country selection elements
    let elemCountryReadOnlyValue        = null;
    let elemDifferentCountryLink        = null;
    let elemDifferentCountryContainer   = null;
    let elemCountryDropdown             = null;
    let elemCountrySelect               = null;
    
    let elemServerErrorMsg      = null;
    let elemBtnSave             = null;


    let elemBackToSignUp        = null;


    let dataUserAccount         = null;
    
    // Store location data
    let userLocation            = null;
    let selectedCountryHid      = null;
    let selectedCountryCode     = null;
    let selectedCountryName     = null;
    
    let countryList             = null;
    
    // Country found in list flag
    let countryFoundInList      = false;
    let geoLocationCountryName  = null;
    let geoLocationCountryCode  = null;


    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
        
        
        
        const html =`

        
<div class="signup-card">
    <!-- 1.) PRODUCT & LOGO: centered -->
    <div class="product-row">
        <div class="company-logo">J</div>
        <div class="product-name">SuperPig</div>
    </div>


    
    <!-- ========== ACCOUNT SECTION ========== -->
    <div>
        <div id="accountPlainGroup">
            <div class="account-plain">
                <!-- editable account name (read-only text by default) -->
                <div id="accountNameDisplay" class="account-name-text"></div>
            
                <!-- inline input for editing (hidden by default) -->
                <input type="text" id="accountNameEditInput" class="account-name-input hidden-section" value="" placeholder="Account name">

                <div id="invalid-acc-name-show" class="invalid-feedback" style="display:none;">
                    <i class="fas fa-triangle-exclamation"></i>
                    <span id="invalid-acc-name-msg">Invalid. Minimum 8 characters</span> 
                </div>

                <!-- account code (always plain text below) -->
                <div id="accountCodeDisplay" class="account-code">Account Code: 0000</div>
            </div>
          
        </div>
    </div>
    
    

    <!-- ========== FARM SECTION ========== -->
    <div id="farmSection">
        <div class="option-title" style="justify-content:center;">Add Pig Farm to Account</div>

        <div class="divider"></div>
        
        <div style="margin-top: 0.2rem;">
            <div class="section-label">🏡 Enter Farm Name </div>
            
            <input type="text" id="farmNameInput" class="input-field" placeholder="e.g., North pasture" value="">
            
            <div id="invalid-farm-name-show" class="invalid-feedback" style="display:none;">
                <i class="fas fa-triangle-exclamation"></i>
                <span id="invalid-farm-name-msg">Invalid. Minimum 8 characters</span> 
            </div>
            
            <div class="field-help">Name your first farm — you can add more later</div>
            
            <!-- Country selection section - minimalist design -->
            <div id="countryContainer" class="country-container">
                
                <!-- Farm Country display - just the name, prominent -->
                <div class="farm-country-row">
                    <span class="farm-country-label">Farm Country</span>
                    <span id="countryReadOnlyValue" class="farm-country-value"></span>
                </div>
                
                <!-- Different country link -->
                <div id="differentCountryContainer" class = "different-country-container">
                    <button id="differentCountryLink" type="button" class="different-country-btn">
                        Different country?
                    </button>
                </div>
                
                <!-- Dropdown for country selection (initially hidden) -->
                <div id="countryDropdown" class="hidden-section" style="margin: 0.5rem 0 1rem 0;">
                    <select id="countrySelect" class="input-field" style="appearance: auto; padding-right: 2rem; margin-bottom: 0.5rem;">
                        <option value="">Select a country</option>
                    </select>
                </div>
                
                <!-- Important note - plain with left border only -->
                <div class="country-note">
                    The country where your farm is located should be accurate 
                    since we connect potential pig buyers near your farm. 
                    The country is fixed and cannot be changed after creation. 
                    Farm location details can be updated later.
                </div>
            </div>
                        
            <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>
            
            <button class="btn btn-secondary" id="createFarmBtn">+ Create farm</button>
          
        </div>
    </div>
    
    <div style="margin-top: 0.5rem; text-align: center;">
        <button 
            id="back-signup-btn-add-farm" 
            type="button" 
            style="
                background: none;
                border: none;
                color: var(--corporate-blue);
                font-size: 1rem;
                cursor: pointer;
                padding: 6px 12px;
                transition: all 0.2s ease;
                font-family: inherit;
            "
            onmouseover="this.style.textDecoration='underline';"
            onmouseout="this.style.textDecoration='none';"
        >
            Back to Signup
        </button>
    </div>


</div>



        `;
        
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemAccountNameDisplay      = elemDivContainer.querySelector('#accountNameDisplay');
        elemAccountNameEditInput    = elemDivContainer.querySelector('#accountNameEditInput');
        elemInvalidAccNameShow      = elemDivContainer.querySelector('#invalid-acc-name-show');
        
        elemAccountCodeDisplay      = elemDivContainer.querySelector('#accountCodeDisplay');
        
        elemFarmName                = elemDivContainer.querySelector('#farmNameInput');
        elemInvalidFarmNameShow     = elemDivContainer.querySelector('#invalid-farm-name-show');
        elemInvalidFarmNameMsg      = elemDivContainer.querySelector('#invalid-farm-name-msg');
        
        // Country elements
        elemCountryReadOnlyValue    = elemDivContainer.querySelector('#countryReadOnlyValue');
        elemDifferentCountryLink    = elemDivContainer.querySelector('#differentCountryLink');
        elemDifferentCountryContainer = elemDivContainer.querySelector('#differentCountryContainer');
        elemCountryDropdown         = elemDivContainer.querySelector('#countryDropdown');
        elemCountrySelect           = elemDivContainer.querySelector('#countrySelect');
        
        elemServerErrorMsg          = elemDivContainer.querySelector('#' + elemIdServerErrorMsg);
        
        elemBtnSave                 = elemDivContainer.querySelector('#createFarmBtn');
        
        elemBackToSignUp            = elemDivContainer.querySelector('#back-signup-btn-add-farm');
    }
    
    
    this._processAfterHtmlRender = function(){

    }
    
    
    this._bindEventListeners = function(){
    
        elemAccountNameDisplay.addEventListener('click', function(event){
            if (!dataUserAccount) return; // safety
            
            // switch to edit mode
            const data_account  = dataUserAccount.account;
            const account_name  = data_account.account.name;
            
            elemAccountNameEditInput.value = account_name;
            elemAccountNameDisplay.classList.add('hidden-section');
            
            elemAccountNameEditInput.classList.remove('hidden-section');
            elemAccountNameEditInput.focus();
        });
        
        
        elemAccountNameEditInput.addEventListener('blur', thisObj.exitEditAccAndSave);
        
        // Different country link click
        elemDifferentCountryLink.addEventListener('click', function() {
            // Hide the link
            elemDifferentCountryContainer.classList.add('hidden-section');
            // Show the dropdown
            elemCountryDropdown.classList.remove('hidden-section');
            // Focus on dropdown
            elemCountrySelect.focus();
        });
        
        
        elemCountrySelect.addEventListener('change', function() {
            selectedCountryHid = this.value;
            
            
            // Update read-only display with selected country name
            if (selectedCountryHid && countryList) {
                for (let i = 0; i < countryList.length; i++) {
                    if (countryList[i].hid === selectedCountryHid) {
                        selectedCountryName = countryList[i].name;
                        elemCountryReadOnlyValue.textContent = countryList[i].name;
                        break;
                    }
                }
            }
            
            // Hide dropdown and show link again after selection
            if (selectedCountryHid) {
                elemCountryDropdown.classList.add('hidden-section');
                elemDifferentCountryContainer.classList.remove('hidden-section');
            }
        });


        elemBtnSave.addEventListener('click', thisObj.onClickCreateFarm);
        
        
        elemBackToSignUp.addEventListener('click', function() {
            // 2. Clear frontend storage
            localStorage.clear();
            sessionStorage.clear();
            
            // 3. Clear all cookies
            document.cookie.split(";").forEach(function(c) {
                var name = c.split("=")[0].trim();
                document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
                document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
            });
            
            // 4. Redirect to signup
            window.location.href = '/signup';
        });
        
    }


    
    this._resetForm = function(){
       
        
    }
    
    
    this.show = function(data_user_account){
        dataUserAccount     = data_user_account;
        
        thisObj.populateForm();
        
        
        // Get country list from parent
        countryList = parentObj.dataAddressCountryList;
        
        if (countryList == null) {
            const callback_success = function(data) {
                countryList = data;
                thisObj.populateCountryDropdown();
                
                // After getting country list, detect location
                thisObj.detectUserLocation();
            };
            
            const elem_show_error = elemServerErrorMsg;
            parentObj.requestDataActiveCountryList(callback_success, 
                elem_show_error);
            
        } else {
            // Country list already exists
            this.populateCountryDropdown();
            
            // Detect location
            this.detectUserLocation();
        }
    }
    
    
    this.populateCountryDropdown = function() {
        if (!elemCountrySelect || !countryList) return;
        
        // Clear existing options except first
        while (elemCountrySelect.options.length > 1) {
            elemCountrySelect.remove(1);
        }
        
        // Add countries from list
        for (let i = 0; i < countryList.length; i++) {
            const country = countryList[i];
            const option = document.createElement('option');
            option.value = country.hid;
            option.textContent = country.name;
            
            // If this country matches geo location, pre-select it
            if (geoLocationCountryCode) {
                if (country.country_code === geoLocationCountryCode) {
                    option.selected = true;
                    
                    selectedCountryHid = country.id;
                    selectedCountryName = country.name;
                    elemCountryReadOnlyValue.textContent = country.name;
                    countryFoundInList = true;
                }
            }
            
            elemCountrySelect.appendChild(option);
        }
    };
    
    
    this.detectUserLocation = async function() {
        try {
            // Detect user location
            userLocation = await getLocationWithFallback();
            
            geoLocationCountryName = userLocation.login_country_name;
            geoLocationCountryCode = userLocation.login_country_code;
            
            // Check if country code exists in our list
            let matchingCountry = null;
            
            if (countryList && geoLocationCountryCode) {
                for (let i = 0; i < countryList.length; i++) {
                    if (countryList[i].country_code === geoLocationCountryCode) {
                        matchingCountry = countryList[i];
                        break;
                    }
                }
            }
            
            if (matchingCountry) {
                // Country found in list
                countryFoundInList = true;
                selectedCountryHid = matchingCountry.id;
                selectedCountryName = matchingCountry.name;
                elemCountryReadOnlyValue.textContent = matchingCountry.name;
                
                // Show different country link
                elemDifferentCountryContainer.classList.remove('hidden-section');
                elemCountryDropdown.classList.add('hidden-section');
                
                // Also update dropdown selection
                if (elemCountrySelect) {
                    for (let i = 0; i < elemCountrySelect.options.length; i++) {
                        if (elemCountrySelect.options[i].value == matchingCountry.id) {
                            elemCountrySelect.selectedIndex = i;
                            break;
                        }
                    }
                }
                
            } else {
                // Country not in list
                countryFoundInList  = false;
                selectedCountryHid  = null;
                selectedCountryCode = geoLocationCountryCode;
                selectedCountryName = geoLocationCountryName;
                
                elemCountryReadOnlyValue.textContent = geoLocationCountryName || 'Unknown';
                
                // Show dropdown for selection
                elemDifferentCountryContainer.classList.add('hidden-section');
                elemCountryDropdown.classList.remove('hidden-section');
            }
            
        } catch (error) {
            console.error('Error detecting location:', error);
            elemCountryReadOnlyValue.textContent = 'Select country';
            elemDifferentCountryContainer.classList.add('hidden-section');
            elemCountryDropdown.classList.remove('hidden-section');
        }
    };
    
    
    this.refreshAccountName =  function(){
        const account_name  = dataUserAccount.account.account.name;
        const account_hid   = dataUserAccount.account.account.hid;
            
        elemAccountNameDisplay.textContent = account_name;
        elemAccountNameEditInput.value = account_name;
        elemAccountCodeDisplay.textContent = `Account Code: ${account_hid}`;
    }
    
    
    this.populateForm = function(){
        this.refreshAccountName();
    }
    
    
    this.exitEditAccAndSave = function(){
        if (!dataUserAccount) return;
        
        // already not editing
        if (elemAccountNameEditInput.classList.contains('hidden-section')) return; 

        const newName = elemAccountNameEditInput.value.trim();
        if (newName.length < 8) {
            
            elemInvalidAccNameShow.style.display = 'block';
            return;
        }
        
        
        if (newName !== dataUserAccount.account.account.name) {
            thisObj.onSaveAccountName(newName);
        }
        
        
        const account_name  = dataUserAccount.account.account.name;
        

        // always switch back to read-only display (even if same or empty we revert display)
        elemAccountNameDisplay.innerText = account_name;   // ensure fresh
        elemAccountNameDisplay.classList.remove('hidden-section');
        elemAccountNameEditInput.classList.add('hidden-section');

    }
    
        
    this.onSaveAccountName = function(new_acc_name){
        const user_hid      = dataUserAccount.user.user.hid;
        const base_url      = window.location.origin;

        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            'name':             new_acc_name
        };
        
        
        let url = `${base_url}/account/update`
        
        
        const bearer_token = localStorage.getItem('access_token');

        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    dataUserAccount.account.account = response.account;
                    
                    thisObj.refreshAccountName();
                    
                    elemInvalidAccNameShow.style.display = 'none';
                }
                else{
                    let error_code = response.result.code;
                    let error_desc = response.result.desc;
                    
                    let html = `<span>${error_code}</span>`;
                    
                    if (error_desc && error_desc.length > 0){
                        html += `<br><span>${error_desc}</span>`;
                    }
                    

                    elemInvalidAccNameShow.style.display = 'block';
                    elemInvalidAccNameShow.innerHTML = html;  
                    
                }
            },
  
            complete: function(){
                // TODO unsay buhaton
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                
            }
        });
    }
    
    
    this.onClickCreateFarm = function(){
        let input_elem;
        let validation      = 0;
        

        let input_name      = elemFarmName.value.trim();
        
        if (input_name.length < 8) {
            elemInvalidFarmNameShow.style.display = 'block';
            elemInvalidFarmNameMsg.innerHTML = 'Farm name should be at least 8 characters long.';
            return;
        }
        
        
        const user_hid      = dataUserAccount.user.user.hid;
        const base_url      = window.location.origin;


        
        // send post request with country
        const post_data = {
            'uhid':             user_hid,
            'name':             input_name
        };
        
        // Add country_hid only if selected from list
        if (selectedCountryHid) {
            post_data.country_hid = selectedCountryHid;
        }
        else{
            post_data.new_country_code = selectedCountryCode;
            post_data.new_country_name = selectedCountryName;
        }
        


        let url = `${base_url}/pig_farm/add`;


        const bearer_token = localStorage.getItem('access_token');

        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            },
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
                // Disable button to prevent double submission
                elemBtnSave.disabled = true;
                elemBtnSave.textContent = 'Creating...';
            },
  
            success: function(response){
                if (response.result.num == 0){
                    // This is temporary; should href via tokens
                    window.location.href = `/?u=${user_hid}`;
                }
                else{
                    let error_code = response.result.code;
                    let error_desc = response.result.desc;
                    
                    let html = `<span>${error_code}</span>`;
                    
                    if (error_desc && error_desc.length > 0){
                        html += `<br><span>${error_desc}</span>`;
                    }
                    

                    elemInvalidFarmNameShow.style.display = 'block';
                    elemInvalidFarmNameMsg.innerHTML = html;
                    
                    // Re-enable button
                    elemBtnSave.disabled = false;
                    elemBtnSave.textContent = '+ Create farm';
                }
            },
  
            complete: function(){
                // TODO unsay buhaton
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                elemInvalidFarmNameShow.style.display = 'block';
                elemInvalidFarmNameMsg.innerHTML = 'Error creating farm. Please try again.';
                
                // Re-enable button
                elemBtnSave.disabled = false;
                elemBtnSave.textContent = '+ Create farm';
            }
        });
    }
    

    
}
