const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema(
    {
            workername: { type: String, required: true },
            contact: { type:String,required:true},
            address:{ type:String,required:true},
            experience:{ type:String,required:true},
            specialty: { type:String,required:true},
            category:{type:String, required:true},
            ratings: [{ type: Number }] ,
            adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
            location: { 
                latitude: Number,
                longitude: Number,
                address: String,
            },
          
    }
)

module.exports = mongoose.model("Worker", workerSchema);
