import { Factory as AppFactory } from '../Factory';
import { AppBus } from './AppBus';

export class Factory {

    protected appFactory: AppFactory;

    protected appBus: AppBus = null;

    protected conf: any;

    public init(conf: any): void {
        this.conf = {
            appBus: null,
        }
        this.appFactory.objectReplaceRecursive(this.conf, conf);
    }

    public setAppFactory(factory: AppFactory): void {
        this.appFactory = factory;
    }

    public getAppBus(): AppBus {
        if (this.appBus === null) {
            this.appBus = this.conf.appBus || new AppBus();
            let componentsFactory = this.appFactory.getComponentsFactory();
            this.appBus.setComponentsFactory(componentsFactory);
        }
        return this.appBus;
    }

}