import { Connection, Model, Schema } from 'mongoose'

import { UserAccessTokenTypes, UserDocument } from '../types'

import * as passwordHelpers from '../utils/passwordHelpers'

export const collection = 'User'

const schema: Schema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, index: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accessTokens: [
      new Schema(
        {
          value: { type: String, required: true, index: true },
          type: {
            type: String,
            required: true,
            enum: Object.values(UserAccessTokenTypes),
          },
          createdAt: { type: Date, required: true, default: Date.now },
        },
        { _id: false },
      ),
    ],
  },
  {
    collection,
    versionKey: false,
    autoIndex: true,
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
    _id: true,
  },
)

schema.index(
  {},
  {
    background: true,
  },
)

schema.pre('save', function save(next) {
  const user = this as UserDocument

  const passwordIsModified = user.isModified('password')
  if (passwordIsModified) {
    user.password = passwordHelpers.genarate(user.password)
  }

  next()
})

schema.methods.comparePassword = function compare(password: string) {
  const user = this as UserDocument
  return passwordHelpers.compare(password, user.password)
}

export const createModel = (connection: Connection): Model<UserDocument> =>
  connection.model(collection, schema)