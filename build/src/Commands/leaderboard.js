import { EmbedBuilder } from "discord.js";
import { QuickDB } from "quick.db";
const db = new QuickDB();
const users = db.table("users");
export default {
    name: "leaderboard",
    description: "View the wins leaderboard",
    usage: "{prefix}leaderboard",
    alias: ["lb"],
    async execute(message, args) {
        let allWins = await users.all();
        if (allWins.length === 0)
            return message.reply("No winners yet");
        let list = allWins
            .sort(function (a, b) {
            return b.value - a.value;
        })
            .slice(0, 10)
            .map((i) => `<@${i.id}> - ${i.value}`)
            .join("\n");
        let embed = new EmbedBuilder();
        embed.setColor("#0000FF");
        embed.setTitle("Wins Leaderboard");
        embed.setDescription(list);
        message.reply({ embeds: [embed] });
    },
};
