const leadService = require('./leads.service');

const createLead = async (req, res, next) => {
    try {
        const lead = await leadService.createLeadService(req.body);
        res.status(201).json(lead);
    } catch (error) {
     next(error);
        }
};

const getLeads = async (req, res, next) => {
    try {
        const leads = await leadService.getAllLeadsService();
        res.status(200).json(leads);
    } catch (error) {
        next(error);
        // res.status(500).json({ message: error.message });
    }
};

const getLeadById = async (req, res, next) => {
    try {
        const lead = await leadService.getLeadByIdService(req.params.id);

        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        res.status(200).json(lead);
    } catch (error) {
       next(error);
    }
};

const updateLead = async (req, res, next) => {
    try {
        const lead = await leadService.updateLeadService(req.params.id, req.body);

        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        res.status(200).json(lead);
    } catch (error) {
      next(error);
    }
};

const deleteLead = async (req, res, next) => {
    try {
        const lead = await leadService.deleteLeadService(req.params.id);

        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        res.status(200).json({ message: 'Lead deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
    deleteLead
};