import { PDFParse } from 'pdf-parse';

export const extractTextFromPDF = async (url) => {
    const parser = new PDFParse({ url });

	const result = await parser.getText();
	return result.text;
};