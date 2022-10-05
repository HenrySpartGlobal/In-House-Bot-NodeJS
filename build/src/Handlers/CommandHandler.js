import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import fs from "fs";
export default class CommandHandler {
    cmds;
    cmdsNoAlias;
    prefix;
    constructor(prefix) {
        this.cmds = {};
        this.cmdsNoAlias = {};
        this.prefix = prefix;
        let commandFolder = "../Commands/";
        fs.readdirSync(__dirname + "/" + commandFolder).forEach(async (file) => {
            if (file.endsWith(".js")) {
                let command = (await import(`file://${__dirname}/${commandFolder}/${file}`)).default;
                this.cmds[command.name] = command;
                this.cmdsNoAlias[command.name] = command;
                command.alias?.map((i) => (this.cmds[i] = command));
            }
        });
    }
    get commands() {
        let commands = [];
        Object.values(this.cmdsNoAlias).map((x) => {
            let data = {
                name: x.name,
                description: x.description,
                usage: x.usage,
                alias: x.alias,
            };
            commands.push(data);
        });
        return commands;
    }
    run(message) {
        const args = message.content.slice(this.prefix.length).trim().split(/ +/);
        const command = args.shift();
        const cmd = this.cmds[command];
        if (cmd) {
            cmd.execute(message, args);
        }
    }
    async button(interaction, cmdName) {
        if (this.cmds[cmdName]) {
            let command = this.cmds[cmdName];
            command.button?.(interaction, interaction.customId.split("|")[1]);
        }
    }
    async modal(interaction, cmdName) {
        if (this.cmds[cmdName]) {
            let command = this.cmds[cmdName];
            command.modal?.(interaction, interaction.customId.split("|")[1]);
        }
    }
    async selectMenu(interaction, cmdName) {
        if (this.cmds[cmdName]) {
            let command = this.cmds[cmdName];
            command.selectMenu?.(interaction, interaction.customId.split("|")[1]);
        }
    }
}
