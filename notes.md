## How to perform the DOI lookup

* Information we want
    * Title of the paper
    * DOI (would be included)
    * Authors of the paper
    * Abstract or Description

* Implementation data could differ depending on the Registration Agency (RA) of the DOI
    * Get the RA via GET request on `https://doi.org/doiRA/<doi>`
    * Then handle logic separately depending on determined RA
        * Do basic implementation for CrossRef and DataCite
        * May need to do some special logic for abstract info

## DOI -> Output

* Extract metadata information from DOI
* Pass data into a transformer for specific output
    * Transformer and object should be passed together using a separate method such that individual implementations can change the logic
* Construct output information
