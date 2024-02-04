const express = require('express');
const app = express();
const PORT = 3000;

app.post('/saveVotes', (req, res) => {
    const votes = req.body;

    fs.readFile('votes.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Błąd odczytu pliku:', err);
            res.status(500).json({ success: false, error: 'Błąd odczytu pliku' });
            return;
        }

        let existingVotes = {};

        try {
            existingVotes = JSON.parse(data);
        } catch (parseError) {
            console.error('Błąd parsowania pliku JSON:', parseError);
            res.status(500).json({ success: false, error: 'Błąd parsowania pliku JSON' });
            return;
        }

        for (const option in votes) {
            if (votes.hasOwnProperty(option)) {
                existingVotes[option] = (existingVotes[option] || 0) + votes[option];
            }
        }

        fs.writeFile('votes.json', JSON.stringify(existingVotes), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Błąd zapisu pliku:', writeErr);
                res.status(500).json({ success: false, error: 'Błąd zapisu pliku' });
                return;
            }

            console.log('Zapisano głosy:', existingVotes);
            res.json({ success: true });
        });
    });
});
