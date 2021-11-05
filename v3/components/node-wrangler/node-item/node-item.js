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
    if (!(node instanceof Node)) {
        throw new Error("In order to create a node, please provide a Node specification.");
    }

    let node = document.createElement('node-item');
    node.id = value.id;

    let title = document.createElement('span');
    title.slot = "title";
    title.value = value.title;
    node.appendChild(title);

    let input = document.createElement('span');
    input.slot = "input";
    input.value = "Input";
    node.appendChild(input);
    
    let output = document.createElement('span');
    output.slot = "output";
    output.value = "Output";
    node.appendChild(output);

    let incremental = 0;

    let input_div = document.createElement('div');
    input_div.slot="input-list";
    value.inputs.forEach(element => {
        let button = document.createElement('button');
        button.id = `${value.id}_i_${incremental}`;
        button.value = '+';

        let label = document.createElement('label');
        label.for = `${value.id}_i_${incremental++}`;
        label.value = element;

        input_div.append(button, label);
    });
    node.appendChild(input_div);

    let output_div = document.createElement('div');
    output_div.slot="output-list";
    value.outputs.forEach(element => {
        let button = document.createElement('button');
        button.id = `${value.id}_i_${incremental}`;
        button.value = '+';

        let label = document.createElement('label');
        label.for = `${value.id}_i_${incremental++}`;
        label.value = element;

        output_div.append(label, button);
    });
    node.appendChild(output_div);

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