import { AbstractElement } from '../initializer.js';

export default class FormItem extends AbstractElement {
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

            this.#bindSlider();
            this.#bindNumber();
        });
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        if (oldValue == newValue) {
            return;
        }
        this[attr] = newValue;
    }

    static get observedAttributes() {
        return [''];
    }

    #bindSlider() {
        let element = this.querySelector("[slot='item'][type='range']");
        if (element == null) {
            return;
        }
        element.addEventListener('change', () => element.setAttribute('value', element.value));
        element.addEventListener('input', () => element.setAttribute('value', element.value));
        element.setAttribute('value', element.value);
    }

    #bindNumber() {
        let element = this.querySelector("[slot='item'][type='number']");
        if (element == null) {
            return;
        }
        let clamp = (value) => {
            let newValue = Math.min(Math.max(value, element.getAttribute('min')), element.getAttribute('max'));
            element.setAttribute('value', newValue)
            element.value = newValue;
        }
        element.addEventListener('change', () => clamp(element.value));
        element.addEventListener('input', () => clamp(element.value));
        element.setAttribute('value', element.value);
    }
}