# Image servicing and formatting API

This repository will help you to create your own image hosting with converter and formatter.

## Installation

```
1. Make sure you have docker installed and running
2. Git clone this repository
3. Create .env with your environment variables
4. Run docker-compose up
```

### Test server load
autocannon -c 100 -d 5 -p 10 http://localhost:3000/

https://github.com/mcollina/autocannon

### Why used 'sharp' as image processing library?
https://sharp.pixelplumbing.com/performance

Sharp api docs https://sharp.pixelplumbing.com/api-constructor