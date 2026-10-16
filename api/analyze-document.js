export default async function handler(req, res) {
    // 1. Security check: We only allow POST requests because we are sending data securely.
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed. Use POST." });
    }

    try {
        // 2. The AI processing happens here. 
        // In the final version, this is where we will write the code to securely 
        // pass the uploaded document to Gemini Vision using your secret API key.
        
        // For this step of the build, we are simulating the AI's response so you can 
        // see exactly how the backend talks to your frontend.
        const simulatedAIResult = {
            message: "Document successfully analyzed!",
            extractedData: {
                documentType: "Insurance Certificate",
                policyNumber: "POL-987654321",
                validUntil: "2027-10-15",
                status: "Valid",
                actionRequired: "None. You are protected."
            }
        };

        // 3. Send the data back to your app.js on the frontend
        return res.status(200).json(simulatedAIResult);

    } catch (error) {
        console.error("Backend Error:", error);
        // If something breaks, we send a 500 (Server Error) status back
        return res.status(500).json({ error: "Something went wrong analyzing the document." });
    }
}