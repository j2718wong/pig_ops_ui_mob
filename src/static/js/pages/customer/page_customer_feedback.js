// March 12, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewBasic}          from '../common/page_view_basic.js';

import {APPLICATION,
        PAGE_ID,
        SOW_STATUS,
        PIG_PROD_TYPE,
        PIG_OPERATION_TYPE,
        SUPPLIER_TYPE}          from '../../constants.js';

import {updateCharCounter}      from '../common/page_view_basic.js'

import {addValidationClassToElem} from '../common/ui/ui_utils.js';


export function PageCustomerFeedback(input_settings){
    PageViewBasic.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContSupplierAddEdit,
        uniqueKey:              'supplier-add-edit'
    };
    */
    const settings              = input_settings;

    
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
        
    const MAXCHAR_NOTES        = 500;


    let elemIdBtnBack           = null;
    
    let elemIdCharCounter       = null;
    let elemIdNotes             = null;
    
    let elemIdServerErrorMsg    = null;
    let elemIdBtnSubmit         = null;
    
    let elemBtnBack             = null;
    
    let elemCharCounter         = null;
    let elemNotes               = null;
    
    let elemServerErrorMsg      = null;
    let elemBtnSubmit           = null;
    
    
    let showOptions             = null;
    
    
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }

    
    this._writeInlineStyle = function(){
        const html = ` 
        <style>
        
        /* Feedback card takes full height of form container */
        .feedback-card {
            max-width: 780px;
            width: 100%;
            background-color: var(--white);
            box-shadow: var(--shadow), 0 10px 25px -5px rgba(0, 0, 0, 0.05);
            border: 1px solid var(--blue-border);
            display: flex;
            flex-direction: column;
            height: 100%;
            margin: 0 auto;
        }

        /* header with back button - NO RADIUS */
        .feedback-header {
            background: linear-gradient(145deg, var(--corporate-blue) 0%, var(--blue-deep) 100%);
            padding: 1rem 1.5rem;
            color: white;
            border-bottom: 4px solid var(--alert-gold);
            flex-shrink: 0; /* Prevents header from shrinking */
        }

        .header-top {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .back-btn {
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: var(--text-light);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
            flex-shrink: 0;
        }

        .back-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.05);
        }

        .back-btn:active {
            transform: scale(0.95);
        }

        .feedback-header h1 {
            font-size: 1.8rem;
            font-weight: 600;
            color: white;
            letter-spacing: -0.02em;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin: 0;
        }

        .feedback-header h1 i {
            color: var(--alert-gold);
            font-size: 1.8rem;
        }

        /* Scrollable content area */
        .feedback-content {
            flex: 1 1 auto;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            display: flex;
            flex-direction: column;
            min-height: 0; /* Important for flex child scrolling */
        }

        /* story / intro section - plain text styling */
        .farm-story {
            padding: 1.5rem 1.5rem 1rem 1.5rem;
            background-color: var(--white);
            border-bottom: 1px solid var(--medium-gray);
            flex-shrink: 0;
        }

        .farm-story p {
            margin-bottom: 1rem;
            font-size: 1rem;
            color: var(--text-dark);
        }

        /* plain text - no background, just different weight/color */
        .farm-highlight {
            font-weight: 600;
            color: var(--corporate-blue);
            font-size: 1.1rem;
        }

        .farm-story .aim-box {
            background-color: transparent;
            border-left: 4px solid var(--success-green);
            padding: 0.8rem 0 0.8rem 1.2rem;
            margin: 1rem 0;
            color: var(--text-dark);
            box-shadow: none;
            border-radius: 0;
        }

        .farm-story .aim-box i {
            color: var(--icon-green);
            margin-right: 0.4rem;
        }

        /* plain text for features note - no background or radius */
        .features-note {
            display: inline-block;
            margin: 0.3rem 0 0.2rem 0;
            font-style: italic;
            color: var(--neutral-gray);
            border-left: 4px solid var(--icon-purple);
            padding-left: 1rem;
        }

        .features-note i {
            color: var(--icon-purple);
            margin-right: 0.4rem;
        }

        /* comment counter section */
        .counter-section {
            padding: 0.8rem 1.5rem;
            background-color: var(--row-even);
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--blue-border);
            border-top: 1px solid var(--blue-border);
            flex-wrap: wrap;
            gap: 0.8rem;
            flex-shrink: 0;
        }

        .comment-counter {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            font-size: 1rem;
            color: var(--blue-deep);
            font-weight: 500;
        }

        .counter-badge {
            background-color: var(--corporate-blue);
            color: white;
            padding: 0.3rem 0.9rem;
            border-radius: 30px;
            font-weight: 600;
            font-size: 1.1rem;
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
        }

        .counter-badge i {
            color: var(--alert-gold);
            font-size: 0.9rem;
        }

        .view-link {
            color: var(--corporate-blue);
            text-decoration: none;
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            gap: 0.4rem;
            background: var(--white);
            padding: 0.3rem 1rem;
            border-radius: 30px;
            border: 1px solid var(--blue-border);
        }

        .view-link i {
            font-size: 0.8rem;
        }

        /* feedback form area - this will scroll if needed */
        .feedback-form-section {
            padding: 1.5rem 1.5rem;
            flex: 1 1 auto;
            overflow-y: auto;
            min-height: 0;
        }

        .feedback-form-section h2 {
            font-size: 1.4rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--blue-deep);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .feedback-form-section h2 i {
            color: var(--icon-syringe);
            font-size: 1.5rem;
            opacity: 0.7;
        }

        .instruction {
            color: var(--neutral-gray);
            margin-bottom: 1.2rem;
            font-style: italic;
            border-bottom: 1px solid var(--medium-gray);
            padding-bottom: 0.6rem;
            font-size: 0.95rem;
        }

        /* input group */
        .comment-group {
            display: flex;
            flex-direction: column;
            gap: 1.2rem;
        }

        .input-field {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .input-field label {
            font-weight: 600;
            color: var(--corporate-blue-dark);
            font-size: 1rem;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .input-field label i {
            color: var(--icon-teal);
        }

        /* Input box */
        .input-box {
            width: 100%;
            padding: 0.9rem 1rem;
            font-size: 1rem;
            font-family: inherit;
            border: 2px solid var(--blue-border);
            border-radius: 1rem;
            background-color: var(--light-gray);
            transition: all 0.2s ease;
            color: var(--text-dark);
            resize: vertical;
            min-height: 120px;
            line-height: 1.5;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }

        .input-box:focus {
            outline: none;
            border-color: var(--corporate-blue);
            background-color: var(--white);
            box-shadow: 0 0 0 3px var(--corporate-blue-border);
        }

        /* Submit button */
        .submit-btn {
            background-color: var(--corporate-blue);
            border: none;
            color: var(--text-light);
            font-size: 1.2rem;
            font-weight: 600;
            padding: 0.9rem 1.8rem;
            border-radius: 3rem;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.8rem;
            width: 100%;
            max-width: 300px;
            box-shadow: var(--shadow);
            transition: all 0.15s ease;
            border: 1px solid var(--corporate-blue-dark);
            letter-spacing: 0.3px;
            margin: 0.5rem auto 0 auto;
            flex-shrink: 0;
        }

        .submit-btn i {
            font-size: 1.2rem;
            color: var(--alert-gold);
        }

        .submit-btn:hover {
            background-color: var(--corporate-blue-dark);
            transform: scale(1.02);
        }

        .submit-btn:active {
            transform: scale(0.98);
        }

        /* feedback footer - now inside scrollable area */
        .feedback-footer {
            background-color: var(--row-even);
            padding: 1rem 1.5rem;
            border-top: 1px solid var(--corporate-blue-border);
            font-size: 0.9rem;
            color: var(--neutral-gray);
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 0.8rem;
            flex-shrink: 0;
        }

        /* Ensure proper container hierarchy */
        .hidden-container {
            max-width: 600px;
            margin: 0 auto;
            height: 100%;
        }

        /* mobile optimizations */
        @media (max-width: 480px) {
            .feedback-header {
                padding: 0.8rem 1rem;
            }
            
            .feedback-header h1 {
                font-size: 1.5rem;
            }
            
            .header-top {
                gap: 0.7rem;
            }
            
            .back-btn {
                width: 36px;
                height: 36px;
                font-size: 1.1rem;
            }
            
            .farm-story {
                padding: 1rem 1rem;
            }
            
            .counter-section {
                padding: 0.8rem 1rem;
                flex-direction: column;
                align-items: flex-start;
            }
            
            .feedback-form-section {
                padding: 1rem 1rem;
            }
            
            .submit-btn {
                max-width: 100%;
                font-size: 1.1rem;
                padding: 0.8rem 1.5rem;
            }
            
            .feedback-footer {
                padding: 0.8rem 1rem;
                flex-direction: column;
                align-items: flex-start;
            }
        }

        /* tablet adjustments */
        @media (min-width: 481px) and (max-width: 768px) {
            .feedback-header h1 {
                font-size: 1.7rem;
            }
            
            .submit-btn {
                max-width: 280px;
            }
        }
    </style>
    `;    
        
        return html;
    }

    
    
    this.render = function(){

        elemIdBtnBack           = `${settings.uniqueKey}-back`;
        
        elemIdCharCounter       = `${settings.uniqueKey}-char-counter`;
        elemIdNotes             = `${settings.uniqueKey}-notes`;
    
        elemIdServerErrorMsg    = `${settings.uniqueKey}-server-error-msg`;
    
        elemIdBtnSubmit         = `${settings.uniqueKey}-submit`;
    
    
        const html_style = this._writeInlineStyle();

        
        
        const html =`

    ${html_style}
        

    <div class="feedback-card">
        <div class="feedback-header">
            <div class="header-top">
                <a href="#" class="back-btn" id="${elemIdBtnBack}" title="Go back">
                    <i class="fas fa-arrow-left"></i>
                </a>
                
                <h1>
                    <i class="fas fa-comment-dots"></i> Feedback Us
                </h1>
            </div>
        </div>


        <div class="farm-story">
            <p>
                <span class="farm-highlight">🐖 Yes we also have pig farm.</span> Just a small one. 
                Just like you, we also faced same problems dealing with numbers and data 
                generated in pig farming and how to improve yields. 
            </p>
            <p>
                <i class="fas fa-solid fa-code-branch" style="color: var(--icon-blue);"></i> 
                So we created this app to help us in data management and share with others too.
            </p>

            <div class="aim-box">
                <i class="fas fa-bullseye"></i> 
                <strong>We aim to help data management and analytics on your farm.</strong> We take a look on any suggestions 
                about the app, any bug finds, or feature requests according to your needs.
            </div>

            <div class="features-note">
                <i class="fas fa-tasks"></i> 
                The features available on the app, are the things that we need in our farm.
                You may have different sets of operations and business processes.
            </div>

        </div>

        

        <!-- FORM SECTION with input box and submit button -->
        <div class="feedback-form-section">
            <h2>
                <i class="fas fa-solid fa-message"></i> 
                Leave your feedback
            </h2>
            <div class="instruction">
                <i class="fas fa-lightbulb" style="color: var(--alert-gold);"></i> 
                suggestions · bugs · feature requests
            </div>

            <div class="comment-group">
                <!-- Input box with character counter -->
                <div class="input-field">
                    <label class="form-label">
                        <span><i class="fas fa-piggy-bank"></i> Your comment</span>
                        <span id="${elemIdCharCounter}" class="char-counter">0/${MAXCHAR_NOTES}</span>
                    </label>
                    <textarea class="input-box" id="${elemIdNotes}" rows="4" placeholder="Type your feedback here..." maxlength="500"></textarea>
                    
                </div>

                <div class="server-error-msg" id="${elemIdServerErrorMsg}"></div>

                <!-- Submit Button -->
                <button class="submit-btn" id="${elemIdBtnSubmit}">
                    <i class="fas fa-paper-plane"></i> Submit Feedback
                </button>
            </div>

            <!-- subtle note about response time -->
            <p style="margin-top: 1.5rem; font-size: 0.85rem; color: var(--dark-gray); text-align: center;">
                <i class="fas fa-clock" style="color: var(--warning-orange);"></i> 
                We check feedback daily — expect a response within 2-3 days
            </p>
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
        elemBtnBack             = elemDivContainer.querySelector('#'+elemIdBtnBack);
        
        elemCharCounter         = elemDivContainer.querySelector('#'+elemIdCharCounter);
        elemNotes               = elemDivContainer.querySelector('#'+elemIdNotes);
        
        elemServerErrorMsg      = elemDivContainer.querySelector('#'+elemIdServerErrorMsg);
        elemBtnSubmit           = elemDivContainer.querySelector('#'+elemIdBtnSubmit);
    }
    
    
    this._processAfterHtmlRender = function(){

    }
    
    
    this._bindEventListeners = function(){
        elemBtnBack.addEventListener('click', function(event) {
            event.preventDefault();
            navigation.showThisPage(showOptions.go_back_page);
        });
        
        elemNotes.addEventListener('input', function(event){
            updateCharCounter(elemNotes, elemCharCounter, 
                MAXCHAR_NOTES);
            
            elemNotes.classList.remove('is-invalid');
        });
        
        elemBtnSubmit.addEventListener('click', function(event) {
            event.preventDefault();
            thisObj.onClickSubmit();
        });
    }
    
    
    
    
   
    this._resetForm = function(){
        // Clear previous Form values and validation classes
        
        elemNotes.value = '';
        elemNotes.classList.remove('is-valid', 'is-invalid');
        
        updateCharCounter(elemNotes, elemCharCounter, MAXCHAR_NOTES);
        
        
    }
    
    
    this.beforeShow = function(options){
        
        
        thisObj._resetForm();
        
        
        showOptions = options;
        
        
       
        thisObj.populateForm();
        
        
                
        
    }
    
    
    this.populateForm = function(){

        
    }
    
        
    this.onClickSubmit = function(){
        let input_elem      = null;
        let validation      = 0;
        
        let input_notes     = elemNotes.value.trim();

        
       
        input_elem = elemNotes;
        if (input_notes.length == 0){
            validation = -1;
        }
        addValidationClassToElem(input_elem, validation);
        if (validation != 0) {return;}
        
        
        
        // Final check before sending request
        if (navigation.pigFarm.checkUserAccountBeforeAddEdit() == false){
            return;
        } 
        
        
        
        const user_hid      = navigation.userControl.getUserHid();
        const base_url      = window.location.origin;
        
        
        // send post request
        const post_data = {
            'uhid':             user_hid,
            
            'notes':            input_notes
        };
        
        
        
        let url = `${base_url}/cust_feedback/add`;
        
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
                    // Simple success overlay with back button
                    const successOverlay = document.createElement('div');
                    successOverlay.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: rgba(0, 0, 0, 0.5);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 9999;
                    `;
                    
                    const successBox = document.createElement('div');
                    successBox.style.cssText = `
                        background-color: white;
                        border-radius: 1rem;
                        padding: 2rem;
                        text-align: center;
                        max-width: 300px;
                        box-shadow: var(--shadow);
                        border-top: 6px solid var(--success-green);
                    `;
                    
                    successBox.innerHTML = `
                        <i class="fas fa-check-circle" style="font-size: 3.5rem; color: var(--success-green); margin-bottom: 1rem;"></i>
                        <h3 style="color: var(--blue-deep); margin: 0 0 0.5rem 0;">Feedback Sent!</h3>
                        <p style="color: var(--neutral-gray); margin-bottom: 1.5rem;">Thanks for helping us improve.</p>
                        <button id="back-from-success" style="
                            background-color: var(--corporate-blue);
                            color: white;
                            border: none;
                            padding: 0.7rem 1.5rem;
                            border-radius: 2rem;
                            font-size: 1rem;
                            font-weight: 600;
                            cursor: pointer;
                            width: 100%;
                        ">
                            <i class="fas fa-arrow-left"></i> Go Back
                        </button>
                    `;
                    
                    successOverlay.appendChild(successBox);
                    document.body.appendChild(successOverlay);
                    
                    // Back button click handler
                    document.getElementById('back-from-success').addEventListener('click', function() {
                        document.body.removeChild(successOverlay);
                        
                        if (showOptions && showOptions.go_back_page) {
                            navigation.showThisPage(showOptions.go_back_page);
                        } else {
                            history.back();
                        }
                    });
                    
                    // Reset form
                    elemNotes.value = '';
                    if (elemCharCounter) {
                        elemCharCounter.textContent = `0/${MAXCHAR_NOTES}`;
                    }
                    
                
                }
                else{
                    navigation.serverError.receivedErrorMessage(
                        response, elemServerErrorMsg);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
    }
}   
