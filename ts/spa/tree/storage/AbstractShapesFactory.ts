import { AbstractShape } from "./AbstractShape";
import { Factory as StorageFactory } from './Factory';

export abstract class AbstractShapesFactory {

    protected storageFactory:StorageFactory;

    public setStorageFactory(factory:StorageFactory): void
    {
        this.storageFactory = factory;
    }

    abstract createShape(shapeType:number): AbstractShape;
}