import { AppBus } from "../bus/AppBus";

export class NavigationPanel {

    private container: HTMLElement;

    private listContainer: HTMLElement;

    private visible: boolean = false;

    private data: any;

    private notesData: any;

    private appBus: AppBus;

    public setAppBus(bus: AppBus): void {
        this.appBus = bus;
    }

    public init(container: HTMLElement): void {
        this.container = container;
        this.listContainer = this.container.querySelector('.js-list-container');
    }

    public toggleVisible(): void {
        this.visible = !this.visible;
        if (this.visible) {
            this.container.style.display = 'flex';
            return;
        }
        this.container.style.display = 'none';
    }

    public loadNotes(data: any): void {
        this.notesData = data;
    }

    public load(data: any): void {
        this.data = data;

        // Находим корневой элемент(ы) (свободные узлы без родителей)
        this.data.forEach((node: any) => {
            if (!data.some((item: any) => item.links.some((link: any) => link.to === node.id))) {
                this.createHierarchy(this.listContainer, node);
            }
        });
    }

    public clear(): void {
        this.listContainer.innerHTML = '';
        this.data = {};
    }

    // Функция для поиска элемента по ID
    private findNodeById(id: string) {
        return this.data.find((node: any) => node.id === id);
    }

    // Функция для создания иерархического списка
    private createHierarchy(parentNode: HTMLElement, node: any) {
        let li = this.createTagElement();
        li.load(node);

        if (node.links.length > 0) {
            let ul = li.getChildsContainer();
            node.links.forEach((link: any) => {
                if (link.to == link.from) {
                    return;
                }
                const childNode = this.findNodeById(link.to);
                if (childNode) {
                    this.createHierarchy(ul, childNode);
                }
            });
        }

        // Привязываем элементы nodes, у которых ID тегов совпадает
        const matchingNodes = this.notesData.filter((n: any) => {
            if (!n.tags) {
                return false;
            }
            return n.tags.some((tag: any) => {
                return tag.id === node.id
            })
        });
        if (matchingNodes.length > 0) {
            let ulNodes = li.getChildsContainer();
            matchingNodes.forEach((matchNode: any) => {
                let nodeLi = this.createNoteElement();
                nodeLi.load(matchNode);
                ulNodes.appendChild(nodeLi.getTemplate());
                nodeLi.eventsListen();
            });
        }

        parentNode.appendChild(li.getTemplate());
        li.eventsListen();
    }

    private createTagElement(): TagElement {
        let el = new TagElement();
        el.setAppBus(this.appBus);
        return el;
    }

    public createNoteElement(): NoteElement {
        let el = new NoteElement();
        el.setAppBus(this.appBus);
        return el;
    }

}

class TagElement {

    private template: HTMLElement;

    private childsContainer: HTMLElement;

    private data: any;

    private appBus: AppBus;

    public getTemplate(): HTMLElement {
        return this.template;
    }

    public getChildsContainer(): HTMLElement {
        return this.childsContainer;
    }

    public setAppBus(bus: AppBus): void {
        this.appBus = bus;
    }

    public constructor() {
        this.template = document.createElement('li');
        this.template.style.cursor = 'pointer';
        this.childsContainer = document.createElement('ul');
        this.childsContainer.classList.add('hide');
        this.template.appendChild(this.childsContainer);
    }

    public load(data: any): void {
        this.data = data;
        let t = document.createTextNode(data.title);
        this.template.prepend(t);
    }

    public eventsListen(): void {
        this.template.onclick = (e: Event) => {
            e.stopPropagation();
            this.appBus.highligtForTag(this.data.id);

            this.childsContainer.classList.toggle('hide');
        }
    }

}

class NoteElement {

    private template: HTMLElement;

    private data: any;

    private appBus: AppBus;

    public getTemplate(): HTMLElement {
        return this.template;
    }

    public setAppBus(bus: AppBus): void {
        this.appBus = bus;
    }

    public constructor() {
        this.template = document.createElement('li');
        this.template.classList.add('node-item');
        this.template.style.cursor = 'pointer';
    }

    public load(data: any): void {
        this.data = data;
        let t = document.createTextNode(data.preview);
        this.template.prepend(t);
    }

    public eventsListen(): void {
        this.template.onclick = (e: Event) => {
            e.stopPropagation();
            this.appBus.highligtNote(this.data.id);
            if (window.innerWidth < 500) {
                this.appBus.toggleMenu(false);
            }
        }
    }

}