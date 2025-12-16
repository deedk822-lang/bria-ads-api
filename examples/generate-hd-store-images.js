const axios = require("axios");
const fs = require("fs");
const path = require("path");

/**
 * Generate HD quality images for your e-commerce store
 * using Bria's Ads Generation API
 */

async function generateHDStoreImages(config) {
  const apiToken = process.env.BRIA_API_TOKEN;

  if (!apiToken) {
    throw new Error("BRIA_API_TOKEN environment variable is required");
  }

  const payload = {
    content_moderation: true,
    template_id: config.templateId || "1062",
    brand_id: config.brandId || "167",
    smart_image: {
      input_image_url: config.productImageUrl,
      scene: {
        operation: "lifestyle_shot_by_text",
        input: config.backgroundPrompt || "Modern minimalist setting, natural light, professional photography, 4K quality"
      }
    },
    elements: [
      {
        layer_type: "text",
        content_type: "Heading #1",
        content: config.heading || "Premium Collection",
        id: "main_heading"
      },
      {
        layer_type: "text",
        content_type: "Body #1",
        content: config.description || "Discover exceptional quality",
        id: "description"
      },
      {
        layer_type: "image",
        content_type: "Image #1",
        content: config.logoUrl || "",
        id: "brand_logo"
      }
    ]
  };

  try {
    console.log("Generating HD store images...");
    const response = await axios.post(
      "https://api.bria.ai/ads/generate",
      payload,
      { headers: { api_token: apiToken } }
    );

    console.log("\nGeneration initiated successfully!");
    console.log("\nScenes to be generated:");
    response.data.result.forEach(scene => {
      console.log(`  - ${scene.name}: ${scene.resolution.width}x${scene.resolution.height}px`);
      console.log(`    URL: ${scene.url}`);
    });

    return response.data.result;
  } catch (error) {
    console.error("Error generating images:", error.response?.data || error.message);
    throw error;
  }
}

async function pollAndDownloadImages(scenes, outputDir = "./hd-store-images") {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const maxAttempts = 30;
  const pollInterval = 2000; // 2 seconds

  console.log("\nDownloading images (this may take a minute)...");

  for (const scene of scenes) {
    let attempt = 0;
    let downloaded = false;

    process.stdout.write(`  ${scene.name}: waiting...`);

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
          const sizeMB = (response.data.byteLength / 1024 / 1024).toFixed(2);
          process.stdout.write(`\r  ${scene.name}: ✓ Downloaded (${sizeMB} MB)\n`);
          downloaded = true;
        } else {
          attempt++;
          await new Promise(resolve => setTimeout(resolve, pollInterval));
          process.stdout.write(`\r  ${scene.name}: waiting... (${attempt}/${maxAttempts})`);
        }
      } catch (error) {
        attempt++;
        if (attempt >= maxAttempts) {
          process.stdout.write(`\r  ${scene.name}: ✗ Failed after ${maxAttempts} attempts\n`);
          console.error(`    Error: ${error.message}`);
        } else {
          await new Promise(resolve => setTimeout(resolve, pollInterval));
        }
      }
    }
  }

  console.log(`\n✓ All images saved to: ${path.resolve(outputDir)}`);
}

// Example usage
if (require.main === module) {
  const config = {
    templateId: "1062",
    brandId: "167",
    productImageUrl: "https://example.com/product-cutout.png",
    backgroundPrompt: "Luxurious modern living room, natural daylight, minimalist design, professional photography, 4K quality",
    heading: "Premium Furniture Collection",
    description: "Transform your space with timeless elegance",
    logoUrl: "https://example.com/store-logo.png"
  };

  generateHDStoreImages(config)
    .then(scenes => pollAndDownloadImages(scenes, "./hd-store-images"))
    .then(() => {
      console.log("\n✓ HD store images generation complete!");
    })
    .catch(error => {
      console.error("\n✗ Generation failed:", error.message);
      process.exit(1);
    });
}

module.exports = { generateHDStoreImages, pollAndDownloadImages };
