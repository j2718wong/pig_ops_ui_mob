// January 11, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}          from '../common/page_view_basic.js';

import {APPLICATION,
        PAGE_ID,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        SOW_STATUS_NAME}        from '../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT,
        sortList,
        createPaginationManager} from '../../utils.js';

import {TableMedVac}            from './table_medvac.js'
import {TableHealthIssue}       from './table_health_issue.js'


PageSowBoarEntry.prototype = new PageViewPigFarmPage();
export function PageSowBoarEntry(input_settings){
    PageViewPigFarmPage.call(this);
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContSowBoarEntry
    };
    */
    const settings              = input_settings;
    
    
    // This is needed as ths will be first element to be rendered
    //let elemDivContainer        = document.getElementById('container-sow-boar-list');
    let elemDivContainer        = document.getElementById(settings.elemIdDivContainer);
    
    let elemIdNavPrevEntry      = null;
    let elemIdNavNextEntry      = null;
    
    let elemIdEntryTitle        = null;
    
    let elemIdEntryId           = null;
    let elemIdEntryName         = null;
    
    let elemIdShowMore          = null;
    let elemIdShowMoreDropDown  = null;
    
    let elemIdTabMedVac         = null;
    let elemIdTabHealth         = null;
    let elemIdTabNotes          = null;
    let elemIdTabOutput         = null;
    let elemIdTabMates          = null;
    let elemIdTabEdit           = null;
    let elemIdTabStatus         = null;
    
    
    
    let elemNavPrevEntry        = null;
    let elemNavNextEntry        = null;
    
    let elemEntryTitle          = null;
    
    let elemEntryId             = null;
    let elemEntryName           = null;
    
    let elemShowMore            = null;
    let elemShowMoreDropDown    = null;
    
    let elemTabMedVac           = null;
    let elemTabHealth           = null;
    let elemTabNotes            = null;
    let elemTabOutput           = null;
    let elemTabMates            = null;
    let elemTabEdit             = null;
    let elemTabStatus           = null;
    
    
    
    let dataSowBoar             = null;
    
    let curActiveElemTab        = null;
    
    this.tableMedVac             = null;
    this.tablePigHealth          = null;
    this.tableNotesSowBoar       = null;
    
    
    
    this.init = function(){
        //textTranslation.setTranslations(TRANSLATION_PAGE_ACC_PIG_OPS);
        
        this.render();
        this.afterHtmlRender();
        
        
    }
    
    
    this.render = function(){
        
        elemIdNavPrevEntry      = `sow-boar-entry-page-title-prev`;
        elemIdNavNextEntry      = `sow-boar-entry-page-title-next`;
        
        elemIdEntryTitle        = `sow-boar-entry-page-title`;
        
        elemIdEntryId           = `sow-boar-entry-id`;
        elemIdEntryName         = `sow-boar-entry-name`;
        
        elemIdShowMore          = `sow-boar-entry-show-more`;
        elemIdShowMoreDropDown  = `sow-boar-entry-show-more-dropdown`;
        
        
        elemIdTabMedVac         = `sow-boar-medvac`;
        elemIdTabHealth         = `sow-boar-health`;
        elemIdTabNotes          = `sow-boar-notes`;
        elemIdTabOutput         = `sow-boar-output`;
        elemIdTabMates          = `sow-boar-mates`;
        elemIdTabEdit           = `sow-boar-edit`;
        elemIdTabStatus         = `sow-boar-status`;
           
        const html = `

        
    <div class="mobile-container">
        <div class="nav-left-right">
            <button class="nav-button blue" id="${elemIdNavPrevEntry}"><i class="fa-solid fa-arrow-left"></i></button>
            <span class="nav-title" id="${elemIdEntryTitle}">1 of 4</span>
            <button class="nav-button blue" id="${elemIdNavNextEntry}"><i class="fa-solid fa-arrow-right"></i></button>
                
        </div>
        
        
        
        <div class="entry-info">
            <div class="pid-and-sow">
                <div class="sow-name">
                    <span class="days-badge" id="${elemIdEntryName}">Sow</span>
                    <!--<span style="margin-right:10px;"><span  id="${elemIdEntryId}">1</span></span>-->
                </div>
            </div>
        </div>
        
        <!-- Tabs Navigation -->
        <div class="tabs-container">
            <button class="tab-button active" data-tab="${elemIdTabMedVac}">MedVac</button>
            <button class="tab-button" data-tab="${elemIdTabHealth}">Health</button>
            <button class="tab-button" data-tab="${elemIdTabNotes}">Notes</button>
            <button class="tab-button" data-tab="${elemIdTabOutput}">Output</button>
            <button class="tab-button" data-tab="${elemIdTabMates}" style="display: none">Mates</button>
            
            <div class="tab-button show-more-container" id="${elemIdShowMore}">
                More
                <div class="show-more-dropdown" id="${elemIdShowMoreDropDown}">
                    <div class="dropdown-item" data-tab="${elemIdTabEdit}">Edit</div>
                    <div class="dropdown-item" data-tab="${elemIdTabStatus}">Status</div>
                </div>
            </div>
        </div>
        
    </div>
    
     <!-- Tab Content Area - Scrolls below fixed sections -->
    <div class="tab-content-area" style="margin-top:0;">
        <div id="${elemIdTabMedVac}" class="tab-content active">
            <h2 class="tab-title">Medicines Vaccine</h2>
        </div>
        
        
        <div id="${elemIdTabHealth}" class="tab-content">
            <h2 class="tab-title">Health Problems</h2>
        </div>
        
        <div id="${elemIdTabNotes}" class="tab-content">
            <h2 class="tab-title">Notes</h2>
        </div>
        
        <div id="${elemIdTabOutput}" class="tab-content">
            <h2 class="tab-title">Piglets Output</h2>
        </div>
        
        <div id="${elemIdTabMates}" class="tab-content">
            <h2 class="tab-title">Piglets Output</h2>
        </div>
        
        <div id="${elemIdTabEdit}" class="tab-content">
            <h2 class="tab-title">Edit</h2>
        </div>
        
        <div id="${elemIdTabStatus}" class="tab-content">
            <h2 class="tab-title">Update Status</h2>
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
        elemNavPrevEntry        = document.getElementById(elemIdNavPrevEntry);
        elemNavNextEntry        = document.getElementById(elemIdNavNextEntry);
        
        elemEntryTitle          = document.getElementById(elemIdEntryTitle);
        
        elemEntryId             = document.getElementById(elemIdEntryId);
        elemEntryName           = document.getElementById(elemIdEntryName);
        
        elemShowMore            = document.getElementById(elemIdShowMore);
        elemShowMoreDropDown    = document.getElementById(elemIdShowMoreDropDown);
                
                
        elemTabMedVac           = document.getElementById(elemIdTabMedVac);
        elemTabHealth           = document.getElementById(elemIdTabHealth);
        elemTabNotes            = document.getElementById(elemIdTabNotes);
        elemTabOutput           = document.getElementById(elemIdTabOutput);
        elemTabMates            = document.getElementById(elemIdTabMates);
        elemTabEdit             = document.getElementById(elemIdTabEdit);
        elemTabStatus           = document.getElementById(elemIdTabStatus);
        
                
    }
    
    
    this._processAfterHtmlRender = function(){
        this.tableMedVac     = new TableMedVac({
            navigation:             settings.navigation,
            elemDivContainer:       elemTabMedVac
        });
        this.tableMedVac.init();
        
        /*
        this.tablePigHealth= new TableMedVac({
            navigation:             settings.navigation,
            elemDivContainer:       elemTabMedVac
        });*/
        
    }
    
    
    this._bindEventListeners = function(){
        const navItems      = elemDivContainer.querySelectorAll('.tab-button:not(.show-more-container)');
        const dropdownItems = elemDivContainer.querySelectorAll('.dropdown-item');
        const allTabs       = elemDivContainer.querySelectorAll('.tab-content');
        const showMoreControl = elemShowMore;
        const showMoreDropdown = elemShowMoreDropDown;
        
        function switchTab(tabId) {
            console.log('switchTab tabId =' + tabId) ;
            allTabs.forEach(tab => tab.classList.remove('active'));
            const selectedTab = document.getElementById(tabId);
            if (selectedTab) {
                selectedTab.classList.add('active');
                curActiveElemTab = selectedTab;
            }
            navItems.forEach(item => item.classList.remove('active'));
            
            if (tabId === elemIdTabMedVac   || 
                tabId === elemIdTabHealth   || 
                tabId === elemIdTabNotes    || 
                tabId === elemTabIdOutput) {
                const activeNav = document.querySelector(`[data-tab="${tabId}"]`);
                if (activeNav) activeNav.classList.add('active');
            }
            
            showMoreDropdown.classList.remove('active');
        }
        
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                switchTab(tabId);
            });
        });
        
        dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                switchTab(tabId);
                showMoreControl.querySelector('.nav-text').textContent = this.textContent;
                navItems.forEach(nav => nav.classList.remove('active'));
                showMoreControl.classList.add('active');
            });
        });
        
        showMoreControl.addEventListener('click', function(e) {
            console.log('Test');
            showMoreDropdown.classList.toggle('active');
            if (e.target === this || e.target.classList.contains('nav-text')) {
                e.stopPropagation();
                showMoreDropdown.classList.toggle('active');
            }
        });
        
        document.addEventListener('click', function(e) {
            if (!showMoreControl.contains(e.target)) {
                showMoreDropdown.classList.remove('active');
            }
        });
        

        
    }
    
    
    
    this.beforeShow = function(data_sow_boar, options){
        dataSowBoar = data_sow_boar;
        
        // Set Entry Title
        let s_title = '';
        
        switch (options.sow_boar_type){
            case SOW_BOAR_TYPE.SOW:  {s_title = 'Sow '; break;}
            case SOW_BOAR_TYPE.BOAR: {s_title = 'Boar '; break;}
            case SOW_BOAR_TYPE.GILT: {s_title = 'Gilt '; break;}
            
            case SOW_BOAR_TYPE.DISPOSED: {s_title = 'Disposed '; break;}
        }
        
        s_title += `${options.data_index} Of ${options.total_entries}`;
        
        elemEntryTitle.textContent = s_title;
        
        
        // Set Entry Name 
        
        let sow_reference = '';
        
        if ((data_sow_boar.name != null) && (data_sow_boar.name.length >0)){
            sow_reference = data_sow_boar.name;
            
            if (data_sow_boar.number != null) {
                sow_reference += ` (${data_sow_boar.number})`;
            }
            
        }
        else{
            sow_reference = data_sow_boar.number;
        }
        
        elemEntryName.textContent = sow_reference;
        
        // Set Entry hid; 2026115 still in deliberation if to show sow_boar_hid
        /*
        let entry_hid = null;
        switch (options.sow_boar_type){
            case SOW_BOAR_TYPE.SOW:  {entry_hid = data_sow_boar.hid; break;}
            case SOW_BOAR_TYPE.BOAR: {entry_hid = data_sow_boar.hid; break;}
            case SOW_BOAR_TYPE.GILT: {entry_hid = data_sow_boar.hid; break;}
            
            case SOW_BOAR_TYPE.DISPOSED: {entry_hid = data_sow_boar.sow_boar.hid; break;}
        }
        elemEntryId.textContent = entry_hid;
        */
        
		
		// Clicking on the SowBoar Name should open the SowBoar edit page
		elemEntryName.onclick = function(){
			const options_sow_boar ={
                is_add:         false,
                is_sow:         true,
                go_back_page:   elemDivContainer   // Go back to this page
            }
            
            
			const callback = null;
            
            navigation.pageSowBoarAddEdit.beforeShow(options_sow_boar);
            navigation.pageSowBoarAddEdit.callbackOnSuccessEdit = callback;
            
            const next_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_ADD_EDIT);
            navigation.showThisPage(next_page)
		}
		
		
        
        // Set arrow navigation
        elemNavPrevEntry.onclick = function(){
            navigation.pageSowBoarList.onClickSowBoarEntry(options.prev_sow_boar_hid);
        }
        
        elemNavNextEntry.onclick = function(){
            navigation.pageSowBoarList.onClickSowBoarEntry(options.next_sow_boar_hid);
        }
        
        
        
        // Set tableMedVac 
        this.tableMedVac.beforeShow(dataSowBoar);
        
        if ('notes' in dataSowBoar){
            const test = 1;
        }
        else{
            thisObj.requestDataSowBoarNotes(dataSowBoar);
        }
        
    }
    
    

    // Note sow_boar.notes and sow_boar.health_issue are merged together in
    // prod_notes table. There is a flag to tell if is  a health issue
    this.requestDataSowBoarNotes = function(data_sow_boar, callback_success, elem_show_error){
        const sow_boar_hid = data_sow_boar.hid;
        
        const base_url = window.location.origin;
        let url = `${base_url}/pig_prod_notes/list?sow_boar_hid=${sow_boar_hid}`;
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            async: true,
  
            beforeSend: function(){
            },
  
            success: function(response){
                
                if (response.result.num == 0){
                    
                    // response.data is ORDERED BY date DESC
                    const health_issues = [];
                    const notes = [];
                    
                    for (cur_entry of response.data){
                        if ('is_health_issue' in cur_entry.prod_notes){
                            health_issues.unshift(cur_entry);
                        }
                        else{
                            notes.unshift(cur_entry);
                        }
                    }
                    
                    data_sow_boar['health_issues'] = health_issues;
                    data_sow_boar['notes'] = notes;
                    
                    if (callback_success){callback_success(response.data);}
                }    
                else{
                    navigation.serverError.receivedErrorMessage(
                        response, elem_show_error);
                }
            },
  
            complete: function(){
            },
  
            error: function(jqXHR, textStatus, errorThrown){
                navigation.serverError.serverErrorThrown(jqXHR, textStatus, errorThrown);
            }
        });
    }
    
    
    
    /** 
    This should open to MedVac edit page.
    
    */
    this.onClickTableRowMedVac = function(medvac_hid){
        
    }

}