import { Dexie, Table } from 'dexie';
import { TLink } from '../tree/types/TLink';

export class NotesLinksStorage {

    private db: Dexie;

    public setDb(db: Dexie): void {
        this.db = db;
    }

    public add(link: TLink): void {
        let table: Table = (<any>this.db).notesLinks;
        table.add(link);
    }

    public getList(boardId: string): Promise<any> {
        let table: Table = (<any>this.db).notesLinks;
        return table.where('boardId').equals(boardId).toArray();
    }

    public delete(id: string): Promise<any> {
        let table: Table = (<any>this.db).notesLinks;
        return table.where('id').equals(id).delete();
    }

    public deleteFor(id: string): void {
        let table: Table = (<any>this.db).notesLinks;
        table.where('from').equals(id).delete();
        table = (<any>this.db).notesLinks;
        table.where('to').equals(id).delete();
    }

    public link(from: string, to: string, layerId: string, boardId: string): Promise<any> {
        let table: Table = (<any>this.db).notesLinks;
        return table.add({
            id: 'link_' + this.getRandomString(32),
            boardId: boardId,
            layerId: layerId,
            from: from,
            to: to,
        });
    }

    public unlink(from: string, to: string, layerId: string): Promise<any> {
        let table: Table = (<any>this.db).notesLinks;
        return table.where('from').equals(from).and(link => link.to == to).and(link => link.layerId == layerId).delete();
    }

    private getRandomString(length: number) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

}