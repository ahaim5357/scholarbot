import axios, { AxiosRequestConfig } from "axios";
import { crossrefPaperGetter } from "@/doi/crossref";
import { PaperMetadata } from "@/metadata/paper";
import { datacitePaperGetter } from "./datacite";

/**
 * A JSON acceptance header for a HTTP Request.
 */
export const jsonHeaders: AxiosRequestConfig = {
    headers: {
        'Accept': 'application/json'
    }
};

interface RegistryAgency {
    DOI: string;
    RA: string;
}

/**
 * A map of registry agencies to getters of the DOI.
 */
const metadataGetters = {
    'Crossref': crossrefPaperGetter,
    'DataCite': datacitePaperGetter
};

/**
 * Returns the paper metadata associated with the DOI.
 * 
 * @param doi A digital object identifier
 * @returns The metadata associated with the DOI
 */
export const getPaperMetadata = async (doi: string) => {
    // Get registry agency
    const doiRAUrl: string = `https://doi.org/doiRA/${doi}`;

    const ra: RegistryAgency = (await axios.get(doiRAUrl, jsonHeaders)).data[0];

    // Get metadata from doi
    return metadataGetters[ra.RA](ra.DOI) as Promise<PaperMetadata>;
};
