// Load in dotenv config with token
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Test application

const axios = require('axios');
const jsdom = require('jsdom');

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

const { REST, Routes, Client, GatewayIntentBits, EmbedBuilder, hyperlink, bold } = require('discord.js');

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

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands });

        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error(error);
    }
})();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'doi') {
        
        try {
            let doiLink = `https://doi.org/${interaction.options.getString('doi')}`;

            var data = (await axios.get(doiLink,
            {
                headers: {
                    'Accept': 'application/json'
                }
            })).data;

            // TODO: Should only check for ACM
            var html = (await axios.get(doiLink, {
                headers: {
                    'User-Agent': makeid(16)
                }
            })).data;

            var abstract = [...(new jsdom.JSDOM(html)).window.document.querySelector('.abstractSection').getElementsByTagName('p')]
                .map(p => p.textContent).join('\n\n');
            if (abstract.length > 1024) {
                abstract = `${abstract.slice(0, 1021)}...`;
            }

            let authors = data.author.map(a => {
                let name = `${a.given} ${a.family}`;

                if ('ORCID' in a) {
                    name = hyperlink(name, a.ORCID);
                }

                return name;
            });

            let embed = new EmbedBuilder()
                .setTitle(bold(data.title))
                .setColor('Blue')
                .addFields(
                    { name: 'Reference', value: hyperlink(doiLink, doiLink) },
                    { name: (authors.length === 1 ?  'Author' : 'Authors'), value: authors.join(', ') },
                    { name: 'Abstract', value: abstract }
                )
                .toJSON();
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.log(error);
            await interaction.reply('An error has occurred reading the DOI!');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
