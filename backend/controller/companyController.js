const { default: mongoose } = require("mongoose");
const Company = require("../models/company");

module.exports.createCompany = async (req, res) => {
  try {
    const { name, email, mobileNumber, address } = req.body;
    
    const company = new Company({
      name,
      email,
      mobileNumber,
      address,
    });

    const savedCompany = await company.save();

    return res.status(201).json({
      message: "Company details created successfully",
      Company: savedCompany,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports.updateCompany = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid company ID" });
    }

    const updatedCompany = await Company.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedCompany) {
      return res.status(404).json({ error: "Company not found" });
    }

    return res.status(201).json({
      message: "Company details updated successfully",
      data: updatedCompany,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.deleteCompany = async (req, res) => {
    const { id } = req.params;  
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid company ID" });
      }
  
      const deleteCompany = await Company.findByIdAndDelete(id);
  
      if (!deleteCompany) {
        return res.status(404).json({ error: "Company not found" });
      }
  
      return res.status(201).json({
        message: "Company details deleted successfully"
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

module.exports.viewsingleCompany = async (req, res) => {
    const { id } = req.params;  
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid company ID" });
      }
  
      const viewCompany = await Company.findById(id);
  
      if (!viewCompany) {
        return res.status(404).json({ error: "Company not found" });
      }
  
      return res.status(201).json({
        message: "Company details fetched successfully",
        data: viewCompany,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  module.exports.listCompany = async (req, res) => {
    try {
      const viewCompany = await Company.find();
  
      if (!viewCompany) {
        return res.status(404).json({ error: "Company not found" });
      }
  
      return res.status(201).json({
        message: "Companies fetched successfully",
        data: viewCompany,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };