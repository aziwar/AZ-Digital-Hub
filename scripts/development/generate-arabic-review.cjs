const fs = require('fs');

const en = require('./messages/en.json');
const ar = require('./messages/ar.json');

let md = '# Arabic Content Review - AZ Digital Hub Website\n\n';
md += '**Instructions**: Review all Arabic translations below. Make corrections directly in this file, then share it back for updates.\n\n';
md += '**Format**: Each section shows:\n';
md += '- Location on website\n';
md += '- English (original)\n';
md += '- Arabic (current translation)\n\n';
md += '**Critical Review Points**:\n';
md += '1. Verify Arabic text matches English meaning\n';
md += '2. Check formal MSA tone is appropriate for executive audience\n';
md += '3. Ensure technical terms (SEO, ROI, etc.) are handled correctly\n';
md += '4. Verify commanding ENTJ tone is preserved\n';
md += '5. Check Kuwait/GCC cultural context is appropriate\n\n';
md += '---\n\n';

// Process each section
function addSection(title, location, enObj, arObj) {
  md += `## ${title}\n\n`;
  md += `**Location**: ${location}\n\n`;

  function processObject(enData, arData, indent = 0) {
    const spaces = '  '.repeat(indent);

    for (const key in enData) {
      if (typeof enData[key] === 'object' && !Array.isArray(enData[key])) {
        // Nested object
        md += `${spaces}### ${key}\n\n`;
        processObject(enData[key], arData[key] || {}, indent);
      } else if (Array.isArray(enData[key])) {
        // Array
        md += `${spaces}### ${key}\n\n`;
        enData[key].forEach((item, idx) => {
          if (typeof item === 'string') {
            md += `${spaces}**[${idx}]**\n`;
            md += `${spaces}- English: ${item}\n`;
            md += `${spaces}- Arabic: ${arData[key]?.[idx] || 'MISSING'}\n\n`;
          } else if (typeof item === 'object') {
            md += `${spaces}**[${idx}]**\n`;
            for (const subKey in item) {
              md += `${spaces}- ${subKey}:\n`;
              md += `${spaces}  - English: ${item[subKey]}\n`;
              md += `${spaces}  - Arabic: ${arData[key]?.[idx]?.[subKey] || 'MISSING'}\n`;
            }
            md += `\n`;
          }
        });
      } else {
        // Simple string
        md += `${spaces}**${key}**\n`;
        md += `${spaces}- English: \`${enData[key]}\`\n`;
        md += `${spaces}- Arabic: \`${arData[key] || 'MISSING'}\`\n\n`;
      }
    }
  }

  processObject(enObj, arObj);
  md += `---\n\n`;
}

// Generate sections
addSection('1. Navigation Menu', 'Top navigation bar (fixed header)', en.Navigation, ar.Navigation);
addSection('2. Hero Section', 'Homepage top section (first screen)', en.Hero, ar.Hero);
addSection('3. About Section', 'About section (#about)', en.About, ar.About);
addSection('4. Services Section', 'Services section (#services)', en.Services, ar.Services);
addSection('5. Testimonials', 'Testimonials section (#testimonials)', en.Testimonials, ar.Testimonials);
addSection('6. Portfolio', 'Portfolio section (#portfolio)', en.Portfolio, ar.Portfolio);
addSection('7. Contact Form', 'Contact form section (#contact)', en.Contact, ar.Contact);
addSection('8. Footer', 'Page footer', en.Footer, ar.Footer);
addSection('9. Common Elements', 'Shared UI elements', en.Common, ar.Common);

// Write file
fs.writeFileSync('ARABIC_CONTENT_REVIEW.md', md, 'utf8');
console.log('✅ File created: ARABIC_CONTENT_REVIEW.md');
console.log('📄 Total sections: 9');
console.log('📝 Please review the file and make corrections');
