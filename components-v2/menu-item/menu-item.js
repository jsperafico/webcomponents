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
        // initialize aditional data
    }

    connectedCallback() {
        this.template.then(([template, css]) => {
            let shadow = this.attachShadow({mode : 'open'});

            shadow.appendChild(css.cloneNode(true));
            shadow.appendChild(template.content.cloneNode(true));
        });

        // remember to set any listeners over here.
    }

    static get observedAttributes() {
        // must remember to create get/set property to bind attr with rendered html.
        return ['position'];
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        if (oldValue !== newValue) {
            this[attr] = newValue;
        }
    }

    get position() {
        // This must work.
        console.log(`Position changed to: ${this.getAttribute('position')}`);

        // must never do this, because will trigger endless loop.
        // console.log(`Position changed to: ${this['position']}`);
    }

    set position(value) {
        console.log(`Position will change to: ${value}`);
    }

    disconnectedCallback() {
        //if listeners were added, remember to remove them.
    }
}

//Migrate to a smart component factory.
customElements.define('menu-item', MenuItem);
