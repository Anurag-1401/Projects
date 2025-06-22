const worker = require('../models/workerModel');

const addWorker =  async (req, res) => {
  const { adminId, workername, contact, address, experience, specialty,location } = req.body;

  if (!adminId) {
    return res.status(400).json({ error: "Admin ID is required" });
  }
    try {
        const exists = await worker.findOne({workername, address, adminId });
        const category = req.path.replace('/add', '');

        if (exists) {
          return res.status(400).json({ message: "Worker already exists!" });
        }

        const newWorker = new worker({
          workername,
          contact,
          address,
          experience,
          specialty,
          category,
          adminId,
          location 
        });    
        
        await newWorker.save();
      res.status(201).json({newWorker, message:`${category} created successfully`});
    }catch (error) {
      console.error("Error in addWorker:", error); 
      res.status(500).json({ error: "Failed to add worker", details: error.message });
  }
};  

const getWorker = async (req, res) => {
  try {
    let workers;
    const category = req.path.split('/')[1].replace('get', '');
    const { adminId } = req.params;
    let { latitude, longitude } = req.query;

    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: "Latitude & Longitude must be valid numbers" });
    }

    if (!adminId) {
      return res.status(400).json({ error: "Admin ID is required" });
    }

    if (adminId === "all") {
      workers = await worker.find({
        category,
        "location.latitude": { $gte: latitude - 0.1, $lte: latitude + 0.1 },
        "location.longitude": { $gte: longitude - 0.1, $lte: longitude + 0.1 },
      });
    } else {
      workers = await worker.find({ adminId });
    }

    if (workers.length === 0) {
      return res.status(404).json({ message: "No workers found for this category" });
    }

    const workersWithRatings = workers.map(worker => {
      const averageRating = worker.ratings.length
        ? (worker.ratings.reduce((acc, val) => acc + val, 0) / worker.ratings.length).toFixed(1)
        : "No ratings";
      return { ...worker.toObject(), averageRating };
    });

    res.json({ workers: workersWithRatings });
  } catch (error) {
    console.error("Error in getWorker:", error);
    res.status(500).json({ error: "Failed to fetch workers", details: error.message });
  }
};



  const deleteWorker = async (req, res) => {
    try {
      await worker.findByIdAndDelete(req.params.id);
      res.json({ message: "Worker deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete worker" ,details: error.message});
    }
  };

  const rateWorker = async (req, res) => {
    try {
        const { rating } = req.body;
        const { workerId } = req.params;

        const workerData = await worker.findById(workerId);
        if (!workerData) {
            return res.status(404).json({ message: "Worker not found" });
        }

        workerData.ratings = workerData.ratings || [];
        workerData.ratings.push(rating);

        const averageRating = (workerData.ratings.reduce((acc, val) => acc + val, 0) / workerData.ratings.length).toFixed(1);

        workerData.averageRating = averageRating;
        await workerData.save();

        res.status(200).json({ 
            message: "Rating submitted successfully!", 
            averageRating,
            updatedWorker: workerData.ratings
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to submit rating", details: error.message });
    }
};



  module.exports = {addWorker , getWorker , deleteWorker, rateWorker};