const { PrismaClient } = require('@prisma/client');
try {
  const p = new PrismaClient({ datasources: { db: { url: 'file:./dev.db' } } });
  console.log('Success with datasources');
} catch (e) {
  console.log('Fails with datasources:', e.message);
}

try {
  const p = new PrismaClient({ datasourceUrl: 'file:./dev.db' });
  console.log('Success with datasourceUrl');
} catch (e) {
  console.log('Fails with datasourceUrl:', e.message);
}
