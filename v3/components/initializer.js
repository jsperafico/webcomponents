class ComponentFactory {
    constructor() {
        this._incremental = 0;
    }

    register(...elements) {
        elements.forEach(element => 
            customElements.define(this._toTagName(element), element)
        );
    }

    _toTagName(element) {
        return element.name.match(/[A-Z][a-z0-9]+|[0-9][a-z0-9]+/g).join('-').toLocaleLowerCase();
    }

    get incremental() {
        return this._incremental++;
    }
}

const COMPONENT_FACTORY = new ComponentFactory();

export default COMPONENT_FACTORY; 

export class AbstractElement extends HTMLElement {
    constructor() {
        super();
        
        this._template = fetch(`${this._url}.html`).catch(e => console.error(e));
    }

    get template() {
        return this._template
            .then(r => r.text())
            .then(html => {
               let doc = new DOMParser().parseFromString(html, 'text/html') ;
               let template = doc.getElementById(this.localName);
               let css = doc.querySelector('link');
               css.href = `${this._url}.css`;
               css.importance = 'high';
               return [template, css];
            });
    }
}