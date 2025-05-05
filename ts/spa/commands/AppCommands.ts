import axios from 'axios';
import { TBoard } from '../tree/types/TBoard';
// import { TSettings } from '../types/TSettings';
import { BoardsStorage } from '../storage/BoardsStorage';
import { NotesStorage } from '../storage/NotesStorage';
import { NotesLinksStorage } from '../storage/NotesLinksStorage';
import { TagsStorage } from '../storage/TagsStorage';
import { TagsLinksStorage } from '../storage/TagsLinksStorage';
import { LayersStorage } from '../storage/LayersStorage';
import { TNote } from '../types/TNote';
import { TTag } from '../types/TTag';

// declare let settings: TSettings;

export class AppComamnds {

    private boardsStorage: BoardsStorage;

    private notesStorage: NotesStorage;

    private notesLinksStorage: NotesLinksStorage;

    private tagsStorage: TagsStorage;

    private tagsLinksStorage: TagsLinksStorage;

    private layersStorage: LayersStorage;

    public setBoardsStorage(storage: BoardsStorage): void {
        this.boardsStorage = storage;
    }

    public setNotesStorage(storage: NotesStorage): void {
        this.notesStorage = storage;
    }

    public setNotesLinksStorage(storage: NotesLinksStorage): void {
        this.notesLinksStorage = storage;
    }

    public setTagsStorage(storage: TagsStorage): void {
        this.tagsStorage = storage;
    }

    public setTagsLinksStorage(storage: TagsLinksStorage): void {
        this.tagsLinksStorage = storage;
    }

    public setLayersStorage(storage: LayersStorage): void {
        this.layersStorage = storage;
    }

    public update(data: TBoard): Promise<any> {
        // data.id = settings.currentBoard.id;

        return this.boardsStorage.update(data)
            .then(() => {
                return Promise.resolve(data);
            });

        // return axios.post(
        //     this.domain + '/update-board',
        //     data
        // ).then((resp: any) => {
        //     return Promise.resolve(resp.data);
        // })
        //     .catch((error: any) => {
        //         return Promise.reject(error.response.data);
        //     });
    }

    public deleteBoard(id: string): Promise<any> {
        return this.boardsStorage.delete(id)
            .then(() => {
                return Promise.resolve({
                    success: true,
                    errors: [],
                });
            });
    }

    public createNote(note: TNote): Promise<any> {
        return this.notesStorage.createNote(note)
            .then(() => {
                return Promise.resolve({
                    success: true,
                    errors: [],
                    note: note,
                });
            });

        // return axios.post(
        //     this.domain + '/create-note',
        //     {
        //         board_id: settings.currentBoard.id,
        //         x: x,
        //         y: y,
        //     }
        // ).then((resp: any) => {
        //     return Promise.resolve(resp.data);
        // })
        //     .catch((error: any) => {
        //         return Promise.reject(error.response.data);
        //     });
    }

    public updateNote(note: TNote): Promise<any> {
        return this.notesStorage.updateNote(note)
            .then(() => {
                return Promise.resolve({
                    success: true,
                    errors: [],
                    note: note,
                });
            });


        // return axios.post(
        //     this.domain + '/update-node',
        //     {
        //         id: id,
        //         preview: preview,
        //         content: content,
        //         tags: tags,
        //         is_crypted: isCrypted,
        //     }
        // ).then((resp: any) => {
        //     return Promise.resolve(resp.data);
        // })
        //     .catch((error: any) => {
        //         return Promise.reject(error.response.data);
        //     });
    }

    public getBoard(boardId: string): Promise<any> {
        return this.boardsStorage.getById(boardId)
            .then((resp: any) => {
                return Promise.resolve({
                    success: true,
                    errors: [],
                    board: resp,
                });
            });

        // return axios.get(
        //     this.domain + '/get-board?board-id=' + settings.currentBoard.id
        // ).then((resp: any) => {
        //     return Promise.resolve(resp.data);
        // })
        //     .catch((error: any) => {
        //         return Promise.reject(error.response.data);
        //     });
    }

    public getNotes(boardId: string): Promise<any> {

        return this.notesStorage.getNotes(boardId)
            .then((resp: any) => {
                return Promise.resolve({
                    success: true,
                    errors: [],
                    notes: resp
                });
            });

        // return axios.get(
        //     this.domain + '/get-nodes?board-id=' + settings.currentBoard.id
        // ).then((resp: any) => {
        //     return Promise.resolve(resp.data);
        // })
        //     .catch((error: any) => {
        //         return Promise.reject(error.response.data);
        //     });
    }

    public link(from: string, to: string, layerId: string, boardId: string): Promise<any> {
        return this.notesLinksStorage.link(from, to, layerId, boardId)
            .then(() => {
                return Promise.resolve({
                    success: true,
                    errors: [],
                });
            })

        // return axios.post(
        //     this.domain + '/link',
        //     {
        //         from: from,
        //         to: to,
        //         layer_id: layerId
        //     }
        // ).then((resp: any) => {
        //     return Promise.resolve(resp.data);
        // })
        //     .catch((error: any) => {
        //         return Promise.reject(error.response.data);
        //     });
    }

    public unlink(from: string, to: string, layerId: string): Promise<any> {
        return this.notesLinksStorage.unlink(from, to, layerId)
            .then(() => {
                return Promise.resolve({
                    success: true,
                    errors: [],
                });
            })

        // return axios.post(
        //     this.domain + '/unlink',
        //     {
        //         from: from,
        //         to: to,
        //         layer_id: layerId
        //     }
        // ).then((resp: any) => {
        //     return Promise.resolve(resp.data);
        // })
        //     .catch((error: any) => {
        //         return Promise.reject(error.response.data);
        //     });
    }

    public getLinks(boardId: string): Promise<any> {
        return this.notesLinksStorage.getList(boardId)
            .then((resp: any) => {
                return Promise.resolve({
                    success: true,
                    errors: [],
                    links: resp
                });
            });


        // return axios.get(
        //     this.domain + '/get-links?board-id=' + settings.currentBoard.id
        // ).then((resp: any) => {
        //     return Promise.resolve(resp.data);
        // })
        //     .catch((error: any) => {
        //         return Promise.reject(error.response.data);
        //     });
    }

    public moveNode(id: string, x: number, y: number): Promise<any> {
        return this.notesStorage.updateNote({
            id: id,
            x: x,
            y: y,
        }).then(() => {
            return Promise.resolve({
                success: true,
                errors: [],
            });
        })

        // return axios.post(
        //     this.domain + '/move-node',
        //     {
        //         id: id,
        //         x: x,
        //         y: y,
        //     }
        // ).then((resp: any) => {
        //     return Promise.resolve(resp.data);
        // })
        //     .catch((error: any) => {
        //         return Promise.reject(error.response.data);
        //     });
    }

    public deleteNode(id: string): Promise<any> {
        return this.notesStorage.deleteNode(id)
            .then(() => {
                return Promise.resolve({
                    success: true,
                    errors: [],
                });
            });

        // return axios.post(
        //     this.domain + '/delete-node',
        //     {
        //         id: id,
        //     }
        // ).then((resp: any) => {
        //     return Promise.resolve(resp.data);
        // })
        //     .catch((error: any) => {
        //         return Promise.reject(error.response.data);
        //     });
    }



    public createTag(tag: TTag): Promise<any> {
        return this.tagsStorage.createTag(tag)
            .then(() => {
                return Promise.resolve({
                    success: true,
                    errors: [],
                    tag: tag,
                });
            });

        // return axios.post(
        //     this.domain + '/create-tag',
        //     {
        //         x: x,
        //         y: y,
        //     }
        // ).then((resp: any) => {
        //     return Promise.resolve(resp.data);
        // })
        //     .catch((error: any) => {
        //         return Promise.reject(error.response.data);
        //     });
    }

    public updateTag(tag: TTag): Promise<any> {
        return this.tagsStorage.updateTag(tag)
            .then(() => {
                return Promise.resolve({
                    success: true,
                    errors: [],
                    tag: tag,
                });
            });

        // return axios.post(
        //     this.domain + '/update-tag',
        //     {
        //         id: id,
        //         title: title,
        //     }
        // ).then((resp: any) => {
        //     return Promise.resolve(resp.data);
        // })
        //     .catch((error: any) => {
        //         return Promise.reject(error.response.data);
        //     });
    }

    public getTags(): Promise<any> {
        return this.tagsStorage.getTagsWithLinks()
            .then((resp: any) => {
                return Promise.resolve({
                    success: true,
                    errors: [],
                    tags: resp,
                });
            })

        // return axios.get(
        //     this.domain + '/get-tags'
        // ).then((resp: any) => {
        //     return Promise.resolve(resp.data);
        // })
        //     .catch((error: any) => {
        //         return Promise.reject(error.response.data);
        //     });
    }

    public moveTag(id: string, x: number, y: number): Promise<any> {
        return this.tagsStorage.updateTag({
            id: id,
            x: x,
            y: y,
        }).then((resp: any) => {
            return Promise.resolve({
                success: true,
                errors: [],
                tags: resp,
            });
        })

        // return axios.post(
        //     this.domain + '/move-tag',
        //     {
        //         id: id,
        //         x: x,
        //         y: y,
        //     }
        // ).then((resp: any) => {
        //     return Promise.resolve(resp.data);
        // })
        //     .catch((error: any) => {
        //         return Promise.reject(error.response.data);
        //     });
    }

    public linkTags(from: string, to: string): Promise<any> {
        return this.tagsLinksStorage.link(from, to)
            .then((resp: any) => {
                return Promise.resolve({
                    success: true,
                    errors: [],
                    link: {
                        id: resp,
                        from: from,
                        to: to,
                    },
                });
            })

        // return axios.post(
        //     this.domain + '/tag-link',
        //     {
        //         from: from,
        //         to: to,
        //     }
        // ).then((resp: any) => {
        //     return Promise.resolve(resp.data);
        // })
        //     .catch((error: any) => {
        //         return Promise.reject(error.response.data);
        //     });
    }

    public unlinkTags(from: string, to: string): Promise<any> {
        return this.tagsLinksStorage.unlink(from, to)
            .then(() => {
                return Promise.resolve({
                    success: true,
                    errors: [],
                });
            })

        // return axios.post(
        //     this.domain + '/tag-unlink',
        //     {
        //         from: from,
        //         to: to,
        //     }
        // ).then((resp: any) => {
        //     return Promise.resolve(resp.data);
        // })
        //     .catch((error: any) => {
        //         return Promise.reject(error.response.data);
        //     });
    }

    public getTagsLinks(): Promise<any> {
        return this.tagsLinksStorage.getList()
            .then((resp: any) => {
                return Promise.resolve({
                    success: true,
                    errors: [],
                    links: resp
                })
            })

        // return axios.get(
        //     this.domain + '/tag-get-links'
        // ).then((resp: any) => {
        //     return Promise.resolve(resp.data);
        // })
        //     .catch((error: any) => {
        //         return Promise.reject(error.response.data);
        //     });
    }

    public deleteTag(id: string): Promise<any> {
        return this.tagsStorage.deleteTag(id)
            .then((resp: any) => {
                return Promise.resolve({
                    success: true,
                    errors: [],
                })
            })

        // return axios.post(
        //     this.domain + '/delete-tag',
        //     {
        //         id: id,
        //     }
        // ).then((resp: any) => {
        //     return Promise.resolve(resp.data);
        // })
        //     .catch((error: any) => {
        //         return Promise.reject(error.response.data);
        //     });
    }

    // public getTagsBrach(id: string): Promise<any> {
    //     return axios.post(
    //         this.domain + '/get-branch-tags',
    //         {
    //             id: id,
    //         }
    //     ).then((resp: any) => {
    //         return Promise.resolve(resp.data);
    //     })
    //         .catch((error: any) => {
    //             return Promise.reject(error.response.data);
    //         });
    // }

    public getTagsWithLinks(): Promise<any> {
        return this.tagsStorage.getTagsWithLinks()
            .then((resp: any) => {
                return Promise.resolve({
                    success: true,
                    errors: [],
                    tags: resp
                });
            });

        // return axios.post(
        //     this.domain + '/get-tags-with-links',
        // ).then((resp: any) => {
        //     return Promise.resolve(resp.data);
        // })
        //     .catch((error: any) => {
        //         return Promise.reject(error.response.data);
        //     });
    }

    public createLayer(boardId: string, name: string): Promise<any> {
        return this.layersStorage.create(boardId, name)
            .then((resp: any) => {
                return Promise.resolve({
                    success: true,
                    errors: [],
                    layer: {
                        id: resp,
                        name: name,
                    }
                });
            });

        // return axios.post(
        //     this.domain + '/create-layer',
        //     {
        //         board_id: boardId,
        //         name: name,
        //     }
        // ).then((resp: any) => {
        //     return Promise.resolve(resp.data);
        // })
        //     .catch((error: any) => {
        //         return Promise.reject(error.response.data);
        //     });
    }

    public deleteLayer(id: string): Promise<any> {
        return this.layersStorage.delete(id)
            .then((resp: any) => {
                return Promise.resolve({
                    success: true,
                    errors: [],
                });
            });
    }

    public getLayers(boardId: string): Promise<any> {
        return this.layersStorage.getList(boardId)
            .then((layers: any) => {
                return Promise.resolve({
                    success: true,
                    errors: [],
                    layers: layers,
                });
            });

        // return axios.post(
        //     this.domain + '/get-layers',
        //     {
        //         board_id: boardId,
        //     }
        // ).then((resp: any) => {
        //     return Promise.resolve(resp.data);
        // })
        //     .catch((error: any) => {
        //         return Promise.reject(error.response.data);
        //     });
    }
}