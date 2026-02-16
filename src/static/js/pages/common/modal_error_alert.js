// January 15, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';



export function PageModalAlert(){
    const thisObj               = this;
    
    // Error configurations
    const errorConfigs = {
        connection_lost: {
            title: "Connection Lost",
            message: "Your connection to the server has been lost. Please check your internet connection.",
            icon: "fa-wifi-slash",
            iconClass: "error",
            details: "Error code: 1001\nStatus: Connection lost\nType: Network disruption\nSuggested action: Check router or mobile data"
        },
        timeout: {
            title: "Request Timeout",
            message: "The server is taking too long to respond. This might be due to high traffic or server issues.",
            icon: "fa-clock",
            iconClass: "warning",
            details: "Error code: 408\nStatus: Request timeout\nTimeout: 30 seconds\nSuggested action: Try again in a moment"
        },
        server_error: {
            title: "Server Error",
            message: "We're experiencing technical difficulties on our end. Our team has been notified.",
            icon: "fa-server",
            iconClass: "info",
            details: "Error code: 500\nStatus: Internal server error\nServer: api.example.com\nSuggested action: Wait for maintenance"
        },
        network_error: {
            title: "Network Error",
            message: "Unable to establish a connection to the server. This might be due to firewall or DNS issues.",
            icon: "fa-globe",
            iconClass: "error",
            details: "Error code: 0\nStatus: Network error\nConnection: Failed\nSuggested action: Check firewall settings"
        }
    };
        
    
    
    this.render = function(){
        
        elemIdModalId           = `modal-alert`;
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
