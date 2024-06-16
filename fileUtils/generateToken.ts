import PdfParse from "pdf-parse";
import axios from "axios";
import { pipeline } from "@xenova/transformers";

export const generateEmbeddingFromS3Doc = async (presignedUrl: string) => {
    const response = await axios.get(presignedUrl, { responseType: 'arraybuffer' });

    // Parse the PDF
    const {text} = await PdfParse(response.data);
    const dataStrip = (text).replace(/\s+/g, " ");
    const embedding = await generateEmbeddingFromText(dataStrip)
    return embedding
}

export const generateEmbeddingFromText= async (text: string): Promise<Array<unknown>>  => {
    const extractor = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2",
    );
    const output = await extractor(text, {
        pooling: "mean",
        normalize: true,
    });
    return Array.from(output.data)
}