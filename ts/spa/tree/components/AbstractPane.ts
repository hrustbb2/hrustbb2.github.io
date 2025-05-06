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

    protected longPressTimeout: any;

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
        // Konva.pixelRatio = window.devicePixelRatio || 1;
        Konva.pixelRatio = 1;
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

        let scaleBy = 1.05;

        let lastCenter: any = null;
        let lastDist = 0;
        let dragStopped = false;

        Konva.hitOnDragEnabled = true;

        // https://konvajs.org/docs/sandbox/Multi-touch_Scale_Stage.html
        this.stage.on('touchmove', (e) => {
            e.evt.preventDefault();
            if (this.longPressTimeout) {
                clearTimeout(this.longPressTimeout);
                this.longPressTimeout = null;
            }

            const touch1 = e.evt.touches[0];
            const touch2 = e.evt.touches[1];

            // we need to restore dragging, if it was cancelled by multi-touch
            if (touch1 && !touch2 && !this.stage.isDragging() && dragStopped) {
                this.stage.startDrag();
                dragStopped = false;
            }

            if (touch1 && touch2) {
                // if the stage was under Konva's drag&drop
                // we need to stop it, and implement our own pan logic with two pointers
                if (this.stage.isDragging()) {
                    dragStopped = true;
                    this.stage.stopDrag();
                }

                const p1 = {
                    x: touch1.clientX,
                    y: touch1.clientY,
                };
                const p2 = {
                    x: touch2.clientX,
                    y: touch2.clientY,
                };

                if (!lastCenter) {
                    lastCenter = this.getCenter(p1, p2);
                    return;
                }
                const newCenter = this.getCenter(p1, p2);

                const dist = this.getDistance(p1, p2);

                if (!lastDist) {
                    lastDist = dist;
                }

                // local coordinates of center point
                const pointTo = {
                    x: (newCenter.x - this.stage.x()) / this.stage.scaleX(),
                    y: (newCenter.y - this.stage.y()) / this.stage.scaleX(),
                };

                const scale = this.stage.scaleX() * (dist / lastDist);

                this.stage.scaleX(scale);
                this.stage.scaleY(scale);

                // calculate new position of the stage
                const dx = newCenter.x - lastCenter.x;
                const dy = newCenter.y - lastCenter.y;

                const newPos = {
                    x: newCenter.x - pointTo.x * scale + dx,
                    y: newCenter.y - pointTo.y * scale + dy,
                };

                this.stage.position(newPos);

                lastDist = dist;
                lastCenter = newCenter;

                if (this.timeout) {
                    clearTimeout(this.timeout);
                }
                this.timeout = setTimeout(() => {
                    this.update({ scale: scale, x: newPos.x, y: newPos.y });
                    this.timeout = null;
                }, 500);
            }
        });

        this.stage.on('touchend', () => {
            lastDist = 0;
            lastCenter = null;
            if (this.longPressTimeout) {
                clearTimeout(this.longPressTimeout);
                this.longPressTimeout = null;
            }
        });

        this.stage.on('touchstart', (e) => {
            let pos = this.stage.getPointerPosition();
            let coords = {
                x: (pos.x - this.stage.x()) / this.stage.scaleX(),
                y: (pos.y - this.stage.y()) / this.stage.scaleY(),
            };
            let note = this.storage.getByCoords(coords);
            if (!note) {
                return;
            }
            this.longPressTimeout = setTimeout(() => {
                // Длительное нажатие выполнено
                navigator.vibrate(200);
                this.longTouch(coords, e);
            }, 800); // время в миллисекундах, например 800мс
        });

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

        let ev = 'click';
        if (this.isMobile()) {
            ev = 'tap';
        }
        this.stage.on(ev, (e) => {
            let pos = this.stage.getPointerPosition();
            console.log(this.stage.x());
            console.log(this.stage.scaleX());
            let coords = {
                x: (pos.x - this.stage.x()) / this.stage.scaleX(),
                y: (pos.y - this.stage.y()) / this.stage.scaleY(),
            };
            this.click(coords, e);

            if (this.longPressTimeout) {
                clearTimeout(this.longPressTimeout);
                this.longPressTimeout = null;
            }
        });

        this.stage.on('dragend', (e) => {
            let pos = this.stage.position();
            this.update({ x: pos.x, y: pos.y });
        });

        this.stage.add(this.layer);
    }

    protected isMobile() {
        var check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || (<any>window).opera);
        return check;
    };

    private getDistance(p1: any, p2: any) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

    private getCenter(p1: any, p2: any) {
        return {
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2,
        };
    }

    protected abstract click(coords: TCoordinates, e: any): void;

    protected abstract longTouch(coords: TCoordinates, e: any): void;

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
        this.layer.children = [];
        this.linesLayer.clear();
        this.linesLayer.children = [];
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