const { GraphQLUpload } = require("graphql-upload");
const {
  GraphQLSchema, //importing graphql schema
  GraphQLObjectType, //object type allows us to create a dynamic object full of different other types
  GraphQLBoolean
} = require("graphql");
const { createWriteStream } = require("fs");
const path = require("path");

/*
 * A manually constructed schema with an file upload mutation.
 */
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: {
      _dummy: { type: GraphQLBoolean }
    }
  }),
  mutation: new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
      /**
       * @Desc field uploadFile
       * @params accepts a file of type GraphQLUpload
       * @return return a boolean (true on succcess and false on failure)
       */
      uploadFile: {
        description: "Uploads a file.",
        type: GraphQLBoolean,
        args: {
          file: {
            description: "Uploaded file",
            type: GraphQLUpload
          }
        },
        async resolve(parent, { file }) {
          try {
            const { filename, mimetype, createReadStream } = await file;
            const stream = createReadStream();
            // Promisify the stream and store the file
            await new Promise(res =>
              createReadStream()
                .pipe(createWriteStream(path.join(__dirname, "./", filename))) //Saving file in server's root folder
                .on("close", res)
            );
            return true;
          } catch (err) {
            console.error(err);
            return false;
          }
        }
      }
    })
  })
});

module.exports = schema;
