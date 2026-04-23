db = db.getSiblingDB('track-storage');

db.createCollection('detected-persons');

db.createUser({
  user: 'ivan-storage',
  pwd: 'ivan-storage',
  roles: [
    { role: 'dbOwner', db: 'track-storage' }  
  ]
});