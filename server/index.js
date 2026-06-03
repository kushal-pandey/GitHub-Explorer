const express = require('express');
const cors = require('cors');
require('dotenv').config();

const githubRouter = require('./routes/github');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/github', githubRouter);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));