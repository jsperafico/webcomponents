window.onload = function() {
    const fragment = document.getElementById('card');
    const placeholder = document.getElementById('cards');
    
    const instance1 = document.importNode(fragment.content, true);
    const instance2 = document.importNode(fragment.content, true);
    const instance3 = document.importNode(fragment.content, true);
    
    placeholder.appendChild(instance1);
    placeholder.appendChild(instance2);
    placeholder.appendChild(instance3);
};
