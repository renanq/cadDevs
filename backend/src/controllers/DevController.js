const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
    async index(request, response){
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response){
        const { github_username, techs, latitude, longitude } = request.body;

        //verifica se ja existe o registro no banco
        let dev = await Dev.findOne({ github_username });

        if (!dev){
            //chama api do GitHub para buscar dados
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

            const { name = login, avatar_url, bio } = apiResponse.data;
            
            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            })

            //filtrar as conexões que estão dentro do raio
            //e que o novo dev tenha uma das techs
            const sendSocketMessageTo = findConnections(
                { latitude, longitude }, 
                techsArray,
            )

            sendMessage(sendSocketMessageTo, 'newDev', dev);
        }

        return response.json(dev);
    }
}