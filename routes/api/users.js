const express = require('express');
const router = express.Router();

//route: GET api/users/test
//description: Tests users route
//access: Public
router.get('/test', (req, res) => res.json({msg: 'goodbye world'}))

//route: GET api/users/register
//description: z
//access: Public

module.exports = router;
