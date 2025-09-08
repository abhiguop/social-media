const { connect } = require("mongoose")
const app = require("./app")
const { connectDatabase } = require("./config/database")
connectDatabase();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});