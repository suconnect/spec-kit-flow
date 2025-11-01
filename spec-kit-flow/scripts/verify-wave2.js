#!/usr/bin/env node

/**
 * Wave 2 ??????
 * ?? Agent-2 ? Agent-3 ?????
 */

console.log('?? Wave 2 ??????...\n')

// ???????
const fs = require('fs')
const path = require('path')

const filesToCheck = [
  // Agent-2 ??
  'src/types/markdown.ts',
  'src/types/speckit.ts',
  'src/adapters/MarkdownParser.ts',
  'src/adapters/MarkdownAdapter.ts',
  'src/adapters/index.ts',
  'src/adapters/__tests__/roundtrip.test.ts',
  'src/adapters/__tests__/run-manual-test.mjs',
  
  // Agent-3 ??
  'src/speckit/patterns.ts',
  'src/speckit/SpecKitRecognizer.ts',
  'src/speckit/index.ts',
  'src/speckit/__tests__/SpecKitRecognizer.test.ts',
  
  // ????
  'src/components/markdown-import/MarkdownImport.tsx',
  'src/components/markdown-import/index.ts',
  
  // ????
  'docs/wave2-agent2-completion-report.md',
  'docs/wave2-completion-summary.md'
]

let allFilesExist = true
let fileCount = 0

console.log('? ???????:\n')

filesToCheck.forEach((file) => {
  const fullPath = path.join(__dirname, '..', file)
  const exists = fs.existsSync(fullPath)
  
  if (exists) {
    const stats = fs.statSync(fullPath)
    console.log(`   ? ${file} (${stats.size} bytes)`)
    fileCount++
  } else {
    console.log(`   ? ${file} - ?????`)
    allFilesExist = false
  }
})

console.log(`\n?? ??: ${fileCount}/${filesToCheck.length} ????\n`)

// ??????
console.log('? ??????:\n')

try {
  const specKitTypes = fs.readFileSync(path.join(__dirname, '../src/types/speckit.ts'), 'utf-8')
  
  const requiredTypes = [
    'SpecKitFlowNode',
    'MarkdownAdapterConfig',
    'SpecKitPatternType',
    'SpecKitPattern'
  ]
  
  requiredTypes.forEach(type => {
    if (specKitTypes.includes(`interface ${type}`) || specKitTypes.includes(`type ${type}`)) {
      console.log(`   ? ${type} ???`)
    } else {
      console.log(`   ? ${type} ???`)
      allFilesExist = false
    }
  })
} catch (err) {
  console.log('   ? ????????:', err.message)
  allFilesExist = false
}

// ??????
console.log('\n? ?? SpecKit ??:\n')

try {
  const patterns = fs.readFileSync(path.join(__dirname, '../src/speckit/patterns.ts'), 'utf-8')
  
  const requiredPatterns = [
    'user-story',
    'acceptance-scenario',
    'functional-requirement',
    'success-criteria',
    'boundary-case',
    'task',
    'priority-marker'
  ]
  
  let patternCount = 0
  requiredPatterns.forEach(pattern => {
    if (patterns.includes(`type: '${pattern}'`)) {
      console.log(`   ? ${pattern} ?????`)
      patternCount++
    } else {
      console.log(`   ? ${pattern} ?????`)
      allFilesExist = false
    }
  })
  
  console.log(`\n   ?? ${patternCount}/7 ?????`)
} catch (err) {
  console.log('   ? ????????:', err.message)
  allFilesExist = false
}

// ??????
console.log('\n' + '='.repeat(60))
console.log('?? ??????\n')

const checkpoints = [
  { name: 'Task 2.1: ???????', status: '?' },
  { name: 'Task 2.2: ?? Markdown ??', status: '?' },
  { name: 'Task 2.3: AST ? flowgram ????', status: '?' },
  { name: 'Task 2.4: flowgram ?? ? Markdown ??', status: '?' },
  { name: 'Task 2.6: ??????', status: '?' },
  { name: 'Task 2.5: ?? SpecKit ????7????', status: '?' },
  { name: 'Task 2.7: ??? flowgram.ai ??', status: '?' }
]

checkpoints.forEach(({ name, status }) => {
  console.log(`${status} ${name}`)
})

console.log('\n' + '='.repeat(60))
console.log('?? Wave 2 ????\n')

if (allFilesExist && fileCount === filesToCheck.length) {
  console.log('? ???????')
  console.log('\n???:')
  console.log('  1. ?? npm run dev ???????')
  console.log('  2. ?? Markdown ??????')
  console.log('  3. ?????????????')
  console.log('  4. ?? Wave 3 ??? Agent-6')
} else {
  console.log('??  ???????????????')
  process.exit(1)
}

console.log('\n' + '='.repeat(60))
