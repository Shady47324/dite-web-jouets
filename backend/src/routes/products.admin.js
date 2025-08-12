const { Router } = require('express');
const Joi = require('joi');
const { Product, ProductVariant } = require('../models');
const { auth, adminOnly } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = Router();
router.use(auth, adminOnly);

const productSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().allow('').optional(),
  images: Joi.array().items(Joi.string().uri()).default([]),
  isActive: Joi.boolean().default(true),
  variants: Joi.array().items(Joi.object({
    id: Joi.number().optional(),
    sku: Joi.string().required(),
    price: Joi.number().integer().min(0).required(),
    stock: Joi.number().integer().min(0).required(),
    options: Joi.object().unknown(true).optional(),
  })).default([])
});

router.post('/', validate(productSchema), async (req, res, next) => {
  try {
    const { variants, ...data } = req.body;
    const product = await Product.create(data);
    for (const v of variants) {
      await ProductVariant.create({ ...v, productId: product.id });
    }
    const created = await Product.findByPk(product.id, { include: [{ model: ProductVariant, as: 'variants' }] });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

router.put('/:id', validate(productSchema), async (req, res, next) => {
  try {
    const { variants, ...data } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    await product.update(data);
    // Upsert variants (simple: delete all, recreate)
    await ProductVariant.destroy({ where: { productId: product.id } });
    for (const v of variants) {
      await ProductVariant.create({ ...v, productId: product.id });
    }
    const updated = await Product.findByPk(product.id, { include: [{ model: ProductVariant, as: 'variants' }] });
    res.json(updated);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    await product.destroy();
    res.status(204).send();
  } catch (e) { next(e); }
});

module.exports = router;