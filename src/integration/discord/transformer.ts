// Add necessary imports
import * as discord from "discord.js";
import { TextTransformer } from "../../transformer/text";

/**
 * A text transformer for Discord.
 * 
 * @author Aaron Haim
 * @version 0.1.0
 */
export class DiscordTextTransformer implements TextTransformer {
    
    bold(content: string): string {
        return discord.bold(content);
    }

    hyperlink(content: string, url: string): string {
        return discord.hyperlink(content, url);
    }
}
