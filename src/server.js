const express = require("express")
const server = express()

//Pegando o banco de dados
const db = require("./database/db")

//Configurar pasta publica
server.use(express.static("public"))

//Habilitando o uso do req.body
server.use(express.urlencoded({extended: true}))

//ultilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views",{
    express: server,
    noCache: true
})

//Configurar caminhos da minha aplicação
//Página inicial
// req = requisição - res = resposta
server.get("/",(req, res) =>{
    return res.render("index.html")
})

server.get("/create-point",(req, res) =>{
    //req.query: São as query strings da url
    console.log(req.query)

    //renderizando a página
    return res.render("create-point.html")
})

server.post("/savepoint",(req,res)=>{
    //console.log(req.body)
    
    //inserir dados no banco de dados
    const query = `
        INSERT INTO places (
            image,
            name,
            adress,
            adress2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);`

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err){
        if(err){
             console.log(err)
            return res.send("Erro no cadasto!")
        }
        console.log("Cadastrado efetuado com sucesso")
        console.log(this)
        return res.render("create-point.html", {saved: true})
    }

    db.run(query, values, afterInsertData)
})


server.get("/search",(req, res) =>{

    const search = req.query.search

    if(search == ""){
        return res.render("search-results.html",{total:0})
    }


    //pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`,function(err, rows){
        if(err){
            return console.log(err)
        }

        const total = rows.length
        //Mostrar a página html com os dados do banco de dados.
        return res.render("search-results.html",{places: rows, total})
    })
    

    
})


//Ligar o servidor

server.listen(3000)