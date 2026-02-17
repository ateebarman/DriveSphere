
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function runTest() {
  console.log('--- Starting Critical Cases & Concurrency Test ---');

  const timestamp = Date.now();
  const user1 = {
    fullname: `Tester One ${timestamp}`,
    email: `tester1_${timestamp}@example.com`,
    password: 'Password@123',
    mobileNo: '1234567890',
    role: 'user'
  };
  const user2 = {
    fullname: `Tester Two ${timestamp}`,
    email: `tester2_${timestamp}@example.com`,
    password: 'Password@123',
    mobileNo: '0987654321',
    role: 'user'
  };

  let token1, token2;
  let carToBook;

  // 1. Register & Login Users
  try {
    console.log(`\n[1] Registering and Logging in Users...`);
    
    // User 1
    await axios.post(`${BASE_URL}/user/register`, user1);
    const loginRes1 = await axios.post(`${BASE_URL}/user/login`, { email: user1.email, password: user1.password });
    token1 = loginRes1.data.user.token;
    console.log(` - User 1 Logged in (Token acquired)`);

    // User 2
    await axios.post(`${BASE_URL}/user/register`, user2);
    const loginRes2 = await axios.post(`${BASE_URL}/user/login`, { email: user2.email, password: user2.password });
    token2 = loginRes2.data.user.token;
    console.log(` - User 2 Logged in (Token acquired)`);

  } catch (error) {
    console.error('Error in Setup:', error.response?.data || error.message);
    return;
  }

  // 2. Find an Active Car
  try {
    console.log(`\n[2] Fetching Active Cars...`);
    const carsRes = await axios.get(`${BASE_URL}/user/allcars`);
    const cars = carsRes.data.cars;
    
    if (!cars || cars.length === 0) {
      console.error('No cars found in the system to test with!');
      return;
    }

    carToBook = cars[Math.floor(Math.random() * cars.length)]; // Pick random car
    console.log(` - Selected Car: ${carToBook.brand} ${carToBook.model} (${carToBook.regNumber})`);
  } catch (error) {
    console.error('Error fetching cars:', error.response?.data || error.message);
    return;
  }

  // 3. Prepare Concurrent Booking Requests
  console.log(`\n[3] Launching Concurrent Booking Requests...`);
  
  // Define Dates (Tomorrow to Day After Tomorrow)
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 2);

  const bookingPayload = {
    regNumber: carToBook.regNumber,
    rentalStartDate: startDate.toISOString(),
    rentalEndDate: endDate.toISOString(),
    rentalLocation: { pickupLocation: 'TestHub', dropoffLocation: 'TestHub' },
    paymentMethod: 'credit_card'
  };

  const reqConfig1 = { headers: { Cookie: `token=${token1}` } };
  const reqConfig2 = { headers: { Cookie: `token=${token2}` } };

  // Helper to make booking request
  const makeBooking = (userLabel, config) => {
    return axios.post(`${BASE_URL}/booking/booked`, bookingPayload, config)
      .then(res => ({ user: userLabel, status: res.status, data: res.data }))
      .catch(err => ({ user: userLabel, status: err.response?.status, error: err.response?.data }));
  };

  // 4. Executing Concurrent Requests
  try {
    const results = await Promise.all([
      makeBooking('User 1', reqConfig1),
      makeBooking('User 2', reqConfig2),
      makeBooking('User 1 (Retry)', reqConfig1) // Idempotency check
    ]);

    console.log('\n--- Results ---');
    results.forEach(r => {
      if (r.status === 200 || r.status === 201) {
        console.log(`✅ ${r.user}: SUCCESS (${r.status}) - Booking ID: ${r.data.booking._id}`);
      } else if (r.status === 409) {
        console.log(`⚠️ ${r.user}: CONFLICT (${r.status}) - ${r.error.message}`);
      } else if (r.status === 423) {
        console.log(`🔒 ${r.user}: LOCKED (${r.status}) - ${r.error.message}`);
      } else {
        console.log(`❌ ${r.user}: ERROR (${r.status}) - ${JSON.stringify(r.error)}`);
      }
    });

    // Verification
    const successCount = results.filter(r => r.status === 201).length;
    const conflictCount = results.filter(r => r.status === 423 || r.status === 409).length;

    console.log('\n--- Analysis ---');
    if (successCount === 1) {
      console.log('✅ Exactly one booking succeeded.');
    } else {
      console.log(`❌ Unexpected success count: ${successCount}`);
    }

    if (conflictCount >= 1) {
      console.log('✅ Other requests were rejected (Locked/Conflict).');
    } else {
      console.log('❌ No conflicts detected! Potential Race Condition!');
    }

  } catch (error) {
    console.error('Test Execution Error:', error);
  }

  // 5. Check Idempotency specifically (if not covered above)
  // The 'User 1 (Retry)' above should catch it.

}

runTest();
