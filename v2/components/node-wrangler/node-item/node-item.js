class NodeItem extends AbstractClass {

    constructor() {
        super();
    }

    connectedCallback() {
        this.template.then(([template, css]) => {
            let shadow = this.attachShadow({mode: 'open'});
            shadow.appendChild(css.cloneNode(true));
            shadow.appendChild(template.content.cloneNode(true));
        })
    }
}

if (!ComponentFactory.INSTANCE.postpone) {
    ComponentFactory.INSTANCE.register(NodeItem);
}