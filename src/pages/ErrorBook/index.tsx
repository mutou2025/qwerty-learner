import DropdownExport from './DropdownExport'
import ErrorRow from './ErrorRow'
import type { ISortType } from './HeadWrongNumber'
import HeadWrongNumber from './HeadWrongNumber'
import Pagination, { ITEM_PER_PAGE } from './Pagination'
import RowDetail from './RowDetail'
import SettingsModal, { type ErrorBookSettings } from './SettingsModal'
import { currentRowDetailAtom } from './store'
import type { groupedWordRecords } from './type'
import Layout from '@/components/Layout'
import { useReviewCards } from '@/hooks/useReviewCards'
import { createReviewCard } from '@/lib/spaced-repetition/sm2'
import { idDictionaryMap } from '@/resources/dictionary'
import { db, useDeleteWordRecord } from '@/utils/db'
import type { WordRecord } from '@/utils/db/record'
import { wordListFetcher } from '@/utils/wordListFetcher'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import IconAdjustmentsHorizontal from '~icons/tabler/adjustments-horizontal'
import IconChevronDown from '~icons/tabler/chevron-down'
import IconLoader from '~icons/tabler/loader-2'
import IconSettings from '~icons/tabler/settings'
import IconTrash from '~icons/tabler/trash'

export function ErrorBook() {
  const [groupedRecords, setGroupedRecords] = useState<groupedWordRecords[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = useMemo(
    () => Math.ceil(groupedRecords.length / ITEM_PER_PAGE),
    [groupedRecords.length],
  )
  const [sortType, setSortType] = useState<ISortType>('asc')
  const currentRowDetail = useAtomValue(currentRowDetailAtom)
  const { deleteWordRecord } = useDeleteWordRecord()
  const [reload, setReload] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [batchDeleteMode, setBatchDeleteMode] = useState(false)
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set())
  const [languageFilter, setLanguageFilter] = useState('all')
  const [isAddingToReview, setIsAddingToReview] = useState(false)
  const navigate = useNavigate()
  const { addCards } = useReviewCards()

  const [settings, setSettings] = useState<ErrorBookSettings>({
    reviewMode: 'sequential',
    sortMethod: 'errorCount',
    errorCountOrder: 'asc',
    masteryThreshold: 3,
  })

  const setPage = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return
      setCurrentPage(page)
    },
    [totalPages],
  )

  const setSort = useCallback(
    (sortType: ISortType) => {
      setSortType(sortType)
      setPage(1)
    },
    [setPage],
  )

  const sortedRecords = useMemo(() => {
    if (sortType === 'none') return groupedRecords
    return [...groupedRecords].sort((a, b) => {
      if (sortType === 'asc') {
        return a.wrongCount - b.wrongCount
      } else {
        return b.wrongCount - a.wrongCount
      }
    })
  }, [groupedRecords, sortType])

  const renderRecords = useMemo(() => {
    const start = (currentPage - 1) * ITEM_PER_PAGE
    const end = start + ITEM_PER_PAGE
    return sortedRecords.slice(start, end)
  }, [currentPage, sortedRecords])

  useEffect(() => {
    db.wordRecords
      .where('wrongCount')
      .above(0)
      .toArray()
      .then((records) => {
        const groups: groupedWordRecords[] = []

        records.forEach((record) => {
          let group = groups.find((g) => g.word === record.word && g.dict === record.dict)
          if (!group) {
            group = { word: record.word, dict: record.dict, records: [], wrongCount: 0 }
            groups.push(group)
          }
          group.records.push(record as WordRecord)
        })

        groups.forEach((group) => {
          group.wrongCount = group.records.reduce((acc, cur) => {
            acc += cur.wrongCount
            return acc
          }, 0)
        })

        setGroupedRecords(groups)
      })
  }, [reload])

  const handleDelete = async (word: string, dict: string) => {
    await deleteWordRecord(word, dict)
    setReload((prev) => !prev)
  }

  const handleStartReview = async () => {
    if (groupedRecords.length === 0) return

    setIsAddingToReview(true)
    try {
      // 收集所有错词的详细信息
      const reviewCards = []

      // 按词典分组加载单词信息
      const dictGroups = new Map<string, groupedWordRecords[]>()
      for (const record of groupedRecords) {
        const existing = dictGroups.get(record.dict) || []
        existing.push(record)
        dictGroups.set(record.dict, existing)
      }

      // 为每个词典加载单词列表并创建复习卡片
      for (const [dictId, records] of Array.from(dictGroups.entries())) {
        const dictInfo = idDictionaryMap[dictId]
        if (!dictInfo?.url) continue

        try {
          const wordList = await wordListFetcher(dictInfo.url)
          for (const record of records) {
            const word = wordList?.find((w: { name: string }) => w.name === record.word)
            if (word) {
              reviewCards.push(createReviewCard(word.name, word.trans || [], word.usphone))
            }
          }
        } catch (error) {
          console.error(`Failed to load words for dict ${dictId}:`, error)
        }
      }

      if (reviewCards.length > 0) {
        await addCards(reviewCards)
        navigate('/review')
      }
    } finally {
      setIsAddingToReview(false)
    }
  }

  const toggleWordSelection = (key: string) => {
    const newSelection = new Set(selectedWords)
    if (newSelection.has(key)) {
      newSelection.delete(key)
    } else {
      newSelection.add(key)
    }
    setSelectedWords(newSelection)
  }

  const handleBatchDelete = async () => {
    if (selectedWords.size === 0) return
    const keysArray = Array.from(selectedWords)
    for (const key of keysArray) {
      const [dict, word] = key.split('::')
      await deleteWordRecord(word, dict)
    }
    setSelectedWords(new Set())
    setReload((prev) => !prev)
  }

  return (
    <Layout>
      <div
        className={`relative flex h-full w-full flex-1 flex-col items-center pb-4 ease-in ${
          currentRowDetail && 'blur-sm'
        }`}
      >
        <div className="flex w-full flex-1 select-text flex-col items-start justify-start overflow-hidden px-8">
          <div className="flex h-full w-full flex-col pt-4">
            {/* 工具栏 - 与表格同宽 */}
            <div className="mb-4 flex w-full items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm dark:bg-gray-800">
              {/* 左侧工具栏 */}
              <div className="flex items-center gap-4">
                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <IconAdjustmentsHorizontal className="h-5 w-5" />
                </button>

                {/* 批量删除开关 */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setBatchDeleteMode(!batchDeleteMode)}
                    className={`relative h-5 w-9 rounded-full transition-colors ${
                      batchDeleteMode ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`block h-4 w-4 rounded-full bg-white transition-transform ${
                        batchDeleteMode ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-300">批量删除</span>
                </div>

                {/* 语言筛选 */}
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">语言:</span>
                  <button className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm dark:border-gray-600 dark:bg-gray-700">
                    <span className="text-base">🇬🇧</span>
                    <span className="text-gray-700 dark:text-gray-200">英语</span>
                    <IconChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* 右侧工具栏 */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  • 点击单词查看详细信息
                </span>

                {batchDeleteMode && selectedWords.size > 0 && (
                  <button
                    onClick={handleBatchDelete}
                    className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
                  >
                    <IconTrash className="h-4 w-4" />
                    删除选中 ({selectedWords.size})
                  </button>
                )}

                <button
                  onClick={handleStartReview}
                  disabled={groupedRecords.length === 0 || isAddingToReview}
                  className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isAddingToReview && <IconLoader className="h-4 w-4 animate-spin" />}
                  {isAddingToReview ? '处理中...' : '复习错题本'}
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  title="错题本设置"
                >
                  <IconSettings className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 表头 */}
            <div className="flex w-full border-b border-gray-200 bg-gray-50 px-6 py-4 text-sm font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              {batchDeleteMode && <span className="basis-1/12 text-center"></span>}
              <span className="basis-2/12 text-center">单词</span>
              <span className="basis-4/12 text-center">释义</span>
              <HeadWrongNumber
                className="basis-2/12 text-center"
                sortType={sortType}
                setSortType={setSort}
              />
              <span className="basis-2/12 text-center">词典</span>
              <span className="basis-1/12 text-center">操作</span>
            </div>

            {/* 内容区域 */}
            <ScrollArea.Root className="flex-1 overflow-y-auto">
              <ScrollArea.Viewport className="h-full">
                {renderRecords.length === 0 ? (
                  <div className="flex h-64 items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-500">暂无错误记录</span>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {renderRecords.map((record) => {
                      const key = `${record.dict}::${record.word}`
                      return (
                        <div
                          key={key}
                          className="flex items-center border-b border-gray-100 dark:border-gray-700"
                        >
                          {batchDeleteMode && (
                            <div className="basis-1/12 px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedWords.has(key)}
                                onChange={() => toggleWordSelection(key)}
                                className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-500"
                              />
                            </div>
                          )}
                          <ErrorRow
                            record={record}
                            onDelete={() => handleDelete(record.word, record.dict)}
                          />
                        </div>
                      )
                    })}
                  </div>
                )}
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar
                className="flex touch-none select-none bg-transparent"
                orientation="vertical"
              ></ScrollArea.Scrollbar>
            </ScrollArea.Root>
          </div>
        </div>
        <Pagination className="pt-3" page={currentPage} setPage={setPage} totalPages={totalPages} />
      </div>
      {currentRowDetail && (
        <RowDetail currentRowDetail={currentRowDetail} allRecords={sortedRecords} />
      )}

      <SettingsModal
        open={showSettings}
        onOpenChange={setShowSettings}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </Layout>
  )
}
