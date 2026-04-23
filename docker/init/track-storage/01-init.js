db = db.getSiblingDB('track-storage');

db.createCollection('tracks');
db.createCollection('analytics');
db.createCollection('events');

db.createUser({
  user: 'ivan-storage',
  pwd: 'ivan-storage',
  roles: [
    { role: 'dbOwner', db: 'track-storage' }  
  ]
});