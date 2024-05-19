const store = require('../mongoStore');

exports.fetchUserData = async(req, res) => {
    try {
        const { sessionID } = req.body;
        store && store?.get(sessionID, (error, sessionData) => {
            if (error) {
              console.error('Error retrieving session data:', error);
            } else {
              return res.status(201).json({ userDetails: sessionData?.user });
            }
          });
    } catch(e) {
        res.status(500).json({ error: 'Unable to fetch User details' });
    }
};
