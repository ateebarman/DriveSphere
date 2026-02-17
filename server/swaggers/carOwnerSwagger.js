/**
 * @swagger
 * /api/carOwner/getownedcar:
 *   get:
 *     summary: Get car details owned by the logged-in car owner using registration number
 *     tags:
 *       - Car Owner
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               regNumber:
 *                 type: string
 *                 example: "MH12AB1234"
 *     responses:
 *       200:
 *         description: Car found or message indicating no car found
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *       400:
 *         description: Registration number is required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/carOwner/getallownedcars:
 *   get:
 *     summary: Get all cars owned by the logged-in car owner
 *     tags:
 *       - Car Owner
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of owned cars or a message if none exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cars:
 *                   type: array
 *                   
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /api/carOwner/addcar:
 *   post:
 *     summary: Add a new car by a car owner
 *     tags:
 *       - Car Owner
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - regNumber
 *             properties:
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: integer
 *               regNumber:
 *                 type: string
 *               type:
 *                 type: string
 *               color:
 *                 type: string
 *               rentalPricePerDay:
 *                 type: number
 *               fuelType:
 *                 type: string
 *               transmission:
 *                 type: string
 *               seats:
 *                 type: integer
 *               status:
 *                 type: string
 *               mileage:
 *                 type: number
 *               description:
 *                 type: string
 *               currentLocation:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Car added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                
 *       400:
 *         description: Validation error or duplicate registration number
 *       500:
 *         description: Server error while adding car
 */

/**
 * @swagger
 * /api/carOwner/CarOwnerBookingDetails:
 *   get:
 *     summary: Get all booking details for cars owned by the authenticated car owner
 *     tags:
 *       - Car Owner
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bookings retrieved successfully
 *                 bookings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           fullname:
 *                             type: string
 *                           email:
 *                             type: string
 *                       car:
 *                         type: object
 *                         properties:
 *                           brand:
 *                             type: string
 *                           model:
 *                             type: string
 *                           regNumber:
 *                             type: string
 *                       status:
 *                         type: string
 *                       startDate:
 *                         type: string
 *                         format: date
 *                       endDate:
 *                         type: string
 *                         format: date
 *       404:
 *         description: No cars or bookings found
 *       500:
 *         description: Server error while retrieving booking details
 */


/**
 * @swagger
 * /api/carOwner/recent-bookings:
 *   get:
 *     summary: Get the 5 most recent bookings for cars owned by the authenticated car owner
 *     tags:
 *       - Car Owner
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Recent bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: object
 *                     properties:
 *                       fullname:
 *                         type: string
 *                       email:
 *                         type: string
 *                   car:
 *                     type: object
 *                     properties:
 *                       brand:
 *                         type: string
 *                       model:
 *                         type: string
 *                       regNumber:
 *                         type: string
 *                   status:
 *                     type: string
 *                   startDate:
 *                     type: string
 *                     format: date
 *                   endDate:
 *                     type: string
 *                     format: date
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: No bookings found for these cars
 *       500:
 *         description: Server error while retrieving recent bookings
 */

/**
 * @swagger
 * /api/carOwner/deletecar:
 *   delete:
 *     summary: Delete a car and its associated bookings
 *     tags:
 *       - Car Owner
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               regNumber:
 *                 type: string
 *                 description: Registration number of the car to delete
 *                 example: "ABC123"
 *     responses:
 *       200:
 *         description: Car and associated bookings deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Registration number is required
 *       404:
 *         description: Car not found
 *       500:
 *         description: Server error while deleting the car
 */

/**
 * @swagger
 * /api/carOwner/updatecardetails:
 *   put:
 *     summary: Update details of a car owned by the authenticated car owner
 *     tags:
 *       - Car Owner
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               regNumber:
 *                 type: string
 *                 description: The registration number of the car to be updated.
 *               brand:
 *                 type: string
 *                 description: The car's brand (optional).
 *               model:
 *                 type: string
 *                 description: The car's model (optional).
 *               year:
 *                 type: integer
 *                 description: The car's year of manufacture (optional).
 *               color:
 *                 type: string
 *                 description: The car's color (optional).
 *               rentalPricePerDay:
 *                 type: number
 *                 description: The rental price per day for the car (optional).
 *               fuelType:
 *                 type: string
 *                 description: The fuel type of the car (optional).
 *               transmission:
 *                 type: string
 *                 description: The transmission type of the car (optional).
 *               seats:
 *                 type: integer
 *                 description: The number of seats in the car (optional).
 *               mileage:
 *                 type: number
 *                 description: The car's mileage (optional).
 *               description:
 *                 type: string
 *                 description: A description of the car (optional).
 *     responses:
 *       200:
 *         description: Car details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 car:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     regNumber:
 *                       type: string
 *       404:
 *         description: Car not found with this registration number
 *       500:
 *         description: Server error while updating car details
 */

/**
 * @swagger
 * /api/carOwner/deletecarownerbooking/{bookingId}:
 *   delete:
 *     summary: Delete a booking for a car owner and update the car's status to available
 *     tags:
 *       - Car Owner
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         description: The ID of the booking to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking deleted successfully and car status updated to available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error while deleting booking
 */


/**
 * @swagger
 * /api/carOwner/deletecarowner:
 *   delete:
 *     summary: Delete a car owner, their cars, and associated bookings
 *     tags:
 *       - Car Owner
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Car owner, cars, and related bookings deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error while deleting car owner and associated data
 */


/**
 * @swagger
 * /api/carOwner/canceluserbooking/{id}:
 *   patch:
 *     summary: Cancel a user’s booking and update the car status to available
 *     tags:
 *       - Car Owner
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the booking to cancel
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Booking canceled successfully and car status updated to available
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
 *                     status:
 *                       type: string
 *                     car:
 *                       type: object
 *                       properties:
 *                         brand:
 *                           type: string
 *                         model:
 *                           type: string
 *                         regNumber:
 *                           type: string
 *       400:
 *         description: Booking is already canceled
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error while canceling the booking
 */


/**
 * @swagger
 * /api/carOwner/editcar/{carId}:
 *   put:
 *     summary: Update the details of a car owned by the car owner
 *     tags:
 *       - Car Owner
 *     parameters:
 *       - name: carId
 *         in: path
 *         required: true
 *         description: The ID of the car to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: integer
 *               type:
 *                 type: string
 *               color:
 *                 type: string
 *               seats:
 *                 type: integer
 *               mileage:
 *                 type: number
 *               rentalPricePerDay:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [available, maintenance, booked]
 *                 description: The status of the car (available, maintenance, or booked)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Car details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 car:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     brand:
 *                       type: string
 *                     model:
 *                       type: string
 *                     year:
 *                       type: integer
 *                     status:
 *                       type: string
 *       400:
 *         description: Invalid status value or bad request data
 *       404:
 *         description: Car not found
 *       500:
 *         description: Server error. Could not update car details
 */
