const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function fixServiceImages() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'bd-hotelnew'
    });

    // Obtener todos los servicios
    const [services] = await connection.execute('SELECT id, name, image_url FROM services');
    
    console.log('=== CORRECCIÓN DE RUTAS DE IMÁGENES DE SERVICIOS ===');
    console.log(`Total de servicios: ${services.length}`);
    
    const publicPath = path.join(__dirname, '..', 'public');
    const imgPath = path.join(publicPath, 'img', 'service');
    
    // Verificar que las carpetas existan
    [publicPath, imgPath].forEach(dir => {
      if (!fs.existsSync(dir)) {
        console.log(`Creando directorio: ${dir}`);
        fs.mkdirSync(dir, { recursive: true });
      } else {
        console.log(`Directorio existente: ${dir}`);
      }
    });
    
    let fixedPaths = 0;
    
    for (const service of services) {
      let imageUrl = service.image_url || '';
      
      // Normalizar la ruta para asegurar que comience con /
      if (imageUrl && !imageUrl.startsWith('/')) {
        imageUrl = '/' + imageUrl;
      }
      
      // Verificar si la ruta es correcta (debe comenzar con /img/service)
      const isValidPath = imageUrl.startsWith('/img/service/');
      
      if (!isValidPath && imageUrl) {
        // Extraer el nombre del archivo
        const filename = path.basename(imageUrl);
        
        // Crear una nueva ruta en /img/service/
        const newPath = `/img/service/${filename}`;
        
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
          path.join(publicPath, 'img/service', filename),
          path.join(publicPath, 'uploads/service', filename)
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
            'UPDATE services SET image_url = ? WHERE id = ?',
            [newPath, service.id]
          );
          
          console.log(`✅ Actualizada ruta para servicio ${service.id}: ${imageUrl} -> ${newPath}`);
          fixedPaths++;
        } else {
          console.log(`❌ No se encontró imagen para servicio ${service.id} con ruta ${imageUrl}`);
        }
      } else {
        // Verificar si el archivo existe en la ruta actual
        const fullPath = path.join(publicPath, imageUrl.substring(1));
        
        if (!fs.existsSync(fullPath)) {
          console.log(`❌ Imagen no encontrada en ruta actual: ${fullPath}`);
        } else {
          console.log(`✅ Imagen encontrada en ruta correcta: ${fullPath}`);
        }
      }
    }
    
    console.log('\n=== RESUMEN ===');
    console.log(`Total de servicios: ${services.length}`);
    console.log(`Rutas corregidas: ${fixedPaths}`);
    
    await connection.end();
    console.log('Proceso completado.');
  } catch (error) {
    console.error('Error:', error);
  }
}

fixServiceImages().catch(console.error);