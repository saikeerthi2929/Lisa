/**
 * LISA – Advanced AI Lawyer Engine (India)
 * B.Tech Final Year Project - Intake & Analysis Logic
 * Awareness Only – Not Legal Advice
 */

document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // 1. LEGAL KNOWLEDGE & MEMORY
    // ============================
    const sessionMemory = {
        detectedDomain: null,
        currentPhase: 'IDENTIFICATION', // Phases: IDENTIFICATION, GATHERING, GUIDANCE
        lastQuestionKey: null,
        collectedData: {},
        chatHistory: []
    };

    const LEGAL_RESOURCES = {
        WORKPLACE: {
            name: "Workplace & Labour Law",
            acts: ["POSH Act 2013", "Industrial Disputes Act", "Payment of Wages Act"],
            phrases: ["salary", "boss", "office", "fired", "terminated", "hr ", "company", "pay", "workplace", "work", "job"],
            questions: [
                { key: "contract", text: "Is there a signed employment contract or appointment letter for this role?", type: "boolean" },
                { key: "duration", text: "How many months of salary/dues are currently pending?", type: "numeric" }
            ],
            finalGuidance: "Since this involves employment dues, your next step is to send a formal demand notice to the HR department. Have you already attempted any written communication?"
        },
        FRAUD: {
            name: "Financial Fraud / Criminal Law",
            acts: ["BNS Rules", "IPC Section 420", "Banking Regulation Act"],
            phrases: ["money", "scam", "cheat", "bank", "fraud", "upi", "payment", "stolen", "loan", "420"],
            questions: [
                { key: "medium", text: "Was this a digital transaction (UPI/Netbanking) or a cash exchange?", type: "selection" },
                { key: "police_notified", text: "Have you reported this to the National Cyber Crime portal or called 1930 yet?", type: "boolean" }
            ],
            finalGuidance: "For financial fraud, immediate 'asset freezing' is vital. Ensure you have the transaction IDs ready for your formal FIR."
        },
        CYBER: {
            name: "Cyber & IT Law",
            acts: ["Information Technology (IT) Act 2000", "DPDP Act 2023"],
            phrases: ["hacked", "instagram", "facebook", "profile", "password", "leak", "photos", "online abuse", "privacy"],
            questions: [
                { key: "access", text: "Do you still have access to the recovery email or phone number linked to the account?", type: "boolean" },
                { key: "extortion", text: "Is there any element of blackmail or demand for money involved?", type: "boolean" }
            ],
            finalGuidance: "Cyber offences require digital forensics. Do not delete any messages or alerts received during the breach."
        },
        SAFETY: {
            name: "Personal Safety / Criminal Law",
            acts: ["BNS", "Protection of Women from Domestic Violence Act"],
            phrases: ["threat", "danger", "follow", "unsafe", "stalking", "attack", "hurt", "police", "fir", "jail"],
            questions: [
                { key: "safe_now", text: "Are you in a safe environment right now, or do you need the location of the nearest help center?", type: "boolean" },
                { key: "identity", text: "Do you know the identity of the person involved, or is it an unknown threat?", type: "text" }
            ],
            finalGuidance: "In safety cases, a 'Zero FIR' can be filed at any station regardless of jurisdiction. Your statement is your primary evidence."
        }
    };

    // ============================
    // 2. CONSULTATION ENGINE
    // ============================

    function analyzeInput(text) {
        const t = text.toLowerCase();

        // Check for safety priority regardless of phase
        const dangerSigns = ["rape", "kill", "suicide", "murder", "molest", "sexual assault", "immediate danger"];
        if (dangerSigns.some(k => t.includes(k))) return { type: 'URGENT' };

        // Topic Switching Check: If user types words from another domain
        for (const [key, data] of Object.entries(LEGAL_RESOURCES)) {
            if (data.phrases.some(p => t.includes(p)) && key !== sessionMemory.detectedDomain) {
                return { type: 'SWITCH', domain: key };
            }
        }

        // If in GATHERING phase, check if this is an answer
        if (sessionMemory.currentPhase === 'GATHERING' && sessionMemory.lastQuestionKey) {
            return { type: 'ANSWER', value: text };
        }

        // Default Identification
        for (const [key, data] of Object.entries(LEGAL_RESOURCES)) {
            if (data.phrases.some(p => t.includes(p))) {
                return { type: 'IDENTIFY', domain: key };
            }
        }

        return { type: 'UNKNOWN' };
    }

    function getNextStep(analysis) {
        let response = "";

        // 1. Handle Urgent Safety
        if (analysis.type === 'URGENT') {
            return `
                <strong style="color: #ef4444;">CRITICAL SAFETY ALERT</strong><br>
                Please dial <strong>112</strong> immediately. Move to a public location.<br>
                LISA is an awareness tool, but your situation requires human emergency services now.
            `;
        }

        // 2. Handle Topic Switch or Initial Identification
        if (analysis.type === 'SWITCH' || (analysis.type === 'IDENTIFY' && analysis.domain !== sessionMemory.detectedDomain)) {
            if (sessionMemory.detectedDomain) {
                response += `<em>Switching focus to the new matter regarding ${LEGAL_RESOURCES[analysis.domain].name}...</em><br><br>`;
            }
            sessionMemory.detectedDomain = analysis.domain;
            sessionMemory.currentPhase = 'GATHERING';
            sessionMemory.collectedData = {};

            const firstQuestion = LEGAL_RESOURCES[analysis.domain].questions[0];
            sessionMemory.lastQuestionKey = firstQuestion.key;

            response += `I understand. This situation falls under **${LEGAL_RESOURCES[analysis.domain].name}**.<br><br>${firstQuestion.text}`;
            return response;
        }

        // 3. Handle Answers in Gathering Phase
        if (analysis.type === 'ANSWER') {
            const domainData = LEGAL_RESOURCES[sessionMemory.detectedDomain];
            sessionMemory.collectedData[sessionMemory.lastQuestionKey] = analysis.value;

            // Find next unasked question
            const nextQuestion = domainData.questions.find(q => !sessionMemory.collectedData[q.key]);

            if (nextQuestion) {
                sessionMemory.lastQuestionKey = nextQuestion.key;
                return `Understood. Next, ${nextQuestion.text.toLowerCase()}`;
            } else {
                // Move to Guidance Phase
                sessionMemory.currentPhase = 'GUIDANCE';
                sessionMemory.lastQuestionKey = null;
                updateGuidancePanel(sessionMemory.detectedDomain);
                return `Thank you for those details. Based on what you've shared:<br><br>${domainData.finalGuidance}`;
            }
        }

        // 4. Fallback for unknowns
        if (sessionMemory.detectedDomain) {
            const currentQuestion = LEGAL_RESOURCES[sessionMemory.detectedDomain].questions.find(q => q.key === sessionMemory.lastQuestionKey);
            return `I'm still looking at your **${LEGAL_RESOURCES[sessionMemory.detectedDomain].name}** case. ${currentQuestion.text}`;
        }

        return "I am LISA, your AI Lawyer. To begin, please describe the legal situation you are facing (e.g., workplace issue, financial scam, or safety concern).";
    }

    // ============================
    // 3. UI HANDLERS
    // ============================
    const chatArea = document.querySelector('.lawyer-chat-area');
    const inputArea = document.querySelector('.lawyer-input-area textarea');
    const analyzeBtn = document.querySelector('.primary-btn');
    const editor = document.querySelector('.document-editor');
    const guidanceView = document.getElementById('guidance-view');

    function renderMessage(text, sender = 'bot') {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;

        const content = sender === 'bot'
            ? `<div class="message-avatar lawyer-avatar"><span class="material-symbols-rounded">gavel</span></div>
               <div class="message-content">${text}<br><br><small><em>Legal Awareness Only — Not Legal Advice</em></small></div>`
            : `<div class="message-content user-bubble"><p>${text}</p></div>`;

        msgDiv.innerHTML = content;
        chatArea.appendChild(msgDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    function toggleAnalysis(show) {
        if (show) {
            const loader = document.createElement('div');
            loader.id = "legal-loader";
            loader.className = "message bot-message";
            loader.innerHTML = `
                <div class="message-avatar lawyer-avatar"><span class="material-symbols-rounded">balance</span></div>
                <div class="message-content"><p>LISA is analyzing your statement...</p></div>
            `;
            chatArea.appendChild(loader);
            chatArea.scrollTop = chatArea.scrollHeight;
        } else {
            const loader = document.getElementById('legal-loader');
            if (loader) loader.remove();
        }
    }

    function updateGuidancePanel(domainKey) {
        const data = LEGAL_RESOURCES[domainKey];
        if (!data) return;

        guidanceView.innerHTML = `
            <div class="lawyer-guidance-grid">
                <div class="guidance-card active">
                    <div class="guidance-header">
                        <div class="guidance-icon icon-next"><span class="material-symbols-rounded">gavel</span></div>
                        <h3>Legal Framework</h3>
                    </div>
                    <div class="guidance-body">
                        ${data.acts.map(act => `<div class="checklist-item"><span class="item-text">• ${act}</span></div>`).join('')}
                    </div>
                </div>
            </div>
            <div class="legal-assurance-badge">
                 <span class="material-symbols-rounded">shield</span>
                 <span>Consultation Phase: ${sessionMemory.currentPhase}</span>
            </div>
        `;
    }

    // ============================
    // 4. MAIN INTAKE LOOP
    // ============================
    async function processIntake() {
        const text = inputArea.value.trim();
        if (!text) return;

        renderMessage(text, 'user');
        inputArea.value = "";

        toggleAnalysis(true);
        const analysis = analyzeInput(text);

        setTimeout(() => {
            toggleAnalysis(false);
            const response = getNextStep(analysis);
            renderMessage(response, 'bot');
        }, 1000);
    }

    // ============================
    // 5. EVENT BINDINGS
    // ============================
    analyzeBtn.addEventListener('click', processIntake);
    inputArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            processIntake();
        }
    });

    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            inputArea.value = chip.textContent;
            inputArea.focus();
        });
    });

    const banner = document.querySelector('.disclaimer-banner');
    const closeBtn = document.querySelector('.close-banner');
    if (closeBtn) closeBtn.onclick = () => banner.style.display = 'none';
});

function switchView(viewName) {
    const guidanceView = document.getElementById('guidance-view');
    const docView = document.getElementById('document-view');
    const tabGuidance = document.getElementById('tab-guidance');
    const tabDoc = document.getElementById('tab-document');

    if (viewName === 'guidance') {
        guidanceView.style.display = 'block';
        docView.style.display = 'none';
        tabGuidance.classList.add('active');
        tabDoc.classList.remove('active');
    } else {
        guidanceView.style.display = 'none';
        docView.style.display = 'block';
        tabGuidance.classList.remove('active');
        tabDoc.classList.add('active');
    }
}

