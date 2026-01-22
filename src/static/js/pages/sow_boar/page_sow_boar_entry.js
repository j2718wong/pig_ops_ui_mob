// January 11, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../common/page_view_basic.js';

import {getSowBoarReference}    from '../common/common_app.js';


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
import {TableNotes}             from './table_notes.js'
import {TablePigletsOutput}     from './table_piglets_output.js'

import {TableMates}             from './table_mates.js'
import {TableGiltOps}           from './table_gilt_ops.js'



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
    
    let elemIdTabBtnOutput      = null;
    let elemIdTabBtnMates       = null;
    let elemIdTabBtnGiltOps     = null;
    
    let elemIdTabMedVac         = null;
    let elemIdTabHealth         = null;
    let elemIdTabNotes          = null;
    let elemIdTabOutput         = null;
    let elemIdTabMates          = null;
    let elemIdTabGiltOps        = null;
    let elemIdTabStatus         = null;
    
    let elemIdTabMore           = null;
    
    
    let elemTabBtnOutput        = null;
    let elemTabBtnMates         = null;
    let elemTabBtnGiltOps       = null;
    
    
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
    let elemTabGiltOps          = null;
    let elemTabStatus           = null;
    
    
    let allTabs                 = null;
    let navItems                = null;
    
    
    let dataSowBoar             = null;
    
    let curActiveTabId          = null;
    let curActiveElemTab        = null;
    
    this.tableMedVac            = null;
    this.tablePigHealth         = null;
    this.tableSowBoarNotes      = null;
    this.tablePigletsOutput     = null;
    
    this.tableMates             = null;
    
    
    let showOptions             = null;
    
    
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
        
        
        elemIdTabBtnOutput      = `sow-boar-output-btn`;
        elemIdTabBtnMates       = `sow-boar-mates-btn`;
        elemIdTabBtnGiltOps     = `sow-boar-gilt-ops-btn`;
        
        elemIdTabMedVac         = `sow-boar-medvac`;
        elemIdTabHealth         = `sow-boar-health`;
        elemIdTabNotes          = `sow-boar-notes`;
        elemIdTabOutput         = `sow-boar-output`;
        elemIdTabMates          = `sow-boar-mates`;
        elemIdTabGiltOps        = `sow-boar-gilt-ops`;
        elemIdTabStatus         = `sow-boar-status`;
        
        
        elemIdTabMore           = `sow-boar-more`;
           
        /**
        The number of tabs available are dynamic by sow_boar_type.
        
        Because of space constrainst in mobile view,
        Only a maximum of 4 menus buttons can be directly used.
        The excess menus are available via the global dynamic More Modal.       
        
        It maybe possible that more tabs will be added in the future,
        and will be added in the More Modal function. 
        
        
        2026-01-21
        There maybe a better way to dynamically create the buttons
        particulary for bigger screen  like tablets; and this is needed in 
        the future for bigger screens to transfer the function in More Modal  
        directly in the tab buttons.
        As of this writing, this is manually switched until changed. 
        
        
        In the desktop version,
        none of this will show up since all data are in tables form.
        
        
        For Sow 
        - MedVac
        - Health
        - Notes
        - Output
        
        - Mates (via More Modal)
        
        For Boar 
        - MedVac
        - Health
        - Notes
        - Mates
        
        - Mates External (via More Modal)
        
        For Gilts 
        - MedVac
        - Health
        - Notes
        - Gilt Ops
        
        
        Note the Edit SowBoar function is embedded in the SowBoar name 
        in the page title. This is to conserve menu space.
        
        Originally the Sowboar Update Status is also planned to be put in the
        menu buttons or via the More Modal function. It turns out all of the 
        contents in the tabs are in table form.
        
        
        As of writing the SowBoar Update Status will be put inside edit page.
        
        */
           
           
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
            
            <button class="tab-button" data-tab="${elemIdTabOutput}"    id="${elemIdTabBtnOutput}">Output</button>
            <button class="tab-button" data-tab="${elemIdTabMates}"     id="${elemIdTabBtnMates}" style="display: none">Mates</button>
            <button class="tab-button" data-tab="${elemIdTabGiltOps}"   id="${elemIdTabBtnGiltOps}" style="display: none">Mates</button>
            
            <button class="tab-button" data-tab="${elemIdTabMore}" id="${elemIdShowMore}">
                More
            </button>
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
            <h2 class="tab-title">Mates</h2>
        </div>
        
        <div id="${elemIdTabGiltOps}" class="tab-content">
            <h2 class="tab-title">Gilt Ops</h2>
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
        
        elemTabBtnOutput        = document.getElementById(elemIdTabBtnOutput);
        elemTabBtnMates         = document.getElementById(elemIdTabBtnMates);
        elemTabBtnGiltOps       = document.getElementById(elemIdTabBtnGiltOps);
        
        elemShowMore            = document.getElementById(elemIdShowMore);
        elemShowMoreDropDown    = document.getElementById(elemIdShowMoreDropDown);
                
                
        elemTabMedVac           = document.getElementById(elemIdTabMedVac);
        elemTabHealth           = document.getElementById(elemIdTabHealth);
        elemTabNotes            = document.getElementById(elemIdTabNotes);
        elemTabOutput           = document.getElementById(elemIdTabOutput);
        elemTabMates            = document.getElementById(elemIdTabMates);
        elemTabGiltOps          = document.getElementById(elemIdTabGiltOps);
        elemTabStatus           = document.getElementById(elemIdTabStatus);
        
        allTabs                 = elemDivContainer.querySelectorAll('.tab-content');
        navItems                = elemDivContainer.querySelectorAll('.tab-button');
        
                
    }
    
    
    this._processAfterHtmlRender = function(){
        this.tableMedVac        = new TableMedVac({
            navigation:             settings.navigation,
            parentObj:              thisObj,
            uniqueKey:              'sow-boar-medvac',
            elemDivContainer:       elemTabMedVac
        });
        this.tableMedVac.init();
        
        
        this.tablePigHealth     = new TableHealthIssue({
            navigation:             settings.navigation,
            parentObj:              thisObj,
            uniqueKey:              'sow-boar-health',
            elemDivContainer:       elemTabHealth
        });
        this.tablePigHealth.init();
        
        
        this.tableSowBoarNotes = new TableNotes({
            navigation:             settings.navigation,
            parentObj:              thisObj,
            uniqueKey:              'sow-boar-notes',
            elemDivContainer:       elemTabNotes
        });
        this.tableSowBoarNotes.init();
        
        
        this.tablePigletsOutput = new TablePigletsOutput({
            navigation:             settings.navigation,
            parentObj:              thisObj,
            uniqueKey:              'sow-piglets-output',
            elemDivContainer:       elemTabOutput
        });
        this.tablePigletsOutput.init();
        
        
        this.tableMates         = new TableMates({
            navigation:             settings.navigation,
            parentObj:              thisObj,
            uniqueKey:              'sow-boar-mates',
            elemDivContainer:       elemTabMates
        });
        this.tableMates.init();
        
        
        this.tableGiltOps       = new TableGiltOps({
            navigation:             settings.navigation,
            parentObj:              thisObj,
            uniqueKey:              'sow-boar-gilt-ops',
            elemDivContainer:       elemTabGiltOps
        });
        this.tableGiltOps.init();
        
        
    }
    
    
    this.switchTab = function(tabId){
        
        console.log('switchTab tabId =' + tabId) ;
            
        curActiveTabId = tabId;
        
        
        if (tabId != elemIdTabMore){
        
            allTabs.forEach(tab => tab.classList.remove('active'));
            const selectedTab = document.getElementById(tabId);
            if (selectedTab) {
                selectedTab.classList.add('active');
                curActiveElemTab = selectedTab;
                
                thisObj.beforeShowTab();
            }
            else{
                console.log('tab not found');
            }
        }
        
        navItems.forEach(item => item.classList.remove('active'));
        
        if (tabId === elemIdTabMedVac   || 
            tabId === elemIdTabHealth   || 
            tabId === elemIdTabNotes    || 
            tabId === elemIdTabOutput   ||
            tabId === elemIdTabMore   ) {
            const activeNav = document.querySelector(`[data-tab="${tabId}"]`);
            if (activeNav) activeNav.classList.add('active');
        }
        else{
            
        }
            
    }
    
    
    this._bindEventListeners = function(){
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                thisObj.switchTab(tabId);
            });
        });
        
        
        elemShowMore.addEventListener('click', function(e) {
            thisObj.configureShowMore();
        });
        
    }
    
    
    this.beforeShow = function(data_sow_boar, options){
        dataSowBoar = data_sow_boar;
        
        if (options) { // replace options only if specified
            showOptions = options;
        }
        
        console.log('options');
        console.log(options);
        
        // Set Entry Title
        let s_title = '';
        
        switch (showOptions.sow_boar_type){
            case SOW_BOAR_TYPE.SOW:  {s_title = 'Sow '; break;}
            case SOW_BOAR_TYPE.BOAR: {s_title = 'Boar '; break;}
            case SOW_BOAR_TYPE.GILT: {s_title = 'Gilt '; break;}
            
            case SOW_BOAR_TYPE.DISPOSED: {s_title = 'Disposed '; break;}
        }
        
        s_title += `${showOptions.data_index} Of ${showOptions.total_entries}`;
        
        elemEntryTitle.textContent = s_title;
        
        
        // Set Entry Name 
        console.log('data_sow_boar');
        console.log(data_sow_boar);
        
        let sow_boar_name   = getSowBoarReference(data_sow_boar.sow_boar);
        
        // Append SOW Status so that no ambiguity
        
        if ('dispose_status_id' in data_sow_boar.sow_boar){
            switch(data_sow_boar.sow_boar.dispose_status_id){
                case SOW_STATUS.CULLED:{
                    sow_boar_name += ' - Culled';
                    break;
                }
                case SOW_STATUS.DEAD:{
                    sow_boar_name += ' - Dead';
                    break;
                }
                case SOW_STATUS.SOLD:{
                    sow_boar_name += ' - Sold';
                    break;
                }
                
                case SOW_STATUS.DELETE:{
                    sow_boar_name += ' - Deleted';
                    break;
                }
                
                default:{
                    break;
                }
                
            }
            
        }
        else{
            if ('farm_sow_id' in data_sow_boar.sow_boar){
            
                switch(data_sow_boar.sow_boar.status_id){
                    case SOW_STATUS.GESTATING:{
                        sow_boar_name += ' - Gesta'
                        break;
                    }
                    
                    case SOW_STATUS.LACTATING:{
                        sow_boar_name += ' - Lacta'
                        break;
                    }
                    
                    case SOW_STATUS.WEANING:{
                        sow_boar_name += ' - Wean'
                        break;
                    }
                    
                    default:{
                        if (data_sow_boar.is_production_ready > 0){
                            sow_boar_name += ' - Prod Ready'
                        }
                        break;
                    }
                }
            }
        }
        
        
        elemEntryName.textContent = sow_boar_name;
        
        // Set Entry hid; 2026115 still in deliberation if to show sow_boar_hid
        /*
        let entry_hid = data_sow_boar.sow_boar.hid;
        elemEntryId.textContent = entry_hid;
        */
        
        
        // Clicking on the SowBoar Name should open the SowBoar edit page
        if (options.sow_boar_type != SOW_BOAR_TYPE.DISPOSED){
            elemEntryName.onclick = function(){
                const options_sow_boar ={
                    is_add:         false,
                    sow_boar_type:  showOptions.sow_boar_type,
                    go_back_page:   elemDivContainer   // Go back to this page
                }

                
                navigation.pageSowBoarAddEdit.beforeShow(options_sow_boar, dataSowBoar);
                navigation.pageSowBoarAddEdit.setCallbackOnSuccessUpdateStatus(thisObj.onSuccessUpdateStatus);
                
                const next_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_ADD_EDIT);
                navigation.showThisPage(next_page)
            }
        } 
        else{
            elemEntryName.onclick = function(){
                const options_sow_boar ={
                    sow_boar_type:  showOptions.sow_boar_type,
                    go_back_page:   elemDivContainer   // Go back to this page
                }

                
                navigation.pageSowBoarDisposed.beforeShow(options_sow_boar, dataSowBoar);
                
                const next_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_DISPOSED);
                navigation.showThisPage(next_page)
            }
        }
        
        
        // Set left-right arrow navigation
        elemNavPrevEntry.onclick = function(){
            navigation.pageSowBoarList.onClickSowBoarEntry(showOptions.prev_sow_boar_hid);
        }
        
        elemNavNextEntry.onclick = function(){
            navigation.pageSowBoarList.onClickSowBoarEntry(showOptions.next_sow_boar_hid);
        }
        
        
        
        // Setup tabs navigation
        if ('farm_sow_id' in data_sow_boar.sow_boar){
            // sows and gilts
            //
            // gilt is status_id = SOW_STATUS.GROWING and  is_production_ready = 0
            
            let is_sow = 1;
            if (data_sow_boar.sow_boar.status_id == SOW_STATUS.GROWING && 
                data_sow_boar.sow_boar.is_production_ready == 0){is_sow = 0;}
            
            if (is_sow > 0){
            
                elemTabBtnOutput.style.display = 'block';
                elemTabBtnMates.style.display = 'none';
                
                elemShowMore.style.display = 'block';
            }
            else{
                
                elemTabBtnOutput.style.display = 'none';
                elemTabBtnMates.style.display = 'none';
                
                elemTabBtnGiltOps.style.display = 'block';

                elemShowMore.style.display = 'none';
                
            }
        }
        else{
            // boars
            elemTabBtnOutput.style.display = 'none';
            elemTabBtnMates.style.display = 'block';
            
            elemShowMore.style.display = 'block';
        }
      
        
        // Request SowBoar data_details 
        if ('data_details' in dataSowBoar){
            // TODO ; still thinking what to do
            thisObj.beforeShowTab();
        }
        else{
            const callback_success = function(){
                thisObj.beforeShowTab();
            }
            thisObj.requestDataSowBoarDetails(dataSowBoar, callback_success);
        }
        
        
    }
    
    
    this.configureShowMore = function(){
        
        const on_click_mates = function(data){
            thisObj.switchTab(elemIdTabMates);
            
        };
        
        if ('farm_sow_id' in dataSowBoar.sow_boar){
            
            const sow_boar_name = getSowBoarReference(dataSowBoar.sow_boar);
            
            const menu_items = [
                {   label: 'Mates',
                    action: on_click_mates,
                    data:   dataSowBoar
                }
                
            ];
            
            const options = {
                title: sow_boar_name
            };
            
            navigation.moreModal.beforeShow(menu_items, options);
            
        }
        
        else{
            const sow_boar_name = getSowBoarReference(dataSowBoar.sow_boar);
            
            const menu_items = [
                {   label: 'External Mates',
                    action: null,
                    data:   dataSowBoar
                }
                
            ];
            
            const options = {
                title: sow_boar_name
            };
            
            navigation.moreModal.beforeShow(menu_items, options);
        }
            
        
        
    }
    
    
    this.beforeShowTab = function(){
        if (dataSowBoar == null){return;}
        
        switch(curActiveTabId){
            case elemIdTabMedVac:{
                thisObj.tableMedVac.beforeShow(dataSowBoar);
                break;
            }
            
            case elemIdTabHealth:{
                thisObj.tablePigHealth.beforeShow(dataSowBoar);
        
                break;
            }
            
            case elemIdTabNotes:{
                thisObj.tableSowBoarNotes.beforeShow(dataSowBoar);
                break;
            }
            
            case elemIdTabOutput:{
                // This is only applicable to sows only
                if ('farm_sow_id' in dataSowBoar.sow_boar){
                    thisObj.tablePigletsOutput.beforeShow(dataSowBoar);
                }
                break;
            }
            
            case elemIdTabMates:{
                thisObj.tableMates.beforeShow(dataSowBoar);
                break;
            }
            
            case elemIdTabGiltOps:{
                thisObj.tableGiltOps.beforeShow(dataSowBoar);
                break;
            }
            
            case elemIdTabStatus:{
                break;
            }
            
            default:{
                thisObj.tableMedVac.beforeShow(dataSowBoar);
                break;
            }
        }
        
    }
    

    this.resetToFirstTab = function(){
        thisObj.switchTab(elemIdTabMedVac);
    }
    

    // Note sow_boar.notes and sow_boar.health_issue are merged together in
    // prod_notes table. There is a flag to tell if is  a health issue
    this.requestDataSowBoarNotes = function(data_sow_boar, callback_success, elem_show_error){
        const sow_boar_hid = data_sow_boar.sow_boar.hid;
        
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
                    
                    for (const cur_entry of response.data){
                        if ('is_health_issue' in cur_entry.prod_notes){
                            health_issues.push(cur_entry);
                        }
                        else{
                            notes.push(cur_entry);
                        }
                    }
                    
                    data_sow_boar.data_details.list_health_issues = health_issues;
                    data_sow_boar.data_details.list_notes        = notes;
                    
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
    
    
    
    // This is a request to get sow_boar details that returns tables.
    this.requestDataSowBoarDetails = function(data_sow_boar, callback_success, elem_show_error){
        const sow_boar_hid = data_sow_boar.sow_boar.hid;
        
        const base_url = window.location.origin;
        let url = `${base_url}/sow_boar/entry?sow_boar_hid=${sow_boar_hid}`;
        
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url,
            async: true,
  
            beforeSend: function(){
            },
  
            success: function(response){
                
                if (response.result.num == 0){
                    
                    // attach data to data_sow_boar
                    data_sow_boar.data_details = response.data;
                    
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
    
    
    
    this.onSuccessUpdateStatus = function(){
        // This is triggered when a sow_boar is deleted or disposed.
        if (showOptions.sow_boar_list){
            // Remove sow_boar
            const index = showOptions.data_index -1; // This is base 1 counting number
            showOptions.sow_boar_list.splice(index, 1);
            
            // Go back to sow_boar_list
            navigation._onClickNavSowBoar(null, showOptions.sow_boar_type);
        }
    }
    
    
    /** 
    This should open to MedVac edit page.
    
    */
    this.onClickTableRowMedVac = function(medvac_hid){
        
    }

}