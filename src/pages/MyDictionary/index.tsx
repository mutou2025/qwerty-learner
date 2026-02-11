import DictionaryList from './components/DictionaryList'
import UploadDialog from './components/UploadDialog'
import type { UserDictionary } from './types'
import Header from '@/components/Header'
import Layout from '@/components/Layout'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import IconBooks from '~icons/tabler/books'
import IconPlus from '~icons/tabler/plus'

// 本地存储 key
const STORAGE_KEY = 'userDictionaries'

// 生成唯一 ID
function generateId(): string {
  return `dict_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export default function MyDictionary() {
  const navigate = useNavigate()
  const [dictionaries, setDictionaries] = useState<UserDictionary[]>([])
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  // 从本地存储加载词库
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setDictionaries(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Failed to load dictionaries:', error)
    }
  }, [])

  // 保存到本地存储
  const saveDictionaries = useCallback((dicts: UserDictionary[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dicts))
      setDictionaries(dicts)
    } catch (error) {
      console.error('Failed to save dictionaries:', error)
    }
  }, [])

  // 添加新词库
  const handleAddDictionary = useCallback(
    (data: Omit<UserDictionary, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = Date.now()
      const newDict: UserDictionary = {
        ...data,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      }
      saveDictionaries([...dictionaries, newDict])
    },
    [dictionaries, saveDictionaries],
  )

  // 删除词库
  const handleDeleteDictionary = useCallback(
    (id: string) => {
      if (window.confirm('确定要删除这个词库吗？')) {
        saveDictionaries(dictionaries.filter((d) => d.id !== id))
      }
    },
    [dictionaries, saveDictionaries],
  )

  // 开始练习
  const handlePractice = useCallback(
    (dict: UserDictionary) => {
      // 将词库保存到 sessionStorage 供打字页面使用
      sessionStorage.setItem('customDictionary', JSON.stringify(dict))
      // 跳转到打字页面
      navigate('/?custom=true')
    },
    [navigate],
  )

  return (
    <Layout>
      <Header>
        <div className="flex items-center gap-2">
          <IconBooks className="h-5 w-5 text-indigo-500" />
          <span className="font-medium text-gray-800 dark:text-white">个人词库</span>
        </div>
      </Header>

      <div className="container mx-auto flex-1 px-4 py-6">
        {/* 头部操作区 */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">我的词库</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              上传 CSV 文件创建个人词库，随时随地练习
            </p>
          </div>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
          >
            <IconPlus className="h-4 w-4" />
            上传词库
          </button>
        </div>

        {/* 词库列表 */}
        <DictionaryList
          dictionaries={dictionaries}
          onDelete={handleDeleteDictionary}
          onPractice={handlePractice}
        />
      </div>

      {/* 上传对话框 */}
      <UploadDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSave={handleAddDictionary}
      />
    </Layout>
  )
}
