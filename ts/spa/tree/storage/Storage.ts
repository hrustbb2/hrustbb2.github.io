import { AbstractShape } from "./AbstractShape";
import { TCoordinates } from '../types/TCoordinates';

type TShapes = {
    [id: string]: AbstractShape;
}

export class Storage {

    protected shapes: TShapes = {};

    public pushShape(shape: AbstractShape): void {
        this.shapes[shape.getId()] = shape;
    }

    public moveToTop(shape: AbstractShape): void {
        for (let id in this.shapes) {
            if (id == shape.getId()) {
                shape.moveToTop();
                break;
            }
        }
    }

    public remove(shape: AbstractShape): void {
        delete this.shapes[shape.getId()];
    }

    public getByCoords(coords: TCoordinates): AbstractShape {
        for (let id in this.shapes) {
            if (this.shapes[id].isThis(coords)) {
                return this.shapes[id];
            }
        }
        return null;
    }

    public getById(id: string): AbstractShape {
        return this.shapes[id];
    }

    public getShapes(): TShapes {
        return this.shapes;
    }

    public clear(): void {
        this.shapes = {};
    }

}