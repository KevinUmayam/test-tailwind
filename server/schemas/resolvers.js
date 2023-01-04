const {
  AuthenticationError,
  UserInputError,
} = require("apollo-server-express");
const { User, Character, Quest } = require("../models");
const { signToken } = require("../utils/auth");
const { dateScalar } = require("./customScalars");

const resolvers = {
  Date: dateScalar,
  // what else do we want to query for? other users, characters (based on user ID)
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("Must be logged in.");
      }
      return await User.findOne({ _id: context.user._id }).populate(
        "quests",
        "characters"
      );
    },
    users: async () => {
        return await User.find().populate("characters", "quests");
    },
    user: async (parent, { username }) => {
      return await User.findOne({ username }).populate("characters", "quests");
    },
    quests: async (parent, { username }) => {
      return await Quest.find({ username }).populate("comments");
    },
    questByID: async (parent, { questId }) => {
        return await Quest.findOne({ _id: questId });
    },
    character: async (parent, { characterId }) => {
        return await Character.findOne({ _id: characterId });
    }
  },
  Mutation: {
    createUser: async (parent, { email, password, username }) => {
        const user = await User.create({ email, password, username });
        const token = signToken(user);
        return { token, user };
    },
    login: async (parent, {email, password }) => {
        const user = await User.findOne({ email });

        if (!user) {
            throw new AuthenticationError("No user with this email address");
        }

        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
            throw new AuthenticationError("Incorrect credentials");
        }

        const token = signToken(user);

        return { token, user };

    },
    createQuest: async (
        parent, {
            dateTime, 
            questTitle,
            questDescription, 
            partySize, 
            questLocation,
        }, 
        context) => {
            if (context.user) {
                const quest = await Quest.create({
                    dateTime, 
                    poster: context.user.username,
                    questTitle,
                    questDescription, 
                    partySize, 
                    questLocation,
                });

                await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: {quests: quest._id } }
                );

                return quest;
            }
            throw new AuthenticationError("You need to be logged in");
        },
    createCharacter: async (parent, {
        charName, 
        level, 
        race,
        role, 
        alignment,
        strength,
        dexterity,
        constitution,
        wisdom,
        charisma,
        experience,
    },
    context
    ) => {
      if (context.user) {
        const character = await Character.create({
            createdBy: context.user.username,
            charName, 
            level,
            race,
            role, 
            alignment,
            strength,
            dexterity,
            constitution,
            wisdom, 
            charisma,
            experience,
        });

        await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: {characters: character._id }}
        )
        return character;
      }
      throw new AuthenticationError("You need to be logged in");
    },
    // added deleteQuest, deleteComment, deleteChar
    addComment: async (parent, { questId, commentText }, context) => {
        if (context.user) {
            return Quest.findOneAndUpdate(
                { _id: questId },
                { $addToSet: {
                    comments: { commentText,
                    commentAuthor: context.user.username },
                },
            },
            {
                new: true,
                runValidators: true, 
            }
            );
        }
        throw new AuthenticationError("You need to be logged in");
    },
    deleteQuest: async (parents, { meetupId }, context) => {
      if (context.user) {
        const quest = await Quest.findOneAndDelete({
          _id: questId,
          poster: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { quests: quest._id } }
        );

        return quest;
      }
      throw new AuthenticationError("You must be logged in!");
    },
    deleteComment: async (parent, { questId, commentId }, context) => {
      if (context.user) {
        return Quest.findOneAndUpdate(
          { _id: questId },
          {
            $pull: {
              comments: {
                _id: commentId,
                commentAuthor: context.user.username,
              },
            },
          },
          { new: true }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    deleteCharacter: async (parent, { characterId }, context) => {
      if (context.user) {
        const character = await Character.findOneAndDelete({
          _id: characterId,
          createdBy: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { characters: character._id } }
        );

        return character;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
