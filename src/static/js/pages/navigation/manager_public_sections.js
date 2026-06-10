// manager_public_sections.js

// March 12, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {ACC_USER_GROUP,
        PIG_OPERATION_TYPE,
        PAGE_ID,
        HASH_ROUTES}                from '../../constants.js';
        

export function ManagerPublicSections(_navigation) {
    const thisObj                   = this;
    const navigation                = _navigation;
    
    
    
    let elemFeedbackUs              = null;
    let elemContactWhatsappShow     = null;
    let elemContactWhatsapp         = null;
    let elemContactEmail            = null;
    let elemCopyRightYear           = null;
    let elemFooterProductName       = null;
    
    
    
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
        
    }
    
    
    this._processAfterHtmlRender = function(){
       
        
    }

    
    this._bindEventListeners = function(){
        elemFeedbackUs.addEventListener('click', function() {
            
            const next_page_id      = PAGE_ID.FEEDBACK_US;
            const next_page_hash    = HASH_ROUTES.FEEDBACK_US;
            
            
            // Use hash router 
            navigation.managerHashRoute.hashRouter.navigate(next_page_hash, {
                pageId:         next_page_id
            });

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
