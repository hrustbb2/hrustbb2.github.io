let openRequest = indexedDB.open("store", 1);
openRequest.onupgradeneeded = function(event) {
    // версия существующей базы данных меньше 2 (или база данных не существует)
    let db = openRequest.result;
    switch(event.oldVersion) { // существующая (старая) версия базы данных
      case 0:
        // версия 0 означает, что на клиенте нет базы данных
        // выполнить инициализацию
        db.createObjectStore('books', {keyPath: 'id'});
      case 1:
        // на клиенте версия базы данных 1
        // обновить
    }
  };

  openRequest.onerror = function() {
    console.error("Error", openRequest.error);
  };
  
  openRequest.onsuccess = function() {
    let db = openRequest.result;
    // продолжить работу с базой данных, используя объект db
    db.onversionchange = function() {
        db.close();
        alert("База данных устарела, пожалуйста, перезагрузите страницу.")
      };

    // db.createObjectStore('books')

    let transaction = db.transaction("books", "readwrite"); // (1)

    // получить хранилище объектов для работы с ним
    let books = transaction.objectStore("books"); // (2)

    let book = {
    id: 'js2',
    price: 10,
    created: new Date()
    };

    let request = books.add(book); // (3)

    request.onsuccess = function() { // (4)
    console.log("Книга добавлена в хранилище", request.result);
    };

    request.onerror = function() {
    console.log("Ошибка", request.error);
    };
  };

  openRequest.onblocked = function() {
    // это событие не должно срабатывать, если мы правильно обрабатываем onversionchange
  
    // это означает, что есть ещё одно открытое соединение с той же базой данных
    // и он не был закрыт после того, как для него сработал db.onversionchange
  };

// Регистрация service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/distr/js/service-worker.js')
      .then(reg => console.log('Service Worker registered!', reg))
      .catch(err => console.error('Service Worker registration failed:', err));

      window.addEventListener('beforeinstallprompt', (e) => {
          e.preventDefault();

          const deferredPrompt = e;

          const installButton = document.createElement('button');
          installButton.textContent = 'Install App';
          installButton.style.position = 'fixed';
          installButton.style.top = '10px';
          installButton.style.left = '50%';
          installButton.style.transform = 'translateX(-50%)';
          installButton.style.zIndex = '9999';
          installButton.style.padding = '10px 20px';
          installButton.classList.add('btn-grad');
          installButton.style.color = 'white';
          installButton.style.border = 'none';
          installButton.style.borderRadius = '5px';
          installButton.style.cursor = 'pointer';

          installButton.addEventListener('click', () => {

              (<any>deferredPrompt).prompt();

              (<any>deferredPrompt).userChoice.then((choiceResult:any) => {
                  if (choiceResult.outcome === 'accepted') {
                      console.log('App installed');
                  } else {
                      console.log('App installation declined');
                  }

                  installButton.style.display = 'none';
              });
          });

          document.body.appendChild(installButton);
      });
  }