require('dotenv').config();
const mongodb = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
//init express
const app = express();
//init object id
const ObjectId = mongodb.ObjectId;

//parsing data from form + encoded url
app.use(bodyParser.urlencoded({ extended: false }));
//parsing data json
app.use(bodyParser.json());
//http logger
app.use(logger('dev'));

//connect to database
mongodb.connect(process.env.MONGGO_URL, { useUnifiedTopology: true, noDelay: true }, (err, db) => {

    //pesan jika server error
    if (err) throw err;

    //database name
    const dbSchema = db.db('praxis');
    //table name
    const tableSchema = dbSchema.collection('peserta');


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


}); //end mongodb connect


//listening port
app.listen(process.env.PORT, () => 'server is running');