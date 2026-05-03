const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory book storage
let books = [
    { book_id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", year: 1925 },
    { book_id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960 },
    { book_id: 3, title: "1984", author: "George Orwell", year: 1949 }
];
let nextId = 4;

// API Routes
app.get('/api/books', (req, res) => {
    res.json(books);
});

app.post('/api/books', (req, res) => {
    const book = {
        book_id: nextId++,
        title: req.body.title,
        author: req.body.author,
        year: req.body.year
    };
    books.push(book);
    res.json({ message: 'Book added successfully', book });
});

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Library Management - Node.js</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
        .main-card { background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); max-width: 800px; margin: 0 auto; }
        .card-header-custom { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 15px 15px 0 0; }
    </style>
</head>
<body>
    <div class="main-card">
        <div class="card-header-custom">
            <h3 class="mb-1">📚 Library Management System</h3>
            <p class="mb-0">Add and View Books</p>
        </div>
        
        <div class="card-body">
            <div class="mb-4">
                <h5>Add New Book</h5>
                <form id="bookForm">
                    <div class="row">
                        <div class="col-md-3 mb-2"><input type="text" id="title" class="form-control" placeholder="Title" required></div>
                        <div class="col-md-4 mb-2"><input type="text" id="author" class="form-control" placeholder="Author" required></div>
                        <div class="col-md-3 mb-2"><input type="number" id="year" class="form-control" placeholder="Year" required></div>
                        <div class="col-md-2 mb-2"><button type="submit" class="btn btn-primary w-100">Add Book</button></div>
                    </div>
                </form>
            </div>
            
            <h5>Available Books</h5>
            <table class="table table-hover">
                <thead class="table-dark">
                    <tr><th>ID</th><th>Title</th><th>Author</th><th>Year</th></tr>
                </thead>
                <tbody id="bookList"></tbody>
            </table>
        </div>
    </div>
    
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function loadBooks() {
            fetch('/api/books')
                .then(res => res.json())
                .then(data => {
                    let html = '';
                    data.forEach(book => {
                        html += '<tr><td>' + book.book_id + '</td><td>' + book.title + '</td><td>' + book.author + '</td><td>' + book.year + '</td></tr>';
                    });
                    $('#bookList').html(html || '<tr><td colspan="4" class="text-center">No books available</td></tr>');
                });
        }
        
        $('#bookForm').submit(function(e) {
            e.preventDefault();
            fetch('/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: $('#title').val(),
                    author: $('#author').val(),
                    year: $('#year').val()
                })
            }).then(() => {
                $('#bookForm')[0].reset();
                loadBooks();
            });
        });
        
        $(document).ready(loadBooks);
    </script>
</body>
</html>
    `);
});

app.listen(PORT, () => console.log(`Library Server: http://localhost:${PORT}`));