const fs = require('fs');
const path = require('path');

// Fix remaining ESLint errors
const fixes = [
  {
    file: '../lib/openai.ts',
    fix: (content) => content.replace('} catch (error) {', '} catch (_error) {')
  },
  {
    file: '../src/app/api/contact/route.ts',
    fixes: [
      (content) => content.replace('const body = await', 'const _body = await'),
      (content) => content.replace('} catch (error) {', '} catch (_error) {')
    ]
  },
  {
    file: '../src/components/sections/EnhancedContact.tsx',
    fix: (content) => content.replace('} catch (error) {', '} catch (_error) {')
  },
  {
    file: '../src/components/ui/TypeAnimationFramer.tsx',
    fix: (content) => content.replace('[currentIndex]', '[currentIndex, sequence.length]')
  }
];

fixes.forEach(({ file, fix, fixes: multipleFixes }) => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (fix) content = fix(content);
  if (multipleFixes) {
    multipleFixes.forEach(f => content = f(content));
  }
  
  fs.writeFileSync(filePath, content);
  // console.log(`✅ Fixed ${file}`);
});
