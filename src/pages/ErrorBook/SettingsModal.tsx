/**
 * 错题本设置弹窗
 */
import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import IconX from '~icons/tabler/x'

export type ReviewMode = 'ebbinghaus' | 'sequential' | 'random'
export type SortMethod = 'time' | 'errorCount' | 'dictionary'
export type ErrorCountOrder = 'asc' | 'desc'

export interface ErrorBookSettings {
  reviewMode: ReviewMode
  sortMethod: SortMethod
  errorCountOrder: ErrorCountOrder
  masteryThreshold: number
}

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: ErrorBookSettings
  onSettingsChange: (settings: ErrorBookSettings) => void
}

export default function SettingsModal({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
}: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<ErrorBookSettings>(settings)

  const handleSave = () => {
    onSettingsChange(localSettings)
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-xl font-bold text-gray-800 dark:text-white">
              错题本设置
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <IconX className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            统一管理复习/排序/已掌握条件
          </p>

          {/* 复习模式 */}
          <div className="mb-6">
            <h3 className="mb-3 font-medium text-gray-800 dark:text-white">复习模式</h3>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="reviewMode"
                  checked={localSettings.reviewMode === 'ebbinghaus'}
                  onChange={() => setLocalSettings({ ...localSettings, reviewMode: 'ebbinghaus' })}
                  className="h-4 w-4 text-indigo-500"
                />
                <div>
                  <span className="text-gray-700 dark:text-gray-300">艾宾浩斯算法练习</span>
                  <span className="ml-2 text-xs text-gray-400">会员可用</span>
                </div>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="reviewMode"
                  checked={localSettings.reviewMode === 'sequential'}
                  onChange={() => setLocalSettings({ ...localSettings, reviewMode: 'sequential' })}
                  className="h-4 w-4 text-indigo-500"
                />
                <span className="text-gray-700 dark:text-gray-300">顺序练习</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="reviewMode"
                  checked={localSettings.reviewMode === 'random'}
                  onChange={() => setLocalSettings({ ...localSettings, reviewMode: 'random' })}
                  className="h-4 w-4 text-indigo-500"
                />
                <span className="text-gray-700 dark:text-gray-300">随机练习</span>
              </label>
            </div>
            <p className="mt-2 text-sm text-indigo-500">艾宾浩斯算法练习仅对会员开放</p>
          </div>

          {/* 排序方式 */}
          <div className="mb-6">
            <h3 className="mb-3 font-medium text-gray-800 dark:text-white">排序方式</h3>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="sortMethod"
                  checked={localSettings.sortMethod === 'time'}
                  onChange={() => setLocalSettings({ ...localSettings, sortMethod: 'time' })}
                  className="h-4 w-4 text-indigo-500"
                />
                <span className="text-gray-700 dark:text-gray-300">进入错题本时间</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="sortMethod"
                  checked={localSettings.sortMethod === 'errorCount'}
                  onChange={() => setLocalSettings({ ...localSettings, sortMethod: 'errorCount' })}
                  className="h-4 w-4 text-indigo-500"
                />
                <span className="text-gray-700 dark:text-gray-300">错误次数</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="sortMethod"
                  checked={localSettings.sortMethod === 'dictionary'}
                  onChange={() => setLocalSettings({ ...localSettings, sortMethod: 'dictionary' })}
                  className="h-4 w-4 text-indigo-500"
                />
                <span className="text-gray-700 dark:text-gray-300">词典排序</span>
              </label>
            </div>

            {/* 错误次数排序方向 */}
            {localSettings.sortMethod === 'errorCount' && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-gray-500">错误次数排序</span>
                <select
                  value={localSettings.errorCountOrder}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      errorCountOrder: e.target.value as ErrorCountOrder,
                    })
                  }
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="asc">从少到多</option>
                  <option value="desc">从多到少</option>
                </select>
              </div>
            )}
          </div>

          {/* 已掌握阈值 */}
          <div className="mb-6">
            <h3 className="mb-2 font-medium text-gray-800 dark:text-white">已掌握阈值</h3>
            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
              正确输入次数达到该值后视为已掌握
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="10"
                value={localSettings.masteryThreshold}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, masteryThreshold: Number(e.target.value) })
                }
                className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-indigo-500 dark:bg-gray-700"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                当前：{localSettings.masteryThreshold} 次
              </span>
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="rounded-lg bg-indigo-500 px-6 py-2 font-medium text-white transition-colors hover:bg-indigo-600"
            >
              关闭
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
