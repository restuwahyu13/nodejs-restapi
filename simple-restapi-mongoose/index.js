require('dotenv').config();
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
//init express
const app = express();
//global promise
mongoose.Promise = global.Promise;
//init schema
const Schema = mongoose.Schema;
//set schema
const setSchema = new Schema({

    name: {

        type: String,
        trim: true,
        required: true
    },

    age: {

        type: Number,
        trim: true,
        required: true
    }

});
//get schema
const getSchema = mongoose.model('praxis', setSchema);
//parsing data from form + encoded url
app.use(bodyParser.urlencoded({ extended: false }));
//parsing data json
app.use(bodyParser.json());
//http logger
app.use(logger('dev'));

//connect to database
mongoose.connect(process.env.MONGGO_URL, { useUnifiedTopology: true, useNewUrlParser: true }).then(() => {

    console.log('database is connected');

}).catch((err) => {

    console.log(`error ${err}`);

});

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

//listening port
app.listen(process.env.PORT, () => 'server is running');