const { gql } = require("apollo-server-express");

const typeDefs = gql`
  "Unix time stamp in milliseconds."
  scalar Date

  type Auth {
    token: ID!
    user: User
  }
  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    quests: [Quest]
    characters: [Character]
  }
  type Character {
    _id: ID
    charName: String!
    level: Int!
    race: String!
    role: String!
    alignment: String!
    strength: Int!
    dexterity: Int!
    constitution: Int!
    wisdom: Int!
    charisma: Int!
    experience: Int!
    createdBy: String!
  }
  type Quest {
    _id: ID
    dateTime: Date!
    poster: String!
    questTitle: String!
    questDescription: String!
    partySize: Int!
    questLocation: String!
    questPostDate: Date
    comments: [Comment]
  }
  type Comment {
    _id: ID
    commentText: String!
    commentAuthor: String!
    createdAt: Date!
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    quests(username: String): [Quest]
    questByID(id: ID!): Quest
    characters: [Character]
    character(characterId: ID!): [Character]
  }

  type Mutation {
    login(email: String!, password: String!): Auth

    createUser(
      email: String!,
      password: String!,
      username: String!
    ): Auth

    createCharacter(
      charName: String!,
      level: Int!,
      race: String!,
      class: String!,
      alignment: String!,
      strength: Int!,
      dexterity: Int!,
      constitution: Int!,
      wisdom: Int!,
      charisma: Int!,

      experience: Int!
    ): Character

    createQuest(
      dateTime: String!,
      poster: String!,
      questTitle: String!,
      questDescription: String!,
      partySize: Int!,
      questLocation: String!,
      questPostDate: Date!
    ): Quest
    
    addComment(questId: ID!, commentText: String!): Quest

    deleteQuest(questId: ID!): Quest

    deleteComment(questId: ID!, commentId: ID!): Comment

    deleteCharacter(characterId: ID!): Character
  }
`;

module.exports = typeDefs;
