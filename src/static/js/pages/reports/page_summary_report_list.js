// March 7, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {PageTableBasic}         from '../common/page_table_basic.js';



import {APPLICATION,
        PAGE_ID,
        PIG_OPERATION_TYPE,
        PIG_PROD_TYPE,
        PROD_STATUS}            from '../../constants.js';

import {formatDate,
        FORMAT_SHORT_MONTH,
        FORMAT_LONG_MONTH,
        FORMAT_COMPACT}         from '../../utils.js';

import {ComponentNavLeftRight}  from '../common/ui/comp_nav_left_right.js';


const DEFAULT_REPORT_NAME_FARM_SUMMARY = 'Pig Farm Summary';


export function PageSummaryReportList(input_settings){
    PageTableBasic.call(this);
    
    const TAG                   = 'PageSummaryReportList';
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    this.setNavigation(navigation);
    
    
    /*
    Typical input_settings
    {
        navigation:             this,
        uniqueKey:              'prod-not-pregnant' 
        pageTitle:              'Not Pregnant'
    }   
    */  
    let settings                = input_settings;
    
    
    
    
    // This is needed as this will be first element to be rendered
    let elemDivContainer        = document.getElementById(settings.elemIdDivContainer);
    
    let componentNavLeftRight   = null;
    
    let elemIdPageInfo          = null;
    let elemIdTableBody         = null;
    

    let elemPageInfo            = null;
    let elemTableBody           = null;
    
    
    let dataSummaryReportList   = null;

    
    let dtCurrentDate           = null;



    
    this.init = function(){

        
        thisObj.setSettingsTable({
            uniqueKey:      settings.uniqueKey,
            noHeader:       true,
            itemsPerPage:   10
        });
        
        
        this.render();
        this.afterHtmlRender();
        
        this.afterHtmlRenderThis();
        
    }
    
    
    
    this.render = function(){
        let label_page_title          = 'Summary Report';
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_page_title        = helper.getSimpleTranslation('navigation.nav_links.Operations4') || label_page_title;
      
            
        
        componentNavLeftRight   = new ComponentNavLeftRight({
           uniqueKey:           settings.uniqueKey,
           elemDivContainer:    elemDivContainer,
           pageTitle:           label_page_title
        });
        
        
        elemIdPageInfo          = `${settings.uniqueKey}-page-info`;
        
        
        const html_nav          = componentNavLeftRight.getHtml();   
        const html_table        = thisObj.getHtml();
           

           
        const html = `

<div class="mobile-container">
    ${html_nav}
    
    <!-- Mobile Info Box -->
    <!--
    <div class="mobile-info-box">
        <div class="info-text" id="${elemIdPageInfo}">
        </div>
    </div>
    -->
    
    ${html_table}

</div>
        `;
        
        elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRenderThis = function(){
        componentNavLeftRight.afterHtmlRender();
        
        
        this._findElementsThis();
        this._processAfterHtmlRenderThis();
        this._bindEventListenersThis();
    }
    
    
    this._findElementsThis = function(){
        elemPageInfo            = elemDivContainer.querySelector('#'+elemIdPageInfo);
        
        
        elemTableBody           = elemDivContainer.querySelector('#'+elemIdTableBody);
    }
    
    
    this._processAfterHtmlRenderThis = function(){
        
        componentNavLeftRight.callbackNavLeft = function(){
            navigation.managerNavLinks.onClickNavPigDead();
        };
        
          
        componentNavLeftRight.callbackNavRight = function(){
            navigation.managerNavLinks.onClickNavFeedBalance();
        };
        
        
        componentNavLeftRight.bindEventListeners();
        
        
        thisObj.setOnClickAddEntry(thisObj.onClickAddEntry);
    }
    
    
    this._bindEventListenersThis = function(){
        
       
    }
    
    
    
    
    this.renderPage = function(page_data){
        thisObj.show();
    }
    
    
    
    this.show = function(){
        thisObj.debugNavHistory(TAG);
        
        // Update navigation.curPageNavigated
        navigation.curPageNavigated.pageData = null;
        navigation.curPageNavigated.renderPageFunc = thisObj.renderPage;
        
        
        // Request data if not yet requested
        dataSummaryReportList = navigation.pigFarm.dataSummaryReportList;
        if (dataSummaryReportList == null){
            
            const callback_success = function(data){
                dataSummaryReportList = navigation.pigFarm.dataSummaryReportList;
                
                thisObj.setDataEntryList(dataSummaryReportList);
                thisObj.renderTable(dataSummaryReportList);
            };
            
            
            let elem_show_error = thisObj.elemServerErrorMsg;
       
            // Request SummaryReportList
            navigation.pigFarm.requestDataPigFarmSummaryReportList(
                callback_success, elem_show_error);

        }
        else{
            thisObj.setDataEntryList(dataSummaryReportList);
            thisObj.renderTable(dataSummaryReportList);
        }
        
    }
    

    this._writeInlineStyle = function(){
        const html = `
        `;
        return html;

    }
    
    
    this.getElemTableBody = function(){
        return elemTableBody;
    }

    
    this.getHtmlTableHeader = function(){
        elemIdTableBody         = `${settings.uniqueKey}-table-tbody`;
        
        const html_style = this._writeInlineStyle();
        
        
        let label_date          = 'Date';
        let label_report        = 'Report';
        let label_notes         = 'Notes';
        
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_date              = helper.getSimpleTranslation('common_app.labels.date') || label_date;
        label_report            = helper.getSimpleTranslation('common_app.labels.report') || label_report;
        label_notes             = helper.getSimpleTranslation('common_app.labels.notes') || label_notes;
        

        const html = `
        ${html_style}
        
        <table class="data-table table-prod-hist" id="">
            <colgroup>
                <col style="width: 30%;">
                <col style="width: 40%;">
                <col style="width: 30%;">
            </colgroup>

            <thead>
                <tr>
                    <th>${label_date}</th>
                    <th>${label_report}</th>
                    <th>${label_notes}</th>
                </tr>
            </thead>
            
            
            <tbody id="${elemIdTableBody}">
            </tbody>
        </table>
        
        `;
        
        return html;
        
    }
       

    this.getHtmlTableRowEmpty = function(){
        let label_no_entries = thisObj.writeLabelNoEntries();
        
        if (label_no_entries){}
        else{label_no_entries = 'No Entries';}
        
        
        const html = `
            <tr>
                <td colspan="3"><div>${label_no_entries}</div></td>
            </tr>
        `;
        return html;
    }
    

    this.getHtmlTableRow = function(cur_entry){
        
        
        const dt_report   = new Date(cur_entry.report.date);
        const s_dt_report = formatDate(dt_report, FORMAT_COMPACT);
        
        let notes = '';
        if (cur_entry.report.notes){
            notes = cur_entry.report.notes;
        }
        
        
        
        let labelreport_name          = DEFAULT_REPORT_NAME_FARM_SUMMARY;
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        labelreport_name        = helper.getSimpleTranslation('page_report_list.labels.rep_type_farm_summary') || labelreport_name;
      
        let html_report_name = `
            <i class="fa-solid fa-file-pdf" style="color: red;"></i>
            ${labelreport_name}
        `;
        
        const html = `
            <tr>
                <td>${s_dt_report}</td>
                <td>${html_report_name}</td>
                <td>${notes}</td>
            </tr>
        `;
        
        return html;
    }
    
    
    this.getElemTableRow = function(cur_entry){
        const elem_row = document.createElement('tr');
        
        const html = thisObj.getHtmlTableRow(cur_entry);
        elem_row.innerHTML = html;
        

        
        // Attach onclick listeners to td
        
        const elem_tds = elem_row.querySelectorAll('td'); 
        
        let index = 0
        for (const cur_td of elem_tds){
        

            if (index == 0 || index == 1) {
                cur_td.onclick = function(){
                    thisObj.onClickRowEntry(cur_entry.report.hid);
                }
            }
            
        
            index += 1;
        }
        
        return elem_row;
    }
    
    

    
    this.searchEntries = function(key){
    }
    
    
    this.getEntry = function(entry_hid){

        for (const cur_entry of dataSummaryReportList){
            if (cur_entry.report.hid == entry_hid){
                return cur_entry;
            }
        }
        
        return null;
    }

    
    this.onClickAddEntry = function(){
        // Show Container
        const next_page = navigation.getPageContainer(PAGE_ID.SUMMARY_REPORT_ADD_EDIT);
        
        // Push currentPage to NavHistory; 
        // Will also compare current page and  next_page NAV_MENU_GROUP.
        navigation.pushCurrentPageToNavHistory(next_page);
        
        navigation.showThisPage(next_page);
        
        
        // Show Page
        
        const options ={
            is_add:                 true
        }
        navigation.pageSummaryReportAdd.show(options);
    }
    
   
    
    
    this.onClickRowEntry = function(entry_hid){
        const row_entry = thisObj.getEntry(entry_hid);   
        
        const go_back_page_id = PAGE_ID.ACC_PIG_OPS_LIST;
        const go_back_page = navigation.getPageContainer(go_back_page_id);
    
        const options ={
            operation_type:         curAccPigOpsType,
            is_add:                 false,   // false is edit
            callback_after_edit:    thisObj.onSuccessEditEntry,
            go_back_page:           go_back_page 
        }
        navigation.pageAccPigOpsAddEdit.beforeShow(options, data_acc_pig_ops);
        
        
        const goto_page_id   = PAGE_ID.ACC_PIG_OPS_ADD_EDIT;
        const page_container = navigation.getPageContainer(goto_page_id);
        navigation.showThisPage(page_container);
    }
  
    
    
}
