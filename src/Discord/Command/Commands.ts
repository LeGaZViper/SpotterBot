import DiscordCommandInterface from "../../Model/Discord/DiscordCommandInterface";
import FractalsController from "../Controller/Guildwars/FractalsController";
import DailiesController from "../Controller/Guildwars/DailiesController"
import PingController from "../Controller/PingController";
import PactSupplyController from "../Controller/Guildwars/PactSupplyController";

/**
 * # WIP #
 * This implementation probably sucks.
 * Will see, if a better solution might be required
 */
const COMMANDS: Record<string, DiscordCommandInterface> = {
    "ping": {
        description: "makes pong after ping",
        controller: new PingController()
    },
    "fractals": {
        description: "returns daily fractals",
        controller: new FractalsController()
    },
    "dailies": {
        description: "returns PvE, PvP and WvW dailies",
        controller: new DailiesController()
    },
    "psna": {
        description: "returns Pact Supply Network Agents info",
        controller: new PactSupplyController()
    }
};

export default COMMANDS;
