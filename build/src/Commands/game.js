import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, } from "discord.js";
import { QuickDB } from "quick.db";
import Positions from "../Types/positions.js";
import { queue } from "./gameFunctions/buttons.js";
import createGame from "./gameFunctions/createGame.js";
import gameSetup from "./gameFunctions/gameSetup.js";
import { join } from "./gameFunctions/queueSystem.js";
const db = new QuickDB();
const game = db.table("game");
const users = db.table("users");
export default {
    name: "game",
    description: "Create a game",
    usage: "{prefix}game",
    async execute(message, args) {
        let id = await createGame();
        let embed = new EmbedBuilder();
        embed.setTitle("Game Queue | " + id);
        embed.setDescription("Please use the buttons below to join the queue");
        embed.setColor("#FFA500");
        message
            .reply({ embeds: [embed], components: queue([], id) })
            .then(async (msg) => {
            const filter = (interaction) => interaction.customId.split("|")[1] === id;
            const collector = msg.createMessageComponentCollector({
                filter,
            });
            collector.on("collect", (int) => join(int, id, msg, collector));
            collector.on("end", (collected, reason) => {
                gameSetup(msg, reason, id);
            });
        });
    },
    async button(interaction, name) {
        if (name === "over") {
            let id = interaction.customId.split("|")[2];
            let current = await game.get(`${id}`);
            if (current?.ended === true || !current)
                return interaction.reply({ content: "Already ended", ephemeral: true });
            interaction.reply({ ephemeral: true, content: "Ended" });
            await game.set(`${id}.ended`, true);
            let embed2 = new EmbedBuilder();
            embed2.setTitle("Game " + id + " Over");
            embed2.setDescription("Please select the winner. Voting ends after 2 min.");
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
            embed2.setColor("#FF0000");
            interaction.channel
                ?.send({
                embeds: [embed2],
                components: [
                    new ActionRowBuilder().addComponents([
                        new ButtonBuilder()
                            .setCustomId(`blue|${id}`)
                            .setLabel("Blue Team Won")
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId(`red|${id}`)
                            .setLabel("Red Team Won")
                            .setStyle(ButtonStyle.Danger),
                    ]),
                ],
            })
                .then(async (msg) => {
                const filter = (interaction) => interaction.customId.split("|")[1] === id &&
                    current.queue.find((i) => i.id === interaction.user.id);
                const collector = msg.createMessageComponentCollector({
                    filter,
                    time: 120000,
                });
                collector.on("collect", (int) => {
                    int.reply({ content: "Vote Counted", ephemeral: true });
                });
                collector.on("end", async (collected, reason) => {
                    let uniqueIds = [];
                    let sorted = collected.filter((element) => {
                        const isDuplicate = uniqueIds.includes(element.user.id);
                        if (!isDuplicate) {
                            uniqueIds.push(element.user.id);
                            return true;
                        }
                        return false;
                    });
                    let blue = 0;
                    let red = 0;
                    await Promise.all(sorted.map(async (i) => {
                        if (i.customId.split("|")[0] === "blue")
                            blue += 1;
                        if (i.customId.split("|")[0] === "red")
                            red += 1;
                    }));
                    await game.set(`${id}.teams.blue.winVotes`, blue);
                    await game.set(`${id}.teams.red.winVotes`, red);
                    let b = await game.get(`${id}.teams.blue.winVotes`);
                    let r = await game.get(`${id}.teams.red.winVotes`);
                    if (b != r && (b >= 6 || r >= 6)) {
                        if (b > r)
                            await game.set(`${id}.teams.blue.win`, true);
                        else if (b < r)
                            await game.set(`${id}.teams.red.win`, true);
                        msg.edit({
                            components: [],
                            embeds: [{ title: b > r ? "Blue Won" : "Red Won" }],
                        });
                        if (b > r) {
                            let bl = await game.get(`${id}.teams.blue.players`);
                            bl.filter((c) => c.id != "None").map(async (i) => {
                                await users.add(`${i.id}`, 1);
                            });
                        }
                        else {
                            let rd = await game.get(`${id}.teams.red.players`);
                            rd.filter((c) => c.id != "None").map(async (i) => {
                                await users.add(`${i.id}`, 1);
                            });
                        }
                    }
                    else {
                        msg.edit({
                            components: [],
                            embeds: [
                                {
                                    title: "Game Abandoned",
                                    description: "No votes confirmed the winner",
                                },
                            ],
                        });
                    }
                    let channels = await game.get(`${id}.channels`);
                    Object.values(channels).map((i) => {
                        msg.guild?.channels.delete(i);
                    });
                    let blueRole = await game.get(`${id}.teams.blue.role`);
                    let redRole = await game.get(`${id}.teams.red.role`);
                    await msg.guild?.roles.delete(blueRole);
                    await msg.guild?.roles.delete(redRole);
                    game.delete(`${id}`);
                });
            });
        }
    },
};
