// January 17, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';


export function ToastAlert(){
    const thisObj               = this;
    
    
    const elemDivContainer      = document.getElementById('container-toast');
    
    // Toast counter for unique IDs
    let toastCounter = 0;
        
    // Function to create and show a toast
    this.showToast = function(title, message, type = 'info', autoHide = true, delay = 5000) {
        toastCounter++;
        
        // Create toast element
        const toastId = 'toast-' + toastCounter;
        const toast = document.createElement('div');
        toast.className = `toast custom-toast toast-${type}`;
        toast.id = toastId;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        // Set toast content based on type
        let iconClass, headerClass;
        switch(type) {
            case 'success':
                iconClass = 'bi-check-circle-fill text-success';
                headerClass = 'text-success';
                break;
            case 'error':
                iconClass = 'bi-x-circle-fill text-danger';
                headerClass = 'text-danger';
                break;
            case 'warning':
                iconClass = 'bi-exclamation-triangle-fill text-warning';
                headerClass = 'text-warning';
                break;
            default: // info
                iconClass = 'bi-info-circle-fill text-info';
                headerClass = 'text-info';
        }
        
        toast.innerHTML = `
            <div class="toast-header">
                <i class="bi ${iconClass} me-2"></i>
                <strong class="me-auto ${headerClass}">${title}</strong>
                <small class="text-muted">just now</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;
        
        // Add toast to container
        elemDivContainer.appendChild(toast);
        
        // Initialize and show the toast
        const bsToast = new bootstrap.Toast(toast, {
            autohide: autoHide,
            delay: delay
        });
        
        bsToast.show();
        
        // Remove toast from DOM after it's hidden
        toast.addEventListener('hidden.bs.toast', function () {
            toast.remove();
        });
        
        return bsToast;
    }


}