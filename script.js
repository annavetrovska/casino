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

// Inicializace po načtení stránky
window.onload = function() {
    updateUI();
};

// --- LOGIKA PRO HOD MINCÍ ---

let playerChoice = "Panna"; // Výchozí volba hráče

// Funkce pro výběr strany mince (spouští se kliknutím na tlačítka)
function selectSide(side) {
    playerChoice = side;
    
    const btnPanna = document.getElementById("btn-panna");
    const btnOrel = document.getElementById("btn-orel");
    
    if (!btnPanna || !btnOrel) return;
    
    if (side === "Panna") {
        btnPanna.classList.add("active");
        btnOrel.classList.remove("active");
    } else {
        btnOrel.classList.add("active");
        btnPanna.classList.remove("active");
    }
}

// Funkce pro hod mincí
function flip() {
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

    // Přidání animace otáčení a přechodného textu
    if (coinElement) {
        coinElement.classList.add("flipping");
        coinElement.innerText = "🪙"; // Během točení ukážeme minci
    }
    
    if (messageElement) {
        messageElement.innerText = "Mince se točí...";
        messageElement.style.color = "white";
    }

    // Počkáme 1 sekundu na animaci otáčení
    setTimeout(() => {
        // Náhodné číslo: 0 = Panna, 1 = Orel
        const resultNum = Math.floor(Math.random() * 2);
        const result = (resultNum === 0) ? "Panna" : "Orel";
        const emoji = (result === "Panna") ? "👩" : "🦅";

        // Zastavení animace a zobrazení výsledného symbolu
        if (coinElement) {
            coinElement.classList.remove("flipping");
            coinElement.innerText = emoji;
        }

        // Vyhodnocení výhry
        if (messageElement) {
            if (result === playerChoice) {
                balance += 20; // Vrátí se sázka + výhra dalších 10
                messageElement.innerText = `Vyhrál jsi! Padla ${result === "Panna" ? "Panna 👩" : "Orel 🦅"}. +$20`;
                messageElement.style.color = "cyan";
            } else {
                messageElement.innerText = `Prohrál jsi! Padla ${result === "Panna" ? "Panna 👩" : "Orel 🦅"}.`;
                messageElement.style.color = "white";
            }
        }

        updateUI();
    }, 1000);
}