import { NavigationPanel } from "./NavigationPanel";
import { LayersPanel } from "./LayersPanel";
import { BoardsPanel } from "./BoardsPanel";
import { AppBus } from "../bus/AppBus";
import { BoardsStorage } from "../storage/BoardsStorage";

class MenuItem {

    private container: HTMLElement;

    private subitem: HTMLElement;

    public getSubItemContainer(): HTMLElement {
        return this.subitem;
    }

    public init(container: HTMLElement): void {
        this.container = container;
        this.subitem = this.container.querySelector('.js-subitem');

        this.container.onclick = (e: Event) => {
            e.stopPropagation();
            if (this.subitem.style.maxHeight) {
                // Скрываем
                this.subitem.style.maxHeight = null;
            } else {
                // Временно устанавливаем высоту по содержимому для анимации
                // this.subitem.style.maxHeight = this.subitem.scrollHeight + 'px';
                this.subitem.style.maxHeight = '100vh';
            }
        }

        if (this.subitem) {
            this.subitem.onclick = (e: Event) => {
                e.stopPropagation();
            }
        }
    }

}

export class MainMenu {

    private container: HTMLElement;

    private exportBtn: HTMLElement;

    private importFileInput: HTMLInputElement;

    private navigationPanel: NavigationPanel;

    private layersPanel: LayersPanel;

    private boardsPanel: BoardsPanel;

    private notesBtn: HTMLElement;

    private tagsBtn: HTMLElement;

    private appBus: AppBus;

    private boardsStorage: BoardsStorage;

    public setNavigationPanel(panel: NavigationPanel): void {
        this.navigationPanel = panel;
    }

    public getNavigationPanel(): NavigationPanel {
        return this.navigationPanel;
    }

    public setLayersPanel(panel: LayersPanel): void {
        this.layersPanel = panel;
    }

    public getLayersPanel(): LayersPanel {
        return this.layersPanel;
    }

    public setBoardsPanel(panel: BoardsPanel): void {
        this.boardsPanel = panel;
    }

    public getBoardsPanel(): BoardsPanel {
        return this.boardsPanel;
    }

    public setAppBus(bus: AppBus): void {
        this.appBus = bus;
    }

    public setBoardsStorage(storage: BoardsStorage): void {
        this.boardsStorage = storage;
    }

    public init(container: HTMLElement): void {
        this.container = container;

        this.container.querySelectorAll('.js-item').forEach((el: HTMLElement) => {
            let item = this.createItem();
            item.init(el);
        });

        let np = this.container.querySelector('.js-navigation-panel');
        this.navigationPanel.init(<HTMLElement>np);

        let lp = this.container.querySelector('.js-layers-panel');
        this.layersPanel.init(<HTMLElement>lp);

        let bp = this.container.querySelector('.js-boards-panel');
        this.boardsPanel.init(<HTMLElement>bp);

        this.notesBtn = this.container.querySelector('.js-notes-btn');
        this.notesBtn.onclick = (e: Event) => {
            e.stopPropagation();
            this.appBus.showNotesPanel();
            if (window.innerWidth < 500) {
                this.toggleOpen(false);
            }
        }
        this.tagsBtn = this.container.querySelector('.js-tags-btn');
        this.tagsBtn.onclick = (e: Event) => {
            e.stopPropagation();
            this.appBus.showTagsPanel();
            if (window.innerWidth < 500) {
                this.toggleOpen(false);
            }
        }

        this.exportBtn = this.container.querySelector('.js-export-btn');
        this.exportBtn.onclick = () => {
            this.boardsStorage.export();
        }
        this.importFileInput = this.container.querySelector('.js-import-fi');
        this.importFileInput.onchange = () => {
            if (this.importFileInput.files.length > 0) {
                this.boardsStorage.importBoard(this.importFileInput.files[0])
            }
        }
    }

    public toggleOpen(isOpen?: boolean): void {
        if (typeof isOpen == 'undefined') {
            this.container.classList.toggle('open');
            return;
        }
        this.container.classList.toggle('open', isOpen);
    }

    private createItem(): MenuItem {
        let item = new MenuItem();
        return item;
    }

}