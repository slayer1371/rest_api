const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikidb", {useNewUrlParser: true});

const articleSchema = {
    title: String,  
    content: String
};

const Article = mongoose.model("Article", articleSchema);

async function getarticles() {
    const articles = await Article.find({});
    return articles;
}

///////////////Requests targeting all articles////////////////////
app.route("/articles")
.get(function(req, res){
    getarticles().then(function(foundArticles){
        res.send(foundArticles);
    });
})
.post(function(req, res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(!err)
            res.send("Success");
        else
            res.send(err);
    });
});
/*.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err)
            res.send("All articles deleted successfully.")
        else
            res.send(err);
    });
})*/

///////////////Requests targeting a specific article////////////////////



app.route("/articles/:articleTitle")
.get(function(req, res){
    async function getarticle() {
        const article = await Article.findOne({title: req.params.articleTitle});
        return article;
    }
    getarticle().then(function(foundArticle){
        res.send(foundArticle);
    })
})
//updating a specific article on the basis of article title
.put(async function(req, res){
    await Article.replaceOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
    )
})
.patch(async function(req, res){
    await Article.replaceOne(
        {title:req.params.articleTitle},
        {$set: req.body}
    )
})
.delete(async function(req, res){
    await Article.deleteOne(
        {title: req.params.articleTitle}
    )
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});