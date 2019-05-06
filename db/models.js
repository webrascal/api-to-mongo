import mongoose from "mongoose";
const Schema = mongoose.Schema;

const GenericSchema = new Schema({
  name: {
    type: String,
    required: "You must provide a name for this data"
  },
  created_at: {
    type: Number
  },
  data: {
    type: Object,
    required: "You must provide some data for this entry"
  }
});

export default mongoose.model("Generic", GenericSchema);
