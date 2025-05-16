const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Optimize all images in public/images
const optimizeImages = async () => {
    try {
        console.log('🔄 Optimizing images...');
        
        const imagesDir = path.join(process.cwd(), 'public', 'images');
        const outputDir = path.join(process.cwd(), 'public', 'optimized-images');

        // Create output directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Get all image files
        const imageFiles = fs.readdirSync(imagesDir).filter(file => {
            return /\.(jpe?g|png|gif|webp|avif)$/i.test(file);
        });

        // Optimize each image
        for (const file of imageFiles) {
            const inputPath = path.join(imagesDir, file);
            const outputPath = path.join(outputDir, file);
            const ext = path.extname(file).toLowerCase();

            console.log(`Optimizing: ${file}`);
            
            // Process based on image type
            if (ext === '.jpg' || ext === '.jpeg') {
                await sharp(inputPath)
                    .resize(800, null, { withoutEnlargement: true })
                    .jpeg({ quality: 80, progressive: true })
                    .toFile(outputPath);
            } else if (ext === '.png') {
                await sharp(inputPath)
                    .resize(800, null, { withoutEnlargement: true })
                    .png({ compressionLevel: 9, progressive: true })
                    .toFile(outputPath);
            } else if (ext === '.webp') {
                await sharp(inputPath)
                    .resize(800, null, { withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toFile(outputPath);
            } else {
                await sharp(inputPath)
                    .resize(800, null, { withoutEnlargement: true })
                    .toFile(outputPath);
            }
        }

        console.log('✅ Image optimization completed!');
    } catch (error) {
        console.error('⚠️ Error optimizing images:', error.message);
    }
};

// Run the function
optimizeImages();