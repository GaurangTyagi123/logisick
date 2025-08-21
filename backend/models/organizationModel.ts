import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Organization must have a name'],
  },
  description: {
    type: String,
    default: 'Your organization',
  },
  type: String,
  admin: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

const organizationModel = mongoose.model('Organization', organizationSchema);
export default organizationModel;
