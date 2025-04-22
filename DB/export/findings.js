const expressRouter = require("express").Router;
const { v4: uuidv4 } = require("uuid");
const database = require("./db");

const router = expressRouter();

router.post("/finding", (request, response, next) => {
  const newFinding = request.body.finding;
  newFinding.uuid = uuidv4();

  console.log(`Exporting finding: ${newFinding.uuid} from: ${newFinding.loc}`);
  database.getMongoConnection()
    .db()
    .collection(database.collection)
    .insertOne(newFinding)
    .then(insertResult => {
      response.status(201).json({
        message: "Successfully added finding to the database.",
        findingId: insertResult._id
      });
    })
    .catch(error => {
      console.error("Failed to export finding:");
      console.error(error);
      response.status(500).json({ message: "Internal server error occurred." });
    });
});

module.exports = router;
