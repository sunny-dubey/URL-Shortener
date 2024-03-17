import {Request, Response} from 'express'
import {generateRandomString}  from '../utils/urlShortener'
import Url from '../models/Url'
import { cacheUrl, getCachedUrl } from '../utils/cache';

const shortenUrl = async(req: Request, res: Response)=>{
  try{
    const {originalUrl} = req.body
    const existingUrl = await Url.findOne({originalUrl})
    if (existingUrl){
      return res.json(existingUrl)
    }
    const id = await Url.countDocuments()
    const shortUrl = generateRandomString(6)

    // cache the short URL and original URL
    cacheUrl(shortUrl, originalUrl)

    const url = new Url({originalUrl, shortUrl})
    const expireAfter = 24*60*60*5  // expire after 5 days
    const expireAt = new Date()
    expireAt.setSeconds(expireAt.getSeconds() +  expireAfter);
    url.expireAt = expireAt;

    await url.save();
    res.json(url)
  }catch(error){
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
};

const getUrl = async(req: Request, res: Response)=>{
  try{
    const {shortUrl} = req.params;
    // check if URL exist in cache
    const originalUrl = await getCachedUrl(shortUrl);
    
    if(originalUrl){
      return res.redirect(`https://${originalUrl}`)
    }
    
    // if not in cache, query from database
    const url = await Url.findOne({shortUrl})
    
    if (!url){
      return res.status(404).send('URL not found')
    }
    res.redirect(`https://${url.originalUrl}`)
  } catch(error){
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
};

export default {shortenUrl, getUrl}