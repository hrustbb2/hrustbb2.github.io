import { AbstractPane } from "../tree/components/AbstractPane";
import { AbstractShape } from "../tree/storage/AbstractShape";
import { TCoordinates } from "../tree/types/TCoordinates";
import { TBoard } from "../tree/types/TBoard";
import { AppComamnds } from "../commands/AppCommands";
import { AppBus } from "../bus/AppBus";
import { Rectangle } from "../Shapes/Rectangle";
import { Linker } from "../tree/components/Linker";

export class Pane extends AbstractPane {

    private from: AbstractShape = null;

    private appCommands: AppComamnds;

    private waitDbClickNode: AbstractShape = null;

    private _isInited: boolean = false;

    protected currentLayerTag: string;

    public setAppCommands(commands: AppComamnds): void {
        this.appCommands = commands;
    }

    public setCurrentLayerTag(lt: string): void {
        this.currentLayerTag = lt;
        if (this.getLinker()) {
            this.getLinker().setCurrentLayerTag(this.currentLayerTag);
        }
    }

    public setLinker(linker: Linker): void {
        super.setLinker(linker);
        this.getLinker().setCurrentLayerTag(this.currentLayerTag);
    }

    public onResize(): void {
        this.stage.width(this.width);
        this.stage.height(this.height);
    }

    public isInited(): boolean {
        return this._isInited;
    }

    public init(container: HTMLDivElement): void {
        if (this._isInited) {
            return;
        }
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        super.init(container);
        this._isInited = true;
    }

    protected longTouch(coords: TCoordinates, e: any): void {
        let note = this.storage.getByCoords(coords);
        if (this.from === null && note) {
            this.from = note;
            return;
        }
        if (this.from == note) {
            if (confirm('Удалить?')) {
                this.appCommands.deleteNode(note.getId())
                    .then((resp: any) => {
                        if (resp.success) {
                            this.getStorage().remove(note);
                            note.remove();
                            this.linker.removeFor(note);
                        }
                    })
            }
            this.from = null;
            return;
        }
        if (this.from && note && !this.linker.isLinked(this.from, note)) {
            this.appCommands.link(this.from.getId(), note.getId(), this.currentLayerTag, this.currentBoard.id)
                .then((resp: any) => {
                    if (resp.success) {
                        this.appBus.link(this.from.getId(), note.getId());
                        this.from = null;
                    }
                });
            this.from = null;
            return;
        }
        if (this.from && note && this.linker.isLinked(this.from, note)) {
            this.appCommands.unlink(this.from.getId(), note.getId(), this.currentLayerTag)
                .then((resp: any) => {
                    if (resp.success) {
                        this.appBus.unlink(this.from, note);
                        this.from = null;
                    }
                });
            this.from = null;
            return;
        }
    }

    protected click(coords: TCoordinates, e: any): void {
        let note = this.storage.getByCoords(coords);
        if (note && e.evt.ctrlKey) {
            if (this.from === null && note) {
                this.from = note;
                return;
            }
            if (this.from == note) {
                if (confirm('Удалить?')) {
                    this.appCommands.deleteNode(note.getId())
                        .then((resp: any) => {
                            if (resp.success) {
                                this.getStorage().remove(note);
                                note.remove();
                                this.linker.removeFor(note);
                            }
                        })
                }
                this.from = null;
                return;
            }
            if (this.from && note && !this.linker.isLinked(this.from, note)) {
                this.appCommands.link(this.from.getId(), note.getId(), this.currentLayerTag, this.currentBoard.id)
                    .then((resp: any) => {
                        if (resp.success) {
                            this.appBus.link(this.from.getId(), note.getId());
                            this.from = null;
                        }
                    });
                return;
            }
            if (this.from && note && this.linker.isLinked(this.from, note)) {
                this.appCommands.unlink(this.from.getId(), note.getId(), this.currentLayerTag)
                    .then((resp: any) => {
                        if (resp.success) {
                            this.appBus.unlink(this.from, note);
                            this.from = null;
                        }
                    });
            }
            return;
        }
        if (!note) {
            let nodes = this.getStorage().getShapes();
            for (let i in nodes) {
                let node = <Rectangle>nodes[i];
                node.higlight(false);
            }
            this.appCommands.createNote({
                id: 'note_' + this.getRandomString(32),
                boardId: this.currentBoard.id,
                x: coords.x,
                y: coords.y,
            })
                .then((resp: any) => {
                    if (resp.success) {
                        this.appBus.addShape(1,
                            {
                                id: resp.note.id,
                                x: coords.x,
                                y: coords.y,
                            });
                    }
                });
            return;
        }
        if (note) {
            // let data = (<Rectangle>note).getData();
            // (<AppBus>this.appBus).onNodeClick(data);
            this.linker.highlightFor(note);
            this.linker.drawLines();
        }
        if (note && !this.waitDbClickNode) {
            this.waitDbClickNode = note;
            setTimeout(() => {
                this.waitDbClickNode = null;
            }, 200);
            return;
        }
        if (note && note == this.waitDbClickNode) {
            (<AppBus>this.appBus).execNodeModal((<Rectangle>note).getData());
            this.waitDbClickNode = null;
        }
    }

    private getRandomString(length: number) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    protected update(board: TBoard): void {
        board.id = this.currentBoard.id;
        this.appCommands.update(board);
    }

    public loadNotes(notes: any): void {
        for (let noteData of notes) {
            let note = this.shapesFactory.createShape(1);
            note.init(noteData);
            note.load(noteData);
            this.storage.pushShape(note);
            note.addToLayer(this.layer);
        }
    }

    public loadLinks(links: any): void {
        this.linker.clear();
        for (let link of links) {
            let from = this.storage.getById(link.from);
            let to = this.storage.getById(link.to);
            let layerId = link.layerId;
            if (!from || !to || !layerId) {
                continue;
            }
            this.linker.linkShapes(from, to, layerId);
        }
        this.linker.drawLines();
    }

}