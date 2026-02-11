import type { UserDictionary } from '../types'
import IconBook from '~icons/tabler/book'
import IconPlayerPlay from '~icons/tabler/player-play'
import IconTrash from '~icons/tabler/trash'

interface DictionaryListProps {
  dictionaries: UserDictionary[]
  onDelete: (id: string) => void
  onPractice: (dictionary: UserDictionary) => void
}

export default function DictionaryList({
  dictionaries,
  onDelete,
  onPractice,
}: DictionaryListProps) {
  if (dictionaries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <IconBook className="mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
        <p className="text-gray-500 dark:text-gray-400">暂无个人词库</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          点击上方按钮上传 CSV 文件创建词库
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {dictionaries.map((dict) => (
        <div
          key={dict.id}
          className="flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          {/* 头部 */}
          <div className="mb-3 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 dark:text-white">{dict.name}</h3>
              {dict.description && (
                <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                  {dict.description}
                </p>
              )}
            </div>
          </div>

          {/* 统计信息 */}
          <div className="mb-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{dict.words.length} 个单词</span>
            <span>创建于 {new Date(dict.createdAt).toLocaleDateString()}</span>
          </div>

          {/* 操作按钮 */}
          <div className="mt-auto flex items-center gap-2">
            <button
              onClick={() => onPractice(dict)}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-indigo-500 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
            >
              <IconPlayerPlay className="h-4 w-4" />
              开始练习
            </button>
            <button
              onClick={() => onDelete(dict.id)}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
              title="删除词库"
            >
              <IconTrash className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
