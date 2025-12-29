// December 30, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

export const FORMAT_LONG_MONTH      = 'long';
export const FORMAT_SHORT_MONTH     = 'short';

export function FormatDate(dt, format_month){
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    if (format_month){
        options.month = format_month;
    }
    
    
    return new Intl.DateTimeFormat('en-US', options).format(dt);
}