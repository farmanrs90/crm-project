require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../modules/user/user.model');
const Course = require('../modules/courses/courses.model');
const Lead = require('../modules/leads/leads.model');
const PaymentPlan = require('../modules/payment/paymentPlan.model');
const Student = require('../modules/student/student.model');
const Group = require('../modules/groups/group.model');
const Enrollment = require('../modules/enrollment/enrollment.model');
const Payment = require('../modules/payment/payment.model');

const SALT_ROUNDS = 10;

const demo = {
  users: [
    { name: 'Admin User', email: 'admin@example.com', password: 'Admin12345', role: 'admin' },
    { name: 'Teacher User', email: 'teacher@example.com', password: 'Teacher12345', role: 'teacher' },
    { name: 'Manager User', email: 'manager@example.com', password: 'Manager12345', role: 'manager' },
    { name: 'Accountant User', email: 'accountant@example.com', password: 'Accountant12345', role: 'accountant' },
    { name: 'Student User', email: 'student@example.com', password: 'Student12345', role: 'student' }
  ],
  courses: [
    {
      name: 'JavaScript Basics',
      price: 300,
      description: 'Intro to JavaScript fundamentals',
      durationMonths: 3,
      isActive: true,
      syllabus: 'Variables, functions, arrays, objects, DOM'
    },
    {
      name: 'Full Stack Web Development',
      price: 800,
      description: 'Frontend + backend + database workflow',
      durationMonths: 6,
      isActive: true,
      syllabus: 'HTML, CSS, JS, Node.js, Express, MongoDB'
    }
  ],
  paymentPlans: [
    { planType: 'full', totalAmount: 1000, discountAmount: 100, note: 'Full payment plan', isActive: true },
    { planType: 'installments', totalAmount: 1200, discountAmount: 0, note: '6 month installment plan', isActive: true }
  ]
};

async function resetCollections() {
  await Promise.all([
    Payment.deleteMany({}),
    Enrollment.deleteMany({}),
    Student.deleteMany({}),
    Group.deleteMany({}),
    Lead.deleteMany({}),
    PaymentPlan.deleteMany({}),
    Course.deleteMany({}),
    User.deleteMany({})
  ]);
}

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing in environment variables');
  }

  await mongoose.connect(process.env.DATABASE_URL);
  console.log('Connected to MongoDB');

  await resetCollections();
  console.log('Existing demo collections cleared');

  const hashedUsers = await Promise.all(
    demo.users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, SALT_ROUNDS)
    }))
  );
  const users = await User.insertMany(hashedUsers);

  const courses = await Course.insertMany(demo.courses);
  const paymentPlans = await PaymentPlan.insertMany(demo.paymentPlans);

  const teacher = users.find((user) => user.role === 'teacher');
  const manager = users.find((user) => user.role === 'manager');
  const studentUser = users.find((user) => user.role === 'student');
  const accountant = users.find((user) => user.role === 'accountant');

  const leads = await Lead.insertMany([
    {
      firstName: 'Ali',
      lastName: 'Mammadov',
      phone: '0501112233',
      email: 'ali@example.com',
      courseInterested: courses[0]._id,
      status: 'New',
      source: 'Website',
      assignedTo: manager._id,
      utmSource: 'google',
      notes: 'Interested in JS basics'
    },
    {
      firstName: 'Nigar',
      lastName: 'Huseynova',
      phone: '0504445566',
      email: 'nigar@example.com',
      courseInterested: courses[1]._id,
      status: 'Contacted',
      source: 'Social Media',
      assignedTo: accountant._id,
      utmSource: 'instagram',
      notes: 'Wants full stack program'
    }
  ]);

  const students = await Student.insertMany([
    {
      user: studentUser._id,
      lead: leads[0]._id,
      studentCode: 'STU0001',
      enrollmentDate: new Date('2026-04-01T00:00:00.000Z'),
      status: 'active'
    }
  ]);

  const groups = await Group.insertMany([
    {
      name: 'JS-Group-A',
      course: courses[0]._id,
      teacher: teacher._id,
      startDate: new Date('2026-05-01T00:00:00.000Z'),
      endDate: new Date('2026-08-01T00:00:00.000Z'),
      capacity: 15,
      isActive: true
    },
    {
      name: 'FullStack-Group-A',
      course: courses[1]._id,
      teacher: teacher._id,
      startDate: new Date('2026-06-01T00:00:00.000Z'),
      endDate: new Date('2026-12-01T00:00:00.000Z'),
      capacity: 12,
      isActive: true
    }
  ]);

  const enrollments = await Enrollment.insertMany([
    {
      student: students[0]._id,
      group: groups[0]._id,
      paymentPlan: paymentPlans[0]._id,
      enrolledAt: new Date('2026-04-10T00:00:00.000Z'),
      status: 'active'
    }
  ]);

  const payments = await Payment.insertMany([
    {
      paymentPlan: paymentPlans[0]._id,
      installmentNumber: 1,
      amountPaid: 900,
      dueDate: new Date('2026-05-15T00:00:00.000Z'),
      paidAt: new Date('2026-05-10T00:00:00.000Z'),
      status: 'paid',
      note: 'Full payment received',
      method: 'cash'
    },
    {
      paymentPlan: paymentPlans[1]._id,
      installmentNumber: 1,
      amountPaid: 200,
      dueDate: new Date('2026-06-15T00:00:00.000Z'),
      status: 'pending',
      note: 'First installment pending',
      method: 'bank_transfer'
    },
    {
      paymentPlan: paymentPlans[1]._id,
      installmentNumber: 2,
      amountPaid: 200,
      dueDate: new Date('2026-07-15T00:00:00.000Z'),
      status: 'pending',
      note: 'Second installment pending',
      method: 'credit_card'
    }
  ]);

  console.log('\nDemo database seeded successfully');
  console.log({
    users: users.length,
    courses: courses.length,
    leads: leads.length,
    paymentPlans: paymentPlans.length,
    students: students.length,
    groups: groups.length,
    enrollments: enrollments.length,
    payments: payments.length
  });

  await mongoose.connection.close();
  console.log('MongoDB connection closed');
}

seed().catch(async (error) => {
  console.error('Seeding failed:', error.message);
  try {
    await mongoose.connection.close();
  } catch (closeError) {
    console.error('Failed to close MongoDB connection:', closeError.message);
  }
  process.exit(1);
});