// page_summary_report_list.js

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
    let elemIdShowSample        = null;

    let elemPageInfo            = null;
    let elemTableBody           = null;
    let elemShowSample          = null;
    
    let dataSummaryReportList   = null;

    
    let dtCurrentDate           = null;

    let showOptions             = null;
    
    let lastDataVersionNum      = null;
    
    
    
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
        let label_page_title    = 'Summary Report';
        
        let label_see_sample    = 'See Sample Report';
        
        let page_info   = `
            This is a list Farm Reports Generated. A Farm report is a summary
            of what is happening in your farm. You can generate reports anytime.  
        `;
        
        
        const helper = navigation.managerTranslations.translationHelper;
        
        
        label_page_title        = helper.getSimpleTranslation('navigation.nav_links.Financials3') || label_page_title;
      
            
        
        componentNavLeftRight   = new ComponentNavLeftRight({
           uniqueKey:           settings.uniqueKey,
           elemDivContainer:    elemDivContainer,
           pageTitle:           label_page_title
        });
        
        
        elemIdPageInfo          = `${settings.uniqueKey}-page-info`;
        
        elemIdShowSample        = `${settings.uniqueKey}-show-sample`;

        
        const html_nav          = componentNavLeftRight.getHtml();   
        const html_table        = thisObj.getHtml();
           

           
        const html = `

<div class="mobile-container">
    ${html_nav}
    
    <div class="mobile-info-box" id="${elemIdPageInfo}">
        ${page_info}
    </div>
    
    ${html_table}
    
    <div style="margin: 8px 0;">
        <a href="javascript:void(0)" class="text-link" id="${elemIdShowSample}">
            ${label_see_sample}
        </a>
    </div>
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
        elemShowSample          = elemDivContainer.querySelector('#'+elemIdShowSample);
        
    }
    
    
    this._processAfterHtmlRenderThis = function(){
        
        componentNavLeftRight.callbackNavLeft = function(){
            navigation.managerNavLinks.onClickNavFeedsExpenses(null, true);
        };
        
          
        componentNavLeftRight.callbackNavRight = function(){
            navigation.managerNavLinks.onClickNavProdSales(null, true);
        };
        
        
        componentNavLeftRight.bindEventListeners();
        
        
        thisObj.setOnClickAddEntry(thisObj.onClickAddEntry);
    }
    
    
    this._bindEventListenersThis = function(){
        elemShowSample.addEventListener('click', function() {
            thisObj.onClickShowSample({
                title:      'Sample Farm Summary Report',
                img_src:    '/static_m/images/mar/mar_report.png',
                img_alt:    'Sample Farm Summary Report'
            });
        });
    }
    
    
    
    
    this.renderPage = function(page_data){
        thisObj.show();
    }
    
    
    // This should return a list to be displayed on the page.
    // These are the possible common data sources: account, pig_farm, or application
    // No more hard coding where is the list, but rather use this generic method.
    this.getListFromDataSource = function(){
        return navigation.pigFarm.dataSummaryReportList;
    }
    
    
    // Try to find from common data sources: account, pig_farm, or application
    this.getCurrentDataVersionNum = function(){
        return null;
    }
    
    
    this.refreshList = function(options){
        // Check if to refresh list
        // Refresh list on these triggers:
        // 1.) thisObj.getListFromDataSource is null; 
        //      data not yet requested from server;
        // 
        // 2.) options.refreshList is explicitly set; this happens after  
        //      adding an entry or updating entry or deleting an entry.
        // 
        // 3.) the thisObj.getCurrentDataVersionNum() is different from
        //      lastDataVersionNum; this happens when the business object 
        //      in the database, is updated by somebody else, not the user;
        //      So the data is refreshed on list view, not push from server
        //      to users; (unless this change in the future).
        //
        // In every refresh list, the lastDataVersionNum should be updated  
        
        
        dataSummaryReportList = thisObj.getListFromDataSource();
        
        
        let refresh_needed = false;
        if (dataSummaryReportList == null){
            refresh_needed = true;
        }
        else{
            if (options){
                if (options.refreshList){refresh_needed = true;}
            }
            
            if (refresh_needed == false){
                const current_ver_num = thisObj.getCurrentDataVersionNum();
                
                if (current_ver_num){
                    if (current_ver_num != lastDataVersionNum){
                        refresh_needed = true;
                    }
                }
            } 
        }   
        
        
        if (refresh_needed){
            
            const callback_success = function(data){
                dataSummaryReportList = navigation.pigFarm.dataSummaryReportList;
                
                thisObj.setDataEntryList(dataSummaryReportList);
                thisObj.renderTable(dataSummaryReportList);
                
                thisObj.showInfoBox(dataSummaryReportList, elemPageInfo);
                
                lastDataVersionNum = thisObj.getCurrentDataVersionNum();
            };
            
            
            let elem_show_error = thisObj.elemServerErrorMsg;
       
            // Request SummaryReportList
            navigation.pigFarm.requestDataPigFarmSummaryReportList(
                callback_success, elem_show_error);

        }
        else{
            thisObj.setDataEntryList(dataSummaryReportList);
            thisObj.renderTable(dataSummaryReportList);
            
            thisObj.showInfoBox(dataSummaryReportList, elemPageInfo);
        }
        
    }
    
    
    this.show = function(options){
        thisObj.debugNavHistory(TAG);
        
        // Update navigation.curPageNavigated
        navigation.curPageNavigated.pageData = null;
        navigation.curPageNavigated.renderPageFunc = thisObj.renderPage;
        
        
        thisObj.refreshList(options)
        
    }
    
    
    this.showSeeSampleLink = function(data_list){
        let show_link = 0;
        
        if (data_list){
            if (data_list.length == 0){
                show_link = 1;
            }
        }
        else{
            show_link = 1;
        }
        
        if (show_link == 0){
            elemShowSample.style.display = 'block';
            return;
        }
        
        elemShowSample.style.display = 'none';
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
        
        // Download report
        
        const report_hid = row_entry.report.hid;
        
        const base_url = window.location.origin;
        let url = `${base_url}/report/download?rhid=${report_hid}`;
        
        
        const bearer_token = localStorage.getItem('access_token');
        const elem_show_error = thisObj.elemServerErrorMsg;
    
        // Use fetch instead of $.ajax for better binary handling
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${bearer_token}`
            }
        })
        .then(response => {
            // Check content type to determine if it's PDF or JSON error
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/pdf')) {
                // It's a PDF - download it
                return response.blob().then(blob => {
                    return { type: 'pdf', blob: blob, filename: thisObj.getFilenameFromHeaders(response) };
                });
            } else {
                // It's JSON (error response)
                return response.json().then(data => {
                    return { type: 'error', data: data };
                });
            }
        })
        .then(result => {
            if (result.type === 'pdf') {
                // Download PDF
                const downloadUrl = window.URL.createObjectURL(result.blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = result.filename || 'report.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(downloadUrl);
                
                // Optional: show success message
                if (navigation.toastAlert) {
                    const title   = navigation.managerApplicationData.dataApplication.product_name;
                    const message = 'Report downloaded successfully';
                    navigation.toastAlert.showToast(title, message);
                }
            } else {
                // Show error from JSON response
                navigation.serverError.receivedErrorMessage(result.data, elem_show_error);
            }
        })
        .catch(error => {
            console.error('Download error:', error);
            if (elem_show_error) {
                elem_show_error.textContent = 'Failed to download report';
                elem_show_error.style.display = 'block';
            }
            navigation.serverError.serverErrorThrown(error);
        });
    }
    
    
    
    // Helper to extract filename from Content-Disposition header
    this.getFilenameFromHeaders = function(response) {
        const contentDisposition = response.headers.get('Content-Disposition');
        if (contentDisposition) {
            const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (match && match[1]) {
                return match[1].replace(/['"]/g, '');
            }
        }
        return 'report.pdf';
    };
    
    
}
