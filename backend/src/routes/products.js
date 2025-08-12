const { Router } = require('express');
const { Product, ProductVariant } = require('../models');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: { isActive: true },
      include: [{ model: ProductVariant, as: 'variants' }],
      order: [['id', 'ASC']],
    });
    res.json(products);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, { include: [{ model: ProductVariant, as: 'variants' }] });
    if (!product || !product.isActive) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (e) { next(e); }
});

module.exports = router;