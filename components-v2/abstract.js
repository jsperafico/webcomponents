class AbstractClass extends HTMLElement {

    constructor() {
        super();
        if (this.constructor == AbstractClass) {
            throw new Error(`Abstract classes can't be initialized.`);
        }
       
        this._template = fetch(`${this.#path}.html`)
                .catch(error => { throw error; });
        this._listeners = [];
    }

    get template() {
        return this._template.then(response => response.text())
            .then(html => {
                let name = this.#tag;
                let doc = new DOMParser().parseFromString(html, 'text/html');
                let template = doc.getElementById(name);
                let css = doc.querySelector('link');
                css.href = `${this.#path}.css`;
                
                return [template, css];
            });
    }

    get #tag() {
        return this.constructor.name.match(/[A-Z][a-z0-9]+|[0-9][a-z0-9]+/g).join('-').toLocaleLowerCase();
    }

    get #path() {
        let name = this.#tag;
        let value = "";
        if (window.location.href.includes(name)) {
            value = name;
        } else {
            value = `./components-v2/${name}/${name}`;
        }
        return value;
    }
}