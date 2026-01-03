// December 30, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

export const FORMAT_LONG_MONTH      = 'long';
export const FORMAT_SHORT_MONTH     = 'short';
export const FORMAT_COMPACT         = 'compact';


const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        

export function formatDate(dt, format){
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    if (format){
        options.month = format;
    }
    
    if (format == FORMAT_COMPACT) {
        const day = String(dt.getDate()).padStart(2, '0');
        const month = monthNames[dt.getMonth()];
        const year = dt.getFullYear();

        return `${day}${month}${year}`;
    }

    
    return new Intl.DateTimeFormat('en-US', options).format(dt);
}


export function sortList(list, sort_key, sort_direction = 'asc') {
  if (!Array.isArray(list) || list.length === 0) return list;
  
  // Parse the dotted key path into an array of keys
  const keyPath = sort_key.split('.');
  
  // Create a getter function that navigates through nested properties
  const getNestedValue = (obj, pathArray) => {
    return pathArray.reduce((current, key) => {
      if (current && typeof current === 'object' && key in current) {
        return current[key];
      }
      return undefined;
    }, obj);
  };
  
  // Sort the array
  return [...list].sort((a, b) => {
    const valueA = getNestedValue(a, keyPath);
    const valueB = getNestedValue(b, keyPath);
    
    // Handle undefined/null values
    if (valueA === undefined || valueA === null) return 1;
    if (valueB === undefined || valueB === null) return -1;
    
    let comparison = 0;
    
    // Compare based on type
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      comparison = valueA - valueB;
    } else if (typeof valueA === 'string' && typeof valueB === 'string') {
      comparison = valueA.localeCompare(valueB);
    } else if (valueA instanceof Date && valueB instanceof Date) {
      comparison = valueA.getTime() - valueB.getTime();
    } else {
      // Fallback to string comparison
      comparison = String(valueA).localeCompare(String(valueB));
    }
    
    // Apply sort direction
    return sort_direction.toLowerCase() === 'desc' ? -comparison : comparison;
  });
}


// Alternative, more concise version using optional chaining (ES2020+)
export function sortListModern(list, sort_key, sort_direction = 'asc') {
  if (!Array.isArray(list) || list.length === 0) return list;
  
  const keyPath = sort_key.split('.');
  const isDesc = sort_direction.toLowerCase() === 'desc';
  
  return [...list].sort((a, b) => {
    // Use optional chaining to safely access nested properties
    const getValue = (obj) => keyPath.reduce((o, k) => o?.[k], obj);
    
    const valueA = getValue(a);
    const valueB = getValue(b);
    
    // Handle undefined/null values
    if (valueA == null) return 1;
    if (valueB == null) return -1;
    
    let comparison = 0;
    
    // Smart type-based comparison
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      comparison = valueA - valueB;
    } else if (valueA instanceof Date && valueB instanceof Date) {
      comparison = valueA.getTime() - valueB.getTime();
    } else {
      // String comparison for everything else
      comparison = String(valueA).localeCompare(String(valueB));
    }
    
    return isDesc ? -comparison : comparison;
  });
}



/**
 * Inserts an object into a sorted list at the correct position based on a sort key
 * Mutates the original array in place
 * 
 * @param {Array} list - The sorted array of objects (will be mutated)
 * @param {Object} object_to_insert - The object to insert
 * @param {string} sort_key - Dotted key string (e.g., "pig_prod_pig_ops.date_target")
 * @param {string} sort_direction - 'asc' for ascending, 'desc' for descending
 * @returns {Array} - The same list (mutated) with the object inserted
 */
export function insertIntoSortedList(list, object_to_insert, sort_key, sort_direction = 'asc') {
    // Handle empty list case
    if (list.length === 0) {
        list.push(object_to_insert);
        return list;
    }
  
    // Helper function to get nested value using dotted key string
    function getNestedValue(obj, keyPath) {
        if (!obj || !keyPath) return undefined;
    
        return keyPath.split('.').reduce((current, key) => {
            return current ? current[key] : undefined;
        }, obj);
    }
  
    
    // Get the value to sort by from the object to insert
    const insertValue = getNestedValue(object_to_insert, sort_key);
  
    // If the value is undefined, we'll insert at the end
    if (insertValue === undefined) {
        list.push(object_to_insert);
        return list;
    }
  
  
    // Find the correct insertion index
    let insertionIndex = -1;
  
    for (let i = 0; i < list.length; i++) {
        const currentValue = getNestedValue(list[i], sort_key);
    
        // Handle undefined values in the list
        if (currentValue === undefined) {
            // If current is undefined and we're inserting a defined value,
            // insertion position depends on sort direction
            if (sort_direction === 'asc') {
                // For ascending: undefined values typically come last
                continue; // Keep looking
            } else {
                // For descending: undefined values typically come first
                insertionIndex = i;
                break;
            }
        }
    
    
        // Compare values based on sort direction
        let shouldInsertBefore;
        if (sort_direction === 'asc') {
            shouldInsertBefore = insertValue < currentValue;
        } else {
            shouldInsertBefore = insertValue > currentValue;
        }
    
        if (shouldInsertBefore) {
            insertionIndex = i;
            break;
        }
    }
  
    // If we didn't find a position, insert at the end
    if (insertionIndex === -1) {
        insertionIndex = list.length;
    }
  
    // Insert the object at the found position (mutates the array)
    list.splice(insertionIndex, 0, object_to_insert);
    return list;
}
