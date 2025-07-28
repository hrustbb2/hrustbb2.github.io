import { AbstractShape } from "../storage/AbstractShape";
import { Factory as ComponentsFactory } from '../components/Factory';
import { TShape } from "../types/TShape";

export class AppBus {

    protected treeComponentsFactory:ComponentsFactory;

    public setComponentsFactory(factory:ComponentsFactory): void
    {
        this.treeComponentsFactory = factory;
    }

    public onMoveShape(shape:AbstractShape): void
    {
        this.treeComponentsFactory.getPane().getLinker().drawLinesFor(shape);
    }

    public moveToTop(shape:AbstractShape): void
    {
        this.treeComponentsFactory.getPane().getStorage().moveToTop(shape);
    }

    public remove(shape:AbstractShape): void
    {
        this.treeComponentsFactory.getPane().getStorage().remove(shape);
        shape.remove();
        this.treeComponentsFactory.getPane().getLinker().removeFor(shape);
    }

    public addShape(shapeType:number, data:TShape): void
    {
        let shape = this.treeComponentsFactory.getAppFactory().getStorageFactory().getAbstractShapesFactory().createShape(shapeType);
        shape.init(data);
        shape.load(data);
        let layer = this.treeComponentsFactory.getPane().getLayer();
        shape.addToLayer(layer);
        this.treeComponentsFactory.getPane().getStorage().pushShape(shape);
    }

    public link(fromId:string, toId:string): void
    {
        let storage = this.treeComponentsFactory.getAppFactory().getStorageFactory().getStorage();
        let from = storage.getById(fromId);
        let to = storage.getById(toId);
        this.treeComponentsFactory.getPane().getLinker().linkShapes(from, to);
        this.treeComponentsFactory.getPane().getLinker().drawLines();
    }

    public unlink(from:AbstractShape, to:AbstractShape): void
    {
        this.treeComponentsFactory.getPane().getLinker().unlinkShapes(from, to);
    }

}