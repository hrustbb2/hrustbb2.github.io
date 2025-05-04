import { AbstractShapesFactory } from '../tree/storage/AbstractShapesFactory';
import { AbstractShape } from '../tree/storage/AbstractShape';
import { Rectangle } from './Rectangle';
import { Tag } from './Tag';
import { Factory as TreeFactory } from '../tree/Factory';
import { Factory as AppFactory } from '../Factory';
import { AppBus } from '../bus/AppBus';

export class Factory extends AbstractShapesFactory {

    private treeFactory: TreeFactory;

    private appFactory: AppFactory;

    public setTreeFcatory(factory: TreeFactory): void {
        this.treeFactory = factory;
    }

    public setAppFactory(factory: AppFactory): void {
        this.appFactory = factory;
    }

    public createShape(shapeType: number): AbstractShape {
        if (shapeType == 1) {
            let shape = new Rectangle();
            let bus = this.treeFactory.getBusFactory().getAppBus();
            shape.setAppBus(<AppBus>bus);
            let commands = this.appFactory.getCommandsFactory().getAppCommands();
            shape.setAppCommands(commands);
            return shape;
        }
        if (shapeType == 2) {
            let shape = new Tag();
            let bus = this.treeFactory.getBusFactory().getAppBus();
            shape.setAppBus(<AppBus>bus);
            let commands = this.appFactory.getCommandsFactory().getAppCommands();
            shape.setAppCommands(commands);
            return shape;
        }
    }

}