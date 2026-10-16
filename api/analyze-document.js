import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // 1. Security check: Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed. Use POST." });
    }

    try {
        // 2. Initialize Gemini AI using the secret key from your .env or Vercel dashboard
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // We use the 'gemini-1.5-flash' model because it is incredibly fast and great at reading images
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 3. Get the image data sent from our app.js
        const { image, mimeType, type } = req.body;

        if (!image) {
            return res.status(400).json({ error: "No image provided." });
        }

        // 4. Package the image exactly how Gemini requires it
        const imagePart = {
            inlineData: {
                data: image,
                mimeType: mimeType
            }
        };

        // 5. Write the instructions for the AI based on what we are building
        const prompt = `
            You are an expert vehicle document analyzer for the AutoPulse Digital Glovebox.
            Analyze this uploaded image (it might be a Driver's License, RC, Insurance, PUC, or Mechanic Bill).
            
            Please extract the most important information:
            1. Document Type
            2. Any ID, Policy, or License Numbers
            3. Expiry Date / Valid Until Date (CRITICAL for legal alerts)
            4. If it is a mechanic's bill, list any replaced spare parts.
            
            Return ONLY a valid JSON object with these details. Do not include markdown formatting like \`\`\`json.
        `;

        // 6. Send the image and instructions to Gemini
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        let aiText = response.text();
        
        // Clean up the text in case the AI added markdown backticks
        aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const extractedData = JSON.parse(aiText);

        // 7. Send the extracted data back to the frontend
        return res.status(200).json({
            message: "Document successfully analyzed!",
            extractedData: extractedData
        });

    } catch (error) {
        console.error("Backend AI Error:", error);
        return res.status(500).json({ error: "Failed to analyze the document with AI." });
    }
}