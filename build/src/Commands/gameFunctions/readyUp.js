import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, } from "discord.js";
import { QuickDB } from "quick.db";
import Positions from "../../Types/positions.js";
const db = new QuickDB();
const game = db.table("game");
const red = "🔴";
const green = "🟢";
async function unready(msg, interaction, id) {
    let current = await game.get(`${id}`);
    if (current.queue.find((i) => i.id === interaction.user.id)?.ready ===
        false)
        return interaction.reply({
            content: "You are not ready",
            ephemeral: true,
        });
    let currentUser = await current.queue.find((i) => i.id === interaction.user.id);
    await game.push(`${id}.queue`, {
        id: currentUser.id,
        position: currentUser.position,
        ready: false,
    });
    await game.pull(`${id}.queue`, (i) => i.id === interaction.user.id && i.ready === true);
    interaction.reply({ content: "Unreadied", ephemeral: true });
    current = await game.get(`${id}`);
    let embed2 = new EmbedBuilder();
    embed2.setTitle("Game " + id + " Teams");
    embed2.addFields([
        {
            name: "Blue Team",
            value: `${current.teams.blue.players
                .map((i) => `${Object.values(Positions)[Object.keys(Positions).indexOf(i.position)]} - ${i.id != "None" ? "<@" : ""}${i.id}${i.id != "None" ? ">" : ""} ${current.queue.find((x) => x.id === i.id)?.ready === true
                ? green
                : red}`)
                .join("\n")}`,
            inline: true,
        },
        {
            name: "Red Team",
            value: `${current.teams.red.players
                .map((i) => `${Object.values(Positions)[Object.keys(Positions).indexOf(i.position)]} - ${i.id != "None" ? "<@" : ""}${i.id}${i.id != "None" ? ">" : ""} ${current.queue.find((x) => x.id === i.id)?.ready === true
                ? green
                : red}`)
                .join("\n")}`,
            inline: true,
        },
    ]);
    embed2.setColor("#00FF00");
    msg.edit({
        embeds: [embed2],
        components: [
            new ActionRowBuilder().addComponents([
                new ButtonBuilder()
                    .setCustomId(`ready|${id}`)
                    .setLabel("Ready Up")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`unready|${id}`)
                    .setLabel("Unready")
                    .setStyle(ButtonStyle.Success),
            ]),
        ],
    });
}
export default async function readyUp(msg, interaction, id, collector) {
    let ready = interaction.customId.split("|")[0];
    let current = await game.get(`${id}`);
    if (ready === "unready")
        return unready(msg, interaction, id);
    if (current.queue.find((i) => i.id === interaction.user.id)?.ready === true)
        return interaction.reply({
            content: "You are already ready",
            ephemeral: true,
        });
    let currentUser = await current.queue.find((i) => i.id === interaction.user.id);
    await game.push(`${id}.queue`, {
        id: currentUser.id,
        position: currentUser.position,
        ready: true,
    });
    await game.pull(`${id}.queue`, (i) => i.id === interaction.user.id && i.ready === false);
    interaction.reply({ content: "Readied", ephemeral: true });
    current = await game.get(`${id}`);
    let embed2 = new EmbedBuilder();
    embed2.setTitle("Game " + id + " Teams");
    embed2.addFields([
        {
            name: "Blue Team",
            value: `${current.teams.blue.players
                .map((i) => `${Object.values(Positions)[Object.keys(Positions).indexOf(i.position)]} - ${i.id != "None" ? "<@" : ""}${i.id}${i.id != "None" ? ">" : ""} ${current.queue.find((x) => x.id === i.id)?.ready === true
                ? green
                : red}`)
                .join("\n")}`,
            inline: true,
        },
        {
            name: "Red Team",
            value: `${current.teams.red.players
                .map((i) => `${Object.values(Positions)[Object.keys(Positions).indexOf(i.position)]} - ${i.id != "None" ? "<@" : ""}${i.id}${i.id != "None" ? ">" : ""} ${current.queue.find((x) => x.id === i.id)?.ready === true
                ? green
                : red}`)
                .join("\n")}`,
            inline: true,
        },
    ]);
    embed2.setColor("#00FF00");
    msg.edit({
        embeds: [embed2],
        components: [
            new ActionRowBuilder().addComponents([
                new ButtonBuilder()
                    .setCustomId(`ready|${id}`)
                    .setLabel("Ready Up")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`unready|${id}`)
                    .setLabel("Unready")
                    .setStyle(ButtonStyle.Success),
            ]),
        ],
    });
    if (!current.queue.find((i) => i.ready === false))
        collector.stop();
}
