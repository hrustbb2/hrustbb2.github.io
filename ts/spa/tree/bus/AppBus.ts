import { AbstractShape } from "../storage/AbstractShape";
import { Factory as ComponentsFactory } from '../components/Factory';
import { TShape } from "../types/TShape";

export class AppBus {

    protected componentsFactory:ComponentsFactory;

    public setComponentsFactory(factory:ComponentsFactory): void
    {
        this.componentsFactory = factory;
    }

    public onMoveShape(shape:AbstractShape): void
    {
        this.componentsFactory.getPane().getLinker().drawLinesFor(shape);
    }

    public moveToTop(shape:AbstractShape): void
    {
        this.componentsFactory.getPane().getStorage().moveToTop(shape);
    }

    public remove(shape:AbstractShape): void
    {
        this.componentsFactory.getPane().getStorage().remove(shape);
        shape.remove();
        this.componentsFactory.getPane().getLinker().removeFor(shape);
    }

    public addShape(shapeType:number, data:TShape): void
    {
        let shape = this.componentsFactory.getAppFactory().getStorageFactory().getAbstractShapesFactory().createShape(shapeType);
        shape.init(data);
        shape.load(data);
        let layer = this.componentsFactory.getPane().getLayer();
        shape.addToLayer(layer);
        this.componentsFactory.getPane().getStorage().pushShape(shape);
    }

    public link(fromId:string, toId:string): void
    {
        let storage = this.componentsFactory.getAppFactory().getStorageFactory().getStorage();
        let from = storage.getById(fromId);
        let to = storage.getById(toId);
        this.componentsFactory.getPane().getLinker().linkShapes(from, to);
        this.componentsFactory.getPane().getLinker().drawLines();
    }

    public unlink(from:AbstractShape, to:AbstractShape): void
    {
        this.componentsFactory.getPane().getLinker().unlinkShapes(from, to);
    }

}