import { CacheType, Client, EmbedBuilder, GatewayIntentBits, Interaction, REST, Routes, bold, bold as dbold, hyperlink as dlink, hyperlink } from "discord.js";
import { config } from "dotenv";
import { TextTransformer } from "@/transformer/text";
import { getPaperMetadata } from "@/doi/getter";

// Load in .env with token
if (process.env.NODE_ENV !== 'production') {
    config();
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN as string);
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const transformer: TextTransformer = {
    bold(content) {
        return dbold(content);
    },

    hyperlink(content, url) {
        return dlink(content, url);
    },
};

// Commands to export to discord
const commands = [
    {
        name: 'doi',
        description: 'Returns the object associated with the provided DOI.',
        options: [
            {
                name: 'doi',
                description: 'The DOI of the object.',
                type: 3,
                required: true
            }
        ]
    }
];

// Add commands to discord
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID as string), { body: commands });

        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error(error);
    }
})();

// On log in
client.on('ready', () => {
    console.log(`Logged in as ${client.user!.tag}!`);
});

// On command sent from user
client.on('interactionCreate',async (interaction: Interaction<CacheType>) => {
    // Skip if not a command
    if(!interaction.isChatInputCommand()) return;

    // Check command is doi
    if (interaction.commandName === 'doi') {
        try {
            // Get paper metadata
            const metadata = (await getPaperMetadata(interaction.options.getString('doi') as string));

            // Snip abstract if necessary
            if (metadata.abstract && metadata.abstract.length > 1024) {
                // Slice string at last word to be smaller than max limit
                metadata.abstract = `${metadata.abstract.slice(0, metadata.abstract.lastIndexOf(' ', 1022))}...`;
            }

            // Create embed block with info
            const embed: EmbedBuilder = new EmbedBuilder()
                .setTitle(metadata.getTitle(transformer))
                .setColor('Blue')
                .addFields(
                    { name: 'Reference', value: metadata.getReference(transformer) },
                    { name: (metadata.authors.length === 1 ?  'Author' : 'Authors'), value: metadata.getAuthors(transformer) }
                );
            
            // If abstract is present, add it
            if (metadata.abstract) {
                embed.addFields({ name: 'Abstract', value: metadata.abstract });
            }
            
            // Reply with result
            await interaction.reply({ embeds: [embed.toJSON()] });
        } catch (error) {
            // Log error as a reply
            console.log(error);
            await interaction.reply('An error has occurred reading the DOI!');
        }
    }
});

// Log into discord with bot
client.login(process.env.DISCORD_TOKEN);
