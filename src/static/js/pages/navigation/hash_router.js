// hash_router.js

// June 7, 2026
// Jack Wong
// j2718wong@gmail.com



export class HashRouter {
    constructor() {
        this.currentState   = null;
        this.onRouteChange  = null;
        this.isListening    = false;
    }
    
    
    init() {
        if (this.isListening) return;
        
        
        // Set initial state if no hash exists
        if (!window.location.hash) {
            const initialState = { route: 'home', data: {}, timestamp: Date.now() };
            history.replaceState(initialState, '', '#home');
            console.log('HashRouter: Initial state set to home');
        }
        
        
        // Handle initial load
        window.addEventListener('load', () => {
            // Set initial state if needed
            if (!window.location.hash) {
                history.replaceState({ route: 'home', data: {} }, '', '#home');
            }
            this.handleHashChange();
        });
        
        
        // Single popstate listener for everything
        window.addEventListener('popstate', (event) => {
            console.log('HashRouter popstate:', event.state);
            this.handleHashChange(event.state);
        });
        
        this.isListening = true;
    }
    
    
    handleHashChange(state) {
        let route, data;
        
        if (state && state.route) {
            route = state.route;
            data = state.data || {};
        } else {
            const hash = window.location.hash.substring(1);
            route = hash.split('?')[0] || 'home';
            data = {};
        }
        
        if (this.onRouteChange) {
            this.onRouteChange(route, data);
        }
    }
    
    navigate(route, data = {}) {
        console.log('\n\n🔵 NAVIGATE to:', route, 'History length:', history.length);
        const hash = `#${route}`;
        const state = { route, data, timestamp: Date.now() };
        
        history.pushState(state, '', hash);
        this.currentState = state;
        
        if (this.onRouteChange) {
            this.onRouteChange(route, data);
        }
        console.log('🔵 After navigate, History length:', history.length);
    }
    
    
    replace(route, data = {}) {
        console.log('🟡 REPLACE to:', route, 'History length:', history.length);
        const hash = `#${route}`;
        const state = { route, data, timestamp: Date.now() };
        
        history.replaceState(state, '', hash);
        this.currentState = state;
        
        if (this.onRouteChange) {
            this.onRouteChange(route, data);
        }
        console.log('🟡 After replace, History length:', history.length);
    }
    
    
    getCurrentRoute() {
        const hash = window.location.hash.substring(1);
        return hash.split('?')[0];
    }
}


