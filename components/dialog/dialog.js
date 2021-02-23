class OneDialog extends HTMLElement {
    //Lifecycle methods
    // - connectedCallback: 
    //      - will be triggered whenever the element is added to the DOM;
    //      - add/remove content to/from the element;
    //      - setting up event listeners;
    // - attributeChangedCallback:
    //      - watch for changes on attributes.
    // - observedAttributes:
    //      - define an array of attributes to be watched.

    static get observedAttributes() {
        return ['open'];
    }

    connectedCallback() {
        const template = document.getElementById('dialog');
        const node = document.importNode(template.content, true);
        this.appendChild(node);
    }

    attibuteChangedCallback(attrName, oldValue, newValue) {
        if (newValue !== oldValue) {
            this[attrName] = this.hasAttribute(attrName);
        }
    }

    get open() {
        return this.hasAttribute('open');
    }

    set open(isOpen) {
        if (isOpen) {
            this.setAttribute('open', true);
        } else {
            this.removeAttribute('open');
        }
    }

    // https://css-tricks.com/creating-a-custom-element-from-scratch/
}
customElements.define('one-dialog', OneDialog);