import type { CSVRow, FieldMapping } from '../types'
import { useEffect, useState } from 'react'

interface FieldMapperProps {
  headers: string[]
  sampleData: CSVRow[]
  onConfirm: (mapping: FieldMapping) => void
  onBack: () => void
}

export default function FieldMapper({ headers, sampleData, onConfirm, onBack }: FieldMapperProps) {
  const [mapping, setMapping] = useState<FieldMapping>({
    word: '',
    trans: '',
    usphone: '',
    ukphone: '',
  })
  const [error, setError] = useState<string | null>(null)

  // 自动检测字段映射
  useEffect(() => {
    const autoMapping: FieldMapping = {
      word: '',
      trans: '',
      usphone: '',
      ukphone: '',
    }

    const lowerHeaders = headers.map((h) => h.toLowerCase())

    // 检测单词字段
    const wordPatterns = ['word', 'english', 'en', 'vocabulary', '单词', '英文']
    for (const pattern of wordPatterns) {
      const index = lowerHeaders.findIndex((h) => h.includes(pattern))
      if (index !== -1) {
        autoMapping.word = headers[index]
        break
      }
    }

    // 检测翻译字段
    const transPatterns = [
      'trans',
      'translation',
      'meaning',
      'chinese',
      'cn',
      'zh',
      '翻译',
      '释义',
      '中文',
    ]
    for (const pattern of transPatterns) {
      const index = lowerHeaders.findIndex((h) => h.includes(pattern))
      if (index !== -1) {
        autoMapping.trans = headers[index]
        break
      }
    }

    // 检测美式音标
    const usphonePatterns = ['usphone', 'us_phone', 'american', '美式音标']
    for (const pattern of usphonePatterns) {
      const index = lowerHeaders.findIndex((h) => h.includes(pattern))
      if (index !== -1) {
        autoMapping.usphone = headers[index]
        break
      }
    }

    // 检测英式音标
    const ukphonePatterns = ['ukphone', 'uk_phone', 'british', '英式音标']
    for (const pattern of ukphonePatterns) {
      const index = lowerHeaders.findIndex((h) => h.includes(pattern))
      if (index !== -1) {
        autoMapping.ukphone = headers[index]
        break
      }
    }

    // 如果没有自动检测到，使用第一列和第二列
    if (!autoMapping.word && headers.length >= 1) {
      autoMapping.word = headers[0]
    }
    if (!autoMapping.trans && headers.length >= 2) {
      autoMapping.trans = headers[1]
    }

    setMapping(autoMapping)
  }, [headers])

  const handleConfirm = () => {
    if (!mapping.word) {
      setError('请选择单词字段')
      return
    }
    if (!mapping.trans) {
      setError('请选择释义字段')
      return
    }
    setError(null)
    onConfirm(mapping)
  }

  return (
    <div className="space-y-4">
      {/* 错误提示 */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* 字段映射选择 */}
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            单词字段 <span className="text-red-500">*</span>
          </label>
          <select
            value={mapping.word}
            onChange={(e) => setMapping({ ...mapping, word: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">请选择</option>
            {headers.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            释义字段 <span className="text-red-500">*</span>
          </label>
          <select
            value={mapping.trans}
            onChange={(e) => setMapping({ ...mapping, trans: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">请选择</option>
            {headers.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            美式音标字段（可选）
          </label>
          <select
            value={mapping.usphone || ''}
            onChange={(e) => setMapping({ ...mapping, usphone: e.target.value || undefined })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">不使用</option>
            {headers.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            英式音标字段（可选）
          </label>
          <select
            value={mapping.ukphone || ''}
            onChange={(e) => setMapping({ ...mapping, ukphone: e.target.value || undefined })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">不使用</option>
            {headers.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 数据预览 */}
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">数据预览</p>
        <div className="max-h-40 overflow-auto rounded-lg border border-gray-200 dark:border-gray-600">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="px-2 py-1.5 text-left font-medium text-gray-600 dark:text-gray-300"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {sampleData.map((row, index) => (
                <tr key={index}>
                  {headers.map((header) => (
                    <td key={header} className="px-2 py-1.5 text-gray-600 dark:text-gray-400">
                      {row[header] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 按钮 */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onBack}
          className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          上一步
        </button>
        <button
          onClick={handleConfirm}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
        >
          下一步
        </button>
      </div>
    </div>
  )
}
