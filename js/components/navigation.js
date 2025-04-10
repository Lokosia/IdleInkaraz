class UINavigation {
    static createMenuItem({ text, icon, onClick }) {
        const link = document.createElement('a');
        link.className = UI_CLASSES.navigation.link;
        link.href = 'javascript:void(0);';
        link.onclick = onClick;

        const iconElement = document.createElement('i');
        iconElement.className = UI_CLASSES.navigation.icon;
        iconElement.setAttribute('role', 'presentation');
        iconElement.textContent = icon;

        link.appendChild(iconElement);
        link.appendChild(document.createTextNode(text));

        return link;
    }

    static createNavigation(items) {
        const nav = document.createElement('nav');
        nav.className = UI_CLASSES.navigation.container;

        items.forEach(item => {
            nav.appendChild(this.createMenuItem(item));
            
            // Add spacer if specified
            if (item.addSpacer) {
                const spacer = document.createElement('div');
                spacer.className = UI_CLASSES.navigation.spacer;
                nav.appendChild(spacer);
            }
        });

        return nav;
    }
}