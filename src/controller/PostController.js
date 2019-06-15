const Post = require('../model/Post');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
module.exports = {

   async index(req, res) {
    const posts = await Post.find().sort('-createdAt')
    return res.json(posts)
   },


    async store(req, res) {
      console.log(req.file);
      
        const { author, place, descriptions, hashtags } = req.body
        const { filename: image } = req.file
        const [name] = image.split('.')
        console.log(name);
        
        const filename =`${name}.jpg`;
        
        await sharp(req.file.path)
        .resize(500)
        .jpeg({quality: 70})
        .toFile(
            path.resolve(req.file.destination, 'resized', filename)
        )
        fs.unlinkSync(req.file.path)
        const post = await Post.create({
            author,
            place,
            descriptions,
            hashtags,
            image:filename,
        })
        req.io.emit('post', post)
        return res.json(post)

    }
}
