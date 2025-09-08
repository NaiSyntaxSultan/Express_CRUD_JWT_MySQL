const db = require('../config/db');

exports.read = async (req, res) => {
    const { id } = req.params;
    try {
        // code
        const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.json({
            success: true,
            product: rows[0]
        })
    } catch (err) {
        // error
        console.log(err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}

exports.list = async (req, res) => {
    try {
        // code
        const [rows] = await db.execute('SELECT * FROM products');

        res.json({
            success: true,
            count: rows.length,
            products: rows
        });
    } catch (err) {
        // error
        console.log(err);
        res.status(500).json({ 
            success: false,
            error: 'Server Error'
         });
    }
}

exports.create = async (req, res) => {
    const { name, description, price } = req.body;
    try {
        // code
        console.log(req.body);
        const [producted] = await db.execute('INSERT INTO products (name, description, price) VALUES (?, ?, ?)', [name, description, price]);
        console.log(producted);
        res.status(201).json({ 
            success: true, 
            productId: producted.insertId 
        });
    } catch (err) {
        // error
        console.log(err);
        res.status(500).json({ 
            success: false,
            error: 'Server Error'
        });
    }
}

exports.update = async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
        return res.status(400).json({
            success: false,
            error: 'All fields are required'
        });
    }

    try {
        // code
        const [result] = await db.execute('UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?', [name, description, price, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product updated successfully'
        });
    } catch (err) {
        // error
        console.log(err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}

exports.remove = async (req, res) => {
    const { id } = req.params;
    try {
        // code
        const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.status(204).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (err) {
        // error
        console.log(err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}