const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function fixImagePaths() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'bd-hotelnew'
    });

    // Obtener todas las habitaciones
    const [rooms] = await connection.execute('SELECT id, name, image_url FROM rooms');
    
    console.log('=== CORRECCIÓN DE RUTAS DE IMÁGENES ===');
    console.log(`Total de habitaciones: ${rooms.length}`);
    
    const publicPath = path.join(__dirname, '..', 'public');
    
    let fixedPaths = 0;
    
    for (const room of rooms) {
      let imageUrl = room.image_url || '';
      
      // Normalizar la ruta para asegurar que comience con /
      if (imageUrl && !imageUrl.startsWith('/')) {
        imageUrl = '/' + imageUrl;
      }
      
      // Verificar si la ruta es correcta (debe comenzar con /img/rooms o /uploads/rooms)
      const isValidPath = imageUrl.startsWith('/img/rooms/') || imageUrl.startsWith('/uploads/rooms/');
      
      if (!isValidPath && imageUrl) {
        // Extraer el nombre del archivo
        const filename = path.basename(imageUrl);
        
        // Crear una nueva ruta en /img/rooms/
        const newPath = `/img/rooms/${filename}`;
        
        // Verificar si existe el archivo en la nueva ubicación
        const fullPath = path.join(publicPath, newPath.substring(1));
        const fullDir = path.dirname(fullPath);
        
        if (!fs.existsSync(fullDir)) {
          fs.mkdirSync(fullDir, { recursive: true });
          console.log(`Creado directorio: ${fullDir}`);
        }
        
        // Buscar el archivo en diferentes ubicaciones
        const possibleLocations = [
          path.join(publicPath, imageUrl.substring(1)),
          path.join(publicPath, 'uploads/rooms', filename),
          path.join(publicPath, 'img/rooms', filename)
        ];
        
        let sourceFile = null;
        
        for (const loc of possibleLocations) {
          if (fs.existsSync(loc)) {
            sourceFile = loc;
            break;
          }
        }
        
        if (sourceFile) {
          // Copiar el archivo a la nueva ubicación si no existe
          if (!fs.existsSync(fullPath)) {
            fs.copyFileSync(sourceFile, fullPath);
            console.log(`Copiado: ${sourceFile} -> ${fullPath}`);
          }
          
          // Actualizar la ruta en la base de datos
          await connection.execute(
            'UPDATE rooms SET image_url = ? WHERE id = ?',
            [newPath, room.id]
          );
          
          console.log(`✅ Actualizada ruta para habitación ${room.id}: ${imageUrl} -> ${newPath}`);
          fixedPaths++;
        } else {
          console.log(`❌ No se encontró imagen para habitación ${room.id} con ruta ${imageUrl}`);
        }
      } else {
        // Verificar si el archivo existe en la ruta actual
        const fullPath = path.join(publicPath, imageUrl.substring(1));
        
        if (!fs.existsSync(fullPath)) {
          console.log(`❌ Imagen no encontrada en ruta actual: ${fullPath}`);
          
          // Buscar en ubicaciones alternativas
          const filename = path.basename(imageUrl);
          const alternativePath = path.join(publicPath, 'uploads/rooms', filename);
          
          if (fs.existsSync(alternativePath)) {
            // Asegurar que el directorio destino existe
            const targetDir = path.dirname(fullPath);
            if (!fs.existsSync(targetDir)) {
              fs.mkdirSync(targetDir, { recursive: true });
            }
            
            // Copiar el archivo
            fs.copyFileSync(alternativePath, fullPath);
            console.log(`✅ Copiada imagen de ubicación alternativa: ${alternativePath} -> ${fullPath}`);
          }
        } else {
          console.log(`✅ Imagen encontrada en ruta correcta: ${fullPath}`);
        }
      }
    }
    
    console.log('\n=== RESUMEN ===');
    console.log(`Total de habitaciones: ${rooms.length}`);
    console.log(`Rutas corregidas: ${fixedPaths}`);
    
    await connection.end();
    console.log('Proceso completado.');
  } catch (error) {
    console.error('Error:', error);
  }
}

fixImagePaths().catch(console.error);