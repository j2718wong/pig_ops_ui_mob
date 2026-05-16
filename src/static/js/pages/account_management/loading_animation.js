// loading_animation.js

// Deepseek code
// March 6, 2026

// Reusable Loading Animation Component
// Add this to a separate file or at the top of your existing file

export function LoadingAnimation(containerId, options = {}) {
    const defaultOptions = {
        size: '60px',
        color: '#4285f4',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        message: 'Processing...',
        showMessage: true,
        type: 'spinner' // 'spinner', 'dots', 'pulse'
    };
    
    const settings = { ...defaultOptions, ...options };
    let container = null;
    let isVisible = false;
    
    this.init = function() {
        createContainer();
    }
    
    function createContainer() {
        // Check if container already exists
        let existingContainer = document.getElementById(containerId);
        if (existingContainer) {
            container = existingContainer;
            return;
        }
        
        // Create new container
        container = document.createElement('div');
        container.id = containerId;
        container.className = 'loading-animation-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: ${settings.backgroundColor};
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
            backdrop-filter: blur(3px);
        `;
        
        // Create loading content
        const loadingContent = document.createElement('div');
        loadingContent.className = 'loading-content';
        loadingContent.style.cssText = `
            text-align: center;
            padding: 20px;
            border-radius: 12px;
            background: white;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            min-width: 200px;
        `;
        
        // Add animation based on type
        const animationElement = createAnimation();
        loadingContent.appendChild(animationElement);
        
        // Add message if enabled
        if (settings.showMessage) {
            const messageElement = document.createElement('div');
            messageElement.className = 'loading-message';
            messageElement.textContent = settings.message;
            messageElement.style.cssText = `
                margin-top: 15px;
                color: #333;
                font-size: 14px;
                font-weight: 500;
            `;
            loadingContent.appendChild(messageElement);
        }
        
        container.appendChild(loadingContent);
        document.body.appendChild(container);
    }
    
    function createAnimation() {
        switch(settings.type) {
            case 'dots':
                return createDotsAnimation();
            case 'pulse':
                return createPulseAnimation();
            case 'spinner':
            default:
                return createSpinnerAnimation();
        }
    }
    
    function createSpinnerAnimation() {
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        spinner.style.cssText = `
            width: ${settings.size};
            height: ${settings.size};
            border: 4px solid #f3f3f3;
            border-top: 4px solid ${settings.color};
            border-radius: 50%;
            margin: 0 auto;
            animation: spin 1s linear infinite;
        `;
        
        // Add keyframe animation if not exists
        if (!document.querySelector('#loading-spinner-keyframes')) {
            const style = document.createElement('style');
            style.id = 'loading-spinner-keyframes';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        return spinner;
    }
    
    function createDotsAnimation() {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'dots-container';
        dotsContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 8px;
            margin: 0 auto;
        `;
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.style.cssText = `
                width: calc(${settings.size} / 3);
                height: calc(${settings.size} / 3);
                background-color: ${settings.color};
                border-radius: 50%;
                animation: dotPulse 1.4s ease-in-out infinite;
                animation-delay: ${i * 0.2}s;
            `;
            dotsContainer.appendChild(dot);
        }
        
        // Add keyframe animation if not exists
        if (!document.querySelector('#loading-dots-keyframes')) {
            const style = document.createElement('style');
            style.id = 'loading-dots-keyframes';
            style.textContent = `
                @keyframes dotPulse {
                    0%, 60%, 100% { transform: scale(1); opacity: 0.6; }
                    30% { transform: scale(1.2); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        return dotsContainer;
    }
    
    function createPulseAnimation() {
        const pulse = document.createElement('div');
        pulse.className = 'pulse';
        pulse.style.cssText = `
            width: ${settings.size};
            height: ${settings.size};
            background-color: ${settings.color};
            border-radius: 50%;
            margin: 0 auto;
            animation: pulse 1.2s ease-in-out infinite;
        `;
        
        // Add keyframe animation if not exists
        if (!document.querySelector('#loading-pulse-keyframes')) {
            const style = document.createElement('style');
            style.id = 'loading-pulse-keyframes';
            style.textContent = `
                @keyframes pulse {
                    0% { transform: scale(0.8); opacity: 0.7; }
                    50% { transform: scale(1.2); opacity: 1; }
                    100% { transform: scale(0.8); opacity: 0.7; }
                }
            `;
            document.head.appendChild(style);
        }
        
        return pulse;
    }
    
    this.show = function(message = null) {
        if (!container) {
            createContainer();
        }
        
        if (message) {
            const messageElement = container.querySelector('.loading-message');
            if (messageElement) {
                messageElement.textContent = message;
            }
        }
        
        container.style.opacity = '1';
        container.style.visibility = 'visible';
        isVisible = true;
    }
    
    this.hide = function() {
        if (container) {
            container.style.opacity = '0';
            container.style.visibility = 'hidden';
            isVisible = false;
        }
    }
    
    this.updateMessage = function(message) {
        if (container && isVisible) {
            const messageElement = container.querySelector('.loading-message');
            if (messageElement) {
                messageElement.textContent = message;
            }
        }
    }
    
    this.isVisible = function() {
        return isVisible;
    }
    
    this.destroy = function() {
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
        container = null;
        isVisible = false;
    }
    
    // Auto-initialize
    this.init();
}
