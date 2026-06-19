// feed_estimate_basic.js

// June 19, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';



export const MAX_NUM_MONTHS_FEED_PROJECTION = 4;


    
/**
 * Will return an array of Date strings every 1st of the month in the future.
 * Example:
 * 
 * num_months = 2
 * 
 * today = '2026-06-15'
 * returns = ['2026-07-01', '2026-08-01'] 
 * 
 * 
 * num_months = 2
 * 
 * today = '2026-06-01'
 * returns = ['2026-07-01', '2026-08-01'] 
 * 
 * */
export function getEveryFirstDayOfMonth (num_months){
    const result = [];
    const today = new Date();
    
    // Start from next month's first day
    let current = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    
    for (let i = 0; i < num_months; i++) {
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, '0');
        const day = String(current.getDate()).padStart(2, '0');
        result.push(`${year}-${month}-${day}`);
        current.setMonth(current.getMonth() + 1);
    }
    
    return result;
}

    
