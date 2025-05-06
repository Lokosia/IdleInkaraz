/**
 * DOMUtils.js - Standardized DOM manipulation utilities using vanilla JavaScript
 * This module provides consistent methods for DOM operations that were previously 
 * handled with a mix of jQuery and vanilla JS.
 */

/**
 * Select a single DOM element by selector.
 * @param {string} selector - CSS selector
 * @param {Element} [context=document] - Parent element to search within
 * @returns {Element|null} The first matching element or null
 */
export function select(selector, context = document) {
    return context.querySelector(selector);
}

/**
 * Select multiple DOM elements by selector.
 * @param {string} selector - CSS selector
 * @param {Element} [context=document] - Parent element to search within
 * @returns {Element[]} Array of matching elements
 */
export function selectAll(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

/**
 * Find elements by class name and convert to array.
 * @param {string} className - Class name to search for
 * @param {Element} [context=document] - Parent element to search within
 * @returns {Element[]} Array of matching elements
 */
export function findByClass(className, context = document) {
    return Array.from(context.getElementsByClassName(className));
}

/**
 * Shows an element by removing 'hidden' class and setting display style.
 * @param {Element|string} element - DOM element or selector
 */
export function show(element) {
    const el = typeof element === 'string' ? select(element) : element;
    if (!el) return;
    
    el.classList.remove('hidden');
    el.style.display = '';
}

/**
 * Hides an element by adding 'hidden' class and setting display to 'none'.
 * @param {Element|string} element - DOM element or selector
 */
export function hide(element) {
    const el = typeof element === 'string' ? select(element) : element;
    if (!el) return;
    
    el.classList.add('hidden');
    el.style.display = 'none';
}

/**
 * Add one or more classes to an element.
 * @param {Element|string} element - DOM element or selector
 * @param {...string} classNames - One or more class names to add
 */
export function addClass(element, ...classNames) {
    const el = typeof element === 'string' ? select(element) : element;
    if (!el) return;
    
    el.classList.add(...classNames);
}

/**
 * Remove one or more classes from an element.
 * @param {Element|string} element - DOM element or selector
 * @param {...string} classNames - One or more class names to remove
 */
export function removeClass(element, ...classNames) {
    const el = typeof element === 'string' ? select(element) : element;
    if (!el) return;
    
    el.classList.remove(...classNames);
}

/**
 * Toggle one or more classes on an element.
 * @param {Element|string} element - DOM element or selector
 * @param {string} className - Class name to toggle
 * @param {boolean} [force] - If present, adds when true, removes when false
 */
export function toggleClass(element, className, force) {
    const el = typeof element === 'string' ? select(element) : element;
    if (!el) return;
    
    el.classList.toggle(className, force);
}

/**
 * Add an event listener to an element.
 * @param {Element|string} element - DOM element or selector
 * @param {string} eventType - Event type (e.g., 'click', 'mouseenter')
 * @param {Function} handler - Event handler function
 * @param {boolean|Object} [options] - Event listener options
 */
export function on(element, eventType, handler, options) {
    const el = typeof element === 'string' ? select(element) : element;
    if (!el) return;
    
    el.addEventListener(eventType, handler, options);
}

/**
 * Remove an event listener from an element.
 * @param {Element|string} element - DOM element or selector
 * @param {string} eventType - Event type (e.g., 'click', 'mouseenter')
 * @param {Function} handler - Event handler function
 * @param {boolean|Object} [options] - Event listener options
 */
export function off(element, eventType, handler, options) {
    const el = typeof element === 'string' ? select(element) : element;
    if (!el) return;
    
    el.removeEventListener(eventType, handler, options);
}

/**
 * Add hover event handlers to an element (mouseenter/mouseleave)
 * @param {Element|string} element - DOM element or selector
 * @param {Function} enterHandler - Handler for mouseenter event
 * @param {Function} leaveHandler - Handler for mouseleave event
 */
export function onHover(element, enterHandler, leaveHandler) {
    const el = typeof element === 'string' ? select(element) : element;
    if (!el) return;
    
    if (enterHandler) on(el, 'mouseenter', enterHandler);
    if (leaveHandler) on(el, 'mouseleave', leaveHandler);
}

/**
 * Bind event handlers to multiple elements using a configuration array.
 * Each array item should be [selector, eventType, handler] or [selector, handler] for click events.
 * @param {Array<Array>} bindings - Array of binding configurations
 * @example
 * // For click events (default):
 * bindEvents([
 *   ['#button1', () => console.log('Button 1 clicked')],
 *   ['#button2', () => console.log('Button 2 clicked')]
 * ]);
 * 
 * // For mixed event types:
 * bindEvents([
 *   ['#button1', 'click', () => console.log('Button 1 clicked')],
 *   ['#input1', 'input', (e) => console.log(e.target.value)]
 * ]);
 */
export function bindEvents(bindings) {
    bindings.forEach(binding => {
        // Handle different binding formats
        if (binding.length === 2) {
            // Format: [selector, handler] - assumes click event
            const [selector, handler] = binding;
            const element = typeof selector === 'string' ? 
                select(selector) || document.getElementById(selector) : selector;
            
            if (element) {
                element.addEventListener('click', handler);
            }
        } else if (binding.length >= 3) {
            // Format: [selector, eventType, handler, ?options]
            const [selector, eventType, handler, options] = binding;
            const element = typeof selector === 'string' ? 
                select(selector) || document.getElementById(selector) : selector;
            
            if (element) {
                element.addEventListener(eventType, handler, options);
            }
        }
    });
}

/**
 * Create a DOM element with attributes and child elements.
 * @param {string} tag - The tag name
 * @param {Object} [attributes={}] - Attributes to set on the element
 * @param {Array|Element|string} [children] - Child elements or text content
 * @returns {Element} The created element
 */
export function createElement(tag, attributes = {}, children) {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else if (key.startsWith('on') && typeof value === 'function') {
            // Event handlers (e.g., onClick)
            const eventType = key.slice(2).toLowerCase();
            element.addEventListener(eventType, value);
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // Append children
    if (children) {
        if (Array.isArray(children)) {
            children.forEach(child => {
                if (child) {
                    element.appendChild(
                        typeof child === 'string' ? 
                            document.createTextNode(child) : 
                            child
                    );
                }
            });
        } else if (typeof children === 'string') {
            element.textContent = children;
        } else {
            element.appendChild(children);
        }
    }
    
    return element;
}