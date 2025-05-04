export type TNote = {
    id: string;
    boardId?: string;
    x?: number;
    y?: number;
    preview?: string;
    content?: string;
    toLink?: string[];
    tags?: any[];
    isCrypted?: boolean;
}