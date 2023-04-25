import axios, { AxiosRequestConfig } from "axios";
import { PaperGetter, PaperMetadata } from "@/metadata/paper";
import { generateId16 } from "@/util/utils";
import { JSDOM } from "jsdom";
import { Author as WorkAuthor, ORCiDAuthor } from "@/metadata/author";
import { jsonHeaders } from "@/doi/getter";
import { XMLParser } from "fast-xml-parser";

interface DateParts {
    'date-parts': number[][];
}

interface Date extends DateParts {
    'date-time': string;
    timestamp: number;
}

interface Affiliation {
    name: string;
}

interface Author {
    ORCID?: string;
    suffix?: string;
    given?: string;
    family: string;
    affiliation: Affiliation[];
    name?: string;
    'authenticated-orcid'?: boolean;
    prefix?: string;
    sequence: string;
}

interface Reference {
    issn?: string;
    'standards-body'?: string;
    issue?: string;
    key: string;
    'series-title'?: string;
    'isbn-type'?: string;
    'doi-asserted-by'?: string;
    'first-page'?: string;
    isbn?: string;
    doi?: string;
    component?: string;
    'article-title'?: string;
    'volume-title'?: string;
    volume?: string;
    author?: string;
    'standard-designator'?: string;
    year?: string;
    unstructured?: string;
    edition?: string;
    'journal-title'?: string;
    'issn-type'?: string;
}

interface WorksMessageMessageItemsAssertionGroup {
    name: string;
    label: string;
}

interface WorksMessageMessageItemsAssertionExplanation {
    URL: string;
}

interface WorkAssertion {
    group: WorksMessageMessageItemsAssertionGroup;
    explanation: WorksMessageMessageItemsAssertionExplanation;
    name: string;
    value: string;
    URL: string;
    order: number;
}

interface WorkClinicalTrial {
    'clinical-trial-number': string;
    registry: string;
    type: string;
}

interface WorkDomain {
    domain: string[];
    'crossmark-restriction': boolean;
}

interface WorkFreeToRead {
    'start-date'?: DateParts;
    'end-date'?: DateParts;
}

interface WorkFunder {
    name: string;
    DOI?: string;
    'doi-asserted-by'?: string;
    award: string[];
}

interface WorkISSNType {
    type: string;
    value: string[];
}

interface WorkInstitution {
    name: string;
    place: string[];
    department: string[];
    acronym: string[];
}

interface WorkJournalIssue {
    issue: string;
}

interface WorkLicense {
    URL: string;
    start: Date;
    'delay-in-days': number;
    'content-version': string;
}

interface WorkLink {
    URL: string;
    'content-type': string;
    'content-version': string;
    'intended-application': string;
}

interface WorkMessageRelation {
    'id-type': string;
    id: string;
    'asserted-by': string;
}

interface WorkRelation {
    [key: string]: WorkMessageRelation;
}

interface WorkReview {
    type: string;
    'running-number': string;
    'revision-round': string;
    stage: string;
    'competing-interest-statement': string;
    recommendation: string;
    language: string;
}

interface WorkStandardsBody {
    name: string;
    acronym: string[];
}

interface WorkUpdate {
    label: string;
    DOI: string;
    type: string;
    updated: Date;
}

interface Work {
    institution?: WorkInstitution;
    indexed: Date;
    posted?: DateParts;
    'publisher-location'?: string;
    'update-to'?: WorkUpdate[];
    'standards-body'?: WorkStandardsBody[];
    'edition-number'?: string;
    'group-title'?: string[];
    'reference-count': number;
    publisher: string;
    issue?: string;
    'isbn-type'?: WorkISSNType[];
    license?: WorkLicense[];
    funder?: WorkFunder[];
    'content-domain': WorkDomain;
    chair?: Author[];
    'short-container-title'?: string;
    accepted?: DateParts;
    'content-updated'?: DateParts;
    'published-print'?: DateParts;
    abstract?: string;
    /**
     * The DOI identifier associated with the work.
     */
    DOI: string;
    type: string;
    created: Date;
    approved?: DateParts;
    page?: string;
    'update-policy'?: string;
    source: string;
    'is-referenced-by-count': number;
    title: string[];
    prefix: string;
    volume?: string;
    'clinical-trial-number'?: WorkClinicalTrial[];
    author: Author[];
    member: string;
    'content-created'?: DateParts;
    'published-online'?: DateParts;
    reference?: Reference;
    'container-title'?: string[];
    review?: WorkReview;
    'original-title'?: string[];
    language?: string;
    link?: WorkLink[];
    deposited: Date;
    score: number;
    degree?: string;
    subtitle?: string[];
    translator?: Author[];
    'free-to-read'?: WorkFreeToRead;
    editor?: Author[];
    'component-number'?: string;
    'short-title'?: string[];
    issued: DateParts;
    ISBN?: string[];
    'references-count': number;
    'part-number'?: string;
    'journal-issue'?: WorkJournalIssue;
    'alternative-id'?: string[];
    URL: string;
    archive?: string[];
    relation?: WorkRelation;
    ISSN?: string[];
    'issn-type'?: WorkISSNType[];
    subject?: string[];
    'published-other'?: DateParts;
    published?: DateParts;
    assertion?: WorkAssertion;
    subtype?: string;
    'article-number'?: string;
}

interface WorkMessage {
    status: string;
    'message-type': string;
    'message-version': string;
    message: Work;
}

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
    const referenceUrl: string = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;

    // Get crossref data JSON from url
    const message: WorkMessage = (await axios.get(referenceUrl, jsonHeaders)).data;
    const metadata: Work = message.message;

    // Get abstract if present
    let abstract: Promise<string>;
    if ('abstract' in metadata) {
        abstract = normalAbstractGetter(metadata.abstract);
    } else if (metadata.publisher in abstractGetters) {
        // If abstract isn't present, extract from publisher
        abstract = abstractGetters[metadata.publisher](`https://doi.org/${doi}`);
    } else {
        // Otherwise, just resolve nothing
        abstract = noneAbstractGetter();
    }

    // Get author information
    const authors: WorkAuthor[] = metadata.author.map(author => {
        // Get author name
        const name = `${author.given} ${author.family}`;

        // Create orcid author if available
        // Otherwise just a regular author
        return 'ORCID' in author ? new ORCiDAuthor(name, author.ORCID) : new WorkAuthor(name);
    });

    return new PaperMetadata(metadata.URL, metadata.title[0], authors, (await abstract));
};
