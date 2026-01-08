// db.cjs
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Helper function to convert snake_case to camelCase
function toCamelCase(str) {
  return str.replace(/([-_][a-z])/g, (group) => 
    group.toUpperCase().replace('-', '').replace('_', '')
  );
}

// Helper function to convert entire object from snake_case to camelCase
function convertRowToCamelCase(row) {
  if (!row || typeof row !== 'object') return row;
  
  const newRow = {};
  for (const key in row) {
    if (row.hasOwnProperty(key)) {
      const camelKey = toCamelCase(key);
      newRow[camelKey] = row[key];
    }
  }
  return newRow;
}

// Enhanced query function with logging and camelCase conversion
const query = async (text, params) => {
  const start = Date.now();
  const client = await pool.connect();
  
  try {
    console.log('📊 Executing query:', text.substring(0, 200) + (text.length > 200 ? '...' : ''));
    if (params && params.length > 0) {
      console.log('   Parameters:', params);
    }
    
    const result = await client.query(text, params);
    const duration = Date.now() - start;
    
    console.log(`   ✅ Query executed in ${duration}ms, returned ${result.rows.length} rows`);
    
    if (result.rows.length > 0) {
      const originalKeys = Object.keys(result.rows[0]);
      const convertedKeys = Object.keys(convertRowToCamelCase(result.rows[0]));
      
      if (JSON.stringify(originalKeys) !== JSON.stringify(convertedKeys)) {
        console.log('   🔄 Converted columns from:', originalKeys, 'to:', convertedKeys);
      }
      
      // Log first row for debugging
      if (result.rows.length === 1) {
        console.log('   📝 Single row result:', convertRowToCamelCase(result.rows[0]));
      } else if (result.rows.length > 0) {
        console.log('   📝 First row sample:', convertRowToCamelCase(result.rows[0]));
      }
    }
    
    // Convert all rows to camelCase
    return result.rows.map(row => convertRowToCamelCase(row));
    
  } catch (error) {
    console.error('❌ Query error:', {
      query: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
      params: params || [],
      error: error.message
    });
    throw error;
  } finally {
    client.release();
  }
};

const testConnection = async () => {
  try {
    const result = await query('SELECT NOW() as current_time, version() as db_version');
    console.log("✅ Successfully connected to Neon PostgreSQL!");
    console.log("   Current time:", result[0].currentTime);
    console.log("   PostgreSQL version:", result[0].dbVersion.split(' ')[1]);
  } catch (err) {
    console.error("❌ Connection failed!", err.message);
  }
};

// Export the enhanced query function
module.exports = { query, testConnection };
