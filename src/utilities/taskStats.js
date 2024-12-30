import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../config/firebaseConfig'

export const fetchArchivedTaskCount = async (userId) => {
  try {
    const tasksRef = collection(db, 'tasks')
    const archivedQuery = query(
      tasksRef,
      where('userId', '==', userId),
      where('status', '==', 'archived')
    )
    const archivedSnapshot = await getDocs(archivedQuery)

    return archivedSnapshot.size
  } catch (error) {
    console.error('Error fetching archived task count:', error)
    return 0
  }
}
