// ============================================================
// CSV PARSER
// ============================================================

function parseCsvLine(line) {
  const values = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]
    const nextCharacter = line[index + 1]

    if (character === '"') {
      if (inQuotes && nextCharacter === '"') {
        current += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
    } else if (character === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
    } else {
      current += character
    }
  }

  values.push(current.trim())
  return values
}


const parseCsvText = (text) => {
  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)

  if (lines.length < 2) {
    throw new Error(
      'The CSV does not contain any transaction rows.'
    )
  }

  const headers = parseCsvLine(lines[0]).map((header) =>
    header.trim()
  )

  if (headers.some((header) => !header)) {
    throw new Error(
      'The CSV contains an empty column name.'
    )
  }

  const rows = lines.slice(1).map((line, lineIndex) => {
    const values = parseCsvLine(line)

    if (values.length !== headers.length) {
      throw new Error(
        `Row ${lineIndex + 2} contains ${values.length} values, but the header contains ${headers.length} columns.`
      )
    }

    const row = {}

    headers.forEach((header, index) => {
      row[header] = values[index]
    })

    return row
  })

  return {
    headers,
    rows,
  }
}

export {
  parseCsvLine,
  parseCsvText,
}