import { Dexie, Table } from 'dexie';
import { TTag } from '../types/TTag';
import { TagsLinksStorage } from './TagsLinksStorage';

export class TagsStorage {

    private db: Dexie;

    private tagsLinksStorage: TagsLinksStorage;

    public setDb(db: Dexie): void {
        this.db = db;
    }

    public setTagsLinksStorage(storage: TagsLinksStorage): void {
        this.tagsLinksStorage = storage;
    }

    public async getTagsWithLinks(): Promise<any> {
        let table: Table = (<any>this.db).tags;
        let tags = await table.toArray();
        let links = await this.tagsLinksStorage.getList();

        links = links.reduce((acc: any, obj: any) => {
            const key = obj.from; // поле по которому группируем
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
        }, {});

        for (let i in tags) {
            let id = tags[i].id;
            tags[i]['links'] = links[id] || [];
        }

        return Promise.resolve(tags);
    }

    public getById(id: string): Promise<any> {
        let table: Table = (<any>this.db).tags;
        return table.where('id').equals(id).toArray();
    }

    public createTag(tag: TTag): Promise<any> {
        let table: Table = (<any>this.db).tags;
        return table.add(tag);
    }

    public updateTag(tag: TTag): Promise<any> {
        let table: Table = (<any>this.db).tags;
        return table.update(tag.id, tag);
    }

    public deleteTag(id: string): Promise<any> {
        this.tagsLinksStorage.deleteFor(id);
        let table: Table = (<any>this.db).tags;
        return table.where('id').equals(id).delete();
    }

}