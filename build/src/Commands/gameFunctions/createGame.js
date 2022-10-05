import { QuickDB } from "quick.db";
const db = new QuickDB();
const gamet = db.table("game");
function makeid(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
export default async function createGame() {
    let id = makeid(10);
    let game = await gamet.get(id);
    if (game)
        return createGame();
    gamet.set(id, {
        queue: [],
        ended: false,
        channels: {
            category: null,
            red: null,
            blue: null,
            lobby: null,
        },
        teams: {
            blue: {
                players: [],
                role: null,
                win: false,
                winVotes: 0,
            },
            red: {
                players: [],
                win: false,
                role: null,
                winVotes: 0,
            },
        },
    });
    return id;
}
