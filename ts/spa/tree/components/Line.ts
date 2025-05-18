import Konva from 'konva';
import { AbstractShape } from '../storage/AbstractShape';

export class Line {

    protected layer: Konva.Layer;

    protected fromShape: AbstractShape;

    protected toShape: AbstractShape;

    protected layerTag: string;

    protected line: Konva.Line;

    protected arrow: Konva.Line;

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

        this.arrow = new Konva.Line({
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

    private getPath(): any {
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


        let center = {};
        let angle = 0;
    
        if (fromRight < toShape.x && (toCenter.y < fromBottom + 60 && toCenter.y > fromShape.y - 60)) {
            // fromShape слева от toShape → стрелка вправо
            path.push(fromRight - 10, fromCenter.y);
            path.push(fromRight, fromCenter.y);
            path.push(toShape.x, toCenter.y);
            center = {
                x: (fromCenter.x + toCenter.x) / 2,
                y: (fromBottom + toShape.y) / 2
            };
            angle = Math.atan2(toShape.x - fromRight, fromCenter.y - toCenter.y) - Math.PI;

            path.push(toShape.x + 10);
            path.push(toCenter.y);
        } 
        else if (toRight < fromShape.x && (toCenter.y < fromBottom + 60 && toCenter.y > fromShape.y - 60)) {
            // fromShape справа от toShape → стрелка влево
            path.push(fromShape.x + 10, fromCenter.y);
            path.push(fromShape.x, fromCenter.y);
            path.push(toRight, toCenter.y);
            center = {
                x: (fromCenter.x + toCenter.x) / 2,
                y: (fromBottom + toShape.y) / 2
            };
            angle = Math.atan2(toRight - fromShape.x, fromCenter.y - toCenter.y) - Math.PI;

            path.push(toRight - 10);
            path.push(toCenter.y);
        } 
        else if (fromBottom < toShape.y) {
            // fromShape выше toShape → стрелка вниз
            path.push(fromCenter.x, fromBottom - 10);
            path.push(fromCenter.x, fromBottom);
            path.push(toCenter.x, toShape.y);
            center = {
                x: (fromCenter.x + toCenter.x) / 2,
                y: (fromBottom + toShape.y) / 2
            };
            angle = Math.atan2(toCenter.x - fromCenter.x, fromBottom - toShape.y) - Math.PI;

            path.push(toCenter.x);
            path.push(toShape.y + 10);
        } 
        else if (toBottom < fromShape.y) {
            // fromShape ниже toShape → стрелка вверх
            path.push(fromCenter.x, fromShape.y + 10);
            path.push(fromCenter.x, fromShape.y);
            path.push(toCenter.x, toBottom);
            center = {
                x: (fromCenter.x + toCenter.x) / 2,
                y: (fromBottom + toShape.y) / 2
            };
            angle = Math.atan2(toCenter.x - fromCenter.x, fromShape.y - toBottom) - Math.PI;

            path.push(toCenter.x);
            path.push(toBottom - 10);
        }
    
        return {
            path: path,
            center: center,
            angle: angle
        };
    }

    private rotatePoint(x:number, y:number, cx:number, cy:number, angleRad:number) {
        const cos = Math.cos(angleRad);
        const sin = Math.sin(angleRad);
    
        // Смещаем точку в начало координат относительно центра вращения
        const nx = x - cx;
        const ny = y - cy;
    
        // Применяем поворот
        const rotatedX = nx * cos - ny * sin;
        const rotatedY = nx * sin + ny * cos;
    
        // Возвращаем точку обратно в исходную систему координат
        return {
            x: rotatedX + cx,
            y: rotatedY + cy
        };
    }

    public draw(layer: Konva.Layer): void {
        let points = this.getPath();
        if (points.path.length == 0) {
            return;
        }
        let arrowSize = 10;
        this.line.strokeWidth(2);
        if (this.isHihlight) {
            this.line.strokeWidth(10);
            arrowSize = 20;
            this.arrow.strokeWidth(10);
        }
        this.line.points(points.path);
        let path = [];
        path.push({x: points.center.x, y: points.center.y});
        path.push({x: points.center.x - arrowSize / 2, y: points.center.y - arrowSize});
        path.push({x: points.center.x + arrowSize / 2, y: points.center.y - arrowSize});
        path.push({x: points.center.x, y: points.center.y});


        path = path.map(p => 
            this.rotatePoint(p.x, p.y, points.center.x, points.center.y, points.angle)
        );
        let pp = [];
        for(let p of path){
            pp.push(p.x);
            pp.push(p.y);
        }
        this.arrow.points(pp);

        layer.add(this.line);
        layer.add(this.arrow);
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
        this.arrow.remove();
    }

}