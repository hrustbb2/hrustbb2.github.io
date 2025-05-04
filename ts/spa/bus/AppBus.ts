import { AppBus as Base } from "../tree/bus/AppBus";
import { Factory as ComponentsFactory } from "../components/Factory";
// import { TSettings } from "../types/TSettings";
import { Pane } from "../components/Pane";
import { TBoard } from "../tree/types/TBoard";
import { Factory as StorageFactory } from "../storage/Factory";

// declare let settings: TSettings;

export class AppBus extends Base {

    private componentsFactory2: ComponentsFactory;

    private storageFactory: StorageFactory;

    public setComponentsFactory2(factory: ComponentsFactory): void {
        this.componentsFactory2 = factory;
    }

    public setStorageFactory(storage: StorageFactory): void {
        this.storageFactory = storage;
    }

    public onNodeClick(data: any): void {
        // this.componentsFactory2.getAppContainer().getNodeForm().load(data);
    }

    public onNodeUpdate(data: any): void {
        this.componentsFactory2.getAppContainer().updateNode(data);
    }

    public execNodeModal(data: any): void {
        let modal = this.componentsFactory2.getNodeModal();
        let tl = this.componentsFactory2.getAppContainer().getTagsLinks();
        modal.setTagsLinks(tl);
        modal.show(data);
    }

    // public execBoardsModal(): void {
    //     let modal = this.componentsFactory2.getBoardsModal();
    //     modal.show();
    // }

    public highligtForTag(tagId: string): void {
        this.componentsFactory2.getAppContainer().highlightForTagId(tagId);
    }

    public highligtNote(noteId: string): void {
        this.componentsFactory2.getAppContainer().highligtNote(noteId);
    }

    public setCurrentLayer(layer: string): void {
        // settings.currentLayerId = layer;
        (<Pane>this.componentsFactory.getPane()).setCurrentLayerTag(layer);
    }

    public setVisibleLayers(layers: string[]): void {
        let linker = this.componentsFactory.getPane().getLinker();
        linker.setVisibleLayers(layers);
        linker.drawLines();
    }

    public setCurrentBoard(board: TBoard): void {
        this.componentsFactory2.getAppContainer().setCurrentBoard(board);
    }

    public export(): void {
        this.storageFactory.getBoardsStorage().export();
    }

    public import(file: File) {
        this.storageFactory.getBoardsStorage().import(file);
    }

    public showTagsPanel(): void {
        this.componentsFactory2.getAppContainer().showTagsPanel();
    }

    public showNotesPanel(): void {
        this.componentsFactory2.getAppContainer().showNotesPanel();
    }
}