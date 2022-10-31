var compression = require("compression");
const express = require("express");
const cors = require("cors");

const app = express();

const shouldCompress = (req, res) => {
	if (req.headers["x-no-compression"]) {
		// Will not compress responses, if this header is present
		return false;
	}
	// Resort to standard compression
	return compression.filter(req, res);
};

//For now allowing all the origins and headers and sending 200 status to preflight call
var corsOptions = {
	origin: "*",
	allowedHeaders:"*",
	optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//use compression
app.use( compression({ filter: shouldCompress, threshold: 0, }) );

// simple route for health check
app.get("/", (req, res) => {
	res.json({ message: "Ok." });
});


require("./app/routes/users.route.js")(app);

// set port, listen for requests
const PORT = 5051;
module.exports = app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});