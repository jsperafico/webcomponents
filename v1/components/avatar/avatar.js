class Avatar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = '<p> Avatar </p>';
    }
}

customElements.define('custom-avatar', Avatar);