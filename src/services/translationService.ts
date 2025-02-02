import { v2 } from '@google-cloud/translate'

class TranslationService {
    async translateText(text: string, targetLang: string): Promise<string> {
        try {
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
            const data = await response.json();
            return data[0][0][0];
        } catch (error) {
            console.error('Translation error:', error);
            return text; // Fallback to original text
        }
    }

    async translateFaq(question: string, answer: string, targetLang: string) {
        const [translatedQuestion, translatedAnswer] = await Promise.all([
            this.translateText(question, targetLang),
            this.translateText(answer, targetLang)
        ]);
        return {
            question: translatedQuestion,
            answer: translatedAnswer
        };
    }
}

export default new TranslationService();
