class MenuItem extends AbstractClass {
    //Lifecycle methods
    // - connectedCallback: 
    //      - will be triggered whenever the element is added to the DOM;
    //      - add/remove content to/from the element;
    //      - setting up event listeners;
    // - attributeChangedCallback:
    //      - watch for changes on attributes.
    // - observedAttributes:
    //      - define an array of attributes to be watched.
    constructor() {
        super();

        this._separeteHtml().then(html => {
            let doc = this._parser.parseFromString(html, 'text/html');
            let template = doc.getElementById(this._correctName);
            let shadow = this.attachShadow({mode: 'open'});
            shadow.innerHTML = template.outerHTML;
        });
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }
}

customElements.define('menu-item', MenuItem);

// using as refference:
// - https://stackoverflow.com/questions/55080103/how-to-separate-web-components-to-individual-files-and-load-them