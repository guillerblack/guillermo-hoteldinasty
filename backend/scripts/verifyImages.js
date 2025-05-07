const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function verifyImages() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'bd-hotelnew'
    });

    // Obtener todas las habitaciones
    const [rooms] = await connection.execute('SELECT id, name, image_url FROM rooms');
    
    console.log('=== VERIFICACIÓN DE IMÁGENES ===');
    console.log(`Total de habitaciones: ${rooms.length}`);
    
    const publicPath = path.join(__dirname, '..', 'public');
    const imgPath = path.join(publicPath, 'img', 'rooms');
    const uploadsPath = path.join(publicPath, 'uploads', 'rooms');
    
    // Verificar que las carpetas existan
    [publicPath, imgPath, uploadsPath].forEach(dir => {
      if (!fs.existsSync(dir)) {
        console.log(`Creando directorio: ${dir}`);
        fs.mkdirSync(dir, { recursive: true });
      } else {
        console.log(`Directorio existente: ${dir}`);
      }
    });
    
    // Verificar cada imagen
    let missingImages = 0;
    let foundImages = 0;
    let correctedPaths = 0;
    
    for (const room of rooms) {
      let imagePath;
      let imageUrl = room.image_url;
      
      // Eliminar la barra inicial si existe
      if (imageUrl.startsWith('/')) {
        imageUrl = imageUrl.substring(1);
      }
      
      imagePath = path.join(publicPath, imageUrl);
      
      if (fs.existsSync(imagePath)) {
        console.log(`✅ Imagen encontrada para habitación ${room.id} (${room.name}): ${imagePath}`);
        foundImages++;
      } else {
        console.log(`❌ Imagen NO encontrada para habitación ${room.id} (${room.name}): ${imagePath}`);
        missingImages++;
        
        // Intentar buscar la imagen en otras ubicaciones
        const filename = path.basename(imageUrl);
        const alternativePaths = [
          path.join(publicPath, 'uploads', 'rooms', filename),
          path.join(publicPath, 'img', 'rooms', filename),
          path.join(publicPath, 'room', filename)
        ];
        
        let found = false;
        let foundPath = '';
        
        for (const altPath of alternativePaths) {
          if (fs.existsSync(altPath)) {
            console.log(`  🔍 Imagen encontrada en ubicación alternativa: ${altPath}`);
            found = true;
            foundPath = altPath;
            
            // Corregir la ruta en la base de datos
            const relativePath = altPath.replace(publicPath, '').replace(/\\/g, '/');
            const dbPath = relativePath.startsWith('/') ? relativePath : '/' + relativePath;
            
            if (dbPath !== room.image_url) {
              try {
                await connection.execute(
                  'UPDATE rooms SET image_url = ? WHERE id = ?',
                  [dbPath, room.id]
                );
                console.log(`  ✅ Ruta corregida en la base de datos: ${dbPath}`);
                correctedPaths++;
              } catch (updateError) {
                console.error(`  ❌ Error al actualizar la ruta en la base de datos:`, updateError);
              }
            }
            
            break;
          }
        }
        
        if (!found) {
          console.log(`  ⚠️ No se encontró la imagen en ninguna ubicación alternativa`);
          
          // Si es la habitación 20 (FDAAAA), intentar usar default-room.jpg
          if (room.id === 20) {
            const defaultImagePath = path.join(publicPath, 'img', 'rooms', 'default-room.jpg');
            
            // Verificar si existe la imagen por defecto
            if (!fs.existsSync(defaultImagePath)) {
              // Crear una copia de alguna imagen existente como default-room.jpg
              const existingImages = fs.readdirSync(uploadsPath);
              if (existingImages.length > 0) {
                const sourcePath = path.join(uploadsPath, existingImages[0]);
                
                // Asegurarse de que exista el directorio de destino
                if (!fs.existsSync(imgPath)) {
                  fs.mkdirSync(imgPath, { recursive: true });
                }
                
                fs.copyFileSync(sourcePath, defaultImagePath);
                console.log(`  ✅ Creada imagen por defecto: ${defaultImagePath}`);
                
                // Actualizar la ruta en la base de datos
                await connection.execute(
                  'UPDATE rooms SET image_url = ? WHERE id = ?',
                  ['/img/rooms/default-room.jpg', room.id]
                );
                console.log(`  ✅ Ruta actualizada para habitación ${room.id}`);
                correctedPaths++;
              }
            }
          }
        }
      }
    }
    
    console.log('\n=== RESUMEN ===');
    console.log(`Total de imágenes: ${rooms.length}`);
    console.log(`Imágenes encontradas: ${foundImages}`);
    console.log(`Imágenes no encontradas: ${missingImages}`);
    console.log(`Rutas corregidas en la base de datos: ${correctedPaths}`);
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

verifyImages().catch(console.error);