let EasyMDE = require('easymde');
import { AppComamnds } from "../commands/AppCommands";
import { AppBus } from "../bus/AppBus";

export class NodeModal {

    private container: HTMLElement;

    private modalContent: HTMLElement;

    private closeBtn: HTMLElement;

    private previewContainer: HTMLElement;

    private previewInput: HTMLInputElement;

    private easyMDE: any;

    private tagsContainer: HTMLElement;

    private addTagBtn: HTMLElement;

    private editBtn: HTMLElement;

    private saveBtn: HTMLElement;

    private cryptBtn: HTMLElement;

    private appCommands: AppComamnds;

    private appBus: AppBus;

    private data: any;

    private tagsModal: TagsModal;

    private tagsLinks: any;

    private prevPassword: string;

    public setAppCommands(appCommands: AppComamnds): void {
        this.appCommands = appCommands;
    }

    public setAppBus(appBus: AppBus): void {
        this.appBus = appBus;
    }

    public setTagsLinks(l: any): void {
        this.tagsLinks = l;
    }

    public init(container: HTMLElement): void {
        this.container = container;
        this.closeBtn = this.container.querySelector('.js-close-btn');
        this.modalContent = this.container.querySelector('.js-modal-content');
        this.previewContainer = this.container.querySelector('.js-preview-container');
        this.previewInput = this.container.querySelector('.js-preview-input');
        this.tagsContainer = this.container.querySelector('.js-tags-container');
        this.addTagBtn = this.container.querySelector('.js-add-tag-btn')
        this.editBtn = this.container.querySelector('.js-edit-button');
        this.saveBtn = this.container.querySelector('.js-save-button');
        this.cryptBtn = this.container.querySelector('.js-crypt-button');

        this.closeBtn.onclick = () => {
            this.container.classList.toggle('hide', true);
        }

        let contentInput = this.container.querySelector('.js-content-input');
        this.easyMDE = new EasyMDE({
            element: contentInput,
        });
        this.easyMDE.togglePreview();

        this.editBtn.onclick = () => {
            this.easyMDE.togglePreview();
            this.previewContainer.classList.toggle('hide', false);
        }

        this.saveBtn.onclick = () => {
            if (this.data.is_crypted) {
                alert('Необходимо зашифровать');
                return;
            }
            this.data.tags = this.data.tags || [];
            this.appCommands.updateNote({
                id: this.data.id,
                preview: this.previewInput.value,
                content: this.easyMDE.value(),
                tags: this.data.tags,
                isCrypted: this.data.is_crypted,
            }).then((resp: any) => {
                if (resp.success) {
                    let tagsIds = Object.values(resp.note.tags).map((tag: any) => tag.id);
                    this.data.tags = Object.values(this.data.tags).filter((tag: any) => {
                        if (!tag.id) {
                            return true;
                        }
                        return tagsIds.includes(tag.id)
                    });
                    this.appBus.onNodeUpdate({
                        id: this.data.id,
                        preview: this.previewInput.value,
                        content: this.easyMDE.value(),
                        tags: resp.note.tags,
                    });
                    this.easyMDE.togglePreview();
                    if (!this.easyMDE.preview) {
                        this.easyMDE.togglePreview();
                    }
                    this.previewContainer.classList.toggle('hide', true);
                    this.appBus.updateNavigatonPanel();
                }
            });
        }

        this.cryptBtn.onclick = () => {
            let defaultPass = '';
            if (this.prevPassword) {
                defaultPass = 'prev';
            }
            let password = prompt('Password', defaultPass);
            if (!password) {
                return;
            }
            if (password == 'prev') {
                password = this.prevPassword;
            }
            this.prevPassword = password;
            this.data.is_crypted = true;
            let content = this.easyMDE.value();
            this.encryptWithPassword(content, password)
                .then((d: any) => {
                    let ciphertext = d.ciphertext;
                    let iv = d.iv;
                    this.data.content = iv + ':' + ciphertext;
                    this.data.tags = this.data.tags || [];
                    return this.appCommands.updateNote({
                        id: this.data.id,
                        preview: this.previewInput.value,
                        content: this.easyMDE.value(),
                        tags: this.data.tags,
                        isCrypted: this.data.is_crypted,
                    })
                })
                .then((resp: any) => {
                    if (resp.success) {
                        let tagsIds = Object.values(resp.note.tags).map((tag: any) => tag.id);
                        this.data.tags = Object.values(this.data.tags || {}).filter((tag: any) => {
                            if (!tag.id) {
                                return true;
                            }
                            return tagsIds.includes(tag.id)
                        });
                        this.appBus.onNodeUpdate({
                            id: this.data.id,
                            preview: this.previewInput.value,
                            content: this.data.content,
                            tags: resp.tags,
                            is_crypted: this.data.is_crypted
                        });
                        this.easyMDE.togglePreview();
                        if (!this.easyMDE.preview) {
                            this.easyMDE.togglePreview();
                        }
                        this.previewContainer.classList.toggle('hide', true);
                        this.container.classList.toggle('hide', true);

                        this.appBus.updateNavigatonPanel();
                    }
                });

            this.appBus.updateNavigatonPanel();
        }

        this.container.onclick = () => {
            this.container.classList.toggle('hide', true);
        }
        this.modalContent.onclick = (e: Event) => {
            e.stopPropagation();
        }

        this.addTagBtn.onclick = (e: Event) => {
            // let tagTitle = prompt('Тэг');
            // if (!tagTitle) {
            //     return;
            // }
            // this.appendTag(null, tagTitle);
            // this.data.tags.push({
            //     title: tagTitle,
            // });
            this.tagsModal.show(this.tagsLinks)
                .then((tag: any) => {
                    this.appendTag(tag.id, tag.title);
                    if (!this.data.tags) {
                        this.data.tags = [];
                    }
                    this.data.tags.push(tag);
                });
        }

        let tagsModal = this.container.querySelector('.js-tags-modal');
        this.tagsModal = this.createTagsModal();
        this.tagsModal.init(<HTMLElement>tagsModal);
    }

    // Функция преобразования пароля в криптографический ключ
    private async deriveKeyFromPassword(password: string): Promise<CryptoKey> {
        const encoder = new TextEncoder();
        const passwordBytes = encoder.encode(password);
        const saltBytes = encoder.encode('123456789'); // Можно использовать фиксированную или случайную "соль"

        // Создаем базовый ключ на основе пароля
        const baseKey = await crypto.subtle.importKey(
            "raw", // Базовый ключ в виде массива байтов
            passwordBytes,
            { name: "PBKDF2" }, // Алгоритм
            false, // Базовый ключ нельзя экспортировать
            ["deriveKey"] // Разрешено только "вывод ключа"
        );

        // Генерируем конечный ключ AES-GCM из пароля
        return await crypto.subtle.deriveKey(
            {
                name: "PBKDF2", // Алгоритм добычи ключа
                salt: saltBytes, // Случайная соль увеличивает безопасность
                iterations: 100000, // Количество повторов (чем больше, тем лучше)
                hash: "SHA-256" // Алгоритм хеширования
            },
            baseKey,
            { name: "AES-GCM", length: 256 }, // Параметры конечного ключа AES-256
            true, // Ключ экспортируемый (если нужно)
            ["encrypt", "decrypt"] // Операции с ключом
        );
    }

    private uint8ArrayToBase64(uint8Array: Uint8Array): string {
        return btoa(String.fromCharCode(...uint8Array)); // "downlevelIteration": true in tsconfig
    }

    private base64ToUint8Array(base64: string): Uint8Array {
        return new Uint8Array(atob(base64).split('').map(char => char.charCodeAt(0)));
    }

    // Функция шифрования
    private async encryptWithPassword(plaintext: string, password: string): Promise<any> {
        const encoder = new TextEncoder();
        const iv = crypto.getRandomValues(new Uint8Array(12)); // Случайный IV

        const key = await this.deriveKeyFromPassword(password);

        const encodedText = encoder.encode(plaintext);
        const ciphertext = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            key,
            encodedText
        );

        return {
            iv: this.uint8ArrayToBase64(iv), // Сохраняем IV в Base64
            ciphertext: this.uint8ArrayToBase64(new Uint8Array(ciphertext)) // Сохраняем шифротекст в Base64
        };
    }

    // Функция расшифрования
    private async decryptWithPassword(ivBase64: string, ciphertextBase64: string, password: string): Promise<string> {
        const decoder = new TextDecoder();
        const iv = this.base64ToUint8Array(ivBase64); // Восстанавливаем IV из Base64
        const ciphertext = this.base64ToUint8Array(ciphertextBase64); // Восстанавливаем шифротекст из Base64

        const key = await this.deriveKeyFromPassword(password);

        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            ciphertext
        );

        return decoder.decode(decrypted); // Расшифрованный текст
    }

    public show(data: any): void {
        console.log(this.tagsLinks);
        this.data = data;
        this.container.classList.toggle('hide', false);
        this.previewInput.value = data.preview;
        if (data.is_crypted) {
            let defaultPass = '';
            if (this.prevPassword) {
                defaultPass = 'prev';
            }
            let password = prompt('Password', defaultPass);
            if (password == 'prev') {
                password = this.prevPassword;
            }
            this.prevPassword = password;
            let s = data.content.split(':');
            this.decryptWithPassword(s[0], s[1], password)
                .then((str: string) => {
                    this.easyMDE.value(str);
                })
                .catch((e: any) => {
                    this.easyMDE.value('');
                    this.container.classList.toggle('hide', true);
                    alert('Неверный пароль');
                });
        } else {
            this.easyMDE.value(data.content || '');
        }
        this.easyMDE.togglePreview();
        if (!this.easyMDE.preview) {
            this.easyMDE.togglePreview();
        }
        this.tagsContainer.innerHTML = '';
        for (let i in data.tags) {
            this.appendTag(data.tags[i].id, data.tags[i].title);
        }
    }

    private appendTag(id: string, title: string): void {
        let div = document.createElement('div');
        div.innerHTML = '<div style="background: #ccc; border-radius: 3px; padding: 3px 10px; cursor: pointer;"></div>';
        let tag = <HTMLElement>div.firstChild;
        tag.innerText = title;
        tag.setAttribute('data-id', id);
        this.tagsContainer.append(tag);

        tag.onclick = (e: MouseEvent) => {
            if (e.ctrlKey) {
                tag.remove();
                let title = tag.innerText;
                for (let i in this.data.tags) {
                    if (this.data.tags[i].title == title) {
                        delete this.data.tags[i];
                    }
                }
                return;
            }
            let id = tag.getAttribute('data-id');
            this.appBus.highligtForTag(id);
            this.container.classList.toggle('hide', true);
        }
    }

    private createTagsModal(): TagsModal {
        let modal = new TagsModal();
        return modal;
    }

}


class TagsModal {

    private container: HTMLElement;

    private modalContent: HTMLElement;

    private input: HTMLInputElement;

    private autocompleteList: HTMLInputElement;

    private tagsLinks: any;

    private inputBtn: HTMLElement;

    private selectedTag: any;

    private reject: any;

    private resolve: any;

    public init(container: HTMLElement): void {
        this.container = container;
        this.modalContent = this.container.querySelector('.js-tags-modal-content');
        this.input = this.container.querySelector('.js-tag-input');
        this.autocompleteList = this.container.querySelector('.js-autocomplete-list');
        this.inputBtn = this.container.querySelector('.js-input-btn');

        this.input.oninput = () => {
            let v = this.input.value;
            if (!v) {
                this.autocompleteList.classList.toggle('hide', true);
                return;
            }
            this.showAutocompleteList(v);
        }

        this.container.onclick = () => {
            this.container.classList.toggle('hide', true);
        }

        this.modalContent.onclick = (e: Event) => {
            e.stopPropagation();
        }

        this.inputBtn.onclick = () => {
            this.resolve(this.selectedTag);
            this.container.classList.toggle('hide', true);
        }
    }

    public show(tagsLinks: any): Promise<any> {
        this.tagsLinks = tagsLinks;
        this.input.value = '';
        this.container.classList.toggle('hide', false);
        this.autocompleteList.classList.toggle('hide', true);
        return new Promise<any>((resolve: any, reject: any) => {
            this.reject = reject;
            this.resolve = resolve;
        });
    }

    private showAutocompleteList(v: string): void {
        this.autocompleteList.classList.toggle('hide', false);
        this.autocompleteList.innerHTML = '';
        for (let i in this.tagsLinks) {
            let t = this.tagsLinks[i].title;
            if (t.startsWith(v)) {
                let item = this.createItem(this.tagsLinks[i]);
                this.autocompleteList.append(item);
                item.onclick = () => {
                    this.selectedTag = this.tagsLinks[i];
                    this.input.value = this.tagsLinks[i].title;
                    this.showSubitems(this.tagsLinks[i].links);
                }
            }
        }
    }

    private showSubitems(links: any): void {
        this.autocompleteList.innerHTML = '';
        for (let i in links) {
            let to = links[i].to;
            for (let ii in this.tagsLinks) {
                if (this.tagsLinks[ii].id == to) {
                    if (this.selectedTag && this.selectedTag.id == this.tagsLinks[ii].id) {
                        continue;
                    }
                    let item = this.createItem(this.tagsLinks[ii]);
                    this.autocompleteList.append(item);
                    item.onclick = () => {
                        this.selectedTag = this.tagsLinks[ii];
                        this.input.value = this.tagsLinks[ii].title;
                        this.showSubitems(this.tagsLinks[ii].links);
                    }
                }
            }
        }
    }

    private createItem(data: any): HTMLElement {
        let div = document.createElement('div');
        div.innerHTML = '<li class="autocomplete-item"></li>';
        let el = <HTMLElement>div.firstChild;
        el.innerText = data.title;
        el.setAttribute('id', data.id);
        return el;
    }
}