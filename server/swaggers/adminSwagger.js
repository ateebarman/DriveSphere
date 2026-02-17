/**
 * @swagger
 * /api/admin/getallusers:
 *   get:
 *     summary: Get a list of all users (Admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users (excluding passwords)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/getuser:
 *   get:
 *     summary: Get a user by email (Admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email of the user to retrieve
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Email is required
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/deleteuser:
 *   delete:
 *     summary: Delete a user and their bookings (Admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: User has been deleted successfully
 *       400:
 *         description: Bad request (missing or invalid email)
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/change-role:
 *   put:
 *     summary: Change the role of a user (Admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newRole
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               newRole:
 *                 type: string
 *                 enum: [admin, user, carOwner]
 *                 example: carOwner
 *     responses:
 *       200:
 *         description: User role has changed successfully
 *       400:
 *         description: Bad request (missing fields or invalid role)
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/getallcars:
 *   get:
 *     summary: Get all cars with owner details (Admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched all cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   brand:
 *                     type: string
 *                   model:
 *                     type: string
 *                   year:
 *                     type: number
 *                   type:
 *                     type: string
 *                   color:
 *                     type: string
 *                   seats:
 *                     type: number
 *                   mileage:
 *                     type: number
 *                   rentalPricePerDay:
 *                     type: number
 *                   status:
 *                     type: string
 *                   regNumber:
 *                     type: string
 *                   ownerId:
 *                     type: object
 *                     properties:
 *                       fullname:
 *                         type: string
 *                       email:
 *                         type: string
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/getcar:
 *   get:
 *     summary: Get a car by registration number (Admin only)
 *     tags:
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
 *                 example: "MH12AB1234"
 *     responses:
 *       200:
 *         description: Car found or message if not found
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     brand:
 *                       type: string
 *                     model:
 *                       type: string
 *                     year:
 *                       type: number
 *                     type:
 *                       type: string
 *                     color:
 *                       type: string
 *                     seats:
 *                       type: number
 *                     mileage:
 *                       type: number
 *                     rentalPricePerDay:
 *                       type: number
 *                     status:
 *                       type: string
 *                     regNumber:
 *                       type: string
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: No car with this registration No. listed.
 *       400:
 *         description: Missing registration number
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/addcar:
 *   post:
 *     summary: Add a new car (Admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - brand
 *               - model
 *               - year
 *               - regNumber
 *               - type
 *               - color
 *               - rentalPricePerDay
 *               - fuelType
 *               - transmission
 *               - seats
 *               - status
 *               - mileage
 *               - description
 *               - images
 *               - currentLocation
 *             properties:
 *               brand:
 *                 type: string
 *                 example: Toyota
 *               model:
 *                 type: string
 *                 example: Innova Crysta
 *               year:
 *                 type: integer
 *                 example: 2022
 *               regNumber:
 *                 type: string
 *                 example: MH12AB1234
 *               type:
 *                 type: string
 *                 example: SUV
 *               color:
 *                 type: string
 *                 example: Black
 *               rentalPricePerDay:
 *                 type: number
 *                 example: 2000
 *               fuelType:
 *                 type: string
 *                 example: Diesel
 *               transmission:
 *                 type: string
 *                 example: Automatic
 *               seats:
 *                 type: integer
 *                 example: 7
 *               status:
 *                 type: string
 *                 example: available
 *               mileage:
 *                 type: number
 *                 example: 15
 *               description:
 *                 type: string
 *                 example: Spacious SUV with premium interiors
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: https://example.com/image1.jpg
 *               currentLocation:
 *                 type: string
 *                 example: Pune
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
 *                 car:
 *                   $ref: '#/components/schemas/Car'
 *       400:
 *         description: Car with this registration number already exists
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Failed to add car
 */

/**
 * @swagger
 * /api/admindeletecar:
 *   delete:
 *     summary: Delete a car by registration number (Admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - regNumber
 *             properties:
 *               regNumber:
 *                 type: string
 *                 example: MH12AB1234
 *     responses:
 *       200:
 *         description: Car has been deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Car has been deleted successfully.
 *       400:
 *         description: Registration number is required
 *       404:
 *         description: Car not found
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Server error. Unable to delete the car.
 */

/**
 * @swagger
 * /api/admin/allbookings:
 *   get:
 *     summary: Get all bookings with user and car details (Admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 652fe83bb19a8a391e897aef
 *                   user:
 *                     type: object
 *                     properties:
 *                       fullname:
 *                         type: string
 *                         example: John Doe
 *                       email:
 *                         type: string
 *                         example: johndoe@example.com
 *                   car:
 *                     type: object
 *                     properties:
 *                       brand:
 *                         type: string
 *                         example: Toyota
 *                       model:
 *                         type: string
 *                         example: Innova
 *                       regNumber:
 *                         type: string
 *                         example: MH12AB1234
 *                   startDate:
 *                     type: string
 *                     format: date
 *                   endDate:
 *                     type: string
 *                     format: date
 *                   totalAmount:
 *                     type: number
 *                     example: 1500
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Server error. Unable to fetch bookings.
 */

/**
 * @swagger
 * /api/admin/recent-bookings:
 *   get:
 *     summary: Get the 5 most recent bookings (Admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved recent bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 652fe83bb19a8a391e897aef
 *                   user:
 *                     type: object
 *                     properties:
 *                       fullname:
 *                         type: string
 *                         example: Alice Sharma
 *                       email:
 *                         type: string
 *                         example: alice@example.com
 *                   car:
 *                     type: object
 *                     properties:
 *                       brand:
 *                         type: string
 *                         example: Honda
 *                       model:
 *                         type: string
 *                         example: City
 *                       regNumber:
 *                         type: string
 *                         example: KA05MN7890
 *                   startDate:
 *                     type: string
 *                     format: date
 *                   endDate:
 *                     type: string
 *                     format: date
 *                   totalAmount:
 *                     type: number
 *                     example: 2800
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: No bookings found
 *       500:
 *         description: Server error. Unable to fetch booking details
 */
