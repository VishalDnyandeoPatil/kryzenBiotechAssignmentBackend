const express = require('express');
const axios = require('axios');
const router = express.Router();
const FormData = require('../model/FormData');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const PDFDocument = require('pdfkit');

// Create form data
router.post('/submit', authMiddleware, upload.single('photo'), async (req, res) => {
    try {
        const { name, age, address } = req.body;
        const photoUrl = req.file.path;

        const formData = new FormData({
            userId: req.userId,
            name,
            age,
            address,
            photoUrl,
        });
        await formData.save();
        res.status(201).json({ message: 'Form data submitted successfully' });
    } catch (error) {
        console.error('Error submitting form data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// preview route
router.get('/preview', authMiddleware, async (req, res) => {
    try {
        const formData = await FormData.findOne({ userId: req.userId }).sort({ _id: -1 });

        if (!formData) {
            return res.status(404).json({ message: 'Form data not found' });
        }

        res.status(200).json(formData);

    } catch (error) {
        console.error('Error fetching form data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// genrate pdf route
// router.get('/generate-pdf',  async (req, res) => {
//     try {
//         const formData = await FormData.findOne().sort({ _id: -1 });
 
//         if (!formData) {
//             return res.status(404).json({ message: 'Form data not found' });
//         }

//         const formDetails = {
//             name: formData.name,
//             age: formData.age,
//             address: formData.address,
//             photoUrl: formData.photoUrl,
//           };

//         const pdfDoc = new PDFDocument();
//         // res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('Content-Disposition', `attachment; filename=${formDetails.name}.pdf`);
//         pdfDoc.pipe(res);

//         // Add content to the PDF
//         pdfDoc.text(`Name: ${formDetails.name}`);
//         pdfDoc.text(`Age: ${formDetails.age}`);
//         pdfDoc.text(`Address: ${formDetails.address}`);

//         if(formDetails.photoUrl==){
//             console.log(formDetails.photoUrl);
//             // const responceImage = await axios.get(formDetails.photoUrl, { responseType: 'arraybuffer' });

//             const responceImage = await axios.get(formDetails.photoUrl, { responseType: 'arraybuffer' });

//             const imageBuffer= Buffer.from(responceImage.data);

//             const imageXaxis= 100;
//             const imageYaxis= pdfDoc.y+10;

//             pdfDoc.rect(imageXaxis-5,imageYaxis-5,210,210).stroke('#3498db');

//             pdfDoc.image( imageBuffer , imageXaxis, imageYaxis, { width: 200 , height:200 });
//         }

//         pdfDoc.end();
//     } catch (error) {
//         console.error('Error generating PDF:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

router.get('/generate-pdf', authMiddleware, async (req, res) => {
    try {
        const formData = await FormData.findOne({ userId: req.userId }).sort({ _id: -1 });

        if (!formData) {
            return res.status(404).json({ message: 'Form data not found' });
        }

        const pdfDoc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${formData.name}.pdf`);
        pdfDoc.pipe(res);
        console.log(formData.photoUrl)

        // Add content to the PDF
        pdfDoc.text(`Name: ${formData.name}`);
        pdfDoc.text(`Age: ${formData.age}`);
        pdfDoc.text(`Address: ${formData.address}`);

        if (formData.photoUrl) {
            const imageXaxis = 100;
            const imageYaxis = pdfDoc.y + 10;

            pdfDoc.rect(imageXaxis - 5, imageYaxis - 5, 210, 210).stroke('#3498db');

            // Use the image URL directly
            pdfDoc.image(formData.photoUrl, imageXaxis, imageYaxis, { width: 200, height: 200 });
        }

        pdfDoc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
