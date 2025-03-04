import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Pinecone } from '@pinecone-database/pinecone';
import pdfParse from "pdf-parse";

// Generate unique ID using timestamp and random string
const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substring(2)}`;

// Initialize Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

console.log(process.env.GOOGLE_API_KEY)
console.log(process.env.PINECONE_API_KEY)
console.log(process.env.PINECONE_ENVIRONMENT)
// if (!process.env.PINECONE_INDEX) {
//   throw new Error("PINECONE_INDEX environment variable is not set.");
// }
console.log(process.env.PINECONE_INDEX)

export async function POST(req: NextRequest) {
  try {
    // Parse form data
    console.log("Parsing form data...");
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const linkedin = formData.get("linkedin") as string;
    const skills = formData.get("skills") as string;
    const resumeFile = formData.get("resume") as File;

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("LinkedIn:", linkedin);
    console.log("Skills:", skills);

    // Parse PDF
    console.log("Parsing PDF...");
    if (resumeFile) {
      console.log("Resume file details:", resumeFile.name, resumeFile.size, resumeFile.type);
      const arrayBuffer = await resumeFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const pdfData = await pdfParse(buffer);
      const resumeText = pdfData.text;

      // Generate candidate profile
      console.log("Generating candidate profile...");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const profilePrompt = `
        Based on the following information, create a professional candidate profile:
        Name: ${name}
        Email: ${email}
        LinkedIn: ${linkedin}
        Skills: ${skills}
        Resume Text: ${resumeText}
        
        Please analyze the candidate's background and provide:
        1. A brief professional summary
        2. Key skills and expertise
        3. Experience highlights
        4. Potential role matches
        5. Areas for development
      `;
      const profileResult = await model.generateContent(profilePrompt);
      const profile = profileResult.response.text();

      // Generate embeddings
      console.log("Generating embeddings...");
      const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
      const embeddingResult = await embeddingModel.embedContent(resumeText);
      console.log("Embedding Result:", embeddingResult);
      
      const embeddingValues = embeddingResult.embedding.values;

      // Initialize Pinecone
      console.log("Initializing Pinecone...");
      const pineconeClient = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY || "",
      });

      const index = pineconeClient.Index(process.env.PINECONE_INDEX || "");

      // Generate a unique id for the record
      const recordId = generateUniqueId();
      console.log(index)

      console.log("Upserting data to Pinecone...");
      await index.upsert([
        {
          id: recordId,
          values: embeddingValues,
          metadata: {
            type: 'candidate',
            name: formData.get("name")?.toString() || "st",
            email:email,
            linkedin: formData.get("linkedin")?.toString() || "",
            skills: formData.get("skills")?.toString() || "",
            profile: profile,
          },
        },
      ]);

      console.log("Processing completed successfully.");
      return NextResponse.json({
        success: true,
        profile,
      });
    } else {
      console.error("Resume file is missing.");
      throw new Error("Resume file is missing.");
    }
  } catch (error:any) {
    console.error("Error processing application:", error.message);
    return NextResponse.json(
      { error: "Failed to process application", details: error.message },
      { status: 500 }
    );
  }
}
