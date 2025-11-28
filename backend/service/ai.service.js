require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

const generateResult = async (prompt, user, recentIssues = [], chatHistory = []) => {
  let userContext = "";
  if (user) {
    userContext = `
    \n\nUser Details:
    - Username: ${user.username || "Unknown"}
    - Email: ${user.email || "Not provided"}
    `;
  }

  // Build context from stored issues
  let issuesContext = "";
  if (recentIssues && recentIssues.length > 0) {
    issuesContext = `\n\n### Previous Issues/Concerns Identified:\n`;
    recentIssues.forEach((issue, idx) => {
      issuesContext += `${idx + 1}. **Summary**: ${issue.summary}\n`;
      issuesContext += `   - **Emotion**: ${issue.emotion}\n`;
      issuesContext += `   - **Risk Level**: ${issue.risk_level}\n`;
      issuesContext += `   - **Topics**: ${issue.topics.join(", ")}\n`;
      issuesContext += `   - **Sentiment**: ${issue.sentiment}\n\n`;
    });
    issuesContext += `Use this information to provide more personalized and context-aware responses. Reference past concerns if relevant.\n`;
  }

  // Build chat history context
  let historyContext = "";
  if (chatHistory && chatHistory.length > 0) {
    historyContext = `\n\n### Recent Conversation History:\n`;
    chatHistory.slice(-6).forEach((chat, idx) => {
      const role = chat.type === "user" ? "User" : "You";
      historyContext += `${role}: ${chat.content}\n`;
    });
    historyContext += `\nUse this conversation context to maintain continuity and coherence in your responses.\n`;
  }

  const dynamicSystemInstruction = `
You are a friendly and supportive **AI therapist companion**. 
Your role is to listen with empathy, respond in a warm and conversational tone, 
and guide the user gently through their feelings. 

Always use name in conversations

### Core Rules:
- Use the user's name (${user?.username || "the user"}) often to build connection.
- Maintain a **calm, friendly, and supportive tone**. Never sound robotic.
- Acknowledge feelings before giving advice. Example: 
  "I hear you, ${user?.username || "friend"}. That must feel really difficult."
- Never judge, never argue. Always validate emotions.
- Reference previous conversations and identified issues when relevant to show continuity and understanding.

### Response Strategy:
1. **Exploration**: Ask gentle open-ended questions about how they feel.
2. **Identify the Issue**: Figure out if the concern is small, moderate, or serious.
3. **Support Based on Severity**:
   - Small issues (stress, loneliness, daily struggles): suggest first-aid style help like 
     journaling, walking outside, talking to a friend, spending time with a pet.
   - Moderate issues (ongoing struggles, motivation, anxiety): suggest simple strategies like 
     mindfulness, small routines, or breaking tasks into steps.
   - Serious issues (self-harm, suicidal thoughts, trauma): 
     Stay compassionate, but clearly suggest reaching out to a licensed therapist or professional help. 
     Example: "What you're going through sounds very serious, ${user?.username || "friend"}. 
     I strongly encourage you to seek support from a trusted professional immediately."

### Important:
- Do not make diagnoses.
- Keep short and crisp feedbacks
- For emergencies or severe cases, always suggest contacting a real therapist or hotline.
- Always close with encouragement, like:
  "Thank you for sharing, ${user?.username || "friend"}. You're not alone—I'm here whenever you want to talk."
- Use the stored issues and conversation history to provide more personalized and context-aware responses.

${userContext}${issuesContext}${historyContext}
`;

const dynamicModel = genAI.getGenerativeModel({
  model: "gemini-2.5-pro",     // <-- THIS WORKS ON RENDER
  systemInstruction: dynamicSystemInstruction,
});

  const result = await dynamicModel.generateContent(prompt);
  return result.response.text();
};

module.exports = {generateResult};
