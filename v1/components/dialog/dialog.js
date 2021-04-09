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

    constructor() {
        super();
        this.close = this.close.bind(this);
        this._watchEscape = this._watchEscape.bind(this);
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        if (oldValue !== newValue) {
            this[attrName] = this.hasAttribute(attrName);
        }
    }

    get open() {
        return this.hasAttribute('open');
    }

    set open(isOpen) {
        this.querySelector('.wrapper').classList.toggle('open', isOpen);
        this.querySelector('.wrapper').setAttribute('aria-hidden', !isOpen);

        if (isOpen) {
            this._wasFocused = document.activeElement;
            this.setAttribute('open', '');

            document.addEventListener('keydown', this._watchEscape);
            this.focus();
            this.querySelector('button').focus();
        } else {
            this._wasFocused && this._wasFocused.focus && this._wasFocused.focus();
            this.removeAttribute('open');
            document.removeEventListener('keydown', this._watchEscape);
            this.close();
        }
    }

    close() {
        if (this.open !== false) {
            this.open = false;
        }
        const closeEvent = new CustomEvent('dialog-closed');
        this.dispatchEvent(closeEvent);
    }

    _watchEscape(event) {
        if (event.key === 'Escape') {
            this.close();
        }
    }

    connectedCallback() {   
        const template = document.getElementById('dialog');
        const node = document.importNode(template.content, true);
        this.appendChild(node);

        this.querySelector('button').addEventListener('click', this.close);
        this.querySelector('.overlay').addEventListener('click', this.close);
        this.open = this.open;
    }
      
    disconnectedCallback() {
        this.querySelector('button').removeEventListener('click', this.close);
        this.querySelector('.overlay').removeEventListener('click', this.close);
    }

    // https://css-tricks.com/creating-a-custom-element-from-scratch/
}
customElements.define('one-dialog', OneDialog);