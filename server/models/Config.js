import mongoose from "mongoose";

const ConfigSchema = new mongoose.Schema({
  firstRun: {
    type: Boolean,
    default: true,
  },
});

const Config = mongoose.model("Config", ConfigSchema);
export default Config;
