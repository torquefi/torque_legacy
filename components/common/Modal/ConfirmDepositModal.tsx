import Modal from '@/components/common/Modal'
import {
  tokenBtcContract,
  tokenEthContract,
  tokenTusdContract,
  tokenUsdtContract,
} from '@/components/pages/Borrow/constants/contract'
import { getBalanceByContractToken } from '@/constants/utils'
import { floorFraction } from '@/lib/helpers/number'
import { AppStore } from '@/types/store'
import { useEffect, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { useAccount } from 'wagmi'
import Web3 from 'web3'
import LoadingCircle from '../Loading/LoadingCircle'
import NumberFormat from '../NumberFormat'
import {
  compContract,
  linkContract,
  uniContract,
} from '@/components/pages/Boost/constants/contracts'
import { torqContract } from '@/constants/contracts'

interface Detail {
  label: string
  value: string
}

interface DepositCoinDetail {
  amount: any
  symbol: string
  icon: string
  isUsd?: boolean
}

interface ConfirmDepositModalProps {
  open: boolean
  handleClose: () => void
  confirmButtonText: string
  onConfirm: () => void
  coinFrom: DepositCoinDetail
  coinTo: DepositCoinDetail
  details?: Detail[]
  loading?: boolean
  loop?: number // Add loop prop
}

export function ConfirmDepositModal(props: ConfirmDepositModalProps) {
  const {
    open,
    handleClose,
    confirmButtonText,
    onConfirm,
    coinFrom,
    coinTo,
    details = [],
    loading,
    loop = 1, // Default to 1x if not provided
  } = props
  const web3 = new Web3(Web3.givenProvider)
  const { address } = useAccount()
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const [balanceWallet, setBalanceWallet] = useState<any>(0)

  // Adjust amounts based on loop value
  const adjustedCoinFrom = {
    ...coinFrom,
    amount: coinFrom.amount * loop, // Multiply supply amount by loop
  }

  const adjustedCoinTo = {
    ...coinTo,
    amount: coinTo.amount * loop, // Multiply borrow amount by loop
  }

  const renderAmount = (coin: DepositCoinDetail) => {
    let amount = coin?.amount?.toString()
    if (coin?.isUsd) {
      amount = floorFraction(amount, 2)?.toFixed(2)
    } else {
      amount = floorFraction(amount, 5)?.toString()
      if (!/\.\d\d/g.test(amount)) {
        amount = (+amount)?.toFixed(2)
      }
    }
    return (
      <NumberFormat
        displayType="text"
        value={amount}
        suffix={!coin?.isUsd ? ` ${coin.symbol}` : ''}
        prefix={coin?.isUsd ? `$` : ''}
        thousandSeparator
        decimalScale={5}
      />
    )
  }

  useEffect(() => {
    if (address) {
      ;(async () => {
        if (coinFrom.symbol === 'WBTC') {
          const amount = await getBalanceByContractToken(
            tokenBtcContract.abi,
            tokenBtcContract.address,
            address
          )
          setBalanceWallet(amount)
        } else if (coinFrom.symbol === 'WETH') {
          const amount = await getBalanceByContractToken(
            tokenEthContract.abi,
            tokenEthContract.address,
            address
          )
          setBalanceWallet(amount)
        } else if (coinFrom.symbol === 'TUSD') {
          const amount = await getBalanceByContractToken(
            tokenTusdContract.abi,
            tokenTusdContract.address,
            address
          )
          setBalanceWallet(amount)
        } else if (coinFrom.symbol === 'USDT') {
          const amount = await getBalanceByContractToken(
            tokenUsdtContract.abi,
            tokenUsdtContract.address,
            address
          )
          setBalanceWallet(amount)
        } else if (coinFrom.symbol === 'LINK') {
          const amount = await getBalanceByContractToken(
            linkContract.abi,
            linkContract.address,
            address
          )
          setBalanceWallet(amount)
        } else if (coinFrom.symbol === 'UNI') {
          const amount = await getBalanceByContractToken(
            uniContract.abi,
            uniContract.address,
            address
          )
          setBalanceWallet(amount)
        } else if (coinFrom.symbol === 'COMP') {
          const amount = await getBalanceByContractToken(
            compContract.abi,
            compContract.address,
            address
          )
          setBalanceWallet(amount)
        } else if (coinFrom.symbol === 'TORQ') {
          const amount = await getBalanceByContractToken(
            torqContract.abi,
            torqContract.address,
            address
          )
          setBalanceWallet(amount)
        }
      })()
    }
  }, [coinFrom.symbol, address])

  return (
    <Modal
      className="mx-auto w-[90%] max-w-[360px] bg-[#FFFFFF] px-[22px] py-4 dark:bg-[#030303]"
      open={open}
      handleClose={handleClose}
      hideCloseIcon
    >
      <div className="flex items-center justify-between">
        <div className="font-rogan text-[24px] font-[400] text-[#030303] dark:text-white md:text-[28px]">
          Confirm
        </div>
        <AiOutlineClose
          className="cursor-pointer text-[#030303] dark:text-[#ffff]"
          onClick={handleClose}
        />
      </div>
      <div
        className={
          `mt-3 h-[1px] w-full md:block` +
          `
      ${
        theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
      }`
        }
      ></div>
      <div className=" h-auto w-full overflow-y-auto py-[18px]">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[16px] text-[#959595]">You supply</span>
            <div className="font-rogan pt-2 text-[23px] text-[#030303] dark:text-white">
              {renderAmount(adjustedCoinFrom)} {/* Use adjustedCoinFrom */}
            </div>
          </div>
          <div>
            <img className="w-16" src={coinFrom?.icon} alt="" />
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between">
          <div>
            <span className="text-[16px] text-[#959595]">You receive</span>
            <div className="font-rogan pt-2 text-[23px] text-[#030303] dark:text-white">
              {renderAmount(adjustedCoinTo)} {/* Use adjustedCoinTo */}
            </div>
          </div>
          <div className="relative w-16">
            <img className="w-16 " src={coinTo?.icon} alt="" />
            {/* {coinTo.symbol === 'TUSD' && ( */}
            <img
              className="absolute bottom-3 right-3 w-5"
              src="/assets/t-logo-circle.svg"
              alt=""
            />
            {/* )} */}
          </div>
        </div>
      </div>
      <div
        className={
          `mt-2 h-[1px] w-full md:block` +
          `
      ${
        theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
      }`
        }
      ></div>
      <div className="my-4 flex flex-wrap gap-3 text-[16px] text-[#959595]">
        <div className="flex w-full items-center justify-between text-[15px]">
          <p>Wallet balance</p>
          <span>
            <NumberFormat
              displayType="text"
              value={balanceWallet}
              suffix={` ${coinFrom.symbol}`}
              thousandSeparator
              decimalScale={6}
            />
          </span>
        </div>
        {details?.map((item, i) => (
          <div
            className="flex w-full items-center justify-between text-[15px]"
            key={i}
          >
            <p>{item?.label}</p>
            <span>{item?.value}</span>
          </div>
        ))}
      </div>
      <button
        onClick={onConfirm}
        disabled={loading}
        className={`font-rogan-regular w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
          ${loading ? ' cursor-not-allowed' : ' cursor-pointer'}
          `}
      >
        {loading ? (
          <LoadingCircle />
        ) : (
          confirmButtonText
        )}
      </button>
    </Modal>
  )
}
