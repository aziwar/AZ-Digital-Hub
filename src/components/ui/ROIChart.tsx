'use client'

import { ArrowTrendingUpIcon, ChartBarIcon, CurrencyDollarIcon, TrophyIcon } from '@heroicons/react/24/solid'
import { useTranslations } from 'next-intl'
import { useState, useEffect, useRef } from 'react'

interface ROIMetric {
  key: string
  percentage: number
  value: string
  color: string
  barWidth: number
  gradientFrom: string
  gradientTo: string
}

// Move metrics constant outside component to prevent stale closures
const METRICS: ROIMetric[] = [
  {
    key: 'ecommerce',
    percentage: 340,
    value: '+340%',
    color: 'from-green-400 to-emerald-400',
    barWidth: 85,
    gradientFrom: 'rgb(74, 222, 128)',
    gradientTo: 'rgb(52, 211, 153)'
  },
  {
    key: 'marketing',
    percentage: 280,
    value: '+280%',
    color: 'from-purple-400 to-violet-400',
    barWidth: 70,
    gradientFrom: 'rgb(192, 132, 252)',
    gradientTo: 'rgb(167, 139, 250)'
  },
  {
    key: 'penetration',
    percentage: 420,
    value: '+420%',
    color: 'from-cyan-400 to-blue-400',
    barWidth: 95,
    gradientFrom: 'rgb(34, 211, 238)',
    gradientTo: 'rgb(96, 165, 250)'
  },
  {
    key: 'infrastructure',
    percentage: 180,
    value: '+180%',
    color: 'from-yellow-400 to-orange-400',
    barWidth: 45,
    gradientFrom: 'rgb(250, 204, 21)',
    gradientTo: 'rgb(251, 146, 60)'
  }
]

export function ROIChart() {
  const t = useTranslations('ROIChart')
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)
  const [animatedWidths, setAnimatedWidths] = useState<number[]>(new Array(METRICS.length).fill(0))
  const [_isVisible, setIsVisible] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for animations - optimized for mobile
  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = []
    let hasAnimated = false

    const triggerAnimation = () => {
      if (hasAnimated) return
      hasAnimated = true
      setIsVisible(true)

      // Animate bars with staggered delay
      METRICS.forEach((_, index) => {
        const timeoutId = setTimeout(() => {
          setAnimatedWidths(prev => {
            const newWidths = [...prev]
            newWidths[index] = METRICS[index].barWidth
            return newWidths
          })
        }, index * 200)
        timeoutIds.push(timeoutId)
      })
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          triggerAnimation()
        } else if (hasAnimated) {
          // Reset animation when scrolling away (re-trigger support)
          hasAnimated = false
          setIsVisible(false)
          setAnimatedWidths(new Array(METRICS.length).fill(0))
        }
      },
      {
        threshold: 0.1,        // Lower threshold for mobile (10% vs 30%)
        rootMargin: '0px'      // Removed premature triggering
      }
    )

    if (chartRef.current) {
      observer.observe(chartRef.current)

      // FIX: Check if element is already in viewport on mount (mobile hero section)
      const rect = chartRef.current.getBoundingClientRect()
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0

      if (isInViewport) {
        // Element already visible → trigger immediately
        triggerAnimation()
      }
    }

    return () => {
      // Cleanup timeouts to prevent memory leaks
      timeoutIds.forEach(id => clearTimeout(id))
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={chartRef}
      data-preserve-gradient
      className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-purple-500/30 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/30 to-cyan-400/30 blur-lg" />
          <div className="relative bg-slate-700/50 rounded-full p-2">
            <ArrowTrendingUpIcon className="size-6 text-green-400" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{t('header.title')}</h3>
          <p className="text-sm text-gray-400">{t('header.subtitle')}</p>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="space-y-4">
        {METRICS.map((metric, index) => (
          <div
            key={metric.key}
            className={`group cursor-pointer transition-all duration-300 ${
              selectedMetric === metric.key ? 'scale-105' : 'hover:scale-102'
            }`}
            onClick={() => setSelectedMetric(selectedMetric === metric.key ? null : metric.key)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300 text-sm font-medium">{t(`metrics.${metric.key}.category`)}</span>
              <div className="flex items-center gap-2">
                <span
                  className="text-xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${metric.gradientFrom}, ${metric.gradientTo})`
                  }}
                >
                  {metric.value}
                </span>
                <ChartBarIcon className="size-4 text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </div>

            {/* Enhanced Progress Bar with Animation */}
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden relative">
              <div
                className="h-3 rounded-full transition-all duration-1500 ease-out relative overflow-hidden"
                style={{
                  width: `${animatedWidths[index] || 0}%`,
                  backgroundImage: `linear-gradient(to right, ${metric.gradientFrom}, ${metric.gradientTo})`,
                  transformOrigin: 'left',
                  animation: selectedMetric === metric.key ? 'magneticPull 0.6s ease-in-out infinite' : 'none'
                }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-full rtl:-translate-x-full animate-shimmer" />
              </div>
            </div>
            
            {/* Enhanced Expanded Details with Animation */}
            {selectedMetric === metric.key && (
              <div className="mt-3 p-4 bg-slate-700/30 rounded-lg border border-gray-600/30 animate-slideInUp">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <TrophyIcon className="size-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-300 leading-relaxed">{t(`metrics.${metric.key}.description`)}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="text-gray-400 flex items-center gap-1">
                          <CurrencyDollarIcon className="size-3" />
                          {t('details.basedOn')}
                        </span>
                        <span className={`font-medium bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                          ⏱️ {t(`metrics.${metric.key}.timeline`)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Success Rate Indicator */}
                  <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-md">
                    <span className="text-xs text-gray-400">Success Rate</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-slate-600 rounded-full overflow-hidden">
                        <div className="w-full h-1 bg-gradient-to-r from-green-400 to-emerald-400 animate-pulse" />
                      </div>
                      <span className="text-xs font-bold text-green-400">98%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Enhanced Footer Stats */}
      <div className="mt-6 pt-4 border-t border-gray-600/30">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="group cursor-pointer hover:scale-105 transition-transform">
            <div className="text-2xl font-bold text-purple-400 group-hover:animate-pulse">200+</div>
            <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">{t('footer.projects')}</div>
            <div className="w-full h-0.5 bg-purple-400/30 rounded-full mt-1 group-hover:bg-purple-400 transition-colors" />
          </div>
          <div className="group cursor-pointer hover:scale-105 transition-transform">
            <div className="text-2xl font-bold text-cyan-400 group-hover:animate-pulse">24-48h</div>
            <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">{t('footer.response')}</div>
            <div className="w-full h-0.5 bg-cyan-400/30 rounded-full mt-1 group-hover:bg-cyan-400 transition-colors" />
          </div>
          <div className="group cursor-pointer hover:scale-105 transition-transform">
            <div className="text-2xl font-bold text-green-400 group-hover:animate-pulse">100%</div>
            <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">{t('footer.guarantee')}</div>
            <div className="w-full h-0.5 bg-green-400/30 rounded-full mt-1 group-hover:bg-green-400 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact ROI Badge for inline use
export function ROIBadge({ metric }: { metric: ROIMetric }) {
  return (
    <div className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur rounded-full px-3 py-1 border border-purple-500/30">
      <ArrowTrendingUpIcon className="size-4 text-green-400" />
      <span className={`text-sm font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
        {metric.value}
      </span>
    </div>
  )
}