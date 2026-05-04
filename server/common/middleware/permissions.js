// Permissions matrix - which roles can do what
const PERMISSIONS = {
  // Admin - full access
  admin: [
    'view_leads', 'create_lead', 'update_lead', 'delete_lead',
    'view_students', 'create_student', 'update_student', 'delete_student',
    'view_payments', 'create_payment', 'update_payment', 'delete_payment',
    'view_groups', 'create_group', 'update_group', 'delete_group',
    'view_courses', 'create_course', 'update_course', 'delete_course',
    'view_users', 'create_user', 'update_user', 'delete_user',
    'view_attendance', 'create_attendance', 'update_attendance',
    'view_dashboard', 'view_reports', 'export_data',
    'manage_roles', 'manage_permissions', 'view_audit_logs'
  ],

  // Manager - leads, students, payments
  manager: [
    'view_leads', 'create_lead', 'update_lead',
    'view_students', 'view_payments', 'create_payment',
    'view_groups',
    'view_courses',
    'view_dashboard',
    'view_reports'
  ],

  // Teacher - attendance, students
  teacher: [
    'view_students', // only their own classes
    'view_attendance', 'create_attendance', 'update_attendance',
    'view_groups', // only their own
    'view_courses',
  ],

  // Accountant - payments
  accountant: [
    'view_payments', 'create_payment', 'update_payment',
    'view_leads', // limited - for payment info
    'view_students', // limited - for payment info
    'view_reports', // financial reports
    'export_data'
  ],

  // Student - own info only
  student: [
    'view_own_profile',
    'view_own_courses',
    'view_own_payments',
    'view_own_attendance'
  ]
};

// Check if user has permission
const hasPermission = (userRole, requiredPermission) => {
  const permissions = PERMISSIONS[userRole] || [];
  return permissions.includes(requiredPermission);
};

// Middleware to check permission
const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    
    if (!userRole) {
      return res.status(401).json({ 
        message: 'Unauthorized - No role found',
        errorCode: 'AUTH_001'
      });
    }

    if (!hasPermission(userRole, requiredPermission)) {
      return res.status(403).json({ 
        message: `Forbidden - You don't have permission to ${requiredPermission}`,
        errorCode: 'AUTHZ_001',
        requiredPermission,
        userRole
      });
    }

    next();
  };
};

// Middleware to check multiple permissions (ANY match)
const checkPermissionAny = (permissions) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    
    if (!userRole) {
      return res.status(401).json({ 
        message: 'Unauthorized - No role found',
        errorCode: 'AUTH_001'
      });
    }

    const hasAny = permissions.some(perm => hasPermission(userRole, perm));

    if (!hasAny) {
      return res.status(403).json({ 
        message: `Forbidden - You don't have permission for this action`,
        errorCode: 'AUTHZ_001',
        requiredPermissions: permissions,
        userRole
      });
    }

    next();
  };
};

// Middleware to check ALL permissions
const checkPermissionAll = (permissions) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    
    if (!userRole) {
      return res.status(401).json({ 
        message: 'Unauthorized - No role found',
        errorCode: 'AUTH_001'
      });
    }

    const hasAll = permissions.every(perm => hasPermission(userRole, perm));

    if (!hasAll) {
      return res.status(403).json({ 
        message: `Forbidden - You don't have all required permissions`,
        errorCode: 'AUTHZ_001',
        requiredPermissions: permissions,
        userRole
      });
    }

    next();
  };
};

// Middleware for role-based access
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    
    if (!userRole) {
      return res.status(401).json({ 
        message: 'Unauthorized - No role found',
        errorCode: 'AUTH_001'
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: `Forbidden - This action requires one of these roles: ${allowedRoles.join(', ')}`,
        errorCode: 'AUTHZ_002',
        requiredRoles: allowedRoles,
        userRole
      });
    }

    next();
  };
};

module.exports = {
  PERMISSIONS,
  hasPermission,
  checkPermission,
  checkPermissionAny,
  checkPermissionAll,
  checkRole
};
