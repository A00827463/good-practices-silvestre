var appRoot = require('app-root-path');
const { reportsPhotoFolder } = require('../config');
const fs = require('fs');
const path = require('path');
const ReportModel = require('../models/report');

// Now this service is providing whatever is needed to interact with the database but at the same time
// validating the BLL requirements.

const createReport = async (title, location, description, category, importance, status, file, date, time) => {
    // there was an attached file!
    console.log(date, time);
    const report = new ReportModel({ title: title, location: location, category: category, importance: importance, status: status, date: date, time: time});

    if (description) report.description = description;
    if (file) report.photoPath = file.filename;

    // All validation, checks, further tasks (sending emails, etc.) must happen here.
    const newReport = await report.save();
    return newReport;
};

const getReport = async (id) => {
    const report = await ReportModel.findById(id);
    // const report = await ReportModel.findOne({_id = id});
    // const report = await ReportModel.findById(id).select("name price");
    // const report = await ReportModel.findById(id, "name price");
    return report;
};

const getAllReports = async () => {
    const reports = await ReportModel.find({});
    // const reports = await ReportModel.find({}).select("name price"); 
    // or
    // const reports = await ReportModel.find({}, "name price");
    return reports;
};

const updateReport = async (id, title, location, description, category, importance, status, file, keepPhoto) => {
    const report = await ReportModel.findById(id);
    report.title = title;
    report.location = location;
    report.description = description;
    report.category = category;
    report.importance = importance;
    report.status = status;

    const previousPicture = report.photoPath
    let removePhoto = false;


    if (file) {
        // User uploaded an image, this will overwrite the previous image
        report.photoPath = file.filename;
    } else {
        // User did not upload an image, here it might mean to drop the image, keepPhoto will tell
        if (!keepPhoto) {
            report.photoPath = null;
            removePhoto = true;
        }
    }

    await report.save();
    if (removePhoto) deletePhoto(previousPicture)
    return report;
}

const deleteReport = async (id) => {
    const report = await ReportModel.findOneAndDelete({ _id: id });
    if (report.photoPath) {
        deletePhoto(report.photoPath);
    }
    return report;
}

function deletePhoto(photoPath) {
    let fullPath = path.join(appRoot + `/${reportsPhotoFolder}/` + photoPath)
    fs.unlink(fullPath, (err) => {
        if (err) {
            console.error(`Error when deleting photo from fs ${err.message}`)
        } else {
            console.log(`Photo ${photoPath} deleted successfully`);
        }
    })
}

module.exports = {
    createReport,
    getReport,
    getAllReports,
    updateReport,
    deleteReport
};
