// March 12, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {ACC_USER_GROUP,
        PIG_OPERATION_TYPE,
        PAGE_ID}              from '../../constants.js';
        

export function ManagerPublicSections(_navigation) {
    const thisObj                   = this;
    const navigation                = _navigation;
    
    
    
    let elemFeedbackUs              = null;
    let elemContactWhatsappShow     = null;
    let elemContactWhatsapp         = null;
    let elemContactEmail            = null;
    let elemCopyRightYear           = null;
    let elemFooterProductName       = null;
    
    let elemCoreVersionHash         = null;
    
    
    this.dataCompanyApp         = null;
    
    this.init = function(){
        this.afterHtmlRender();
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements  = function(){
        
        const footer                = document.querySelector('.footer');
        
        elemFeedbackUs              = footer.querySelector('#feedback-us');
        
        elemContactWhatsappShow     = footer.querySelector('#contact-whatsapp-show');
        elemContactWhatsapp         = footer.querySelector('#contact-whatsapp');
        elemContactEmail            = footer.querySelector('#contact-email');
        elemCopyRightYear           = footer.querySelector('#footer-copyright-year');
        elemFooterProductName       = footer.querySelector('#footer-product-name');
        
        elemCoreVersionHash         = footer.querySelector('#core-version-hash');
    }
    
    
    this._processAfterHtmlRender = function(){
        function getVersionFromBundle() {
            // Find the core bundle script tag
            const scripts = document.getElementsByTagName('script');
            for (let script of scripts) {
                const src = script.src;
                if (src && src.includes('bundle.core.')) {
                    const match = src.match(/bundle\.core\.([a-f0-9]+)\.min\.js/);
                    if (match) {
                        return match[1];
                    }
                }
            }
            return null;
        }
        
        
        
        elemCoreVersionHash.textContent = getVersionFromBundle();
        
    }

    
    this._bindEventListeners = function(){
        elemFeedbackUs.addEventListener('click', function() {
            let go_back_page_id = null;
            
            let go_back_page = navigation.currentPage;
            
            if (go_back_page == null){
                go_back_page_id = PAGE_ID.HOME;
                go_back_page = navigation.getPageContainer(go_back_page_id);
            }

            
            const options = {
                go_back_page:   go_back_page
            };
            
            const nex_page_id = PAGE_ID.FEEDBACK_US;
            const next_page = navigation.getPageContainer(nex_page_id);
            
            navigation.showThisPage(next_page);
            navigation.pageCustomerFeedback.beforeShow(options);
            
            
        });
    }
    
    
    this.setDataCompanyApp = function(data){
        this.dataCompanyApp = data;
        
        const elems = document.getElementsByClassName('product-name');

        
        for (let i = 0; i < elems.length; i++) {
            elems[i].innerHTML = thisObj.dataCompanyApp.product_name;
        }
        
        
        // Show whatsapp contact if there is any.
        if (data.contact_whatsapp){
            elemContactWhatsapp.textContent = `Whatsapp: ${data.contact_whatsapp}`;
            elemContactWhatsappShow.style.display ='block';
        }
        else{
            elemContactWhatsappShow.style.display ='none';
        }
        
        
        elemContactEmail.textContent = `Email: ${data.contact_email}`;

    }
    
    
    this.beforeShow = function(){
        // Set CopyRight Year
        const currentYear = new Date().getFullYear();
        elemCopyRightYear.textContent = currentYear;
        
        
    }
    
    
}
