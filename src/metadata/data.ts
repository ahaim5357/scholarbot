/**
 * Represents a serialized dictionary with string keys.
 * 
 * @author Aaron Haim
 * @version 0.1.0
 */
export type DataObject = { [key: string]: any };

/**
 * TODO: Document
 */
export interface DataHolder {

    compile(): string | DataObject;

    compileToObject(): DataObject;
}

export abstract class DataHolderImpl implements DataHolder {

    abstract compile(): string | DataObject;

    compileToObject(): DataObject {
        const data: string | DataObject = this.compile();
        return data instanceof String ? {
            content: data
        } : data as DataObject
    }
}
