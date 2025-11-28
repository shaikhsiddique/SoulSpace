require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

/**
 * Analyzes a user message and returns structured analysis results
 * @param {string} message - The user message to analyze
 * @returns {Promise<Object>} Analysis result with sentiment, emotion, risk_level, topics, and summary
 */
const analyzeMessage = async (message) => {
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    throw new Error("Message must be a non-empty string");
  }

  // Define the JSON schema for structured output
  const schema = {
    type: "object",
    properties: {
      sentiment: {
        type: "string",
        enum: ["positive", "negative", "neutral"],
        description: "Overall sentiment of the message"
      },
      emotion: {
        type: "string",
        description: "Primary emotion detected in the message (e.g., joy, sadness, anger, fear, surprise, disgust, trust, anticipation)"
      },
      risk_level: {
        type: "string",
        enum: ["low", "medium", "high", "emergency"],
        description: "Risk level based on content severity and urgency"
      },
      topics: {
        type: "array",
        items: {
          type: "string"
        },
        description: "Array of key topics or themes identified in the message"
      },
      summary: {
        type: "string",
        description: "One-line summary of the message"
      }
    },
    required: ["sentiment", "emotion", "risk_level", "topics", "summary"]
  };

  const analysisPrompt = `
Analyze the following user message and provide a structured analysis.

User Message: "${message}"

Please analyze this message and provide:
1. **Sentiment**: Overall sentiment (positive, negative, or neutral)
2. **Emotion**: Primary emotion detected (e.g., joy, sadness, anger, fear, anxiety, stress, hope, confusion)
3. **Risk Level**: 
   - "low": Normal conversation, minor concerns, general questions
   - "medium": Moderate emotional distress, ongoing issues, need for support
   - "high": Significant distress, serious concerns, mental health issues
   - "emergency": Immediate danger, self-harm, suicidal thoughts, crisis situations
4. **Topics**: Array of key topics or themes (3-5 topics)
5. **Summary**: A concise one-line summary of the message

Important guidelines:
- For risk_level, be thorough but not overly cautious. "emergency" should only be used for immediate safety concerns.
- Topics should be specific and relevant (e.g., ["work stress", "relationships", "anxiety"])
- Summary should be clear and informative in one sentence.

Respond ONLY with valid JSON matching this schema:
{
  "sentiment": "positive|negative|neutral",
  "emotion": "emotion_name",
  "risk_level": "low|medium|high|emergency",
  "topics": ["topic1", "topic2", "topic3"],
  "summary": "One line summary"
}
`;

  try {
    // Use Gemini with JSON response mode
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.3 // Lower temperature for more consistent structured output
      }
    });

    const result = await model.generateContent(analysisPrompt);
    const responseText = result.response.text();
    
    // Parse the JSON response
    let analysisResult;
    try {
      // Try direct parsing first
      analysisResult = JSON.parse(responseText.trim());
    } catch (parseError) {
      // Fallback: try to extract JSON from markdown code blocks or text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          analysisResult = JSON.parse(jsonMatch[0]);
        } catch (e) {
          throw new Error(`Failed to parse JSON response: ${e.message}`);
        }
      } else {
        throw new Error("No valid JSON found in AI response");
      }
    }

    // Validate required fields
    if (!analysisResult.sentiment || !analysisResult.emotion || 
        !analysisResult.risk_level || !Array.isArray(analysisResult.topics) || 
        !analysisResult.summary) {
      throw new Error("Analysis result missing required fields");
    }

    // Validate and normalize risk_level
    const validRiskLevels = ["low", "medium", "high", "emergency"];
    if (!validRiskLevels.includes(analysisResult.risk_level.toLowerCase())) {
      console.warn(`Invalid risk_level: ${analysisResult.risk_level}, defaulting to 'low'`);
      analysisResult.risk_level = "low";
    } else {
      analysisResult.risk_level = analysisResult.risk_level.toLowerCase();
    }

    // Validate and normalize sentiment
    const validSentiments = ["positive", "negative", "neutral"];
    if (!validSentiments.includes(analysisResult.sentiment.toLowerCase())) {
      console.warn(`Invalid sentiment: ${analysisResult.sentiment}, defaulting to 'neutral'`);
      analysisResult.sentiment = "neutral";
    } else {
      analysisResult.sentiment = analysisResult.sentiment.toLowerCase();
    }

    // Ensure topics is an array and summary is a string
    if (!Array.isArray(analysisResult.topics)) {
      analysisResult.topics = [];
    }
    
    if (typeof analysisResult.summary !== "string") {
      analysisResult.summary = String(analysisResult.summary);
    }

    // Truncate summary to one line
    analysisResult.summary = analysisResult.summary.split('\n')[0].trim();

    return analysisResult;
  } catch (error) {
    console.error("Analysis service error:", error);
    throw new Error(`Failed to analyze message: ${error.message}`);
  }
};

/**
 * Analyzes multiple user messages (conversation context) and returns structured analysis results
 * @param {string[]} messages - Array of user messages to analyze
 * @returns {Promise<Object>} Analysis result with sentiment, emotion, risk_level, topics, and summary
 */
const analyzeMessages = async (messages) => {
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new Error("Messages must be a non-empty array");
  }

  // Combine messages into conversation context
  const conversationContext = messages.join("\n\n");

  // Define the JSON schema for structured output
  const schema = {
    type: "object",
    properties: {
      sentiment: {
        type: "string",
        enum: ["positive", "negative", "neutral"],
        description: "Overall sentiment across all messages"
      },
      emotion: {
        type: "string",
        description: "Primary emotion detected across the conversation"
      },
      risk_level: {
        type: "string",
        enum: ["low", "medium", "high", "emergency"],
        description: "Risk level based on content severity and urgency across the conversation"
      },
      topics: {
        type: "array",
        items: {
          type: "string"
        },
        description: "Array of key topics or themes identified across all messages"
      },
      summary: {
        type: "string",
        description: "One-line summary of the conversation context"
      }
    },
    required: ["sentiment", "emotion", "risk_level", "topics", "summary"]
  };

  const analysisPrompt = `
Analyze the following conversation (recent user messages) and provide a structured analysis of the overall conversation context.

Conversation (User Messages in chronological order):
${messages.map((msg, idx) => `${idx + 1}. ${msg}`).join('\n\n')}

Please analyze this conversation and provide:
1. **Sentiment**: Overall sentiment across all messages (positive, negative, or neutral)
2. **Emotion**: Primary emotion detected across the conversation (e.g., joy, sadness, anger, fear, anxiety, stress, hope, confusion)
3. **Risk Level**: 
   - "low": Normal conversation, minor concerns, general questions
   - "medium": Moderate emotional distress, ongoing issues, need for support
   - "high": Significant distress, serious concerns, mental health issues
   - "emergency": Immediate danger, self-harm, suicidal thoughts, crisis situations
4. **Topics**: Array of key topics or themes identified across all messages (3-7 topics)
5. **Summary**: A concise one-line summary of the overall conversation context

Important guidelines:
- Consider the conversation as a whole, not just individual messages
- For risk_level, be thorough but not overly cautious. "emergency" should only be used for immediate safety concerns.
- Topics should be specific and relevant across all messages
- Summary should capture the main themes and concerns from the conversation

Respond ONLY with valid JSON matching this schema:
{
  "sentiment": "positive|negative|neutral",
  "emotion": "emotion_name",
  "risk_level": "low|medium|high|emergency",
  "topics": ["topic1", "topic2", "topic3"],
  "summary": "One line summary"
}
`;

  try {
    // Use Gemini with JSON response mode
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.3
      }
    });

    const result = await model.generateContent(analysisPrompt);
    const responseText = result.response.text();
    
    // Parse the JSON response
    let analysisResult;
    try {
      analysisResult = JSON.parse(responseText.trim());
       
    } catch (parseError) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          analysisResult = JSON.parse(jsonMatch[0]);
        } catch (e) {
          throw new Error(`Failed to parse JSON response: ${e.message}`);
        }
      } else {
        throw new Error("No valid JSON found in AI response");
      }
    }

    // Validate required fields
    if (!analysisResult.sentiment || !analysisResult.emotion || 
        !analysisResult.risk_level || !Array.isArray(analysisResult.topics) || 
        !analysisResult.summary) {
      throw new Error("Analysis result missing required fields");
    }

    // Validate and normalize risk_level
    const validRiskLevels = ["low", "medium", "high", "emergency"];
    if (!validRiskLevels.includes(analysisResult.risk_level.toLowerCase())) {
      console.warn(`Invalid risk_level: ${analysisResult.risk_level}, defaulting to 'low'`);
      analysisResult.risk_level = "low";
    } else {
      analysisResult.risk_level = analysisResult.risk_level.toLowerCase();
    }

    // Validate and normalize sentiment
    const validSentiments = ["positive", "negative", "neutral"];
    if (!validSentiments.includes(analysisResult.sentiment.toLowerCase())) {
      console.warn(`Invalid sentiment: ${analysisResult.sentiment}, defaulting to 'neutral'`);
      analysisResult.sentiment = "neutral";
    } else {
      analysisResult.sentiment = analysisResult.sentiment.toLowerCase();
    }

    // Ensure topics is an array and summary is a string
    if (!Array.isArray(analysisResult.topics)) {
      analysisResult.topics = [];
    }
    
    if (typeof analysisResult.summary !== "string") {
      analysisResult.summary = String(analysisResult.summary);
    }

    // Truncate summary to one line
    analysisResult.summary = analysisResult.summary.split('\n')[0].trim();

    return analysisResult;
  } catch (error) {
    console.error("Analysis service error:", error);
    throw new Error(`Failed to analyze messages: ${error.message}`);
  }
};

module.exports = { analyzeMessage, analyzeMessages };

