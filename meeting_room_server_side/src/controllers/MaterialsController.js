const Materials = require("../models/Materials");

module.exports = {
  async listMaterials(req, res) {
    try {
      const materials = await Materials.findAll();
      console.log(materials);
      return res.json(materials);
    } catch (error) {}
  },
};
