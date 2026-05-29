document.addEventListener('DOMContentLoaded', () => {
    // --- PHASE 1: UI LOGIC (Opening & Closing) ---

    // 1. Grab the elements from our HTML using their IDs
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');

    // 2. Open/Close the Chat Window with the Toggle Button
    // When the circular button is clicked, we toggle the 'hidden' class on the window
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('hidden');
        chatbotToggle.classList.toggle('is-open');
    });

    // 3. Close the Chat Window
    // When the 'X' button is clicked, we add the 'hidden' class back to window
    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.add('hidden');
        chatbotToggle.classList.remove('is-open');
    });

    // --- PHASE 2: CHAT LOGIC ---
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // Flag to prevent spamming
    let isWaitingForResponse = false;

    // Hard limit: 10 messages per day
    const MAX_MESSAGES_PER_DAY = 20;

    // Helper to add a message to the chat window
    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message');
        msgDiv.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
        msgDiv.textContent = text;
        chatbotMessages.appendChild(msgDiv);
        // Scroll to the bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Helper to check and update rate limits
    function checkRateLimit() {
        const today = new Date().toLocaleDateString();
        const storedData = JSON.parse(localStorage.getItem('chatRateLimit')) || { date: today, count: 0 };

        // Reset if it's a new day
        if (storedData.date !== today) {
            storedData.date = today;
            storedData.count = 0;
        }

        if (storedData.count >= MAX_MESSAGES_PER_DAY) {
            return false; // Limit exceeded
        }

        // Increment count and save
        storedData.count += 1;
        localStorage.setItem('chatRateLimit', JSON.stringify(storedData));
        return true;
    }

    // 4. Handle Chat Submission
    chatbotForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // If we are already waiting for a response, completely ignore any new attempts to send
        if (isWaitingForResponse) return;

        const userText = chatbotInput.value.trim();
        if (!userText) return;

        // Check if user has exceeded their daily limit
        if (!checkRateLimit()) {
            addMessage("You've reached the maximum number of messages for today! Please email me directly if you'd like to chat further.", 'ai');
            chatbotInput.disabled = true;
            chatbotInput.placeholder = "Daily limit reached.";
            return;
        }

        // Lock the chat to prevent spam
        isWaitingForResponse = true;
        chatbotInput.disabled = true;

        // Add user message to UI
        addMessage(userText, 'user');
        chatbotInput.value = '';

        // Show loading bubble
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'ai-message', 'loading');
        loadingDiv.textContent = 'Typing...';
        chatbotMessages.appendChild(loadingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        try {
            // Call the Vercel Serverless Function
            const response = await fetch('/api/groq', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText })
            });

            const data = await response.json();

            // Remove loading indicator
            chatbotMessages.removeChild(loadingDiv);

            if (data.success) {
                addMessage(data.reply, 'ai');
            } else {
                addMessage("Oops! I'm having trouble connecting to my brain. Try again later.", 'ai');
            }
        } catch (err) {
            chatbotMessages.removeChild(loadingDiv);
            addMessage("Network error. Please try again.", 'ai');
        } finally {
            // Unlock the chat so the user can send another message
            isWaitingForResponse = false;
            chatbotInput.disabled = false;
            chatbotInput.focus();
        }
    });

});
