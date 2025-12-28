// December 28, 2025
// Jack Wong
// j2718wong@gmail.com

'use strict';

const TRANSLATION_PAGE_ACC_PIG_OPS = {
	'en':{
		'gestating_ops': {
			'title': 'Gestating Ops',
			
			'info_text':`This list defines the standard care activities for a 
gestating sow in each production cycle. When a <b>Prod Gestating</b> entry
is created, these tasks are automatically scheduled. Reminders are sent 
when each task's due date, calculated from the start of gestation, is reached.`
			
		},
		
		'lactating_piglets_ops': {
			'title': 'Lactating Piglets Ops',
			
			'info_text':`This list defines the standard care activities for a 
lactating piglets in each production cycle. When a <b>Prod Gestating</b> entry is updated  
to <b>Prod Lactating</b> entry, these tasks are automatically scheduled. Reminders are sent 
when each task's due date, calculated from the start of piglets Date of Birth, is reached.`
			
		},
		
		'lactating_sow_ops': {
			'title': 'Lactating Sow Ops',
			
			'info_text':`This list defines the standard care activities for a 
lactating sows in each production cycle. When a <b>Prod Gestating</b> entry is updated  
to <b>Prod Lactating</b> entry, these tasks are automatically scheduled. Reminders are sent 
when each task's due date, calculated from the start of piglets Date of Birth, is reached.`
			
		},
		
		'gilt_ops': {
			'title': 'Gilt Ops',
			
			'info_text':`This list defines the standard care activities for 
prepeparation of a gilt before first mating.`
			
		}
		
	}
};


export {TRANSLATION_PAGE_ACC_PIG_OPS};