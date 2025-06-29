// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');
const multer = require('multer');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Convert HTML to PPT endpoint
app.post('/convert', upload.single('htmlFile'), (req, res) => {
    try {
        if (!req.file && !req.body.htmlContent) {
            return res.status(400).send('No HTML content or file provided');
        }

        let htmlContent = req.body.htmlContent;
        
        // If file was uploaded, read its content
        if (req.file) {
            const filePath = path.join(__dirname, req.file.path);
            htmlContent = fs.readFileSync(filePath, 'utf8');
            // Clean up the uploaded file
            fs.unlinkSync(filePath);
        }

        // Create a new PowerPoint presentation
        const pptx = new PptxGenJS();

        // Add a slide
        const slide = pptx.addSlide();

        // Add HTML content as text (simplified - for complex HTML you'd need parsing)
        // Note: pptxgenjs has limited HTML support, you might need to extract text or use images
        slide.addText(htmlContent, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 6,
            fontSize: 12,
            color: '363636'
        });

        // Generate the PPTX file
        const fileName = `converted-${Date.now()}.pptx`;
        const filePath = path.join(__dirname, 'converted', fileName);

        pptx.writeFile(filePath)
            .then(() => {
                // Send the file for download
                res.download(filePath, fileName, (err) => {
                    if (err) {
                        console.error('Download error:', err);
                    }
                    // Clean up the generated file
                    fs.unlinkSync(filePath);
                });
            })
            .catch(err => {
                console.error('PPT generation error:', err);
                res.status(500).send('Error generating PowerPoint file');
            });

    } catch (error) {
        console.error('Conversion error:', error);
        res.status(500).send('Error converting HTML to PowerPoint');
    }
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create necessary directories if they don't exist
const dirs = ['uploads', 'converted'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
