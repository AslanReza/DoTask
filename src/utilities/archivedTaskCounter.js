export const getArchivedTaskCount = () => {
  const storedCount = localStorage.getItem('archivedTaskCount')

  return storedCount ? parseInt(storedCount, 10) : 0
}

export const incrementArchivedTaskCount = () => {
  let archivedTaskCount = getArchivedTaskCount()
  console.log('Before increment:', archivedTaskCount)
  archivedTaskCount += 1
  console.log('After increment:', archivedTaskCount)
  localStorage.setItem('archivedTaskCount', archivedTaskCount)
}

export const decrementArchivedTaskCount = () => {
  let archivedTaskCount = getArchivedTaskCount()
  console.log('Before decrement:', archivedTaskCount)
  if (archivedTaskCount > 0) {
    archivedTaskCount -= 1
    console.log('After decrement:', archivedTaskCount)
    localStorage.setItem('archivedTaskCount', archivedTaskCount)
  } else {
    console.warn('archivedTaskCount cannot be negative')
  }
}
