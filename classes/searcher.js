const { Collection, GuildMember, User } = require("discord.js");
const { _, bot, Constants, logger } = require("../util/deps");

// TypeScript Remainder
/*
export type GuildResolvable = Guild | string;
export type SearchChannelType = "text" | "voice" | "all";
export type SearchChannelResult = GuildChannel[];

export interface ISearcherOptions<MemberColl> {
  guild?: Guild;
  members?: Collection<string, MemberColl> | MemberColl[];
  roles?: Collection<string, Role> | Role[];
  channels?: Collection<string, GuildChannel> | GuildChannel[];
} */

/**
 * Utility class for searching for members,
 * channels, and roles.
 */
module.exports = class Searcher {
  /* props -
  /**
   * The guild that this instance looks in.
   * @type {?Guild}
   * /
  public guild?: Guild;

  /**
   * The member collection to look members in.
   * @type {Collection<string, MemberColl>}
   * /
  public members: Collection<string, MemberColl>;

  /**
   * The channel collection to look channels in.
   * @type {Collection<string, GuildChannel>}
   * /
  public channels: Collection<string, GuildChannel>;

  /**
   * The role collection to look roles in.
   * @type {Collection<string, Role>}
   * /
  public roles: Collection<string, Role>;
  */
  /**
   * @param {SearcherOptions} options The options
   */
  constructor(options) {
    const { guild, members, roles, channels } = options;
    if (guild) {
      this.guild = guild;
      this.roles = guild.roles;
      this.channels = guild.channels;
      this.members = guild.members;
    }
    if (roles) {
      if (roles instanceof Array) {
        const rolesToUse = new Collection();
        for (const role of roles) {
          rolesToUse.set(role.id, role);
        }
        this.roles = rolesToUse;
      } else {
        this.roles = roles;
      }
    }
    if (channels) {
      if (channels instanceof Array) {
        const channelsToUse = new Collection();
        for (const channel of channels) {
          channelsToUse.set(channel.id, channel);
        }
        this.channels = channelsToUse;
      } else {
      this.channels = channels;
      }
    }
    if (members) {
      if (members instanceof Array) {
        const membersToUse = new Collection();
        for (const member of members) {
          membersToUse.set(
            (member instanceof GuildMember || member instanceof User) ?
            member.id :
            member.toString(), member,
          );
        }
        this.members = membersToUse;
      } else {
        this.members = members;
      }
    }
  }

  /**
   * Search for a member.
   * @param {string|RegExp} nameOrPattern The name/nickname to look for or pattern to test for
   * @returns {Array<MemberColl>} The result(s)
   */
  searchMember(nameOrPattern) {
    const pattern = nameOrPattern instanceof RegExp ?
    nameOrPattern :
    new RegExp(_.escapeRegExp(nameOrPattern), "i");
    const match = [];
    const getUser = member => member ? (member.user || member) : null;
    if (typeof nameOrPattern === "string" && Constants.regex.NAME_AND_DISCRIM.test(nameOrPattern)) {
      const result = this.members.find(memb => getUser(memb).tag === nameOrPattern);
      if (result) {
        match.push(result);
        return match;
      }
    }
    for (const [id, member] of this.members) {
      const userToUse = getUser(member);
      if (
        (typeof nameOrPattern === "string" && userToUse.username === nameOrPattern)
        || (typeof nameOrPattern !== "string" && pattern.test(userToUse.username))
        ) {
        match.push(member);
      }
    }
    if (match.length < 1 && typeof nameOrPattern === "string") {
      for (const [id, member] of this.members) {
        const userToUse = getUser(member);
        if (pattern.test(userToUse.username)) {
          match.push(member);
        }
      }
    }
    // if (match.length < 1) {
    for (const [id, member] of this.members) {
      if (pattern.test(member instanceof GuildMember ? member.nickname : getUser(member).username)) {
        let shouldContinue = false;
        match.forEach(m => {
          if (shouldContinue) {
            return;
          }
          if ((getUser(m) ? getUser(m).id : m) === (getUser(member) || { id: member }).id) {
            shouldContinue = true;
          }
        });
        if (shouldContinue) {
          continue;
        }
        match.push(member);
      }
    }
    // }
    if (match.length < 1 && typeof nameOrPattern === "string") {
      if (this.members.has(nameOrPattern)) {
        match.push(this.members.get(nameOrPattern));
      }
    }
    logger.debug(match.toString());
    return match;
  }

  /**
   * Search for a channel.
   * @param {string} nameOrPattern The channel name to search for or pattern to test for
   * @param {string[]|string} [type="text"] The channel type to look for. One of "text", "voice", "category", and "all"
   * @returns {Array<TextChannel|VoiceChannel|CategoryChannel>} The result(s)
   */
  /* public searchChannel(nameOrPattern: string | RegExp, type: "text"): TextChannel[];
  public searchChannel(nameOrPattern: string | RegExp, type: "voice"): VoiceChannel[];
  public searchChannel(nameOrPattern: string | RegExp, type: "all"): Array<TextChannel|VoiceChannel>; */
  searchChannel(nameOrPattern, type) {
    const pattern = nameOrPattern instanceof RegExp ?
    nameOrPattern :
    new RegExp(_.escapeRegExp(nameOrPattern), "i");
    let toLook = _.castArray(type).map(s => String(s).toLowerCase());
    toLook = toLook.length > 0 ?
      this.channels.filter(c => toLook.includes(c.type)) :
      this.channels;
    if (toLook.size < 1) return [];
    const match = [];
    for (const [id, channel] of toLook) {
      if (
        (typeof nameOrPattern === "string" && channel.name === nameOrPattern)
        || (typeof nameOrPattern !== "string" && pattern.test(channel.name))) {
        match.push(channel);
      }
    }
    if (match.length < 1 && typeof nameOrPattern === "string") {
      for (const [id, channel] of toLook) {
        if (pattern.test(channel.name)) {
          match.push(channel);
        }
      }
      if (match.length < 1 && toLook.has(nameOrPattern)) {
        match.push(toLook.get(nameOrPattern));
      }
    }
    return match;
  }

  /**
   * Search for a role.
   * @param {string|RegExp} nameOrPattern The name to look for or pattern to test for
   * @returns {Array<Role>} The result(s)
   */
  searchRole(nameOrPattern) {
    const pattern = nameOrPattern instanceof RegExp ?
    nameOrPattern :
    new RegExp(_.escapeRegExp(nameOrPattern), "i");
    const match = [];
    for (const [id, role] of this.roles) {
      if (
        (typeof nameOrPattern === "string" && role.name === nameOrPattern)
        || (typeof nameOrPattern !== "string" && pattern.test(role.name))
        ) {
        match.push(role);
      }
    }
    if (match.length < 1 && typeof nameOrPattern === "string") {
      for (const [id, role] of this.roles) {
        if (pattern.test(role.name)) {
          match.push(role);
        }
      }
      if (match.length < 1) {
        if (this.roles.has(nameOrPattern)) {
          match.push(this.roles.get(nameOrPattern));
        }
      }
    }
    return match;
  }
};
