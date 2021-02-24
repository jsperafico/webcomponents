class AbstractClass extends HTMLElement {
    constructor() {
        super();
        if (this.constructor.observedAttributes && this.constructor.observedAttributes.length) {
            this.constructor.observedAttributes.forEach(attribute => {
                Object.defineProperty(this, attribute, {
                    get() { return this.getAttribute(attribute); },
                    set(attrValue) {
                        if (attrValue) {
                            this.setAttribute(attribute, attrValue);
                        } else {
                            this.removeAttribute(attribute);
                        }
                    },
                });
            });
        }
    }
}