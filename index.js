
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const helmet = require('helmet')
const app = express()
app.use(express.urlencoded());
app.use(express.json())
app.use(cors())
app.use(helmet())
dotenv.config()




const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2021-08-01',
    authenticator: new IamAuthenticator({
        apikey: process.env.API_KEY,
    }),
    serviceUrl: process.env.SERVICE_URL,
});

app.get('/', (req, res) => {
    res.status(200).send('Bienvenid@ a WATSON IBM natural-language-understanding API backend')
})


///watson/texto
app.get('/watson/:texto', (req, res) => {
    const text = req.params.texto
   // console.log(text)
    const analyzeParams = {
        //'url': 'www.ibm.com',
        'text': text,
        'language': 'es',
        'features': {
            'categories': {
                'limit': 3
            },
            'entities': {
                'emotion': true,
                'sentiment': true,
                'limit': 3,
            },
            'keywords': {
                'emotion': true,
                'sentiment': true,
                'limit': 3,
            },
        }
    };

    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            //console.log(JSON.stringify(analysisResults, null, 2));
            res.status(200).json(analysisResults)
        })
        .catch(err => {
            res.status(400).send('error:', err)
            //console.log('error:', err);
        });

})


const run = async () => {
    await app.listen(process.env.PORT || 3000)
    console.log('Server starter')
}

run().catch(error => console.log('Error to start:' + error))
