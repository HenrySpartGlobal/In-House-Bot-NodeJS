import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
export function queue(queue, id) {
    const row = new ActionRowBuilder().addComponents(new ButtonBuilder()
        .setCustomId("top|" + id)
        .setLabel("Top Lane")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(!(queue.filter((i) => i.position === "top").length < 2)), new ButtonBuilder()
        .setCustomId("jungle|" + id)
        .setLabel("Jungle")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(!(queue.filter((i) => i.position === "jungle").length < 2)), new ButtonBuilder()
        .setCustomId("mid|" + id)
        .setLabel("Mid Lane")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(!(queue.filter((i) => i.position === "mid").length < 2)), new ButtonBuilder()
        .setCustomId("adc|" + id)
        .setLabel("ADC")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(!(queue.filter((i) => i.position === "adc").length < 2)), new ButtonBuilder()
        .setCustomId("support|" + id)
        .setLabel("Support")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(!(queue.filter((i) => i.position === "support").length < 2)));
    const row1 = new ActionRowBuilder().addComponents(new ButtonBuilder()
        .setCustomId("remove|" + id)
        .setLabel("Remove Sign Up")
        .setStyle(ButtonStyle.Danger), new ButtonBuilder()
        .setCustomId("force|" + id)
        .setLabel("Force start")
        .setStyle(ButtonStyle.Danger));
    return [row, row1];
}
