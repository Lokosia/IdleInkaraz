// UIClassReplacer.js
// Dynamically replaces all data-ui-class attributes with the corresponding class names from UI_CLASSES
import { UI_CLASSES } from './components/ui/UIClasses.js';

/**
 * Map of data-ui-class keys to UI_CLASSES paths (dot notation)
 * Extend this as you add more data-ui-class usages
 */
const UI_CLASS_MAP = {
    'layout': UI_CLASSES.util.layout,
    'header-row': 'mdl-layout__header-row',
    'header': 'demo-header mdl-layout__header mdl-color--blue-grey-900 mdl-color-text--blue-grey-200',
    'drawer': 'demo-drawer mdl-layout__drawer mdl-color--blue-grey-900 mdl-color-text--blue-grey-50',
    'main-content': 'mdl-layout__content mdl-color--blue-grey-200',
    'grid': UI_CLASSES.card.grid,
    'card': UI_CLASSES.card.container,
    'card-supporting': UI_CLASSES.card.supporting,
    'info-card': UI_CLASSES.card.container,
    'avatar': UI_CLASSES.util.avatar,
    'avatar-dropdown': 'demo-avatar-dropdown',
    'spacer': UI_CLASSES.navigation.spacer,
    'navigation-container': UI_CLASSES.navigation.container,
    'snackbar': 'mdl-js-snackbar mdl-snackbar',
    'snackbar-icon': UI_CLASSES.snackbar.icon,
    'snackbar-text': UI_CLASSES.snackbar.text,
    'snackbar-action': UI_CLASSES.snackbar.action,
    'icon-base': UI_CLASSES.icon.base,
    'progress-indeterminate': `${UI_CLASSES.progress.bar} ${UI_CLASSES.progress.indeterminate}`
};

/**
 * Replace all data-ui-class attributes in the DOM with the mapped class names
 */
export function replaceUIClasses() {
    const all = document.querySelectorAll('[data-ui-class]');
    all.forEach(el => {
        const keys = el.getAttribute('data-ui-class').split(/\s+/);
        let classList = [];
        keys.forEach(key => {
            if (UI_CLASS_MAP[key]) {
                classList.push(UI_CLASS_MAP[key]);
            }
        });
        if (classList.length) {
            el.className = classList.join(' ');
        }
    });
}

// Optionally, run on DOMContentLoaded
document.addEventListener('DOMContentLoaded', replaceUIClasses);
