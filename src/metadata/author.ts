// Add necessary imports
import { TextTransformer } from "@/transformer/text";

/**
 * A class representing an author of a work.
 * 
 * @author Aaron Haim
 * @version 0.1.0
 */
export class Author {
    /**
     * The name of the author.
     */
    name: string;

    /**
     * Creates a simple author.
     * 
     * @param name The name of the author
     */
    constructor(name: string) {
        this.name = name;
    }

    /**
     * Returns the name of the author.
     * 
     * @param transformer A transformer that can be applied to text
     * @returns The name of the author
     */
    getName(transformer: TextTransformer): string {
        return this.name;
    }
}

/**
 * An author who has an ORCiD.
 * 
 * @author Aaron Haim
 * @version 0.1.0
 */
export class ORCiDAuthor extends Author {
    /**
     * A regex determining whether a string is a raw ORCiD.
     */
    static id_regex: RegExp = /^\d{4}-\d{4}-\d{4}-(?:\d{4}|\d{3}X)$/g

    /**
     * The URL of the ORCiD of the author.
     */
    orcid_url: string;

    constructor(name: string, orcid: string) {
        super(name);
        // Turn orcid into URL if not one already
        if (ORCiDAuthor.id_regex.test(orcid)) {
            this.orcid_url = `https://orcid.org/${orcid}`;
        } else {
            this.orcid_url = orcid;
        }
    }

    getName(transformer: TextTransformer): string {
        return transformer.hyperlink(this.name, this.orcid_url);
    }
}
