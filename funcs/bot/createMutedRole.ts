import rejctF from "../util/rejctF";
import { Guild } from "discord.js";

/**
 * Make a mute role.
 * @param {Guild} guild The guild to create the mute role at.
 * @returns {Promise<Role>} The created role.
 */
export default async function createMutedRole(guild: Guild) {
  const newRole = await guild.roles.create({
    data: {
      name: "SaltMuted",
      permissions: []
    },
    reason: "[Creating mute role]"
  });
  for (const [id, channel] of guild.channels) {
    channel.overwritePermissions(newRole, { SEND_MESSAGES: false }).catch(rejctF(`[CREATE MUTED ROLE-${id}]`));
  }
  return newRole;
}