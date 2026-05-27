let balance = 100
const symbols = ["🍋", "🍒", "7️⃣", "🍇","💎"]

function spin() {
    if (balance < 10) {
        updateUI()
        return
    }

    balance -= 10
    
    const results = []
    for (let i = 1; i <= 3; i++) {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)]
        results.push(symbol)
        
        const reelElement = document.getElementById(`reel${i}`)
        if (reelElement) {
            reelElement.innerText = symbol
        }
    }

    const counts = {}
    results.forEach(s => counts[s] = (counts[s] || 0) + 1)
    const maxMatch = Math.max(...Object.values(counts))
    handlePrizes(maxMatch)
}

function handlePrizes(matchCount) {
    const msg = document.getElementById("message")
    if (!msg) return

    if (matchCount === 3) {
        balance += 50
        msg.innerText = "JACKPOT! +$50"
        msg.style.color = "#ff00ff"
    } else if (matchCount === 2) {
        balance += 20
        msg.innerText = "Small Match! +$20"
        msg.style.color = "cyan"
    } else {
        msg.innerText = "No luck this time."
        msg.style.color = "white"
    }
    updateUI()
}

function updateUI() {
    const balanceElement = document.getElementById("balance")
    if (balanceElement) {
        balanceElement.innerText = balance
    }
}