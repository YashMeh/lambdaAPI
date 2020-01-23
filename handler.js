const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const dbURI = process.env.dbURI; // MongoDB Url
const itemSchema = {
  name: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  }
};
let conn = null;
const createErrorResponse = (statusCode, message) => ({
  statusCode: statusCode || 501,
  headers: { "Content-Type": "text/plain" },
  body: message || "Incorrect id"
});
module.exports.createItem = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (conn == null) {
    conn = await mongoose.createConnection(dbURI, {
      bufferCommands: false,
      bufferMaxEntries: 0
    });
    conn.model("Item", new mongoose.Schema(itemSchema));
  }
  const data = JSON.parse(event.body);
  const itemObject = {
    name: data.name,
    cost: data.cost
  };
  const item = conn.model("Item");
  try {
    const answer = await item.create(itemObject);
    const response = {
      statusCode: 200,
      body: JSON.stringify({ id: answer._id })
    };
    return response;
  } catch {
    const errorRes = createErrorResponse(500, "Internal Server error");
    return errorRes;
  }
};
module.exports.getItem = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (conn == null) {
    conn = await mongoose.createConnection(dbURI, {
      bufferCommands: false,
      bufferMaxEntries: 0
    });
    conn.model("Item", new mongoose.Schema(itemSchema));
  }
  const item = conn.model("Item");
  try {
    const answer = await item.find({});
    const response = {
      statusCode: 200,
      body: JSON.stringify(answer)
    };
    return response;
  } catch {
    const errorRes = createErrorResponse(500, "Internal Server error");
    return errorRes;
  }
};
