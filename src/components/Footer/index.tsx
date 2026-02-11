import { DonatingCard } from '../DonatingCard'
import InfoPanel from '@/components/InfoPanel'
import { infoPanelStateAtom } from '@/store'
import type { InfoPanelType } from '@/typings'
import { recordOpenInfoPanelAction } from '@/utils'
import { useAtom } from 'jotai'
import type React from 'react'
import { useCallback } from 'react'
import IconCoffee from '~icons/lucide/coffee'
// import IconWechat from '~icons/tabler/brand-wechat'
// import IconCoffee from '~icons/tabler/coffee'
import IconWechat from '~icons/lucide/message-circle'
import IconMail from '~icons/material-symbols/mail'
import IconCoffee2 from '~icons/mdi/coffee'
import IconXiaoHongShu from '~icons/my-icons/xiaohongshu'
import RiLinksLine from '~icons/ri/links-line'
import IconGithub from '~icons/simple-icons/github'
import IconWechat2 from '~icons/simple-icons/wechat'

const Footer: React.FC = () => {
  const [infoPanelState, setInfoPanelState] = useAtom(infoPanelStateAtom)

  const handleOpenInfoPanel = useCallback(
    (modalType: InfoPanelType) => {
      recordOpenInfoPanelAction(modalType, 'footer')
      setInfoPanelState((state) => ({ ...state, [modalType]: true }))
    },
    [setInfoPanelState],
  )

  const handleCloseInfoPanel = useCallback(
    (modalType: InfoPanelType) => {
      setInfoPanelState((state) => ({ ...state, [modalType]: false }))
    },
    [setInfoPanelState],
  )

  return (
    <>
      <InfoPanel
        openState={infoPanelState.donate}
        title="Buy us a coffee"
        icon={IconCoffee}
        buttonClassName="bg-amber-500 hover:bg-amber-400"
        iconClassName="text-amber-500 bg-amber-100 dark:text-amber-300 dark:bg-amber-500"
        onClose={() => handleCloseInfoPanel('donate')}
      >
        <DonatingCard />
      </InfoPanel>

      <InfoPanel
        openState={infoPanelState.community}
        title="用户反馈社群"
        icon={IconWechat}
        buttonClassName="bg-green-500 hover:bg-green-400"
        iconClassName="text-green-500 bg-green-100 dark:text-green-300 dark:bg-green-500"
        onClose={() => handleCloseInfoPanel('community')}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">
          您可以与我们分享您的使用体验和建议，帮助我们改进产品，再次感谢您的支持和关注!
        </p>
        <br />
        <img className="ml-1 w-2/6 " src="/weChat-group.png" alt="weChat-group" />
        <br />
      </InfoPanel>

      <InfoPanel
        openState={infoPanelState.redBook}
        title="小红书社群"
        icon={IconXiaoHongShu}
        buttonClassName="bg-red-500 hover:bg-red-400"
        iconClassName="text-red-500 bg-red-100 dark:text-red-600 dark:bg-red-500"
        onClose={() => handleCloseInfoPanel('redBook')}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">
          您可以与我们分享您的使用体验和建议，帮助我们改进产品，再次感谢您的支持和关注!
        </p>
        <br />
        <img className="ml-1 w-5/12 " src="/weChat-group.png" alt="weChat-group" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Tips: 请扫码添加微信</p>
        <br />
      </InfoPanel>

      <footer
        className="mb-1 mt-4 flex w-full items-center justify-center gap-2.5 text-sm ease-in"
        onClick={(e) => e.currentTarget.blur()}
      >
        <span aria-label="GitHub 图标">
          <IconGithub
            fontSize={15}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
          />
        </span>

        <button
          className="cursor-pointer"
          type="button"
          onClick={(e) => {
            handleOpenInfoPanel('redBook')
            e.currentTarget.blur()
          }}
          aria-label="加入我们的小红书社群"
        >
          <IconXiaoHongShu
            fontSize={14}
            className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500"
          />
        </button>

        <button
          className="cursor-pointer focus:outline-none"
          type="button"
          onClick={(e) => {
            handleOpenInfoPanel('community')
            e.currentTarget.blur()
          }}
          aria-label="加入我们的微信用户群"
        >
          <IconWechat2
            fontSize={16}
            className="text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-500"
          />
        </button>

        <button
          className="cursor-pointer focus:outline-none "
          type="button"
          onClick={(e) => {
            handleOpenInfoPanel('donate')
            e.currentTarget.blur()
          }}
          aria-label="考虑捐赠我们"
        >
          <IconCoffee2
            fontSize={16}
            className="text-gray-500 hover:text-amber-500 dark:text-gray-400 dark:hover:text-amber-500"
          />
        </button>

        <span aria-label="邮箱图标">
          <IconMail
            fontSize={16}
            className="text-gray-500 hover:text-indigo-400 dark:text-gray-400 dark:hover:text-indigo-400"
          />
        </span>
        <span aria-label="友链图标">
          <RiLinksLine
            fontSize={14}
            className="text-gray-500 hover:text-indigo-400 dark:text-gray-400 dark:hover:text-indigo-400"
          />
        </span>

        <button
          className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          type="button"
          onClick={(e) => {
            handleOpenInfoPanel('donate')
            e.currentTarget.blur()
          }}
        >
          @ Echo Learner
        </button>

        <span className="select-none rounded bg-slate-200 px-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          Build <span className="select-all">{LATEST_COMMIT_HASH}</span>
        </span>
      </footer>
    </>
  )
}

export default Footer
