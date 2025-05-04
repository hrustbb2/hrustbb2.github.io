import { Dexie, Table } from 'dexie';
import { TTag } from '../types/TTag';

export class TagsLinksStorage {

    private db: Dexie;

    public setDb(db: Dexie): void {
        this.db = db;
    }

    public getList(): Promise<any> {
        let table: Table = (<any>this.db).tagsLinks;
        return table.toArray();
    }

    public link(from: string, to: string): Promise<any> {
        let table: Table = (<any>this.db).tagsLinks;
        return table.add({
            id: 'link_' + this.getRandomString(32),
            from: from,
            to: to,
        })
    }

    public unlink(from: string, to: string): Promise<any> {
        let table: Table = (<any>this.db).tagsLinks;
        return table.where('from').equals(from).and(link => link.to == to).delete();
    }

    private getRandomString(length: number) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    public deleteFor(id: string): void {
        let table: Table = (<any>this.db).tagsLinks;
        table.where('from').equals(id).delete();
        table = (<any>this.db).tagsLinks;
        table.where('to').equals(id).delete();
    }
}