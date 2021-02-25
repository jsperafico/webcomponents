class AbstractClass extends HTMLElement {
    _parser = new DOMParser();
    _separeteHtml() {
        let name = this._correctName;
        let html = fetch(`./components-v2/${name}/${name}.html`)
            .then(response => response.text())
            .catch(error => { throw error; });
        return html;
    }
    get _correctName() {
        return this.constructor.name.match(/[A-Z][a-z0-9]+|[0-9][a-z0-9]+/g).join('-').toLocaleLowerCase();
    }
}