const UrlModel = require('../models/urlModel');
const mime = require('mime-types');
var path = require('path');
var ffmpeg = require('fluent-ffmpeg');
const stream = require('stream');
const fs = require('fs');
const os = require('os');
const { promisify } = require('util');
const mmmagic = require('mmmagic');
const authController = require('./authController')
const historyModel = require('../models/historyModel')
const writeFileAsync = promisify(fs.writeFile);
const unlinkFileAsync = promisify(fs.unlink);
const urlController = {
    getFeedUrl: async (req, res) => {
        try {
            const feedUrl = await UrlModel.getFeedUrl();
            res.status(200).json(feedUrl);
        } catch (error) {
            console.error('Error fetching feed URL:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    },

    getVideoUrl: async (req, res) => {
        try {
            const videoUrl = await UrlModel.getVideoUrl();
            res.status(200).json(videoUrl);
        } catch (error) {
            console.error('Error fetching video URL:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    },

    getPolitiqueUrl: async (req, res) => {
        try {
            const politiqueUrl = await UrlModel.getPolitiqueUrl();
            res.status(200).json(politiqueUrl);
        } catch (error) {
            console.error('Error fetching politique PDF URL:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    },

    updateVideoUrl: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file provided.' });
            }
            const validVideoExtensions = ['.mp4', '.mpeg', '.webm', '.ogg', '.quicktime'];
            const fileExtension = await path.extname(req.file.originalname).toLowerCase();
            const mimeType = await mime.lookup(req.file.originalname);
           // const valid = await urlController.isVideoFile(req.file.buffer);
            const magic = new mmmagic.Magic(mmmagic.MAGIC_MIME_TYPE);

            const mimeTypes = await magic.detect(req.file.buffer, async function(err, result) {
                if (err) throw err;
                console.log(result);
                if (!validVideoExtensions.includes(fileExtension) || !mimeType.startsWith('video/') || !result.startsWith('video/') ) {
                    return res.status(400).send('Invalid file type. Please upload a video file. 1');
                }
                else
                {
                    const result = await UrlModel.updateVideo(req.file.buffer, req.file.originalname);
                    res.status(200).json(result);
                    const Adminname  = await authController.getuidFromToken(req);

                    await historyModel.AddHistoryData(Adminname,"updated the video to",req.file.originalname ,"");
                   
        
                }
                // output: Python script, ASCII text executable
            });

            // if (!mimeTypes.startsWith('video/')) {
            //     return res.status(400).send('Invalid file type. Please upload a video.');
            // }
            // await urlController.analyzeVideo(req.file.buffer, req.file.originalname)
            //     .then(() => {
            //         console.log('Video analysis completed.');
            //     })
            //     .catch((error) => {
            //         console.error('Error analyzing video:', error);
            //     });

           
          
            
        } catch (error) {
            console.error('Error updating video URL:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    },

    updateFeedUrl: async (req, res) => {
        try {
            const updatedUrl = req.body.url;
            if (!req.body || !req.body.url) {
                return res.status(400).json({ error: 'No details provided.' });
              }
            await UrlModel.updateFeedUrl(updatedUrl);
            res.status(200).json({ message: 'Feed URL updated successfully.' });

            const Adminname  = await authController.getuidFromToken(req);

            await historyModel.AddHistoryData(Adminname,"updated the feed url to",updatedUrl ,"");
        } catch (error) {
            console.error('Error updating feed URL:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    },

    updatePolitiqueUrl: async (req, res) => {
        try {
            const updatedUrl = req.body.url;
            if (!req.body || !req.body.url) {
                return res.status(400).json({ error: 'No details provided.' });
              }
            await UrlModel.updatePDFUrl(updatedUrl);
            res.status(200).json({ message: 'Politique PDF URL updated successfully.' });

            const Adminname  = await authController.getuidFromToken(req);

            await historyModel.AddHistoryData(Adminname,"updated the Politique pdf url to",updatedUrl ,"");
        } catch (error) {
            console.error('Error updating politique PDF URL:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    },


    isVideoFile: async function (buffer) {
        // Define magic bytes for various video file types
        const videoExtensions = ['.mp4', '.mpeg', '.webm', '.ogg', '.quicktime'];
        const magicBytes = {
            '.mp4': [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d, 0x00, 0x00, 0x02, 0x00],
            '.webm': [0x1a, 0x45, 0xdf, 0xa3],
            '.ogg': [0x4f, 0x67, 0x67, 0x53],
            '.quicktime': [0x00, 0x00, 0x00, 0x14, 0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20, 0x00, 0x00, 0x00, 0x00],
        };
    
        // Read the first few bytes of the buffer
        const headerBytes = buffer.slice(0, 16);
    
        // Check if the header bytes match any of the known video file types
        for (const ext of videoExtensions) {
            const magic = magicBytes[ext];
            if (magic) {
                const isMatch = magic.every((byte, index) => byte === headerBytes[index]);
                if (isMatch) {
                    return true;
                }
            }
        }
    
        return false;
    },

    analyzeVideo : async function (buffer, fileName) {
        // Create a temporary file path
        const tempFilePath = path.join(os.tmpdir(), fileName);
    
        try {
            // Write the buffer to the temporary file
            await writeFileAsync(tempFilePath, buffer);
            const ffprobe = promisify(ffmpeg.ffprobe);
            // Use ffprobe to analyze the temporary file
            const ffprobeOutput = await ffprobe(tempFilePath);
    
            // Delete the temporary file
            await unlinkFileAsync(tempFilePath);
    
            // Process the ffprobe output as needed
            console.log(ffprobeOutput);
            return ffprobeOutput;
        } catch (error) {
            console.error('Error analyzing video:', error);
            throw error;
        }
    }
    
};

module.exports = urlController;
