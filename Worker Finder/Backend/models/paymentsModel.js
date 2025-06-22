const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema (
    {
      adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
      admin_name : String,
      workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true },
      worker_name : String,
      client : String,
      contact : Number,
      amount: Number,
      method: String,
      paymentId: String,
      orderId: String,
      signature: String,
      date: Date,
    }
);

module.exports = mongoose.model("Payment" , paymentSchema);