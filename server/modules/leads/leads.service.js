const Lead = require('../../modules/leads/leads.model');
const { createStudentFromLead } = require('../student/student.service');

const createLeadService = async (data) => {
    const lead = await Lead.create(data);
    await createStudentFromLead(lead);
    return lead;
};

const getAllLeadsService = async () => {
    return await Lead.find();
};

const getLeadByIdService = async (id) => {
    return await Lead.findById(id);
};

const updateLeadService = async (id, data) => {
    const previousLead = await Lead.findById(id);

    if (!previousLead) {
        return null;
    }

    if (previousLead.status === 'Accepted' && data.status && data.status !== 'Accepted') {
        throw new Error('Accepted leads cannot be moved back to a previous status');
    }

    const updatedLead = await Lead.findByIdAndUpdate(id, data, { new: true });

    if (updatedLead && updatedLead.status === 'Accepted' && previousLead?.status !== 'Accepted') {
        await createStudentFromLead(updatedLead);
    }

    return updatedLead;
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