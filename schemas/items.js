const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');
mongoose.connect(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@cluster0.f7nef.mongodb.net/${databaseConfig.database}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});

    //Check connect
var db = mongoose.connection;
db.on('error', () => {
  console.log('connection error');
});
db.once('open', () => {
  console.log('connected');
});

    //Create schema
const itemSchema = new mongoose.Schema({
  name: 'string',
  status: 'string',
  ordering: 'string'
});

const item = mongoose.model('item', itemSchema);

module.exports = item;