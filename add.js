function goTo() {
    window.location.href = "/components/form.html";

}



function updateVotesCount() {
    fetch('http://localhost:3000/getVotes')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const votesForTak = data.votesForTak || 0;
                const votesForNie = data.votesForNie || 0;

                document.getElementById('votesCountTak').textContent = `Ilość na tak: ${votesForTak}`;
                document.getElementById('votesCountNie').textContent = `Ilość na nie: ${votesForNie}`;
            } else {
                console.error('Błąd pobierania ilości głosów:', data.error);
            }
        })
        .catch(error => console.error('Błąd:', error));
}

window.onload = updateVotesCount;

