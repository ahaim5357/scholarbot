import axios, { AxiosRequestConfig } from "axios";
import { PaperGetter, PaperMetadata } from "@/metadata/paper";
import { generateId16 } from "@/util/utils";
import { JSDOM } from "jsdom";
import { Author, ORCiDAuthor } from "@/metadata/author";
import { jsonHeaders } from "@/doi/getter";
import { XMLParser } from "fast-xml-parser";

/**
 * Returns a randomly generated user agent header for a HTTP Request.
 * 
 * @returns a randomly generated user agent header
 */
const agentHeaders = () => ({
    headers: {
        'User-Agent': generateId16()
    }
}) as AxiosRequestConfig;

/**
 * A list of possible XML tags that can hold the abstract.
 */
const possibleXMLTags: string[] = ['jats:p', 'p'];

/**
 * Returns the abstract within the CrossRef API.
 * 
 * @param xmlString A XML string holding the abstract
 * @returns An abstract
 */
const normalAbstractGetter = async (xmlString : string) => {
    // Read XML from string
    const abstractData = new XMLParser().parse(xmlString);

    // Loop over all valid xml tags and return the data
    for (const xmlTag of possibleXMLTags) {
        if (xmlTag in abstractData) {
            return abstractData[xmlTag];
        }
    }
    return 'N/A';
}

/**
 * Returns an empty abstract.
 * 
 * @returns An empty abstract
 */
const noneAbstractGetter = async () => {
    return '';
};

/**
 * Returns an abstract on the ACM website.
 * 
 * @param referenceUrl The URL to a DOI on the ACM website
 * @returns An abstract
 */
const acmAbstractGetter = async (referenceUrl: string) => {
    // Get webpage from ACM to extract abstract
    const acmHtml: string = (await axios.get(referenceUrl, agentHeaders())).data;

    // Extract abstract from website
    const abstract: string = [...(new JSDOM(acmHtml)).window.document
        .querySelector('.abstractSection') // ACM defines abstract in .abstractSection class
        .getElementsByTagName('p')] // Abstract stored in p tags
        .map(p => p.textContent).join('\n\n'); // Join abstract tags together

    return abstract;
};

/**
 * A map of publishers to abstract getters if the abstract is
 * not on the metadata.
 */
const abstractGetters = {
    'ACM': acmAbstractGetter
};

/**
 * Returns the paper metadata associated with the CrossRef DOI.
 * 
 * @param doi A CrossRef digital object identifier
 * @returns The metadata associated with the DOI
 */
export const crossrefPaperGetter: PaperGetter = async (doi: string) => {
    // Convert doi into url
    // TODO: Use CrossRef API method instead (https://api.crossref.org/swagger-ui/index.html#/Works/get_works__doi_)
    const referenceUrl: string = `https://doi.org/${doi}`;

    // Get crossref data JSON from url
    const metadata: any = (await axios.get(referenceUrl, jsonHeaders)).data;

    // Get abstract if present
    let abstract: Promise<string>;
    if ('abstract' in metadata) {
        abstract = normalAbstractGetter(metadata.abstract);
    } else if (metadata.publisher in abstractGetters) {
        // If abstract isn't present, extract from publisher
        abstract = abstractGetters[metadata.publisher](referenceUrl);
    } else {
        // Otherwise, just resolve nothing
        abstract = noneAbstractGetter();
    }

    // Get author information
    const authors: Author[] = metadata.author.map(author => {
        // Get author name
        const name = `${author.given} ${author.family}`;

        // Create orcid author if available
        // Otherwise just a regular author
        return 'ORCID' in author ? new ORCiDAuthor(name, author.ORCID) : new Author(name);
    });

    return new PaperMetadata(referenceUrl, metadata.title, authors, (await abstract));
};
