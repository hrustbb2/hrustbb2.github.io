import { Factory as AppFactory } from '../Factory';
import { AppComamnds } from './AppCommands';

export class Factory {

    private appFactory: AppFactory;

    private appCommands: AppComamnds;

    public setAppFactory(appFactory: AppFactory): void {
        this.appFactory = appFactory;
    }

    public getAppCommands(): AppComamnds {
        if (this.appCommands) {
            return this.appCommands;
        }
        this.appCommands = new AppComamnds();
        let boardsStorage = this.appFactory.getStorageFactory().getBoardsStorage();
        this.appCommands.setBoardsStorage(boardsStorage);
        let notesStorage = this.appFactory.getStorageFactory().getNotesStorage();
        this.appCommands.setNotesStorage(notesStorage);
        let notesLinksStorage = this.appFactory.getStorageFactory().getNotesLinksStorage();
        this.appCommands.setNotesLinksStorage(notesLinksStorage);
        let tagsStorage = this.appFactory.getStorageFactory().getTagsStorage();
        this.appCommands.setTagsStorage(tagsStorage);
        let tagsLinksStorage = this.appFactory.getStorageFactory().getTagsLinksStorage();
        this.appCommands.setTagsLinksStorage(tagsLinksStorage);
        let layersStorage = this.appFactory.getStorageFactory().getLayersStorage();
        this.appCommands.setLayersStorage(layersStorage);
        return this.appCommands;
    }

}