import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, PermissionsBitField, } from "discord.js";
import { QuickDB } from "quick.db";
import Positions from "../../Types/positions.js";
import gameRun from "./gameRun.js";
import readyUp from "./readyUp.js";
const db = new QuickDB();
const game = db.table("game");
export default async function gameSetup(msg, reason, id) {
    let current = await game.get(id);
    if (current.queue.length < 10 && reason != "force")
        return msg.edit({
            embeds: [{ title: "Could not start game too little players" }],
            components: [],
        });
    let embed1 = new EmbedBuilder();
    embed1.setTitle("Creating Teams | " + id);
    embed1.setDescription(`Players:\n${Object.keys(Positions)
        .map((i) => `${Object.values(Positions)[Object.keys(Positions).indexOf(i)]}: ${current.queue
        .filter((x) => x.position === i)
        .map((d) => `<@${d.id}>`)
        .join(",")}`)
        .join("\n")}`);
    embed1.setColor("#00FF00");
    msg.edit({
        embeds: [embed1],
        components: [],
    });
    let blueTeam = [];
    let redTeam = [];
    await Promise.all(Object.keys(Positions).map(async (i) => {
        let arr = current.queue.filter((x) => x.position === i);
        let b = Math.floor(Math.random() * arr.length);
        let blue = arr[b];
        let red = arr[b === 0 ? 1 : 0];
        blueTeam.push(blue ?? { id: "None", position: i });
        redTeam.push(red ?? { id: "None", position: i });
    }));
    await game.set(`${id}.teams.blue.players`, blueTeam);
    await game.set(`${id}.teams.red.players`, redTeam);
    current = await game.get(id);
    let embed2 = new EmbedBuilder();
    embed2.setTitle("Game " + id + " Teams");
    embed2.addFields([
        {
            name: "Blue Team",
            value: `${current.teams.blue.players
                .map((i) => `${Object.values(Positions)[Object.keys(Positions).indexOf(i.position)]} - ${i.id != "None" ? "<@" : ""}${i.id}${i.id != "None" ? ">" : ""} 🔴`)
                .join("\n")}`,
            inline: true,
        },
        {
            name: "Red Team",
            value: `${current.teams.red.players
                .map((i) => `${Object.values(Positions)[Object.keys(Positions).indexOf(i.position)]} - ${i.id != "None" ? "<@" : ""}${i.id}${i.id != "None" ? ">" : ""} 🔴`)
                .join("\n")}`,
            inline: true,
        },
    ]);
    embed2.setColor("#00FF00");
    let red = await msg.guild?.roles.create({
        name: `Red Team ${id}`,
        color: "#FF0000",
    });
    let blue = await msg.guild?.roles.create({
        name: `Blue Team ${id}`,
        color: "#0000FF",
    });
    await game.set(`${id}.teams.red.role`, red.id);
    await game.set(`${id}.teams.blue.role`, blue.id);
    let category = await msg.guild?.channels.create({
        name: `Game: ${id}`,
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
            {
                id: msg.guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: red.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: blue.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
        ],
    });
    let redc = await msg.guild?.channels.create({
        name: `Red: ${id}`,
        type: ChannelType.GuildVoice,
        permissionOverwrites: [
            {
                id: msg.guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: red.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: blue.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
        ],
        parent: category.id,
    });
    let bluec = await msg.guild?.channels.create({
        name: `Blue: ${id}`,
        type: ChannelType.GuildVoice,
        parent: category.id,
        permissionOverwrites: [
            {
                id: msg.guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: red.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: blue.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
        ],
    });
    let lobby = await msg.guild?.channels.create({
        name: `Lobby: ${id}`,
        type: ChannelType.GuildVoice,
        parent: category.id,
        permissionOverwrites: [
            {
                id: msg.guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: red.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: blue.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
        ],
    });
    await game.set(`${id}.channels.category`, category.id);
    await game.set(`${id}.channels.red`, redc.id);
    await game.set(`${id}.channels.blue`, bluec.id);
    await game.set(`${id}.channels.lobby`, lobby.id);
    current = await game.get(id);
    await Promise.all(current.teams.blue.players.map(async (mem) => await msg.guild?.members.cache
        .get(mem.id)
        ?.roles.add(current.teams.blue.role)));
    await Promise.all(current.teams.red.players.map(async (mem) => await msg.guild?.members.cache
        .get(mem.id)
        ?.roles.add(current.teams.red.role)));
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
    const filter = (interaction) => interaction.customId.split("|")[1] === id &&
        current.queue.find((x) => x.id === interaction.user.id);
    const collector1 = msg.createMessageComponentCollector({
        filter,
        time: 300000,
    });
    collector1.on("collect", (int) => {
        readyUp(msg, int, id, collector1);
    });
    collector1.on("end", (collected, reason) => {
        gameRun(msg, id);
    });
}
