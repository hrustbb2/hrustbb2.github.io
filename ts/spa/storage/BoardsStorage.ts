import { Dexie, Table } from 'dexie';
import "dexie-export-import";
import { TBoard } from '../tree/types/TBoard';
import { LayersStorage } from './LayersStorage';
import { NotesLinksStorage } from './NotesLinksStorage';
import { NotesStorage } from './NotesStorage';

export class BoardsStorage {

    private db: Dexie;

    private layersStorage: LayersStorage;

    private notesLinksStorage: NotesLinksStorage;

    private notesStorage: NotesStorage;

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
                            let rr = r.rows[i]['$'];
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