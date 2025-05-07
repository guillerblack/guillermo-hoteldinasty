const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function syncImages() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'bd-hotelnew'
    });

    // Obtener todas las habitaciones
    const [rooms] = await connection.execute('SELECT id, name, image_url FROM rooms');
    
    console.log('=== SINCRONIZACIÓN DE IMÁGENES ===');
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
    
    let copiedImages = 0;
    
    for (const room of rooms) {
      let imageUrl = room.image_url;
      
      // Eliminar la barra inicial si existe
      if (imageUrl.startsWith('/')) {
        imageUrl = imageUrl.substring(1);
      }
      
      const targetPath = path.join(publicPath, imageUrl);
      const filename = path.basename(imageUrl);
      
      // Si la imagen no existe en la ruta esperada pero existe en uploads
      if (!fs.existsSync(targetPath)) {
        const uploadPath = path.join(uploadsPath, filename);
        
        if (fs.existsSync(uploadPath)) {
          // Asegurarse de que el directorio de destino exista
          const targetDir = path.dirname(targetPath);
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
          
          // Copiar la imagen
          fs.copyFileSync(uploadPath, targetPath);
          console.log(`✅ Imagen copiada para habitación ${room.id}: ${uploadPath} -> ${targetPath}`);
          copiedImages++;
        } else {
          console.log(`❌ No se encontró imagen para habitación ${room.id} en ninguna ubicación`);
        }
      } else {
        console.log(`✅ Imagen ya existe para habitación ${room.id}: ${targetPath}`);
      }
    }
    
    console.log('\n=== RESUMEN ===');
    console.log(`Total de imágenes: ${rooms.length}`);
    console.log(`Imágenes copiadas: ${copiedImages}`);
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

syncImages().catch(console.error);