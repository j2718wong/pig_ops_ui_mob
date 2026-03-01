// February 27, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';



// This is used for signup or login
export function PagePigUserSignUpOrLogin(input_settings){
    
    const thisObj               = this;
    const parentObj             = input_settings.parentObj;
    

    let elemIdHeaderTitle       = null;
    
    
    let elemIntroText           = null;
    let elemTermsText           = null;
    
    let elemEmail               = null;
    let elemEmailInvalidShow    = null; 
    let elemEmailInvalidMsg     = null;
    
    let elemBtnSignUpOrLogin    = null;

    let elemContinueUsingSocial = null;


    let showOptions             = null;

    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
    
    const html = `
    <div class="signup-card">
        <!-- 1.) PRODUCT & LOGO: centered -->
        <div class="product-row">
            <div class="company-logo">J</div>
            <div class="product-name">SuperPig</div>
        </div>

        <!-- 2.) "Sign up to continue" (centered) + email -->
        <h1 class="intro-text">Sign up to continue</h1>

        <label class="login-label" for="email">Email</label>
        <input type="email" id="email" class="email-input" placeholder="Enter your email" inputmode="email" autocomplete="email">
        <div id="invalid-email-show" class="invalid-feedback" style="display:none;">
            <i class="fas fa-triangle-exclamation"></i>
            <span id="invalid-email-msg">Please enter an email address</span> 
        </div>

        <div class="terms-text">
            By Signing up, I accept the <a href="#">J SysDev Terms of Service</a> and acknowledge the <a href="#">Privacy Policy</a>.
        </div>

        <button class="signup-btn">Sign up</button>


        <!-- 3.) "Or continue with:" + social one per line (actual icons) -->
        <div class="or-section">
            <span class="or-line"></span>
            <span class="login-label" id="continue-using-social">Or continue with</span>
            <span class="or-line"></span>
        </div>

        <div class="social-list">
            <!-- Google -->
            <div class="social-btn google" role="button" tabindex="0" aria-label="Sign up with Google">
                <i class="fab fa-google"></i>
                <span>Google</span>
            </div>
      
            <!-- Facebook -->
            <div class="social-btn facebook" role="button" tabindex="0" aria-label="Sign up with Facebook">
                <i class="fab fa-facebook-f"></i>
                <span>Facebook</span>
            </div>
      
            <!-- TikTok -->
            <div class="social-btn tiktok" role="button" tabindex="0" aria-label="Sign up with TikTok">
                <i class="fab fa-tiktok"></i>
                <span>TikTok</span>
            </div>
        </div>

        <!-- 4.) Already Have an Account? – ENTIRE LINE CLICKABLE (easy mobile tap) -->
        <div class="login-redirect">
            <a href="#" class="login-full-link">
            Already have an account? <span>Log in</span>
            </a>
        </div>
    </div>
    `;
    
    return html;
        
        
    }
    
    
    this.afterHtmlRender = function(){
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        
        elemIntroText           = document.querySelector('.intro-text');
        elemTermsText           = document.querySelector('.terms-text');
        
        elemEmail               = document.getElementById('email');
        elemEmailInvalidShow    = document.getElementById('invalid-email-show');
        elemEmailInvalidMsg     = document.getElementById('invalid-email-msg');
        
        elemBtnSignUpOrLogin    = document.querySelector('.signup-btn');
        
        elemContinueUsingSocial = document.getElementById('continue-using-social');
        
        
        
    }
    
    
    this._processAfterHtmlRender = function(){

    }
    
    
    this._bindEventListeners = function(){
        

        elemBtnSignUpOrLogin.addEventListener('click', function(event) {
            event.preventDefault();
            event.target.style.transform = 'scale(0.98)';
            setTimeout(() => event.target.style.transform = '', 120);
            
            thisObj.onClickSignUpOrLogin();
        });
        
        
    }
    
    
    
    
   
    this._resetForm = function(){
       
        
    }
    
    
    this.beforeShow = function(options){
        
        showOptions = options;
        
        

        elemEmailInvalidShow.style.display = 'none';
    
        if (showOptions.is_login){
            elemIntroText.textContent           = 'Login';
            elemTermsText.style.display         = 'none';
            elemBtnSignUpOrLogin.textContent    = 'Continue';
            elemContinueUsingSocial.textContent = 'Or login using:';    
        }
        else{
            elemIntroText.textContent           = 'Sign up to continue';
            elemTermsText.style.display         = 'block';
            elemBtnSignUpOrLogin.textContent    = 'Sign up';
            elemContinueUsingSocial.textContent = 'Or continue with:';
        }
    }
    
    
    this.populateForm = function(){

    }
    
    
    
    // This is called after success Social Media login
    /**
     * parameter - data = {
     *      social_media_id:    1,
     *      email:              '',
     *      name_first:         ''
     *      name_last:          ''
     * }
     * 
     * */
    this.afterSuccessSocialMediaLogin = function(data){
        
        // Viewport dimensions (visible page area)
        const viewportWidth     = window.innerWidth;
        const viewportHeight    = window.innerHeight;
    }
    
        
    this.onClickSignUpOrLogin = function(){
        let input_elem;
        let validation      = 0;
        

        let input_email     = elemEmail.value;
        
        if (input_email.length == 0){
            elemEmailInvalidShow.style.display = 'block';
            return;
        }
        
        const base_url      = window.location.origin;

        let url;
        
        if (showOptions.is_login){
            
        }
        else{
            url = `{base_url/user/register}`
        }
        
        
        // send post request
        const post_data = {
            'email':        input_email
        };
        
        
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
                    if (showOptions.is_login){}
                    else{
                        
                    }
                }
                else{
                    
                }
            },
  
            complete: function(){
                // TODO unsay buhaton
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
    }
    
    
}   
