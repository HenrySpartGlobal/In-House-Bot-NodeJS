import CMDHandler from "./Handlers/CommandHandler.js";
import { Client, IntentsBitField, Partials, GatewayIntentBits, } from "discord.js";
import config from "../config.json" assert { type: "json" };
export const client = new Client({
    intents: [
        IntentsBitField.Flags.GuildIntegrations,
        IntentsBitField.Flags.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Message],
});
const CommandHandler = new CMDHandler(config.prefix);
export { CommandHandler };
client.on("ready", async () => {
    console.log("Ready!");
});
client.on("messageCreate", (message) => CommandHandler.run(message));
client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        CommandHandler.button(interaction, interaction.customId.split("|")[0]);
    }
    if (interaction.isSelectMenu()) {
        CommandHandler.selectMenu(interaction, interaction.customId.split("|")[0]);
    }
    if (interaction.isModalSubmit()) {
        CommandHandler.modal(interaction, interaction.customId.split("|")[0]);
    }
});
client.login(config.token);
