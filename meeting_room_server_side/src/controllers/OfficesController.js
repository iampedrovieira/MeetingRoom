const Offices = require("../models/Offices");
const ExternalOffices = require("../models/ExternalOffices");
const axios = require("axios");
module.exports = {
  async listarOffices(req, res) {
    const { external } = req.query;
    try {
      const offices = await Offices.findAll();
      if (external) {
        return res.json(offices);
      }
      var json_final = [];
      for (const office of offices) {
        var editedOffice;
        editedOffice = {
          officeid: office.officeid,
          description: office.description.replace(/_/g, " "),
        };
        json_final.push(editedOffice);
      }
      const external_options = {
        method: "GET",
        url: process.env.MATRIX_BOT_API + "/external-office/",
        timeout: process.env.TIMEOUT_DEFAULT,
      };
      const response_external = await axios.request(external_options);
      for (const office of response_external.data) {
        const domain = office.domain;
        for (const eOffice of office.offices) {
          var new_office;
          new_office = {
            officeid: eOffice.officeid + "-" + domain,
            description: eOffice.description.replace(/_/g, " ") + "-" + domain,
          };
          json_final.push(new_office);
        }
      }
      return res.json(json_final);
    } catch (error) {
      if (!error.response) {
        //Get external offices from cache
        const externalOffices = await ExternalOffices.findAll();
        //TO-DO
        for (const eOffice of externalOffices) {
          var new_office;
          const domain = eOffice.officeid.split(":")[1];
          new_office = {
            officeid: eOffice.officeid.split(":")[0] + "-" + domain,
            description: eOffice.description + "-" + domain,
          };

          json_final.push(new_office);
        }
        return res.json(json_final);
      } else {
        console.log(error);
        res.status(500).json({ message: "Query error" });
      }
    }
  },

  async criar(req, res) {
    try {
      const { descripton } = req.body;
      const office = await Offices.create({ description: descripton });
      if (office) {
        return res.json({
          message: "Office created",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Something Wrong",
      });
    }
  },
};
