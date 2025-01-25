import { Request, Response } from 'express';
import pool from '../db/config';



export const GetNewProducts = async (req: Request, res: Response) => {
    try {
        const [result] = await pool.query(`
            SELECT * FROM products 
            WHERE status = 1 ORDER BY id
            DESC LIMIT 30
            `);
        res.send({ result })
    } catch (error: any) {
        res.status(501).json(error)
        console.log('Error', error);
    }
}