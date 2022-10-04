const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const PORT = 3000;

mongoose.connect(process.env.MONGODB_URL);

const vehicleSchema = {
  licensePlateNumber: Number,
  manufacturerName: String,
  model: String,
  fuelType: String,
  ownerName: String,
  rc_status: String,
  vehicleColor: String,
  registrationDate: Date,
  insuranceUpto: Date,
  fitnessUpto: Date,
  roadTaxUpto: Date
}

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

///////////////////////////////////////Targetting all the Vehicle's Data/////////////////////////////////////////////

app.route("/vehicles")

  //Get Route for Vehicle's data
  .get(function(req, res) {
    Vehicle.find(function(err, foundVehicles) {
      res.send(foundVehicles);
    });
  })

  //Post Route for Vehicle's data
  .post(function(req, res) {

    const newVehicle = new Vehicle({
      licensePlateNumber: req.body.licensePlateNumber,
      manufacturerName: req.body.manufacturerName,
      model: req.body.model,
      fuelType: req.body.fuelType,
      ownerName: req.body.ownerName,
      rc_status: req.body.rc_status,
      vehicleColor: req.body.vehicleColor,
      registrationDate: req.body.registrationDate,
      insuranceUpto: req.body.insuranceUpto,
      fitnessUpto: req.body.fitnessUpto,
      roadTaxUpto: req.body.roadTaxUpto
    });
    newVehicle.save(function(err) {
      if (!err) {
        res.send("Succesfully added the new Vehicle's data");
      } else {
        res.send(err);
      }
    });
  })

  //Delete Route for Vehicle's data
  .delete(function(req, res) {
    Vehicle.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted.");
      } else {
        res.send(err);
      }
    });
  });

///////////////////////////////////////Targetting Particular Data of Vehicle/////////////////////////////////////////////

//Get Route for Vehicle's Particular data
app.route("/vehicles/:vehicleOwner")
  .get(function(req, res) {
    Vehicle.findOne({
      ownerName: req.params.vehicleOwner
    }, function(err, foundVehicle) {
      if (foundVehicle) {
        res.send(foundVehicle)
      } else {
        res.send("No matching Vehicle with that Owner");
      }
    });
  })

  //Update Route for Vehicle's Particular data
  .patch(function(req, res) {
    Vehicle.updateOne({
        ownerName: req.params.vehicleOwner
      }, {
        $set: req.body
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated the vehicle's data");
        }
      }
    );
  })

  //Delete Route for Vehicle's Particular data
  .delete(function(req, res) {
    Vehicle.deleteOne({
        ownerName: req.params.vehicleOwner
      },
      function(err) {
        if (!err) {
          res.send("Successfully deleted the Vehicle's data");
        }
      }
    );
  });

///////////////////////////////////////Targetting all the Violations's Data/////////////////////////////////////////////

const violationSchema = {
  licensePlateNumber: String,
  violationType: String,
  status: String,
  date: Date,
  time: Date,
  location: String,
  videoUrl: String
}

const Violation = mongoose.model("Violation", violationSchema);

app.route("/violations")

  //Get Route for Violation's data
  .get(function(req, res) {
    Violation.find(function(err, foundViolations) {
      res.send(foundViolations);
    });
  })

  //Post Route for Violation's data
  .post(function(req, res) {

    const newViolation = new Violation({
      licensePlateNumber: req.body.licensePlateNumber,
      violationType: req.body.violationType,
      status: req.body.status,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      videoUrl: req.body.videoUrl
    });
    newViolation.save(function(err) {
      if (!err) {
        res.send("Successfully add the new Violation")
      } else {
        res.send(err);
      }
    });
  })

  //Delete Route for Violation's data
  .delete(function(req, res) {
    Violation.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted.");
      } else {
        res.send(err);
      }
    });
  });

///////////////////////////////////////Targetting Particular Vehicle Violation Data/////////////////////////////////////////////

app.route("/violations/:vehicleOwner")

  //Get Route for Violation's Particular data
  .get(function(req, res) {
    Violation.findOne({
      ownerName: req.params.vehicleOwner
    }, function(err, foundVehicle) {
      if (foundVehicle) {
        res.send(foundVehicle)
      } else {
        res.send("No matching Vehicle with that Owner");
      }
    });
  })

  //Update Route for Violation's Particular data
  .patch(function(req, res) {
    Violation.updateOne({
        ownerName: req.params.vehicleOwner
      }, {
        $set: req.body
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated the vehicle's data");
        }
      }
    );
  })

  //Delete Route for Violation's Particular data
  .delete(function(req, res) {
    Violation.deleteOne({
        ownerName: req.params.vehicleOwner
      },
      function(err) {
        if (!err) {
          res.send("Successfully deleted the Vehicle's data");
        }
      }
    );
  });


app.listen(PORT, () => console.log(`Server is up and running on Port: ${PORT}`));
