/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieves the profile information of the authenticated user. Requires a valid JWT token.
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "607f1f77bcf86cd799439011"
 *                 fullname:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "johndoe@example.com"
 *                 mobileNo:
 *                   type: string
 *                   example: "9876543210"
 *                 role:
 *                   type: string
 *                   example: "user"
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */


/**
 * @swagger
 * /api/user/userbookingdetails:
 *   get:
 *     summary: Get all bookings of the logged-in user
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []  
 *     responses:
 *       200:
 *         description: Successfully retrieved bookings
 *       404:
 *         description: No bookings found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/user/update:
 *   put:
 *     summary: Update the profile (fullname) of the logged-in user
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating profile
 */


/**
 * @swagger
 * /api/user/deleteuserbooking/{bookingId}:
 *   delete:
 *     summary: Delete a user booking and mark the associated car as available
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the booking to delete
 *     responses:
 *       200:
 *         description: Booking deleted and car marked as available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Booking deleted and car marked as available.
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error. Unable to delete booking.
 */


/**
 * @swagger
 * /api/user/updatePassword:
 *   put:
 *     summary: Update user password
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currPassword
 *               - newPassword
 *             properties:
 *               currPassword:
 *                 type: string
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 example: newsecurepassword456
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password updated successfully
 *       400:
 *         description: Current password is incorrect
 *       404:
 *         description: User not found
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/user/deleteAccount:
 *   post:
 *     summary: Delete the logged-in user's account and associated bookings
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User account and associated bookings deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User account and associated bookings deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server Error
 */


/**
 * @swagger
 * /api/user/allcars:
 *   get:
 *     summary: Retrieve a list of all cars
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: A list of cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/user/canceluserbooking/{id}:
 *   patch:
 *     summary: Cancel a user's booking
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the booking to cancel
 *     responses:
 *       200:
 *         description: Booking canceled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 booking:
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Booking is already canceled
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */

