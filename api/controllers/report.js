const ReportService = require('../../services/report');

// Now the controller is using the services associated to the report resource.
// Here, we use the req,res, extracting whatever the service needs to work.

module.exports = {
    createReport: async (req, res, next) => {
        // Notice our app declared app.use(express.json()); for doing this

        // This is for sep attributes (postman)
        // let { name, price,photoPath } = req.body;
        // This is for single json field report (android)
        let { title, location, description, category, importance} = JSON.parse(req.body.report);
        // let { title, location, description, category, importance} = req.body.report;
        let temp = new Date(Date.now())
        var date = temp.getDate()+"/"+(temp.getMonth()+1);
        let time = temp.getHours() + ":" + temp.getMinutes();
        console.log(date, time);
        let importanceBool = 0;
        if(importance === "Urgent!!!" || importance === 1) importanceBool = 1;
        let status = 0; // Open report

        try {
            // Do not forget the await keyword otherwise you get a promise rather than an object
            const report = await ReportService.createReport(title, location, description, category, importance, status, req.file, date, time);
            res.status(201).json(report); // 201: Created
        } catch (err) {
            res.status(500).json({ "message": `error: ${err.message}` });
            console.log(err.message);
        }
    },

    getReport: async (req, res, next) => {
        const reportId = req.params.id;
        try {
            const report = await ReportService.getReport(reportId);
            if (report) {
                res.json(report);
            } else {
                res.status(404).json({ "message": "NotFound" }); // 404: Not found
            }
        } catch (err) {
            res.status(500).json({ "message": `Request for id ${reportId} caused an error` });
            console.log(err.message);
        }
    },

    getAllReports: async (req, res, next) => {
        try {
            const reports = await ReportService.getAllReports();
            res.json(reports);
        } catch (err) {
            res.status(500).end(`Request for all reports caused an error`);
            console.log(err.message);
        }
    },

    updateReport: async (req, res, next) => {
        const reportId = req.params.id;
        const { title, location, description, category, importance, status } = JSON.parse(req.body.report);
        let importanceBool = 0;
        if(importance === "!Urgent!") importanceBool = 1;
        let statusBool = 0;
        if(status === "Close") statusBool = 1;
        const { keepPhoto } = req.body;
        try {
            const report = await ReportService.getReport(reportId);
            if (report) {
                const updatedReport = await ReportService.updateReport(reportId, title, location, description, category, importanceBool, statusBool, req.file, keepPhoto)
                res.json(updatedReport);
            } else {
                res.status(404).json({ "message": `report with id ${reportId} does not exist` });
                console.log(`report with id ${reportId} does not exist`);
            }
        } catch (err) {
            res.status(500).end(`Request for updating reportId ${reportId} caused an error ${err.message}`);
        }
    },

    deleteReport: async (req, res, next) => {
        const reportId = req.params.id;
        try {
            const report = await ReportService.deleteReport(reportId);
            res.json(report);
        } catch (err) {
            res.status(500).json({ "message": `Request for deleting reportId ${reportId} caused an error` });
            console.log(err.message);
        }
    },

    getReportImage: async (req, res, next) => {
        // ! This is a violation for our controller scope, as we are accessing to file system right here.
        // ! It is possible to do it in the service, reading the file as bytes and constructing the content-type.
        // ! For didactic purposes, we can do it right here, but we know this should be in the service file
        let photoPath = req.params.photoPath;
        const path = require('path');
        var appRoot = require('app-root-path');
        const { reportsPhotoFolder } = require('../../config');
        let fullPath = path.join(appRoot + `/${reportsPhotoFolder}/` + photoPath);
        res.sendFile(fullPath);
    }
};