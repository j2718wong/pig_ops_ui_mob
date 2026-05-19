// pig_farm_sow_due_checklist.js

// May 19, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';

import {APPLICATION,
        PAGE_ID}            from '../../constants.js';



export function PigFarmSowDueChecklist(input_settings){
    
    const TAG                   = 'PigFarmSowDueChecklist';
    
    const thisObj               = this;
    const navigation            = input_settings.navigation;
    const parentObj             = input_settings.parentObj;
    
    
    const elemDivContainer      = input_settings.elemDivContainer
    
    /*
    Typical settings = {
        navigation:             navigation,
        parentObj:              parentObj,
        elemIdDivContainer:     elemIdContUserDisabled
    };
    */
    const settings              = input_settings;
    
    
    let elemPrepareChecklistShow= null;
    let elemPrepareChecklist    = null;
    let elemServerErrorMsg      = null;
    let checklistData           = null;
    let currentChecklistId      = null;
    
    
    
    
    // Store checkbox states
    let checkboxStates = {};
    
    this.init = function(){

    }
    
    
    
    this.getHtml = function(){
        
        const html = `
        <div class="sow-due-checklist" id="prepare-checklist-show" style="margin-top:8px;">
            <a href="javascript:void(0)" class="text-link" id="prepare-checklist">
                📋 Prepare Checklist
            </a>
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
        elemPrepareChecklistShow    = elemDivContainer.querySelector('#prepare-checklist-show');
        elemPrepareChecklist        = elemDivContainer.querySelector('#prepare-checklist');
        elemServerErrorMsg          = parentObj.elemServerErrorMsg;
    }
    
    
    this._processAfterHtmlRender = function(){
        
    }
    
    
    this._bindEventListeners = function(){
        if (elemPrepareChecklist) {
            elemPrepareChecklist.addEventListener('click', function() {
                thisObj.showChecklistModal();
            });
        }
    }
    
    
    this.showChecklistBtn = function(){
        elemPrepareChecklistShow.style.display = 'block';
    }
    
    
    this.hideChecklistBtn = function(){
        elemPrepareChecklistShow.style.display = 'none';
    }
    
    
    this.showChecklistModal = function() {
        // Check if modal already exists
        if (document.getElementById('sow-checklist-modal')) {
            document.getElementById('sow-checklist-modal').style.display = 'flex';
            return;
        }
        
        const modal = document.createElement('div');
        modal.id = 'sow-checklist-modal';
        modal.className = 'modal-overlay';
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-container" style="max-width: 500px; width: 90%;">
                <div class="modal-header" style="background: #2e7d64;">
                    <h3 style="margin: 0;">📋 Farrowing Checklist</h3>
                    <button class="modal-close-btn" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
                </div>
                <div class="modal-body" style="padding: 16px 20px; max-height: 60vh; overflow-y: auto;">
                    <div id="checklist-items-container">
                        <div style="text-align: center; padding: 20px;">Loading checklist...</div>
                    </div>
                </div>
                <div class="modal-footer" style="display: flex; justify-content: space-between; padding: 12px 20px; border-top: 1px solid #ddd;">
                    <button id="checklist-edit" class="btn-modal btn-secondary" style="background: #6c757d; color: white;">
                        Edit List
                    </button>
                    
                    <button id="checklist-close" class="btn-modal btn-primary" style="background: #2e7d64; color: white;">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close button handlers
        const closeBtn = modal.querySelector('.modal-close-btn');
        const closeFooterBtn = modal.querySelector('#checklist-close');
        
        closeBtn.onclick = () => modal.remove();
        closeFooterBtn.onclick = () => modal.remove();
        
        // Click outside to close
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
        
        
        // Load checklist data
        thisObj.loadChecklistData();
    }
    
    
    this.loadChecklistData = function() {
        const data_checklist = navigation.pigFarm.dataSowDueChecklist;
        this.renderChecklistItems(data_checklist || []);
    }
    
    
    this.renderChecklistItems = function(data) {
        const container = document.getElementById('checklist-items-container');
        if (!container) return;
        
        if (!data || data.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #666;">
                    <i class="fas fa-check-circle" style="font-size: 48px; color: #28a745;"></i>
                    <p style="margin-top: 12px;">All tasks completed! Great job!</p>
                </div>
            `;
            return;
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 2px;">';
        
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const itemId = item.hid || item.id;
            const isChecked = item.dt_check !== null && item.dt_check !== undefined;
            const rowBg = i % 2 === 0 ? '#f8f9fa' : '#ffffff';
            
            checkboxStates[itemId] = isChecked;
            
            html += `
                <div class="checklist-row" 
                     data-id="${itemId}"
                     style="
                         display: flex;
                         align-items: center;
                         gap: 12px;
                         padding: 10px 12px;
                         background: ${isChecked ? '#f0fdf4' : rowBg};
                         border-radius: 6px;
                         cursor: pointer;
                     ">
                    <input 
                        type="checkbox" 
                        id="check_${itemId}" 
                        data-id="${itemId}"
                        style="
                            width: 22px;
                            height: 22px;
                            cursor: pointer;
                            accent-color: #2e7d64;
                            margin: 0;
                            flex-shrink: 0;
                            pointer-events: none;
                        "
                        ${isChecked ? 'checked' : ''}
                    >
                    <label 
                        for="check_${itemId}" 
                        style="
                            flex: 1;
                            font-size: 1.2rem;
                            cursor: pointer;
                            color: ${isChecked ? '#28a745' : '#333'};
                            text-decoration: ${isChecked ? 'line-through' : 'none'};
                            margin: 0;
                        "
                    >
                        ${escapeHtml(item.name)}
                    </label>
                </div>
            `;
        }
        
        html += '</div>';
        container.innerHTML = html;
        
        // Make the whole row clickable
        const rows = container.querySelectorAll('.checklist-row');
        rows.forEach(row => {
            row.addEventListener('click', function(e) {
                const checkbox = this.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    const isNowChecked = !checkbox.checked;
                    checkbox.checked = isNowChecked;
                    
                    const itemId = this.getAttribute('data-id');
                    const label = this.querySelector('label');
                    
                    // Update UI
                    if (isNowChecked) {
                        this.style.background = '#f0fdf4';
                        if (label) {
                            label.style.color = '#28a745';
                            label.style.textDecoration = 'line-through';
                        }
                    } else {
                        // Reset to alternating color
                        const rowsList = Array.from(container.querySelectorAll('.checklist-row'));
                        const idx = rowsList.indexOf(this);
                        this.style.background = idx % 2 === 0 ? '#f8f9fa' : '#ffffff';
                        if (label) {
                            label.style.color = '#333';
                            label.style.textDecoration = 'none';
                        }
                    }
                    
                    // Send update to server
                    thisObj.updateChecklistItem(itemId, isNowChecked);
                }
            });
        });
    }
        
     
    this.updateChecklistItem = function(itemId, isChecked) {
        const data = {
            item_hid: itemId,
            is_checked: isChecked ? 1 : 0
        };
        
        const bearer_token = localStorage.getItem('access_token');
        const base_url = window.location.origin;
        const url = `${base_url}/pig_farm/sow_due_checklist/update`;
        
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
            data: JSON.stringify(data),
            success: function(response) {
                if (response.result.num !== 0) {
                    console.error('Failed to update checklist item');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error updating checklist item:', textStatus);
            }
        });
    }
    
    
    this.populateChecklist = function(data) {
        checklistData = data;
        if (document.getElementById('sow-checklist-modal')) {
            this.renderChecklistItems(data);
        }
    }
}


// Helper function for escaping HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
