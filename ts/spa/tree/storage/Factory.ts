import { Factory as AppFactory } from '../Factory';
import { Storage } from './Storage';
import { AbstractShapesFactory } from './AbstractShapesFactory';

export class Factory {

    protected appFactory: AppFactory;

    protected storage: Storage = null;

    protected abstractShapesFactory: AbstractShapesFactory = null;

    protected conf: any = {};

    public setAppFactory(factory: AppFactory): void {
        this.appFactory = factory;
    }

    public getAppFactory(): AppFactory {
        return this.appFactory;
    }

    public init(conf: any): void {
        this.conf = {
            'shapesFactory': null,
        }
        this.appFactory.objectReplaceRecursive(this.conf, conf);
    }

    public getStorage(): Storage {
        if (this.storage === null) {
            this.storage = new Storage();
        }
        return this.storage;
    }

    public getAbstractShapesFactory(): AbstractShapesFactory {
        if (this.abstractShapesFactory === null) {
            this.abstractShapesFactory = this.conf.shapesFactory;
            this.abstractShapesFactory.setStorageFactory(this);
        }
        return this.abstractShapesFactory;
    }

}