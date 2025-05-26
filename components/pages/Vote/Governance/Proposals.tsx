import React, { useState } from 'react'
import { ProposalsItem } from './ProposalsItem'
import { CreateModal } from './CreateModal'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'
import Link from 'next/link'
import { useAppSelector } from '@/lib/redux/store'

export const Proposals = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const { tipData } = useAppSelector(state => state.tips)

  return (
    <>
      <div className="dark:text-white rounded-xl border bg-[#FFFFFF] from-[#0d0d0d] to-[#0d0d0d]/0 px-[16px] py-[12px] w-full text-[#030303] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b xl:px-[24px] sm:mr-0 md:w-[59%] md:px-[37px] lg:mr-[2px]">
        <div className="flex items-center justify-between">
          <h4 className="font-rogan text-[#030303] dark:text-white text-[24px] font-[400] leading-[40px]">
            Proposals
          </h4>
          <button
            className="flex items-center gap-[4px]"
            onClick={() => setOpenCreateModal(true)}
          >
            <p className="text-[16px] uppercase text-[#AA5BFF]">
              create
            </p>
            <img src="/assets/pages/vote/genover/next.svg" alt="info" className="w-3" />
          </button>
        </div>
        <div className={`mt-2 h-[1px] w-full md:block` + `
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'}`
        }></div>
        {tipData.map((item, i) => (
          <ProposalsItem menu={item} key={item?.id} />
        ))}
        <Link href="#" legacyBehavior>
          <a>
            <div className="mt-[12px] cursor-pointer text-center text-[16px] font-[500] uppercase text-[#959595]">
              view all
            </div>
          </a>
        </Link>
      </div>
      <CreateModal
        openModal={openCreateModal}
        handleCLose={() => setOpenCreateModal(false)}
      />
    </>
  )
}
