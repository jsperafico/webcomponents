import { AbstractElement } from '../../initializer.js'

export default class NodeItem extends AbstractElement {
    constructor() {
        super();

        this._template = fetch(`${this.location}.html`).catch(e => console.error(e));
    }

    connectedCallback() {
        this.template.then(([template, css]) => {
            let shadow = this.attachShadow({mode: 'open'});
            shadow.appendChild(css.cloneNode(true));
            shadow.appendChild(template.content.cloneNode(true));
        })
    }

    get location() {
        return import.meta.url.replace('.js', '');
    }
}