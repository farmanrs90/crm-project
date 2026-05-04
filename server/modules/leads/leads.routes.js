const express = require('express');
const routerLeads = express.Router();
const validateObjectId = require('../../common/middleware/validateObjectId');
const {leadSchema, leadUpdateSchema} = require('./leads.validation');
const validate = require('../../common/middleware/validate');
const { checkPermission, checkRole } = require('../../common/middleware/permissions');
const leadController = require('./leads.controller');
const auth = require('../../common/middleware/auth');

// Create lead - Manager, Admin, Accountant
routerLeads.post('/', auth, checkRole('admin', 'manager', 'accountant'), validate(leadSchema), leadController.createLead);

// Get all leads - Manager, Admin, Accountant, Teacher
routerLeads.get('/', auth, checkRole('admin', 'manager', 'accountant', 'teacher'), leadController.getLeads);

// Get single lead - Manager, Admin, Accountant, Teacher
routerLeads.get('/:id', auth, checkRole('admin', 'manager', 'accountant', 'teacher'), validateObjectId('id'), leadController.getLeadById);

// Update lead - Manager, Admin
routerLeads.put('/:id', auth, checkRole('admin', 'manager'), validateObjectId('id'), validate(leadUpdateSchema), leadController.updateLead);

// Delete lead - Admin only
routerLeads.delete('/:id', auth, checkRole('admin'), validateObjectId('id'), leadController.deleteLead);

module.exports = routerLeads;