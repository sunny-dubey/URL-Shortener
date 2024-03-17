import express, {Router} from 'express'
import urlController from '../controller/urlController'

const router: Router = express.Router()

router.post('/api/shorten', urlController.shortenUrl)

router.get('/:shortUrl', urlController.getUrl)

export default router