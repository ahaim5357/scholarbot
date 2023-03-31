// How to perform the DOI lookup

// Information we want
// - Title of the paper
// - DOI (would be included)
// - Authors of the paper
// - Abstract or Description

// Implementation data could differ depending on the Registration Agency (RA) of the DOI
// - Get the RA via GET request on https://doi.org/doiRA/<doi>
// - Then handle logic separately depending on determined RA
// -- Do basic implementation for CrossRef and DataCite
