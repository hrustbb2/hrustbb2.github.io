import { Factory as ComponentsFactory } from './components/Factory';
import { Factory as CanvasFactory } from './tree/Factory';
import { Factory as ShapesFactory } from './Shapes/Factory';
import { Factory as CommandsFactory } from './commands/Factory';
import { Factory as BusFactory } from './bus/Factory';
import { Pane } from './components/Pane';
import { TagsPane } from './components/TagsPane';
import { Factory as StorageFactory } from './storage/Factory';

export class Factory {

    private componentsFactory: ComponentsFactory;

    private commandsFactory: CommandsFactory;

    private canvasFactory: CanvasFactory = null;

    private tagsCanvasFactory: CanvasFactory = null;

    private busFactory: BusFactory;

    private storageFactory: StorageFactory = null;

    public getComponentsFactory(): ComponentsFactory {
        if (this.componentsFactory) {
            return this.componentsFactory;
        }
        this.componentsFactory = new ComponentsFactory();
        this.componentsFactory.setAppFactory(this);
        return this.componentsFactory;
    }

    public getCommandsFactory(): CommandsFactory {
        if (this.commandsFactory) {
            return this.commandsFactory;
        }
        this.commandsFactory = new CommandsFactory();
        this.commandsFactory.setAppFactory(this);
        return this.commandsFactory;
    }

    public getBusFactory(): BusFactory {
        if (this.busFactory) {
            return this.busFactory;
        }
        this.busFactory = new BusFactory();
        this.busFactory.setAppFactory(this);
        return this.busFactory;
    }

    public init(container: HTMLElement): void {
        this.canvasFactory = new CanvasFactory();
        let shapesFactory = new ShapesFactory();
        shapesFactory.setTreeFcatory(this.canvasFactory);
        shapesFactory.setAppFactory(this);
        let pane = new Pane();
        let appCommands = this.getCommandsFactory().getAppCommands();
        pane.setAppCommands(appCommands);
        let conf = {
            components: {
                pane: pane,
            },
            storage: {
                shapesFactory: shapesFactory,
            },
            bus: {
                appBus: this.getBusFactory().createAppBus(),
            }
        };
        this.canvasFactory.init(conf);

        this.tagsCanvasFactory = new CanvasFactory();
        shapesFactory = new ShapesFactory();
        shapesFactory.setTreeFcatory(this.tagsCanvasFactory);
        shapesFactory.setAppFactory(this);
        let tagsPane = new TagsPane();
        // let appCommands = this.getCommandsFactory().getAppCommands();
        tagsPane.setAppCommands(appCommands);
        // let appBus = this.getBusFactory().getAppBus();
        let conf2 = {
            components: {
                pane: tagsPane,
            },
            storage: {
                shapesFactory: shapesFactory,
            },
            bus: {
                appBus: this.getBusFactory().createAppBus(),
            }
        };
        this.tagsCanvasFactory.init(conf2);

        this.getComponentsFactory().init(container);
    }

    public getCanvasFactory(): CanvasFactory {
        return this.canvasFactory;
    }

    public getTagsCanvasFactory(): CanvasFactory {
        return this.tagsCanvasFactory;
    }

    public getStorageFactory(): StorageFactory {
        if (this.storageFactory) {
            return this.storageFactory;
        }
        this.storageFactory = new StorageFactory();
        this.storageFactory.setAppFactory(this);
        this.storageFactory.init();
        return this.storageFactory;
    }

}