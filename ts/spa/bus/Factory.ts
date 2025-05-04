import { AppBus } from "./AppBus";
import { Factory as AppFactory } from "../Factory";

export class Factory {

    private appFactory: AppFactory;

    public setAppFactory(appFactory: AppFactory): void {
        this.appFactory = appFactory;
    }

    public createAppBus(): AppBus {
        let appBus = new AppBus();
        let componentsFactory = this.appFactory.getComponentsFactory();
        appBus.setComponentsFactory2(componentsFactory);
        let sf = this.appFactory.getStorageFactory();
        appBus.setStorageFactory(sf);
        return appBus;
    }

}