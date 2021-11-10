import { AbstractElement } from '../../initializer.js'
import { createLabeledButton } from '../../labeled-button/labeled-button.js'

//https://github.com/octref/web-components-examples/tree/master/editable-list

export default class NodeItem extends AbstractElement {

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

            this.#changeTitle();
            this.#toggleIO();
            this.#changeLegend('input');
            this.#changeLegend('output');
        })
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        if (oldValue == newValue) {
            return;
        }
        this[attr] = newValue;
        switch(attr) {
            case 'data-title':
                this.#changeTitle();
                break;
            case 'data-show-io':
                this.#toggleIO();
                break;
            case 'data-input-legend':
                this.#changeLegend('input');
                break;
            case 'data-output-legend':
                this.#changeLegend('output');
                break;
            default:
                break;
        }
    }

    static get observedAttributes() {
        return ['data-title', 'data-show-io', 'data-input-legend', 'data-output-legend'];
    }

    #changeTitle() {
        let h1 = this.shadowRoot?.querySelector('h1');
        if (h1 === undefined) {
            return;
        }
        h1.innerHTML = this['data-title'];
    }

    #toggleIO() {
        let input = this.shadowRoot?.querySelector(`fieldset[name='input'] legend`);
        let output = this.shadowRoot?.querySelector(`fieldset[name='output'] legend`);
        if (input === undefined || output === undefined) {
            return;
        }
        if (this['data-show-io'] == 'true') {
            input.style.display = '';
            output.style.display = '';
        } else {
            input.style.display = 'none';
            output.style.display = 'none';
        }
    }

    #changeLegend(value) {
        let legend = this.shadowRoot?.querySelector(`fieldset[name='${value}'] legend`);
        if (legend === undefined) {
            return;
        }
        legend.innerHTML = this[`data-${value}-legend`];
    }
}

export function createNode(value) {
    if (!(value instanceof Node)) {
        throw new Error("In order to create a Node, please provide the specification.");
    }

    let node = document.createElement('node-item');
    node.id = value.id;
    node.setAttribute('data-title', value.title);
    node.setAttribute('data-show-io', 'true');
    node.setAttribute('data-input-legend', 'Input');
    node.setAttribute('data-output-legend', 'Output');

    value.inputs.forEach(element => {
        let sloted = createLabeledButton(element);
        sloted.setAttribute('slot', 'input-list');
        node.appendChild(sloted);
    });

    value.outputs.forEach(element => {
        let sloted = createLabeledButton(element);
        sloted.setAttribute('slot', 'output-list');
        node.appendChild(sloted);
    });

    return node;
}

export class Node {
    constructor(id, title, inputs, outputs) {
        this.id = id;
        this.title = title;
        this.inputs = inputs;
        this.outputs = outputs;
    }
}