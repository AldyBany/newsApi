const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")

const app = express()

app.use(express.json())

const port = 8000
const articles = []

const newspapers =[
    {
        name: 'thetimes',
        address:'https://www.thetimes.co.uk/environment/climate-change',
        base:''
        
    },
    {
        name: 'theguardian',
        address:'https://www.theguardian.com/environment/climate-crisis',
        base:''
        
    },
    {
        name: 'telegraph',
        address:'https://www.telegraph.co.uk/climate-change',
        base:'https://www.telegraph.co.uk' 
    }
]


newspapers.forEach(newspaper=>{
    axios.get(newspaper.address)
         .then(response=>{
            const html = response.data
            const $ = cheerio.load(html)
            $('a:contains("climate")', html).each(function(){
                const title =  $(this).text()
                const url =  $(this).attr('href')
                articles.push({
                 title,url: newspaper.base + url,
                 source: newspaper.name
                })
             })
         }).catch((err)=>{
            console.log(err)
        })
})

app.get("/",(req, res)=>{
    res.end("Welcome to our news api")
})

app.get("/news",(req, res)=>{

    res.json(articles)
})


app.get("/news/:newspaperId",async(req, res)=>{
    const mynewspaper = req.params.newspaperId

    const  newspaperAddress = newspapers.filter(newspaper =>newspaper.name === mynewspaper)[0].address
    const  newspaperBase = newspapers.filter(newspaper =>newspaper.name === mynewspaper)[0].base

    axios.get(newspaperAddress).then((response)=>{
        const html = response.data
        const $ = cheerio.load(html)

        const article = []
        $('a:contains("climate")', html).each(function(){
            const title =  $(this).text()
            const url =  $(this).attr('href')
            article.push({
             title,url: newspaperBase + url,
             source: mynewspaper
             
            })
         })

         res.json(article)
    }).catch((err)=>console.log(err))
    
})

app.listen(port,()=>{
    console.log(`App is running on port ${port}`)
})