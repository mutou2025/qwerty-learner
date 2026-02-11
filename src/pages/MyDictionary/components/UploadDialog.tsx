import type { CSVRow, FieldMapping, UserDictionary } from '../types'
import FieldMapper from './FieldMapper'
import type { Word } from '@/typings'
import { Dialog, Transition } from '@headlessui/react'
import Papa from 'papaparse'
import { Fragment, useCallback, useRef, useState } from 'react'
import IconUpload from '~icons/tabler/upload'
import IconX from '~icons/tabler/x'

interface UploadDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (dictionary: Omit<UserDictionary, 'id' | 'createdAt' | 'updatedAt'>) => void
}

type Step = 'upload' | 'mapping' | 'preview'

export default function UploadDialog({ isOpen, onClose, onSave }: UploadDialogProps) {
  const [step, setStep] = useState<Step>('upload')
  const [csvData, setCsvData] = useState<CSVRow[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [mapping, setMapping] = useState<FieldMapping | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 重置状态
  const resetState = useCallback(() => {
    setStep('upload')
    setCsvData([])
    setHeaders([])
    setMapping(null)
    setName('')
    setDescription('')
    setError(null)
  }, [])

  // 处理文件上传
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)

    // 从文件名提取词库名称
    const fileName = file.name.replace(/\.(csv|txt)$/i, '')
    setName(fileName)

    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError(`解析错误: ${results.errors[0].message}`)
          return
        }

        if (results.data.length === 0) {
          setError('文件为空或格式不正确')
          return
        }

        const headers = results.meta.fields || []
        if (headers.length < 2) {
          setError('CSV 文件至少需要两列（单词和释义）')
          return
        }

        setCsvData(results.data)
        setHeaders(headers)
        setStep('mapping')
      },
      error: (err) => {
        setError(`文件读取错误: ${err.message}`)
      },
    })
  }, [])

  // 处理字段映射确认
  const handleMappingConfirm = useCallback((fieldMapping: FieldMapping) => {
    setMapping(fieldMapping)
    setStep('preview')
  }, [])

  // 将 CSV 数据转换为 Word 格式
  const convertToWords = useCallback((): Word[] => {
    if (!mapping) return []

    return csvData
      .map((row) => {
        const word = row[mapping.word]?.trim()
        const trans = row[mapping.trans]?.trim()

        if (!word || !trans) return null

        // 处理���译，可能是多个翻译用分号分隔
        const transArray = trans
          .split(/[;；]/)
          .map((t) => t.trim())
          .filter(Boolean)

        return {
          name: word,
          trans: transArray,
          usphone: mapping.usphone ? row[mapping.usphone]?.trim() : undefined,
          ukphone: mapping.ukphone ? row[mapping.ukphone]?.trim() : undefined,
        } as Word
      })
      .filter((w): w is Word => w !== null)
  }, [csvData, mapping])

  // 保存词库
  const handleSave = useCallback(() => {
    if (!name.trim()) {
      setError('请输入词库名称')
      return
    }

    const words = convertToWords()
    if (words.length === 0) {
      setError('没有有效的单词数据')
      return
    }

    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      words,
    })

    resetState()
    onClose()
  }, [name, description, convertToWords, onSave, resetState, onClose])

  // 关闭对话框
  const handleClose = useCallback(() => {
    resetState()
    onClose()
  }, [resetState, onClose])

  const previewWords = convertToWords().slice(0, 5)

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 dark:bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all dark:bg-gray-800">
                {/* 头部 */}
                <div className="mb-6 flex items-center justify-between">
                  <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                    {step === 'upload' && '上传词库'}
                    {step === 'mapping' && '字段映射'}
                    {step === 'preview' && '预览确认'}
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700"
                  >
                    <IconX className="h-5 w-5" />
                  </button>
                </div>

                {/* 错误提示 */}
                {error && (
                  <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                  </div>
                )}

                {/* 步骤 1: 上传文件 */}
                {step === 'upload' && (
                  <div className="space-y-4">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-indigo-400 hover:bg-indigo-50 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/20"
                    >
                      <IconUpload className="mb-4 h-12 w-12 text-gray-400" />
                      <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                        点击上传 CSV 文件
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        支持 .csv 或 .txt 格式
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      <p className="mb-2 font-medium">CSV 格式要求：</p>
                      <ul className="list-inside list-disc space-y-1 text-xs">
                        <li>第一行为表头，包含字段名称</li>
                        <li>至少包含单词和释义两列</li>
                        <li>可选音标列</li>
                        <li>示例: word,trans,usphone</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* 步骤 2: 字段映射 */}
                {step === 'mapping' && (
                  <FieldMapper
                    headers={headers}
                    sampleData={csvData.slice(0, 3)}
                    onConfirm={handleMappingConfirm}
                    onBack={() => setStep('upload')}
                  />
                )}

                {/* 步骤 3: 预览确认 */}
                {step === 'preview' && (
                  <div className="space-y-4">
                    {/* 词库信息 */}
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          词库名称 *
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          placeholder="输入词库名称"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          描述（可选）
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={2}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          placeholder="输入词库描述"
                        />
                      </div>
                    </div>

                    {/* 预览 */}
                    <div>
                      <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        预览（共 {convertToWords().length} 个单词）
                      </p>
                      <div className="max-h-48 overflow-auto rounded-lg border border-gray-200 dark:border-gray-600">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
                                单词
                              </th>
                              <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
                                释义
                              </th>
                              <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
                                音标
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                            {previewWords.map((word, index) => (
                              <tr key={index}>
                                <td className="px-3 py-2 text-gray-800 dark:text-gray-200">
                                  {word.name}
                                </td>
                                <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                                  {word.trans.join('; ')}
                                </td>
                                <td className="px-3 py-2 text-gray-500 dark:text-gray-500">
                                  {word.usphone || '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* 按钮 */}
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setStep('mapping')}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        上一步
                      </button>
                      <button
                        onClick={handleSave}
                        className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
                      >
                        保存词库
                      </button>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
