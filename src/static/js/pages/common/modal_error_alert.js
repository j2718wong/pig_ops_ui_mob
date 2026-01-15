// January 15, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';



export function PageModalAlert(){
    const thisObj               = this;
    
    
    this.render = function(){
		
		elemIdModalId        	= `modal-alert`;
		elemIdAlertErrorIcon    = `modal-alert-error-icon`;
		
		
		
        return `
        <!-- Connection Error Modal -->
    <div class="modal fade" id="${elemIdModalId}" tabindex="-1" aria-labelledby="${elemIdModalId}Label" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content connection-modal">
                <div class="modal-header border-0 pb-0">
                    <button type="button" class="btn-close modal-close-top" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
				
                <div class="modal-body text-center p-4 pt-0">
                    <div class="error-icon error pulse-animation" id="${elemIdAlertErrorIcon}">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    
                    <h4 class="modal-title mb-2" id="errorTitle">Connection Error</h4>
                    
                    <div class="connection-status-text" id="connectionStatusText">
                        Disconnected from server
                    </div>
                    
                    <p class="mb-4" id="errorMessage">There was a problem connecting to the server. Please check your internet connection and try again.</p>
                    
                    <div class="error-details mb-4" id="technicalDetailsContainer">
                        <div class="error-details-title" id="technicalDetailsTitle">
                            <span>Show Technical Details</span>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <pre id="technicalDetails">Error code: 0
                            Status: Offline
                            Time: <span id="errorTime"></span>
                        </pre>
                    </div>
                    
                    <div class="d-flex justify-content-center">
                        <button type="button" class="btn btn-retry text-white" id="retryButton" onclick="retryConnection()">
                            <i class="fas fa-redo me-2"></i>Retry Connection
                        </button>
                    </div>
                    
                    <div class="error-timestamp mt-3">
                        Last checked: <span id="lastChecked">Just now</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

        
        `;
    }
    
}