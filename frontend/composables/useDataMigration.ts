/**
 * Data Migration Composable
 * Handles migrating demo data from localStorage to backend database after login
 */

import { FlowType } from '~/lib/Enums/FlowType'

interface DemoCategory {
  id: string
  name: string
  createdAt?: string
}

interface DemoTransaction {
  id: string
  description: string
  amount: number
  categoryId: string
  date: string
  created_at: string
  userId?: string
}

interface TransactionToMigrate {
  description: string
  amount: number
  date: string
  categoryId: string
}

export const useDataMigration = () => {
  const transactionsStore = useTransactionsStore()
  const categoriesStore = useCategoriesStore()
  const config = useRuntimeConfig()

  /**
   * Migrate demo data from localStorage to backend database
   * Called after successful authentication
   */
  const migrateLocalStorageDataToDatabase = async () => {
    try {
      console.log('Starting data migration from localStorage to database...')

      // Get demo data from localStorage
      const demoCategories = localStorage.getItem('fineline_demo_categories')
      const encryptedDemoTransactions = localStorage.getItem('fineline_demo_transactions')

      if (!demoCategories && !encryptedDemoTransactions) {
        console.log('No demo data found in localStorage to migrate')
        return
      }

      console.log('Fetch DB Categories...');
      await categoriesStore.fetchCategories()
      const dbCategories = categoriesStore.categories
      console.log('Database categories fetched:', dbCategories)

      // Parse and migrate categories
      let categoryMap: Record<string, string> = {} // Map old IDs to new IDs
      let uncategorizedId: string | null = null

      if (demoCategories) {
        try {
          const categoriesToMigrate = JSON.parse(demoCategories)
          console.log('Parsed categories for migration:', categoriesToMigrate)

          // Map demo categories to database categories by name
          for (const demoCategory of categoriesToMigrate) {
            // Find matching category in database by name (case-insensitive)
            const matchingDbCategory = dbCategories.find(
              (dbCat: Category) => dbCat.name.toLowerCase() === demoCategory.name.toLowerCase()
            )

            if (matchingDbCategory) {
              // Map demo ID to existing database ID
              categoryMap[demoCategory.id] = matchingDbCategory.id
              console.log(`Mapped demo category "${demoCategory.name}" (${demoCategory.id}) to DB ID: ${matchingDbCategory.id}`)
            } else {
              try {
                const created = await categoriesStore.createCategory(demoCategory.name, FlowType.UNCATEGORIZED)
                categoryMap[demoCategory.id] = created.id
                console.log(`Created new category: ${demoCategory.name} with ID: ${created.id}`)
              } catch (error) {
                console.error(`Failed to migrate category ${demoCategory.name}:`, error)
              }
            }
          }

          console.log('Final Category mapping:', categoryMap)
        } catch (e) {
          console.error('Failed to parse demo categories:', e)
        }
      }

      let uncategorizedCategory = dbCategories.find(
        (cat: Category) => cat.name.toLowerCase() === 'uncategorized'
      )

      if (!uncategorizedCategory) {
        console.log('Creating "Uncategorized" category as it does not exist...')
        try {
          uncategorizedCategory = await categoriesStore.createCategory('Uncategorized')
          console.log('Created "Uncategorized" category with ID:', uncategorizedCategory.id)
        } catch (error) {
          console.error('Failed to create "Uncategorized" category:', error)
        }
      }

      uncategorizedId = uncategorizedCategory ? uncategorizedCategory.id : null

      // Migrate transactions using the new backend endpoint
      if (encryptedDemoTransactions) {
        try {
          const CryptoJS = (await import('crypto-js')).default
          const encryptionKey = 'fineline-demo-key'

          const decrypted = CryptoJS.AES.decrypt(
            encryptedDemoTransactions,
            encryptionKey
          ).toString(CryptoJS.enc.Utf8)

          if (!decrypted) {
            console.error('Failed to decrypt demo transactions')
            return
          }

          const demoTransactions: DemoTransaction[] = JSON.parse(decrypted)
          console.log(`Found ${demoTransactions.length} demo transactions to migrate`)

          if (demoTransactions && demoTransactions.length > 0) {
            const txnsToMigrate = demoTransactions
              .map((txn: DemoTransaction, index: number): TransactionToMigrate | null => {
                let newCategoryId = categoryMap[txn.categoryId]
                if (!newCategoryId) {
                  console.warn(`No mapping found for category ID: ${txn.categoryId} in transaction index ${index}, assigning to "Uncategorized"`)

                  // Fallback to "Uncategorized"
                  if (uncategorizedId) {
                    newCategoryId = uncategorizedId
                  } else {
                    console.error('→ Skipping transaction (\'Uncategorized\' category not available)')
                    return null
                  }
                }

                return {
                  description: txn.description,
                  amount: txn.amount,
                  date: txn.date,
                  categoryId: newCategoryId
                };
              }).filter((txn): txn is TransactionToMigrate => txn !== null) // Remove null entries

            if (txnsToMigrate.length === 0) {
              console.log('No valid transactions to migrate after processing, aborting migration.')
              return
            }

            console.log(`Migrating ${txnsToMigrate.length} transactions to backend...`)

            // Send to backend
            const response = await fetch(`${config.public.backendBaseUrl}/api/transactions/migrate/from-demo`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              credentials: 'include',
              body: JSON.stringify({ transactions: txnsToMigrate })
            })

            if (!response.ok) {
              const error = await response.json()
              console.error('Transaction migration failed: ', error)
              return
            }

            const result = await response.json()
            console.log(`Successfully migrated ${result.migratedCount} transactions to backend`)
          }
        } catch (e) {
          console.error('Error decrypting or migrating transactions: ', e)
        }
      }
      console.log('Data migration completed')
    } catch (error) {
      console.error('Data migration error:', error)
    }
  }

  /**
   * Switch from demo mode to real mode after login
   */
  const switchToRealMode = async () => {
    try {
      console.log('Switching to real mode...')

      // Migrate any demo data first
      await migrateLocalStorageDataToDatabase()

      // Switch stores to real mode
      transactionsStore.setDemoMode(false)
      categoriesStore.setDemoMode(false)

      // Fetch fresh data from backend
      console.log('Fetching fresh data from backend...')
      await categoriesStore.fetchCategories()
      await transactionsStore.fetchTransactions()

      console.log('Successfully switched to real mode')
    } catch (error) {
      console.error('Error switching to real mode:', error)
    }
  }

  return {
    migrateLocalStorageDataToDatabase,
    switchToRealMode
  }
}
