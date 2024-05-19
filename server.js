const mongoose = require('mongoose');
const app = require('./app');

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log(`Connected Successfully ${con.connections}`);
  })
  .catch((err) => {
    console.log(`Error in connect db ${err}`);
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening to port ${port}`);
});
