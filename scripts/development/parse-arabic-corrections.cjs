const fs = require('fs');
const path = require('path');

// Read the review file
const reviewContent = fs.readFileSync(
  path.join(__dirname, 'ARABIC_CONTENT_AFTER_REVIEW.md'),
  'utf-8'
);

// Read current messages/ar.json
const arMessages = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'messages', 'ar.json'), 'utf-8')
);

// Parse corrections from markdown
const lines = reviewContent.split('\n');
let currentSection = '';
let currentPath = [];
let inArrayItem = false;
let arrayIndex = -1;
let lastKey = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Detect main sections
  if (line.match(/^## \d+\. /)) {
    const match = line.match(/^## \d+\. (.+)/);
    if (match) {
      const sectionName = match[1].trim();
      // Map section names to JSON keys
      const sectionMap = {
        'Navigation Menu': 'Navigation',
        'Hero Section': 'Hero',
        'About Section': 'About',
        'Services Section': 'Services',
        'Testimonials': 'Testimonials',
        'Portfolio': 'Portfolio',
        'Contact Form': 'Contact'
      };
      currentSection = sectionMap[sectionName] || sectionName;
      currentPath = [currentSection];
      inArrayItem = false;
      arrayIndex = -1;
    }
    continue;
  }

  // Detect subsections (### header)
  if (line.match(/^### /)) {
    const subsection = line.replace(/^### /, '').trim();
    if (currentSection) {
      currentPath = [currentSection, subsection];
      inArrayItem = false;
      arrayIndex = -1;
    }
    continue;
  }

  // Detect array items **[0]**, **[1]**, etc.
  if (line.match(/^\*\*\[\d+\]\*\*/)) {
    const match = line.match(/^\*\*\[(\d+)\]\*\*/);
    if (match) {
      arrayIndex = parseInt(match[1]);
      inArrayItem = true;
    }
    continue;
  }

  // Detect field name (bold, not an array index)
  if (line.match(/^\*\*[^\[]+\*\*$/) && !line.match(/^\*\*\[\d+\]\*\*/)) {
    const fieldName = line.replace(/^\*\*/, '').replace(/\*\*$/, '').trim();
    lastKey = fieldName;
    
    // Reset array tracking if we hit a non-array field
    if (!line.match(/^\*\*\[\d+\]\*\*/)) {
      inArrayItem = false;
      arrayIndex = -1;
    }
    continue;
  }

  // Detect Arabic value line
  if (line.match(/^- Arabic: /)) {
    const arabicValue = line.replace(/^- Arabic: /, '').replace(/^`/, '').replace(/`$/, '').trim();
    
    // Build the path to update
    let updatePath = [...currentPath];
    
    if (inArrayItem && arrayIndex >= 0) {
      updatePath.push(arrayIndex.toString());
    }
    
    if (lastKey && lastKey !== 'items' && lastKey !== 'features' && lastKey !== 'roles' && lastKey !== 'options') {
      updatePath.push(lastKey);
    }

    // Navigate to the correct location in arMessages
    let target = arMessages;
    for (let j = 0; j < updatePath.length - 1; j++) {
      const key = updatePath[j];
      if (!target[key]) {
        if (!isNaN(key)) {
          target[key] = {};
        } else {
          target[key] = {};
        }
      }
      target = target[key];
    }

    // Set the value
    const finalKey = updatePath[updatePath.length - 1];
    
    // Handle HTML tags in Arabic text
    if (arabicValue.includes('<strong>') || arabicValue.includes('<gradient>')) {
      target[finalKey] = arabicValue;
    } else {
      target[finalKey] = arabicValue;
    }
  }
}

// Special handling for comma-separated arrays (features, tags)
// Re-read to handle these specially
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.match(/^- Arabic: .+,.+/)) {
    const arabicValue = line.replace(/^- Arabic: /, '').trim();
    
    // Check if this is a comma-separated list
    if (arabicValue.includes(',') && !arabicValue.includes('•')) {
      const items = arabicValue.split(',').map(s => s.trim());
      
      // Find what field this belongs to by looking back
      for (let j = i - 1; j >= 0; j--) {
        if (lines[j].match(/^\*\*[a-zA-Z]+\*\*$/)) {
          const fieldName = lines[j].replace(/^\*\*/, '').replace(/\*\*$/, '').trim();
          
          // Determine path - need to know current section/subsection
          let searchPath = [];
          for (let k = j; k >= 0; k--) {
            if (lines[k].match(/^### /)) {
              const subsection = lines[k].replace(/^### /, '').trim();
              searchPath.unshift(subsection);
              
              for (let m = k; m >= 0; m--) {
                if (lines[m].match(/^## \d+\. /)) {
                  const sectionMatch = lines[m].match(/^## \d+\. (.+)/);
                  if (sectionMatch) {
                    const sectionMap = {
                      'Navigation Menu': 'Navigation',
                      'Hero Section': 'Hero',
                      'About Section': 'About',
                      'Services Section': 'Services',
                      'Testimonials': 'Testimonials',
                      'Portfolio': 'Portfolio',
                      'Contact Form': 'Contact'
                    };
                    const section = sectionMap[sectionMatch[1].trim()] || sectionMatch[1].trim();
                    searchPath.unshift(section);
                    break;
                  }
                }
              }
              break;
            }
          }
          
          // Check for array index
          let arrayIdx = -1;
          for (let k = j; k >= 0; k--) {
            if (lines[k].match(/^\*\*\[\d+\]\*\*/)) {
              const match = lines[k].match(/^\*\*\[(\d+)\]\*\*/);
              arrayIdx = parseInt(match[1]);
              break;
            }
            if (lines[k].match(/^### /)) break;
          }
          
          // Navigate and set
          let target = arMessages;
          for (const key of searchPath) {
            if (target[key]) target = target[key];
          }
          
          if (arrayIdx >= 0 && target[arrayIdx]) {
            target[arrayIdx][fieldName] = items;
          } else if (target[fieldName] !== undefined) {
            target[fieldName] = items;
          }
          
          break;
        }
      }
    }
  }
}

// Write updated ar.json
fs.writeFileSync(
  path.join(__dirname, 'messages', 'ar.json'),
  JSON.stringify(arMessages, null, 2),
  'utf-8'
);

console.log('✅ Successfully updated messages/ar.json with corrected Arabic translations');
