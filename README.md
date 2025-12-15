# Bria Ads Generation API

This repository documents how to use Bria's Ads Generation API to generate multiple ad scenes in different sizes and resolutions, all sharing the same branding, style, and messaging.

## Overview

Bria's Ads Generation API allows you to:
- Generate multiple ad scenes from templates
- Maintain consistent branding using brands and templates
- Use smart images to embed products or presenters into dynamic backgrounds

## Public Assets

- **Public Template IDs**:
  - `1062`: Template that requires a brand ID
  - `1061`: Brand-independent template (does not require a brand ID)

- **Public Brand IDs**: `167`, `166`, `122`, `121`, `120`
  - These can be used with compatible templates like `1062`.
  - Public templates and brands can only be used with each other and cannot be mixed with private assets.

## Endpoint

`POST /ads/generate`

### Headers

- `api_token` (string, required): API token associated with the organization.

### Request Body (application/json)

```jsonc
{
  "content_moderation": true,
  "template_id": "1062",
  "brand_id": "167",
  "smart_image": {
    "input_image_url": "https://example.com/product.png",
    "scene": {
      "operation": "lifestyle_shot_by_text",
      "input": "Modern living room with soft natural light"
    }
  },
  "elements": [
    {
      "layer_type": "text",
      "content_type": "Heading #1",
      "content": "Summer Sale - Up to 50% Off",
      "id": "headline_1"
    },
    {
      "layer_type": "text",
      "content_type": "Body #1",
      "content": "Limited time offer on all living room furniture.",
      "id": "body_1"
    },
    {
      "layer_type": "image",
      "content_type": "Image #1",
      "content": "https://example.com/logo.png",
      "id": "brand_logo"
    }
  ]
}
```

#### Field Descriptions

- `content_moderation` (boolean):
  - When enabled, applies content moderation to both input visuals and generated outputs.
  - For input images: processing stops at the first image that fails moderation and returns a 422 error with details.
  - For generated ads: failed ads are replaced with zero-byte files at their placeholder URLs; successful ads remain at their URLs.

- `template_id` (string): ID of the template to use for generating ad scenes.

- `brand_id` (string): ID of the brand to apply across all generated ads. Required unless using a brand-independent template (e.g. `1061`).

- `smart_image` (object): Configuration for embedding an input image and defining its background.
  - `input_image_url` (string): URL of the image to embed.
  - `scene` (object):
    - `operation` (string): One of `"expand_image"`, `"lifestyle_shot_by_text"`.
    - `input` (string): Background prompt or hex color. Ignored when `operation` is `"expand_image"`.

- `elements` (array): List of text or image elements.
  - `layer_type` (string): `"text"` or `"image"`.
  - `content_type` (string): Logical role of the content, e.g. `"Heading #1"`, `"Body #1"`, `"Image #1"`.
  - `content` (string): Text content or image URL. Use an empty string to ignore the element.
  - `id` (string): Unique identifier for the element.

### Response 200 (application/json)

```jsonc
{
  "result": [
    {
      "id": "scene_id_1",
      "name": "scene_name",
      "url": "IMAGE_URL",
      "resolution": {
        "width": 1920,
        "height": 1080
      }
    }
  ]
}
```

- `result` (array): List of generated scenes.
  - `id` (string): Unique ID for the generated scene.
  - `name` (string): Scene name from the template.
  - `url` (string): URL to download the generated PNG image.
  - `resolution` (object):
    - `width` (integer)
    - `height` (integer)

### Error Responses

- `400`: Invalid request payload or parameters.
- `401`: Authentication error (invalid or missing `api_token`).
- `500`: Internal server error.

## Notes

- Responses are asynchronous: the API immediately returns placeholder URLs while ads are generated in the background. Use polling to check when the images are ready.
- Templates can be created and managed in Bria's Ads Editor, then referenced here by `template_id`.
