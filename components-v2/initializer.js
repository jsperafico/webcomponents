class AbstractClass extends HTMLElement {

    constructor() {
        super();
        if (this.constructor == AbstractClass) {
            throw new Error(`Abstract classes can't be initialized.`);
        }
       
        this._template = fetch(`${this.#path}.html`, { importance : "low"})
                .catch(error => { throw error; });
        this._listeners = [];
    }

    get template() {
        return this._template.then(response => response.text())
            .then(html => {
                let doc = new DOMParser().parseFromString(html, 'text/html');
                let template = doc.getElementById(this.localName);
                let css = doc.querySelector('link');
                css.href = `${this.#path}.css`
                css.importance = "high";
                
                return [template, css];
            });
    }

    static get TAG() {
        return this.name.match(/[A-Z][a-z0-9]+|[0-9][a-z0-9]+/g).join('-').toLocaleLowerCase();
    }

    get #path() {
        let value = "";
        if (window.location.href.includes(this.localName)) {
            value = this.localName;
        } else {
            value = `./components-v2/${this.localName}/${this.localName}`;
        }
        return value;
    }
}

class ComponentFactory {
    static #INSTANCE;

    static get INSTANCE() {
        if (this.#INSTANCE === undefined) {
            this.#INSTANCE = new ComponentFactory();
        }
        return this.#INSTANCE;
    }

    
    #_postpone = false;

    get postpone() {
        return this.#_postpone;
    }

    set postpone(value) {
        this.#_postpone = value;
    }

    register(...components) {
        components.forEach(component => {
            customElements.define(component.TAG, component);
        });
    }
}