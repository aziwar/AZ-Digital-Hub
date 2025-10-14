import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Fix OpenAI null safety issues
const fixOpenAISafety = () => {
  const filePath = path.join(__dirname, '..', 'lib', 'openai.ts');
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Fix patterns
  const fixes = [
    {
      old: 'const urls = response.data.map(image => image.url).filter(Boolean) as string[]',
      new: 'const urls = response.data?.map(image => image.url).filter(Boolean) as string[] || []'
    },
    {
      old: 'url: response.data[0].url',
      new: 'url: response.data?.[0]?.url || \'\''
    },
    {
      old: 'revisedPrompt: response.data[0].revised_prompt',
      new: 'revisedPrompt: response.data?.[0]?.revised_prompt || \'\''
    },
    {
      old: 'text: response.data[0].embedding',
      new: 'text: response.data?.[0]?.embedding || []'
    },
    {
      old: 'translatedText: response.data[0].message.content',
      new: 'translatedText: response.data?.[0]?.message?.content || \'\''
    }
  ];
  
  // Apply fixes
  fixes.forEach(fix => {
    content = content.replace(fix.old, fix.new);
  });
  
  // Also fix src/lib/openai.ts if it exists
  const srcPath = path.join(__dirname, '..', 'src', 'lib', 'openai.ts');
  if (fs.existsSync(srcPath)) {
    let srcContent = fs.readFileSync(srcPath, 'utf-8');
    fixes.forEach(fix => {
      srcContent = srcContent.replace(fix.old, fix.new);
    });
    fs.writeFileSync(srcPath, srcContent);
    console.log('✅ Fixed src/lib/openai.ts');
  }
  
  fs.writeFileSync(filePath, content);
  console.log('✅ Fixed lib/openai.ts null safety issues');
};

fixOpenAISafety();
