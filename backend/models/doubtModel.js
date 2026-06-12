import { Schema, model } from "mongoose";

const doubtSchema = new Schema(
  {
    resourceId: {
    type: Schema.Types.ObjectId,
    ref: "resource",
    required: true
},

    title: {
      type: String,
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
    },

    topic: {
      type: String,
    },

    askedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },

    answers: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },

        message: {
          type: String,
          required: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    solved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
  }
);

export const DoubtModel = model(
  "doubt",
  doubtSchema
);