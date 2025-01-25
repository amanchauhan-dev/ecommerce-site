"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.checkEmailTokenAndUpdate = exports.verifyMyEmail = exports.verifyMyProfile = exports.updateMyProfile = exports.getMyProfile = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.create = exports.dashboardLogin = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = __importDefault(require("../db/config"));
const FieldValidation_1 = __importDefault(require("../functions/FieldValidation"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const EmailVerify_1 = require("../email/EmailVerify");
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
// Signup function
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(0, FieldValidation_1.default)(req, res))
            return;
        const { fname, lname, email, password, phone_number } = req.body;
        const [existingUser] = yield config_1.default.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email is already registered' });
        }
        //todo: email verification
        //!todo
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const [result] = yield config_1.default.query(`INSERT INTO users ( fname, lname, email, password, phone_number) VALUES (  ?, ?, ?, ?, ?)`, [fname, lname, email, hashedPassword, phone_number]);
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.signup = signup;
// Login function
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, FieldValidation_1.default)(req, res))
        return;
    const { email, password } = req.body;
    try {
        const [user] = yield config_1.default.query(`SELECT 
            id,
            email,
            password
            FROM users WHERE email = ? AND status=?`, [email, 'active']);
        const [userDetails] = yield config_1.default.query(`SELECT 
            id,
            fname,
            lname,
            avatar,
            email,
            phone_number,
            is_email_verified,
            email_verify_token_exp_date,
            created_at,
            updated_at
            FROM users WHERE email = ? AND status=?`, [email, 'active']);
        if (user.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const validPassword = yield bcrypt_1.default.compare(password, user[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        let exp = Math.floor(Date.now() / 1000) + (60 * 60 * 5);
        const token = jsonwebtoken_1.default.sign({
            exp: exp,
            data: { id: user[0].id, role: user[0].role }
        }, JWT_SECRET);
        res.json({ message: 'Login successful', token, user: userDetails[0] });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.login = login;
// Login function
const dashboardLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, FieldValidation_1.default)(req, res))
        return;
    const { email, password } = req.body;
    try {
        const [user] = yield config_1.default.query('SELECT * FROM users WHERE email = ? AND status=? AND (role=? OR role=?)', [email, 'active', 'employee', 'admin']);
        if (user.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const validPassword = yield bcrypt_1.default.compare(password, user[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user[0].id, role: user[0].role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.dashboardLogin = dashboardLogin;
// Create function
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!(0, FieldValidation_1.default)(req, res))
        return;
    try {
        const { role, fname, lname, email, password, phone_number, status } = req.body;
        const filename = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) || null;
        const [existingUser] = yield config_1.default.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email is already registered' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const [result] = yield config_1.default.query(`INSERT INTO users (role, fname, lname, avatar, email, password, phone_number,status,is_email_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [role, fname, lname, filename, email, hashedPassword, phone_number, status, true]);
        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.create = create;
// Get all users
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract query parameters
        const { role, status, search, page = 1, limit = 50, sort = 'asc' } = req.query;
        // Base query
        let countQuery = 'SELECT COUNT(id) as total FROM users WHERE 1=1';
        let query = 'SELECT * FROM users WHERE 1=1';
        const queryParams = [];
        // Filtering
        if (role) {
            countQuery += ' AND role = ?';
            query += ' AND role = ?';
            queryParams.push(role);
        }
        if (status) {
            countQuery += ' AND status = ?';
            query += ' AND status = ?';
            queryParams.push(status);
        }
        // Searching
        if (search) {
            countQuery += ' AND (fname LIKE ? OR lname LIKE ? OR email LIKE ?)';
            query += ' AND (fname LIKE ? OR lname LIKE ? OR email LIKE ?)';
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm);
        }
        // order by 
        if (sort.toLocaleString().toLocaleLowerCase() == 'asc') {
            countQuery += ' ORDER BY id ASC ';
            query += ' ORDER BY id ASC ';
        }
        else if (sort.toLocaleString().toLocaleLowerCase() == 'name') {
            countQuery += ' ORDER BY fname ASC ';
            query += ' ORDER BY fname ASC ';
        }
        else if (sort.toLocaleString().toLocaleLowerCase() == 'email') {
            countQuery += ' ORDER BY email ASC ';
            query += ' ORDER BY email ASC ';
        }
        else if (sort.toLocaleString().toLocaleLowerCase() == 'role') {
            countQuery += ' ORDER BY role DESC ';
            query += ' ORDER BY role DESC ';
        }
        else {
            countQuery += ' ORDER BY id DESC ';
            query += ' ORDER BY id DESC ';
        }
        // count query
        let countQueryParams = queryParams;
        // Pagination
        const offset = (Number(page) - 1) * Number(limit);
        queryParams.push(Number(limit), offset);
        query += ' LIMIT ? OFFSET ?';
        // execute count query
        const [count] = yield config_1.default.query(countQuery, countQueryParams);
        // Execute query
        const [results] = yield config_1.default.query(query, queryParams);
        res.json({ data: results, page: Number(page), limit: Number(limit), total: count[0].total });
    }
    catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching users.', error });
    }
});
exports.getAllUsers = getAllUsers;
// Get a single user by ID
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const [results] = yield config_1.default.query('SELECT * FROM users WHERE id = ?', [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(results[0]);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getUserById = getUserById;
// Update a user
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, FieldValidation_1.default)(req, res))
        return;
    const { id } = req.params;
    const { role, fname, lname, avatar, phone_number, status, email } = req.body;
    try {
        let query = 'UPDATE users SET ';
        let queryParams = [];
        if (fname) {
            query += "fname = ?, ";
            queryParams.push(fname);
        }
        if (lname) {
            query += 'lname = ?, ';
            queryParams.push(lname);
        }
        if (email) {
            query += "email = ?, ";
            queryParams.push(email);
        }
        if (phone_number) {
            query += "phone_number = ?, ";
            queryParams.push(phone_number);
        }
        if (role) {
            query += 'role = ?, ';
            queryParams.push(role);
        }
        if (status) {
            query += 'status = ?, ';
            queryParams.push(status);
        }
        if (req.file && req.file.filename) {
            // remove old file
            const [oldFile] = yield config_1.default.query('SELECT avatar FROM users WHERE id = ?', [id]);
            let filePath = path_1.default.join(__dirname, '../../public', 'uploads', oldFile[0].avatar);
            fs_1.default.access(filePath, fs_1.default.constants.F_OK, err => {
                if (!err) {
                    fs_1.default.unlink(filePath, err => {
                        if (err) {
                            console.log('Error found in unlinking images', err);
                        }
                    });
                }
            });
            // add attach new file
            query += "avatar = ?, ";
            queryParams.push(req.file.filename);
        }
        if (queryParams.length == 0)
            return res.status(400).json({ message: 'No fields to update' });
        query = query.slice(0, -2) + " WHERE id = ?";
        queryParams.push(id);
        let [result] = yield config_1.default.query(query, [...queryParams]);
        res.json({ message: 'User updated successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateUser = updateUser;
// Delete a user
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const [avatarImage] = yield config_1.default.query('SELECT avatar FROM users WHERE id = ? ', [id]);
        const [result] = yield config_1.default.query('DELETE FROM users WHERE id = ? AND role != ?', [id, 'admin']);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        // remove avatar
        let avatarName = avatarImage[0].avatar || null;
        if (avatarName) {
            let filePath = path_1.default.join(__dirname, '../../public', 'uploads', avatarName);
            fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
                if (!err) {
                    fs_1.default.unlink(filePath, err => {
                        if (err) {
                            console.log('Error found in unlinking images', err);
                        }
                    });
                }
            });
        }
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.log('err', error);
        res.status(500).json({ error: error.message });
    }
});
exports.deleteUser = deleteUser;
// Get My Profile
const getMyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Get user ID from the request
    if (!userId) {
        return res.status(400).json({ message: 'User ID not found in request' });
    }
    try {
        const [rows] = yield config_1.default.execute(`SELECT 
            id,
            fname,
            lname,
            role,
            avatar,
            email,
            phone_number,
            is_email_verified,
            email_verify_token_exp_date,
            created_at,
            updated_at
            FROM users WHERE id = ?`, [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(rows[0]); // Return user profile
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.getMyProfile = getMyProfile;
// Update My Profile
const updateMyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!(0, FieldValidation_1.default)(req, res))
            return;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Get user ID from the request
        if (!userId) {
            return res.status(400).json({ message: 'User ID not found in request' });
        }
        const { fname, lname, phone_number } = req.body;
        let query = `UPDATE users SET `;
        let queryParams = [];
        if (fname) {
            query += "fname = ?, ";
            queryParams.push(fname);
        }
        if (lname) {
            query += "lname = ?, ";
            queryParams.push(lname);
        }
        if (phone_number) {
            query += "phone_number = ?, ";
            queryParams.push(phone_number);
        }
        if (queryParams.length == 0) {
            return res.status(404).json({ message: 'No data to change' });
        }
        query = query.slice(0, -2) + " WHERE id = ?";
        queryParams.push(userId);
        const [result] = yield config_1.default.execute(query, queryParams);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or no changes made' });
        }
        return res.status(200).json({ message: 'Profile updated successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server error' });
    }
});
exports.updateMyProfile = updateMyProfile;
// Verify My Profile
const verifyMyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const { password } = req.body;
        const [result] = yield config_1.default.query('SELECT password FROM users WHERE id = ?', [userId]);
        let userPassword = result.length > 0 ? result[0].password : '';
        const validPassword = yield bcrypt_1.default.compare(password, userPassword);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        return res.status(200).json({ message: 'Profile verified successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.verifyMyProfile = verifyMyProfile;
// change email
const verifyMyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = req.params.id;
        let { email, redirectionURL, type } = req.body;
        let creationTime = Math.floor(Date.now() / 1000);
        let expTime = creationTime + +(60 * 5); // 5min
        const emailVerifyToken = jsonwebtoken_1.default.sign({
            exp: expTime,
            data: { id: id, email: email }
        }, JWT_SECRET);
        if (type && type == 'password') {
            let [result] = yield config_1.default.query('UPDATE users SET password_reset_token=? WHERE id=?', [emailVerifyToken, expTime, id]);
        }
        else {
            let [result] = yield config_1.default.query('UPDATE users SET email_verify_token=?,email_verify_token_exp_date=? WHERE id=?', [emailVerifyToken, expTime, id]);
        }
        let emailResponse = yield (0, EmailVerify_1.EmailVerify)({ emailId: email, url: redirectionURL + "?token=" + emailVerifyToken });
        res.status(200).send({ message: 'Email sent successfully' });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).send(error);
    }
});
exports.verifyMyEmail = verifyMyEmail;
const checkEmailTokenAndUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = jsonwebtoken_1.default.verify(req.token, JWT_SECRET);
        // Attach the user role and ID to the request
        let [result] = yield config_1.default.query('SELECT email_verify_token FROM users WHERE id=?', [req.user.data.id]);
        if (result.length == 0) {
            return res.status(404).send({ message: 'No such user found' });
        }
        if (result[0].email_verify_token == req.token) {
            let [result] = yield config_1.default.query('UPDATE users SET email=?, is_email_verified=? WHERE id=?', [data.data.email, true, req.user.data.id]);
            return res.status(200).send({ message: 'Email updated successfully' });
        }
        else {
            return res.status(401).send({ message: 'Either link is expired or invalid' });
        }
    }
    catch (error) {
        console.log('error', error);
    }
});
exports.checkEmailTokenAndUpdate = checkEmailTokenAndUpdate;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { oldPass, newPass, type } = req.body;
        const hashedPassword = yield bcrypt_1.default.hash(newPass, 10);
        console.log('body', req.body);
        if (oldPass && type && type == 'oldPass') {
            console.log('1');
            // change with old password
            let [result] = yield config_1.default.query('SELECT password FROM users WHERE id=?', [req.user.data.id]);
            const validPassword = yield bcrypt_1.default.compare(oldPass, result[0].password || '');
            if (!validPassword) {
                return res.status(400).json({ message: 'Wrong password' });
            }
            let [changePass] = yield config_1.default.query('UPDATE users SET password=? WHERE id=?', [hashedPassword, req.user.data.id]);
            return res.status(200).send({ message: 'Password updated successfully' });
        }
        else if (type && type == 'email') {
            // change with token 
            let [result] = yield config_1.default.query('SELECT password_reset_token FROM users WHERE id=?', [req.user.data.id]);
            if (result.length == 0) {
                return res.status(404).send({ message: 'No such user found' });
            }
            if (result[0].password_reset_token == req.token) {
                let [result] = yield config_1.default.query('UPDATE users SET password=? WHERE id=?', [hashedPassword, req.user.data.id]);
                return res.status(200).send({ message: 'Password updated successfully' });
            }
            else {
                return res.status(401).send({ message: 'Either link is expired or invalid' });
            }
        }
        else {
            return res.status(400).send({ message: "Cannot process with given values" });
        }
    }
    catch (error) {
        console.log('error', error);
    }
});
exports.resetPassword = resetPassword;
