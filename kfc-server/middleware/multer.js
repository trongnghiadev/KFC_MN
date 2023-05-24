const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, '/uploads/'))
    },
    filename: function (req, file, callback) {
        // Config file name
        callback(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        callback(null, true);
    }
    else callback({message: 'Unsupported file format'}, false);
}

const upload = multer ({
    storage: storage,
    fileFilter: fileFilter
})

module.exports = upload