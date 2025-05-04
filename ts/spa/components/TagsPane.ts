import { AbstractPane } from "../tree/components/AbstractPane";
import { AbstractShape } from "../tree/storage/AbstractShape";
import { TCoordinates } from "../tree/types/TCoordinates";
import { TBoard } from "../tree/types/TBoard";
import { AppComamnds } from "../commands/AppCommands";
import { AppBus } from "../bus/AppBus";
import { Tag } from "../Shapes/Tag";
import { TTag } from "../types/TTag";

export class TagsPane extends AbstractPane {

    private from: AbstractShape = null;

    private appCommands: AppComamnds;

    private waitDbClickNode: AbstractShape = null;

    private _isInited: boolean = false;

    public setAppCommands(commands: AppComamnds): void {
        this.appCommands = commands;
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

    protected click(coords: TCoordinates, e: any): void {
        let note = <Tag>(this.storage.getByCoords(coords));
        if (note && e.evt.ctrlKey) {
            if (this.from === null && note) {
                this.from = note;
                return;
            }
            if (this.from == note) {
                if (confirm('Удалить?')) {
                    this.appCommands.deleteTag(note.getId())
                        .then((resp: any) => {
                            if (resp.success) {
                                this.getStorage().remove(note);
                                note.remove();
                                this.linker.removeFor(note);
                            }
                        })
                }
            }
            if (this.from && note && !this.linker.isLinked(this.from, note)) {
                this.appCommands.linkTags(this.from.getId(), note.getId())
                    .then((resp: any) => {
                        if (resp.success) {
                            this.appBus.link(this.from.getId(), note.getId());
                            this.from = null;
                        }
                    });
            }
            if (this.from && note && this.linker.isLinked(this.from, note)) {
                this.appCommands.unlinkTags(this.from.getId(), note.getId())
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
            this.appCommands.createTag({
                id: 'tag_' + this.getRandomString(32),
                x: coords.x,
                y: coords.y,
                title: '',
            })
                .then((resp: any) => {
                    if (resp.success) {
                        this.appBus.addShape(2,
                            {
                                id: resp.tag.id,
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
        if (note == this.waitDbClickNode) {
            // (<AppBus>this.appBus).execNodeModal((<Rectangle>note).getData());
            let tagname = prompt('Тэг');
            let data: TTag = note.getData();
            if (tagname) {
                data.title = tagname;
                this.appCommands.updateTag(data)
                    .then((resp: any) => {
                        if (resp.success) {
                            note.load(data);
                        }
                    });
            }
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
        // this.appCommands.update(board);
    }

    public loadNotes(notes: any): void {
        for (let noteData of notes) {
            let note = this.shapesFactory.createShape(2);
            note.init(noteData);
            note.load(noteData);
            this.storage.pushShape(note);
            note.addToLayer(this.layer);
        }
    }

    public loadLinks(links: any): void {
        for (let link of links) {
            let from = this.storage.getById(link.from);
            let to = this.storage.getById(link.to);
            this.linker.linkShapes(from, to);
        }
        this.linker.drawLines();
    }

}