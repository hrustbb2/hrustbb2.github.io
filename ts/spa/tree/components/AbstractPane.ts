import Konva from 'konva';
import { AppBus } from '../bus/AppBus';
import { Storage } from '../storage/Storage';
import { AbstractShapesFactory } from '../storage/AbstractShapesFactory';
import { Linker } from './Linker';
import { EMods } from '../types/EMods';
import { AbstractShape } from '../storage/AbstractShape';
import { TBoard } from '../types/TBoard';
import { TCoordinates } from '../types/TCoordinates';

export abstract class AbstractPane {

    protected container: HTMLDivElement;

    protected stage: Konva.Stage;

    protected layer: Konva.Layer;

    protected linesLayer: Konva.Layer;

    protected appBus: AppBus;

    protected storage: Storage;

    protected shapesFactory: AbstractShapesFactory;

    protected linker: Linker;

    protected timeout: any = null;

    protected width: number = 600;

    protected height: number = 600;

    protected currentBoard: TBoard;

    public setAppBus(bus: AppBus): void {
        this.appBus = bus;
    }

    public setStorage(storage: Storage): void {
        this.storage = storage;
    }

    public getStorage(): Storage {
        return this.storage;
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public getStage(): Konva.Stage {
        return this.stage;
    }

    public setShapesFactory(factory: AbstractShapesFactory): void {
        this.shapesFactory = factory;
    }

    public setLinker(linker: Linker): void {
        this.linker = linker;
    }

    public getLinker(): Linker {
        return this.linker;
    }

    public init(container: HTMLDivElement): void {
        this.container = container;

        this.stage = new Konva.Stage({
            container: this.container,
            width: this.width,
            height: this.height,
            draggable: true,
        });

        let width = this.container.clientWidth;
        this.stage.width(width);

        this.layer = new Konva.Layer();
        this.linesLayer = new Konva.Layer();
        this.linker.setLinesLayer(this.linesLayer);
        this.stage.add(this.linesLayer);

        var scaleBy = 1.05;
        this.stage.on('wheel', (e) => {
            // stop default scrolling
            e.evt.preventDefault();

            var oldScale = (this.stage.scaleX()) ? this.stage.scaleX() : 1;
            var pointer = this.stage.getPointerPosition();

            var mousePointTo = {
                x: (pointer.x - this.stage.x()) / oldScale,
                y: (pointer.y - this.stage.y()) / oldScale,
            };

            // how to scale? Zoom in? Or zoom out?
            let direction = e.evt.deltaY > 0 ? 1 : -1;

            // when we zoom on trackpad, e.evt.ctrlKey is true
            // in that case lets revert direction
            if (e.evt.ctrlKey) {
                direction = -direction;
            }

            var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

            this.stage.scale({ x: newScale, y: newScale });

            var newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };
            this.stage.position(newPos);

            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.update({ scale: newScale, x: newPos.x, y: newPos.y });
            }, 500);
        });

        this.stage.on('click tap', (e) => {
            let pos = this.stage.getPointerPosition();
            console.log(this.stage.x());
            console.log(this.stage.scaleX());
            // let _scaleX = (this.stage.scaleX() == 0) ? 1 : this.stage.scaleX();
            // let _scaleY = (this.stage.scaleY() == 0) ? 1 : this.stage.scaleY();
            let coords = {
                x: (pos.x - this.stage.x()) / this.stage.scaleX(),
                y: (pos.y - this.stage.y()) / this.stage.scaleY(),
            };
            this.click(coords, e);
        });

        this.stage.on('dragend', (e) => {
            let pos = this.stage.position();
            this.update({ x: pos.x, y: pos.y });
        });

        this.stage.add(this.layer);
    }

    protected abstract click(coords: TCoordinates, e: any): void;

    protected abstract update(board: TBoard): void;

    public resizeStage(h?: number): void {
        let width = this.container.clientWidth;
        this.stage.width(width);
        let height = h || 600;
        this.stage.height(height);
    }

    protected debounce(func: any, wait: number, immediate: boolean) {
        let timeout: any;

        return function executedFunction() {
            const context = this;
            const args = arguments;

            const later = () => {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = null;
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        }.bind(this);
    };

    public getLinesLayer(): Konva.Layer {
        return this.linesLayer;
    }

    public getLayer(): Konva.Layer {
        return this.layer;
    }

    public loadSettings(settings: TBoard): void {
        if (settings.scale == 0) {
            settings.scale = 1.05;
        }
        this.stage.scale({ x: settings.scale, y: settings.scale });
        this.stage.x(settings.x);
        this.stage.y(settings.y);
        this.currentBoard = settings;
    }

    public clear(): void {
        this.stage.clear();
        this.layer.clear();
        this.linesLayer.clear();
        this.storage.clear();
        this.linker.clear();
    }

    // public loadNotes(notes:TNote[]): void
    // {
    //     for(let noteData of notes){
    //         let note = this.shapesFactory.createShape(1);
    //         note.init(noteData);
    //         note.load(noteData);
    //         this.storage.pushShape(note);
    //         note.addToLayer(this.layer);
    //     }
    //     for(let noteData of notes){
    //         for(let id of noteData.toLink){
    //             let from = this.storage.getById(noteData.id);
    //             let to = this.storage.getById(id);
    //             this.linker.linkShapes(from, to);
    //         }
    //     }
    //     this.linker.drawLines();
    // }

}