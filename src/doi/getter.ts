import axios, { AxiosRequestConfig } from "axios";
import { crossrefPaperGetter } from "@/doi/crossref";
import { PaperMetadata } from "@/metadata/paper";

export const jsonHeaders: AxiosRequestConfig = {
    headers: {
        'Accept': 'application/json'
    }
};

const metadataGetters = {
    'Crossref': crossrefPaperGetter
};

export const getPaperMetadata = async (doi: string) => {
    // Get registry agency
    const doiRAUrl: string = `https://doi.org/doiRA/${doi}`;

    const ra: any = (await axios.get(doiRAUrl, jsonHeaders)).data[0];

    // Get metadata from doi
    return metadataGetters[ra.RA](ra.DOI) as Promise<PaperMetadata>;
};