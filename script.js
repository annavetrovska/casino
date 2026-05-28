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

    let result;
    let emoji;

    if (resultNum === 0) {
        result = "Panna";
        emoji = "👩";
    } else {
        result = "Orel";
        emoji = "🦅";
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
    let newDeck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    // Klasické zamíchání balíčku
    for (let i = newDeck.length - 1; i > 0; i--) { // jede i = 39, i = 38, atd. až do i = 1
        let randomNumber = Math.floor(Math.random() * (i + 1)); // <0,1) * {39 + 1, 38 + 1, 37 + 1 atd. až do 1 + 1}
        let docasnaKarta = newDeck[i]; // 39, 38, 37 ...
        newDeck[i] = newDeck[randomNumber];
        newDeck[randomNumber] = docasnaKarta;
    }
    return newDeck;
}

// Spočítání skóre pomocí obyčejného for cyklu
function calculateScore(hand) { // prijde playreHand nebo dealerHand
    let celkem = 0;
    for (let i = 0; i < hand.length; i++) { // i = 0, i = 1, atd. až do indexu posledniho prvku
        celkem += hand[i];
    }
    return celkem;
}

// Aktualizace bodů na obrazovce
function updatePoints(amount) {
    totalPoints += Number(amount);
    if (totalPoints < 0) {
        totalPoints = 0; 
    }
    const scoreElement = document.getElementById('score-counter');
    if (scoreElement) {
        scoreElement.innerText = 'Balance: ' + totalPoints;
    }
}

// Vykreslení karet na obrazovce
function renderHand(hand, hideFirstCard) { // hand dostane playerHand nebo dealerHand a hideFirstCard je boolean (true/false)
    let htmlCode = "";
    for (let i = 0; i < hand.length; i++) { // 0, 1, atd. až do delky playerHand nebo dealerHand
        if (hideFirstCard === true && i === 0) { // && = and
            // Skrytá karta dealera
            htmlCode += '<div class="card-visual" style="background:#555555; color:white;">?</div>'; // skryta tam ma "?"
        } else {
            // Normální karta
            htmlCode += '<div class="card-visual">' + hand[i] + '</div>'; // tahle tam ma tu hodnotu zjistenou podle indexu kterej se zvetsuje kazdym prubehem foru
        }
    }
    return htmlCode;
}

function startGame() {
    deck = createDeck();
    // Každý dostane na začátku jednu kartu
    playerHand = [deck.pop()]; // pop odstrani posledni, a tady ho zaroven da do ruky
    dealerHand = [deck.pop()]; // to samy
    gameActive = true;

    const startControls = document.getElementById('start-controls');
    if (startControls) {
        startControls.style.display = 'none'; // pri startu hry ho shova
    }

    const gameControls = document.getElementById('game-controls'); // defaultne schovanej
    if (gameControls) {
        gameControls.style.display = 'flex'; // tady se ukaze (na zacatku hry)
    }

    const messageElement = document.getElementById('message');
    if (messageElement) {
        messageElement.innerText = "Tvoje řada! Chceš další kartu nebo stát?"; // na zacatku hry se prpise
    }

    updateBlackjackUI(true);
}

function updateBlackjackUI(hideDealer) { // dostane boolean
    const playerCards = document.getElementById('player-cards');
    const playerScore = document.getElementById('player-score');
    const dealerCards = document.getElementById('dealer-cards');
    const dealerScore = document.getElementById('dealer-score');
    
    if (playerCards) {
        playerCards.innerHTML = renderHand(playerHand, false); // renderHand hand vrati ty divy
    }

    if (playerScore) {
        playerScore.innerText = 'Skóre: ' + calculateScore(playerHand); // dostane pole (seznam) a vrati soucet
    }

    if (hideDealer === true) {
        if (dealerCards) {
            dealerCards.innerHTML = renderHand(dealerHand, true) // vraci divy s "?"
        }
        if (dealerScore) {
            dealerScore.innerText = 'Skóre: ?'
        }
    } else { // tady uz ukazuje karty
        if (dealerCards) {
            dealerCards.innerHTML = renderHand(dealerHand, false) // vaci normalni divy s cislama
        }
        if (dealerScore) {
            dealerScore.innerText = 'Skóre: ' + calculateScore(dealerHand) // vrati spocitany skore dealera
        }
    }
}

function hit() {
    if (gameActive === false) {
        return;
    }

    playerHand.push(deck.pop()); // vyjme posledni z deku a da ho nakonec playerHand
    let pScore = calculateScore(playerHand); // spocita skore hraci

    if (pScore > 21) {
        updateBlackjackUI(false); // nezobrazuje dealera
        updatePoints(-5); // Ztráta bodů za přetažení
        endGame('Přetáhl jsi! Máš ' + pScore + '. Dealer vyhrává! 😢'); // konci hru s custom zpravou
    } else if (pScore === 21) {
        updateBlackjackUI(true); // zobrazuje dealera
        stand(); // Při 21 automaticky stojíš
    } else {
        updateBlackjackUI(true); // zobrazuje dealera
    }
}

function stand() {
    if (gameActive === false) {
        return;
    }

    let dScore = calculateScore(dealerHand); // spocita skore dealerovy

    // Dealer hraje, dokud nemá alespoň 17 (standardní pravidlo pro 21)
    while (dScore < 17) { // do sedumnacti dealer hituje
        dealerHand.push(deck.pop()); // vyjme posledni z deku a da ho nakonec dealerHand
        dScore = calculateScore(dealerHand); // spocita skore dealerovy
    }

    updateBlackjackUI(false);
    determineWinner();
}

function determineWinner() {
    let pScore = calculateScore(playerHand);
    let dScore = calculateScore(dealerHand);

    if (dScore > 21) { // dealer presah
        if (pScore === 21) { // player ma presne
            updatePoints(15);
            endGame('Perfektní 21! A dealer navíc přetáhl! Super výhra! 🎉');
        } else { // playre ma pod
            updatePoints(10);
            endGame('Dealer měl ' + dScore + ' a přetáhl! Vyhráváš! 💖');
        }
    } else if (pScore > dScore) { // player ma vic ne dealer
        if (pScore === 21) { // player ma presne
            updatePoints(15); // Bonus za přesnou 21
            endGame('Perfektní 21! Máš plný počet bodů! 👑');
        } else { // dealer ma min ale player nema presne
            updatePoints(10); 
            endGame('Máš ' + pScore + ' vs Dealer ' + dScore + '. Vyhráváš! 💕');
        }
    } else if (pScore < dScore) { // player ma min
        updatePoints(-5); 
        endGame('Dealer vyhrává s ' + dScore + ' vs tvých ' + pScore + '. 💔');
    } else { // oba stejne
        endGame('Remíza! Oba máte ' + pScore + '. Nikdo neprohrál. 🤝');
    }
}

function endGame(resultMessage) { // prijma to message
    gameActive = false;
    const messageElement = document.getElementById('message');
    if (messageElement) {
        messageElement.innerText = resultMessage;
    }

    const gameControls = document.getElementById('game-controls');
    if (gameControls) gameControls.style.display = 'none'; // skreje hit a stand

    const startControls = document.getElementById('start-controls');
    if (startControls) {
        startControls.style.display = 'flex'; // zobrazio start button
        const startBtn = startControls.querySelector('button'); //najde to prvni button v start controls
        if (startBtn) {
            startBtn.innerText = "Hrát znovu" // prepise "Start hry" na "Hrát znovu"
        }
    }
}