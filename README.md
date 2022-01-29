# Image servicing and formatting API

This repository will help you to create your own image hosting with converter and formatter.

## Installation

```
1. Make sure you have docker installed and running
2. Git clone this repository
3. Create .env with your environment variables
4. Run docker-compose up
```

## Available options

1. ```quality: q_[1-100]```: Specify output image quality.
2. ```width: w_[>1]```: Specify output image width.
3. ```height: h_[>1]```: Specify output image height.
4. ```resize: r_[cover|contain|fill|inside|outside]```: Specify output image resize type, default value: ```cover```.

### How to specify image options

After uploading image you will get image url which looks like:
```http://localhost:3000/uploads/6188f92dde5947189ec3205a.jpg```

You can specify several output image options in url separating them with ```,```:
1. We need to resize image to 250x250 pixels and fill all space:
```http://localhost:3000/uploads/r_fill,w_250,h_250/6188f92dde5947189ec3205a.jpg```
2. We need image with max size of 500 pixels, preserving original image aspect ratio, image quality should be ```50%```
   ```http://localhost:3000/uploads/r_inside,w_500,h_500,q_50/6188f92dde5947189ec3205a.jpg```

## Supported image types

Currently, we support following image extensions:
1. ```jpg```
1. ```jpeg```
1. ```png```
1. ```webp```

When requesting image you can specify image extension, like this:
```http://localhost:3000/uploads/6188f92dde5947189ec3205a.<jpg|jpeg|png|webp>```

### Image resizing options

When both a width and height are provided, the possible methods by which the image should fit these are:

1. ```cover```: (default) Preserving aspect ratio, ensure the image covers both provided dimensions by cropping/clipping to fit.
2. ```contain```: Preserving aspect ratio, contain within both provided dimensions using "letterboxing" where necessary.
3. ```fill```: Ignore the aspect ratio of the input and stretch to both provided dimensions.
4. ```inside```: Preserving aspect ratio, resize the image to be as large as possible while ensuring its dimensions are less than or equal to both those specified.
5. ```outside```: Preserving aspect ratio, resize the image to be as small as possible while ensuring its dimensions are greater than or equal to both those specified.

### Possible errors and responses

#### [POST] /upload

- ```StatusCode: 201, Message: Image uploaded```: Image uploaded successfully, in response you will get ```{ fileId: 'uploaded_image_id', link: 'direct_link_to_uploaded_image' }```
- ```StatusCode: 400, Message: Failed to upload image```: Occurs in case of any other errors happened while trying to upload image, see your log
- ```StatusCode: 401, Message: Not authorized```: Occurs when secret key is required but not passed
- ```StatusCode: 406, Message: File not passed```
- ```StatusCode: 415, Message: File mime type not supported```
- ```StatusCode: 415, Message: File extension not supported```
- ```StatusCode: 413, Message: 'Max image size exceeded```: Occurs when uploaded image file size exceeds env.MAX_IMAGE_SIZE property

### Test server load
autocannon -c 100 -d 5 -p 10 http://localhost:3000/

https://github.com/mcollina/autocannon

### Why used 'sharp' as image processing library?
https://sharp.pixelplumbing.com/performance

Sharp api docs https://sharp.pixelplumbing.com/api-constructor