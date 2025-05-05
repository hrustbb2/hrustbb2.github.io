import { Factory as AppFactory } from '../Factory';
import { AppContainer } from './AppContainer';
import { MainMenu } from './MainMenu';
import { AppBus } from '../bus/AppBus';
import { NavigationPanel } from './NavigationPanel';
import { LayersPanel } from './LayersPanel';
import { NodeModal } from './NodeModal';
import { Pane } from "./Pane";
import { TagsPane } from "./TagsPane";
import { BoardsPanel } from './BoardsPanel';

export class Factory {

    private appFactory: AppFactory;

    private appContainer: AppContainer;

    private nodeModal: NodeModal;

    public setAppFactory(factory: AppFactory): void {
        this.appFactory = factory;
    }

    public init(container: HTMLElement): void {
        this.appContainer = new AppContainer();
        let mm = this.createMainMenu();
        this.appContainer.setMainMenu(mm);
        let appCommands = this.appFactory.getCommandsFactory().getAppCommands();
        this.appContainer.setAppCommands(appCommands);
        let appBus = this.appFactory.getCanvasFactory().getBusFactory().getAppBus();
        this.appContainer.setAppBus(<AppBus>appBus);
        let pane = this.appFactory.getCanvasFactory().getComponentsFactory().getPane();
        this.appContainer.setPane(<Pane>pane);
        let tagsPane = this.appFactory.getTagsCanvasFactory().getComponentsFactory().getPane();
        this.appContainer.setTagsPane(<TagsPane>tagsPane);
        this.appContainer.init(container);
    }

    public getAppContainer(): AppContainer {
        return this.appContainer;
    }

    private createMainMenu(): MainMenu {
        let menu = new MainMenu();
        let np = this.createNavigationPanel();
        menu.setNavigationPanel(np);
        let lp = this.createLayersPanel();
        menu.setLayersPanel(lp);
        let bp = this.createBoardsPanel();
        menu.setBoardsPanel(bp);
        let appBus = this.appFactory.getCanvasFactory().getBusFactory().getAppBus();
        menu.setAppBus(<AppBus>appBus);
        let bs = this.appFactory.getStorageFactory().getBoardsStorage();
        menu.setBoardsStorage(bs);
        return menu;
    }

    private createNavigationPanel(): NavigationPanel {
        let tc = new NavigationPanel();
        let appBus = this.appFactory.getCanvasFactory().getBusFactory().getAppBus();
        tc.setAppBus(<AppBus>appBus);
        return tc;
    }

    private createLayersPanel(): LayersPanel {
        let d = new LayersPanel();
        let appCommands = this.appFactory.getCommandsFactory().getAppCommands();
        d.setAppCommands(appCommands);
        let appBus = this.appFactory.getCanvasFactory().getBusFactory().getAppBus();
        d.setAppBus(<AppBus>appBus);
        return d;
    }

    public createBoardsPanel(): BoardsPanel {
        let bp = new BoardsPanel();
        let boardsStorage = this.appFactory.getStorageFactory().getBoardsStorage();
        bp.setBoardsStorage(boardsStorage);
        let appBus = this.appFactory.getCanvasFactory().getBusFactory().getAppBus();
        bp.setAppBus(<AppBus>appBus);
        let appCommands = this.appFactory.getCommandsFactory().getAppCommands();
        bp.setAppCommands(appCommands);
        return bp;
    }

    public getNodeModal(): NodeModal {
        if (this.nodeModal) {
            return this.nodeModal;
        }
        this.nodeModal = new NodeModal();
        let appCommands = this.appFactory.getCommandsFactory().getAppCommands();
        this.nodeModal.setAppCommands(appCommands);
        let appBus = this.appFactory.getCanvasFactory().getBusFactory().getAppBus();
        this.nodeModal.setAppBus(<AppBus>appBus);
        let container = document.querySelector('.js-node-modal');
        this.nodeModal.init(<HTMLElement>container);
        return this.nodeModal;
    }

}