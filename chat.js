/**************************************
 * LISA – Legal Awareness Chatbot
 * Single-file working logic
 * Legal awareness only (not legal advice)
 **************************************/

// ================================
// MEMORY (Conversation Context)
// ================================
let lastDetectedIntent = null;

// ================================
// INTENT DETECTION
// ================================
async function identifyIntent(input, lastIntent) {
    const text = input.toLowerCase();

    // SAFETY / CRIME
    if (
        text.includes("harass") ||
        text.includes("harassment") ||
        text.includes("unsafe") ||
        text.includes("threat") ||
        text.includes("robbed") ||
        text.includes("stolen") ||
        text.includes("assault") ||
        text.includes("attack") ||
        text.includes("rape") ||
        text.includes("molest") ||
        text.includes("stalking") ||
        text.includes("violence") ||
        text.includes("murder") ||
        text.includes("kidnap")
    ) {
        return "safety";
    }

    // WORKPLACE
    if (
        text.includes("workplace") ||
        text.includes("office") ||
        text.includes("boss") ||
        text.includes("manager") ||
        text.includes("salary") ||
        text.includes("fired") ||
        text.includes("termination") ||
        text.includes("resign") ||
        text.includes("posh")
    ) {
        return "workplace";
    }

    // FRAUD / MONEY
    if (
        text.includes("money") ||
        text.includes("fraud") ||
        text.includes("scam") ||
        text.includes("cheated") ||
        text.includes("upi") ||
        text.includes("loan") ||
        text.includes("investment") ||
        text.includes("blackmail")
    ) {
        return "fraud";
    }

    // CONSUMER
    if (
        text.includes("refund") ||
        text.includes("product") ||
        text.includes("service") ||
        text.includes("defective") ||
        text.includes("warranty")
    ) {
        return "consumer";
    }

    // CYBER
    if (
        text.includes("hacked") ||
        text.includes("fake account") ||
        text.includes("online abuse") ||
        text.includes("privacy") ||
        text.includes("data leak")
    ) {
        return "cyber";
    }

    // FAMILY / PROPERTY
    if (
        text.includes("divorce") ||
        text.includes("dowry") ||
        text.includes("custody") ||
        text.includes("property") ||
        text.includes("land") ||
        text.includes("inheritance")
    ) {
        return "family";
    }

    // FOLLOW-UP QUESTIONS
    if (
        text.includes("what to do") ||
        text.includes("next") ||
        text.includes("help") ||
        text.includes("procedure") ||
        text.includes("how")
    ) {
        return lastIntent || "general";
    }

    return "general";
}

// ================================
// MAIN RESPONSE HANDLER
// ================================
async function generateHybridResponse(userInput) {
    const intent = await identifyIntent(userInput, lastDetectedIntent);
    lastDetectedIntent = intent;

    switch (intent) {
        case "safety":
            return safetyResponse();

        case "workplace":
            return workplaceResponse();

        case "fraud":
            return fraudResponse();

        case "consumer":
            return consumerResponse();

        case "cyber":
            return cyberResponse();

        case "family":
            return familyResponse();

        default:
            return generalResponse();
    }
}

// ================================
// RESPONSE FUNCTIONS
// ================================
function safetyResponse() {
    return `
I understand this is serious. Your safety comes first.

What you can do:
• Go to the nearest police station and file an FIR
• Call emergency services if you are in danger
• Preserve evidence (photos, messages, CCTV)
• For workplace harassment involving women, the POSH Act applies

LISA provides legal awareness, not legal advice.
`;
}

function workplaceResponse() {
    return `
Workplace issues are protected under Indian law.

What you can do:
• File a complaint with the Internal Complaints Committee (POSH)
• Preserve emails, messages, witnesses
• Approach the Labour Commissioner if needed

LISA provides legal awareness, not legal advice.
`;
}

function fraudResponse() {
    return `
This may fall under cheating or cyber fraud.

What you can do:
• Collect bank statements, payment receipts, chats
• File an FIR at the nearest police station
• Report online fraud at https://cybercrime.gov.in

LISA provides legal awareness, not legal advice.
`;
}

function consumerResponse() {
    return `
You have consumer protection rights.

What you can do:
• Contact the company in writing
• File a complaint at https://consumerhelpline.gov.in
• Approach Consumer Court if unresolved

LISA provides legal awareness, not legal advice.
`;
}

function cyberResponse() {
    return `
Cyber issues are punishable under IT laws.

What you can do:
• Change passwords immediately
• Take screenshots as evidence
• Report to https://cybercrime.gov.in

LISA provides legal awareness, not legal advice.
`;
}

function familyResponse() {
    return `
Family and property disputes are handled under civil law.

What you can do:
• Collect all legal documents
• Approach legal aid services or an advocate
• Courts decide these matters based on evidence

LISA provides legal awareness, not legal advice.
`;
}

function generalResponse() {
    return `
Hello! I'm LISA. How can I assist you with your legal questions today?

I can help with legal awareness related to:
• Safety or crime
• Money or fraud
• Workplace issues
• Consumer complaints
• Cyber issues
• Family or property matters

LISA provides legal awareness, not legal advice.
`;
}

// ================================
// EXAMPLE TERMINAL USAGE (OPTIONAL)
// ================================
/*
(async () => {
  console.log(await generateHybridResponse("hello"));
  console.log(await generateHybridResponse("someone stole my money"));
  console.log(await generateHybridResponse("what to do"));
})();
*/
// ================================
// UI CONNECTION
// ================================

document.addEventListener("DOMContentLoaded", () => {
    const chatMessages = document.getElementById("chat-messages");
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");
    const typingIndicator = document.getElementById("typing-indicator");
    const clearChatBtn = document.getElementById("clear-chat-btn");
    const suggestionChips = document.querySelectorAll(".suggestion-chips .chip");

    if (!chatMessages || !chatInput || !sendBtn) {
        console.error("Chat UI elements not found");
        return;
    }

    // Auto-resize textarea
    chatInput.addEventListener("input", function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        
        // Handle button state
        sendBtn.disabled = this.value.trim() === "";
    });

    function addMessage(text, sender) {
        const div = document.createElement("div");
        div.className = `message ${sender}-message`;
        
        const avatarIcon = sender === "bot" ? "smart_toy" : "person";
        const avatarClass = sender === "bot" ? "bot-avatar" : "user-avatar";

        div.innerHTML = `
            <div class="message-avatar ${avatarClass}">
                <span class="material-symbols-rounded">${avatarIcon}</span>
            </div>
            <div class="message-content">
                <p>${text.replace(/\n/g, "<br>")}</p>
                <span class="message-time">
                    ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        `;
        
        chatMessages.appendChild(div);
        
        // Staggered scroll to bottom
        setTimeout(() => {
            chatMessages.scrollTo({
                top: chatMessages.scrollHeight,
                behavior: 'smooth'
            });
        }, 100);
    }

    async function sendMessage(text = null) {
        const userText = text || chatInput.value.trim();
        if (!userText) return;

        addMessage(userText, "user");
        chatInput.value = "";
        chatInput.style.height = 'auto';
        sendBtn.disabled = true;
        
        // Ensure focused even after clearing
        chatInput.focus();

        // Show typing indicator
        typingIndicator.classList.remove("hidden");
        chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });

        // Simulate thinking time
        const thinkingTime = Math.random() * 1000 + 1000;
        
        try {
            const response = await generateHybridResponse(userText);
            
            setTimeout(() => {
                typingIndicator.classList.add("hidden");
                addMessage(response, "bot");
                
                // Focus back so user can continue typing immediately
                chatInput.focus();
            }, thinkingTime);
        } catch (error) {
            console.error("Error generating response:", error);
            typingIndicator.classList.add("hidden");
            addMessage("I'm sorry, I'm having trouble processing that right now. Please try again.", "bot");
            chatInput.focus();
        }
    }

    // Send button
    sendBtn.addEventListener("click", () => sendMessage());

    // ENTER key
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!sendBtn.disabled) sendMessage();
        }
    });

    // Clear Chat
    if (clearChatBtn) {
        clearChatBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to clear the conversation?")) {
                // Keep only the welcome and first bot message or custom reset
                chatMessages.innerHTML = `
                    <div class="message update-message">
                        <span class="material-symbols-rounded">gavel</span>
                        <p><strong>LISA</strong> (Legal Information & Student Assistant) is here to guide you.
                            <br>Chat history cleared. How can I help you today?
                        </p>
                    </div>
                `;
            }
        });
    }

    // Suggestion Chips
    suggestionChips.forEach(chip => {
        chip.addEventListener("click", () => {
            const question = chip.textContent;
            sendMessage(question);
        });
    });
});
