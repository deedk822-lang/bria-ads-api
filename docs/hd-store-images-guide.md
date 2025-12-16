# HD Quality Store Images Generation Guide

This guide shows you how to generate high-definition, professional-quality images for your e-commerce store using the Bria Ads Generation API.

## Overview

Bria's API can generate HD images in various resolutions perfect for:
- Product listings
- Banner ads
- Social media posts
- Email campaigns
- Store hero sections
- Product detail pages

## Common HD Resolutions

| Use Case | Resolution | Aspect Ratio |
|----------|-----------|-------------|
| Full HD Banner | 1920x1080 | 16:9 |
| Product Hero | 1200x1200 | 1:1 |
| Social Media Post | 1080x1080 | 1:1 |
| Wide Banner | 1920x600 | 3.2:1 |
| Instagram Story | 1080x1920 | 9:16 |
| Facebook Cover | 1640x924 | 16:9 |

## Generating HD Store Images

### Using Smart Image Feature

The Smart Image feature is ideal for creating product lifestyle shots with HD backgrounds:

```javascript
const axios = require("axios");

async function generateHDStoreImages() {
  const apiToken = process.env.BRIA_API_TOKEN;

  const payload = {
    content_moderation: true,
    template_id: "1062",
    brand_id: "167",
    smart_image: {
      input_image_url: "https://your-store.com/product-cutout.png",
      scene: {
        operation: "lifestyle_shot_by_text",
        input: "Luxurious modern kitchen with marble countertops, natural daylight, professional photography, 4K quality"
      }
    },
    elements: [
      {
        layer_type: "text",
        content_type: "Heading #1",
        content: "Premium Kitchen Collection",
        id: "main_heading"
      },
      {
        layer_type: "text",
        content_type: "Body #1",
        content: "Transform your cooking space with designer elegance",
        id: "subheading"
      }
    ]
  };

  try {
    const response = await axios.post(
      "https://api.bria.ai/ads/generate",
      payload,
      { headers: { api_token: apiToken } }
    );

    // Poll for completed images
    console.log("Generated HD images:");
    response.data.result.forEach(scene => {
      console.log(`${scene.name}: ${scene.resolution.width}x${scene.resolution.height}`);
      console.log(`Download: ${scene.url}`);
    });

    return response.data.result;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = { generateHDStoreImages };
```

### Background Generation Tips for HD Quality

When using the `lifestyle_shot_by_text` operation, use descriptive prompts:

**Good prompts for HD quality:**
- "Modern minimalist living room, soft natural lighting, 4K photography, high detail"
- "Professional product photography studio, white backdrop, studio lighting, ultra HD"
- "Elegant outdoor patio setting, golden hour lighting, professional photography"
- "Contemporary office space, floor-to-ceiling windows, natural light, high resolution"

**Avoid vague prompts:**
- "Nice room" ❌
- "Background" ❌
- "Store" ❌

## Batch Generation for Multiple Products

```javascript
const axios = require("axios");

async function generateMultipleHDImages(products) {
  const apiToken = process.env.BRIA_API_TOKEN;
  const results = [];

  for (const product of products) {
    const payload = {
      content_moderation: true,
      template_id: "1062",
      brand_id: "167",
      smart_image: {
        input_image_url: product.imageUrl,
        scene: {
          operation: "lifestyle_shot_by_text",
          input: product.backgroundPrompt
        }
      },
      elements: [
        {
          layer_type: "text",
          content_type: "Heading #1",
          content: product.title,
          id: "product_title"
        },
        {
          layer_type: "text",
          content_type: "Body #1",
          content: product.description,
          id: "product_desc"
        },
        {
          layer_type: "image",
          content_type: "Image #1",
          content: product.logoUrl,
          id: "brand_logo"
        }
      ]
    };

    try {
      const response = await axios.post(
        "https://api.bria.ai/ads/generate",
        payload,
        { headers: { api_token: apiToken } }
      );

      results.push({
        productId: product.id,
        scenes: response.data.result
      });

      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed for product ${product.id}:`, error.message);
    }
  }

  return results;
}

// Example usage
const products = [
  {
    id: "prod_001",
    imageUrl: "https://store.com/products/chair-cutout.png",
    backgroundPrompt: "Modern living room with natural light, scandinavian design, 4K",
    title: "Nordic Comfort Chair",
    description: "Ergonomic design meets timeless style",
    logoUrl: "https://store.com/logo.png"
  },
  {
    id: "prod_002",
    imageUrl: "https://store.com/products/lamp-cutout.png",
    backgroundPrompt: "Contemporary bedroom, warm ambient lighting, professional photography",
    title: "Ambient Glow Lamp",
    description: "Create the perfect atmosphere",
    logoUrl: "https://store.com/logo.png"
  }
];

// generateMultipleHDImages(products);
```

## Polling for Completed Images

Since the API returns URLs immediately but generates images asynchronously, implement polling:

```javascript
const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function pollAndDownloadHDImages(sceneUrls, outputDir = "./hd-images") {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const maxAttempts = 30;
  const pollInterval = 2000; // 2 seconds

  for (const scene of sceneUrls) {
    let attempt = 0;
    let downloaded = false;

    console.log(`Waiting for ${scene.name}...`);

    while (attempt < maxAttempts && !downloaded) {
      try {
        const response = await axios.get(scene.url, {
          responseType: "arraybuffer",
          validateStatus: status => status === 200
        });

        // Check if file has content (not zero-byte placeholder)
        if (response.data.byteLength > 1000) {
          const filename = `${scene.name}_${scene.resolution.width}x${scene.resolution.height}.png`;
          const filepath = path.join(outputDir, filename);
          fs.writeFileSync(filepath, response.data);
          console.log(`✓ Downloaded: ${filename} (${(response.data.byteLength / 1024 / 1024).toFixed(2)} MB)`);
          downloaded = true;
        } else {
          attempt++;
          await new Promise(resolve => setTimeout(resolve, pollInterval));
        }
      } catch (error) {
        attempt++;
        if (attempt >= maxAttempts) {
          console.error(`✗ Failed to download ${scene.name} after ${maxAttempts} attempts`);
        } else {
          await new Promise(resolve => setTimeout(resolve, pollInterval));
        }
      }
    }
  }
}

module.exports = { pollAndDownloadHDImages };
```

## Integration with Mailchimp Open Commerce

You can integrate HD image generation with your Open Commerce store:

```javascript
const { generateHDStoreImages } = require("./generate-hd-images");
const { pollAndDownloadHDImages } = require("./poll-images");

async function updateProductImages(productId, productData) {
  // 1. Generate HD images using Bria API
  const scenes = await generateHDStoreImages();

  // 2. Poll and download completed images
  await pollAndDownloadHDImages(scenes, `./products/${productId}`);

  // 3. Upload to your CDN or storage
  // const cdnUrls = await uploadToCDN(`./products/${productId}`);

  // 4. Update product in Open Commerce via GraphQL
  // const mutation = `
  //   mutation UpdateProduct {
  //     updateProduct(input: {
  //       productId: "${productId}"
  //       product: { mediaUrls: ${JSON.stringify(cdnUrls)} }
  //     }) {
  //       product { _id }
  //     }
  //   }
  // `;

  return scenes;
}
```

## Best Practices

### Image Quality
- Always use high-resolution input images (minimum 1000x1000px)
- Use product cutouts with transparent backgrounds for best results
- Specify "4K", "HD", or "high resolution" in background prompts

### Performance
- Implement caching to avoid regenerating the same images
- Generate images during off-peak hours for large batches
- Use async/await patterns to handle multiple products efficiently

### Content Moderation
- Enable `content_moderation: true` to ensure brand safety
- Failed moderation returns 422 errors with details
- Generated images that fail moderation are replaced with zero-byte files

### Storage
- Download and store generated images on your own CDN
- Don't rely on Bria URLs as permanent storage
- Organize images by product ID, variant, and resolution

## Example: Complete Workflow

See [examples/generate-hd-store-images.js](../examples/generate-hd-store-images.js) for a complete working example.

## Resources

- [Bria API Documentation](../README.md)
- [Mailchimp Open Commerce Setup](./mailchimp-open-commerce-quickstart.md)
- [Creating Products in Open Commerce](https://mailchimp.com/developer/open-commerce/docs/creating-organizing-products/)
