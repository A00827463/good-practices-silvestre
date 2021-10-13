const express = require('express');
const router = express.Router();

const { requireLogin } = require('../middlewares/authentication');
const { uploadMiddleware } = require('../middlewares/upload');

// We use the corresponding controller here to handle the Report resource
// Now the routes are simply doing that: re-rerouting the request (including all of their context) to the corresponding controller.
const ReportController = require('../controllers/report');

router.use(requireLogin);

// Create
router.post("/", uploadMiddleware.single('photo'), ReportController.createReport);

// Read one
router.get('/:id', ReportController.getReport);

// Read all
router.get('/', ReportController.getAllReports);

// Update
router.put('/:id', uploadMiddleware.single('photo'), ReportController.updateReport);

// Delete
router.delete('/:id', ReportController.deleteReport);

// Get image
router.get('/images/:photoPath', ReportController.getReportImage);

module.exports = router;