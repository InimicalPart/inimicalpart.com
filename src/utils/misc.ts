import { ToWords } from 'to-words';
export function chooseArticle(word: string | number): string {
    if (typeof word === "number") {
        word = new ToWords().convert(word)
    }

    const vowels = "aeiou";
    word = word.toLowerCase();
  
    if (vowels.includes(word[0])) {
        return "an";
    } else if (word[0] === 'h' && !word.startsWith("ho") && !word.startsWith("ha")) {
        // Simple check for silent 'h' cases
        return "an";
    } else if (word[0] === 'x' && (word.startsWith("x-ray") || word.startsWith("xylophone"))) {
        return "an";
    } else {
        return "a";
    }
    return ""
  }
