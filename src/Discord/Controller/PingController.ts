import { CommandInteraction } from "discord.js";
import DiscordControllerInterface from "../../Model/Discord/DiscordControllerInterface";
import { DateTime } from "luxon";

/**
 * /ping
 */
export default class PingController implements DiscordControllerInterface {
    public handleInteraction = async (interaction: CommandInteraction): Promise<void> => {
        interaction.reply(`${DateTime.now().setZone('UTC')}`);
    }
}
