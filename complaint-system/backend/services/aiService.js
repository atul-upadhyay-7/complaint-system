import { GoogleGenAI } from '@google/genai';
import logger from '../utils/logger.js';

// Initialize SDK. It automatically picks up GEMINI_API_KEY from process.env
const ai = new GoogleGenAI();

const ALLOWED_CATEGORIES = ['Electricity', 'Water', 'Internet', 'Cleanliness', 'Maintenance', 'Other'];

/**
 * Sends complaint to Gemini to auto-categorize it
 * @param {string} title - Complaint title
 * @param {string} description - Complaint description
 * @returns {Promise<string>} - One of the ALLOWED_CATEGORIES
 */
export const autoCategorizeComplaint = async (title, description) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            logger.warn('GEMINI_API_KEY not found. Skipping AI categorization.');
            return 'Other';
        }

        const prompt = `
You are an AI assistant for a university hostel complaint system. 
Your job is to read a student's complaint and categorize it into EXACTLY ONE of these categories:
${ALLOWED_CATEGORIES.join(', ')}

Complaint Title: ${title}
Complaint Description: ${description}

Analyze the text. If it mentions lights, fans, AC, or power, return "Electricity".
If it mentions pipes, drinking water, or leaks, return "Water".
If it mentions wifi, routers, or connectivity, return "Internet".
If it mentions sweeping, mopping, or trash, return "Cleanliness".
If it mentions broken furniture, doors, or structural issues, return "Maintenance".
If it fits none of the above, return "Other".

RETURN ONLY THE EXACT CATEGORY STRING. DO NOT RETURN ANY OTHER TEXT OR PUNCTUATION.
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.1, // low temp for consistent categorization
            }
        });

        const result = response.text().trim();
        logger.info(`AI Categorization Result: [${result}] for complaint "${title}"`);

        if (ALLOWED_CATEGORIES.includes(result)) {
            return result;
        }

        // Fallback if AI hallucinates
        logger.warn(`AI returned invalid category: ${result}. Falling back to Other.`);
        return 'Other';

    } catch (error) {
        logger.error(`Error in AI Categorization: ${error.message}`);
        // Never fail the complaint creation if AI fails. Just fallback.
        return 'Other';
    }
};
