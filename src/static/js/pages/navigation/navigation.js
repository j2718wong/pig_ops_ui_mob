// December 24, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

function UserControl() {
    const thisObj               = this;
    
	var elemUserAvatarInitials	= null;
	var elemUserAvatarName    	= null;  
		
	var elemUserDropDownName	= null;
	
	
    var dataUserAccount         = null;
    
    var userCurrentFarmHid      = null;
    
    
	this.init = function(){
		this.afterHtmlRender();
	}
	
	
	this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
	
	
	this._findElements  = function(){
		
		// TODO; cannot be found i duno why
		elemUserAvatarInitials      = document.getElementById('user-avatar-initials');
		elemUserAvatarName         	= document.getElementById('user-avatar-name');
		
		if (!elemUserAvatarInitials){console.log('elemUserAvatarInitials is null');}
		if (!elemUserAvatarName){console.log('elemUserAvatarName is null');}
		else{
			console.log('elemUserAvatarName is not null');
		}
		
		
		elemUserDropDownName		= document.getElementById('user-dropdown-name');
	   
	}
	
	
	this._processAfterHtmlRender = function(){
		
		
	}
	
	
	this._bindEventListeners = function(){
		
	}
	
    
    this.setDataUserAccount = function(data){
        dataUserAccount     = data;
        
        userCurrentFarmHid 	= data.user.default_farm;
		
		const user 			= dataUserAccount.user;
		const user_initials = user.name_first.substring(0,1) + 
							user.name_last.substring(0,1);
							
		const user_name		= user.name_first + ' ' + user.name_last;
		
		//elemUserAvatarInitials.innerHTML 	= user_initials;
		elemUserAvatarName.innerHTML 		= user_name;
		elemUserDropDownName.innerHTML 		= user_name;
		
		
    }
    
    
    this.getUserHid = function(){
        if (dataUserAccount == null){return null;}
        
        return dataUserAccount.user.hid;
    }
    
    
    this.getUserAccountHid = function(){
        if (dataUserAccount == null){return null;}
        
        return dataUserAccount.account.hid;
    }


    this.getCurrentFarm = function(){
        const account_farms = dataUserAccount.account.pig_farms;
        
        for (const cur_entry of account_farms){
            if (cur_entry.hid == userCurrentFarmHid){
                return cur_entry;
            }
        }
        
        return null;
    }
}



export function Navigation(){
    const thisObj               = this;
    
    var dataCompanyApp          = null;
    

    
    var elemFarmName            = null;
    
    var elemNavOpsSettings      = null;
    var elemNavAccGestOps       = null;
    var elemNavAccLactaPigletsOps = null;
    var elemNavAccLactaSowOps   = null;
    var elemNavAccGiltOps       = null;
    
    var elemNavSows             = null;
    var elemNavBoars            = null;
    var elemNavGilts            = null;
    
    var elemNavProdGesta        = null;
    var elemNavProdLactaPiglets= null;
    var elemNavProdLactaSows    = null;
    var elemNavProdFattening    = null;
    var elemNavProdFeeds        = null;
    
    var elemNavPigHarvests      = null;
    var elemNavReports          = null;
    var elemNavFeedCalculator   = null;
    
    
    
    var elemNavFinancials       = null;
    var elemNavFeedsExpenses    = null;
    var elemNavNonFeedsExpenses = null;
    var elemNavSales            = null;
    
    var elemNavStaff            = null;
    var elemNavPigBuyers        = null;
    var elemNavFeedSuppliers    = null;
    var elemNavSemenSuppliers   = null;
    var elemNavGiltSuppliers    = null;
    
    var elemNavUsers            = null;
    var elemNavUsersRequest     = null;
    
    
    this.userControl            = new UserControl();
    
    
    this.init = function(){
		
		this.userControl.init();
		
        this.afterHtmlRender();
        
    }
    
    
    this.render = function(){}
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        
        
    
        elemFarmName                = document.getElementById('mob-menu-farm-name');
        
        elemNavOpsSettings          = document.getElementById('sub-nav-settings');
        elemNavAccGestOps           = document.getElementById('sub-nav-acc-gesta-ops');
        elemNavAccLactaPigletsOps   = document.getElementById('sub-nav-acc-lacta-piglets-ops');
        elemNavAccLactaSowOps       = document.getElementById('sub-nav-acc-lacta-sow-ops');
        elemNavAccGiltOps           = document.getElementById('sub-nav-acc-gilt-ops');
        
        elemNavSows                 = document.getElementById('sub-nav-sows');
        elemNavBoars                = document.getElementById('sub-nav-gilts');
        elemNavGilts                = document.getElementById('sub-nav-boars');
        
        elemNavProdGesta            = document.getElementById('sub-nav-prod-gesta');
        elemNavProdLactaPiglets     = document.getElementById('sub-nav-lacta-piglets');
        elemNavProdLactaSows        = document.getElementById('sub-nav-lacta-sows');
        elemNavProdFattening        = document.getElementById('sub-nav-fattening');
        elemNavProdFeeds            = document.getElementById('sub-nav-feeds');
        
        elemNavPigHarvests          = document.getElementById('sub-nav-pig-harvests');
        elemNavReports              = document.getElementById('sub-nav-reports');
        elemNavFeedCalculator       = document.getElementById('sub-nav-feed-calculator');
        
        
        
        elemNavFinancials           = document.getElementById('nav-financials');
        elemNavFeedsExpenses        = document.getElementById('sub-nav-feeds-expenses');
        elemNavNonFeedsExpenses     = document.getElementById('sub-nav-non-feeds-expenses');
        elemNavSales                = document.getElementById('sub-nav-sales');
        
        elemNavStaff                = document.getElementById('sub-nav-staff');
        elemNavPigBuyers            = document.getElementById('sub-nav-pig-buyers');
        elemNavFeedSuppliers        = document.getElementById('sub-nav-feed-suppliers');
        elemNavSemenSuppliers       = document.getElementById('sub-nav-semen-suppliers');
        elemNavGiltSuppliers        = document.getElementById('sub-nav-gilt-suppliers');
        
        elemNavUsers                = document.getElementById('sub-nav-users');
        elemNavUsersRequest         = document.getElementById('sub-nav-user-requests');
        
    
    }
    
    
    this._processAfterHtmlRender = function(){
        
    }
    
    
    this._bindEventListeners = function(){
        
		elemNavOpsSettings.addEventListener('click', function(){
			thisObj._onClickNavOpsSettings();
		});
		
		
		elemNavAccGestOps.addEventListener('click', function(){
			thisObj._onClickNavAccGestOps();
		});
		
		
		elemNavAccLactaPigletsOp.addEventListener('click', function(){
			thisObj._onClickNavAccLactaPigletsOp();
		});
		
		   
		elemNavAccLactaSowOps.addEventListener('click', function(){
			thisObj._onClickNavAccLactaSowOps();
		});
		
		       
		elemNavAccGiltOps.addEventListener('click', function(){
			thisObj._onClickNavAccGiltOps();
		});
		
		
		             
		elemNavSows.addEventListener('click', function(){
			thisObj._onClickNavSows();
		});
		
		
		elemNavBoars.addEventListener('click', function(){
			thisObj._onClickNavBoars();
		});
		
		
		elemNavGilts.addEventListener('click', function(){
			thisObj._onClickNavGilts();
		});
		
		
		        
		elemNavProdGesta.addEventListener('click', function(){
			thisObj._onClickNavProdGesta();
		});
		
		
		
		elemNavProdLactaPiglets.addEventListener('click', function(){
			thisObj._onClickNavProdLactaPiglets();
		});
		
		
		elemNavProdLactaSows.addEventListener('click', function(){
			thisObj._onClickNavProdLactaSows();
		});
		
		
		elemNavProdFattening.addEventListener('click', function(){
			thisObj._onClickNavProdFattening();
		});
		
		
		elemNavProdFattening.addEventListener('click', function(){
			thisObj._onClickNavProdFattening();
		});
		
		
		    
		elemNavProdFeeds        
		
		elemNavPigHarvests      
		elemNavReports          
		elemNavFeedCalculator   
		
		
		
		elemNavFinancials       
		elemNavFeedsExpenses    
		elemNavNonFeedsExpenses 
		elemNavSales            
		
		elemNavStaff            
		elemNavPigBuyers        
		elemNavFeedSuppliers    
		elemNavSemenSuppliers   
		elemNavGiltSuppliers    
		
		elemNavUsers            
		elemNavUsersRequest     
		
		
    }
    
    
    this.setDataCompanyApp = function(data){
        dataCompanyApp = data;
        
        const elems = document.getElementsByClassName('app-name');

        console.log('elems.length = '+ elems.length);

        for (let i = 0; i < elems.length; i++) {
            elems[i].innerHTML = dataCompanyApp.product_name;
        }
    }
    
    
    this.setDataUserAccount = function(data){
        this.userControl.setDataUserAccount(data);
        
        // Set Farm name
        const cur_user_farm = this.userControl.getCurrentFarm();
        elemFarmName.innerHTML = cur_user_farm.name;
    }
    
    
    
    
    this.setNavlinks = function(){
        
    }
	
	
	
    
}