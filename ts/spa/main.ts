import { Factory } from "./Factory";

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    let appContainer = document.querySelector('.js-app-contaier');
    let factory = new Factory();
    factory.init(<HTMLElement>appContainer);

    // Регистрация service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/distr/js/sw.js')
            .then(reg => console.log('Service Worker registered!', reg))
            .catch(err => console.error('Service Worker registration failed:', err));

        // window.addEventListener('beforeinstallprompt', (e) => {
        //     e.preventDefault();

        //     const deferredPrompt = e;

        //     const installButton = document.createElement('button');
        //     installButton.textContent = 'Install App';
        //     installButton.style.position = 'fixed';
        //     installButton.style.top = '10px';
        //     installButton.style.left = '50%';
        //     installButton.style.transform = 'translateX(-50%)';
        //     installButton.style.zIndex = '9999';
        //     installButton.style.padding = '10px 20px';
        //     installButton.classList.add('btn-grad');
        //     installButton.style.color = 'white';
        //     installButton.style.border = 'none';
        //     installButton.style.borderRadius = '5px';
        //     installButton.style.cursor = 'pointer';

        //     installButton.addEventListener('click', () => {

        //         (<any>deferredPrompt).prompt();

        //         (<any>deferredPrompt).userChoice.then((choiceResult: any) => {
        //             if (choiceResult.outcome === 'accepted') {
        //                 console.log('App installed');
        //             } else {
        //                 console.log('App installation declined');
        //             }

        //             installButton.style.display = 'none';
        //         });
        //     });

        //     document.body.appendChild(installButton);
        // });
    }
});