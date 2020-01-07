### Simple CRUD REST API Express JS example One with MongoDB

1.Berikut fungsi menampilkan semua data dengan mengunakan  `find` 

```javascript
//tampilkan semua data (SELECT * FROM peserta)
    app.get('/api', (req, res) => {

        tableSchema.find({}).toArray((err, result) => {

            //pesan jika server error
            if (err) res.status(500).json({ error: err });

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

2.Berikut fungsi menambah satu data dengan mengunakan  `insertOne` dan jika menambahkan lebih dari satu data bisa mengunakan `insertMany` 

```javascriot

  //tambah data (INSERT INTO peserta(name, age) VALUES(name, age) )
    app.post('/api', (req, res) => {

        //request data from postman / form
        const { name, age } = req.body;
        const data = { name: name, age: age }

        //insert data to database
        tableSchema.insertOne(data, (err) => {

            //pesan jika server error
            if (err) res.status(500).json({ error: err });

            //pesan data berhasil ditambahkan
            res.status(200).json({

                request: {

                    code: res.statusCode,
                    method: req.method,
                    url: req.originalUrl
                },
                pesan: 'data berhasil ditambahkan'
            });
        });

    });

```

3.Berikut fungsi menampilkan satu data berdasarkan id, mengunakan `find` atau juga bisa mengunakan `findOne`

```javascript

    //tampilkan data berdasarkan id (SELECT * FROM peserta WHERE id = id)
    app.get('/api/:id', (req, res) => {

        tableSchema.find({ _id: new ObjectId(req.params.id) }).forEach((value, index) => {

            if (value) {

                //pesan jika data berhasil ditemukan
                res.status(200).json({

                    request: {

                        code: res.statusCode,
                        method: req.method,
                        url: req.originalUrl
                    },
                    data: value
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

4.Berikut fungsi menghapus satu data berdasarkan id, mengunakan `deleteOne` atau juga bisa mengunakan `deleteMany` jika ingin menghapus lebih dari satu data

```javascript

    //hapus data berdasarkan id (DELETE FROM peserta WHERE id = id)
    app.delete('/api/:id', (req, res) => {

        tableSchema.findOne({ _id: new ObjectId(req.params.id) }, (err, user) => {

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

                tableSchema.deleteOne({ _id: new ObjectId(req.params.id) }, (err) => {

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

5.Berikut fungsi memperbarui satu data berdasarkan id, mengunakan `updateOne` atau juga bisa mengunakan `updateMany` jika ingin memperbarui lebih dari satu data

```javascript

    //perbarui data berdasarkan id (UPDATE SET name=name, age=age WHERE id = id)
    app.put('/api/:id', (req, res) => {


        tableSchema.findOne({ _id: new ObjectId(req.params.id) }, (err, user) => {

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

                tableSchema.updateOne({ _id: new ObjectId(req.params.id) }, { $set: { name: name, age: age } }, (err) => {

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