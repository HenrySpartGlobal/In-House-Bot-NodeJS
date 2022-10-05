import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, } from "discord.js";
import { QuickDB } from "quick.db";
import Positions from "../../Types/positions.js";
const db = new QuickDB();
const game = db.table("game");
export default async function gameRun(msg, id) {
    let current = await game.get(`${id}`);
    if (current.queue.find((i) => i.ready === false)) {
        let channels = await game.get(`${id}.channels`);
        Object.values(channels).map((i) => {
            msg.guild?.channels.delete(i);
        });
        let blueRole = await game.get(`${id}.teams.blue.role`);
        let redRole = await game.get(`${id}.teams.red.role`);
        await msg.guild?.roles.delete(blueRole);
        await msg.guild?.roles.delete(redRole);
        await game.delete(`${id}`);
        return msg.edit({
            components: [],
            embeds: [new EmbedBuilder().setTitle("Game Canceled")],
        });
    }
    let embed2 = new EmbedBuilder();
    embed2.setTitle("Game " + id + " Running");
    embed2.addFields([
        {
            name: "Blue Team",
            value: `${current.teams.blue.players
                .map((i) => `${Object.values(Positions)[Object.keys(Positions).indexOf(i.position)]} - ${i.id != "None" ? "<@" : ""}${i.id}${i.id != "None" ? ">" : ""}`)
                .join("\n")}`,
            inline: true,
        },
        {
            name: "Red Team",
            value: `${current.teams.red.players
                .map((i) => `${Object.values(Positions)[Object.keys(Positions).indexOf(i.position)]} - ${i.id != "None" ? "<@" : ""}${i.id}${i.id != "None" ? ">" : ""}`)
                .join("\n")}`,
            inline: true,
        },
    ]);
    embed2.setColor("#0000FF");
    msg.edit({
        embeds: [embed2],
        components: [
            new ActionRowBuilder().addComponents([
                new ButtonBuilder()
                    .setCustomId(`game|over|${id}`)
                    .setLabel("Game Over")
                    .setStyle(ButtonStyle.Danger),
            ]),
        ],
    });
}
