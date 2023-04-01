// Add necessary imports
import { Author } from "./author";

/**
 * An interface holding metadata related to the paper.
 * 
 * @author Aaron Haim
 * @version 0.1.0 
 */
// TODO: Might just make this a class
export interface PaperMetadata {
    /**
     * The url the paper originated from.
     */
    reference_url: string;
    /**
     * The title of the paper.
     */
    title: string;
    /**
     * The authors of the paper.
     */
    authors: Author[];
    /**
     * The abstract of the paper.
     */
    abstract: string;
}
