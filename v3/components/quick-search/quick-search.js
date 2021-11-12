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
            case 'label':
                this.#label();
                break;
            case 'description':
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
        if (value?.length >= 3) {
            slot.assignedElements().forEach(i => {
                if (!i.innerText.toLowerCase().includes(value.toLowerCase().trim())) {
                    i.classList.add('hide');
                    return;
                }
                i.classList.remove('hide');
            });
        } else {
            slot.assignedElements().forEach(i => i.classList.remove('hide'));
        }
    }

    #label() {
        let label = this.shadowRoot?.querySelector(`label`);
        if (label === undefined) {
            return;
        }
        if (this['label'] == '' || this['label'] == null || this['label'] == undefined) {
            label.classList.add('hide');
        } else {
            label.classList.remove('hide');
        }
        label.innerHTML = this['label'];
    }

    #description() {
        let search = this.shadowRoot?.querySelector(`#search`);
        if (search === undefined) {
            return;
        }
        search.setAttribute('placeholder', this['description']);
    }

    static get observedAttributes() {
        return ['label', 'description'];
    }
}