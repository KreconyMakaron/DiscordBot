const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const MainKtuluChannel = 'general';

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log(`Running ${client.user.tag}!`);
});


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
    if (interaction.channel.name != MainKtuluChannel) {
        interaction.reply({ content: `You can only use this command in ${MainKtuluChannel}!`, ephemeral: true });
        return;
    }
	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
    catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        console.log('There was an error executing the command');
	}
});

client.login(token);