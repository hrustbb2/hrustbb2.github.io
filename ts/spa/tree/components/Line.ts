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

    private __getPath(): number[] {
        if (!this.fromShape || !this.toShape) return [];
    
        const fromShape = {
            x: this.fromShape.getCoordinates().x - 10,
            y: this.fromShape.getCoordinates().y - 10,
            width: this.fromShape.getWidth() + 20,
            height: (<any>this.fromShape).getHeight() + 20,
        };
    
        const toShape = {
            x: this.toShape.getCoordinates().x - 10,
            y: this.toShape.getCoordinates().y - 10,
            width: this.toShape.getWidth() + 20,
            height: (<any>this.toShape).getHeight() + 20,
        };
    
        const fromCenter = {
            x: fromShape.x + fromShape.width / 2,
            y: fromShape.y + fromShape.height / 2,
        };
    
        const toCenter = {
            x: toShape.x + toShape.width / 2,
            y: toShape.y + toShape.height / 2,
        };
    
        const path = [];
        const fromRight = fromShape.x + fromShape.width;
        const fromBottom = fromShape.y + fromShape.height;
        const toRight = toShape.x + toShape.width;
        const toBottom = toShape.y + toShape.height;
    
        const arrowSize = 10; // Размер стрелочки
    
        if (fromRight < toShape.x && (toCenter.y < fromBottom + 60 && toCenter.y > fromShape.y - 60)) {
            // fromShape слева от toShape → стрелка вправо
            path.push(fromRight - 10, fromCenter.y);
            path.push(fromRight, fromCenter.y);
            path.push(toShape.x, toCenter.y);
            // Стрелка (треугольник вправо)
            path.push(toShape.x - arrowSize, toCenter.y - arrowSize / 2);
            path.push(toShape.x, toCenter.y);
            path.push(toShape.x - arrowSize, toCenter.y + arrowSize / 2);
        } 
        else if (toRight < fromShape.x && (toCenter.y < fromBottom + 60 && toCenter.y > fromShape.y - 60)) {
            // fromShape справа от toShape → стрелка влево
            path.push(fromShape.x + 10, fromCenter.y);
            path.push(fromShape.x, fromCenter.y);
            path.push(toRight, toCenter.y);
            // Стрелка (треугольник влево)
            path.push(toRight + arrowSize, toCenter.y - arrowSize / 2);
            path.push(toRight, toCenter.y);
            path.push(toRight + arrowSize, toCenter.y + arrowSize / 2);
        } 
        else if (fromBottom < toShape.y) {
            // fromShape выше toShape → стрелка вниз
            path.push(fromCenter.x, fromBottom - 10);
            path.push(fromCenter.x, fromBottom);
            path.push(toCenter.x, toShape.y);
            // Стрелка (треугольник вниз)
            path.push(toCenter.x - arrowSize / 2, toShape.y - arrowSize);
            path.push(toCenter.x, toShape.y);
            path.push(toCenter.x + arrowSize / 2, toShape.y - arrowSize);
        } 
        else if (toBottom < fromShape.y) {
            // fromShape ниже toShape → стрелка вверх
            path.push(fromCenter.x, fromShape.y + 10);
            path.push(fromCenter.x, fromShape.y);
            path.push(toCenter.x, toBottom);
            // Стрелка (треугольник вверх)
            path.push(toCenter.x - arrowSize / 2, toBottom + arrowSize);
            path.push(toCenter.x, toBottom);
            path.push(toCenter.x + arrowSize / 2, toBottom + arrowSize);
        }
    
        return path;
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
            // fromShape находится слева от toShape (горизонтальное соединение, стрелка вправо)
            path.push(fromRight - 10);
            path.push(fromCenter.y);
            path.push(fromRight);
            path.push(fromCenter.y);
            path.push(toShape.x);
            path.push(toCenter.y);
            // Стрелочка (три точки: острие и две боковые)
            const arrowSize = 10;
            path.push(toShape.x);
            path.push(toCenter.y);
            path.push(toShape.x + arrowSize);
            path.push(toCenter.y - arrowSize/2);
            path.push(toShape.x + arrowSize);
            path.push(toCenter.y + arrowSize/2);
            path.push(toShape.x);
            path.push(toCenter.y);
        } else if (toRight < fromShape.x && (toCenter.y < fromBottom + 60 && toCenter.y > fromShape.y - 60)) {
            // fromShape находится справа от toShape (горизонтальное соединение, стрелка влево)
            path.push(fromShape.x + 10);
            path.push(fromCenter.y);
            path.push(fromShape.x);
            path.push(fromCenter.y);
            path.push(toRight);
            path.push(toCenter.y);
            // Стрелочка
            const arrowSize = 10;
            path.push(toRight);
            path.push(toCenter.y);
            path.push(toRight - arrowSize);
            path.push(toCenter.y - arrowSize/2);
            path.push(toRight - arrowSize);
            path.push(toCenter.y + arrowSize/2);
            path.push(toRight);
            path.push(toCenter.y);
        } else if (fromBottom < toShape.y) {
            // fromShape находится выше toShape (вертикальное соединение, стрелка вниз)
            path.push(fromCenter.x);
            path.push(fromBottom - 10);
            path.push(fromCenter.x);
            path.push(fromBottom);
            path.push(toCenter.x);
            path.push(toShape.y);
            // Стрелочка
            const arrowSize = 10;
            path.push(toCenter.x);
            path.push(toShape.y);
            path.push(toCenter.x - arrowSize/2);
            path.push(toShape.y + arrowSize);
            path.push(toCenter.x + arrowSize/2);
            path.push(toShape.y + arrowSize);
            path.push(toCenter.x);
            path.push(toShape.y);
        } else if (toBottom < fromShape.y) {
            // fromShape находится ниже toShape (вертикальное соединение, стрелка вверх)
            path.push(fromCenter.x);
            path.push(fromShape.y + 10);
            path.push(fromCenter.x);
            path.push(fromShape.y);
            path.push(toCenter.x);
            path.push(toBottom);
            // Стрелочка
            const arrowSize = 10;
            path.push(toCenter.x);
            path.push(toBottom);
            path.push(toCenter.x - arrowSize/2);
            path.push(toBottom - arrowSize);
            path.push(toCenter.x + arrowSize/2);
            path.push(toBottom - arrowSize);
            path.push(toCenter.x);
            path.push(toBottom);
        } else {
            // Случай пересечения или частичного наложения (опционально)
        }
    
        return path;
    }

    private _getPath(): number[] {
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
            // Дорисуй стрелочку соостно линии
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
            // Дорисуй стрелочку соостно линии
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
            // Дорисуй стрелочку соостно линии
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
            // Дорисуй стрелочку соостно линии
            path.push(toCenter.x);
            path.push(toBottom - 10);
        } else {
            // Случай пересечения или частичного наложения (опционально)
        }

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