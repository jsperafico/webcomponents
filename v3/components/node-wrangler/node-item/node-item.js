import { AbstractElement } from '../../initializer.js'

export default class NodeItem extends AbstractElement {

    constructor() {
        super();
    }

    get _url() {
        return import.meta.url.replace('.js', '');
    }

    connectedCallback() {
        this.template.then(([template, css]) => {
            let shadow = this.attachShadow({mode: 'open'});
            shadow.appendChild(css.cloneNode(true));
            shadow.appendChild(template.content.cloneNode(true));
        })
    }
}