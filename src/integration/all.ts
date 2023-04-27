import { config } from "dotenv";
import { runDiscordBot } from "@/integration/discord";
import { runSlackServer } from "@/integration/slack";

// Run discord bot if this is the main file
if (require.main === module) {
    // Load in .env with token
    if (process.env.NODE_ENV !== 'production') {
        config();
    }

    runDiscordBot();
    runSlackServer();
}
