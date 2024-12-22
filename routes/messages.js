const express = require('express');
const { Message, Sequelize } = require('../models');
const authenticateJWT = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateJWT, async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: {
        [Sequelize.Op.or]: [
          { senderId: req.user.id },
          { receiverId: req.user.id }
        ]
      }
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { content, receiverId } = req.body;
    const message = await Message.create({
      content,
      senderId: req.user.id,
      receiverId
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error creating message' });
  }
});

module.exports = router;
