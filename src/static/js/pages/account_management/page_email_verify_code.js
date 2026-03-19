// March 17, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        SOCIAL_MEDIA,
        PAGE_ID}                from '../../constants.js';

import {formatDate,
        FORMAT_COMPACT}         from '../../utils.js';



export function PageEmailVerifyCode(input_settings){
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContSupplierAddEdit,
        uniqueKey:              'supplier-add-edit',
        userEmail:              'john.doe@superpig.farm'  // Email to display
    };
    */
    const settings              = input_settings;

    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
    
    // Element IDs
    let elemIdUserEmail         = `${settings.uniqueKey}-user-email`;
    let elemIdVerification      = `${settings.uniqueKey}-verification-code`;
    let elemIdTimer             = `${settings.uniqueKey}-timer`;
    let elemIdResendBtn         = `${settings.uniqueKey}-resend-btn`;
    let elemIdVerifyBtn         = `${settings.uniqueKey}-verify-btn`;
    let elemIdMessage           = `${settings.uniqueKey}-message`;
    let elemIdBackLink          = `${settings.uniqueKey}-back-link`;
    let elemIdCodePreview       = `${settings.uniqueKey}-code-preview`;
    
    // DOM Elements
    let elemUserEmail           = null;
    let elemVerification        = null;
    let elemTimer               = null;
    let elemResendBtn           = null;
    let elemVerifyBtn           = null;
    let elemMessage             = null;
    let elemBackLink            = null;
    let elemCodePreview         = null;
    let previewDots             = null;
    
    // State variables
    let timeLeft                = 300; // 5 minutes in seconds
    let timerInterval           = null;
    let verificationCode        = '123456'; // Demo code - this would come from API
    
    
    let dataUnverifiedUser      = null;
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this._writeInlineStyle = function(){
        const html = `
    <style>
        html {
            height: -webkit-fill-available;
        }

        .code-verify-container {
            width: 100%;
            max-width: 400px;
            margin: auto;
        }

        .verify-card {
            background: var(--white);
            animation: slideUp 0.4s ease-out;
            position: relative;
            overflow: hidden;
        }

        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        
        /* Header Styles */
        .code-verify-header {
            text-align: center;
            margin-bottom: 28px;
        }

        .code-verify-header h2 {
            font-size: 22px;
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 8px;
        }

        .code-verify-header p {
            color: var(--neutral-gray);
            font-size: 15px;
            line-height: 1.5;
            font-weight: 400;
        }

        .email-highlight {
            color: var(--white);
            font-weight: 600;
            background: var(--corporate-blue-company);
            padding: 6px 16px;
            border-radius: 30px;
            display: inline-block;
            margin-top: 8px;
            font-size: 14px;
            word-break: break-all;
            border: 1px solid var(--corporate-blue-border);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* Single Code Input Styles */
        .code-input-container {
            margin-bottom: 24px;
        }

        .code-input-container label {
            display: block;
            margin-bottom: 12px;
            color: var(--corporate-blue-dark);
            font-weight: 600;
            font-size: 15px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .single-code-input {
            width: 100%;
            height: 70px;
            border: 2px solid var(--corporate-blue-border);
            border-radius: 16px;
            font-size: 36px;
            font-weight: 600;
            text-align: center;
            letter-spacing: 8px;
            color: var(--corporate-blue-dark);
            background: var(--row-odd);
            transition: all 0.2s ease;
            -webkit-appearance: none;
            -moz-appearance: textfield;
            appearance: none;
            padding: 0 16px;
            font-family: 'Courier New', monospace;
        }

        /* Remove spinner buttons completely */
        .single-code-input::-webkit-outer-spin-button,
        .single-code-input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            appearance: none;
            margin: 0;
            display: none;
        }

        /* Firefox specific */
        .single-code-input[type=number] {
            -moz-appearance: textfield;
            appearance: textfield;
        }

        .single-code-input:focus {
            outline: none;
            border-color: var(--corporate-blue-company);
            background: var(--white);
            box-shadow: 0 0 0 3px var(--blue-soft);
        }

        .single-code-input.error {
            border-color: var(--danger-red);
            background: var(--warning-bg);
            animation: shake 0.4s ease-in-out;
        }

        /* Helper text */
        .input-helper {
            text-align: center;
            margin-top: 8px;
            color: var(--neutral-gray);
            font-size: 13px;
        }

        /* ✨ Subtle spam folder message */
        .spam-note {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 16px;
            padding: 8px 14px;
            background: #f8f9fa;
            border-radius: 40px;
            border: 1px dashed #adb5bd;
            color: #6c757d;
            font-size: 13px;
            font-style: italic;
            opacity: 0.85;
            transition: opacity 0.2s ease;
        }

        .spam-note:hover {
            opacity: 1;
            background: #e9ecef;
        }

        .spam-icon {
            font-size: 15px;
            opacity: 0.7;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-6px); }
            75% { transform: translateX(6px); }
        }

        /* Code preview (visual feedback) */
        .code-preview {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 12px;
            margin-bottom: 8px;
        }

        .code-preview-dot {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: var(--medium-gray);
            transition: all 0.2s ease;
        }

        .code-preview-dot.filled {
            background: var(--corporate-blue-company);
            transform: scale(1.2);
            box-shadow: 0 2px 4px rgba(24, 119, 240, 0.3);
        }

        /* Timer Section */
        .timer-section {
            text-align: center;
        }

        .timer-label {
            color: var(--dark-gray);
            font-size: 14px;
            margin-bottom: 8px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .timer-display {
            font-size: 42px;
            font-weight: 700;
            color: var(--corporate-blue);
            font-family: 'Courier New', monospace;
            line-height: 1.2;
            text-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .timer-display.expiring {
            color: var(--danger-red);
            animation: pulse 1s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }

        /* Resend Section */
        .resend-section {
            text-align: center;
            margin-bottom: 24px;
            padding: 8px 0;
        }

        .resend-btn {
            background: none;
            border: 1px solid var(--corporate-blue-border);
            color: var(--corporate-blue-company);
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            padding: 14px 24px;
            border-radius: 30px;
            transition: all 0.2s ease;
            width: 100%;
            max-width: 220px;
            margin: 0 auto;
            display: block;
            position: relative;
            overflow: hidden;
            -webkit-appearance: none;
            appearance: none;
        }

        .resend-btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: var(--blue-soft);
            transform: translate(-50%, -50%);
            transition: width 0.3s, height 0.3s;
        }

        .resend-btn:active::before:not(:disabled) {
            width: 200px;
            height: 200px;
        }

        .resend-btn:hover:not(:disabled) {
            background: var(--blue-soft);
            border-color: var(--corporate-blue-company);
        }

        .resend-btn:disabled {
            color: var(--neutral-gray);
            border-color: var(--medium-gray);
            cursor: not-allowed;
            background: none;
            opacity: 0.7;
        }

        /* Verify Button */
        .verify-btn {
            width: 100%;
            padding: 18px 20px;
            background: linear-gradient(135deg, var(--corporate-blue) 0%, var(--corporate-blue-dark) 100%);
            color: var(--white);
            border: none;
            border-radius: 16px;
            font-size: 17px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-bottom: 16px;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            box-shadow: var(--shadow);
            letter-spacing: 0.3px;
            -webkit-appearance: none;
            appearance: none;
            border: 1px solid var(--corporate-blue-border);
        }

        .verify-btn:active:not(:disabled) {
            transform: scale(0.98);
            box-shadow: 0 2px 8px rgba(30, 58, 138, 0.4);
        }

        .verify-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            background: var(--neutral-gray);
        }

        /* Message Styles */
        .message {
            text-align: center;
            padding: 14px 16px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            display: none;
            margin-top: 8px;
            word-break: break-word;
        }

        .message.success {
            background: var(--success-bg);
            color: var(--success-green);
            border: 1px solid var(--success-border);
            display: block;
        }

        .message.error {
            background: var(--warning-bg);
            color: var(--danger-red);
            border: 1px solid var(--danger-red);
            display: block;
        }

        /* Back Link */
        .back-link {
            text-align: center;
            margin-top: 24px;
        }

        .back-link a {
            color: var(--white);
            text-decoration: none;
            font-size: 15px;
            font-weight: 500;
            padding: 12px 20px;
            display: inline-block;
            transition: opacity 0.2s ease;
            -webkit-tap-highlight-color: transparent;
            opacity: 0.9;
        }

        .back-link a:active {
            opacity: 0.7;
        }

        /* Mobile Keyboard Optimization */
        @media (max-width: 380px) {
            .single-code-input {
                height: 60px;
                font-size: 32px;
                letter-spacing: 6px;
            }
            
            .verify-card {
                padding: 20px 16px;
            }
            
            .timer-display {
                font-size: 36px;
            }
            
            .product-name {
                font-size: 24px;
            }
        }

        /* Landscape Mode Optimization */
        @media (max-height: 600px) and (orientation: landscape) {
            body {
                align-items: flex-start;
                padding: 12px;
            }
            
            .verify-card {
                padding: 16px;
            }
            
            .single-code-input {
                height: 56px;
                font-size: 32px;
            }
            
            .verify-btn {
                padding: 14px;
            }
            
            .logo-section {
                margin-bottom: 16px;
                padding-bottom: 12px;
            }
        }

        /* High Resolution Screens */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
            .verify-card {
                border-width: 0.5px;
            }
        }

        /* Prevent zoom on input focus for iOS */
        @supports (-webkit-touch-callout: none) {
            .single-code-input, .verify-btn, .resend-btn {
                font-size: 16px;
            }
            
            .single-code-input {
                -webkit-appearance: none;
                appearance: none;
            }
        }
        
        /* Hide number input spinners for all browsers */
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            margin: 0;
            display: none;
        }
        
        input[type=number] {
            -moz-appearance: textfield;
            appearance: textfield;
        }

        /* Hover effects */
        .single-code-input:hover:not(:focus) {
            border-color: var(--corporate-blue-light);
            background: var(--row-even);
        }
    </style>
        `;
        return html;
    }
    
    
    this.render = function(){
        const html_style = thisObj._writeInlineStyle();
        
        const html = `
${html_style}

<div class="code-verify-container">
    <div class="verify-card">
        <!-- Logo and Product Section at the top with J logo -->
        <div class="product-row">
            <div class="company-logo">J</div>
            <div class="product-name">SuperPig</div>
        </div>

        <div class="code-verify-header">
            <h2>Verify Your Email</h2>
            <p>We've sent a verification code to</p>
            <span class="email-highlight" id="${elemIdUserEmail}"></span>
        </div>

        <div class="code-input-container">
            <label>Enter 6-digit code</label>
            <input type="text" 
                   class="single-code-input" 
                   id="${elemIdVerification}"
                   maxlength="6" 
                   pattern="[0-9]*" 
                   inputmode="numeric"
                   autofocus>
            
            <!-- Visual feedback dots -->
            <div class="code-preview" id="${elemIdCodePreview}">
                <span class="code-preview-dot"></span>
                <span class="code-preview-dot"></span>
                <span class="code-preview-dot"></span>
                <span class="code-preview-dot"></span>
                <span class="code-preview-dot"></span>
                <span class="code-preview-dot"></span>
            </div>
            
            <div class="input-helper">
                Copy and paste or type the 6-digit code
            </div>
            
            <!-- ✨ Subtle spam folder message -->
            <div class="spam-note">
                <span class="spam-icon">📨</span>
                <span class="spam-text">Can't find the email? Check your spam folder</span>
            </div>
        </div>

        <div class="timer-section">
            <div class="timer-label">Code expires in</div>
            <div class="timer-display" id="${elemIdTimer}">05:00</div>
        </div>

        <div class="resend-section">
            <button class="resend-btn" id="${elemIdResendBtn}" disabled>
                Send code again
            </button>
        </div>

        <button class="verify-btn" id="${elemIdVerifyBtn}">
            Verify Email
        </button>

        <div class="message" id="${elemIdMessage}"></div>
    </div>

    <div class="back-link">
        <a href="#" id="${elemIdBackLink}">← Back to login</a>
    </div>
</div>
        `;
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
        
        
        // Set viewport height for mobile
        this._setViewportHeight();
        window.addEventListener('resize', () => this._setViewportHeight());
    }
    
    
    this._findElements = function(){
        elemUserEmail           = elemDivContainer.querySelector('#' + elemIdUserEmail);
        elemVerification        = elemDivContainer.querySelector('#' + elemIdVerification);
        elemTimer               = elemDivContainer.querySelector('#' + elemIdTimer);
        elemResendBtn           = elemDivContainer.querySelector('#' + elemIdResendBtn);
        elemVerifyBtn           = elemDivContainer.querySelector('#' + elemIdVerifyBtn);
        elemMessage             = elemDivContainer.querySelector('#' + elemIdMessage);
        elemBackLink            = elemDivContainer.querySelector('#' + elemIdBackLink);
        elemCodePreview         = elemDivContainer.querySelector('#' + elemIdCodePreview);
        
        if (elemCodePreview) {
            previewDots         = elemCodePreview.querySelectorAll('.code-preview-dot');
        }
    }
    
    this._processAfterHtmlRender = function(){
        // Add touch handling for mobile
        this._addTouchHandling();
    }
    
    
    this._bindEventListeners = function(){
        // Verification code input
        if (elemVerification) {
            elemVerification.addEventListener('input', (e) => this._handleInput(e));
            elemVerification.addEventListener('keydown', (e) => this._handleKeyDown(e));
            elemVerification.addEventListener('paste', (e) => this._handlePaste(e));
            elemVerification.addEventListener('focus', (e) => this._handleFocus(e));
            elemVerification.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });
        }
        
        // Verify button
        if (elemVerifyBtn) {
            elemVerifyBtn.addEventListener('click', function(){
                thisObj.onClickVerifyEmail();
            });
        }
        
        
        // Resend button
        if (elemResendBtn) {
            elemResendBtn.addEventListener('click', function(){
                thisObj._resendCode();
            });
        }
        
        // Back link
        if (elemBackLink) {
            elemBackLink.addEventListener('click', function(event){
                event.preventDefault();
                this._handleBack();
            });
        }
    }
    
    
    this._handleInput = function(e) {
        let value = e.target.value;
        
        // Remove any non-digit characters
        value = value.replace(/[^0-9]/g, '');
        
        // Limit to 6 digits
        if (value.length > 6) {
            value = value.slice(0, 6);
        }
        
        // Update input value
        e.target.value = value;
        
        // Remove error styling
        e.target.classList.remove('error');
        
        // Update visual preview dots
        this._updateCodePreview(value);
        
        // Auto-submit when 6 digits are entered
        if (value.length === 6) {
            this.onClickVerifyEmail();
        }
    }
    
    
    this._handleKeyDown = function(e) {
        // Prevent arrow key up/down from changing value
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
        }
        
        // Handle enter key
        if (e.key === 'Enter') {
            e.preventDefault();
            this.onClickVerifyEmail();
        }
    }
    
    
    this._handleFocus = function(e) {
        e.target.select();
        
        // Scroll into view with offset for mobile keyboards
        setTimeout(() => {
            e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
    
    
    this._handlePaste = function(e) {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const numbers = pastedData.replace(/[^0-9]/g, '').slice(0, 6);
        
        elemVerification.value = numbers;
        this._updateCodePreview(numbers);
        
        // Auto-submit if we got 6 digits
        if (numbers.length === 6) {
            setTimeout(() => this.onClickVerifyEmail(), 100);
        }
    }
    
    
    this._updateCodePreview = function(code) {
        const length = code.length;
        
        if (previewDots) {
            previewDots.forEach((dot, index) => {
                if (index < length) {
                    dot.classList.add('filled');
                } else {
                    dot.classList.remove('filled');
                }
            });
        }
    }
    
    
    this._startTimer = function() {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                this._updateTimerDisplay();
            } else {
                this._handleTimerExpiry();
            }
        }, 1000);
    }
    
    
    this._updateTimerDisplay = function() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        elemTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Add warning class when less than 1 minute remaining
        if (timeLeft <= 60) {
            elemTimer.classList.add('expiring');
        }
    }
    
    
    this._handleTimerExpiry = function() {
        clearInterval(timerInterval);
        elemTimer.textContent = '00:00';
        elemResendBtn.disabled = false;
        this._showMessage('Code expired. Please request a new one.', 'error');
    }
    
    
    this._resendCode = async function() {
        
        
        // Disable resend button immediately
        elemResendBtn.disabled = true;
        

        const unverified_user_hid = dataUnverifiedUser.hid;
        const user_hid = dataUnverifiedUser.uhid
        
        const base_url = window.location.origin;
        let url;
        
        if (unverified_user_hid){
            url = `${base_url}/user/email/verify_code/resend?uvuhid=${unverified_user_hid}`;
        }
        else{
            url = `${base_url}/user/email/verify_code/resend?uhid=${user_hid}`;
        }
        
        
        $.ajax({
            type: 'GET',
            contentType: "application/json",
            dataType: 'json',
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            success: function(response){
                if (response.result.num == 0){
                    // Reset timer
                    timeLeft = 300;
                    elemTimer.classList.remove('expiring');
                    thisObj._startTimer();
                    
                    // Clear input
                    elemVerification.value = '';
                    elemVerification.classList.remove('error');
                    thisObj._updateCodePreview('');
                    
                    // Focus input
                    elemVerification.focus();
                    
                    thisObj._showMessage('New verification code sent!', 'success');
            
                } else {
                    thisObj._showMessage(response.result.code || 'An error occurred');
                }
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                thisObj._showMessage('Server error. Please try again.');
                loadingAnimation.hide();
            }
        });
        
    }
    
    
    
    this._handleBack = function() {
        // Show confirmation on mobile
        if (window.innerWidth <= 768) {
            if (confirm('Leave verification?')) {
                if (parentObj && parentObj.onBack) {
                    parentObj.onBack();
                } else {
                    // In production: navigate back
                    alert('Returning to login...');
                }
            }
        } else {
            if (parentObj && parentObj.onBack) {
                parentObj.onBack();
            } else {
                // In production: navigate back
                alert('Returning to login...');
            }
        }
    }
    
    
    this._addTouchHandling = function() {
        // Prevent double-tap zoom on buttons
        const buttons = [elemVerifyBtn, elemResendBtn, elemBackLink];
        buttons.forEach(btn => {
            if (btn) {
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                }, { passive: false });
            }
        });
    }
    
    
    this._setViewportHeight = function() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    
    this._showMessage = function(text, type) {
        if (!elemMessage) return;
        
        elemMessage.textContent = text;
        elemMessage.className = `message ${type}`;
        
        // Auto hide success messages after 4 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (elemMessage && elemMessage.classList.contains('success')) {
                    elemMessage.style.display = 'none';
                }
            }, 4000);
        }
        else{
            elemMessage.style.display = 'block';
        }
    }
    
    
    this._resetForm = function() {
        if (elemVerification) {
            elemVerification.value = '';
            elemVerification.classList.remove('error');
        }
        
        this._updateCodePreview('');
        
        if (elemMessage) {
            elemMessage.style.display = 'none';
        }
        
        if (elemVerifyBtn) {
            elemVerifyBtn.disabled = false;
            elemVerifyBtn.textContent = 'Verify Email';
        }
    }
    
    
    this.show = function(data, options) {
        this._resetForm();
        
        
        dataUnverifiedUser = data;
        
        
        // Update user email if provided
        if (data && data.user_email) {
            if (elemUserEmail) {
                elemUserEmail.textContent = data.user_email;
            }
        }
        
        // Reset timer
        timeLeft = 300;
        elemTimer.classList.remove('expiring');
        this._startTimer();
        
        // Enable/disable resend button as needed
        if (elemResendBtn) {
            elemResendBtn.disabled = true;
        }
        
        // Focus on the input
        setTimeout(() => {
            if (elemVerification) {
                elemVerification.focus();
            }
        }, 300);
    }
    
    
    this.populateForm = function() {
        // Not needed for this page
    }
    
    
    
    this.onClickVerifyEmail = function() {
        // Hide any existing messages
        if (elemMessage) {
            elemMessage.style.display = 'none';
        }
        
        const enteredCode = elemVerification ? elemVerification.value : '';
        
        // Validation
        if (enteredCode.length < 6) {
            this._showMessage('Please enter the complete 6-digit code', 'error');
            if (elemVerification) {
                elemVerification.classList.add('error');
            }
            return;
        }

        // Show loading state
        if (elemVerifyBtn) {
            elemVerifyBtn.disabled = true;
            elemVerifyBtn.textContent = 'Verifying...';
        }
        
        
        const unverified_user_hid = dataUnverifiedUser.hid;
        const user_hid = dataUnverifiedUser.uhid;
        
        const base_url      = window.location.origin;
        let url = `${base_url}/user/email/verify_code`;
        
        // Get viewport dimensions
        const viewport_width  = window.innerWidth;
        const viewport_height = window.innerHeight;
            
        
        
        // send post request
        const post_data = {
            'uvuhid':           unverified_user_hid,
            'auth_code':        enteredCode,
            'viewport_width':   viewport_width,
            'viewport_height':  viewport_height
        };
        
        if (unverified_user_hid){
            post_data.uvuhid = unverified_user_hid;
        }
        else{
            post_data.uhid = user_hid;
        }
        
        
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            
            timeout: APPLICATION.REQUEST_TIMEOUT,
            url: url,
            async: true,
  
            data: JSON.stringify(post_data),
  
            beforeSend: function(){
            },
  
            success: function(response){
                if (response.result.num == 0){
                    if (response.bearer_token){
                        if (elemVerification) {
                            elemVerification.classList.remove('error');
                        }

                        
                        // Store token
                        localStorage.setItem('access_token', response.bearer_token);
                        
                        // handle post login
                        parentObj.handlePostLoginFlow(response.user_account);
                        return;
                    }
                    else{
                        console.log('\n\nNo bearer_token after user is verified');
                        
                    }
                }
                else{
                    // The invalid response.result.code can be either one of these
                    //DECLARE RES_NUM_CANNOT_FIND_VERIFICATION        INT             DEFAULT 1;
                    //DECLARE RES_NUM_INVALID_CODE                    INT             DEFAULT 2;
                    //DECLARE RES_NUM_CODE_EXPIRED                    INT             DEFAULT 3;
                    
                    console.log('response.result.code = ' + response.result.code);
                    
                    switch(response.result.code){
                        case 'RES_NUM_CANNOT_FIND_VERIFICATION':
                        case 'RES_NUM_INVALID_CODE':{
                            thisObj._showMessage('✗ Invalid code. Please try again.', 'error');
                            if (elemVerification) {
                                elemVerification.classList.add('error');
                                //elemVerification.value = '';
                                elemVerification.focus();
                                //thisObj._updateCodePreview('');
                            }
                            if (elemVerifyBtn) {
                                elemVerifyBtn.disabled = false;
                                elemVerifyBtn.textContent = 'Verify Email';
                            }
                            break;
                        }
                        
                        case 'RES_NUM_CODE_EXPIRED':{
                            thisObj._showMessage('✗ Code Expired. Please request code again.', 'error');
                            if (elemVerification) {
                                elemVerification.classList.add('error');
                                //elemVerification.value = '';
                                elemVerification.focus();
                                //thisObj._updateCodePreview('');
                            }
                            if (elemVerifyBtn) {
                                elemVerifyBtn.disabled = false;
                                elemVerifyBtn.textContent = 'Verify Email';
                            }
                            
                            break;
                        }
                    }
                }
            },
  
            complete: function(){
                // TODO unsay buhaton
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                
            }
        });


    }
    
    
    this.onReceivedInvalidCode = function(){
        
    }
    
    
    
    
}
