import Konva from 'konva';
import { AbstractShape } from '../storage/AbstractShape';

export class Line {

    protected layer: Konva.Layer;

    protected fromShape: AbstractShape;

    protected toShape: AbstractShape;

    protected layerTag: string;

    protected line: Konva.Line;

    protected id: string;

    protected isHihlight: boolean = false;

    public constructor() {
        this.id = this.makeid(16);
        this.line = new Konva.Line({
            points: [],
            stroke: 'black',
            strokeWidth: 2,
            // lineCap: 'round',
            lineJoin: 'round',
            // draggable: true,
        });
    }

    public setFromShape(shape: AbstractShape): void {
        this.fromShape = shape;
    }

    public getFromShape(): AbstractShape {
        return this.fromShape;
    }

    public setToShape(shape: AbstractShape): void {
        this.toShape = shape;
    }

    public getToShape(): AbstractShape {
        return this.toShape;
    }

    public setLayerTag(tag: string): void {
        this.layerTag = tag;
    }

    public getLayerTag(): string {
        return this.layerTag;
    }

    public setHighlight(b: boolean): void {
        this.isHihlight = b;
    }

    private getPath(): number[] {
        if (!this.fromShape || !this.toShape) {
            return [];
        }
        let fromShape = {
            x: this.fromShape.getCoordinates().x - 10,
            y: this.fromShape.getCoordinates().y - 10,
            width: this.fromShape.getWidth() + 20,
            height: (<any>this.fromShape).getHeight() + 20,
        };
        let toShape = {
            x: this.toShape.getCoordinates().x - 10,
            y: this.toShape.getCoordinates().y - 10,
            width: this.toShape.getWidth() + 20,
            height: (<any>this.toShape).getHeight() + 20,
        };

        // Вычисление центра каждой фигуры
        const fromCenter = {
            x: fromShape.x + fromShape.width / 2,
            y: fromShape.y + fromShape.height / 2,
        };
        const toCenter = {
            x: toShape.x + toShape.width / 2,
            y: toShape.y + toShape.height / 2,
        };

        let path = [];

        // Определяем относительное расположение фигур
        const fromRight = fromShape.x + fromShape.width;
        const fromBottom = fromShape.y + fromShape.height;
        const toRight = toShape.x + toShape.width;
        const toBottom = toShape.y + toShape.height;

        if (fromRight < toShape.x && (toCenter.y < fromBottom + 60 && toCenter.y > fromShape.y - 60)) {
            // fromShape находится слева от toShape
            path.push(fromRight - 10);
            path.push(fromCenter.y);
            path.push(fromRight);
            path.push(fromCenter.y);
            path.push(toShape.x);
            path.push(toCenter.y);
            path.push(toShape.x + 10);
            path.push(toCenter.y);
        } else if (toRight < fromShape.x && (toCenter.y < fromBottom + 60 && toCenter.y > fromShape.y - 60)) {
            // fromShape находится справа от toShape
            path.push(fromShape.x + 10);
            path.push(fromCenter.y);
            path.push(fromShape.x);
            path.push(fromCenter.y);
            path.push(toRight);
            path.push(toCenter.y);
            path.push(toRight - 10);
            path.push(toCenter.y);
        } else if (fromBottom < toShape.y) {
            // fromShape находится выше toShape
            path.push(fromCenter.x);
            path.push(fromBottom - 10);
            path.push(fromCenter.x);
            path.push(fromBottom);
            path.push(toCenter.x);
            path.push(toShape.y);
            path.push(toCenter.x);
            path.push(toShape.y + 10);
        } else if (toBottom < fromShape.y) {
            // fromShape находится ниже toShape
            path.push(fromCenter.x);
            path.push(fromShape.y + 10);
            path.push(fromCenter.x);
            path.push(fromShape.y);
            path.push(toCenter.x);
            path.push(toBottom);
            path.push(toCenter.x);
            path.push(toBottom - 10);
        } else {
            // Случай пересечения или частичного наложения (опционально)
            // throw new Error("Shapes are overlapping or not separable!");
        }

        // Возвращаем массив точек в формате [x1, y1, x2, y2, ...]
        // return path.flatMap(point => [point.x, point.y]);

        return path;
    }

    public draw(layer: Konva.Layer): void {
        let points = this.getPath();
        if (points.length == 0) {
            return;
        }
        this.line.strokeWidth(2);
        if (this.isHihlight) {
            this.line.strokeWidth(10);
        }
        this.line.points(points);
        layer.add(this.line);
    }

    private makeid(length: number): string {
        var result = '';
        var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    public getId(): string {
        return this.id;
    }

    public remove(): void {
        this.line.remove();
    }

}