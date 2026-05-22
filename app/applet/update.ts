import fs from 'fs';
import path from 'path';

let content = fs.readFileSync('src/pages/BroadcastGuide.tsx', 'utf-8');

const startIdx = content.indexOf('{/* Side-by-Side Comparison Matrix */}');
const endIdx = content.indexOf('{/* Platform List */}');

if (startIdx !== -1 && endIdx !== -1) {
    const sectionToRemove = content.slice(startIdx, endIdx);
    const compMatrix = sectionToRemove.slice(0, sectionToRemove.indexOf('{/* AI Recommendation Result */}'));
    
    content = content.slice(0, startIdx) + content.slice(endIdx);
    
    const bannerEndStr = '</section>\n\n      {/* Visiting platform lobby';
    const insertIdx = content.indexOf(bannerEndStr);
    
    if (insertIdx !== -1) {
        content = content.slice(0, insertIdx) + compMatrix + '\n      ' + content.slice(insertIdx);
        fs.writeFileSync('src/pages/BroadcastGuide.tsx', content);
        console.log("Updated successfully!");
    } else {
        console.error("Could not find insert index.");
    }
} else {
    console.error("Could not find bounds to remove.");
}
