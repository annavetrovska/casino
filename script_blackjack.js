let deck = [];
let playerHand = [];
let dealerHand = [];
let gameActive = false;
let totalPoints = 0;

// Začátečnické vytvoření balíčku pomocí klasických cyklů
function createDeck() {
    let newDeck = [];
    // 4 barvy
    for (let i = 0; i < 4; i++) {
        // Karty od 1 do 10
        for (let value = 1; value <= 10; value++) {
            newDeck.push(value);
        }
    }
    
    // Klasické zamíchání balíčku
    for (let i = newDeck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let docasnaKarta = newDeck[i];
        newDeck[i] = newDeck[j];
        newDeck[j] = docasnaKarta;
    }
    return newDeck;
}

// Spočítání skóre pomocí obyčejného for cyklu
function calculateScore(hand) {
    let celkem = 0;
    for (let i = 0; i < hand.length; i++) {
        celkem = celkem + hand[i];
    }
    return celkem;
}

// Aktualizace bodů na obrazovce
function updatePoints(amount) {
    totalPoints = totalPoints + amount;
    if (totalPoints < 0) {
        totalPoints = 0; 
    }
    document.getElementById('score-counter').innerText = 'Celkové body: ' + totalPoints;
}

// Vykreslení karet bez použití složitého .map() a .join()
function renderHand(hand, hideFirstCard) {
    let htmlKodu = "";
    for (let i = 0; i < hand.length; i++) {
        if (hideFirstCard === true && i === 0) {
            // Skrytá karta dealera
            htmlKodu = htmlKodu + '<div class="card-visual" style="background:#555555; color:white;">?</div>';
        } else {
            // Normální karta
            htmlKodu = htmlKodu + '<div class="card-visual">' + hand[i] + '</div>';
        }
    }
    return htmlKodu;
}

function startGame() {
    deck = createDeck();
    // Každý dostane na začátku jednu kartu
    playerHand = [deck.pop()];
    dealerHand = [deck.pop()];
    gameActive = true;

    document.getElementById('start-controls').style.display = 'none';
    document.getElementById('game-controls').style.display = 'flex';
    document.getElementById('message').innerText = "Tvoje řada! Chceš další kartu nebo stát?";

    updateUI(true);
}

function updateUI(hideDealer) {
    document.getElementById('player-cards').innerHTML = renderHand(playerHand, false);
    document.getElementById('player-score').innerText = 'Skóre: ' + calculateScore(playerHand);

    if (hideDealer === true) {
        document.getElementById('dealer-cards').innerHTML = renderHand(dealerHand, true);
        document.getElementById('dealer-score').innerText = 'Skóre: ?';
    } else {
        document.getElementById('dealer-cards').innerHTML = renderHand(dealerHand, false);
        document.getElementById('dealer-score').innerText = 'Skóre: ' + calculateScore(dealerHand);
    }
}

function hit() {
    if (gameActive === false) {
        return;
    }

    playerHand.push(deck.pop());
    let pScore = calculateScore(playerHand);

    if (pScore > 21) {
        updateUI(false);
        updatePoints(-5); // Ztráta bodů za přetažení
        endGame('Přetáhl jsi! Máš ' + pScore + '. Dealer vyhrává! 😢');
    } else if (pScore === 21) {
        updateUI(true);
        stand(); // Při 21 automaticky stojíš
    } else {
        updateUI(true);
    }
}

function stand() {
    if (gameActive === false) {
        return;
    }

    let dScore = calculateScore(dealerHand);

    // Dealer hraje, dokud nemá alespoň 17 (standardní pravidlo pro 21)
    while (dScore < 17) {
        dealerHand.push(deck.pop());
        dScore = calculateScore(dealerHand);
    }

    updateUI(false);
    determineWinner();
}

function determineWinner() {
    let pScore = calculateScore(playerHand);
    let dScore = calculateScore(dealerHand);

    if (dScore > 21) {
        if (pScore === 21) {
            updatePoints(15);
            endGame('Perfektní 21! A dealer navíc přetáhl! Super výhra! 🎉');
        } else {
            updatePoints(10);
            endGame('Dealer měl ' + dScore + ' a přetáhl! Vyhráváš! 💖');
        }
    } else if (pScore > dScore) {
        if (pScore === 21) {
            updatePoints(15); // Bonus za přesnou 21
            endGame('Perfektní 21! Máš plný počet bodů! 👑');
        } else {
            updatePoints(10); 
            endGame('Máš ' + pScore + ' vs Dealer ' + dScore + '. Vyhráváš! 💕');
        }
    } else if (pScore < dScore) {
        updatePoints(-5); 
        endGame('Dealer vyhrává s ' + dScore + ' vs tvých ' + pScore + '. 💔');
    } else {
        endGame('Remíza! Oba máte ' + pScore + '. Nikdo neprohrál. 🤝');
    }
}

function endGame(resultMessage) {
    gameActive = false;
    document.getElementById('message').innerText = resultMessage;
    document.getElementById('game-controls').style.display = 'none';
    document.getElementById('start-controls').style.display = 'flex';
    document.getElementById('start-controls').querySelector('button').innerText = "Hrát znovu";
}