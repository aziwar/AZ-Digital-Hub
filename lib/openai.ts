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
      return false
    }

    return true

  } catch {
    return false
  }
}

// Generate professional headshot variations
export async function generateHeadshots(
  _baseImagePath: string,
  _count: number = 4
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

    const urls = response.data?.map(image => image.url).filter(Boolean) as string[] || []
    return urls

  } catch (error) {
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

      if (response.data?.[0]?.url) {
        logoUrls.push(response.data[0].url)
      }
    }

    return logoUrls

  } catch (error) {
    throw error
  }
}

// Generate service graphics
export async function generateServiceGraphics(
  services: string[],
  _count: number = 12
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

      if (response.data?.[0]?.url) {
        serviceGraphics[service] = [response.data[0].url]
      }
    }

    return serviceGraphics

  } catch (error) {
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

  return totalCost
}

export { openai }
export default openai