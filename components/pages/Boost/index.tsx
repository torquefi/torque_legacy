import { useEffect, useState } from 'react'
import SkeletonDefault from '@/components/skeleton'
import { ManageBoostVault } from './ManageBoostVault'
import Banner from './Banner'
import { CreateBoostVault } from './CreateBoostVault'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'

export const BoostPage = () => {
  const [isLoading, setLoading] = useState(true)
  const layoutBoost = useSelector((store: AppStore) => store.layout.layoutBoost)
  const visibilityBoostBanner = useSelector(
    (store: AppStore) => store.layout.visibilityBoostBanner
  )

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [])

  if (isLoading) {
    return (
      <div className="mt-[-20px]">
        {visibilityBoostBanner && (
          <div className="relative w-full aspect-[4/1] rounded-xl overflow-hidden">
            <SkeletonDefault className="h-full w-full" />
          </div>
        )}
        <div className="mt-[36px]">
          {layoutBoost === 'grid' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <SkeletonDefault height={'34px'} width={'160px'} />
                </div>
                <div className="flex space-x-2">
                  <SkeletonDefault height={'34px'} width={'34px'} />
                  <SkeletonDefault height={'34px'} width={'76px'} />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <SkeletonDefault height={'450px'} width={'100%'} />
                <SkeletonDefault height={'450px'} width={'100%'} />
                <SkeletonDefault height={'450px'} width={'100%'} />
                <SkeletonDefault height={'450px'} width={'100%'} />
              </div>
            </div>
          )}
          {layoutBoost === 'row' && (
            <div>
              <SkeletonDefault height={120} width={'100%'} />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-[36px] mt-[-16px]">
      {visibilityBoostBanner && <Banner />}
      <CreateBoostVault />
      <ManageBoostVault />
    </div>
  )
}
