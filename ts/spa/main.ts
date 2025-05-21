import { Factory } from "./Factory";
import { AppBus } from "./bus/AppBus";

function getTextFile(url:string, callback:CallableFunction) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        callback(xhr.responseText);
      } else {
        console.error('Request failed:', xhr.statusText);
      }
    };
    xhr.onerror = function() {
      console.error('Request failed');
    };
    xhr.send();
  }

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    let appContainer = document.querySelector('.js-app-contaier');
    let factory = new Factory();
    factory.init(<HTMLElement>appContainer);
    const urlParams = new URLSearchParams(window.location.search);

    // Получить значение параметра
    const boardId = urlParams.get('b');
    const nodeId = urlParams.get('n');
    const boardUrl = urlParams.get('u');

    if(boardUrl){
        getTextFile(boardUrl, (text:string) => {
            factory.getStorageFactory().getBoardsStorage().importFromStr(text);
        });
    }

    if(boardId){
        factory.getStorageFactory().getBoardsStorage().getById(boardId)
        .then((resp:any)=>{
            let [board] = resp;
            if(!board){
                return;
            }
            let appBus = factory.getBusFactory().createAppBus();
            appBus.setCurrentBoard(board);
            if(nodeId){
                factory.getComponentsFactory().getAppContainer().getPane().getStage().scale({ x: 1, y: 1 });
                appBus.highligtNote(nodeId);
            }
        });
    }

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