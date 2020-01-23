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
const waitDB = conn => {
  return new Promise((resolve, reject) => {
    if (conn == null) {
      mongoose
        .createConnection(dbURI, {
          bufferCommands: false,
          bufferMaxEntries: 0
        })
        .then(res => {
          console.log("Called");
          res.model("Item", new mongoose.Schema(itemSchema));
          resolve(res);
        })
        .catch(err => {
          reject("rejected");
        });
    } else {
      resolve(conn);
    }
  });
};
module.exports.createItem = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  conn = await waitDB(conn);
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
    const errorRes = {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server error" })
    };
    return errorRes;
  }
};
module.exports.getItem = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  conn = await waitDB(conn);
  const item = conn.model("Item");
  try {
    const answer = await item.find({});
    const response = {
      statusCode: 200,
      body: JSON.stringify(answer)
    };
    return response;
  } catch {
    const errorRes = {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server error" })
    };
    return errorRes;
  }
};
module.exports.oneItem = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  conn = await waitDB(conn);
  const item = conn.model("Item");
  const _id = event.pathParameters.id;
  try {
    const answer = await item.find({ _id });
    const response = {
      statusCode: 200,
      body: JSON.stringify(answer)
    };
    return response;
  } catch {
    const errorRes = {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server error" })
    };
    return errorRes;
  }
};
module.exports.deleteItem = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  conn = await waitDB(conn);
  const item = conn.model("Item");
  const _id = event.pathParameters.id;
  try {
    await item.remove({ _id });
    const response = {
      statusCode: 200,
      body: JSON.stringify({ message: "File deleted" })
    };
    return response;
  } catch {
    const errorRes = {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server error" })
    };
    return errorRes;
  }
};
module.exports.updateItem = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  conn = await waitDB(conn);
  const data = JSON.parse(event.body);
  const itemObject = {
    name: data.name,
    cost: data.cost
  };
  const item = conn.model("Item");
  const _id = event.pathParameters.id;
  try {
    await item.findByIdAndUpdate(_id, itemObject);
    const response = {
      statusCode: 200,
      body: JSON.stringify({ message: "File updated" })
    };
    return response;
  } catch {
    const errorRes = {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server error" })
    };
    return errorRes;
  }
};
