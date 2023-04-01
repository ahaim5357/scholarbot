/**
 * A generic transformer for text depending on the consumer.
 * 
 * @author Aaron Haim
 * @version 0.1.0
 */
export interface TextTransformer {

    /**
     * Formats the content into bold text.
     * 
     * @param content The content to wrap
     * @returns The bolded text
     */
    bold(content: string): string;

    /**
     * Formats the content and the URL into a masked URL.
     * 
     * @param content The content to wrap
     * @param url The URL the content links to
     * @returns The content hyperlinked to the URL
     */
    hyperlink(content: string, url: string): string;
}
