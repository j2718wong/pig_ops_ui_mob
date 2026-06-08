// page_sow_boar_entry.js

// January 11, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageViewPigFarmPage}    from '../common/page_view_basic.js';

import {getSowBoarReference}    from '../common/common_app.js';


import {APPLICATION,
        PAGE_ID,
        HASH_ROUTES,
        SOW_BOAR_TYPE,
        SOW_STATUS,
        MULTIKEY_OBJ_TYPE}      from '../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}         from '../../utils.js';
        
import {ComponentTabsWithMore}  from '../common/ui/comp_tabs_with_more.js';
        

import {TableMedVac}            from '../multikey/table_medvac.js'
import {TableHealthIssue}       from '../multikey/table_health_issue.js'
import {TableNotes}             from '../multikey/table_notes.js'


import {TablePigletsOutput}     from './table_piglets_output.js'

import {TableMates}             from './table_mates.js'
import {TableGiltOps}           from './table_gilt_ops.js'





export function PageSowBoarEntry(input_settings){
    PageViewPigFarmPage.call(this);
    
    const TAG                   = 'PageSowBoarEntry';
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    this.setNavigation(navigation);
    
    
    /*
    Typical settings = {
        navigation:             this,
        elemIdDivContainer:     elemIdContSowBoarEntry,
        uniqueKey:              'sow-boar-entry'
    };
    */
    const settings              = input_settings;
    
    
    // This is needed as this will be first element to be rendered
    let elemDivContainer        = document.getElementById(settings.elemIdDivContainer);
    
    let elemIdNavPrevEntry      = null;
    let elemIdNavNextEntry      = null;
    
    let elemIdEntryTitle        = null;
    
    let elemIdEntryId           = null;
    let elemIdEntryName         = null;
    let elemIdEntryProdLink     = null;
    
    let elemIdTabsContainer     = null;
    let elemIdTabContentArea    = null;
    
    let componentTabsWithMore   = null;
    
    let elemIdTabMedVac         = `sow-boar-medvac`;
    let elemIdTabHealth         = `sow-boar-health`;
    let elemIdTabNotes          = `sow-boar-notes`;
    let elemIdTabOutput         = `sow-boar-output`;
    let elemIdTabMates          = `sow-boar-mates`;
    let elemIdTabMatesExt       = `sow-boar-mates-ext`;
    let elemIdTabGiltOps        = `sow-boar-gilt-ops`;
        
    
    let tabsSowEntry = [
        {
            data_tab_id:    elemIdTabMedVac,
            label:          'MedVac'
        },
        
        {
            data_tab_id:    elemIdTabHealth,
            label:          'Health'
        },
        
        {
            data_tab_id:    elemIdTabNotes,
            label:          'Notes'
        },
        
        {
            data_tab_id:    elemIdTabOutput,
            label:          'Output'
        },
        
        {
            data_tab_id:    elemIdTabMates,
            label:          'Mates'
        }
        
    ];
    
    
    let tabsBoarEntry = [
        {
            data_tab_id:    elemIdTabMedVac,
            label:          'MedVac'
        },
        
        {
            data_tab_id:    elemIdTabHealth,
            label:          'Health'
        },
        
        {
            data_tab_id:    elemIdTabNotes,
            label:          'Notes'
        },
        
        {
            data_tab_id:    elemIdTabMates,
            label:          'Mates'
        }
        
    ];
    
    
    let tabsGiltEntry = [
        {
            data_tab_id:    elemIdTabMedVac,
            label:          'MedVac'
        },
        
        {
            data_tab_id:    elemIdTabHealth,
            label:          'Health'
        },
        
        {
            data_tab_id:    elemIdTabNotes,
            label:          'Notes'
        },
        
        {
            data_tab_id:    elemIdTabGiltOps,
            label:          'Gilt Ops'
        }
        
    ];
    
    
    let curActiveTabs = tabsSowEntry;

    
    
    let elemNavPrevEntry        = null;
    let elemNavNextEntry        = null;
    
    let elemEntryTitle          = null;
    
    let elemEntryId             = null;
    let elemEntryName           = null;
    let elemEntryProdLink       = null;
    
    
    let elemTabsContainer       = null;
    let elemTabContentArea      = null;
    
    let elemTabMedVac           = null;
    let elemTabHealth           = null;
    let elemTabNotes            = null;
    let elemTabOutput           = null;
    let elemTabMates            = null;
    let elemTabGiltOps          = null;
    let elemTabStatus           = null;
    
    
    let dataSowBoar             = null;
    
    
    this.elemIdTabMedVac        = elemIdTabMedVac;
    this.elemIdTabHealth        = elemIdTabHealth;  
    this.elemIdTabNotes         = elemIdTabNotes; 
    this.elemIdTabOutput        = elemIdTabOutput;  
    this.elemIdTabMates         = elemIdTabMates; 
    this.elemIdTabMatesExt      = elemIdTabMatesExt;
    this.elemIdTabGiltOps       = elemIdTabGiltOps; 
    
    
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
        
        elemIdNavPrevEntry      = `${settings.uniqueKey}-page-title-prev`;
        elemIdNavNextEntry      = `${settings.uniqueKey}-page-title-next`;
        
        elemIdEntryTitle        = `${settings.uniqueKey}-page-title`;
        
        elemIdEntryId           = `${settings.uniqueKey}-id`;
        elemIdEntryName         = `${settings.uniqueKey}-name`;
        elemIdEntryProdLink     = `${settings.uniqueKey}-prod-link`;
        
        elemIdTabsContainer     = `${settings.uniqueKey}-tabs-container`;
        elemIdTabContentArea    = `${settings.uniqueKey}-tab-content`;


        componentTabsWithMore   = new ComponentTabsWithMore({
            navigation:         navigation,
            uniqueKey:          `${settings.uniqueKey}-tab`,
            elemIdDivContainer:     settings.elemIdDivContainer,
            elemIdTabsContainer:    elemIdTabsContainer,
            elemIdTabContentArea:   elemIdTabContentArea,
            
            showMoreTitle:      null, // this dynamically change
            
            tabs:               curActiveTabs
        });
        
        
        /**
        The number of tabs available are dynamic by sow_boar_type.
        
        Because of space constrainst in mobile view,
        Only a maximum of 4 menus buttons can be directly used.
        
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
        
        const html_tab_buttons      = componentTabsWithMore.getHtml();
        
           
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
                    <span class="days-badge" style="display:block;">
                        <span id="${elemIdEntryName}"></span>
                        <span id="${elemIdEntryProdLink}"></span>
                    </span>
                </div>
            </div>
        </div>
        
        <!-- Tabs Navigation -->
        <div class="tabs-container" id="${elemIdTabsContainer}">
            ${html_tab_buttons}
        </div>
        
    </div>
    
     <!-- Tab Content Area - Scrolls below fixed sections -->
    <div class="tab-content-area" id="${elemIdTabContentArea}" style="margin-top:0;">
        <div id="${elemIdTabMedVac}" class="tab-content active">
            <h2 class="tab-title">Medicines And Vaccines</h2>
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
        

    </div>
        `;
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        
        componentTabsWithMore.afterHtmlRender();
        
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemNavPrevEntry        = elemDivContainer.querySelector('#'+elemIdNavPrevEntry);
        elemNavNextEntry        = elemDivContainer.querySelector('#'+elemIdNavNextEntry);
        
        elemEntryTitle          = elemDivContainer.querySelector('#'+elemIdEntryTitle);
        
        elemEntryId             = elemDivContainer.querySelector('#'+elemIdEntryId);
        elemEntryName           = elemDivContainer.querySelector('#'+elemIdEntryName);
        elemEntryProdLink       = elemDivContainer.querySelector('#'+elemIdEntryProdLink);
        
        elemTabsContainer       = elemDivContainer.querySelector('#'+elemIdTabsContainer);
        elemTabContentArea      = elemDivContainer.querySelector('#'+elemIdTabContentArea);
                
        elemTabMedVac           = elemDivContainer.querySelector('#'+elemIdTabMedVac);
        elemTabHealth           = elemDivContainer.querySelector('#'+elemIdTabHealth);
        elemTabNotes            = elemDivContainer.querySelector('#'+elemIdTabNotes);
        elemTabOutput           = elemDivContainer.querySelector('#'+elemIdTabOutput);
        elemTabMates            = elemDivContainer.querySelector('#'+elemIdTabMates);
        elemTabGiltOps          = elemDivContainer.querySelector('#'+elemIdTabGiltOps);

    }
    
    
    this._processAfterHtmlRender = function(){
        this.tableMedVac        = new TableMedVac({
            navigation:             settings.navigation,
            parentObj:              thisObj,
            uniqueKey:              'sow-boar-medvac',
            elemDivContainer:       elemTabMedVac,
            medvacType:             MULTIKEY_OBJ_TYPE.SOW_BOAR
        });
        this.tableMedVac.init();
        
        
        this.tablePigHealth     = new TableHealthIssue({
            navigation:             settings.navigation,
            parentObj:              thisObj,
            uniqueKey:              'sow-boar-health',
            elemDivContainer:       elemTabHealth,
            healthType:             MULTIKEY_OBJ_TYPE.SOW_BOAR
        });
        this.tablePigHealth.init();
        
        
        this.tableSowBoarNotes = new TableNotes({
            navigation:             settings.navigation,
            parentObj:              thisObj,
            uniqueKey:              'sow-boar-notes',
            elemDivContainer:       elemTabNotes,
            notesType:              MULTIKEY_OBJ_TYPE.SOW_BOAR
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
        
        
        componentTabsWithMore.beforeShowTab = thisObj.beforeShowTab;
    }
    
    
    this._bindEventListeners = function(){
        
        elemEntryTitle.addEventListener('click', function() {
            const next_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_LIST);
            navigation.showThisPage(next_page);
        
            const options= {
                sow_boar_type: showOptions.sow_boar_type
            };
            navigation.pageSowBoarList.show(options);
        });
    };
    
    
    this.renderPage = function(page_data){
        thisObj.show(page_data.data_sow_boar, page_data.options);
    }
    
    
    this.show = function(data_sow_boar, options){
        
        dataSowBoar = data_sow_boar;

        componentTabsWithMore.curData = data_sow_boar;
        
        
        // Change options only if there is a given option
        if (options) {
            showOptions = options;
        }
        
        
        // Set Entry Title
        let s_title = '';
        
        switch (showOptions.sow_boar_type){
            case SOW_BOAR_TYPE.SOW:  {
                s_title = 'Sow '; 
                
                if (curActiveTabs != tabsSowEntry){
                    componentTabsWithMore.changeTabButtons(tabsSowEntry);
                    curActiveTabs = tabsSowEntry;
                }
                
                break;
            }
            case SOW_BOAR_TYPE.BOAR: {
                s_title = 'Boar '; 
                
                if (curActiveTabs != tabsBoarEntry){
                    componentTabsWithMore.changeTabButtons(tabsBoarEntry);
                    curActiveTabs = tabsBoarEntry;
                }
                
                break;
            }
            
            case SOW_BOAR_TYPE.GILT: {
                s_title = 'Gilt '; 
                
                if (curActiveTabs != tabsGiltEntry){
                    componentTabsWithMore.changeTabButtons(tabsGiltEntry);
                    curActiveTabs = tabsGiltEntry;
                }
                
                break;
            }
            
            case SOW_BOAR_TYPE.DISPOSED: {
                s_title = 'Disposed '; 
                
                // For disposed entry, the tabs can only be either sow tabs or 
                // boar tabs;
                if (data_sow_boar.sow_boar.farm_sow_id){
                    //  Disposed entry is a sow
                    if (curActiveTabs != tabsSowEntry){
                        componentTabsWithMore.changeTabButtons(tabsSowEntry);
                        curActiveTabs = tabsSowEntry;
                    } else{
                        componentTabsWithMore.changeTabButtons(tabsBoarEntry);
                        curActiveTabs = tabsBoarEntry;
                    }
                }
                
                break;
            }
        }
        
        
        
        s_title += `${showOptions.data_index} Of ${showOptions.total_entries}`;
        
        elemEntryTitle.textContent = s_title;
        
        
        // Set Entry Name 
        
        let sow_boar_name   = getSowBoarReference(data_sow_boar.sow_boar);
        let prod_link = '';
        
        
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
                        prod_link = ' - Gesta'
                        
                        // Clicking on the prod_link should open to Gesta entry Page
                        elemEntryProdLink.onclick = function(){
                            navigation.onClickProdGestatingEntry(data_sow_boar.sow_boar.last_farm_prod_id);
                        }
                        
                        break;
                    }
                    
                    case SOW_STATUS.LACTATING:{
                        prod_link = ' - Lacta'
                        
                        // Clicking on the prod_link should open to Gesta entry Page
                        elemEntryProdLink.onclick = function(){
                            navigation.onClickProdLactatingEntry(data_sow_boar.sow_boar.last_farm_prod_id);
                        }

                        break;
                    }
                    
                    case SOW_STATUS.WEANING:{
                        prod_link = ' - Wean'
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
        elemEntryProdLink.textContent = prod_link;
        
        // Set Entry hid; 2026115 still in deliberation if to show sow_boar_hid
        /*
        let entry_hid = data_sow_boar.sow_boar.hid;
        elemEntryId.textContent = entry_hid;
        */
        
        
        /*
        // Clicking on the SowBoar Name should open the SowBoar edit page
        if (showOptions.sow_boar_type != SOW_BOAR_TYPE.DISPOSED){
            elemEntryName.onclick = function(){
                // Show Container
                const next_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_ADD_EDIT);
                
                // Push currentPage to NavHistory; 
                // Will also compare current page and  next_page NAV_MENU_GROUP.
                navigation.pushCurrentPageToNavHistory(next_page);
                
                navigation.showThisPage(next_page);
                
                
                // Show Page
                const options_sow_boar ={
                    is_add:         false,
                    sow_boar_type:  showOptions.sow_boar_type,
                    go_back_page:   elemDivContainer   // Go back to this page
                };

                navigation.pageSowBoarAddEdit.show(options_sow_boar, dataSowBoar);
                navigation.pageSowBoarAddEdit.setCallbackOnSuccessUpdateStatus(
                    thisObj.onSuccessUpdateStatus);
            }
        } 
        else{
            elemEntryName.onclick = function(){
                const options_disposed ={
                    sow_boar_type:  showOptions.sow_boar_type,
                    go_back_page:   elemDivContainer   // Go back to this page
                };

                
                navigation.pageSowBoarDisposed.show(dataSowBoar, options_disposed);
                
                const next_page = navigation.getPageContainer(PAGE_ID.SOW_BOAR_DISPOSED);
                navigation.showThisPage(next_page)
            }
        }
        */
        // Clicking on the SowBoar Name should open the SowBoar edit page
        if (showOptions.sow_boar_type != SOW_BOAR_TYPE.DISPOSED){
            elemEntryName.onclick = function(){
                // Convert type to label
                let typeLabel = 'sows';
                switch(showOptions.sow_boar_type){
                    case SOW_BOAR_TYPE.SOW:     typeLabel = 'sows'; break;
                    case SOW_BOAR_TYPE.BOAR:    typeLabel = 'boars'; break;
                    case SOW_BOAR_TYPE.GILT:    typeLabel = 'gilts'; break;
                }
                
                // Build the return route (current entry page)
                const entryRoute = `${HASH_ROUTES.SOW_BOAR_ENTRY}/${dataSowBoar.sow_boar.hid}`;
                
                // Build the list route for return after edit
                const listRoute = `${HASH_ROUTES.SOW_BOAR_LIST}?type=${typeLabel}`;
                
                
                // Use hash router navigation
                const dataHashRoute = {
                    pageId:             PAGE_ID.SOW_BOAR_ADD_EDIT,
                    isAdd:              false,
                    sowBoarType:        typeLabel,
                    entryHid:           dataSowBoar.sow_boar.hid,
                    returnRoute:        entryRoute,
                    returnPageId:       PAGE_ID.SOW_BOAR_ENTRY,
                    
                    prevSowBoarHid:     showOptions.prev_sow_boar_hid,
                    nextSowBoarHid:     showOptions.next_sow_boar_hid,
                    dataIndex:          showOptions.data_index,
                    totalEntries:       showOptions.total_entries
                };
                
                navigation.managerHashRoute.hashRouter.navigate(
                    HASH_ROUTES.SOW_BOAR_ADD_EDIT, dataHashRoute);
                
                // TO removed?
                //navigation.pageSowBoarAddEdit.setCallbackOnSuccessUpdateStatus(
                //    thisObj.onSuccessUpdateStatus);
            };
        } 
        else {
            // For disposed entries
            elemEntryName.onclick = function(){
                let typeLabel = 'disposed';
                
                const entryRoute = `${HASH_ROUTES.SOW_BOAR_ENTRY}/${dataSowBoar.sow_boar.hid}`;
                const listRoute = `${HASH_ROUTES.SOW_BOAR_LIST}?type=${typeLabel}`;
                
                const dataHashRoute = {
                    pageId:             PAGE_ID.SOW_BOAR_DISPOSED,
                    sowBoarType:        typeLabel,
                    entryHid:           dataSowBoar.sow_boar.hid,
                    returnRoute:        entryRoute,
                    returnPageId:       PAGE_ID.SOW_BOAR_ENTRY,
                    listReturnRoute:    listRoute,
                    listReturnPageId:   PAGE_ID.SOW_BOAR_LIST
                };
                
                navigation.managerHashRoute.hashRouter.navigate(
                    HASH_ROUTES.SOW_BOAR_DISPOSED, dataHashRoute);
                
                const disposedPage = navigation.getPageContainer(
                    PAGE_ID.SOW_BOAR_DISPOSED);
                navigation.showThisPage(disposedPage);
                
                const options_disposed = {
                    sow_boar_type: showOptions.sow_boar_type,
                    returnRoute: entryRoute,
                    returnPageId: PAGE_ID.SOW_BOAR_ENTRY
                };
                
                navigation.pageSowBoarDisposed.show(dataSowBoar, options_disposed);
            };
        }
                
        
        
        
        
        // Set left-right arrow navigation
        elemNavPrevEntry.onclick = function(){
            const prev_sow_boar_hid = showOptions.prev_sow_boar_hid;
            
            if (prev_sow_boar_hid){
                navigation.pageSowBoarList.onClickSowBoarEntry(prev_sow_boar_hid);
            } else{
                navigation.pageSowBoarList.onClickSowBoarEntry(null, null, null,
                    showOptions.sow_boar_type);
            }
        }
        
        elemNavNextEntry.onclick = function(){
            const next_sow_boar_hid = showOptions.next_sow_boar_hid;
            
            if (next_sow_boar_hid){
                navigation.pageSowBoarList.onClickSowBoarEntry(next_sow_boar_hid);
            }
            else{
                navigation.pageSowBoarList.onClickSowBoarEntry(null, null, null,
                    showOptions.sow_boar_type)
            }
        }
        
        
        let show_tab_id = componentTabsWithMore.curActiveTabId;
        if (showOptions.tab_id){
            show_tab_id = showOptions.tab_id;
        }
        
        
        
        // Request SowBoar data_details 
        if ('data_details' in dataSowBoar){
            if (show_tab_id){
                componentTabsWithMore.switchTab(show_tab_id);
            }
            thisObj.beforeShowTab(show_tab_id);
            
            /*
            const rt_updates_enabled = navigation.dataCompanyApp.rt_updates_enabled;
            
            if (rt_updates_enabled == 0){
                
            }*/
            
        }
        else{
            const callback_success = function(){
                if (show_tab_id){
                    componentTabsWithMore.switchTab(show_tab_id);
                }
                thisObj.beforeShowTab(show_tab_id);
            }
            navigation.pigFarm.managerSowBoar.requestSowBoarDetails(
                dataSowBoar, callback_success);
        }
        
        
    }
    

    
    this.beforeShowTab = function(tab_id){
        if (dataSowBoar == null){return;}
        
        switch(tab_id){
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

            
            default:{
                thisObj.tableMedVac.beforeShow(dataSowBoar);
                break;
            }
        }
        
    }
    

    this.resetToFirstTab = function(){
        componentTabsWithMore.resetToFirstTab();
    }
    
   
    
    this.onSuccessUpdateStatus = function(){
        // This is triggered when a sow_boar is deleted or disposed.
        if (showOptions.sow_boar_list){
            // Remove sow_boar
            const index = showOptions.data_index -1; // This is base 1 counting number
            showOptions.sow_boar_list.splice(index, 1);
            
            // Go back to sow_boar_list
            navigation.managerNavLinks.onClickNavSowBoar(null, showOptions.sow_boar_type);
        }
    }
    
    
    /** 
    This should open to MedVac edit page.
    
    */
    this.onClickTableRowMedVac = function(medvac_hid){
        
    }

}
