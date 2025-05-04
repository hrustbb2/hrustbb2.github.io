import { Dexie, Table } from 'dexie';
import { TLayer } from '../tree/types/TLayer';

export class LayersStorage {

    private db: Dexie;

    public setDb(db: Dexie): void {
        this.db = db;
    }

    public add(layer: TLayer): void {
        let table: Table = (<any>this.db).layers;
        table.add(layer);
    }

    public getList(boardId: string): Promise<any> {
        let table: Table = (<any>this.db).layers;
        return table.where('boardId').equals(boardId).toArray();
    }

    public update(layer: TLayer) {
        let table: Table = (<any>this.db).layers;
        table.update(layer.id, layer);
    }

    public create(boardId: string, name: string): Promise<any> {
        let table: Table = (<any>this.db).layers;
        return table.add({
            id: 'layer_' + this.getRandomString(32),
            boardId: boardId,
            name: name,
        });
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