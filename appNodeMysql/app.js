
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql2024',
    database: 'crud_nodejs'
  });

  db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados MySQL!');
  });

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

  app.post('/cadastro', (req, res) => {
    const { usuario, email, telefone } = req.body;
    const sql = 'INSERT INTO cadastro (usuario,email,telefone) VALUES (?, ?, ?)';
    db.query(sql, [usuario,email,telefone], (err, result) => {
      if (err) throw err;
      res.send('Cadastro realizado com sucesso!');
    });
  });

  app.get('/lista', (req, res) => {
    const sql = 'SELECT * FROM cadastro';
    db.query(sql, (err, results) => {
      if (err) throw err;
  
      let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Lista de Pessoas</title>
        </head>
        <body>
          <h1>Lista de Pessoas</h1>
          <table id="myTable" border="1">
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Deletar</th>
            </tr>`;
  
      results.forEach(person => {
        html += `
          <tr>
            <td>${person.id}</td>
            <td>${person.usuario}</td>
            <td>${person.email}</td>
            <td>${person.telefone}</td>
            <td>
           <form action="/deletar" method="POST" style="display:inline;">
              <input type="hidden" name="id" value="${person.id}">
              <button type="submit">Deletar</button>
            </form>
            </td>
             <td>
                <a href="/editar/${person.id}">Editar</a>
            </td>
          </tr>`;
      });
  
      html += `
          </table>
        </body>
        </html>`;
      res.send(html);
    });
  });
  app.post('/deletar', (req, res) => {
    const { id } = req.body;
    const sql = 'DELETE FROM cadastro WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.send('Registro deletado com sucesso! <a href="/lista">Voltar à lista</a>');
    });
});
app.get('/editar/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM cadastro WHERE id = ?';
  db.query(sql, [id], (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
          res.send('Registro não encontrado! <a href="/lista">Voltar à lista</a>');
          return;
      }

      const person = result[0];
      let html = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Editar Pessoa</title>
          </head>
          <body>
              <h1>Editar Pessoa</h1>
              <form action="/atualizar" method="POST">
                  <input type="hidden" name="id" value="${person.id}">
                  <label for="usuario">Nome:</label><br>
                  <input type="text" id="usuario" name="usuario" value="${person.usuario}"><br>
                  <label for="email">Email:</label><br>
                  <input type="text" id="email" name="email" value="${person.email}"><br>
                  <label for="telefone">Telefone:</label><br>
                  <input type="text" id="telefone" name="telefone" value="${person.telefone}"><br><br>
                  <button type="submit">Atualizar</button>
              </form>
              <br>
              <a href="/lista">Cancelar</a>
          </body>
          </html>`;
      res.send(html);
  });
});

app.post('/atualizar', (req, res) => {
  const { id, usuario, email, telefone } = req.body;
  const sql = 'UPDATE cadastro SET usuario = ?, email = ?, telefone = ? WHERE id = ?';
  db.query(sql, [usuario, email, telefone, id], (err, result) => {
      if (err) throw err;
      res.send('Registro atualizado com sucesso! <a href="/lista">Voltar à lista</a>');
  });
});
  app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
  });
  