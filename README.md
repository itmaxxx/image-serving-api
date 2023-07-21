# Image Servicing and Formatting API

Welcome to the Image Servicing and Formatting API repository. This tool allows you to create your own image hosting service with a converter and formatter.

## Installation

To get started, follow these steps:

1. Ensure you have Docker installed and running on your system.
2. Clone this repository using Git.
3. Create a `.env` file with the necessary environment variables.
4. Run `docker-compose up` to start the service.

## Available Options

You can use the following options to customize the output of your images:

1. `quality: q_[1-100]`: Specifies the output image quality (1 to 100).
2. `width: w_[>1]`: Specifies the output image width (greater than 1).
3. `height: h_[>1]`: Specifies the output image height (greater than 1).
4. `resize: r_[cover|contain|fill|inside|outside]`: Specifies the output image resize type (default value: `cover`).

### How to Specify Image Options

After uploading an image, you will receive a URL that looks like this:
`http://localhost:3000/uploads/6188f92dde5947189ec3205a.jpg`

To apply multiple output image options, separate them with commas in the URL:
1. Example: Resize the image to 250x250 pixels and fill all space:
   `http://localhost:3000/uploads/r_fill,w_250,h_250/6188f92dde5947189ec3205a.jpg`
2. Example: Request an image with a maximum size of 500 pixels, preserving the original aspect ratio, and with a quality of `50%`:
   `http://localhost:3000/uploads/r_inside,w_500,h_500,q_50/6188f92dde5947189ec3205a.jpg`

## Supported Image Types

We currently support the following image extensions:

1. `jpg`
2. `jpeg`
3. `png`
4. `webp`

When requesting an image, you can specify the desired image extension in the URL:
`http://localhost:3000/uploads/6188f92dde5947189ec3205a.<jpg|jpeg|png|webp>`

### Image Resizing Options

When providing both width and height options, the image can be adjusted using the following methods:

1. `cover` (default): Preserves the aspect ratio and ensures the image covers both provided dimensions by cropping/clipping to fit.
2. `contain`: Preserves the aspect ratio and fits the image within both provided dimensions using "letterboxing" where necessary.
3. `fill`: Ignores the aspect ratio of the input and stretches the image to fit both provided dimensions.
4. `inside`: Preserves the aspect ratio and resizes the image to be as large as possible while ensuring its dimensions are less than or equal to both specified values.
5. `outside`: Preserves the aspect ratio and resizes the image to be as small as possible while ensuring its dimensions are greater than or equal to both specified values.

### Possible Errors and Responses

When using the API, you may encounter the following errors and corresponding responses:

- `[POST] /upload`:
  - `StatusCode: 201, Message: Image uploaded`: The image was uploaded successfully, and the response will contain `{ fileId: 'uploaded_image_id', link: 'direct_link_to_uploaded_image' }`.
  - `StatusCode: 400, Message: Failed to upload image`: Occurs in case of any other errors that happen during the image upload process. Please check your logs for details.
  - `StatusCode: 401, Message: Not authorized`: Occurs when a secret key is required but not provided.
  - `StatusCode: 406, Message: File not passed`
  - `StatusCode: 415, Message: File mime type not supported`
  - `StatusCode: 415, Message: File extension not supported`
  - `StatusCode: 413, Message: Max image size exceeded`: Occurs when the uploaded image file size exceeds the `env.MAX_IMAGE_SIZE` property.

### Test Server Load

To test the server load, you can use the `autocannon` tool with the following command:
```
autocannon -c 100 -d 5 -p 10 http://localhost:3000/
```
Find `autocannon` here: [https://github.com/mcollina/autocannon](https://github.com/mcollina/autocannon)

### Why Use 'Sharp' as the Image Processing Library?

We chose to use the 'Sharp' image processing library due to its excellent performance and powerful features. You can learn more about its performance here: [https://sharp.pixelplumbing.com/performance](https://sharp.pixelplumbing.com/performance)

For detailed information about the 'Sharp' API, visit: [https://sharp.pixelplumbing.com/api-constructor](https://sharp.pixelplumbing.com/api-constructor)

By following these instructions, you can set up your own image hosting service with versatile image formatting options. Enjoy using the Image Servicing and Formatting API!
