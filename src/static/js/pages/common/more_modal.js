// more_modal.js

// January 18, 2026
// Jack Wong
// j2718wong@gmail.com

'use strict';




export function MoreModal(_navigation){
    const thisObj               = this;
    const navigation            = _navigation;
    
    // This is needed as this will be first element to be rendered
    let elemDivContainer        = document.getElementById('container-more-modal');
    
    
    let elemIdMoreModal         = null;
    let elemIdMoreModalTitle    = null;
    
    let elemIdMoreItem0         = null;
    let elemIdMoreItem1         = null;
    let elemIdMoreItem2         = null;
    let elemIdMoreItem3         = null;
    let elemIdMoreItem4         = null;
    let elemIdMoreItem5         = null;
    let elemIdMoreItem6         = null;
    let elemIdMoreItem7         = null;
    
    
    let elemMoreModal           = null;
    let elemMoreModalTitle      = null;
    
    let elemMoreItem0           = null;
    let elemMoreItem1           = null;
    let elemMoreItem2           = null;
    let elemMoreItem3           = null;
    let elemMoreItem4           = null;
    let elemMoreItem5           = null;
    let elemMoreItem6           = null;
    let elemMoreItem7           = null;
    
    
    
    let moreItems               = [];
    
    
    let moreModal               = null;
    
    
    this.init = function(){
        this.render();
        this.afterHtmlRender();
    }
    
    
    this.render = function(){
        
        elemIdMoreModal         = `more-modal`;
        elemIdMoreModalTitle    = `more-modal-title`;
        
        elemIdMoreItem0         = `more-item-0`;
        elemIdMoreItem1         = `more-item-1`;
        elemIdMoreItem2         = `more-item-2`;
        elemIdMoreItem3         = `more-item-3`;
        elemIdMoreItem4         = `more-item-4`;
        elemIdMoreItem5         = `more-item-5`;
        elemIdMoreItem6         = `more-item-6`;
        elemIdMoreItem7         = `more-item-7`;
        
        
        
        
        const html = `
        <div class="modal fade custom-modal" id="${elemIdMoreModal}" tabindex="-1" aria-labelledby="moreModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    
                    <div class="modal-header" >
                        <h5 class="modal-title" id="${elemIdMoreModalTitle}">More</h5>
                    </div>
                    
                    
                    <div class="modal-body" style="padding-top:0;">
                        
                        <div id="menuItems">
                            <div class="more-menu-item" id="${elemIdMoreItem0}">
                                <div class="menu-text">Item 0</div>
                            </div>
                            
                            <div class="more-menu-item" id="${elemIdMoreItem1}">
                                <div class="menu-text">Item 1</div>
                            </div>
                            
                            <div class="more-menu-item" id="${elemIdMoreItem2}">
                                <div class="menu-text">Item 2</div>
                            </div>
                            
                            <div class="more-menu-item" id="${elemIdMoreItem3}">
                                <div class="menu-text">Item 3</div>
                            </div>
                            
                            <div class="more-menu-item" id="${elemIdMoreItem4}">
                                <div class="menu-text">Item 4</div>
                            </div>
                            
                            <div class="more-menu-item" id="${elemIdMoreItem5}">
                                <div class="menu-text">Item 5</div>
                            </div>
                            
                            <div class="more-menu-item" id="${elemIdMoreItem6}">
                                <div class="menu-text">Item 6</div>
                            </div>
                            
                            <div class="more-menu-item" id="${elemIdMoreItem7}">
                                <div class="menu-text">Item 7</div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
        
        return elemDivContainer.innerHTML = html;
    }
    
    
    this.afterHtmlRender = function(){
        this._findElements();
        this._processAfterHtmlRender();
        this._bindEventListeners();
    }
    
    
    this._findElements = function(){
        elemMoreModal           = document.getElementById(elemIdMoreModal);
        elemMoreModalTitle      = document.getElementById(elemIdMoreModalTitle);
        
        elemMoreItem0           = document.getElementById(elemIdMoreItem0);
        elemMoreItem1           = document.getElementById(elemIdMoreItem1);
        elemMoreItem2           = document.getElementById(elemIdMoreItem2);
        elemMoreItem3           = document.getElementById(elemIdMoreItem3);
        elemMoreItem4           = document.getElementById(elemIdMoreItem4);
        elemMoreItem5           = document.getElementById(elemIdMoreItem5);
        elemMoreItem6           = document.getElementById(elemIdMoreItem6);
        elemMoreItem7           = document.getElementById(elemIdMoreItem7);
    }
    
    
    this._processAfterHtmlRender = function(){
        moreItems.push(elemMoreItem0);
        moreItems.push(elemMoreItem1);
        moreItems.push(elemMoreItem2);
        moreItems.push(elemMoreItem3);
        moreItems.push(elemMoreItem4);
        moreItems.push(elemMoreItem5);
        moreItems.push(elemMoreItem6);
        moreItems.push(elemMoreItem7);
        
        moreModal   = bootstrap.Modal.getOrCreateInstance(elemMoreModal);
    }
    
    
    this._bindEventListeners = function(){
        // Modal men items click action is updated dynamically
    }
    
    
    this.beforeShow = function(menus, options){
        /*
        menus : array 
        [
            {
                'label':    `Edit`
                'action':   null,   function to call on click
                'data':     data, to take action
            }
        
        ]
        
        */
        
        let modal_title = 'More';
        if (options){
            if (options.title){
                modal_title = options.title;
            }
        }
        elemMoreModalTitle.textContent = modal_title;
        
        // Hide all Menu Items first
        
        let index = 0;
        
        for(const cur_entry of moreItems){
            if (index < menus.length){
                cur_entry.style.display = 'block';
                
                const cur_menu_item = menus[index];

                cur_entry.onclick = function(){
                    cur_menu_item.action(cur_menu_item.data);
                    moreModal.hide();
                }
                
                const div_elem  = cur_entry.querySelector('div');
                div_elem.textContent = menus[index].label;
                
            }
            else{
                cur_entry.style.display = 'none';
            }
            index += 1;
        }
        
        moreModal.show();
        
    }
    
}
