import { Factory } from "./Factory";

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    let appContainer = document.querySelector('.js-app-contaier');
    let factory = new Factory();
    factory.init(<HTMLElement>appContainer);
});