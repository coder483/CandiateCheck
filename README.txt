# Candidate Application System

This is a Next.js application that provides an AI-powered candidate application system with resume parsing, vector search, and AI-based candidate evaluation.

## Prerequisites

1. Node.js  installed
2. Google Gemini API Key
3. Pinecone Account and API Key
4. Environment Variables Setup

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
GOOGLE_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX=your_pinecone_index_name
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up Pinecone:
   - Create a Pinecone account at https://www.pinecone.io/
   - Create a new index with dimension 768 (for text embeddings)
   - Copy your API key and environment details to .env file

3. Set up Google Gemini:
   - Get API key from Google AI Studio
   - Add the API key to .env file

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser

## Features

- PDF Resume Upload and Parsing
- AI-Powered Candidate Profile Generation
- Vector Search for Resume Matching
- Candidate Skills Analysis
- Job Matching Recommendations

## System Components

1. Frontend:
   - Next.js with TypeScript
   - Tailwind CSS for styling
   - React Hook Form for form handling
   - React Dropzone for file uploads

2. Backend:
   - PDF parsing with pdf-parse
   - Google Gemini API integration
   - Pinecone vector database
   - Next.js API routes

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Notes

- The system uses Gemini API's free tier
- PDF parsing is done server-side
- Vector search is implemented using Pinecone
- All data is stored securely in Pinecone's vector database

## Limitations

- PDF parsing might have limitations with complex layouts
- Free tier API limits apply
- Large PDF files might take longer to process

## Support

For any issues or questions, please refer to the documentation of the used libraries:
- Next.js: https://nextjs.org/docs
- Pinecone: https://docs.pinecone.io/
- Google Gemini: https://ai.google.dev/docs