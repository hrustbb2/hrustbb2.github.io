import { Factory as ComponentsFactory } from './components/Factory';
import { Factory as BusFactory } from './bus/Factory';
import { Factory as StorageFactory } from './storage/Factory';

export class Factory {

    private componentsFactory: ComponentsFactory = null;

    protected busFactory: BusFactory = null;

    protected storageFactory: StorageFactory = null;

    protected conf: any = {};

    public getComponentsFactory(): ComponentsFactory {
        if (this.componentsFactory === null) {
            this.componentsFactory = new ComponentsFactory();
            this.componentsFactory.setAppFactory(this);
            this.componentsFactory.init(this.conf.components);
        }
        return this.componentsFactory;
    }

    public init(conf: any = {}): void {
        this.conf = {
            components: {
                factory: null,
            },
            storage: {
                factory: null,
            },
            bus: {
                factory: null,
            }
        }
        this.objectReplaceRecursive(this.conf, conf);
    }

    public getBusFactory(): BusFactory {
        if (this.busFactory === null) {
            this.busFactory = this.conf.bus.factory || new BusFactory();
            this.busFactory.setAppFactory(this);
            this.busFactory.init(this.conf.bus);
        }
        return this.busFactory;
    }

    public getStorageFactory(): StorageFactory {
        if (this.storageFactory === null) {
            this.storageFactory = this.conf.storage.factory || new StorageFactory();
            this.storageFactory.setAppFactory(this);
            this.storageFactory.init(this.conf.storage);
        }
        return this.storageFactory;
    }

    public objectReplaceRecursive(firstObj: any, twoObj: any): void {
        for (let field in twoObj) {
            if (firstObj[field] && typeof firstObj[field] == 'object' && firstObj[field].constructor.name == 'Object') {
                this.objectReplaceRecursive(firstObj[field], twoObj[field]);
            }
            if (!firstObj[field] || typeof firstObj[field] != 'object' || firstObj[field].constructor.name != 'Object') {
                firstObj[field] = twoObj[field];
            }
        }
    }

}