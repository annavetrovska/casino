let balance = 100;
const symbols = ["🍋", "🍒", "7️⃣", "🍇", "💎"];

function spin() {
    // 1. Check if the player has enough money
    if (balance < 10) {
        updateUI();
        return;
    }

    // 2. Pay 10 credits to spin
    balance -= 10;

    // 3. Roll 3 random symbols
    const slot1 = getRandomSymbol();
    const slot2 = getRandomSymbol();
    const slot3 = getRandomSymbol();

    // 4. Show the symbols on the screen
    updateReel("reel1", slot1);
    updateReel("reel2", slot2);
    updateReel("reel3", slot3);

    // 5. Figure out the winnings based on matches
    calculateWinnings(slot1, slot2, slot3);
}

// Helper function to grab a random emoji
function getRandomSymbol() {
    const randomIndex = Math.floor(Math.random() * symbols.length);
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

    // Check for 3 of a kind (All match)
    if (s1 === s2 && s2 === s3) {
        balance += 50;
        messageElement.innerText = "JACKPOT! +$50";
        messageElement.style.color = "#ff00ff";
    } 
    // Check for 2 of a kind (Any two match)
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