export function getRandomValue(
  arr: string[],
  {
    avoid = [],
    usually = [],
  }: { avoid?: unknown[]; usually?: (string | 'none')[] } = {}
): string {
  const avoidValues = avoid.filter(Boolean)
  const filteredArr = arr.filter((it) => !avoidValues.includes(it))

  const usuallyValues = usually
    .filter(Boolean)
    .reduce<string[]>((acc, cur) => acc.concat(new Array(15).fill(cur)), [])

  const finalArr = filteredArr.concat(usuallyValues)

  const randomIdx = Math.floor(Math.random() * finalArr.length)
  const randomValue = finalArr[randomIdx]

  return randomValue
}
