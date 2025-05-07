import { Dexie, Table } from 'dexie';
import "dexie-export-import";
import { TBoard } from '../tree/types/TBoard';
import { LayersStorage } from './LayersStorage';
import { NotesLinksStorage } from './NotesLinksStorage';
import { NotesStorage } from './NotesStorage';
import { TagsStorage } from './TagsStorage';
import { TagsLinksStorage } from './TagsLinksStorage';

export class BoardsStorage {

    private db: Dexie;

    private layersStorage: LayersStorage;

    private notesLinksStorage: NotesLinksStorage;

    private notesStorage: NotesStorage;

    private tagsStorage: TagsStorage;

    private tagsLinksStorage: TagsLinksStorage;

    public setDb(db: Dexie): void {
        this.db = db;
    }

    public setLayersStorage(storage: LayersStorage): void {
        this.layersStorage = storage;
    }

    public setNotesLinksStorage(storage: NotesLinksStorage): void {
        this.notesLinksStorage = storage;
    }

    public setNotesStorage(storage: NotesStorage): void {
        this.notesStorage = storage;
    }

    public setTagsStorage(storage:TagsStorage): void
    {
        this.tagsStorage = storage;
    }

    public setTagsLinksStorage(storage:TagsLinksStorage): void
    {
        this.tagsLinksStorage = storage;
    }

    public add(board: TBoard): void {
        let table: Table = (<any>this.db).boards;
        table.add(board);
    }

    public getById(boardId: string): Promise<any> {
        let table: Table = (<any>this.db).boards;
        return table.where('id').equals(boardId).toArray();
    }

    public getList(): Promise<any> {
        let table: Table = (<any>this.db).boards;
        return table.toArray();
    }

    public update(board: TBoard): Promise<any> {
        let table: Table = (<any>this.db).boards;
        return table.update(board.id, board);
    }

    public async exportBoard(boardId:string): Promise<any>
    {
        let boardData = await this.getById(boardId);
        boardData = boardData[0];
        let layers = await this.layersStorage.getList(boardId);
        let nodes = await this.notesStorage.getNotes(boardId);
        let notesLinks = await this.notesLinksStorage.getList(boardId);
        let tags:any = {};
        let allTags = await this.tagsStorage.getTagsWithLinks();
        for(let note of nodes){
            let noteTags = note.tags || [];
            for(let tag of noteTags){
                tags[tag.id] = tag;
            }
        }

        let data = {
            board: boardData,
            layers: layers,
            notes: nodes,
            notesLinks: notesLinks,
            tags: tags,
        }
        let jsonString = JSON.stringify(data);
        const blob = new Blob([jsonString], { type: 'application/json' });
        // const file = new File([blob], boardData.title + '-database-export.json', { type: 'application/json' });

        // if (navigator.canShare && navigator.canShare({ files: [file] })) {
        //     navigator.share({
        //       files: [file],
        //       title: 'Поделиться файлом',
        //       text: 'Вот мой файл для вас'
        //     }).then(() => {
        //       console.log('Успешно поделились файлом');
        //     }).catch((error) => {
        //       console.error('Ошибка при обмене файлом', error);
        //     });
        // } else {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = boardData.title + '-database-export.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        // }
    }

    public async importBoard(file: File): Promise<any> {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            try {
                const jsonData = JSON.parse(e.target.result);
                this.add(jsonData.board);
                for(let i in jsonData.layers){
                    this.layersStorage.add(jsonData.layers[i]);
                }
                for(let i in jsonData.notes){
                    this.notesStorage.createNote(jsonData.notes[i]);
                }
                for(let i in jsonData.notesLinks){
                    this.notesLinksStorage.add(jsonData.notesLinks[i]);
                }
                let y = 10;
                for(let i in jsonData.tags){
                    this.tagsStorage.createTag({
                        id: jsonData.tags[i].id,
                        x: 10,
                        y: y,
                        title: jsonData.tags[i].title,
                    });
                    y = y + 80;
                }
            }catch (err) {
                console.error('Некорректный формат файла:', err);
            }
        }
        reader.readAsText(file);
    }

    public export(): void {
        this.db.export()
            .then(data => {
                // Создаем Blob из JSON данных
                // const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                // Создаем ссылку для скачивания
                const url = URL.createObjectURL(data);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'database-export.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
    }

    public import(file: File): void {
        // inputFile.addEventListener('change', (event) => {
        //     const file = event.target.files[0];

        const reader = new FileReader();

        reader.onload = (e: any) => {
            try {
                const jsonData = JSON.parse(e.target.result);
                const data = jsonData.data.data;
                console.log(data);
                for (let r of data) {
                    let table = r.tableName;
                    if (table == 'notes') {
                        for (let i in r.rows) {
                            let rr = r.rows[i];
                            delete rr['$types'];
                            (<any>this.db)[table].add({
                                id: rr.id,
                            });
                            (<any>this.db)[table].update(rr.id, rr);
                        }
                        continue;
                    }
                    (<any>this.db)[table].bulkAdd(r.rows);
                }

                // Импортируем данные в базу данных
                // this.db.import(jsonData)
                //     .then(() => {
                //         console.log('Данные успешно импортированы');
                //     })
                //     .catch(error => {
                //         console.error('Ошибка при импорте данных:', error);
                //     });
            } catch (err) {
                console.error('Некорректный формат файла:', err);
            }
        };
        reader.readAsText(file);
    }

    public delete(id: string): Promise<any> {
        this.layersStorage.deleteForBoard(id);
        this.notesLinksStorage.deleteForBoard(id);
        this.notesStorage.deleteForBoard(id);
        let table: Table = (<any>this.db).boards;
        return table.where('id').equals(id).delete();
    }

}