// March 3, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


import {APPLICATION,
        SOCIAL_MEDIA,
        PAGE_ID}                from '../../constants.js';


import {formatDate,
        FORMAT_COMPACT}         from '../../utils.js';



export function PagePrivacyPolicy(input_settings){
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContSupplierAddEdit,
        uniqueKey:              'supplier-add-edit'
    };
    */
    const settings              = input_settings;

    
    const elemDivContainer      = document.getElementById(settings.elemIdDivContainer);
        
    
 
    
    let elemBackButton          = null;
    
    
    let showOptions             = null;
    
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this._writeInlineStyle = function(){
        const html = `
        <style>
        /* simple title */
        /* sections */
        .policy-section {
            margin: 2rem 0 1.8rem 0;
            scroll-margin-top: 1rem;
        }

        .section-title {
            font-size: 1.6rem;
            font-weight: 650;
            color: var(--primary-dark);
            margin-bottom: 1rem;
            border-left: 6px solid var(--primary-medium);
            padding-left: 1rem;
        }

        .subsection {
            margin: 1.2rem 0 1.2rem 0.8rem;
            padding-left: 1rem;
        }

        .subsection-title {
            font-weight: 650;
            font-size: 1.2rem;
            color: var(--primary-medium);
            margin-bottom: 0.3rem;
        }

        .policy-section > p {
            margin-bottom: 0.8rem;
        }

        .policy-section > ul, ol {
            margin: 0.5rem 0 1rem 1.8rem;
        }

        .policy-section > li {
            margin-bottom: 0.3rem;
        }

        .policy-section > li::marker {
            color: var(--primary-dark);
        }

        </style>    
        `
        
        return html;
    }
    
    
    
    this.render = function(){
        
        const hmtl_style = this._writeInlineStyle();
        
        const html =`

${hmtl_style}
        
<div class="signup-card">
    <!-- 1.) PRODUCT & LOGO: centered -->
    <div class="product-row">
        <div class="company-logo">J</div>
        <div class="product-name">SuperPig</div>
    </div>

        
    <!-- header with company placeholder -->
    <div class="policy-header">
        <h1>Privacy Policy</h1>
        <div class="last-updated">Last updated: April 8, 2026 · <span style="color:var(--primary-dark);">JSysDev</span></div>
    </div>

    <!-- Back button (generic) -->
    <div class="back-nav">
        <a href="#" class="back-button" onclick="history.back(); return false;">← Back</a>
    </div>

    <!-- introduction / plain language -->
    <p style="font-size:1.1rem; background: var(--bg-accent); padding: 1rem; border-left: 6px solid var(--success);">
        <strong>Your privacy matters.</strong> This policy explains how we collect, use, and protect your personal information when you use our website, apps, or services. It’s written in simple language — no hidden legalese.
    </p>

    <!-- 1. Who we are -->
    <div class="policy-section">
        <div class="section-title">1. Who we are</div>
        <p>This privacy policy applies to <strong>JSysDev</strong> (referred to as “we”, “us”, or “our”). 
        We provide data management and data analytics for pig farmers. 
    </div>

    <!-- 2. What information we collect -->
    <div class="policy-section">
        <div class="section-title">2. What information we collect</div>

        <div class="subsection">
            <div class="subsection-title">2.1 Information you give us</div>
            <p>When you register, purchase, or use our service, you may provide:</p>
            <ul>
                <li><strong>Account information:</strong> name, email address, password, farm location, country.</li>
                <li><strong>Billing information:</strong> payment card details, billing address (processed securely by third‑party payment providers).
                Other payment methods will be provided later after your accoun free trial.
                </li>
                <li><strong>Farm data:</strong> information about your breeding stocks, production records (this is your data – you own it).</li>
                <li><strong>Communications:</strong> when you contact support or send feedback.</li>
            </ul>
        </div>

        <div class="subsection">
            <div class="subsection-title">2.2 Information we collect automatically</div>
            <p>When you use our website or app, we may collect technical data such as:</p>
            <ul>
                <li>IP address, browser type, device type, operating system.</li>
                <li>Pages you visit, time spent, and how you interact with the service.</li>
                <li>Cookies and similar tracking technologies (see section 6).</li>
            </ul>
        </div>

        <div class="subsection">
            <div class="subsection-title">2.3 Information from third parties</div>
            <p>If you pay via a partner or reseller, we may receive account details from them. We do not buy or sell personal data from external brokers.</p>
        </div>
    </div>

    <!-- 3. How we use your information -->
    <div class="policy-section">
        <div class="section-title">3. How we use your information</div>
        <p>We use your personal information only for legitimate business purposes:</p>
        <ul>
            <li><strong>To provide and maintain the service:</strong> create your account, process payments (via secure payment partners), and give you access to features.</li>
            <li><strong>To improve and personalize:</strong> understand how users interact with the app, fix bugs, and develop new features.</li>
            <li><strong>To communicate with you:</strong> send service updates, billing reminders, support messages, and (with your consent) marketing offers.</li>
            <li><strong>To comply with law:</strong> meet legal obligations (e.g., tax records, fraud prevention).</li>
        </ul>
        <p>We do <strong>not</strong> sell your personal data to third parties for marketing purposes.</p>
    </div>

    <!-- 4. Sharing your information -->
    <div class="policy-section">
        <div class="section-title">4. When we share your information</div>
        <p>We only share your information in limited circumstances:</p>
        <ul>
            <li><strong>With service providers:</strong> companies that help us run the business (payment processors, cloud hosting, email delivery, customer support). They are bound by strict data protection terms.</li>
            <li><strong>For legal reasons:</strong> if required by law, court order, or to protect our rights (e.g., fraud investigation).</li>
            <li><strong>Business transfers:</strong> if we are involved in a merger or sale, your data may be transferred – we will notify you.</li>
            <li><strong>With your consent:</strong> when you explicitly agree (e.g., to share data with a partner).</li>
        </ul>
    </div>

    <!-- 5. Data security & retention -->
    <div class="policy-section">
        <div class="section-title">5. Data security and retention</div>
        <p>We use reasonable technical and organizational measures to protect your data (encryption, access controls, secure servers). However, no online service is 100% secure.</p>
        <p>We retain your personal data for as long as your account is active, or as needed to provide the service. After you close your account, we may retain limited data to comply with legal obligations (tax, accounting) or for legitimate business backups – typically up to 90 days, then anonymized or deleted.</p>
    </div>

    <!-- 6. Cookies and tracking -->
    <div class="policy-section">
        <div class="section-title">6. Cookies & similar technologies</div>
        <p>We use cookies and local storage to:</p>
        <ul>
            <li>Keep you logged in.</li>
            <li>Understand usage (analytics).</li>
            <li>Remember your preferences.</li>
        </ul>
        <p>You can control cookies through your browser settings. Disabling them may affect functionality. Third‑party analytics (e.g., Google Analytics) may also set cookies – their use is governed by their own privacy policies.</p>
    </div>

    <!-- 7. Your rights -->
    <div class="policy-section">
        <div class="section-title">7. Your rights & choices</div>
        <p>Depending on your location (e.g., if you are in the EU, UK, California), you may have rights including:</p>
        <ul>
            <li><strong>Access:</strong> request a copy of the personal data we hold.</li>
            <li><strong>Correction:</strong> ask us to fix inaccurate data.</li>
            <li><strong>Deletion:</strong> request deletion of your data (subject to legal limits).</li>
            <li><strong>Object / restrict:</strong> object to certain processing (like marketing).</li>
            <li><strong>Data portability:</strong> receive your data in a machine‑readable format.</li>
        </ul>
        <p>To exercise any right, email <a href="mailto:privacy@yourcompany.com">privacy@yourcompany.com</a>. We will respond within the time required by law. You also have the right to lodge a complaint with a data protection authority.</p>
    </div>

    <!-- 8. International transfers -->
    <div class="policy-section">
        <div class="section-title">8. International data transfers</div>
        <p>We may store and process your data in servers located in Hong Kong. If you are outside that region, your data will be transferred to our servers. We use standard contractual clauses or similar safeguards to protect your information.</p>
    </div>

    <!-- 9. Children's privacy -->
    <div class="policy-section">
        <div class="section-title">9. Children's privacy</div>
        <p>Our service is not intended for individuals under the age of 16 (or the relevant age of consent in your country). We do not knowingly collect data from children. If you believe a child has provided us with personal data, contact us so we can delete it.</p>
    </div>

    <!-- 10. Changes to this policy -->
    <div class="policy-section">
        <div class="section-title">10. Changes to this policy</div>
        <p>We may update this privacy policy from time to time. If we make significant changes, we will notify you (e.g., by email or a notice in the app). The "Last updated" date at the top reflects the latest version. Your continued use after changes means you accept the revised policy.</p>
    </div>

    <!-- Contact information (generic placeholder) -->
    <div class="contact-block">
        <p style="font-weight: 700; font-size: 1.2rem; margin-bottom: 0.5rem;">📬 Questions? Contact us</p>
        <p>If you have any concerns about this policy or your privacy, please contact:</p>
        <p><strong>Data Protection / Privacy Officer</strong><br>
        Email: <a href="mailto:jsysdev.contact@gmail.com">jsysdev.contact@gmail.com</a><br>
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
        elemBackButton          = elemDivContainer.querySelector('.back-nav');
        
    }
    
    
    this._processAfterHtmlRender = function(){

    }
    
    
    this._bindEventListeners = function(){
        elemBackButton.addEventListener('click', function(event) {
            parentObj.showThisPage(showOptions.go_back_page);
        });
       
    }
    
    
    
    
   
    this._resetForm = function(){
        
        
    }
    
    
    this.beforeShow = function(options){
        this._resetForm();
        
       showOptions = options;
        
    }
    
    
    this.populateForm = function(){

    }
    
    

}   
