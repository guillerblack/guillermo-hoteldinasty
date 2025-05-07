const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function fixImagePaths() {
  const publicPath = path.join(__dirname, '..', 'public');
  const imgPath = path.join(publicPath, 'img');
  const roomsPath = path.join(imgPath, 'rooms');

  // Create directories if they don't exist
  [publicPath, imgPath, roomsPath].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });

  // Move existing images to correct location
  const sourceRoomPath = path.join(publicPath, 'room');
  if (fs.existsSync(sourceRoomPath)) {
    fs.readdirSync(sourceRoomPath).forEach(file => {
      const sourcePath = path.join(sourceRoomPath, file);
      const destPath = path.join(roomsPath, file);
      if (fs.existsSync(sourcePath)) {
        fs.renameSync(sourcePath, destPath);
        console.log(`Moved ${file} to /img/rooms/`);
      }
    });
  }

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'bd-hotelnew'
    });

    // Update database paths
    await connection.execute(`
      UPDATE rooms 
      SET image_url = CONCAT('/img/rooms/', SUBSTRING_INDEX(image_url, '/', -1))
      WHERE image_url LIKE '%public/room/%' 
         OR image_url LIKE '%/uploads/rooms/%'
    `);

    console.log('Database paths updated successfully');

    // Verify paths
    const [rows] = await connection.execute('SELECT id, image_url FROM rooms');
    console.log('\nVerifying image paths:');
    rows.forEach(row => {
      const imagePath = path.join(publicPath, row.image_url.replace(/^\//, ''));
      if (!fs.existsSync(imagePath)) {
        console.error(`⚠️ Missing image: ${row.image_url} for room ${row.id}`);
      } else {
        console.log(`✅ Found image: ${row.image_url} for room ${row.id}`);
      }
    });

    await connection.end();
  } catch (error) {
    console.error('Database error:', error);
  }
}

fixImagePaths().catch(console.error);