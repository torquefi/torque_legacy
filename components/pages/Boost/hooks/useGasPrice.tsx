import {
  EXECUTION_FEE_CONFIG_V2,
  GAS_PRICE_ADJUSTMENT_MAP,
} from '@/configs/chains'
import { BASIS_POINTS_DIVISOR } from '@/constants/factors'
import { useSettings } from '@/context/SettingsContext/SettingsContextProvider'
import { useEthersProvider } from '@/lib/hooks/useEthersProvider'
import { bigNumberify } from '@/lib/numbers'
import { BigNumber } from 'ethers'
import { getProvider } from '@/lib/rpc'
import useSWR from 'swr'

export function useGasPrice(chainId: number) {
  const signer = useEthersProvider()
  const settings = useSettings()

  const executionFeeConfig = EXECUTION_FEE_CONFIG_V2[chainId]

  const { data: gasPrice } = useSWR<BigNumber | undefined>(
    [
      'gasPrice',
      chainId,
      executionFeeConfig.shouldUseMaxPriorityFeePerGas,
      settings.executionFeeBufferBps,
    ],
    {
      fetcher: () => {
        return new Promise<BigNumber | undefined>(async (resolve, reject) => {
          const provider = getProvider(signer as any, chainId)

          if (!provider) {
            resolve(undefined)
            return
          }

          try {
            let gasPrice = await provider.getGasPrice()

            if (executionFeeConfig.shouldUseMaxPriorityFeePerGas) {
              const feeData = await provider.getFeeData()

              // the wallet provider might not return maxPriorityFeePerGas in feeData
              // in which case we should fallback to the usual getGasPrice flow handled below
              if (feeData && feeData.maxPriorityFeePerGas) {
                gasPrice = gasPrice.add(feeData.maxPriorityFeePerGas)
              }
            }

            if (settings.executionFeeBufferBps) {
              const buffer = gasPrice
                .mul(settings.executionFeeBufferBps)
                .div(BASIS_POINTS_DIVISOR)
              gasPrice = gasPrice.add(buffer)
            }
            const premium = GAS_PRICE_ADJUSTMENT_MAP[chainId] || bigNumberify(0)

            resolve(gasPrice.add(premium))
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e)
            reject(e)
          }
        })
      },
    }
  )

  return { gasPrice }
}
