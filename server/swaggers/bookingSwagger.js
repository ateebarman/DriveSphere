/**
 * @swagger
 * /api/booking/booked:
 *   post:
 *     summary: Book a car
 *     tags:
 *       - Booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               regNumber:
 *                 type: string
 *                 description: The registration number of the car being booked
 *               rentalStartDate:
 *                 type: string
 *                 format: date-time
 *                 description: The start date of the rental
 *               rentalEndDate:
 *                 type: string
 *                 format: date-time
 *                 description: The end date of the rental
 *               totalPrice:
 *                 type: number
 *                 description: The price per day for renting the car
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, paid]
 *                 description: The payment status for the booking
 *               paymentMethod:
 *                 type: string
 *                 description: The method used for payment
 *               transactionId:
 *                 type: string
 *                 description: The transaction ID for the payment
 *               rentalLocation:
 *                 type: object
 *                 properties:
 *                   pickupLocation:
 *                     type: string
 *                     description: The location where the car is to be picked up
 *                   dropoffLocation:
 *                     type: string
 *                     description: The location where the car is to be dropped off
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 booking:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     car:
 *                       type: object
 *                       properties:
 *                         regNumber:
 *                           type: string
 *                       required: [regNumber]
 *                     rentalStartDate:
 *                       type: string
 *                       format: date-time
 *                     rentalEndDate:
 *                       type: string
 *                       format: date-time
 *                     totalPrice:
 *                       type: number
 *       400:
 *         description: Invalid input data, such as car availability, invalid rental dates, or total price
 *       404:
 *         description: Car not found
 *       500:
 *         description: Server error while creating the booking
 */


/**
 * @swagger
 * /api/booking/availablecars:
 *   get:
 *     summary: Get all available cars
 *     tags:
 *       - Booking
 *     responses:
 *       200:
 *         description: A list of available cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier of the car
 *                   regNumber:
 *                     type: string
 *                     description: The registration number of the car
 *                   brand:
 *                     type: string
 *                     description: The brand of the car
 *                   model:
 *                     type: string
 *                     description: The model of the car
 *                   year:
 *                     type: number
 *                     description: The manufacturing year of the car
 *                   status:
 *                     type: string
 *                     description: The availability status of the car
 *                     example: available
 *       500:
 *         description: Internal server error
 */
