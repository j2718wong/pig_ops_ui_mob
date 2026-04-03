// April 4, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {UiBasic}                    from '../common/ui/ui_basic.js';


export function UiLanguageSwitch(input_settings){
    UiBasic.call(this);
    
    /* Typical settings
    settings = {
        uniqueKey:      ''
    }
    
    
    */
    
    const thisObj               = this;
    
    const settings              = input_settings;
    
    const elemIdUiShow          = `${settings.uniqueKey}-show`;
    
    const elemIdLangCurrent     = `${settings.uniqueKey}-lang-current`;
    const elemIdLangDisplay     = `${settings.uniqueKey}-lang-display`;
    const elemIdLangList        = `${settings.uniqueKey}-lang-list`;
    
    
    let elemUiShow              = null;
    
    let elemLangCurrent         = null;
    let elemLangDisplay         = null;
    let elemLangList            = null;
    
    
    // Internal data
    let currentLang             = 'en';
    let availableLanguages      = [];
    let currentPath             = window.location.pathname;
    
    
    this.getHtml = function(){
        
        return `
        <div class="lang-switcher-public" id="${elemIdUiShow}">
            <div class="lang-current" id="${elemIdLangCurrent}">
                <i class="fas fa-globe"></i>
                <span id="${elemIdLangDisplay}">English</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            
            <div class="lang-dropdown" id="${elemIdLangList}">
            </div>
        </div>
        `;
        
    }
    
    
    this._findElements = function(){
        elemUiShow              = document.getElementById(elemIdUiShow);
        
        elemLangCurrent         = document.getElementById(elemIdLangCurrent);
        elemLangDisplay         = document.getElementById(elemIdLangDisplay);
        elemLangList            = document.getElementById(elemIdLangList);   
        
        thisObj.elemUiShow      = elemUiShow;
    }
    
    
    this._bindEventListeners = function(){
        // Toggle dropdown on click
        if (elemLangCurrent) {
            elemLangCurrent.addEventListener('click', (e) => {
                e.stopPropagation();
                thisObj.toggleDropdown();
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            thisObj.closeDropdown();
        });
        
        // Prevent closing when clicking inside dropdown
        if (elemLangList) {
            elemLangList.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }
    
    
    this.loadDataFromGlobal = function(){
        // Get current language from global or default to 'en'
        currentLang = window.SUPERPIG_CURRENT_LANG || 'en';
        
        // Get available languages from global or use empty array
        availableLanguages = window.SUPERPIG_AVAILABLE_LANGUAGES || [];
        
        // Get current path from global or window
        currentPath = window.SUPERPIG_CURRENT_PATH || window.location.pathname;
        
        // If no available languages, create default
        if (availableLanguages.length === 0) {
            availableLanguages = [
                {
                    "active": currentLang === 'en',
                    "code": "en",
                    "local_name": "English",
                    "name": "English",
                    "url": "/en"
                },
                {
                    "active": currentLang === 'ceb',
                    "code": "ceb",
                    "local_name": "Bisdak",
                    "name": "Bisaya",
                    "url": "/bis"
                }
            ];
        }
        
        console.log('UiLanguageSwitcher - Current Lang:', currentLang);
        console.log('UiLanguageSwitcher - Available Languages:', availableLanguages);
    }
    
    
    this.shouldHide = function(){
        // Hide if no available languages
        if (!availableLanguages || availableLanguages.length === 0) {
            return true;
        }
        
        // Hide if only 1 language available
        if (availableLanguages.length === 1) {
            return true;
        }
        
        
        return false;
    }
    
    
    this.renderDropdown = function(){
        if (!elemLangList) return;
        
        let html = '';
        
        for (const lang of availableLanguages) {
            
            // Build URL with language parameter preserving current path
            let url = lang.url;
            
            // If url doesn't include the path, add current path
            if (url === '/' || url === '') {
                url = currentPath + '?lang=' + lang.code;
            } else if (url.indexOf('?') === -1) {
                // Add current path if needed
                url = currentPath + '?lang=' + lang.code;
            }
            
            const activeClass = lang.active === true ? 'active' : '';
            
            html += `
                <a href="${url}" 
                   class="lang-option ${activeClass}" 
                   data-lang="${lang.code}"
                   data-url="${url}">
                    ${lang.local_name}
                </a>
            `;
        }
        
        elemLangList.innerHTML = html;
        
        // Attach click handlers to new links
        const options = elemLangList.querySelectorAll('.lang-option');
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                
                const langCode = option.getAttribute('data-lang');
                const url = option.getAttribute('data-url');
                
                // Check if selected language is the same as current
                if (langCode === currentLang) {
                    console.log(`Language ${langCode} is already active, no redirect needed`);
                    // Just close the dropdown and return
                    thisObj.closeDropdown();
                    return;
                }
                
                // Different language - proceed with redirect
                if (url) {
                    // Save language preference before navigating
                    if (langCode) {
                        localStorage.setItem('user_language', langCode);
                        document.cookie = `user_lang=${langCode}; path=/; max-age=31536000`;
                    }
                    window.location.href = url;
                }
            });
        });
    }

    
    this.updateCurrentDisplay = function(){
        if (!elemLangDisplay) return;
        
        // Find the active language display name
        const activeLang = availableLanguages.find(lang => lang.active === true);
        
        if (activeLang) {
            elemLangDisplay.textContent = activeLang.local_name;
        } else {
            // If no active found, try to find by code
            const langByCode = availableLanguages.find(lang => lang.code === currentLang);
            if (langByCode) {
                elemLangDisplay.textContent = langByCode.local_name;
            } else {
                elemLangDisplay.textContent = 'English';
            }
        }
    }
    
    
    this.updateVisibility = function(){
        if (thisObj.shouldHide()) {
            thisObj.hide();
        } else {
            thisObj.show();
        }
    }
    
    
    this.toggleDropdown = function(){
        if (!elemLangList) return;
        elemLangList.classList.toggle('active');
        
        // Rotate chevron icon
        const chevron = elemLangCurrent.querySelector('.fa-chevron-down, .fa-chevron-up');
        if (chevron) {
            if (elemLangList.classList.contains('active')) {
                chevron.classList.remove('fa-chevron-down');
                chevron.classList.add('fa-chevron-up');
            } else {
                chevron.classList.remove('fa-chevron-up');
                chevron.classList.add('fa-chevron-down');
            }
        }
    }
    
    
    this.closeDropdown = function(){
        if (elemLangList) {
            elemLangList.classList.remove('active');
            
            // Reset chevron
            const chevron = elemLangCurrent.querySelector('.fa-chevron-up');
            if (chevron) {
                chevron.classList.remove('fa-chevron-up');
                chevron.classList.add('fa-chevron-down');
            }
        }
    }
    
    
    this.beforeShow = function(){
        /*
        // Sample Global data 
        window.SUPERPIG_CURRENT_LANG = 'ceb';
        
        window.SUPERPIG_AVAILABLE_LANGUAGES = 
        [
          {
            "active": false,
            "code": "en",
            "local_name": "English",
            "name": "English",
            "url": "/en"
          },
          {
            "active": true,
            "code": "ceb",
            "local_name": "Bisdak",
            "name": "Bisaya",
            "url": "/bis"
          }
        ]
        
        */
        
        // Load data from global window object
        thisObj.loadDataFromGlobal();
        
        // Check if we should hide the language switcher
        if (thisObj.shouldHide()) {
            console.log('to be hidden');
            thisObj.hide();
            return;
        }
        
        // Render the language dropdown
        thisObj.renderDropdown();
        
        // Update current language display
        thisObj.updateCurrentDisplay();
        
        // Make sure the switcher is visible (call parent show)
        if (thisObj.elemUiShow) {
            thisObj.elemUiShow.style.display = 'block';
        }
    }
    
    
    this.reset = function(){
        // Reset dropdown state
        thisObj.closeDropdown();
        
        // Reload data from global
        thisObj.loadDataFromGlobal();
        
        // Check visibility
        if (thisObj.shouldHide()) {
            thisObj.hide();
            return;
        }
        
        // Re-render
        thisObj.renderDropdown();
        thisObj.updateCurrentDisplay();
        
        // Make visible
        if (thisObj.elemUiShow) {
            thisObj.elemUiShow.style.display = '';
        }
    } 
        
}
