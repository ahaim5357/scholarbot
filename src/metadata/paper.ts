// Add necessary imports
import { TextTransformer } from "@/transformer/text";
import { Author } from "@/metadata/author";

/**
 * An interface holding metadata related to the paper.
 * 
 * @author Aaron Haim
 * @version 0.1.0 
 */
export class PaperMetadata {
    /**
     * The url the paper originated from.
     */
    referenceUrl: string;
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

    /**
     * Construct the paper metadata.
     * 
     * @param referenceUrl The url the paper originated from
     * @param title The title of the paper
     * @param authors The authors of the paper
     * @param abstract The abstract of the paper
     */
    constructor(referenceUrl: string, title: string, authors: Author[], abstract: string) {
        this.referenceUrl = referenceUrl;
        this.title = title;
        this.authors = authors;
        this.abstract = abstract;
    }

    /**
     * Returns url the paper originated from.
     * 
     * @param transformer A transformer that can be applied to text
     * @returns The url the paper originated from
     */
    getReference(transformer: TextTransformer): string {
        return transformer.hyperlink(this.referenceUrl, this.referenceUrl);
    }

    /**
     * Returns the title of the paper.
     * 
     * @param transformer A transformer that can be applied to text
     * @returns The title of the paper
     */
    getTitle(transformer: TextTransformer): string {
        return transformer.bold(this.title);
    }

    /**
     * Returns the authors of the paper.
     * 
     * @param transformer A transformer that can be applied to text
     * @returns The authors of the paper
     */
    getAuthors(transformer: TextTransformer): string {
        return this.authors.map(author => author.getName(transformer)).join(', ');
    }
}

/**
 * A functional interface which gets the paper information from the DOI.
 * 
 * @param doi The DOI of the paper
 * @returns The metadata associated with the paper
 */
export interface PaperGetter {
    (doi: string): Promise<PaperMetadata>;
}
