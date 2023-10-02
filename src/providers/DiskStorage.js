const fs = require('fs')
const path = require('path')
const UploadConfig = require('../configs/upload')

class DiskStorage {
    async saveFile(file) {
        await fs.promises.rename(
            //get avatar file from tmp_folder
            path.resolve(UploadConfig.TMP_FOLDER, file),
            //put avatar in uploads_folder
            path.resolve(UploadConfig.UPLOADS_FOLDER, file)
        )

        return file
    }
    async deleteFile(file) {
        const filePath = path.resolve(UploadConfig.UPLOADS_FOLDER, file)
        console.log(filePath)
        
        try {
            // .stat returns the state of the file
            //if file is open in another processs, if its affected, etc..
            await fs.promises.stat(filePath)
        } catch {
            return 
        }

        //unlink fn deletes the file
        await fs.promises.unlink(filePath)
    }
}

module.exports = DiskStorage