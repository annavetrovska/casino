let balance = 100;
const symbols = ["🍋", "🍒", "7️⃣", "🍇", "💎"];

function spin() {
    if (balance < 10) {
        updateUI();
        return;
    }

    balance -= 10;

    const slot1 = getRandomSymbol();
    const slot2 = getRandomSymbol();
    const slot3 = getRandomSymbol();

    updateReel("reel1", slot1);
    updateReel("reel2", slot2);
    updateReel("reel3", slot3);

    // Figure out the winnings based on matches
    calculateWinnings(slot1, slot2, slot3);
}

// Helper function to grab a random emoji
function getRandomSymbol() {
    const randomIndex = Math.floor(Math.random() * symbols.length); // <0,1) * 5 = <0,5), zaokrohlím na podlahu = dolů, jediné čísla 01234
    return symbols[randomIndex];
}

// Helper function to safely update a reel on the screen
function updateReel(reelId, symbol) {
    const reelElement = document.getElementById(reelId);
    if (reelElement) {
        reelElement.innerText = symbol;
    }
}

function calculateWinnings(s1, s2, s3) {
    const messageElement = document.getElementById("message");
    if (!messageElement) return;

    // Check for 3 of a kind (All match), && = 1. i 2. podmínka pravdivá, AND
    if (s1 === s2 && s2 === s3) {
        balance += 50;
        messageElement.innerText = "JACKPOT! +$50";
        messageElement.style.color = "#ff00ff";
    } 
    // Check for 2 of a kind (Any two match), || = OR , aspoň jedna pravdivá
    else if (s1 === s2 || s1 === s3 || s2 === s3) {
        balance += 20;
        messageElement.innerText = "Small Match! +$20";
        messageElement.style.color = "cyan";
    } 
    // No match
    else {
        messageElement.innerText = "No luck this time.";
        messageElement.style.color = "white";
    }

    // Always update the balance display at the end
    updateUI();
}

function updateUI() {
    const balanceElement = document.getElementById("balance");
    if (balanceElement) {
        balanceElement.innerText = balance;
    }
}

// Když načtu stránku, zavolá se updateUI
window.onload = function() {
    updateUI();
};

function flip(chosenSide) {
    // Ověření dostatečného zůstatku
    if (balance < 10) {
        const messageElement = document.getElementById("message");
        if (messageElement) {
            messageElement.innerText = "Nemáš dostatek peněz na sázku ($10)!";
            messageElement.style.color = "red";
        }
        return;
    }

    balance -= 10;
    updateUI();

    const coinElement = document.getElementById("coin");
    const messageElement = document.getElementById("message");

    // Náhodné číslo: 0 = Panna, 1 = Orel
    const resultNum = Math.floor(Math.random() * 2); // <0,1) * 2 = <0,2), zaokrouhlím dolů = 0 nebo 1
    
    if (resultNum === 0) {
        let result = "Panna";
        let emoji = "👩";
    } else {
        let result = "Orel";
        let emoji = "🦅";
    }

    // Zobrazení výsledného symbolu
    if (coinElement) {
        coinElement.innerText = emoji;
    }

    // Vyhodnocení výhry
    if (messageElement) {
        if (result === chosenSide) {
            balance += 20; // Vrátí se sázka + výhra dalších 10
            messageElement.innerText = `Vyhrál jsi! Padla ${result} ${emoji}. +$20`; //interpolace
            messageElement.style.color = "cyan";
        } else {
            messageElement.innerText = `Prohrál jsi! Padla ${result} ${emoji}.`;
            messageElement.style.color = "white";
        }
    }

    updateUI();
}

//BLACKJACK GAME CODE

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
    const scoreElement = document.getElementById('score-counter');
    if (scoreElement) {
        scoreElement.innerText = 'balance: ' + totalPoints;
    }
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

    const startControls = document.getElementById('start-controls');
    if (startControls) startControls.style.display = 'none';

    const gameControls = document.getElementById('game-controls');
    if (gameControls) gameControls.style.display = 'flex';

    const messageElement = document.getElementById('message');
    if (messageElement) {
        messageElement.innerText = "Tvoje řada! Chceš další kartu nebo stát?";
    }

    updateBlackjackUI(true);
}

function updateBlackjackUI(hideDealer) {
    const playerCards = document.getElementById('player-cards');
    if (playerCards) {
        playerCards.innerHTML = renderHand(playerHand, false);
    }
    const playerScore = document.getElementById('player-score');
    if (playerScore) {
        playerScore.innerText = 'Skóre: ' + calculateScore(playerHand);
    }

    const dealerCards = document.getElementById('dealer-cards');
    const dealerScore = document.getElementById('dealer-score');

    if (hideDealer === true) {
        if (dealerCards) dealerCards.innerHTML = renderHand(dealerHand, true);
        if (dealerScore) dealerScore.innerText = 'Skóre: ?';
    } else {
        if (dealerCards) dealerCards.innerHTML = renderHand(dealerHand, false);
        if (dealerScore) dealerScore.innerText = 'Skóre: ' + calculateScore(dealerHand);
    }
}

function hit() {
    if (gameActive === false) {
        return;
    }

    playerHand.push(deck.pop());
    let pScore = calculateScore(playerHand);

    if (pScore > 21) {
        updateBlackjackUI(false);
        updatePoints(-5); // Ztráta bodů za přetažení
        endGame('Přetáhl jsi! Máš ' + pScore + '. Dealer vyhrává! 😢');
    } else if (pScore === 21) {
        updateBlackjackUI(true);
        stand(); // Při 21 automaticky stojíš
    } else {
        updateBlackjackUI(true);
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

    updateBlackjackUI(false);
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
    const messageElement = document.getElementById('message');
    if (messageElement) {
        messageElement.innerText = resultMessage;
    }

    const gameControls = document.getElementById('game-controls');
    if (gameControls) gameControls.style.display = 'none';

    const startControls = document.getElementById('start-controls');
    if (startControls) {
        startControls.style.display = 'flex';
        const startBtn = startControls.querySelector('button');
        if (startBtn) startBtn.innerText = "Hrát znovu";
    }
}