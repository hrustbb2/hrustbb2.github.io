import { AppComamnds } from "../commands/AppCommands";
import { AppBus } from "../bus/AppBus";
import { TBoard } from "../tree/types/TBoard";

export class LayersPanel {

    private container: HTMLElement;

    private newLayerBtn: HTMLElement;

    private appCommands: AppComamnds;

    private appBus: AppBus;

    private labelsContainer: HTMLElement;

    private labels: Label[] = [];

    private currentBoard: TBoard;

    public setAppCommands(c: AppComamnds): void {
        this.appCommands = c;
    }

    public setAppBus(bus: AppBus): void {
        this.appBus = bus;
    }

    public setCurrentBoard(board: TBoard): void {
        this.currentBoard = board;

        this.appCommands.getLayers(this.currentBoard.id)
            .then((resp: any) => {
                if (resp.success) {
                    for (let i in resp.layers) {
                        let l = this.createLabel();
                        l.load(resp.layers[i]);
                        this.labelsContainer.append(l.getTemplate());
                        l.eventsListen();
                        this.labels.push(l);
                    }
                }
            });
    }

    public clear(): void
    {
        this.labels = [];
        this.labelsContainer.innerHTML = '';
    }

    public init(container: HTMLElement): void {
        this.container = container;
        this.newLayerBtn = this.container.querySelector('.js-new-layer-btn');
        this.labelsContainer = this.container.querySelector('.js-labels-container');

        this.newLayerBtn.onclick = () => {
            let name = prompt('Name');
            if (!name) {
                return;
            }
            let boardId = this.currentBoard.id
            this.appCommands.createLayer(boardId, name)
                .then((resp: any) => {
                    let l = this.createLabel();
                    l.load({
                        id: resp.layer.id,
                        name: name,
                    });
                    this.labelsContainer.append(l.getTemplate());
                    l.eventsListen();
                    this.labels.push(l);
                })
        }
    }

    private createLabel(): Label {
        let l = new Label();
        l.setOnClick((self: Label) => {
            for (let i in this.labels) {
                if (this.labels[i] === self) {
                    this.labels[i].setActive(true);
                    this.appBus.setCurrentLayer(self.getData().id);
                    continue;
                }
                this.labels[i].setActive(false);
            }
        });
        l.setOnCheckboxClick((self: Label) => {
            let visibleLayers = [];
            for (let i in this.labels) {
                if (this.labels[i].isChecked()) {
                    visibleLayers.push(this.labels[i].getData().id);
                }
            }
            this.appBus.setVisibleLayers(visibleLayers);
        });
        return l;
    }

}

class Label {

    private html: string = `
        <div style="cursor: pointer;"><input class="js-checkbox" type="checkbox" value=""></div>
    `;

    private template: HTMLElement;

    private checkbox: HTMLInputElement;

    private data: any;

    private onClick: (self: Label) => void;

    private onCheckboxClick: (self: Label) => void;

    public getTemplate(): HTMLElement {
        return this.template;
    }

    public getData(): any {
        return this.data;
    }

    public setOnClick(c: (self: Label) => void): void {
        this.onClick = c;
    }

    public setOnCheckboxClick(c: (self: Label) => void): void {
        this.onCheckboxClick = c;
    }

    public isChecked(): boolean {
        return this.checkbox.checked;
    }

    public constructor() {
        let div = document.createElement('div');
        div.innerHTML = this.html.trim();

        this.template = <HTMLElement>div.firstChild;
        this.checkbox = this.template.querySelector('.js-checkbox');
    }

    public eventsListen(): void {
        this.template.onclick = () => {
            this.onClick(this);
        }
        this.checkbox.onclick = (e: Event) => {
            e.stopPropagation();
            this.onCheckboxClick(this);
        }
    }

    public load(data: any): void {
        this.data = data;
        let t = document.createTextNode(' ' + data.name);
        this.template.append(t);
    }

    public setActive(active: boolean): void {
        if (active) {
            this.template.style.backgroundColor = '#cbcbcb';
            return;
        }
        this.template.style.removeProperty('background-color');
    }

}