const { Router } = require('express');
const Joi = require('joi');
const { auth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { CartItem, ProductVariant, Product } = require('../models');

const router = Router();
router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const items = await CartItem.findAll({
      where: { userId: req.user.id },
      include: [{ model: ProductVariant, as: 'variant', include: [{ model: Product, as: 'product' }] }],
      order: [['id', 'ASC']],
    });
    res.json(items);
  } catch (e) { next(e); }
});

const addSchema = Joi.object({
  productVariantId: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(1).max(99).default(1),
});

router.post('/', validate(addSchema), async (req, res, next) => {
  try {
    const { productVariantId, quantity } = req.body;
    const variant = await ProductVariant.findByPk(productVariantId);
    if (!variant) return res.status(404).json({ error: 'Variant not found' });
    const [item, created] = await CartItem.findOrCreate({
      where: { userId: req.user.id, productVariantId },
      defaults: { quantity },
    });
    if (!created) {
      item.quantity += quantity;
      await item.save();
    }
    res.status(created ? 201 : 200).json(item);
  } catch (e) { next(e); }
});

const updateSchema = Joi.object({
  quantity: Joi.number().integer().min(1).max(99).required(),
});

router.put('/:id', validate(updateSchema), async (req, res, next) => {
  try {
    const item = await CartItem.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!item) return res.status(404).json({ error: 'Not found' });
    item.quantity = req.body.quantity;
    await item.save();
    res.json(item);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const item = await CartItem.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.destroy();
    res.status(204).send();
  } catch (e) { next(e); }
});

module.exports = router;