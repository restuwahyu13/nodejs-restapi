### Simple CRUD REST API Express JS example Two with Mongoose

1.Berikut fungsi menampilkan semua data dengan mengunakan  `find` 

```javascript
//tampilkan semua data (SELECT * FROM peserta)
 app.get('/api', (req, res) => {

    getSchema.find({}, (err, result) => {

        //pesan jika server error
        res.status(500).json({ error: err });

        if (result) {

            //pesan jika data berhasil ditemukan
            res.status(200).json({

                request: {

                    code: res.statusCode,
                    method: req.method,
                    url: req.originalUrl
                },
                data: result
            });

        } else {

            //pesan jika data tidak ditemukan
            res.status(404).json({

                request: {

                    code: res.statusCode,
                    method: req.method,
                    url: req.originalUrl
                },
                pesan: 'data tidak ditemukan'
            });
        }


    });

});
```

2.Berikut fungsi menambah satu data dengan mengunakan  `insertOne` dan jika menambahkan lebih dari satu data bisa mengunakan `insertMany`,`save` atau `create` 

```javascript
//tambah data (INSERT INTO peserta(name, age) VALUES(name, age) )
app.post('/api', (req, res) => {

    //request data from postman / form
    const { name, age } = req.body;
    const data = new getSchema({

        name: name,
        age: age
    });

    //insert data to database
    data.save().then(() => {

        //pesan data berhasil ditambahkan
        res.status(200).json({

            request: {

                code: res.statusCode,
                method: req.method,
                url: req.originalUrl
            },
            pesan: 'data berhasil ditambahkan'
        });

    }).catch((err) => {

        //pesan jika server error
        if (err) res.status(500).json({ error: err });

    });
});
```

3.Berikut fungsi menampilkan satu data berdasarkan id, mengunakan `findById` atau juga bisa mengunakan `findOne`

```javascript
//tampilkan data berdasarkan id (SELECT * FROM peserta WHERE id = id)
app.get('/api/:id', (req, res) => {

    getSchema.findById({ _id: req.params.id }, (result) => {

        if (result) {

            //pesan jika data berhasil ditemukan
            res.status(200).json({

                request: {

                    code: res.statusCode,
                    method: req.method,
                    url: req.originalUrl
                },
                data: result
            });

        } else {

            //pesan jika data tidak ditemukan
            res.status(404).json({

                request: {

                    code: res.statusCode,
                    method: req.method,
                    url: req.originalUrl
                },
                pesan: 'data tidak ditemukan'
            });
        }


    });
});

```

4.Berikut fungsi menghapus satu data berdasarkan id, mengunakan `deleteOne`, `findByIdDelete` atau juga bisa mengunakan `deleteMany` jika ingin menghapus lebih dari satu data

```javascript
//hapus data berdasarkan id (DELETE FROM peserta WHERE id = id)
app.delete('/api/:id', (req, res) => {

    getSchema.findById({ _id: req.params.id }, (err, user) => {

        // //pesan jika server error
        if (err) res.status(500).json({ error: err });
        //jika user tidak di temukan didalam database
        if (!user) {

            //pesan jika data tidak ditemukan
            res.status(404).json({

                request: {

                    code: res.statusCode,
                    method: req.method,
                    url: req.originalUrl
                },
                pesan: 'data tidak ditemukan/sudah dihapus'
            });

        } else {

            getSchema.deleteOne({ _id: req.params.id }, (err) => {

                //pesan jika server error
                if (err) res.status(500).json({ error: err });

                //pesan jika data berhasil dihapus
                res.status(200).json({

                    request: {

                        code: res.statusCode,
                        method: req.method,
                        url: req.originalUrl
                    },
                    pesan: 'data berhasil dihapus'
                });
            });
        }

    });

});

```

5.Berikut fungsi memperbarui satu data berdasarkan id, mengunakan `updateOne`,'findByIdUpdate' atau juga bisa mengunakan `updateMany` jika ingin memperbarui lebih dari satu data

```javascript
//perbarui data berdasarkan id (UPDATE SET name=name, age=age WHERE id = id)
app.put('/api/:id', (req, res) => {


    getSchema.findOne({ _id: req.params.id }, (err, user) => {

        //pesan jika server error
        if (err) res.status(500).json({ error: err });
        //jika user tidak di temukan didalam database
        if (!user) {

            //pesan jika data tidak ditemukan
            res.status(404).json({

                request: {

                    code: res.statusCode,
                    method: req.method,
                    url: req.originalUrl
                },
                pesan: 'data tidak ditemukan/sudah dihapus'
            });

        } else {

            const { name, age } = req.body;

            getSchema.updateOne({ _id: req.params.id }, (err) => {

                //pesan jika server error
                if (err) res.status(500).json({ error: err });

                //pesan jika data berhasil diperbarui
                res.status(200).json({

                    request: {

                        code: res.statusCode,
                        method: req.method,
                        url: req.originalUrl
                    },
                    pesan: 'data berhasil diperbarui'
                });

            });
        }

    });

});
```