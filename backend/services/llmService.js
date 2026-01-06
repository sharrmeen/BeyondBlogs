import { GoogleGenerativeAI} from "@google/generative-ai";
import 'dotenv/config';

const ai=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const rewriteArticle=async (original,comp1,comp2)=>{

    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" ,generationConfig: { responseMimeType: "text/plain" }});

    const prompt = `
        Act as a Senior SEO Content Strategist and Expert Editor. Your task is to perform a "Content Gap and Optimization Rewrite" of an original article.

        ### INPUT DATA
        ORIGINAL CONTENT (Source of Truth for Insights):
        ${original}

        COMPETITOR 1 (Reference for Ranking Structure):
        ${comp1}

        COMPETITOR 2 (Reference for Ranking Depth):
        ${comp2}

        ### INSTRUCTIONS
        1. **Structural Analysis**: Analyze the headings (H2s, H3s) and formatting used by the competitors. Ensure the rewritten article matches or exceeds their logical flow and organizational clarity.
        2. **Content Synthesis**: Maintain 100% of the core message and unique insights from the ORIGINAL CONTENT, but expand the depth using the level of detail found in the COMPETITOR samples.
        3. **SEO Optimization**: Naturally integrate high-intent keywords and semantic phrases found in the competitors' posts. Improve the meta-readability by using concise paragraphs and bulleted lists.
        4. **Tone & Voice**: Elevate the prose to be authoritative, professional, and engaging.
        5. **Formatting**: Output the final result in clean, well-structured Markdown. Use H1 for the title, followed by H2s and H3s.

        ### STRICT OUTPUT RULES
        - **Return ONLY the updated article content.**
        - Do NOT include any introductory remarks like "Here is your rewritten article."
        - Do NOT include any closing summaries or follow-up notes.
        - Start immediately with the Article Title (H1) and end with the final paragraph.
        `;

    try {
        const result = await model.generateContent(prompt);
        const response=result.response;
        return response.text();
        
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        return null;
    }


}