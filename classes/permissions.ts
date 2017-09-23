import { GuildMember } from "discord.js";
import * as _ from "lodash";

// import { disabledcmds, permissions } from "../sequelize/sequelize";
import { bot } from "../util/bot";
import { Constants, db } from "../util/deps";

interface IPermsResult {
  hasPerm: boolean;
  setPerm: boolean;
}

export const immune = [Constants.identifiers.OWNER];

class Permz {
  get permlist() {
    const obj = {};
    Object.entries(bot.commands).forEach(([cmd, v]) => {
      obj[cmd] = v.perms;
    });
    return obj;
  }

  get defaultPerms() {
    const arr = [];
    Object.entries(bot.commands).forEach(([cmdn, cmd]) => {
      if (cmd.default) {
        arr.push(cmd.perms);
      } else if (typeof cmd.perms !== "string") {
        Object.entries(cmd.perms).forEach(([permName, perm]) => {
          if (perm === true) {
            return arr.push(permName);
          }
          if (perm && perm.default) {
            return arr.push(permName);
          }
        });
      }
    });
    return arr;
  }

  /**
   * Check permissions
   * @param {GuildMember} member Member to check
   * @param {string} guildId Guild to check
   * @param {string} perm The permission node to check (e.g. command.subcommand)
   * @param {boolean} [isDefault=false] If it is a default permission
   * @returns {Object}
   */
  public checkPerm(
    member: GuildMember, guildId: string, perm: string, isDefault: boolean = false,
  ): IPermsResult {
    const [cmdname, extra] = _.toPath(perm);
    // if (extra1) whereobj.extra1 = extra1;
    // if (extra2) whereobj.extra2 = extra2;
    // if (extra3) whereobj.extra3 = extra3;
    const perms = db.table("perms").get(guildId, []).filter((item) => item.type === "member" && item.id === member.id);
    let hasPerm = false;
    let setPerm = false;
    const filtered = perms.find((item) => item.command === "any" || item.command
     === cmdname);
    if (!filtered) { // no user perm that could influence the execution. Proceeding to role perms.
      const roles = member.roles.sort((a, b) => b.position - a.position).array();
      for (const role of roles) {
        const roleperms = db.table("perms").get(guildId, []).filter((it) => it.type === "role" && it.id === role.id);
        if (roleperms.length < 1) {
          continue;
        }
        const item = roleperms.find((it) => it.command === "any" || it.command === cmdname);
        if (!item) { // nothing that could influence the command execution. Check if is default.
          hasPerm = !!isDefault;
        } else { // yay there's a role perm. Let's check if it's negated.
            if (item.command === "any") {
              hasPerm = !item.negated;
              setPerm = true;
              break;
            } else if (item.extra == null) {
              hasPerm = !item.negated;
              setPerm = true;
            } else if (extra && item.extra === extra) {
              hasPerm = !item.negated;
              setPerm = true;
            }
        }
      }
    } else {
      if (filtered.command === "any") {
        hasPerm = !filtered.negated;
        setPerm = true;
      } else if (filtered.extra == null) {
        hasPerm = !filtered.negated;
        setPerm = true;
      } else if (extra && filtered.extra === extra) {
        hasPerm = !filtered.negated;
        setPerm = true;
      }
    }
    // hasPerm = immune.includes(member.id) ? true : hasPerm; // commented for testing permissions
    return {
      hasPerm,
      setPerm,
    };
  }

  /**
   * Check if a command is disabled
   * @param {string} guildId The id of the guild
   * @param {string} channelid The id of the channel
   * @param {string} name The command name
   * @returns {string}
   */
  public isDisabled(guildId: string, channelid: string, name: string): string {
    const disabled = db.table("perms").get(guildId, [])
      .find(
        (item) => (item.command === "any" || item.command === name)
        && (item.type === "channel" || item.type === "guild")
        && item.negated,
        );
    if (!disabled) {
      return "";
    }
    if (disabled.type === "guild" || (disabled.type === "channel" && disabled.id === channelid)) {
      return disabled.type;
    }
    return "";
  }

  /**
   * Check permissions
   * @alias checkPerm
   * @param {GuildMember} member Member to check
   * @param {string} guildId Guild to check
   * @param {string} perm The permission node to check (e.g. command.subcommand)
   * @param {boolean} [isDefault=false] If it is a default permission
   * @returns {Promise<Object>}
   */
  public hasPerm(member: GuildMember, guildId: string, perm: string, isDefault: boolean = false) {
    return this.checkPerm(member, guildId, perm, isDefault);
  }
}

export default new Permz();
