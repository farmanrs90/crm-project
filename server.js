const express = require('express');
const cors = require('cors');
const errorHandler = require('./common/middleware/errorHandler');
require('dotenv').config();
const app = express();
const connectDB = require('./config/db');

const leadsrouter = require('./modules/leads/leads.routes')
const coursesrouter = require('./modules/courses/course.routes');
const routerUser = require('./modules/user/user.route');
const routerStudent = require('./modules/student/student.routes');
const routerGroup = require('./modules/groups/group.route');
const routerEnrollment = require('./modules/enrollment/enrollment.routes');
const routerPaymentPlan = require('./modules/payment/paymentPlan.routes');
const routerPayment = require('./modules/payment/payment.routes');
const auth = require('./modules/auth/auth.routes');


app.use(cors());
app.use(express.json());

app.use('/api/enrollments', routerEnrollment);
app.use('/api/payments', routerPayment);
app.use('/api/payment-plans', routerPaymentPlan);
app.use('/api/leads', leadsrouter);
app.use('/api/students', routerStudent);
app.use('/api/courses', coursesrouter);
app.use('/api/users', routerUser);
app.use('/api/groups', routerGroup);
app.use('/api/auth', auth);
const Port = process.env.PORT || 5000;

app.use(errorHandler);
app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});


// Connect to MongoDB
connectDB();