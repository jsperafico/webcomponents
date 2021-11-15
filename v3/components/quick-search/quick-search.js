import { AbstractElement } from '../initializer.js';

export default class QuickSearch extends AbstractElement {

    constructor() {
        super();
    }

    get _url() {
        return import.meta.url.replace('.js', '');
    }

    connectedCallback() {
        this.template.then(([template, css]) => {
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(css.cloneNode(true));
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        
            this.#label();
            this.#description();
            this.#setup();
        });
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        if (oldValue == newValue) {
            return;
        }
        this[attr] = newValue;
        switch(attr) {
            case 'data-label':
                this.#label();
                break;
            case 'data-description':
                this.#description();
                break;
            default:
                break;
        }
    }

    #setup() {
        let search = this.shadowRoot?.querySelector(`#search`);
        search.addEventListener('input', (e) => {
            this.#filter(e.target.value);
        });
    }

    #filter(value) {
        let slot = this.shadowRoot?.querySelector('slot');
        if (slot === undefined) {
            return;
        }
        this.#show(slot);
        
        if (value?.length >= 3) {
            slot.assignedElements().forEach(i => {
                let children = [...i.children];
                if (children.length > 0) {
                    children.forEach(j => {
                        if (j.nodeName.toLocaleLowerCase() == 'legend') {
                            return;
                        }
                        this.#hide(j, j.innerText, value);
                    });
                } else {
                    this.#hide(i, i.innerText, value);
                }
            });
        }
    }

    #hide(element, text, value) {
        if (!text.toLowerCase().includes(value.toLowerCase().trim())) {
            element.classList.add('hide')
        }
    }

    #show(slot) {
        slot.assignedElements().forEach(i => {
            i.classList.remove('hide');
            
            let children = [...i.children];

            if (children?.length > 0) {
                children.forEach(j => j.classList.remove('hide'));
            }
        });
    }

    #label() {
        let label = this.shadowRoot?.querySelector(`label`);
        if (label === undefined) {
            return;
        }
        if (this['data-label'] == '' || this['data-label'] == null || this['data-label'] == undefined) {
            label.classList.add('hide');
        } else {
            label.classList.remove('hide');
        }
        label.innerHTML = this['data-label'];
    }

    #description() {
        let search = this.shadowRoot?.querySelector(`#search`);
        if (search === undefined) {
            return;
        }
        search.setAttribute('placeholder', this['data-description']);
    }

    static get observedAttributes() {
        return ['data-label', 'data-description'];
    }
}