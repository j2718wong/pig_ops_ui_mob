// May 13, 2026
// Jack Wong
// j2718wong@gmail.com

import { PageReceiptDataEntry } from './admin/receipt/page_receipt_data_entry.js';

// Initialize the application when DOM is ready
function initializeApp() {
    console.log('Starting Receipt Data entry');
    
    const receiptDataEntry = new PageReceiptDataEntry();
    receiptDataEntry.init();
    receiptDataEntry.onPageLoad();
    
    // Make available globally if needed
    globalThis.receiptDataEntry = receiptDataEntry;
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
