import { Factory as AppFactory } from '../Factory';
import { Dexie } from 'dexie';
import { BoardsStorage } from './BoardsStorage';
import { LayersStorage } from './LayersStorage';
import { NotesLinksStorage } from './NotesLinksStorage';
import { NotesStorage } from './NotesStorage';
import { TagsLinksStorage } from './TagsLinksStorage';
import { TagsStorage } from './TagsStorage';

export class Factory {

    private appFactory: AppFactory;

    private db: Dexie;

    private boardsStorage: BoardsStorage;

    private layersStorage: LayersStorage;

    private notesLinksStorage: NotesLinksStorage;

    private notesStorage: NotesStorage;

    private tagsLinksStorage: TagsLinksStorage;

    private tagsStorage: TagsStorage;

    public setAppFactory(factory: AppFactory): void {
        this.appFactory = factory;
    }

    private isInited: boolean = false;

    public init(): void {
        this.db = new Dexie('boards');
        this.db.version(1).stores({
            boards: 'id,title,scale,x,y',
            layers: 'id,boardId,name',
            notesLinks: 'id,boardId,layerId,from,to',
            notes: 'id,boardId,x,y,preview,content,isCrypted,tags,createdAt,updatedAt',
            tagsLinks: 'id,from,to',
            tags: 'id,x,y,title',
        });
        this.db.open().then(() => {
            this.isInited = true;
        });
    }

    public getBoardsStorage(): BoardsStorage {
        if (this.boardsStorage) {
            return this.boardsStorage;
        }
        this.boardsStorage = new BoardsStorage();
        this.boardsStorage.setDb(this.db);
        let ls = this.getLayersStorage();
        this.boardsStorage.setLayersStorage(ls);
        let nl = this.getNotesLinksStorage();
        this.boardsStorage.setNotesLinksStorage(nl);
        let ns = this.getNotesStorage();
        this.boardsStorage.setNotesStorage(ns);
        let ts = this.getTagsStorage();
        this.boardsStorage.setTagsStorage(ts);
        return this.boardsStorage;
    }

    public getLayersStorage(): LayersStorage {
        if (this.layersStorage) {
            return this.layersStorage;
        }
        this.layersStorage = new LayersStorage();
        this.layersStorage.setDb(this.db);
        let nl = this.getNotesLinksStorage();
        this.layersStorage.setNotesLinksStorage(nl);
        return this.layersStorage;
    }

    public getNotesLinksStorage(): NotesLinksStorage {
        if (this.notesLinksStorage) {
            return this.notesLinksStorage;
        }
        this.notesLinksStorage = new NotesLinksStorage();
        this.notesLinksStorage.setDb(this.db);
        return this.notesLinksStorage;
    }

    public getNotesStorage(): NotesStorage {
        if (this.notesStorage) {
            return this.notesStorage;
        }
        this.notesStorage = new NotesStorage();
        this.notesStorage.setDb(this.db);
        let ls = this.getNotesLinksStorage();
        this.notesStorage.setNotesLinksStorage(ls);
        return this.notesStorage;
    }

    public getTagsLinksStorage(): TagsLinksStorage {
        if (this.tagsLinksStorage) {
            return this.tagsLinksStorage;
        }
        this.tagsLinksStorage = new TagsLinksStorage();
        this.tagsLinksStorage.setDb(this.db);
        return this.tagsLinksStorage;
    }

    public getTagsStorage(): TagsStorage {
        if (this.tagsStorage) {
            return this.tagsStorage;
        }
        this.tagsStorage = new TagsStorage();
        this.tagsStorage.setDb(this.db);
        let tl = this.getTagsLinksStorage();
        this.tagsStorage.setTagsLinksStorage(tl);
        return this.tagsStorage;
    }

}