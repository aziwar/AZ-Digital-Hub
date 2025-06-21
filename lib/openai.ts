import OpenAI from 'openai'

// Initialize OpenAI client with API key from environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Validate API connection and configuration
export async function validateOpenAIConnection(): Promise<boolean> {
  try {
    // Test API connection with minimal request
    const models = await openai.models.list()
    
    // Verify DALL-E 3 model availability
    const dalleModel = models.data.find(model => 
      model.id.includes('dall-e-3')
    )
    
    if (!dalleModel) {
      console.error('DALL-E 3 model not available')
      return false
    }
    
    console.log('✅ OpenAI API connection validated')
    console.log('✅ DALL-E 3 model available')
    return true
    
  } catch (error) {
    console.error('❌ OpenAI API validation failed:', error)
    return false
  }
}

// Generate professional headshot variations
export async function generateHeadshots(
  baseImagePath: string,
  count: number = 4
): Promise<string[]> {
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Professional corporate headshot of a Middle Eastern digital marketing expert, wearing business attire, clean studio lighting, high quality photography, LinkedIn-style professional portrait`,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
      response_format: 'url'
    })
    
    const urls = response.data.map(image => image.url).filter(Boolean) as string[]
    console.log(`✅ Generated ${urls.length} professional headshots`)
    return urls
    
  } catch (error) {
    console.error('❌ Headshot generation failed:', error)
    throw error
  }
}

// Generate brand logos with variations
export async function generateBrandLogos(
  brandName: string,
  count: number = 8
): Promise<string[]> {
  try {
    const logoUrls: string[] = []
    
    for (let i = 0; i < count; i++) {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: `Modern professional logo for "${brandName}" digital marketing agency, minimalist design, technology-focused, Kuwait/GCC market, corporate branding, vector-style illustration`,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url'
      })
      
      if (response.data[0]?.url) {
        logoUrls.push(response.data[0].url)
      }
    }
    
    console.log(`✅ Generated ${logoUrls.length} brand logo variations`)
    return logoUrls
    
  } catch (error) {
    console.error('❌ Brand logo generation failed:', error)
    throw error
  }
}

// Generate service graphics
export async function generateServiceGraphics(
  services: string[],
  count: number = 12
): Promise<Record<string, string[]>> {
  try {
    const serviceGraphics: Record<string, string[]> = {}
    
    for (const service of services) {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: `Professional icon illustration for ${service} service, modern flat design, business-focused, clean vector style, technology theme, corporate branding`,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url'
      })
      
      if (response.data[0]?.url) {
        serviceGraphics[service] = [response.data[0].url]
      }
    }
    
    console.log(`✅ Generated service graphics for ${Object.keys(serviceGraphics).length} services`)
    return serviceGraphics
    
  } catch (error) {
    console.error('❌ Service graphics generation failed:', error)
    throw error
  }
}

// Calculate generation costs
export function calculateGenerationCost(
  headshotCount: number = 4,
  logoCount: number = 8,
  serviceCount: number = 12
): number {
  // DALL-E 3 pricing: $0.04 per 1024x1024 image
  const costPerImage = 0.04
  const totalImages = headshotCount + logoCount + serviceCount
  const totalCost = totalImages * costPerImage
  
  console.log(`💰 Cost calculation:`)
  console.log(`   - Headshots: ${headshotCount} × $${costPerImage} = $${(headshotCount * costPerImage).toFixed(2)}`)
  console.log(`   - Logos: ${logoCount} × $${costPerImage} = $${(logoCount * costPerImage).toFixed(2)}`)
  console.log(`   - Service graphics: ${serviceCount} × $${costPerImage} = $${(serviceCount * costPerImage).toFixed(2)}`)
  console.log(`   - Total: $${totalCost.toFixed(2)}`)
  
  return totalCost
}

export { openai }
export default openai