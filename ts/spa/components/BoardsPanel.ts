import { BoardsStorage } from "../storage/BoardsStorage";
import { AppBus } from "../bus/AppBus";

export class BoardsPanel {

    private container: HTMLElement;

    private content: HTMLElement;

    private createBtn: HTMLElement;

    private boardsStorage: BoardsStorage;

    private appBus: AppBus;

    public setBoardsStorage(storage: BoardsStorage): void {
        this.boardsStorage = storage;
    }

    public setAppBus(appBus: AppBus): void {
        this.appBus = appBus;
    }

    public init(container: HTMLElement): void {
        this.container = container;
        this.content = this.container.querySelector('.js-content');
        this.createBtn = this.container.querySelector('.js-create-button');

        this.createBtn.onclick = () => {
            let title = prompt('Title');
            if (!title) {
                return;
            }
            this.boardsStorage.add({
                id: 'board_' + this.getRandomString(32),
                title: title,
                scale: 1,
                x: 0,
                y: 0,
            });
        }

        this.boardsStorage.getList()
            .then((resp: any) => {
                for (let b of resp) {
                    let div = document.createElement('div');
                    div.innerText = b.title;
                    this.content.append(div);
                    div.onclick = () => {
                        this.appBus.setCurrentBoard(b);
                    }
                }
            })
    }

    private getRandomString(length: number) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

}