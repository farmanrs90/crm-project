const Lead = require('../../modules/leads/leads.model');

const createLeadService = async (data) => {
    return await Lead.create(data);
};

const getAllLeadsService = async () => {
    return await Lead.find();
};

const getLeadByIdService = async (id) => {
    return await Lead.findById(id);
};

const updateLeadService = async (id, data) => {
    return await Lead.findByIdAndUpdate(id, data, { new: true });
};

const deleteLeadService = async (id) => {
    return await Lead.findByIdAndDelete(id);
};

module.exports = {
    createLeadService,
    getAllLeadsService,
    getLeadByIdService,
    updateLeadService,
    deleteLeadService
};