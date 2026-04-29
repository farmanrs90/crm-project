const express = require('express');
const routerLeads = express.Router();
const validateObjectId = require('../../common/middleware/validateObjectId');
const {leadSchema} = require('./leads.validation');
const validate = require('../../common/middleware/validate');
const leadController = require('./leads.controller');
const auth = require('../../common/middleware/auth');

routerLeads.post('/', auth, validate(leadSchema), leadController.createLead);
routerLeads.get('/', auth, leadController.getLeads);
routerLeads.get('/:id', auth, validateObjectId('id'), leadController.getLeadById);
routerLeads.put('/:id', auth, validateObjectId('id'), validate(leadSchema), leadController.updateLead);
routerLeads.delete('/:id', auth, validateObjectId('id'), leadController.deleteLead);
module.exports = routerLeads;