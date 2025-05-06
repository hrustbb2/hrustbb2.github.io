import { BoardsStorage } from "../storage/BoardsStorage";
import { AppBus } from "../bus/AppBus";
import { TBoard } from "../tree/types/TBoard";
import { AppComamnds } from "../commands/AppCommands";

export class BoardsPanel {

    private container: HTMLElement;

    private content: HTMLElement;

    private createBtn: HTMLElement;

    private boardsStorage: BoardsStorage;

    private appBus: AppBus;

    private items: BoardItem[] = [];

    private appCommands: AppComamnds;

    public setBoardsStorage(storage: BoardsStorage): void {
        this.boardsStorage = storage;
    }

    public setAppBus(appBus: AppBus): void {
        this.appBus = appBus;
    }

    public setAppCommands(commands: AppComamnds): void {
        this.appCommands = commands;
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
            let board = {
                id: 'board_' + this.getRandomString(32),
                title: title,
                scale: 1,
                x: 0,
                y: 0,
            }
            this.boardsStorage.add(board);
            let item = this.createItem();
            item.load(board);
            this.content.append(item.getTemplate());
            item.eventsListen();
            item.setOnClick((self: BoardItem) => {
                this.appBus.setCurrentBoard(self.getData());
                for (let b of this.items) {
                    b.setActive(false);
                }
                self.setActive(true);
            });
            item.setOnDeleted((self: BoardItem) => {
                for (let i in this.items) {
                    if (this.items[i].getData().id == self.getData().id) {
                        this.items[i].getTemplate().remove();
                        delete this.items[i];
                        break;
                    }
                }
            });
            this.items.push(item);
        }

        this.items = [];
        this.boardsStorage.getList()
            .then((resp: any) => {
                for (let b of resp) {
                    let item = this.createItem();
                    item.load(b);
                    this.content.append(item.getTemplate());
                    item.eventsListen();
                    item.setOnClick((self: BoardItem) => {
                        this.appCommands.getBoard(self.getData().id)
                            .then((resp:any)=>{
                                this.appBus.setCurrentBoard(resp.board);
                                for (let b of this.items) {
                                    b.setActive(false);
                                }
                                self.setActive(true);
                            });
                    });
                    item.setOnDeleted((self: BoardItem) => {
                        for (let i in this.items) {
                            if (this.items[i].getData().id == self.getData().id) {
                                this.items[i].getTemplate().remove();
                                delete this.items[i];
                                break;
                            }
                        }
                    });
                    this.items.push(item);
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

    private createItem(): BoardItem {
        let item = new BoardItem();
        item.setAppCommands(this.appCommands);
        return item;
    }

}

class BoardItem {

    private html: string = `
        <div class="board-item" style="display: flex;">
            <div class="board-title"></div>
            <div class="board-delete-btn" style="margin-left: 10px;">×</div>
        </div>
    `;

    private template: HTMLElement;

    private title: HTMLElement;

    private deleteBtn: HTMLElement;

    private data: TBoard;

    private appCommands: AppComamnds;

    private onClick: (self: BoardItem) => void;

    private onDeleted: (self: BoardItem) => void;

    public setOnClick(c: (self: BoardItem) => void): void {
        this.onClick = c;
    }

    public setOnDeleted(c: (self: BoardItem) => void): void {
        this.onDeleted = c;
    }

    public getTemplate(): HTMLElement {
        return this.template;
    }

    public getData(): TBoard {
        return this.data;
    }

    public setAppCommands(commands: AppComamnds): void {
        this.appCommands = commands;
    }

    public constructor() {
        this.template = document.createElement('div');
        this.template.innerHTML = this.html.trim();
        this.template = <HTMLElement>this.template.firstChild;
        this.title = this.template.querySelector('.board-title');
        this.deleteBtn = this.template.querySelector('.board-delete-btn');
    }

    public load(data: TBoard): void {
        this.data = data;
        this.title.innerText = data.title;
    }

    public eventsListen(): void {
        this.template.onclick = () => {
            this.onClick(this);
        }

        this.deleteBtn.onclick = (e: Event) => {
            if (!confirm('Delete Board?')) {
                return;
            }
            e.stopPropagation();
            this.appCommands.deleteBoard(this.data.id);
            this.onDeleted(this);
        }
    }

    public setActive(isActive: boolean): void {
        if (isActive) {
            this.template.style.fontWeight = 'bold';
            return;
        }
        this.template.style.removeProperty('font-weight');
    }
}