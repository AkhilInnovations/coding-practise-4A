const express = require("express");
const app = express();
app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3003, () => {
      console.log("Server Running at http://localhost:3003/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

app.get("/players/", async (request, response) => {
  const getBooksQuery = `
    SELECT * FROM cricket_team`;
  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
  //   console.log(booksArray);
});

module.exports = app;

//post API2
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_id, player_name, jersey_number, role } = playerDetails;
  const addBooksQuery = `
    INSERT INTO 
        cricket_team (player_id, player_name, jersey_number, role)
    VALUES (
        ${player_id},
        ${player_name},
        ${jersey_number},
        ${role}
    ); `;
  const dbResponse = await db.run(addBooksQuery);
  const playerID = dbResponse.lastID;
  response.send("Player Added to Team");
});
