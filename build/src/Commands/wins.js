import { QuickDB } from "quick.db";
const db = new QuickDB();
const users = db.table("users");
export default {
    name: "wins",
    description: "Check your wins",
    usage: "{prefix}wins",
    async execute(message, args) {
        let wins = (await users.get(`${message.author.id}`)) || 0;
        message.reply(`You have ${wins} wins.`);
    },
};
