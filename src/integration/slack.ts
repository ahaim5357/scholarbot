import * as http from "http";
import { config } from "dotenv";
import { TextTransformer } from "@/transformer/text";
import { getPaperMetadata } from "@/doi/getter";

// Load in .env with token
if (process.env.NODE_ENV !== 'production') {
    config();
}

const transformer: TextTransformer = {
    bold(content) {
        return `*${content}*`;
    },

    hyperlink(content, url) {
        return `<${url}|${content}>`;
    },
};

// Set request listener to read http request
const requestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
    if (req.url === '/doi' && req.method === 'POST') {
        
        // Read data from request body
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            // Decode data to get request body information
            const data = {};
            for (const pair of body.split('&')) {
                const kv = pair.split('=', 2);
                data[kv[0]] = kv[1];
            }

            try {
                // Get paper metadata
                const metadata = (await getPaperMetadata(decodeURIComponent(data['text'])));

                // Snip abstract if necessary
                if (metadata.abstract && metadata.abstract.length > 350) {
                    // Slice string at last word to be smaller than max limit
                    metadata.abstract = `${metadata.abstract.slice(0, metadata.abstract.lastIndexOf(' ', 347))}...`;
                }

                // Write successful message
                res.setHeader("Content-Type", "application/json");
                res.writeHead(200);
                res.end(`
                {
                    "response_type": "in_channel",
                    "blocks": [
                        {
                            "type": "header",
                            "text": {
                                "type": "plain_text",
                                "text": "${metadata.title}"
                            }
                        },
                        {
                            "type": "divider"
                        },
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": "*Reference*\n${metadata.getReference(transformer)}"
                            }
                        },
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": "*${(metadata.authors.length === 1 ?  'Author' : 'Authors')}*\n${metadata.getAuthors(transformer)}"
                            }
                        },
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": "*Abstract*\n${metadata.abstract}"
                            }
                        },
                        {
                            "type": "divider"
                        }
                    ]
                }
                `);
            } catch (error) {
                // Log error as a reply
                console.log(error);
                res.writeHead(200);
                res.end('An error has occurred reading the DOI!');
            }
        });
    } else {
        res.writeHead(404);
        res.end();
    }
};

// Create http server to listen to
const server = http.createServer(requestListener);
server.listen(parseInt(process.env.SLACK_PORT), process.env.SLACK_HOST, () =>
    console.log(`Server is running on http://${process.env.SLACK_HOST}:${process.env.SLACK_PORT}`)
);
