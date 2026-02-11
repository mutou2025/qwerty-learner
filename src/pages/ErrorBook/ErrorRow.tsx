import { LoadingWordUI } from './LoadingWordUI'
import useGetWord from './hooks/useGetWord'
import { currentRowDetailAtom } from './store'
import type { groupedWordRecords } from './type'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { idDictionaryMap } from '@/resources/dictionary'
import { recordErrorBookAction } from '@/utils'
import { useSetAtom } from 'jotai'
import type { FC } from 'react'
import { useCallback } from 'react'
import DeleteIcon from '~icons/weui/delete-filled'

type IErrorRowProps = {
  record: groupedWordRecords
  onDelete: () => void
}

const ErrorRow: FC<IErrorRowProps> = ({ record, onDelete }) => {
  const setCurrentRowDetail = useSetAtom(currentRowDetailAtom)
  const dictInfo = idDictionaryMap[record.dict]
  const { word, isLoading, hasError } = useGetWord(record.word, dictInfo)

  const onClick = useCallback(() => {
    setCurrentRowDetail(record)
    recordErrorBookAction('detail')
  }, [record, setCurrentRowDetail])

  return (
    <div
      className="flex w-full cursor-pointer items-center px-6 py-3 text-black hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700"
      onClick={onClick}
    >
      <span className="basis-2/12 break-normal text-center">{record.word}</span>
      <span className="basis-4/12 break-normal text-center text-sm text-gray-600 dark:text-gray-400">
        {word ? word.trans.join('；') : <LoadingWordUI isLoading={isLoading} hasError={hasError} />}
      </span>
      <span className="basis-2/12 break-normal text-center text-gray-700 dark:text-gray-300">
        {record.wrongCount}
      </span>
      <span className="basis-2/12 break-normal text-center text-sm text-gray-500 dark:text-gray-400">
        {dictInfo?.name}
      </span>
      <span
        className="basis-1/12 break-normal text-center"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DeleteIcon className="mx-auto text-gray-400 hover:text-red-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>删除记录</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </span>
    </div>
  )
}

export default ErrorRow
