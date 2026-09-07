// Regenerates public/Ganpati_Resume.pdf from resume/resume.html.
// Run after editing the HTML: npm run resume:pdf
import puppeteer from 'puppeteer'
import { PDFDocument } from 'pdf-lib'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const htmlPath = resolve(__dirname, '../resume/resume.html')
const outPath = resolve(__dirname, '../public/Ganpati_Resume.pdf')

const browser = await puppeteer.launch({ headless: true })
try {
  const page = await browser.newPage()
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' })
  const pdfBytes = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  })

  // Set real PDF metadata — helps ATS systems and job portals that read it on upload.
  const doc = await PDFDocument.load(pdfBytes)
  doc.setTitle('Ganpati Kumar - Resume')
  doc.setAuthor('Ganpati Kumar')
  doc.setSubject('Software Engineer (SDE) / Backend Engineer Resume')
  doc.setKeywords(['backend engineer', 'full stack', 'SDE', 'Node.js', 'PostgreSQL', 'React', 'TypeScript'])
  doc.setCreator('ganpatikumar.me')
  doc.setProducer('')
  const finalBytes = await doc.save()

  await writeFile(outPath, finalBytes)

  const pageCount = doc.getPageCount()
  console.log(`Resume PDF written to ${outPath} (${pageCount} page${pageCount === 1 ? '' : 's'})`)
  if (pageCount > 1) {
    console.warn('WARNING: resume overflowed to more than 1 page — tighten content or spacing.')
  }
} finally {
  await browser.close()
}
