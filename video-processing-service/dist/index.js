"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const app = (0, express_1.default)();
// for our express app to know that it should recieve a json u do the following:
app.use(express_1.default.json()); // this is middleware
//app.get("/", (req,res) => res.send("Hello world!"));
// here we define an express route, and its "/" (the homepage)
// when a user requests to access it, express looks for a route that matches it
// in this case its "/" so then the result is sending hello world to the user
app.post("/process-video", (req, res) => {
    // Get the path of the input video file from the request body
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;
    // sometimes the input/output file is not defined, so good to have an error check
    // Check if the input file path is defined
    if (!inputFilePath || !outputFilePath) {
        return res.status(400).send('Bad Request: Missing file path');
    }
    // Create the ffmpeg command
    (0, fluent_ffmpeg_1.default)(inputFilePath)
        .outputOptions('-vf', 'scale=-1:360') // 360p
        .on('end', function () {
        console.log('Processing finished successfully');
        res.status(200).send('Processing finished successfully');
    })
        .on('error', function (err) {
        console.log('An error occurred: ' + err.message);
        res.status(500).send('An error occurred: ' + err.message);
    })
        .save(outputFilePath);
});
// proper way of making variable port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
// listen for activity on the port and stays there (what makes it stay there?)
// and displays a log
