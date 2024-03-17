import mongoose, {Schema, Document} from 'mongoose'

export interface UrlDocument extends Document{
  originalUrl: string,
  shortUrl: string,
  createdAt: Date,
  expireAt?: Date,
}

const urlSchema: Schema = new Schema({
  originalUrl: {
    type: String, required: true
  },
  shortUrl: {
    type: String, required: true, unique: true
  },
  createdAt: {
    type: Date, default: Date.now()
  },
  expireAt: {type: Date, default: Date.now},
});

const Url = mongoose.model<UrlDocument>('Url', urlSchema)

export default Url;