import { PaperGetter, PaperMetadata } from "@/metadata/paper";
import axios from "axios";
import { jsonHeaders } from "@/doi/getter";
import { Author, ORCiDAuthor } from "@/metadata/author";

/**
 * Returns the abstract within the DataCite API.
 * 
 * @param descriptions A list containing the description of the DOI
 * @returns An abstract
 */
const normalAbstractGetter = async (descriptions : any[]) => {
    for (const description of descriptions) {
        // Check if description type if abstract and return
        if (description.descriptionType === 'Abstract') {
            return description.description;
        }
    }
    return 'N/A';
}

/**
 * Returns the paper metadata associated with the DataCite DOI.
 * 
 * @param doi A DataCite digital object identifier
 * @returns The metadata associated with the DOI
 */
export const datacitePaperGetter: PaperGetter = async (doi: string) => {
    // Convert doi into JSON api url
    const referenceUrl: string = `https://api.datacite.org/application/vnd.datacite.datacite+json/${doi}`;

    // Get datacite data JSON from url
    const metadata: any = (await axios.get(referenceUrl, jsonHeaders)).data;

    // Get abstract
    const abstract: Promise<string> = normalAbstractGetter(metadata.descriptions);

    // Get author information
    const authors: Author[] = metadata.creators.map(author => {
        // Get author name
        const name = `${author.givenName} ${author.familyName}`;

        // Check nameIdentifiers for orcid and set if present
        for (const id of author.nameIdentifiers) {
            if (id.nameIdentifierScheme === 'ORCID') {
                return new ORCiDAuthor(name, id.nameIdentifier);
            }
        }
        return new Author(name);
    });

    return new PaperMetadata(metadata.id, metadata.titles[0].title, authors, (await abstract));
};
