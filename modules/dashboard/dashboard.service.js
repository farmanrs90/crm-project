const User = require('../user/user.model');
const Student = require('../student/student.model');
const Lead = require('../leads/leads.model');
const Course = require('../courses/courses.model');
const Enrollment = require('../enrollment/enrollment.model');
const Payment = require('../payment/payment.model');

async function getDashboardData({ recentLimit = 5 } = {}) {
  const [
    totalUsers,
    totalStudents,
    totalLeads,
    totalCourses,
    totalEnrollments,
    paymentsCount,
    paymentsPending,
    recentEnrollments,
    recentPayments,
    recentLeads
  ] = await Promise.all([
    User.countDocuments(),
    Student.countDocuments(),
    Lead.countDocuments(),
    Course.countDocuments(),
    Enrollment.countDocuments(),
    Payment.countDocuments(),
    Payment.countDocuments({ status: 'pending' }),
    Enrollment.find().sort({ createdAt: -1 }).limit(recentLimit).populate('student group').lean(),
    Payment.find().sort({ createdAt: -1 }).limit(recentLimit).populate('paymentPlan').lean(),
    Lead.find().sort({ createdAt: -1 }).limit(recentLimit).lean()
  ]);

  return {
    totals: {
      users: totalUsers,
      students: totalStudents,
      leads: totalLeads,
      courses: totalCourses,
      enrollments: totalEnrollments,
      payments: paymentsCount,
      paymentsPending
    },
    recent: {
      enrollments: recentEnrollments,
      payments: recentPayments,
      leads: recentLeads
    }
  };
}

module.exports = { getDashboardData };