const express = require('express');
const router = express.Router();

//route: GET api/posts/test
//description: Tests get route
//access: Public
router.get('/test', (req, res) => res.json({data: 'This is my cool data'}))


module.exports = router;
