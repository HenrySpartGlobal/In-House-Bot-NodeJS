import { EmbedBuilder } from "discord.js";
import Positions from "../../Types/positions.js";
import { QuickDB } from "quick.db";
import { queue } from "./buttons.js";
const db = new QuickDB();
const game = db.table("game");
async function remove(interaction, id, msg) {
    let current = await game.get(id);
    if (!current.queue.find((i) => i.id === interaction.user.id))
        return interaction.editReply({
            content: "You have not joined the game",
        });
    await game.pull(`${id}.queue`, (u) => u.id === interaction.user.id);
    interaction.editReply({
        content: "You left the game",
    });
    current = await game.get(id);
    let embed1 = new EmbedBuilder();
    embed1.setTitle("Game Queue | " + id);
    embed1.setDescription(`Players:\n${Object.keys(Positions)
        .map((i) => `${Object.values(Positions)[Object.keys(Positions).indexOf(i)]}: ${current.queue
        .filter((x) => x.position === i)
        .map((d) => `<@${d.id}>`)
        .join(",")}`)
        .join("\n")}`);
    embed1.setColor("#FFA500");
    msg.edit({
        embeds: [embed1],
        components: queue(current.queue, id),
    });
}
export async function join(interaction, id, msg, collector) {
    await interaction.deferReply({ ephemeral: true });
    let position = interaction.customId.split("|")[0];
    if (position === "force")
        return collector.stop("force");
    if (position === "remove")
        remove(interaction, id, msg);
    else {
        let current = await game.get(id);
        if (current.queue.find((i) => i.id === interaction.user.id))
            return interaction.editReply({
                content: "You have already entered this game",
            });
        if (current.queue.filter((i) => i.position === position).length < 2) {
            await game.push(`${id}.queue`, {
                id: interaction.user.id,
                position: position,
                ready: false,
            });
            interaction.editReply({
                content: "Joined as " + position,
            });
            current = await game.get(id);
            let embed1 = new EmbedBuilder();
            embed1.setTitle("Game Queue | " + id);
            embed1.setDescription(`Players:\n${Object.keys(Positions)
                .map((i) => `${Object.values(Positions)[Object.keys(Positions).indexOf(i)]}: ${current.queue
                .filter((x) => x.position === i)
                .map((d) => `<@${d.id}>`)
                .join(",")}`)
                .join("\n")}`);
            embed1.setColor("#FFA500");
            msg.edit({
                embeds: [embed1],
                components: queue(current.queue, id),
            });
            if (current.queue.length === 10)
                collector.stop();
        }
        else {
            interaction.editReply({
                content: "Could not join player limit reached",
            });
        }
    }
}
