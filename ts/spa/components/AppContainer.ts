import { MainMenu } from "./MainMenu";
import { TBoard } from "../tree/types/TBoard";
import { Pane } from "./Pane";
import { TagsPane } from "./TagsPane";
import { AppComamnds } from "../commands/AppCommands";
import { BoardsStorage } from "../storage/BoardsStorage";
import { AppBus } from "../bus/AppBus";
import { Rectangle } from "../Shapes/Rectangle";

export class AppContainer {

    private container: HTMLElement;

    private mainBtn: HTMLElement;

    private currentBoard: TBoard;

    private pane: Pane;

    private tagsPane: TagsPane;

    private isTagsLoades: boolean = false;

    private appCommands: AppComamnds;

    private appBus: AppBus;

    private tagsLinks: any;

    private mainMenu: MainMenu;

    public setMainMenu(menu: MainMenu): void {
        this.mainMenu = menu;
    }

    public getMainMenu(): MainMenu {
        return this.mainMenu;
    }

    public setCurrentBoard(board: TBoard): void {
        this.currentBoard = board;
        this.mainMenu.getLayersPanel().clear();
        this.mainMenu.getLayersPanel().setCurrentBoard(board);

        this.pane.loadSettings(board);
        this.appCommands.getNotes(board.id)
            .then((resp: any) => {
                if (resp.success) {
                    this.mainMenu.getNavigationPanel().clear();
                    this.pane.clear();
                    this.mainMenu.getNavigationPanel().loadNotes(resp.notes);
                    this.pane.loadNotes(resp.notes);
                }
            });
        this.appCommands.getLinks(board.id)
            .then((resp: any) => {
                if (resp.success) {
                    this.pane.loadLinks(resp.links);
                }
            });
        this.appCommands.getTagsWithLinks()
            .then((resp: any) => {
                if (resp.success) {
                    this.tagsLinks = resp.tags;
                    this.mainMenu.getNavigationPanel().load(resp.tags);
                }
            })
    }

    public updateNavigatonPanel(): void {
        this.appCommands.getNotes(this.currentBoard.id)
            .then((resp: any) => {
                if (resp.success) {
                    this.mainMenu.getNavigationPanel().clear();
                    this.mainMenu.getNavigationPanel().loadNotes(resp.notes);
                }
            });

        this.appCommands.getTagsWithLinks()
            .then((resp: any) => {
                if (resp.success) {
                    this.tagsLinks = resp.tags;
                    this.mainMenu.getNavigationPanel().load(resp.tags);
                }
            })
    }

    public getTagsLinks(): any {
        return this.tagsLinks;
    }

    public setAppCommands(appCommands: AppComamnds): void {
        this.appCommands = appCommands;
    }

    public setAppBus(bus: AppBus): void {
        this.appBus = bus;
    }

    public setPane(pane: Pane): void {
        this.pane = pane;
    }

    public setTagsPane(pane: TagsPane): void {
        this.tagsPane = pane;
    }

    public init(container: HTMLElement): void {
        this.container = container;
        this.mainBtn = this.container.querySelector('.js-main-btn');
        let mainMenu = this.container.querySelector('.js-main-menu');
        this.mainMenu.init(<HTMLElement>mainMenu);

        this.mainBtn.onclick = () => {
            this.mainMenu.toggleOpen();
        }

        let pane = this.container.querySelector('.js-notes');
        this.pane.init(<HTMLDivElement>pane);

        let tagsPane = this.container.querySelector('.js-tags');
    }

    public updateNode(data: any): void {
        this.pane.getStorage().getById(data.id).load(data);
    }

    public highlightForTagId(tagId: string): void {
        let tags = this.extractBranchFromRoot(this.tagsLinks, tagId);
        let tagsIds = tags.map((node: any) => node.id);
        let nodes = this.pane.getStorage().getShapes();
        for (let i in nodes) {
            let node = <Rectangle>nodes[i];
            let b = node.hasTags(tagsIds);
            node.higlight(b);
        }
    }

    public highligtNote(noteId: string): void {
        let nodes = this.pane.getStorage().getShapes();
        for (let i in nodes) {
            let node = <Rectangle>nodes[i];
            let b = node.getId() == noteId;
            node.higlight(b);
            if (b) {
                let w = this.pane.getWidth();
                let h = this.pane.getHeight();
                let coords = node.getCoordinates();

                let scale = this.pane.getStage().scale();
                let xPos = w / 2 - coords.x * scale.x;
                let yPos = h / 2 - coords.y * scale.y;

                this.pane.getStage().position({
                    x: xPos - node.getWidth() * scale.x / 2,
                    y: yPos - node.getHeight() * scale.y / 2,
                });
            }
        }
    }

    public highligtNodesByTags(tagsIds: string[]): void {
        let nodes = this.pane.getStorage().getShapes();
        for (let i in nodes) {
            let node = <Rectangle>nodes[i];
            let b = node.hasTags(tagsIds);
            node.higlight(b);
        }
    }

    private extractBranchFromRoot(data: any[], rootId: string): any[] {
        const nodeMap = new Map();
        const result: any = [];

        // Создаём карту узлов для быстрого доступа по ID
        data.forEach(node => nodeMap.set(node.id, node));

        // Рекурсивная функция для поиска связанных узлов
        function traverse(nodeId: string): any {
            const node = nodeMap.get(nodeId);
            if (node && !result.find((n: any) => n.id === nodeId)) { // Проверяем, чтобы не добавлять один и тот же узел дважды
                result.push(node); // Добавляем узел в результат
                if (node.links && node.links.length > 0) {
                    // Перебираем все связи и проходим вглубь
                    node.links.forEach((link: any) => traverse(link.to));
                }
            }
        }

        // Начинаем обход от корневого ID
        traverse(rootId);

        return result;
    }

    public showTagsPanel(): void {
        let pane = this.container.querySelector('.js-notes');
        pane.classList.add('hide')
        let tagsPane = this.container.querySelector('.js-tags');
        tagsPane.classList.remove('hide');
        this.tagsPane.init(<HTMLDivElement>tagsPane);
        if (this.isTagsLoades) {
            return;
        }
        this.appCommands.getTags()
            .then((resp: any) => {
                if (resp.success) {
                    this.tagsPane.loadNotes(resp.tags);
                    return Promise.resolve();
                }
            })
            .then(() => {
                return this.appCommands.getTagsLinks();
            })
            .then((resp: any) => {
                if (resp.success) {
                    this.tagsPane.getLinker().setCurrentLayerTag('*');
                    this.tagsPane.loadLinks(resp.links);
                    this.isTagsLoades = true;
                }
            });
    }

    public showNotesPanel(): void {
        let pane = this.container.querySelector('.js-notes');
        pane.classList.remove('hide')
        let tagsPane = this.container.querySelector('.js-tags');
        tagsPane.classList.add('hide');
    }

}