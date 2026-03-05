import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
// for our express app to know that it should recieve a json u do the following:
app.use(express.json()); // this is middleware

//app.get("/", (req,res) => res.send("Hello world!"));
// here we define an express route, and its "/" (the homepage)
// when a user requests to access it, express looks for a route that matches it
// in this case its "/" so then the result is sending hello world to the user
app.post("/process-video", (req,res) => {
     // Get the path of the input video file from the request body
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    // sometimes the input/output file is not defined, so good to have an error check
    // Check if the input file path is defined
    if (!inputFilePath || !outputFilePath) {
        return res.status(400).send('Bad Request: Missing file path');
    }

      // Create the ffmpeg command
    ffmpeg(inputFilePath)
        .outputOptions('-vf', 'scale=-1:360') // 360p
        .on('end', function() {
            console.log('Processing finished successfully');
            res.status(200).send('Processing finished successfully');
        })
        .on('error', function(err: any) {
            console.log('An error occurred: ' + err.message);
            res.status(500).send('An error occurred: ' + err.message);
        })
        .save(outputFilePath);

})

// proper way of making variable port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
// listen for activity on the port and stays there (what makes it stay there?)
// and displays a log