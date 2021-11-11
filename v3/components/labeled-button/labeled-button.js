import { AbstractElement } from '../initializer.js';

export default class LabeledButton extends AbstractElement {

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

            this.#changeButton();
            this.#changeLabel();
            this.#swap();
        });
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        if (oldValue == newValue) {
            return;
        }
        this[attr] = newValue;
        switch(attr) {
            case 'data-position':
                this.#swap();
                break;
            case 'data-label':
                this.#changeLabel();
                break;
            case 'data-button':
                this.#changeButton();
                break;
            default:
                break;
        }
    }

    static get observedAttributes() {
        return ['data-position', 'data-label', 'data-button'];
    }

    #changeButton() {
        let button = this.shadowRoot?.querySelector('button');
        if (button === undefined) {
            return;
        }
        button.innerHTML = this['data-button'];
    }

    #changeLabel() {
        let label = this.shadowRoot?.querySelector('label');
        if (label === undefined) {
            return;
        }
        label.innerHTML = this['data-label'];
    }

    #swap() {
        let button = this.shadowRoot?.querySelector('button');
        let label = this.shadowRoot?.querySelector('label');
        if (button === undefined || label === undefined) {
            return;
        }
        if (this['data-position'] == 'left') {
            this.shadowRoot.insertBefore(button, label);
        } else {
            this.shadowRoot.insertBefore(label, button);
        }
    }
}

export function createLabeledButton(value) {
    if (!(value instanceof LabelButton)) {
        throw new Error("In order to create a LabeledNode, please provide the specification.");
    }

    let labeledButton = document.createElement('labeled-button');
    labeledButton.id = value.id;
    labeledButton.setAttribute('data-position', value.position);
    labeledButton.setAttribute('data-label', value.label);
    labeledButton.setAttribute('data-button', value.button);
    
    return labeledButton;
}

export class LabelButton {
    constructor(id, position, label, button) {
        this.id = id;
        this.position = position;
        this.label = label;
        this.button = button;
    }
}