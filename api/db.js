import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

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
    if (Object.prototype.hasOwnProperty.call(row, key)) {
      const camelKey = toCamelCase(key);
      newRow[camelKey] = row[key];
    }
  }
  return newRow;
}

// Enhanced query function with logging and camelCase conversion
export const query = async (text, params) => {
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

export const testConnection = async () => {
  try {
    const result = await query('SELECT NOW() as current_time, version() as db_version');
    console.log("✅ Successfully connected to Neon PostgreSQL!");
    // result[0] is already camelCased by the query function
    console.log("   Current time:", result[0].currentTime); 
  } catch (err) {
    console.error("❌ Connection failed!", err.message);
  }
};
