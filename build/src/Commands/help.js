import { EmbedBuilder } from "discord.js";
import { CommandHandler } from "../index.js";
import config from "../../config.json" assert { type: "json" };
export default {
    name: "help",
    description: "View the help menu",
    usage: "{prefix}help",
    async execute(message, args) {
        let commands = CommandHandler.commands;
        let embed = new EmbedBuilder();
        embed.setColor("#0000FF");
        embed.setTitle("Help");
        embed.setDescription(commands
            .map((i) => `Name: **${i.name}**, Usage: ${i.usage.replace("{prefix}", config.prefix)}, Description: \`${i.description}\``)
            .join("\n\n"));
        message.reply({ embeds: [embed] });
    },
};
