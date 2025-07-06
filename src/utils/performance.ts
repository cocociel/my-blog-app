// パフォーマンス測定ユーティリティ
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now()
  fn()
  const end = performance.now()
  console.log(`${name}: ${end - start}ms`)
}

// 画像最適化ユーティリティ
export const getOptimizedImageUrl = (url: string, width?: number, height?: number, quality = 80) => {
  // Pexelsの画像URLを最適化
  if (url.includes('pexels.com')) {
    const baseUrl = url.split('?')[0]
    const params = new URLSearchParams()
    
    if (width) params.append('w', width.toString())
    if (height) params.append('h', height.toString())
    params.append('auto', 'compress')
    params.append('cs', 'tinysrgb')
    params.append('dpr', '2')
    
    return `${baseUrl}?${params.toString()}`
  }
  
  return url
}

// 遅延実行ユーティリティ
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// スロットリングユーティリティ
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// バンドルサイズ分析用
export const analyzeBundle = () => {
  if (process.env.NODE_ENV === 'development') {
    import('webpack-bundle-analyzer').then(({ BundleAnalyzerPlugin }) => {
      console.log('Bundle analyzer available')
    })
  }
}