import COMPONENT_FACTORY from '../../initializer.js'
import { AbstractElement } from '../../initializer.js'

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
            let shadow = this.attachShadow({mode: 'open'});
            shadow.appendChild(css.cloneNode(true));
            shadow.appendChild(template.content.cloneNode(true));
        })
    }

    static get observedAttributes() {
        return ['position'];
    }
}

export function createNode(value) {
    if (!(value instanceof Node)) {
        throw new Error("In order to create a node, please provide a Node specification.");
    }

    let node = document.createElement('node-item');
    node.id = value.id;

    node.appendChild(slotedDescription('span', 'title', value.title));
    node.appendChild(slotedDescription('span', 'input', 'Input'));
    node.appendChild(slotedDescription('span', 'output', 'Output'));

    node.appendChild(listConnectables(node.id, true, value.inputs));
    node.appendChild(listConnectables(node.id, false, value.outputs));

    return node;
}

export function slotedDescription(tag, slot, value) {
    let element = document.createElement(tag);
    element.slot = slot;
    element.innerHTML = value;
    return element;
}

export function listConnectables(parent_idx, isInput, items) {
    let div = document.createElement('div');
    div.slot = isInput ? 'input-list' : 'output-list';
    items.forEach(element => {
        let idx = COMPONENT_FACTORY.incremental;

        let button = document.createElement('button');
        button.id = `${parent_idx}_${idx}`;
        button.innerText = '+';

        let label = document.createElement('label');
        label.setAttribute('for', `${parent_idx}_${idx}`);
        label.innerHTML = element;

        if (isInput) {
            div.append(button, label);
        } else {
            div.append(label, button);
        }
    });
    return div;
}

export class Node {
    constructor(id, title, inputs, outputs) {
        this.id = id;
        this.title = title;
        this.inputs = inputs;
        this.outputs = outputs;
    }
}