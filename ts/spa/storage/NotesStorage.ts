import { Dexie, Table } from 'dexie';
import { TNote } from '../types/TNote';
import { NotesLinksStorage } from './NotesLinksStorage';

export class NotesStorage {

    private db: Dexie;

    private notesLinksStorage: NotesLinksStorage;

    public setDb(db: Dexie): void {
        this.db = db;
    }

    public setNotesLinksStorage(storage: NotesLinksStorage): void {
        this.notesLinksStorage = storage;
    }

    public getNotes(boardId: string): Promise<any> {
        let table: Table = (<any>this.db).notes;
        return table.where('boardId').equals(boardId).toArray();
    }

    public createNote(note: TNote): Promise<any> {
        let table: Table = (<any>this.db).notes;
        return table.add(note);
    }

    public updateNote(note: TNote): Promise<any> {
        let table: Table = (<any>this.db).notes;
        return table.update(note.id, note);
    }

    public deleteNode(id: string): Promise<any> {
        this.notesLinksStorage.deleteFor(id);
        let table: Table = (<any>this.db).notes;
        return table.where('id').equals(id).delete();
    }

}