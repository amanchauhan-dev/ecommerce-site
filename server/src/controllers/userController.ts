import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../db/config';
import handleValidationErrors from '../functions/FieldValidation';
import path from 'path';
import fs from 'fs'
import { EmailVerify } from '../email/EmailVerify';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Signup function
export const signup = async (req: Request, res: Response) => {
    try {
        if (!handleValidationErrors(req, res)) return;
        const { fname, lname, email, password, phone_number } = req.body;
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if ((existingUser as any[]).length > 0) {
            return res.status(400).json({ message: 'Email is already registered' });
        }
        //todo: email verification

        //!todo
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            `INSERT INTO users ( fname, lname, email, password, phone_number) VALUES (  ?, ?, ?, ?, ?)`,
            [fname, lname, email, hashedPassword, phone_number]
        );
        res.status(201).json({ message: 'User registered successfully', userId: (result as any).insertId });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


// Login function
export const login = async (req: Request, res: Response) => {
    if (!handleValidationErrors(req, res)) return;
    const { email, password } = req.body;
    try {
        const [user] = await pool.query(`SELECT 
            id,
            email,
            password
            FROM users WHERE email = ? AND status=?`, [email, 'active']);
        const [userDetails] = await pool.query(`SELECT 
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
        if ((user as any[]).length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, (user as any)[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        let exp = Math.floor(Date.now() / 1000) + (60 * 60 * 5);
        const token = jwt.sign({
            exp: exp,
            data: { id: (user as any)[0].id, role: (user as any)[0].role }
        }, JWT_SECRET);

        res.json({ message: 'Login successful', token, user: (userDetails as any[])[0] });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Login function
export const dashboardLogin = async (req: Request, res: Response) => {
    if (!handleValidationErrors(req, res)) return;
    const { email, password } = req.body;

    try {
        const [user] = await pool.query('SELECT * FROM users WHERE email = ? AND status=? AND (role=? OR role=?)', [email, 'active', 'employee', 'admin']);
        if ((user as any[]).length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, (user as any)[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: (user as any)[0].id, role: (user as any)[0].role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


// Create function
export const create = async (req: Request, res: Response) => {
    if (!handleValidationErrors(req, res)) return;
    try {
        const { role, fname, lname, email, password, phone_number, status } = req.body;
        const filename = req.file?.filename || null;
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if ((existingUser as any[]).length > 0) {
            return res.status(400).json({ message: 'Email is already registered' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            `INSERT INTO users (role, fname, lname, avatar, email, password, phone_number,status,is_email_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [role, fname, lname, filename, email, hashedPassword, phone_number, status, true]
        );

        res.status(201).json({ message: 'User created successfully', userId: (result as any).insertId });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        // Extract query parameters
        const { role, status, search, page = 1, limit = 50, sort = 'asc' } = req.query;

        // Base query
        let countQuery = 'SELECT COUNT(id) as total FROM users WHERE 1=1';
        let query = 'SELECT * FROM users WHERE 1=1';
        const queryParams: any[] = [];

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
        } else if (sort.toLocaleString().toLocaleLowerCase() == 'name') {
            countQuery += ' ORDER BY fname ASC ';
            query += ' ORDER BY fname ASC ';
        } else if (sort.toLocaleString().toLocaleLowerCase() == 'email') {
            countQuery += ' ORDER BY email ASC ';
            query += ' ORDER BY email ASC ';
        } else if (sort.toLocaleString().toLocaleLowerCase() == 'role') {
            countQuery += ' ORDER BY role DESC ';
            query += ' ORDER BY role DESC ';
        } else {
            countQuery += ' ORDER BY id DESC ';
            query += ' ORDER BY id DESC ';
        }

        // count query
        let countQueryParams = queryParams
        // Pagination
        const offset = (Number(page) - 1) * Number(limit);
        queryParams.push(Number(limit), offset);
        query += ' LIMIT ? OFFSET ?';


        // execute count query
        const [count] = await pool.query(countQuery, countQueryParams);
        // Execute query
        const [results] = await pool.query(query, queryParams);
        res.json({ data: results, page: Number(page), limit: Number(limit), total: (count as any[])[0].total });
    } catch (error: any) {
        res.status(500).json({ message: 'An error occurred while fetching users.', error });
    }
};

// Get a single user by ID
export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const [results] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        if ((results as any[]).length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json((results as any)[0]);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
    if (!handleValidationErrors(req, res)) return;
    const { id } = req.params;
    const { role, fname, lname, avatar, phone_number, status, email } = req.body;

    try {

        let query = 'UPDATE users SET ';
        let queryParams: any[] = [];
        if (fname) {
            query += "fname = ?, ";
            queryParams.push(fname);
        }
        if (lname) {
            query += 'lname = ?, '
            queryParams.push(lname);
        }
        if (email) {
            query += "email = ?, "
            queryParams.push(email);
        }
        if (phone_number) {
            query += "phone_number = ?, "
            queryParams.push(phone_number);
        }
        if (role) {
            query += 'role = ?, '
            queryParams.push(role);
        }
        if (status) {
            query += 'status = ?, '
            queryParams.push(status);
        }

        if (req.file && req.file.filename) {
            // remove old file
            const [oldFile] = await pool.query('SELECT avatar FROM users WHERE id = ?', [id]);
            let filePath = path.join(__dirname, '../../public', 'uploads', (oldFile as any[])[0].avatar)
            fs.access(filePath, fs.constants.F_OK, err => {
                if (!err) {
                    fs.unlink(filePath, err => {
                        if (err) {
                            console.log('Error found in unlinking images', err);
                        }
                    })
                }
            })
            // add attach new file
            query += "avatar = ?, "
            queryParams.push(req.file.filename);
        }
        if (queryParams.length == 0)
            return res.status(400).json({ message: 'No fields to update' });

        query = query.slice(0, -2) + " WHERE id = ?";
        queryParams.push(id);

        let [result] = await pool.query(query, [...queryParams])
        res.json({ message: 'User updated successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const [avatarImage] = await pool.query('SELECT avatar FROM users WHERE id = ? ', [id])
        const [result] = await pool.query('DELETE FROM users WHERE id = ? AND role != ?', [id, 'admin']);
        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        // remove avatar
        let avatarName: string | null = (avatarImage as any[])[0].avatar as string || null
        if (avatarName) {
            let filePath = path.join(__dirname, '../../public', 'uploads', avatarName)
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (!err) {
                    fs.unlink(filePath, err => {
                        if (err) {
                            console.log('Error found in unlinking images', err);
                        }
                    })
                }
            })
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error: any) {
        console.log('err', error);
        res.status(500).json({ error: error.message });
    }
};

// Get My Profile
export const getMyProfile = async (req: Request, res: Response) => {
    const userId = req.user?.id; // Get user ID from the request
    if (!userId) {
        return res.status(400).json({ message: 'User ID not found in request' });
    }
    try {
        const [rows] = await pool.execute(`SELECT 
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
        if ((rows as any[]).length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json((rows as any[])[0]); // Return user profile
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// Update My Profile
export const updateMyProfile = async (req: Request, res: Response) => {

    try {
        if (!handleValidationErrors(req, res)) return;
        const userId = req.user?.id; // Get user ID from the request
        if (!userId) {
            return res.status(400).json({ message: 'User ID not found in request' });
        }
        const { fname, lname, phone_number } = req.body;
        let query = `UPDATE users SET `
        let queryParams = []
        if (fname) {
            query += "fname = ?, "
            queryParams.push(fname)
        }
        if (lname) {
            query += "lname = ?, "
            queryParams.push(lname)
        }
        if (phone_number) {
            query += "phone_number = ?, "
            queryParams.push(phone_number)
        }
        if (queryParams.length == 0) {
            return res.status(404).json({ message: 'No data to change' });
        }
        query = query.slice(0, -2) + " WHERE id = ?";
        queryParams.push(userId);
        const [result] = await pool.execute(
            query,
            queryParams
        );
        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or no changes made' });
        }
        return res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server error' });
    }
};

// Verify My Profile
export const verifyMyProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const { password } = req.body
        const [result] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
        let userPassword = (result as any[]).length > 0 ? (result as any[])[0].password : '';
        const validPassword = await bcrypt.compare(password, userPassword);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        return res.status(200).json({ message: 'Profile verified successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};


// change email
export const verifyMyEmail = async (req: Request, res: Response) => {
    try {
        let id = req.params.id
        let { email, redirectionURL, type } = req.body
        let creationTime = Math.floor(Date.now() / 1000);
        let expTime = creationTime + + (60 * 5)// 5min
        const emailVerifyToken = jwt.sign({
            exp: expTime,
            data: { id: id, email: email }
        }, JWT_SECRET);
        if (type && type == 'password') {
            let [result] = await pool.query('UPDATE users SET password_reset_token=? WHERE id=?', [emailVerifyToken, expTime, id])
        } else {
            let [result] = await pool.query('UPDATE users SET email_verify_token=?,email_verify_token_exp_date=? WHERE id=?', [emailVerifyToken, expTime, id])
        }
        let emailResponse = await EmailVerify({ emailId: email, url: redirectionURL + "?token=" + emailVerifyToken })
        res.status(200).send({ message: 'Email sent successfully' })

    } catch (error: any) {
        console.log('error', error);
        res.status(500).send(error)
    }
}

export const checkEmailTokenAndUpdate = async (req: Request, res: Response) => {
    try {
        let data: any = jwt.verify(req.token, JWT_SECRET)
        // Attach the user role and ID to the request
        let [result] = await pool.query('SELECT email_verify_token FROM users WHERE id=?', [req.user.data.id])
        if ((result as any[]).length == 0) {
            return res.status(404).send({ message: 'No such user found' })
        }

        if ((result as any[])[0].email_verify_token == req.token) {
            let [result] = await pool.query('UPDATE users SET email=?, is_email_verified=? WHERE id=?', [data.data.email, true, req.user.data.id])
            return res.status(200).send({ message: 'Email updated successfully' })
        } else {
            return res.status(401).send({ message: 'Either link is expired or invalid' })
        }
    } catch (error: any) {
        console.log('error', error);
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { oldPass, newPass, type } = req.body;
        const hashedPassword = await bcrypt.hash(newPass, 10);
        console.log('body', req.body);
        if (oldPass && type && type == 'oldPass') {
            console.log('1');
            // change with old password
            let [result] = await pool.query('SELECT password FROM users WHERE id=?', [req.user.data.id])
            const validPassword = await bcrypt.compare(oldPass, (result as any)[0].password || '');
            if (!validPassword) {
                return res.status(400).json({ message: 'Wrong password' });
            }
            let [changePass] = await pool.query('UPDATE users SET password=? WHERE id=?', [hashedPassword, req.user.data.id])
            return res.status(200).send({ message: 'Password updated successfully' })

        } else if (type && type == 'email') {
            // change with token 
            let [result] = await pool.query('SELECT password_reset_token FROM users WHERE id=?', [req.user.data.id])
            if ((result as any[]).length == 0) {
                return res.status(404).send({ message: 'No such user found' })
            }
            if ((result as any[])[0].password_reset_token == req.token) {
                let [result] = await pool.query('UPDATE users SET password=? WHERE id=?', [hashedPassword, req.user.data.id])
                return res.status(200).send({ message: 'Password updated successfully' })
            } else {
                return res.status(401).send({ message: 'Either link is expired or invalid' })
            }
        } else {
            return res.status(400).send({ message: "Cannot process with given values" })
        }
    } catch (error: any) {
        console.log('error', error);
    }
}