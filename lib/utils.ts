import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


const formatAIResponse = (response: string): string => {
  const lines = response.split('\n');
  let formattedHtml = '';
  let inCodeBlock = false;
  let codeLanguage = '';

  const escapeHtml = (unsafe: string): string => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const processLine = (line: string): string => {
    // Code block handling
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLanguage = line.trim().slice(3);
        return `<pre><code class="language-${codeLanguage}">`;
      } else {
        inCodeBlock = false;
        return '</code></pre>';
      }
    }
    
    if (inCodeBlock) {
      return escapeHtml(line) + '\n';
    }

   
    if (line.trim().startsWith('•')) {
      return `<li>${line.trim().slice(1).trim()}</li>`;
    }
    
    return line.trim() !== '' ? `<p>${line}</p>` : '';
  };

  lines.forEach(line => {
    formattedHtml += processLine(line);
  });

  return formattedHtml;
};

export default formatAIResponse;

