const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

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

app.get('/getVotes', (req, res) => {
    fs.readFile('votes.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Błąd odczytu pliku:', err);
            res.status(500).json({ success: false, error: 'Błąd odczytu pliku' });
            return;
        }

        let votes = {};

        try {
            votes = JSON.parse(data);
        } catch (parseError) {
            console.error('Błąd parsowania pliku JSON:', parseError);
            res.status(500).json({ success: false, error: 'Błąd parsowania pliku JSON' });
            return;
        }

        const votesForTak = votes.tak || 0;
        const votesForNie = votes.nie || 0;

        res.json({ success: true, votesForTak, votesForNie });
    });
});

app.listen(PORT, () => {
    console.log(`Serwer nasłuchuje na porcie ${PORT}`);
});