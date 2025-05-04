import Konva from "konva";
import { Line } from "./Line";
import { AbstractShape } from '../storage/AbstractShape';

type TLines = {
    [id: string]: Line;
}

type TShapes = {
    [shapeId: string]: TLines;
}

export class Linker {

    protected lines: TLines = {};

    protected fromShapes: TShapes = {};

    protected toShapes: TShapes = {};

    protected linesLayer: Konva.Layer;

    protected currentLayerTag: string;

    protected visibleLayers: string[] = [];

    protected lineCreator: () => Line;

    public setLineCreator(creator: () => Line): void {
        this.lineCreator = creator;
    }

    public setLinesLayer(layer: Konva.Layer): void {
        this.linesLayer = layer;
    }

    public setCurrentLayerTag(lt: string): void {
        this.currentLayerTag = lt;
    }

    public setVisibleLayers(layers: string[]): void {
        this.visibleLayers = layers;
    }

    public linkShapes(from: AbstractShape, to: AbstractShape, layerId?: string): void {
        if (from.getId() == to.getId()) {
            return;
        }
        let line = this.lineCreator();
        line.setFromShape(from);
        line.setToShape(to);
        line.setLayerTag(layerId || this.currentLayerTag);
        this.lines[line.getId()] = line;
    }

    public unlinkShapes(from: AbstractShape, to: AbstractShape): void {
        for (let id in this.lines) {
            if (this.lines[id].getFromShape().getId() == from.getId() && this.lines[id].getToShape().getId() == to.getId() && this.lines[id].getLayerTag() == this.currentLayerTag) {
                this.lines[id].remove();
                delete this.lines[id];
            }
        }
    }

    public removeFor(shape: AbstractShape): void {
        for (let id in this.lines) {
            if (this.lines[id].getFromShape().getId() == shape.getId() || this.lines[id].getToShape().getId() == shape.getId()) {
                this.lines[id].remove();
                delete this.lines[id];
            }
        }
    }

    public highlightFor(shape: AbstractShape): void {
        for (let id in this.lines) {
            this.lines[id].setHighlight(false);
            if (this.lines[id].getFromShape().getId() == shape.getId() || this.lines[id].getToShape().getId() == shape.getId() && this.lines[id].getLayerTag() == this.currentLayerTag) {
                this.lines[id].setHighlight(true);
            }
        }
    }

    public removeFrom(shape: AbstractShape): void {
        for (let id in this.lines) {
            if (this.lines[id].getFromShape().getId() == shape.getId()) {
                this.lines[id].remove();
                delete this.lines[id];
            }
        }
    }

    public isLinked(from: AbstractShape, to: AbstractShape): boolean {
        for (let id in this.lines) {
            if ((this.lines[id].getFromShape().getId() == from.getId() && this.lines[id].getToShape().getId() == to.getId() && this.lines[id].getLayerTag() == this.currentLayerTag)
                || (this.lines[id].getFromShape().getId() == to.getId() && this.lines[id].getToShape().getId() == from.getId() && this.lines[id].getLayerTag() == this.currentLayerTag)) {
                return true;
            }
        }
        return false;
    }

    public drawLines(): void {
        for (let id in this.lines) {
            if (!this.isLineVisible(this.lines[id])) {
                this.lines[id].remove();
                // delete this.lines[id];
                continue;
            }
            this.lines[id].draw(this.linesLayer);
        }
    }

    private isLineVisible(line: Line): boolean {
        let lineLayer = line.getLayerTag();
        return this.visibleLayers.indexOf(lineLayer) != -1 || lineLayer == '*';
    }

    public drawLinesFor(shape: AbstractShape): void {
        for (let id in this.lines) {
            let v = this.isLineVisible(this.lines[id]);
            if ((this.lines[id].getFromShape().getId() == shape.getId() && v) || (this.lines[id].getToShape().getId() == shape.getId() && v)) {
                this.lines[id].draw(this.linesLayer);
            }
        }
    }

    public clear(): void {
        this.lines = {};
    }

}