import { Factory as AppFactory } from '../Factory';
import { AbstractPane } from './AbstractPane';
import { Linker } from './Linker';
import { Line } from './Line';

export class Factory {

    private appFactory: AppFactory;

    private pane: AbstractPane = null;

    protected conf: any = {};

    public init(conf: any = {}): void {
        this.conf = {
            pane: null,
        }
        this.appFactory.objectReplaceRecursive(this.conf, conf);
    }

    public setAppFactory(factory: AppFactory): void {
        this.appFactory = factory;
    }

    public getAppFactory(): AppFactory {
        return this.appFactory;
    }

    public getPane(): AbstractPane {
        if (this.pane === null) {
            this.pane = this.conf.pane;
            let appBus = this.appFactory.getBusFactory().getAppBus();
            this.pane.setAppBus(appBus);
            let storage = this.appFactory.getStorageFactory().getStorage();
            this.pane.setStorage(storage);
            let shapesFactory = this.appFactory.getStorageFactory().getAbstractShapesFactory();
            this.pane.setShapesFactory(shapesFactory);
            let linker = this.createLinker();
            this.pane.setLinker(linker);
        }
        return this.pane;
    }

    protected createLinker(): Linker {
        let linker = new Linker();
        linker.setLineCreator(this.createLine.bind(this));
        return linker;
    }

    protected createLine(): Line {
        let line = new Line();
        return line;
    }

}