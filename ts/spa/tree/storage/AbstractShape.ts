import Konva from 'konva';
import { TCoordinates } from '../types/TCoordinates';

export abstract class AbstractShape {

    protected coordinates: TCoordinates;

    abstract init(coordinates: TCoordinates): void;

    abstract addToLayer(layer: Konva.Layer): void;

    public getCoordinates(): TCoordinates {
        return this.coordinates;
    }

    abstract getWidth(): number;

    abstract getId(): string;

    abstract load(data: any): void;

    abstract moveToTop(): void;

    abstract isThis(coords: TCoordinates): boolean;

    abstract remove(): void;

}