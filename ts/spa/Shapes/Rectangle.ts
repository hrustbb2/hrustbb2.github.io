import { AbstractShape } from '../tree/storage/AbstractShape';
import { TCoordinates } from '../tree/types/TCoordinates';
import Konva from "konva";
import { AppBus } from '../bus/AppBus';
import { AppComamnds } from '../commands/AppCommands';

export class Rectangle extends AbstractShape {

    private width: number = 300;

    private height: number = 100;

    private id: string;

    private group: Konva.Group;

    private layer: Konva.Layer;

    private rect: Konva.Rect;

    protected text: Konva.Text;

    private bus: AppBus;

    private appCommands: AppComamnds;

    private data: any;

    public setAppBus(bus: AppBus): void {
        this.bus = bus;
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public getId(): string {
        return this.id;
    }

    public setAppCommands(appCommands: AppComamnds): void {
        this.appCommands = appCommands;
    }

    public init(coordinates: TCoordinates): void {
        this.coordinates = coordinates;
        this.group = new Konva.Group({
            x: this.coordinates.x,
            y: this.coordinates.y,
            draggable: true,
        });
        this.rect = new Konva.Rect({
            x: 0,
            y: 0,
            width: this.width,
            height: this.height,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 4,
            shadowColor: 'black',
            shadowOpacity: 0.5,
            // draggable: true,
            cornerRadius: 10,
        });
        this.group.add(this.rect);

        this.text = new Konva.Text({
            x: 10,
            y: 10,
            text: '',
            fontSize: 22,
            fontFamily: 'RobotoMono',
            // fill: 'green',
        });
        this.group.add(this.text);

        this.group.on('mouseenter', () => {
            this.layer.getStage().container().style.cursor = 'pointer';
            this.rect.shadowBlur(10);
            this.rect.shadowOffset({ x: 5, y: 5 });
        });

        this.group.on('mouseleave', () => {
            this.layer.getStage().container().style.cursor = 'default';
            this.rect.shadowBlur(0);
            this.rect.shadowOffset({ x: 0, y: 0 });
        });

        this.group.on('dragstart', () => {
            this.layer.getStage().container().style.cursor = 'move';
            // this.appBus.moveToTop(this);
        });

        this.group.on('dragmove', (e: any) => {
            this.coordinates = {
                x: e.target.attrs.x,
                y: e.target.attrs.y,
            }
            this.bus.onMoveShape(this);
        });

        this.group.on('dragend', () => {
            this.layer.getStage().container().style.cursor = 'pointer';
            this.appCommands.moveNode(this.id, this.coordinates.x, this.coordinates.y);
        });
    }

    protected splitLongWords(words: string[]) {
        let result: string[] = [];
        for (let i = 0; i < words.length; i++) {
            if (words[i].trim().length > 16) {
                let c = 0;
                let _str = '';
                let l = [];
                do {
                    let str = words[i].trim().slice(c * 16, 16 * (c + 1));
                    _str = str;
                    if (str) {
                        l.push(str);
                    }
                    c++;
                } while (_str);
                result = result.concat(l);
            } else {
                result.push(words[i].trim());
            }
        }
        return result;
    }

    protected getLines(text: string): string[] {
        if (!text) {
            return [];
        }
        let words = text.split(" ");
        words = words.filter((v: string) => {
            return v;
        });
        if (words.length == 0) {
            return [];
        }
        words = this.splitLongWords(words);
        let lines = [];
        let currentLine = '';
        for (let i = 0; i < words.length; i++) {
            if (words[i].trim().length == 28) {
                if (currentLine) {
                    lines.push(currentLine);
                    currentLine = '';
                }
                lines.push(words[i].trim());
                continue;
            }
            if ((currentLine + ' ' + words[i].trim()).length > 28) {
                lines.push(currentLine.trim());
                currentLine = words[i].trim();
            } else {
                currentLine += ' ' + words[i].trim();
            }
        }
        lines.push(currentLine.trim());
        return lines;
    }

    public load(data: any): void {
        this.id = data.id;
        this.data = data;

        let lines:string[] = [];
        let ps = data.preview.split('\n');
        for(let p of ps){
            let l = this.getLines(p);
            lines = lines.concat(l);
        }
        this.text.setText(lines.join('\n'));
        let h = lines.length * 22 + 20;
        if (h > this.height) {
            this.height = h;
            this.rect.height(this.height);
        }
    }

    public getData(): any {
        return this.data;
    }

    public moveToTop(): void {
        this.group.moveToTop();
    }

    public isThis(coords: TCoordinates): boolean {
        return this.coordinates.x < coords.x &&
            this.coordinates.y < coords.y &&
            this.coordinates.x + this.width > coords.x &&
            this.coordinates.y + this.height > coords.y;
    }

    public remove(): void {
        this.group.remove();
    }

    public addToLayer(layer: Konva.Layer): void {
        this.layer = layer;
        this.group.remove();
        this.layer.add(this.group);
        this.group.draw();
    }

    public hasTags(tagsIds: string[]): boolean {
        return Object.values(this.data.tags || {}).some((obj: any) => {
            try{
                return tagsIds.includes(obj.id)
            }catch(e){
                return false;
            }
            
        })
    }

    public higlight(h: boolean): void {
        if (h) {
            this.rect.fill('#ccc');
        } else {
            this.rect.fill('white');
        }
    }

}